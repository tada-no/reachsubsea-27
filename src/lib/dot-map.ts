// Dot-matrix map: the maths shared by the build-time poster (world-dots.ts) and the browser overlay in
// LiveOperations.astro. Pure functions and constants only: no data, no DOM, so it can ship to the browser.
//
// Why one module (22 Sep 2026): the poster that shows before MapLibre loads and the dots MapLibre draws
// must be the same picture, or the map appears to jump when it fades in. Both use Web Mercator, the
// same framing box, the same grid and the same land mask.
//
// Units: "map units" are Web Mercator with the world WORLD wide (x 0..WORLD, y 0 at 85.05°N).

/** World width in map units. */
export const WORLD = 1000;
/** Antarctica and the far Arctic are cropped: nobody works there and they eat vertical space. */
export const LAT_MIN = -56;
export const LAT_MAX = 78;

export function mercX(lon: number) {
  return ((lon + 180) / 360) * WORLD;
}
export function mercY(lat: number) {
  const r = (lat * Math.PI) / 180;
  return (0.5 - Math.log(Math.tan(Math.PI / 4 + r / 2)) / (2 * Math.PI)) * WORLD;
}
export function lonOf(x: number) {
  return (x / WORLD) * 360 - 180;
}
export function latOf(y: number) {
  const n = Math.PI * (1 - (2 * y) / WORLD);
  return (Math.atan(Math.sinh(n)) * 180) / Math.PI;
}

/** The land band that carries dots (map units). The mask covers exactly this. */
export const BAND = { y0: mercY(LAT_MAX), y1: mercY(LAT_MIN) };

/** Mask raster: 1 px = WORLD / MASK_W map units (about 8 screen px at the zoom cap of 5). */
export const MASK_W = 2048;
export const MASK_H = Math.round((MASK_W * (BAND.y1 - BAND.y0)) / WORLD);

/**
 * Artistic licence (user, 17 Sep 2026): drop the far ends that float at the map edges and say nothing
 * about Reach's work — Alaska and the North Pacific islands on the left, Russia's far east
 * (Kamchatka, Chukotka) on the right. Applied in the mask, so the poster and the live map agree.
 */
export const HIDDEN = [
  { lon: [-180, -140], lat: [-90, 90] },
  { lon: [145, 180], lat: [45, 90] },
] as const;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A framing: the lon/lat the view must include, then grown to the map's aspect ratio (the CSS
 * aspect-ratio of the figure) with a margin, exactly as fitBounds would but in map units, so the
 * poster viewBox and the MapLibre camera come out identical.
 */
export interface Frame {
  aspect: number;
  lon: [number, number];
  lat: [number, number];
  /** Breathing room around the lon/lat box, as a fraction of its size. */
  margin: number;
}
export type FrameKey = 'wide' | 'tall';

export const FRAMES: Record<FrameKey, Frame> = {
  /** Desktop and tablet, 2:1: every continent Reach could work off, without the polar stretch. */
  wide: { aspect: 2, lon: [-125, 165], lat: [-50, 70], margin: 0.04 },
  /** Phones, 5:4: the Brazil–Asia band, where the regions are. */
  tall: { aspect: 5 / 4, lon: [-75, 135], lat: [-45, 66], margin: 0.04 },
};

export function frameBox(frame: Frame): Box {
  let x0 = mercX(frame.lon[0]);
  let x1 = mercX(frame.lon[1]);
  let y0 = mercY(frame.lat[1]);
  let y1 = mercY(frame.lat[0]);
  const mx = (x1 - x0) * frame.margin;
  const my = (y1 - y0) * frame.margin;
  x0 -= mx;
  x1 += mx;
  y0 -= my;
  y1 += my;
  let w = x1 - x0;
  let h = y1 - y0;
  // Contain-fit: grow the shorter axis to the aspect, keeping the centre
  if (w / h < frame.aspect) {
    const nw = h * frame.aspect;
    x0 -= (nw - w) / 2;
    w = nw;
  } else {
    const nh = w / frame.aspect;
    y0 -= (nh - h) / 2;
    h = nh;
  }
  // Never past the date line: shift back inside the world
  if (x0 < 0) x0 = 0;
  if (x0 + w > WORLD) x0 = WORLD - w;
  return { x: x0, y: y0, w, h };
}

/** Which frame a map of this size uses (must match the CSS aspect-ratio breakpoints). */
export function frameFor(width: number, height: number): FrameKey {
  return width / height > 1.6 ? 'wide' : 'tall';
}

/**
 * Dot density presets. Columns are fixed per width band, so the pitch scales with the map and the
 * poster (an SVG that scales with its box) lines up with the overlay (drawn in px) at every width.
 * `dot` is the dot diameter as a fraction of the pitch. `wide` bands are matched by container
 * queries in the block CSS; keep the `min` values and the CSS in step.
 */
export type DotPreset = 'regular' | 'fine' | 'finer';
export interface DotSpec {
  dot: number;
  wide: { min: number; cols: number }[];
  tall: number;
}
export const DOT_PRESETS: Record<DotPreset, DotSpec> = {
  regular: { dot: 0.26, wide: [{ min: 680, cols: 60 }, { min: 0, cols: 44 }], tall: 36 },
  fine: { dot: 0.24, wide: [{ min: 680, cols: 88 }, { min: 0, cols: 64 }], tall: 52 },
  finer: { dot: 0.22, wide: [{ min: 680, cols: 120 }, { min: 0, cols: 88 }], tall: 72 },
};
/** The container-query breakpoint the `wide` bands switch at (px of map width). */
export const WIDE_BREAK = 680;

export function colsFor(spec: DotSpec, frame: FrameKey, width: number) {
  if (frame === 'tall') return spec.tall;
  return spec.wide.find((b) => width >= b.min)!.cols;
}

/** Rows sit at pitch × ROW_RATIO, alternate rows offset by half a pitch: an equilateral hex lattice. */
export const ROW_RATIO = Math.sqrt(3) / 2;

/**
 * Grid points for a box `w` × `h` (any unit) with `cols` columns, as [x, y, row] with the grid anchored
 * at the box origin. The poster calls this in map units, the overlay in px: same picture.
 */
export function gridPoints(w: number, h: number, cols: number): [number, number][] {
  const pitch = w / cols;
  const rowH = pitch * ROW_RATIO;
  const out: [number, number][] = [];
  for (let row = 0; row * rowH + rowH / 2 < h; row++) {
    const y = row * rowH + rowH / 2;
    const offset = row % 2 ? pitch / 2 : 0;
    for (let col = 0; col * pitch + pitch / 2 + offset < w; col++) out.push([col * pitch + pitch / 2 + offset, y]);
  }
  return out;
}

/** Index into the mask for a map-unit point, or -1 outside the band. */
export function maskIndex(x: number, y: number) {
  if (y < BAND.y0 || y >= BAND.y1 || x < 0 || x >= WORLD) return -1;
  const col = Math.floor((x / WORLD) * MASK_W);
  const row = Math.floor(((y - BAND.y0) / (BAND.y1 - BAND.y0)) * MASK_H);
  return row * MASK_W + col;
}

/**
 * MapLibre camera that shows exactly `box` in a map `widthPx` wide (MapLibre's world is
 * 512 × 2^zoom px). The box already has the map's aspect ratio, so the height follows.
 */
export function cameraFor(box: Box, widthPx: number) {
  const zoom = Math.log2((widthPx * WORLD) / (box.w * 512));
  return { center: [lonOf(box.x + box.w / 2), latOf(box.y + box.h / 2)] as [number, number], zoom };
}
