// The site search index (src/data/search.ts) as one JSON file, fetched by the Search results and 404 templates.
// In WordPress there is no file: search.php runs the query server-side (docs/09).
import type { APIRoute } from 'astro';
import { searchIndex } from '../data/search';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(searchIndex), { headers: { 'Content-Type': 'application/json' } });
