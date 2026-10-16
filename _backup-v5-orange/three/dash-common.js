// Shared helpers for the Dashboards page scenes: rounded columns, plinths, canvas UI faces.
import { THREE, mat, slab, palette } from './stage.js';

export const FONT = '"Geist", system-ui, -apple-system, "Segoe UI", sans-serif';
export const TONES = ['#ffc7b0', '#ffa684', '#ff8f66', '#ff7a4d', '#ff5f33', '#ff4a1c', '#e63a10'];

export function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

// Canvas texture that can be redrawn (after the webfont loads, or when data changes).
export function face(W, H, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  let last;
  const f = { canvas, ctx, tex, W, H, redraw(extra) { if (extra !== undefined) last = extra; ctx.clearRect(0, 0, W, H); draw(ctx, W, H, last); tex.needsUpdate = true; } };
  f.redraw();
  if (document.fonts) { document.fonts.load('600 40px Geist').then(() => document.fonts.ready).then(() => f.redraw()).catch(() => {}); }
  return f;
}

// A card: white rounded slab with a UI texture on its front.
export function card(w, h, f, d = 0.07, r = 0.12) {
  const g = new THREE.Group();
  const body = slab(w, h, d, r, mat.matte('#ffffff', { roughness: 0.5 }));
  g.add(body);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: f.tex, transparent: true, toneMapped: false }));
  plane.position.z = d / 2 + 0.02 + 0.004;
  g.add(plane);
  return g;
}

export function column(w, color, accent = false) {
  const r = w * 0.26, x = w / 2;
  const s = new THREE.Shape();
  s.moveTo(-x + r, -x); s.lineTo(x - r, -x); s.quadraticCurveTo(x, -x, x, -x + r);
  s.lineTo(x, x - r); s.quadraticCurveTo(x, x, x - r, x);
  s.lineTo(-x + r, x); s.quadraticCurveTo(-x, x, -x, x - r);
  s.lineTo(-x, -x + r); s.quadraticCurveTo(-x, -x, -x + r, -x);
  const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.02, bevelSegments: 3, curveSegments: 8 });
  g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, accent ? mat.gloss(color, { roughness: 0.25 }) : mat.clay(color, { roughness: 0.38 }));
  m.castShadow = m.receiveShadow = true;
  return m;
}

// Flat plinth: top surface at y = 0 (columns stand on it). slab() thickness is along z, so lay it flat.
export function plinth(w, dpt, h = 0.3, color = '#f1ede6') {
  const m = slab(w, dpt, h, Math.min(0.3, dpt * 0.18), mat.clay(color, { roughness: 0.5, clearcoat: 0.15 }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = -h / 2 - 0.02;
  return m;
}

export function shadowFloor(y = -0.4, size = 30, opacity = 0.16) {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity }));
  p.rotation.x = -Math.PI / 2; p.position.y = y; p.receiveShadow = true;
  return p;
}

// ---- UI faces -------------------------------------------------------------
const INK = '#1a1714', MUTED = '#6b7088', LINE = '#e9e5de', BRAND = '#ff4a1c', ORANGE = '#1b1a18', OK = '#0f8a5f';

export function drawKpi(c, W, H) {
  rr(c, 0, 0, W, H, 54); c.fillStyle = '#fff'; c.fill();
  c.fillStyle = MUTED; c.font = `500 30px ${FONT}`; c.fillText('Vendor spend, Q3', 48, 78);
  c.fillStyle = INK; c.font = `600 112px ${FONT}`; c.fillText('$4.28M', 44, 196);
  c.fillStyle = '#e2f6ee'; rr(c, 48, 224, 232, 48, 24); c.fill();
  c.fillStyle = OK; c.font = `600 26px ${FONT}`; c.fillText('+12.4% vs Q2', 68, 257);
  const pts = [0.2, 0.34, 0.28, 0.46, 0.4, 0.58, 0.52, 0.7, 0.86];
  const x0 = 330, x1 = W - 48, y0 = 440, y1 = 300;
  c.beginPath();
  pts.forEach((p, i) => { const x = x0 + (x1 - x0) * (i / (pts.length - 1)), y = y0 - (y0 - y1) * p; i ? c.lineTo(x, y) : c.moveTo(x, y); });
  c.strokeStyle = BRAND; c.lineWidth = 6; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke();
  const lx = x1, ly = y0 - (y0 - y1) * pts[pts.length - 1];
  c.fillStyle = ORANGE; c.beginPath(); c.arc(lx, ly, 13, 0, 7); c.fill();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(lx, ly, 5, 0, 7); c.fill();
  c.fillStyle = MUTED; c.font = `500 24px ${FONT}`; c.fillText('Source: vendor_spend.xlsx', 48, 450);
}

export function drawSource(c, W, H) {
  rr(c, 0, 0, W, H, 50); c.fillStyle = '#fff'; c.fill();
  rr(c, 36, 34, 64, 64, 16); c.fillStyle = '#e2f6ee'; c.fill();
  c.strokeStyle = OK; c.lineWidth = 4;
  c.strokeRect(54, 52, 28, 28); c.beginPath(); c.moveTo(54, 66); c.lineTo(82, 66); c.moveTo(68, 52); c.lineTo(68, 80); c.stroke();
  c.fillStyle = INK; c.font = `600 34px ${FONT}`; c.fillText('vendor_spend.xlsx', 120, 62);
  c.fillStyle = OK; c.font = `600 24px ${FONT}`; c.fillText('Connected', 120, 92);
  const rows = [['Vendor', 'Q3 ($k)'], ['Alder Freight', '412'], ['Birch Packaging', '298'], ['Cobalt Metals', '655'], ['Delta Logistics', '371'], ['Elm Components', '520']];
  const ty = 132, rh = 54;
  rows.forEach((r, i) => {
    const y = ty + i * rh;
    if (i === 0) { c.fillStyle = '#f6f3ee'; c.fillRect(36, y, W - 72, rh); }
    if (i === 3) { c.fillStyle = '#fff1e8'; c.fillRect(36, y, W - 72, rh); c.fillStyle = ORANGE; c.fillRect(36, y, 8, rh); }
    c.fillStyle = i === 0 ? MUTED : INK; c.font = `${i === 0 ? 500 : 500} 26px ${FONT}`;
    c.fillText(r[0], 62, y + 36); c.textAlign = 'right'; c.fillText(r[1], W - 62, y + 36); c.textAlign = 'left';
    c.fillStyle = LINE; c.fillRect(36, y + rh - 1, W - 72, 1);
  });
}

export function drawLabel(c, W, H, { name, meta, tone }) {
  rr(c, 0, 0, W, H, 40); c.fillStyle = '#fff'; c.fill();
  c.fillStyle = tone; rr(c, 36, 44, 22, 22, 7); c.fill();
  c.fillStyle = INK; c.font = `600 50px ${FONT}`; c.fillText(name, 76, 66);
  c.fillStyle = MUTED; c.font = `500 32px ${FONT}`; c.fillText(meta, 36, 140);
}
