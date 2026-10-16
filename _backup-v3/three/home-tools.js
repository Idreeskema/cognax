// Home "tools" carousel: six distinct 3D objects (one per Cognax product tool) on an elliptical ring.
// Reads api.state.active (float 0..5). Object round(active) sits front-and-centre, larger and brighter.
import { THREE, mat, slab, reduced } from './stage.js';

const C = { brand: '#4f46e5', violet: '#7c5cff', orange: '#ff5c00', ink: '#171a33', white: '#f4f4ff', soft: '#c9c6fa' };
const TAU = Math.PI * 2, N = 6;
const mix = THREE.MathUtils.lerp;
const wrap = (d) => ((((d + N / 2) % N) + N) % N) - N / 2;

function glowTex(rgba) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, rgba); r.addColorStop(1, rgba.replace(/[\d.]+\)$/, '0)'));
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function gearGeo(teeth, ro, ri, hole, depth) {
  const s = new THREE.Shape(), step = TAU / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step, f = [0, 0.18, 0.4, 0.58].map((k) => a + k * step);
    const pts = [[f[0], ri], [f[1], ro], [f[2], ro], [f[3], ri]];
    pts.forEach(([ang, r], j) => { const x = Math.cos(ang) * r, y = Math.sin(ang) * r; i === 0 && j === 0 ? s.moveTo(x, y) : s.lineTo(x, y); });
  }
  s.closePath();
  const h = new THREE.Path(); h.absarc(0, 0, hole, 0, TAU, true); s.holes.push(h);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 20 });
  g.translate(0, 0, -depth / 2);
  return g;
}

function between(a, b, r, m) {
  const d = new THREE.Vector3().subVectors(b, a);
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 10), m);
  cyl.position.copy(a).addScaledVector(d, 0.5);
  cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return cyl;
}

export function buildToolsScene(api) {
  const { scene, camera, root, pointer, state, key } = api;
  state.active = state.active ?? 0;
  key.intensity = 1.2;

  const lVio = new THREE.PointLight('#7c5cff', 60, 16, 1.6); lVio.position.set(-4, 3, 4);
  const lOra = new THREE.PointLight('#ff5c00', 32, 14, 1.6); lOra.position.set(4.5, -1, 3);
  const lRim = new THREE.PointLight('#8fa2ff', 45, 16, 1.6); lRim.position.set(0, 4, -4);
  scene.add(lVio, lOra, lRim);

  // shared materials (kept few: draw calls stay modest)
  const makeM = () => ({
    brand: mat.gloss(C.brand, { roughness: 0.18, emissive: '#2b1fb0', emissiveIntensity: 0.25 }),
    violet: mat.gloss(C.violet, { roughness: 0.2, emissive: '#5a3fe0', emissiveIntensity: 0.25 }),
    orange: mat.gloss(C.orange, { roughness: 0.25, emissive: C.orange, emissiveIntensity: 0.35 }),
    white: mat.clay('#e6e4ff', { roughness: 0.3, clearcoat: 0.8 }),
    dark: mat.gloss('#171a33', { roughness: 0.25 }),
    metal: mat.metal('#aeb3d0', { roughness: 0.28 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#8c86ff', roughness: 0.08, transparent: true, opacity: 0.55, clearcoat: 1, clearcoatRoughness: 0.05 }),
  });
  let M;
  const dimCol = new THREE.Color('#c4c6de');

  const items = [];
  const add = (build) => {
    const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner);
    M = makeM();
    const mats = Object.values(M); mats.forEach((m) => { m.userData.col = m.color.clone(); m.userData.ei = m.emissiveIntensity ?? 0; });
    const tick = build(inner) || (() => {}); items.push({ g, inner, tick, mats, f: 0 }); root.add(g);
  };

  // 0 Naxie: chat bubble + glowing orb + citation chip
  add((g) => {
    const bubble = slab(1.7, 1.1, 0.34, 0.38, M.brand); bubble.position.y = 0.1;
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 3), M.brand); tail.position.set(-0.55, -0.62, 0); tail.rotation.set(0, 0, Math.PI + 0.35);
    const dots = [-0.38, 0, 0.38].map((x) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), M.white); d.position.set(x, 0.1, 0.24); return d; });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 20), M.violet); orb.position.set(-0.85, 0.95, 0.3);
        const chip = slab(0.78, 0.3, 0.1, 0.14, M.orange); chip.position.set(0.6, -0.78, 0.4);
    const chipDot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), M.white); chipDot.position.set(0.38, -0.78, 0.5);
    const chipBar = slab(0.36, 0.07, 0.04, 0.03, M.white); chipBar.position.set(0.7, -0.78, 0.48);
    g.add(bubble, tail, ...dots, orb, chip, chipDot, chipBar);
    return (t, a) => { dots.forEach((d, i) => (d.scale.setScalar(1 + Math.sin(t * 3 - i * 0.8) * 0.25 * a))); orb.position.y = 0.95 + Math.sin(t * 1.4) * 0.07; chip.position.y = -0.78 + Math.sin(t * 1.2 + 1) * 0.05 * a; chipDot.position.y = chipBar.position.y = chip.position.y; };
  });

  // 1 Knowledge Base: stacked books / folders with a file tab
  add((g) => {
    const books = [[M.brand, 1.9, 0.34, 1.35, 0.05], [M.violet, 1.75, 0.3, 1.3, -0.07], [M.white, 1.85, 0.28, 1.28, 0.04], [M.orange, 1.6, 0.26, 1.2, -0.05]];
    let y = -0.7;
    const bs = books.map(([m, w, h, d, rot], i) => {
      const b = new THREE.Group();
      const body = slab(w, h, d, 0.07, m); body.rotation.x = Math.PI / 2;
      const pages = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, h * 0.6, 0.02), M.white); pages.position.set(0, 0, d / 2 - 0.0); pages.rotation.x = 0;
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.05, h * 0.9, d * 0.9), M.dark); spine.position.set(-w / 2 + 0.03, 0, 0);
      b.add(body);
      y += h / 2; b.position.set(rot * 0.7, y, 0); b.rotation.y = rot; y += h / 2 + 0.01;
      return b;
    });
    const doc = slab(0.9, 1.15, 0.05, 0.06, M.white); doc.position.set(0.5, 0.75, 0.2); doc.rotation.set(-0.25, -0.3, -0.18);
    const lines = [0.3, 0.1, -0.1, -0.3].map((yy, i) => { const l = slab(i === 3 ? 0.35 : 0.62, 0.06, 0.02, 0.02, i === 1 ? M.violet : M.metal); l.position.set(0, yy, 0.04); doc.add(l); return l; });
    g.add(...bs, doc);
    return (t, a) => { doc.position.y = 0.75 + Math.sin(t * 1.3) * 0.07 * a; doc.rotation.z = -0.18 + Math.sin(t * 0.9) * 0.05; };
  });

  // 2 Dashboards: bar tower + floating donut
  add((g) => {
    const base = slab(2.1, 0.18, 1.2, 0.08, M.dark); base.rotation.x = Math.PI / 2; base.position.y = -0.8;
    const hs = [0.5, 0.85, 0.7, 1.15, 1.55], bars = hs.map((h, i) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1, 0.28), i === 4 ? M.orange : i % 2 ? M.violet : M.brand);
      b.position.x = -0.8 + i * 0.4; b.userData.h = h; return b;
    });
    const donut = new THREE.Group();
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.12, 12, 40, TAU * 0.72), M.brand);
    const arc2 = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.12, 12, 20, TAU * 0.28), M.orange); arc2.rotation.z = TAU * 0.72;
    donut.add(arc, arc2); donut.position.set(-0.55, 0.85, 0.2); donut.rotation.x = -0.2;
    g.add(base, ...bars, donut);
    return (t, a) => {
      bars.forEach((b, i) => { const h = b.userData.h * (1 + Math.sin(t * 1.2 + i) * 0.06 * a); b.scale.y = h; b.position.y = -0.7 + h / 2; });
      donut.rotation.z = t * 0.5; donut.position.y = 0.95 + Math.sin(t * 1.3) * 0.06;
    };
  });

  // 3 Presentations: layered slides on a stand with a play badge
  add((g) => {
    const slides = [0, 1, 2].map((i) => { const s = slab(1.9, 1.15, 0.07, 0.09, i === 2 ? M.white : i === 1 ? M.violet : M.brand); s.position.set(i * 0.2 - 0.2, -i * 0.05 + i * 0.1, -0.5 + i * 0.42); s.rotation.y = -0.18; g.add(s); return s; });
    const front = slides[2];
    const bars = [0.22, 0.42, 0.34, 0.6].map((h, i) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.05), i === 3 ? M.orange : M.brand); b.position.set(-0.55 + i * 0.26, -0.3 + h / 2, 0.06); front.add(b); return b; });
    const title = slab(0.9, 0.1, 0.03, 0.04, M.dark); title.position.set(-0.4, 0.35, 0.05); front.add(title);
    const play = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.12, 3), M.orange); play.rotation.z = -Math.PI / 2; play.rotation.y = 0; play.position.set(0.55, 0.05, 0.12); play.rotation.x = Math.PI / 2; play.rotation.set(Math.PI / 2, 0, -Math.PI / 2); front.add(play);
    const legs = [-0.5, 0.5].map((x) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.9, 8), M.metal); l.position.set(x, -1.0, -0.2); l.rotation.set(0.1, 0, x * -0.25); g.add(l); return l; });
    g.position.y = 0.15;
    return (t, a) => { slides.forEach((s, i) => (s.position.z = -0.5 + i * 0.42 + Math.sin(t * 1.1 + i * 0.9) * 0.06 * a)); play.scale.setScalar(1 + Math.sin(t * 2.2) * 0.12 * a); };
  });

  // 4 Connections: hub and linked nodes + chain links
  add((g) => {
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 16), M.brand);
    const pts = [[-1.0, 0.7, 0.2], [1.0, 0.8, -0.1], [-0.95, -0.7, -0.1], [1.0, -0.65, 0.25]].map((p) => new THREE.Vector3(...p));
    const mats = [M.orange, M.violet, M.white, M.orange];
    const nodes = pts.map((p, i) => { const n = new THREE.Mesh(i % 2 ? new THREE.SphereGeometry(0.22, 18, 12) : new THREE.BoxGeometry(0.4, 0.4, 0.4), mats[i]); n.position.copy(p); return n; });
    const links = pts.map((p) => between(new THREE.Vector3(), p, 0.04, M.metal));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.045, 8, 48), M.violet);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.045, 8, 48), M.white); ringB.rotation.y = Math.PI / 2;
    g.add(hub, ring, ringB, ...nodes, ...links);
    return (t, a) => { ring.rotation.x = t * 0.7; ringB.rotation.x = t * 0.7; nodes.forEach((n, i) => { n.rotation.y = t * 0.8 + i; n.position.y = pts[i].y + Math.sin(t * 1.2 + i * 1.5) * 0.06 * a; }); };
  });

  // 5 Data & Automation: meshed gears + flow pipeline beads
  add((g) => {
    const gA = new THREE.Mesh(gearGeo(12, 0.82, 0.66, 0.2, 0.32), M.brand); gA.position.set(-0.45, 0.2, 0);
    const gB = new THREE.Mesh(gearGeo(8, 0.56, 0.43, 0.14, 0.32), M.orange); gB.position.set(0.82, 0.62, 0);
    const gC = new THREE.Mesh(gearGeo(10, 0.45, 0.35, 0.12, 0.28), M.violet); gC.position.set(0.55, -0.62, 0);
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.5, 12), M.glass); pipe.rotation.z = Math.PI / 2; pipe.position.set(0.05, -1.25, 0.1);
    const beads = [0, 1, 2, 3].map((i) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), i % 2 ? M.orange : M.violet); b.position.set(0, -1.25, 0.1); g.add(b); return b; });
    g.add(gA, gB, gC, pipe);
    g.position.y = 0.15;
    return (t, a) => { gA.rotation.z = t * 0.5; gB.rotation.z = -t * 0.5 * 12 / 8 + 0.3; gC.rotation.z = -t * 0.5 * 12 / 10 + 0.15; beads.forEach((b, i) => (b.position.x = -1.2 + (((t * 0.5 + i / 4) % 1) * 2.5))); };
  });

  // soft studio ground: big faint pool + a contact shadow under each object
  const shTex = glowTex('rgba(40,36,110,0.5)');
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTex('rgba(110,90,255,0.2)'), transparent: true, depthWrite: false, toneMapped: false }));
  pool.rotation.x = -Math.PI / 2; pool.position.y = -1.56;
  const floorRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.01, 6, 128), new THREE.MeshBasicMaterial({ color: C.violet, transparent: true, opacity: 0.25, toneMapped: false }));
  floorRing.rotation.x = Math.PI / 2; floorRing.position.y = -1.55;
  root.add(floorRing, pool);
  items.forEach((it) => {
    it.sh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, toneMapped: false }));
    it.sh.rotation.x = -Math.PI / 2; it.sh.position.y = -1.54; root.add(it.sh);
  });

  let cur = state.active, Rx = 4.8, Rz = 3.6;

  const update = (t, dt) => {
    const target = THREE.MathUtils.clamp(state.active ?? 0, -0.5, N - 0.5);
    cur += (target - cur) * (dt ? Math.min(dt * 4.5, 1) : 1);
    root.rotation.y = pointer.x * 0.1; root.rotation.x = -pointer.y * 0.04;
    lVio.position.x = -4 + pointer.x * 2; lOra.position.x = 4.5 + pointer.x * 1.2;

    items.forEach((it, i) => {
      const d = wrap(i - cur), th = d * (TAU / N) * 1.25;
      const front = Math.max(0, 1 - Math.abs(d) / 1.2);          // 1 at front, 0 beyond ~1.2 steps
      const f = front * front * (3 - 2 * front);
      it.g.position.set(Math.sin(th) * Rx, mix(0, 0.15, f), Math.cos(th) * Rz - Rz);
      const s = mix(0.5, 1.25, f);
      it.g.scale.setScalar(s);
      it.g.rotation.y = -Math.sin(th) * 0.45 + (reduced ? 0.35 : Math.sin(t * 0.4 + i) * 0.18) * f;
      it.inner.rotation.y = f * (reduced ? 0.35 : Math.sin(t * 0.5 + i) * 0.35);
      it.inner.position.y = f * Math.sin(t * 1.1 + i) * 0.08;
      it.tick(t, f);
      it.f = f;
      it.sh.position.x = it.g.position.x; it.sh.position.z = it.g.position.z;
      it.sh.scale.setScalar(s * 0.75); it.sh.material.opacity = mix(0.25, 0.6, f);
    });

    items.forEach((it) => {
      const b = 0.4 + 0.6 * it.f;
      it.mats.forEach((m) => { m.color.lerpColors(dimCol, m.userData.col, b); if (m.emissive) m.emissiveIntensity = m.userData.ei * (0.4 + 1.2 * it.f); });
    });
    pool.scale.set(Rx * 2.3, Rz * 2.6, 1);
    floorRing.scale.set(Rx, Rz, 1); floorRing.position.z = pool.position.z = -Rz;
  };

  return {
    update,
    resize(w, h) {
      const a = w / h;
      if (a >= 1.3) { Rx = 4.8; Rz = 3.6; camera.position.set(0, 3.2, 10.5); }
      else if (a >= 0.8) { Rx = 3.4; Rz = 3.0; camera.position.set(0, 3.2, 11.5); }
      else { Rx = 2.2; Rz = 2.6; camera.position.set(0, 3.0, 11 / Math.min(1, a * 1.5) ); }
      camera.lookAt(0, -0.1, 0);
      update(0, 0);
    },
  };
}
