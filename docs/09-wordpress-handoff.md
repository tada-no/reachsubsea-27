# 09 · WordPress handoff: readiness review and field contract

_21 Sep 2026. Status: **on the right path, and closer to hand-off ready.** After this review Ross decided to split the three over-flexible blocks now (Q67, done, no visual change) and to ship English only (Q68). No theme has been written, on purpose. This document is the first pass of the "Block → WP mapping" and "ACF field spec" deliverables in the brief's Phase 5 (docs/01 §7), plus an honest list of what still has to be settled before the developer starts. It was written from the code as it stands (`src/blocks/*.astro`, `src/data/*.ts`, `src/lib/types.ts`), the docs and the Figma ledger. The build passes (`npm run build`, 55 pages)._

Read with: [05-blocks-spec.md](05-blocks-spec.md) (block behaviour) · [04-components-spec.md](04-components-spec.md) (components) · [src/blocks/README.md](../src/blocks/README.md) (code conventions) · [07-live-operations.md](07-live-operations.md).

---

## 1. Verdict

**What is sound (keep doing this)**

- One block = one full-width section = one `reach/<slug>` block. Props are named like the fields, so `src/lib/types.ts` is already close to an ACF field group.
- Tokens are already emitted as `--wp--preset--*` / `--wp--custom--*` (`src/styles/tokens.css`, 183 variables), so `theme.json` is a transcription job, not a redesign.
- Content is already separated into named data files, and most of them already say which post type or options page they become (see §3).
- JS is small, vanilla, event-delegated and progressive (content is visible without JS). It ports as is.
- Long-form copy uses core blocks in the 880 column, so editors are not forced through custom blocks for articles.

**What has to be fixed or decided before a developer starts** (detail in §5)

1. **The spec lags the code.** The code has **22** section blocks. docs/05 documents 19 (the four blocks split out in Q67 now have §2.2b, §2.4b, §2.4c, §2.5b). *Lifecycle*, *Values* and *Social feed* still have no §2 entry, and Figma has 21 of the 22 (Social feed is a single Desktop component; the four split blocks, Lifecycle and Values were added 21 Sep 2026). Several variants (Page hero Video, Card grid Strip, Stats Feature, CTA Panel, Split media Wide / Quote) are built and only partly written up ("Figma to add" flags in docs/05).
2. ~~**Three blocks are too flexible for editors**~~ **Done (Q67, 21 Sep 2026).** Card grid's Bento is now **Card bento** (a `pattern` select; no per-card spans), Split media's Figures and Embed are **Figures** and **Split embed** (its unused Card media was dropped), and Stats band's Results style is **Results band**. Verified no visual change (§4 note).
3. **Prototype-only code** is mixed into the blocks (image paths through `BASE_URL`, `state` and `sample` review props, GitHub Pages URL hard-coded, typed breadcrumbs). It needs stripping or replacing (§6).
4. **The 3D World connection is a plain URL only.** The website's docs assume `?embed=1` and `?zone=1–4` exist; the world does not read them, and it has no message channel. The published scene is also two releases behind (§7).
5. **Missing handoff pieces:** no redirect map, no page specs for the ~20 unbuilt pages beyond the docs/05 §3 block lists, and no decision on who hosts the world. **Language is decided: English only (Q68)**, so fields stay single-language and no translation plugin is needed.

---

## 2. What is built and what is only specified

| Status | Pages |
|---|---|
| **Built, reviewed** | Home · Services overview · Services › Subsea · Company › About · Investors › Overview · Investors › Why invest · Careers › Overview |
| **Built, utility** | `/3d-world/` (full-viewport iframe page) · header and mega menus · footer |
| **Review routes, not pages** (do not ship) | `/blocks/*` · `/header/*` · `/live-operations-review/` |
| **Specified in docs/05 §3, not built** | Survey · Monitoring · Technology & Innovation (reuse the Subsea template) · Research & Publications · Assets overview · Asset single · Reach Remote · Reach Remote 3 & 4 · Projects archive · Project single · Leadership & Board · HSEQ · Sustainability · Charter agreements · Reports & presentations · Governance & meetings · Financial calendar · Share information · Life at Reach · Our culture · Why work with us · Newsroom · News single · Events · Press & media · Contact · FAQ · Privacy · Transparency Act · 404 |
| **Templates, not blocks** (Phase 4, not built) | Search results · news and project single layouts · archive pagination |

The header links to about 30 pages that do not exist yet, so link-checking the prototype will show many dead links. That is expected.

---

## 3. Where content lives: post types, options pages, block fields

**Rule for editors and the developer:** if a fact appears on more than one page, it is a post or an options row, never typed into a block. Blocks *pick* or *query*; they do not own the data.

| Prototype file | Becomes in WordPress | Notes |
|---|---|---|
| `key-figures.ts` | **Options page "Key figures"**: repeater `key, value, label, note`. Stats blocks pick by key | Already the single source. **One breach:** the Home bento types `statValue: '750+'` instead of picking `uncrewed-days` (`src/pages/index.astro:41`). Fix before handoff |
| `investor-results.ts` | **Options page "Latest results"**: one record, edited each quarter (headline and secondary figures, publication date, currency, report links, next report) | Feeds the Stats band Results style, Why invest, Investors overview and the investor FAQ answers |
| `investor-calendar.ts` | **Event** CPT (type = financial calendar) or Document rows with an ISO date. The Timeline Track reads it; Data list › Dates lists it | Most dates are placeholder until the client sends the calendar |
| `documents.ts` | **Document** CPT: `type` (quarterly report · annual report · sustainability · presentation · webcast · meeting notice · other), `year`, `quarter`, `date`, `file` or `url` | The live site has ~121 documents typed inline in pages with no post type, so this is a one-off **migration** for the developer. Annual reports need an optional second file (ESEF zip). Currently sample data |
| `projects.ts` | **Project** CPT: `client`, `service` (relationship), `subService`, `field`, `year`, `region` (taxonomy), `water depth`, `vessels` (relationship to Asset), summary, body, gallery | The dev CPT has no structured fields and no service relation, and the live site has 3 incompatible formats |
| `services.ts` | **Service** pages (hierarchical: line → sub-service). ACF: `pictogram`, `summary`, `capabilities` repeater (title, description, 3 scope items), `industries`, `contact` (relationship to Person). Lifecycle: an **options repeater** (phases) plus one repeater per line | The lifecycle mapping and per-phase tasks are placeholders until Reach confirms |
| `live-operations.ts` | **Options page "Current operations"**: repeater `region, asset type, label, scope, sector, since` + `updatedAt` set on save. **Regions** taxonomy (parent = group) | Hybrid AIS check later (Q54). Sample data today. Needs client sign-off on public exposure (Q55) |
| `careers.ts` | **Options page "Careers"** (recruiter, HR-Manager links) · **FAQ** CPT (topic Careers) · vacancies from the **HR-Manager feed** | The four vacancies are a 20 Sep snapshot, two already closed |
| `company.ts` | **Options page "Company"** (vision, promise, values) · **Person** CPT (management, board) · **FAQ** CPT (topic Company) · certificates from the Logo strip / Media library | |
| `navigation.ts` | **WP menus** (primary bar, Site menu, Mobile menu, Footer, legal) + one **options row per section** (intro line, overview link, featured Card) | The bar has 6 links but 7 section panels are defined (Projects and Newsroom live in the Site menu). One menu should drive desktop panels and mobile accordion (docs/06) |
| `Footer.astro` (inline) | **Options page "Site"**: address, phone, email, social links, legal links | Address, email and four columns are typed inside the component today |
| `world.ts` | **Options page "3D World"**: scene URL, careers suffix, label, payload size, zone names | See §7. Today hard-coded, with a dev/prod switch |
| `card-presets.ts`, `feed-samples.ts` | Not content. **Card presets = one template per post type** in the Feed grid query | Copy in them is placeholder |
| FAQ topics | **FAQ** CPT + `topic` taxonomy; Accordion queries by topic and outputs `FAQPage` JSON-LD | Only ~13 of ~30 dev FAQs are real (the rest Lorem Ipsum) |

Post types still to define, from docs/01 §4: **Asset** (type, status, unified spec schema, gallery, spec sheet, contact), **News** (category: news · stock exchange · report), **Event**, **Person**, **Office**, **Publication**.

---

## 4. Blocks → WordPress: the field contract

Legend for **Editor risk**: **Low** = safe as built · **Watch** = works, but see the note · **Decide** = needs a decision before build.
"Manual" = the editor writes the items in the block. "Query" = WordPress supplies them.

Every block also has the shared fields `background` (white · tint · navy, default white), `spacing` (sm · md · lg, default md) and `anchor` (optional id). `Breakpoint` is never a field: mobile is CSS.
Shared field shapes (`src/lib/types.ts`): **SectionHeader** = eyebrow, title, intro, action · **Link** = label, url, action (page · external · file · video · expand · anchor), hidden context · **Image** = attachment + alt + focal point · **Card** = see below.

| Block (`reach/…`) | Fields (the contract) | Source | Editor risk | Notes for the developer |
|---|---|---|---|---|
| **page-hero** | `style` (text · photo · video), `title`, `titleStyle` (display · h1), `eyebrow`, `badge`, `lead`, `image` + focal point, `video` (file, poster), `credit`, `meta[]` (icon, text, link), `actions[0–2]`, `animate` | Manual, plus post fields on singles (meta) | **Low** | Breadcrumb is **generated from the page tree**, not typed (prototype takes an array). Hide `loopStart` / `loopEnd`; they exist only because `hero.mp4` is a screen recording with UI baked in and goes away with a clean export. Exactly one per page, always first, always the `h1` |
| **card-grid** | `layout` (2 · 3 · 4 columns · featured-first · strip), `sectionHeader`, `media`, `surface`, `numbered`, `cards[]` | Manual, or cards picked from posts | **Low** | Bento moved out (below). Strip (icon tiles) is a different job and could be split later. `joined` is a manual padding switch; the spec says same-ground neighbours should drop padding **automatically**, which is a CSS sibling rule |
| **card-bento** | `pattern` (lead-quad · lead-tall-wide · lead-tall-trio-a · lead-tall-trio-b · trio-wide), `sectionHeader`, `cards[]` (one per cell, in order) | Manual | **Low** | **New, split from Card grid (Q67).** The editor picks a pattern and fills its cells; nobody sets a span. Patterns are in `src/data/bento-patterns.ts`. WordPress: a `pattern` select with a preview, and a card repeater whose min and max rows equal the pattern's cell count |
| **card** (shared) | `media` (none · icon · pictogram-panel · image-top · image-bg · stat), `surface`, `size`, `pictogram`, `image`, `statValue`, `eyebrow`, `badge`, `title`, `description`, `meta[]`, `links[]`, `scope[3]`, `action` | Preset per post type | **Low** | One Card, eight presets (Service, Asset, Project, News, Event, Person, Document, Office). `statValue` must come from Key figures, not typed |
| **feed-grid** | `source` (news · projects · assets · events · people · offices · documents · latest), `scope` (term, related-to-current, exclude-current), `count` (3/6/9/12), `columns`, `layout` (grid · editorial), `filters`, `showLoadMore` | **Query** | **Low** | The prototype filters a static list in the browser. Production needs server queries plus **FacetWP** (already on dev): filters write URL params so filtered views are shareable. "Latest" mixes one report, one news, one event |
| **split-media** | `media` (image · video · spec-table · numbered-list), `layout` (split · wide · stacked, stacked = numbered list only), `position`, `eyebrow`, `title`, `headingLevel`, `body` (rich text), `actions[0–2]`, `image`, `caption`, `video`, `specs[]`, `specFile`, `items[]`, `quote`, `pictogram` | Manual (`specs` from Asset fields) | **Low** | Slimmed (Q67): Figures, Embed and the (unused) Card media are gone. Use **conditional ACF fields keyed on `media`**; `specs` are the Asset spec schema |
| **figures** | `layout` (sticky · cards), `eyebrow`, `title`, `figures[]` (kicker, title, text, `figure` or `split[]`, caption, `period`) | Manual, quoting the options pages | **Low** | **New, split from Split media (Q67).** 2–4 proof points. Cards layout has the donut for a two-part split. The figures themselves should come from Latest results / Key figures, not be retyped (Why invest still types a few) |
| **split-embed** | `position`, `eyebrow`, `title`, `headingLevel`, `body`, `actions[0–2]`, `embed` (src, title, height, crop, source, link) | Manual | **Watch** | **New, split from Split media (Q67).** Text beside a cropped third-party iframe (the ir.oms.no share graph). Loads with no consent step today: route it through the Embed block's consent placeholder before launch |
| **stats** | `style` (plain · panel · feature), `stats[]` (picked by Key figures key), `featureKey`, `animate` | Options page (Key figures) | **Low** | Results style moved out (below). Max one per page |
| **results-band** | `title`, `published`, `currency`, `stats[4]` (headline), `secondary[4]`, `cards[]` (Report cards), `animate` | **Options page** "Latest results" | **Low** | **New, split from Stats band (Q67).** One record, edited each quarter; Why invest, the Investors overview and the investor FAQ follow it. Max one per page |
| **accordion** | `layout` (stacked · split), `source` (faq · manual), `topic`, `items[]` (question, answer) | **Query** FAQ CPT by topic | **Low** | `FAQPage` JSON-LD already emitted. `#faq-{slug}` deep links. Only for pages with genuine questions |
| **data-list** | `type` (reports · documents · dates · publications), `showLatest`, `tabs`, `showArchiveToggle`, `visibleYears`, facets, `count` | **Query** Document CPT | **Watch** | Four data shapes in one block. Needs the Document CPT and the migration (§3). Keep the tab ARIA and the `aria-expanded` archive toggle from the dev `downloads-table`. Newest-4-years default. Not used on any built page yet (Reports & presentations is unbuilt) |
| **timeline** | `layout` (list · track), `milestones[]` (date/`isoDate`, title, `short`, text, `kind`), `panels` (Report cards) | Manual, or investor calendar | **Low** | Track derives done / latest / next from today's date in the browser, so cached pages stay right |
| **cta** | `style` (band · inline · panel), `title`, `text` (one line), `actions[0–2]`, `showContact`, `contact` (Person), `calloutBackground` | Manual + Person | **Low** | At most one per page. Copy rule: short heading, one-line body (docs/05 §2.9) |
| **statement** | `style` (statement · quote), `eyebrow`, `statement`, `action`, `quote`, `name`, `role`, `photo` | Manual / brand statements options | **Low** | Real quotes only. Not used on any built page yet |
| **logo-strip** | `type` (logos · certifications · sdgs), `items[]` (label, logo, file, goal) | Manual / media library | **Low** | Not used on any built page yet (About uses Card grid Strip for certificates) |
| **gallery** | `type` (photos · videos), `photos[]`, `visibleCount`, `videos[]` | Manual / Asset or Project gallery field | **Low** | Lightbox and video dialog are shared (`Dialog`, rendered once per page). Not used on any built page yet |
| **embed** | `type` (3d-world · iframe · map), 3D World: `eyebrow`, `title`, `text`, `worldUrl`, `fullScreenUrl`, `poster`, `posterVideo`, `showZones`, `zones[]`; Iframe / Map: `sectionHeader`, `provider`, `url`, `iframeTitle`, `height`, consent copy, `mapImage` | Manual + global 3D World setting | **Watch** | Consent placeholder before any third-party iframe (ir.oms.no, maps). See §7 for everything the 3D World type depends on |
| **subnav** | `source` (section-pages · in-page), `label` | **Generated** from the page tree, or from block anchors | **Low** | Prototype takes typed items; production should build them from child pages so editors cannot forget one |
| **live-operations** | `intro`, `showFilters`, `action`, `fallbackFigure` (Key figures `countries`); state is derived from `updatedAt` | **Options page** "Current operations" | **Decide** | Biggest single block (1,200 lines). Needs: client sign-off on public exposure (Q55), the map decision (MapLibre GL vs the static dot map, tile host or self-hosted PMTiles), the AIS provider (Q54, none chosen). Sample data today |
| **lifecycle** | `layout` (grid · focus), `focus` (service line), `sectionHeader`; phases, rows, tasks from Services options | Options repeaters | **Decide** | **Not in docs/05 or Figma.** A bespoke visual used on Services overview and the service singles, with placeholder mapping. Keep as a locked, page-specific block |
| **values** | `eyebrow`, `title`, `values[]` (word, text, pictogram), `promise` | Company options | **Decide** | **Not in docs/05 or Figma.** Bespoke About block (Learn · Teach · Reach, ends in the promise). Keep as a locked, page-specific block |
| **social-feed** | `title`, `followUrl`, `posts[]` | LinkedIn widget | **Decide** | **Not in docs/05 or Figma. Dummy content.** Production is a LinkedIn/Elfsight embed, so this should become a styled wrapper around the Embed block, not a block with its own fields |

**How the Q67 split was checked (21 Sep 2026):** the seven built pages were measured before and after, at 1440 · 1100 · 800 · 375: every element's position, size and 16 computed styles (colour, type, padding, margin, radius, display, gap, opacity, grid placement), with reduced motion on, plus the scroll-reveal start states. Two runs of the untouched project agreed exactly, so the check has no noise. Result: zero differences.

**Templates and layout rules the developer should enforce, not the editor:**

- Page templates with a **locked starting layout** (hero first, subnav second) and `allowedBlocks` per template. Rules that must not depend on editor discipline: one `h1`, one CTA band, one Stats band per page.
- Section grounds do not have to alternate, but two same-ground neighbours drop their shared padding automatically.
- Photo tint and scrims are a CSS rule applied to core Image / Cover / Media & Text as well (docs/05 §0).
- `Dialog` and the shared JS (`motion.ts`) load once per page, not once per block.

---

## 5. Recommendations, in priority order

1. **Bring the spec level with the code.** Add §2 entries to docs/05 for Lifecycle, Values and Social feed (or decide they are page-specific and say so), write up the built variants under their blocks, and update the block count in `src/blocks/README.md` (it still says 14). Then Figma: 15 blocks exist there and about a dozen "Figma to add" flags are open. The developer will trust whichever is newest, so say which one that is: **code and docs win over Figma today**.
2. ~~Settle the three flexible blocks~~ **Done (Q67).** Still open here: Card grid Strip and Live operations are the next candidates if the developer finds them heavy.
3. **Fix the single-source breach** (Home bento `750+`) and sweep for others: "An 18 MB scene" is typed on three pages and should be one setting.
4. **Write the redirect map.** The brief assigned it to us (Q4). It does not exist as a file: redirects are scattered across page header comments and docs/00 (Company, Careers, Subsea). It needs the live and dev URL lists and a crawl, and it decides slugs that `services.ts` and `projects.ts` currently mark as placeholders.
5. ~~Decide language.~~ **Decided (Q68): English only.**
6. **Decide who hosts the 3D World** and get it to the embed contract (§7) before the WordPress build reaches the embed block.
7. **Strip prototype-only code** (§6) as part of the handoff, not after.

---

## 6. Prototype-only code the developer should not port

| What | Where | Replace with |
|---|---|---|
| `import.meta.env.BASE_URL` in image paths (26 uses) | pages, data, navigation | Media library attachments (`ImageField` = id + alt + focal point) |
| `state` prop (force Poster / Loaded / Stale / Live) and `sample` badge | Embed, LiveOperations | Remove. State is derived (`updatedAt`, consent) |
| GitHub Pages base path and `prefixRootLinks` | `astro.config.mjs` | Nothing: WordPress serves from the site root |
| Dev / prod switch for the world URL | `src/data/world.ts` | One "3D World URL" setting |
| Typed breadcrumb and subnav arrays | PageHero, SectionSubnav | Generated from the page tree |
| `set:html` for rich text (10 uses) | SplitMedia and others | Rich text field with the editor's allowed formats |
| Build-time map generation (`d3-geo`, `topojson-client`, `world-atlas`) and the `/data/world-countries.json` endpoint | `world-dots.ts`, `data/world-countries.json.ts`, LiveOperations | Ship the generated SVG and the GeoJSON as static theme files |
| MapLibre worker import (`?worker&url`, a Vite-only path) | LiveOperations | The developer's own bundle for `maplibre-gl` |
| Logo SVG read from disk at build | `Footer.astro` | Theme file or the site logo setting |
| `makeId()` counter for `aria-labelledby` | `src/lib/ids.ts` | Block-unique ids in PHP (`wp_unique_id`) |
| Client-side filtering and paging of a static list | FeedGrid, DataList | Server queries + FacetWP |
| 24 `<script>` tags in 18 files | 13 blocks, plus Dialog, Header, ReportCards, AccordionItem and BaseLayout | One view script per block (`viewScript` in `block.json`), loaded only when the block is on the page |
| Review routes and `src/demos/`, `src/review/` | `/blocks`, `/header`, `/live-operations-review` | Do not ship. Keep as the visual reference |
| Placeholder `#` links and sample data | see the list in §8 | Real files, real URLs |

---

## 7. The 3D World connection

**How it is connected today: a URL and nothing else.** The world (`~/Desktop/reach-world`) is a static bundle (one HTML page, ES modules, Draco-compressed GLB models, no framework and no build step). The website loads it in an `<iframe>` on click, or links to it. There is no `postMessage` or event channel in either direction.

**Verified against the world's source (21 Sep 2026):**

| The website assumes | The world actually does |
|---|---|
| `?embed=1` puts the world in embed mode (docs/00 Q10, `Embed.astro` appends it) | **Not implemented.** No code reads `embed`. The world's own chrome and Full screen button still show inside the iframe |
| `?zone=1–4` jumps to a zone (zone links on Home and Services, "See subsea work in 3D" on the Subsea hero) | **Not implemented.** Every zone link opens the ordinary world. Q10 said to build both in the world repo, and that has not happened |
| `?careers=1` opens "From ship to seabed" | Implemented (it only checks the parameter exists) |
| The published scene has no careers route yet (docs/00 Q66, `world.ts`) | Out of date: the published `gh-pages` build is **v44** and *does* have `?careers=1`. What is unpublished is v45–v48 ("Fly a survey line", the hoop scoring, sounds): local `main` is 4 commits ahead of origin. The Careers page copy already promises the survey line |

**Where the site links to it** (all resolve to `worldPath` / `worldSceneUrl` in `src/data/world.ts`, currently the absolute URL `https://tada-no.github.io/reach-world/`): every mega menu strip, the Site menu, the Services mobile menu, popular searches, the footer, the Home / Services / Careers embeds, the Subsea hero link, and the in-site `/3d-world/` page. Nothing yet links to the in-site `/3d-world/` page, although the code and a comment say it should.

**What an editor should be able to set** (the Embed block already models most of it): scene URL (one global setting), poster image + alt, poster loop video, title / eyebrow / text, zones on or off, zone names and numbers, the "careers" route as a preset. **Hard-coded today and should become settings:** the world origin, the `?careers=1` suffix, "An 18 MB scene" (typed on three pages), the zone names (copied from the world), the launch and exit labels, the iframe `title` and `allow` attributes (the Embed block and `/3d-world/` page differ: only the page adds `xr-spatial-tracking`), and the launch gating (900px breakpoint, `any-pointer: coarse`, Save-Data).

**What the developer must know to host it**

- **Size and load:** about 29 MB published, about 19–20 MB on first load, about 6.6 s to first render. Phones and touch devices do not launch in place: they get the poster and an "Open 3D World" link.
- **Static, no server:** relative asset paths, so it can sit in any folder or on a subdomain (for example `world.reachsubsea.com`) if the folder structure is kept. `file://` does not work. No service worker, no `SharedArrayBuffer`, no COOP/COEP requirement.
- **Framing:** if the world moves off GitHub Pages it must not send `X-Frame-Options: DENY|SAMEORIGIN` or a restrictive `frame-ancestors`, and the WordPress site's CSP must allow `frame-src` for the world origin.
- **Third-party runtime dependencies:** three.js 0.160 and its Draco decoder load from `cdn.jsdelivr.net`, and Inter from Google Fonts. Self-hosting would remove both (and the consent question).
- **Cache-busting:** bump `RELEASE` (currently `v48`) in the HTML on every change to `src/` or `glb/`.
- **Publishing is manual and personal:** `Publish demo.command` force-builds a `gh-pages` commit and pushes it. The repo (`tada-no/reach-world`) is private, the Pages site is public, and the site currently lives under the `tada-no` GitHub account. It needs a proper owner and host before launch.
- **Content that needs a developer to change:** the zones and pin copy, the careers stop wording (still marked "Draft text, Reach to confirm") and the HR-Manager URL live in the world's source, not in WordPress.
- **Legacy:** the live WordPress `/3d-world/` embeds `world.reachsubsea.com`, a Unity build, which this replaces. It needs a redirect and a decision on the subdomain.
- **Untested:** iPhone Safari, hybrid touchscreen laptops (they match `any-pointer: coarse` and lose in-place launch), and whether scrolling the page over a launched iframe is trapped by the orbit controls.

**Recommended work in the world repo before the WordPress embed is built:**
(1) read `?embed=1` and hide the world's own chrome and Full screen button; (2) read `?zone=1–4`; (3) optionally post a `ready` and `exit` message to the parent; (4) publish v48; (5) move it to the final host.

---

## 8. Placeholders and open items with the client

Nothing below may be presented as real until confirmed.

- **Sample data:** Live operations regions and assets · Investors calendar dates (only Q2 2026 and Q3 2026 are real) · documents archive · vacancies (20 Sep snapshot) · LinkedIn posts · annual report title and file · Lifecycle mapping and tasks · Feed and card presets.
- **Links pointing at `#`:** trainee programme, sustainability report, event websites, most download links.
- **Content the client has to supply:** the financial calendar · confirmation that the CEO quote is approved and the Q2 2026 webcast · real employee quotes and a benefits list (blocks Life at Reach and Why work with us) · headcount (400 on the live site vs 500+ in the PDF) · a calmer, people-free careers hero · recruiter details · the client's source HTML for the PDF mockups (requested, Q7).
- **Decisions still open:** whether Projects sits in the top nav (docs/06 §3) · target page of "Learn about the trainee program" · live operations exposure and AIS provider · map tile host · 3D World host.
- **Photos:** every photo taken from the live or dev site is approved for the prototype (Ross, 20 Sep). Licensing for launch is the client's to clear.
- **Absences, never fabricate:** testimonials, client names on live operations, share-price data other than the live OMS feed.

---

## 9. Integrations

| Service | Used for | Notes |
|---|---|---|
| ir.oms.no (Euronext OMS) | Share graph, shareholders, Newsweb iframes | Consent placeholder first. Ask OMS for a compact share-graph module so we stop cropping the standard page (`token=reach_std`) |
| Newsweb (Oslo Børs) | IR footer link | Link only |
| HR-Manager | Vacancies and applications | Feed for the vacancies list is the developer's job. Candidate portal link stays external |
| LinkedIn / Elfsight | Social rail on Home | Prototype is dummy posts |
| Mapbox or MapLibre | Live operations map, Contact map | Same custom navy style. Decide the tile host |
| YouTube-nocookie / Vimeo / mp4, qcnl.tv | Video dialog | Consent for third-party players |
| FacetWP | Feed grid and Data list filters | Already on dev |
| AIS provider | Live operations drift check | None chosen (Q54) |
| Gravity Forms | Dropped in v1 (Q39) | Contact = topic mailboxes and named contacts |
| GitHub Pages (`tada-no`) | Prototype and 3D World demo hosting | Not for production |

---

## 10. Handoff package checklist

| Deliverable (brief §7 Phase 5) | Status |
|---|---|
| Block → WP mapping | This document, §4 (first pass, needs the §5 decisions) |
| ACF field spec | §3 and §4 are the outline. The TypeScript interfaces in `src/lib/types.ts` and each block's `Props` are the ground truth |
| `theme.json` tokens | Not written, by design. `src/styles/tokens.css` (183 `--wp--*` variables) is the source; naming already follows theme.json output |
| Redirect map | **Not started.** Fragments in page header comments and docs/00 |
| Page specs | docs/05 §3 lists blocks per page; 7 built pages are the visual reference |
| Design system | Figma `HAvCQCXzWNFOKQ1AZxqNTX` (15 blocks, behind the code, see §5.1) and `docs/extract/*-ledger.json` |
| Working prototype | `npm run dev` / `npm run build`; 55 pages build cleanly |
| Copy and placeholders | §8 |
