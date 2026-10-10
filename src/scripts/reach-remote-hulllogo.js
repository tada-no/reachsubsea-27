/* src/hulllogo.js — the REACH SUBSEA logo on a Reach Remote's sides, at its real size (v83).

   Contract: resizeHullLogo({THREE, hull, ...opts}) -> {changed, sides}

   The logo is not in the texture: pipeline/livery.py rebuilt it as separate lettering geometry inside the hull
   mesh (from ref/logos/Reach-logo-neg.svg, 7 mm proud of the skin), every vertex of it sampling one constant UV.
   That model's logo was ~4.5 m long; on the real vessel (Ross's lift photo of Reach Remote 1, 9 Oct 2026) it is
   ~1.44x that: "-REACH" starts just aft of the forward side door and the logo fills ~80% of the run between the two
   doors, its top ~0.4 m below the sheer. So this finds the lettering vertices by that UV, scales each side's logo
   by `scale` from its forward/top corner, moves that corner to `fwd`/`top` (both sides fill the same panel between the
   doors, which sit at the same stations port and starboard), and lays every vertex back onto the
   hull: a sideways ray at its new (x, y) against the hull's OWN triangles (the lettering left out), then `standoff`
   along the hull's normal there, which also becomes the vertex normal.

   The hull geometry is shared by every copy of the model, so it is edited once (geometry.userData flag); call it
   for each copy, before the lettering decals (src/hullname.js caches the hull surface). Positions are in the
   vessel holder's frame with x measured AFT of the hull's centre (`bow` -1: bow at -X, the 3D World; +1 for a
   model turned bow +X, e.g. the website's review page).
*/
export function resizeHullLogo({THREE, hull, ...opts}){
  const o = Object.assign({
    uv: [0.1324, 0.6174], uvTol: 3e-4,
    scale: 1.44,
    fwd: -4.13,          // forward end of "-REACH", metres aft of the hull centre (just aft of the forward door)
    top: 2.58,           // top of the caps, metres above the waterline
    standoff: 0.025,     // the letters are big flat polygons, so this clears the hull's curve across a letter (~2 cm sag)
    bow: -1, hullName: 'reach_remote_lod1_1', frame: null,
  }, opts);
  const mesh = hull.isMesh ? hull : hull.getObjectByName(o.hullName);
  if(!mesh) return {changed: false, sides: 0};
  const geo = mesh.geometry;
  if(geo.userData.logoResized) return {changed: false, sides: 2};
  let frame = o.frame;
  if(!frame){ frame = hull; if(hull.isMesh){ while(frame.parent && !frame.parent.isScene) frame = frame.parent; } }
  frame.updateWorldMatrix(true, true); mesh.updateWorldMatrix(true, false);
  const toFrame = new THREE.Matrix4().copy(frame.matrixWorld).invert().multiply(mesh.matrixWorld);
  const toMesh = new THREE.Matrix4().copy(toFrame).invert();
  const nToMesh = new THREE.Matrix3().getNormalMatrix(toMesh);
  const aftSign = -o.bow;

  const P = geo.attributes.position, N = geo.attributes.normal, UV = geo.attributes.uv;
  const isLogo = new Uint8Array(P.count);
  for(let i = 0; i < P.count; i++) if(Math.abs(UV.getX(i) - o.uv[0]) < o.uvTol && Math.abs(UV.getY(i) - o.uv[1]) < o.uvTol) isLogo[i] = 1;

  // every vertex in the frame; the logo's per side (z sign) with its bounds
  const fp = new Float32Array(P.count * 3), v = new THREE.Vector3();
  const sides = {};
  for(let i = 0; i < P.count; i++){
    v.fromBufferAttribute(P, i).applyMatrix4(toFrame); fp[i * 3] = v.x; fp[i * 3 + 1] = v.y; fp[i * 3 + 2] = v.z;
    if(!isLogo[i]) continue;
    const s = v.z >= 0 ? 1 : -1, ax = v.x * aftSign;
    const b = sides[s] || (sides[s] = {fwd: Infinity, top: -Infinity, idx: []});
    b.fwd = Math.min(b.fwd, ax); b.top = Math.max(b.top, v.y); b.idx.push(i);
  }
  if(!sides[1] && !sides[-1]) return {changed: false, sides: 0};

  // the hull's own triangles (no lettering) round the logo, as a probe mesh in the frame
  const idx = geo.index ? geo.index.array : null, tc = idx ? idx.length / 3 : P.count / 3, sub = [];
  const xa = Math.min(o.fwd, -6) - 2, xb = Math.max(o.fwd + 8, 6) + 2;
  for(let t = 0; t < tc; t++){
    const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
    if(isLogo[a] || isLogo[b] || isLogo[c]) continue;
    const xs = [fp[a * 3] * aftSign, fp[b * 3] * aftSign, fp[c * 3] * aftSign];
    if(Math.max(...xs) < xa || Math.min(...xs) > xb) continue;
    if(Math.max(fp[a * 3 + 1], fp[b * 3 + 1], fp[c * 3 + 1]) < -0.5) continue;
    sub.push(a, b, c);
  }
  // The probe rays all run along z, so a ray at (x, y) can only hit triangles whose (x, y) footprint covers that
  // point: bucket the triangles in a 2D grid over (x, y) and test only the probe's cell, nearest hit wins (the same
  // hit and face normal as a Raycaster against the whole set, in a few ms instead of ~1.4 s; website, 10 Oct 2026)
  const CELL = 0.25, cells = new Map(), key = (i, j) => i * 100003 + j;
  for(let k = 0; k < sub.length; k += 3){
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for(let q = 0; q < 3; q++){ const a = sub[k + q] * 3; x0 = Math.min(x0, fp[a]); x1 = Math.max(x1, fp[a]); y0 = Math.min(y0, fp[a + 1]); y1 = Math.max(y1, fp[a + 1]); }
    for(let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) for(let j = Math.floor(y0 / CELL); j <= Math.floor(y1 / CELL); j++){
      const c = key(i, j); let l = cells.get(c); if(!l) cells.set(c, l = []); l.push(k);
    }
  }
  const ray = new THREE.Ray(), ro = new THREE.Vector3(), rd = new THREE.Vector3(), hit = new THREE.Vector3();
  const ta = new THREE.Vector3(), tb = new THREE.Vector3(), tc3 = new THREE.Vector3();
  const corner = (t, k) => t.set(fp[sub[k] * 3], fp[sub[k] * 3 + 1], fp[sub[k] * 3 + 2]);
  const probe = (x, y, s) => {
    ray.set(ro.set(x, y, s * 30), rd.set(0, 0, -s));
    const list = cells.get(key(Math.floor(x / CELL), Math.floor(y / CELL)));
    if(!list) return null;
    let best = null, bestD = Infinity;
    for(const k of list){
      if(!ray.intersectTriangle(corner(ta, k), corner(tb, k + 1), corner(tc3, k + 2), false, hit)) continue;
      const d = ro.distanceTo(hit);
      if(d > 40 || d >= bestD) continue;
      bestD = d;
      best = {p: hit.clone(), n: THREE.Triangle.getNormal(ta, tb, tc3, new THREE.Vector3())};
    }
    if(!best) return null;
    if(best.n.z * s < 0) best.n.negate();
    return best;
  };

  let moved = 0;
  for(const s of [1, -1]){
    const b = sides[s]; if(!b) continue;
    for(const i of b.idx){
      const ax = fp[i * 3] * aftSign, y = fp[i * 3 + 1];
      const nx = (o.fwd + (ax - b.fwd) * o.scale) * aftSign, ny = o.top - (b.top - y) * o.scale;
      const h = probe(nx, ny, s); if(!h) continue;
      v.set(h.p.x + h.n.x * o.standoff, ny + h.n.y * o.standoff, h.p.z + h.n.z * o.standoff).applyMatrix4(toMesh);
      P.setXYZ(i, v.x, v.y, v.z);
      if(N){ v.copy(h.n).applyMatrix3(nToMesh).normalize(); N.setXYZ(i, v.x, v.y, v.z); }
      moved++;
    }
  }
  P.needsUpdate = true; if(N) N.needsUpdate = true;
  geo.computeBoundingSphere(); geo.computeBoundingBox();
  geo.userData.logoResized = true;
  return {changed: true, sides: Object.keys(sides).length, moved};
}
