# Header and menu recommendation

_Proposal for Phase 2, 15 Sep 2026. Direction: logo left; plain right-aligned nav (Services · Assets · Projects · Company · Investors · Careers · Newsroom · Contact); Contact as a normal link; search + hamburger far right._

## 1. Benchmark

Checked in a 1440×900 browser (sticky, click vs hover, hamburger content) plus static HTML.

| Site | Nav alignment | Dropdowns | Desktop hamburger | Search | Sticky | Notable |
|---|---|---|---|---|---|---|
| Subsea7 | Right; "Contact Us" plain link | Not confirmed | None | Icon | Fixed, white, 100px | Utility row with share price |
| TechnipFMC | Right, two tiers | Not confirmed | None | Icon | Fixed, white, 153px | Investors in utility tier; tall |
| Kongsberg | Right | Click buttons, hover inert | Mobile only | Expanding field | Fixed, transparent, 85px | Skip link |
| Ørsted | Left of centre; Contact plain link | Click buttons, drill-down lists | Mobile only | Dialog | Static, 91px | Deep IR tree |
| Fugro | Left; "Get in touch" far right | None | None | Icon | Static, 112px | — |
| DOF | Centred; Contact + phone in utility row | Mega, incl. IR panel | None | Field | Static, 104px | Duty phone in header |
| Vard | **No visible nav** | — | Full site index panel | Icon | Fixed, transparent, 72px | IA hidden from new visitors |
| Saipem (HTML only) | Right | Hover mega + "Discover more" link | "Menu" button | Yes | Not confirmed | ~20-link IR panel |
| Reach dev | Left, 5 items | Mega + contact footer | Mobile only | Toggle ("Søk") | Fixed, white, 115px | Logo colour set per template |

- No peer highlights Contact as a button. Both peers with a visible nav plus rich panels open them on click.
- Only Vard relies on a desktop hamburger, and it replaces the nav. None hide the header on scroll (4 fixed, 3 static).

## 2. Recommendation summary

1. Logo left, 8 plain `Nav item`s right-aligned, then Search and Menu icon buttons. Contact uses the same component.
2. Seven section items open **one `Mega menu panel` template on click**. Never on hover: iPads fall in the ≥1200 range, and a right-aligned bar would fire panels on the way to the icons.
3. **Hamburger = Site menu:** the whole site on one screen plus things with no nav home (FAQ, Open positions, contact details, social, legal). Same content as the mobile menu.
4. **Indicator:** 2px bar on the header's bottom edge. `border/indicator` for Current and Open, `border/default` for Hover. Text never changes.
5. **Sticky:** fixed; 96 → 72 after scrolling; hides on scroll down, returns on scroll up. The Section subnav docks to the top while the header is hidden.
6. **Heights:** 96/72 at ≥1200 · 72 at 600–1199 (nav collapses) · 64 below 600.
7. **Search:** a panel under the header submitting to the results page. An expanding field would shove the nav.
8. **Solid white header** on every template in v1: guaranteed legibility and no per-template logo logic.
9. **Mobile:** accordion menu, Contact as the last row, then a utility block.
10. **Accessibility:** mega panels are non-modal; Site menu, Search and Mobile menu are modal. Targets ≥48px.

## 3. Component spec (Figma)

**New token** `border/indicator`: sage/500 in Light (3.8:1), sage/400 in Navy (4.9:1). `border/accent` is 2.7:1, which fails the 3:1 non-text contrast rule.

### 3.1 `Nav item`
| Property | Values |
|---|---|
| Type | Panel trigger · Link |
| State | Default · Hover · Open · Current · Focus |
| Show chevron | boolean, default off |

- Height fills the header; padding-inline `space/12`; `UI/Label`, `text/primary` in all states.
- Bar: 2px, label width. While a panel is open, only that item shows its bar. Focus: 2px `border/focus` ring, `radius/sm`, 48px box.
- Code: trigger `<button aria-expanded aria-controls>`; link `<a aria-current="page">`.

### 3.2 `Header`
| Variant | Width | Height | Content |
|---|---|---|---|
| Desktop | ≥1200 | 96 | Logo h32 · 8 Nav items · `space/16` · Search, Menu |
| Desktop scrolled | ≥1200 | 72 | Same; `shadow/sm` replaces border |
| Compact | 600–1199 | 72 | Logo h32 · Search · Menu |
| Mobile | <600 | 64 | Logo h24 · Search · Menu |

- `bg/default`, bottom border `border/subtle`, padding `grid/margin`, container 1600. Icon buttons 48px with Tabler 24px (`search`, `menu-2`, `x`), `icon/primary`; the last one pulled −12px to align its glyph.
- Fit: the full bar needs ≈890px. At 1200 there's 1072 available; at 1024 only ≈930, so the nav collapses below 1200.
- Scroll: hide (`translateY(-100%)`, 200ms) when scrolling down past 400px; show on 8px of upward scroll. Never hide while a panel is open or focus is inside.
- Subnav: `top: var(--header-offset)` (72/64, or 0 when hidden). `scroll-padding-top` = header + subnav + `space/16`. No motion under reduced-motion.

### 3.3 `Mega menu panel`
Full width, 12-column grid, `bg/default`, `shadow/lg`, padding-block `space/48`, max height `100dvh − header` (scrolls inside).

| Slot | Cols | Rule |
|---|---|---|
| Intro | 1–3 | `Heading/H4` name, `Body/Small` `text/secondary` line, overview Link. Required |
| Links | 4–8 | `Menu link` rows; ≤6 per column; optional `UI/Eyebrow` group label |
| Feature | 9–12 | 0–1 `Card` (Default, tint surface) |
| Strip | full | 0–3 links, `bg/tint`, `Body/Small`, padding-block `space/16` |

`Menu link`: L1 `Heading/H5` · L2 `Body/Small` indented `space/16`. States: hover underline; current = `border/indicator` bar at the start edge. `External` boolean adds an icon. Rows are 48px.

| Section | Intro link | Links (→ L2) | Feature | Strip |
|---|---|---|---|---|
| Services | All services | Subsea · Survey · Monitoring · Technology & Innovation → Research & Publications · Explore 3D World ↗ | 3D World poster | Contact us |
| Assets | Fleet overview | Vessels · Reach Remote → Reach Remote 3 & 4 · ROVs · Survey & monitoring equipment | RR 3 & 4 (in build) | — |
| Projects | All projects | By service: Subsea · Survey · Monitoring | Latest project | — |
| Company | About Reach | Leadership & Board · HSEQ · Sustainability | Optional | — |
| Investors | Investor overview | Why invest · Charter agreements · Reports & presentations · Governance & meetings · Financial calendar · Share information | Next event or latest report | IR contact · Newsweb ↗ |
| Careers | Careers overview | Life at Reach · Our culture · Why work with us | Open positions ↗ | — |
| Newsroom | All news | Stock exchange announcements · Events · Press & media | Latest news | Media contact |

WP: links come from the `primary` menu; intro, feature and strip come from one ACF options row per section.

### 3.4 `Site menu panel` (≥900)
- Modal under the header with a `bg/overlay` scrim. Columns: 4 at ≥1200, 3 at 900–1199. Block gap `stack/lg`.
- Each block: L1 heading (links to the landing page) + L2 children. No cards or descriptions. The last block, "Get in touch", holds Contact · FAQ · phone · email.
- Strip `bg/tint` 64px: social Icon buttons; `Caption` links to Privacy and Transparency Act. Fits at 1440×900.

### 3.5 `Mobile menu panel` (<900)
- Modal below the header (the icon becomes `x`); full height; scroll lock.
- `Menu accordion` rows: 56px, `Heading/H5`, chevron, `border/subtle` dividers. One open at a time; current section opens first. Children are 48px in `Body/Default`, starting with the landing page.
- Contact is the last row (plain link). Then, after `stack/lg`: Open positions · FAQ · phone · email · social · legal. The Investors section ends with "IR contact".

### 3.6 `Search panel`
- Modal with scrim. `Search field` spans cols 3–10: height 64/56, `Lead` text, `radius/md`, `border/strong`, clear button, `Button` "Search" at ≥900. Submits to `/?s=`.
- "Popular" (`UI/Eyebrow`) + 4–6 editor-set quick links. The results page gets type chips; live suggestions come later.

### 3.7 Accessibility
| Item | Rule |
|---|---|
| Skip link | First focusable; "Skip to main content"; visible on focus |
| Mega panels | Non-modal: no trap; Escape or outside click closes; focus returns to trigger |
| Modals | `role="dialog" aria-modal="true"`; `inert` on main + footer; Escape; focus returns |
| Labels | "Search" / "Menu" ↔ "Close…" (replaces "Søk" / "Meny") |
| Targets | ≥48px |
| No JS | Triggers fall back to links |

## 4. Wireframes

Desktop ≥1200, Investors panel open:
```
+--------------------------------------------------------------------------------------------------------------+
| [REACH SUBSEA]         Services  Assets  Projects  Company  Investors  Careers  Newsroom  Contact   (Q) (=)  |
|                                                             =========                                        |
+--------------------------------------------------------------------------------------------------------------+
| INVESTORS                  | Why invest                      | +--------------------------------+            |
| One line on the investment | Charter agreements              | | NEXT EVENT                     |            |
| case (Body/Small).         | Reports & presentations         | | Q3 results                     |            |
|                            | Governance & meetings           | | [date] - webcast  ->           |            |
| Investor overview  ->      | Financial calendar              | +--------------------------------+            |
|                            | Share information               |                                               |
+--------------------------------------------------------------------------------------------------------------+
| IR contact  ->     Oslo Bors Newsweb (ext)  ->                                              strip: bg/tint   |
+--------------------------------------------------------------------------------------------------------------+
   intro cols 1-3          links cols 4-8                    feature cols 9-12     no scrim (non-modal)
```

Desktop Site menu (hamburger):
```
+--------------------------------------------------------------------------------------------------------------+
| [REACH SUBSEA]         Services  Assets  Projects  Company  Investors  Careers  Newsroom  Contact   (Q) (X)  |
+--------------------------------------------------------------------------------------------------------------+
| Services ->            Assets ->               Investors ->            Careers ->                            |
|   Subsea                 Vessels                 Why invest              Life at Reach                       |
|   Survey                 Reach Remote            Charter agreements      Our culture                         |
|   Monitoring             Reach Remote 3 & 4      Reports & presentations Why work with us                    |
|   Technology & Innov.    ROVs                    Governance & meetings   Open positions (ext)                |
|   Research & Publ.       Survey & monitoring eq. Financial calendar                                          |
|   Explore 3D World (ext)                         Share information     Get in touch                          |
|                                                                          Contact                             |
| Projects ->            Company ->              Newsroom ->               FAQ                                 |
|   Subsea projects        Leadership & Board      Stock exchange ann.     +47 400 07 710                      |
|   Survey projects        HSEQ                    Events                  post@reachsubsea.com                |
|   Monitoring projects    Sustainability          Press & media                                               |
+--------------------------------------------------------------------------------------------------------------+
| (in) (f)                                                         Privacy & cookies   Transparency Act        |
+--------------------------------------------------------------------------------------------------------------+
 :::::::::::::::::::::::::::::::: bg/overlay scrim over page, page inert ::::::::::::::::::::::::::::::::
```

Mobile <600, menu open:
```
+----------------------------------+
| [REACH SUBSEA]        (Q)  (X)   |  64
+----------------------------------+
| Services                       v |  56
| -------------------------------- |
| Assets                         ^ |
|   Fleet overview                 |  48
|   Vessels                        |
|   Reach Remote                   |
|   Reach Remote 3 & 4             |
|   ROVs                           |
|   Survey & monitoring equipment  |
| -------------------------------- |
| Projects                       v |
| Company                        v |
| Investors                      v |
| Careers                        v |
| Newsroom                       v |
| Contact                          |
|                                  |
| Open positions (ext)             |
| FAQ                              |
| +47 400 07 710                   |
| post@reachsubsea.com             |
| (in) (f)                         |
| Privacy & cookies                |
| Transparency Act                 |
+----------------------------------+
```

## 5. Open questions for the designer

_Formatted to move straight into `00-questions.md`._

### H1. What does the hamburger open at ≥1200?
- [x] **Recommended:** Site menu (full index + utility, same content as mobile)
- [ ] Utility links only
- [ ] No icon at ≥1200

**Answer:**

### H2. Sticky behaviour
- [x] **Recommended:** hide on scroll down, show on scroll up, 96 → 72
- [ ] Always visible at 72 (peer norm; costs 128px with a subnav)

**Answer:**

### H3. Header over dark photo heroes
- [x] **Recommended:** solid white in v1; a Navy header remains possible later via the Color mode
- [ ] Transparent (needs a second logo, a per-template flag and scroll states)

**Answer:**
