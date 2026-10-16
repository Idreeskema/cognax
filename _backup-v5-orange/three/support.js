// Support page scene: the open FAQ item's question bubble and answer card float in; switching items swaps them.
import { THREE, slab, mat, reduced } from './stage.js';
import { canvasTex, facePlane, softShadow, wrapText, FONT, outBack, clamp01 } from './naxie-tex.js';

const INK = '#0e1020';
const QA = [
  ['How do I sign in?', 'Use your email and password, or continue with Google.'],
  ['Where do I find my files?', 'In the Knowledge Base. Filter by status, domain and tags.'],
  ['Why is Naxie not answering?', 'Check the document is in the Knowledge Base and shows as ready.'],
  ['How do I build a dashboard?', 'Connect a spreadsheet, create a dashboard, then add a report.'],
];

export function supportScene(api, hooks = {}) {
  const { root, camera, pointer, key, renderer } = api;
  renderer.toneMapping = THREE.LinearToneMapping; renderer.toneMappingExposure = 1.0;
  key.position.set(3, 6, 7);
  const g = new THREE.Group(); root.add(g);
  const sh = softShadow(4.6, 3.4, { opacity: 0.2 }); sh.position.set(0.3, -0.4, -0.3); g.add(sh);

  const pairs = QA.map(([q, a]) => {
    const p = new THREE.Group();
    const qb = new THREE.Group();
    qb.add(slab(3.5, 0.95, 0.16, 0.4, mat.clay('#4f46e5', { roughness: 0.38 })));
    const qf = facePlane(3.5, 0.95, canvasTex(700, 190, (c) => {
      c.fillStyle = '#fff'; c.font = `500 34px ${FONT}`; c.textBaseline = 'middle'; c.fillText(q, 46, 98);
    }), { transparent: true, glow: 0.9 });
    qf.position.z = 0.108; qb.add(qf); qb.position.set(-0.45, 1.05, 0.5); p.add(qb);

    const ab = new THREE.Group();
    const edge = slab(3.86, 1.56, 0.12, 0.28, mat.matte('#d5d8e6')); edge.position.z = -0.03; ab.add(edge);
    ab.add(slab(3.8, 1.5, 0.18, 0.26, mat.clay('#ffffff', { roughness: 0.45, emissive: '#ffffff', emissiveIntensity: 0.2 })));
    const af = facePlane(3.8, 1.5, canvasTex(760, 300, (c) => {
      c.fillStyle = '#4f46e5'; c.font = `600 26px ${FONT}`; c.fillText('Answer', 50, 62);
      c.fillStyle = INK; c.font = `500 33px ${FONT}`; wrapText(c, a, 50, 116, 660, 46);
    }), { transparent: true, glow: 0.2 });
    af.position.z = 0.118; ab.add(af); ab.position.set(0.4, -0.7, 1.0); p.add(ab);
    p.userData = { qb, ab, k: 0 };
    g.add(p);
    return p;
  });

  let active = -1, aspect = 1;
  hooks.set = (i) => { active = i; };
  const S = { in: reduced ? 1 : 0 };
  if (!reduced && window.gsap) window.gsap.to(S, { in: 1, duration: 1.4, ease: 'expo.out', delay: 0.2 });

  return {
    resize(w, h) { aspect = w / h < 1.1 ? 1.2 : 1; },
    update(t) {
      pairs.forEach((p, i) => {
        const u = p.userData, on = i === active;
        u.k += ((on ? 1 : 0) - u.k) * (on ? 0.12 : 0.2);
        const k = clamp01(u.k) * S.in;
        p.visible = k > 0.01;
        const q = outBack(clamp01(k * 1.6)), a = outBack(clamp01(k * 1.6 - 0.45));
        u.qb.scale.setScalar(Math.max(0.001, q)); u.ab.scale.setScalar(Math.max(0.001, a));
        u.qb.position.y = 1.05 + (1 - k) * 0.5 + (reduced ? 0 : Math.sin(t * 0.9) * 0.06);
        u.ab.position.y = -0.7 - (1 - k) * 0.5 + (reduced ? 0 : Math.sin(t * 0.9 + 1.4) * 0.06);
      });
      g.rotation.y = -0.18 + pointer.x * 0.2;
      g.rotation.x = 0.05 - pointer.y * 0.08;
      camera.position.set(0.2, 0.5, 9.2).multiplyScalar(aspect);
      camera.lookAt(0, 0.1, 0);
    },
  };
}
