// Dashboards page scenes: hero chart, report groups (scroll), source-backed hover chart.
import { THREE, mat, palette, reduced } from './stage.js';
import { column, plinth, shadowFloor, card, face, drawKpi, drawSource, drawLabel, TONES } from './dash-common.js';

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const g = () => window.gsap;

function fit(camera, w, h, base) {
  const a = w / h;
  return a < 1 ? base / Math.min(1, a * 1.05) : base;
}

/* ---------- hero ---------- */
export function heroScene(api) {
  const { root, camera, pointer, key } = api;
  key.position.set(5, 8, 6);
  root.add(shadowFloor(-0.05, 40, 0.14));

  const chart = new THREE.Group(); root.add(chart);
  const base = plinth(6.4, 2.5, 0.34); chart.add(base);
  const H = [0.8, 1.25, 1.0, 2.2, 1.5, 1.15, 1.75];
  const cols = H.map((h, i) => {
    const accent = i === 3;
    const c = column(0.58, accent ? palette.accent : TONES[Math.min(6, 1 + Math.round(h * 2))], accent);
    c.position.set((i - 3) * 0.86, 0, 0);
    c.scale.y = reduced ? h : 0.001;
    chart.add(c);
    return c;
  });
  // a few faint rows behind for depth
  const back = [0.5, 0.7, 0.55, 0.9, 0.65, 0.6, 0.8].map((h, i) => {
    const c = column(0.46, '#dfe1fa'); c.position.set((i - 3) * 0.86, 0, -0.85); c.scale.y = reduced ? h : 0.001; chart.add(c); return { c, h };
  });

  const kf = face(880, 500, drawKpi);
  const kpi = card(2.8, 1.59, kf); kpi.position.set(2.45, 3.05, -0.5); kpi.rotation.y = -0.3; root.add(kpi);
  const sf = face(760, 480, drawSource);
  const src = card(2.5, 1.58, sf); src.position.set(-3.05, 1.05, 1.9); src.rotation.y = 0.38; root.add(src);

  // traceability line: source slab -> accent column
  const p0 = new THREE.Vector3(-2.1, 1.35, 2.0), p1 = new THREE.Vector3(-0.9, 3.5, 1.2), p2 = new THREE.Vector3(0, 2.28, 0.1);
  const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.014, 6, false), new THREE.MeshBasicMaterial({ color: palette.brand }));
  root.add(tube);
  const total = tube.geometry.index.count;
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: palette.accent }));
  root.add(pulse);
  const S = { line: reduced ? 1 : 0, pulse: reduced ? 1 : 0, kpi: reduced ? 1 : 0, src: reduced ? 1 : 0 };
  tube.geometry.setDrawRange(0, Math.floor(total * S.line));
  const kpiY = kpi.position.y, srcY = src.position.y;

  if (!reduced && g()) {
    const tl = g().timeline({ delay: 0.2 });
    H.forEach((h, i) => tl.to(cols[i].scale, { y: h, duration: 1.5, ease: 'power4.out' }, i * 0.09));
    back.forEach((b, i) => tl.to(b.c.scale, { y: b.h, duration: 1.4, ease: 'power4.out' }, 0.15 + i * 0.07));
    tl.from(base.scale, { x: 0.86, y: 0.86, z: 0.86, duration: 1.2, ease: 'expo.out' }, 0);
    tl.to(S, { kpi: 1, duration: 1.1, ease: 'expo.out' }, 0.7);
    tl.to(S, { src: 1, duration: 1.1, ease: 'expo.out' }, 0.9);
    tl.to(S, { line: 1, duration: 1.0, ease: 'power2.inOut' }, 1.5);
    tl.to(S, { pulse: 1, duration: 0.01 }, 2.4);
  }

  let aspectDist = 13.9;
  return {
    resize(w, h) { aspectDist = fit(camera, w, h, 13.9); },
    update(t) {
      const px = pointer.x, py = pointer.y;
      camera.position.set(6.4 + px * 0.9, 5.6 + py * 0.5, 9.4).normalize().multiplyScalar(aspectDist).add(new THREE.Vector3(0, 0.6, 0));
      camera.lookAt(-0.35, 1.0, 0);
      kpi.position.y = kpiY + Math.sin(t * 0.9) * 0.07 - (1 - S.kpi) * 1.2;
      kpi.scale.setScalar(0.7 + 0.3 * S.kpi); kpi.visible = S.kpi > 0.01;
      src.position.y = srcY + Math.sin(t * 0.9 + 1.7) * 0.06 - (1 - S.src) * 1.2;
      src.scale.setScalar(0.7 + 0.3 * S.src); src.visible = S.src > 0.01;
      tube.geometry.setDrawRange(0, Math.floor((total * S.line) / 3) * 3);
      tube.visible = S.line > 0.01;
      pulse.visible = S.pulse > 0.5 && !reduced;
      if (pulse.visible) pulse.position.copy(curve.getPoint(((t * 0.32) % 1)));
    },
  };
}

/* ---------- report groups (scroll scrubbed) ---------- */
export function groupsScene(api, hooks = {}) {
  const { root, camera, state, key } = api;
  key.position.set(4, 9, 6);
  root.add(shadowFloor(-0.05, 50, 0.13));
  const defs = [
    { name: 'Operations review', tone: '#4f46e5', h: [0.7, 1.2, 0.95, 1.6] },
    { name: 'Vendor performance', tone: '#7c5cff', h: [1.4, 0.9, 1.1, 0.6] },
    { name: 'Finance', tone: '#9a9df3', h: [0.6, 0.85, 1.3, 1.05] },
  ];
  const groups = defs.map((d, i) => {
    const grp = new THREE.Group(); root.add(grp);
    grp.add(plinth(2.5, 2.0, 0.26));
    d.h.forEach((h, k) => {
      const accent = k === 1 && i === 0;
      const c = column(0.42, accent ? palette.accent : d.tone, accent);
      c.position.set((k - 1.5) * 0.58, 0, 0); c.scale.y = h; grp.add(c);
    });
    const lf = face(640, 190, (c, W, H) => drawLabel(c, W, H, { name: d.name, meta: '3 reports', tone: d.tone }));
    const label = card(1.9, 0.57, lf, 0.05, 0.09); label.position.set(0, 0.28, 1.35); label.rotation.x = -0.12; grp.add(label);
    return { grp, label };
  });
  const aim = new THREE.Vector3(0, 0.5, 0);
  let aspectDist = 1, narrow = false;
  if (reduced) state.progress = 1;
  hooks.active = 0;

  return {
    resize(w, h) { narrow = w / h < 0.9; aspectDist = narrow ? 1.9 : 1; },
    update() {
      const p = state.progress;
      const s = ease(clamp01(p / 0.4));
      const act = p < 0.4 ? -1 : Math.min(2, Math.floor(((p - 0.4) / 0.6) * 3));
      hooks.active = act;
      const spread = narrow ? [2.75, 2.75, 2.75] : [3.05, 3.05, 3.05];
      groups.forEach((o, i) => {
        const x = (i - 1) * (2.5 + (spread[i] - 2.5) * s);
        const z = ([0.9, -1.1, 1.0][i] * (narrow ? 1.9 : 1)) * s;
        const lift = (act === i ? 0.35 : 0) * s;
        o.grp.position.x += (x - o.grp.position.x) * 0.2;
        o.grp.position.z += (z - o.grp.position.z) * 0.2;
        o.grp.position.y += (lift - o.grp.position.y) * 0.12;
        const l = clamp01((s - 0.4) / 0.6);
        o.label.scale.setScalar(Math.max(0.001, l)); o.label.visible = l > 0.01;
      });
      const a = 0.62 - 1.15 * ease(clamp01(p));
      const R = 13.4 * aspectDist;
      camera.position.set(Math.sin(a) * R, 5.4 + p * 0.8, Math.cos(a) * R);
      camera.lookAt(aim);
    },
  };
}

/* ---------- source-backed: hover a column, find its row ---------- */
export const SOURCE_ROWS = [
  { vendor: 'Alder Freight', v: 412, row: 2 },
  { vendor: 'Birch Packaging', v: 298, row: 3 },
  { vendor: 'Cobalt Metals', v: 655, row: 4 },
  { vendor: 'Delta Logistics', v: 371, row: 5 },
  { vendor: 'Elm Components', v: 520, row: 6 },
  { vendor: 'Fjord Plastics', v: 244, row: 7 },
];

export function sourceScene(api, hooks = {}) {
  const { root, camera, renderer, pointer, key } = api;
  key.position.set(4, 8, 6);
  root.add(shadowFloor(-0.05, 40, 0.14));
  root.add(plinth(6.0, 2.6, 0.32));
  const max = Math.max(...SOURCE_ROWS.map((r) => r.v));
  const cols = SOURCE_ROWS.map((r, i) => {
    const h = (r.v / max) * 2.5;
    const c = column(0.64, '#6a68ea');
    c.position.set((i - 2.5) * 0.96, 0, 0); c.scale.y = reduced ? h : 0.001; c.userData = { i, h, lift: 0 };
    root.add(c);
    return c;
  });
  if (!reduced && g()) cols.forEach((c, i) => g().to(c.scale, { y: c.userData.h, duration: 1.2, delay: 0.2 + i * 0.08, ease: 'power4.out', scrollTrigger: { trigger: renderer.domElement.parentElement, start: 'top 80%', once: true } }));

  const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
  let active = -1, aspectDist = 1;
  const base = new THREE.Color('#6a68ea'), hot = new THREE.Color(palette.accent), dim = new THREE.Color('#aeb0f2');
  hooks.set = (i) => { active = i; };
  hooks.onHover = null;
  const el = renderer.domElement;
  const pick = (e) => {
    const r = el.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(cols, false)[0];
    const i = hit ? hit.object.userData.i : -1;
    el.style.cursor = i >= 0 ? 'pointer' : '';
    if (i !== active || e.type === 'pointerdown') { active = i; hooks.onHover?.(i, true); }
  };
  el.style.touchAction = 'pan-y';
  el.addEventListener('pointermove', pick);
  el.addEventListener('pointerdown', pick);
  el.addEventListener('pointerleave', () => { active = -1; hooks.onHover?.(-1, true); });

  return {
    resize(w, h) { aspectDist = fit(camera, w, h, 1) * (w / h < 1.2 ? 1.15 : 1); },
    update() {
      camera.position.set(5.4 + pointer.x * 0.5, 5.6 + pointer.y * 0.3, 9.2).multiplyScalar(1.12 * aspectDist);
      camera.lookAt(0, 0.9, 0);
      cols.forEach((c, i) => {
        const on = i === active, any = active >= 0;
        c.userData.lift += ((on ? 0.28 : 0) - c.userData.lift) * 0.18;
        c.position.y = c.userData.lift;
        const target = on ? hot : any ? dim : base;
        c.material.color.lerp(target, 0.18);
      });
    },
  };
}







