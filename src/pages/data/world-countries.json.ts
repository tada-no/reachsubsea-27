// World countries for the Live operations map (MapLibre prototype, 17 Sep 2026). Natural Earth 1:110m
// from world-atlas, built to a static GeoJSON file (~45 KB gzipped) and fetched only when the map loads.
// Coordinates rounded to 0.01°, no properties, Antarctica dropped. Production on Mapbox would use the
// dev site's vector-tile style instead and not need this file (docs/07 §3).
import type { APIRoute } from 'astro';
import { feature } from 'topojson-client';
import countries110 from 'world-atlas/countries-110m.json';

type Coords = number | Coords[];
const round = (c: Coords): Coords =>
  Array.isArray(c) && typeof c[0] === 'number'
    ? (c as number[]).map((v) => Math.round(v * 100) / 100)
    : (c as Coords[]).map(round);

// d3/topojson emit clockwise outer rings; RFC 7946 (and MapLibre's tiler, which uses winding to tell holes
// from shells) wants outer rings counter-clockwise. Unfixed, big shapes (Russia, Greenland) fill whole tiles.
type Ring = [number, number][];
const signedArea = (ring: Ring) => ring.reduce((a, [x1, y1], i) => {
  const [x2, y2] = ring[(i + 1) % ring.length];
  return a + (x1 * y2 - x2 * y1);
}, 0) / 2;
const orient = (ring: Ring, ccw: boolean) => ((signedArea(ring) > 0) === ccw ? ring : [...ring].reverse());
// Russia and Fiji have rings that jump from +180° to −180°, which draws a band across the whole map.
// Unwrap them: carry the western part on past 180° (MapLibre renders longitudes > 180 fine).
const unwrap = (ring: Ring): Ring => {
  const xs = ring.map(([x]) => x);
  return Math.max(...xs) - Math.min(...xs) > 180 ? ring.map(([x, y]) => [x < 0 ? x + 360 : x, y]) : ring;
};
const rewindPolygon = (rings: Ring[]) => rings.map((ring, i) => orient(unwrap(ring), i === 0));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rewind = (g: any) =>
  g.type === 'Polygon'
    ? { ...g, coordinates: rewindPolygon(g.coordinates) }
    : g.type === 'MultiPolygon'
      ? { ...g, coordinates: g.coordinates.map(rewindPolygon) }
      : g;

export const GET: APIRoute = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fc = feature(countries110 as any, (countries110 as any).objects.countries) as any;
  const body = {
    type: 'FeatureCollection',
    features: fc.features
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((f: any) => f.properties?.name !== 'Antarctica')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((f: any) => ({ type: 'Feature', properties: {}, geometry: rewind({ type: f.geometry.type, coordinates: round(f.geometry.coordinates) }) })),
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
};
