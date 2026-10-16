// Home hero scene: the Cognax mark with document, sheet, chart and answer slabs that fly in, orbit gently,
// and converge behind the mark as the visitor scrolls (state.progress 0 -> 1).
import { THREE, mat, slab, palette, reduced } from './stage.js';
import { createLogoMark } from './logo.js';

const FONT = '"Geist", system-ui, -apple-system, "Segoe UI", sans-serif';
const INK = '#0e1020', MUTED = '#8a8fa8', LINE = '#e3e5ee', BRAND = '#4f46e5', SOFT = '#eeedff';

let curW = 1.5;
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w * 2; c.height = h * 2;
  const g = c.getContext('2d');
  g.scale(2, 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const rad = 0.075 * w / curW;
  const run = () => { g.clearRect(0, 0, w, h); g.save(); g.beginPath(); g.roundRect(0, 0, w, h, rad); g.clip(); draw(g, w, h); g.restore(); tex.needsUpdate = true; };
  run();
  document.fonts?.ready.then(run);
  return tex;
}
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const bar = (g, x, y, w, h = 7, col = LINE) => { g.fillStyle = col; rr(g, x, y, w, h, h / 2); g.fill(); };

// ---- slab faces (illustrative content, not customer data) ----
const faces = {
  contract: () => canvasTex(300, 400, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    g.fillStyle = INK; g.font = `600 17px ${FONT}`; g.fillText('Services Agreement', 24, 40);
    g.fillStyle = MUTED; g.font = `500 11px ${FONT}`; g.fillText('Section 12.2  Termination', 24, 60);
    let y = 88;
    for (let i = 0; i < 11; i++) {
      if (i === 5 || i === 6) { // highlighted passage
        if (i === 5) { g.fillStyle = SOFT; g.fillRect(16, y - 10, w - 32, 36); g.fillStyle = BRAND; g.fillRect(16, y - 10, 3, 36); }
        bar(g, 28, y, i === 6 ? 150 : w - 56, 7, '#9a94f2');
      } else bar(g, 24, y, i % 4 === 3 ? 170 : w - 48, 7, '#e6e8f0');
      y += 18; if (i === 3) y += 10;
    }
    g.fillStyle = MUTED; g.font = `500 10px ${FONT}`; g.fillText('Page 7 of 24', 24, h - 20);
  }),
  sheet: () => canvasTex(380, 250, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    const cols = [0, 120, 200, 290, 380], rows = 7, rh = 33;
    g.fillStyle = '#f4f5f9'; g.fillRect(0, 0, w, rh);
    g.font = `600 12px ${FONT}`; g.fillStyle = MUTED;
    ['Vendor', 'Region', 'Q2', 'Q3'].forEach((t, i) => g.fillText(t, cols[i] + 14, 21));
    const data = [['Northwind', 'EMEA', '41.2', '45.9'], ['Contoso', 'APAC', '28.7', '33.1'], ['Fabrikam', 'AMER', '52.0', '49.4'], ['Litware', 'EMEA', '19.5', '24.8'], ['Adatum', 'AMER', '36.3', '38.0'], ['Tailspin', 'APAC', '22.9', '31.6']];
    data.forEach((r, ri) => {
      const y = rh * (ri + 1);
      if (ri === 2) { g.fillStyle = SOFT; g.fillRect(0, y, w, rh); }
      g.font = `500 12.5px ${FONT}`;
      r.forEach((t, i) => { g.fillStyle = i < 2 ? INK : '#3a3e55'; if (i >= 2) g.textAlign = 'right'; g.fillText(t, i >= 2 ? cols[i + 1] - 16 : cols[i] + 14, y + 21); g.textAlign = 'left'; });
    });
    g.strokeStyle = LINE; g.lineWidth = 1;
    for (let r = 0; r <= rows; r++) { g.beginPath(); g.moveTo(0, r * rh + .5); g.lineTo(w, r * rh + .5); g.stroke(); }
    for (let c = 1; c < cols.length - 1; c++) { g.beginPath(); g.moveTo(cols[c] + .5, 0); g.lineTo(cols[c] + .5, rows * rh); g.stroke(); }
    g.strokeStyle = BRAND; g.lineWidth = 2; g.strokeRect(290 + 1, 3 * rh + 1, 88, rh - 2);
  }),
  chart: () => canvasTex(300, 300, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    g.fillStyle = INK; g.font = `600 15px ${FONT}`; g.fillText('Spend by quarter', 22, 36);
    g.fillStyle = MUTED; g.font = `500 11px ${FONT}`; g.fillText('Source: Vendor register', 22, 54);
    const vals = [.38, .52, .46, .72, .62, .9], bw = 28, gap = 11, x0 = 24, base = h - 36, maxH = 170;
    g.strokeStyle = LINE; g.lineWidth = 1;
    for (let i = 0; i < 4; i++) { const y = base - (maxH / 3) * i; g.beginPath(); g.moveTo(x0 - 4, y + .5); g.lineTo(w - 18, y + .5); g.stroke(); }
    vals.forEach((v, i) => {
      const bh = v * maxH, x = x0 + i * (bw + gap);
      g.fillStyle = i === 5 ? BRAND : '#c9c6fa'; rr(g, x, base - bh, bw, bh, 6); g.fill();
    });
    g.fillStyle = MUTED; g.font = `500 10px ${FONT}`;
    ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2'].forEach((t, i) => g.fillText(t, x0 + i * (bw + gap) + 5, h - 16));
  }),
  answer: () => canvasTex(420, 150, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    g.fillStyle = BRAND; rr(g, 22, 22, 28, 28, 14); g.fill();
    g.fillStyle = '#fff'; g.font = `700 13px ${FONT}`; g.fillText('N', 31, 41);
    g.fillStyle = INK; g.font = `600 15px ${FONT}`; g.fillText('Naxie', 60, 42);
    g.fillStyle = '#3a3e55'; g.font = `500 15px ${FONT}`;
    g.fillText('Either party can end the agreement with', 22, 80);
    g.fillText("60 days' written notice.", 22, 102);
    g.fillStyle = SOFT; rr(g, 22, 114, 168, 24, 12); g.fill();
    g.fillStyle = BRAND; g.font = `600 11.5px ${FONT}`; g.fillText('Services Agreement, p. 7', 34, 130);
  }),
};

function softShadowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(40,36,110,.55)'); r.addColorStop(1, 'rgba(40,36,110,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const smooth = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

export function buildHeroScene(api) {
  const { scene, camera, root, pointer, state } = api;
  camera.position.set(0, 0.1, 10.3);
  camera.lookAt(0, 0, 0);
  root.position.y = 0.05;

  // mark
  const { group: markGroup, spark } = createLogoMark({ height: 1.95 });
  const markPivot = new THREE.Group();
  markPivot.add(markGroup);
  root.add(markPivot);

  // floor contact shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: softShadowTexture(), transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, -2.3, 0);
  root.add(shadow);

  const defs = [
    { id: 'contract', w: 1.45, h: 1.93, pos: [-1.62, 0.55, -0.35], rot: [-0.04, 0.38, 0.07], from: [-5, 3.5, 3] },
    { id: 'sheet', w: 1.8, h: 1.18, pos: [1.5, -1.0, 0.1], rot: [0.05, -0.42, -0.05], from: [6, -3, 4] },
    { id: 'chart', w: 1.42, h: 1.42, pos: [-1.15, -1.5, 0.75], rot: [0.04, 0.3, -0.05], from: [-4.5, -4.5, 3] },
    { id: 'answer', w: 1.9, h: 0.68, pos: [1.35, 1.4, 0.55], rot: [-0.04, -0.32, 0.05], from: [5, 4.5, 2] },
  ];
  const body = mat.clay('#ffffff', { roughness: 0.5, clearcoat: 0.15 });
  const slabs = defs.map((d, i) => {
    const g = new THREE.Group();
    const s = slab(d.w, d.h, 0.07, 0.07, body); s.castShadow = false; s.receiveShadow = false;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(d.w - 0.01, d.h - 0.01), new THREE.MeshBasicMaterial({ map: (curW = d.w, faces[d.id]()), toneMapped: false, transparent: true }));
    face.position.z = 0.035 + 0.0215; // sit on the bevelled front
    // clip the face to the rounded card via a slightly smaller plane
    g.add(s, face);
    root.add(g);
    const fan = { x: (i - 1.5) * 0.78, y: (i % 2 ? -0.22 : 0.22), z: -0.7 - i * 0.12, rz: (i - 1.5) * -0.3, s: 1.0 };
    return { g, d, i, intro: reduced ? 1 : 0, phase: i * 1.7, fan, from: new THREE.Vector3(...d.from), home: new THREE.Vector3(...d.pos), fromRot: new THREE.Euler((i - 1.5) * 1.1, (i % 2 ? 1 : -1) * 1.6, (i - 1.5) * 0.9) };
  });

  const vis = { spread: 1, markIntro: reduced ? 1 : 0, sparkIntro: reduced ? 1 : 0, p: 0 };
  const tmp = new THREE.Vector3();

  const update = (t, dt) => {
    // smoothed scroll progress
    vis.p += (state.progress - vis.p) * (dt ? Math.min(dt * 7, 1) : 1);
    const p = vis.p;
    const conv = smooth(0.0, 0.85, p);
    const settle = smooth(0.85, 1, p);

    // whole-rig parallax
    root.rotation.y = pointer.x * 0.16 * (1 - conv);
    root.rotation.x = -pointer.y * 0.09 * (1 - conv);

    // mark
    const e = vis.markIntro;
    markPivot.scale.setScalar(Math.max(0.0001, e) * (1 + 0.14 * conv));
    markPivot.rotation.y = (1 - e) * -Math.PI * 1.4 + Math.sin(t * 0.5) * 0.12 * (1 - conv) + conv * Math.PI * 2 - pointer.x * 0.12;
    markPivot.rotation.x = (1 - e) * 0.6 + Math.sin(t * 0.4 + 1) * 0.04;
    markPivot.position.y = Math.sin(t * 0.7) * 0.05 * (1 - conv);
    spark.scale.setScalar(Math.max(0.0001, vis.sparkIntro) * (1 + Math.sin(t * 1.6) * 0.06));
    spark.rotation.z = Math.sin(t * 0.8) * 0.12 + (1 - vis.sparkIntro) * 1.6;

    // slabs
    for (const s of slabs) {
      const k = s.intro;
      const bob = Math.sin(t * 0.8 + s.phase) * 0.07 * k;
      tmp.lerpVectors(s.from, s.home, k);
      tmp.x *= vis.spread;
      tmp.y += bob; tmp.x += Math.cos(t * 0.5 + s.phase) * 0.03 * k;
      // converge to fan behind the mark
      tmp.x = THREE.MathUtils.lerp(tmp.x, s.fan.x, conv);
      tmp.y = THREE.MathUtils.lerp(tmp.y, s.fan.y, conv);
      tmp.z = THREE.MathUtils.lerp(tmp.z, s.fan.z, conv);
      s.g.position.copy(tmp);
      s.g.rotation.x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(s.fromRot.x, s.d.rot[0], k), 0, conv);
      s.g.rotation.y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(s.fromRot.y, s.d.rot[1], k), 0, conv) + Math.sin(t * 0.6 + s.phase) * 0.04 * (1 - conv);
      s.g.rotation.z = THREE.MathUtils.lerp(THREE.MathUtils.lerp(s.fromRot.z, s.d.rot[2], k), s.fan.rz, conv);
      s.g.scale.setScalar(Math.max(0.0001, k) * THREE.MathUtils.lerp(1, s.fan.s, conv));
    }
    // shadow
    const sh = 2.6 - conv * 0.9 + (1 - vis.markIntro) * -2;
    shadow.scale.set(Math.max(0.01, sh), Math.max(0.01, sh * 0.5), 1);
    shadow.material.opacity = 0.2 * vis.markIntro * (1 - settle * 0.3);
  };

  // intro (once, scene-driven so it reads as one move)
  const intro = () => {
    if (reduced || !window.gsap) { vis.markIntro = vis.sparkIntro = 1; slabs.forEach((s) => (s.intro = 1)); return; }
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(vis, { markIntro: 1, duration: 1.7, ease: 'expo.out' }, 0);
    slabs.forEach((s, i) => tl.to(s, { intro: 1, duration: 1.9, ease: 'expo.out' }, 0.35 + i * 0.13));
    tl.to(vis, { sparkIntro: 1, duration: 1.1, ease: 'back.out(2.2)' }, 1.0);
    return tl;
  };
  intro();

  return {
    update,
    resize(w, h) {
      const a = w / h;
      if (a >= 1) { camera.position.z = 10.3; root.scale.setScalar(1.16); vis.spread = Math.min(1 + (a - 1) * 1.0, 1.9); }
      else { camera.position.z = 10.3 / Math.min(1, a * 1.08); root.scale.setScalar(1); vis.spread = 1; }
    },
  };
}