// Story body clean-up (8 Oct 2026, Q153): the second pass over a post's HTML, after scripts/import-news.mjs has cleaned
// the markup. It fixes what the live posts typed by hand, which the article styles can't space well:
//   1. "-ENDS-" markers and stray "TILBAKE" (Norwegian "back") lines go
//   2. paragraphs joined with <br>: split where a sentence ends, and "• a<br>• b" runs become a list
//   3. labels typed as paragraphs ("2Q 2026 highlights:", "QUARTERLY PRESENTATION", "Key terms:" over a list) become
//      headings, so they get a heading's space
//   4. the press boilerplate at the end (contacts, "About Reach Subsea", the disclosure notice) is wrapped in
//      <div class="article-boilerplate"> and set small, apart from the story
//   5. a heading or label left last with nothing under it ("For further information, please contact:") goes
//   6. valid markup (8 Oct 2026, Q143 HTML validator): an email or www. address typed without its scheme gets mailto: or
//      https://, other links whose href isn't a URL (a date typed into the link field) are unwrapped, and a body whose tags don't balance (unclosed <div>, <p> inside <em>, a link inside a link) is
//      re-serialised by an HTML5 parser, as a browser would read it. Bodies that are already valid stay byte for byte
// Each is a migration step too (docs/09 §News). Idempotent: running it twice changes nothing.
// Usage: node scripts/news-cleanup.mjs   (applies it to src/data/news-posts.json and prints what changed)
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseFragment, serialize } from 'parse5';

const plain = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const words = (t) => t.split(' ').filter(Boolean).length;
const MONTH = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b|\b\d{1,2}\.\d{1,2}\.\d{2,4}\b/i;
const ENDS = /^[-–—\s]*ENDS?[-–—\s]*$/i;

// Where the boilerplate starts: the contact line, "About Reach Subsea", the Oslo Børs disclosure notice
const BOILERPLATE = /^(for (more|further) information,? (please )?contact|contacts?( information)?:|about reach subsea\b|this information is (subject|published))/i;

// ALL CAPS labels to sentence case, keeping the names that are capitalised anyway
const KEEP = { REACH: 'Reach', SUBSEA: 'Subsea', ASA: 'ASA', OCTIO: 'OCTIO', ROV: 'ROV', ROVS: 'ROVs', USV: 'USV', IMR: 'IMR', CEO: 'CEO', CFO: 'CFO' };
const sentenceCase = (t) =>
  t
    .toLowerCase()
    .split(' ')
    .map((w, i) => KEEP[w.toUpperCase()] ?? (/^q\d$|^\dq$/.test(w) ? w.toUpperCase() : i === 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
const isCaps = (t) => /[A-Z]{3}/.test(t) && t === t.toUpperCase() && /^[A-Z0-9 &,.'’\-:]+$/.test(t);
const label = (t) => t.replace(/\s*:\s*(:\s*)*$/, '');

function cleanOnce(html, report) {
  const count = (k) => (report[k] = (report[k] ?? 0) + 1);
  let out = html;

  // 1. Markers
  out = out.replace(/<p>([\s\S]*?)<\/p>\s*/g, (m, inner) => {
    const t = plain(inner);
    if (ENDS.test(t) || /^tilbake$/i.test(t)) {
      count('markersRemoved');
      return '';
    }
    return m;
  });

  // 2. <br> runs inside a paragraph
  out = out.replace(/<p( class="[^"]*")?>((?:(?!<\/p>)[\s\S])*?<br\s*\/?>(?:(?!<\/p>)[\s\S])*?)<\/p>/g, (m, cls = '', inner) => {
    const parts = inner.split(/\s*<br\s*\/?>\s*/).filter((s) => plain(s));
    if (parts.length < 2) return m;
    if (parts.every((s) => /^[•·▪\-–]\s?/.test(plain(s)))) {
      count('bulletRunsToLists');
      return `<ul>${parts.map((s) => `<li>${s.replace(/^\s*(<[^>]+>)*\s*[•·▪\-–]\s?/, '$1')}</li>`).join('')}</ul>`;
    }
    // Split only between two sentences of some length: contact lines and addresses keep their line breaks. A break
    // inside a long line that stops mid-sentence is an email's hard wrap: it becomes a space
    const groups = [parts[0]];
    for (const s of parts.slice(1)) {
      const prev = plain(groups[groups.length - 1]);
      const line = plain(groups[groups.length - 1].split(/<br>/).pop());
      if (/[.!?”"]$/.test(prev) && words(prev) >= 6 && words(plain(s)) >= 6) {
        groups.push(s);
        count('paragraphsSplit');
      } else if (line.length >= 50 && !/[.!?:;”"]$/.test(line)) {
        groups[groups.length - 1] += ` ${s}`;
        count('hardWrapsJoined');
      } else groups[groups.length - 1] += `<br>${s}`;
    }
    if (groups.length === 1 && groups[0] !== inner) return `<p${cls}>${groups[0]}</p>`;
    if (groups.length === 1) return m;
    return groups.map((g, i) => `<p${i === 0 ? cls : ''}>${g}</p>`).join('\n');
  });

  // 3. Labels typed as paragraphs
  out = out.replace(/<p>((?:(?!<\/p>)[\s\S])*?)<\/p>(?=(?:\s*<(ul|ol|figure|p|h2|div)\b)?)/g, (m, inner, next) => {
    const t = plain(inner);
    if (!t || words(t) > 7 || MONTH.test(t) || BOILERPLATE.test(t) || /<br/.test(inner)) return m;
    const highlights = /highlights\s*:?\s*:?$/i.test(t);
    const caps = isCaps(t) && t.length > 3;
    const listIntro = /:$/.test(t) && (next === 'ul' || next === 'ol');
    if (!highlights && !caps && !listIntro) return m;
    count('labelsToHeadings');
    return `<h2>${caps ? sentenceCase(label(t)) : label(t)}</h2>`;
  });

  // 3b. The reverse: whole sentences typed as headings (older posts set every paragraph as one) are paragraphs
  out = out.replace(/<h2>([\s\S]*?)<\/h2>/g, (m, inner) => {
    const t = plain(inner);
    if (words(t) >= 10 && /[.!?”"]$/.test(t)) {
      count('headingsToParagraphs');
      return `<p>${inner}</p>`;
    }
    return m;
  });

  // 4. Boilerplate: from the first contact / About line to the end
  if (!out.includes('article-boilerplate')) {
    const blocks = [...out.matchAll(/<(p|h2)( class="[^"]*")?>([\s\S]*?)<\/\1>/g)];
    const start = blocks.find((b) => BOILERPLATE.test(plain(b[3])) && b.index > out.length * 0.3);
    if (start) {
      out = `${out.slice(0, start.index).trimEnd()}\n<div class="article-boilerplate">\n${out.slice(start.index).trim()}\n</div>`;
      count('boilerplateWrapped');
    }
  }

  // 5. A heading or label with nothing under it
  for (let again = true; again; ) {
    again = false;
    out = out.replace(/\s*<(h2|p)>([^<]*(?:<(?:strong|em)>[^<]*<\/(?:strong|em)>[^<]*)*)<\/\1>(\s*<\/div>)?\s*$/, (m, tag, inner, close = '') => {
      const t = plain(inner);
      if (words(t) <= 8 && (/:$/.test(t) || BOILERPLATE.test(t))) {
        again = true;
        count('trailingLabelsRemoved');
        return close ? `\n${close.trim()}` : '';
      }
      return m;
    });
  }
  // A boilerplate block left empty goes too
  out = out.replace(/\s*<div class="article-boilerplate">\s*<\/div>\s*$/, '');
  return out.trim();
}

// 6. Valid markup. An href that isn't a URL, a path, an anchor, mailto: or tel: is text typed into the link field
const URLISH = /^\s*(https?:|mailto:|tel:|\/|#)/i;
function validMarkup(html, report) {
  let out = html.replace(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (m, href, inner) => {
    if (URLISH.test(href)) return m;
    // An address typed without its scheme: an email gets mailto:, a www. address https://
    const fix = /^\s*[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}\s*$/i.test(href) ? `mailto:${href.trim()}` : /^\s*www\./i.test(href) ? `https://${href.trim()}` : '';
    if (fix) {
      report.linksFixed = (report.linksFixed ?? 0) + 1;
      return m.replace(`href="${href}"`, `href="${fix}"`);
    }
    report.linksUnwrapped = (report.linksUnwrapped ?? 0) + 1;
    return inner;
  });
  // Re-serialise only when the tree needs it: the parser would rebuild it (unclosed tags, a link in a link), an inline
  // element wraps whole paragraphs (<em><p>…</p></em>: unwrapped), or a boilerplate block or file / link row sits
  // inside a table or another element (the News single cuts the body at those, so they must be top level: the
  // boilerplate unwraps, a row keeps its links as plain markup)
  const tags = (h) => (h.match(/<\/?[a-z][a-z0-9]*/gi) ?? []).map((t) => t.toLowerCase()).join(' ');
  const frag = parseFragment(out);
  let edited = false;
  const INLINE = new Set(['em', 'strong', 'a', 'span', 'sup', 'sub', 'cite']);
  const BLOCK = new Set(['p', 'div', 'ul', 'ol', 'table', 'blockquote', 'figure', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const cls = (n) => ` ${(n.attrs ?? []).find((a) => a.name === 'class')?.value ?? ''} `;
  const unwrap = (n) => {
    const i = n.parentNode.childNodes.indexOf(n);
    for (const c of n.childNodes) c.parentNode = n.parentNode;
    n.parentNode.childNodes.splice(i, 1, ...n.childNodes);
    edited = true;
  };
  const walk = (n) => {
    for (const c of [...(n.childNodes ?? [])]) {
      walk(c);
      if (!c.tagName) continue;
      if (INLINE.has(c.tagName) && c.childNodes.some((k) => BLOCK.has(k.tagName))) unwrap(c);
      else if (n !== frag && c.tagName === 'div' && cls(c).includes(' article-boilerplate ')) unwrap(c);
      else if (n !== frag && / article-(file|links) /.test(cls(c))) {
        c.attrs = c.attrs.filter((a) => a.name !== 'class');
        edited = true;
      }
    }
  };
  walk(frag);
  const parsed = serialize(frag);
  if (edited || tags(parsed) !== tags(out)) {
    report.bodiesBalanced = (report.bodiesBalanced ?? 0) + 1;
    out = parsed;
  }
  return out;
}

// One pass can uncover another (a split paragraph turns out to be a label), so run until nothing changes
export function cleanStory(html, report = {}) {
  let out = html;
  for (let i = 0; i < 4; i++) {
    // The parser's tree can give the clean-up something new to do (a balanced boilerplate), so both repeat
    const next = validMarkup(cleanOnce(out, report), report);
    if (next === out) break;
    out = next;
  }
  return out;
}

// CLI: apply to the posts file
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = new URL('../src/data/news-posts.json', import.meta.url);
  const posts = JSON.parse(fs.readFileSync(file, 'utf8'));
  const report = {};
  let changed = 0;
  for (const p of posts) {
    const next = cleanStory(p.content, report);
    if (next !== p.content) changed++;
    p.content = next;
  }
  fs.writeFileSync(file, `${JSON.stringify(posts, null, 1)}\n`);
  console.log({ postsChanged: changed, ...report });
}
