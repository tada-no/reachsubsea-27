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
5. **Missing handoff pieces:** no redirect map, no page specs for the ~20 unbuilt pages beyond the docs/05 §3 block lists, and no named host for the world yet (it stays a separate app reading WordPress over an API, Q94 / §7.1). **Language is decided: English only (Q68)**, so fields stay single-language and no translation plugin is needed.

---

## 2. What is built and what is only specified

| Status | Pages |
|---|---|
| **Built, reviewed** | Home · Services overview · Services › Subsea · Company › About · Investors › Overview · Investors › Why invest · Careers › Overview |
| **Built, awaiting review** | Investors › Governance & general meetings (7 Oct 2026, Q121; new block Meeting archive, docs/05 §2.24) · FAQ (7 Oct 2026, Q126; every FAQ from the FAQ post type, `src/data/faqs.ts`) · Newsroom archive and News single (8 Oct 2026, Q145; templates in `src/templates/`, all 189 live posts) |
| **Built, utility** | `/3d-world/explore/` (full-viewport iframe page) · header and mega menus · footer |
| **Review routes, not pages** (do not ship) | `/blocks/*` · `/header/*` · `/live-operations-review/` |
| **Specified in docs/05 §3, not built** | Survey · Monitoring · Technology & Innovation (reuse the Subsea template) · Research & Publications · Assets overview · Asset single · Reach Remote · Reach Remote 3 & 4 · Projects archive · Project single · Leadership & Board · HSEQ · Sustainability · Charter agreements · Financial calendar · Share information · Life at Reach · Our culture · Why work with us · Events · Press & media · Contact · Privacy · Transparency Act · 404 |
| **Templates, not blocks** (Phase 4) | Search results · project single layout not built. News archive, News single and Pagination are built (Q145, §3 News) |

The header links to about 30 pages that do not exist yet, so link-checking the prototype will show many dead links. That is expected.

---

## 3. Where content lives: post types, options pages, block fields

**Rule for editors and the developer:** if a fact appears on more than one page, it is a post or an options row, never typed into a block. Blocks *pick* or *query*; they do not own the data.

| Prototype file | Becomes in WordPress | Notes |
|---|---|---|
| `key-figures.ts` | **Options page "Key figures"**: repeater `key, value, label, note`. Stats blocks pick by key | Already the single source. **One breach:** the Home bento types `statValue: '750+'` instead of picking `uncrewed-days` (`src/pages/index.astro:41`). Fix before handoff |
| `investor-results.ts` | **Options page "Latest results"**: one record, edited each quarter (headline and secondary figures, publication date, currency, report links, next report) | Feeds the Stats band Results style, Why invest, Investors overview and the investor FAQ answers |
| `investor-calendar.ts` | **Event** CPT (type = financial calendar) or Document rows with an ISO date. The Timeline Track reads it; Data list › Dates lists it | Most dates are placeholder until the client sends the calendar |
| `charters.ts` | **Asset** post, field group "Charter" (only on vessels): `charterType` select (long-term · project · owned; empty = not on the chart), `start` (month, or year only for a newbuild), `firmEnd` (month; empty = open-ended), `options` repeater (`months`), `quarterStatus` (textarea). One row per vessel, so Reach Remote 1–4 need one Asset post each (the prototype's assets.ts pairs them for the Assets cards and uses a `unit` index here), `note` (text). Plus two fields on an **Investors options page**: the period the statuses describe ("Q2 2026") and the source line. The Charter timeline block (docs/05 §2.26) has no data fields beyond `fleet` (Chartered · Owned): it queries vessel Assets, groups by type, sorts by firm end and writes the period text ("Apr 2022 – Apr 2027, 2 × 1-year options") itself | Quarterly update = each vessel's status + the period label. Use the same generated text for the Assets cards' Charter row, replacing assets.ts's typed `charter` strings, so a period lives in one place. Compute Today server-side (cache daily) |
| `documents.ts` | **Document** CPT: `type` (quarterly report · annual report · sustainability · presentation · webcast · meeting notice · other), `year`, `quarter`, `date`, `file` or `url` | The live site has ~121 documents typed inline in pages with no post type, so this is a one-off **migration** for the developer. Annual reports need an optional second file (ESEF zip). Currently sample data |
| `projects.ts` | **Project** CPT: `client`, `service` (relationship), `subService`, `field`, `year`, `region` (taxonomy), `water depth`, `vessels` (relationship to Asset), summary, body, gallery | The dev CPT has no structured fields and no service relation, and the live site has 3 incompatible formats |
| `services.ts` | **Service** pages (hierarchical: line → sub-service). ACF: `pictogram`, `summary`, `capabilities` repeater (title, description, 3 scope items), `industries`, `contact` (relationship to Person). Lifecycle: an **options repeater** (phases) plus one repeater per line | The lifecycle mapping and per-phase tasks are placeholders until Reach confirms |
| `live-operations.ts` | **Options page "Current operations"**: repeater `region, asset type, label, scope, sector, since` + `updatedAt` set on save. **Regions** taxonomy (parent = group) | Hybrid AIS check later (Q54). Sample data today. Needs client sign-off on public exposure (Q55) |
| `careers.ts` | **Options page "Careers"** (recruiter, HR-Manager links) · **FAQ** CPT (topic Careers) · vacancies from the **HR-Manager feed** | The four vacancies are a 20 Sep snapshot, two already closed |
| `company.ts` | **Options page "Company"** (vision, promise, values) · **Person** CPT (management, board) · **FAQ** CPT (topic Company) · certificates from the Logo strip / Media library | |
| `people.ts` | **Person** CPT: `group` (management · board), `order`, `role`, `chair`, `portrait` (focal point), `phone`, `email`, `born`, `since`, `bio`. Feeds Leadership & Board (Profiles grid + rows), About's management table and the Leadership FAQ answers | Phones and emails are the dev site's, to confirm; Hilde Drønen's year on the board is missing |
| `navigation.ts` | **WP menus** (primary bar, Site menu, Mobile menu, Footer, legal) + one **options row per section** (intro line, overview link, featured Card) | The bar has 6 links but 7 section panels are defined (Projects and Newsroom live in the Site menu). One menu should drive desktop panels and mobile accordion (docs/06) |
| `Footer.astro` (inline) | **Options page "Site"**: address, phone, email, social links, legal links | Address, email and four columns are typed inside the component today |
| `world.ts` | **Options page "3D World"**: scene URL, careers suffix, label, payload size. Zone names come from the `world_zone` posts (§7.1) | See §7. Today hard-coded, with a dev/prod switch |
| `card-presets.ts`, `feed-samples.ts` | Not content. **Card presets = one template per post type** in the Feed grid query | Copy in them is placeholder |
| `faqs.ts` | **FAQ** CPT `faq` (title = question, content = answer, slug = the `#faq-{slug}` deep link, `menu_order` = list order) + hierarchical **`faq_topic`** taxonomy: six parent terms (general · services · assets · company · investors · careers) = the FAQ page's groups and their overview pages' topics; child terms = the other pages (subsea, hseq, governance…). A FAQ on several pages is one post with several terms; its primary term (Yoast / Rank Math) places it on the FAQ page. Accordion source FAQ: `tax_query` on the block's `topic`, `include_children` false, by `menu_order`, first item open. FAQ page: one Accordion per parent term, children included, each post once, one `FAQPage` JSON-LD for the page | 58 FAQs from 19 built pages (7 Oct 2026, Q126); the dev site's ~30 (about 17 Lorem Ipsum) are replaced. Answers that quote a figure, a person or a list are built from the data files in the prototype: use the Key figures / Latest results shortcodes or block bindings there so they can't go stale. Answers never say "above" or "on this page" |

Post types still to define, from docs/01 §4: **Asset** (type, status, unified spec schema, gallery, spec sheet, contact), **Event**, **Person**, **Office**, **Publication**.

### News (Q145, 8 Oct 2026): ordinary Posts, migrated from the live site

News is **not a custom post type**: the core `post` type with the core categories **News** and **Reports**, exactly as on the live site, so the migration is a WordPress export/import of 189 posts plus their media. No ACF fields. `scripts/import-news.mjs` pulls the same posts into the prototype and is the reference for each clean-up step below.

| Setting | Value |
|---|---|
| Permalinks | `/newsroom/%postname%/`; category base `newsroom/category`; posts page = Newsroom (`/newsroom/`) |
| Redirects | `docs/extract/news-redirects.csv`: the 189 live root URLs (`/<slug>/`) → `/newsroom/<slug>/`, plus `/news/` and the two category archives |
| Archive | home.php and category.php: lead = newest post on page 1 only, then 10 a page. Offset the main query by one (`pre_get_posts` sets `offset` = 1 + (paged − 1) × 10, and `found_posts` is reduced by one so `paginate_links()` counts right). Chips link to the category archives with `count` from the term |
| Cards | Card image-top, White: date (no read time), a "Report" badge for the Reports category only, title, summary (the excerpt without its dateline, 3 lines), Read more. Default featured image for the 5 posts without one: `ocean-horizon-calm.jpg` |
| Single | single.php: light article header in the 880 column, not the Page hero (breadcrumb ending at the category archive, title, date, read time = words / 200, rounded up), featured image, `the_content()` in the 880 column, 3 related posts from the same category, press CTA |

**Migration clean-up** (what the import script does, which the real import has to repeat):
1. **Dates:** 109 posts share the bulk-import timestamp 21 Mar 2023 18:31. Set each to the date in `scripts/news-dates.json` (Q146): 83 from the matching Oslo Børs Newsweb release (message id included), 15 estimated from the text or the image upload month (month only: use the 1st and keep the note), 11 with no evidence (recommend not migrating them; Reach to decide)
2. **Markup:** remove 133 empty paragraphs and 364 `&nbsp;`; drop inline styles and classes; unwrap empty Columns and Groups; one subheading level (the posts mix h2–h5 for the same job, often with `<strong>` inside); `<p><img></p>` from the classic editor becomes an Image block
3. **Links:** 7 Outlook "safe links" pasted from email → their real `url=` target; `http://` and `www.reachsubsea.com` → the new site; links to other posts → their `/newsroom/` URL
4. **File blocks:** remove the PDF `<object>` preview (33 posts), keep the link; the theme renders File and Buttons as the Link component (download icon for PDFs)
5. **Gallery plugin:** 2 posts use "Simply Gallery" (`pgcsimplygalleryblock`); replace with a core Gallery so the plugin can go
6. **Images:** 56 of 112 body images are already 404 on the live site (old imgix CDN = 410), in 28 posts; 14 were found as the original upload. The import drops the dead ones; restore them from a backup if one exists. No featured image has alt text
7. **Lead paragraph (Q147):** register a "Lead" block style on core/paragraph (`is-style-lead`: Lead size, text/primary) and set it on the first paragraph of a story with 4+ paragraphs when that paragraph is a sentence of 15+ words (after a bare dateline, the next one). The prototype marks it `article-lead`. Drop any bold inside that paragraph (Q152: nine posts bold the whole lead or its dateline)
8. **Embeds:** webcast iframes (qcnl.tv, companywebcast, royalcast) and one Vimeo stay as Embed blocks behind the consent placeholder; old webcasts may have expired
9. **Photo tint (Q151):** the featured image and every core/image in a post (not SVGs) take the site's photo tint. A post image can have a caption, so the tint is a layer under the img (figure as a one-cell grid, `::before` behind the img, img `mix-blend-mode: screen`), not the figure's background (base.css, "Story photos")
10. **Body clean-up (Q153), `scripts/news-cleanup.mjs`:** drop "-ENDS-"/"TILBAKE" lines; join email hard wraps and split paragraphs run together with `<br>`; short labels typed as paragraphs ("2Q 2026 highlights:", ALL CAPS) become Headings, whole sentences typed as Headings become Paragraphs; wrap the press boilerplate (from "For more information please contact:" / "About Reach Subsea" / the disclosure notice to the end) in a Group with the "Boilerplate" style (Body small, grey, stack--xl above); drop a "please contact:" line left with nothing under it. Story text runs at `--wp--custom--measure--prose` (720; 32em since Q159), media at the 880 content size
11. **Valid markup (Q143), the same script's step 6:** an email or www. address typed without its scheme gets `mailto:` / `https://`; any other link whose href isn't a URL (a date typed into the link field) is unwrapped; `<em>`/`<strong>`/links wrapped around whole paragraphs are unwrapped; the boilerplate Group and file/button rows must sit at the top level of the post (inside a table they unwrap); finally every body is balanced as a browser parses it (WordPress: `force_balance_tags()` on import). Checked with html-validate (`html-validate:standard`): zero errors on every post
12. **Labels, release links and leads (Q155), the same script's steps 7–9:** in the boilerplate every label ("About Reach Subsea", "For more information please contact", "Contact information"; typed bold or not, alone or joined to its text with a line break) becomes a bold paragraph of its own without the colon (128). In the story: "Webcast link: <address>" becomes a Buttons/link row "Watch the webcast" (18); download links typed as the lines of one paragraph, or left loose outside a paragraph, become a file row and their "Download … here:" label goes (26); a file already in an earlier row isn't listed twice (18); empty links go (4); an address typed as text, or linked with itself as the label, becomes a short link ("reachsubsea.no", "hydro.gov.au/NHP"; 84); a bold-only label ("Quarterly presentation") becomes a Heading (19) and a heading repeated straight after itself goes. Leads over 45 words keep their opening sentence(s) (10–45 words) and the rest becomes the next Paragraph (41); where no sentence ends in that range the lead style comes off (8)
13. **Polish (Q156), the same script's step 10:** drop an uncaptioned copy of the featured image from the body; curly-quote entities become characters and reversed or space-padded marks are fixed; the script's `CORRECTIONS` table holds 17 one-off quote/line-break fixes in 11 posts (apply as find/replace, or by hand); join paragraphs and line breaks broken mid-sentence; "– "/"• " paragraphs become a List, "o" sub-items a nested List. Titles: a no-break space before a dash (`titleDashes` in import-news.mjs). Theme: captions and tables at the prose measure (720)
14. **Leads, quotes and contacts (Q159), the same script's steps 9–10:** the dateline ("Haugesund, 18 August 2026 –") leaves a release's lead (the post date shows in the meta); a dated lead under 25 words takes the next paragraph's opening sentences up to 50. Quote blocks: the speaker goes in the citation (from a name and title after the last sentence, or a closing ", said <name>, <title>."), marks round a whole cited quote go, a quote naming its speaker inside gets marks round the quoted words, missing full stops added, empty quotes removed. Boilerplate names linked to /contact/ become plain text. Editors: a Quote block always fills its Citation; use the Lead style for one paragraph of up to ~50 words. Theme: `--wp--custom--measure--prose` is 40em (720 for Body at desktop, narrower with each smaller text style) on all running text: post content, legal pages, the project story and FAQ answers; lists, quotes and button/file rows `space/24` from the text, a button/file row's first and last item pulled up/down by their 12px of target padding; the featured image on single.php is cropped to 3:2 (`aspect-ratio: 3/2; object-fit: cover`)

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
| **data-list** | `type` (reports · documents · dates · publications), `showLatest`, `tabs`, `showArchiveToggle`, `visibleYears`, facets, `count` | **Query** Document CPT | **Watch** | Four data shapes in one block. Needs the Document CPT and the migration (§3). Keep the tab ARIA and the `aria-expanded` archive toggle from the dev `downloads-table`. Newest-4-years default. Not used on any built page: Reports & presentations (built 7 Oct 2026) uses the Results archive, Report shelf and File list blocks instead (docs/05 §2.21–2.23); type Reports can go once that page is approved |
| **timeline** | `layout` (list · track), `milestones[]` (date/`isoDate`, title, `short`, text, `kind`), `panels` (Report cards) | Manual, or investor calendar | **Low** | Track derives done / latest / next from today's date in the browser, so cached pages stay right |
| **cta** | `style` (band · inline · panel), `title`, `text` (one line), `actions[0–2]`, `showContact`, `contact` (Person), `calloutBackground` | Manual + Person | **Low** | At most one per page. Copy rule: short heading, one-line body (docs/05 §2.9) |
| **statement** | `style` (statement · quote), `eyebrow`, `statement`, `action`, `quote`, `name`, `role`, `photo` | Manual / brand statements options | **Low** | Real quotes only. Not used on any built page yet |
| **logo-strip** | `type` (logos · certifications · sdgs), `items[]` (label, logo, file, goal) | Manual / media library | **Low** | Not used on any built page yet (About uses Card grid Strip for certificates) |
| **gallery** | `type` (photos · videos), `photos[]`, `visibleCount`, `videos[]` | Manual / Asset or Project gallery field | **Low** | Lightbox and video dialog are shared (`Dialog`, rendered once per page). Not used on any built page yet |
| **embed** | `type` (3d-world · iframe · map), 3D World: `eyebrow`, `title`, `text`, `worldUrl`, `fullScreenUrl`, `poster`, `posterVideo`, `showZones`, `zones[]`; Iframe / Map: `sectionHeader`, `provider`, `url`, `iframeTitle`, `height` (desktop · tablet · mobile, px of provider content), `bleedMobile`, consent copy, `mapImage` | Manual + global 3D World setting | **Watch** | Consent placeholder before any third-party iframe (ir.oms.no, maps). See §7 for everything the 3D World type depends on |
| **subnav** | `source` (section-pages · in-page), `label` | **Generated** from the page tree, or from block anchors | **Low** | Prototype takes typed items; production should build them from child pages so editors cannot forget one |
| **live-operations** | `intro`, `showFilters`, `action`, `fallbackFigure` (Key figures `countries`); state is derived from `updatedAt` | **Options page** "Current operations" | **Decide** | Biggest single block (1,200 lines). Needs: client sign-off on public exposure (Q55), the map decision (MapLibre GL vs the static dot map, tile host or self-hosted PMTiles), the AIS provider (Q54, none chosen). Sample data today |
| **lifecycle** | `layout` (grid · focus), `focus` (service line), `sectionHeader`; phases, rows, tasks from Services options | Options repeaters | **Decide** | **Not in docs/05 or Figma.** A bespoke visual used on Services overview and the service singles, with placeholder mapping. Keep as a locked, page-specific block |
| **values** | `eyebrow`, `title`, `values[]` (word, text, pictogram), `promise` | Company options | **Decide** | **Not in docs/05 or Figma.** Bespoke About block (Learn · Teach · Reach, ends in the promise). Keep as a locked, page-specific block |
| **profiles** | `layout` (grid · rows), `sectionHeader`, `people[]` (name, role, roleTone, portrait + focal point, meta, bio, contacts[]) | **Query** Person CPT (`group` management → grid, board → rows) | **Low** | Added 6 Oct 2026 (docs/05 §2.18). Bios stay open (no expand). Management portraits are square head-and-shoulders crops (Q104). Not in Figma yet |
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
6. **Name the 3D World's host and owner**, get it to the embed contract (§7), and build the content API (§7.1) before the WordPress build reaches the embed block.
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

**Where the site links to it (Q95–Q96, Q108, 6 Oct 2026; `src/data/world.ts`):** menu strips, the Site menu, popular searches, the footer and the Services overview hero go to the landing page `/3d-world/` (`worldPagePath`; Home › Explore 3D World, not under Services, Q108). Everything that opens the world goes to the in-site `/3d-world/explore/` page (`worldPath`): the landing page's Launch and zone cards, the embeds' "Open full screen" and zone links, the service heroes, the Careers banner (`?careers=1`). That page frames the scene (`worldSceneUrl`, the published build) full height under a solid header, with `?embed=1` and `zone` / `careers` passed through. Only the in-place poster embeds load `worldSceneUrl` directly. In WordPress: `/3d-world/` is an ordinary page (the landing page) and `/3d-world/explore/` its child, a page template with the header and no footer, reading the scene URL from the "3D World" options page. The live site's `/3d-world/` keeps working: old links land on the landing page, one click from the world, so no redirect is needed.

**What an editor should be able to set** (the Embed block already models most of it): scene URL (one global setting), poster image + alt, poster loop video, title / eyebrow / text, zones on or off, zone names and numbers, the "careers" route as a preset. **Hard-coded today and should become settings:** the world origin, the `?careers=1` suffix, "An 18 MB scene" (typed on three pages), the zone names (copied from the world), the launch and exit labels, the iframe `title` and `allow` attributes (the Embed block and `/3d-world/` page differ: only the page adds `xr-spatial-tracking`), and the launch gating (900px breakpoint, `any-pointer: coarse`, Save-Data).

**What the developer must know to host it**

- **Size and load:** about 29 MB published, about 19–20 MB on first load, about 6.6 s to first render. Phones and touch devices do not launch in place: they get the poster and an "Open 3D World" link.
- **Static, no server:** relative asset paths, so it can sit in any folder or on a subdomain (for example `world.reachsubsea.com`) if the folder structure is kept. `file://` does not work. No service worker, no `SharedArrayBuffer`, no COOP/COEP requirement.
- **Framing:** if the world moves off GitHub Pages it must not send `X-Frame-Options: DENY|SAMEORIGIN` or a restrictive `frame-ancestors`, and the WordPress site's CSP must allow `frame-src` for the world origin.
- **Third-party runtime dependencies:** three.js 0.160 and its Draco decoder load from `cdn.jsdelivr.net`, and Inter from Google Fonts. Self-hosting would remove both (and the consent question).
- **Cache-busting:** bump `RELEASE` (currently `v48`) in the HTML on every change to `src/` or `glb/`.
- **Publishing is manual and personal:** `Publish demo.command` force-builds a `gh-pages` commit and pushes it. The repo (`tada-no/reach-world`) is private, the Pages site is public, and the site currently lives under the `tada-no` GitHub account. It needs a proper owner and host before launch.
- **Content that needs a developer to change (today):** the zones and pin copy, the careers stop wording (still marked "Draft text, Reach to confirm") and the HR-Manager URL live in the world's source, not in WordPress. Q94 moves all of it to WordPress, served over the API below.
- **Legacy:** the live WordPress `/3d-world/` embeds `world.reachsubsea.com`, a Unity build, which this replaces. `/3d-world/` becomes the landing page (Q108), so its URL needs no redirect; the subdomain still needs a decision.
- **Untested:** iPhone Safari, hybrid touchscreen laptops (they match `any-pointer: coarse` and lose in-place launch), and whether scrolling the page over a launched iframe is trapped by the orbit controls.

**Recommended work in the world repo before the WordPress embed is built:**
Superseded by the brief for the 3D World chat, `docs/prompts/3d-world-embed.md` (6 Oct 2026): read `?zone=1–4`; post `reach-world:release-focus` on a final Escape; `target="_top"` for site links; `?embed=1` keeps Full screen; content from the WordPress API (§7.1); real names for "Vessel 1/2"; publish v59; a Reach-owned host that allows framing by reachsubsea.com (`frame-ancestors`); self-host three.js, Draco and Inter.

### 7.1 Content from WordPress over an API (Q94, 6 Oct 2026)

**Decided with the developer:** the world stays a separate static app on its own host. WordPress owns its content and serves it through one read-only REST endpoint. The world fetches it on load.

**Endpoint:** `GET https://www.reachsubsea.com/wp-json/reach/v1/world`. Public, no auth, GET only. One custom route shaped for the world, rather than the core `wp/v2` routes: one request instead of four, and linked posts arrive already resolved.

```json
{
  "version": "2026-10-06T12:00:00Z",
  "zones": [
    { "slug": "pipelines", "number": 1, "name": "Subsea Infrastructure", "blurb": "…",
      "service": { "label": "Subsea", "url": "https://www.reachsubsea.com/services/subsea/" } }
  ],
  "markers": [
    { "slug": "vessel", "zone": "pipelines", "name": "Viking Vigor", "sub": "Support vessel",
      "text": "…", "image": { "url": "…", "alt": "…", "width": 1200, "height": 800 },
      "link": { "label": "See the fleet", "url": "https://www.reachsubsea.com/assets/#vessels" } }
  ],
  "careers": { "stops": [ { "slug": "…", "eyebrow": "…", "title": "…", "text": "…" } ],
               "vacanciesUrl": "https://hr-manager.net/reachsubsea" },
  "links": { "contact": "https://www.reachsubsea.com/contact/", "home": "https://www.reachsubsea.com/" }
}
```

**WordPress content model**

| Content | WordPress | Fields | Notes |
|---|---|---|---|
| Zones | Post type `world_zone` (4 posts) | `slug`, `number` (1–4, the `?zone=` value), `name`, `blurb`, `service` (post link) | Slugs fixed to the world's ids: `pipelines`, `oilfield`, `wind`, `reservoir`. The website's Embed block and any zone cards read the same posts |
| Markers (pins) | Post type `world_marker` (the dev site already has "3D World markers") | `slug`, `zone` (relationship), `name`, `sub`, `text`, `image`, `link`, optional `asset` (relationship to an Asset post) | When `asset` is set, `name`, `sub` and `image` default from that Asset and the fields override. Vessels have no single pages (Q78), so links go to `/assets/#vessels`, `#rovs` or `#equipment` |
| Careers route | Repeater on the Careers page, or an options page | `stops[]` (`slug`, `eyebrow`, `title`, `text`), `vacanciesUrl` | Replaces `COPY` and `HR_VACANCIES` in `src/careers.js` |
| Links | Options page "3D World" | `contact`, `home`, plus the scene URL the website uses | The same options page as §3 |

**Slugs are the contract.** Positions, camera angles and animation stay in the world's code (`HOTSPOTS` and `ZONES` in `reach-ocean-realism.html`), keyed by slug. Today's marker slugs: `vessel`, `surveyor`, `rov` (pipelines); `rr1`, `zeerov1` (oilfield); `drix`, `rr2`, `zeerov2` (wind); `vessel2`, `rr3`, `gwatch`, `dragonet` (reservoir). The world ignores a WordPress marker with no matching slug in its code. A slug in the code with no WordPress post keeps its built-in copy. Make the slug field read-only for editors once set, and say so in its help text.

**What the world does with it:** fetch on load with a short timeout (about 3 s); on failure, a timeout or a missing field, use the built-in copy for that item. Text is plain text (escape it; no HTML from the API). Links open in the same tab when the world is full screen, and with `target="_top"` when it is in a website iframe, so the Reach page replaces the whole tab.

**Server side:**
- **CORS:** `Access-Control-Allow-Origin` set to the world's origin only (plus `http://localhost:8765` on staging for local work). GET only, no credentials.
- **Cache:** page-cache the response (WP Engine) and send `Cache-Control: public, max-age=300`; purge it when a zone, marker or the careers route is saved. `version` lets the world spot stale content.
- **Images:** shown as plain `<img>` in the info panels, so no CORS is needed on uploads. If an image is ever used as a WebGL texture, uploads need `Access-Control-Allow-Origin` too. Serve a medium size (about 800 px wide), not the original.
- **Not in the API:** nothing private, no drafts (published posts only), no user data.

**Still open:** the world's final host and owner (§7 above). The Explore 3D World landing page (`/3d-world/`, Q95, Q108) reads the same zones.

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

## 10. Accessibility and web standards (WCAG 2.2 AA)

**Target:** WCAG 2.2 AA, the level the EU Web Accessibility Directive and the European Accessibility Act point to (via EN 301 549). The prototype passes axe-core (WCAG 2.2 AA + best practice) with zero violations on all 8 built pages, and validates as HTML apart from three deliberate exceptions (below). Audit: 21 Sep 2026 (Q70).

**Keep when porting.** These are easy to lose in a theme rebuild:
- Skip link, `lang="en"`, one `h1` per page, headings in order, `:focus-visible` rings (every `outline: none` has a replacement ring).
- Reduced motion: `base.css` clamps every animation, and each block's script also checks `prefers-reduced-motion`.
- **Pause controls** (WCAG 2.2.2): the hero video and the 3D World poster loop both use `MediaToggle`. Any new looping video or animation gets one.
- **The Timeline track** is a keyboard-focusable region, so it scrolls with the arrow keys.
- **Hero titles** are split into animated words (`aria-hidden`) with the full title in a `visually-hidden` span. Don't swap this for `aria-label` on the `h1`.
- **External links** say "(opens in a new tab)" in hidden text. Repeated labels ("Report", "Download") carry hidden context.
- **Accordions and the mobile menu** follow the APG disclosure pattern: `aria-expanded` and `aria-controls`, and panels are `role="region"` + `aria-labelledby`.

**Deliberate validator exceptions.** They're fine as they are:
- `role="list"` on the labelled `ul`/`ol` (Social feed rail, mobile 3D World zone list). The validator calls it redundant, but Safari/VoiceOver drops list semantics when bullets are styled off.
- `scrolling="no"` on the cropped Euronext iframe. It's deprecated, but still the only way to stop an inner scrollbar.
- A hidden site-menu panel shares the name "Reach Newsroom" with the Home newsroom section. The menu is `hidden` until opened.

**For the WordPress build.** The prototype can't cover these:
- [ ] **3D World:** WebGL is not accessible in itself. Keep the text panel and zone links as the equivalent, and make Launch/Exit keyboard-operable with focus moved into and back out of the iframe (already done in the prototype).
- [ ] **Live operations map:** the region list next to the map is the keyboard and screen-reader route. Don't make the map the only way in. Keep MapLibre's `cooperativeGestures` on so the map never traps page scrolling.
- [ ] **Films:** captions on every film with speech (YouTube/Vimeo captions or a WebVTT track on `<video>`), plus a transcript or audio description where the picture carries the meaning.
- [ ] **PDFs** (annual reports, presentations, policies): tagged, accessible PDFs from the source files, with titles and reading order. Say in the link when a file is a PDF (the Data list already does).
- [ ] **Forms** (if any return after Q39): visible labels, errors in text linked with `aria-describedby`, no placeholder-only labels, `autocomplete` attributes.
- [ ] **Cookie/consent banner:** keyboard-operable, focus moves to it and back, and no dark patterns. The Embed consent placeholder should stay a real `button`.
- [ ] **Third-party embeds** (Euronext, Newsweb, Elfsight, HR-Manager): each needs an iframe `title`. Check the vendor's own accessibility and note it in the statement if it's out of our control.
- [ ] **Editor guardrails:** make image `alt` required in ACF (empty is allowed only for decorative images), lock heading levels in blocks, and keep link text meaningful (no "Read more" without context).
- [ ] **Accessibility statement** page, linked from the footer: conformance level, known exceptions (3D World, third-party embeds) and a contact for problems.
- [ ] **Before launch:** run axe (or Lighthouse) on every template, do one keyboard-only pass and one screen-reader pass (VoiceOver + Safari, NVDA + Firefox), and zoom to 200% and 400% (reflow at 320px).
- [ ] **SEO basics** (not WCAG): `<meta name="description">` and Open Graph tags via Yoast. The prototype has none.

---

## 11. Handoff package checklist

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
| Favicon set | `public/favicon.svg` (follows the tab's colour scheme), `public/favicon.ico` (16 + 32), `public/apple-touch-icon.png` (180, navy tile), generated by `scripts/favicon.mjs` from the brand icon `Reach-icon-600x600.svg` (478 px crop so the R reads at 16 px). Ship as theme files and keep the three `<link>`s in `BaseLayout.astro` |
