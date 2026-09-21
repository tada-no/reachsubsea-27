# About us (`/company/`): handoff for the next chat

Written 19 Sep 2026 at the end of the build chat. The page is **built but not approved**: Ross has a round of changes. Nothing is committed. The original brief is [about-us.md](about-us.md). Read that, then this file, then `CLAUDE.md` and `docs/08-page-review-checklist.md`.

## How to start

1. `git status` / `git log`. Other chats' uncommitted work is in the tree (see "Files" below): don't commit it.
2. The dev server usually belongs to another chat: browse http://localhost:4321/company/ rather than starting one.
3. Apply Ross's changes, then rerun the docs/08 checklist at 1440 · ~1100 · 800 · 375 before showing anything.

## Files

**Mine (new, safe to commit whole):**

| File | What |
|---|---|
| `src/pages/company/index.astro` | The page. Header comment lists sources and redirects |
| `src/data/company.ts` | Vision, story, values, promise, management, certificates, office cities, FAQs. Figures come only from key-figures |
| `src/blocks/Values.astro` | New block `reach/values`: the pinned Learn · Teach · Reach stage (details below) |
| `src/assets/pictograms/value-learn.svg`, `value-teach.svg`, `value-reach.svg` | New pictograms: the dev site's own `learn-icon.svg` / `teach-icon.svg` / `reach-icon.svg` (`/wp-content/uploads/2026/03/`, 72 grid) scaled ×4/3 onto the 96 grid, stroke 2.5, `currentColor`, with `pg-*` hooks added for the loops (20 Sep fix: the first version was redrawn by eye and was wrong) |
| `scripts/shot.mjs` | Review screenshot tool (see "Checking") |
| `docs/prompts/about-us-handoff.md` | This file |

**Shared files with my hunks only** (checked 19 Sep; recheck with `git diff` before staging, another chat may have edited since):

| File | My change |
|---|---|
| `src/blocks/SplitMedia.astro` (+ `MediaFrame.astro` 21:9) | New `layout="wide"` (Image only, see Our story). Tablet fix: `.split-media__columns` gets `align-items: stretch` below 900 (spec tables were shrinking and centring; every Split media on Home, Services, Subsea, Investors, Why invest checked at 800 afterwards, all fill their column) |
| `src/blocks/CardGrid.astro` | Strip with exactly 3 tiles: 3 columns from 600 up; 600–899 pictogram above label. A strip after a tint/navy section keeps its top padding (it only drops it on the same ground) |
| `src/components/Pictogram.astro` | Keyframes for the three value pictograms, appended at the end of the style block |
| `src/data/key-figures.ts` | New key `office-countries: 4` (PDF p30) |

**Not mine, don't commit:** `src/blocks/FeedGrid.astro`, `src/components/Card.astro`, `src/lib/types.ts` (uncommitted hunks from the Services chat), `src/blocks/Lifecycle.astro`, `src/data/services.ts`, `src/data/projects.ts`, `src/pages/services/`, `docs/prompts/subsea-*.md`, `docs/prompts/about-us.md` (Ross's brief; ask before committing), `ref/Where its used.jpg`.

## Decisions (Ross, 19 Sep 2026, all the recommended options). Log as Q65 in docs/00 after approval

- **Hero:** Photo + Animate, `ocean-horizon-calm.jpg` (story page, so Q57 overrides docs/05 §3's "Hero Text (Navy)"). Breadcrumb Home › Company, eyebrow "Our vision", title = the vision, lead = the PDF's commitment line. The PDF shows the vision twice (hero and statement), so it now appears once.
- **Values:** pinned stage with the word carry (below), not cards or alternating rows.
- **History timeline:** skipped. No source has milestones (only "Established 2008"). Client to supply; it would slot in after Our story.
- **Leadership teaser:** names + roles, no portraits (Split media Spec table). Portraits live on Leadership & Board.

## Page, in order (grounds)

1. Page hero, Photo (above)
2. Section subnav: About · Leadership & Board · HSEQ · Sustainability (from the Company panel in navigation.ts; siblings linked, not built)
3. **Our story**, Split media Image, `layout="wide"` (20 Sep: heading, the PDF's two paragraphs verbatim in two columns, then the image as a full-width 21:9 banner; MediaFrame gained a 21:9 ratio), image `vessel-olympic-zeus.jpg` (also used elsewhere; the PDF used an offshore platform shot)
3b. **Stats band**, Feature style like Home (tint, leads on people 500+, then Established · Offices · Countries with an office; all from key-figures). Replaces the `stats` row I first built into Split media (removed, unused)
4. **Certified management systems**, Card grid Strip (white, follows the story): ISO 9001:2015 · Quality, ISO 14001:2015 · Environment, ISO 45001:2018 · Health and safety; `shield-tick` pictogram (static, it has no loop)
5. **Values** (navy), anchor `#values`: see below
6. **Meet the people leading Reach Subsea**, Split media Spec table (white): the PDF's heading and line, "Management team" = role / name × 5, "Meet our leadership" → `/company/leadership-board/`
7. **FAQ**, Accordion Split (tint): the PDF's 3 questions, answers built from key figures
8. **Work with us**, CTA Band (navy): Contact us + Open positions

Cut from the PDF: the separate vision statement (a duplicate) and the numbered bordered value cards (replaced by the stage). Added: the promise, certificates and executive names.

## Values block (`src/blocks/Values.astro`)

Split layout, chosen by Ross 20 Sep 2026 (from four layouts and three column ratios): figure pinned left (40%), each value's word + copy scrolling together on the right (60%), 96px between.

- Props: `eyebrow`, `title` (the accessible H2, visually hidden from 900 up), `values[]` (word, text, pictogram), `promise` {lead, word}. No actions (promise links cut), no progress rail (cut).
- **900 up (live):** the section turns white (padding 0) and a full-bleed navy **band** (`position: sticky`, directly under the subnav, `--values-band` = a full viewport under the subnav, never less than `--values-h` + 156px; `--values-h` = `clamp(300px, 44vh, 400px)`; content vertically centred) holds a visible eyebrow and a grid `2fr 3fr`, gap 96: the figure (square, `--values-h`) and the reel (the current value's copy, max 44rem). The page scrolls through an invisible **runway** under it (`ol.values__steps` + the promise, `--values-run` = `clamp(420px, 65vh, 680px)` per value (about 550px at a 900-tall viewport; a third of a viewport read as too fast, 20 Sep), content visually hidden; it is also the accessible list), which starts half a band up so each value, and the promise, holds for exactly one runway before the band lets go. The next reel item rises from below (clip + 24px rise, 0.12s delay) while the last leaves upward. No fades. The last item is the promise ("Everything within" `text-h1`, "Reach." display accent). JS adds `.is-live` to the layout and the `section.values`.
- **One figure, never moves:** the person is drawn once (`.values__person`: the first pictogram with everything but `.pg-person` hidden); the three subjects sit stacked over it (`.values__mark`, person hidden) and roll with a clip-path: the current one is open, earlier ones wait above (`past`), later ones below (`future`). Persons are identical across the three SVGs, so any change to the person must be made in all three.
- **JS:** the state is read from the **scroll position** (a passive scroll listener on a rAF, plus resize and load re-measures), not from an IntersectionObserver: a fling crosses a 1px line between frames, so the observer skipped Teach and Reach and the reel jumped from Learn to the promise (fixed 20 Sep 2026). It sets `data-active` (0–2, the last value during the promise), `.is-promise`, `data-state` (past · current · future) on each figure subject and reel item, and plays the loop of the value it lands on. The promise does **not** replay the Reach loop (Ross, 20 Sep): the figure just keeps standing at the target. `.is-live` gates every JS-only style.
- **Below 900 / no JS:** a plain list, eyebrow + visible H2, each value = pictogram, H3 word, text; tablet is 2 across with the lone third spanning; promise line visible with a top rule.
- Not built (rejected 20 Sep): the pinned words stage, a fully pinned swap, stacking sheets, and the reel (figure left, one word and its copy swapping in turn) — built, compared on the page, then deleted.
- **The line layout is the block's one desktop treatment** (Ross kept it and deleted the reel, 20 Sep 2026; there is no `layout` prop). The three words sit on one line at the top of the band, each wiping up into place as it is reached (`data-state` on `[data-word]`: future = hidden below its clip, current = white, past = `text/disabled`). Under the line, the value's copy is on the left and the figure on the right, centred in its own column (grid `7fr 5fr`, both row 2, centred on the row) so it balances the display type rather than sitting on the container's edge; `--values-figure` = `clamp(240px, 30vh, 340px)`. The payoff (`promise.short`, "Within Reach.") rises in where the copy was, directly under the finished, tinted line. The word line and the payoff share a fitted size (`min(display, (100vw − 2 × root padding) / 15)`), so the three words never wrap (checked at 1440, 1100 and 940).

## Pictogram loops (3.2s, rest at 0% and 100%, solid only)

- **Learn:** the right page (filled with `--pg-bg`) turns over the spine, scaleX 1 → −0.85 by 42%, then snaps back at 99.9–100% where it looks identical. The right page's lines hide at 12% and write in one by one (46–82%).
- **Teach:** the ship on the board sails out to the right (+44px), jumps to −42px and sails back in (clipped to the board).
- **Reach:** the arrow retracts along its shaft (+34px, out of the frame) and flies back in (ease-in) by 52%, wobbles −4° / +2.5° about its tip, and the rings ripple (1.35 / 1.1 / 1.06) in sequence.
- `--pg-bg` is set to `bg/default` on `.values`, so on navy it is navy-800.

## Sources and redirects

- The PDF (p30–31) wins. The promise "Everything within Reach." comes from live `/about/`, and the ISO list + management team come from dev `/company/who-we-are/about-us/`. The values text is the PDF's condensed wording; the live/dev versions (a line + 3 bullets each) were not used.
- Live `/company/who-we-are/about-us/` is a **404**; that URL only exists on dev.
- Redirect to `/company/`: `/about/` (live), `/company/who-we-are/`, `/company/who-we-are/about-us/` (dev). `/company/who-we-are/vision-values-and-promise/` → `/company/#values`.
- Raw survey notes were in the build chat's scratchpad (gone). The key copy is all in `company.ts`.

## Open with the client

- Confirm the management names and roles are current (from dev, Sep 2026).
- ISO certificate PDFs (for HSEQ).
- Company history milestones, if they want a timeline.
- A calmer or more specific photo for Our story, if Olympic Zeus is overused.

## Checking

- `node scripts/shot.mjs <url> <width> <height> <outprefix> <steps…>` drives headless Chrome over CDP, so it **can do 375** and scroll. Steps: `"#values@0"` (scroll the element to the top, minus an offset), `"[data-step='2']@250"`, `y:1200`, `full` (scrolls through to fire reveals, then captures the whole page), `js:<expr>` (prints a value). Example: `node scripts/shot.mjs http://localhost:4321/company/ 1440 900 /tmp/about "[data-step='0']@250" "[data-step='3']@300"`.
- In a `full` capture the sticky stage only shows at the top of its section: check the stage with scroll steps.
- The in-app browser pane can't screenshot while it's hidden.
- `npx astro build --outDir <tmp dir>` confirms the build without touching `dist/` (54 pages on 19 Sep).

## After Ross approves

1. docs/05: add a §3 "About" row matching the built page (replace the old one) and a §2 entry for the Values block (`reach/values`); note Split media `layout="wide"` and the MediaFrame 21:9 ratio, the 3-tile Strip and the tablet stretch fix.
2. docs/00: Q65 (decisions above + redirects + open items).
3. Figma (load the figma-use skill; one writer at a time): Values block (Desktop stage states: Learn, Teach, Reach, Promise; Mobile), the three value pictograms, Split media Wide layout, an "About us" frame on the Pages page. IDs go in `docs/extract/figma-blocks-ledger.json`.
4. Commit only the files listed as mine, by path, and push. Before committing, check the shared files still hold only my hunks (`git diff <file>`), and build the staged snapshot on its own (for example `git stash --keep-index -u`, build, `git stash pop`).
