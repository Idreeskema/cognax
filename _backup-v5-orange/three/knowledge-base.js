// Knowledge Base hero: twelve files and folders racked like a tidy shelf that fan out into an organized grid
// and re-sort when a filter changes. state.fan (0..1) drives stack -> grid; state.filter picks the active filter.
import { THREE, slab, mat } from './stage.js';
import { canvasTex, rr, wrapText, facePlane, softShadow, FONT, clamp01, smooth, lerp } from './naxie-tex.js';

const INK = '#1a1714', MUTED = '#a29d97';

// Illustrative library (not customer data).
export const ITEMS = [
  { n: 'Contracts', k: 'folder', d: 'Legal', s: 'Ready' },
  { n: 'Q3 vendor review.pdf', k: 'pdf', d: 'Finance', s: 'Ready', star: 1 },
  { n: 'Pricing sheet.xlsx', k: 'xls', d: 'Sales', s: 'Ready', star: 1 },
  { n: 'Onboarding notes.docx', k: 'doc', d: 'HR', s: 'Processing' },
  { n: 'Vendor register.xlsx', k: 'xls', d: 'Finance', s: 'Ready' },
  { n: 'Finance', k: 'folder', d: 'Finance', s: 'Ready' },
  { n: 'Services agreement.pdf', k: 'pdf', d: 'Legal', s: 'Ready', star: 1 },
  { n: 'Forecast.xlsx', k: 'xls', d: 'Sales', s: 'Ready' },
  { n: 'Policy handbook.pdf', k: 'pdf', d: 'HR', s: 'Ready' },
  { n: 'Headcount.xlsx', k: 'xls', d: 'HR', s: 'Processing' },
  { n: 'Invoices Q3.xlsx', k: 'xls', d: 'Finance', s: 'Ready' },
  { n: 'Board notes.docx', k: 'doc', d: 'Finance', s: 'Processing' },
];
export const FILTERS = [
  { label: 'All files', test: () => true },
  { label: 'Status: Ready', test: (it) => it.s === 'Ready' },
  { label: 'Domain: Finance', test: (it) => it.d === 'Finance' },
  { label: 'Starred', test: (it) => !!it.star },
];
const KIND = { pdf: ['PDF', '#ff4a1c'], doc: ['DOC', '#2f6fe4'], xls: ['XLS', '#0f8a5f'], folder: ['', '#fff'] };

function chip(c, x, y, text, ok, dark) {
  c.font = `600 28px ${FONT}`;
  const w = c.measureText(text).width + 44;
  c.fillStyle = dark ? 'rgba(255,255,255,.22)' : ok ? '#e2f6ee' : '#ffeedd';
  rr(c, x, y, w, 56, 28); c.fill();
  c.fillStyle = dark ? '#fff' : ok ? '#0b7a53' : '#a14a05';
  c.textBaseline = 'middle'; c.fillText(text, x + 22, y + 30); c.textBaseline = 'alphabetic';
}

function faceTexture(it) {
  if (it.k === 'folder') {
    return canvasTex(510, 330, (c) => {
      c.fillStyle = '#fff'; c.font = `600 54px ${FONT}`; c.fillText(it.n, 40, 112);
      c.fillStyle = 'rgba(255,255,255,.85)'; c.font = `400 30px ${FONT}`; c.fillText('Folder, ' + it.d, 40, 168);
      chip(c, 40, 236, it.s, true, true);
    });
  }
  return canvasTex(420, 555, (c) => {
    c.fillStyle = '#fff'; c.fillRect(0, 0, 420, 555);
    const [lab, col] = KIND[it.k];
    c.fillStyle = col; rr(c, 34, 34, 100, 64, 16); c.fill();
    c.fillStyle = '#fff'; c.font = `700 30px ${FONT}`; c.textBaseline = 'middle'; c.textAlign = 'center'; c.fillText(lab, 84, 67); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    c.fillStyle = INK; c.font = `600 46px ${FONT}`;
    wrapText(c, it.n, 34, 196, 356, 54);
    if (it.k === 'xls') {
      c.strokeStyle = '#e0dedb'; c.lineWidth = 2.5;
      for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { c.strokeRect(34 + q * 118, 350 + r * 34, 118, 34); }
      c.fillStyle = '#e6f4ee'; c.fillRect(36 + 118, 352 + 34, 114, 30);
    } else {
      c.fillStyle = '#eae8e5';
      [350, 300, 326].forEach((w, i) => { rr(c, 34, 354 + i * 30, w, 14, 7); c.fill(); });
    }
    chip(c, 34, 462, it.s, it.s === 'Ready', false);
    c.fillStyle = '#726d67'; c.font = `500 30px ${FONT}`; c.textAlign = 'right'; c.fillText(it.d, 392, 502); c.textAlign = 'left';
  });
}

function starGeo() {
  const s = new THREE.Shape(), R = 0.15, r = 0.065;
  for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r : R; const x = Math.cos(a) * rad, y = Math.sin(a) * rad; i ? s.lineTo(x, y) : s.moveTo(x, y); }
  s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 2 });
}

export function buildKb({ camera, root, state, pointer, reduced, key, renderer, scene }) {
  renderer.toneMapping = THREE.LinearToneMapping; renderer.toneMappingExposure = 1.0;
  key.shadow.camera.left = -10; key.shadow.camera.right = 10; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.mapSize.set(2048, 2048);
  key.position.set(-4, 7, 9);
  state.fan = reduced ? 1 : 0;
  state.filter = 0;
  const snap = reduced;

  const group = new THREE.Group(); root.add(group);
  const sGeo = starGeo();
  const starMat = mat.matte('#1b1a18', { roughness: 0.35 });

  const shelf = slab(8.2, 0.18, 1.7, 0.08, mat.clay('#f1efed', { roughness: 0.55 }));
  shelf.position.set(0, -1.28, 0); group.add(shelf);

  const objs = ITEMS.map((it, i) => {
    const g = new THREE.Group();
    if (it.k === 'folder') {
      const back = slab(1.7, 1.35, 0.1, 0.1, mat.clay('#f28767', { roughness: 0.45 }));
      const tab = slab(0.75, 0.3, 0.1, 0.1, mat.clay('#f28767', { roughness: 0.45 })); tab.position.set(-0.47, 0.64, 0);
      const flap = slab(1.7, 1.05, 0.1, 0.1, mat.clay('#f79c80', { roughness: 0.45 })); flap.position.set(0, -0.14, 0.12);
      const f = facePlane(1.7, 1.05, faceTexture(it), { transparent: true, glow: 0.8 }); f.position.set(0, -0.14, 0.2);
      g.add(back, tab, flap, f);
    } else {
      g.add(slab(1.5, 1.95, 0.1, 0.1, mat.clay('#ffffff', { roughness: 0.5 })));
      const f = facePlane(1.4, 1.85, faceTexture(it), { glow: 0.25 }); f.position.z = 0.078; g.add(f);
    }
    { const sh = it.k === 'folder' ? softShadow(1.7, 1.35, { opacity: 0.2 }) : softShadow(1.5, 1.95, { opacity: 0.2 }); sh.position.set(0.1, -0.16, -0.12); g.add(sh); }
    if (it.star) {
      const st = new THREE.Mesh(sGeo, starMat); st.castShadow = true;
      st.position.set(it.k === 'folder' ? 0.62 : 0.52, it.k === 'folder' ? 0.38 : 0.76, it.k === 'folder' ? 0.2 : 0.09);
      g.add(st); g.userData.star = st;
    }
    group.add(g);
    return { g, it, cur: { x: 0, y: 0, z: 0, ry: -1, rx: 0, s: 1 } };
  });

  let C = 6, ASP = 2;
  const CELLW = 1.95, CELLH = 2.3;
  const rows = () => Math.ceil(ITEMS.length / C);

  function gridPose(filterIdx) {
    const R = rows();
    const test = FILTERS[filterIdx].test;
    const poses = new Array(ITEMS.length);
    if (filterIdx === 0) {
      ITEMS.forEach((_, i) => { const col = i % C, row = Math.floor(i / C); poses[i] = { x: (col - (C - 1) / 2) * CELLW, y: ((R - 1) / 2 - row) * CELLH, z: 0, s: 1 }; });
      return poses;
    }
    const m = ITEMS.filter(test).length, dims = ITEMS.length - m;
    const top = (Math.ceil(m / C) * CELLH + 1.2) / 2;
    let k = 0, j = 0;
    ITEMS.forEach((it, i) => {
      if (test(it)) {
        const row = Math.floor(k / C), col = k % C, inRow = Math.min(C, m - row * C);
        poses[i] = { x: (col - (inRow - 1) / 2) * CELLW, y: top - 1.2 - CELLH / 2 - row * CELLH, z: 0.35, s: 1 };
        k++;
      } else {
        poses[i] = { x: (j - (dims - 1) / 2) * CELLW * 0.46, y: top - 0.5, z: -1.4, s: 0.4 };
        j++;
      }
    });
    return poses;
  }

  let lastFilter = -1, poses = null;
  const tgtV = new THREE.Vector3();
  function update(t, dt) {
    const fan = state.fan, fi = Math.round(state.filter);
    if (fi !== lastFilter || !poses || poses.C !== C) { poses = gridPose(fi); poses.C = C; lastFilter = fi; }
    const k = snap ? 1 : 1 - Math.exp(-Math.max(dt, 0.016) * 5.5);
    objs.forEach((o, i) => {
      const ti = smooth(fan * 1.55 - (i / 11) * 0.55);
      const gp = poses[i];
      const stack = { x: (i - 5.5) * 0.45, y: -0.2 + (o.it.k === 'folder' ? -0.1 : 0), z: i * 0.012, ry: -1.08, rx: 0.0, s: 1 };
      const sway = snap ? 0 : pointer.x * 0.1 + Math.sin(t * 0.6 + i) * 0.02;
      const tx = lerp(stack.x, gp.x, ti), ty = lerp(stack.y, gp.y, ti) + (snap ? 0 : Math.sin(t * 0.8 + i * 0.7) * 0.03 * ti);
      const tz = lerp(stack.z, gp.z, ti), try_ = lerp(stack.ry, sway - 0.02, ti), trx = lerp(0, snap ? 0 : -pointer.y * 0.08, ti), ts = lerp(1, gp.s, ti);
      const c = o.cur;
      c.x += (tx - c.x) * k; c.y += (ty - c.y) * k; c.z += (tz - c.z) * k; c.ry += (try_ - c.ry) * k; c.rx += (trx - c.rx) * k; c.s += (ts - c.s) * k;
      o.g.position.set(c.x, c.y, c.z); o.g.rotation.set(c.rx, c.ry, 0); o.g.scale.setScalar(c.s);
      if (o.g.userData.star && !snap) o.g.userData.star.rotation.y = Math.sin(t * 1.2 + i) * 0.5;
    });
    const sf = smooth(fan * 1.5);
    shelf.scale.setScalar(Math.max(1 - sf, 0.001)); shelf.position.y = -1.28 - sf * 0.5;
    group.rotation.y = snap ? 0 : pointer.x * 0.05 * (1 - fan * 0.5);

    const dist = camDist();
    camera.position.set(0, lerp(1.1, 0, smooth(fan * 1.4)), dist * lerp(0.74, 1, smooth(fan * 1.3)));
    tgtV.set(0, lerp(-0.2, 0, fan), 0);
    camera.lookAt(tgtV);
  }

  function camDist() {
    const tanH = Math.tan((camera.fov * Math.PI) / 360);
    const H = rows() * CELLH + 1.2;
    return Math.max((H * 0.98) / 2 / tanH, (C * CELLW * 1.1) / 2 / (tanH * ASP));
  }

  if (snap) state.refresh = () => { update(0, 0); renderer.render(scene, camera); };
  return {
    update,
    resize(w, h) { ASP = w / h; C = ASP > 1.35 ? 6 : ASP > 0.85 ? 4 : 3; poses = null; if (snap) update(0, 0); },
  };
}
