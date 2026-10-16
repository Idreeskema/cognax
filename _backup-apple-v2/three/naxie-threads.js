// "Pick a thread back up": a stack of saved conversations; one lifts out, opens, and takes a follow-up.
import { THREE, slab, mat } from './stage.js';
import { softShadow, canvasTex, rr, wrapText, facePlane, FONT, smooth, outBack, lerp } from './naxie-tex.js';

const INK = '#0e1020', MUTED = '#8e93ab';
const THREADS = [
  ['Onboarding checklist questions', 'Where is the IT access form?', 'Last week'],
  ['Contract review', 'Which clause covers early termination?', '4 follow-ups'],
  ['Vendor spend by region', 'Which region grew the most?', 'Yesterday'],
  ['Policy handbook', 'How many days of leave carry over?', '2 weeks ago'],
  ['Q3 forecast notes', 'Summarize the risks in this file', 'Today'],
];
const SEL = 1;

export function buildThreads({ camera, root, state, pointer, reduced, key, renderer }) {
  renderer.toneMapping = THREE.LinearToneMapping; renderer.toneMappingExposure = 1.0;
  key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;

  state.progress = reduced ? 1 : 0;
  key.position.set(-3, 6, 8);
  camera.position.set(0, 0.2, 12.2);
  const g = new THREE.Group(); root.add(g);

  const CW = 3.4, CH = 1.0;
  const cards = THREADS.map((t, i) => {
    const sel = i === SEL;
    const grp = new THREE.Group();
    const sh = softShadow(CW, CH, { opacity: 0.2 }); sh.position.set(0.12, -0.2, -0.12); grp.add(sh);
    grp.add(slab(CW, CH, 0.14, 0.2, mat.clay(sel ? '#f1f0ff' : '#ffffff', { roughness: 0.5 })));
    const tex = canvasTex(680, 200, (c) => {
      c.fillStyle = INK; c.font = `600 31px ${FONT}`; c.fillText(t[0], 44, 78);
      c.fillStyle = MUTED; c.font = `400 25px ${FONT}`; c.fillText(t[1], 44, 124);
      c.textAlign = 'right'; c.font = `500 22px ${FONT}`; c.fillStyle = sel ? '#4f46e5' : MUTED; c.fillText(t[2], 640, 54);
    });
    const f = facePlane(CW, CH, tex, { transparent: true, glow: 0.5 });
    f.position.z = 0.098; grp.add(f);
    g.add(grp);
    return grp;
  });

  // opened conversation
  const open = new THREE.Group();
  const OW = 4.2, OH = 4.5;
  const osh = softShadow(OW, OH, { opacity: 0.24 }); osh.position.set(0.25, -0.4, -0.14); open.add(osh);
  open.add(slab(OW, OH, 0.18, 0.2, mat.clay('#ffffff', { roughness: 0.5 })));
  const oTex = canvasTex(840, 900, (c) => {
    c.fillStyle = INK; c.font = `600 32px ${FONT}`; c.fillText('Contract review', 52, 86);
    c.fillStyle = '#e3e5ee'; c.fillRect(52, 116, 736, 2);
    // question
    c.fillStyle = '#4f46e5'; rr(c, 230, 150, 558, 78, 36); c.fill();
    c.fillStyle = '#fff'; c.font = `500 26px ${FONT}`; c.fillText('Which clause covers early termination?', 262, 198);
    // answer
    c.fillStyle = '#f4f5f9'; rr(c, 52, 262, 650, 166, 30); c.fill();
    c.fillStyle = INK; c.font = `500 27px ${FONT}`;
    wrapText(c, 'Either party can end the agreement with 60 days’ written notice.', 84, 318, 590, 38);
    c.fillStyle = '#4f46e5'; c.font = `600 22px ${FONT}`; c.fillText('Services Agreement, p. 7', 84, 398);
    // earlier follow-ups
    c.fillStyle = '#4f46e5'; rr(c, 360, 462, 428, 66, 30); c.fill();
    c.fillStyle = '#fff'; c.font = `500 25px ${FONT}`; c.fillText('Who has to give notice?', 392, 504);
    c.fillStyle = '#f4f5f9'; rr(c, 52, 556, 560, 106, 30); c.fill();
    c.fillStyle = INK; c.font = `500 26px ${FONT}`; wrapText(c, 'Either party. Section 12.2 applies to both.', 84, 608, 500, 36);
    // composer
    c.strokeStyle = '#e3e5ee'; c.lineWidth = 2; rr(c, 52, 760, 736, 80, 40); c.stroke();
    c.fillStyle = MUTED; c.font = `400 26px ${FONT}`; c.fillText('Ask a follow-up', 88, 810);
  });
  const of = facePlane(OW, OH, oTex, { transparent: true, glow: 0.4 });
  of.position.z = 0.118; open.add(of);
  open.scale.setScalar(0.001);
  g.add(open);

  // new follow-up that pops in
  const fu = new THREE.Group();
  fu.add(slab(2.9, 0.7, 0.14, 0.32, mat.clay('#4f46e5', { roughness: 0.38 })));
  const fuf = facePlane(2.9, 0.7, canvasTex(580, 140, (c) => {
    c.fillStyle = '#fff'; c.font = `500 28px ${FONT}`; c.textBaseline = 'middle'; c.fillText('And what about renewal?', 40, 72);
  }), { transparent: true, glow: 0.9 });
  fuf.position.z = 0.098; fu.add(fuf);
  fu.scale.setScalar(0.001);
  g.add(fu);

  function update(t) {
    const P = state.progress;
    const lift = smooth((P - 0.12) / 0.3), op = outBack((P - 0.38) / 0.28), fi = outBack((P - 0.78) / 0.16);
    cards.forEach((c, i) => {
      const bx = -2.15 + i * 0.1, by = 1.9 - i * 1.12, bz = -i * 0.25;
      if (i === SEL) {
        c.position.set(lerp(bx, -2.0, lift), lerp(by, 0.6, lift), lerp(bz, 1.5, lift));
        c.rotation.y = lerp(0.3, 0.1, lift);
      } else {
        c.position.set(bx - lift * 0.5, by + (i > SEL ? -0.1 : 0.1) * lift, bz - lift * 1.0);
        c.rotation.y = 0.3;
      }
      c.rotation.z = 0;
    });
    open.position.set(1.0, -0.15, 1.2 + 0.4 * op);
    open.rotation.y = -0.18 + (reduced ? 0 : pointer.x * 0.08);
    open.scale.setScalar(Math.max(op, 0.001));
    fu.position.set(2.0, -2.9 + (1 - fi) * -0.5, 2.2);
    fu.scale.setScalar(Math.max(fi, 0.001));
    g.rotation.y = lerp(0.22, -0.1, smooth(P)) + (reduced ? 0 : pointer.x * 0.08);
    g.position.y = reduced ? 0 : Math.sin(t * 0.7) * 0.05;
  }
  return { update, resize(w, h) { camera.zoom = h / w > 0.8 ? Math.min(1, 0.62 + (w / h) * 0.3) : 1; camera.updateProjectionMatrix(); } };
}
