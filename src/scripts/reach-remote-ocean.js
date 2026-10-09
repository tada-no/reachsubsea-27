/* src/scripts/reach-remote-ocean.js — the 3D World's sea, ported for the Reach Remote stage (9 Oct 2026).
   Ross: "have you considered it in its environment, like the 3D World?" The first pass used three.js's Water addon
   and a gradient sky; this is the world's own code instead, lifted from reach-world/reach-ocean-realism.html
   (sky, Gerstner ocean with the hull's shadow and waterline foam, the sea seen from below as Snell's window) and
   reach-world/src/lighting.js (sun, sky fill, hemisphere, the water column's fog and backdrop dome), so the vessel
   looks the way it does in the world. Left out: the seabed, marine snow, light shafts, lamps, rig-leg rings, the
   post-processing grade and bloom. Comments explaining each number are in the world's files.

     const SEA = createOcean({THREE, scene, renderer, camera, oceanSeg: 200});
     SEA.setVisible(true | false)           show the sea, sky dome and its lights (the studio hides them)
     SEA.setHull(holder, ellipse)           the hull's waterline ellipse {cx, cz, hl, hw}, for shadow + foam
     SEA.update(t, camera, pbrMats)         once per frame: fog, lights, backdrop, dome, uniforms. Returns {under, f}
     SEA.waveAt(x, z, t)                    the swell's displacement [dx, dy, dz] at a point (buoyancy)
     SEA.setSwell(k)                        sea state: every wave's steepness × k (1 = the world's; Ross asked for calmer)
     SEA.setMirror(on)                      the vessel mirrored in the water (Ross liked the Water addon's reflection, 9 Oct 2026)
     SEA.renderMirror(renderer, scene, cam) once per frame BEFORE the main render: draws what stands above the water into the
                                            mirror texture from a camera reflected in the surface (three.js Reflector's method,
                                            oblique near plane at y = 0 so nothing below the surface leaks in). Only the vessel
                                            and its fittings are drawn: the sea, sky and dome are hidden for the pass
     SEA.bobPose(holder, t, half, beam, out) the holder's ride on the swell as [y, rot.x, rot.z]
     SEA.waterlineEllipse(holder, mesh)     measure a floating hull's waterline ellipse in the holder's frame
     SEA.environment                        the sky baked as the PBR environment map
     SEA.SUN                                the sun direction
*/
export function createOcean({ THREE, scene, renderer, camera, oceanSeg = 200, cloudOct = 3, swell = 1 }) {
  const SUN = new THREE.Vector3(-0.58, 0.24, -0.44).normalize();

  // ---- sky ---------------------------------------------------------------------------------------
  const SKY_GLSL = `
uniform vec3 uSun;
uniform float uTime;
uniform float uCloudCoverage;
float cloudHash(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453); }
float cloudNoise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(cloudHash(i),cloudHash(i+vec2(1.0,0.0)),f.x),
             mix(cloudHash(i+vec2(0.0,1.0)),cloudHash(i+vec2(1.0,1.0)),f.x), f.y);
}
float cloudFbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<${cloudOct};i++){ v+=a*cloudNoise(p); p*=2.03; a*=0.5; }
  return v;
}
vec3 skyColor(vec3 d){
  vec3 zenith=vec3(0.07,0.20,0.38);
  vec3 horiz =vec3(0.60,0.66,0.71);
  vec3 warm  =vec3(0.96,0.82,0.62);
  float up=clamp(d.y,-1.0,1.0);
  vec3 col=mix(horiz,zenith,pow(clamp(up,0.0,1.0),0.5));
  float sunAz=pow(max(dot(normalize(vec3(d.x,0.0,d.z)+vec3(1e-5,0.0,0.0)),normalize(vec3(uSun.x,0.0,uSun.z))),0.0),3.0);
  col=mix(col,mix(col,warm,0.45),sunAz*(1.0-clamp(up,0.0,1.0)));
  if(up<0.0) col=mix(col,vec3(0.10,0.16,0.22),clamp(-up*2.2,0.0,1.0));
  float cFade=smoothstep(0.03,0.24,up);
  if(uCloudCoverage>0.0 && cFade>0.0){
    float cPersp=max(up,0.08);
    vec2 cUv=d.xz/cPersp*2.4 + vec2(uTime*0.006,uTime*0.004);
    float cShape=cloudFbm(cUv);
    float cGaps=cloudNoise(cUv*0.14+17.0);
    float cTarget=mix(0.28,0.46,cGaps)*uCloudCoverage;
    float cEdge=smoothstep(0.0,0.16,cShape-(1.0-cTarget));
    if(cEdge>0.001){
      vec2 cSunDir=normalize(uSun.xz+1e-4);
      float cLit=cloudNoise(cUv-cSunDir*0.4);
      float cShade=clamp(0.78+0.5*(cLit-cShape),0.55,1.25);
      vec3 cCol=mix(vec3(0.58,0.62,0.67),vec3(0.97,0.95,0.90),clamp(cShade,0.0,1.25));
      cCol*=0.94+0.12*up;
      col=mix(col,cCol,cEdge*cFade*0.85);
    }
  }
  float s=max(dot(d,uSun),0.0);
  col+=vec3(1.0,0.93,0.80)*pow(s,2200.0)*7.0;
  col+=vec3(1.0,0.88,0.70)*pow(s,80.0)*0.14;
  col+=vec3(1.0,0.90,0.75)*pow(s,8.0)*0.035;
  return col;
}`;
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(2200, 48, 28),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uSun: { value: SUN }, uTime: { value: 0 }, uCloudCoverage: { value: 1 } },
      vertexShader: `varying vec3 vD; void main(){ vD=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: SKY_GLSL + `varying vec3 vD; void main(){ gl_FragColor=vec4(skyColor(vD),1.0); }`,
    }),
  );
  sky.frustumCulled = false;
  scene.add(sky);
  // The sky baked as the environment map: PBR materials reflect it
  const pmrem = new THREE.PMREMGenerator(renderer);
  const es = new THREE.Scene();
  es.add(sky.clone());
  const environment = pmrem.fromScene(es, 0.04).texture;
  es.clear();
  pmrem.dispose();

  // ---- gerstner waves (shared JS + GLSL) ---------------------------------------------------------
  const WAVES = [
    { dir: [1.0, 0.28], steep: 0.115, len: 52.0 },
    { dir: [0.72, -0.68], steep: 0.085, len: 31.0 },
    { dir: [-0.45, 0.89], steep: 0.062, len: 18.5 },
    { dir: [0.94, 0.34], steep: 0.04, len: 9.5 },
    { dir: [-0.86, -0.5], steep: 0.026, len: 5.2 },
    { dir: [0.12, 0.99], steep: 0.02, len: 74.0 },
  ];
  const wDir = [];
  const wPar = [];
  WAVES.forEach((w) => {
    const l = Math.hypot(w.dir[0], w.dir[1]);
    wDir.push(new THREE.Vector2(w.dir[0] / l, w.dir[1] / l));
    wPar.push(new THREE.Vector2(w.steep, w.len));
  });
  const NOISE_GLSL = `
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5; for(int i=0;i<4;i++){v+=a*noise(p); p*=2.03; a*=0.5;} return v;}
float fbm3(vec2 p){float v=0.0,a=0.5; for(int i=0;i<3;i++){v+=a*noise(p); p*=2.07; a*=0.5;} return v;}
`;
  const GERSTNER = `
uniform vec2 wDir[6]; uniform vec2 wPar[6]; uniform float uSwell;
float wgroup(vec2 p){ return 0.62+0.38*sin(p.x*0.0135+p.y*0.0092+uTime*0.06)*sin(p.x*0.0071-p.y*0.0154-uTime*0.045); }
float wpatch(vec2 p, float seed){ return 0.55+0.55*noise(p*0.0016+seed*11.3+uTime*0.008); }
vec3 gerstner(vec2 p, out vec3 nrm){
  vec3 disp=vec3(0.0);
  vec3 tan=vec3(1.0,0.0,0.0), bin=vec3(0.0,0.0,1.0);
  float g=wgroup(p);
  float warp=noise(p*0.00058)-0.5;
  for(int i=0;i<6;i++){
    vec2 d=wDir[i]; float steep=wPar[i].x*uSwell*g*wpatch(p,float(i)); float L=wPar[i].y;
    float k=6.28318/L; float c=sqrt(9.81/k); float a=steep/k;
    float f=k*(dot(d,p)-c*uTime)+warp*2.8;
    float sf=sin(f), cf=cos(f);
    disp.x+=d.x*a*cf; disp.z+=d.y*a*cf; disp.y+=a*sf;
    tan+=vec3(-d.x*d.x*steep*sf, d.x*steep*cf, -d.x*d.y*steep*sf);
    bin+=vec3(-d.x*d.y*steep*sf, d.y*steep*cf, -d.y*d.y*steep*sf);
  }
  nrm=normalize(cross(bin,tan));
  return disp;
}`;
  function jHash(x, z) {
    const v = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
    return v - Math.floor(v);
  }
  function jNoise(x, z) {
    const ix = Math.floor(x);
    const iz = Math.floor(z);
    let fx = x - ix;
    let fz = z - iz;
    fx = fx * fx * (3 - 2 * fx);
    fz = fz * fz * (3 - 2 * fz);
    const a = jHash(ix, iz);
    const b = jHash(ix + 1, iz);
    const c = jHash(ix, iz + 1);
    const d = jHash(ix + 1, iz + 1);
    return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz;
  }
  let swellK = swell;
  /** CPU mirror of the GLSL, for buoyancy */
  function waveAt(x, z, t) {
    let dx = 0;
    let dy = 0;
    let dz = 0;
    const g = 0.62 + 0.38 * Math.sin(x * 0.0135 + z * 0.0092 + t * 0.06) * Math.sin(x * 0.0071 - z * 0.0154 - t * 0.045);
    const warp = jNoise(x * 0.00058, z * 0.00058) - 0.5;
    for (let i = 0; i < WAVES.length; i++) {
      const w = WAVES[i];
      const l = Math.hypot(w.dir[0], w.dir[1]);
      const ddx = w.dir[0] / l;
      const ddz = w.dir[1] / l;
      const k = 6.28318 / w.len;
      const c = Math.sqrt(9.81 / k);
      const patch = 0.55 + 0.55 * jNoise(x * 0.0016 + i * 11.3 + t * 0.008, z * 0.0016 + i * 11.3 + t * 0.008);
      const a = (w.steep * swellK * g * patch) / k;
      const f = k * (ddx * x + ddz * z - c * t) + warp * 2.8;
      dx += ddx * a * Math.cos(f);
      dz += ddz * a * Math.cos(f);
      dy += a * Math.sin(f);
    }
    return [dx, dy, dz];
  }

  // ---- ocean -------------------------------------------------------------------------------------
  const oceanUni = {
    uTime: { value: 0 },
    uSun: { value: SUN },
    uSwell: { value: swell },
    tMirror: { value: null },
    uMirrorMatrix: { value: new THREE.Matrix4() },
    uMirror: { value: 0 },
    uExposure: { value: 0.92 },
    wDir: { value: wDir },
    wPar: { value: wPar },
    uCam: { value: new THREE.Vector3() },
    uFogCol: { value: new THREE.Color(0x9fb4c6) },
    uFogDen: { value: 0.0014 },
    uUnder: { value: 0 },
    uSkyR: { value: sky.geometry.parameters.radius },
    uCloudCoverage: { value: 1 },
    uHull: { value: [new THREE.Vector4(1e5, 1e5, 1, 1)] },
    uHullDir: { value: [new THREE.Vector2(1, 0)] },
  };
  const oceanGeo = new THREE.PlaneGeometry(1400, 1400, oceanSeg, oceanSeg);
  oceanGeo.rotateX(-Math.PI / 2);
  const oceanMat = new THREE.ShaderMaterial({
    uniforms: oceanUni,
    side: THREE.DoubleSide,
    extensions: { derivatives: true },
    vertexShader:
      NOISE_GLSL +
      `uniform float uTime;` +
      GERSTNER +
      `
    uniform mat4 uMirrorMatrix;
    varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vMirror;
    varying float vSeaState; varying float vRippleMix;
    void main(){
      vec3 wp=(modelMatrix*vec4(position,1.0)).xyz;
      vec3 n; vec3 d=gerstner(wp.xz,n);
      vH=d.y;
      d*=1.0-smoothstep(560.0,690.0,length(position.xz));
      vW=wp+d; vN=n;
      vec2 windT=vec2(0.962,0.269)*uTime;
      vSeaState=noise((wp.xz-windT*1.2)*0.0018+70.0);
      vRippleMix=noise((wp.xz-windT*0.8)*0.0012-500.0);
      vMirror=uMirrorMatrix*vec4(vW,1.0);
      gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.0);
    }`,
    fragmentShader:
      SKY_GLSL +
      NOISE_GLSL +
      `
    uniform vec3 uCam; uniform vec3 uFogCol; uniform float uFogDen; uniform float uUnder; uniform float uSkyR;
    uniform vec4 uHull[1]; uniform vec2 uHullDir[1];
    uniform sampler2D tMirror; uniform float uMirror; uniform float uExposure;
    varying vec3 vW; varying vec3 vN; varying float vH; varying vec4 vMirror;
    // The mirror texture holds linear, untone-mapped colour (render targets skip the renderer's ACES and sRGB), so it is
    // brought to the screen's look here: the same filmic curve (Narkowicz's fit of ACES) and gamma the hull itself gets.
    vec3 screenLook(vec3 c){
      c*=uExposure;
      c=clamp((c*(2.51*c+0.03))/(c*(2.43*c+0.59)+0.14),0.0,1.0);
      return pow(c,vec3(1.0/2.2));
    }
    varying float vSeaState; varying float vRippleMix;
    float waterlineFoam(vec2 w, float d, vec2 away, float h){
      const mat2 RA=mat2(0.799,0.602,-0.602,0.799), RB=mat2(0.454,-0.891,0.891,0.454);
      vec2 drift=vec2(0.962,0.269)*uTime;
      float side=0.5-0.5*dot(away,vec2(0.962,0.269));
      float reach=mix(0.9,2.4,side)*(0.75+0.5*smoothstep(-0.5,0.9,h));
      float band=smoothstep(-1.0,0.0,d)*exp(-max(d,0.0)/reach);
      float clump=smoothstep(0.36,0.62,fbm3(RA*(w-drift*0.35)*0.30));
      float lace=smoothstep(0.34,0.66,fbm3(RB*(w-drift*0.6)*1.7));
      return band*mix(0.10,1.0,clump)*mix(0.25,1.0,lace)*mix(0.45,1.0,side);
    }
    void main(){
      vec3 V=normalize(uCam-vW); float dist=length(uCam-vW);
      vec3 Nw=normalize(mix(normalize(vN),vec3(0.0,1.0,0.0),0.6*smoothstep(180.0,800.0,dist)*float(gl_FrontFacing)));
      vec3 N=Nw;
      float rd=smoothstep(450.0,30.0,dist);
      float n1=0.0; vec3 dN=vec3(0.0);
      float seaPx=length(fwidth(vW.xz));
      if(rd>0.0){
        const vec2 RW1=vec2(0.962,0.269), RW2=vec2(0.922,-0.388);
        const mat2 R1=mat2(0.839,0.545,-0.545,0.839), R1T=mat2(0.839,-0.545,0.545,0.839);
        const mat2 R2=mat2(0.391,0.921,-0.921,0.391), R2T=mat2(0.391,-0.921,0.921,0.391);
        const float F1=0.60, F2=0.60*0.382;
        vec2 q1=R1*(vW.xz-RW1*(uTime*0.45))*F1, q2=R2*(vW.xz-RW2*(uTime*0.28))*F2;
        float grazeK=1.0-smoothstep(0.03,0.30,V.y);
        float rippleAmpK=mix(1.0,0.55,grazeK);
        n1=fbm3(q1); float n2=fbm3(q2);
        vec2 gq1=vec2((fbm3(q1+vec2(0.3,0.0))-n1)*0.9,(fbm3(q1+vec2(0.0,0.3))-n1)*0.9);
        vec2 gq2=vec2((fbm3(q2+vec2(0.5,0.0))-n2)*0.8,(fbm3(q2+vec2(0.0,0.5))-n2)*0.8);
        float aa1=1.0-smoothstep(0.18,0.75,seaPx*F1), aa2=1.0-smoothstep(0.18,0.75,seaPx*F2);
        float mixK=smoothstep(0.32,0.68,vRippleMix);
        vec2 gW=R1T*gq1*(mix(0.75,1.2,mixK)*aa1)+R2T*gq2*(mix(1.2,0.8,mixK)*aa2);
        dN=vec3(gW.x,0.0,gW.y)*rippleAmpK;
        float seaAmp=mix(0.4,1.3,clamp(vSeaState,0.0,1.0));
        N=normalize(N+dN*rd*seaAmp);
      }
      vec3 deep=vec3(0.010,0.050,0.090);
      vec3 shal=vec3(0.035,0.150,0.205);
      vec3 col;
      if(gl_FrontFacing){
        vec3 Nr=normalize(Nw+dN*rd*mix(0.4,1.3,clamp(vSeaState,0.0,1.0))*0.7*smoothstep(420.0,60.0,dist));
        vec3 Nf=normalize(mix(Nw,Nr,0.75)); N=Nr;
        float fres=0.02+0.98*pow(1.0-clamp(dot(Nf,V),0.0,1.0),5.0);
        vec3 R=reflect(-V,Nf); R.y=abs(R.y)*0.85+0.02;
        vec3 refl=skyColor(R);
        if(uMirror>0.0 && vMirror.w>0.0){
          // The ripples bend the mirror image as they bend the sky: the normal's tilt, scaled down with distance
          vec2 uv=vMirror.xy/vMirror.w+Nf.xz*0.09*rd;
          if(uv.x>0.0 && uv.x<1.0 && uv.y>0.0 && uv.y<1.0){
            vec4 m=texture2D(tMirror,uv);
            refl=mix(refl,screenLook(m.rgb),m.a*uMirror);
          }
        }
        float sss=pow(clamp(vH*0.42+0.42,0.0,1.0),3.2);
        float sssGate=mix(0.35,1.0,smoothstep(0.30,0.75,noise(vW.xz*0.021+vec2(310.0,-140.0))));
        float sssHeight=mix(0.10,1.0,1.0-smoothstep(40.0,200.0,uCam.y));
        sss*=sssGate*sssHeight;
        float sssFar=smoothstep(150.0,420.0,dist);
        float turb=fbm3((vW.xz-vec2(0.962,0.269)*(uTime*0.4))*0.011);
        vec3 body=mix(deep,shal,sss*mix(1.0,0.4,sssFar))+vec3(0.02,0.16,0.14)*sss*mix(0.9,0.16,sssFar);
        body*=0.80+0.45*turb;
        col=mix(body,refl,clamp(fres,0.0,1.0));
        float spec=pow(max(dot(reflect(-V,N),uSun),0.0),520.0);
        col+=vec3(1.0,0.94,0.82)*spec*2.6;
        float glitter=pow(max(dot(reflect(-V,N),uSun),0.0),60.0)*n1*0.18;
        col+=vec3(0.9,0.9,0.85)*glitter*rd;
        float crest=0.0;
        if(rd>0.0){
          vec2 foamT=vec2(0.962,0.269)*uTime;
          float foamMask=smoothstep(0.30,0.70,noise((vW.xz-foamT*1.5)*0.004+40.0));
          float ss=clamp(vSeaState,0.0,1.0);
          float foamLo=mix(2.55,1.70,ss), foamHi=foamLo+0.70;
          float seaGate=smoothstep(0.14,0.42,ss);
          crest=smoothstep(foamLo,foamHi,vH)*smoothstep(0.64,0.88,n1)*smoothstep(0.45,0.72,fbm3((vW.xz-foamT*0.5)*1.7))*foamMask*seaGate*rd;
        }
        col=mix(col,vec3(0.72,0.76,0.78),crest*0.5);
        const vec2 WIND_DIR=vec2(0.962,0.269), WIND_AX=vec2(0.269,-0.962);
        float wAlong=dot(vW.xz,WIND_DIR)*0.0016, wAcross=dot(vW.xz,WIND_AX)*0.0016*8.0;
        float streak=noise(vec2(wAlong-uTime*0.0016,wAcross))-0.5;
        col*=1.0+streak*0.07;
        for(int i=0;i<1;i++){
          vec2 dl=vW.xz-uHull[i].xy;
          float reach=uHull[i].z*1.5; if(dot(dl,dl)>reach*reach) continue;
          vec2 cs=uHullDir[i];
          vec2 l=vec2(dl.x*cs.x-dl.y*cs.y, dl.x*cs.y+dl.y*cs.x);
          float e=(l.x*l.x)/(uHull[i].z*uHull[i].z)+(l.y*l.y)/(uHull[i].w*uHull[i].w);
          float sh=1.0-smoothstep(0.80,2.0,e);
          col*=1.0-0.42*sh;
          float ke=sqrt(max(e,1e-4));
          float hd=(ke-1.0)*ke/max(length(vec2(l.x/(uHull[i].z*uHull[i].z), l.y/(uHull[i].w*uHull[i].w))),1e-4);
          col*=1.0-0.34*(1.0-smoothstep(0.0,3.0,hd));
          if(hd<9.0) col=mix(col,vec3(0.84,0.88,0.90),waterlineFoam(vW.xz,hd,normalize(dl+vec2(1e-4)),vH)*0.62);
        }
      }else{
        float nf=smoothstep(130.0,30.0,dist);
        vec3 Nu=normalize(vN+dN*rd*(0.02+0.67*nf));
        float up=clamp(dot(-Nu,V),0.0,1.0);
        float ct=0.661;
        float win=smoothstep(ct-0.13,ct+0.18,up);
        float sw=sqrt(max(0.0,1.0-up*up));
        float sa=min(1.0,sw*1.334);
        vec3 hdir=normalize(vec3(-V.x,0.0,-V.z)+vec3(1e-5));
        vec3 air=normalize(hdir*sa+vec3(0.0,sqrt(max(0.0,1.0-sa*sa)),0.0));
        vec3 window=skyColor(air);
        vec3 mirror=uFogCol*(0.55+0.55*pow(up,2.0));
        col=mix(mirror,window*0.90,win);
        float sd=max(dot(air,uSun),0.0);
        col+=vec3(0.42,0.66,0.78)*pow(sd,2.5)*0.75*win;
        col*=1.0+clamp((dN.x+dN.z)*0.9,-0.20,0.28)*nf;
        float glint=pow(max(dot(reflect(-V,Nu),uSun),0.0),36.0);
        col+=vec3(0.90,0.96,1.00)*glint*0.45*win*nf;
        col+=vec3(0.30,0.55,0.62)*pow(up,9.0)*0.22;
        col=mix(uFogCol,col,smoothstep(0.0,0.28,up));
        col=mix(col,uFogCol,smoothstep(700.0,1800.0,dist));
      }
      float fog=1.0-exp(-uFogDen*uFogDen*dist*dist);
      vec3 fogC=mix(skyColor(normalize(vec3(-V.x,0.035,-V.z)))*0.97,uFogCol,uUnder);
      col=mix(col,fogC,clamp(fog,0.0,1.0));
      if(uUnder<0.5){
        float edgeMelt=smoothstep(1600.0,2950.0,length(vW.xz-uCam.xz));
        if(edgeMelt>0.0){
          vec3 vd=normalize(vW-uCam); float b=dot(uCam,vd), c=dot(uCam,uCam)-uSkyR*uSkyR;
          vec3 q=uCam+vd*(-b+sqrt(max(b*b-c,0.0)));
          col=mix(col,skyColor(normalize(q)),edgeMelt);
        }
      }
      gl_FragColor=vec4(col,1.0);
    }`,
  });
  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  scene.add(ocean);
  const ringGeo = new THREE.RingGeometry(690, 3000, 96, 6);
  ringGeo.rotateX(-Math.PI / 2);
  const oceanRing = new THREE.Mesh(ringGeo, oceanMat);
  scene.add(oceanRing);
  const OCEAN_CELL = 1400 / oceanSeg;
  function oceanFollowCam(r, s, cam) {
    const x = Math.round(cam.position.x / OCEAN_CELL) * OCEAN_CELL;
    const z = Math.round(cam.position.z / OCEAN_CELL) * OCEAN_CELL;
    if (this.position.x !== x || this.position.z !== z) {
      this.position.set(x, 0, z);
      this.updateMatrixWorld();
    }
  }
  ocean.frustumCulled = oceanRing.frustumCulled = false;
  ocean.onBeforeRender = oceanFollowCam;
  oceanRing.onBeforeRender = oceanFollowCam;

  // ---- the water column: colours, backdrop dome, lights (reach-world/src/lighting.js) -----------
  const C_UP_S = new THREE.Color(0x8fdcf2);
  const C_UP_D = new THREE.Color(0x3d9fc8);
  const C_MID_S = new THREE.Color(0x2f9cc2);
  const C_MID_D = new THREE.Color(0x155f88);
  const C_DN_S = new THREE.Color(0x12455f);
  const C_DN_D = new THREE.Color(0x082a40);
  const C_GND_S = new THREE.Color(0xb9c8c2);
  const C_GND_D = new THREE.Color(0x5f7a7c);
  const colUp = new THREE.Color();
  const colMid = new THREE.Color();
  const colDown = new THREE.Color();
  const colGnd = new THREE.Color();
  const _hl = Math.hypot(SUN.x, SUN.z) || 1e-6;
  const _sinW = Math.min(1, _hl / 1.334);
  const _cosW = Math.sqrt(Math.max(0, 1 - _sinW * _sinW));
  const SUNR = new THREE.Vector3((SUN.x / _hl) * _sinW, _cosW, (SUN.z / _hl) * _sinW).normalize();
  const domeUni = {
    uUp: { value: new THREE.Color(0x8fdcf2) },
    uMid: { value: new THREE.Color(0x36abd2) },
    uDown: { value: new THREE.Color(0x12455f) },
    uSunR: { value: SUNR.clone() },
    uGlare: { value: new THREE.Color(0x9fe4f2) },
    uGlareAmt: { value: 0.5 },
  };
  const waterDome = new THREE.Mesh(
    new THREE.SphereGeometry(3000, 32, 20),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: domeUni,
      vertexShader: `varying vec3 vD; void main(){ vD=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `uniform vec3 uUp,uMid,uDown,uSunR,uGlare; uniform float uGlareAmt; varying vec3 vD;
    void main(){
      vec3 d=normalize(vD);
      float up  =max( d.y-0.045,0.0)/0.955;
      float down=max(-d.y-0.045,0.0)/0.955;
      vec3 col = mix(uMid, uUp, up*up);
      col = mix(col, uDown, down*down);
      float g=max(dot(d,uSunR),0.0);
      col += uGlare*(pow(g,6.0)*0.55+pow(g,40.0)*0.9)*uGlareAmt*smoothstep(0.05,0.42,d.y);
      gl_FragColor=vec4(col,1.0);
    }`,
    }),
  );
  waterDome.renderOrder = -1;
  waterDome.frustumCulled = false;
  waterDome.visible = false;
  scene.add(waterDome);

  const sun = new THREE.DirectionalLight(0xfff0d8, 1.7);
  sun.position.copy(SUN).multiplyScalar(300);
  const amb = new THREE.HemisphereLight(0xa9c8e6, 0x16324c, 0.6);
  const FILLR = new THREE.Vector3(SUN.x, 0.14, -SUN.z).normalize();
  const skyFill = new THREE.DirectionalLight(0xbcdcef, 0);
  skyFill.position.copy(FILLR).multiplyScalar(300);
  scene.add(sun, amb, skyFill);
  const AIR = new THREE.Color(0x9fb4c6);
  const AIR_FOG_DEN = 0.0014;
  const fog = new THREE.FogExp2(0x9fb4c6, AIR_FOG_DEN);
  const sunAir = new THREE.Color(0xfff0d8);
  const sunSea = new THREE.Color(0x9fdcee);
  const sunC = new THREE.Color();

  function setSwell(k) {
    swellK = k;
    oceanUni.uSwell.value = k;
  }

  // ---- the vessel's mirror image (three.js Reflector's camera and oblique clip plane) ---------------
  const MIRROR_PX = 1024;
  const mirrorRT = new THREE.WebGLRenderTarget(MIRROR_PX, MIRROR_PX, { samples: 4 });
  mirrorRT.texture.colorSpace = THREE.NoColorSpace;
  oceanUni.tMirror.value = mirrorRT.texture;
  const mirrorCam = new THREE.PerspectiveCamera();
  const _plane = new THREE.Plane();
  const _n = new THREE.Vector3(0, 1, 0);
  const _view = new THREE.Vector3();
  const _target = new THREE.Vector3();
  const _look = new THREE.Vector3();
  const _up = new THREE.Vector3();
  const _q = new THREE.Vector4();
  const _clip = new THREE.Vector4();
  const _tm = new THREE.Matrix4();
  const _bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
  let mirrorOn = true;
  function setMirror(on) {
    mirrorOn = on;
    if (!on) oceanUni.uMirror.value = 0;
  }
  function renderMirror(renderer, scene, cam) {
    if (!visible || !mirrorOn || cam.position.y <= 0.05) {
      oceanUni.uMirror.value = 0;
      return;
    }
    // The camera reflected in the plane y = 0
    _view.copy(cam.position);
    _view.y = -_view.y;
    _look.set(0, 0, -1).applyQuaternion(cam.quaternion).add(cam.position);
    _target.copy(_look);
    _target.y = -_target.y;
    _up.set(0, 1, 0).applyQuaternion(cam.quaternion);
    _up.y = -_up.y;
    mirrorCam.position.copy(_view);
    mirrorCam.up.copy(_up);
    mirrorCam.lookAt(_target);
    mirrorCam.near = cam.near;
    mirrorCam.far = cam.far;
    mirrorCam.updateMatrixWorld();
    mirrorCam.projectionMatrix.copy(cam.projectionMatrix);
    _tm.multiplyMatrices(_bias, mirrorCam.projectionMatrix).multiply(mirrorCam.matrixWorldInverse);
    oceanUni.uMirrorMatrix.value.copy(_tm);
    // Oblique near plane: clip everything under the surface so it cannot leak into the reflection
    _plane.setFromNormalAndCoplanarPoint(_n, new THREE.Vector3(0, 0, 0)).applyMatrix4(mirrorCam.matrixWorldInverse);
    _clip.set(_plane.normal.x, _plane.normal.y, _plane.normal.z, _plane.constant);
    const pm = mirrorCam.projectionMatrix;
    _q.x = (Math.sign(_clip.x) + pm.elements[8]) / pm.elements[0];
    _q.y = (Math.sign(_clip.y) + pm.elements[9]) / pm.elements[5];
    _q.z = -1.0;
    _q.w = (1.0 + pm.elements[10]) / pm.elements[14];
    _clip.multiplyScalar(2.0 / _clip.dot(_q));
    pm.elements[2] = _clip.x;
    pm.elements[6] = _clip.y;
    pm.elements[10] = _clip.z + 1.0 - 0.003;
    pm.elements[14] = _clip.w;
    // Draw: the sea, sky and dome out, background clear, so only what stands on the water lands in the texture
    const was = { ocean: ocean.visible, ring: oceanRing.visible, sky: sky.visible, dome: waterDome.visible, bg: scene.background };
    ocean.visible = oceanRing.visible = sky.visible = waterDome.visible = false;
    scene.background = null;
    const target = renderer.getRenderTarget();
    const clearAlpha = renderer.getClearAlpha();
    renderer.setRenderTarget(mirrorRT);
    renderer.setClearAlpha(0);
    renderer.clear();
    renderer.render(scene, mirrorCam);
    renderer.setRenderTarget(target);
    renderer.setClearAlpha(clearAlpha);
    ocean.visible = was.ocean;
    oceanRing.visible = was.ring;
    sky.visible = was.sky;
    waterDome.visible = was.dome;
    scene.background = was.bg;
    oceanUni.uMirror.value = 1;
    oceanUni.uExposure.value = renderer.toneMappingExposure;
  }

  let visible = false;
  function setVisible(on) {
    visible = on;
    ocean.visible = oceanRing.visible = on;
    sky.visible = on;
    sun.visible = amb.visible = skyFill.visible = on;
    if (!on) waterDome.visible = false;
  }
  setVisible(false);

  /** Once per frame while visible: the world's depth state. `pbrMats` get their reflections dimmed under water. */
  function update(t, cam, pbrMats = []) {
    if (!visible) return { under: 0, f: 0 };
    oceanUni.uTime.value = t;
    oceanUni.uCam.value.copy(cam.position);
    sky.material.uniforms.uTime.value = t;
    const y = cam.position.y;
    const under = y < 0 ? 1 : 0;
    const f = Math.min(1, Math.max(0, -y / 140));
    scene.fog = fog;
    if (under) {
      const k = Math.pow(f, 0.65);
      colUp.copy(C_UP_S).lerp(C_UP_D, k);
      colMid.copy(C_MID_S).lerp(C_MID_D, k);
      colDown.copy(C_DN_S).lerp(C_DN_D, k);
      colGnd.copy(C_GND_S).lerp(C_GND_D, k);
      fog.color.copy(colMid);
      fog.density = 0.003 + f * 0.0014;
      scene.background = colMid;
      sky.visible = false;
      waterDome.visible = true;
      waterDome.position.copy(cam.position);
      domeUni.uUp.value.copy(colUp);
      domeUni.uMid.value.copy(colMid);
      domeUni.uDown.value.copy(colDown);
      domeUni.uGlareAmt.value = 0.55 * (1.0 - f * 0.55);
      amb.intensity = Math.max(1.15, 2.25 - f * 1.0);
      amb.color.copy(colUp);
      amb.groundColor.copy(colGnd);
      sun.position.copy(SUNR).multiplyScalar(300);
      sun.intensity = Math.max(0.55, 1.25 - f * 0.55);
      sunC.copy(sunAir).lerp(sunSea, Math.min(1, f * 2.4));
      sun.color.copy(sunC);
      const ei = Math.max(0.15, 0.34 - f * 0.19);
      for (const m of pbrMats) m.envMapIntensity = ei * (m.userData.envK ?? 1);
      skyFill.intensity = 0;
    } else {
      const altT = Math.min(1, Math.max(0, y / 260));
      const fogAlt = 1 - altT * altT * 0.6;
      fog.color.copy(AIR);
      fog.density = AIR_FOG_DEN * fogAlt;
      scene.background = AIR;
      sky.visible = true;
      waterDome.visible = false;
      amb.intensity = 0.95;
      amb.color.set(0xa9c8e6);
      amb.groundColor.set(0x638498);
      sun.position.copy(SUN).multiplyScalar(300);
      sun.intensity = 1.7;
      sun.color.copy(sunAir);
      skyFill.intensity = 2.1;
      for (const m of pbrMats) m.envMapIntensity = 1.0 * (m.userData.envK ?? 1);
    }
    oceanUni.uFogCol.value.copy(fog.color);
    oceanUni.uFogDen.value = fog.density;
    oceanUni.uUnder.value = under;
    return { under, f };
  }

  // ---- hulls: the waterline ellipse for the shadow and foam, and the ride on the swell ----------
  /** Ellipse of a floating hull at the waterline, in the holder's own frame */
  function waterlineEllipse(holder, root) {
    holder.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(holder.matrixWorld).invert();
    const v = new THREE.Vector3();
    const mm = new THREE.Matrix4();
    let minx = 1e9;
    let maxx = -1e9;
    let minz = 1e9;
    let maxz = -1e9;
    let n = 0;
    (root || holder).traverse((m) => {
      if (!m.isMesh) return;
      const p = m.geometry.attributes.position;
      mm.multiplyMatrices(inv, m.matrixWorld);
      for (let i = 0; i < p.count; i += 2) {
        v.fromBufferAttribute(p, i).applyMatrix4(mm);
        if (v.y > -2.5 && v.y < 0.8) {
          n++;
          if (v.x < minx) minx = v.x;
          if (v.x > maxx) maxx = v.x;
          if (v.z < minz) minz = v.z;
          if (v.z > maxz) maxz = v.z;
        }
      }
    });
    return n > 20 ? { cx: (minx + maxx) / 2, cz: (minz + maxz) / 2, hl: (maxx - minx) / 2, hw: (maxz - minz) / 2 } : null;
  }
  const _a = new THREE.Vector3();
  const _Y = new THREE.Vector3(0, 1, 0);
  function setHull(holder, wl) {
    if (!wl) return;
    _a.set(wl.cx, 0, wl.cz).applyAxisAngle(_Y, holder.rotation.y).add(holder.position);
    oceanUni.uHull.value[0].set(_a.x, _a.z, wl.hl, wl.hw);
    oceanUni.uHullDir.value[0].set(Math.cos(holder.rotation.y), Math.sin(holder.rotation.y));
  }
  /** The ride at time t as [y, rot.x, rot.z]: heave from the wave under the hull, pitch from bow and stern, roll from
   *  the two sides, measured along the hull's own axes. Rotation order YXZ on the holder. */
  function bobPose(holder, t, half, beam, out) {
    const px = holder.position.x;
    const pz = holder.position.z;
    const w = waveAt(px, pz, t);
    const c = Math.cos(holder.rotation.y);
    const s = Math.sin(holder.rotation.y);
    const hx1 = waveAt(px + c * half, pz - s * half, t)[1];
    const hx0 = waveAt(px - c * half, pz + s * half, t)[1];
    const hz1 = waveAt(px + s * beam, pz + c * beam, t)[1];
    const hz0 = waveAt(px - s * beam, pz - c * beam, t)[1];
    out[0] = w[1];
    out[2] = Math.atan2(hx1 - hx0, 2 * half) * 0.85;
    out[1] = -Math.atan2(hz1 - hz0, 2 * beam) * 0.85;
    return out;
  }

  return { SUN, SUNR, sky, ocean, oceanRing, oceanUni, environment, sun, amb, skyFill, waterDome, fog, setVisible, setSwell, setMirror, renderMirror, update, waveAt, waterlineEllipse, setHull, bobPose };
}

/* ---- the ZeeROV's lamp rig, as the world dresses it (reach-world/src/lighting.js makeZeeRov) ------------------
   Two cool-white LED housings on the front cross-member with their lens discs, a SpotLight that lights the kit, two
   additive haze cones for the silt in the beams, a glow blob at each lens and the amber nav dome on the top deck.
   `parent` is the ROV's holder with the model centred and turned rotY π, so the rig's own forward is -Z, as the
   world's. Returns {spot, setLamps(k), update(t, under, f)}: setLamps scales every lamp 0..1 (the launch brings
   them on as the stack clears the mouth); update fades the haze with depth as src/lighting.js does. */
export function createZeeRovRig({ THREE, parent }) {
  const _Z = new THREE.Vector3(0, 0, 1);
  const _Y = new THREE.Vector3(0, 1, 0);
  const _t1 = new THREE.Vector3();
  const LAMP_HEX = 0xeaf6ff;
  const LAMP_HEX2 = 0xdcecff;
  const dark = new THREE.MeshStandardMaterial({ color: 0x2c343d, roughness: 0.85, metalness: 0.1 });
  const beams = [];
  function beamCone(from, to, len, rad, hex, str) {
    const cg = new THREE.ConeGeometry(rad, len, 20, 1, true);
    cg.translate(0, -len / 2, 0);
    cg.rotateX(-Math.PI / 2);
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCol: { value: new THREE.Color(hex) }, uStr: { value: str }, uFade: { value: 0 } },
      vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vP;
      void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal);
        float d=max(1.0-uv.y,0.0001);
        float taper=pow(d,1.7)/d;
        vec3 p=vec3(position.x*taper, position.y*taper, position.z);
        vec4 wp=modelMatrix*vec4(p,1.0); vP=wp.xyz;
        gl_Position=projectionMatrix*viewMatrix*wp; }`,
      fragmentShader: `uniform vec3 uCol; uniform float uTime,uStr,uFade;
      varying vec2 vUv; varying vec3 vN; varying vec3 vP;
      void main(){
        vec3 V=normalize(cameraPosition-vP);
        float face=pow(clamp(abs(dot(normalize(vN),V)),0.0,1.0),2.0);
        float d=1.0-vUv.y;
        float along=exp(-d*2.6)*smoothstep(0.0,0.06,d);
        float silt=0.78+0.22*sin(vP.x*1.6+vP.y*2.1+uTime*0.8)*sin(vP.z*1.2-uTime*0.55);
        float far=smoothstep(95.0,30.0,length(cameraPosition-vP));
        float endFade=smoothstep(1.0,0.72,d);
        gl_FragColor=vec4(uCol, face*along*endFade*silt*uStr*uFade*far);
      }`,
    });
    const c = new THREE.Mesh(cg, m);
    c.frustumCulled = false;
    c.position.copy(from);
    c.quaternion.setFromUnitVectors(_Z, _t1.copy(to).sub(from).normalize());
    parent.add(c);
    beams.push(m);
    return c;
  }
  function glowBlob(pos, size, hex, str) {
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uCol: { value: new THREE.Color(hex) }, uSize: { value: size }, uStr: { value: str }, uFade: { value: 0 } },
      vertexShader: `uniform float uSize; varying vec2 vUv;
      void main(){ vUv=uv; vec4 mv=modelViewMatrix*vec4(0.0,0.0,0.0,1.0);
        mv.xy+=position.xy*uSize; gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uCol; uniform float uStr,uFade; varying vec2 vUv;
      void main(){ float r=length(vUv-0.5)*2.0;
        float a=pow(1.0-clamp(r,0.0,1.0),2.6);
        gl_FragColor=vec4(uCol,a*uStr*uFade); }`,
    });
    const o = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m);
    o.position.copy(pos);
    o.frustumCulled = false;
    parent.add(o);
    beams.push(m);
    return o;
  }
  const _lensGeo = new THREE.CircleGeometry(1, 16);
  _lensGeo.rotateX(-Math.PI / 2);
  const lenses = [];
  function lampHousing(mountPos, dir, hex, stalk) {
    const len = 0.14;
    const rad = 0.062;
    const q = new THREE.Quaternion().setFromUnitVectors(_Y, dir);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, len, 12), dark);
    h.quaternion.copy(q);
    h.position.copy(mountPos).addScaledVector(dir, -len * 0.3);
    parent.add(h);
    if (stalk > 0) {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, stalk + 0.03, 8), dark);
      st.quaternion.copy(q);
      st.position.copy(mountPos).addScaledVector(dir, -(len * 0.8 + stalk / 2));
      parent.add(st);
    }
    const lensMat = new THREE.MeshBasicMaterial({ color: hex, toneMapped: false });
    const lens = new THREE.Mesh(_lensGeo, lensMat);
    lens.scale.setScalar(rad * 0.82);
    lens.quaternion.copy(q);
    lens.position.copy(mountPos).addScaledVector(dir, 0.002);
    parent.add(lens);
    lenses.push({ mat: lensMat, hex: new THREE.Color(hex) });
  }
  function navDome(pos, hex) {
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.4, roughness: 0.4, metalness: 0.1 }),
    );
    dome.position.copy(pos);
    parent.add(dome);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.105, 0.05, 12), dark);
    base.position.copy(pos).add(new THREE.Vector3(0, -0.025, 0));
    parent.add(base);
  }

  const dirF = new THREE.Vector3(0, -0.3, -0.954).normalize();
  const mountL = new THREE.Vector3(-0.5, 0.15, -0.95);
  const mountR = new THREE.Vector3(0.5, 0.15, -0.95);
  lampHousing(mountL, dirF, LAMP_HEX, 0.1);
  lampHousing(mountR, dirF, LAMP_HEX2);
  const aPos = new THREE.Vector3(0, 0.15, -1.6);
  const aTgt = aPos.clone().addScaledVector(dirF, 16);
  const spot = new THREE.SpotLight(0xdceeff, 0, 120, 0.93, 1.0, 1.7);
  spot.position.copy(aPos);
  parent.add(spot);
  parent.add(spot.target);
  spot.target.position.copy(aTgt);
  const lPos = mountL.clone().addScaledVector(dirF, 0.12);
  const rPos = mountR.clone().addScaledVector(dirF, 0.12);
  beamCone(lPos, lPos.clone().addScaledVector(dirF, 16), 24, 8.5, 0xd8ecff, 0.1);
  beamCone(rPos, rPos.clone().addScaledVector(dirF, 16), 24, 8.5, 0xd8ecff, 0.08);
  glowBlob(lPos, 1.2, LAMP_HEX, 0.22);
  glowBlob(rPos, 1.1, LAMP_HEX2, 0.18);
  navDome(new THREE.Vector3(0, 0.75, 1.12), 0xff7a42);

  const base = beams.map((m) => m.uniforms.uStr.value);
  const SPOT0 = 70;
  let lampK = 0;
  function setLamps(k) {
    lampK = k;
    beams.forEach((m, i) => (m.uniforms.uStr.value = base[i] * k));
    spot.intensity = SPOT0 * k;
    for (const l of lenses) l.mat.color.copy(l.hex).multiplyScalar(0.25 + 0.75 * k);
  }
  setLamps(0);
  function update(t, under, f) {
    const fade = under ? Math.min(1, 0.25 + f * 1.1) : 0;
    for (const m of beams) {
      m.uniforms.uFade.value = fade;
      if (m.uniforms.uTime) m.uniforms.uTime.value = t;
    }
  }
  return { spot, beams, setLamps, update, get lampK() { return lampK; } };
}
