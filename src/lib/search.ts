// Site search ranking (9 Oct 2026, Q158), run in the browser over /search-index.json for the prototype. WordPress does
// the same server-side (Relevanssi or SearchWP weights, docs/09): this file is the reference for how results rank.
//
// A word matches from the start of a word ("rov" finds "ROVs", not "improve"), accents folded ("hogheim" finds
// "Høgheim"). Every word must match somewhere (AND); if nothing matches all of them, the best partial matches show
// instead and the page says so. Weights: whole query in the title 20, each word in the title 12 (16 at its start),
// aliases 8, excerpt 3, context 2, body keywords 2. Pages, the fleet, people and reports rank a little above stories
// of the same score (news is the largest and noisiest type); then newest.
import type { SearchEntry, SearchType } from '../data/search';

export interface SearchHit extends SearchEntry {
  score: number;
  /** Every query word matched (false in the partial fallback). */
  all: boolean;
  /** The excerpt to show: the entry's own, or a window of its keywords around the match when only those matched. */
  snippet: string;
}

const STOP = new Set(['a', 'an', 'and', 'the', 'of', 'in', 'on', 'for', 'to', 'with', 'is', 'at', 'by', 'or', 'our', 'we', 'og', 'i', 'på', 'av']);
const BOOST: Partial<Record<SearchType, number>> = { page: 1.25, asset: 1.15, person: 1.15, report: 1.1, news: 0.9 };

export const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ø/gi, 'o')
    .replace(/æ/gi, 'ae')
    .toLowerCase();

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Query words, folded; stop words dropped unless they are all there is. A plural "s" comes off ("reports" →
 * "report"), and as every word matches from a word's start, "report" still finds "reports". */
export function terms(query: string): string[] {
  const words = fold(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const kept = words.filter((w) => !STOP.has(w));
  return [...new Set((kept.length ? kept : words).map((w) => (w.length > 3 && /[^s]s$/.test(w) ? w.slice(0, -1) : w)))];
}

const wordStart = (t: string) => new RegExp(`(^|[^a-z0-9])${escape(t)}`);

function snippetFrom(text: string, t: string[]): string {
  const folded = fold(text);
  const at = t.map((w) => folded.search(wordStart(w))).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, text.lastIndexOf(' ', Math.max(0, at - 60)));
  const out = text.slice(start, start + 220).trim();
  return `${start > 0 ? '…' : ''}${out}${start + 220 < text.length ? '…' : ''}`;
}

export function search(index: SearchEntry[], query: string): { hits: SearchHit[]; partial: boolean } {
  const t = terms(query);
  if (t.length === 0) return { hits: [], partial: false };
  const phrase = t.join(' ');
  const scored: SearchHit[] = [];
  for (const entry of index) {
    const title = fold(entry.title);
    const fields = {
      aliases: fold(entry.aliases ?? ''),
      keywords: fold(entry.keywords ?? ''),
      excerpt: fold(entry.excerpt),
      context: fold(entry.context ?? ''),
    };
    let score = title.includes(phrase) ? 20 : 0;
    let matched = 0;
    let inExcerpt = false;
    for (const w of t) {
      const re = wordStart(w);
      let s = 0;
      if (re.test(title)) s += title.startsWith(w) ? 16 : 12;
      if (re.test(fields.excerpt)) {
        s += 3;
        inExcerpt = true;
      }
      if (re.test(fields.aliases)) s += 8;
      if (re.test(fields.keywords)) s += 2;
      if (re.test(fields.context)) s += 2;
      if (s > 0) matched += 1;
      score += s;
    }
    if (matched === 0) continue;
    // Matched only in a story's body: show the sentence around the match instead of an excerpt that doesn't say it
    const bodyOnly = !inExcerpt && !t.some((w) => wordStart(w).test(title)) && t.some((w) => wordStart(w).test(fields.keywords));
    scored.push({
      ...entry,
      score: score * (BOOST[entry.type] ?? 1) * (matched / t.length),
      all: matched === t.length,
      snippet: bodyOnly && entry.keywords ? snippetFrom(entry.keywords, t) : entry.excerpt,
    });
  }
  const byRank = (a: SearchHit, b: SearchHit) => b.score - a.score || (b.date ?? '').localeCompare(a.date ?? '');
  const all = scored.filter((h) => h.all).sort(byRank);
  if (all.length || t.length === 1) return { hits: all, partial: false };
  return { hits: scored.sort(byRank), partial: true };
}

// Old-site paths: generic parts to drop, and the Norwegian words its /no/ pages used
const GENERIC = new Set(['no', 'en', 'page', 'category', 'tag', 'wp', 'content', 'uploads', 'index', 'html', 'php', 'pdf', 'www', 'reachsubsea', 'reach', 'subsea']);
const NORWEGIAN: Record<string, string> = {
  kontakt: 'contact',
  karriere: 'careers',
  jobb: 'careers',
  nyheter: 'news',
  tjenester: 'services',
  prosjekter: 'projects',
  fartoy: 'vessels',
  investor: 'investors',
  baerekraft: 'sustainability',
  ledelse: 'leadership',
};

/** Words worth searching for in a broken path, most specific first: the last part on its own, then the whole path.
 * "/company/assets/olympic-zeus-2/" → ["olympic zeus", "company assets olympic zeus"]. Drops the language prefix,
 * numbers-only parts, file endings and generic words, and turns the old /no/ pages' Norwegian into English. */
export function termsFromPath(path: string): string[] {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    // keep the raw path
  }
  // Years count in the last part ("annual-report-2021"), not in folders ("uploads/2023/03")
  const words = (part: string, years = false) =>
    fold(part.replace(/\.[a-z0-9]{2,4}$/i, '').replace(/om-oss/gi, 'about'))
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 1 && (years ? !/^\d+$/.test(w) || /^(19|20)\d\d$/.test(w) : !/^\d+$/.test(w)) && !GENERIC.has(w))
      .map((w) => NORWEGIAN[w] ?? w);
  const parts = decoded.split('/').filter((p) => words(p, true).length > 0);
  const last = words(parts.at(-1) ?? '', true).join(' ');
  const all = [...new Set([...parts.slice(0, -1).flatMap((p) => words(p)), ...words(parts.at(-1) ?? '', true)])].slice(-6).join(' ');
  return [...new Set([last, all])].filter(Boolean);
}

/** Wraps each word the query matched (from its start to its end) in <mark>, on an escaped copy of the text. */
export function highlight(text: string, t: string[]): string {
  const safe = text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  if (t.length === 0) return safe;
  const folded = fold(safe);
  // Folding can change length (æ → ae); mark only when it doesn't, rather than mis-mark
  if (folded.length !== safe.length) return safe;
  const pattern = new RegExp(`(^|[^a-z0-9&;])((?:${t.map(escape).join('|')})[a-z0-9]*)`, 'g');
  let out = '';
  let last = 0;
  for (const m of folded.matchAll(pattern)) {
    const start = (m.index ?? 0) + m[1].length;
    const end = start + m[2].length;
    out += safe.slice(last, start) + '<mark>' + safe.slice(start, end) + '</mark>';
    last = end;
  }
  return out + safe.slice(last);
}

/** A site path as this build serves it (GitHub Pages lives under a base path; files and other sites pass through). */
export function withBase(url: string, base: string): string {
  return url.startsWith('/') && !url.startsWith('//') ? `${base.replace(/\/$/, '')}${url}` : url;
}
