# Page review checklist

Run this on every page and every new or changed section **before** showing it to Ross, without being asked. Fix what fails, then report what you checked. It collects the feedback from building Home, Why invest and the Investors overview (Sep 2026).

## 1. Widths

Check each section at four widths:

| Width | Why | How |
|---|---|---|
| 1440 | Design width | Headless Chrome full-page shot |
| ~1100 | The browser pane Ross reviews in | Headless shot, or the pane at its own size |
| 800 | Tablet; most grids change shape here | Headless shot |
| 375 | Phone | Browser pane `mobile` preset (headless Chrome can't go below ~500) |

Headless command (from the project root):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --virtual-time-budget=6000 --window-size=1440,6000 --screenshot=out.png http://localhost:4321/path/
```

Headless can catch scroll reveals halfway through, and it leaves the OMS iframe unloaded. Recheck anything odd in the browser pane before calling it a bug.

### Between the widths: the card sweep

The four widths miss the ranges just above each breakpoint, where rows are squeezed hardest (600–767, 900, 1200). Before any handover, sweep every page from 600 to 1399. Open the browser pane at 1400 wide (`resize_window` 1400×900, since test frames can't be wider than the pane), then run this with `javascript_tool`. It loads each page in test frames at each width and lists any card whose text column is under 260px **and** carries running text (description over 3 lines, a list item that wraps, or a title over 3 lines), plus any sideways scroll. It should print `clean`, apart from two exemptions: phone-width cards (375), and four-across rows from 1320, which sit at 214–246px as designed (Q74).

```js
const pages=['/','/services/','/services/subsea/','/company/','/careers/','/investors/','/investors/why-invest/','/contact/'];
const widths=[600,680,767,768,820,899,900,999,1000,1100,1199,1200,1300,1399];
const L=(el,d)=>el?Math.round(el.getBoundingClientRect().height/(parseFloat(d.defaultView.getComputedStyle(el).lineHeight)||20)):0;
const bad=[];
for (const p of pages) for (const w of widths) {
  const f=document.createElement('iframe'); f.style.cssText=`position:fixed;inset:0 auto auto 0;width:${w}px;height:900px;border:0;opacity:0`;
  f.src=p+'?v='+Date.now(); document.body.appendChild(f); await new Promise(r=>f.onload=r); await new Promise(r=>setTimeout(r,250));
  const d=f.contentDocument;
  if (d.documentElement.scrollWidth>w) bad.push(`${p} @${w} sideways scroll`);
  d.querySelectorAll('.card').forEach(c=>{ const t=c.querySelector('.card__heading'); if(!c.offsetWidth||!t) return;
    const tw=Math.round(t.getBoundingClientRect().width), ti=L(c.querySelector('.card__title'),d), de=L(c.querySelector('.card__description'),d);
    const wr=[...c.querySelectorAll('.card__sublink span')].filter(s=>L(s,d)>1).length;
    if (tw<260 && (de>3||wr||ti>3)) bad.push(`${p} #${c.closest('[id]')?.id} @${w}: text ${tw}px, title ${ti}L, desc ${de}L, wrapped ${wr}`); });
  f.remove();
}
bad.join('\n')||'clean'
```

If a card fails, change the row's shape at that width (fewer columns, or the card's own container-query layout). Don't shrink the type.

## 2. Cards and rows

- Every card in a row has the same structure and one left edge: media or tile, kicker, title, meta, actions.
- Actions line up across the row. No card's actions float higher or lower than its neighbours'.
- No hairlines inside a card. One piece of meta, on one line (short dates: "18 Aug 2026").
- Card text columns stay at 260px or more wherever the card carries a description or list (the sweep above). Card rows go to one column below 768; wide pictogram cards (Services' four lines) below 900; the editorial feed's lead-plus-stack starts at 1000; four-across rows start at 1320.
- Measure the actions. If 2–3 links won't fit on one line at a width, change the row's shape (container query) rather than letting them wrap.
- No half-empty cards. A single column of wide cards with the content bunched on the left means the layout should change at that width.
- The card surface contrasts with the section ground: never a tint card on a tint section.
- The same content uses the same shared component everywhere (e.g. `ReportCards`). Never fork a near-copy.

## 3. Data and figures

- Figures never clip or overflow their card at any width (Card stat figures scale with `cqi`).
- Big figures on light grounds use `text/accent-display` (sage-500). Body-size accent text uses `text/accent`.
- Units, currency and date formats are the same across the page and match sibling pages.
- Every number comes from one data file (`src/data/*`). The same figure never appears with two values on two pages.
- Mark placeholder data as placeholder in the data file and in the report to Ross.
- Charts and custom visuals: short labels, quiet axes and ticks, one highlight channel (markers, not text colour and weight). Check alignment (labels centred in their spans, markers where their dates are).

## 4. Text flow

- A text column reads as one flow: eyebrow · heading · body · action. More than about four separate pieces is a warning sign.
- Eyebrows and intros only where they add information.
- Split media: text and media vertically centred.
- No orphaned single words in headings at the four widths if a reasonable wrap fixes them.

## 5. Page rhythm and consistency

- Section grounds alternate sensibly (white / tint). Two adjacent sections on the same ground need a reason.
- Heroes: calm photo, subject right, never enlarged beyond its native width. Breadcrumb at the top of the hero. No gradients.
- The page ties to its siblings: same subnav, same CTA pattern, same shared components and data.
- Don't cut client-PDF content just because a sibling page has it. Decide by what visitors come to that page for.

## 6. Motion and accessibility

- No transparency in icon or pictogram animation (trim paths, movement, scale).
- Everything works with reduced motion and without JS (content is never hidden).
- Contrast: 4.5:1 for body text, 3:1 for large text (24px bold and up).
- Repeated link labels ("Report", "Download") carry hidden context.
- One `h1`. Headings in order.
- No horizontal page scroll at 375.
- Anything that moves for more than 5 seconds (video, loop) has a pause control: use `MediaToggle`.
- A sideways-scrolling area is keyboard-reachable: `tabindex="0"`, `role="region"`, an `aria-label` and a visible focus ring.
- `aria-label` only on elements with a role (landmarks, lists, buttons, links), never on a plain `div` or `span`. Landmarks of one type need different names.
- Tap targets at least 24px tall.
- Run axe-core (WCAG 2.2 AA + best practice) and an HTML validator on the built page: zero violations (Q70).

## 7. Tokens

Run from the project root before handing over. Every command should print nothing (or only the noted exceptions).

```bash
# raw colours (tokens.css is the only home for hex and rgb)
grep -rnE '#[0-9a-fA-F]{3,8}\b|\brgba?\(' src --include=*.astro --include=*.css --include=*.ts | grep -vE 'tokens.css|href|url\(#|"#'
# raw font sizes and leading (Values' min() and the Date tile's 22px band are the exceptions)
grep -rnE 'font-size:' src --include=*.astro --include=*.css | grep -vE 'var\(--wp--preset--font-size|inherit|tokens.css'
grep -rnE 'line-height:' src --include=*.astro --include=*.css | grep -vE 'var\(--wp|inherit|normal'
grep -rnE 'letter-spacing:' src --include=*.astro --include=*.css | grep -vE 'var\(--wp|: (0|normal|inherit)|tokens.css'
# raw spacing (1–3px rules, em nudges and negative optical margins are fine)
grep -rnE '(padding|margin|gap)[a-z-]*:[^;]*[0-9](px|rem)' src/blocks src/components --include=*.astro | grep -vE 'var\(--wp--preset--spacing'
```

New size needed? Snap to the nearest token first. Only add a token if the role repeats and no token fits (Q69), then add the Figma variable too.

## 8. Report

When handing over, include a screenshot at the design width (and others if something changed shape), plus a line on what you checked and what you fixed. If a check needs Ross's call, ask with AskUserQuestion and log the answer in `docs/00-questions.md`.
