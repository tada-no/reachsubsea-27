/* src/hullname.js — a per-vessel hull name ("REACH REMOTE 1") painted on both sides of the bow.

   Contract: createHullName({THREE, hull, text, ...opts}) -> THREE.Group

   `hull` is the vessel holder the page places (placed.usv), or the hull mesh inside it. The name is
   fitted to the REAL hull surface: rays are cast sideways at the hull to find the skin, and a thin
   grid strip is laid on it, following the bow's curve and flare. The returned Group is expressed in
   the vessel holder's own frame (the topmost ancestor below the scene, or `opts.frame`), so it goes
   straight on with holder.add(group) and then bobs and pitches with the vessel.

   Why separate geometry and not the model's texture: the Reach Remote model, and its texture, are
   shared between the three copies. Each copy needs a different name, so the name has to be its own
   small mesh with its own small texture. Cost per vessel: 1 draw call, ~500 triangles, one
   2048x256 alpha texture (~2.7 MB GPU with mipmaps).

   How it looks right:
     - The text is drawn once into a canvas (white on black) and used as an ALPHA map on a
       MeshStandardMaterial with the hull lettering's grey-white colour, so edges stay clean at every
       mip level (no dark fringes) and nothing glows: it takes the same lights, fog, shadows and
       environment reflections as the hull. envMapIntensity is copied from the hull material just
       before each render, so the underwater dimming src/lighting.js applies to the hull applies here too.
     - Mipmaps and anisotropic filtering stop it shimmering at a distance.
     - It sits `standoff` (1.5 cm) proud of the hull along the hull's own smoothed normal, with
       polygonOffset, and does not write depth, so it never z-fights the paint underneath.

   Knobs (all optional):
     capHeight  0.40   metres, height of the capital letters. The model's own REACH letters are 0.57 m.
     aftEnd     0.27   where the name's aft end sits, as a fraction of hull length back from the stem.
     y          2.78   centre height of the caps, metres in the holder frame (= above the waterline).
     tracking   0.08   extra letter spacing, in ems.
     weight     700    font weight. font: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif'.
     color      0xd0d0d0  paint colour (matches the model's REACH SUBSEA lettering texel).
     standoff   0.015  metres off the hull skin.
     texWidth   2048   canvas width in px (height is 1/8 of it). 1024 halves the texture memory.
     renderer          pass it to use the GPU's full anisotropy (otherwise 8).
     bow        0      -1 or +1 along the frame's X axis; 0 = detect (the narrower end of the hull).
     hullName   'reach_remote_lod1_1'  mesh to fit to when `hull` is the holder.
     frame             object whose local frame the result is built in (default: the holder).
     sizeText   null    measure/size the strip against THIS string instead of `text` (default: `text`
                         itself). Fix for the three Reach Remotes: Inter's digits are not tabular — a
                         canvas measured "1" at ~42px vs "2"/"3" at ~62-64px (100px font, ~2.3% of the
                         whole "REACH REMOTE n" width) — so laying each name out against its OWN text
                         made REACH REMOTE 2/3's painted strip ~2% longer than REACH REMOTE 1's and
                         sitting a few cm further aft on the hull. Pass the SAME `sizeText` (e.g. always
                         'REACH REMOTE 1') for every copy so they all get the identical strip length/
                         position/curvature fit; the real `text` is still what gets drawn (see `draw()`
                         below), squeezed/stretched by a percent or two to fill that shared-size box —
                         the same mechanism already used to absorb a late-loading webfont's own remeasure.

   Console test (no page edits):
     const {createHullName}=await import('./src/hullname.js?nc='+Date.now());
     const g=createHullName({THREE:dbg.THREE, hull:dbg.placed.usv, text:'REACH REMOTE 1'}); dbg.placed.usv.add(g);
   Remove: g.removeFromParent(); g.userData.dispose();
*/

const _surfaceCache = new Map();   // one frame-space copy of the hull per (geometry, placement): clones share it

export function createHullName({THREE, hull, text = 'REACH REMOTE 1', ...opts}){
  const o = Object.assign({
    capHeight: 0.40, aftEnd: 0.27, y: 2.78, tracking: 0.08, weight: 700,
    font: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
    color: 0xd0d0d0, standoff: 0.015, texWidth: 2048, renderer: null, anisotropy: 8,
    bow: 0, hullName: 'reach_remote_lod1_1', frame: null, sizeText: null,
  }, opts);
  if(!THREE || !hull) throw new Error('createHullName needs {THREE, hull}');

  // ---- which mesh to fit to, and which frame to build in ---------------------------------------
  const mesh = hull.isMesh ? hull : (hull.getObjectByName(o.hullName) || largestMesh(hull));
  if(!mesh) throw new Error('createHullName: no hull mesh found');
  let frame = o.frame;
  if(!frame){ frame = hull; if(hull.isMesh){ while(frame.parent && !frame.parent.isScene) frame = frame.parent; } }
  frame.updateWorldMatrix(true, true);
  const T = new THREE.Matrix4().copy(frame.matrixWorld).invert().multiply(mesh.matrixWorld);
  const S = surfaceFor(THREE, mesh, T);

  // ---- text into a canvas ----------------------------------------------------------------------
  const cw = o.texWidth, ch = Math.max(32, Math.round(o.texWidth / 8));
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const ctx = cv.getContext('2d');
  const fontAt = px => o.weight + ' ' + px + 'px ' + o.font;
  // sizeText (see the knob doc above): the strip's SIZE is fitted to this string; the ACTUAL glyphs
  // drawn are always `text`. Same string in both by default (str => sizes and draws the one text).
  const sizeStr = o.sizeText || text;
  const layout = str => {
    ctx.font = fontAt(100);
    const capRatio = (ctx.measureText('H').actualBoundingBoxAscent || 72) / 100;
    let px = (ch * 0.56) / capRatio;
    const widthAt = p => { ctx.font = fontAt(p); let w = 0; for(const c of str) w += ctx.measureText(c).width; return w + o.tracking * p * (str.length - 1); };
    let w = widthAt(px);
    const maxW = cw * 0.96;
    if(w > maxW){ px *= maxW / w; w = maxW; }
    return {px, w, cap: px * capRatio};
  };
  const L = layout(sizeStr);
  const pad = L.cap * 0.25;
  const u0 = (cw / 2 - L.w / 2 - pad) / cw, u1 = (cw / 2 + L.w / 2 + pad) / cw;
  const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch);
    // re-measured every draw: a late-loading font may be a different width, and (when `sizeText` is
    // set) `text` itself may legitimately measure differently from `sizeStr` (e.g. a different digit) —
    // both are just "the real glyphs don't match the box the geometry was built for", fixed the same way.
    const cur = layout(text);
    const sx = cur.w > 0 ? Math.min(1.25, L.w / cur.w) : 1; // squeeze/stretch back into the box the geometry was built for
    ctx.setTransform(sx, 0, 0, 1, cw / 2 - (cur.w * sx) / 2, 0);
    ctx.font = fontAt(L.px); ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
    let x = 0; const base = ch / 2 + L.cap / 2;
    for(const c of text){ ctx.fillText(c, x, base); x += ctx.measureText(c).width + o.tracking * L.px; }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  draw();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.NoColorSpace;                      // alpha data, not a colour image
  tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = o.renderer ? o.renderer.capabilities.getMaxAnisotropy() : o.anisotropy;
  if(document.fonts && document.fonts.check && !document.fonts.check(fontAt(64))){
    document.fonts.load(fontAt(64)).then(() => { draw(); tex.needsUpdate = true; }).catch(() => {});
  }

  // ---- size in metres ----------------------------------------------------------------------------
  const mPerPx = o.capHeight / L.cap;
  const Wm = (u1 - u0) * cw * mPerPx;    // strip length along the hull
  const Hm = ch * mPerPx;                // strip height
  const bowSign = o.bow || S.bowSign;
  const stemX = bowSign < 0 ? S.xmin : S.xmax, sternDir = -bowSign;
  const reach = o.aftEnd * S.len + Wm;                     // stem to well aft of the aft end (room for the slide below)
  const xa = Math.min(stemX, stemX + sternDir * reach) - 0.5, xb = Math.max(stemX, stemX + sternDir * reach) + 0.5;

  // ---- fit a strip to each side ------------------------------------------------------------------
  const positions = [], normals = [], uvs = [], index = [];
  const R = 4;
  for(const side of [1, -1]){                               // +Z = port, -Z = starboard (bow at -X, up +Y)
    const probe = S.makeProbe(xa, xb, o.y - Hm * 0.6, o.y + Hm * 0.6, side);
    let aftX = stemX + sternDir * o.aftEnd * S.len;
    let col = arcColumns(probe,aftX, o.y, side, sternDir, Wm);
    if(col.length < 2 || col[col.length - 1].s < Wm - 1e-3){   // ran off the stem: slide aft by the shortfall
      const short = Wm - (col.length ? col[col.length - 1].s : 0) + 0.15;
      aftX += sternDir * short; col = arcColumns(probe,aftX, o.y, side, sternDir, Wm);
    }
    const N = Math.max(8, Math.ceil(Wm / 0.08));
    const readsFromStem = side === sternDir;                // reading direction (outside view) points sternward
    const base = positions.length / 3;
    let ok = true;
    for(let i = 0; i <= N && ok; i++){
      const s = Wm * i / N, x = xAtArc(col, s);
      const u = readsFromStem ? u1 - (s / Wm) * (u1 - u0) : u0 + (s / Wm) * (u1 - u0);
      for(let j = 0; j <= R; j++){
        const yy = o.y + (j / R - 0.5) * Hm;
        const hit = probe(x, yy, side) || probe(x, o.y, side);
        if(!hit){ ok = false; break; }
        // (a horizontal ray at yy hits at height yy; the fallback row borrows z from the centre line)
        positions.push(hit.p.x + hit.n.x * o.standoff, yy + hit.n.y * o.standoff, hit.p.z + hit.n.z * o.standoff);
        normals.push(hit.n.x, hit.n.y, hit.n.z);
        uvs.push(u, j / R);
      }
    }
    if(!ok){ positions.length = base * 3; normals.length = base * 3; uvs.length = base * 2; continue; }
    // quads, wound so the front face points away from the hull
    const tri = [];
    for(let i = 0; i < N; i++) for(let j = 0; j < R; j++){
      const a = base + i * (R + 1) + j, b = a + (R + 1), c = b + 1, d = a + 1;
      tri.push(a, b, c, a, c, d);
    }
    const P = k => new THREE.Vector3(positions[k * 3], positions[k * 3 + 1], positions[k * 3 + 2]);
    const fn = new THREE.Vector3().crossVectors(P(tri[1]).sub(P(tri[0])), P(tri[2]).sub(P(tri[0])));
    const out = new THREE.Vector3(normals[tri[0] * 3], normals[tri[0] * 3 + 1], normals[tri[0] * 3 + 2]);
    if(fn.dot(out) < 0) for(let k = 0; k < tri.length; k += 3){ const t = tri[k + 1]; tri[k + 1] = tri[k + 2]; tri[k + 2] = t; }
    index.push(...tri);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(index);
  geo.computeBoundingSphere(); geo.computeBoundingBox();

  const hm = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const mat = new THREE.MeshStandardMaterial({
    color: o.color, alphaMap: tex, transparent: true, depthWrite: false,
    roughness: hm.roughness !== undefined ? hm.roughness : 0.78,
    metalness: hm.metalness !== undefined ? hm.metalness : 0.06,
    envMapIntensity: hm.envMapIntensity !== undefined ? hm.envMapIntensity : 1,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
  });
  mat.name = 'hullName';
  const m = new THREE.Mesh(geo, mat);
  m.name = 'hullName'; m.userData.isHullName = true;
  m.receiveShadow = true; m.castShadow = false;
  m.onBeforeRender = () => { if(hm.envMapIntensity !== undefined) mat.envMapIntensity = hm.envMapIntensity; };

  const g = new THREE.Group();
  g.name = 'hullName:' + text; g.add(m);
  g.userData = {isHullName: true, text, options: o, mesh: m,
    dispose(){ geo.dispose(); mat.dispose(); tex.dispose(); }};
  return g;
}

/* ---- stern name (v73) ------------------------------------------------------------------------------
   createSternName({THREE, hull, text, port, ...opts}) -> THREE.Group

   The transom lettering from Ross's photo of Reach Remote 1 in harbour: the name, the port of registry
   under it, and the draft marks running down the middle (6M 8 6 4 2 5M). Everything is sized from the
   name's cap height `c`, with the photo's proportions:
     name width      42% of the flat part of the transom, centred (the photo has ~45%; a touch
                     smaller so the marks below still clear the water)
     name top        2.0c below the transom's top as the rays find it. That point is the rim, about 0.9c above
                     the painted blue edge on this model, so the name sits ~1.1c under the blue edge, as in the
                     photo (v73b, Ross: "needs more space above")
     port line       0.73c caps, 0.3c under the name's baseline
     draft marks     0.49c caps, 1.0c apart, the first ("6M") 3.4c below the name's top (the photo has ~1.1c
                     and 3.7c; the model's transom is a little shallower, so this keeps 5M above the water)
   One small 1024x256 alpha texture holds all of it (the name block on top, the six marks in a row
   below), and each piece is a little grid laid on the transom by rays cast forward from astern, so it
   follows the plate exactly. Same paint material as the side names. Cost: 1 draw call, ~150 triangles. */
export function createSternName({THREE, hull, text = 'REACH REMOTE 1', port = 'HAUGESUND', ...opts}){
  const o = Object.assign({
    widthFrac: 0.42, weight: 700, font: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
    tracking: 0.04, color: 0xd0d0d0, standoff: 0.015, texWidth: 1024, renderer: null, anisotropy: 8,
    bow: 0, hullName: 'reach_remote_lod1_1', frame: null, sizeText: null,
    marks: ['6M', '8', '6', '4', '2', '5M'],
  }, opts);
  const mesh = hull.isMesh ? hull : (hull.getObjectByName(o.hullName) || largestMesh(hull));
  let frame = o.frame;
  if(!frame){ frame = hull; if(hull.isMesh){ while(frame.parent && !frame.parent.isScene) frame = frame.parent; } }
  frame.updateWorldMatrix(true, true);
  const T = new THREE.Matrix4().copy(frame.matrixWorld).invert().multiply(mesh.matrixWorld);
  const S = surfaceFor(THREE, mesh, T);
  const bowSign = o.bow || S.bowSign, sternDir = -bowSign, sternX = sternDir > 0 ? S.xmax : S.xmin;

  // ---- a ray probe that shoots forward at the transom from astern -------------------------------
  const {pos, nrm, idx, triCount} = S, sub = [];
  for(let t = 0; t < triCount; t++){
    const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
    if(Math.max(pos[a * 3] * sternDir, pos[b * 3] * sternDir, pos[c * 3] * sternDir) < sternX * sternDir - 3) continue;
    sub.push(a, b, c);
  }
  const pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute('position', S.posAttr); pgeo.setAttribute('normal', S.nrmAttr); pgeo.setIndex(sub); pgeo.computeBoundingSphere();
  const pmesh = new THREE.Mesh(pgeo, new THREE.MeshBasicMaterial({side: THREE.DoubleSide})); pmesh.updateMatrixWorld(true);
  const ray = new THREE.Raycaster(), ro = new THREE.Vector3(), rd = new THREE.Vector3(-sternDir, 0, 0);
  const tri = new THREE.Triangle(), bc = new THREE.Vector3(), A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
  const probe = (z, y) => {
    ray.set(ro.set(sternX + sternDir * 20, y, z), rd); ray.far = 26;
    const h = ray.intersectObject(pmesh, false)[0]; if(!h) return null;
    const f = h.face; A.fromArray(pos, f.a * 3); B.fromArray(pos, f.b * 3); C.fromArray(pos, f.c * 3);
    tri.set(A, B, C); tri.getBarycoord(h.point, bc);
    const n = new THREE.Vector3().addScaledVector(A.fromArray(nrm, f.a * 3), bc.x).addScaledVector(B.fromArray(nrm, f.b * 3), bc.y).addScaledVector(C.fromArray(nrm, f.c * 3), bc.z);
    if(n.lengthSq() < 1e-8) n.copy(f.normal); n.normalize(); if(n.x * sternDir < 0) n.negate();
    return {p: h.point.clone(), n};
  };

  // ---- measure the transom: its top edge on the centreline, and its flat width -------------------
  const ref = probe(S.zc, 1.0); if(!ref) throw new Error('createSternName: no transom found');
  let top = 1.0;
  for(let y = 1.0; y < 8; y += 0.02){
    const h = probe(S.zc, y);
    if(!h || Math.abs(h.p.x - ref.p.x) > 0.6 || h.n.x * sternDir < 0.5) break;
    top = y;
  }
  const flatHalf = y => { let half = 0;
    for(let dz = 0; dz < 8; dz += 0.02){ const h = probe(S.zc + dz, y), k = probe(S.zc - dz, y);
      if(!h || !k || h.n.x * sternDir < 0.8 || k.n.x * sternDir < 0.8) break; half = dz; }
    return half; };

  // ---- the texture: name block on top, the marks in a row underneath -----------------------------
  const cw = o.texWidth, ch = Math.round(cw / 4), cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const ctx = cv.getContext('2d'), fontAt = px => o.weight + ' ' + px + 'px ' + o.font;
  ctx.font = fontAt(100);
  const capRatio = (ctx.measureText('H').actualBoundingBoxAscent || 72) / 100;
  const widthOf = (str, px) => { ctx.font = fontAt(px); let w = 0; for(const ch2 of str) w += ctx.measureText(ch2).width; return w + o.tracking * px * (str.length - 1); };
  const sizeStr = o.sizeText || text;
  const cPx = (cw * 0.72) / (widthOf(sizeStr, 100) / 100) * capRatio;   // name cap in canvas px: the name fills 72% of the width
  const ppc = cPx;                                                        // canvas px per `c`
  const nameW = widthOf(sizeStr, cPx / capRatio);
  const pad = 0.25 * ppc;
  const blk = {x0: 0, y0: 0, w: nameW + 2 * pad, h: (1 + 0.3 + 0.73) * ppc + 2 * pad};   // name block, canvas px
  const markCell = {w: 1.3 * ppc, h: 0.49 * ppc + 2 * pad * 0.6}, markY0 = blk.h + 4;
  const line = (str, capPx, cx, baseY) => {
    const px = capPx / capRatio, w = widthOf(str, px);
    ctx.font = fontAt(px); let x = cx - w / 2;
    for(const ch2 of str){ ctx.fillText(ch2, x, baseY); x += ctx.measureText(ch2).width + o.tracking * px; }
  };
  const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
    const cx = blk.w / 2, w = widthOf(text, cPx / capRatio), sx = w > 0 ? Math.min(1.25, nameW / w) : 1;
    ctx.save(); ctx.translate(cx, 0); ctx.scale(sx, 1); ctx.translate(-cx, 0);
    line(text, cPx, cx, pad + ppc); ctx.restore();
    line(port, 0.73 * ppc, cx, pad + (1 + 0.3 + 0.73) * ppc);
    o.marks.forEach((m, i) => line(m, 0.49 * ppc, (i + 0.5) * markCell.w, markY0 + markCell.h - pad * 0.6));
  };
  draw();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.NoColorSpace; tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = o.renderer ? o.renderer.capabilities.getMaxAnisotropy() : o.anisotropy;
  if(document.fonts && document.fonts.check && !document.fonts.check(fontAt(64))){
    document.fonts.load(fontAt(64)).then(() => { draw(); tex.needsUpdate = true; }).catch(() => {});
  }

  // ---- sizes in metres --------------------------------------------------------------------------
  // c from the transom's flat width at name height (two passes: that height depends on c)
  let c = 0.2;
  for(let k = 0; k < 2; k++){ const half = flatHalf(top - 2.5 * c); c = (2 * half * o.widthFrac) / (nameW / ppc); }
  const mpp = c / ppc;                                         // metres per canvas px
  const nameTop = top - 2.0 * c;

  // ---- lay each piece on the transom ------------------------------------------------------------
  const positions = [], normals = [], uvs = [], index = [];
  const right = -sternDir;                                     // +u runs toward this z, so it reads left to right from astern
  const rect = (zc, yTop, w, h, u0, u1, v0, v1, cols, rows) => {
    const base = positions.length / 3;
    for(let i = 0; i <= cols; i++) for(let j = 0; j <= rows; j++){
      const z = zc + right * (i / cols - 0.5) * w, y = yTop - (j / rows) * h;
      const hit = probe(z, y) || {p: new THREE.Vector3(ref.p.x, y, z), n: ref.n};
      positions.push(hit.p.x + hit.n.x * o.standoff, y + hit.n.y * o.standoff, hit.p.z + hit.n.z * o.standoff);
      normals.push(hit.n.x, hit.n.y, hit.n.z);
      uvs.push(u0 + (i / cols) * (u1 - u0), 1 - (v0 + (j / rows) * (v1 - v0)));
    }
    for(let i = 0; i < cols; i++) for(let j = 0; j < rows; j++){
      const a = base + i * (rows + 1) + j, b = a + rows + 1;
      index.push(a, b, b + 1, a, b + 1, a + 1);
    }
  };
  rect(S.zc, nameTop + pad * mpp, blk.w * mpp, blk.h * mpp, 0, blk.w / cw, 0, blk.h / ch, 8, 2);
  const pitch = 1.0 * c, mark0 = nameTop - 3.4 * c;
  o.marks.forEach((m, i) => rect(S.zc, mark0 - i * pitch + pad * 0.6 * mpp, markCell.w * mpp, markCell.h * mpp,
    i * markCell.w / cw, (i + 1) * markCell.w / cw, markY0 / ch, (markY0 + markCell.h) / ch, 1, 1));

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(index); geo.computeBoundingSphere();
  // wind every quad so its front face points out of the transom
  const P = k => new THREE.Vector3().fromArray(positions, k * 3);
  const fn = new THREE.Vector3().crossVectors(P(index[1]).sub(P(index[0])), P(index[2]).sub(P(index[0])));
  if(fn.x * sternDir < 0){ for(let k = 0; k < index.length; k += 3){ const t = index[k + 1]; index[k + 1] = index[k + 2]; index[k + 2] = t; } geo.setIndex(index); }

  const hm = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const mat = new THREE.MeshStandardMaterial({
    color: o.color, alphaMap: tex, transparent: true, depthWrite: false,
    roughness: hm.roughness !== undefined ? hm.roughness : 0.78, metalness: hm.metalness !== undefined ? hm.metalness : 0.06,
    envMapIntensity: hm.envMapIntensity !== undefined ? hm.envMapIntensity : 1,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
  });
  mat.name = 'sternName';
  const m = new THREE.Mesh(geo, mat);
  m.name = 'sternName'; m.userData.isHullName = true; m.receiveShadow = true;
  m.onBeforeRender = () => { if(hm.envMapIntensity !== undefined) mat.envMapIntensity = hm.envMapIntensity; };
  pgeo.setIndex(null); pgeo.dispose();
  const g = new THREE.Group(); g.name = 'sternName:' + text; g.add(m);
  g.userData = {isHullName: true, isSternName: true, text, options: o, mesh: m, capHeight: c, transomTop: top,
    marks: {top0: mark0, pitch, cap: 0.49 * c},   // v82: the side draft marks (createDraftMarks) line up with these
    dispose(){ geo.dispose(); mat.dispose(); tex.dispose(); }};
  return g;
}

/* ---- bow IMO number (v75) ---------------------------------------------------------------------------
   createBowImo({THREE, hull, text, ...opts}) -> THREE.Group

   "IMO 9972191" in dark letters, centred on the forward-facing white panel above the bow bulwark (Ross's
   head-on photo of Reach Remote 1). The panel is found with rays shot aft from ahead of the stem on the
   centreline: the lowest run of hits that face forward and sit well back from the stem. The text fills ~38%
   of the panel's width (as in the photo), capped to fit its height. 1 draw call, ~30 triangles, one
   1024x128 alpha texture. */
export function createBowImo({THREE, hull, text = 'IMO 9972191', ...opts}){
  const o = Object.assign({
    widthFrac: 0.38, maxCap: 0.2, weight: 600, font: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
    tracking: 0.02, color: 0x23263a, standoff: 0.015, texWidth: 1024, renderer: null, anisotropy: 8,
    bow: 0, hullName: 'reach_remote_lod1_1', frame: null,
  }, opts);
  const mesh = hull.isMesh ? hull : (hull.getObjectByName(o.hullName) || largestMesh(hull));
  let frame = o.frame;
  if(!frame){ frame = hull; if(hull.isMesh){ while(frame.parent && !frame.parent.isScene) frame = frame.parent; } }
  frame.updateWorldMatrix(true, true);
  const T = new THREE.Matrix4().copy(frame.matrixWorld).invert().multiply(mesh.matrixWorld);
  const S = surfaceFor(THREE, mesh, T);
  const bowSign = o.bow || S.bowSign, stemX = bowSign > 0 ? S.xmax : S.xmin;

  // rays shot sternward from ahead of the stem, against the forward half of the hull only
  const {pos, nrm, idx, triCount} = S, sub = [];
  for(let t = 0; t < triCount; t++){
    const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
    if(Math.max(pos[a * 3] * bowSign, pos[b * 3] * bowSign, pos[c * 3] * bowSign) < stemX * bowSign - S.len * 0.5) continue;
    sub.push(a, b, c);
  }
  // The rays all run along x, so a ray at (z, y) can only hit triangles whose (z, y) footprint covers that point:
  // bucket the triangles in a 2D grid and test only the probe's cell, nearest hit wins (the same hit and face normal
  // as a Raycaster against the whole set, in a few ms instead of ~250; website, 10 Oct 2026)
  const CELL = 0.25, cells = new Map(), key = (i, j) => i * 100003 + j;
  for(let k = 0; k < sub.length; k += 3){
    let z0 = Infinity, z1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for(let q = 0; q < 3; q++){ const a = sub[k + q] * 3; z0 = Math.min(z0, pos[a + 2]); z1 = Math.max(z1, pos[a + 2]); y0 = Math.min(y0, pos[a + 1]); y1 = Math.max(y1, pos[a + 1]); }
    for(let i = Math.floor(z0 / CELL); i <= Math.floor(z1 / CELL); i++) for(let j = Math.floor(y0 / CELL); j <= Math.floor(y1 / CELL); j++){
      const c = key(i, j); let l = cells.get(c); if(!l) cells.set(c, l = []); l.push(k);
    }
  }
  const ray = new THREE.Ray(), ro = new THREE.Vector3(), rd = new THREE.Vector3(-bowSign, 0, 0), hit = new THREE.Vector3();
  const ta = new THREE.Vector3(), tb = new THREE.Vector3(), tc = new THREE.Vector3();
  const corner = (t, k) => t.set(pos[sub[k] * 3], pos[sub[k] * 3 + 1], pos[sub[k] * 3 + 2]);
  const probe = (z, y) => {
    ray.set(ro.set(stemX + bowSign * 20, y, z), rd);
    const far = 20 + S.len * 0.5, list = cells.get(key(Math.floor(z / CELL), Math.floor(y / CELL)));
    if(!list) return null;
    let best = null, bestD = Infinity;
    for(const k of list){
      if(!ray.intersectTriangle(corner(ta, k), corner(tb, k + 1), corner(tc, k + 2), false, hit)) continue;
      const d = ro.distanceTo(hit);
      if(d > far || d >= bestD) continue;
      bestD = d;
      best = {p: hit.clone(), n: THREE.Triangle.getNormal(ta, tb, tc, new THREE.Vector3())};
    }
    if(!best) return null;
    if(best.n.x * bowSign < 0) best.n.negate();
    return best;
  };

  // the panel: the LOWEST run (at least 0.3 m tall) of forward-facing hits set back at least 2 m from the stem, i.e.
  // the first face above the bow bulwark, not the deckhouse fronts higher up
  let best = null, run = null;
  for(let y = 1.0; y < 8 && !best; y += 0.02){
    const h = probe(S.zc, y);
    const ok = h && h.n.x * bowSign > 0.9 && Math.abs(h.p.x - stemX) > 2;
    if(ok && run && Math.abs(h.p.x - run.x) < 0.15){ run.y1 = y; continue; }
    if(run && run.y1 - run.y0 >= 0.3) best = run;
    run = ok ? {x: h.p.x, y0: y, y1: y} : null;
  }
  if(!best || best.y1 - best.y0 < 0.3) throw new Error('createBowImo: no forward-facing panel found');
  const yc = (best.y0 + best.y1) / 2;
  let half = 0;
  for(let dz = 0; dz < 6; dz += 0.02){
    const h = probe(S.zc + dz, yc), k = probe(S.zc - dz, yc);
    if(!h || !k || Math.abs(h.p.x - best.x) > 0.3 || Math.abs(k.p.x - best.x) > 0.3) break;
    half = dz;
  }

  // text into a canvas, then sized: ~38% of the panel width, no taller than 40% of the panel
  const cw = o.texWidth, ch = Math.round(cw / 8), cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const ctx = cv.getContext('2d'), fontAt = px => o.weight + ' ' + px + 'px ' + o.font;
  ctx.font = fontAt(100);
  const capRatio = (ctx.measureText('H').actualBoundingBoxAscent || 72) / 100;
  const widthOf = px => { ctx.font = fontAt(px); let w = 0; for(const c of text) w += ctx.measureText(c).width; return w + o.tracking * px * (text.length - 1); };
  const aspect = widthOf(100) / (100 * capRatio);              // text width per cap height
  const cap = Math.min(o.maxCap, (best.y1 - best.y0) * 0.4, (2 * half * o.widthFrac) / aspect);
  const cPx = Math.min(ch * 0.6, (cw * 0.9) / aspect);           // cap height in canvas px
  const draw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
    const px = cPx / capRatio; ctx.font = fontAt(px);
    let x = cw / 2 - widthOf(px) / 2;
    for(const c of text){ ctx.fillText(c, x, ch / 2 + cPx / 2); x += ctx.measureText(c).width + o.tracking * px; }
  };
  draw();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.NoColorSpace; tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = o.renderer ? o.renderer.capabilities.getMaxAnisotropy() : o.anisotropy;
  if(document.fonts && document.fonts.check && !document.fonts.check(fontAt(64))){
    document.fonts.load(fontAt(64)).then(() => { draw(); tex.needsUpdate = true; }).catch(() => {});
  }

  // a grid on the panel, the whole canvas mapped across it
  const mpp = cap / cPx, W = cw * mpp, H = ch * mpp, right = -bowSign;   // +u runs to the viewer's right, seen from ahead
  const positions = [], normals = [], uvs = [], index = [], cols = 8, rows = 2;
  for(let i = 0; i <= cols; i++) for(let j = 0; j <= rows; j++){
    const z = S.zc + right * (i / cols - 0.5) * W, y = yc + (0.5 - j / rows) * H;
    const hit = probe(z, y);
    const px = hit && Math.abs(hit.p.x - best.x) < 0.3 ? hit.p.x : best.x;
    positions.push(px + bowSign * o.standoff, y, z); normals.push(bowSign, 0, 0); uvs.push(i / cols, 1 - j / rows);
  }
  for(let i = 0; i < cols; i++) for(let j = 0; j < rows; j++){
    const a = i * (rows + 1) + j, b = a + rows + 1;
    index.push(a, b, b + 1, a, b + 1, a + 1);
  }
  const P = k => new THREE.Vector3().fromArray(positions, k * 3);
  const fn = new THREE.Vector3().crossVectors(P(index[1]).sub(P(index[0])), P(index[2]).sub(P(index[0])));
  if(fn.x * bowSign < 0) for(let k = 0; k < index.length; k += 3){ const t = index[k + 1]; index[k + 1] = index[k + 2]; index[k + 2] = t; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(index); geo.computeBoundingSphere();

  const hm = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const mat = new THREE.MeshStandardMaterial({
    color: o.color, alphaMap: tex, transparent: true, depthWrite: false,
    roughness: hm.roughness !== undefined ? hm.roughness : 0.78, metalness: hm.metalness !== undefined ? hm.metalness : 0.06,
    envMapIntensity: hm.envMapIntensity !== undefined ? hm.envMapIntensity : 1,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
  });
  mat.name = 'bowImo';
  const m = new THREE.Mesh(geo, mat);
  m.name = 'bowImo'; m.userData.isHullName = true; m.receiveShadow = true;
  m.onBeforeRender = () => { if(hm.envMapIntensity !== undefined) mat.envMapIntensity = hm.envMapIntensity; };
  const g = new THREE.Group(); g.name = 'bowImo:' + text; g.add(m);
  g.userData = {isHullName: true, isBowImo: true, text, options: o, mesh: m, capHeight: cap, panel: {x: best.x, y0: best.y0, y1: best.y1, half},
    dispose(){ geo.dispose(); mat.dispose(); tex.dispose(); }};
  return g;
}

/* ---- helpers --------------------------------------------------------------------------------- */

/* ---- side draft marks (v82) -------------------------------------------------------------------------
   createDraftMarks({THREE, hull, top0, pitch, cap, ...opts}) -> THREE.Group

   The draft scale painted down each side three times (Ross's photos of Reach Remote 1: near the bow, amidships
   and close to the stern), 6M 8 6 4 2 5M 8 6 4 2 4M, top to bottom, crossing the boot-top into the red. The
   marks read off the same keel datum as the transom's (createSternName), so pass its userData.marks: each
   glyph's cap top is at top0 - i * pitch and it is `cap` tall; that puts 6M..5M level with the transom's and
   carries on down to 4M (below the waterline, as on the real hull). Stations are fractions of the hull's
   waterline length from the stem. Each glyph is its own small quad laid on the skin by side rays, so the column
   follows the hull's curve. One 1024x64 alpha texture shared by every glyph, 1 draw call, ~130 triangles.
*/
export function createDraftMarks({THREE, hull, top0, pitch, cap, ...opts}){
  const o = Object.assign({
    // v83: midships moved forward with the full-size logo: just forward of SUBSEA's S on port (the photo), aft of its A on starboard
    stations: [0.094, 0.498, 0.972], marks: ['6M', '8', '6', '4', '2', '5M', '8', '6', '4', '2', '4M'],
    weight: 700, font: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif', color: 0xd0d0d0, standoff: 0.015,
    renderer: null, anisotropy: 8, bow: 0, hullName: 'reach_remote_lod1_1', frame: null,
  }, opts);
  const mesh = hull.isMesh ? hull : (hull.getObjectByName(o.hullName) || largestMesh(hull));
  let frame = o.frame;
  if(!frame){ frame = hull; if(hull.isMesh){ while(frame.parent && !frame.parent.isScene) frame = frame.parent; } }
  frame.updateWorldMatrix(true, true);
  const T = new THREE.Matrix4().copy(frame.matrixWorld).invert().multiply(mesh.matrixWorld);
  const S = surfaceFor(THREE, mesh, T);
  const bowSign = o.bow || S.bowSign, stemX = bowSign < 0 ? S.xmin : S.xmax, sternDir = -bowSign;

  // texture: the distinct labels in a row of cells
  const labels = [...new Set(o.marks)], cell = 112, cw = 1024, chh = 64;   // wide cells with gutters, so no glyph bleeds into the next at any mip level
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = chh;
  const ctx = cv.getContext('2d'), fontAt = px => o.weight + ' ' + px + 'px ' + o.font;
  ctx.font = fontAt(100);
  const capRatio = (ctx.measureText('H').actualBoundingBoxAscent || 72) / 100, capPx = 36, px = capPx / capRatio;
  const draw = () => {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, chh); ctx.fillStyle = '#fff'; ctx.font = fontAt(px);
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    labels.forEach((l, i) => ctx.fillText(l, (i + 0.5) * cell, (chh + capPx) / 2));
  };
  draw();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.NoColorSpace; tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = o.renderer ? o.renderer.capabilities.getMaxAnisotropy() : o.anisotropy;
  if(document.fonts && document.fonts.check && !document.fonts.check(fontAt(32))){
    document.fonts.load(fontAt(32)).then(() => { draw(); tex.needsUpdate = true; }).catch(() => {});
  }
  const mpp = cap / capPx, qw = cell * mpp, qh = chh * mpp;      // one cell on the hull, metres

  const positions = [], normals = [], uvs = [], index = [];
  const yLo = top0 - (o.marks.length - 1) * pitch - qh, yHi = top0 + qh;
  for(const side of [1, -1]){
    for(const f of o.stations){
      const xc = stemX + sternDir * f * S.len;
      const probe = S.makeProbe(xc - 1.5, xc + 1.5, yLo - 0.5, yHi + 0.5, side);
      const right = side;                                       // seen from outside on this side, screen-right is +x * side
      o.marks.forEach((lab, i) => {
        const k = labels.indexOf(lab), yc = top0 - i * pitch - cap / 2;
        const corners = [];
        for(const [du, dv] of [[0, 0], [1, 0], [1, 1], [0, 1]]){
          const x = xc + right * (du - 0.5) * qw, y = yc + (dv - 0.5) * qh, hit = probe(x, y, side);
          if(!hit) return;
          corners.push({hit, u: (k + du) / labels.length * (labels.length * cell / cw), v: dv});
        }
        const base = positions.length / 3;
        for(const c of corners){
          positions.push(c.hit.p.x + c.hit.n.x * o.standoff, c.hit.p.y + c.hit.n.y * o.standoff, c.hit.p.z + c.hit.n.z * o.standoff);
          normals.push(c.hit.n.x, c.hit.n.y, c.hit.n.z); uvs.push(c.u, c.v);
        }
        // wind so the front face points out of the hull
        const P = j => new THREE.Vector3().fromArray(positions, (base + j) * 3);
        const fn = new THREE.Vector3().crossVectors(P(1).sub(P(0)), P(2).sub(P(0)));
        if(fn.z * side >= 0) index.push(base, base + 1, base + 2, base, base + 2, base + 3);
        else index.push(base, base + 2, base + 1, base, base + 3, base + 2);
      });
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(index); geo.computeBoundingSphere();
  const hm = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const mat = new THREE.MeshStandardMaterial({
    color: o.color, alphaMap: tex, transparent: true, depthWrite: false,
    roughness: hm.roughness !== undefined ? hm.roughness : 0.78, metalness: hm.metalness !== undefined ? hm.metalness : 0.06,
    envMapIntensity: hm.envMapIntensity !== undefined ? hm.envMapIntensity : 1,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
  });
  mat.name = 'draftMarks';
  const m = new THREE.Mesh(geo, mat);
  m.name = 'draftMarks'; m.userData.isHullName = true; m.receiveShadow = true;
  m.onBeforeRender = () => { if(hm.envMapIntensity !== undefined) mat.envMapIntensity = hm.envMapIntensity; };
  const g = new THREE.Group(); g.name = 'draftMarks'; g.add(m);
  g.userData = {isHullName: true, isDraftMarks: true, options: o, mesh: m, quads: index.length / 6,
    dispose(){ geo.dispose(); mat.dispose(); tex.dispose(); }};
  return g;
}

function largestMesh(root){
  let best = null, n = -1;
  root.traverse(c => { if(!c.isMesh || c.userData.isHullName) return;
    const k = c.geometry.index ? c.geometry.index.count : c.geometry.attributes.position.count;
    if(k > n){ n = k; best = c; } });
  return best;
}

// The hull in the build frame, plus a sideways ray probe that returns the outermost skin point and the
// hull's own interpolated normal there. Cached, so every clone of the same model reuses it.
function surfaceFor(THREE, mesh, T){
  const key = mesh.geometry.uuid + '|' + T.elements.map(v => v.toFixed(3)).join(',');
  if(_surfaceCache.has(key)) return _surfaceCache.get(key);
  const src = mesh.geometry, sp = src.attributes.position, sn = src.attributes.normal;
  const nm = new THREE.Matrix3().getNormalMatrix(T);
  const pos = new Float32Array(sp.count * 3), nrm = new Float32Array(sp.count * 3);
  const v = new THREE.Vector3();
  let xmin = 1e9, xmax = -1e9;
  for(let i = 0; i < sp.count; i++){
    v.fromBufferAttribute(sp, i).applyMatrix4(T); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
    if(sn){ v.fromBufferAttribute(sn, i).applyMatrix3(nm).normalize(); nrm[i * 3] = v.x; nrm[i * 3 + 1] = v.y; nrm[i * 3 + 2] = v.z; }
  }
  // bow = the narrower end, measured in a band 1.2-2.5 m above the waterline (below any deck gear)
  const band = [];
  for(let i = 0; i < sp.count; i++){ const y = pos[i * 3 + 1]; if(y > 0.2 && y < 1.5) band.push(i); }
  let zmin = 1e9, zmax = -1e9;
  for(const i of band){ const x = pos[i * 3], z = pos[i * 3 + 2]; if(x < xmin) xmin = x; if(x > xmax) xmax = x; if(z < zmin) zmin = z; if(z > zmax) zmax = z; }
  const zc = (zmin + zmax) / 2, len = xmax - xmin, win = len * 0.08;
  let wLo = 0, wHi = 0;
  for(const i of band){ const x = pos[i * 3], dz = Math.abs(pos[i * 3 + 2] - zc);
    if(x < xmin + win && dz > wLo) wLo = dz; if(x > xmax - win && dz > wHi) wHi = dz; }
  const bowSign = wLo <= wHi ? -1 : 1;

  const idx = src.index ? src.index.array : null, triCount = idx ? idx.length / 3 : sp.count / 3;
  const posAttr = new THREE.BufferAttribute(pos, 3), nrmAttr = new THREE.BufferAttribute(nrm, 3);
  const probeMat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
  // A probe that only tests the hull triangles inside one box. The whole hull is ~20k triangles and a
  // name needs ~700 rays, so testing just the bow strip is what keeps the fit to a few milliseconds.
  const makeProbe = (xa, xb, ya, yb, side) => {
    const sub = [];
    for(let t = 0; t < triCount; t++){
      const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
      if(side && Math.max((pos[a * 3 + 2] - zc) * side, (pos[b * 3 + 2] - zc) * side, (pos[c * 3 + 2] - zc) * side) < 0) continue;
      if(Math.max(pos[a * 3], pos[b * 3], pos[c * 3]) < xa || Math.min(pos[a * 3], pos[b * 3], pos[c * 3]) > xb) continue;
      if(Math.max(pos[a * 3 + 1], pos[b * 3 + 1], pos[c * 3 + 1]) < ya || Math.min(pos[a * 3 + 1], pos[b * 3 + 1], pos[c * 3 + 1]) > yb) continue;
      sub.push(a, b, c);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', posAttr); geo.setAttribute('normal', nrmAttr); geo.setIndex(sub);
    geo.computeBoundingSphere();
    const probeMesh = new THREE.Mesh(geo, probeMat); probeMesh.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(), o = new THREE.Vector3(), d = new THREE.Vector3();
    const tri = new THREE.Triangle(), bc = new THREE.Vector3(), na = new THREE.Vector3(), nb = new THREE.Vector3(), nc = new THREE.Vector3();
    const pa = new THREE.Vector3(), pb = new THREE.Vector3(), pc = new THREE.Vector3();
    return (x, y, side) => {
      ray.set(o.set(x, y, zc + side * 60), d.set(0, 0, -side)); ray.far = 120;
      const hits = ray.intersectObject(probeMesh, false);
      if(!hits.length) return null;
      const h = hits[0], f = h.face;
      pa.fromArray(pos, f.a * 3); pb.fromArray(pos, f.b * 3); pc.fromArray(pos, f.c * 3);
      tri.set(pa, pb, pc); tri.getBarycoord(h.point, bc);
      na.fromArray(nrm, f.a * 3); nb.fromArray(nrm, f.b * 3); nc.fromArray(nrm, f.c * 3);
      const n = new THREE.Vector3().addScaledVector(na, bc.x).addScaledVector(nb, bc.y).addScaledVector(nc, bc.z);
      if(n.lengthSq() < 1e-8) n.copy(f.normal);
      n.normalize(); if(n.z * side < 0) n.negate();
      return {p: h.point.clone(), n};
    };
  };
  const S = {makeProbe, xmin, xmax, len, zc, bowSign, pos, nrm, idx, triCount, posAttr, nrmAttr};
  _surfaceCache.set(key, S);
  return S;
}

// Walk from the aft end toward the stem along the hull at height y, recording arc length, so letters
// keep their true width where the bow curves in.
function arcColumns(probe,aftX, y, side, sternDir, Wm){
  const out = []; const step = 0.04; let prev = null, s = 0;
  for(let k = 0; k < 4000; k++){
    const x = aftX - sternDir * step * k;
    const h = probe(x, y, side);
    if(!h) break;
    if(prev) s += Math.hypot(h.p.x - prev.x, h.p.z - prev.z);
    out.push({x, s}); prev = h.p;
    if(s >= Wm) break;
  }
  return out;
}
function xAtArc(col, s){
  if(s <= 0) return col[0].x;
  for(let i = 1; i < col.length; i++) if(col[i].s >= s){
    const a = col[i - 1], b = col[i], t = (s - a.s) / Math.max(1e-9, b.s - a.s);
    return a.x + (b.x - a.x) * t;
  }
  return col[col.length - 1].x;
}
