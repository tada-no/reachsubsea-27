// Dot-matrix world map for the Live operations block, computed at build time (no client JS, no tiles).
// Natural Earth land (world-atlas) → Equal Earth projection → a grid of dots on land, emitted as ONE
// <path> of zero-length segments drawn with round caps, so thousands of dots cost one DOM node.
// World view uses 1:110m; a zoomed cluster gets its own finer grid from 1:50m for just that area.
// For WordPress, export the results once as static SVG in the theme (docs/07 §3).
import { geoContains, geoEqualEarth } from 'd3-geo';
import { feature } from 'topojson-client';
import land110 from 'world-atlas/land-110m.json';
import land50 from 'world-atlas/land-50m.json';

export const MAP_WIDTH = 1000;
/** Antarctica and the far Arctic are cropped: nobody works there and they eat vertical space. */
const LAT_MIN = -56;
const LAT_MAX = 78;
/** World grid pitch in map units. */
export const DOT_STEP = 7;

/* eslint-disable @typescript-eslint/no-explicit-any */
const landCoarse = feature(land110 as any, (land110 as any).objects.land) as any;
const landFine = feature(land50 as any, (land50 as any).objects.land) as any;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Centred on 10°E, so the edge falls in the Bering Strait and no continent is split across the edges.
 * (Was 65°E while the region list floated over the Pacific; it now has its own column, 17 Sep 2026.)
 */
export const MAP_CENTER_LON = 10;
const projection = geoEqualEarth().rotate([-MAP_CENTER_LON, 0]).fitWidth(MAP_WIDTH, { type: 'Sphere' });
const top = projection([MAP_CENTER_LON, LAT_MAX])![1];
const bottom = projection([MAP_CENTER_LON, LAT_MIN])![1];
projection.translate([projection.translate()[0], projection.translate()[1] - top]);

export const MAP_HEIGHT = Math.round(bottom - top);

/** Projects lon/lat to map units (viewBox 0 0 MAP_WIDTH MAP_HEIGHT). */
export function project(lon: number, lat: number): [number, number] {
  const [x, y] = projection([lon, lat])!;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Artistic licence (user, 17 Sep 2026): drop the far ends that float at the map edges and say nothing
 * about Reach's work — Alaska and the North Pacific islands on the left, Russia's far east
 * (Kamchatka, Chukotka) on the right. New Zealand and Oceania south of 45°N stay.
 */
function hidden(lon: number, lat: number) {
  return lon < -140 || (lon > 145 && lat > 45);
}

/**
 * Grid points outside the Equal Earth outline (the map's rounded corners) still invert to a lon/lat,
 * which can land on real land and print phantom dots in the corners. Keep a point only if projecting
 * its lon/lat again lands back on it.
 */
function onGlobe([x, y]: [number, number], lonLat: [number, number]) {
  const back = projection(lonLat);
  return !!back && Math.abs(back[0] - x) < 0.5 && Math.abs(back[1] - y) < 0.5;
}

const cache = new Map<string, string>();

/**
 * `d` for a dot path over `box` (default: the whole map) at grid pitch `step`. The grid is anchored to
 * the map origin, so a zoomed grid lines up with the world grid at the same density on screen.
 */
export function worldDotsPath(step = DOT_STEP, box: Box = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT }): string {
  const key = `${step}|${box.x}|${box.y}|${box.w}|${box.h}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const land = box.w < MAP_WIDTH ? landFine : landCoarse;
  const decimals = step < 3 ? 2 : 1;
  const parts: string[] = [];
  const row0 = Math.max(0, Math.floor(box.y / step));
  for (let row = row0; row * step + step / 2 < Math.min(MAP_HEIGHT, box.y + box.h); row++) {
    const y = row * step + step / 2;
    // Offset alternate rows by half a step: a hex-ish grid reads less like graph paper
    const offset = row % 2 ? step / 2 : 0;
    const col0 = Math.max(0, Math.floor((box.x - offset) / step));
    for (let col = col0; col * step + step / 2 + offset < Math.min(MAP_WIDTH, box.x + box.w); col++) {
      const x = col * step + step / 2 + offset;
      const lonLat = projection.invert!([x, y]);
      if (lonLat && onGlobe([x, y], lonLat) && !hidden(lonLat[0], lonLat[1]) && geoContains(land, lonLat)) parts.push(`M${x.toFixed(decimals)} ${y.toFixed(decimals)}h0`);
    }
  }
  const d = parts.join('');
  cache.set(key, d);
  return d;
}

/** The world view: the extent of the visible land dots plus a margin, so trimmed edges don't leave empty bands. */
export const WORLD_BOX: Box = (() => {
  const xs = [...worldDotsPath().matchAll(/M([\d.]+) /g)].map((m) => Number(m[1]));
  const margin = DOT_STEP * 2;
  const x = Math.max(0, Math.min(...xs) - margin);
  const w = Math.min(MAP_WIDTH, Math.max(...xs) + margin) - x;
  return { x: Math.round(x), y: 0, w: Math.round(w), h: MAP_HEIGHT };
})();
