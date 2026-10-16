// Presentations page scenes: hero cover-flow, "start from the data", "always the latest figures".
import { THREE, mat, palette, reduced } from './stage.js';
import { card, face, shadowFloor } from './dash-common.js';
import { drawTitleSlide, drawChartSlide, drawSummarySlide, drawLineSlide, drawClosingSlide, drawSheet, VERSIONS, VENDORS } from './pres-faces.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const g = () => window.gsap;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// A thin tube that is rebuilt only when its end points move.
function makeLine(root) {
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: palette.brand, transparent: true }));
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 14), new THREE.MeshBasicMaterial({ color: palette.accent }));
  root.add(mesh, pulse);
  let key = '', curve = null;
  const L = {
    mesh, pulse, amount: 1, count: 0,
    set(a, b, lift = 0.8) {
      const k = [a.x, a.y, a.z, b.x, b.y, b.z].map((v) => v.toFixed(3)).join();
      if (k !== key) {
        key = k;
        const mid = a.clone().lerp(b, 0.5); mid.y += lift; mid.z += 0.4;
        curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
        mesh.geometry.dispose(); mesh.geometry = new THREE.TubeGeometry(curve, 40, 0.012, 5, false);
        L.count = mesh.geometry.index.count;
      }
      mesh.geometry.setDrawRange(0, Math.floor((L.count * L.amount) / 3) * 3);
      mesh.visible = L.amount > 0.01; mesh.material.opacity = 1;
    },
    pulseAt(u) { if (curve) { pulse.position.copy(curve.getPoint(clamp(u))); pulse.visible = u > 0 && u < 1; } },
  };
  pulse.visible = false;
  return L;
}

const SLIDE_W = 3.6, SLIDE_H = 2.025;
function slideSet() {
  const draws = [drawTitleSlide, drawChartSlide, drawSummarySlide, drawLineSlide, drawClosingSlide];
  return draws.map((d) => card(SLIDE_W, SLIDE_H, face(1280, 720, d), 0.06, 0.1));
}

/* ---------- hero: deal out, then cover-flow driven by scroll ---------- */
export function heroScene(api) {
  const { root, camera, pointer, state, key } = api;
  key.position.set(3, 7, 7);
  
  const slides = slideSet();
  const n = slides.length;
  slides.forEach((s) => root.add(s));
  const sheet = card(2.0, 1.29, face(960, 620, drawSheet), 0.06, 0.1);
  sheet.position.set(-1.45, -1.32, 1.0); sheet.rotation.set(-0.12, 0.42, 0); root.add(sheet);
  const line = makeLine(root);

  const deal = slides.map(() => ({ v: reduced ? 1 : 0 }));
  const S = { sheet: reduced ? 1 : 0, line: reduced ? 1 : 0, pulse: 0 };
  if (!reduced && g()) {
    const tl = g().timeline({ delay: 0.25 });
    tl.to(deal[0], { v: 1, duration: 1.1, ease: 'expo.out' }, 0);
    for (let i = 1; i < n; i++) tl.to(deal[i], { v: 1, duration: 1.5, ease: 'expo.out' }, 0.45 + (i - 1) * 0.14);
    tl.to(S, { sheet: 1, duration: 1.1, ease: 'expo.out' }, 0.9);
    tl.to(S, { line: 1, duration: 1.0, ease: 'power2.inOut' }, 1.7);
    tl.to(S, { pulse: 1, duration: 0.01 }, 2.7);
  }

  let dist = 10.2;
  const flow = (i, cur) => {
    const o = i - cur, ao = Math.abs(o), sg = Math.sign(o) || 1;
    return {
      x: sg * (Math.min(ao, 1) * 1.85 + Math.max(0, ao - 1) * 0.7),
      z: -Math.min(ao, 3) * 0.85,
      ry: -clamp(o, -1, 1) * 0.72, ao,
    };
  };
  return {
    resize(w, h) { const a = w / h; dist = Math.max(4.7 / (0.2867 * a), 10.2); },
    update(t) {
      const cur = state.progress * (n - 1);
      slides.forEach((s, i) => {
        const f = flow(i, cur), e = deal[i].v;
        const sx = 0.2 + i * 0.0, sz = 0.2 + (n - 1 - i) * 0.05;
        s.position.set(sx + (f.x - sx) * e, 0.25 + Math.sin(e * Math.PI) * 0.35 * (i ? 1 : 0), sz + (f.z - sz) * e);
        s.rotation.set(0, f.ry * e, (1 - e) * (i - 2) * 0.02);
        s.scale.setScalar(0.9 + 0.1 * e);
        s.visible = f.ao < 3.2 && e > 0.001;
      });
      sheet.position.y = -1.32 + Math.sin(t * 0.8) * 0.05 - (1 - S.sheet) * 1.0;
      sheet.scale.setScalar(0.7 + 0.3 * S.sheet); sheet.visible = S.sheet > 0.01;
      root.updateMatrixWorld(true);
      line.amount = S.line;
      line.set(sheet.localToWorld(V(1.0, 0.5, 0.06)), slides[0].localToWorld(V(-1.6, -0.5, 0.06)), 0.7);
      line.mesh.visible = S.line > 0.01;
      line.pulseAt(S.pulse > 0.5 && !reduced ? (t * 0.3) % 1 : -1);
      camera.position.set(0.4 + pointer.x * 0.7, 1.0 + pointer.y * 0.4, dist);
      camera.lookAt(0, -0.05, 0);
    },
  };
}

/* ---------- start from the data: slides come out of the sheet ---------- */
export function buildScene(api) {
  const { root, camera, state, pointer, key } = api;
  key.position.set(3, 7, 7);
  
  const sheet = card(2.4, 1.55, face(960, 620, drawSheet), 0.06, 0.1);
  sheet.position.set(-2.35, -0.1, 0); sheet.rotation.y = 0.38; root.add(sheet);
  const draws = [drawTitleSlide, drawChartSlide, drawSummarySlide];
  const slides = draws.map((d) => { const c = card(2.5, 1.406, face(1280, 720, d), 0.05, 0.09); root.add(c); return c; });
  const lines = slides.map(() => makeLine(root));
  const origin = V(-1.6, -0.1, 0.1);
  const tgt = [V(1.5, 1.2, 0), V(1.8, 0.0, 0.25), V(2.1, -1.2, 0.5)];
  if (reduced) state.progress = 1;
  let dist = 10.6;
  return {
    resize(w, h) { const a = w / h; dist = Math.max(3.9 / (0.2867 * a), 7.6); },
    update(t) {
      const p = state.progress;
      slides.forEach((s, k) => {
        const u = clamp((p - k * 0.2) / 0.45), e = easeOut(u);
        s.position.lerpVectors(origin, tgt[k], e);
        s.rotation.y = 0.3 + (-0.32 - 0.3) * e;
        s.scale.setScalar(0.3 + 0.7 * e); s.visible = u > 0.01;
        lines[k].amount = clamp(u * 1.6);
      });
      root.updateMatrixWorld(true);
      slides.forEach((s, k) => {
        lines[k].set(sheet.localToWorld(V(1.1, 0.3 - k * 0.3, 0.05)), s.localToWorld(V(-1.2, 0, 0.05)), 0.4 + k * 0.1);
        lines[k].pulseAt(reduced ? -1 : slides[k].visible && lines[k].amount > 0.99 ? ((t * 0.35 + k * 0.3) % 1) : -1);
      });
      camera.position.set(0.2 + pointer.x * 0.6, 0.7 + pointer.y * 0.3, dist);
      camera.lookAt(0, 0, 0);
    },
  };
}

/* ---------- always the latest figures ---------- */
export function latestScene(api, hooks = {}) {
  const { root, camera, pointer, key } = api;
  key.position.set(3, 7, 7);
  
  const vals = VERSIONS[0].slice();
  const sheetFace = face(960, 620, drawSheet); sheetFace.redraw({ vals: vals.slice(), changed: [] });
  const slideFace = face(1280, 720, drawChartSlide); slideFace.redraw({ vals });
  const sheet = card(2.5, 1.615, sheetFace, 0.06, 0.1); sheet.position.set(-2.1, -0.05, 0); sheet.rotation.y = 0.3; root.add(sheet);
  const slide = card(3.3, 1.856, slideFace, 0.07, 0.12); slide.position.set(1.75, 0.2, -0.1); slide.rotation.y = -0.2; root.add(slide);
  const line = makeLine(root);
  let pulseU = -1, cur = 0;
  const redrawSlide = () => slideFace.redraw({ vals });

  hooks.setVersion = (i) => {
    const next = VERSIONS[i];
    const changed = next.map((v, k) => (v !== VERSIONS[cur][k] ? k : -1)).filter((k) => k >= 0);
    cur = i;
    sheetFace.redraw({ vals: next.slice(), changed });
    if (reduced || !g()) { next.forEach((v, k) => (vals[k] = v)); redrawSlide(); hooks.onVersion?.(i, changed, next); return; }
    const target = {}; next.forEach((v, k) => (target[k] = v));
    g().to(vals, { ...target, duration: 1.3, ease: 'expo.out', delay: 0.5, onUpdate: redrawSlide });
    const P = { u: 0 };
    g().to(P, { u: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: () => (pulseU = P.u), onComplete: () => (pulseU = -1) });
    hooks.onVersion?.(i, changed, next);
  };
  hooks.versions = VERSIONS.length;

  let dist = 9.8;
  return {
    resize(w, h) { const a = w / h; dist = Math.max(3.8 / (0.2867 * a), 6.8); },
    update(t) {
      sheet.position.y = -0.05 + Math.sin(t * 0.8) * 0.04;
      slide.position.y = 0.2 + Math.sin(t * 0.8 + 1) * 0.05;
      root.updateMatrixWorld(true);
      line.set(sheet.localToWorld(V(1.2, 0.4, 0.05)), slide.localToWorld(V(-1.65, -0.4, 0.07)), 0.5);
      line.pulseAt(pulseU);
      camera.position.set(0.2 + pointer.x * 0.6, 0.7 + pointer.y * 0.3, dist);
      camera.lookAt(0, 0, 0);
    },
  };
}






