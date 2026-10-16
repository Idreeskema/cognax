// Connections scene: one glossy hub, one source slab, three outputs, cables with travelling light pulses.
//   buildConnections({ mode: 'hero' | 'scroll' }) -> build function for createStage()
// hero: outputs take turns lighting up on their own. scroll: state.lit[i] (0..1) is driven from outside.
import { THREE, mat, palette, slab } from './stage.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v) => { v = clamp(v); return v * v * (3 - 2 * v); };
const F = 'Geist, system-ui, -apple-system, "Segoe UI", sans-serif';

// canvas texture that redraws once the web font has loaded
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const paint = () => { g.clearRect(0, 0, w, h); draw(g, w, h); };
  paint();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  document.fonts?.ready.then(() => { paint(); t.needsUpdate = true; });
  return t;
}
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
function face(w, h, r, draw) {
  const px = 300;
  return canvasTex(Math.round(w * px), Math.round(h * px), (g, cw, ch) => {
    rr(g, 0, 0, cw, ch, r * px); g.clip();
    g.fillStyle = '#fff'; g.fillRect(0, 0, cw, ch);
    draw(g, cw, ch);
  });
}

// ---- faces ----
const sheetFace = (w, h) => face(w, h, 0.1, (g, cw, ch) => {
  g.fillStyle = '#f6f3ee'; g.fillRect(0, 0, cw, 70);
  g.fillStyle = '#0f8a5f'; rr(g, 24, 20, 32, 32, 8); g.fill();
  g.fillStyle = '#fff'; g.font = `700 22px ${F}`; g.textBaseline = 'middle'; g.fillText('X', 33, 37);
  g.fillStyle = '#1a1714'; g.font = `600 26px ${F}`; g.fillText('Sales forecast.xlsx', 72, 37);
  const cols = ['', 'Region', 'Q1', 'Q2', 'Q3'];
  const cx = [0, 52, 232, 322, 412, 510]; // last is right edge-ish
  const top = 70, rh = 52;
  g.font = `500 20px ${F}`;
  g.fillStyle = '#6b7088';
  cols.forEach((c, i) => g.fillText(c, cx[i] + 14, top + 28));
  const rows = [['North', '412', '438', '471'], ['South', '388', '402', '395'], ['East', '501', '519', '560'], ['West', '276', '301', '338'], ['Central', '344', '351', '372'], ['Export', '198', '223', '260']];
  rows.forEach((r, i) => {
    const y = top + rh * (i + 1);
    g.fillStyle = '#e9e5de'; g.fillRect(0, y, cw, 2);
    g.fillStyle = '#aeaaa4'; g.font = `500 18px ${F}`; g.fillText(String(i + 1), 18, y + 28);
    g.fillStyle = '#1a1714'; g.font = `500 22px ${F}`; g.fillText(r[0], cx[1] + 14, y + 28);
    g.fillStyle = '#4c4843'; r.slice(1).forEach((v, j) => g.fillText(v, cx[j + 2] + 14, y + 28));
  });
  g.fillStyle = 'rgba(255,74,28,.08)'; g.fillRect(cx[3], top, cx[4] - cx[3], rh * 7);
  g.strokeStyle = '#ff4a1c'; g.lineWidth = 3; g.strokeRect(cx[3] + 1.5, top + rh * 3 + 1.5, cx[4] - cx[3] - 3, rh - 3);
  // status chip
  const y = ch - 78;
  g.fillStyle = '#e2f6ee'; rr(g, 24, y, 150, 48, 24); g.fill();
  g.fillStyle = '#0f8a5f'; g.beginPath(); g.arc(52, y + 24, 8, 0, 7); g.fill();
  g.font = `600 24px ${F}`; g.fillText('Ready', 72, y + 25);
  g.fillStyle = '#6b7088'; g.font = `500 20px ${F}`; g.fillText('Excel  ·  finance', 192, y + 25);
});

const dashFace = (w, h) => face(w, h, 0.1, (g, cw, ch) => {
  g.fillStyle = '#1a1714'; g.font = `600 26px ${F}`; g.textBaseline = 'middle'; g.fillText('Operations review', 28, 40);
  g.fillStyle = '#6b7088'; g.font = `500 18px ${F}`; g.fillText('Report', cw - 90, 40);
  const bars = [0.38, 0.52, 0.46, 0.7, 0.64, 0.88, 0.78];
  const base = ch - 36, bw = 44, gap = 20, x0 = 34, mh = ch - 150;
  bars.forEach((b, i) => {
    g.fillStyle = i === 5 ? '#ff4a1c' : '#fbe0d8';
    rr(g, x0 + i * (bw + gap), base - mh * b, bw, mh * b, 8); g.fill();
  });
  g.fillStyle = '#e9e5de'; g.fillRect(28, base + 2, cw - 56, 2);
  g.fillStyle = '#1a1714'; g.font = `700 40px ${F}`; g.fillText('$4.2M', 28, 96);
  g.fillStyle = '#0f8a5f'; g.font = `600 20px ${F}`; g.fillText('+12%', 170, 98);
});

const slideFace = (w, h) => face(w, h, 0.1, (g, cw, ch) => {
  g.fillStyle = '#6b7088'; g.font = `600 20px ${F}`; g.textBaseline = 'middle'; g.fillText('Quarterly review', 32, 44);
  g.fillStyle = '#1a1714'; g.font = `600 44px ${F}`;
  g.fillText('Revenue grew', 32, 122); g.fillText('in every region', 32, 176);
  g.fillStyle = '#ff4a1c'; g.fillRect(32, ch - 96, 56, 6);
  const pts = [0.3, 0.45, 0.4, 0.6, 0.72, 0.9];
  g.strokeStyle = '#ff4a1c'; g.lineWidth = 5; g.lineJoin = 'round'; g.beginPath();
  pts.forEach((p, i) => { const x = cw - 250 + i * 44, y = ch - 40 - p * 90; i ? g.lineTo(x, y) : g.moveTo(x, y); });
  g.stroke();
});

const nodeFace = (s) => face(s, s, 0.2, (g, cw, ch) => {
  g.fillStyle = '#fff0ea'; g.fillRect(0, 0, cw, ch);
  const a = [cw * 0.28, ch * 0.34], b = [cw * 0.72, ch * 0.66];
  g.strokeStyle = '#ff4a1c'; g.lineWidth = 7; g.lineCap = 'round';
  g.beginPath(); g.moveTo(a[0] + 26, a[1]); g.bezierCurveTo(cw * 0.6, a[1], cw * 0.4, b[1], b[0] - 26, b[1]); g.stroke();
  [a, b].forEach((p, i) => { g.fillStyle = i ? '#ff4a1c' : '#fff'; g.strokeStyle = '#ff4a1c'; g.lineWidth = 7; g.beginPath(); g.arc(p[0], p[1], 26, 0, 7); g.fill(); g.stroke(); });
  g.fillStyle = '#1a1714'; g.font = `600 ${cw * 0.085}px ${F}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('Automation', cw / 2, ch * 0.88);
});

const markFace = () => canvasTex(256, 256, (g) => {
  g.fillStyle = '#fff'; g.lineJoin = 'round'; g.strokeStyle = '#fff'; g.lineWidth = 34;
  g.beginPath(); g.moveTo(128, 60); g.lineTo(196, 182); g.lineTo(60, 182); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#1b1a18'; g.beginPath(); g.arc(128, 150, 17, 0, 7); g.fill();
});

export function buildConnections({ mode = 'hero' } = {}) {
  return (api) => {
    const { scene, camera, root, pointer, state, reduced, key, gsap = window.gsap } = api;
    state.lit = [0, 0, 0];
    key.shadow.camera.left = -7; key.shadow.camera.right = 7; key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
    key.shadow.camera.updateProjectionMatrix();

    const intro = { p: reduced ? 1 : 0 };
    api.play = () => { if (!reduced && !intro.played) { intro.played = true; gsap ? gsap.to(intro, { p: 1, duration: 2.6, ease: 'none', delay: 0.15 }) : (intro.p = 1); } };

    const world = new THREE.Group(); root.add(world);
    const floatG = new THREE.Group(); world.add(floatG);

    // soft contact shadow plane
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2.5; key.position.set(1.2, 9, 3.5); key.shadow.radius = 10; floor.receiveShadow = true; world.add(floor);

    // hub
    const hub = new THREE.Group(); floatG.add(hub);
    const hubMesh = new THREE.Mesh(new RoundedBoxGeometry(1.6, 1.6, 1.6, 6, 0.36), mat.gloss(palette.brand, { roughness: 0.2 }));
    hubMesh.castShadow = true; hub.add(hubMesh);
    const mark = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshStandardMaterial({ map: markFace(), transparent: true, roughness: 0.4 }));
    mark.position.z = 0.805; hub.add(mark);
    [-1, 1].forEach((s) => { const p = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 10, 28), mat.metal('#eae6e2')); p.rotation.y = Math.PI / 2; p.position.x = s * 0.805; hub.add(p); });

    // peripherals
    const defs = [
      { name: 'source', w: 1.7, h: 2.15, pos: [-2.95, 0.05, 0.1], rot: 0.32, out: -1, tex: sheetFace(1.7, 2.15) },
      { name: 'dash', w: 1.9, h: 1.2, pos: [3.15, 1.6, -0.25], rot: -0.3, out: 1, tex: dashFace(1.9, 1.2) },
      { name: 'slide', w: 1.9, h: 1.15, pos: [3.25, -0.05, 0.25], rot: -0.3, out: 1, tex: slideFace(1.9, 1.15) },
      { name: 'auto', w: 1.15, h: 1.15, pos: [2.95, -1.65, 0.1], rot: -0.3, out: 1, tex: nodeFace(1.15) },
    ];
    const per = defs.map((d, i) => {
      const g = new THREE.Group(); floatG.add(g);
      const bodyMat = mat.clay('#ffffff', { emissive: '#ff4a1c', emissiveIntensity: 0 });
      const body = slab(d.w, d.h, 0.12, 0.1, bodyMat); g.add(body);
      const fm = new THREE.MeshBasicMaterial({ map: d.tex, transparent: true, alphaTest: 0.4, toneMapped: false });
      const f = new THREE.Mesh(new THREE.PlaneGeometry(d.w - 0.02, d.h - 0.02), fm); f.position.z = 0.081; g.add(f);
      const cf = f.clone(); cf.rotation.y = Math.PI; cf.position.z = -0.081; cf.material = new THREE.MeshStandardMaterial({ color: '#f3f1ef', roughness: 0.6 }); cf.material.alphaTest = 0; g.add(cf);
      g.position.set(...d.pos); g.rotation.y = d.rot;
      // port on the edge facing the hub
      const edge = new THREE.Vector3(-d.out * d.w / 2, 0, 0).applyEuler(new THREE.Euler(0, d.rot, 0)).add(g.position);
      return { d, g, bodyMat, fm, edge };
    });

    // cables: hub -> each peripheral
    const cables = per.map((p, i) => {
      const s = new THREE.Vector3(p.d.out * 0.81, i === 0 ? 0 : [0.3, 0, -0.3][i - 1], 0);
      const e = p.edge;
      const mid1 = s.clone().lerp(e, 0.35); mid1.z += 0.45; mid1.y += (e.y - s.y) * 0.05;
      const mid2 = s.clone().lerp(e, 0.7); mid2.z -= 0.15;
      const curve = new THREE.CatmullRomCurve3([s, mid1, mid2, e], false, 'catmullrom', 0.5);
      const geo = new THREE.TubeGeometry(curve, 72, 0.034, 10, false);
      const m = new THREE.MeshPhysicalMaterial({ color: '#5c5142', roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, emissive: '#ff8763', emissiveIntensity: 0 });
      const tube = new THREE.Mesh(geo, m); tube.castShadow = true; floatG.add(tube);
      const plug = new THREE.Group();
      const pc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.2, 16), mat.metal('#e4e0dc')); plug.add(pc);
      const pb = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 12), new THREE.MeshStandardMaterial({ color: '#5c5142', roughness: 0.3 })); pb.position.y = -0.14; plug.add(pb);
      floatG.add(plug);
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ff9372', emissiveIntensity: 2.2, roughness: 0.3 }));
      floatG.add(pulse);
      return { curve, geo, m, plug, pulse, count: geo.index.count };
    });

    // fit camera to the aspect ratio
    const fit = (w, h) => {
      const aspect = w / h, tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const needW = 4.6, needH = 3.0;
      const dist = Math.max(needW / (tv * aspect), needH / tv);
      camera.position.set(0, 0.35, dist); camera.lookAt(0, 0, 0);
    };

    const tmp = new THREE.Vector3(), tan = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    const smoothLit = [0, 0, 0, 0];

    function update(t) {
      const I = intro.p;
      const hubK = smooth(I / 0.25);
      hub.scale.setScalar(0.4 + 0.6 * hubK);
      const slabK = smooth((I - 0.1) / 0.4);
      const cableK = smooth((I - 0.4) / 0.45);
      const done = smooth((I - 0.88) / 0.12);

      // which output is "active"
      let L = [1, 1, 1];
      if (mode === 'hero') {
        if (!reduced) { const c = (t * 0.33) % 3; L = [0, 1, 2].map((i) => 0.42 + 0.58 * smooth(1 - Math.abs(((c - i + 4.5) % 3) - 1.5) * 1.1)); }
      } else if (!reduced) L = state.lit.slice(); else L = [1, 1, 1];
      if (mode === 'scroll' && reduced) L = [1, 1, 1];

      per.forEach((p, i) => {
        const l = i === 0 ? 1 : L[i - 1];
        smoothLit[i] += (l - smoothLit[i]) * (reduced ? 1 : 0.12);
        const sl = reduced ? l : smoothLit[i];
        const out = p.d.out;
        const off = (1 - slabK) * 1.1 * out;
        p.g.position.set(p.d.pos[0] + off, p.d.pos[1] + Math.sin(t * 0.8 + i * 1.7) * 0.05 * slabK, p.d.pos[2] + sl * 0.3 * (i ? 1 : 0));
        p.g.scale.setScalar((0.9 + 0.1 * slabK) * (1 + 0.05 * sl * (i ? 1 : 0)));
        p.g.visible = slabK > 0.01;
        p.fm.color.setScalar(i === 0 ? 1 : 0.82 + 0.18 * sl);
        p.bodyMat.emissiveIntensity = i === 0 ? 0 : 0.28 * sl;

        const c = cables[i];
        const draw = i === 0 ? cableK : cableK;
        c.geo.setDrawRange(0, Math.floor((c.count * draw) / 3) * 3);
        c.m.emissiveIntensity = i === 0 ? 0.35 : 0.1 + 0.8 * sl;
        // plug rides the cable tip, snaps to the slab port
        const u = clamp(draw);
        c.curve.getPointAt(u, tmp); c.curve.getTangentAt(Math.min(u, 0.999), tan);
        // edge moves with slab offset; offset the tip accordingly at the end
        c.plug.position.copy(tmp).addScaledVector(tan, 0.07);
        c.plug.quaternion.setFromUnitVectors(up, tan);
        c.plug.visible = cableK > 0.01;
        // pulse
        const speed = i === 0 ? 0.28 : 0.3;
        let pu = ((t * speed + i * 0.27) % 1);
        if (i === 0) pu = 1 - pu; // source flows into the hub
        c.curve.getPointAt(clamp(pu), tmp);
        c.pulse.position.copy(tmp);
        const show = done * (reduced ? 0 : 1) * (i === 0 ? 1 : clamp((sl - 0.35) * 2));
        c.pulse.visible = show > 0.02; c.pulse.scale.setScalar(show);
      });

      // alive: gentle hub spin + pointer parallax
      const spin = reduced ? 0 : Math.sin(t * 0.5) * 0.12;
      hub.rotation.y = 0.3 + spin + pointer.x * 0.2; hub.rotation.x = -0.12 - pointer.y * 0.1;
      hub.position.y = reduced ? 0 : Math.sin(t * 0.9) * 0.05;
      floatG.rotation.y = pointer.x * 0.16 + (mode === 'scroll' ? (state.progress - 0.5) * 0.25 : 0);
      floatG.rotation.x = -pointer.y * 0.06;
    }
    update(0);
    return { update, resize: fit };
  };
}



