// Small helpers shared by the Naxie scenes: canvas textures, face planes, beam, easing.
import { THREE } from './stage.js';

export const FONT = '"Geist", system-ui, -apple-system, "Segoe UI", sans-serif';
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const smooth = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
export const outCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);
export const outBack = (x) => { x = clamp01(x); const c = 1.5; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const lerp = (a, b, t) => a + (b - a) * t;

const registry = [];
export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const redraw = () => { ctx.save(); ctx.clearRect(0, 0, w, h); draw(ctx, w, h); ctx.restore(); tex.needsUpdate = true; };
  redraw();
  registry.push(redraw);
  return tex;
}
// Re-draw once the web font is available so canvas text uses Geist.
if (document.fonts) {
  document.fonts.load('600 24px Geist').then(() => document.fonts.load('400 24px Geist')).then(() => registry.forEach((f) => f())).catch(() => {});
}

export function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// Wrap text; returns the y after the last line.
export function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; } else line = t;
  }
  if (line) { ctx.fillText(line, x, y); y += lh; }
  return y;
}

export function facePlane(w, h, tex, { transparent = false, glow = 0.3 } = {}) {
  const m = new THREE.MeshStandardMaterial({
    map: tex, roughness: 0.85, metalness: 0, transparent,
    emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: glow,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  mesh.receiveShadow = true;
  return mesh;
}

// Thin line with a dot at its tip; call beam.set(a, b, k) with k = 0..1 growth.
export function makeBeam(color = '#4f46e5', r = 0.022) {
  const g = new THREE.Group();
  const m = new THREE.MeshBasicMaterial({ color, toneMapped: false });
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), m);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(r * 3.4, 18, 14), m);
  g.add(cyl, dot);
  const up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
  g.set = (a, b, k) => {
    d.subVectors(b, a);
    const L = d.length();
    d.normalize();
    cyl.quaternion.setFromUnitVectors(up, d);
    cyl.scale.y = Math.max(L * k, 1e-4);
    cyl.position.copy(a).addScaledVector(d, (L * k) / 2);
    dot.position.copy(a).addScaledVector(d, L * k);
    g.visible = k > 0.001;
  };
  return g;
}

// Soft, blurred drop shadow drawn on a transparent plane (sits behind a slab). Cheaper and softer than a shadow map.
export function softShadow(w, h, { opacity = 0.2, blur = 0.35, radius = 0.2 } = {}) {
  const px = 128, cw = 512, ch = Math.round(512 * (h / w));
  const tex = canvasTex(cw, ch, (c) => {
    const pad = 70;
    c.filter = `blur(${Math.round(cw * blur * 0.1)}px)`;
    c.fillStyle = `rgba(20,22,50,${opacity})`;
    rr(c, pad, pad, cw - pad * 2, ch - pad * 2, radius * px);
    c.fill();
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w * (cw / (cw - 140)), h * (ch / (ch - 140))), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
  return m;
}
