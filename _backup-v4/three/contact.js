// Contact page scene: a request card whose rows light up as the visitor fills in the form, and a confirmation bubble on send.
import { THREE, slab, mat, palette, reduced } from './stage.js';
import { canvasTex, facePlane, softShadow, rr, FONT, outBack, clamp01 } from './naxie-tex.js';

const INK = '#0e1020', MUTED = '#4a4f68', LINE = '#d5d8e6';
// field boxes in canvas px (card texture is 720 x 880, 200px per world unit)
const FIELDS = [
  { label: 'Full name', top: 190, h: 90 },
  { label: 'Work email', top: 330, h: 90 },
  { label: 'Company', top: 470, h: 90 },
  { label: 'What would you like to ask Cognax?', top: 600, h: 170 },
];
const px = 200, CW = 3.6, CH = 4.4;
const wy = (py) => CH / 2 - py / px;

export function contactScene(api, hooks = {}) {
  const { root, camera, pointer, key, renderer } = api;
  renderer.toneMapping = THREE.LinearToneMapping; renderer.toneMappingExposure = 1.0;
  key.position.set(3, 6, 7);

  const g = new THREE.Group(); root.add(g);
  const sh = softShadow(CW, CH, { opacity: 0.22 }); sh.position.set(0.3, -0.45, -0.2); g.add(sh);
  // hairline edge so the white card reads on a white page
  const edge = slab(CW + 0.05, CH + 0.05, 0.12, 0.2, mat.matte(LINE)); edge.position.z = -0.03; g.add(edge);
  const card = slab(CW, CH, 0.16, 0.18, mat.clay('#ffffff', { roughness: 0.5, emissive: '#ffffff', emissiveIntensity: 0.2 }));
  g.add(card);

  const tex = canvasTex(720, 880, (c) => {
    c.fillStyle = '#fff'; c.fillRect(0, 0, 720, 880);
    c.fillStyle = INK; c.font = `600 44px ${FONT}`; c.fillText('Request a demo', 60, 100);
    c.fillStyle = MUTED; c.font = `400 26px ${FONT}`; c.fillText('We reply by email', 60, 140);
    FIELDS.forEach((f) => {
      c.fillStyle = MUTED; c.font = `500 22px ${FONT}`; c.fillText(f.label, 60, f.top - 14);
      c.strokeStyle = '#b4b8cc'; c.lineWidth = 3; rr(c, 60, f.top, 600, f.h, 18); c.stroke();
    });
    c.fillStyle = INK; rr(c, 60, 800, 240, 56, 28); c.fill();
    c.fillStyle = '#fff'; c.font = `600 24px ${FONT}`; c.fillText('Send request', 94, 836);
  });
  const face = facePlane(CW, CH, tex, { glow: 0.2 });
  face.position.z = 0.105; g.add(face);

  // highlight over the focused field + a fill bar per field that grows as text is typed
  const hl = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.45), new THREE.MeshBasicMaterial({ color: '#4f46e5', transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  hl.position.z = 0.108; g.add(hl);
  const bars = FIELDS.map((f) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.07), new THREE.MeshBasicMaterial({ color: '#4f46e5', toneMapped: false }));
    m.position.set(-CW / 2 + 0.4, wy(f.top + f.h / 2), 0.11); m.scale.x = 0.001; g.add(m);
    return m;
  });

  // reply bubble that pops up after a successful send
  const bub = new THREE.Group();
  bub.add(slab(2.6, 0.8, 0.14, 0.34, mat.clay('#4f46e5', { roughness: 0.38 })));
  const bf = facePlane(2.6, 0.8, canvasTex(520, 160, (c) => {
    c.fillStyle = '#fff'; c.font = `500 30px ${FONT}`; c.textBaseline = 'middle'; c.fillText('Request received', 44, 82);
  }), { transparent: true, glow: 0.9 });
  bf.position.z = 0.1; bub.add(bf);
  bub.position.set(1.0, -2.45, 0.9); g.add(bub);

  // a couple of quiet cards behind for depth
  [[-0.5, 0.35, -0.9, '#eef0f8'], [0.55, -0.3, -1.6, '#f4f5f9']].forEach(([x, y, z, col]) => {
    const s = slab(CW * 0.9, CH * 0.9, 0.1, 0.18, mat.clay(col)); s.position.set(x, y, z); s.rotation.z = x * 0.08; g.add(s);
  });

  const S = { in: reduced ? 1 : 0, sent: 0 };
  let active = -1, hlY = 0, aspect = 1;
  const fill = [0, 0, 0, 0], fillShown = [0, 0, 0, 0];
  hooks.focus = (i) => { active = i; };
  hooks.fill = (i, k) => { fill[i] = clamp01(k); };
  hooks.sent = () => { S.sent = 1; };
  if (!reduced && window.gsap) window.gsap.to(S, { in: 1, duration: 1.6, ease: 'expo.out', delay: 0.2 });

  return {
    resize(w, h) { aspect = w / h < 0.9 ? 1.25 : 1; },
    update(t) {
      const a = outBack(S.in);
      g.scale.setScalar(Math.max(0.001, 0.8 + 0.2 * a));
      g.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.08;
      g.rotation.y = -0.2 + pointer.x * 0.2 + (reduced ? 0 : Math.sin(t * 0.4) * 0.05);
      g.rotation.x = 0.04 - pointer.y * 0.1;
      const on = active >= 0;
      if (on) { const f = FIELDS[active]; hlY += (wy(f.top + f.h / 2) - hlY) * 0.2; hl.scale.y = f.h / px / 0.45; }
      hl.position.y = hlY;
      hl.material.opacity += ((on ? 0.1 : 0) - hl.material.opacity) * 0.2;
      bars.forEach((b, i) => { fillShown[i] += (fill[i] - fillShown[i]) * 0.15; const w = Math.max(0.001, fillShown[i] * 2.4); b.scale.x = w; b.position.x = -CW / 2 + 0.4 + w / 2; });
      const s = outBack(clamp01(S.sent));
      bub.scale.setScalar(Math.max(0.001, s)); bub.visible = S.sent > 0;
      camera.position.set(0.3, 0.4, 10.2).multiplyScalar(aspect);
      camera.lookAt(0, -0.2, 0);
    },
  };
}
