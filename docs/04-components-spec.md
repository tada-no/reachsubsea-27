# Reach Subsea 2027 — Components spec (Phase 2)

_Status: built, 15 Sep 2026 (all components in §1–17; QA audit clean: 157 components, no unbound paints, unstyled text or loose nodes). Figma `HAvCQCXzWNFOKQ1AZxqNTX`, page **Components** (`12:24`). Decisions: Q22–Q24 and Q29–Q32 in [00-questions.md](00-questions.md). Inputs: [01-discovery-brief.md](01-discovery-brief.md) §4, [02-foundations-proposal.md](02-foundations-proposal.md), [03-client-pdf-review.md](03-client-pdf-review.md), [extract/dev-components.md](extract/dev-components.md). Build helpers: [`../figma/helpers.js`](../figma/helpers.js)._

## 0. Rules for every component

| Topic | Rule |
|---|---|
| Binding | Fills, strokes, padding, gaps, radii, text and effects bind to Phase 1 variables and styles only. Raw values are allowed only for fixed geometry: control heights, icon boxes, stroke widths (1, 1.5, 2), image ratios and card widths. |
| Surfaces | No "on-dark" variants. Set the **Navy** mode of the Color collection on a component, variant or instance, and every token inside flips. One CSS class in WP (`.has-surface-navy`). |
| Mobile | Type and layout flip through the Typography and Layout **Mobile** modes. Breakpoint variants exist only where the structure changes (Header, Footer, Subnav, Breadcrumb). |
| Naming | Sets `Button`, variants `Style=Primary, Size=Medium, State=Default`. Booleans `Show …`, swaps `Icon` / `Pictogram`. Layers read by role (`Label`, `Icon`, `Content`). |
| States | Interactive components draw Default · Hover · Focus (· Disabled). Card hover is a single spec example (Q23). |
| Focus ring | `outline: 2px solid var(border/focus); outline-offset: 2px` on `:focus-visible`. In Figma it's an absolute `Focus ring` layer 4px outside the node with a 2px inside stroke bound to `border/focus`, using the node's radius token. (Bound spread drop shadows didn't render.) |
| Targets | Controls 40px (small) / 48px (medium). Standalone text links 44 / 48px tall (Q25 upgrade: 44px named links). |
| Motion (code) | Button and Card hover: `translateY(-3px)`, `.25s ease-in-out` (dev). Link arrow: `translateX(-4px → 0)`, `.3s`. Respect `prefers-reduced-motion`. |
| Code names | Reuse the dev theme's classes where they exist (Q6): `.btn`, `.btn--primary`, `.btn--small`, `.link-arrow`, `.card`, `.faq-item`. New ones follow the same BEM style. |
| Docs | One frame per component, stacked in a single column at x = 0 (160px apart). Each has an eyebrow/H2/description header, the component set, Light and Navy previews, and usage notes. |

## 1. Icon ✅
Tabler Outline 3.46, 52 icons, `Icon/<tabler-name>`, 24px grid, 1.5px stroke, one flattened `Glyph` vector bound to `icon/primary`. Other components re-bind the Glyph stroke (e.g. `action/primary/fg`). Resize instances to 16/20/24; the stroke stays 1.5. Ledger: `extract/figma-icons-ledger.json`.

## 2. Pictogram
The 74 custom Reach line pictograms (old "Icons Flat"), `Pictogram/<name>`, 96px grid, fills bound to `icon/accent` (sage/500 Light, sage/400 Navy). Used for Card media = Icon at 96 / 128px, and full-width on Media = Pictogram panel. Ledger: `extract/figma-pictograms-ledger.json`.

**18 Sep 2026 update (code only):** the four home-page service pictograms carry a looping micro animation in an After Effects trim-path style: quick eased moves with holds, 3.2s per cycle. **Rule: no transparency in icon animation.** The icons stay fully solid; highlights are travelling gaps, either trimmed out of the stroke itself or cut by an eraser stroke in the card's solid surface colour (`--pg-bg`, set on `.card`). The moving parts were rebuilt as real strokes in the SVG source (`src/assets/pictograms`, `pg-…` classes, `pathLength="100"`) so `stroke-dasharray` can trim them; the rest of each icon is the original filled artwork and the rest state matches it. Keyframes live in `Pictogram.astro`, the trigger in `src/scripts/motion.ts`. One cycle plays when the card scrolls in (after its reveal settles), and it loops again while hovered or focused, always stopping at a cycle boundary. Technology: three electrons ride their orbits in turn on `offset-path`, each dragging a gap that cuts through the orbit lines behind it, the same gap language the icon uses where orbits weave; the nucleus kicks. Global monitoring: the two sonar arcs wipe and redraw top-down, then a gap opens in the outer ring, sweeps once around and closes. Survey: the compass legs retract to the hinge and redraw, the hinge flares, then an arc plots between the tips and trims away. Subsea infrastructure: the swell flows behind a fixed clip, the spanner takes two ratchet turns, the flange bolts tighten bottom to top, the sediment is stirred in three phases. Hover gated to fine pointers; reduced motion plays nothing. WordPress note: this depends on the SVGs being inlined, not loaded as `<img>`. Not in Figma.

## 3. Logo
One component, the REACH SUBSEA wordmark from the old file (`3:440`), 140 × 31 (dev renders at 137px). Fill bound to `text/primary`, so it's navy on Light and white on Navy. Constraints scale. No variants.

## 4. Button
`Style` Primary | Secondary | Outline × `Size` Medium | Small × `State` Default | Hover | Focus | Disabled = **24**.

| | Medium | Small |
|---|---|---|
| Height | 48 | 40 |
| Padding x | `space/24` | `space/16` |
| Gap | `space/8` | `space/8` |
| Label | `UI/Button` | `UI/Button small` |
| Icon | 20 | 16 |
| Radius | `radius/full` | `radius/full` |

| Style | Default | Hover | Disabled |
|---|---|---|---|
| Primary | bg `action/primary/bg`, fg `action/primary/fg` | bg `action/primary/bg-hover` | bg `bg/disabled`, fg `text/disabled` |
| Secondary | bg `action/secondary/bg`, fg `action/secondary/fg` | bg `action/secondary/bg-hover` | bg `bg/disabled`, fg `text/disabled` |
| Outline | 2px inside stroke `action/outline/border`, fg `action/outline/fg` | + bg `action/outline/bg-hover` | stroke `border/default`, fg `text/disabled` |

Focus = Default + focus ring. Properties: `Label`, `Show leading icon` (off), `Leading icon` (arrow-left), `Show trailing icon` (off), `Trailing icon` (arrow-right). On Navy, Primary becomes sage with navy text and Outline becomes white (replaces dev `.btn--outline-white`). The dev `.btn--neutral` is dropped. Keep buttons for real in-content actions; header and menus use links (Q29).

## 5. Icon button
`Style` Primary | Secondary | Outline | Ghost × `Size` Medium 48 (icon 24) | Small 40 (icon 20) × `State` Default | Hover | Focus | Disabled = **32**. Round (`radius/full`), same colours as Button. **Ghost**: no fill, icon `icon/primary`, hover bg `action/outline/bg-hover`; used for header search/menu, social links and closing panels. Property `Icon` (swap). Code must add an `aria-label`.

## 6. Link (standalone action link)
`Action` Page | External | File | Video | Expand | Anchor × `Size` Medium | Small × `State` Default | Hover | Focus = **36**.

| Action | Icon | Use |
|---|---|---|
| Page | arrow-right | internal page |
| External | arrow-up-right | HR-Manager, ir.oms.no, LinkedIn (Q24) |
| File | download | PDFs; label names the file ("Q2 2026 report (PDF)") |
| Video | player-play | opens the video player |
| Expand | plus (minus when open) | reveals content in place (the PDF's "reveal"; no flip cards) |
| Anchor | arrow-down | jumps within the page |

Medium: `UI/Button`, icon 20, padding y `space/12` (48 tall). Small: `UI/Button small`, icon 16, padding y `space/12` (44 tall). Gap `space/8`. Label `text/primary`, icon `icon/accent`. Hover: label underline, gap `space/12` (the arrow nudges 4px). In Figma the underline is an `Underline` hug wrapper with a 1px bottom stroke in `text/primary`, because text decoration syncs across variants that share the Label property; in code it's `text-decoration: underline`. Focus: ring + `radius/sm`, 8px outside at the sides (links have no side padding). Properties: `Label`, `Show icon`. Code: `.link-arrow` + `--external|--file|--video|--expand|--anchor`. Inline links in body copy are not a component: `text/primary` + underline, hover `text/accent`.

## 7. Badge
`Tone` Neutral | Accent | Navy | Success | Error = **5**. Padding `space/4` × `space/12`, gap `space/4`, `radius/full`, `UI/Eyebrow` (uppercase), 28 tall. Optional 16px icon (`Show icon`, `Icon` = circle-check).

| Tone | Fill | Text / icon | Note |
|---|---|---|---|
| Neutral | `bg/tint` + 1px `border/subtle` | `text/secondary` | Asset status "In build" |
| Accent | `bg/accent-subtle` | `text/accent` | "Joining fleet", categories |
| Navy | `action/primary/bg` | `action/primary/fg` | emphasis, "Latest" |
| Success | `bg/success-subtle` | `text/success` | "In service". **Light mode forced** on the variant |
| Error | `bg/error-subtle` | `text/error` | rare. **Light mode forced** |

Replaces the dev `.category-pill` as a label (filters use Filter chip).

## 8. Eyebrow
`Tone` Accent | Muted = **2**. `UI/Eyebrow`, `text/accent` | `text/secondary`. Property `Text`. Used in the Section header, cards, footer headings and the Data list.

## 9. Stat
`Size` Large | Medium × `Align` Start | Center = **4**. New pattern (dev has none). Value: `Heading/H1` (Large) | `Heading/H3` (Medium), `text/primary`. Label: `Body/Body` | `Body/Small`, `text/secondary`. Gap `stack/xs`. Optional note (`Show note`, `Body/Caption`, `text/secondary`) for a source or date. Properties `Value` ("500+"), `Label`, `Note`. One stats source per brief §5.3.

## 10. Filter chip
`State` Default | Hover | Selected | Focus | Disabled = **5**. Height 40, padding x `space/16`, gap `space/8`, `radius/full`, `UI/Label`.
Default: bg `bg/default`, 1px `border/default`, text `text/primary`. Hover: bg `action/outline/bg-hover`, border `border/strong`. Selected: bg `action/primary/bg`, text `action/primary/fg`, check icon 16. Focus: Default + ring. Disabled: border `border/subtle`, text `text/disabled`. Properties `Label`, `Show count`, `Count`. Used in Feed grid filters (service, asset, region, year) and FAQ topic jumps.

## 11. Breadcrumb
`Breakpoint` Desktop | Mobile = **2**. Desktop: links in `UI/Label` `text/secondary` › … › current page `text/primary` (`aria-current="page"`), chevron-right 16 separators in `border/strong`, gap `space/8`. Properties `Level 1`, `Show level 2`, `Level 2`, `Current`. Mobile: chevron-left 16 + parent label only. Sits above the page hero title on pages at depth 3 or more.

## 12. Meta item
Icon 20 (`icon/accent`) + `Body/Small` `text/secondary`, gap `space/8`, centred. Properties `Icon`, `Text`. The rows of the Card meta list (date, location, length, phone…).

## 13. Card
`Media` None | Icon | Pictogram panel | Image top | Image bg × `Surface` White | Tint | Navy (Image bg: Navy only) × `Size` Default | Featured = **26** (Q23).

**16 Sep 2026 update (code and Figma):** Pictograms 96 / 128 for hierarchy; Title + Text wrapped in their own `Heading` auto-layout (gap `stack/xs` Default, `space/12` Featured) inside the Text group (`stack/sm`); new `Media` = **Pictogram panel**: the Pictogram instance fills the content width as a square with no fill, after designer reference `217:8162`. Featured (designer reference `217:8241`): Content runs horizontally, a 260 × 260 panel beside a `Body` column (Text group, Meta, Action; gap `stack/md`), 864 × 358. In code the side-by-side layout is keyed to the card's own width (container query): 260 panel from 800, 200 panel at 600–799 (a 640 card in 2 columns), otherwise it stacks like Default. Wide pictogram-panel cards never share a row with narrow cards: Card grid renders them as 2 columns of wide cards (docs/05 §2.2).

| | Default | Featured |
|---|---|---|
| Width | 416 (4 of 12 columns at 1440) | 864 (8 columns) |
| Content padding | `space/32` | `space/48` |
| Pictogram | 96 (was 64) | 128 (was 96) |
| Title | `Heading/H4` | `Heading/H3` |
| Text | `Body/Small` | `Body/Body` |
| Action | Link Small | Link Medium |
| Image top | 3:2, 416 × 280 | 3:2, 864 × 576 |
| Image bg height | 520 | 520 |

- Frame `radius/lg`, clips content. White = `bg/default` + 1px `border/subtle`; Tint = `bg/tint`; Navy = Navy mode on the variant (`bg/default`).
- Image placeholder: fill `bg/disabled` with a 24px photo icon; designers drop images into the `Image` layer. Code: `aspect-ratio: 3/2; object-fit: cover`.
- Image bg: the image fills the card, an `Overlay` layer in `bg/overlay` (navy 64%) covers it, and content sits at the bottom. Code may use a gradient that ends at the same token.
- Content stack (gap `stack/md`): Pictogram → Text group (gap `stack/sm`: top row with Eyebrow + Badge, then a Heading group of Title + Text, gap `stack/xs` Default / `space/12` Featured) → Meta list (3 × Meta item, gap `space/8`) → Action (Link, exposed instance).
- Properties: `Title`, `Text`, `Show eyebrow`, `Show badge`, `Show text`, `Show meta`, `Show action`, `Pictogram` (swap). Eyebrow, Badge, Link and Meta items are exposed nested instances.
- Hover spec (one example): `Shadow/md` + −3px lift; image cards zoom the image to 1.04 (dev).
- Clickable area: for Page and External actions the whole card is the link (stretched link, one tab stop). File, Video and Expand keep the action as the only target.
- Conditional (PDF p31): the action only renders when its file, video or URL exists.

### Card presets (8)
Wrapper components `Card preset/<Name>`, each holding one configured Card instance. Pre-filled from CPT fields.

| Preset | Media · Surface | Eyebrow / badge | Meta | Action |
|---|---|---|---|---|
| Service | Icon · White | "Service" | — | Page "Explore subsea services" |
| Asset | Image top · White | type "Vessel" / status badge (Success "In service") | ruler-measure length, users PAX, anchor DP class | Page "View vessel" |
| Project | Image top · Tint | "Offshore wind · 2025" | map-pin region, ship asset | Page "Read project" |
| News | Image top · White | date "12 Aug 2026 · 3 min read" / Accent category | — | Page "Read more" |
| Event | None · Tint | "Conference" / Navy "Upcoming" | calendar dates, map-pin city | External "Event website" |
| Person | Image top · White | role "Chief Executive Officer" | phone, mail | Expand "Read bio" |
| Document | None · Tint | "Annual report · 2025" / Neutral "PDF" | file size, date | File "Download report (PDF)" |
| Office | None · White | "Head office" | map-pin address, phone, mail | External "Open in Maps" |

## 14. Accordion item
`State` Closed | Open × `Interaction` Default | Hover | Focus = **6**. Boxed, as on dev: width 880 (`container/content`), bg `bg/default`, 1px `border/default` (Hover `border/strong`), `radius/md`, padding `space/24`, gap `stack/sm`. Row: Question `Heading/H5` `text/primary` (fill) + 24px plus/minus in `icon/accent` (the dev sage plus → minus). Answer (Open): `Body/Body` `text/secondary`. Properties `Question`, `Answer`. Code: `.faq-item`, `<button aria-expanded aria-controls>`, grid-rows height transition (dev).

## 15. Subnav (pill bar, Q30)
**Subnav item**: `State` Default | Hover | Active | Focus = **4**. Height 40, padding x `space/16`, `radius/full`, `UI/Label`. Default: no fill, `text/secondary`. Hover: bg `action/outline/bg-hover`, `text/primary`. Active: bg `action/primary/bg`, `action/primary/fg`, `aria-current`. Focus: ring.
**Subnav**: `Breakpoint` Desktop (1440) | Mobile (375). Bar bg `bg/default`, 1px bottom `border/subtle`, padding y `space/12`, x `grid/margin`, gap `space/8`. Sticky under the header. Mobile clips and scrolls sideways, and keeps the active pill in view. One style everywhere; a Navy section doesn't change it.

## 16. Header family (Q29, Q33–Q35)
Rationale and benchmark: [extract/header-recommendation.md](extract/header-recommendation.md).

**Behaviour.**
- Logo left, then 8 **right-aligned plain-link** nav items (Services · Assets · Projects · Company · Investors · Careers · Newsroom · Contact), then Ghost icon buttons for Search and Menu. Contact is the same Nav item as the rest.
- The 7 section items open one `Mega menu panel` template **on click**, never on hover.
- The hamburger opens the **Site menu** at every width (Q33); below 900 that's the Mobile menu.
- Solid white on every template (Q35).
- Sticky: fixed, 96 → 72 after scrolling, hides on scroll down past 400px and returns on scroll up; never hides while a panel is open or focus is inside (Q34). The Subnav docks to `top: 0` while the header is hidden.

**Current-section indicator.** A 2px bar on the header's bottom edge under the label, bound to **`icon/accent`**. That token is sage/500 on Light (3.8:1) and sage/400 on Navy (4.9:1), the same values the recommendation proposed for a new `border/indicator`, so no new token is needed. Hover shows the bar in `border/default`. Text colour and weight never change.

| Component | Variants / properties | Spec |
|---|---|---|
| `Nav item` | `Type` Trigger · Link × `State` Default · Hover · Open · Current · Focus (9: a Link has no Open); `Label` | Height 96 (fills the header; resize to 72 when scrolled), padding x `space/12`, 48px `Target` with `UI/Label` `text/primary`, chevron-down 16 on Trigger (chevron-up when Open). Bar 2px on the bottom edge, label width. Focus ring on the target, `radius/sm`. Code: trigger `<button aria-expanded aria-controls>`, link `<a aria-current="page">` |
| `Header` | `Breakpoint` Desktop · Desktop scrolled · Compact · Mobile (4) | Desktop ≥1200: 96 tall, Logo h32, 8 Nav items, gap `space/16`, Icon buttons Ghost Medium `search` + `menu-2` (last pulled −12px to align its glyph). Scrolled: 72, `Shadow/sm` instead of the border. Compact 600–1199: 72, Logo, Search, Menu. Mobile <600: 64, Logo h24, Search, Menu. All: `bg/default`, bottom 1px `border/subtle`, padding x `grid/margin`, content max 1600 |
| `Menu link` | `Level` L1 · L2 × `State` Default · Hover · Current (6); `Label`, `Show external icon` | 48px rows, fill the column. L1 `Heading/H5` (no indent), L2 `Body/Small` indented `space/16`, `text/primary`. Hover underline (`Underline` wrapper, as Link); Current = 2px × 24 `icon/accent` bar in the gutter, 12px before the start edge |
| `Mega menu panel` | one template; `Title`, `Description`, `Show group labels`, `Show column 2`, `Show feature`, `Show strip`; exposed Overview link, Card, 3 Strip links; 7 section examples | Full width, 12 columns, `bg/default`, `Shadow/lg`, padding y `space/48`. Intro (cols 1–3, 304): `Heading/H4` name, `Body/Small` line, overview Link. Links (cols 4–8, 528): Menu links, ≤6 per column, optional Eyebrow group label. Feature (cols 9–12, 416): 0–1 Card (Default, Tint or Image bg). Strip: 0–3 Links on `bg/tint`, padding y `space/16`. Non-modal |
| `Site menu panel` | `Breakpoint` Desktop (4 columns) · Small desktop (3 columns) | Modal under the header over a `bg/overlay` scrim. Blocks: L1 + L2 Menu links, gap `stack/lg`; last block "Get in touch" (Contact · FAQ · +47 400 07 710 · post@reachsubsea.com). Bottom strip `bg/tint` 64px: LinkedIn/Facebook Ghost Small icon buttons + `Body/Caption` Privacy & Cookie Policy · Transparency Act |
| `Mobile menu panel` | one (375) | Modal, full height below the header; the menu icon becomes `x`. `Menu accordion` rows 56px `Heading/H5` + chevron, `border/subtle` dividers, one open at a time (current section first); children 48px `Body/Body` starting with the landing page. Contact is the last row. Then after `stack/lg`: Open positions ↗ · FAQ · phone · email · social · legal |
| `Menu accordion` | `State` Closed · Open (2) | See Mobile menu panel |
| `Search panel` | `Breakpoint` Desktop · Mobile (2) | Modal with scrim. Search field (cols 3–10): 64 / 56 tall, `Body/Lead`, `radius/md`, 1px `border/strong`, clear icon button, Button Primary "Search" at ≥900. "Popular" Eyebrow + 4–6 editor-set Links (a row at ≥900, a list on mobile). Submits to `/?s=` |

**Mega menu content**

| Section | Intro link | Links (→ L2) | Feature | Strip |
|---|---|---|---|---|
| Services | All services | Subsea · Survey · Monitoring · Technology & Innovation → Research & Publications · Explore 3D World ↗ | 3D World card (Image top, Navy) | Contact us |
| Assets | Fleet overview | Vessels · Reach Remote → Reach Remote 3 & 4 · ROVs · Survey & monitoring equipment | RR 3 & 4 (in build) | — |
| Projects | All projects | Subsea · Survey · Monitoring projects | Latest project | — |
| Company | About Reach | Leadership & Board · HSEQ · Sustainability | optional | — |
| Investors | Investor overview | Why invest · Charter agreements · Reports & presentations · Governance & meetings · Financial calendar · Share information | Next event or latest report | IR contact · Newsweb ↗ |
| Careers | Careers overview | Life at Reach · Our culture · Why work with us | Open positions ↗ | — |
| Newsroom | All news | Stock exchange announcements · Events · Press & media | Latest news | Media contact |

WP: links come from the `primary` menu; intro, feature and strip come from one ACF options row per section.

Figma note: a Card nested inside a panel instance keeps its content height when switched to Media = Image bg (fixed 520), and min-size can't be overridden in instances, so panel features use None, Icon or Image top. Code has no such limit.

**Accessibility.** Skip link first. Mega panels are non-modal (Escape or outside click closes, focus returns to the trigger). Site menu, Mobile menu and Search are `role="dialog" aria-modal="true"` with `inert` on main and footer. Labels are "Search" / "Menu" / "Close menu" (replacing "Søk" / "Meny"). Targets ≥48px; without JS, triggers fall back to links.

## 17. Footer (Q31)
`Breakpoint` Desktop 1440 | Mobile 375 = **2**, Navy mode on the component; the Mobile variant also sets the Layout and Typography Mobile modes.
- Padding top `section/md`, bottom `space/40`, x `grid/margin`; vertical gap `stack/xl`.
- Top row on the 12-column grid: brand (4 columns: Logo, then Ghost Small icon buttons for LinkedIn and Facebook) + 4 link columns (2 columns each).
- Column heading: Eyebrow Accent. Links: `Body/Small` `text/secondary`, gap `space/12`.
  - **Company**: About · Leadership & Board · HSEQ · Sustainability · Contact
  - **Services & Assets**: Subsea · Survey · Monitoring · Explore 3D World · Fleet overview · Reach Remote
  - **Explore**: Projects · Investors · Careers · Newsroom · Events · FAQ
  - **Get in touch**: +47 400 07 710 · post@reachsubsea.com (Q36) · Garpeskjærveien 2, 5527 Haugesund, Norway
- Divider 1px `border/subtle`. Legal row: "© 2027 Reach Subsea ASA. All rights reserved." + Transparency Act · Privacy & Cookie Policy, all `Body/Caption` `text/secondary`.
- Mobile: columns stack (brand, then 2 × 2 link columns, then contact), legal row stacks.
- Email is post@reachsubsea.com (Q36). **To confirm with client:** the LinkedIn URL (two different ones on dev) and the street address (old Figma only).

## 18. Build order

| # | Component(s) | Built by |
|---|---|---|
| 1 | Icon ✅ | Sonnet agent |
| 2 | Pictogram ✅ | Sonnet agent |
| 3 | Logo, Button (sets the pattern) ✅ | Opus |
| 4 | Icon button, Link ✅ | Sonnet agent |
| 5 | Badge, Eyebrow, Stat, Meta item, Filter chip, Breadcrumb ✅ | Sonnet agent |
| 6 | Accordion item, Subnav item + Subnav ✅ | Sonnet agent |
| 7 | Card ✅ | Opus |
| 8 | Card presets ✅ | Sonnet agent |
| 9 | Header family ✅ (Nav item, Header, Menu link, Mega menu panel + 7 examples, Site menu panel, Menu accordion, Mobile menu panel, Search panel) | Opus |
| 10 | Footer ✅ | Opus |
| 11 | QA: binding/naming audit, Badge Neutral height ✅ | Opus |
| 11 | QA: unbound values, naming, detached nodes, contrast; screenshots | Sonnet audit + Opus review |

All Figma writes run one at a time (never two agents writing at once).
