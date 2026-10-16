// Dashboards page chart-type scenes: donut, pie, line. Data comes from the stage's data-* attributes.
import { THREE, mat, reduced } from './stage.js';
import { plinth, shadowFloor } from './dash-common.js';

const g = () => window.gsap;
const TAU = Math.PI * 2;

// Annular wedge (r0 = 0 gives a pie slice) extruded upward by h. Angles run clockwise seen from above.
function wedge(r0, r1, a0, a1, h, color) {
  const s = new THREE.Shape();
  s.moveTo(Math.cos(a0) * r1, Math.sin(a0) * r1);
  s.absarc(0, 0, r1, a0, a1, false);
  if (r0 > 0) { s.lineTo(Math.cos(a1) * r0, Math.sin(a1) * r0); s.absarc(0, 0, r0, a1, a0, true); }
  else s.lineTo(0, 0);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 32 });
  geo.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(geo, mat.clay(color, { roughness: 0.38 }));
  m.castShadow = m.receiveShadow = true;
  return m;
}

// Shared builder for the donut and the pie: sliced disc on a plinth, hover pops a slice out.
function sliceChart(api, hooks, { inner, height }) {
  const { root, camera, renderer, pointer, key } = api;
  const data = JSON.parse(renderer.domElement.parentElement.dataset.slices);
  const total = data.reduce((s, d) => s + d[0], 0);
  key.position.set(4, 8, 6);
  root.add(shadowFloor(-0.05, 30, 0.14));
  root.add(plinth(5.2, 5.2, 0.28));

  const disc = new THREE.Group(); root.add(disc);
  let acc = 0;
  const gap = 0.025;
  const slices = data.map(([v, color], i) => {
    const a0 = (acc / total) * TAU, a1 = ((acc += v) / total) * TAU;
    const m = wedge(inner, 2.3, a0 + gap, a1 - gap, height, color);
    // rotateX(-90deg) maps shape y to world -z, so a slice's mid-direction is (cos, -sin) on the ground plane
    const mid = (a0 + a1) / 2;
    m.userData = { i, dir: new THREE.Vector2(Math.cos(mid), -Math.sin(mid)), out: 0, h: 1 };
    m.scale.y = reduced ? 1 : 0.001;
    disc.add(m);
    return m;
  });
  const S = { spin: reduced ? 0 : -1.4 };
  if (!reduced && g()) {
    const tl = g().timeline({ scrollTrigger: { trigger: renderer.domElement.parentElement, start: 'top 85%', once: true } });
    slices.forEach((m, i) => tl.to(m.scale, { y: 1, duration: 1.1, ease: 'back.out(1.3)' }, i * 0.1));
    tl.to(S, { spin: 0, duration: 1.8, ease: 'power3.out' }, 0);
  }

  let active = -1, aspectDist = 1;
  hooks.set = (i) => { active = i; };
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), el = renderer.domElement;
  el.style.touchAction = 'pan-y';
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(slices, false)[0];
    active = hit ? hit.object.userData.i : -1;
    el.style.cursor = hit ? 'pointer' : '';
    hooks.onHover?.(active);
  });
  el.addEventListener('pointerleave', () => { active = -1; hooks.onHover?.(-1); });

  return {
    resize(w, h) { aspectDist = w / h < 1 ? 1.2 : 1; },
    update(t) {
      disc.rotation.y = S.spin + (reduced ? 0 : Math.sin(t * 0.35) * 0.25);
      camera.position.set(pointer.x * 1.2, 6.2 + pointer.y * 0.8, 7.4).multiplyScalar(aspectDist);
      camera.lookAt(0, 0.2, 0);
      slices.forEach((m) => {
        const u = m.userData, on = u.i === active;
        u.out += ((on ? 0.3 : 0) - u.out) * 0.16;
        m.position.set(u.dir.x * u.out, on ? 0.12 : 0, u.dir.y * u.out);
      });
    },
  };
}

export const donutScene = (api, hooks = {}) => sliceChart(api, hooks, { inner: 1.1, height: 0.7 });
export const pieScene = (api, hooks = {}) => sliceChart(api, hooks, { inner: 0, height: 0.7 });

/* ---------- line: tube through the points, area ribbon underneath, pulse travelling along it ---------- */
export function lineScene(api) {
  const { root, camera, renderer, pointer, key } = api;
  const vals = JSON.parse(renderer.domElement.parentElement.dataset.values);
  const lo = Math.min(...vals) * 0.8, hi = Math.max(...vals);
  key.position.set(4, 8, 6);
  root.add(shadowFloor(-0.05, 30, 0.14));
  root.add(plinth(6.2, 3.4, 0.28));

  const W = 5.2, H = 2.6;
  const pts = vals.map((v, i) => new THREE.Vector3((i / (vals.length - 1) - 0.5) * W, 0.3 + ((v - lo) / (hi - lo)) * H, 0));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  const line = new THREE.Group(); root.add(line);

  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.07, 12, false), mat.gloss('#5b4fd6'));
  tube.castShadow = true; line.add(tube);
  const total = tube.geometry.index.count;

  const area = new THREE.Shape();
  const samples = curve.getPoints(60);
  area.moveTo(samples[0].x, 0);
  samples.forEach((p) => area.lineTo(p.x, p.y));
  area.lineTo(samples[samples.length - 1].x, 0); area.closePath();
  const ribbon = new THREE.Mesh(new THREE.ExtrudeGeometry(area, { depth: 0.5, bevelEnabled: false }), mat.matte('#9a90ea', { transparent: true, opacity: 0.35 }));
  ribbon.position.z = -0.25; line.add(ribbon);

  const dots = pts.map((p) => {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 24), mat.gloss('#ffffff', { roughness: 0.2 }));
    d.position.copy(p); d.castShadow = true; line.add(d); return d;
  });
  const hotDot = dots[dots.length - 1]; hotDot.material = mat.gloss('#ff7a1a');
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: '#ff7a1a' }));
  line.add(pulse);

  const S = { draw: reduced ? 1 : 0 };
  if (!reduced && g()) g().to(S, { draw: 1, duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: renderer.domElement.parentElement, start: 'top 85%', once: true } });

  let aspectDist = 1;
  return {
    resize(w, h) { aspectDist = w / h < 1 ? 1.25 : 1; },
    update(t) {
      const d = S.draw;
      tube.geometry.setDrawRange(0, Math.floor((total * d) / 3) * 3);
      ribbon.scale.x = Math.max(0.001, d); ribbon.position.x = -(W / 2) * (1 - d) + 0;
      dots.forEach((p, i) => { const on = d >= i / (dots.length - 1) - 0.001; p.visible = on; p.scale.setScalar(on ? 1 : 0.001); });
      pulse.visible = d >= 1 && !reduced;
      if (pulse.visible) pulse.position.copy(curve.getPoint((t * 0.22) % 1));
      line.rotation.y = reduced ? -0.35 : -0.35 + Math.sin(t * 0.4) * 0.22;
      camera.position.set(pointer.x * 1.2, 4.6 + pointer.y * 0.8, 8.6).multiplyScalar(aspectDist);
      camera.lookAt(0, 1.3, 0);
    },
  };
}
