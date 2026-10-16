// Canvas faces for the Presentations scenes (slides + data sheet).
import { rr, FONT } from './dash-common.js';

const INK = '#0e1020', MUTED = '#6b7088', LINE = '#e3e5ee', BRAND = '#4f46e5', ORANGE = '#ff5c00', OK = '#0f8a5f';
export const VENDORS = ['Alder Freight', 'Birch Packaging', 'Cobalt Metals', 'Delta Logistics', 'Elm Components'];
export const VERSIONS = [
  [412, 298, 655, 371, 520],
  [412, 341, 655, 486, 520],
  [412, 341, 590, 486, 612],
];
const R = 38;

function frame(c, W, H, fill) { rr(c, 0, 0, W, H, R); c.fillStyle = fill; c.fill(); }

export function drawTitleSlide(c, W, H) {
  frame(c, W, H, BRAND);
  c.fillStyle = 'rgba(255,255,255,.72)'; c.font = `500 34px ${FONT}`; c.fillText('Quarterly review', 84, 120);
  c.fillStyle = '#fff'; c.font = `600 108px ${FONT}`;
  c.fillText('Vendor spend', 80, 330); c.fillText('review', 80, 440);
  c.fillStyle = ORANGE; rr(c, 84, 520, 64, 12, 6); c.fill();
  c.fillStyle = 'rgba(255,255,255,.8)'; c.font = `500 32px ${FONT}`; c.fillText('Generated from vendor_spend.xlsx', 84, 610);
}

export function drawChartSlide(c, W, H, { vals = VERSIONS[0], total } = {}) {
  frame(c, W, H, '#fff');
  const sum = total ?? vals.reduce((a, b) => a + b, 0);
  c.fillStyle = MUTED; c.font = `500 32px ${FONT}`; c.fillText('Spend by vendor, Q3', 80, 112);
  c.fillStyle = INK; c.font = `600 104px ${FONT}`; c.fillText('$' + (sum / 1000).toFixed(2) + 'M', 76, 232);
  const x0 = 80, base = 640, maxH = 300, bw = 118, gap = (W - 160 - bw * 5) / 4;
  const max = Math.max(...vals);
  c.fillStyle = LINE; c.fillRect(70, base, W - 140, 2);
  vals.forEach((v, i) => {
    const h = (v / 800) * maxH * 1.0, x = x0 + i * (bw + gap);
    c.fillStyle = v === max ? ORANGE : '#8f93f1'; rr(c, x, base - h, bw, h, 16); c.fill();
    c.fillStyle = INK; c.font = `600 28px ${FONT}`; c.textAlign = 'center'; c.fillText(String(Math.round(v)), x + bw / 2, base - h - 14);
    c.fillStyle = MUTED; c.font = `500 24px ${FONT}`; c.fillText(VENDORS[i].split(' ')[0], x + bw / 2, base + 40);
    c.textAlign = 'left';
  });
}

export function drawSummarySlide(c, W, H) {
  frame(c, W, H, '#f4f5f9');
  c.fillStyle = INK; c.font = `600 76px ${FONT}`; c.fillText('Summary', 80, 150);
  const items = ['Cobalt Metals is the largest vendor', 'Spend is spread across five vendors', 'Every figure links back to vendor_spend.xlsx'];
  items.forEach((t, i) => {
    const y = 270 + i * 134;
    c.fillStyle = i === 0 ? ORANGE : BRAND; rr(c, 80, y - 34, 18, 18, 6); c.fill();
    c.fillStyle = INK; c.font = `500 46px ${FONT}`; c.fillText(t, 124, y - 14);
    c.fillStyle = LINE; c.fillRect(80, y + 40, W - 160, 2);
  });
}

export function drawLineSlide(c, W, H) {
  frame(c, W, H, '#fff');
  c.fillStyle = MUTED; c.font = `500 32px ${FONT}`; c.fillText('Monthly trend', 80, 112);
  c.fillStyle = INK; c.font = `600 72px ${FONT}`; c.fillText('Spend by month', 76, 200);
  const pts = [0.3, 0.38, 0.34, 0.5, 0.46, 0.62, 0.6, 0.78, 0.74, 0.9];
  const x0 = 90, x1 = W - 90, y0 = 640, y1 = 300;
  for (let k = 0; k < 4; k++) { c.fillStyle = LINE; c.fillRect(x0, y0 - k * 113, x1 - x0, 2); }
  c.beginPath();
  pts.forEach((p, i) => { const x = x0 + (x1 - x0) * i / 9, y = y0 - (y0 - y1) * p; i ? c.lineTo(x, y) : c.moveTo(x, y); });
  c.strokeStyle = BRAND; c.lineWidth = 8; c.lineJoin = 'round'; c.stroke();
  const lx = x1, ly = y0 - (y0 - y1) * 0.9;
  c.fillStyle = ORANGE; c.beginPath(); c.arc(lx, ly, 16, 0, 7); c.fill();
}

export function drawClosingSlide(c, W, H) {
  frame(c, W, H, '#eeedff');
  c.fillStyle = BRAND; c.font = `500 32px ${FONT}`; c.fillText('Next steps', 84, 120);
  c.fillStyle = INK; c.font = `600 88px ${FONT}`; c.fillText('Review the top', 80, 300); c.fillText('three vendors', 80, 400);
  c.fillStyle = MUTED; c.font = `500 34px ${FONT}`; c.fillText('Refresh from the connection before the meeting', 84, 520);
}

export function drawSheet(c, W, H, { vals = VERSIONS[0], changed = [] } = {}) {
  rr(c, 0, 0, W, H, 44); c.fillStyle = '#fff'; c.fill();
  rr(c, 34, 30, 58, 58, 15); c.fillStyle = '#e2f6ee'; c.fill();
  c.strokeStyle = OK; c.lineWidth = 4; c.strokeRect(49, 45, 28, 28); c.beginPath(); c.moveTo(49, 59); c.lineTo(77, 59); c.moveTo(63, 45); c.lineTo(63, 73); c.stroke();
  c.fillStyle = INK; c.font = `600 32px ${FONT}`; c.fillText('vendor_spend.xlsx', 112, 58);
  c.fillStyle = OK; c.font = `600 22px ${FONT}`; c.fillText('Connected', 112, 86);
  const rh = 62, ty = 118;
  const rows = [['Vendor', 'Q3 spend ($k)'], ...VENDORS.map((v, i) => [v, String(Math.round(vals[i]))])];
  rows.forEach((r, i) => {
    const y = ty + i * rh, hot = i > 0 && changed.includes(i - 1);
    if (i === 0) { c.fillStyle = '#f4f5f9'; c.fillRect(34, y, W - 68, rh); }
    if (hot) { c.fillStyle = '#fff1e8'; c.fillRect(34, y, W - 68, rh); c.fillStyle = ORANGE; c.fillRect(34, y, 8, rh); }
    c.fillStyle = i === 0 ? MUTED : INK; c.font = `${hot ? 600 : 500} 27px ${FONT}`;
    c.fillText(r[0], 60, y + 40); c.textAlign = 'right'; c.fillText(r[1], W - 60, y + 40); c.textAlign = 'left';
    c.fillStyle = LINE; c.fillRect(34, y + rh - 1, W - 68, 1);
  });
}
