// Reach Remote model stage (9 Oct 2026, render test for the Reach Remote page). Loads the 3D World's Reach Remote
// GLB (public/models/, from reach-world/glb) into a stage with two scenes to compare: the studio (solid navy, as
// the brochure) and the vessel at sea in the 3D World itself: the world's own sky, Gerstner swell, hull shadow and
// waterline foam, water column and lights (reach-world/reach-ocean-realism.html and src/lighting.js, ported to
// reach-remote-ocean.js). At sea the hull rides the swell at its 2.6 m draft, carries the moonpool housing the
// world gives it (reach-world/src/launch.js) and its painted hull name (reach-world/src/hullname.js, copied to
// reach-remote-hullname.js), and a scrubber plays the ZeeROV launch: the TMS and ROV stack lowered out of the
// housing, down through the water, then the ROV released on its yellow tether, with the camera dipping below the
// surface to follow (the world's "Watch the launch", reach-world/src/deploy.js, as a scroll stand-in). The page's
// own markup carries the controls; this script only reads `data-stage-*` attributes. Three.js r160 to match the
// world; the Draco decoder is served from public/draco/ (no CDN).
//
// The tour (9 Oct 2026, Q167): when the stage sits inside a `[data-tour]` section, scrolling pins it and walks the
// camera through the chapters listed in the runway (`[data-tour-chapter]`, each with its camera key, `data-cam`
// = "dist, elev, az, tx, ty, tz, shift" in the launch's spherical convention, az 0 = +Z, and a run count). The
// scroll position sets a goal for the camera's rails (distance, elevation, azimuth, target on the hull), a damped
// chase follows it (wheel steps and flings never jerk the picture), and the chapter text switches at a threshold
// read from the same scroll position (not an IntersectionObserver, so a fling can't skip one: the Figures block's
// lesson). The last chapter hands over to the launch scrubber, driven by the same scroll. Points (`[data-point]`,
// the brochure's labels) are projected onto the stage every frame and hidden when the hull is in the way. Two
// camera feels to compare live: the camera follows the scroll, or snaps to each chapter's key as it becomes
// current (`data-stage-feel`).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
// @ts-expect-error untyped module copied from the 3D World
import { createHullName, createSternName, createBowImo, createDraftMarks } from './reach-remote-hullname.js';
import { resizeHullLogo } from './reach-remote-hulllogo.js';
import { raiseBootTop } from './reach-remote-boottop.js';
import { createUnderwaterGear } from './reach-remote-propulsion.js';
import { createTmsCage } from './reach-remote-tmscage.js';
// @ts-expect-error untyped module ported from the 3D World
import { createOcean, createZeeRovRig } from './reach-remote-ocean.js';

type ViewName = 'cover' | 'stern' | 'top' | 'starboard' | 'quarter';
type SceneName = 'studio' | 'sea';
type SpinMode = 'sway' | 'orbit' | 'off';

/** Camera positions as spherical angles around the vessel. Azimuth 0 = ahead of the bow, +90 = starboard beam,
 *  180 = astern, -90 = port beam. Polar 0 = straight above, 90 = at the waterline. `fit` scales the fitted distance.
 *  `shift` moves the vessel right by that fraction of the stage width on landscape stages, leaving the left column
 *  to the hero text (subject right, as the photo heroes). */
const VIEWS: Record<ViewName, { az: number; polar: number; fit: number; shift: number }> = {
  cover: { az: -38, polar: 85, fit: 0.78, shift: 0.16 }, // brochure cover: port bow, at the waterline
  stern: { az: 180, polar: 86, fit: 0.9, shift: 0 }, // brochure p7: dead astern, thrusters and gondola
  top: { az: 90, polar: 6, fit: 0.95, shift: 0 }, // brochure p2: plan view
  starboard: { az: 90, polar: 78, fit: 0.95, shift: 0 },
  quarter: { az: -140, polar: 76, fit: 0.85, shift: 0.1 }, // port quarter: moonpool deck and mast
};

const STUDIO = { exposure: 1.05, hemi: [0xe4ecff, 0x1b1d3b, 0.7] as [number, number, number] };
const BOB = { half: 9, beam: 4 }; // the world's BOBBERS entry for the Reach Remotes: metres from the middle to the wave samples

const DRAFT = 2.6; // the world's draft: the hull's lowest point this far below the waterline
const MOON = { x: -0.5, len: 6.2, wid: 2.9 }; // the moonpool mouth between the gondola walls (reach-world v77, src/propulsion.js opening; bow +X here)
const ROV = { halfH: 1.02, top: 0.65, tmsHalf: 0.67, tmsScale: 0.7, dockGap: 0.1, hangBelow: 10, dive: 40, tetherOut: 3.4 };
const CHAPTERS = [
  { name: 'Ready', t0: 0, t1: 0.1 },
  { name: 'Launch', t0: 0.1, t1: 0.3 },
  { name: 'Descent', t0: 0.3, t1: 0.74 },
  { name: 'Release', t0: 0.74, t1: 1 },
];

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
};
const smoother = (x: number) => {
  x = clamp01(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

export function mountStage(stage: HTMLElement) {
  const base = (stage.dataset.base ?? '/').replace(/\/?$/, '/');
  const canvas = stage.querySelector<HTMLCanvasElement>('canvas')!;
  const status = stage.querySelector<HTMLElement>('[data-stage-status]');
  const hero = stage.querySelector<HTMLElement>('[data-stage-hero]');
  const chapterEl = document.querySelector<HTMLElement>('[data-stage-chapter]');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 16 / 9, 0.3, 4000);
  const holder = new THREE.Group(); // the vessel and everything riding with it (sway)
  scene.add(holder);

  // Reflections: a neutral room, toned down (the world's v28 note: sun on the hull looked plastic)
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  // ── Lights ──────────────────────────────────────────────────────────────────────────────────
  const hemi = new THREE.HemisphereLight(0xe4ecff, 0x1b1d3b, 0.7);
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  const fill = new THREE.DirectionalLight(0xcfd8ff, 0.5);
  const rim = new THREE.DirectionalLight(0xdfe8ff, 0.9);
  fill.position.set(-50, 20, 10);
  rim.position.set(-20, 24, -50);
  scene.add(hemi, key, fill, rim);

  // ── Sea: the 3D World's sky, swell, water column and lights (reach-remote-ocean.js) ──────────
  const phone = Math.min(innerWidth, innerHeight) < 900;
  const SEA = createOcean({ THREE, scene, renderer, camera, oceanSeg: phone ? 128 : 200, cloudOct: phone ? 3 : 4, swell: 0.6 });
  // Marine snow: motes drifting down through the water around the camera (wrapped in a box that follows it), so the
  // underwater picture has depth and movement; only drawn while the camera is under the surface
  const SNOW_R = 42;
  const SNOW_N = phone ? 1000 : 2000;
  const snowGeo = new THREE.BufferGeometry();
  {
    const pos = new Float32Array(SNOW_N * 3);
    const size = new Float32Array(SNOW_N);
    const phase = new Float32Array(SNOW_N);
    for (let i = 0; i < SNOW_N; i++) {
      pos[i * 3] = Math.random() * SNOW_R * 2;
      pos[i * 3 + 1] = Math.random() * SNOW_R * 2;
      pos[i * 3 + 2] = Math.random() * SNOW_R * 2;
      size[i] = 0.5 + Math.random() * Math.random() * 1.6;
      phase[i] = Math.random() * Math.PI * 2;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    snowGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    snowGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  }
  const snowUni = { uCam: { value: new THREE.Vector3() }, uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() }, uCol: { value: new THREE.Color(0xd8e6f4) } };
  const snow = new THREE.Points(
    snowGeo,
    new THREE.ShaderMaterial({
      uniforms: snowUni,
      transparent: true,
      depthWrite: false,
      vertexShader: `uniform vec3 uCam; uniform float uTime, uPx; attribute float aSize, aPhase; varying float vA;
        void main(){
          vec3 p = position;
          p.y -= uTime * (0.25 + aSize * 0.18);
          p.x += sin(uTime * 0.23 + aPhase) * 0.8;
          p.z += cos(uTime * 0.19 + aPhase * 1.7) * 0.6;
          vec3 box = vec3(${(SNOW_R * 2).toFixed(1)});
          vec3 q = mod(p - uCam + box * 0.5, box) - box * 0.5 + uCam;
          vec4 mv = modelViewMatrix * vec4(q, 1.0);
          float d = max(-mv.z, 0.001);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uPx * 36.0 / d;
          vA = smoothstep(${SNOW_R.toFixed(1)}, ${(SNOW_R * 0.35).toFixed(1)}, d) * smoothstep(1.0, 5.0, d) * smoothstep(-0.2, -2.0, q.y);
        }`,
      fragmentShader: `uniform vec3 uCol; varying float vA;
        void main(){
          float r = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.12, r) * vA * 0.7;
          if (a < 0.003) discard;
          gl_FragColor = vec4(uCol, a);
        }`,
    }),
  );
  snow.frustumCulled = false;
  snow.visible = false;
  scene.add(snow);
  const studioEnv = scene.environment;
  const pbrMats: THREE.MeshStandardMaterial[] = [];
  let wl: { cx: number; cz: number; hl: number; hw: number } | null = null;

  let sceneName: SceneName = 'studio';
  function applyScene(name: SceneName) {
    sceneName = name;
    const atSea = name === 'sea';
    SEA.setVisible(atSea);
    moonGroup.visible = atSea;
    stage.classList.toggle('is-at-sea', atSea);
    hemi.visible = key.visible = fill.visible = rim.visible = !atSea;
    scene.environment = atSea ? SEA.environment : studioEnv;
    renderer.toneMappingExposure = atSea ? 0.92 : STUDIO.exposure;
    if (!atSea) {
      scene.background = null;
      scene.fog = null;
      for (const m of pbrMats) m.envMapIntensity = 0.7 * (m.userData.envK ?? 1);
      holder.position.set(0, 0, 0);
      holder.rotation.set(0, 0, 0);
    }
  }

  // ── Controls ────────────────────────────────────────────────────────────────────────────────
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minPolarAngle = THREE.MathUtils.degToRad(5);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(92);
  controls.autoRotateSpeed = 0.35;
  let spin: SpinMode = reducedMotion ? 'off' : 'sway';
  // The tour (below): live when the stage sits in a `[data-tour]` section; `touring` while a chapter past the hero is current
  const tourRoot = stage.closest<HTMLElement>('[data-tour]');
  // `?static=1` previews the fallback (the chapters as a plain list) without switching the OS to reduced motion
  const tourLive = !!tourRoot && !reducedMotion && !new URLSearchParams(location.search).has('static');
  let touring = false;

  const draco = new DRACOLoader();
  draco.setDecoderPath(`${base}draco/`);
  // Start the decoder now, so its download and compile run while the vessel downloads (the block preloads both)
  draco.preload();
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  // ── The vessel ──────────────────────────────────────────────────────────────────────────────
  let hullMesh: THREE.Mesh | null = null;
  let radius = 15;
  let fitScale = 1;
  const TARGET_Y = 1.6; // orbit target: a little above the waterline, through the hull

  /** The world's finish rules (reach-ocean-realism.html, the ASSETS loader): albedo-only materials get the satin
   *  0.78 / 0.06, materials with their own metalness map keep it; envMapIntensity is driven per frame at sea
   *  (1.0 above water, down to 0.15 below) times `envK`, the row's paint.env (the Reach Remote's is 0.7). */
  function satin(root: THREE.Object3D, envK = 1) {
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const std = m as THREE.MeshStandardMaterial;
        if (!std.metalnessMap) {
          std.roughness = 0.78;
          std.metalness = 0.06;
        }
        std.envMapIntensity = 0.7 * envK;
        std.userData.envK = envK;
        pbrMats.push(std);
        if (std.map) std.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
    });
  }

  /** The hull is modelled along X. Find which end is the bow and turn the model so it points to +X. Measured at the
   *  waterline band only: above deck the stern's LARS A-frame overhangs the transom and reads as a thin "bow". */
  function orientBow(root: THREE.Object3D, box: THREE.Box3) {
    const v = new THREE.Vector3();
    const pts: { x: number; z: number }[] = [];
    const yLo = box.min.y + DRAFT - 1.5;
    const yHi = box.min.y + DRAFT + 0.5;
    root.updateMatrixWorld(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const pos = mesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 2) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
        if (v.y > yLo && v.y < yHi) pts.push({ x: v.x, z: v.z });
      }
    });
    if (!pts.length) return;
    let xMin = Infinity;
    let xMax = -Infinity;
    for (const p of pts) {
      xMin = Math.min(xMin, p.x);
      xMax = Math.max(xMax, p.x);
    }
    const cut = (xMax - xMin) * 0.1;
    let frontW = 0;
    let backW = 0;
    for (const p of pts) {
      if (p.x > xMax - cut) frontW = Math.max(frontW, Math.abs(p.z));
      if (p.x < xMin + cut) backW = Math.max(backW, Math.abs(p.z));
    }
    if (frontW > backW) root.rotation.y = Math.PI;
  }

  async function loadVessel() {
    const t0 = performance.now();
    const url = `${base}models/reach-remote-lod1.glb`;
    if (status) status.textContent = 'Loading the vessel…';
    stage.classList.add('is-loading');
    const gltf = await loader.loadAsync(url);
    const root = gltf.scene;
    satin(root, 0.7);
    const box0 = new THREE.Box3().setFromObject(root);
    orientBow(root, box0);
    const box = new THREE.Box3().setFromObject(root);
    const centre = box.getCenter(new THREE.Vector3());
    radius = box.getSize(new THREE.Vector3()).length() / 2;
    // Waterline at y = 0: the hull's lowest point sits at the draft, centred on the holder
    root.position.set(-centre.x, -box.min.y - DRAFT, -centre.z);
    holder.add(root);
    root.updateMatrixWorld(true);
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && !hullMesh) hullMesh = o as THREE.Mesh;
    });
    buildMoonpool();
    wl = SEA.waterlineEllipse(holder, root);
    try {
      // Lettering as the 3D World v73 (reach-world/src/hullname.js, copied to reach-remote-hullname.js), matched to
      // photos of Reach Remote 1 in harbour: the bow name over the two oval ports, a third the height of the REACH
      // letters; the stern name, HAUGESUND and the draft marks. Built in the holder's frame (waterline y = 0, bow +X
      // after orientBow), so the world's own heights apply as they are.
      // the REACH SUBSEA logo at its real size, between the side doors (3D World v83, reach-world/src/hulllogo.js);
      // it edits the hull geometry, so it goes before the lettering measures the hull
      resizeHullLogo({ THREE, hull: root, frame: holder, bow: 1 });
      // the red/blue paint line at the real ship's height, between the 6 and 4 under 6M (3D World v84)
      raiseBootTop({ THREE, hull: root, frame: holder });
      const lettering = { THREE, hull: root, frame: holder, renderer, bow: 1, sizeText: 'REACH REMOTE 1' };
      const name = createHullName({ ...lettering, text: 'REACH REMOTE 1', capHeight: 0.22, y: 2.66, aftEnd: 0.22, tracking: 0.04 });
      holder.add(name);
      const stern = createSternName({ ...lettering, text: 'REACH REMOTE 1', port: 'HAUGESUND' });
      holder.add(stern);
      // the draft scale down each side at bow, midships and stern, level with the transom's marks (3D World v82)
      holder.add(createDraftMarks({ THREE, hull: root, frame: holder, renderer, bow: 1, ...stern.userData.marks }));
      // the IMO number, dark, centred on the forward-facing panel above the bow bulwark (Reach Remote 1's real number)
      holder.add(createBowImo({ THREE, hull: root, frame: holder, renderer, bow: 1, text: 'IMO 9972191' }));
      // the azimuth thrusters, the gondola (moonpool walls, sonar pods, U foil), the stern fins and the moonpool mouth, as the 3D World v77 (reach-world/src/propulsion.js)
      holder.add(createUnderwaterGear({ THREE, hull: root, frame: holder, bow: 1 }));
    } catch (e) {
      console.warn('hull name', e);
    }
    controls.target.set(0, TARGET_Y, 0);
    applyView(currentView, false);
    const ms = Math.round(performance.now() - t0);
    if (status) status.textContent = `Vessel · 950 KB · ${ms.toLocaleString('en-GB')} ms`;
    stage.classList.remove('is-loading');
    // Then the ROV and TMS in the background, once the page is idle
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (idle) idle(() => void loadLaunch(true), { timeout: 3000 });
    else setTimeout(() => void loadLaunch(true), 1500);
  }

  // ── Moonpool: the real hull has no housing box; it opens in the hull bottom between the two gondola walls,
  //    which createUnderwaterGear draws along with the dark mouth. Only the measurements are needed here: the stack
  //    starts up inside the hull and is lowered out through the mouth.
  const moon = { keel: -2.1, mouth: -2.13, attach: new THREE.Vector3(MOON.x, -1.8, 0) };
  const moonGroup = new THREE.Group();
  moonGroup.visible = false;
  holder.add(moonGroup);
  function buildMoonpool() {
    if (!hullMesh) return;
    const ray = new THREE.Raycaster();
    let lo = Infinity;
    for (const px of [MOON.x - MOON.len / 2, MOON.x, MOON.x + MOON.len / 2])
      for (const pz of [-MOON.wid / 2, 0, MOON.wid / 2]) {
        const origin = new THREE.Vector3(px, -30, pz);
        holder.localToWorld(origin);
        ray.set(origin, new THREE.Vector3(0, 1, 0));
        const hit = ray.intersectObject(hullMesh, false)[0];
        if (hit) lo = Math.min(lo, holder.worldToLocal(hit.point.clone()).y);
      }
    if (!isFinite(lo)) lo = -2.1;
    moon.keel = lo;
    moon.mouth = lo - 0.03;
    moon.attach.set(MOON.x, lo + 0.3, 0);
  }

  // ── The launch: TMS and ZeeROV stack, umbilical and tether ──────────────────────────────────
  const stack = new THREE.Group();
  stack.visible = false;
  holder.add(stack);
  const tmsHolder = new THREE.Group();
  const rovHolder = new THREE.Group();
  stack.add(tmsHolder, rovHolder);
  // The ZeeROV's lamps, haze cones, glow and nav dome, as the world's rig; on as the stack leaves the housing
  const rig = createZeeRovRig({ THREE, parent: rovHolder });
  let launchLoaded = false;
  let launchLoading: Promise<void> | null = null;
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.7, metalness: 0.2 });
  const tetherMat = new THREE.MeshStandardMaterial({ color: 0xf2c200, roughness: 0.6, metalness: 0.05 });
  const umbilical = new THREE.Mesh(new THREE.BufferGeometry(), cableMat);
  const tether = new THREE.Mesh(new THREE.BufferGeometry(), tetherMat);
  umbilical.visible = tether.visible = false;
  stack.add(umbilical, tether);

  function centreIn(root: THREE.Object3D, into: THREE.Group, scale = 1, rotY = 0) {
    root.scale.setScalar(scale);
    root.rotation.y = rotY;
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    root.position.sub(c);
    into.add(root);
  }
  /** `quiet`: fetched in the background once the vessel is in, so the launch is ready by the time the tour gets there;
   *  the loading readout shows only if the visitor reaches the launch while it is still on its way */
  let launchShown = false;
  function loadLaunch(quiet = false) {
    if (!quiet && !launchShown && !launchLoaded) {
      launchShown = true;
      if (status) status.textContent = 'Loading the ZeeROV and TMS…';
      stage.classList.add('is-loading');
    }
    if (launchLoading) return launchLoading;
    launchLoading = (async () => {
      const [rov, tms] = await Promise.all([loader.loadAsync(`${base}models/rov-zeerov.glb`), loader.loadAsync(`${base}models/etms.glb`)]);
      satin(rov.scene);
      satin(tms.scene);
      centreIn(rov.scene, rovHolder, 1, Math.PI); // the world: rotY PI, the model's front along the hull
      centreIn(tms.scene, tmsHolder, ROV.tmsScale, -2.258);
      // As the 3D World: etms.glb is only measured; what shows is the world's own Kystdesign-style cage
      // (reach-world/src/tethers.js, copied to reach-remote-tmscage.js), fitted to the model's half-height.
      tms.scene.visible = false;
      const cage = createTmsCage({ THREE, pbrMats });
      cage.scale.setScalar(0.78); // etms.glb's half-height (0.78 m at this scale) / the cage's CAGE_HALF (1.0), as the world; ROV.tmsHalf is its real half-height
      cage.rotation.y = -2.258;
      tmsHolder.add(cage);
      launchLoaded = true;
      if (status && launchShown) status.textContent = 'ZeeROV 1,159 KB · TMS 588 KB';
      stage.classList.remove('is-loading');
    })();
    return launchLoading;
  }

  const cable = (mesh: THREE.Mesh, pts: THREE.Vector3[], r: number) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    mesh.geometry.dispose();
    mesh.geometry = new THREE.TubeGeometry(curve, 24, r, 6, false);
  };

  // Everything is a pure function of T (0..1), so a scrub re-evaluates it
  let T = 0;
  const stackC = new THREE.Vector3(); // stack centre, holder frame
  const rovP = new THREE.Vector3();
  const tmsP = new THREE.Vector3();
  function poseLaunch() {
    const dockH = ROV.halfH + ROV.dockGap + ROV.tmsHalf - ROV.top; // TMS centre above the ROV attach when latched
    const inside = new THREE.Vector3(MOON.x, moon.mouth + 0.15 + ROV.halfH, 0);
    const hang = new THREE.Vector3(MOON.x, moon.mouth - ROV.hangBelow, 0);
    const deep = new THREE.Vector3(MOON.x + 6, moon.mouth - ROV.dive, 2);
    let tmsH = dockH;
    let release = 0;
    const [ready, launch, descent, rel] = CHAPTERS;
    if (T < launch.t0) {
      rovP.copy(inside);
    } else if (T < descent.t0) {
      rovP.lerpVectors(inside, hang, smoother((T - launch.t0) / (launch.t1 - launch.t0)));
    } else if (T < rel.t0) {
      const u = smoother((T - descent.t0) / (descent.t1 - descent.t0));
      rovP.lerpVectors(hang, deep, u);
      rovP.x += Math.sin(u * Math.PI) * 1.5;
    } else {
      release = smoother((T - rel.t0) / (rel.t1 - rel.t0));
      tmsH = dockH + (4.5 - dockH) * release;
      rovP.copy(deep);
      rovP.x += release * ROV.tetherOut;
      rovP.y -= (tmsH - dockH) * 0.4;
    }
    tmsP.set(rovP.x - release * ROV.tetherOut, rovP.y + ROV.top + tmsH + release * (tmsH - dockH) * 0.4, rovP.z);
    rovHolder.position.copy(rovP);
    rovHolder.rotation.y = -1.75 + release * 0.35; // flies off along the hull with its lamps about 40° off the camera, so they show
    tmsHolder.position.copy(tmsP);
    stackC.lerpVectors(rovP, tmsP, 0.5);
    // Umbilical: from the housing down to the TMS top, with a catenary belly
    const top = new THREE.Vector3(tmsP.x, tmsP.y + ROV.tmsHalf, tmsP.z);
    const a = moon.attach.clone();
    const span = a.distanceTo(top);
    const mid = a.clone().lerp(top, 0.5);
    mid.x += Math.min(4, span * 0.08);
    mid.y -= Math.min(3, span * 0.06);
    umbilical.visible = T > launch.t0;
    if (umbilical.visible) cable(umbilical, [a, mid, top], 0.06);
    // Tether: out of the TMS bellmouth to the ROV, a lazy S once released
    tether.visible = release > 0.02;
    if (tether.visible) {
      const b = new THREE.Vector3(tmsP.x, tmsP.y - ROV.tmsHalf, tmsP.z);
      const r = new THREE.Vector3(rovP.x, rovP.y + ROV.top, rovP.z);
      const m1 = b.clone().lerp(r, 0.35);
      m1.y -= 1.2 * release;
      m1.z += 0.6 * release;
      const m2 = b.clone().lerp(r, 0.75);
      m2.y -= 0.6 * release;
      cable(tether, [b, m1, m2, r], 0.03);
    }
    // Lamps come on as the stack clears the mouth
    rig.setLamps(smooth((T - 0.16) / 0.1));
    // Chapter label
    let ch = ready;
    for (const c of CHAPTERS) if (T >= c.t0) ch = c;
    if (chapterEl) chapterEl.textContent = ch.name;
    if (hero && !tourLive) hero.style.opacity = String(1 - smooth(T / 0.08));
  }

  // Camera route for the launch, keys [T, dist, elev, az]: world-style spherical offset round the focus point
  // (az 0 = +Z, elev in radians). The first key equals the cover view, so T = 0 is the hero.
  // [dist, elev, az] the launch's camera starts from: the tour hands over the rails' position; otherwise the cover view
  let launchStart: [number, number, number] | null = null;
  function camKeys() {
    let D0: number;
    let el0: number;
    let az0: number;
    if (launchStart) [D0, el0, az0] = launchStart;
    else {
      const p = viewPosition('cover', BASE_TARGET).sub(BASE_TARGET);
      D0 = p.length();
      const d = p.normalize();
      az0 = Math.atan2(d.x, d.z);
      el0 = Math.asin(d.y);
    }
    return [
      [0, D0, el0, az0],
      [0.3, D0 * 0.4 + 26 * 0.6, el0 * 0.4 - 0.45 * 0.6, az0 + 0.5],
      [0.5, 28, -0.3, az0 + 0.75],
      [0.74, 22, -0.1, az0 + 1.0],
      [0.88, 24, 0.08, az0 + 1.1],
      [1, 24, 0.12, az0 + 1.15],
    ];
  }
  function camKey(t: number, K: number[][]) {
    const n = K.length;
    if (t <= K[0][0]) return K[0];
    if (t >= K[n - 1][0]) return K[n - 1];
    let i = 0;
    while (i < n - 2 && t >= K[i + 1][0]) i++;
    const t0 = K[i][0];
    const t1 = K[i + 1][0];
    const h = t1 - t0;
    const s = (t - t0) / h;
    const slope = (j: number, c: number) =>
      j === 0 ? (K[1][c] - K[0][c]) / (K[1][0] - K[0][0]) : j === n - 1 ? (K[j][c] - K[j - 1][c]) / (K[j][0] - K[j - 1][0]) : (K[j + 1][c] - K[j - 1][c]) / (K[j + 1][0] - K[j - 1][0]);
    const s2 = s * s;
    const s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1;
    const h10 = s3 - 2 * s2 + s;
    const h01 = -2 * s3 + 3 * s2;
    const h11 = s3 - s2;
    const out = [t];
    for (let c = 1; c < 4; c++) out.push(h00 * K[i][c] + h10 * h * slope(i, c) + h01 * K[i + 1][c] + h11 * h * slope(i + 1, c));
    return out;
  }
  const launchFocus0 = new THREE.Vector3(0, TARGET_Y, 0); // where the launch's focus starts (the tour sets it to the rails' target)
  function focusPoint(out: THREE.Vector3) {
    const [, launch, descent] = CHAPTERS;
    const mouth = new THREE.Vector3(MOON.x, moon.mouth, 0);
    if (T < launch.t0) out.lerpVectors(launchFocus0, mouth, smooth(T / launch.t0));
    else if (T < descent.t0) out.lerpVectors(mouth, stackC, smooth((T - launch.t0) / (launch.t1 - launch.t0)));
    else out.copy(stackC);
    return holder.localToWorld(out);
  }
  const _f = new THREE.Vector3();
  const _o = new THREE.Vector3();
  let keys: number[][] | null = null;
  function driveLaunchCamera() {
    focusPoint(_f);
    if (!keys) keys = camKeys();
    const k = camKey(T, keys);
    const ce = Math.cos(k[2]);
    _o.set(ce * Math.sin(k[3]), Math.sin(k[2]), ce * Math.cos(k[3])).multiplyScalar(k[1]);
    controls.target.copy(_f);
    camera.position.copy(_f).add(_o);
    if (launchShift) {
      composeOffset(_o, launchShift, 0, _s);
      controls.target.add(_s);
      camera.position.add(_s);
    }
  }
  let launchShift = 0; // the tour's `shift` carried into the launch, so the picture stays right of the text panel

  function setLaunch(t: number) {
    T = clamp01(t);
    if (T > 0 && !launchLoaded) void loadLaunch();
    stack.visible = T > 0;
    controls.enabled = T === 0 && !touring;
    if (T === 0) {
      keys = null;
      rig.setLamps(0);
      if (hero && !tourLive) hero.style.opacity = '1';
      if (chapterEl) chapterEl.textContent = CHAPTERS[0].name;
      if (!touring) applyView(currentView, false);
    }
  }

  // ── Views ───────────────────────────────────────────────────────────────────────────────────
  let currentView: ViewName = 'cover';
  const tween = { from: new THREE.Vector3(), to: new THREE.Vector3(), t: 1 };

  /** Portrait stages look down on the vessel a little more: the hero lift below would otherwise put a waterline camera
   *  into the swell (at 375 the crests hid the hull) */
  const portraitPolar = (polar: number) => (camera.aspect < 1 ? polar - 12 : polar);
  function viewPosition(name: ViewName, from: THREE.Vector3 = controls.target): THREE.Vector3 {
    const v = VIEWS[name];
    const dist = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * v.fit * fitScale;
    const az = THREE.MathUtils.degToRad(v.az);
    const polar = THREE.MathUtils.degToRad(portraitPolar(v.polar));
    // Azimuth is measured from +X (ahead of the bow) towards +Z (starboard)
    return new THREE.Vector3(Math.cos(az) * Math.sin(polar), Math.cos(polar), Math.sin(az) * Math.sin(polar)).multiplyScalar(dist).add(from);
  }

  /** Compose the hero: the vessel right of centre on landscape stages (the hero text takes the left column) and
   *  lifted on portrait ones. Done by moving the orbit target across the view, never by a camera view offset: the
   *  water's mirror copies the camera's projection and an offset projection breaks its reflection. */
  const BASE_TARGET = new THREE.Vector3(0, TARGET_Y, 0);
  function frameView() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h || T > 0 || touring) return;
    const v = VIEWS[currentView];
    const landscape = w / h >= 1;
    const dist = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * v.fit * fitScale;
    const az = THREE.MathUtils.degToRad(v.az);
    const polar = THREE.MathUtils.degToRad(portraitPolar(v.polar));
    const dir = new THREE.Vector3(Math.cos(az) * Math.sin(polar), Math.cos(polar), Math.sin(az) * Math.sin(polar)); // target → camera
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize(); // screen right
    const up = new THREE.Vector3().crossVectors(dir, right).normalize();
    const viewH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const viewW = viewH * camera.aspect;
    controls.target.copy(BASE_TARGET);
    if (landscape) controls.target.addScaledVector(right, -v.shift * viewW);
    else controls.target.addScaledVector(up, -0.12 * viewH);
  }

  function applyView(name: ViewName, animate = true) {
    currentView = name;
    frameView();
    const to = viewPosition(name);
    if (!animate || reducedMotion) {
      camera.position.copy(to);
      tween.t = 1;
    } else {
      tween.from.copy(camera.position);
      tween.to.copy(to);
      tween.t = 0;
    }
  }

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Portrait stages (phones) need the camera further back to fit the hull's length
    fitScale = camera.aspect < 1 ? 1.35 / camera.aspect : 1;
    camera.updateProjectionMatrix();
    keys = null;
    if (T === 0 && !touring) applyView(currentView, false);
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // ── Frame loop ──────────────────────────────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  const _bob = [0, 0, 0];
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (spin === 'sway') {
      holder.rotation.y = Math.sin(t * 0.21) * 0.07; // yaw ±4°
      if (sceneName === 'sea') {
        // The world's ride: heave, pitch and roll read off the swell under the hull
        if (holder.rotation.order !== 'YXZ') holder.rotation.order = 'YXZ';
        SEA.bobPose(holder, t, BOB.half, BOB.beam, _bob);
        holder.position.y = _bob[0];
        holder.rotation.x = _bob[1];
        holder.rotation.z = _bob[2];
      } else {
        holder.rotation.z = Math.sin(t * 0.47) * 0.008; // roll
        holder.rotation.x = Math.sin(t * 0.33 + 1) * 0.005; // pitch
        holder.position.y = Math.sin(t * 0.55) * 0.12; // heave
      }
    }
    if (tourLive) tourFrame(dt);
    if (T > 0) {
      poseLaunch();
      driveLaunchCamera();
      camera.lookAt(controls.target);
    } else if (touring) {
      railsFrame(dt);
    } else {
      if (tween.t < 1) {
        tween.t = Math.min(1, tween.t + dt / 0.9);
        const e = 1 - Math.pow(1 - tween.t, 3);
        camera.position.lerpVectors(tween.from, tween.to, e);
      }
      controls.autoRotate = spin === 'orbit';
      controls.update();
    }
    if (sceneName === 'sea') {
      if (wl) SEA.setHull(holder, wl);
      const { under, f } = SEA.update(t, camera, pbrMats);
      rig.update(t, under, f);
      snow.visible = under > 0;
      snowUni.uCam.value.copy(camera.position);
      snowUni.uTime.value = t;
      SEA.renderMirror(renderer, scene, camera);
    } else rig.update(t, 0, 0);
    renderer.render(scene, camera);
    if (tourLive) placePoints();
    requestAnimationFrame(frame);
  }


  // ── The tour: the stage pinned, the camera on rails through the chapters (9 Oct 2026, Q167) ──
  type Key = { dist: number; elev: number; az: number; target: THREE.Vector3; shift: number; lift: number };
  const chapterEls = tourRoot ? Array.from(tourRoot.querySelectorAll<HTMLElement>('[data-tour-chapter]')) : [];
  const tickEls = tourRoot ? Array.from(tourRoot.querySelectorAll<HTMLElement>('[data-tour-tick]')) : [];
  const pinEl = tourRoot?.querySelector<HTMLElement>('[data-tour-pin]') ?? null;
  const pointsEl = tourRoot?.querySelector<HTMLElement>('[data-tour-points]') ?? null;
  const launchIndex = chapterEls.findIndex((el) => el.dataset.tourChapter === 'launch');
  let feel: 'follow' | 'snap' = 'follow';

  /** Chapter keys from the runway's data; the hero (chapter 0) is the cover view, computed once the vessel is measured */
  const keysOf: (Key | null)[] = chapterEls.map((el) => {
    const n = (el.dataset.cam ?? '').split(',').map(Number);
    if (n.length < 7 || n.some((v) => Number.isNaN(v))) return null;
    return { dist: n[0], elev: n[1], az: n[2], target: new THREE.Vector3(n[3], n[4], n[5]), shift: n[6], lift: 0 };
  });
  function heroKey(): Key {
    const p = viewPosition('cover', BASE_TARGET).sub(BASE_TARGET);
    const d = p.clone().normalize();
    return { dist: p.length(), elev: Math.asin(d.y), az: Math.atan2(d.x, d.z), target: BASE_TARGET.clone(), shift: VIEWS.cover.shift, lift: 0.12 };
  }
  const keyAt = (i: number): Key => (i === 0 || !keysOf[i] ? heroKey() : keysOf[i]!);

  /** The composition offset: the picture moves right of the text column on landscape stages (shift × the view's
   *  width along screen right) and lifts on portrait ones (the hero only), by moving the target, never the
   *  camera's view offset (the water's mirror copies the camera's projection). `o` is the target → camera offset. */
  const _s = new THREE.Vector3();
  const _right = new THREE.Vector3();
  const _up = new THREE.Vector3();
  function composeOffset(o: THREE.Vector3, shift: number, lift: number, out: THREE.Vector3) {
    const dist = o.length();
    const dir = _up.copy(o).divideScalar(dist || 1);
    _right.crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
    const viewH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    out.set(0, 0, 0);
    if (camera.aspect >= 1) out.addScaledVector(_right, -shift * viewH * camera.aspect);
    else out.addScaledVector(_up.crossVectors(dir, _right).normalize(), -lift * viewH);
    return out;
  }

  // The rails: where the camera is (cur) and where the scroll wants it (goal); cur chases goal every frame
  const cur: Key = { dist: 40, elev: 0.1, az: 0, target: new THREE.Vector3(), shift: 0, lift: 0 };
  const goal: Key = { dist: 40, elev: 0.1, az: 0, target: new THREE.Vector3(), shift: 0, lift: 0 };
  const lerpKey = (a: Key, b: Key, u: number, out: Key) => {
    out.dist = a.dist + (b.dist - a.dist) * u;
    out.elev = a.elev + (b.elev - a.elev) * u;
    let daz = b.az - a.az;
    daz = Math.atan2(Math.sin(daz), Math.cos(daz)); // the short way round
    out.az = a.az + daz * u;
    out.target.lerpVectors(a.target, b.target, u);
    out.shift = a.shift + (b.shift - a.shift) * u;
    out.lift = a.lift + (b.lift - a.lift) * u;
  };
  const _ro = new THREE.Vector3();
  const _tg = new THREE.Vector3();
  function railsFrame(dt: number) {
    const k = 1 - Math.exp(-dt * (feel === 'follow' ? 5 : 4.5));
    lerpKey(cur, goal, k, cur);
    const ce = Math.cos(cur.elev);
    // Portrait stages sit further back, but less than the hero does: the chapters frame a part of the vessel, not all of it
    _ro.set(ce * Math.sin(cur.az), Math.sin(cur.elev), ce * Math.cos(cur.az)).multiplyScalar(cur.dist * (1 + (fitScale - 1) * 0.35));
    holder.localToWorld(_tg.copy(cur.target));
    composeOffset(_ro, cur.shift, cur.lift, _s);
    _tg.add(_s);
    controls.target.copy(_tg);
    camera.position.copy(_tg).add(_ro);
    camera.lookAt(_tg);
  }

  // Scroll → chapter and progress. The line is the pin's top edge; chapter i's run begins when its top reaches it.
  let tops: number[] = [];
  let heights: number[] = [];
  let pinTop = 0;
  let launchGoal = 0;
  let current = 0;
  let tourI = 0;
  let tourS = 0;
  let riseSet = -1;
  /** How far a chapter's cards are revealed, 0 → 1: they rise in over the run's 55–80% (each card a step after the one
   *  before) and go out over the next run's 20–45%; the launch's with the ROV's descent */
  function revealOf(chapter: number, order: number): number {
    if (launchIndex > 0 && chapter === launchIndex) return tourI >= launchIndex ? smooth(clamp01((T - 0.12 - order * 0.05) / 0.18)) : 0;
    if (chapter === tourI) return smooth(clamp01((tourS - 0.55 - order * 0.06) / 0.25));
    if (chapter === tourI - 1) return tourI === launchIndex ? 1 - smooth(clamp01(T / 0.12)) : 1 - smooth(clamp01((tourS - 0.2) / 0.25));
    return 0;
  }
  function measureTour() {
    if (!pinEl) return;
    pinTop = parseFloat(getComputedStyle(pinEl).top) || 0;
    tops = chapterEls.map((el) => el.getBoundingClientRect().top + window.scrollY);
    heights = chapterEls.map((el) => el.offsetHeight);
    // The hero's name line rides up to --rr-name-top on the tour: how far, from the layout (offsetTop ignores transforms)
    if (hero) {
      const nameTop = parseFloat(getComputedStyle(stage).getPropertyValue('--rr-name-top')) || 0;
      stage.style.setProperty('--rr-rise-px', `${Math.max(0, hero.offsetTop - nameTop)}px`);
    }
  }
  // The words: which chapter's title and tick show (changes halfway through a run)
  function setCurrent(i: number) {
    if (i === current) return;
    current = i;
    tickEls.forEach((tick, n) => {
      const on = n + 1 === i;
      tick.classList.toggle('is-current', on);
      if (on) tick.setAttribute('aria-current', 'step');
      else tick.removeAttribute('aria-current');
    });
  }
  // The rails: engaged from the first chapter's first pixel, so the camera is already moving when the title changes
  function setTouring(on: boolean) {
    if (on === touring) return;
    touring = on;
    stage.classList.toggle('is-touring', on);
    controls.enabled = !on && T === 0;
    if (on) {
      // Leave the hero from wherever the visitor's orbit left the camera, so the rails never jump
      _ro.copy(camera.position).sub(controls.target);
      cur.dist = _ro.length();
      cur.elev = Math.asin(THREE.MathUtils.clamp(_ro.y / (cur.dist || 1), -1, 1));
      cur.az = Math.atan2(_ro.x, _ro.z);
      cur.target.copy(BASE_TARGET);
      cur.shift = VIEWS.cover.shift;
      cur.lift = 0.12;
    } else applyView(currentView, true);
  }
  // The scroll line the camera reads is smoothed (a wheel notch is a 100 px step; the goal must not step with it);
  // a tick jump sets it outright so the camera glides straight to that chapter, not through the ones between
  let lineS = NaN;
  function snapLine() {
    lineS = window.scrollY + pinTop;
  }
  function tourFrame(dt: number) {
    if (!tops.length || !tourLive) return;
    const lineNow = window.scrollY + pinTop;
    if (Number.isNaN(lineS)) lineS = lineNow;
    lineS += (lineNow - lineS) * (1 - Math.exp(-dt * 10));
    const line = Math.abs(lineNow - lineS) < 0.5 ? lineNow : lineS;
    let i = 0;
    for (let n = 0; n < tops.length; n++) if (line >= tops[n]) i = n;
    const s = heights[i] ? clamp01((line - tops[i]) / heights[i]) : 0;
    // The camera runs the whole chapter, easing into its key at the run's end (a continuous scrub, no holds); the
    // title changes halfway, when the picture is nearer the new feature than the old one
    setTouring(i > 0);
    setCurrent(i > 0 && s < (i === launchIndex ? 0.12 : 0.5) ? i - 1 : i);
    tourI = i;
    tourS = s;
    const rise = i === 0 ? 0 : i === 1 ? smooth(clamp01(s / 0.5)) : 1;
    if (Math.abs(rise - riseSet) > 0.002) {
      riseSet = rise;
      stage.style.setProperty('--rr-rise', rise.toFixed(3));
    }
    const inLaunch = launchIndex > 0 && i >= launchIndex;
    // The launch: its own scrub, damped like the rails, starting from where the rails are
    launchGoal = inLaunch ? (i > launchIndex ? 1 : s) : 0;
    const k = 1 - Math.exp(-dt * 6);
    const next = T + (launchGoal - T) * k;
    if (inLaunch && T === 0 && next > 0) {
      launchStart = [cur.dist, cur.elev, cur.az];
      launchFocus0.copy(cur.target);
      launchShift = cur.shift;
      keys = null;
    }
    setLaunch(next < 0.002 && launchGoal === 0 ? 0 : next);
    if (inLaunch) return;
    // The camera's goal: from the previous key to this one over the run, eased at both ends
    if (feel === 'snap' || i === 0) {
      const k0 = keyAt(current);
      lerpKey(k0, k0, 0, goal);
    } else lerpKey(keyAt(i - 1), keyAt(i), smooth(s), goal);
  }

  // Points: the brochure's labels, projected onto the stage, hidden when the hull is in the way
  type Pt = {
    el: HTMLElement;
    chapter: number;
    anchor: THREE.Vector3 | 'tms' | 'rov';
    dx: number;
    dy: number;
    leader: HTMLElement | null;
    label: HTMLElement | null;
    side: 'right' | 'left' | 'below';
    order: number;
    rev: number;
    shift: number; // extra y offset when a label would overlap another's
    slide: number; // extra x offset when a card under its marker would run off the stage
    sx: number;
    sy: number;
    on: boolean;
  };
  const pts: Pt[] = (pointsEl ? Array.from(pointsEl.querySelectorAll<HTMLElement>('[data-point]')) : []).map((el) => {
    const a = el.dataset.anchor ?? '';
    const n = a.split(',').map(Number);
    return {
      el,
      chapter: Number(el.dataset.chapter),
      anchor: a === 'tms' || a === 'rov' ? a : new THREE.Vector3(n[0], n[1], n[2]),
      dx: Number(el.dataset.dx ?? 28),
      dy: Number(el.dataset.dy ?? -22),
      leader: el.querySelector<HTMLElement>('[data-point-leader]'),
      label: el.querySelector<HTMLElement>('[data-point-label]'),
      side: el.dataset.side === 'left' ? 'left' : 'right',
      order: Number(el.dataset.order ?? 0),
      rev: -1,
      shift: 0,
      slide: 0,
      sx: 0,
      sy: 0,
      on: false,
    };
  });
  // The label sits to the marker's right; if that runs off the stage, to its left; if neither fits (phones),
  // centred under the marker. A label that would cover another's is pushed clear of it (leader and all).
  function sidePoint(p: Pt, side: Pt['side'], shift: number, slide = 0) {
    p.side = side;
    p.shift = shift;
    p.slide = slide;
    const dx = (side === 'right' ? p.dx : side === 'left' ? -p.dx : 0) + slide;
    const dy = (side === 'below' ? Math.abs(p.dy) : p.dy) + shift;
    if (p.leader) {
      p.leader.style.width = `${Math.hypot(dx, dy)}px`;
      p.leader.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
    }
    if (p.label) {
      p.label.style.setProperty('--rr-dx', `${dx}px`);
      p.label.style.setProperty('--rr-dy', `${dy}px`);
      p.label.classList.toggle('is-left', side === 'left');
      p.label.classList.toggle('is-below', side === 'below');
    }
  }
  function labelBox(p: Pt, side: Pt['side'], shift: number, lw: number, lh: number) {
    const dx = side === 'right' ? p.dx : side === 'left' ? -p.dx : 0;
    const dy = (side === 'below' ? Math.abs(p.dy) : p.dy) + shift;
    const x0 = side === 'right' ? p.sx + dx : side === 'left' ? p.sx + dx - lw : p.sx - lw / 2;
    const y0 = side === 'below' ? p.sy + dy : p.sy + dy - lh / 2;
    return { x0, x1: x0 + lw, y0, y1: y0 + lh };
  }
  function layoutPoints(w: number) {
    const gutter = 16;
    const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
    for (const p of pts) {
      if (!p.on || !p.label) continue;
      const lw = p.label.offsetWidth;
      const lh = p.label.offsetHeight;
      // Keep the side it has while that still fits (no flapping at the edge)
      const fits = (side: Pt['side']) => {
        const b = labelBox(p, side, 0, lw, lh);
        return b.x0 >= gutter && b.x1 <= w - gutter;
      };
      let side: Pt['side'] = p.side;
      if (!fits(side)) side = fits('right') ? 'right' : fits('left') ? 'left' : 'below';
      let shift = 0;
      let box = labelBox(p, side, 0, lw, lh);
      // A card under its marker slides sideways to stay on the stage (phones: a wide card on a narrow stage)
      let slide = 0;
      if (side === 'below') {
        if (box.x0 < gutter) slide = gutter - box.x0;
        else if (box.x1 > w - gutter) slide = w - gutter - box.x1;
        box = { x0: box.x0 + slide, x1: box.x1 + slide, y0: box.y0, y1: box.y1 };
      }
      for (const o of placed) {
        if (box.x1 <= o.x0 || box.x0 >= o.x1 || box.y1 <= o.y0 || box.y0 >= o.y1) continue;
        // Push away from the other label, whichever way is nearer
        const down = o.y1 - box.y0 + 8;
        const up = box.y1 - o.y0 + 8;
        shift += down <= up ? down : -up;
        box = labelBox(p, side, shift, lw, lh);
      }
      placed.push(box);
      if (side !== p.side || Math.abs(shift - p.shift) > 0.5 || Math.abs(slide - p.slide) > 0.5) sidePoint(p, side, shift, slide);
    }
  }
  // Dimension lines: two hull points projected each frame, a line with end ticks and the figure at the midpoint
  type Dim = { g: SVGGElement; line: SVGLineElement; ta: SVGLineElement; tb: SVGLineElement; label: HTMLElement | null; chapter: number; order: number; a: THREE.Vector3; b: THREE.Vector3; rev: number; draw: number };
  const dims: Dim[] = (pointsEl ? Array.from(pointsEl.querySelectorAll<SVGGElement>('[data-dim]')) : []).map((g) => {
    const v = (k: string) => new THREE.Vector3(...(g.getAttribute(k) ?? '0,0,0').split(',').map(Number) as [number, number, number]);
    return {
      g,
      line: g.querySelector<SVGLineElement>('[data-dim-line]')!,
      ta: g.querySelector<SVGLineElement>('[data-dim-tick="a"]')!,
      tb: g.querySelector<SVGLineElement>('[data-dim-tick="b"]')!,
      label: pointsEl?.querySelector<HTMLElement>(`[data-dim-label="${g.dataset.dimId}"]`) ?? null,
      chapter: Number(g.dataset.chapter),
      order: Number(g.dataset.order),
      a: v('data-a'),
      b: v('data-b'),
      rev: -1,
      draw: -1,
    };
  });
  // the dot pitch of the dimension lines' dashes (as .rr-dim__line[data-dim-line] in the page's CSS)
  const DOT_STEP = 5;
  const _da = new THREE.Vector3();
  const _db = new THREE.Vector3();
  const _dc = new THREE.Vector3();
  /** How far a dimension line is drawn, 0 → 1: it runs out dot by dot from its midpoint as the hero's words rise
   *  (the deck run's first half), the second line a step after the first; whole from then on */
  function drawOf(d: Dim): number {
    if (tourI > d.chapter) return 1;
    if (tourI < d.chapter) return 0;
    return smooth(clamp01((tourS - 0.06 - d.order * 0.22) / 0.38));
  }
  /** A drawn line's presence: whole through its chapter, out with the cards over the next run's 20–45% */
  function fadeOf(chapter: number): number {
    if (chapter === tourI) return 1;
    if (chapter === tourI - 1) return 1 - smooth(clamp01((tourS - 0.2) / 0.25));
    return 0;
  }
  function placeDims(w: number, h: number) {
    for (const d of dims) {
      const draw = drawOf(d);
      const rev = fadeOf(d.chapter);
      let on = draw > 0.001 && rev > 0.001;
      if (on) {
        holder.localToWorld(_da.copy(d.a)).project(camera);
        holder.localToWorld(_db.copy(d.b)).project(camera);
        holder.localToWorld(_dc.set(0, 0, 0)).project(camera);
        if (_da.z > 1 || _db.z > 1) on = false;
      }
      if (on) {
        const ax = ((_da.x + 1) / 2) * w;
        const ay = ((1 - _da.y) / 2) * h;
        const bx = ((_db.x + 1) / 2) * w;
        const by = ((1 - _db.y) / 2) * h;
        const cx = ((_dc.x + 1) / 2) * w;
        const cy = ((1 - _dc.y) / 2) * h;
        const len = Math.hypot(bx - ax, by - ay) || 1;
        // the normal, pointing away from the hull's centre (ticks and the figure sit on the outside)
        let nx = -(by - ay) / len;
        let ny = (bx - ax) / len;
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        if ((mx - cx) * nx + (my - cy) * ny < 0) {
          nx = -nx;
          ny = -ny;
        }
        // the line grows out from its midpoint (where the figure sits) towards both ends; the dot pattern is
        // measured from the moving first end, so it is offset to keep a dot pinned at the midpoint
        const half = draw / 2;
        d.line.setAttribute('x1', (mx - (bx - ax) * half).toFixed(1));
        d.line.setAttribute('y1', (my - (by - ay) * half).toFixed(1));
        d.line.setAttribute('x2', (mx + (bx - ax) * half).toFixed(1));
        d.line.setAttribute('y2', (my + (by - ay) * half).toFixed(1));
        d.line.style.strokeDashoffset = ((DOT_STEP - ((len * half) % DOT_STEP)) % DOT_STEP).toFixed(2);
        const t = 6;
        d.ta.setAttribute('x1', (ax - nx * t).toFixed(1));
        d.ta.setAttribute('y1', (ay - ny * t).toFixed(1));
        d.ta.setAttribute('x2', (ax + nx * t).toFixed(1));
        d.ta.setAttribute('y2', (ay + ny * t).toFixed(1));
        d.tb.setAttribute('x1', (bx - nx * t).toFixed(1));
        d.tb.setAttribute('y1', (by - ny * t).toFixed(1));
        d.tb.setAttribute('x2', (bx + nx * t).toFixed(1));
        d.tb.setAttribute('y2', (by + ny * t).toFixed(1));
        if (d.label) d.label.style.transform = `translate(-50%, -50%) translate3d(${(mx + nx * 18).toFixed(1)}px, ${(my + ny * 18).toFixed(1)}px, 0)`;
        if (Math.abs(rev - d.rev) > 0.004) {
          d.rev = rev;
          d.g.style.setProperty('--rr-reveal', rev.toFixed(3));
          d.label?.style.setProperty('--rr-reveal', rev.toFixed(3));
        }
        if (Math.abs(draw - d.draw) > 0.002) {
          d.draw = draw;
          d.g.style.setProperty('--rr-draw', draw.toFixed(3));
          d.label?.style.setProperty('--rr-draw', draw.toFixed(3));
        }
      }
      d.g.style.visibility = on ? 'visible' : 'hidden';
      d.label?.classList.toggle('is-on', on);
    }
  }
  const occluder = new THREE.Raycaster();
  const _w = new THREE.Vector3();
  const _dirv = new THREE.Vector3();
  function placePoints() {
    if (!pts.length) return;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    for (const p of pts) {
      const rev = revealOf(p.chapter, p.order);
      let on = rev > 0.001;
      if (on && Math.abs(rev - p.rev) > 0.004) {
        p.rev = rev;
        p.el.style.setProperty('--rr-reveal', rev.toFixed(3));
      }
      if (on) {
        if (p.anchor === 'tms') tmsHolder.getWorldPosition(_w);
        else if (p.anchor === 'rov') rovHolder.getWorldPosition(_w);
        else holder.localToWorld(_w.copy(p.anchor));
        if (hullMesh && typeof p.anchor !== 'string') {
          _dirv.copy(_w).sub(camera.position);
          const far = _dirv.length() - 1.0;
          occluder.set(camera.position, _dirv.normalize());
          occluder.far = far;
          if (far > 0 && occluder.intersectObject(hullMesh, false).length) on = false;
        }
        if (on) {
          _w.project(camera);
          if (_w.z > 1 || Math.abs(_w.x) > 1.05 || Math.abs(_w.y) > 1.05) on = false;
          else {
            p.sx = ((_w.x + 1) / 2) * w;
            p.sy = ((1 - _w.y) / 2) * h;
            p.el.style.transform = `translate3d(${p.sx}px, ${p.sy}px, 0)`;
          }
        }
      }
      p.on = on;
      p.el.classList.toggle('is-on', on);
    }
    layoutPoints(w);
    placeDims(w, h);
  }

  function startTour() {
    if (!tourRoot) return;
    tourRoot.classList.toggle('is-live', tourLive);
    if (!tourLive) return;
    // Leaders: a line from the marker to its label, from the point's own offset
    for (const p of pts) {
      sidePoint(p, p.side, 0);
    }
    measureTour();
    let resizing = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizing);
      resizing = window.setTimeout(measureTour, 150);
    });
    window.addEventListener('load', measureTour);
    const behavior: ScrollBehavior = 'smooth';
    // A tick jumps the runway at once: the stage is pinned, so nothing on screen moves except the camera, which
    // glides straight to that chapter's key instead of whipping through the chapters between
    tickEls.forEach((tick, n) => {
      tick.addEventListener('click', () => {
        measureTour();
        const i = n + 1;
        // on the chapter's stop: camera at its key and its cards all in (the last card lands at 92% of the run;
        // the launch's with the ROV out, at 55%), so the dot pressed shows what it names
        window.scrollTo({ top: tops[i] - pinTop + heights[i] * (i === launchIndex ? 0.55 : 0.92), behavior: 'auto' });
        snapLine();
      });
    });
    const skip = tourRoot.querySelector<HTMLAnchorElement>('[data-tour-skip]');
    skip?.addEventListener('click', (e) => {
      e.preventDefault();
      // to the block that slides over the stage (the link's own target), so what follows the tour is at the top of the screen
      const after = document.getElementById(decodeURIComponent(skip.hash.slice(1)));
      window.scrollTo({ top: (after ? after.getBoundingClientRect().top : tourRoot.getBoundingClientRect().bottom) + window.scrollY, behavior });
    });
    // Spec rows light their marker, and only that (one highlight channel)
    tourRoot.addEventListener('pointerover', (e) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>('[data-point-for]');
      pts.forEach((p) => p.el.classList.toggle('is-lit', !!row && p.el.dataset.pointId === row.dataset.pointFor));
    });
    tourRoot.addEventListener('pointerleave', () => pts.forEach((p) => p.el.classList.remove('is-lit')));
  }
  startTour();
  requestAnimationFrame(frame);

  // ── Controls on the page ────────────────────────────────────────────────────────────────────
  function group(attr: string, onPick: (value: string) => void) {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(`[${attr}]`));
    for (const b of buttons) {
      b.addEventListener('click', () => {
        for (const o of buttons) o.setAttribute('aria-pressed', String(o === b));
        onPick(b.getAttribute(attr)!);
      });
    }
  }
  group('data-stage-view', (v) => applyView(v as ViewName));
  group('data-stage-scene', (v) => applyScene(v as SceneName));
  group('data-stage-swell', (v) => SEA.setSwell(Number(v)));
  group('data-stage-mirror', (v) => SEA.setMirror(v === 'on'));
  group('data-stage-spin', (v) => {
    spin = reducedMotion ? 'off' : (v as SpinMode);
    if (spin !== 'sway') {
      holder.rotation.set(0, 0, 0);
      holder.position.set(0, 0, 0);
    }
  });
  group('data-stage-feel', (v) => (feel = v as 'follow' | 'snap'));
  group('data-stage-card', (v) => tourRoot?.classList.toggle('is-solid-card', v === 'solid'));
  const slider = document.querySelector<HTMLInputElement>('[data-stage-launch]');
  slider?.addEventListener('input', () => setLaunch(Number(slider.value) / 100));

  // The scene the page's chips start on, else the block's own (`data-scene`; the Model stage opens at sea)
  applyScene(
    ((document.querySelector('[data-stage-scene][aria-pressed="true"]')?.getAttribute('data-stage-scene') ?? stage.dataset.scene) as SceneName | undefined) ?? 'studio',
  );
  void loadVessel();
  // Review page only: a handle for checking placement from the browser console
  (window as unknown as { __rr: unknown }).__rr = { THREE, camera, holder, SEA, scene, controls, createHullName, renderer, pbrMats, cur, goal, measureTour, get current() { return current; } };
}

for (const stage of document.querySelectorAll<HTMLElement>('[data-stage]')) mountStage(stage);
