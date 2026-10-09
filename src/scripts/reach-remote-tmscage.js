/* reach-remote-tmscage.js — the 3D World's TMS cage, for the review page's launch.
   A copy of reach-world/src/tethers.js's TMS cage (v79, rebuilt to the Kystdesign reference photo): squat white top
   plate with cut-outs in a heavy black bumper, yellow box frame and padeye, four stout posts, a white skid band and
   rail, a big drum of thick yellow coils between dark ribbed flanges, the yellow arch, motor can, electronics box,
   spooling arm, sheave plate and blue hoses, with a little grime towards the foot. The world hides etms.glb and draws
   this instead, so the review page does the same. Keep in step with tethers.js if the cage changes there.

   createTmsCage({THREE, low, pbrMats}) -> THREE.Mesh, design units: centred, about +-0.86 tall, 2.7 across. The world
   fits it with mesh.scale = (the etms.glb's half-height) / CAGE_HALF (1.0). One draw call, colour per vertex.
*/
export function createTmsCage({THREE, low = false, pbrMats = null}){
const LOW = low, TAU = Math.PI * 2;
const partMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 1, side: THREE.DoubleSide });
partMat.onBeforeCompile = (sh) => {
  sh.vertexShader = sh.vertexShader
    .replace('#include <common>', '#include <common>\nattribute vec2 rm;\nvarying vec2 vRM;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRM = rm;');
  sh.fragmentShader = sh.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying vec2 vRM;')
    .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor *= vRM.x;')
    .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor *= vRM.y;');
};
partMat.customProgramCacheKey = () => 'tethers-parts-rm-v2';
if(pbrMats) pbrMats.push(partMat);

const V3 = THREE.Vector3, V2 = THREE.Vector2;
function M(x, y, z, rx, ry, rz){ return new THREE.Matrix4().compose(new V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0)), new V3(1, 1, 1)); }
function Mdir(p, dir){ return new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromUnitVectors(new V3(0, 1, 0), dir.clone().normalize()), new V3(1, 1, 1)); }
function part(list, geo, hex, rough, metal, mtx){
  let g = geo.index ? geo.toNonIndexed() : geo; if(g !== geo) geo.dispose();
  if(mtx) g.applyMatrix4(mtx);
  list.push({ g, c: new THREE.Color(hex), r: rough, m: metal });
}
function merge(list, grime){
  let n = 0; for(const p of list) n += p.g.attributes.position.count;
  const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), col = new Float32Array(n * 3), rm = new Float32Array(n * 2);
  let o = 0;
  for(const p of list){
    const cnt = p.g.attributes.position.count;
    pos.set(p.g.attributes.position.array, o * 3); nrm.set(p.g.attributes.normal.array, o * 3);
    const pa = p.g.attributes.position.array;
    for(let i = 0; i < cnt; i++){
      const k = (o + i) * 3;
      let f = 1;
      if(grime){   // v79: darker towards the foot (silt, shade) and a faint mottle, so the paint is not flat
        const y = pa[i * 3 + 1], h = Math.sin(pa[i * 3] * 12.9 + pa[i * 3 + 2] * 7.3 + y * 5.1) * 43758.5;
        f = (0.8 + 0.2 * Math.min(1, Math.max(0, (y + 0.86) / 1.1))) * (0.95 + 0.07 * (h - Math.floor(h)));
      }
      col[k] = p.c.r * f; col[k + 1] = p.c.g * f; col[k + 2] = p.c.b * f; rm[(o + i) * 2] = p.r; rm[(o + i) * 2 + 1] = p.m;
    }
    o += cnt; p.g.dispose();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('rm', new THREE.BufferAttribute(rm, 2));
  geo.computeBoundingSphere();
  return geo;
}
const lathe = (pts, segs) => new THREE.LatheGeometry(pts.map(p => new V2(p[0], p[1])), segs);

// Colours (sRGB hex; THREE.Color converts to linear) and [roughness, metalness].
const WHITE = 0xb2b6b4, YELLOW = 0xDDAE1C, RUBBER = 0x141618, DARKMET = 0x3d434a, STEEL = 0xaab0b5, CABLE = 0xE8B31A;
const P_WHITE = [0.74, 0.03], P_YEL = [0.58, 0.04], P_RUB = [0.92, 0.0], P_DARK = [0.45, 0.55], P_STEEL = [0.35, 0.75], P_CABLE = [0.72, 0.0];

// Kystdesign-style eTMS, design units: Y up, centred. v79 rebuilt to the reference photo (ref/tether cabel/
// Kystdesign-ROV-TMS-7731-scaled.jpg; Ross: "the tms looks quite fake"): squat (2.7 m across, ~1.7 m tall), a thick
// white top plate with organic cut-outs inside a heavy black bumper, a yellow box frame set into it with the padeye,
// four stout white posts, a white skid band round the foot with its own bumper and a white rail, a big drum of thick
// yellow coils between dark ribbed flanges, the yellow arch behind it, a black motor can on a yellow electronics box,
// a black spooling arm with a camera head, a black sheave plate with yellow holes, and blue hoses. Vertex colours
// carry a little grime towards the bottom and a faint per-vertex mottle, so the paint is not flat CG colour.
const CAGE_HALF = 1.0, CAGE_EXT = 0.86, CAGE_TOP_Y = 1.0, CAGE_BOT_Y = -0.74;   // fit unit; real half-extent; umbilical plug on the padeye; tether plug in the bellmouth
function buildCageGeo(){
  const L = [], cs = LOW ? 6 : 12, rs = LOW ? 24 : 56;
  const BLUE = 0x2f6fd0, BLACK = 0x1b1d20, P_BLK = [0.55, 0.15];
  // top plate: white, 0.1 thick, kidney slots round the rim, round holes, a rectangular well for the yellow frame
  const R = 1.22, plate = new THREE.Shape(); plate.absarc(0, 0, R, 0, TAU, false);
  const kidney = (r0, r1, a0, a1) => { const p = new THREE.Path(), rm = (r0 + r1) / 2, rc = (r1 - r0) / 2;
    p.absarc(0, 0, r1, a0, a1, false); p.absarc(Math.cos(a1) * rm, Math.sin(a1) * rm, rc, a1, a1 + Math.PI, false);
    p.absarc(0, 0, r0, a1, a0, true); p.absarc(Math.cos(a0) * rm, Math.sin(a0) * rm, rc, a0 + Math.PI, a0 + TAU, false); return p; };
  const slots = [[0.98, 1.1, 0.25, 0.75], [0.98, 1.1, 2.4, 2.9], [0.98, 1.1, 3.4, 3.95], [0.98, 1.1, 5.5, 6.0],
                 [0.62, 0.74, 1.15, 1.95], [0.62, 0.74, 4.3, 5.1], [0.84, 0.92, 1.3, 1.8], [0.84, 0.92, 4.45, 4.95]];
  for(const k of slots) plate.holes.push(kidney(...k));
  for(const [r, a] of [[0.9, 0.0], [0.9, Math.PI], [1.05, 1.55], [1.05, 4.7], [0.55, 0.45], [0.55, 2.7], [0.55, 3.6], [0.55, 5.8]]){
    const h = new THREE.Path(); h.absarc(Math.cos(a) * r, Math.sin(a) * r, 0.05, 0, TAU, false); plate.holes.push(h); }
  { const h = new THREE.Path(); h.moveTo(-0.7, -0.38); h.lineTo(0.7, -0.38); h.lineTo(0.7, 0.38); h.lineTo(-0.7, 0.38); h.closePath(); plate.holes.push(h); }
  const pg = new THREE.ExtrudeGeometry(plate, {depth: 0.1, bevelEnabled: false, curveSegments: cs});
  pg.rotateX(-Math.PI / 2); pg.translate(0, 0.66, 0);
  part(L, pg, WHITE, ...P_WHITE);
  // heavy black bumper round the plate: a rounded band 0.2 tall standing proud of the edge
  part(L, lathe([[1.2, 0.6], [1.3, 0.6], [1.355, 0.63], [1.37, 0.69], [1.355, 0.75], [1.3, 0.78], [1.2, 0.78]], rs), RUBBER, ...P_RUB);
  // the yellow box frame set into the plate's well, two bays, a cross beam and the padeye
  const fy = 0.6, fh = 0.32, fyc = fy + fh / 2;
  part(L, new THREE.BoxGeometry(1.5, fh, 0.12), YELLOW, ...P_YEL, M(0, fyc, 0.38));
  part(L, new THREE.BoxGeometry(1.5, fh, 0.12), YELLOW, ...P_YEL, M(0, fyc, -0.38));
  part(L, new THREE.BoxGeometry(0.12, fh, 0.88), YELLOW, ...P_YEL, M(0.69, fyc, 0));
  part(L, new THREE.BoxGeometry(0.12, fh, 0.88), YELLOW, ...P_YEL, M(-0.69, fyc, 0));
  part(L, new THREE.BoxGeometry(0.26, fh, 0.88), YELLOW, ...P_YEL, M(0, fyc, 0));
  part(L, new THREE.BoxGeometry(1.36, 0.05, 0.66), DARKMET, ...P_DARK, M(0, fy + 0.03, 0));            // the bays' dark floor
  part(L, new THREE.BoxGeometry(0.3, 0.06, 0.3), YELLOW, ...P_YEL, M(0, fy + fh + 0.03, 0));
  part(L, new THREE.TorusGeometry(0.06, 0.018, 6, 14), STEEL, ...P_STEEL, M(0, fy + fh + 0.1, 0));     // shackle
  // four stout white posts, each with a collar under the plate
  const postAt = [0.7, 2.44, 3.84, 5.58].map(a => new V3(Math.cos(a) * 1.13, 0, Math.sin(a) * 1.13));
  for(const p of postAt){
    part(L, new THREE.CylinderGeometry(0.075, 0.075, 1.32, LOW ? 8 : 16), WHITE, ...P_WHITE, M(p.x, -0.0, p.z));
    part(L, new THREE.CylinderGeometry(0.095, 0.095, 0.08, LOW ? 8 : 16), WHITE, ...P_WHITE, M(p.x, 0.56, p.z));
    part(L, new THREE.CylinderGeometry(0.09, 0.09, 0.05, LOW ? 8 : 16), DARKMET, ...P_DARK, M(p.x, 0.28, p.z));   // the slot in each post
  }
  // the skid: a white band round the foot (lathe, so it is round in plan), its bumper, and a white tube rail
  part(L, lathe([[1.1, -0.82], [1.16, -0.82], [1.17, -0.8], [1.17, -0.5], [1.16, -0.48], [1.1, -0.48], [1.1, -0.82]], rs), WHITE, ...P_WHITE);
  part(L, lathe([[1.14, -0.86], [1.22, -0.86], [1.26, -0.83], [1.27, -0.79], [1.26, -0.75], [1.22, -0.72], [1.14, -0.72]], rs), RUBBER, ...P_RUB);
  for(let i = 0; i < 4; i++){
    const a = postAt[i], b = postAt[(i + 1) % 4], mid = a.clone().add(b).multiplyScalar(0.5); mid.y = -0.4;
    part(L, new THREE.CylinderGeometry(0.045, 0.045, a.distanceTo(b), LOW ? 6 : 12), WHITE, ...P_WHITE, Mdir(mid, b.clone().sub(a)));
  }
  // bottom beams, docking plate and bellmouth (where the tether comes out)
  part(L, new THREE.BoxGeometry(2.1, 0.08, 0.1), WHITE, ...P_WHITE, M(0, -0.78, 0.4));
  part(L, new THREE.BoxGeometry(2.1, 0.08, 0.1), WHITE, ...P_WHITE, M(0, -0.78, -0.4));
  part(L, new THREE.BoxGeometry(0.8, 0.05, 0.9), DARKMET, ...P_DARK, M(0, -0.75, 0));
  part(L, lathe([[0.15, -0.66], [0.15, -0.76], [0.18, -0.82], [0.24, -0.86], [0.28, -0.88]], LOW ? 10 : 20), DARKMET, ...P_DARK);
  // the drum (axis X): dark flanges with radial ribs, thick yellow coils between them, hubs, side brackets
  const DY = -0.1, DZ = 0.12, DW = 0.56, FR = 0.6;
  for(const sx of [1, -1]){
    part(L, new THREE.CylinderGeometry(FR, FR, 0.03, LOW ? 18 : 40), DARKMET, ...P_DARK, M(sx * DW, DY, DZ, 0, 0, Math.PI / 2));
    for(let k = 0; k < 8; k++){ const a = k * TAU / 8;
      part(L, new THREE.BoxGeometry(0.05, FR - 0.14, 0.04), BLACK, ...P_BLK, M(sx * (DW + 0.035), DY + Math.cos(a) * (FR / 2 + 0.05), DZ + Math.sin(a) * (FR / 2 + 0.05), a, 0, 0)); }
    part(L, new THREE.CylinderGeometry(0.13, 0.13, 0.12, LOW ? 8 : 16), DARKMET, ...P_DARK, M(sx * (DW + 0.08), DY, DZ, 0, 0, Math.PI / 2));
  }
  const coil = [[0.3, -DW + 0.02]], wraps = 10, wr = 0.054, K = LOW ? 3 : 6, pitch = (2 * DW - 0.04) / wraps;
  for(let i = 0; i < wraps; i++){
    const yc = -DW + 0.02 + (i + 0.5) * pitch;
    for(let k = 0; k <= K; k++){ const th = (k / K) * Math.PI; coil.push([0.46 + wr * Math.sin(th), yc - (pitch / 2) * Math.cos(th)]); }
  }
  coil.push([0.3, DW - 0.02]);
  const cg = lathe(coil, LOW ? 20 : 40); cg.rotateZ(-Math.PI / 2); cg.translate(0, DY, DZ);
  part(L, cg, CABLE, ...P_CABLE);
  // tether run from the drum down into the bellmouth
  const run = new THREE.CatmullRomCurve3([new V3(0.12, DY - 0.5, DZ + 0.2), new V3(0.08, -0.62, 0.12), new V3(0.03, -0.7, 0.03), new V3(0, -0.76, 0)]);
  part(L, new THREE.TubeGeometry(run, LOW ? 4 : 8, 0.04, LOW ? 5 : 8, false), CABLE, ...P_CABLE);
  // the yellow arch behind the drum: an upright slab rising into the plate, curving forward over the drum's top
  part(L, new THREE.BoxGeometry(0.5, 1.2, 0.2), YELLOW, ...P_YEL, M(0, -0.06, -0.62));
  const arch = new THREE.TorusGeometry(0.5, 0.1, LOW ? 6 : 10, LOW ? 8 : 16, Math.PI / 2); arch.scale(1, 1, 2.4);
  part(L, arch, YELLOW, ...P_YEL, M(0, 0.06, -0.12, 0, Math.PI / 2, 0));
  // electronics box (yellow face in a steel frame) with the black motor can and its dome on top, front right
  part(L, new THREE.BoxGeometry(0.46, 0.52, 0.34), DARKMET, ...P_DARK, M(0.3, -0.42, 0.72));
  part(L, new THREE.BoxGeometry(0.4, 0.46, 0.02), YELLOW, ...P_YEL, M(0.3, -0.42, 0.9));
  part(L, new THREE.CylinderGeometry(0.15, 0.15, 0.4, LOW ? 10 : 20), BLACK, ...P_BLK, M(0.3, 0.04, 0.68));
  part(L, new THREE.SphereGeometry(0.15, LOW ? 10 : 20, LOW ? 4 : 8, 0, TAU, 0, Math.PI / 2), BLACK, ...P_BLK, M(0.3, 0.24, 0.68));
  // spooling arm and its camera head, front left over the drum
  part(L, new THREE.BoxGeometry(0.1, 0.42, 0.12), BLACK, ...P_BLK, M(-0.3, 0.36, 0.62, 0.2, 0, 0));
  part(L, new THREE.CylinderGeometry(0.07, 0.07, 0.22, 12), BLACK, ...P_BLK, M(-0.3, 0.12, 0.7, 0, 0, Math.PI / 2));
  part(L, new THREE.CylinderGeometry(0.045, 0.045, 0.14, 10), STEEL, ...P_STEEL, M(-0.42, 0.02, 0.74, 0.6, 0, 0.3));
  // sheave plate: a black crescent on the +X side with yellow-lined holes
  const cres = new THREE.Shape(); cres.absarc(0, 0, 0.74, -1.0, 1.0, false); cres.absarc(0, 0, 0.6, 1.0, -1.0, true); cres.closePath();
  const cgeo = new THREE.ExtrudeGeometry(cres, {depth: 0.04, bevelEnabled: false, curveSegments: cs}); cgeo.rotateY(Math.PI / 2);
  part(L, cgeo, BLACK, ...P_BLK, M(0.88, DY, DZ - 0.05));
  for(let k = 0; k < 5; k++){ const a = -0.8 + k * 0.4;
    part(L, new THREE.CylinderGeometry(0.04, 0.04, 0.05, 10), YELLOW, ...P_YEL, M(0.91, DY + Math.sin(a) * 0.67, DZ - 0.05 + Math.cos(a) * 0.67, 0, 0, Math.PI / 2)); }
  // blue hoses: box to motor can, and up to the arm
  for(const pts of [[[0.48, -0.2, 0.86], [0.6, 0.0, 0.8], [0.44, 0.12, 0.72]], [[0.12, -0.25, 0.86], [-0.1, 0.2, 0.86], [-0.26, 0.3, 0.66]]])
    part(L, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(q => new V3(...q))), LOW ? 6 : 12, 0.018, 6, false), BLUE, 0.5, 0.1);
  return merge(L, true);
}

  const mesh = new THREE.Mesh(buildCageGeo(), partMat);
  mesh.name = 'tmsCage';
  return mesh;
}
