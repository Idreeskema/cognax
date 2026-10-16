// Home hero scene: a desktop monitor running the Cognax workspace. File tiles (PDF, XLSX, DOCX, folder) rest in front of
// it and, as the visitor scrolls (state.progress 0 -> 1), fly one by one into the window, upload, turn "Ready", and a
// Naxie answer card with a citation chip floats out of the screen.
import { THREE, mat, slab, reduced } from './stage.js';

const FONT = '"Geist", system-ui, -apple-system, "Segoe UI", sans-serif';
const INK = '#0e1020', MUTED = '#8a8fa8', LINE = '#e3e5ee', BRAND = '#4f46e5', VIOLET = '#7c5cff', ORANGE = '#ff5c00', SOFT = '#eeedff';

let curW = 1.5; // world width of the slab whose face is being drawn (for corner clipping)
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w * 2; c.height = h * 2;
  const g = c.getContext('2d');
  g.scale(2, 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const rad = 0.075 * w / curW;
  const run = () => { g.clearRect(0, 0, w, h); g.save(); g.beginPath(); g.roundRect(0, 0, w, h, rad); g.clip(); draw(g, w, h); g.restore(); tex.needsUpdate = true; };
  run();
  document.fonts?.ready.then(run);
  return tex;
}
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const smooth = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const clamp01 = (x) => THREE.MathUtils.clamp(x, 0, 1);
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ---- the files (illustrative, not customer data) ----
const FILES = [
  { kind: 'pdf', name: 'Services Agreement', ext: 'PDF', size: '2.4 MB', color: ORANGE },
  { kind: 'xls', name: 'Vendor register', ext: 'XLSX', size: '860 KB', color: VIOLET },
  { kind: 'doc', name: 'Master policy', ext: 'DOCX', size: '312 KB', color: BRAND },
  { kind: 'dir', name: 'Contracts 2024', ext: '', size: '38 files', color: '#ffa766' },
];
const START = [0.04, 0.19, 0.34, 0.49], FLY = 0.13, UP = 0.09; // timeline (progress units)
const ASK_AT = 0.72, ANS_AT = 0.81;
const QUESTION = 'How can we end the agreement?';

// file glyph: page with folded corner and type label, or a folder
function glyph(g, f, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (f.kind === 'dir') {
    g.fillStyle = '#ffd2b0'; rr(g, 0, 8, 100, 80, 12); g.fill();
    g.fillStyle = f.color; rr(g, 0, 0, 40, 24, 8); g.fill();
    g.fillStyle = '#ffb57d'; rr(g, 0, 22, 100, 66, 12); g.fill();
  } else {
    g.fillStyle = f.color; g.beginPath(); g.moveTo(14, 0); g.lineTo(62, 0); g.lineTo(88, 26); g.lineTo(88, 100 - 14); g.quadraticCurveTo(88, 100, 74, 100); g.lineTo(14, 100); g.quadraticCurveTo(0, 100, 0, 86); g.lineTo(0, 14); g.quadraticCurveTo(0, 0, 14, 0); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(62, 0); g.lineTo(88, 26); g.lineTo(62, 26); g.fill();
    g.fillStyle = '#fff'; g.font = `700 22px ${FONT}`; g.textAlign = 'center'; g.fillText(f.ext, 44, 72); g.textAlign = 'left';
  }
  g.restore();
}

// icon-tile face for a file resting on the desk
const tileFace = (f) => canvasTex(300, 340, (g, w, h) => {
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
  glyph(g, f, 66, 40, 1.7);
  g.textAlign = 'center';
  g.fillStyle = INK; g.font = `700 27px ${FONT}`; g.fillText(f.name, w / 2, 262);
  g.fillStyle = MUTED; g.font = `500 24px ${FONT}`; g.fillText(f.size, w / 2, 300);
  g.textAlign = 'left';
});

const answerFace = () => canvasTex(420, 170, (g, w, h) => {
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
  g.fillStyle = BRAND; rr(g, 22, 20, 28, 28, 14); g.fill();
  g.fillStyle = '#fff'; g.font = `700 13px ${FONT}`; g.fillText('N', 31, 39);
  g.fillStyle = INK; g.font = `600 15px ${FONT}`; g.fillText('Naxie', 60, 40);
  g.fillStyle = '#3a3e55'; g.font = `500 15px ${FONT}`;
  g.fillText('Either party can end the agreement with', 22, 82);
  g.fillText("60 days' written notice.", 22, 104);
  g.fillStyle = SOFT; rr(g, 22, 120, 172, 28, 14); g.fill();
  g.fillStyle = BRAND; g.font = `600 12px ${FONT}`; g.fillText('Services Agreement, p. 7', 35, 138);
});

function softShadowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(40,36,110,.55)'); r.addColorStop(1, 'rgba(40,36,110,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---- the monitor screen: a Cognax workspace window, redrawn from progress ----
const SW = 1440, SH = 900, INSET = 22;       // canvas px (incl. bezel) and bezel width
const IW = SW - INSET * 2, IH = SH - INSET * 2;
const ROW_Y = (i) => 205 + i * 98;             // inner coords
const ROW_X = 324;

function drawScreen(g, p, hot, rows) {
  g.clearRect(0, 0, SW, SH);
  g.fillStyle = '#0e1020'; rr(g, 0, 0, SW, SH, 44); g.fill();
  g.save(); g.translate(INSET, INSET); g.beginPath(); g.roundRect(0, 0, IW, IH, 26); g.clip();
  // wallpaper
  const bg = g.createLinearGradient(0, 0, IW, IH); bg.addColorStop(0, '#e9e6ff'); bg.addColorStop(1, '#fbeee6');
  g.fillStyle = bg; g.fillRect(0, 0, IW, IH);
  const blob = g.createRadialGradient(IW * 0.85, IH * 0.1, 0, IW * 0.85, IH * 0.1, 520); blob.addColorStop(0, 'rgba(124,92,255,.35)'); blob.addColorStop(1, 'rgba(124,92,255,0)');
  g.fillStyle = blob; g.fillRect(0, 0, IW, IH);
  // menu bar
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(0, 0, IW, 40);
  g.fillStyle = INK; g.font = `700 20px ${FONT}`; g.fillText('Cognax', 26, 27);
  g.font = `500 18px ${FONT}`; g.fillStyle = '#4b4f68'; g.fillText('File    Edit    View    Window', 130, 27);
  g.textAlign = 'right'; g.fillText('Tue 9:41', IW - 26, 27); g.textAlign = 'left';

  // window
  const wx = 64, wy = 62, ww = IW - 128, wh = IH - 94;
  g.save(); g.shadowColor = 'rgba(30,24,90,.28)'; g.shadowBlur = 50; g.shadowOffsetY = 20;
  g.fillStyle = '#fff'; rr(g, wx, wy, ww, wh, 22); g.fill(); g.restore();
  g.save(); g.beginPath(); g.roundRect(wx, wy, ww, wh, 22); g.clip(); g.translate(wx, wy);
  g.fillStyle = '#f7f7fb'; g.fillRect(0, 0, 230, wh);                       // sidebar
  g.fillStyle = LINE; g.fillRect(230, 0, 1, wh);
  ['#ff6159', '#ffbd2e', '#28c941'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(30 + i * 24, 30, 7, 0, 7); g.fill(); });
  g.fillStyle = BRAND; rr(g, 26, 76, 40, 40, 20); g.fill();
  g.fillStyle = '#fff'; g.font = `700 22px ${FONT}`; g.fillText('N', craft(g, 'N', 46), 104);
  g.fillStyle = INK; g.font = `700 26px ${FONT}`; g.fillText('Cognax', 78, 105);
  ['Workspace', 'Files', 'Naxie', 'Dashboards'].forEach((t, i) => {
    const y = 160 + i * 52;
    if (i === 1) { g.fillStyle = SOFT; rr(g, 14, y - 6, 202, 44, 12); g.fill(); }
    g.fillStyle = i === 1 ? BRAND : '#5b5f78'; g.font = `${i === 1 ? 600 : 500} 25px ${FONT}`; g.fillText(t, 40, y + 25);
  });
  // header
  const mx = 260, mw = ww - 260 - 40;
  g.fillStyle = INK; g.font = `700 40px ${FONT}`; g.fillText('Vendor review', mx, 62);
  const done = rows.filter((r) => r.u >= 1).length, shown = rows.filter((r) => r.a > 0).length;
  if (shown) {
    const t = `${done} of 4 ready`; g.font = `600 20px ${FONT}`; const tw = g.measureText(t).width + 32;
    g.fillStyle = SOFT; rr(g, mx + mw - tw, 32, tw, 40, 20); g.fill(); g.fillStyle = BRAND; g.fillText(t, mx + mw - tw + 16, 59);
  }
  // drop zone
  const dz = 1 - smooth(0, 1, Math.max(...rows.map((r) => r.a)));
  if (dz > 0.01) {
    g.save(); g.globalAlpha = dz;
    g.setLineDash([14, 12]); g.lineWidth = 3; g.strokeStyle = hot > 0 ? BRAND : '#c9c6fa';
    g.fillStyle = hot > 0 ? '#f1f0ff' : '#fafaff'; rr(g, mx, 100, mw, 480, 22); g.fill(); rr(g, mx, 100, mw, 480, 22); g.stroke(); g.setLineDash([]);
    g.fillStyle = hot > 0 ? BRAND : '#a9a4f0'; g.beginPath(); g.arc(mx + mw / 2, 300, 46, 0, 7); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(mx + mw / 2, 320); g.lineTo(mx + mw / 2, 282); g.moveTo(mx + mw / 2 - 16, 297); g.lineTo(mx + mw / 2, 280); g.lineTo(mx + mw / 2 + 16, 297); g.stroke();
    g.textAlign = 'center'; g.fillStyle = INK; g.font = `600 28px ${FONT}`; g.fillText('Drop files to upload', mx + mw / 2, 400);
    g.fillStyle = MUTED; g.font = `500 20px ${FONT}`; g.fillText('PDF, XLSX, DOCX and folders', mx + mw / 2, 436); g.textAlign = 'left';
    g.restore();
  }
  // file rows
  rows.forEach((r, i) => {
    if (r.a <= 0) return;
    const f = FILES[i], y = ROW_Y(i) - wy + (1 - r.a) * 16;
    g.save(); g.globalAlpha = r.a;
    g.fillStyle = '#fff'; g.strokeStyle = r.u >= 1 ? '#d9d6fb' : LINE; g.lineWidth = 2; rr(g, mx, y, mw, 84, 16); g.fill(); g.stroke();
    glyph(g, f, mx + 20, y + 16, 0.5);
    g.fillStyle = INK; g.font = `600 30px ${FONT}`; g.fillText(f.name, mx + 92, y + 39);
    g.fillStyle = MUTED; g.font = `500 22px ${FONT}`; g.fillText(`${f.ext ? f.ext + '  ·  ' : ''}${f.size}`, mx + 92, y + 66);
    const bx = mx + mw - 270, bw = 240;
    if (r.u < 1) {
      g.fillStyle = MUTED; g.font = `600 19px ${FONT}`; g.textAlign = 'right'; g.fillText(`${Math.round(r.u * 100)}%`, bx + bw, y + 36); g.textAlign = 'left';
      g.fillStyle = '#ececf5'; rr(g, bx, y + 50, bw, 10, 5); g.fill();
      if (r.u > 0) { const gr = g.createLinearGradient(bx, 0, bx + bw, 0); gr.addColorStop(0, BRAND); gr.addColorStop(1, VIOLET); g.fillStyle = gr; rr(g, bx, y + 50, Math.max(10, bw * r.u), 10, 5); g.fill(); }
    } else {
      const k = smooth(0, 1, r.rd), cx = bx + bw - 66, cy = y + 42;
      g.save(); g.translate(cx, cy); g.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k); g.globalAlpha = r.a * k;
      g.fillStyle = SOFT; rr(g, -66, -19, 132, 38, 19); g.fill();
      g.strokeStyle = BRAND; g.lineWidth = 3.2; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-42, 0); g.lineTo(-35, 7); g.lineTo(-24, -6); g.stroke();
      g.fillStyle = BRAND; g.font = `600 23px ${FONT}`; g.fillText('Ready', -14, 8);
      g.restore();
    }
    g.restore();
  });
  // ask bar
  const askA = smooth(ASK_AT - 0.03, ASK_AT, rows.p);
  if (askA > 0) {
    g.save(); g.globalAlpha = askA;
    const y = wh - 112;
    g.fillStyle = '#fff'; g.strokeStyle = rows.p >= ANS_AT - 0.02 ? '#c9c6fa' : BRAND; g.lineWidth = 2.5; rr(g, mx, y, mw, 72, 36); g.fill(); g.stroke();
    const n = Math.round(QUESTION.length * clamp01((rows.p - ASK_AT) / (ANS_AT - 0.025 - ASK_AT)));
    g.fillStyle = INK; g.font = `500 29px ${FONT}`; g.fillText(QUESTION.slice(0, n), mx + 32, y + 46);
    if (n < QUESTION.length) { const cw = g.measureText(QUESTION.slice(0, n)).width; g.fillStyle = BRAND; g.fillRect(mx + 34 + cw, y + 22, 3, 30); }
    g.fillStyle = BRAND; g.beginPath(); g.arc(mx + mw - 38, y + 36, 24, 0, 7); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 3.5; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(mx + mw - 38, y + 46); g.lineTo(mx + mw - 38, y + 26); g.moveTo(mx + mw - 47, y + 35); g.lineTo(mx + mw - 38, y + 26); g.lineTo(mx + mw - 29, y + 35); g.stroke();
    g.restore();
  }
  g.restore(); g.restore();
}
const craft = (g, t, cx) => cx - g.measureText(t).width / 2; // centre text on cx

export function buildHeroScene(api) {
  const { camera, root, pointer, state } = api;
  camera.position.set(0, 0.55, 10);
  camera.lookAt(0, -0.05, 0);
  root.position.y = 0.1;

  const rig = new THREE.Group();
  root.add(rig);

  // monitor
  const monitor = new THREE.Group();
  rig.add(monitor);
  const MW = 4.7, MH = 2.94, SCW = 4.56, SCH = SCW * SH / SW;
  const body = slab(MW, MH, 0.16, 0.12, mat.clay('#f6f6fb', { roughness: 0.35, clearcoat: 0.4 }));
  body.castShadow = body.receiveShadow = false;
  monitor.add(body);
  const sc = document.createElement('canvas'); sc.width = SW; sc.height = SH;
  const sg = sc.getContext('2d');
  const screenTex = new THREE.CanvasTexture(sc);
  screenTex.colorSpace = THREE.SRGBColorSpace; screenTex.anisotropy = 8;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCW, SCH), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false, transparent: true }));
  screen.position.z = 0.108;
  monitor.add(screen);
  const neck = slab(0.5, 1.05, 0.12, 0.05, mat.clay('#e4e6f2', { roughness: 0.45, clearcoat: 0.3 }));
  neck.position.set(0, -MH / 2 - 0.4, -0.12); neck.castShadow = neck.receiveShadow = false;
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.07, 56), mat.clay('#e4e6f2', { roughness: 0.45, clearcoat: 0.3 }));
  foot.position.set(0, -MH / 2 - 0.9, -0.05);
  monitor.add(neck, foot);
  monitor.position.set(0, 0.72, 0);

  // contact shadows
  const shTex = softShadowTexture();
  const mkShadow = (x, z, sx, sz, o) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, opacity: o, depthWrite: false, toneMapped: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, -1.72, z); m.scale.set(sx, sz, 1); rig.add(m); return m;
  };
  mkShadow(0, -0.1, 4.6, 1.5, 0.2);

  // file tiles
  const tileBody = mat.clay('#ffffff', { roughness: 0.5, clearcoat: 0.15 });
  const TW = 1.05, TH = TW * 340 / 300, XS = [-1.92, -0.64, 0.64, 1.92];
  const tiles = FILES.map((f, i) => {
    const g = new THREE.Group();
    const s = slab(TW, TH, 0.07, 0.09, tileBody); s.castShadow = s.receiveShadow = false;
    curW = TW;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(TW - 0.01, TH - 0.01), new THREE.MeshBasicMaterial({ map: tileFace(f), toneMapped: false, transparent: true }));
    face.position.z = 0.0565;
    g.add(s, face); rig.add(g);
    const sh = mkShadow(XS[i], 1.2, 1.2, 0.5, 0.16);
    return { g, sh, i, intro: reduced ? 1 : 0, phase: i * 1.9, home: new THREE.Vector3(XS[i], -1.62, 1.55), tilt: (i - 1.5) * -0.05 };
  });

  // answer card
  const AW = 2.3, AH = AW * 170 / 420;
  curW = AW;
  const card = new THREE.Group();
  const cb = slab(AW, AH, 0.07, 0.09, tileBody); cb.castShadow = cb.receiveShadow = false;
  const cf = new THREE.Mesh(new THREE.PlaneGeometry(AW - 0.01, AH - 0.01), new THREE.MeshBasicMaterial({ map: answerFace(), toneMapped: false, transparent: true }));
  cf.position.z = 0.0565;
  card.add(cb, cf); rig.add(card);
  const cardShadow = mkShadow(1.3, 0.9, 2.3, 0.7, 0);

  const vis = { p: 0, intro: reduced ? 1 : 0, cardIntro: reduced ? 1 : 0 };
  const rows = FILES.map(() => ({ a: 0, u: 0, rd: 0 })); rows.p = 0;
  let dirty = true, lastKey = '';
  document.fonts?.ready.then(() => { dirty = true; });

  // screen-space (inner canvas px) -> rig space, following the monitor's current pose
  const toRig = (px, py, z) => new THREE.Vector3(((px + INSET) / SW - 0.5) * SCW, (0.5 - (py + INSET) / SH) * SCH, z).applyEuler(monitor.rotation).add(monitor.position);
  const a0 = new THREE.Vector3(), a1 = new THREE.Vector3(), a2 = new THREE.Vector3();
  const EY = new THREE.Euler();

  const update = (t, dt) => {
    const target = reduced ? 1 : state.progress;
    vis.p += (target - vis.p) * (dt ? Math.min(dt * 7, 1) : 1);
    const p = vis.p, I = easeIO(vis.intro);

    rig.rotation.y = pointer.x * 0.14;
    rig.rotation.x = -pointer.y * 0.07;
    rig.position.y = Math.sin(t * 0.7) * 0.04;

    monitor.rotation.y = -0.34 + 0.2 * smooth(0.1, 0.95, p) + Math.sin(t * 0.45) * 0.015;
    monitor.rotation.x = 0.03;
    monitor.position.y = 0.72 - (1 - I) * 0.5;
    monitor.scale.setScalar(0.9 + 0.1 * I);

    let hot = 0;
    tiles.forEach((tl, i) => {
      const s = START[i], k = clamp01((p - s) / FLY), e = easeIO(k), arr = s + FLY;
      const ti = easeIO(tl.intro);
      const bob = Math.sin(t * 0.8 + tl.phase) * 0.045;
      const r = rows[i];
      r.a = smooth(arr - 0.005, arr + 0.035, p);
      r.u = clamp01((p - arr - 0.015) / UP);
      r.rd = clamp01((p - arr - 0.015 - UP) / 0.03);
      if (k > 0.65 && k < 1) hot = 1;
      // screen target: the row's icon slot
      a2.copy(toRig(ROW_X + 42, ROW_Y(i) + 41, 0.12)); // row icon centre in inner px
      a0.set(tl.home.x, tl.home.y + bob + (1 - ti) * -0.8, tl.home.z);
      // quadratic arc: up and out, then into the screen
      a1.set((a0.x + a2.x) / 2 - 0.2 + i * 0.06, Math.max(a0.y, a2.y) + 0.9, 2.2);
      const u = 1 - e;
      tl.g.position.set(u * u * a0.x + 2 * u * e * a1.x + e * e * a2.x, u * u * a0.y + 2 * u * e * a1.y + e * e * a2.y, u * u * a0.z + 2 * u * e * a1.z + e * e * a2.z);
      EY.set(THREE.MathUtils.lerp(-0.14, monitor.rotation.x, e), THREE.MathUtils.lerp(0.1 * (i - 1.5), monitor.rotation.y, e), Math.sin(Math.PI * e) * 0.3 * (i % 2 ? -1 : 1) + tl.tilt * (1 - e));
      tl.g.rotation.copy(EY);
      const lift = 1 + Math.sin(Math.PI * clamp01(k * 1.5)) * 0.1;
      const sc = (1 - e) * 0.8 + e * 0.2;
      tl.g.scale.setScalar(Math.max(0.0001, ti * lift * sc * (1 - smooth(0.85, 1, k))));
      tl.g.visible = ti > 0.001 && k < 0.999;
      tl.sh.material.opacity = 0.16 * ti * (1 - smooth(0, 0.35, k));
      tl.sh.position.x = tl.home.x;
    });
    rows.p = p;

    // answer card: floats out of the screen to the lower right
    const ck = easeIO(clamp01((p - ANS_AT) / 0.12));
    const pop = 1 + Math.sin(Math.PI * clamp01((p - ANS_AT) / 0.16)) * 0.04;
    const from = toRig(IW / 2 + 100, 560, 0.12), to = new THREE.Vector3(0.95, -0.95, 1.0);
    card.position.lerpVectors(from, to, ck); card.position.y += Math.sin(t * 0.9) * 0.035 * ck;
    card.rotation.set(0.03 - 0.05 * ck, THREE.MathUtils.lerp(monitor.rotation.y, -0.2, ck), 0);
    card.scale.setScalar(Math.max(0.0001, (0.35 + 0.65 * ck) * pop * (ck > 0.002 ? 1 : 0)));
    card.visible = ck > 0.002;
    cardShadow.material.opacity = 0.16 * ck;

    const key = `${Math.round(p * 700)}:${hot}:${Math.round(vis.intro * 20)}`;
    if (dirty || key !== lastKey) { lastKey = key; dirty = false; drawScreen(sg, p, hot, rows); screenTex.needsUpdate = true; }
  };

  const intro = () => {
    if (reduced || !window.gsap) { vis.intro = 1; tiles.forEach((t) => (t.intro = 1)); return; }
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(vis, { intro: 1, duration: 1.6, ease: 'expo.out' }, 0);
    tiles.forEach((t, i) => tl.to(t, { intro: 1, duration: 1.4, ease: 'expo.out' }, 0.4 + i * 0.1));
  };
  intro();

  return { update, resize(w, h) { const a = w / h; camera.position.z = a < 1 ? 10 / Math.min(1, a * 1.05) : 10; } };
}
