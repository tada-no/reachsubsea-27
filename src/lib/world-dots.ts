// Dot-matrix world map for the Live operations block, computed at build time. Server only (sharp,
// world-atlas): the maths it shares with the browser overlay lives in dot-map.ts.
//
// Land mask: Natural Earth 1:50m land (world-atlas) → Web Mercator → rasterised once with sharp to a
// MASK_W × MASK_H bitmap of the LAT_MIN..LAT_MAX band. The poster tests its grid points against this
// mask, and the same bitmap is served as /data/land-mask.png for the overlay MapLibre draws, so a dot
// is either whole or absent in both: nothing is clipped at a coastline (22 Sep 2026, replaces the
// fill-pattern land that cut dots into segments).
//
// Poster: ONE <path> of zero-length segments drawn with round caps, so thousands of dots cost one DOM
// node. For WordPress, export the paths once as static SVG in the theme (docs/07 §3).
import sharp from 'sharp';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import land50 from 'world-atlas/land-50m.json';
import {
  BAND,
  DOT_PRESETS,
  FRAMES,
  HIDDEN,
  MASK_H,
  MASK_W,
  WORLD,
  colsFor,
  frameBox,
  gridPoints,
  maskIndex,
  mercX,
  mercY,
  type Box,
  type DotPreset,
  type FrameKey,
} from './dot-map';

export { frameBox, FRAMES, WORLD } from './dot-map';

/* eslint-disable @typescript-eslint/no-explicit-any */
const land = feature(land50 as any, (land50 as any).objects.land) as any;
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Map units → mask px. */
const px = (v: number) => (v / WORLD) * MASK_W;

function landSvg() {
  // d3's Mercator: y = -ln(tan(π/4 + φ/2)) · k + ty. Match mercY() with k = MASK_W / 2π.
  const k = MASK_W / (2 * Math.PI);
  const projection = geoMercator()
    .scale(k)
    .translate([MASK_W / 2, MASK_W / 2 - px(BAND.y0)]);
  const d = geoPath(projection).digits(1)(land);
  const hidden = HIDDEN.map((h) => {
    const x0 = px(mercX(h.lon[0]));
    const x1 = px(mercX(h.lon[1]));
    const y0 = Math.max(0, px(mercY(h.lat[1]) - BAND.y0));
    const y1 = Math.min(MASK_H, px(mercY(h.lat[0]) - BAND.y0));
    return `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="black"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MASK_W}" height="${MASK_H}"><rect width="${MASK_W}" height="${MASK_H}" fill="black"/><path d="${d}" fill="white"/>${hidden}</svg>`;
}

let maskPromise: Promise<{ bits: Uint8Array; png: Buffer }> | undefined;

/** The land mask: one byte per pixel (1 = land) for the poster, and the PNG served to the browser. */
export function landMask() {
  maskPromise ??= (async () => {
    const image = sharp(Buffer.from(landSvg()), { density: 72 });
    const [raw, png] = await Promise.all([
      image.clone().greyscale().raw().toBuffer({ resolveWithObject: true }),
      image.clone().greyscale().png({ palette: true, colours: 2, compressionLevel: 9 }).toBuffer(),
    ]);
    const bits = new Uint8Array(raw.info.width * raw.info.height);
    for (let i = 0; i < bits.length; i++) bits[i] = raw.data[i] > 127 ? 1 : 0;
    return { bits, png };
  })();
  return maskPromise;
}

export interface Poster {
  frame: FrameKey;
  /** Width band this variant is for (px of map width, `wide` frames only). */
  min: number;
  box: Box;
  cols: number;
  /** Stroke width in map units (the dot diameter). */
  dot: number;
  d: string;
}

const cache = new Map<string, Poster>();

/**
 * Poster variants for a density preset: one per `wide` width band plus one `tall`. The block shows
 * one of them through container and media queries; the overlay picks the same one from the map size.
 */
export async function posters(preset: DotPreset): Promise<Poster[]> {
  const spec = DOT_PRESETS[preset];
  const { bits } = await landMask();
  const variants: { frame: FrameKey; min: number }[] = [...spec.wide.map((b) => ({ frame: 'wide' as const, min: b.min })), { frame: 'tall', min: 0 }];
  return variants.map(({ frame, min }) => {
    const key = `${preset}|${frame}|${min}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const box = frameBox(FRAMES[frame]);
    const cols = colsFor(spec, frame, min);
    const pitch = box.w / cols;
    const parts: string[] = [];
    for (const [gx, gy] of gridPoints(box.w, box.h, cols)) {
      const i = maskIndex(box.x + gx, box.y + gy);
      if (i >= 0 && bits[i]) parts.push(`M${(box.x + gx).toFixed(1)} ${(box.y + gy).toFixed(1)}h0`);
    }
    const poster: Poster = { frame, min, box, cols, dot: Math.round(pitch * spec.dot * 100) / 100, d: parts.join('') };
    cache.set(key, poster);
    return poster;
  });
}
