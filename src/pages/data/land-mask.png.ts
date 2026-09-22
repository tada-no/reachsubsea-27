// The land mask for the Live operations map overlay (docs/07 §3): a 2-colour PNG of Natural Earth
// 1:50m land in Web Mercator, LAT_MIN..LAT_MAX, with the hidden far ends removed. About 25 KB.
// Built once by src/lib/world-dots.ts, which also uses it for the static poster, so both agree.
import type { APIRoute } from 'astro';
import { landMask } from '../../lib/world-dots';

export const GET: APIRoute = async () => {
  const { png } = await landMask();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};
