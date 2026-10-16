// Automation scene: a document travels a belt, is read by an extraction gate (Prompt Studio), becomes rows in a
// Data Table slab, and lands on a dashboard tile with deploy / run / monitor lights.
//   buildPipeline({ mode: 'hero' | 'track' }) -> build function for createStage()
// track: state.progress (0..1) moves the camera along the belt, holding at each of three stations.
import { THREE, mat, palette, slab } from './stage.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v) => { v = clamp(v); return v * v * (3 - 2 * v); };
const lerp = (a, b, t) => a + (b - a) * t;
const F = 'Geist, system-ui, -apple-system, "Segoe UI", sans-serif';

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  const paint = () => { g.clearRect(0, 0, w, h); draw(g, w, h); };
  paint();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  document.fonts?.ready.then(() => { paint(); t.needsUpdate = true; });
  return t;
}
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

const tableTex = () => canvasTex(640, 400, (g, w, h) => {
  g.fillStyle = '#fff'; rr(g, 0, 0, w, h, 26); g.fill();
  g.fillStyle = '#0e1020'; g.font = `600 30px ${F}`; g.textBaseline = 'middle'; g.fillText('Contract terms', 28, 40);
  g.fillStyle = '#eeedff'; rr(g, w - 170, 20, 142, 40, 20); g.fill();
  g.fillStyle = '#4f46e5'; g.font = `600 20px ${F}`; g.fillText('Data table', w - 152, 41);
  const cols = [28, 230, 360, 500];
  g.fillStyle = '#6b7088'; g.font = `500 20px ${F}`;
  ['Vendor', 'Term', 'Renewal', 'Notice'].forEach((c, i) => g.fillText(c, cols[i], 98));
  const rows = [['Northwind Ltd', '24 months', 'Auto', '60 days'], ['Halden Supply', '12 months', 'Manual', '30 days'], ['Brightpath', '36 months', 'Auto', '90 days'], ['Orchard & Co', '12 months', 'Auto', '45 days']];
  rows.forEach((r, i) => {
    const y = 120 + i * 62;
    g.fillStyle = '#e3e5ee'; g.fillRect(20, y, w - 40, 2);
    g.fillStyle = '#0e1020'; g.font = `500 22px ${F}`;
    r.forEach((v, j) => { g.fillStyle = j ? '#3a3e55' : '#0e1020'; g.fillText(v, cols[j], y + 34); });
  });
});

const dashTex = () => canvasTex(640, 440, (g, w, h) => {
  g.fillStyle = '#fff'; rr(g, 0, 0, w, h, 30); g.fill();
  g.fillStyle = '#0e1020'; g.font = `600 30px ${F}`; g.textBaseline = 'middle'; g.fillText('Vendor performance', 32, 48);
  [['Open items', '128'], ['Committed', '$4.2M'], ['On track', '94%']].forEach((k, i) => {
    const x = 32 + i * 196;
    g.fillStyle = '#f4f5f9'; rr(g, x, 90, 178, 84, 14); g.fill();
    g.fillStyle = '#6b7088'; g.font = `500 18px ${F}`; g.fillText(k[0], x + 16, 116);
    g.fillStyle = '#0e1020'; g.font = `700 32px ${F}`; g.fillText(k[1], x + 16, 150);
  });
  const bars = [0.38, 0.5, 0.45, 0.68, 0.62, 0.88, 0.8, 0.95];
  bars.forEach((b, i) => { g.fillStyle = i >= 5 ? '#4f46e5' : '#d9d8fb'; rr(g, 36 + i * 72, h - 40 - 170 * b, 46, 170 * b, 9); g.fill(); });
});

const docTex = () => canvasTex(256, 330, (g, w, h) => {
  g.fillStyle = '#fff'; rr(g, 0, 0, w, h, 20); g.fill();
  g.fillStyle = '#4f46e5'; g.fillRect(28, 34, 90, 12);
  g.fillStyle = '#d6d9ea';
  [70, 96, 122, 148, 196, 222, 248].forEach((y, i) => g.fillRect(28, y, i === 3 || i === 6 ? 120 : 200, 8));
  g.fillStyle = '#fff'; g.strokeStyle = '#e3e5ee'; g.lineWidth = 4; rr(g, 28, 270, 80, 30, 8); g.stroke();
});

const labelTex = (text, sub, w = 512, h = 128, dark = false) => canvasTex(w, h, (g) => {
  g.fillStyle = dark ? '#0e1020' : '#3a3e55'; g.font = `600 44px ${F}`; g.textBaseline = 'middle';
  g.fillText(text, 8, h * 0.4);
  if (sub) { g.fillStyle = '#6b7088'; g.font = `500 30px ${F}`; g.fillText(sub, 8, h * 0.78); }
});

const beltTex = () => canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#d3d7ea'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#c4c9e0'; g.fillRect(0, 0, 8, h);
}, true);

const flat = (geo, map) => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map, transparent: true, toneMapped: false })); m.rotation.x = -Math.PI / 2; return m; };

const X0 = -7, X1 = 5.9, CYCLE = 13, N = 4;
const GATE = -2.6, TABLE = 1.9, DASH = 6.5;
const STATIONS = [GATE + 0.2, TABLE, 6.0];

export function buildPipeline({ mode = 'hero' } = {}) {
  return (api) => {
    const { camera, root, pointer, state, reduced, key, gsap = window.gsap } = api;
    state.stage = 0;
    key.position.set(2.5, 9, 4.5);
    const sc = key.shadow.camera; sc.left = -11; sc.right = 11; sc.top = 8; sc.bottom = -8; sc.far = 30; sc.updateProjectionMatrix();
    key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 8;

    const intro = { p: 1, zoom: 1 };
    api.play = () => { if (!reduced && !intro.played) { intro.played = true; if (gsap) { intro.zoom = 1.07; gsap.to(intro, { zoom: 1, duration: 2.2, ease: 'power3.out' }); } } };

    const world = new THREE.Group(); root.add(world);

    // platform + belt
    const plat = slab(17.2, 4.6, 0.3, 0.3, mat.clay('#ffffff')); plat.rotation.x = -Math.PI / 2; plat.position.y = -0.17; world.add(plat);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.16 })); fl.rotation.x = -Math.PI / 2; fl.position.y = -0.34; fl.receiveShadow = true; world.add(fl);
    const bTex = beltTex(); bTex.repeat.set(30, 1);
    const belt = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.06, 1.25), [0, 1, 2, 3, 4, 5].map(() => new THREE.MeshStandardMaterial({ map: bTex, roughness: 0.8 })));
    belt.position.set(-0.45, 0.03, 0); belt.receiveShadow = true; world.add(belt);
    [-0.7, 0.7].forEach((z) => { const r = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.1, 0.07), mat.matte('#ffffff')); r.position.set(-0.45, 0.07, z); r.castShadow = r.receiveShadow = true; world.add(r); });

    // floor labels
    const labels = [['Upload', 'PDF, Word, Excel', -6.1], ['Extract', 'Prompt Studio template', GATE], ['Data table', 'Structured records', TABLE], ['Dashboard', 'Deploy, run, monitor', 6.0]];
    const labelMeshes = labels.map(([a, b, x]) => {
      const m = flat(new THREE.PlaneGeometry(2.6, 0.65), labelTex(a, b));
      m.position.set(x + 0.55, 0.01, 1.62); world.add(m); return m;
    });
    // station group registries for the intro rise
    const st = [];

    // intake tray
    const tray = slab(1.4, 1.5, 0.08, 0.1, mat.clay('#ffffff')); tray.rotation.x = -Math.PI / 2; tray.position.set(-6.5, 0.1, 0); world.add(tray); st.push(tray);

    // gate (Prompt Studio): arch straddling the belt
    const gateMat = mat.gloss(palette.brand, { emissive: '#4f46e5', emissiveIntensity: 0 });
    const gate = new THREE.Group(); gate.position.x = GATE; world.add(gate); st.push(gate);
    [-0.95, 0.95].forEach((z) => { const p = slab(0.34, 1.9, 0.34, 0.08, gateMat); p.rotation.x = 0; p.position.set(0, 0.95, z); gate.add(p); });
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 2.4), gateMat); top.position.y = 1.9; top.castShadow = true; gate.add(top);
    const scan = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.5), new THREE.MeshBasicMaterial({ color: '#7b72ff', transparent: true, opacity: 0.16, side: THREE.DoubleSide }));
    scan.rotation.y = Math.PI / 2; scan.position.y = 0.9; gate.add(scan);
    const gateTag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.38), new THREE.MeshBasicMaterial({ map: canvasTex(384, 96, (g) => { g.fillStyle = '#fff'; rr(g, 0, 0, 384, 96, 48); g.fill(); g.fillStyle = '#4f46e5'; g.font = `600 36px ${F}`; g.textBaseline = 'middle'; g.fillText('Prompt Studio', 32, 50); }), transparent: true }));
    gateTag.position.set(0, 2.45, 0.2); gate.add(gateTag);

    // data table slab
    const tableMat = mat.clay('#ffffff', { emissive: '#4f46e5', emissiveIntensity: 0 });
    const table = new THREE.Group(); table.position.set(TABLE, 0.14, 0); world.add(table); st.push(table);
    const tBody = slab(3.3, 2.1, 0.14, 0.12, tableMat); tBody.rotation.x = -Math.PI / 2; table.add(tBody);
    const tFace = flat(new THREE.PlaneGeometry(3.24, 2.04), tableTex()); tFace.position.y = 0.096; table.add(tFace);
    const hl = [0, 1, 2, 3].map((i) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.31), new THREE.MeshBasicMaterial({ color: '#4f46e5', transparent: true, opacity: 0, depthWrite: false }));
      m.rotation.x = -Math.PI / 2; m.position.set(0, 0.1, -2.04 / 2 + (120 + i * 62 + 31) / 400 * 2.04); table.add(m); return m;
    });

    // dashboard: base + upright tile + status lights
    const dash = new THREE.Group(); dash.position.set(DASH, 0, -0.1); world.add(dash); st.push(dash);
    const base = slab(2.8, 1.3, 0.5, 0.1, mat.clay('#ffffff')); base.rotation.x = -Math.PI / 2; base.position.set(0, 0.2, 0); dash.add(base);
    const dMat = mat.clay('#ffffff', { emissive: '#4f46e5', emissiveIntensity: 0 });
    const tile = slab(2.7, 1.86, 0.12, 0.14, dMat); tile.position.set(0, 1.55, -0.35); tile.rotation.x = -0.1; dash.add(tile);
    const dFace = new THREE.Mesh(new THREE.PlaneGeometry(2.66, 1.82), new THREE.MeshBasicMaterial({ map: dashTex(), transparent: true, toneMapped: false }));
    dFace.position.z = 0.095; tile.add(dFace);
    const lightCols = ['#4f46e5', '#10b981', '#ff5c00'];
    const lights = lightCols.map((c, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 14), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.2, roughness: 0.3 }));
      m.position.set(-0.55 + i * 0.55, 0.52, 0.5); dash.add(m); return m;
    });

    // items on the belt
    const dTex = docTex();
    const items = Array.from({ length: N }, (_, i) => {
      const g = new THREE.Group(); world.add(g);
      const doc = new THREE.Group(); g.add(doc);
      const db = slab(0.74, 0.96, 0.05, 0.06, mat.matte('#ffffff')); db.rotation.x = -Math.PI / 2; doc.add(db);
      const df = flat(new THREE.PlaneGeometry(0.72, 0.94), dTex); df.position.y = 0.045; doc.add(df);
      const rows = new THREE.Group(); g.add(rows);
      [0, 1, 2].forEach((k) => { const r = slab(0.9, 0.1, 0.07, 0.04, mat.matte(k === 0 ? '#4f46e5' : '#cfcdf7')); r.rotation.x = -Math.PI / 2; r.position.set(0, 0.05, (k - 1) * 0.22); rows.add(r); });
      const chip = slab(0.36, 0.36, 0.3, 0.1, mat.gloss(palette.brand)); chip.rotation.x = -Math.PI / 2; chip.position.y = 0.2; g.add(chip);
      g.userData = { doc, rows, chip };
      return g;
    });

    // camera
    const overview = mode === 'hero' || reduced;
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let aspect = 1, dist = 14;
    const wayCam = new THREE.Vector3(), wayLook = new THREE.Vector3();
    const camBase = new THREE.Vector3();
    const fit = (w, h) => {
      aspect = w / h;
      if (overview) {
        const narrow = aspect < 1.25;
        root.rotation.y = narrow ? -0.62 : -0.3;
        const need = narrow ? 6.4 : 8.2;
        dist = Math.max(need / (tv * aspect), 4.4 / tv * (narrow ? 1.35 : 1));
        camBase.set(0, dist * 0.52, dist * 0.85); camera.position.copy(camBase).multiplyScalar(intro.zoom); camera.lookAt(0, 0.4, 0);
      }
    };

    const itemPhase = (i, t) => (((t / CYCLE) + i / N) % 1 + 1) % 1;

    function stagePos(p) {
      // hold on each station, glide between them
      const s = clamp(p) * 3; const i = Math.min(Math.floor(s), 2); const f = s - i;
      return i + (i < 2 ? smooth((f - 0.62) / 0.38) : 0);
    }

    function update(t) {
      const I = intro.p;
      const rise = (k) => smooth((I - k * 0.12) / 0.32);
      st.forEach((o, k) => { const r = rise(k); o.scale.y = 0.001 + r; o.visible = r > 0.01; });
      labelMeshes.forEach((m, k) => { m.material.opacity = rise(k + 1); });
      const flow = smooth((I - 0.55) / 0.4);

      // items
      let arrive = 0; hl.forEach((m) => { m.material.opacity = 0; });
      items.forEach((g, i) => {
        const ph = itemPhase(i, t);
        const x = X0 + (X1 - X0) * ph;
        g.position.set(x, 0.07, 0); g.scale.setScalar(1.35);
        const { doc, rows, chip } = g.userData;
        const sink = smooth((x - 1.1) / 0.9);
        const emerge = smooth((x - 2.9) / 0.5);
        const sinkD = smooth((x - 5.2) / 0.7);
        doc.visible = x < GATE + 0.05;
        doc.scale.setScalar(flow);
        rows.visible = x >= GATE + 0.05 && x < TABLE + 0.2;
        rows.scale.set(1, 1 - sink, 1 - sink * 0.2);
        rows.position.y = 0.0 - sink * 0.05;
        chip.visible = x > 2.7;
        chip.scale.setScalar(Math.max(0.001, emerge * (1 - sinkD) * flow));
        chip.position.y = 0.2 - sinkD * 0.3;
        g.visible = flow > 0.01;
        // gate scan pulse and table highlight
        if (Math.abs(x - GATE) < 1.1) arrive = Math.max(arrive, 1 - Math.abs(x - GATE) / 1.1);
        const cyc = Math.floor((t / CYCLE) + i / N);
        const hlK = smooth((ph - 0.64) / 0.04) * (1 - smooth((ph - 0.78) / 0.1));
        hl.forEach((m, k) => { if (k === (((cyc % 4) + 4) % 4)) m.material.opacity = Math.max(m.material.opacity, hlK * 0.22); });
      });
      // reset highlight bars not driven this frame (all items write only their own row; decay others)
      scan.material.opacity = 0.1 + 0.2 * arrive;

      // belt
      if (!reduced) bTex.offset.x = -(t * (X1 - X0) / CYCLE) / 0.493;
      // which station is active
      let act = mode === 'track' ? state.progress * 3 : -1;
      const a0 = clamp(Math.floor(act), 0, 2);
      const em = (i) => (mode === 'track' ? (a0 === i ? 0.32 + (reduced ? 0 : Math.sin(t * 2.2) * 0.06) : 0) : 0);
      gateMat.emissiveIntensity = em(0) * 1.2; tableMat.emissiveIntensity = em(1) * 0.7; dMat.emissiveIntensity = em(2) * 0.7;
      // status lights cycle deploy -> run -> monitor
      lights.forEach((l, i) => {
        const on = reduced ? 1 : 0.35 + 0.65 * smooth(1 - Math.abs((((t * 0.6) % 3) - i + 4.5) % 3 - 1.5) * 1.2) + 0.0;
        l.material.emissiveIntensity = 0.3 + 2.2 * on * flow * (mode === 'track' && a0 === 2 ? 1 : 0.8);
      });

      // camera / parallax
      if (overview) {
        camera.position.copy(camBase).multiplyScalar(intro.zoom); camera.lookAt(0, 0.4, 0);
        world.rotation.y = pointer.x * 0.08; world.rotation.x = -pointer.y * 0.03;
      } else {
        const f = reduced ? 0 : stagePos(state.progress);
        const i0 = Math.floor(f), i1 = Math.min(i0 + 1, 2), fr = f - i0;
        const sx = lerp(STATIONS[i0], STATIONS[i1], fr);
        const cd = Math.max(9.6, 2.8 / (tv * aspect) + 1);
        wayLook.set(sx + 0.1, 0.85, 0);
        wayCam.set(sx - 0.55 * cd * 0.28 + pointer.x * 0.5, cd * 0.45 + pointer.y * 0.3, cd * 0.84);
        camera.position.copy(wayCam); camera.lookAt(wayLook);
      }
      state.stage = Math.round(clamp(state.progress) * 2);
    }
    update(reduced ? CYCLE * 0.02 : 0);
    return { update, resize: fit };
  };
}








