// "Ask questions of your numbers": a chart slab whose bars rise as you scroll, a question above, an answer below.
import { THREE, slab, mat } from './stage.js';
import { softShadow, canvasTex, rr, wrapText, facePlane, makeBeam, FONT, clamp01, smooth, outBack, lerp } from './naxie-tex.js';

const INK = '#1a1714', MUTED = '#a29d97';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const VALS = [0.9, 1.2, 1.5, 1.25, 1.7, 2.15];

export function buildNumbers({ camera, root, state, pointer, reduced, key, renderer }) {
  renderer.toneMapping = THREE.LinearToneMapping; renderer.toneMappingExposure = 1.0;
  key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;

  state.progress = reduced ? 1 : 0;
  key.position.set(-3, 6, 7);
  camera.position.set(0.3, 0.1, 13.4);
  const g = new THREE.Group(); root.add(g);

  const CW = 6.2, CH = 4.0;
  const sh = softShadow(CW, CH, { opacity: 0.22 }); sh.position.set(0.35, -0.5, -0.14); g.add(sh);
  g.add(slab(CW, CH, 0.16, 0.16, mat.clay('#ffffff', { roughness: 0.5 })));
  const base = -1.2;
  const tex = canvasTex(1240, 800, (c) => {
    c.fillStyle = '#fff'; c.fillRect(0, 0, 1240, 800);
    c.fillStyle = INK; c.font = `600 46px ${FONT}`; c.fillText('Spend by month', 70, 104);
    c.fillStyle = '#4f4b46'; c.font = `400 30px ${FONT}`; c.fillText('Vendor register, all regions', 70, 152);
    for (let k = 0; k < 4; k++) { c.fillStyle = k === 0 ? '#aeaaa4' : '#e0dedb'; c.fillRect(70, 640 - k * 118, 1100, 2); }
    c.fillStyle = '#4f4b46'; c.font = `500 32px ${FONT}`; c.textAlign = 'center';
    MONTHS.forEach((m, i) => c.fillText(m, 620 + (i - 2.5) * 184, 704));
  });
  const face = facePlane(CW - 0.2, CH - 0.2, tex, { glow: 0 });
  face.position.z = 0.105; g.add(face);

  const bars = VALS.map((v, i) => {
    const hi = i === VALS.length - 1;
    const m = slab(0.56, 1, 0.4, 0.09, hi ? mat.gloss('#ff4a1c') : mat.clay('#ff7a4d', { roughness: 0.45 }));
    m.position.x = (i - 2.5) * 0.92;
    m.position.z = 0.32;
    m.scale.y = 0.001;
    g.add(m);
    return { m, v, hi };
  });

  const q = new THREE.Group();
  q.add(slab(3.7, 0.8, 0.16, 0.36, mat.clay('#ff4a1c', { roughness: 0.38 })));
  const qf = facePlane(3.7, 0.8, canvasTex(740, 160, (c) => {
    c.fillStyle = '#fff'; c.font = `500 29px ${FONT}`; c.textBaseline = 'middle';
    c.fillText('How did spend change by month?', 46, 82);
  }), { transparent: true, glow: 0.9 });
  qf.position.z = 0.108; q.add(qf);
  const qBase = new THREE.Vector3(-1.5, 2.75, 1.1);
  g.add(q);

  const a = new THREE.Group();
  a.add(slab(4.1, 1.3, 0.18, 0.3, mat.clay('#ffffff', { roughness: 0.45 })));
  const af = facePlane(4.1, 1.3, canvasTex(820, 260, (c) => {
    c.fillStyle = '#ff4a1c'; c.font = `600 24px ${FONT}`; c.fillText('Naxie', 48, 58);
    c.fillStyle = INK; c.font = `500 31px ${FONT}`;
    wrapText(c, 'Spend rose every month except April. June is the highest.', 48, 106, 730, 42);
  }), { transparent: true, glow: 0.5 });
  af.position.z = 0.118; a.add(af);
  const aBase = new THREE.Vector3(1.75, -2.55, 1.7);
  g.add(a);

  const beam = makeBeam('#ff4a1c', 0.02);
  g.add(beam);
  const wa = new THREE.Vector3(), wb = new THREE.Vector3();

  function update(t) {
    const P = state.progress;
    const qi = outBack((P - 0.02) / 0.2);
    q.scale.setScalar(Math.max(qi, 0.001));
    q.position.set(qBase.x, qBase.y - (1 - qi) * 0.8, qBase.z);
    bars.forEach((b, i) => {
      const k = smooth((P - 0.14 - i * 0.055) / 0.3);
      const h = Math.max(b.v * k, 0.001);
      b.m.scale.y = h;
      b.m.position.y = base + h / 2;
    });
    const ai = outBack((P - 0.62) / 0.22);
    a.scale.setScalar(Math.max(ai, 0.001));
    a.position.set(aBase.x, aBase.y - (1 - ai) * 0.8, aBase.z);
    const top = bars[5];
    const hb = smooth((P - 0.66) / 0.2);
    // beam from the answer up to the tallest bar
    wa.copy(a.position).add(new THREE.Vector3(1.55, 0.65, 0.2));
    wb.set(top.m.position.x, base + top.v * 1 + 0.12, 0.6);
    beam.set(wa, wb, hb);

    g.rotation.y = lerp(-0.5, 0.12, smooth(P)) + (reduced ? 0 : pointer.x * 0.12);
    g.rotation.x = -0.06 + (reduced ? 0 : -pointer.y * 0.06);
    g.position.y = reduced ? 0 : Math.sin(t * 0.7) * 0.05;
  }
  return { update, resize(w, h) { const z = h / w > 0.8 ? 0.62 + (w / h) * 0.3 : 1; camera.zoom = Math.min(1, z); camera.updateProjectionMatrix(); } };
}
