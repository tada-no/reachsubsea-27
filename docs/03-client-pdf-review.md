# Reach Subsea 2027 — Review of the client's Design Reference PDF

_15 Sep 2026. Reviews `ref/Reach Subsea Website - Design Reference_1.pdf` (31 pp, 28 page mockups) against the dev site `reachsubseadev.wpenginepowered.com` and the decisions in [01-discovery-brief.md](01-discovery-brief.md)._

**Method.** All 28 mockups were rendered at high resolution and read tile by tile, together with the PDF's own notes. The matching dev-site pages were inventoried through the REST API and HTML, and the Investors pages were checked in the browser at desktop and 375px. Caveat: the mockups are compressed screenshots, so fine visual points (contrast, small grey text) are indicative only.

## Verdict

The PDF is strong on **content**: it has real Q2 2026 figures, a sharper narrative for Technology & Innovation, Reach Remote and Sustainability, and a few genuinely new ideas such as the charter Gantt, a "Latest info" row and the EU disclosure. It is weak as a **design system**, for four reasons:
- It uses 30+ card treatments.
- It uses two subnav styles.
- It puts a FAQ on almost every page.
- It leaves internal editorial notes in the visible copy on at least 15 of the 28 pages.

Where the dev site already has a working, data-driven solution, the dev site is better. That covers Reports, General meetings, share data, the Assets/Projects/News/Events archives and the FAQ post type. The PDF also often shows those areas as empty placeholders or hand-typed snapshots. **Rule of thumb:** take the PDF's content and page intent, and keep the dev site's components and data model.

---

## 1. Reports: dev site vs PDF page 21

| | Dev: `/investors/results-reporting/financial-reports/` | PDF p21: Reports, Presentations & Shareholder Information |
|---|---|---|
| Structure | Tabs: Quarterly · Annual · Sustainability · Misc. One component (`downloads-table`) for all four | Accordion by year for quarterlies, chip list for annual reports, 4 cards for bond/prospectus docs, shareholder table, Newsweb card. Three different treatments for the same kind of data |
| Finding the latest | Dark "LATEST" card at the top of every tab (Q2 2025: Report ↓ Presentation ↓ Webcast ↓) | No latest highlight; the current year's accordion is simply open |
| Scanning the archive | Year × Q1–Q4 grid shows 14 years × 4 quarters × 3 formats at a glance; older years sit behind "Show all archive years" | One year visible at a time, one click per year; 2013–2022 lumped into one "10 years" row |
| Labels | Icon-only links in the grid (text labels only in the Latest card) | Text pills (Report / Presentation / Webcast) plus the publication date per quarter |
| Mobile (375px) | Fits with no horizontal scroll, but icons stack in columns; **links are 15×15px** (below the 24px WCAG 2.5.8 minimum); aria-label is just "Report", with no year or quarter | The accordion/list pattern suits phones better |
| Data | 121 real document links in the WP media library; webcasts on Royalcast. Content stops at Q2 2025 | "Real, mirroring the live archive", with some pre-2023 dates blank |
| Shareholder data | Separate page, **live `ir.oms.no` feed** | **Hand-typed top-5 table** with a "REFERENCE DATA — REFRESH FROM LIVE FEED" badge; stale the day it's published |
| Leaked notes | None | Source-accuracy banner over the hero, two provenance footnotes, reference-data badge |
| Footer of page | Generic contact form under the table | IR-specific CTA ("Investor relations contact") + "View on Oslo Børs Newsweb" |

**Recommendation.** Use the dev `downloads-table` as the basis of block #7 **Data list**, and add the PDF's good ideas:
1. Show the publication date in the Latest card and as row meta.
2. Give every download link a real name (`Q2 2025 report (PDF)`) and a 44px hit area.
3. Below 768px, switch the grid to a year → quarter list with labelled buttons. The data stays the same; only the layout changes.
4. End Investors pages with the IR contact CTA and a Newsweb link instead of the generic form.

Drop the banner, footnotes, hand-typed shareholder table and page FAQ.

The same component already powers **General meetings** on dev: a Latest card, then Year / Document / Downloads (Notice, Nomination Committee, Remuneration, Protocol), with 55 real PDFs. On PDF p22 the same archive is an empty box saying *"Send over the current AGM/EGM archive and we will populate this section."*

## 2. Investors section, side by side

| Page | Dev site today | PDF | Take |
|---|---|---|---|
| Overview | Hub cards (Key information / Results & reporting) | Hero with investment case; "Latest info" row (latest report · news · upcoming event); highlights; stat row | **PDF layout**, but with one Card style (it uses 4 skins in one row) and without the "SAMPLE DATA" share sparkline, which should come from ir.oms.no |
| Why invest | Investors Introduction (thin) | Q2 results card, 4 thesis pillars, growth strategy, proof points | **PDF content.** Remove the visible "illustrative share-price trend… replace before publishing" note; the 8-stat hero card needs a mobile layout |
| Charter agreement overview | None (searched: news posts only) | Two Gantt charts, 5 bar styles, correction notes in the hero and footnotes | **Useful for investors, but costly.** Decided (Q26): v1 = the fleet/charter slide from the quarterly presentation as an image plus a PDF download; revisit a Timeline block later |
| Reports & presentations | `downloads-table`, 4 tabs | See §1 | **Dev component + PDF upgrades** |
| Share info / Largest shareholders / Newsweb | 3 thin pages, each wrapping one `ir.oms.no` iframe | Hand table + Newsweb link on the Reports page | **Decided (Q27):** one Share information page combining the live ir.oms.no embeds as sections |
| Governance & general meetings | Corporate Governance (PDF docs) + General meetings (`downloads-table`, populated) | Committee cards marked "illustrative", AGM/EGM explainer, empty archive | **Dev archive** + the PDF's short AGM/EGM explainer and document cards |
| Financial calendar | Two simple date tables (data ends Feb 2026) | Date list with Confirmed / Estimated pills | **Either works.** Don't publish "estimated" dates publicly; update the data |
| Sidebar nav | Left sidebar (Key information / Results & reporting) | Dark pill subnav | **Pill subnav, one style** (brief: no sidebar) |

## 3. What works in the PDF: take it into the block system

| Idea | Where | Maps to |
|---|---|---|
| Restrained, gradient-hero pages with clear flow | About Us (p14), Technology & Innovation (p8) | Visual benchmark for page templates |
| One template for Subsea / Survey / Monitoring | p5–7 | Service single template (hero, capability grid, stats, related, projects) |
| "Latest info" row: latest report, news, upcoming event | Investors overview (p18) | Feed grid (#3), mixed sources |
| Numbered process list (4 levels of remote oversight) | Reach Remote (p11) | Split media (#4), numbered-list variant |
| Numbered pillars (01/02/03) | About, Our Culture, Why invest | Card grid (#2), numbered option |
| Card overlapping the hero (stats / reasons) | Careers (p24, p27), Investors (p18) | Page hero (#1) overlap: stats / cards |
| Certification chips, SDG tiles | HSEQ (p16), Sustainability (p17) | Logo & badge strip (#11) |
| Related documents as direct downloads | HSEQ (p16) | Card action = file; Document preset |
| Explore 3D World zone cards | p13 | Card grid linking to `?zone=1–4` (being built in reach-world) |
| EU grant disclosure + project facts + milestone timeline | Reach Remote 3 & 4 (p12) | Timeline (#8) + a small EU disclosure pattern (a real funding obligation) |
| Offices grid + topic mailboxes, no named person | Contact (p29) | Feed grid (Office preset) + Card grid |
| FAQ page with category jump chips | FAQ (p30) | Accordion (#6) + Section subnav (#14) |
| Priority-led ESG copy, Tech & Innovation narrative, Q2 2026 figures | p8, p17, p18–19 | Content to migrate (after client sign-off) |
| **Conventions (p31):** show file/video/spec links only when a file exists; brand statements editable in the CMS; four interaction types (page link, reveal, file, anchor) | p31 | Already in the brief's Card `action` slot. Use **expand**, not a "flip" card, for accessibility |

## 4. What doesn't work

### A. Internal notes shown as page copy (strip before any build)
These read as real content in the mockups, not as margin notes:
- **p3** "Illustrative post" LinkedIn cards; **p4–8, p10** "REAL PROJECT / ILLUSTRATIVE / REAL VIDEO" pills and disclaimers
- **p9** "Every title… is real, drawn directly from reachsubsea.no…" callout
- **p10** ROV reconciliation paragraph (the per-vessel counts don't add up to the 15 total)
- **p11** "Becoming a standalone product" sourcing box
- **p12** the whole page: a "this page is a template for your EU grant obligations" banner, `[EU PROGRAMME NAME]`, `[XX]%`, `[date]`
- **p13** "The panel's descriptive text is not yet written… once you confirm the zone names…"
- **p16** "re-verify each certificate number… before publishing"
- **p18** "SAMPLE DATA" chip · **p19** "replace with the live chart before publishing"
- **p20** hero note on the Olympic Taurus correction; footnote "an earlier draft of this page understated…"
- **p21** source-accuracy banner, provenance footnotes, reference-data badge
- **p22** "ILLUSTRATIVE STRUCTURE" pill; "Send over the current AGM/EGM archive…"
- **p23** "ESTIMATED DATES MARKED — CONFIRM BEFORE PUBLISHING" + closing caveat
- **p24, p25, p27** "ILLUSTRATIVE" role areas, quotes and benefits · **p28** "see the specification for developers"

### B. Component sprawl
- **30+ card treatments** across 28 pages; most are used once. Examples: ESG pillar card, dark "Reach Horizon" card, vessel spec card, two person cards on one page, HSEQ bento, HOP 5-up, quote card, swatch card, press placeholder card, "This is Reach Subsea" 4-skin row.
- **Two subnav styles** (dark for Services/Investors, light for Company/Careers), and the active state differs on p23.
- The same stats (500+ / 9 / 2 modes) and the same CTAs (Explore fleet / Enter 3D World) repeat, sometimes three times on one page (p4, p11).
- A FAQ on ~24 pages, all copy still unapproved draft (brief decision Q3 already covers this).

### C. Information architecture
- Missing: **Projects** archive/single, **News** archive/single, **Events**, **Asset singles**, Search, 404. All exist on dev (Projects 24, Assets 20, Posts 174, Events 12).
- **Assets & Fleet (p10)** is one 5-screen page under Services with ~9 vessel cards, 4 ROV cards, newbuilds and DriX. Dev already has an Assets post type with singles and Vessels / Remote vessels listings. Use a Feed grid by type plus asset singles under a top-level Assets section (brief).
- Reach Remote, RR 3&4 and 3D World are nested under Services; the brief moves Reach Remote under Assets.

### D. Data that must be live or post-type driven, not hand-typed
Shareholder table and share-price chart (use ir.oms.no) · fleet counts and vessel specs (Asset post type) · 48 publications (Publication post type + Data list) · charter dates (structured data if built) · financial calendar dates.

### E. Visual
- White hero text over busy photos with little or no scrim on ~8 pages (p5–7, p10–13, p16). The gradient heroes read far better. (Indicative, given the screenshot quality.)
- Body and caption text is consistently small and light grey; FAQ answers and footnotes are the worst. Our Foundations type scale and text tokens already correct this.
- The colour swatches on Press & Media (p28) print hex codes on top of the fills (contrast).
- Mobile risks: the Gantt (p20), 5-column HOP (p26), 8-stat card (p19), 20-question FAQ (p30), and the p10 fleet page.

### F. Content not ready (not a design problem, but it blocks pages)
- **p12** Reach Remote 3 & 4 is a shell.
- **p25, p27** quotes and benefits are illustrative.
- **p15** leadership uses initials avatars. Also confirm the direct phone and email for each executive.
- **p13** zone copy is a draft.
- **p3** says "4 zones" and "6 active zones".
- **p14** the FAQ names Haugesund despite the note saying it wouldn't.

## 5. Page scorecard

**Keep** = use largely as drawn · **Adapt** = keep intent, rebuild with our blocks · **Dev** = the dev solution is better · **Blocked** = waiting on content

| # | Page | Take | Note |
|---|---|---|---|
| 01 | Home | Adapt | Good hero, bento, newsroom preview. Swap the live-zones panel for the 3D World poster feature; drop the LinkedIn placeholders |
| 02 | Services overview | Adapt | Service cards + crewed/uncrewed are good; cut stacked fleet/3D CTAs |
| 03–05 | Subsea / Survey / Monitoring | Keep | One template; conditional "video/spec" links; stronger hero scrim |
| 06 | Technology & Innovation | Keep | Benchmark page |
| 07 | Research & Publications | Adapt | Real content → Publication post type, Data list by year, filter |
| 08 | Assets & Fleet | Dev | Asset post type archive + singles, top-level Assets |
| 09 | Reach Remote | Adapt | Oversight list is strong; remove sourcing box and duplicate CTAs |
| 10 | Reach Remote 3 & 4 | Blocked | Keep the EU disclosure + Timeline pattern; no content yet |
| 11 | Explore 3D World | Adapt | Zone cards → `?zone=` deep links |
| 12 | About Us | Keep | Benchmark. Resolve the duplicate About pages on dev |
| 13 | Leadership & Board | Adapt | One Person post type feeds this and the Investors Board page; needs photos |
| 14 | HSEQ | Adapt | Certification strip + document cards; bento → Card grid |
| 15 | Sustainability | Adapt | Strong copy; fold 3 one-off cards into Card + badge strip |
| 16 | Investors overview | Adapt | "Latest info" row; live share data |
| 17 | Why invest | Adapt | Good content; live chart |
| 18 | Charter agreement overview | Simplify | v1: presentation slide as image + PDF download (Q26) |
| 19 | Reports & presentations | **Dev** | §1 |
| 20 | Governance & general meetings | **Dev** + Adapt | Dev archive + PDF explainer |
| 21 | Financial calendar | Either | Simple list; confirmed dates only |
| 22 | Careers overview | Adapt | Good flow; role areas illustrative |
| 23 | Life at Reach | Blocked | Real quotes needed |
| 24 | Our Culture | Adapt | HOP 5-up → numbered list; confirm HOP copy |
| 25 | Why work with us | Blocked | Real benefits needed |
| 26 | Press & media | Adapt | Brand assets + media contact; News/Events archives come back (brief) |
| 27 | Contact | Keep | Offices + topic mailboxes; decide whether dev's Mapbox map stays |
| 28 | FAQ | Adapt | Jump chips good; FAQ post type by topic; copy needs sign-off |

## 6. Dev-site issues found along the way
- Investors content stops at Q2 2025 / Feb 2026 (the PDF has Q2 2026).
- Download icon links are 15px and labelled "Report" with no context.
- The 2Q 2025 report is uploaded twice (`/2025/08/` and `/2026/05/`).
- The FAQ page shows Lorem Ipsum.
- Two About pages: `/about/` and `/company/who-we-are/about-us/`.
- The HSEQ hub H1 reads "How we operate".
- Every page ships the full mega-menu and a Gravity Forms slide-out, at 130–260 KB of HTML.

## 7. Decisions
Logged in [00-questions.md](00-questions.md):
- **Q25** The Data list block is the dev `downloads-table` plus the PDF upgrades from §1.
- **Q26** Charter overview v1 is the presentation slide as an image plus a PDF download.
- **Q27** One Share information page with the live ir.oms.no embeds.
- **Q28** A client-facing summary page, published privately for review before sharing.
