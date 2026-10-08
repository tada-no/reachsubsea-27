// Newsroom import (8 Oct 2026). Pulls every post from the live site's REST API into src/data/news-posts.json and
// writes the redirect map docs/extract/news-redirects.csv. The Newsroom prototype renders from that file, so the
// archive and every single show the content that will actually be migrated.
//
// It is also the migration spec: each clean-up step below is something the WordPress import has to do (WP-CLI
// search-replace, a migration plugin or a one-off script). docs/09 §News lists them for the developer.
//
// Usage: node scripts/import-news.mjs   (re-run any time; the output is rebuilt from scratch)
import fs from 'node:fs';
import { parse, ELEMENT_NODE, TEXT_NODE } from 'ultrahtml';

const SITE = 'https://reachsubsea.no';
const OUT = new URL('../src/data/news-posts.json', import.meta.url);
const REDIRECTS = new URL('../docs/extract/news-redirects.csv', import.meta.url);
// Real dates for the bulk-imported posts (Q146): matched to Oslo Børs Newsweb releases by text and title, or estimated
// from a date in the text or the month of the post's own images. Built once from the Newsweb API, reviewed by hand
const DATES = JSON.parse(fs.readFileSync(new URL('./news-dates.json', import.meta.url), 'utf8'));

// ── Fetch ──────────────────────────────────────────────────────────────────────────────────────────
async function getAll(path) {
  const out = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${SITE}/wp-json/wp/v2/${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    if (!res.ok) break;
    const rows = await res.json();
    out.push(...rows);
    if (page >= Number(res.headers.get('x-wp-totalpages') ?? 1)) break;
  }
  return out;
}

const categories = await getAll('categories');
const catSlug = Object.fromEntries(categories.map((c) => [c.id, c.slug]));
const raw = await getAll('posts?_embed=wp:featuredmedia');
const postSlugs = new Set(raw.map((p) => p.slug));

// ── Text helpers ───────────────────────────────────────────────────────────────────────────────────
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', aring: 'å', Aring: 'Å', oslash: 'ø', Oslash: 'Ø', aelig: 'æ', AElig: 'Æ', eacute: 'é', ouml: 'ö', auml: 'ä', uuml: 'ü' };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n] ?? m);
const stripTags = (s) => s.replace(/<[^>]+>/g, ' ');
const plain = (html) => decode(stripTags(html)).replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Datelines open most releases: "Haugesund, 04 August 2026 –", "Haugesund, 13th March 2023:", "Haugesund, 26.08.2025 –"
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const DATELINE = new RegExp(
  String.raw`(?:(Haugesund|Oslo|Bergen|Stavanger|Aberdeen|Stockholm),\s*)?(?:(\d{1,2})(?:st|nd|rd|th)?\.?\s+(${MONTHS.join('|')}),?\s+(20\d\d)|(\d{1,2})\.(\d{1,2})\.(20\d\d))\s*(?:[:–—-]\s*)?`,
  'gi',
);
// Searched in the opening 300 characters: some releases repeat their title before the dateline. A date only counts
// with its place ("Haugesund, …") or as the very first words: "…the release of 12.06.2017, where…" refers back.
function datelineOf(text) {
  const m = [...text.slice(0, 300).matchAll(DATELINE)].find((hit) => hit[1] || hit.index === 0);
  if (!m) return null;
  const [y, mo, d] = m[4] ? [m[4], MONTHS.indexOf(m[3].toLowerCase()) + 1, m[2]] : [m[7], m[6], m[5]];
  return { iso: `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`, end: m.index + m[0].length };
}

// ── Links ──────────────────────────────────────────────────────────────────────────────────────────
function fixHref(href) {
  let url = decode(href.trim());
  // Outlook "safe links" pasted from email: the real URL is the url= parameter
  const safe = url.match(/safelinks\.protection\.outlook\.com\/\?url=([^&]+)/);
  if (safe) url = decodeURIComponent(safe[1]);
  // One host for the old site, https
  url = url.replace(/^https?:\/\/(?:www\.)?reachsubsea\.(?:no|com)(?=\/|$)/i, SITE);
  // A link to another post goes to its new Newsroom URL
  const post = url.match(new RegExp(`^${SITE}/([^/?#]+)/?$`));
  if (post && postSlugs.has(post[1])) return `/newsroom/${post[1]}/`;
  return url;
}

// ── Content clean-up ───────────────────────────────────────────────────────────────────────────────
// An allowlist: what the article styles cover (.article in base.css) survives, everything else is unwrapped.
// Classes, inline styles and ids go; block wrappers (group, columns, column) unwrap to their content.
const DROP = new Set(['script', 'style', 'object', 'noscript', 'svg', 'button', 'input', 'form', 'meta', 'link']);
const KEEP = new Set(['strong', 'em', 'sup', 'sub', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'cite', 'figcaption']);
const RENAME = { b: 'strong', i: 'em' };
const cls = (n) => ` ${n.attributes?.class ?? ''} `;
const has = (n, c) => cls(n).includes(` ${c} `);
const find = (n, test) => {
  if (test(n)) return n;
  for (const c of n.children ?? []) {
    const hit = find(c, test);
    if (hit) return hit;
  }
  return null;
};
const findAll = (n, test, acc = []) => {
  if (test(n)) acc.push(n);
  for (const c of n.children ?? []) findAll(c, test, acc);
  return acc;
};
const isEl = (name) => (n) => n.type === ELEMENT_NODE && n.name === name;

function img(n) {
  const src = n.attributes.src;
  if (!src) return '';
  const w = n.attributes.width ? ` width="${n.attributes.width}"` : '';
  const h = n.attributes.height ? ` height="${n.attributes.height}"` : '';
  return `<img src="${esc(src)}" alt="${esc(decode(n.attributes.alt ?? ''))}"${w}${h} loading="lazy" decoding="async">`;
}
function iframe(n) {
  const title = n.attributes.title ? esc(decode(n.attributes.title)) : 'Embedded video';
  return `<figure class="article-embed"><iframe src="${esc(n.attributes.src ?? '')}" title="${title}" loading="lazy" allowfullscreen></iframe></figure>`;
}
const children = (n) => (n.children ?? []).map(clean).join('');

function clean(n) {
  if (n.type === TEXT_NODE) return n.value.replace(/&nbsp;| /g, ' ');
  if (n.type !== ELEMENT_NODE) return n.children ? children(n) : '';
  const name = n.name.toLowerCase();
  if (DROP.has(name)) return '';

  // Block types first: they are wrappers whose class says what they are
  if (has(n, 'wp-block-file')) {
    const a = find(n, (c) => isEl('a')(c) && !has(c, 'wp-block-file__button') && c.attributes.href);
    return a ? `<p class="article-file"><a href="${esc(fixHref(a.attributes.href))}">${plain(children(a)) || 'Download'}</a></p>` : '';
  }
  if (has(n, 'wp-block-buttons')) {
    const links = findAll(n, (c) => isEl('a')(c) && c.attributes.href);
    return links.length ? `<ul class="article-links">${links.map((a) => `<li><a href="${esc(fixHref(a.attributes.href))}">${plain(children(a))}</a></li>`).join('')}</ul>` : '';
  }
  if (has(n, 'wp-block-pgcsimplygalleryblock-slider')) {
    // A gallery plugin (2 posts): its images live in a JSON script. They become a plain image gallery
    const data = find(n, (c) => isEl('script')(c) && has(c, 'sgb-data'));
    const json = data ? JSON.parse(data.children.map((c) => c.value).join('')) : { images: [] };
    const imgs = (json.images ?? []).map((i) => `<img src="${esc(i.url)}" alt="${esc(i.alt ?? '')}" width="${i.width}" height="${i.height}" loading="lazy" decoding="async">`);
    return imgs.length ? `<figure class="article-gallery">${imgs.join('')}</figure>` : '';
  }
  if (name === 'figure' || has(n, 'wp-block-embed')) {
    const frame = find(n, isEl('iframe'));
    if (frame) return iframe(frame);
    const table = find(n, isEl('table'));
    if (table) return `<figure class="article-table">${clean(table)}</figure>`;
    const image = find(n, isEl('img'));
    if (!image) return children(n);
    const cap = find(n, isEl('figcaption'));
    const caption = cap ? plain(children(cap)) : '';
    return `<figure>${img(image)}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
  }

  switch (name) {
    case 'iframe':
      return iframe(n);
    case 'img':
      return `<figure>${img(n)}</figure>`;
    case 'hr':
      return '<hr>';
    case 'br':
      return '<br>';
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
      // One subheading level in an article (the live posts mix h2–h5 for the same job); no bold inside it
      const text = plain(children(n));
      return text ? `<h2>${esc(text)}</h2>` : '';
    }
    case 'p': {
      // A paragraph that only holds an image (classic-editor posts) is a figure
      const only = (n.children ?? []).filter((c) => !(c.type === TEXT_NODE && !c.value.replace(/&nbsp;| /g, '').trim()) && !isEl('br')(c));
      if (only.length === 1 && (isEl('img')(only[0]) || (isEl('a')(only[0]) && find(only[0], isEl('img'))))) {
        return `<figure>${img(find(only[0], isEl('img')))}</figure>`;
      }
      const inner = children(n).replace(/^(\s|<br>)+|(\s|<br>)+$/g, '');
      return plain(inner) || inner.includes('<img') ? `<p>${inner}</p>` : '';
    }
    case 'blockquote':
      return `<blockquote>${children(n)}</blockquote>`;
    case 'a': {
      const inner = children(n);
      if (!n.attributes.href) return inner;
      return `<a href="${esc(fixHref(n.attributes.href))}">${inner}</a>`;
    }
    case 'td': case 'th': {
      const span = n.attributes.colspan ? ` colspan="${n.attributes.colspan}"` : '';
      return `<${name}${span}>${children(n)}</${name}>`;
    }
  }
  const tag = RENAME[name] ?? name;
  if (KEEP.has(tag)) {
    const inner = children(n);
    // Empty inline wrappers (a stray <strong> </strong>) go
    if ((tag === 'strong' || tag === 'em') && !inner.trim()) return inner;
    return `<${tag}>${inner}</${tag}>`;
  }
  // div, span, section, column wrappers…: keep the content, lose the wrapper
  return children(n);
}

function tidy(html) {
  return html
    .replace(/(<br>\s*){2,}/g, '<br>')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<(strong|em)>(\s*)<\/\1>/g, '$2')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

// File stem of an upload, without WordPress's size and -scaled suffixes, to spot the featured image repeated
const stem = (url) => (url ?? '').split('/').pop().replace(/\.[a-z]+$/i, '').replace(/(-\d+x\d+|-scaled)+$/i, '').toLowerCase();

// ── Build ──────────────────────────────────────────────────────────────────────────────────────────
const report = { posts: raw.length, leads: 0, importDate: 0, newsweb: 0, estimated: 0, datelineRecovered: 0, undated: [], noImage: 0, safelinks: 0, postLinks: 0, duplicateLeadImage: 0 };
const importStamps = new Map();
for (const p of raw) importStamps.set(p.date.slice(0, 16), (importStamps.get(p.date.slice(0, 16)) ?? 0) + 1);
// A minute shared by more than 10 posts is a bulk import, not a publication date
const bulkStamps = new Set([...importStamps].filter(([, n]) => n > 10).map(([d]) => d));

const posts = raw.map((p) => {
  const media = p._embedded?.['wp:featuredmedia']?.[0];
  const sizes = media?.media_details?.sizes ?? {};
  const image = media?.source_url
    ? {
        card: (sizes.medium_large ?? sizes.large ?? sizes.full)?.source_url ?? media.source_url,
        large: (sizes['1536x1536'] ?? sizes.large ?? sizes.full)?.source_url ?? media.source_url,
        width: media.media_details?.width ?? null,
        height: media.media_details?.height ?? null,
        alt: decode(media.alt_text ?? ''),
      }
    : null;
  if (!image) report.noImage++;

  report.safelinks += (p.content.rendered.match(/safelinks\.protection/g) ?? []).length;
  let content = tidy(clean(parse(p.content.rendered)));
  report.postLinks += (content.match(/href="\/newsroom\//g) ?? []).length;

  // The featured image repeated as the first thing in the body: the single shows it once
  const first = content.match(/^<figure><img src="([^"]+)"[^>]*>(?:<figcaption>[^<]*<\/figcaption>)?<\/figure>\s*/);
  if (first && image && stem(first[1]) === stem(image.large)) {
    content = content.slice(first[0].length);
    report.duplicateLeadImage++;
  }

  // Lead paragraph (Q147): a story of four paragraphs or more opens with its summary set larger, in navy. In WordPress
  // the import gives that first Paragraph the "Lead" block style (is-style-lead); short posts stay as written
  // The lead must be a real opening sentence (15+ words, ending a sentence): old posts open with a title repeat, a
  // heading typed as a paragraph ("HIGHLIGHTS 4TH QUARTER") or a sentence broken across paragraphs, and those get no
  // lead. A bare dateline first ("Haugesund, 31 March 2023") stays above it as it is
  if ((content.match(/<p>/g) ?? []).length >= 4) {
    const paras = [...content.matchAll(/<p>([\s\S]*?)<\/p>/g)];
    const words = (m) => plain(m[1]).split(' ').filter(Boolean);
    const isDateline = (m) => words(m).length <= 6 && datelineOf(plain(m[1]))?.end >= plain(m[1]).length - 1;
    const lead = isDateline(paras[0]) ? paras[1] : paras[0];
    if (lead && words(lead).length >= 15 && /[.!?”"]$/.test(plain(lead[1]))) {
      // Bold goes (Q152): the lead is already larger and navy, and nine posts bolded all of it or its dateline
      const inner = lead[1].replace(/<\/?strong>/g, '');
      content = content.slice(0, lead.index) + `<p class="article-lead">${inner}</p>` + content.slice(lead.index + lead[0].length);
      report.leads++;
    }
  }

  const text = plain(content);
  const dateline = datelineOf(text);
  let date = p.date.slice(0, 10);
  let dateSource = 'post';
  if (bulkStamps.has(p.date.slice(0, 16))) {
    report.importDate++;
    const known = DATES[p.slug];
    if (known) {
      date = known.date;
      dateSource = known.source;
      report[known.source === 'newsweb' ? 'newsweb' : 'estimated']++;
    } else if (dateline) {
      date = dateline.iso;
      dateSource = 'dateline';
      report.datelineRecovered++;
    } else {
      dateSource = 'undated';
      report.undated.push(plain(p.title.rendered));
    }
  }

  // The card's summary: the text after the dateline (the card shows the date already; anything before it repeats the title)
  const body = dateline ? text.slice(dateline.end) : text;
  const cut = body.length > 240 ? `${body.slice(0, 240).replace(/\s+\S*$/, '').replace(/[\s.,;:–—-]+$/, '')}…` : body;
  const words = text.split(' ').filter(Boolean).length;

  return {
    id: p.id,
    slug: p.slug,
    title: plain(p.title.rendered),
    date,
    dateSource,
    categories: p.categories.map((id) => catSlug[id]).filter(Boolean),
    excerpt: cut.charAt(0).toUpperCase() + cut.slice(1),
    readMinutes: Math.max(1, Math.ceil(words / 200)),
    image,
    oldUrl: p.link,
    content,
  };
});

// ── Images: many are already broken on the live site ────────────────────────────────────────────────
// Body images 404 where a size was regenerated or deleted, and the old imgix CDN answers 410. Try the same file
// on the site itself and the original upload without its size suffix; an image still missing is dropped from the
// post (its figure goes) and counted, so the migration can restore it from a backup if one exists.
const alive = new Map();
async function ok(url) {
  if (!alive.has(url)) {
    alive.set(url, fetch(url, { method: 'HEAD' }).then((r) => r.ok && (r.headers.get('content-type') ?? '').startsWith('image/')).catch(() => false));
  }
  return alive.get(url);
}
function candidates(src) {
  const url = decode(src).replace(/^https?:\/\/reachsubsea\.imgix\.net(\/wp-content\/uploads\/[^?]+).*$/, `${SITE}$1`);
  const original = url.replace(/-(\d+x\d+)(\.[a-z]+)$/i, '$2').replace(/-e\d{10,}(\.[a-z]+)$/i, '$1');
  return [...new Set([url, original, original.replace(/-scaled(\.[a-z]+)$/i, '$1')])];
}
async function resolve(src) {
  if (src.startsWith('data:')) return null;
  for (const url of candidates(src)) if (await ok(url)) return url;
  return null;
}
async function mapLimit(items, n, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += n) out.push(...(await Promise.all(items.slice(i, i + n).map(fn))));
  return out;
}
const srcs = [...new Set(posts.flatMap((p) => [...p.content.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1])))];
const fixed = new Map(srcs.map((s, i) => [s, null]));
(await mapLimit(srcs, 12, resolve)).forEach((url, i) => fixed.set(srcs[i], url));
report.bodyImages = srcs.length;
report.bodyImagesRecovered = srcs.filter((s) => fixed.get(s) && fixed.get(s) !== decode(s)).length;
report.bodyImagesMissing = srcs.filter((s) => !fixed.get(s)).length;
report.postsWithMissingImages = [];
for (const p of posts) {
  let missing = 0;
  p.content = p.content
    .replace(/<img src="([^"]+)"([^>]*)>/g, (_, src, rest) => {
      const url = fixed.get(src);
      if (!url) {
        missing++;
        return '';
      }
      return `<img src="${esc(url)}"${rest}>`;
    })
    // A figure left with no image (or only its caption) goes; so does a gallery left with one image or none
    .replace(/<figure>(?:<figcaption>[^<]*<\/figcaption>)?<\/figure>/g, '')
    .replace(/<figure class="article-gallery"><\/figure>/g, '')
    .replace(/<figure class="article-gallery">(<img [^>]+>)<\/figure>/g, '<figure>$1</figure>')
    .replace(/<p>\s*<\/p>/g, '');
  if (missing) report.postsWithMissingImages.push(`${p.slug} (${missing})`);
  if (p.image) {
    const card = await resolve(p.image.card);
    const large = await resolve(p.image.large);
    if (!card && !large) {
      report.featuredMissing = (report.featuredMissing ?? 0) + 1;
      p.image = null;
    } else p.image = { ...p.image, card: card ?? large, large: large ?? card };
  }
}

// Newest first; undated posts last, in the old site's order (higher id = later)
posts.sort((a, b) => (a.dateSource === 'undated') - (b.dateSource === 'undated') || b.date.localeCompare(a.date) || b.id - a.id);

fs.writeFileSync(OUT, `${JSON.stringify(posts, null, 1)}\n`);
const csv = ['old_url,new_url', ...posts.map((p) => `${p.oldUrl},/newsroom/${p.slug}/`), `${SITE}/news/,/newsroom/`, `${SITE}/category/news/,/newsroom/category/news/`, `${SITE}/category/reports/,/newsroom/category/reports/`];
fs.writeFileSync(REDIRECTS, `${csv.join('\n')}\n`);

console.log(`${posts.length} posts → ${OUT.pathname} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
console.log(report);
console.log('Categories:', Object.fromEntries(categories.filter((c) => c.count).map((c) => [c.slug, c.count])));
