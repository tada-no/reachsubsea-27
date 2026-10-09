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
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
// @ts-expect-error untyped module copied from the 3D World
import { createHullName, createSternName, createBowImo } from './reach-remote-hullname.js';
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

  const draco = new DRACOLoader();
  draco.setDecoderPath(`${base}draco/`);
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
      const lettering = { THREE, hull: root, frame: holder, renderer, bow: 1, sizeText: 'REACH REMOTE 1' };
      const name = createHullName({ ...lettering, text: 'REACH REMOTE 1', capHeight: 0.22, y: 2.66, aftEnd: 0.22, tracking: 0.04 });
      holder.add(name);
      holder.add(createSternName({ ...lettering, text: 'REACH REMOTE 1', port: 'HAUGESUND' }));
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
  function loadLaunch() {
    if (launchLoading) return launchLoading;
    launchLoading = (async () => {
      if (status) status.textContent = 'Loading the ZeeROV and TMS…';
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
      if (status) status.textContent = 'ZeeROV 1,159 KB · TMS 588 KB';
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
    if (hero) hero.style.opacity = String(1 - smooth(T / 0.08));
  }

  // Camera route for the launch, keys [T, dist, elev, az]: world-style spherical offset round the focus point
  // (az 0 = +Z, elev in radians). The first key equals the cover view, so T = 0 is the hero.
  function camKeys() {
    const p = viewPosition('cover', BASE_TARGET).sub(BASE_TARGET);
    const D0 = p.length();
    const d = p.normalize();
    const az0 = Math.atan2(d.x, d.z);
    const el0 = Math.asin(d.y);
    return [
      [0, D0, el0, az0],
      [0.1, 58, -0.22, az0 - 0.15],
      [0.22, 40, -0.3, az0 - 0.35],
      [0.3, 26, -0.3, az0 - 0.5],
      [0.5, 28, -0.3, az0 - 0.75],
      [0.74, 22, -0.1, az0 - 1.0],
      [0.88, 24, 0.08, az0 - 1.1],
      [1, 24, 0.12, az0 - 1.15],
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
  function focusPoint(out: THREE.Vector3) {
    const [, launch, descent] = CHAPTERS;
    const mouth = new THREE.Vector3(MOON.x, moon.mouth, 0);
    if (T < launch.t0) out.lerpVectors(BASE_TARGET, mouth, smooth(T / launch.t0));
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
  }

  function setLaunch(t: number) {
    T = clamp01(t);
    if (T > 0 && !launchLoaded) void loadLaunch();
    stack.visible = T > 0;
    controls.enabled = T === 0;
    if (T === 0) {
      keys = null;
      rig.setLamps(0);
      if (hero) hero.style.opacity = '1';
      if (chapterEl) chapterEl.textContent = CHAPTERS[0].name;
      applyView(currentView, false);
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
    if (!w || !h || T > 0) return;
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
    if (T === 0) applyView(currentView, false);
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
    if (T > 0) {
      poseLaunch();
      driveLaunchCamera();
      camera.lookAt(controls.target);
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
      SEA.renderMirror(renderer, scene, camera);
    } else rig.update(t, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
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
  const slider = document.querySelector<HTMLInputElement>('[data-stage-launch]');
  slider?.addEventListener('input', () => setLaunch(Number(slider.value) / 100));

  applyScene('studio');
  void loadVessel();
  // Review page only: a handle for checking placement from the browser console
  (window as unknown as { __rr: unknown }).__rr = { THREE, camera, holder, SEA, scene, controls, createHullName, renderer, pbrMats };
}

for (const stage of document.querySelectorAll<HTMLElement>('[data-stage]')) mountStage(stage);
