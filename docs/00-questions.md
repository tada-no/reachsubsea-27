# Open questions

Questions are asked in Claude with clickable options, then recorded here. You can also tick `[x]` or write under **Answer** directly.

---

_No open questions right now._

---

## Answered log

### Q69. No stray type sizes, colours or spacings (21 Sep 2026, project tidy)
Context: an audit of `src/` found 25 font sizes and 20 line heights off the token scale, 5 raw letter-spacings, 52 raw `rgb()` scrim and hairline colours, a duplicated card scrim, two hex colours in the mobile review frames and a handful of raw 2-12px gaps.
- [x] Snap to the existing scale wherever the difference is a pixel or two: 13 px labels → `caption`, 15 px → `body-sm`, FAQ question and answer → `body` and `body-sm`, the Stats band lead figure → `display`, the mobile video hero title → `h2`, map markers → `eyebrow` and `caption`
- [x] Add tokens only where a real, repeated role had none: **`display-xl`** (64 → 128, the Figures block's giant figure), **`figure`** (32 → 40, figures in cards and bands), `line-height/tight` (1.3), `letter-spacing/figure` and `letter-spacing/display-xl`
- [x] Every `rgb(27 29 59 / a)` and white-alpha becomes `color-mix()` over a palette token; the two card scrims are tokens (`--wp--custom--scrim--card-up`, `--card-across`)
- [ ] Leave the raw values

**Answer:** Done in code, with no layout change beyond about a pixel (checked on Why invest, Investors, About, Subsea, Careers and the Home mobile hero). **Left on purpose:** 1-3px rules and rings, optical nudges in `em` (`-0.05em`, `0.12em`), fixed geometry (control heights, column widths, the 22px Date tile band) and animation timings, which are choreography rather than tokens. **Figma to add:** the six tokens above (Typography and Layout collections, Desktop and Mobile modes).

### Q68. Norwegian version (21 Sep 2026, WordPress handoff)
- [x] No Norwegian version: the site is English only
- [ ] Norwegian at launch
- [ ] English first, Norwegian later

**Answer:** English only, with no translation plugin. Fields stay single-language. If a translation is ever wanted, it is a separate project (WPML or Polylang plus translatable fields).

### Q67. Split three flexible blocks (21 Sep 2026, WordPress handoff review, docs/09)
Context: the review found three blocks too flexible for editors: Card grid's Bento (a column and row span on every card), Split media (7 media types × 4 layouts, most fields apply to one type) and Stats band's Results style (a different block).
- [x] Split them now, in the prototype, before the developer starts
- [ ] Leave them for the developer

**Answer:** Split now. Built:
- **Card bento** (`reach/card-bento`): pick a `pattern`, fill its cells in order. Five patterns, lifted from the approved bentos: lead-quad (Investors), lead-tall-wide (Subsea), lead-tall-trio-a (Home), lead-tall-trio-b (Services), trio-wide (Careers). `CardField.span` removed.
- **Figures** (`reach/figures`) and **Split embed** (`reach/split-embed`) out of Split media. Split media is Image · Video · Spec table · Numbered list. The Card media (and the banner card under a stacked list) was **dropped: unused on every page** (git history and `backups/SplitMedia.astro.2026-09-21-pre-split` have it if it is wanted back).
- **Results band** (`reach/results-band`) out of Stats band, which is now Plain · Panel · Feature.
- **Checked:** no visual change. Every element's position, size and 16 computed styles on the seven built pages at 1440 · 1100 · 800 · 375 were compared before and after (zero differences), plus the reveal start states. Block count in code: 22. Demos and registry entries added for the four new blocks.
- **Figma: added 21 Sep 2026.** Doc frames on page Blocks (`12:25`): **Card bento** `310:4981` (set `312:10744`), **Figures** `314:6177` (set `316:6183`), **Split embed** `319:6246` (set `320:6274`), **Results band** `321:6312` (set `322:6434`), plus the two custom visuals that were also missing, **Lifecycle** `324:6654` (set `328:6684`) and **Values** `329:6823` (set `331:6958`). IDs and gotchas in [extract/figma-blocks-ledger.json](extract/figma-blocks-ledger.json) → `phase4Tidy21Sep`.
- **Open:** The Split embed loads its iframe without the Embed block's consent placeholder (as before): route it through consent before launch. Why invest's four reasons still type a few figures (`+84%`, `750+`, `1,172.5m`) that should be quoted from the options pages.

### Q66. Careers overview (20 Sep 2026, Careers overview)
Proposal answers and review rounds, `/careers/`:
- [x] Hero: calm sea photo (`ocean-horizon-calm`), Animate, "Open positions" to HR-Manager; the PDF's stats panel moves to the first block below the hero (never over its edge)
- [x] Vacancies: a link plus a **sample snapshot** of the live HR-Manager list (20 Sep 2026), marked as a placeholder for the developer's feed
- [x] Offshore / Onshore: the dev site's two paths were tried as cards, then dropped in review; the PDF's "Offshore & onshore, side by side" photo card covers it
- [x] "Who thrives here": heading over two text columns (About's Wide layout, no image), copy from the live page unchanged. The four value cards use the animated Learn / Teach / Reach pictograms and a new **Never leave anyone behind** one (friend drifts along a rope)
- [x] Trainees: Split media with the workshop photo (no stacked CTAs); the PDF's "Learn about the trainee program" link is back, pointing at `#`
- [x] "More about working here": the PDF's composition (three text cards to the child pages, then a wide and a narrow photo card)
- [x] CTA panel: PDF wording, short (rule in docs/05 §2.9); panel and contact stack below 1200
- [x] Backgrounds do not have to alternate white / tint / navy
- [x] **3D World banner (21 Sep 2026):** now that reach-world has a careers route (v45–v48: "From ship to seabed", five stops, "Fly a survey line"), the Careers page gets the Home page's poster embed after Trainees (Ross chose the poster embed, after Trainees), titled with the world's own start-view wording and opening the world on `?careers=1` (`worldCareersUrl` in `src/data/world.ts`). Phones get the poster plus "Open 3D World". **Open:** the published GitHub Pages scene has no careers route yet, so until reach-world is republished the link opens the ordinary world; the stop paragraphs there are still marked "Draft text, Reach to confirm"

**Answer:** Built as above; section list in docs/05 §3. **Redirects:** `/careers-subpage-contacts-questions/` (live and dev); dev `/careers/people/*`, `/careers/opportunities/*` and `/careers/explore-your-path/*` → `/careers/`; dev `/careers/why-work-with-us/life-at-reach/` → `/careers/life-at-reach/`; dev `/careers/people/our-culture/` → `/careers/our-culture/`; the other Why-work leaves → `/careers/why-work-with-us/`.
**Photos (Ross, 20 Sep 2026):** every photo taken from the live or dev site is approved for the prototype as a rule, people included; no per-photo permission questions. Client-side licensing is the client's to clear at launch.
**Open with the client:**
- Target of "Learn about the trainee program" (no trainee page in the client sitemap: new page, or a section of an existing one?)
- Dev role lists (ROV pilots, surveyors and so on: kept in the dev site's Explore your path, not shown) and the recruiter details (Alexander Nygård Bakke, from the live page)
- A calmer, people-free hero shot and a better people photo than the lounge one
- Real quotes and a benefits list (blocked for the Life at Reach and Why work with us pages)
- Headcount: 400 on the live site vs 500+ in the PDF (the page uses 500+ from `key-figures.ts`)
- Vacancies are a 20 Sep 2026 sample; two of the four closed that day
- The PDF's "Career growth" and "Meet our people" cards have no page in the sitemap; the third card links Why work with us instead
- Visa sponsorship and global rotation answers on the dev FAQ are not on the live site: left out until the client confirms

### Q64. Photo tint and scrims, site-wide (19 Sep 2026, Subsea review)
Context: Ross's Figma card (Reach-Subsea 4773:22545) screen-blends the photo over navy, so every image carries a subtle brand colour.
- [x] Site-wide on photos (hero, cards, media frames, video, social and statement photos; logos, SVGs and the 3D World poster untouched)
- [ ] Subsea page only for now
- [ ] Site-wide, but not people

**Answer:** Site-wide. Token `image-tint` = navy/900; to soften, point it at navy/800. Follow-up (same review): photo scrims never fade to 0. They ramp from `scrim/solid` (navy/900) behind the text to `scrim/floor` (navy 10%) at the far edge, on every image-bg card, bento card and Split media banner. docs/05 §0. *Figma to add both tokens and the treatment.*

### Q63. Subsea services page (19 Sep 2026, service single)
Proposal answers and review rounds, `/services/subsea/`:
- [x] Download the dev site's asset and project photos for the fleet bento and projects feed
- [x] Named contact on the CTA panel: Emil Spieler Palmers, Subsea BD Manager (shared `ServiceContact` shape in services.ts, one per service line)
- [x] Lifecycle as a **Focus** layout (the overview's Subsea row, zoomed in), not a new diagram
- [x] Hero photo: rov-supporter-subsea; title shortened to "Subsea inspection, maintenance and repair", lead to one line
- [x] Capabilities keep the PDF's **six boxes in its own wording**, as tint cards with 3-item scope lists (a first build merged them into four and read too text heavy)
- [x] **No child pages, no links** on the capability cards (they would be thin pages; the detail lives here)
- [x] "Industries we serve" (PDF pills) as an icon strip after Ross's "Where it's used" reference, not photo cards (too heavy). New Oil & gas and Offshore wind pictograms with the same loop feel (wave flow; rotor turn; crane luffs, pays out the hook line and runs a gap down the line into the sea)
- [x] Lifecycle moved up under the industries strip on **navy**, to break up the text-heavy first half; capabilities follow on white

**Answer:** Built as above; section list in docs/05 §3. **Open:** the lifecycle cell mapping and per-phase tasks are placeholders until Reach confirms. The Services overview's Subsea card sub-links point to child pages that won't exist: they should go to `/services/subsea/#what-we-do` or be dropped (overview chat), and the old dev child URLs redirect there too. The Supporter WROV depth rating is left out until confirmed.

### Q62. Investors overview: what comes back from the PDF (19 Sep 2026, Investors overview)
Context: the first build cut the PDF's share-price card, Highlights tabs and CEO letter + video.
- [x] Share price: show the live OMS graph on the Overview too (Split media Embed, same crop as Why invest)
- [x] Highlights: the "Q2 2026 at a glance" bento is the highlights; only the Q2 / Annual / Sustainability tabs stay cut (no figures behind them)
- [x] CEO letter: the PDF's Q2 quote (Jostein Alendal, CEO) + a 53 s clip from the Q4 2025 webcast (qcnl.tv, 1:30–2:23) in the video dialog

**Answer:** All three as above. Split media gained a `quote` option (quote as H3 in place of the heading, the title kept as a hidden H2). Client to supply: confirmation the quote is approved for the site, and the Q2 2026 webcast so the clip matches the quarter.

### Q61. Why invest: four reasons layout (18 Sep 2026, review round 3)
Context: with the Results band now directly above, the pinned-figure scroll took ~1,700px for ~200 words, showed one figure at a time, and repeated two figures from the band (EBIT +111%, cash 410.4m).
- [x] 2×2 figure grid: all four visible, each led by a figure the band doesn't show (+84% net profit, 750+ days, 54/46 revenue mix bar, NOK 1,172.5m equity)
- [ ] Keep the pinned scroll, shortened
- [ ] Keep as is

**Answer:** 2×2 grid, on the light (tint) background. **Review round 4:** reworked to cards on white. The three value reasons are stacked as cards (title → body → figure), and revenue mix is a feature card with a donut chart. The Results footer moved to a Navy panel with three evenly spaced items. Section grounds (round 4): Results white with a tint footer strip · Reasons white · Share tint · Strategy white (tint cards; the market opportunity banner removed) · FAQ tint · CTA tint.

### Q60. Share price on Why invest (18 Sep 2026, Why invest)
Context: the PDF's chart is sample data. The dev Share info page embeds `https://ir.oms.no/component/standardPage?token=reach_std&lang=en` (a full ~2,200px OMS page: quote, chart, profit calculator, etc.).
- [ ] Placeholder slot
- [ ] Link out only
- [ ] Styled sample chart
- [x] Use the real OMS iframe

**Answer:** Use the ir.oms.no iframe, as on the dev Share info page. Prototype: the same standard page, cropped to the quote + chart (top ~520px), plus a link to Share info for the rest. Developer note: ask OMS for a compact share-graph module token so we don't need to crop.

### Q59. Why invest additions (18 Sep 2026, Why invest)
All built from the client PDF's own data.
- [x] Proof figure per reason (cuts the separate "Proof points" section, which repeated them)
- [x] Revenue mix bar (54% oil & gas / 46% renewables & other, Q2 2026) inside reason 3
- [x] Next report date strip (Q3 2026 · 17 Nov 2026 + add to calendar)
- [x] IR contact in the CTA (Arne Joa, CFO, from the live site)

**Answer:** All four.

### Q58. Investors section subnav placement (18 Sep 2026, Why invest)
- [x] Directly under the hero, sticky; docks under the header on scroll (keeps the transparent header over the photo)
- [ ] Under the header, above the hero
- [ ] Inside the hero, bottom edge

**Answer:** Under the hero, sticky. The breadcrumb moves to the top of the hero (just under the header), apart from the title stack. Drop the eyebrow where the breadcrumb and title already say it.

### Q57. Hero direction across the site (18 Sep 2026, Why invest)
Context: the PDF uses a navy→sage gradient on Investors/Company pages and photos elsewhere.
- [x] Photo/video hero (navy scrim) on story pages; plain navy Text hero on data pages (Reports, Calendar, Governance). No gradients anywhere
- [ ] Photo everywhere
- [ ] Gradient everywhere

**Answer:** Photo + text hero. Consistency comes from shared structure (height, breadcrumb position, type, scrim), not an identical look. The gradient is dropped: it reads as generic, and the PDF only needed it because its photo heroes lacked a scrim (fixed by Q40).

### Q56. Live operations map: placement (17 Sep 2026, docs/07)
Context: the client PDF puts a "live zones" panel over the Home hero. The user decided on a standalone block instead of a hero overlay.
- [x] Home straight after the Stats band, plus the Assets overview
- [ ] Assets overview only
- [ ] Home only

**Answer:** Home after Stats + Assets overview, once the prototype is approved. The homepage is unchanged until then.

### Q55. Live operations map: public exposure (17 Sep 2026)
- [x] Sea regions with generic asset labels. No positions, no client names, no vessel names
- [ ] Regions + named vessels
- [ ] Nothing public yet

**Answer:** Regions, generic labels. Still needs the client's sign-off before anything goes public.

### Q54. Live operations map: data approach (17 Sep 2026)
Context: AIS can't see ROV spreads; a manual list goes stale. Options: manual ACF list, AIS API, or a hybrid.
- [ ] Manual ACF list, AIS check later
- [x] Hybrid from launch: manual ACF list plus a daily server-side AIS check that flags drift to the editor
- [ ] AIS API only

**Answer:** Hybrid from launch. No provider chosen or signed up to yet. Next: the client supplies the MMSI/IMO numbers of the vessels to track, and we get quotes (Datalastic, VesselFinder, MarineTraffic/Kpler, Spire) for about 10 vessels checked once a day, with satellite coverage for Brazil and SE Asia. The provider choice comes back to the user before any commitment.

### Q53. Home redesign brief (17 Sep 2026, Phase 4 — Home page)
Context: the first coded Home felt generic. The user's brief, all built the same day: container 1440; video hero (hero.mp4) at viewport height with navy side/bottom fades, animated title and CTAs, scroll parallax, no photo caption; more space above CTAs; "What we do" as a bento of mixed Card variants with no intro; Stats with no header, stats entering one by one and counting up from 0; 3D World with one CTA, no eyebrow, zones inside the stage under their own names; Selected projects removed; LinkedIn (dummy), FAQ, CTA, darker footer; the four service cards moved down into one row of portrait cards.
- [x] Built as briefed. This supersedes Q45-Q48's cuts (bento, LinkedIn row and FAQ are back on Home).

**Answer:** Built. Notes: Astro stays (everything is CSS + small vanilla JS, which ports to the WP theme as-is). hero.mp4 is a 3D World screen recording with its UI baked in, so the hero crops/fades around it and loops at 15 s before a side panel appears: a clean export without UI is wanted. Photos come from `~/Desktop/reach-world/3dw-reach images` (local, no downloads). Zone names come from the reach-world build, not the client PDF's draft names. Figma still needs the same changes (container 1440, Card Media Stat, Card grid Bento, Feed grid Editorial, CTA Panel, Page hero Video).

### Q52. Home: "Latest from Reach" and "Reach Newsroom" (17 Sep 2026)
Context: with a news card in the bento, then Latest, then Newsroom, then LinkedIn, Home had four news-like sections in a row.
- [x] Merge into one "Reach Newsroom" section with a mixed-card editorial layout (lead story + report + news + event), then LinkedIn
- [ ] Keep both

**Answer:** Merge (Claude's recommendation, accepted).

### Q51. Imagery for the prototype (17 Sep 2026)
- [x] Real Reach photos. Recommendation was to download from the dev site, but 12 suitable photos were already local in the reach-world project, so nothing was downloaded.
- [ ] Only stills from hero.mp4
- [ ] Keep placeholders

**Answer:** Real photos, sourced locally into `public/images/`.

### Q50. Header over the hero (17 Sep 2026)
Context: changes the 15 Sep "always solid white" decision for pages with a photo or video hero.
- [x] Transparent over the hero (white logo and links), solid white once scrolled or when a panel opens (`<Header overlay />`)
- [ ] Keep solid white everywhere

**Answer:** Transparent over the hero (Claude's recommendation, accepted).

### Q49. Header bar links and the hamburger menu (17 Sep 2026)
Context: eight links felt like too many. The dev site's hamburger shows featured content.
- [x] 6 links: Services, Assets, Company, Investors, Careers, Contact. Projects and Newsroom move into a reimagined Site menu (large links + latest project card + news + events + 3D World). Site menu now starts at 1200; 900-1199 gets the Mobile menu.
- [ ] 5 links, like the dev site
- [ ] 4 links

**Answer:** 6 links (Claude's recommendation, accepted).

### Q48. News on Home (16 Sep 2026, Phase 4 — Home page)
Context: the PDF has both a 3-card "Latest from Reach" spotlight (report/news/event) and a separate 4-card "Reach Newsroom" grid right below it. docs/05 §3 already specs a single "Feed Latest" block for Home.
- [x] Just Feed Latest (report + news + event) — matches the already-agreed docs/05 §3 Home row
- [ ] Replace it with a Feed News grid instead (4 recent news cards + "See all News & Reports")
- [ ] Keep both, stacked

**Answer:** Just Feed Latest. Cuts the separate Newsroom grid and the LinkedIn feed row (already flagged as placeholder-only in docs/03).

### Q47. Hero CTA #2 label (16 Sep 2026, Phase 4 — Home page)
Context: the PDF's second hero button is labelled "Beyond the surface" with no clear destination.
- [ ] Relabel it "About Reach Subsea" → /company/
- [x] Keep "Beyond the surface" as the label → /company/
- [ ] Drop the second action

**Answer:** Keep "Beyond the surface", linking to /company/.

### Q46. "Ocean operations, reimagined" bento (16 Sep 2026, Phase 4 — Home page)
Context: the PDF's bento between the hero and the stats strip has 5–6 tiles: global fleet, uncrewed pioneer, a crewed-vs-remote comparison, a "750+ uncrewed operational days" stat, and two service-image tiles that repeat the Services card grid below it.
- [ ] Cut it entirely
- [ ] Keep a 3-card "Why Reach Subsea" pillar row
- [x] Fold the 750+ stat into the Stats band

**Answer:** Fold "750+ uncrewed operational days, per quarter" into the Stats band as a 5th key figure (`uncrewed-days` in key-figures.ts); Home picks Fleet · People · Countries · Uncrewed days for its 4 stats, dropping Established for this page (kept in the data file for other pages). The rest of the bento (fleet/uncrewed pillars, the two service-image tiles, the crewed-vs-remote comparison) is cut — the Services card grid, 3D World embed and Split media on other pages already cover that ground.

### Q45. Home stats: which key figures (16 Sep 2026, Phase 4 — Home page)
Context: the PDF's Home stats strip (Established 2008 · Fleet 11 · People 500+ · Countries reached 9) didn't match the placeholder set already in `key-figures.ts` (Employees 500+ · Vessels 9 · Operating modes 2 · Remote ops centre 24/7) — both used "9" for a different fact.
- [ ] Keep the existing key-figures set
- [x] Switch to the PDF's numbers
- [ ] Add the PDF's numbers as new keys, keep both

**Answer:** Switched `key-figures.ts` to the PDF's real, current figures (Established 2008 · Fleet 11 · People 500+ · Countries reached 9), since it's the one shared stats source for the whole site. See Q46 for the 5th key added for Home specifically.

### Q41. CTA band on mobile (16 Sep 2026, Phase 3b)
Context: docs/05 §2.9 said `space/24` inside the Inline callout on mobile; Figma drew 48. The designer then updated both Mobile variants in Figma (Band `178:2767`, Inline `179:2774`).
- [x] Use the updated Figma Mobile frames: callout padding 48 top/bottom and 40 sides
- [ ] 24 on mobile, as the old spec text

**Answer:** Two follow-ups settled the conflicts with the foundations: the **Band insets its content to 40** on mobile (CTA band only — the grid margin stays 24 for every other block), and the block's own vertical padding on mobile is **48 for both styles** (`space/48`, not `section/md` = 64). Figma's Inline Mobile outer frame (24 vertical) should be updated to 48 to match.

### Q42. Gallery videos: type and duration line (15 Sep 2026, Phase 3b)
Context: Figma video cards show an eyebrow like "ANIMATION · 1:45", but the Gallery fields in docs/05 have no type or duration, so the build leaves it out.
- [ ] Add `type` + `duration` fields to each video, rendered as the card eyebrow
- [x] Leave it out and remove it from Figma

**Answer:** Leave it out. The eyebrow still needs deleting from the Figma video cards.

### Q43. Logo strip SDGs per row (15 Sep 2026, Phase 3b)
Context: the spec text says 4 SDG tiles per row; Figma shows 6.
- [x] 6 per row, as Figma (as built)
- [ ] 4 per row, as the spec

### Q44. Data list archive toggle label (15 Sep 2026, Phase 3b)
Context: the dev site swaps "Show all years" to "Show fewer years" when open. The build keeps "Show all years (N)" and flips the plus/minus icon plus `aria-expanded`.
- [x] Keep the label, flip the icon (as built)
- [ ] Swap to "Show fewer years" when open

### Q37. Phase 3 scope (15 Sep 2026, Phase 3)
Context: the brief says "Figma block specs + coded equivalents"; there is no code project yet. Spec: docs/05-blocks-spec.md.
- [x] Figma first for all 14 blocks (sequential writes), then code them as Phase 3b with parallel Sonnet agents
- [ ] Figma + code per block
- [ ] Figma only, code in Phase 4

### Q38. Prototype stack (15 Sep 2026, Phase 3)
- [x] Astro, static: one component per block, props = block fields, CSS custom properties named like theme.json output (`--wp--preset--*`, `--wp--custom--*`)
- [ ] WordPress block theme (wp-env + ACF blocks)
- [ ] Plain HTML/CSS/JS

### Q39. Contact forms (15 Sep 2026, Phase 3)
Context: dev has a Gravity Forms contact form under tables and a slide-out on every page; PDF Contact uses offices + topic mailboxes; Phase 2 built no form fields.
- [x] No forms in v1: topic mailboxes, phone and named contacts (CTA band + Card grid). Embed = 3D World · Iframe · Map
- [ ] One contact form
- [ ] Forms on key pages

### Q40. Page hero with a photo (15 Sep 2026, Phase 3)
Context: the PDF puts white text on busy photos with little scrim (~8 pages).
- [x] Full photo + flat 64% navy scrim (`bg/overlay`), text bottom-left; white text ≈5:1 even over a white photo. Same treatment as Card Image bg
- [ ] Split: text + framed photo
- [ ] Both as variants

### Q33. What does the header hamburger open at ≥1200? (15 Sep 2026, Phase 2)
Context: the header recommendation benchmarked 8 peers; only Vard uses a desktop hamburger, and it hides its nav. See docs/extract/header-recommendation.md.
- [x] Site menu: full site index + utility (FAQ, Open positions, contact, social, legal); same content as the mobile menu
- [ ] Utility links only
- [ ] No icon at ≥1200

### Q34. Sticky header behaviour (15 Sep 2026, Phase 2)
- [x] Fixed; 96 → 72 after scrolling; hides on scroll down past 400px, returns on scroll up; the subnav docks to the top while hidden
- [ ] Always visible at 72
- [ ] Static

### Q35. Header over dark photo heroes (15 Sep 2026, Phase 2)
- [x] Solid white on every template in v1; a Navy header remains possible later via the Color mode
- [ ] Transparent on photo heroes

### Q36. Contact email in footer and menus (15 Sep 2026, Phase 2)
Context: the old Figma footer says post@reachsubsea.no; the dev mega menu says post@reachsubsea.com.
- [x] post@reachsubsea.com
- [ ] post@reachsubsea.no
- [ ] Placeholder

### Q29. Header scope (15 Sep 2026, Phase 2)
Context: the dev site has mega-menu dropdowns and a solid white fixed header. The brief listed a Contact button.
- [x] Header (Desktop + Mobile) + Mega menu panel + Mobile menu panel
- [ ] Header bar only
- [ ] Simple dropdowns

**Answer:** Option 1, but the main nav is **right-aligned** plain links. **Contact is a regular link, not a highlighted button** (overused, especially in AI sites). Then search and hamburger icons. Use a powerful model to find the best solution → Opus benchmark in `docs/extract/header-recommendation.md`.

### Q30. Section subnav style (15 Sep 2026, Phase 2)
- [x] Pill bar: sticky under the header, full-radius pills, active = navy fill, hover = bg/tint, scrolls sideways on mobile
- [ ] Underline tabs
- [ ] Pills in a tint tray

### Q31. Footer content and structure (15 Sep 2026, Phase 2)
- [x] Solid navy, logo + 4 columns (Company · Services & Assets · Explore · Get in touch with phone, email, address, social) + legal row (© 2027, Transparency Act, Privacy & Cookie Policy). CTA band stays a separate block
- [ ] Mirror the top nav (7 columns)
- [ ] Dev footer as is

### Q32. Custom pictograms (old file "Icons Flat", 74 × 96px) (15 Sep 2026, Phase 2)
- [x] Import all 74 as `Pictogram/…` components bound to icon/accent; used by Card media = Icon
- [ ] Core subset
- [ ] Reference only

### Q22. Which outline icon set? (15 Sep 2026, Phase 2)
Context: the old file mixes Material, Phosphor, MDI and Remix glyphs, and the dev theme uses ad hoc fill-based inline SVGs. No existing outline system.
- [x] Tabler Outline (MIT, ~6,000 icons, true strokes, brand + subsea icons), stroke 1.5px
- [ ] Lucide
- [ ] Phosphor Regular

**Answer:** Tabler Outline, plus the custom green icons in the old Figma (`IqEKofKVdD06iF3A1Dlzrz`, node 4316:4571, "Icons Flat", 74 × 96px) are also in use.

### Q23. Card variant model (15 Sep 2026, Phase 2)
Context: image-bg has a dark scrim, so white and tint surfaces don't apply to it.
- [x] 10 × 2 sizes: media none/icon/image-top × white/tint/navy (9) + image-bg on navy (1), × Size Default | Featured = 20 variants. Hover drawn once as a spec example
- [ ] 10 × Default/Hover
- [ ] Full 12 × 2 sizes

### Q24. Supporting components added in Phase 2 (15 Sep 2026, Phase 2)
Icon and Logo (Light/Navy) are included regardless.
- [x] Icon button
- [x] External-link action (Link + Card)
- [x] Filter chip
- [x] Breadcrumb

### Q25. Basis for the Data list block (Reports, General meetings) (15 Sep 2026, PDF review)
Context: dev `downloads-table` (Latest card, tabs, year × quarter grid, archive expander, 121 real docs) vs PDF p21 (accordion by year, chips, cards, hand-typed shareholder table). See docs/03-client-pdf-review.md §1.
- [x] Dev component + PDF upgrades: publication dates, named 44px links, year→quarter list below 768px, IR contact + Newsweb footer
- [ ] Dev component as-is
- [ ] PDF accordion by year

### Q26. Charter agreement Gantt (PDF p20) (15 Sep 2026, PDF review)
Context: no dev equivalent; two Gantts, 5 bar styles; most expensive component on the site.
- [ ] Bespoke Timeline block from a repeater, stacked list on mobile
- [x] Image/PDF one-pager for v1 (fleet slide from the quarterly presentation + download)
- [ ] Leave out for now

### Q27. Share data (15 Sep 2026, PDF review)
Context: dev has 3 thin ir.oms.no iframe pages (Share info, Largest shareholders, News web); PDF hand-types a shareholder table.
- [x] One Share information page combining the live ir.oms.no embeds as sections
- [ ] Keep 3 separate pages
- [ ] Hand-maintained tables

### Q28. How to feed the review back to the client (15 Sep 2026, PDF review)
- [x] Client-facing summary page (private artifact for the user to check before sharing)
- [ ] User relays it from docs/03-client-pdf-review.md
- [ ] Annotations in Figma

### Q19. Is a neutral grey ramp needed? (15 Sep 2026, Phase 1)
Context: navy 50–400 are already near-grey. In the proposal, neutral was used only by bg/disabled and text/disabled.
- [x] Drop it. Keep white. bg/disabled → navy/100, text/disabled → navy/400. 31 primitives, 130 variables
- [ ] Keep 2–3 greys
- [ ] Keep full ramp

### Q20. Build approval (15 Sep 2026, Phase 1)
- [x] Approve and build all: variables and styles, validation, then the Foundations page with screenshot review
- [ ] Variables first, then pause
- [ ] Not yet

### Q21. Page structure of the 2027 file (15 Sep 2026, Phase 1)
- [x] Full skeleton: Cover · Foundations · --- · Components · Blocks · --- · Archive
- [ ] Foundations only

### Q15. Which light colour is the 'tint' surface? (15 Sep 2026, Phase 1)
Context: the latest old-Figma pages use #F7F9FD 21× and #F1F7F3 once. The dev theme calls #F1F7F3 `page-bg`.
- [x] Cool #F7F9FD (navy/50). Sage/50 #F1F7F3 stays for small accents (chips, highlight rows, badges)
- [ ] Sage #F1F7F3
- [ ] Both as options

### Q16. What is red for? (15 Sep 2026, Phase 1)
Context: #D53626 appears 20× in the latest old-Figma pages with no style. The dev error red is #C02B0A.
- [x] Errors only, using #C02B0A (5.9:1 on white). #D53626 dropped
- [ ] Keep as accent
- [ ] Check usage first

### Q17. Container and grid (15 Sep 2026, Phase 1)
- [x] 1600 max, 12 columns. At 1440: 64 margins, 80 columns, 32 gutters. Text column 880. Mobile: 4 columns, 16 gutters, 24 margins
- [ ] 1440 max
- [ ] 1344 max (dev today)

### Q18. Hero display size (15 Sep 2026, Phase 1)
- [x] 80px: display 80/88 desktop, 44/48 mobile; H1 64/72
- [ ] 96px
- [ ] 112px

### Q11. Token naming and Dev Mode code syntax (15 Sep 2026, Phase 1)
Context: the dev theme already uses theme.json slugs `primary`, `secondary`, `primary-light`, `page-bg`. The TADA Variable Library uses numeric primitives plus t-shirt semantic names.
- [x] WP presets: Figma names read by role (`color/text/primary`, `spacing/24`), code syntax points at theme.json preset vars (`var(--wp--preset--color--primary)`), reusing the developer's slugs
- [ ] TADA library style
- [ ] Keep dev CSS names

### Q12. Responsive type and section spacing in Figma (15 Sep 2026, Phase 1)
Context: the dev theme scales type fluidly between 500 and 1920px. The Figma plan is Pro (max 4 modes).
- [x] Desktop + Mobile modes (1440 / 375 frames). Code uses clamp() between them, tablet interpolates
- [ ] Desktop, Tablet, Mobile
- [ ] Single desktop scale

### Q13. Colour ramp structure (15 Sep 2026, Phase 1)
Context: the dev tints (5/10/25/50/75) are muddy, and there are two different `primary-10` values (#d2d2d7 vs #CACBD6).
- [x] New 50–900 ramps for navy, sage and a navy-tinted neutral, anchored on the exact brand hexes; keep #f1f7f3 and #f7f9fd as named backgrounds; old→new mapping shown for approval
- [ ] Keep dev tints
- [ ] Minimal palette

### Q14. Colours inside navy sections and cards (15 Sep 2026, Phase 1)
- [x] Surface modes: the semantic Color collection has Light and Navy modes, so setting the mode on a section or card flips its text, border and button tokens (one CSS class in WP)
- [ ] Separate on-navy tokens

### Q1. Newsroom: keep the News archive and Events? (15 Sep 2026)
- [x] Keep both under Newsroom: News & announcements, Events, Press & media

### Q2. Where do Reach Remote and Explore 3D World sit? (15 Sep 2026)
- [x] Reach Remote under Assets, 3D World under Services

**Answer:** 3D World will/should also be a large feature on the home page. It's based on the local build at `http://localhost:8765/reach-ocean-realism.html` (`~/Desktop/reach-world`).

### Q3. Page-level FAQs (15 Sep 2026)
- [x] Only on pages with genuine questions, pulled from the FAQ post type by topic

### Q4. Redirect map and content migration (15 Sep 2026)
- [x] Claude drafts the redirect map (cheap agent), the developer implements it

### Q5. Hosting for the coded prototype review links (15 Sep 2026)
- [x] Local only for now, decide later

### Q6. Same developer as the `reach-subsea-2023` theme? (15 Sep 2026)
- [x] Yes, same developer. Reuse their post types and field names where sensible.

### Q7. Client source HTML for the PDF mockups (15 Sep 2026)
- [x] Still waiting (the user has asked the client)

### Q8. How should we use the awesome-design-md library? (15 Sep 2026)
- [x] Keep it as reference only for now

### Q9. How should the 3D World work as the big home page feature? (15 Sep 2026)
Context: the scene is a 15–19 MB download with ~6.6s to first render, and phones struggle.
- [x] Poster, click to load in place. A large still or short loop with a "Launch 3D World" button; the live scene loads only on click. Phones get the poster plus a link to the full-screen version.

### Q10. Add zone deep links and an embed mode to the 3D World? (15 Sep 2026)
Context: the page only reads `?q=` (quality) and `?v=` (build) today.
- [x] Yes, in its own chat or task in `~/Desktop/reach-world` (`?zone=1–4`, `?embed=1`), keeping this project's chat on the website
