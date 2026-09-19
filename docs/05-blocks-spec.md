# Reach Subsea 2027 — Blocks spec (Phase 3)

_Status: **Figma built and QA'd**, 15 Sep 2026 (all 14 blocks; Phase 3b code next). **17 Sep 2026 follow-up:** a 15th block, Live operations (§2.15), was added outside the original budget per explicit user request — see [07-live-operations.md](07-live-operations.md) and the `Live operations` entry in [extract/figma-blocks-ledger.json](extract/figma-blocks-ledger.json). Figma `HAvCQCXzWNFOKQ1AZxqNTX`, page **Blocks** (`12:25`). Decisions Q37–Q40 in [00-questions.md](00-questions.md): Figma first, then code (Phase 3b, Astro); photo hero = full photo + navy scrim; no forms in v1. Items marked **(proposed)** are defaults still open to change. Inputs: [01-discovery-brief.md](01-discovery-brief.md) §4, [03-client-pdf-review.md](03-client-pdf-review.md), [04-components-spec.md](04-components-spec.md), [extract/figma-components-ledger.json](extract/figma-components-ledger.json), [extract/dev-components.md](extract/dev-components.md). Build helpers: [`../figma/helpers.js`](../figma/helpers.js)._

## 0. Rules for every block

Phase 2 §0 still applies (binding, naming, states, focus ring, motion, code names). Additions for blocks:

| Topic | Rule |
|---|---|
| What a block is | One full-width `<section>` an editor can add, reorder and configure. One Figma component set `Block/<Name>` = one WordPress block `reach/<slug>`. Its fields are the handoff contract (ACF or native, the developer's call). |
| Budget | 14 custom blocks. Long-form copy (news body, legal pages, project write-ups) uses **core blocks** (Heading, Paragraph, List, Image, Table, Buttons) in the 880 column, styled by theme.json. Those don't count toward the 14. **17 Sep 2026:** Live operations (§2.15) was added as a 15th block, outside this budget, per explicit user request after the client PDF review raised it — see [07-live-operations.md](07-live-operations.md). |
| Breakpoints | Every block has `Breakpoint` Desktop (1440) \| Mobile (375). The Mobile variant sets the Layout and Typography Mobile modes. Tablet is code-only: it interpolates, and grids drop to 2 columns at 600–1199. |
| Container | Inner content max `container/wide` (1600), side padding `grid/margin`, 12-column grid (4 on mobile). Text-led blocks cap at `container/content` (880). |
| Background | `White` (default `bg/default`) · `Tint` (`bg/tint`) · `Navy` (Navy Color mode; every token flips). Figma: override the instance fill to `bg/tint`, or set Navy mode on the instance. No background variants. Code: `.has-surface-tint`, `.has-surface-navy`. |
| Vertical spacing | `Spacing` sm \| md (default) \| lg → padding y `section/sm|md|lg`. Figma: rebind the instance padding. Code: `.has-spacing-sm|lg`. Two adjacent blocks on the same background: the second drops its top padding, so bands don't double up. |
| Section header | Blocks open with the shared `Section header` (§1), except Page hero, Statement, CTA band and Section subnav. Gap to block content `stack/xl`. |
| Headings | Exactly one `h1` per page, and it lives in the Page hero. Section header titles are `h2`, card and item titles `h3`. Visual style is independent of level (a card title is `Heading/H4` but `<h3>`). |
| Landmarks | `<section aria-labelledby="{heading id}">`. Every block has an optional `Anchor` field (used by Section subnav in-page links). |
| Images | Aspect ratios 3:2 (cards, gallery), 4:3 (split media), 16:9 (video, 3D World). `object-fit: cover`, focal point from the media library. `loading="lazy"` everywhere except the Page hero, which gets `fetchpriority="high"`. |
| Conditional | Fields that are empty don't render, and neither do their wrappers (PDF p31). A block with no items renders nothing, except Feed grid filters, which show the empty state. |
| Repetition | At most one CTA band and one Stats band per page. Stats come from one options source (brief §5.3). |

## 1. Shared parts (new small components)

| Component | Variants / properties | Spec |
|---|---|---|
| `Section header` | `Align` Start · Center × `Breakpoint` (4); `Show eyebrow`, `Show intro`, `Show action` | Eyebrow Accent → `Heading/H2` → `Body/Lead` `text/secondary`, text gap `stack/sm`, max 880. **Start / Desktop:** the action Link (Medium, Page) sits at the far end of the title row, bottom-aligned. **Start / Mobile** and **Center:** the action goes below the intro. Code `.section-header` |
| `Media frame` | `Ratio` 3:2 · 4:3 · 16:9 (3); `Show play`, `Show caption` | `Image` layer on `bg/disabled` with a 24px photo icon (as Card), `radius/xl` (large media) or `radius/lg` (in grids). Play = Icon button Primary Medium centred. Caption `Body/Caption` `text/secondary`, `space/8` below |
| `Spec row` | one; `Label`, `Value` | Label and value share the row equally at every width (`1fr 1fr`), gap `space/16`, padding y `space/12`, bottom 1px `border/subtle`. Label `Body/Small` `text/secondary`, value `Body/Small` `text/primary`. Code `<dl>` |
| `Numbered item` | `Breakpoint` (2); `Number`, `Title`, `Text` | Number `Heading/H4` `text/accent` (01, 02 …, from a CSS counter), title `Heading/H5`, text `Body/Small` `text/secondary`. Desktop: number column 80 + text; Mobile: stacked. Top 1px `border/subtle`, padding y `space/24`. Code `<ol>` |
| `Milestone` | `Status` Done · Current · Upcoming (3); `Date`, `Title`, `Text` | 16px marker on a 2px `border/default` line. Done = filled `icon/accent`; Current = 2px `icon/accent` ring + Badge Accent "Now"; Upcoming = 2px `border/strong` ring. Date `UI/Eyebrow` `text/secondary`, title `Heading/H5`, text `Body/Small`. Gap `stack/sm` |
| `Logo tile` | `Type` Logo · Certificate · SDG (3); `Label`, `Show link` | Logo: 200×120, `bg/default`, 1px `border/subtle`, `radius/md`, logo max 120×56 centred. Certificate: the same tile + `UI/Label` name + Link Small File ("ISO 9001 certificate (PDF)"). SDG: official UN 120×120 tile in its own colours (UN usage rules) + `Body/Small` label |
| `Consent placeholder` | `Breakpoint` (2); `Provider`, `Text` | Stands in for any third-party embed until consent: `bg/tint`, `radius/lg`, Pictogram 64, `Heading/H5` "Content from ir.oms.no", `Body/Small` line, Button Outline Small "Load content", Link Small External "Open in new tab" |
| `Dialog` | `Type` Lightbox · Video (2) | Full viewport, Navy mode, solid `bg/tint` ground (navy/900), so no photo shows through behind a photo. Icon button Ghost `x` top right; Lightbox has prev/next Icon buttons and a "3 / 12" `Body/Small` counter + caption. `role="dialog" aria-modal="true"`, Escape closes, focus returns to the trigger |

Tabs inside a block (Data list) reuse the **Subnav item** look with `role="tablist"`. Filters reuse **Filter chip**. No new tab or chip styles.

## 2. The 14 blocks (plus §2.15, added 17 Sep 2026)

### 2.1 Page hero · `reach/page-hero`
`Style` Text · Photo × `Breakpoint` = **4**. Photo treatment = full photo + navy scrim (Q40). **16 Sep 2026: overlap variants removed** (Overlap Stats and Overlap Cards; reasoning in docs/06). Key figures go in a Stats band and latest items in a Card grid or Feed grid directly below the hero. Removed in code and Figma (the Home and Investors examples now use the plain hero).
**18 Sep 2026 (Why invest, Q57–Q58):** no gradient heroes anywhere. Photo/Video on story pages, Text on data pages. The Breadcrumb is **pinned to the top of the hero** (Photo: just under the transparent header, 72/96 + 24; the title stack stays bottom-left), no longer the first item of the stack. Drop the eyebrow when the breadcrumb and title already say it. Photo gains an `Animate` option that reuses the Video motion (title words rise, media parallax, copy lifts away). **Review round 1:** Photo no longer uses the flat 64% scrim. The photo is capped at 1920 on solid navy/900, with a directional scrim: solid under the copy on the left, a short fade into navy on the right edge, a deeper bottom ramp, and a solid bottom panel below 900. Breadcrumb gaps are tightened to 4 + 4 around each chevron (global). **Review round 4:** from 900 up, the photo is anchored right at 60% width (max 1200) on solid navy/900, so the subject sits right, the title sits on navy and the image is never zoomed or upscaled; parallax overscan −6% / −2%. **Review round 6:** the photo is capped at its native width (1,240, never enlarged) and centred, with solid navy/900 beyond it (the 60% right anchoring had left a navy band that read as a heavy left scrim). It sits under an even navy/900 tint at 45%, with short, near-equal side fades into the solid edges (navy/900 → 0 over the left 30% and the right 22%) plus a heavy scrim under the copy only: an ellipse from the bottom-left corner (85% × 75% of the photo; 90% → 60% → 0) carries the lead, so the subject at the bottom right stays lit, and a short full-width ramp (bottom 24%) joins the subnav. Why invest uses the windfarm install shot (focal 0.6 / 0.66 so the vessel stays in view); the Agalas filled its frame edge to edge and read as zoomed at any crop. **Image rule:** pick calm images for heroes (lots of sky or water, one subject toward the right, few details behind the title); if none fits, ask for a better shot rather than cropping harder. *Figma to update.*

| Part | Spec |
|---|---|
| Stack | Breadcrumb (depth ≥ 3) → Eyebrow (or Badge for asset status) → Title → Lead → Meta row → Actions. Gap `stack/md`; content cols 1–8 |
| Title | `Heading/Display` on Home and section landing pages, `Heading/H1` elsewhere (text-style override on the instance, not a variant). Always the page `h1` |
| Lead | `Body/Lead` `text/secondary`, max 880 |
| Meta row | 0–4 Meta items in a row, gap `space/24` (project client · region · depth · year; news date · read time) |
| Actions | 0–2: Button Primary + Link Page/Video. Real actions only |
| Text style | Background White, Tint or Navy (block rule). Padding top `section/md`, bottom `section/md` |
| Photo style | Image fills the block, `Overlay` layer `bg/overlay`, Navy mode forced, content bottom-left. Min height 640 (Desktop) / 520 (Mobile). A flat 64% navy scrim keeps white text at ≈5:1 even over a pure white photo; a code gradient may fade out *above* the text area only. Optional photo credit `Body/Caption` bottom right |
| Fields | eyebrow, title, lead, image + focal point, meta[], actions[0–2] |
| Replaces | All 5 PDF hero types; dev hero `.link-arrow` colour overrides |

### 2.2 Card grid (manual) · `reach/card-grid`
`Layout` 2 columns · 3 columns · 4 columns · Featured first × `Breakpoint` = **8**.
- Section header + Card instances with the same Media and Surface throughout (one card look per grid). Gap `grid/gutter`, row gap `grid/gutter`.
- Column spans: 2 → 6 cols each, 3 → 4, 4 → 3. Featured first: row 1 = Featured card (8) + Default (4), then rows of 3 Defaults.
- Media = Pictogram panel: wide (Featured) cards never share a row with narrow ones. 2 columns and Featured first both render 2 columns of wide cards (panel beside the text); 3 and 4 columns keep narrow cards. Below 1200 the wide cards stack their panel above the text.
- `Numbered` option: eyebrow auto-fills 01, 02, 03 (CSS counter), for pillars and values.
- Code: cards in a row are equal height (`align-items: stretch`) with the action pinned to the bottom (`margin-top: auto`). Figma rows align to the top, so a card whose title wraps shows taller there. The same rule applies to Feed grid.
- Mobile: 1 column; Featured becomes Default. Tablet: 2 columns.
- Cards are picked (link a post) or written in place. Manual cards default to the presets' fields.
- Replaces: feature grids, capability cards, values, benefits, 3D World zone cards (`?zone=1–4`), Contact topic mailboxes, HSEQ document cards.

### 2.3 Feed grid (dynamic) · `reach/feed-grid`
`Filters` Off · On × `Breakpoint` = **4**, plus one example instance per source.

| Setting | Values |
|---|---|
| Source | News · Projects · Assets · Events · People · Offices · Documents · **Latest** (latest report + latest news + next event, one each) |
| Card | Set by source: the matching Card preset, White surface. Latest = Document + News + Event presets side by side |
| Scope | taxonomy term (e.g. service = Survey), related-to-current-post (service ↔ project, asset ↔ project), exclude current |
| Count · columns | 3 / 6 / 9 / 12 · 3 columns (4 for Assets and People) |
| Filters | Row of Filter chips per facet (Projects: service, asset, region, year; News: category, year), single select per facet, "Clear filters" Link. Result count in `Body/Small` with `aria-live="polite"`. Filters write URL params, so filtered views are shareable. Mobile: chips scroll sideways per facet |
| More | Button Outline Medium "Load more" (not numbered pages); focus moves to the first new card |
| Empty state | `Heading/H5` "No projects match these filters" + Link "Clear filters" |
| Dev reuse | FacetWP (`.facetwp-load-more` exists on dev); CPT names from `reach-subsea-2023` |

### 2.4 Split media · `reach/split-media`
`Media` Image · Video · Spec table · Numbered list × `Position` End · Start × `Breakpoint` = **16**.
- Text side (cols 1–5): Eyebrow, `Heading/H2` (or H3 when the block follows another on the same topic), core rich text, 0–2 actions. Media side cols 7–12, vertically centred.
- **Image**: Media frame 4:3. **Video**: Media frame 16:9 with play → Video dialog (YouTube nocookie / Vimeo / mp4), plus Link Video under it. **Spec table**: Spec rows from the Asset spec schema, heading `Heading/H5`, Link File "Download spec sheet (PDF)" only if the file exists. **Numbered list**: 3–6 Numbered items (Reach Remote oversight levels, HOP).
- Mobile: Image and Video stack **above** the text; Spec table and Numbered list stack **below** it. Spec rows split label and value equally, so values like "140 t AHC" stay on one line at 375.
- Replaces: Our story, Reach Remote sections, growth strategy, vessel spec card, HOP 5-up, charter slide v1 (Image + File link, Q26).

**18 Sep 2026 (Why invest), new media options.** *Figma to add.*
- **Figures:** 2–4 points, each with a proof figure (value, or a two-part split bar such as the revenue mix) and a caption. The H2 spans cols 1–8. The figure column (1–5) is sticky and wipes to the point crossing the middle of the viewport (clip + rise, no fade). The points (kicker, H3, lead) scroll in cols 7–12, min-height 400. Mobile: no sticky, each point shows its figure inline. Best on Navy.
- **Card:** a Card (usually Image bg, Featured, min-height 560 / 440 mobile) as the media, uncovered from the right edge as it enters (`data-wipe`). `Layout` Split (default) or **Stacked** (review rounds 2 and 4, any media): heading (max 880), then `items` as 3 numbered tint cards (number above title; subgrid rows so the text lines up across cards; 1 column below 900), then an optional Card as a full-width banner (min-height 480; text max 720 bottom-left; left-to-right scrim). Why invest dropped the banner: it read as a fourth priority.
- **Embed:** an iframe cropped to `crop` px, with a source line + link below. Used for the ir.oms.no share graph (standardPage cropped to quote + chart until OMS supplies a compact module).
- Any media except Numbered list can carry `items` as a numbered list under the body copy. Numbered lists have no rule above the first item.
- **Figures · Layout Cards (review rounds 3–4, Q61):** heading, then the value points as tint cards stacked in cols 1–7. Each card's reading order is title (H4) → body → proof figure (36 → 44, right-aligned, counts up) with its caption. The split point becomes a Navy feature card (`bg/navy-800`) in cols 8–12. From 1280 up: title → donut → labels → body. The value cards alone set the row height, and the donut fills the height left over (flex 1 with size containment; the ring is the largest square that fits, max 400). The arcs are solid with **no gaps**, drawn by one masked trim-path sweep clockwise (1.4s ease-in-out); navy/200 is the counterpart and sage/400 the lead share. Under the ring the labels sit on their own arcs' sides (H4 value, then a dot and a small name). The centre shows the period in bold (`Body/Lead`) over the measure. There is no legend or caption. **Round 7:** below 1280 the 5-column card is too narrow, so the feature card spans the full width under the value cards. **768–1279:** one reading column on the left (title → body → the two shares side by side) with the donut on the right (280–360), both vertically centred. **Below 768:** stacked, with the ring as wide as the card. The sweep mask uses `userSpaceOnUse` over the full viewBox; the default bounding-box region clipped the ring's outer edge.
- Review round 1: the text column stays one flow (eyebrow · H2 · one paragraph · one action; the heading carries the key message) and both sides are vertically centred, per Figma 162:2217. The Figures swap is directional (the old figure exits up in 0.32s, the new one rises in with a 0.14s delay), and the points have no rules.

### 2.5 Stats band · `reach/stats`
`Count` 3 · 4 × `Style` Plain · Panel × `Breakpoint` = **8**.
- Optional Section header. Stat Large, `Align` Start (Center when the Section header is centred). 1px `border/subtle` vertical rules between stats (horizontal on mobile).
- Panel = a white panel in flow (`bg/default`, `radius/lg`, `Shadow/sm`) on a Tint or Navy section.
- Mobile: 4 → 2 × 2 without rules; 3 → one column with horizontal 1px `border/subtle` rules between stats.
- Values come from the **Key figures** options page (repeater: value, label, note, key); the block picks keys. No count-up animation.
- Replaces: every stat strip, the 8-stat Why invest card (split into a Stats band + Split media spec table).
- **Results style (18 Sep 2026, Why invest):** latest reported quarter from the *Latest results* options page (`src/data/investor-results.ts`). The title (H2) and an "As reported" badge + publication date sit on one row. Below them: 4 headline figures (unit · value · scale, change line with a trend arrow) under a 2px `text/primary` rule, with 1px dividers between them, then 4 secondary figures in a ruled row. The footer has the next report (calendar tile, generated .ics "Add to calendar") and the report file link. Layout: 4-up, 2×2 below 1100, unit on its own line below 600. **Review rounds 2–3:** "All figures in {currency}" follows the title; there is one 1px rule, between the headline and secondary rows. Headline figures are 32 → 40, a step below the H2 title (round 4). The footer is a full-width tint strip flush with the section's bottom edge (it bleeds via box-shadow + clip-path, so there's no scrollbar), holding three evenly spaced items (no rules): the next report (calendar tile, .ics) plus 0–2 PDF downloads (latest quarterly report, annual report). **Round 7:** from 600 to 1099 it keeps three columns, each tile above its text; below 600 it becomes one compact column (tile beside text, 32 between items). Headline figures count up with decimals kept. *Figma to add.*

### 2.6 Accordion / FAQ · `reach/accordion`
`Layout` Stacked · Split × `Breakpoint` (Split is Desktop only) = **3**.
- Stacked: Section header, then Accordion items in 880, gap `space/16`. Split: Section header in cols 1–4, items in cols 6–12.
- Source: FAQ post type by topic (query) or manual items. More than one item may be open at a time. `#faq-{slug}` deep links open and scroll to an item.
- FAQ source outputs `FAQPage` JSON-LD.
- FAQ page: one Accordion block per topic + Section subnav in anchor mode for the topic jumps.

### 2.7 Data list · `reach/data-list` (Q25)
`Type` Reports · Documents · Dates · Publications × `Breakpoint` = **8**; `Show section header`, `Show latest`, `Show tabs`, `Show archive toggle`, `Show filters`, `Show load more` (each drives only the variants that have that part).

| Part | Spec |
|---|---|
| Latest | Navy panel with the Card's Navy look (`radius/lg`, padding `space/32`, `space/24` Mobile): Badge Navy "Latest", `Heading/H4` title "Q2 2026 results", date Meta item, then 1–3 named links ("Q2 2026 report (PDF)", "Q2 2026 presentation (PDF)", "Q2 2026 webcast"). It's a panel rather than a Card instance because it holds several actions. 416 wide on Desktop, full width on Mobile |
| Tabs | Subnav item pills, `role="tablist"` (Reports: Quarterly reports · Annual reports · Sustainability reports · Other). Mobile: the row scrolls sideways |
| Reports, Desktop | Table (864, `bg/default`, 1px `border/subtle`, `radius/lg`): header `UI/Eyebrow` Year · Q1–Q4; rows = years, newest first. Each cell has the publication date (`Body/Caption`) and up to 3 Link Small labelled Report / Presentation (File) and Webcast (External), with visually hidden context ("Q2 2025 report, PDF") and a 44px target. An unpublished quarter shows "–". Newest 4 years shown, then Link Expand "Show all years (10)" |
| Reports, Mobile | The current year is open (styled as an open Accordion item) with per-quarter groups: `UI/Label` "Q2 · 20 Aug 2026" + named links. Older years are closed Accordion item instances. Same data |
| Documents | Table: Year (96) · Meeting (256: name `Body/Small` + date `Body/Caption`) · Documents (a vertical list of named Link Small File: Notice, Nomination committee recommendation, Executive remuneration report, Minutes…). Mobile: one row per meeting with a top rule: date eyebrow, `Heading/H5` meeting name, links (short labels) |
| Dates | Table capped at 880: Date (`UI/Label`, 160) · Event (`Body/Body`) · Link Small File "Add to calendar (.ics)". Mobile: rows with a top rule (date eyebrow, event, link). Confirmed dates only (PDF review) |
| Publications | Filter chips per facet (Year, Topic) + a `Body/Small` result count, then a list capped at 880. Each row: eyebrow "2025 · Monitoring", `Heading/H5` title, `Body/Small` byline, and a Link Small File "Paper (PDF)" or External "Publisher" (right side on Desktop, below on Mobile). Button Outline "Load more" |
| Row style | Header `UI/Eyebrow` `text/secondary`, rows padding y `space/16`, 1px `border/subtle` dividers, no zebra |
| Data | Document post type (type, period, year, date, file/url). The IR contact + Newsweb footer is a CTA band Inline, not part of this block |
| Dev today ([extract](extract/dev-downloads-table.md)) | `.downloads-table` has no post type or ACF: documents are typed inline in the page (Financial reports: 102 links = 68 reports, 17 presentations, 17 webcasts on Royalcast, 2012–2025; General meetings: Year · Document · Downloads with Notice / Nomination Committee / Executive Remuneration / Protocol / Appendix). The Financial calendar is a plain core table grouped by financial year. Keep its tab ARIA and `aria-expanded` archive toggle. Fix: the 15px icon-only links whose `aria-label` is just "Report", the four different Latest-card colours per tab (we use one Navy card), and the empty `__pill` elements. Moving the documents into the post type is a one-off migration for the developer |

### 2.8 Timeline · `reach/timeline` (proposed)
`Breakpoint` = **2**.
- Vertical Milestone list in cols 5–12, Section header in cols 1–4 (Mobile: stacked). Same layout at every width, so nothing breaks on phones.
- Fields: milestones[] (date, title, text, status). Status can be derived from date.
- Uses: Reach Remote 3 & 4 build, company history. The charter Gantt stays an image in v1 (Q26).
- **Layout Track (19 Sep 2026, Investors overview):** the same milestones on a horizontal time axis. The window runs from 7 months back to 8 months ahead of today (15 months). Fields added: `isoDate` (drives position and status), `kind` primary (label above the rail) · secondary (label below), `links[]`. The rail is drawn in `text/primary` up to a Today marker (`icon/accent`) and plain `border/default` after it. Done markers are filled; the newest done milestone with links is **Latest** (accent fill, and a tint panel under the track with its links). The first upcoming one is **Next**: an accent ring that keeps breathing (solid, scale only), plus a Navy panel with a Date tile, a countdown and an .ics link. Motion: the rail draws to today and each marker lands as the rail reaches it; stems and labels rise out of a clip, with no fades. Below 900 the track scrolls sideways (min 1200) and opens at today, and the panels stack. Data: `src/data/investor-calendar.ts`. New shared part **Date tile** (`src/components/DateTile.astro`, from the Results footer).

### 2.9 CTA band · `reach/cta`
`Style` Band · Inline × `Breakpoint` = **4**; `Show contact`.
- **Band**: full-width section, default Navy. Cols 1–7: `Heading/H2` + `Body/Lead`; cols 9–12: 1–2 actions, bottom-aligned. Mobile: stacked.
- **Inline**: callout inside the container, `bg/tint` (or `bg/accent-subtle`), `radius/lg`, padding `space/48` (mobile: `space/48` top/bottom, `space/40` sides). `Heading/H4` + `Body/Body` + actions.
- **Mobile (Q41, 16 Sep 2026):** the block's own padding is `space/48` top and bottom (not `section/md`), and Band insets its content to `space/40` rather than the 24 grid margin.
- `Show contact`: name `Heading/H5`, role `Body/Small`, Meta items phone + mail (IR contact, media contact).
- Max one per page. Replaces "Would you like to know more?", "Explore the full fleet", the dev footer CTA and the generic form under IR tables.

- **Panel lead (review round 4, all panels):** `Body/Lead` size, not H3.
- **Panel + contact (18 Sep 2026):** the message (H2, lead, actions left-aligned under it) sits on the left, and the person is a card on the right behind a 1px rule: eyebrow label ("Investor relations"), name H4, role, then email and phone stacked. Below 900 the card goes under the actions, behind a top rule.

### 2.10 Statement / quote · `reach/statement`
`Style` Statement · Quote × `Breakpoint` = **4**.
- **Statement**: Eyebrow + `Heading/H2`, centred, max 880, optional Link. Text comes from a brand-statements options page when chosen (PDF p31: editable brand statements).
- **Quote**: 40px `quote` icon in `icon/accent` (add Tabler `quote` to the icon set), quote in `Heading/H3`, then attribution: 56px round photo (optional) + name `UI/Label` + role `Body/Small` `text/secondary`. `<figure><blockquote><figcaption>`.
- Real quotes only (the PDF's are illustrative).

### 2.11 Logo & badge strip · `reach/logo-strip`
`Type` Logos · Certifications · SDGs × `Breakpoint` = **6**.
- Optional Section header, then a wrapping row of Logo tiles, gap `grid/gutter`. Desktop 6 per row (Logos), 4 (Certifications, SDGs). Mobile 2 per row.
- Logos: one-colour SVG in `text/secondary` where the brand allows it, otherwise the original.
- Replaces: ISO grid, SDG tiles, partner logos.

### 2.12 Media gallery · `reach/gallery`
`Type` Photos · Videos × `Breakpoint` = **4**.
- **Photos**: 3-column grid of 3:2 Media frames (first one may span 8 cols), opens the Lightbox dialog. 6 shown, then Link Expand "Show all 24 photos".
- **Videos**: Card grid of Card Image top with Link Video actions → Video dialog.
- Mobile: 2 columns (photos), 1 column (videos). No carousels.
- Source: Asset or Project gallery field, or manual.

### 2.13 Embed · `reach/embed`
`Type` 3D World · Iframe · Map × `State` Poster · Loaded (3D World) / Consent · Loaded (others) × `Breakpoint`. No forms in v1 (Q39).

| Type | Spec |
|---|---|
| 3D World | No Section header. Desktop **Poster**: container-wide 16:9 `Stage` (Navy mode, `radius/xl`, clips) with the poster still or muted loop (a still under `prefers-reduced-motion`) under the flat `bg/overlay` scrim (same treatment as the photo hero, Q40). Content bottom left, 640 wide, `space/48` inset: Eyebrow "Explore 3D World", `Heading/H2`, `Body/Body` (mention the download size), Button Primary "Launch 3D World" + Link External "Open full screen". **Loaded**: the iframe (`?embed=1`, `title="Reach Subsea 3D World"`) replaces the poster in place; top-right `Toolbar` pill (`bg/overlay`, `radius/md`) holds Link External "Open full screen" and Icon button `x` "Exit 3D World" (Exit restores the poster and returns focus to Launch). **Mobile** (also under 900px, coarse pointer or Save-Data): Media frame 16:9 poster above the text, Link External "Open 3D World" to the full-screen page plus a Caption note; Mobile Loaded is identical to Mobile Poster. Optional `Zones` row under the stage ("Jump to a zone:" + 4 Link External Small, `?zone=1–4`), block property `Show zones`. (Q9) |
| Iframe | ir.oms.no share data, Newsweb. Section header, then the Consent placeholder (**Consent**) or the iframe frame (**Loaded**: `bg/default`, `border/subtle`, `radius/lg`, required `title`, fixed height per provider: 480 Desktop / 560 Mobile as a default). |
| Map | Offices map (decide Mapbox or static image in Phase 4). Section header, then the Consent placeholder (**Consent**) or a 16:9 Media frame (**Loaded**). A static image needs no consent and skips straight to Loaded. |

Block properties: `Show section header` (Iframe, Map), `Show zones` (3D World). Consent placeholder copy per provider: Title "Load share data from ir.oms.no?" / "Load the map?", Text names the provider and says it may set cookies, actions Load (Button Outline Small) + Open in a new tab (Link External Small).

Forms are out of v1 (Q39): Contact uses topic mailboxes (Card grid) and named contacts (CTA band `Show contact`). The dev Gravity Forms slide-out and the form under IR tables are dropped.

### 2.14 Section subnav · `reach/subnav`
Uses the Phase 2 **Subnav** set as is (no new Figma component; the Blocks page gets a doc frame only).
- Source: **Section pages** (children of the section landing page, `aria-current="page"`) or **In-page** (block anchors, scroll-spy with `aria-current="location"`).
- Placement: directly under the Page hero, sticky under the header, docks to `top: 0` while the header is hidden (Q34).
- Replaces: the dev `.sidebar-hierarchy` and the PDF's dark and light pill bars.

- **Review round 1 (18 Sep 2026):** padding 16 top and bottom. No hairline in the page flow. Once docked under the header it becomes part of it: the subnav takes `shadow/sm` and the header drops its own shadow while the subnav is docked.

### 2.15 Live operations · `reach/live-operations` (added 17 Sep 2026, outside the 14-block budget)
`State` Live · Stale · Unavailable × `Breakpoint` = **3 built** (Desktop only — Mobile flagged as an open item, same precedent as the Social feed block). Full spec, data model and decision log: [07-live-operations.md](07-live-operations.md); code: `src/blocks/LiveOperations.astro`, `src/data/live-operations.ts`, `src/lib/world-dots.ts`.

- Where Reach's assets are actually working, by sea region — never a vessel position (region label points are whole degrees). Distinct from the 3D World embed's illustrative zones.
- Status line (beacon + freshness) → title ("Active in N regions today" / "Recently active in N regions" / "Working across N countries") → asset-type filter chips + map zoom controls → a world map (dot-matrix land, region pins) beside a region list column → "See our assets" link.
- Three states drive the whole block: **Live** (pulsing pins in code, "Updated N hours ago"), **Stale** (no pulse, "Last confirmed [date]", feed older than 72h), **Unavailable** (no feed: map with no pins, shorter fallback copy, no filters).
- Reuses Filter chip, Badge ("Sample data", prototype-only) and Link. Map is a stylised dot-matrix world (brand dot motif); production ships an interactive MapLibre GL map with this as its static first-paint poster (docs/07 §3).
- Home: straight after the Stats band, Live state, sample data — `<LiveOperations feed={liveOperations} />` (no `sample` prop, so no "Sample data" badge on the live page).
- Open items: Mobile not built; the code's 'radar' icon (uncrewed asset type) doesn't exist in the icon set, substituted with 'drone'; the Figma map is a stylised approximation, not the real build-time Equal Earth projection. Full detail in `extract/figma-blocks-ledger.json` → `blocks["Live operations"]`.

## 3. Page coverage check

| Page | Blocks, in order |
|---|---|
| Home | Hero Photo (Display) · Card grid Featured first (services) · Stats band · Live operations (§2.15, 17 Sep 2026) · Embed 3D World · Feed Projects · Feed Latest · CTA Band |
| Services overview | Hero Text · Card grid 2 cols (Service preset) · Split media Image (crewed/uncrewed) · Feed Projects · CTA Band |
| Service single | Hero Photo · Subnav In-page · Split media · Card grid 3 cols (capabilities) · Stats · Feed Projects (related) · Feed Assets (related) · Accordion (if FAQs exist) · CTA Band |
| Asset single | Hero Photo (Badge status) · Split media Spec table · Gallery Photos · Feed Projects (related) · CTA Inline |
| Project single | Hero Photo + Meta row · core content · Gallery · Feed Projects (same service) |
| Projects archive | Hero Text · Feed Projects with Filters |
| Reach Remote | Hero Photo · Split media Numbered list · Split media Video · Stats · Card grid · CTA Band |
| Investors overview | Hero Photo · Subnav Section pages · Timeline Track (investor year: Latest + Next) · Card grid Bento (Q2 at a glance: case, 3 stat cards, charter one-pager) · Feed News Editorial · Accordion · CTA Panel (IR contact + Newsweb). Built 19 Sep 2026 |
| Reports & presentations | Hero Text · Subnav Section pages · Data list Reports · CTA Inline (IR contact + Newsweb) |
| Share information | Hero Text · Subnav · Embed Iframe × 3 (Q27) |
| About | Hero Text (Navy) · Statement · Split media Image · Timeline · Card grid Numbered · Logo strip Certifications |
| Careers overview | Hero Photo · Split media · Stats band · Statement Quote · Card grid · CTA Band → HR-Manager |
| Newsroom / News single | Hero Text + Meta row · core content · Feed News (related) |
| Contact | Hero Text · Feed Offices · Card grid (topic mailboxes) · Embed Map |
| FAQ | Hero Text · Subnav In-page (topics) · Accordion × topics |
| Legal, 404 | Hero Text · core content |

Templates, not blocks (Phase 4): search results list, news/project single article layout, archive pagination.

## 4. Figma build plan (built 15 Sep 2026)

One doc frame per block on the Blocks page, stacked at x = 0 like the Components page: header, the variant set, a Light · Tint · Navy row on Desktop, then usage notes and the block's fields (the WP contract). Figma writes stay strictly sequential.

| # | Work | Built by |
|---|---|---|
| 1 | Shared parts: Section header, Media frame, Spec row, Numbered item, Milestone, Logo tile, Consent placeholder, Dialog; add Tabler `quote` ✅ | Opus (sets the block pattern) |
| 2 | Page hero ✅ | Opus |
| 3 | Card grid, Feed grid ✅ | Sonnet agent |
| 4 | Split media, Stats band ✅ | Sonnet agent |
| 5 | Accordion, CTA band, Statement ✅ | Sonnet agent |
| 6 | Data list ✅ | Opus |
| 7 | Timeline, Logo strip, Gallery ✅ | Sonnet agent |
| 8 | Embed (3D World first), Section subnav doc ✅ | Opus |
| 9 | QA: binding/naming audit, Desktop + Mobile screenshots, ledger `figma-blocks-ledger.json` ✅ | Opus (15 Sep: 5752 nodes, 0 unbound paints/text, 4 overflows fixed; details in ledger `finalQA`) |

## 5. Phase 3b: coded blocks (after the Figma build, Q37–Q38)

Astro, static, local. One `src/blocks/<Name>.astro` per block, props named exactly like the §2 fields. Tokens in `src/styles/tokens.css` as the custom properties theme.json will output (`--wp--preset--color--navy-800`, `--wp--custom--color--text--primary`, `--wp--preset--spacing--24`, …), with `.has-surface-navy` / `.has-surface-tint` / `.has-spacing-*` classes. Phase 2 components become partials first (Button, Link, Card + presets, Header, Footer). A `/blocks` route shows every block and variant for review. Built by parallel Sonnet agents from this spec and the Figma screenshots; Opus reviews.

**Built 15 Sep 2026.** All 14 blocks in `src/blocks/` (conventions in `src/blocks/README.md`); review at `/blocks` with Desktop 1440 and Mobile 375 iframes per block (`/blocks/frame/<slug>?only=N` isolates one variant). `npm run build` outputs 44 static pages. Every block was screenshot-checked against the Figma Blocks page at both widths. Header and Footer partials are not built yet.
Where Figma and this spec disagree, code follows Figma: Milestone gap 8 (not `stack/sm`), Logo strip SDGs 6 per row (Q43), Feed grid Latest uses Image top for Document and Event cards. CTA band mobile padding follows the Figma frames the designer updated on 16 Sep (Q41). Q41–Q44 answered.
