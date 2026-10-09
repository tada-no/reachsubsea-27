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
//   7. boilerplate labels (9 Oct 2026, Q155): "About Reach Subsea", "For more information please contact:" and the like
//      come typed four ways (bold or not, own line or joined to the text with <br>); each becomes a bold paragraph
//      of its own, without the colon, so every release ends the same way
//   8. release links (Q155): "Webcast link: <address>" becomes a "Watch the webcast" link row; download links typed
//      as lines of a paragraph ("Download report and presentation here:<br><a>Report</a><br><a>…") or loose at the
//      top level become a link row; a file already in an earlier row isn't listed twice; empty links go; an address
//      typed or linked as itself becomes a short link ("reachsubsea.no"); a bold-only label in the story
//      ("Quarterly presentation") is a heading, as in step 3, and a heading repeated straight after itself goes
//   9. a lead longer than 45 words (Q155) keeps its opening sentence(s), at least 10 words and at most 45; the rest is
//      the next paragraph. When no sentence end falls in that range the paragraph stays body text, with no lead
//  10. polish (9 Oct 2026, Q156): the featured photo repeated anywhere in the body goes (the import already dropped it
//      when it came first; a captioned copy stays, its caption says something); quote marks typed the wrong way or
//      padded with spaces (“ Company “, says: ” We, «…”) are set right; a paragraph broken mid-sentence (it stops
//      without punctuation and the next starts in lower case) is joined again
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
      // Not a line that carries its content after the colon ("please contact: Birgitte Wendelbo Johansen")
      if (words(t) <= 8 && (/:$/.test(t) || BOILERPLATE.test(t)) && !/:\s*\S/.test(t)) {
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

// 7–9. Labels, links and leads (Q155). The story and its boilerplate are handled apart: a bold paragraph is a label
// in both, but only the story's become headings
const BP = '<div class="article-boilerplate">';
// A label, not a line that carries its content after a colon ("please contact: <name>") or the first line of a
// sentence wrapped by hand ("This information is subject of the disclosure<br>requirements …")
const isLabel = (html, rest = '') => {
  const t = plain(html);
  if (!t || words(t) > 8 || /@|\d{3}/.test(t) || /:\s*\S/.test(t) || /^this information\b/i.test(t) || /^[a-z]/.test(plain(rest))) return false;
  return /^<strong>[\s\S]*<\/strong>$/.test(html.trim()) || /:$/.test(t) || BOILERPLATE.test(t) || /^about\b/i.test(t);
};
const boldLabel = (html) => `<p><strong>${label(plain(html))}</strong></p>`;
// A web address as a link label: the host, and the path when it is short ("hydro.gov.au/NHP")
const shortUrl = (u) => {
  try {
    const x = new URL(/^www\./i.test(u) ? `https://${u}` : u);
    const host = x.hostname.replace(/^www\./, '');
    const full = host + (x.pathname + x.search).replace(/\/$/, '');
    return full.length <= 40 ? full : host;
  } catch {
    return u;
  }
};
const URL_TEXT = /\b((?:https?:\/\/|www\.)[^\s<]*[^\s<.,;:!?)”"'])/g;
const ROW = (links) => `<ul class="article-links">${links.map(([href, text]) => `<li><a href="${href}">${text}</a></li>`).join('')}</ul>`;

function boilerplateLabels(bp, report) {
  const count = (k) => (report[k] = (report[k] ?? 0) + 1);
  return bp.replace(/<p>((?:(?!<\/p>)[\s\S])*?)<\/p>/g, (m, inner) => {
    const [first, ...rest] = inner.split(/\s*<br\s*\/?>\s*/);
    if (!isLabel(first, rest[0] ?? '')) return m;
    const next = boldLabel(first);
    const body = rest.filter((r) => plain(r)).join('<br>');
    if (!body && next === m) return m;
    count('boilerplateLabels');
    return body ? `${next}\n<p>${body}</p>` : next;
  });
}

function releaseLinks(story, report) {
  const count = (k) => (report[k] = (report[k] ?? 0) + 1);
  let out = story;
  // Empty links (a webcast address whose text was pasted into the next link)
  out = out.replace(/<a href="[^"]*">\s*<\/a>/g, () => (count('emptyLinksRemoved'), ''));
  // "Webcast link: <address>" (or "Link:" before a webcast host) → a link row; anything after it in the paragraph
  // stays a paragraph
  const WEBCAST = /companywebcast|royalcast|qcnl\.tv/;
  out = out.replace(/<p>(Webcast link|Link):\s*(?:<br\s*\/?>\s*)?(?:<a href="([^"]+)">[^<]*<\/a>|(https?:\/\/[^\s<]+))\s*([\s\S]*?)<\/p>/g, (m, lead, href, bare, rest) => {
    if (lead === 'Link' && !WEBCAST.test(href ?? bare)) return m;
    count('webcastLinks');
    return ROW([[href ?? bare, 'Watch the webcast']]) + (plain(rest) ? `\n<p>${rest.trim()}</p>` : '');
  });
  // Download links typed as the lines of a paragraph → a link row; a label ending ":" before them goes (the row's
  // file links say it), a closing sentence stays a paragraph
  out = out.replace(/<p>((?:(?!<\/p>)[\s\S])*?<br\s*\/?>(?:(?!<\/p>)[\s\S])*?)<\/p>/g, (m, inner) => {
    const lines = inner.split(/\s*<br\s*\/?>\s*/).filter((l) => plain(l));
    const isFile = (l) => /^<a href="[^"]+\.pdf(\?[^"]*)?">[^<]+<\/a>$/i.test(l.trim());
    let i = 0;
    if (!isFile(lines[0])) {
      if (!/:$/.test(plain(lines[0])) || words(plain(lines[0])) > 8) return m;
      i = 1;
    }
    const files = [];
    while (i < lines.length && isFile(lines[i])) files.push(lines[i++]);
    if (!files.length) return m;
    const tail = lines.slice(i).join('<br>');
    count('downloadRows');
    const row = ROW(files.map((l) => [l.match(/href="([^"]+)"/)[1], plain(l)]));
    return row + (plain(tail) ? `\n<p>${tail}</p>` : '');
  });
  // A link left loose at the top level (not in a paragraph) → a link row
  out = out.replace(/(^|\n)<a href="([^"]+)">\s*([^<]*?)\s*<\/a>(?=\n|$)/g, (m, nl, href, text) => (count('looseLinksToRows'), `${nl}${ROW([[href, text]])}`));
  // A file already in an earlier row isn't listed again: its item goes, and a row left empty
  const seen = new Set();
  const once = (href) => !seen.has(href) && seen.add(href);
  out = out.replace(/<ul class="article-links">([\s\S]*?)<\/ul>/g, (m, items) => {
    const kept = items.replace(/<li><a href="([^"]+)">[\s\S]*?<\/a><\/li>/g, (li, h) => (once(h) ? li : (count('duplicateLinksRemoved'), '')));
    return kept.includes('<li>') ? `<ul class="article-links">${kept}</ul>` : '';
  });
  out = out.replace(/\n{2,}/g, '\n');
  // A bold-only label in the story is a heading, as step 3's typed labels
  out = out.replace(/<p><strong>([^<]*)<\/strong><\/p>/g, (m, t) => {
    const x = plain(t);
    if (!x || words(x) > 7 || /[.!?]$/.test(x) || MONTH.test(x) || BOILERPLATE.test(x)) return m;
    count('labelsToHeadings');
    return `<h2>${isCaps(x) ? sentenceCase(label(x)) : label(x)}</h2>`;
  });
  // The same heading twice in a row
  out = out.replace(/<h2>([^<]*)<\/h2>\s*<h2>\1<\/h2>/g, (m, t) => (count('repeatedHeadings'), `<h2>${t}</h2>`));
  return out;
}

// Addresses typed as text, or linked with themselves as the label, become short links (story and boilerplate)
function shortLinks(html, report) {
  const count = (k) => (report[k] = (report[k] ?? 0) + 1);
  let inA = false;
  let inFrame = false;
  return html
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (part.startsWith('<')) {
        if (/^<a\b/i.test(part)) inA = true;
        else if (/^<\/a>/i.test(part)) inA = false;
        else if (/^<iframe\b/i.test(part)) inFrame = true;
        else if (/^<\/iframe>/i.test(part)) inFrame = false;
        return part;
      }
      if (inFrame) return part;
      if (inA) {
        const t = part.trim();
        if (/^(https?:\/\/|www\.)\S+$/.test(t) && shortUrl(t) !== t) return (count('urlLabelsShortened'), part.replace(t, shortUrl(t)));
        return part;
      }
      return part.replace(URL_TEXT, (u) => (count('bareUrlsLinked'), `<a href="${/^www\./i.test(u) ? `https://${u}` : u}">${shortUrl(u)}</a>`));
    })
    .join('');
}

// 9. Leads (Q155, Q159). The dateline goes from the lead: the meta shows the date and the card already drops it
// ("Haugesund, 18 August 2026 – "). A lead is whole sentences, at most 50 words: a long one keeps its opening sentences
// and the rest is the next paragraph; one the dateline left short (under 25 words) takes the next paragraph's opening
// sentences, so a results release leads with its figures (a lead short as written stays as it is). A release that lost its lead to the 45-word cut (Q155) and
// opens with a dateline gets it back. No sentence end between 10 and 50 words: no lead.
const ABBR = /\b(ltd|inc|no|mr|ms|dr|st|approx|nok|usd|eur|co|e\.g|i\.e|[a-z])\.$/i;
const MONTH_NAMES = 'january|february|march|april|may|june|july|august|september|october|november|december';
const DATELINE_START = new RegExp(
  String.raw`^\s*(?:(?:Haugesund|Oslo|Bergen|Stavanger|Aberdeen|Stockholm)(?:\s*\/\s*[A-Z]\w+)?,\s*)?(?:\d{1,2}\s*(?:st|nd|rd|th)?\.?\s+(?:${MONTH_NAMES}),?\s+20\d\d|\d{1,2}\.\d{1,2}\.20\d\d)\s*[:–—-]\s*`,
  'i',
);
const LEAD_MAX = 50;
// Where whole sentences end in an HTML string: not inside a tag or a quotation, not after an abbreviation
const sentenceEnds = (html) =>
  [...html.matchAll(/[.!?](?=\s+[A-Z0-9“"]|\s*$)/g)]
    .map((s) => s.index + 1)
    .filter((at) => {
      const head = html.slice(0, at);
      const n0 = (re) => (head.match(re) ?? []).length;
      const balanced = ['a', 'em', 'strong'].every((t) => n0(new RegExp(`<${t}\\b`, 'g')) === n0(new RegExp(`</${t}>`, 'g'))) && n0(/“/g) === n0(/”/g);
      return balanced && !ABBR.test(head);
    });
function leads(html, report) {
  const count = (k) => (report[k] = (report[k] ?? 0) + 1);
  let out = html;
  // A release that opens with a dateline and runs to four paragraphs has a lead
  if (!out.includes('article-lead') && (out.match(/<p>/g) ?? []).length >= 4) {
    out = out.replace(/^\s*<p>((?:(?!<\/p>)[^])*?)<\/p>/, (m, inner) => (DATELINE_START.test(plain(inner)) && words(plain(inner)) > 12 ? (count('leadsRestored'), `<p class="article-lead">${inner}</p>`) : m));
  }
  return out.replace(/<p class="article-lead">([^]*?)<\/p>(\s*<p>([^]*?)<\/p>)?/, (m, lead, nextBlock = '', next = '') => {
    let text = lead.replace(/&nbsp;/g, ' ');
    const dated = DATELINE_START.test(text);
    if (dated) {
      text = text.replace(DATELINE_START, '');
      text = text.charAt(0).toUpperCase() + text.slice(1);
      count('leadDatelinesRemoved');
    } else text = lead;
    let rest = next;
    // Short once its dateline went: take the next paragraph's opening sentences while the lead stays within 50 words
    // (a lead that was short as written keeps the author's paragraph break)
    if (dated && words(plain(text)) < 25 && rest) {
      let take = 0;
      for (const at of sentenceEnds(rest)) {
        if (words(plain(text)) + words(plain(rest.slice(0, at))) > LEAD_MAX) break;
        take = at;
      }
      if (take) {
        text = `${text} ${rest.slice(0, take).trim()}`;
        rest = rest.slice(take).trim();
        count('leadsExtended');
      }
    }
    // Long: keep whole opening sentences, 10 to 50 words
    if (words(plain(text)) > LEAD_MAX) {
      const fit = sentenceEnds(text).filter((at) => words(plain(text.slice(0, at))) >= 10 && words(plain(text.slice(0, at))) <= LEAD_MAX).pop();
      if (fit) {
        rest = `${text.slice(fit).trim()}${rest ? ` ${rest}` : ''}`;
        text = text.slice(0, fit);
        count('leadsCut');
      } else {
        count('leadsDropped');
        return `<p>${text}</p>${nextBlock ? nextBlock.replace(next, rest) : ''}`;
      }
    }
    if (text === lead && rest === next) return m;
    const after = rest ? `\n<p>${rest}</p>` : '';
    return `<p class="article-lead">${text}</p>${nextBlock || rest !== next ? after : ''}`;
  });
}

function releaseTidy(html, report) {
  const at = html.indexOf(BP);
  const story = at < 0 ? html : html.slice(0, at);
  const bp = at < 0 ? '' : html.slice(at);
  return shortLinks(leads(releaseLinks(story, report), report) + boilerplateLabels(bp, report), report);
}

// 10. Polish (Q156)
const photoPath = (u) => (u ?? '').replace(/^https?:\/\/[^/]+/, '').replace(/-(\d+x\d+|scaled)(?=\.\w+$)/, '').toLowerCase();
function polish(html, featured, report) {
  const count = (k) => (report[k] = (report[k] ?? 0) + 1);
  let out = html;
  if (featured) {
    out = out.replace(/<figure><img src="([^"]+)"[^>]*><\/figure>\s*/g, (m, src) => (photoPath(src) === photoPath(featured) ? (count('featuredRepeatsRemoved'), '') : m));
  }
  // Quote marks (typed as entities in older posts: the characters themselves, so one rule reads both)
  const ENT = { '&#8220;': '“', '&#8221;': '”', '&#8216;': '‘', '&#8217;': '’', '&#171;': '«', '&#187;': '»', '&#8211;': '–', '&#8212;': '—' };
  out = out
    .replace(/&#(8220|8221|8216|8217|171|187|8211|8212);/g, (e) => ENT[e])
    .replace(/“(?:\s|&nbsp;)*(<strong>)?([^“”<]{1,40}?)(<\/strong>)?(?:\s|&nbsp;)*“/g, (m, b = '', t, e = '') => (count('quotesFixed'), `“${b}${t}${e}”`))
    .replace(/:\s*”\s*(?=[A-Z])/g, () => (count('quotesFixed'), ': “'))
    .replace(/«([^«»”<]*)”/g, (m, t) => (count('quotesFixed'), `“${t}”`));
  // Quote blocks (Q159): a quote block names its speaker in its cite and has no marks of its own. Marks round the
  // whole quote go when there is a cite, and so does a trailing ", said <name>." the cite repeats. A block with no cite
  // whose speaker is named inside ("…, said Alendal. It is …") gets marks round the quoted words, as running text
  // would; a name and title left after the last sentence ("… efficiency. Jostein Alendal, CEO of Reach Subsea")
  // becomes the cite. A quote that stops without punctuation gets its full stop.
  out = out.replace(/<blockquote>\s*<\/blockquote>\s*/g, () => (count('emptyQuotesRemoved'), ''));
  out = out.replace(/<blockquote>([^]*?)<\/blockquote>/g, (m, inner) => {
    let cite = inner.match(/<cite>[^]*?<\/cite>/)?.[0] ?? '';
    let paras = [...inner.replace(cite, '').matchAll(/<p>([^]*?)<\/p>/g)].map((x) => x[1].trim());
    if (!paras.length) return m;
    const all = () => plain(paras.join(' '));
    const NAME_TITLE = String.raw`[A-Z][\w’-]+(?:\s[A-Z][\w’-]+){1,2},\s[^.<“”]+`;
    if (!cite && paras.length > 1 && new RegExp(`^${NAME_TITLE}\\.?$`).test(paras[paras.length - 1])) {
      // The name and title in a paragraph of their own
      cite = `<cite>${paras.pop().replace(/\.$/, '')}</cite>`;
    }
    const last = paras.length - 1;
    if (!cite && !/[“”]/.test(all())) {
      // "…, said Jostein Alendal, CEO of Reach Subsea." at the end: the speaker with a title goes to the cite
      // ("says CEO, Jostein Alendal." reads Name, title); a bare "said Alendal" stays in the text, with marks (below)
      const said = paras[last].match(/^([^]+?),\s+(?:said|says)\s+([^“”<]+?)\.?$/);
      const who = said?.[2].replace(/^([A-Z][\w ]*?),\s+([A-Z][\w’-]+(?:\s[A-Z][\w’-]+){1,2})$/, '$2, $1');
      if (said && /^[A-Z][\w’-]+(?:\s[A-Z][\w’-]+){1,2},\s/.test(who)) {
        paras[last] = `${said[1]}.`;
        cite = `<cite>${who}</cite>`;
      }
    }
    if (!cite) {
      const tail = paras[last].match(/^([^]*[.!?])\s+([A-Z][\w’-]+(?:\s[A-Z][\w’-]+){1,2},\s[^.<“”]+)$/);
      if (tail) {
        paras[last] = tail[1];
        cite = `<cite>${tail[2].trim()}</cite>`;
      }
    }
    if (cite) {
      const t = all();
      const opens = (t.match(/“/g) ?? []).length;
      const closes = (t.match(/”/g) ?? []).length;
      if (closes === 1 && opens === paras.filter((p) => p.startsWith('“')).length && paras[0].startsWith('“') && /”[.,]?$/.test(paras[last])) {
        paras = paras.map((p) => p.replace(/^“/, ''));
        paras[last] = paras[last].replace(/,?”[.,]?$/, '.').replace(/([.!?])\.$/, '$1');
      }
      paras[last] = paras[last].replace(/,\s*(?:said|says)\s+[^.,“”<]+\.$/, '.');
    } else if (!/[“”]/.test(all())) {
      const ATTR = String.raw`(?:(?:said|says|concluded)\s+[A-Z][\w’-]+(?:\s[A-Z][\w’-]+)?|(?:he|she|[A-Z][\w’-]+)\s+(?:said|says|concluded))`;
      paras = paras.map((p) =>
        p.replace(new RegExp(String.raw`^([^]+?),\s+(${ATTR})\.(?:\s+([^]+))?$`), (x, q, attr, rest) => `“${q},” ${attr}.${rest ? ` “${rest.replace(/([.!?])?$/, (e) => e || '.')}”` : ''}`),
      );
    }
    paras[last] = paras[last].replace(/,((?:<\/(?:em|strong)>)*)$/, '$1');
    // A cite is a label, with no full stop of its own
    cite = cite.replace(/(?:\s|&nbsp;)+<\/cite>$/, '</cite>').replace(/\.<\/cite>$/, '</cite>');
    // and holds only the speaker: a note after a break ("<br>Ref. stock exchange announcement …") follows the quote
    let note = '';
    cite = cite.replace(/,?\s*<br>\s*([^]*?)\s*<\/cite>$/, (x, n) => ((note = `\n<p>${n}</p>`), '</cite>'));
    if (!/[.!?…”"]$/.test(plain(paras[last]))) paras[last] = `${paras[last]}.`;
    const next = `<blockquote>\n${paras.map((p) => `<p>${p}</p>`).join('\n')}${cite ? `\n${cite}` : ''}</blockquote>`+ note;
    if (next.replace(/\s+/g, ' ').replace(/> </g, '><') === m.replace(/\s+/g, ' ').replace(/> </g, '><')) return m;
    count('quoteBlocksTidied');
    return next;
  });
  // In the boilerplate a name linked to the contact page is plain text: the Press enquiries panel under every story
  // has the contact link, and two names went to the same page (Q159)
  out = out.replace(/<a href="https?:\/\/(?:www\.)?reachsubsea\.(?:no|com)\/contact\/?">([^<]*)<\/a>/g, (m, t, at, str) => {
    if (str.lastIndexOf('article-boilerplate', at) < 0) return m;
    count('contactLinksUnwrapped');
    return t.replace(/\s+$/, '');
  });
  // A line break mid-sentence: the next line goes on in lower case (not an email or web address)
  out = out.replace(/([^>.!?:;”"\s])\s*<br\s*\/?>\s*(?=([a-z][^\s<]*))/g, (m, c, next) => {
    if (/[@/]|\.\w/.test(next)) return m;
    count('hardWrapsJoined');
    return `${c} `;
  });
  // Bullets typed as paragraphs ("– Private placement successfully closed", "• …") are a list; "o" sub-items typed
  // after one ("• Our main propositions are:" / "o Real-time seismic …") nest under it
  const bulletRun = (marker, min) => new RegExp(`(?:<p>${marker}\\s+(?:(?!<\\/?p\\b)[^])*?<\\/p>\\s*){${min},}`, 'g');
  const itemsOf = (run, marker) => [...run.matchAll(new RegExp(`<p>${marker}\\s+([^]*?)<\\/p>`, 'g'))].map((x) => `<li>${x[1].trim()}</li>`);
  out = out.replace(bulletRun('[–•·▪-]', 2), (m) => (count('bulletRunsToLists'), `<ul>${itemsOf(m, '[–•·▪-]').join('')}</ul>\n`));
  out = out.replace(/<\/li><\/ul>\s*((?:<p>o\s+(?=[A-Z])(?:(?!<\/?p\b)[^])*?<\/p>\s*)+)/g, (m, run) => {
    count('subListsNested');
    return `<ul>${itemsOf(run, 'o').join('')}</ul></li></ul>\n`;
  });
  // A paragraph broken mid-sentence: 6+ words without closing punctuation and the next starts in lower case, or any
  // paragraph that stops on a word a sentence can't end on ("…operations of the company are" / "NOK 7.2 million.")
  const ENDS_OPEN = /\b(a|an|the|of|to|and|or|in|on|for|with|is|are|was|were|by|at|from|as|that|which|has|have|will|be|our|its|their|this|than|per|nok|usd|eur)$/i;
  // Each paragraph boundary is checked on its own, so a paragraph left as it is can still join the next one
  out = out.replace(/<\/p>\s*<p>(?![^\s<]*@)(?=(.))/g, (m, first, at, str) => {
    const open = str.lastIndexOf('<p>', at);
    const a = open < 0 ? '' : str.slice(open + 3, at);
    if (!a || /<\/?p\b/.test(a)) return m;
    const t = plain(a);
    if (words(t) < 4 || /@|https?:/.test(t)) return m;
    const lower = /[a-z]/.test(first) && words(t) >= 6 && !/[.!?:;”"»)]$/.test(t);
    if (!lower && !ENDS_OPEN.test(t)) return m;
    count('brokenParagraphsJoined');
    return ' ';
  });
  // Editorial corrections the rules can't make safely: each fixes one post's quote marks or line break, found by a
  // phrase only that post has (the replacement no longer contains it, so this runs once)
  for (const [find, replace] of CORRECTIONS) {
    if (!out.includes(find)) continue;
    out = out.replace(find, replace);
    count('editorialCorrections');
  }
  return out;
}
const CORRECTIONS = [
  // close-to-1000-days…: the quote's opening mark, and its second half
  ['<p>The hardest part was proving it could be done,” Alendal concluded. We have done that. Now it’s about scaling it.</p>', '<p>“The hardest part was proving it could be done,” Alendal concluded. “We have done that. Now it’s about scaling it.”</p>'],
  // reach-subsea-australia-awarded…: the closing mark
  ['providing us with greater control over future plans</p>', 'providing us with greater control over future plans.”</p>'],
  // reach-subsea-asa-q2-2023…: a quote block with a cite needs no marks; this one had only the closing one
  ['very positive market outlook for the coming years,”</p>', 'very positive market outlook for the coming years.</p>'],
  // annual-report-and-sustainability-report: the closing mark
  ['reduce emissions with 90-100 percent.</p>', 'reduce emissions with 90-100 percent.”</p>'],
  // contract-awards-2: a closing mark mid-sentence
  ['benefits of our high speed survey ROVs” and that some 300', 'benefits of our high speed survey ROVs and that some 300'],
  // contract-for-viking-neptun: two lines broken before a capital or a figure
  ['performed by Reach Subsea and Eidesvik</p>\n<p>Offshore for Technip', 'performed by Reach Subsea and Eidesvik Offshore for Technip'],
  ['as part of the</p>\n<p>3-year contract', 'as part of the 3-year contract'],
  // new-contract-2: the vessel's name quoted inside the quote, and "Says"
  ['from “Edda Fonn” together with Østensjø.” Says Jostein', 'from ‘Edda Fonn’ together with Østensjø,” says Jostein'],
  // new-contract-for-dina-star: the quote's second paragraph opens, and closes before "says"
  ['<p>Reach will under this contract display', '<p>“Reach will under this contract display'],
  ['on board to market. “Says Kåre', 'on board to market,” says Kåre'],
  // contract-awards-and-increased-fleet…: the quote opens after "Troll field.", vessel names inside it in single marks
  ['Troll field.”Through our cooperation with our experienced partner within survey, MMT, around “Stril Explorer” Reach', 'Troll field. “Through our cooperation with our experienced partner within survey, MMT, around ‘Stril Explorer’ Reach'],
  ['<p>“Dina Star” is offered to new and existing customers', '<p>“Dina Star is offered to new and existing customers'],
  ['from early season of 2014.” says CEO', 'from early season of 2014,” says CEO'],
  // octio-awarded…, …deep-cygnus…, financial-report-for-4q-2021…: a quote's second paragraph opens
  ['<p>The Australian monitoring contract is another strong credential', '<p>“The Australian monitoring contract is another strong credential'],
  ['operators worldwide” said Leon', 'operators worldwide,” said Leon'],
  ['<p>Deep Cygnus is a vessel that fits nicely', '<p>“Deep Cygnus is a vessel that fits nicely'],
  ['<p>The emergence of new industries is also gathering pace, as reflected by the recent “ScotWind”', '<p>“The emergence of new industries is also gathering pace, as reflected by the recent ‘ScotWind’'],
];

// One pass can uncover another (a split paragraph turns out to be a label), so run until nothing changes
export function cleanStory(html, report = {}, featured = '') {
  let out = html;
  for (let i = 0; i < 4; i++) {
    // The parser's tree can give the clean-up something new to do (a balanced boilerplate), so both repeat
    const next = validMarkup(polish(releaseTidy(cleanOnce(out, report), report), featured, report), report);
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
    const next = cleanStory(p.content, report, p.image?.large);
    if (next !== p.content) changed++;
    p.content = next;
  }
  fs.writeFileSync(file, `${JSON.stringify(posts, null, 1)}\n`);
  console.log({ postsChanged: changed, ...report });
}
