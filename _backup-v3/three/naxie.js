// Naxie hero: a floating conversation in depth. Question and answer slabs in front, the source document behind,
// a highlighted passage that lights as the answer lands, and a thin beam from the citation chip to the passage.
// state.intro (0..1, time) plays the arrival; state.progress (0..1, scroll) moves the camera chat -> source -> pull back.
import { THREE, slab, mat } from './stage.js';
import { softShadow, canvasTex, rr, wrapText, facePlane, makeBeam, FONT, clamp01, smooth, outBack, outCubic, lerp } from './naxie-tex.js';

const INK = '#0e1020', MUTED = '#8e93ab';

export function buildHero({ camera, root, state, pointer, reduced, key, renderer }) {
  renderer.toneMapping = THREE.LinearToneMapping; renderer.toneMappingExposure = 1.0;
  state.intro = reduced ? 1 : 0;
  state.progress = 0;
  key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 8;
  key.position.set(-3, 7, 8);

  // soft backdrop that only catches shadows, so white slabs read against the page
  const dsh = softShadow(4.2, 5.4, { opacity: 0.26 });
  root.add(dsh);

  // ---- source document ----
  const DW = 4.2, DH = 5.4, DZ = -2.7, DX = 0.9, DY = 0.15;
  const doc = new THREE.Group();
  doc.position.set(DX, DY, DZ);
  doc.add(slab(DW, DH, 0.12, 0.14, mat.clay('#ffffff', { roughness: 0.5 })));
  const docTex = canvasTex(840, 1080, (c) => {
    c.fillStyle = '#fff'; c.fillRect(0, 0, 840, 1080);
    c.fillStyle = INK; c.font = `600 40px ${FONT}`; c.fillText('Services Agreement', 60, 112);
    c.fillStyle = MUTED; c.font = `400 24px ${FONT}`; c.fillText('Northwind Ltd and Harbor Supply Co.', 60, 154);
    c.fillStyle = '#e3e5ee'; c.fillRect(60, 188, 720, 2);
    c.fillStyle = INK; c.font = `600 30px ${FONT}`; c.fillText('12. Term and termination', 60, 262);
    c.fillStyle = MUTED; c.font = `400 25px ${FONT}`;
    wrapText(c, '12.1 This Agreement begins on the Effective Date and continues for an initial term of twelve (12) months unless ended earlier under this clause.', 60, 322, 720, 38);
    c.fillStyle = INK; c.font = `500 26px ${FONT}`;
    wrapText(c, '12.2 Either party may terminate this Agreement for convenience by giving sixty (60) days’ prior written notice to the other party.', 78, 584, 690, 40);
    c.fillStyle = MUTED; c.font = `400 25px ${FONT}`;
    let y = wrapText(c, '12.3 On termination, each party will return or delete the other party’s confidential information within thirty (30) days.', 60, 750, 720, 38);
    wrapText(c, '12.4 Fees for services delivered up to the termination date remain payable under Section 5.', 60, y + 22, 720, 38);
    c.fillStyle = MUTED; c.font = `400 22px ${FONT}`; c.fillText('Page 7', 60, 1020);
  });
  const docFace = facePlane(DW - 0.2, DH - 0.2, docTex, { glow: 0.22 });
  docFace.position.z = 0.092;
  doc.add(docFace);
  root.add(doc);

  // highlight: grows from the left edge of the passage
  const HW = 3.7, HH = 0.75;
  const hlGeo = new THREE.PlaneGeometry(HW, HH); hlGeo.translate(HW / 2, 0, 0);
  const hlMat = new THREE.MeshBasicMaterial({ color: '#6c5ff5', transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
  const hl = new THREE.Mesh(hlGeo, hlMat);
  const HX = DX - HW / 2, HY = DY + (540 - 615) / 200;
  hl.position.set(HX, HY, DZ + 0.1);
  hl.scale.x = 0.001;
  root.add(hl);
  const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.07, HH), new THREE.MeshBasicMaterial({ color: '#4f46e5', toneMapped: false }));
  bar.position.set(HX - 0.035, HY, DZ + 0.101);
  bar.scale.y = 0.001;
  root.add(bar);

  // ---- question ----
  const q = new THREE.Group();
  const qBase = new THREE.Vector3(-1.7, 1.9, 0.9);
  q.add(slab(3.5, 0.8, 0.16, 0.36, mat.clay('#4f46e5', { roughness: 0.38 })));
  const qTex = canvasTex(700, 160, (c) => {
    c.fillStyle = '#fff'; c.font = `500 30px ${FONT}`; c.textBaseline = 'middle';
    c.fillText('Which clause covers early termination?', 44, 82);
  });
  const qFace = facePlane(3.5, 0.8, qTex, { transparent: true, glow: 0.9 });
  qFace.position.z = 0.108; q.add(qFace);
  root.add(q);

  // ---- answer ----
  const a = new THREE.Group();
  const aBase = new THREE.Vector3(0.15, 0.05, 1.7);
  a.add(slab(4.0, 1.55, 0.18, 0.3, mat.clay('#ffffff', { roughness: 0.45 })));
  const aTex = canvasTex(800, 310, (c) => {
    c.fillStyle = '#4f46e5'; c.font = `600 24px ${FONT}`; c.fillText('Naxie', 48, 62);
    c.fillStyle = INK; c.font = `500 34px ${FONT}`;
    wrapText(c, 'Either party can end the agreement with 60 days’ written notice.', 48, 118, 700, 46);
  });
  const aFace = facePlane(4.0, 1.55, aTex, { transparent: true, glow: 0.5 });
  aFace.position.z = 0.118; a.add(aFace);
  // citation chip
  const chip = new THREE.Group();
  chip.position.set(-0.78, -0.5, 0.2);
  chip.add(slab(2.15, 0.36, 0.1, 0.18, mat.clay('#e9e7ff', { roughness: 0.4 })));
  const chipTex = canvasTex(430, 72, (c) => {
    c.fillStyle = '#4f46e5'; c.beginPath(); c.arc(34, 36, 7, 0, 7); c.fill();
    c.font = `600 25px ${FONT}`; c.textBaseline = 'middle'; c.fillText('Services Agreement, p. 7', 56, 38);
  });
  const chipFace = facePlane(2.15, 0.36, chipTex, { transparent: true, glow: 0.9 });
  chipFace.position.z = 0.078; chip.add(chipFace);
  a.add(chip);
  root.add(a);

  const beam = makeBeam('#4f46e5', 0.02);
  root.add(beam);

  // ---- camera keyframes ----
  const A = { p: new THREE.Vector3(3.8, 1.4, 13.4), t: new THREE.Vector3(0.1, 0.2, -0.8) };
  const B = { p: new THREE.Vector3(1.3, -0.3, 5.6), t: new THREE.Vector3(0.3, -0.7, -2.6) };
  const C = { p: new THREE.Vector3(-7.2, 3.0, 11.2), t: new THREE.Vector3(0.2, 0.1, -0.9) };
  const pos = new THREE.Vector3(), tgt = new THREE.Vector3(), wa = new THREE.Vector3(), wb = new THREE.Vector3();
  let zoom = 1;
  const caption = document.querySelector('.nx-cap');

  function update(t) {
    const I = state.intro, P = state.progress;
    // arrival
    const dIn = outCubic(I / 0.35);
    const qIn = outBack((I - 0.12) / 0.28), aIn = outBack((I - 0.38) / 0.28);
    const hIn = smooth((I - 0.62) / 0.22), bIn = smooth((I - 0.78) / 0.22);
    // scroll: chat -> source (e) -> pull back
    const e = smooth(P / 0.38) * (1 - smooth((P - 0.66) / 0.3));
    const idle = (k) => (reduced ? 0 : Math.sin(t * 0.7 + k) * 0.05);

    doc.position.set(DX, DY + (1 - dIn) * -0.6 + idle(0), DZ - (1 - dIn) * 2.5);
    doc.rotation.y = (1 - dIn) * 0.35;
    dsh.position.set(doc.position.x + 0.35, doc.position.y - 0.5, doc.position.z - 0.1); dsh.material.opacity = dIn;

    q.position.set(qBase.x - e * 2.2, qBase.y + (1 - qIn) * -1.0 + e * 1.7 + idle(1.3), qBase.z + (1 - qIn) * 1.5);
    q.scale.setScalar(Math.max(qIn, 0.001));
    q.rotation.y = -0.1 + e * 0.2;
    a.position.set(aBase.x - e * 1.4, aBase.y + (1 - aIn) * -1.2 - e * 2.4 + idle(2.1), aBase.z + (1 - aIn) * 1.8 - e * 1.6);
    a.scale.setScalar(Math.max(aIn, 0.001));
    a.rotation.y = -0.06 + e * 0.15;

    // passage lights, a beat later it settles to a soft tint
    const pulse = reduced ? 0 : Math.sin(t * 2) * 0.03;
    hl.scale.x = Math.max(hIn, 0.001);
    hlMat.opacity = hIn * (0.2 + e * 0.1 + pulse);
    bar.scale.y = Math.max(hIn, 0.001);

    chip.getWorldPosition(wa);
    wa.x -= 0.95; wa.z += 0.05;
    wb.set(HX - 0.035, HY, DZ + 0.11);
    beam.set(wa, wb, bIn);

    // camera
    const c1 = smooth(P / 0.38), c2 = smooth((P - 0.66) / 0.3);
    pos.lerpVectors(A.p, B.p, c1).lerp(C.p, c2);
    tgt.lerpVectors(A.t, B.t, c1).lerp(C.t, c2);
    const par = reduced ? 0 : 1;
    pos.x += pointer.x * 0.5 * par * (1 - e);
    pos.y += pointer.y * 0.35 * par * (1 - e);
    camera.position.copy(pos);
    camera.lookAt(tgt);
    if (camera.zoom !== zoom) { camera.zoom = zoom; camera.updateProjectionMatrix(); }

    if (caption) {
      const s = P < 0.2 ? 0 : P < 0.8 ? 1 : 2;
      if (caption.dataset.step !== String(s)) caption.dataset.step = s;
    }
  }

  return {
    update,
    resize(w, h) {
      const asp = w / h;
      zoom = Math.min(1, Math.max(0.5, asp * 0.95));
      camera.zoom = zoom; camera.updateProjectionMatrix();
    },
  };
}
