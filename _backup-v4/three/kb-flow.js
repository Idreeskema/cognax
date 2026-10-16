// "Upload once, use everywhere": a file lands in the Knowledge Base, then shows up in Naxie, dashboards and automations.
import { THREE, slab, mat } from './stage.js';
import { canvasTex, rr, wrapText, facePlane, softShadow, makeBeam, FONT, smooth, outBack, lerp } from './naxie-tex.js';

const INK = '#0e1020', MUTED = '#8e93ab', BRAND = '#4f46e5';

export function buildFlow({ camera, root, state, pointer, reduced, key, renderer }) {
  renderer.toneMapping = THREE.LinearToneMapping; renderer.toneMappingExposure = 1.0;
  key.shadow.camera.left = -9; key.shadow.camera.right = 9; key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
  key.position.set(-3, 6, 9);
  state.progress = reduced ? 1 : 0;
  camera.position.set(0, 0.2, 12);
  const g = new THREE.Group(); g.position.x = -0.8; root.add(g);

  // the library (hub)
  const hub = new THREE.Group(); hub.position.set(-1.4, 0, 0);
  const HW = 3.0, HH = 3.7;
  const hs = softShadow(HW, HH, { opacity: 0.22 }); hs.position.set(0.3, -0.45, -0.15); hub.add(hs);
  hub.add(slab(HW, HH, 0.18, 0.18, mat.clay('#fff', { roughness: 0.5 })));
  const hubTex = canvasTex(600, 740, (c) => {
    c.fillStyle = INK; c.font = `600 38px ${FONT}`; c.fillText('Knowledge Base', 44, 82);
    c.fillStyle = '#e3e5ee'; c.fillRect(44, 112, 512, 2);
    const rows = [['Contracts', 'Folder'], ['Q3 vendor review.pdf', 'Ready'], ['Pricing sheet.xlsx', 'Ready'], ['Onboarding notes.docx', 'Processing'], ['Policy handbook.pdf', 'Ready']];
    rows.forEach((r, i) => {
      const y = 190 + i * 88;
      c.fillStyle = '#eceef5'; rr(c, 44, y - 28, 40, 40, 10); c.fill();
      c.fillStyle = INK; c.font = `500 28px ${FONT}`; c.fillText(r[0], 104, y);
      c.fillStyle = MUTED; c.font = `400 23px ${FONT}`; c.fillText(r[1], 104, y + 30);
    });
  });
  const hf = facePlane(HW - 0.1, HH - 0.1, hubTex, { transparent: true, glow: 0.3 }); hf.position.z = 0.118; hub.add(hf);
  // new row slides in on top once the file lands
  const rowTex = canvasTex(520, 100, (c) => {
    c.fillStyle = '#eeedff'; rr(c, 0, 0, 520, 100, 20); c.fill();
    c.fillStyle = '#0f8a5f'; rr(c, 22, 28, 44, 44, 11); c.fill();
    c.fillStyle = INK; c.font = `600 28px ${FONT}`; c.fillText('Vendor register.xlsx', 86, 48);
    c.fillStyle = BRAND; c.font = `500 22px ${FONT}`; c.fillText('Ready', 86, 78);
  });
  const row = facePlane(2.6, 0.5, rowTex, { transparent: true, glow: 0.9 }); row.position.set(0, 0.62, 0.126); hub.add(row);
  g.add(hub);

  // the file being uploaded
  const file = new THREE.Group();
  file.add(slab(1.15, 1.5, 0.08, 0.1, mat.clay('#fff', { roughness: 0.5 })));
  const fTex = canvasTex(300, 390, (c) => {
    c.fillStyle = '#0f8a5f'; rr(c, 24, 26, 62, 42, 12); c.fill();
    c.fillStyle = '#fff'; c.font = `700 20px ${FONT}`; c.textAlign = 'center'; c.fillText('XLS', 55, 56); c.textAlign = 'left';
    c.fillStyle = INK; c.font = `600 28px ${FONT}`; wrapText(c, 'Vendor register.xlsx', 24, 140, 250, 36);
    c.strokeStyle = '#dfe3ec'; c.lineWidth = 2;
    for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) c.strokeRect(24 + q * 84, 250 + r * 26, 84, 26);
  });
  const ff = facePlane(1.05, 1.4, fTex, { glow: 0.25 }); ff.position.z = 0.068; file.add(ff);
  const fsh = softShadow(1.15, 1.5, { opacity: 0.2 }); fsh.position.set(0.15, -0.25, -0.1); file.add(fsh);
  g.add(file);

  // destinations
  const dests = [
    { name: 'Naxie', pos: [2.7, 1.95, 0.2], draw(c) {
      c.fillStyle = BRAND; c.font = `600 30px ${FONT}`; c.fillText('Naxie', 36, 62);
      c.fillStyle = '#eeedff'; rr(c, 36, 88, 470, 62, 22); c.fill(); c.fillStyle = INK; c.font = '500 25px ' + FONT; c.fillText('Which vendors are late?', 58, 129);
      c.fillStyle = '#f1f2f8'; rr(c, 36, 168, 520, 62, 22); c.fill(); c.fillStyle = INK; c.fillText('Three, listed in Vendor register', 58, 209);
    } },
    { name: 'Dashboards', pos: [3.1, 0.0, 0.5], draw(c) {
      c.fillStyle = INK; c.font = `600 30px ${FONT}`; c.fillText('Dashboards', 36, 62);
      [0.4, 0.6, 0.5, 0.8, 0.7, 1].forEach((v, i) => { c.fillStyle = i === 5 ? BRAND : '#aaa4f2'; rr(c, 40 + i * 62, 240 - v * 120, 44, v * 120, 8); c.fill(); });
    } },
    { name: 'Automations', pos: [2.7, -1.95, 0.2], draw(c) {
      c.fillStyle = INK; c.font = `600 30px ${FONT}`; c.fillText('Automations', 36, 62);
      [70, 210, 350].forEach((x, i) => { c.fillStyle = i === 2 ? BRAND : '#dedbff'; rr(c, 36 + x * 0.0 + i * 140, 120, 110, 80, 18); c.fill(); if (i < 2) { c.fillStyle = '#c9ccdc'; c.fillRect(150 + i * 140, 158, 30, 4); } });
    } },
  ].map((d) => {
    const grp = new THREE.Group(); grp.position.set(...d.pos);
    const W = 2.7, H = 1.3;
    const sh = softShadow(W, H, { opacity: 0.2 }); sh.position.set(0.2, -0.3, -0.12); grp.add(sh);
    grp.add(slab(W, H, 0.14, 0.2, mat.clay('#fff', { roughness: 0.5 })));
    const f = facePlane(W, H, canvasTex(600, 290, d.draw), { transparent: true, glow: 0.4 }); f.position.z = 0.098; grp.add(f);
    // "uses this file" chip
    const chip = new THREE.Group(); chip.position.set(0.55, H / 2 - 0.02, 0.18);
    chip.add(slab(2.0, 0.34, 0.08, 0.17, mat.clay('#4f46e5', { roughness: 0.4 })));
    const cf = facePlane(2.0, 0.34, canvasTex(400, 68, (c) => { c.fillStyle = '#fff'; c.font = `600 24px ${FONT}`; c.textBaseline = 'middle'; c.fillText('Vendor register.xlsx', 22, 36); }), { transparent: true, glow: 0.9 });
    cf.position.z = 0.062; chip.add(cf); chip.scale.setScalar(0.001);
    grp.add(chip);
    g.add(grp);
    const beam = makeBeam('#4f46e5', 0.018); g.add(beam);
    return { grp, chip, beam };
  });

  const A = new THREE.Vector3(), B = new THREE.Vector3();
  function update(t) {
    const P = state.progress;
    // file travels from the left into the library
    const fl = smooth(P / 0.28);
    file.position.set(lerp(-5.2, -1.4, fl), lerp(2.0, 0.55, fl) + (reduced ? 0 : Math.sin(t) * 0.04), lerp(1.4, 0.35, fl));
    file.rotation.set(0, lerp(0.5, 0, fl), lerp(-0.2, 0, fl));
    const gone = smooth((P - 0.26) / 0.06);
    file.scale.setScalar(Math.max(1 - gone, 0.001));
    const r = outBack((P - 0.3) / 0.12);
    row.scale.setScalar(Math.max(r, 0.001));
    row.position.y = lerp(0.9, 0.62, smooth((P - 0.3) / 0.12));
    dests.forEach((d, i) => {
      const k = smooth((P - 0.42 - i * 0.1) / 0.2);
      d.beam.set(A.set(-1.4 + HW / 2 - 0.2, 0.62, 0.2), B.set(d.grp.position.x - 1.35, d.grp.position.y + 0.2, 0.2), k);
      const c = outBack((P - 0.62 - i * 0.08) / 0.16);
      d.chip.scale.setScalar(Math.max(c, 0.001));
      d.grp.position.z = [0.2, 0.5, 0.2][i] + k * 0.25;
    });
    g.rotation.y = lerp(-0.22, 0.04, smooth(P)) + (reduced ? 0 : pointer.x * 0.1);
    g.rotation.x = reduced ? 0 : -pointer.y * 0.05;
  }
  const HW0 = HW;
  return { update, resize(w, h) { camera.zoom = h / w > 0.8 ? Math.min(1, 0.55 + (w / h) * 0.35) : 1; camera.updateProjectionMatrix(); } };
}
