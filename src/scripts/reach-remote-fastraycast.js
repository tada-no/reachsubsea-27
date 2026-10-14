// src/fastraycast.js — v86d: raycasts against big meshes through a bounding-volume tree (BVH) instead of every triangle.
//
// Why: the logo, names, IMO, draft marks, sea chests and moonpool are all placed by probing the loaded hull with rays
// (src/hulllogo.js, hullname.js, propulsion.js, launch.js), thousands of them. three.js tests each ray against every
// triangle; the v86 hull has ~4x the triangles of the old one, so loading took ~7 s longer (measured: three vessels
// placed at ~18 s vs ~11 s on v85, at 25 Mbps; profile: ~15 s of the load inside Mesh.raycast). With the tree each ray
// only tests the few triangles whose boxes it passes through.
//
//   installFastRaycast(THREE)   once, before any model is loaded. Patches THREE.Mesh.prototype.raycast.
//
// Hits are the same as three's own (distance, point, face {a, b, c, normal}, faceIndex, uv, normal, object; same
// material.side rules, same near/far), so callers don't change. Only plain meshes with at least MIN_TRIS triangles,
// one material and no morph targets / skinning / instancing / draw range take the fast path; everything else falls back
// to three's code. The tree is built on the first ray (~100 ms for the hull) and rebuilt if the geometry's position or
// index changes (BufferAttribute.version, i.e. after needsUpdate = true).
export function installFastRaycast(THREE, {minTris = 4000, leafSize = 8} = {}){
  const P = THREE.Mesh.prototype;
  if(P.raycast.__fast) return;
  const orig = P.raycast;
  const TREES = new WeakMap();
  const _inv = new THREE.Matrix4(), _ray = new THREE.Ray(), _sph = new THREE.Sphere();
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
  const hitL = new THREE.Vector3(), hitW = new THREE.Vector3();
  const uA = new THREE.Vector2(), uB = new THREE.Vector2(), uC = new THREE.Vector2(), bary = new THREE.Vector3();
  const nA = new THREE.Vector3(), nB = new THREE.Vector3(), nC = new THREE.Vector3();

  function keyOf(g){
    const p = g.attributes.position, i = g.index;
    return p.version + '|' + p.count + '|' + (i ? i.version + '|' + i.count : '-');
  }

  function build(g){
    const pos = g.attributes.position, idx = g.index;
    const n = (idx ? idx.count : pos.count) / 3 | 0;
    const tri = new Uint32Array(n * 3);
    for(let t = 0; t < n * 3; t++) tri[t] = idx ? idx.getX(t) : t;
    // per-triangle bounds and centroid
    const tb = new Float32Array(n * 6), tc = new Float32Array(n * 3);
    for(let t = 0; t < n; t++){
      vA.fromBufferAttribute(pos, tri[t * 3]); vB.fromBufferAttribute(pos, tri[t * 3 + 1]); vC.fromBufferAttribute(pos, tri[t * 3 + 2]);
      const o = t * 6;
      tb[o] = Math.min(vA.x, vB.x, vC.x); tb[o + 1] = Math.min(vA.y, vB.y, vC.y); tb[o + 2] = Math.min(vA.z, vB.z, vC.z);
      tb[o + 3] = Math.max(vA.x, vB.x, vC.x); tb[o + 4] = Math.max(vA.y, vB.y, vC.y); tb[o + 5] = Math.max(vA.z, vB.z, vC.z);
      tc[t * 3] = (tb[o] + tb[o + 3]) / 2; tc[t * 3 + 1] = (tb[o + 1] + tb[o + 4]) / 2; tc[t * 3 + 2] = (tb[o + 2] + tb[o + 5]) / 2;
    }
    const order = new Uint32Array(n); for(let t = 0; t < n; t++) order[t] = t;
    const maxNodes = 2 * n + 1;                 // a binary tree whose leaves are never empty
    const nb = new Float32Array(maxNodes * 6), left = new Int32Array(maxNodes), start = new Uint32Array(maxNodes), count = new Uint32Array(maxNodes);
    let nodes = 0;
    const stack = [[0, n, nodes++]];
    while(stack.length){
      const [s, e, id] = stack.pop();
      let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
      let cx0 = Infinity, cy0 = Infinity, cz0 = Infinity, cx1 = -Infinity, cy1 = -Infinity, cz1 = -Infinity;
      for(let k = s; k < e; k++){
        const t = order[k], o = t * 6, c = t * 3;
        if(tb[o] < x0) x0 = tb[o]; if(tb[o + 1] < y0) y0 = tb[o + 1]; if(tb[o + 2] < z0) z0 = tb[o + 2];
        if(tb[o + 3] > x1) x1 = tb[o + 3]; if(tb[o + 4] > y1) y1 = tb[o + 4]; if(tb[o + 5] > z1) z1 = tb[o + 5];
        if(tc[c] < cx0) cx0 = tc[c]; if(tc[c + 1] < cy0) cy0 = tc[c + 1]; if(tc[c + 2] < cz0) cz0 = tc[c + 2];
        if(tc[c] > cx1) cx1 = tc[c]; if(tc[c + 1] > cy1) cy1 = tc[c + 1]; if(tc[c + 2] > cz1) cz1 = tc[c + 2];
      }
      const o = id * 6; nb[o] = x0; nb[o + 1] = y0; nb[o + 2] = z0; nb[o + 3] = x1; nb[o + 4] = y1; nb[o + 5] = z1;
      left[id] = -1; start[id] = s; count[id] = e - s;
      if(e - s <= leafSize) continue;
      // split at the middle of the centroids' longest side; if everything lands on one side, split the list in half
      const ex = cx1 - cx0, ey = cy1 - cy0, ez = cz1 - cz0;
      const ax = ex >= ey && ex >= ez ? 0 : (ey >= ez ? 1 : 2), mid = ax === 0 ? (cx0 + cx1) / 2 : ax === 1 ? (cy0 + cy1) / 2 : (cz0 + cz1) / 2;
      let i = s, j = e - 1;
      while(i <= j){
        if(tc[order[i] * 3 + ax] < mid) i++;
        else { const tmp = order[i]; order[i] = order[j]; order[j] = tmp; j--; }
      }
      let m = i;
      if(m === s || m === e) m = (s + e) >> 1;
      const l = nodes++, r = nodes++;
      left[id] = l;
      stack.push([s, m, l], [m, e, r]);
    }
    return {key: keyOf(g), tri, order, nb, left, start, count};
  }

  function treeOf(g){
    let T = TREES.get(g);
    if(!T || T.key !== keyOf(g)){ T = build(g); TREES.set(g, T); }
    return T;
  }

  // slab test of the local ray against node `id`'s box: does it pass through it ahead of the origin? An axis the ray
  // runs parallel to (most probes here are axis-aligned) only checks that the origin lies within the slab.
  function hitsBox(nb, id, o, d){
    const k = id * 6;
    let tmin = 0, tmax = Infinity;
    for(let ax = 0; ax < 3; ax++){
      const oa = ax === 0 ? o.x : ax === 1 ? o.y : o.z, da = ax === 0 ? d.x : ax === 1 ? d.y : d.z;
      const lo = nb[k + ax], hi = nb[k + 3 + ax];
      if(da === 0){ if(oa < lo || oa > hi) return false; continue; }
      let t0 = (lo - oa) / da, t1 = (hi - oa) / da;
      if(t0 > t1){ const tmp = t0; t0 = t1; t1 = tmp; }
      if(t0 > tmin) tmin = t0;
      if(t1 < tmax) tmax = t1;
      if(tmin > tmax) return false;
    }
    return true;
  }

  const fast = function(raycaster, intersects){
    const g = this.geometry, m = this.material;
    if(!g || !g.isBufferGeometry || !m || Array.isArray(m) || this.isSkinnedMesh || this.isInstancedMesh
      || (g.morphAttributes && g.morphAttributes.position) || g.groups.length > 1
      || g.drawRange.start !== 0 || g.drawRange.count !== Infinity || !g.attributes.position)
      return orig.call(this, raycaster, intersects);
    const pos = g.attributes.position, idx = g.index;
    if((idx ? idx.count : pos.count) / 3 < minTris) return orig.call(this, raycaster, intersects);

    // the same early outs as three: bounding sphere in world space, bounding box in local space
    if(g.boundingSphere === null) g.computeBoundingSphere();
    _sph.copy(g.boundingSphere).applyMatrix4(this.matrixWorld);
    if(!raycaster.ray.intersectsSphere(_sph)) return;
    _inv.copy(this.matrixWorld).invert();
    _ray.copy(raycaster.ray).applyMatrix4(_inv);
    if(g.boundingBox !== null && !_ray.intersectsBox(g.boundingBox)) return;

    const T = treeOf(g), o = _ray.origin, d = _ray.direction;
    const uv = g.attributes.uv, uv1 = g.attributes.uv1, nrm = g.attributes.normal;
    const side = m.side;
    const stack = [0];
    while(stack.length){
      const id = stack.pop();
      if(!hitsBox(T.nb, id, o, d)) continue;
      if(T.left[id] >= 0){ stack.push(T.left[id] + 1, T.left[id]); continue; }
      for(let k = T.start[id], e = k + T.count[id]; k < e; k++){
        const t = T.order[k], a = T.tri[t * 3], b = T.tri[t * 3 + 1], c = T.tri[t * 3 + 2];
        vA.fromBufferAttribute(pos, a); vB.fromBufferAttribute(pos, b); vC.fromBufferAttribute(pos, c);
        const p = side === THREE.BackSide ? _ray.intersectTriangle(vC, vB, vA, true, hitL)
                                          : _ray.intersectTriangle(vA, vB, vC, side === THREE.FrontSide, hitL);
        if(p === null) continue;
        hitW.copy(hitL).applyMatrix4(this.matrixWorld);
        const distance = raycaster.ray.origin.distanceTo(hitW);
        if(distance < raycaster.near || distance > raycaster.far) continue;
        const hit = {distance, point: hitW.clone(), object: this};
        if(uv){ uA.fromBufferAttribute(uv, a); uB.fromBufferAttribute(uv, b); uC.fromBufferAttribute(uv, c);
          THREE.Triangle.getBarycoord(hitL, vA, vB, vC, bary);
          hit.uv = new THREE.Vector2().addScaledVector(uA, bary.x).addScaledVector(uB, bary.y).addScaledVector(uC, bary.z); }
        if(uv1){ uA.fromBufferAttribute(uv1, a); uB.fromBufferAttribute(uv1, b); uC.fromBufferAttribute(uv1, c);
          THREE.Triangle.getBarycoord(hitL, vA, vB, vC, bary);
          hit.uv1 = new THREE.Vector2().addScaledVector(uA, bary.x).addScaledVector(uB, bary.y).addScaledVector(uC, bary.z); }
        if(nrm){ nA.fromBufferAttribute(nrm, a); nB.fromBufferAttribute(nrm, b); nC.fromBufferAttribute(nrm, c);
          THREE.Triangle.getBarycoord(hitL, vA, vB, vC, bary);
          hit.normal = new THREE.Vector3().addScaledVector(nA, bary.x).addScaledVector(nB, bary.y).addScaledVector(nC, bary.z);
          if(hit.normal.dot(d) > 0) hit.normal.multiplyScalar(-1); }
        const face = {a, b, c, normal: new THREE.Vector3(), materialIndex: 0};
        THREE.Triangle.getNormal(vA, vB, vC, face.normal);
        hit.face = face;
        hit.faceIndex = t;
        intersects.push(hit);
      }
    }
  };
  fast.__fast = true;
  fast.__orig = orig;
  P.raycast = fast;
}
