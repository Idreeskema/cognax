// Connections "Works with" scene: a spreadsheet hub that feeds Dashboards, Presentations, Data & Automation and Knowledge Base.
import { THREE, mat, slab, palette, reduced } from './stage.js';
import { column, shadowFloor } from './dash-common.js';

const g = () => window.gsap;
const bright = (c) => mat.clay(c, { emissive: c, emissiveIntensity: 0.25 });

export function connWorksScene(api, hooks = {}) {
  const { root, camera, renderer, pointer, key } = api;
  key.position.set(4, 8, 6);
  root.add(shadowFloor(-1.3, 30, 0.1));

  // hub: spreadsheet with an accent row
  const hub = new THREE.Group(); root.add(hub);
  hub.add(slab(1.9, 1.5, 0.12, 0.12, bright('#ffffff')));
  [0.45, 0.18, -0.09, -0.36].forEach((y, i) => {
    const r = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.03), mat.matte(i === 1 ? '#ffb27a' : '#dfe1ee')); r.position.set(0, y, 0.08); hub.add(r);
  });

  // tiles, in the same order as the link cards
  const tiles = [];
  const add = (grp, color) => { root.add(grp); tiles.push({ grp, color, lift: 0 }); };

  const dash = new THREE.Group();
  [0.5, 0.85, 0.65].forEach((h, i) => { const c = column(0.3, '#7f82ee'); c.position.set((i - 1) * 0.38, -0.4, 0); c.scale.y = h; dash.add(c); });
  add(dash, '#7f82ee');

  const pres = new THREE.Group();
  pres.add(slab(1.5, 0.95, 0.08, 0.08, bright('#ffffff')));
  const t = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.07, 0.03), mat.matte('#0e1020')); t.position.set(-0.28, 0.26, 0.06); pres.add(t);
  const pb = column(0.22, palette.accent, true); pb.position.set(0.4, -0.38, 0.06); pb.scale.y = 0.5; pres.add(pb);
  add(pres, '#4f46e5');

  const gear = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.22, 32), mat.gloss('#5b4fd6')); body.rotation.x = Math.PI / 2; gear.add(body);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.22), mat.gloss('#5b4fd6'));
    tooth.position.set(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0); tooth.rotation.z = a; gear.add(tooth);
  }
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.26, 24), mat.matte('#eef0f8')); hole.rotation.x = Math.PI / 2; gear.add(hole);
  const gearWrap = new THREE.Group(); gearWrap.add(gear); add(gearWrap, palette.accent);

  const kb = new THREE.Group();
  ['#c9c4f3', '#9a90ea', '#7f82ee'].forEach((c, i) => { const f = slab(1.2, 0.2, 0.9, 0.06, bright(c)); f.position.y = -0.35 + i * 0.27; f.rotation.y = (i - 1) * 0.18; kb.add(f); });
  add(kb, '#9a90ea');

  // links with pulses travelling hub -> tile
  const links = tiles.map((tl) => {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: tl.color, transparent: true, opacity: 0.55 }));
    line.frustumCulled = false;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: palette.accent }));
    root.add(line, dot);
    return { line, dot };
  });

  const S = { in: reduced ? 1 : 0 };
  if (!reduced && g()) {
    const tl = g().timeline({ paused: true });
    tl.to(S, { in: 1, duration: 1.5, ease: 'expo.out' });
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tl.play(); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(renderer.domElement.parentElement);
  }

  let active = -1, aspectDist = 1;
  hooks.set = (i) => { active = i; };
  const R = 2.7, tmp = new THREE.Vector3();
  return {
    resize(w, h) { aspectDist = w / h < 1 ? 1.35 : 1; },
    update(time) {
      hub.position.y = Math.sin(time * 0.9) * 0.07;
      hub.rotation.y = reduced ? -0.2 : Math.sin(time * 0.5) * 0.2;
      hub.scale.setScalar(0.6 + 0.4 * S.in);
      gear.rotation.z = reduced ? 0 : time * 0.8;
      tiles.forEach((tl, i) => {
        const a = (i / tiles.length) * Math.PI * 2 + Math.PI / 4 + (reduced ? 0 : time * 0.28);
        const r = R * S.in;
        tl.lift += ((i === active ? 0.45 : 0) - tl.lift) * 0.15;
        tl.grp.position.set(Math.cos(a) * r, Math.sin(time * 0.8 + i * 1.7) * 0.12 + tl.lift, Math.sin(a) * r * 0.85);
        tl.grp.rotation.y = -a * 0.25 + 0.25;
        tl.grp.scale.setScalar((0.001 + 0.999 * S.in) * (1 + tl.lift * 0.3));
        const { line, dot } = links[i];
        const pos = line.geometry.attributes.position;
        pos.setXYZ(0, hub.position.x, hub.position.y, hub.position.z); pos.setXYZ(1, tl.grp.position.x, tl.grp.position.y, tl.grp.position.z);
        pos.needsUpdate = true; line.visible = dot.visible = S.in > 0.6;
        line.material.opacity = i === active ? 1 : 0.55;
        tmp.copy(tl.grp.position).sub(hub.position);
        dot.position.copy(hub.position).addScaledVector(tmp, reduced ? 0.5 : (time * 0.33 + i / tiles.length) % 1);
      });
      camera.position.set(pointer.x * 1.5, 2.8 + pointer.y * 0.8, 9.8).multiplyScalar(aspectDist);
      camera.lookAt(0, 0, 0);
    },
  };
}
