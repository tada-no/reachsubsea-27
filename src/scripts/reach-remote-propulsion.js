/* src/propulsion.js — what hangs under a Reach Remote's hull (v76, Ross: "add in the Reach Remote propeller system";
   v77 rebuilt to his renders and lift photos; v78 "match to photos more than renders").

   Contract: createUnderwaterGear({THREE, hull, ...opts}) -> THREE.Group, built in the vessel holder's frame
   (waterline y = 0), so it goes straight on with holder.add(group) and bobs with the vessel.

   Sources (v77, rebuilt from Ross's references, 9 Oct 2026): the 3dw renders of the finished model (underside, bow,
   stern, low stern quarter, side), the lift photos of Reach Remote 1 and 2 hanging from the Taklift crane (side-on), and
   the shed photo of Reach Remote 1's forward thruster. The brochure spec gives "Azimuth thrusters 2 x 350kW-ZF ATL 4014
   WM-FP" (fixed-pitch propeller in a nozzle, on a strut that turns to steer).
     - Two azimuth thrusters on the centreline, ~4 m in from the bow and ~4.8 m in from the stern, hubs ~0.85 m below the
       keel, nozzles ~1.6 m across, polished bronze propellers.
     - The gondola under the middle (~8.2 m long, ~2.95 m below the keel, centred a touch aft of midships): two deep
       walls either side of the moonpool, each with a boot-shaped pod along its foot (flush inboard, a pointed toe
       outboard: the multibeam echo sounders), joined at the front by a U-shaped foil (the sub-bottom profiler bar).
       The moonpool opens in the hull bottom between the walls (the renders' grey hatch; here a dark mouth), so the
       TMS and ZeeROV leave straight down through the gap. It replaces the v32 charcoal housing box (src/launch.js's
       moonpool() now only measures, with flush: true).
     - Two flat stern fins either side of the centreline just forward of the transom, raked, leaning outboard and
       toed out (renders, lift photos). v76's centreline skeg is gone: the photos show none.
     v78, the photos first (Ross): thrusters turned on their stems as they hang in the lift photo, round stems, fatter
       pods with a bullet nose, wide skewed polished propeller blades; gondola 8.5 m with square aft ends; stern fins
       further aft with the photo's outline, leaning out less (v80: x 9.8..11.0, just inside the stern's lower edge,
       narrowing to a rounded foot); and the two louvred sea-chest grilles low
       on each side aft of the gondola (only the photos show them), laid row by row on the curving hull.
   Positions are given as `x` along the hull from its centre, positive AFT, and flipped for a model whose bow points
   +X (opts.bow = +1, e.g. the website's review page). Each strut and leg is measured down to the real hull bottom
   with a ray, so they meet the plating wherever it is.

   Cost per vessel: 4 draw calls (one merged red antifouling mesh, one dark mesh for the moonpool mouth and grille
   backings, two propellers), ~7k triangles, no
   textures. Its meshes carry userData.notHull, so hull raycasts (src/launch.js) look past them.
   The propellers turn slowly (DP hold), driven from their own onBeforeRender, so nothing else needs a hook.

   Console test:
     const {createUnderwaterGear}=await import('./src/propulsion.js?nc='+Date.now());
     const g=createUnderwaterGear({THREE:dbg.THREE, hull:dbg.placed.usv}); dbg.placed.usv.add(g);
   Remove: g.removeFromParent(); g.userData.dispose();
*/

export function createUnderwaterGear({THREE, hull, ...opts}){
  const o = Object.assign({
    bow: -1,                                   // -1: bow at -X (the 3D World's holders); +1: bow at +X
    hullName: 'reach_remote_lod1_1', frame: null,
    thrusters: [-9.1, 8.5],                    // x of each azimuth thruster, positive aft of the hull's centre (lift photos)
    thrusterYaw: [-0.35, -2.3],                 // each unit turned about its stem (rad), as they hang in the lift photos
    hubBelowKeel: 0.85, nozzleR: 0.72, nozzleLen: 0.85, propR: 0.66, podR: 0.32, rpm: 50,
    gondola: {x: 0.1, len: 8.5, inner: 1.65, wall: 0.95, depth: 2.95, toe: 0.55, uDepth: 1.6, barR: 0.11},
    finsAft: {fwd: 9.8, aft: 11.0, footLen: 0.95, z: 1.9, bottom: -3.1, thick: 0.22, cant: 0.1, toe: 0.08},   // aft edge just inside the stern's lower edge (x ~11.25)
    opening: {x: 0.5, len: 6.2, wid: 2.9},     // the dark moonpool mouth in the hull bottom, between the gondola walls
    grilles: [{x: 6.65, w: 0.56, y0: 0.5, y1: 1.85, rows: 12}, {x: 7.28, w: 0.53, y0: 1.0, y1: 1.75, rows: 7}],   // sea chests (lift photo), y above the keel
    keel: null,                                // keel height; default: measured (the flat bottom amidships)
    red: 0x7d2a24, brass: 0xc29a5c,
  }, opts);
  const mesh = hull.isMesh ? hull : (hull.getObjectByName(o.hullName) || largest(hull));
  let frame = o.frame;
  if(!frame){ frame = hull; if(hull.isMesh){ while(frame.parent && !frame.parent.isScene) frame = frame.parent; } }
  frame.updateWorldMatrix(true, true); mesh.updateWorldMatrix(true, false);
  const toFrame = new THREE.Matrix4().copy(frame.matrixWorld).invert();
  const aftSign = -o.bow;                      // frame x = aftSign * (x aft of centre)
  const X = x => aftSign * x;

  // hull bottom at (x, z) in the frame: a ray straight up from below
  const ray = new THREE.Raycaster(), a = new THREE.Vector3(), b = new THREE.Vector3();
  const bottomAt = (x, z) => {
    a.set(X(x), -30, z).applyMatrix4(frame.matrixWorld); b.set(X(x), 0, z).applyMatrix4(frame.matrixWorld);
    ray.set(a, b.sub(a).normalize()); ray.far = 40;
    const h = ray.intersectObject(mesh, false)[0];
    return h ? h.point.clone().applyMatrix4(toFrame).y : null;
  };
  const keel = o.keel != null ? o.keel : (bottomAt(0, 1.5) ?? -2.1);
  // hull side at (x, y) on one side (+1 / -1): the point and its outward normal, in the frame
  const nm = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  const sideAt = (x, y, side) => {
    a.set(X(x), y, side * 14).applyMatrix4(frame.matrixWorld); b.set(X(x), y, 0).applyMatrix4(frame.matrixWorld);
    ray.set(a, b.sub(a).normalize()); ray.far = 30;
    const h = ray.intersectObject(mesh, false)[0];
    if(!h || !h.face) return null;
    const n = h.face.normal.clone().applyMatrix3(nm).transformDirection(toFrame);
    if(n.z * side < 0) n.negate();
    return {p: h.point.clone().applyMatrix4(toFrame), n};
  };

  const redParts = [], props = [];
  const put = (geo, x, y, z, rx = 0, ry = 0, rz = 0) => {
    geo.rotateX(rx); geo.rotateY(ry); geo.rotateZ(rz); geo.translate(X(x), y, z); redParts.push(geo); return geo;
  };

  // ---- the two azimuth thrusters ---------------------------------------------------------------------------
  // Each unit is built in its own frame (+x = towards its nozzle), turned about its upright stem by `thrusterYaw`
  // (the lift photos show them turned, as they hang after a DP job), then set at its station on the centreline.
  const hubY = keel - o.hubBelowKeel, base = aftSign > 0 ? 0 : Math.PI;
  o.thrusters.forEach((tx, ti) => {
    const yaw = base + (o.thrusterYaw[ti] || 0) * aftSign;
    const top = (bottomAt(tx, 0) ?? keel) + 0.15;            // a little up into the plating, so no gap shows
    const unit = [];
    const U = (geo, x, y, z = 0) => { geo.translate(x, y, z); unit.push(geo); };
    // stem: a round post from the hull down to the lower housing, and a turret flange where it meets the plating
    U(new THREE.CylinderGeometry(0.3, 0.3, top - hubY, 20, 1), 0, hubY + (top - hubY) / 2);
    U(new THREE.CylinderGeometry(0.55, 0.62, 0.18, 24), 0, top - 0.12);
    // lower housing: a streamlined fin from the stem into the pod (lathe teardrop squashed sideways)
    const fin = new THREE.CylinderGeometry(0.48, 0.48, 0.55, 20, 1); fin.scale(1, 1, 0.5);
    U(fin, 0.05, hubY + 0.3);
    // pod: a fat capsule along the unit's axis with a cone nose forward (the shed photo)
    const pod = new THREE.CapsuleGeometry(o.podR, 0.9, 6, 18); pod.rotateZ(Math.PI / 2);
    U(pod, -0.05, hubY);
    // a rounded bullet nose, not a point (the shed photo)
    const R = o.podR * 0.94, nose = new THREE.LatheGeometry([[R, 0], [R * 0.95, 0.12], [R * 0.78, 0.24], [R * 0.5, 0.33], [R * 0.18, 0.37], [0, 0.38]].map(q => new THREE.Vector2(q[0], q[1])), 18);
    nose.rotateZ(Math.PI / 2);                                // lathe axis y -> the unit's -x (forward)
    U(nose, -0.62, hubY);
    // nozzle: a lathe of the duct's section (thick at the inlet, thin at the outlet), inlet towards the pod
    const r0 = o.nozzleR, L = o.nozzleLen, sec = [], N = 10;
    for(let i = 0; i <= N; i++){ const t = i / N; sec.push(new THREE.Vector2(r0 + 0.12 * Math.sin(Math.PI * t) * (1.25 - t * 0.6), (t - 0.5) * L)); }
    for(let i = N; i >= 0; i--){ const t = i / N; sec.push(new THREE.Vector2(r0 - 0.005, (t - 0.5) * L)); }
    const noz = new THREE.LatheGeometry(sec, 40); noz.rotateZ(-Math.PI / 2);
    const nozX = 0.62;
    U(noz, nozX, hubY);
    // the two nozzle struts that hold the duct to the pod (top and bottom)
    for(const s of [1, -1]) U(new THREE.BoxGeometry(0.34, r0 - o.podR + 0.05, 0.07), nozX, hubY + s * (o.podR - 0.05 + (r0 - o.podR + 0.05) / 2));
    for(const g of unit){ g.rotateY(yaw); g.translate(X(tx), 0, 0); redParts.push(g); }
    // propeller: four wide, skewed, polished bronze blades and a hub cone, turning about the unit's axis
    const blades = [], span = o.propR - 0.17;
    for(let k = 0; k < 4; k++){
      const bl = new THREE.BoxGeometry(0.05, span, 0.5, 1, 6, 2);
      const p = bl.attributes.position;
      for(let i = 0; i < p.count; i++){
        const y = p.getY(i), t = (y + span / 2) / span;
        const tw = 0.85 - 0.45 * t, zs = 0.75 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.1)) - 0.35 * t * t;
        const z = p.getZ(i) * zs + 0.12 * t * t, x0 = p.getX(i);   // skew: the tips sweep back
        p.setXYZ(i, x0 * Math.cos(tw) - z * Math.sin(tw), y + 0.17 + span / 2, x0 * Math.sin(tw) + z * Math.cos(tw));
      }
      bl.computeVertexNormals();
      bl.rotateX(k * Math.PI / 2);
      blades.push(bl);
    }
    const cone = new THREE.ConeGeometry(0.19, 0.42, 18); cone.rotateZ(-Math.PI / 2); cone.translate(0.22, 0, 0);
    const hub = new THREE.CylinderGeometry(0.19, 0.19, 0.3, 18); hub.rotateZ(Math.PI / 2);
    const spin = new THREE.Mesh(merge(THREE, [...blades, cone, hub]), null);
    const prop = new THREE.Group(); prop.add(spin);
    prop.position.set(X(tx) + Math.cos(yaw) * nozX, hubY, -Math.sin(yaw) * nozX);
    prop.rotation.y = yaw;
    props.push(prop);
  });

  // ---- the two stern fins: flat plates either side of the centreline, raked, canted out and toed out ------------
  // (lift photos: they hang from the bottom just forward of the transom, ~1.1 m below the keel line, and from astern
  // the renders show them leaning outboard)
  if(o.finsAft){
    const k = o.finsAft;
    for(const side of [1, -1]){
      const z = side * k.z;
      // the root follows the hull bottom (buried 0.3 m) as it rises towards the stern; the aft edge stays just inside
      // the stern's lower edge and the fin narrows to a rounded foot, leading edge raked back (v80, lift photo)
      const N = 6, tops = [];
      for(let i = 0; i <= N; i++){ const x = k.fwd + (k.aft - k.fwd) * i / N; tops.push([x, (bottomAt(x, z) ?? keel) + 0.3]); }
      const tf = tops[0][1], ta = tops[N][1], foot = k.aft - k.footLen;
      const sh = new THREE.Shape();
      sh.moveTo(X(tops[0][0]), tops[0][1]);
      for(let i = 1; i <= N; i++) sh.lineTo(X(tops[i][0]), tops[i][1]);
      sh.lineTo(X(k.aft), k.bottom + 0.3);
      sh.quadraticCurveTo(X(k.aft), k.bottom, X(k.aft - 0.25), k.bottom);
      sh.lineTo(X(foot + 0.15), k.bottom);
      sh.quadraticCurveTo(X(foot - 0.05), k.bottom + 0.02, X(foot - 0.08), k.bottom + 0.25);
      sh.closePath();
      const fin = new THREE.ExtrudeGeometry(sh, {depth: k.thick - 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2, curveSegments: 4});
      fin.translate(0, 0, -(k.thick - 0.1) / 2);
      // pivot about the top of the fin's middle: cant (bottom outboard), then toe (aft edge outboard)
      const px = X((k.fwd + k.aft) / 2), py = (tf + ta) / 2;
      fin.translate(-px, -py, 0);
      fin.rotateX(-side * k.cant);
      fin.rotateY(-side * aftSign * k.toe);
      fin.translate(px, py, z);
      redParts.push(fin);
    }
  }

  // ---- the gondola: two streamlined walls either side of the moonpool, each flaring at its foot into the sonar pod
  //      (the multibeam echo sounders), and a round bar between them at the front (the sub-bottom profiler). v79
  //      (Ross: "more streamlined", "backs taper out"): one lofted shape per wall. Its section is the brochure's
  //      head-on render: upright inboard face, outboard face curving out into a rounded toe, flat-ish underside;
  //      in plan it has a round nose and a tail that tapers to a blunt end. The moonpool opens in the hull bottom
  //      between the walls, so the TMS and ZeeROV leave straight down through the gap. ---------------------------------
  if(o.gondola){
    const G = o.gondola;
    const fwd = G.x - G.len / 2, aft = G.x + G.len / 2;      // aft-positive x of its two ends
    const bot = keel - G.depth, Hw = G.wall, T = G.toe;
    for(const side of [1, -1]){
      let top = -Infinity;
      for(const x of [fwd, G.x, aft]) for(const z of [G.inner, G.inner + Hw]) top = Math.max(top, bottomAt(x, side * z) ?? keel);
      top = Math.min(top, keel + 0.6) + 0.15;
      // the section, as (q, y): q = metres outboard of the inboard face. A smooth curve from the top of the
      // outboard face, down and out round the toe, under the foot and up the inboard face.
      const ctl = [[Hw, top], [Hw, bot + 1.75], [Hw + 0.06, bot + 1.2], [Hw + T * 0.55, bot + 0.74], [Hw + T, bot + 0.44],
                   [Hw + T * 0.8, bot + 0.2], [Hw * 0.72, bot + 0.02], [0.22, bot], [0.03, bot + 0.14], [0, bot + 0.55], [0, top]];
      const curve = new THREE.CatmullRomCurve3(ctl.map(c => new THREE.Vector3(c[0], c[1], 0)), false, 'centripetal');
      const sec = curve.getSpacedPoints(44).map(v => [v.x, v.y]);
      const K = sec.length, qc = Hw / 2;
      // stations along the wall, closer together at the ends; plan width factor: round nose, tapering tail
      const NS = 34, rn = 1.0, tl = 2.4, stn = [];
      for(let i = 0; i <= NS; i++){
        const x = fwd + (aft - fwd) * (0.5 - 0.5 * Math.cos(Math.PI * i / NS)), d = x - fwd, e = aft - x;
        let w = 1;
        if(d < rn){ const k = 1 - d / rn; w = Math.sqrt(Math.max(0, 1 - k * k)); }
        if(e < tl){ const k = e / tl; w = Math.min(w, 0.32 + 0.68 * k * k * (3 - 2 * k)); }
        stn.push([x, i === 0 ? 0 : Math.max(0.06, w)]);   // the nose closes to a line
      }
      const at = (x, w, q, y) => [X(x), y, side * (G.inner + qc + (q - qc) * w)];
      const pos = [], idx = [];
      for(const [x, w] of stn) for(const [q, y] of sec) pos.push(...at(x, w, q, y));
      for(let i = 0; i < NS; i++) for(let j = 0; j < K - 1; j++){
        const a0 = i * K + j, a1 = a0 + 1, b0 = a0 + K, b1 = b0 + 1;
        idx.push(a0, b0, a1, a1, b0, b1);
      }
      const skin = new THREE.BufferGeometry();
      skin.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); skin.setIndex(idx); skin.computeVertexNormals();
      // the toe's normal (mid-length) must point outboard; flip the winding if this side came out inside-out
      const tn = skin.attributes.normal, ti = (NS >> 1) * K + Math.round(K * 0.33);
      if(tn.getZ(ti) * side < 0){ for(let i = 0; i < idx.length; i += 3){ const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; } skin.setIndex(idx); skin.computeVertexNormals(); }
      redParts.push(skin);
      // the blunt tail: a flat cap over the last section (the nose closes itself)
      const [xe, we] = stn[NS], pts2 = sec.map(([q, y]) => new THREE.Vector2(q, y));
      const tris = THREE.ShapeUtils.triangulateShape(pts2, []), cp = [];
      for(const t of tris) for(const k of t) cp.push(...at(xe, we, sec[k][0], sec[k][1]));
      const cap = new THREE.BufferGeometry(); cap.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); cap.computeVertexNormals();
      if(cap.attributes.normal.getX(0) * aftSign < 0){ const q = cap.attributes.position; for(let i = 0; i < q.count; i += 3) for(let c = 0; c < 3; c++){ const t = q.getComponent(i + 1, c); q.setComponent(i + 1, c, q.getComponent(i + 2, c)); q.setComponent(i + 2, c, t); } cap.computeVertexNormals(); }
      redParts.push(cap);
    }
    // the bar: a round tube swept forward in a shallow U between the walls' inboard faces, at toe height
    const b = G.inner + 0.25, xa = fwd + G.uDepth, ap = fwd + 0.25, yb = bot + 0.44, pts = [];
    for(let i = 0; i <= 16; i++){ const f = -Math.PI / 2 + Math.PI * i / 16; pts.push(new THREE.Vector3(X(xa - (xa - ap) * Math.cos(f)), yb, b * Math.sin(f))); }
    redParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, G.barR, 12, false));
  }

  // ---- the sea-chest grilles low on each side, aft of the gondola (lift photo of Reach Remote 1): two rounded
  //      openings side by side, dark inside, with horizontal bars. Each row is laid on the hull by its own ray, so
  //      the grille follows the bilge as it curves in towards the bottom. ----------------------------------------------
  const darkParts = [];
  if(o.grilles){
    const tan = new THREE.Vector3(), up = new THREE.Vector3(), m4 = new THREE.Matrix4();
    for(const side of [1, -1]) for(const gr of o.grilles){
      const rows = [];
      for(let j = 0; j <= gr.rows; j++){
        const y = keel + gr.y0 + (gr.y1 - gr.y0) * j / gr.rows, hit = sideAt(gr.x, y, side);
        if(!hit) continue;
        tan.set(aftSign, 0, 0).addScaledVector(hit.n, -hit.n.x * aftSign).normalize();
        rows.push({p: hit.p, n: hit.n, t: tan.clone()});
      }
      if(rows.length < 2) continue;
      const hw = gr.w / 2, pos = [];
      for(let j = 0; j + 1 < rows.length; j++){
        const A = rows[j], B = rows[j + 1];
        const a0 = A.p.clone().addScaledVector(A.n, 0.012).addScaledVector(A.t, -hw), a1 = A.p.clone().addScaledVector(A.n, 0.012).addScaledVector(A.t, hw);
        const b0 = B.p.clone().addScaledVector(B.n, 0.012).addScaledVector(B.t, -hw), b1 = B.p.clone().addScaledVector(B.n, 0.012).addScaledVector(B.t, hw);
        pos.push(...a0.toArray(), ...a1.toArray(), ...b1.toArray(), ...a0.toArray(), ...b1.toArray(), ...b0.toArray());
      }
      const back = new THREE.BufferGeometry(); back.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); back.computeVertexNormals();
      // a quad's winding decides its normal; flip any that face into the hull
      const nr = back.attributes.normal;
      if(nr.getZ(0) * side < 0){ const q = back.attributes.position; for(let i = 0; i < q.count; i += 3){ for(let c = 0; c < 3; c++){ const t1 = q.getComponent(i + 1, c); q.setComponent(i + 1, c, q.getComponent(i + 2, c)); q.setComponent(i + 2, c, t1); } } back.computeVertexNormals(); }
      darkParts.push(back);
      // bars across every row but the ends, and a rail down each edge, standing proud of the backing
      const box = (w, h, d, at, R) => { const g = new THREE.BoxGeometry(w, h, d); m4.makeBasis(R.t, up.crossVectors(R.n, R.t).normalize(), R.n).setPosition(at); g.applyMatrix4(m4); redParts.push(g); };
      for(let j = 1; j + 1 < rows.length; j++){ const R = rows[j]; box(gr.w - 0.04, 0.035, 0.05, R.p.clone().addScaledVector(R.n, 0.03), R); }
      for(let j = 0; j + 1 < rows.length; j++){
        const A = rows[j], B = rows[j + 1], mid = A.p.clone().add(B.p).multiplyScalar(0.5), len = A.p.distanceTo(B.p) + 0.02;
        const R = {n: A.n.clone().add(B.n).normalize(), t: A.t};
        for(const e of [-1, 1]) box(0.06, len, 0.06, mid.clone().addScaledVector(R.n, 0.03).addScaledVector(R.t, e * (hw + 0.01)), R);
      }
      for(const R of [rows[0], rows[rows.length - 1]]) box(gr.w + 0.08, 0.06, 0.06, R.p.clone().addScaledVector(R.n, 0.03), R);
    }
  }

  // ---- the moonpool mouth: a dark plate just under the hull bottom between the walls, with a lip round it ----------
  let mouthY = null;
  if(o.opening && o.gondola){
    const L = o.opening.len, W = o.opening.wid, cx = o.opening.x;
    let lo = Infinity;
    for(const x of [cx - L / 2, cx, cx + L / 2]) for(const z of [-W / 2, 0, W / 2]) lo = Math.min(lo, bottomAt(x, z) ?? keel);
    mouthY = lo - 0.03;
    const lip = 0.12, lh = 0.16;
    for(const s of [1, -1]){
      put(new THREE.BoxGeometry(L + 2 * lip, lh, lip), cx, mouthY - lh / 2 + 0.06, s * (W / 2 + lip / 2));
      put(new THREE.BoxGeometry(lip, lh, W), cx + s * (L / 2 + lip / 2), mouthY - lh / 2 + 0.06, 0);
    }
  }

  // ---- materials, meshes --------------------------------------------------------------------------------------
  const redMat = new THREE.MeshStandardMaterial({color: o.red, roughness: 0.72, metalness: 0.05, name: 'gearRed'});
  const brassMat = new THREE.MeshStandardMaterial({color: o.brass, roughness: 0.22, metalness: 0.95, name: 'gearBrass'});
  const g = new THREE.Group(); g.name = 'underwaterGear';
  const redMesh = new THREE.Mesh(merge(THREE, redParts), redMat); redMesh.name = 'gearRed';
  g.add(redMesh);
  let voidMat = null, voidMesh = null;
  if(mouthY != null){
    const pl = new THREE.PlaneGeometry(o.opening.len + 0.1, o.opening.wid + 0.1); pl.rotateX(Math.PI / 2);   // faces down
    pl.translate(X(o.opening.x), mouthY, 0);
    darkParts.push(pl);
  }
  if(darkParts.length){
    voidMat = new THREE.MeshStandardMaterial({color: 0x07090b, roughness: 0.9, metalness: 0, side: THREE.DoubleSide, name: 'gearMouth'});
    voidMesh = new THREE.Mesh(merge(THREE, darkParts), voidMat); voidMesh.name = 'gearMouth';
    g.add(voidMesh);
  }
  const t0 = performance.now();
  for(const p of props){
    p.children[0].material = brassMat; g.add(p);
    // spin about the unit's own axis (the group carries its yaw); onBeforeRender runs every frame it is drawn
    const sp = p.children[0];
    sp.onBeforeRender = () => { sp.rotation.x = ((performance.now() - t0) / 1000) * (o.rpm / 60) * Math.PI * 2; sp.updateMatrixWorld(true); };
  }
  g.traverse(c => { if(c.isMesh) c.userData.notHull = true; });   // hull raycasts (src/launch.js) look past it
  g.userData = {isUnderwaterGear: true, keel, options: o,
    moonpool: mouthY == null ? null : {x: X(o.opening.x), mouth: mouthY, len: o.opening.len, wid: o.opening.wid},
    dispose(){ if(voidMesh){ voidMesh.geometry.dispose(); voidMat.dispose(); } redMesh.geometry.dispose(); props.forEach(p => p.children[0].geometry.dispose()); redMat.dispose(); brassMat.dispose(); }};
  return g;
}

function largest(root){
  let best = null, n = -1;
  root.traverse(c => { if(!c.isMesh) return; const k = c.geometry.attributes.position.count; if(k > n){ n = k; best = c; } });
  return best;
}
// a tiny merge (positions + normals only), so this file needs no addon import and works the same on the website
function merge(THREE, geos){
  let n = 0; const flat = geos.map(gm => { const f = gm.index ? gm.toNonIndexed() : gm; if(!f.attributes.normal) f.computeVertexNormals(); n += f.attributes.position.count; return f; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let k = 0;
  for(const f of flat){ pos.set(f.attributes.position.array, k * 3); nor.set(f.attributes.normal.array, k * 3); k += f.attributes.position.count; }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.computeBoundingSphere();
  return out;
}
