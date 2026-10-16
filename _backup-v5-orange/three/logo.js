// Cognax mark as a real extruded 3D object. Traced from assets/logo.svg (rounded triangle + small orange sparkle).
//
//   import { createLogoMark } from '../three/logo.js';
//   const { group, mark, spark } = createLogoMark({ height: 1.9 });
//   root.add(group);
//
// `group` is centred on the mark and has unit-ish world size (`height` = mark height). `mark` and `spark` are the two meshes;
// `spark` floats slightly in front of the mark and can be animated independently.
import { THREE, mat } from './stage.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

const MARK_D = 'M30.6563 8.30378C33.4105 6.1713 37.3641 8.45493 36.893 11.9062L35.9001 19.1803C35.8525 19.529 35.8524 19.8825 35.8999 20.2311L36.8899 27.5057C37.3596 30.9571 33.4051 33.2392 30.6518 31.1056L24.8486 26.6086C24.5705 26.3931 24.2644 26.2163 23.9387 26.083L17.1438 23.3031C13.9199 21.9842 13.9208 17.4185 17.1452 16.1009L23.9413 13.3236C24.267 13.1905 24.5732 13.0139 24.8514 12.7984L30.6563 8.30378Z';
const SPARK_D = 'M24.6195 7.3178C25.1261 7.51035 25.1097 8.23267 24.5949 8.40207L22.5733 9.06722C22.4085 9.12144 22.277 9.24714 22.2153 9.40932L21.4593 11.3987C21.2667 11.9053 20.5444 11.889 20.375 11.3741L19.7098 9.35253C19.6556 9.18772 19.5299 9.05619 19.3677 8.99455L17.3784 8.23849C16.8717 8.04593 16.8881 7.32362 17.403 7.15422L19.4245 6.48907C19.5893 6.43484 19.7209 6.30914 19.7825 6.14696L20.5386 4.1576C20.7311 3.65095 21.4534 3.66732 21.6228 4.18218L22.288 6.20376C22.3422 6.36856 22.4679 6.5001 22.6301 6.56173L24.6195 7.3178Z';

function shapesFor(d) {
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
  return data.paths.flatMap((p) => SVGLoader.createShapes(p));
}

export function createLogoMark({ height = 1.9, color = '#5148e6', colorLight = '#7c6bff', colorDeep = '#3a30c4', accent = '#1b1a18' } = {}) {
  const markGeo = new THREE.ExtrudeGeometry(shapesFor(MARK_D), { depth: 5, bevelEnabled: true, bevelThickness: 1.4, bevelSize: 1.1, bevelSegments: 6, curveSegments: 24 });
  const sparkGeo = new THREE.ExtrudeGeometry(shapesFor(SPARK_D), { depth: 1.6, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.4, bevelSegments: 4, curveSegments: 12 });

  markGeo.computeBoundingBox();
  const bb = markGeo.boundingBox, c = bb.getCenter(new THREE.Vector3());
  const hSvg = bb.max.y - bb.min.y;
  markGeo.translate(-c.x, -c.y, -c.z);

  // soft indigo gradient baked into vertex colours (light top-left to deep bottom-right)
  const pos = markGeo.attributes.position, col = new Float32Array(pos.count * 3);
  const a = new THREE.Color(colorLight), b = new THREE.Color(colorDeep), tmp = new THREE.Color();
  const w = bb.max.x - bb.min.x;
  for (let i = 0; i < pos.count; i++) {
    const u = THREE.MathUtils.clamp((pos.getX(i) / w) * 0.55 + (pos.getY(i) / hSvg) * 0.45 + 0.5, 0, 1); // svg y is down: larger y = lower
    tmp.lerpColors(a, b, u); col.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  markGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  sparkGeo.computeBoundingBox();
  const sc = sparkGeo.boundingBox.getCenter(new THREE.Vector3());
  sparkGeo.translate(-sc.x, -sc.y, -sc.z);

  const mark = new THREE.Mesh(markGeo, mat.gloss(color, { vertexColors: true, color: '#ffffff', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12 }));
  mark.castShadow = true;
  const spark = new THREE.Mesh(sparkGeo, mat.gloss(accent, { roughness: 0.25, emissive: accent, emissiveIntensity: 0.18 }));
  spark.position.set(sc.x - c.x, sc.y - c.y, 5.5);
  spark.userData.base = spark.position.clone();

  const inner = new THREE.Group();   // svg space (y down) -> world (y up)
  inner.scale.set(1, -1, 1);
  inner.add(mark, spark);
  const group = new THREE.Group();
  group.add(inner);
  group.scale.setScalar(height / hSvg);
  group.userData = { mark, spark, inner };
  return { group, mark, spark };
}
