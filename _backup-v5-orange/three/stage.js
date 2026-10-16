// Shared Three.js stage. Every 3D visual on the site is mounted with createStage().
//
//   import { createStage, THREE, mat } from '../three/stage.js';
//   createStage(document.querySelector('[data-stage="home"]'), ({ scene, camera, root, pointer, state, reduced }) => {
//     const mesh = new THREE.Mesh(geo, mat.matte('#ff4a1c'));
//     root.add(mesh);
//     camera.position.set(0, 0, 8);
//     return { update(t, dt) { mesh.rotation.y = t * 0.3 + pointer.x * 0.4; } };
//   });
//
// - `root` is a Group already added to the scene; put everything in it.
// - `pointer` is smoothed pointer position in -1..1 (x right, y up).
// - `state.progress` is a plain object property (0..1) you can tween with GSAP ScrollTrigger and read in update().
// - Rendering pauses when the stage is off-screen. With reduced motion, one still frame is rendered and update() is
//   called once with t = 0 (so build the "resting pose" to look finished).
// - Returns { renderer, scene, camera, state, resize(), dispose() }.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export { THREE };
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const palette = { ink: '#1a1714', brand: '#ff4a1c', brandSoft: '#fff0ea', accent: '#1b1a18', white: '#ffffff', soft: '#f6f3ee', violet: '#ff8a5c' };

// Material presets tuned for a clean, soft studio look on a light background.
export const mat = {
  matte: (color = '#ffffff', o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.0, ...o }),
  clay: (color = '#ffffff', o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.5, ...o }),
  gloss: (color = '#ff4a1c', o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.15, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.08, ...o }),
  glass: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, metalness: 0, transmission: 1, thickness: 0.8, ior: 1.45, transparent: true, ...o }),
  metal: (color = '#d9d5d0', o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 1, ...o }),
};

export function createStage(container, build, opts = {}) {
  if (!container) return null;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.documentElement.classList.add('no-webgl');
    opts.onFail?.(e);
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1.05;
  renderer.shadowMap.enabled = opts.shadows ?? true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = opts.envIntensity ?? 0.9;

  const camera = new THREE.PerspectiveCamera(opts.fov ?? 32, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  // soft key light with shadows; scenes can add their own
  const key = new THREE.DirectionalLight('#ffffff', opts.keyIntensity ?? 1.6);
  key.position.set(4, 6, 6);
  key.castShadow = renderer.shadowMap.enabled;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 6;
  key.shadow.camera.left = -6; key.shadow.camera.right = 6; key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
  key.shadow.bias = -0.0005;
  scene.add(key);
  scene.add(new THREE.HemisphereLight('#ffffff', '#f5d3c9', 0.5));

  const root = new THREE.Group();
  scene.add(root);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const state = { progress: 0 };
  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => { pointer.tx = 0; pointer.ty = 0; };
  if (!reduced) { window.addEventListener('pointermove', onMove, { passive: true }); container.addEventListener('pointerleave', onLeave); }

  const api = { renderer, scene, camera, root, pointer, state, reduced, THREE, key };
  const scene_ = build(api) || {};

  const resize = () => {
    const w = container.clientWidth || 1, h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    scene_.resize?.(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  let visible = true, raf = 0, last = performance.now(), t = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
    pointer.x += (pointer.tx - pointer.x) * Math.min(dt * 4, 1);
    pointer.y += (pointer.ty - pointer.y) * Math.min(dt * 4, 1);
    scene_.update?.(t, dt);
    renderer.render(scene, camera);
  };
  const start = () => { if (!raf && !reduced) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  if (reduced) { scene_.update?.(0, 0); renderer.render(scene, camera); }
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { rootMargin: '120px' });
  io.observe(container);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : visible && start()));

  return {
    ...api, resize,
    dispose() { stop(); io.disconnect(); ro.disconnect(); window.removeEventListener('pointermove', onMove); renderer.dispose(); pmrem.dispose(); renderer.domElement.remove(); },
  };
}

// Small helper: rounded-rectangle extruded slab (cards, slides, documents).
export function slab(w, h, d, r = 0.08, material = mat.matte('#ffffff')) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: Math.min(d * 0.3, 0.02), bevelSize: Math.min(d * 0.3, 0.02), bevelSegments: 3, curveSegments: 10 });
  g.translate(0, 0, -d / 2);
  const m = new THREE.Mesh(g, material);
  m.castShadow = m.receiveShadow = true;
  return m;
}
