// Presentations "Works with" scene: a slide in the middle, Dashboards / Connections / Naxie orbiting it and feeding it.
import { THREE, mat, slab, palette, reduced } from './stage.js';
import { column, shadowFloor } from './dash-common.js';

const g = () => window.gsap;

export function worksScene(api) {
  const { root, camera, renderer, pointer, key } = api;
  key.position.set(4, 8, 6);
  root.add(shadowFloor(-1.2, 30, 0.1));

  // centre: the slide, with a tiny chart that grows as data arrives
  const slide = new THREE.Group(); root.add(slide);
  slide.add(slab(2.8, 1.75, 0.12, 0.14, mat.clay('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.3 })));
  const bars = [0.5, 0.8, 0.6, 1.0].map((h, i) => {
    const c = column(0.28, i === 3 ? palette.accent : '#6a68ea', i === 3);
    c.position.set(-0.55 + i * 0.37, -0.62, 0.1); c.scale.y = reduced ? h * 0.9 : 0.001; c.userData.h = h * 0.9;
    slide.add(c); return c;
  });
  const title = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.04), mat.matte('#0e1020')); title.position.set(-0.55, 0.62, 0.1); slide.add(title);
  const sub = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.07, 0.04), mat.matte('#c9cde0')); sub.position.set(-0.8, 0.45, 0.1); slide.add(sub);

  // satellites
  const sats = [];
  const mk = (obj, color) => { const grp = new THREE.Group(); grp.add(obj); root.add(grp); sats.push({ grp, color }); return grp; };

  // dashboards: small columns
  const dash = new THREE.Group();
  [0.5, 0.85, 0.65].forEach((h, i) => { const c = column(0.3, '#7f82ee'); c.position.set((i - 1) * 0.38, -0.35, 0); c.scale.y = h; dash.add(c); });
  mk(dash, '#7f82ee');

  // connections: a spreadsheet slab with rows
  const sheet = new THREE.Group();
  sheet.add(slab(1.3, 1.0, 0.1, 0.1, mat.clay('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.3 })));
  [0.28, 0.08, -0.12, -0.32].forEach((y, i) => { const r = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.03), mat.matte(i === 1 ? '#ffd2b3' : '#e3e5ee')); r.position.set(0, y, 0.07); sheet.add(r); });
  mk(sheet, '#4f46e5');

  // naxie: a glossy orb
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 48), mat.gloss(palette.violet)); orb.castShadow = true;
  mk(orb, palette.accent);

  // links from each satellite to the slide, with a pulse dot travelling along them
  const links = sats.map((s) => {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: s.color, transparent: true, opacity: 0.55 }));
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: palette.accent }));
    root.add(line, dot);
    return { line, dot };
  });

  const S = { in: reduced ? 1 : 0 };
  if (!reduced && g()) {
    const tl = g().timeline({ paused: true });
    tl.to(S, { in: 1, duration: 1.4, ease: 'expo.out' }, 0);
    bars.forEach((b, i) => tl.to(b.scale, { y: b.userData.h, duration: 1.1, ease: 'power4.out' }, 0.5 + i * 0.1));
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tl.play(); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(renderer.domElement.parentElement);
  }

  const R = 2.6, tmp = new THREE.Vector3();
  let aspectDist = 1;
  return {
    resize(w, h) { aspectDist = w / h < 1 ? 1.35 : 1; },
    update(t) {
      slide.position.y = Math.sin(t * 0.9) * 0.08;
      slide.rotation.y = reduced ? -0.2 : Math.sin(t * 0.5) * 0.18;
      slide.scale.setScalar(0.6 + 0.4 * S.in);
      sats.forEach((s, i) => {
        const a = (i / sats.length) * Math.PI * 2 + (reduced ? 0.5 : t * 0.35);
        const r = R * S.in;
        s.grp.position.set(Math.cos(a) * r, Math.sin(t * 0.8 + i * 2) * 0.15 + Math.sin(a) * 0.35, Math.sin(a) * r * 0.9);
        s.grp.rotation.y = -a * 0.3 + 0.3;
        s.grp.scale.setScalar(0.001 + 0.999 * S.in);
        const { line, dot } = links[i];
        const pos = line.geometry.attributes.position;
        pos.setXYZ(0, s.grp.position.x, s.grp.position.y, s.grp.position.z); pos.setXYZ(1, slide.position.x, slide.position.y, slide.position.z);
        pos.needsUpdate = true; line.visible = dot.visible = S.in > 0.6;
        tmp.set(slide.position.x, slide.position.y, slide.position.z).sub(s.grp.position);
        dot.position.copy(s.grp.position).addScaledVector(tmp, reduced ? 0.5 : (t * 0.33 + i / sats.length) % 1);
      });
      camera.position.set(pointer.x * 1.5, 2.8 + pointer.y * 0.8, 9.6).multiplyScalar(aspectDist);
      camera.lookAt(0, 0, 0);
    },
  };
}
