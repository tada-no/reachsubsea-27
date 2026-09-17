# Reach Subsea 2027 — Discovery Brief

_Status: discovery complete, 15 Sep 2026. Source for all follow-up chats._

## 1. Inputs reviewed

| Source | What it is | Takeaway |
|---|---|---|
| `ref/Reach Subsea Website - Design Reference_1.pdf` (31 pp) | Client's AI-generated spec: 28 page mockups + notes + "Governing conventions" | The "sketches" are low-res screenshots of rendered HTML pages. Structure and copy are legible at high zoom. The client has been asked for the source HTML. |
| `ref/reach sitemap from client.jpg` | 28 pages in 7 sections | Leaves out Projects, Events and the News archive. Assets & Fleet is nested under Services. |
| Old Figma `IqEKofKVdD06iF3A1Dlzrz` | Prototype canvas (~40k × 14k px) of mixed versions, plus a Symbols page | Messy. The Symbols page still has leftovers (red buttons, iSurvey/MonViro/Octio logos). Take only the logo, colours, type and line icons. |
| New Figma `HAvCQCXzWNFOKQ1AZxqNTX` | Only a Cover frame so far | Clean start. |
| Dev site `reachsubseadev.wpenginepowered.com` | Custom block theme `reach-subsea-2023` | 82 pages + CPTs: Services 4, Assets 20, Projects 23, Posts 92, Events 12, FAQs ~30 (about 17 still Lorem Ipsum), 3D World markers. Hub pages are hard-coded PHP templates with empty block content. Inter font. Navy `#282c59`, sage `#6eaa8c`, bg `#f1f7f3`, `#F7F9FD`. |
| Live site `reachsubsea.no` | WordPress | Projects has 24 entries in 3 incompatible formats. Assets has 17, but only USVs and ROVs have spec tables. About 40 service URLs. Investors data comes from `ir.oms.no` iframes. Careers links out to HR-Manager. |

## 2. Decisions so far

- **Deliverable model:** the Figma 2027 file holds the design system (tokens, components, block specs). A **coded prototype** holds the pages, with blocks mapping 1:1 to future WordPress blocks, then a developer handoff.
- **Projects:** top-level nav item with a filterable archive and single project pages. Service and asset pages pull related projects automatically.
- **Visual:** same brand, new layout. Stay close to the existing Figma/dev style. Base typography and spacing on it, using an **8px grid**. No sidebar, wider container, wider hero.
- **Assets:** its own top-level nav item, no longer under Services.
- **Client source HTML:** requested, awaiting reply.
- **Newsroom** keeps the News archive and Events alongside Press & media.
- **Placement:** Reach Remote goes under Assets. Explore 3D World goes under Services and is also a large home page feature.
- **FAQs** only on pages with genuine questions, pulled from the FAQ post type by topic.
- **Redirects:** Claude drafts the redirect map (cheap agent) and the developer implements it.
- **Prototype hosting:** local for now.
- **Developer:** same one who built `reach-subsea-2023`, so reuse their post types and field names where sensible.
- **awesome-design-md library** (`ref/awesome-design-md`): reference only.

## 3. Proposed information architecture (to confirm)

Top nav: **Services · Assets · Projects · Company · Investors · Careers · Newsroom** + `Contact` button, search.

| Section | Pages |
|---|---|
| Home | Includes a **large Explore 3D World feature**, based on the ocean-realism build in `~/Desktop/reach-world`. It shows a poster (still or short loop) with a "Launch 3D World" button that loads the live scene in place on click, using `?embed=1&zone=n` once built. Phones get the poster and a full-screen link. Local: `http://localhost:8765/reach-ocean-realism.html`; public demo: `https://tada-no.github.io/reach-world/`. |
| Services | Overview · Subsea · Survey · Monitoring · Technology & Innovation → Research & Publications · Explore 3D World |
| Assets | Fleet overview · Vessels (archive/single) · Reach Remote (USV + ROC + Horizon) → Reach Remote 3 & 4 · ROVs · Survey & monitoring equipment |
| Projects | Archive (filter: service, asset, region, year) · Project single |
| Company | About · Leadership & Board · HSEQ · Sustainability |
| Investors | Overview · Why invest · Charter agreements · Reports & presentations · Governance & meetings · Financial calendar · (Share info via ir.oms.no) |
| Careers | Overview · Life at Reach · Our culture · Why work with us → HR-Manager portal |
| Newsroom | News & announcements (archive/single) · Events (archive/single) · Press & media |
| Utility | Contact · FAQ · Search · 404 · Privacy · Transparency Act |

Gaps in the client sitemap that we're adding back: Projects, News archive and single, Events, Asset single, Project single, Search and 404. The live site's ~40 service URLs and the project/asset URLs need a **redirect map**.

## 4. The block problem and the proposed system

The PDF uses about **25 distinct card treatments**: image-overlay, icon, image-top + badge, dark highlight, news, LinkedIn post, project reference, video, capability, related-link, document, person, board row, office, contact email, certification chip, SDG tile, numbered value, HOP step, quote, benefit pill, opportunity tile, press material, spotlight, vessel spec, zone card. It also has five hero variants and two subnav styles (dark and light).

### Rule: one Card, few options

**Card** = `media` (none | icon | image-top | image-bg) × `surface` (white | tint | navy) × slots (eyebrow/badge, title, text, meta list, action). The **action** is one of the PDF's interaction conventions: page link | file | play video | expand | anchor.
Content presets pre-fill the slots from CPT fields: Service, Asset, Project, News, Event, Person, Document, Office.

### Editor-facing section blocks (target ≤ 14)

| # | Block | Variants | Replaces in PDF |
|---|---|---|---|
| 1 | Page hero | text / photo; overlap: none / stats / cards / panel | All 5 hero types |
| 2 | Card grid (manual) | 2/3/4 cols; featured-first (bento) | Feature grids, capability cards, values, benefits |
| 3 | Feed grid (dynamic) | source CPT + taxonomy filter, count, filter chips | News, projects, assets, events, people, offices |
| 4 | Split media | image/video/spec table/numbered list; left/right | Our story, Reach Remote sections, growth strategy |
| 5 | Stats band | 3–4 stats; plain / tint / in-card | Every stat strip variant |
| 6 | Accordion / FAQ | FAQ CPT by topic, or manual | Page FAQs, announcements |
| 7 | Data list | documents, dates, publications, reports by year, table | Reports archive, calendar, shareholders, publications |
| 8 | Timeline | milestones; Gantt (bespoke render) | RR 3&4 build, charter overview |
| 9 | CTA band | full band / inline callout | "Would you like to know more?", "Explore the full fleet" |
| 10 | Statement / quote | centred statement, quote with attribution | Vision, employee quotes |
| 11 | Logo & badge strip | logos / certification chips / SDG tiles | ISO grid, SDGs, partners |
| 12 | Media gallery | photo grid / video cards | Videos & animations, asset gallery |
| 13 | Embed | iframe (3D World, ir.oms.no), LinkedIn feed, map, form | Integrations |
| 14 | Section subnav | one style (not dark + light) | Pill bars |

Every section block shares one **Section header** (eyebrow, H2, intro, optional action) and one **section background** option (white / tint / navy).

### Content model (CPT + fields)

- **Asset**: type (vessel / USV / ROV / equipment), status (in service / joining / in build), unified spec schema (length, DP class, crane, PAX, deck area, speed, endurance, depth rating, power, payload, sensors, ROVs onboard), gallery, spec-sheet file, contact → Projects.
- **Project**: client, location/region, water depth, date, services ↔, assets ↔, summary, body, gallery. This fixes the 3 incompatible formats.
- **Service**, **News** (category: news / stock exchange / report), **Event**, **FAQ** (topic taxonomy), **Person** (management / board), **Office**, **Document** (type, year, file), **Publication**.
- Conditional rendering: a file, video or spec link only appears if the asset exists (PDF convention).

## 5. Things to flag to the client

1. Page-level FAQs on ~24 pages make pages long and repetitive. Recommend FAQs only where real questions exist, pulled from the FAQ CPT.
2. Several placeholders need content: video cards, LinkedIn posts, employee quotes, benefits, HOP copy, the governance committee structure, Reach Remote 3&4 EU fields, and the Deep Cygnus photo.
3. The same stats (500+, 9, 2 modes) repeat on many pages. Keep one stats source.
4. Integrations to keep or replace: ir.oms.no, HR-Manager, LinkedIn/Elfsight, Mapbox, Gravity Forms, world.reachsubsea.com.
5. The client sitemap collapses the site from ~82+ pages to 28, so SEO redirects are required.

## 6. Open questions

Tracked with answer fields in [`00-questions.md`](00-questions.md).

## 7. Phase plan

| Phase | Output | Model / agents |
|---|---|---|
| 1. Foundations | Figma variables: colour, type scale (Inter), 8px spacing, grid/container, radius, shadow. Pulled from dev theme CSS + old Figma. | Opus in main chat; Sonnet agent to extract tokens from dev CSS |
| 2. Components | Figma: Button, Link, Badge, Eyebrow, Stat, Card (+presets), Accordion item, Subnav, Header, Footer | Opus |
| 3. Section blocks | Figma block specs + coded equivalents | Opus designs; Sonnet agents build repetitive coded variants |
| 4. Templates & pages | Coded prototype. First pass: Home, Services overview, Service single, Assets overview, Asset single, Projects archive/single, Investors overview. Then the rest. | Opus for layout, Sonnet for content transcription |
| 5. Handoff | Block → WP mapping, ACF field spec, theme.json tokens, redirect map | Sonnet drafts, Opus reviews; Haiku for sitemap/URL diffs |

## 8. Rewritten kickoff prompt (use for the next chat)

> Project: Reach Subsea 2027 website redesign. Read `docs/01-discovery-brief.md` first; it records all findings and decisions.
> Goal: a clean design system in Figma (`HAvCQCXzWNFOKQ1AZxqNTX`) plus a coded prototype whose section blocks map 1:1 to WordPress blocks, ready for developer handoff.
> Constraints: same brand as the dev site (`reachsubseadev.wpenginepowered.com`) and old Figma (`IqEKofKVdD06iF3A1Dlzrz`, reference only). Inter, navy `#282c59`, sage `#6eaa8c`, 8px spacing grid, wider container, no sidebar. Keep to the block system in §4: one Card component, ≤14 section blocks.
> This session: **Phase 1, Foundations.** Extract tokens from the dev theme and old Figma, propose the type scale, spacing, grid and colour ramps for my approval, then create them as Figma variables and a Foundations page in the 2027 file.
> Use Sonnet subagents for extraction and transcription, and ask me before any decision not already covered in the brief.
