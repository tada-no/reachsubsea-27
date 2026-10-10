/* src/boottop.js — the red/blue paint line on the Reach Remotes, at the real ship's height (v84).

   Contract: raiseBootTop({THREE, hull, ...opts}) -> {changed, y, navy, red}

   On the model the red bottom paint stops right at the waterline, so all of the draft marks sit in the blue and the
   blue band is ~0.6 m taller than the real one. On Reach Remote 1 (Ross's crane, transom and harbour photos) the line
   runs through the draft scale under 6M, between the "6" and the "4", at the bow, midships, aft and on the transom.
   So this paints the hull's navy red from the model's own line up to `y` (metres above the waterline, in the vessel
   holder's frame), level along the whole hull. It changes nothing else: only texels close to the hull navy are
   recoloured, so white lettering, marks and fittings in the band keep their colour.

   The navy and red are read from the hull's own texture (raycasts at midships, above and below the model's line), so
   the new band matches the old red exactly; a texel's shading relative to the navy carries over. Done inside the hull
   material's shader (onBeforeCompile): no texture, no draw call. The material and the mesh's place in its holder are
   the same on every copy of the model, so one call covers them all. Call it once the model is placed.
*/
export function raiseBootTop({THREE, hull, ...opts}){
  const o = Object.assign({
    y: 0.70,              // the new line: just above the top of the "4" under 6M (src/hullname.js's draft marks)
    probeX: 0.5,          // where the colours are read: midships, metres along x
    navyY: 0.9, redY: -0.6, // above and below the model's own line there (under the logo, which starts at 1.16)
    tol: 0.09,            // how close (linear RGB) a texel must be to the navy to be repainted
    hullName: 'reach_remote_lod1_1', frame: null,
  }, opts);
  const mesh = hull.isMesh ? hull : hull.getObjectByName(o.hullName);
  if(!mesh || !mesh.material || !mesh.material.map) return {changed: false};
  const mat = mesh.material;
  if(mat.userData.bootTop) return {changed: false, y: mat.userData.bootTop.y};
  let frame = o.frame;
  if(!frame){ frame = hull; if(hull.isMesh){ while(frame.parent && !frame.parent.isScene) frame = frame.parent; } }
  frame.updateWorldMatrix(true, true); mesh.updateWorldMatrix(true, false);
  const toFrame = new THREE.Matrix4().copy(frame.matrixWorld).invert().multiply(mesh.matrixWorld);

  // the paint colours, read from the texture where a sideways ray meets the hull
  const img = mat.map.image;
  if(!img || !img.width) return {changed: false};
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d', {willReadFrequently: true});
  const ray = new THREE.Raycaster();
  const sample = (y) => {
    const ro = new THREE.Vector3(o.probeX, y, 30).applyMatrix4(frame.matrixWorld);
    const rd = new THREE.Vector3(0, 0, -1).transformDirection(frame.matrixWorld);
    ray.set(ro, rd);
    const h = ray.intersectObject(mesh, false)[0];
    if(!h || !h.uv) return null;
    const uv = h.uv.clone(); mat.map.transformUv(uv);
    const fr = t => t - Math.floor(t), px = fr(uv.x) * img.width, py = fr(uv.y) * img.height;   // flipY false (glTF): v runs down the image
    ctx.clearRect(0, 0, 64, 64);
    ctx.drawImage(img, px - 2, py - 2, 5, 5, 0, 0, 5, 5);
    const d = ctx.getImageData(0, 0, 5, 5).data, c = [0, 0, 0];
    for(let i = 0; i < 25; i++) for(let k = 0; k < 3; k++) c[k] += d[i * 4 + k] / 25 / 255;
    return new THREE.Color().setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);   // -> linear, as the shader sees it
  };
  const navy = sample(o.navyY), red = sample(o.redY);
  if(!navy || !red) return {changed: false};

  const U = {
    uBtToFrame: {value: toFrame}, uBtY: {value: o.y}, uBtTol: {value: o.tol},
    uBtNavy: {value: new THREE.Vector3(navy.r, navy.g, navy.b)}, uBtRed: {value: new THREE.Vector3(red.r, red.g, red.b)},
  };
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey ? mat.customProgramCacheKey() : '';
  mat.onBeforeCompile = function(sh, renderer){
    if(typeof prev === 'function') prev.call(this, sh, renderer);
    if(sh.vertexShader.indexOf('#include <begin_vertex>') < 0 || sh.fragmentShader.indexOf('#include <map_fragment>') < 0) return;
    Object.assign(sh.uniforms, U);
    sh.vertexShader = 'uniform mat4 uBtToFrame;\nvarying float vBtY;\n' + sh.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n  vBtY = (uBtToFrame * vec4(transformed, 1.0)).y;');
    sh.fragmentShader = 'uniform float uBtY, uBtTol;\nuniform vec3 uBtNavy, uBtRed;\nvarying float vBtY;\n' + sh.fragmentShader.replace('#include <map_fragment>',
      `#include <map_fragment>
  if(vBtY < uBtY){
    vec3 bt = diffuseColor.rgb - uBtNavy;
    if(dot(bt, bt) < uBtTol * uBtTol){
      // keep the texel's light/dark relative to the navy, so any shading in the paint carries over
      float s = clamp((diffuseColor.r + diffuseColor.g + diffuseColor.b) / max(uBtNavy.r + uBtNavy.g + uBtNavy.b, 1e-3), 0.5, 1.6);
      diffuseColor.rgb = clamp(uBtRed * s, 0.0, 1.0);
    }
  }`);
  };
  mat.customProgramCacheKey = () => prevKey + '|boottop84';
  mat.userData.bootTop = {y: o.y};
  mat.needsUpdate = true;
  return {changed: true, y: o.y, navy: navy.getHexString(), red: red.getHexString()};
}
