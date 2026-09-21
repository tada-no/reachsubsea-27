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

## 2. Cards and rows

- Every card in a row has the same structure and one left edge: media or tile, kicker, title, meta, actions.
- Actions line up across the row. No card's actions float higher or lower than its neighbours'.
- No hairlines inside a card. One piece of meta, on one line (short dates: "18 Aug 2026").
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
