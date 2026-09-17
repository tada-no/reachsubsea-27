# Dev Theme Token Extraction — reach-subsea-2023

Source: `https://reachsubseadev.wpenginepowered.com` (custom block theme `reach-subsea-2023`)
Method: fetched home page + 4 inner pages, theme's compiled CSS bundle, and WordPress's generated `global-styles-inline-css` (theme.json presets as custom properties). Read-only extraction — no redesign judgement below except where explicitly flagged "INCONSISTENCY".

## Key takeaways

1. **Core brand palette (theme's own custom properties, `:root` in `dist/style.css`):** primary navy `#282c59` (32 uses), secondary sage `#6eaa8c` (4 direct + used via var everywhere), plus a full tint/shade ramp for each (5/10/25/50/75%). Backgrounds `#f1f7f3` and `#f7f9fd` confirmed as theme tokens (`--posts-page-background` / `--color-primary-light`).
2. **Near-duplicate navy:** `#1b1d3b` (`--color-black` / `--color-primary-shade`, 15 uses) is a separate darker navy from `#282c59` — not a tint of it. A third off-brand navy `#282d59` appears once (likely a typo of `#282c59`).
3. **Neutral grey `#575a7c`** (`--color-primary-75`, 16 uses) is the de‑facto secondary text colour on light backgrounds; it isn't wired to any named "text" token, it's just the 75% primary tint.
4. **Typography:** single font family, **Inter** (400/500/700) via Google Fonts `@import`. Two more `@font-face`s (`Bstyle-regular`, `Bstyle-bold`) are declared but never applied anywhere in the CSS — dead weight. `.h1`–`.h6` and body/`.p` use **fluid clamp-style sizing** (linear `calc()` between 500px and 1920px viewport), but many hero/section variants override `h1`/`h2` with their own one-off fluid ranges rather than reusing `.h1`/`.h2` — the type scale is not consistently applied.
5. **Type scale (base, non-fluid endpoints):** h1 36→56px, h2 32→48px, h3 22→32px, h4 22→24px, h5 16→18px, h6 14→16px, body/p 16→18px. Hero h1 overrides range much wider (30px up to 150px depending on template).
6. **Spacing:** an 8px-based preset scale exists (`--wp--preset--spacing--8/16/24/32/40/48/56/64/72/80/96/112/128`), and most gaps/margins in the compiled CSS cluster on 8px multiples (24, 40, 16, 8, 48, 32, 80px are the top values) — but a long tail of off-grid values (10, 14, 6, 30, 50, 44, 84, 100, 150px) also appears, so the grid isn't enforced everywhere.
7. **Section vertical rhythm** uses CSS vars `--section-x-small/small/medium/big`, redefined at 1199px and 899px — but at desktop default, `--section-medium` (18rem/288px) is *larger* than `--section-big` (17rem/272px), an inverted/likely-typo'd pair (INCONSISTENCY).
8. **Container widths:** primary `.container` = `min(100% - 4rem, 84rem)` → max 1344px, gutter 32px each side (24px below 499px). A second "small" container caps at 55rem (880px). A sidebar-nav template variant caps at 108rem (1728px). One section (`upcoming-events`) hardcodes `max-width:1100px` in px rather than the rem system (INCONSISTENCY). No `--wp--style--global--content-size`/`wide-size` custom properties are emitted by theme.json.
9. **Breakpoints:** dozens of ad-hoc `@media` values exist (looks like a builder auto-generates one per responsive block), but a small set recurs heavily and functions as the real system: **1199, 1099, 999, 899, 599, 499px** (max-width, desktop-down), plus a **fluid-type range of 500–1920px** used everywhere for clamp-style scaling.
10. **Buttons:** consistent `.btn`/`.wp-block-button__link` family — `border-radius:22px`, `padding:11px 24px`, `font-weight:700`, `transition:all .25s ease-in-out`, hover = `translateY(-3px)`. Form inputs (Gravity Forms) use a *different* radius (12px fields, 17px submit button) and a colour `#e3e4ef` that doesn't match the actual `--color-primary-5` token (`#dadadc`) — likely a hand-typed Figma value that drifted from the token (INCONSISTENCY).

## Access notes

- `theme.json` and `wp-content/themes/reach-subsea-2023/style.css`'s real content were **not directly accessible**: `theme.json` returns the site's branded 404 page (HTTP 404), and `style.css` returns only the theme header comment (name/author/version, no CSS) — WP Engine appears to block/strip direct theme-file access. All theme.json preset data was instead recovered indirectly via WordPress's auto-generated `#global-styles-inline-css` and `#style-css-inline-css` `<style>` blocks in the page `<head>`, which is the complete and authoritative rendering of those presets, so no data is believed missing.
- Pages fetched: home `/`, `/news/`, `/news/reach-remote-1-cleared-for-operations-without-supporting-vessel/` (post), `/assets/reach-remote-1/` (asset single), `/company/technology/` and `/services/survey-services/` (service pages). All load the same single compiled bundle `dist/style.css`, plus a smaller `dist/critical.css` (above-fold) and page-specific plugin CSS (Gravity Forms, FacetWP).
- `dist/scripts.js` (2.2MB) was fetched but not deeply parsed line-by-line — only grepped for font/colour references; no additional design tokens found in it beyond what CSS already showed.

---

## 1. Colours

### 1.1 Theme custom properties (`:root` in `dist/style.css`) — authoritative token set

| Variable | Value | Notes |
|---|---|---|
| `--color-white` | `#fff` | |
| `--color-extra-light` | `#f5f5f5` | |
| `--color-light` | `#eaeaea` | |
| `--color-medium` | `#d0d0d0` | used as `.btn--neutral` background |
| `--color-dark` | `#636362` | |
| `--color-black` | `#1b1d3b` | = `--color-primary-shade` |
| `--color-primary-shade` | `#1b1d3b` | duplicate value of `--color-black` |
| `--color-primary` | `#282c59` | **brand navy** |
| `--color-primary-75` | `#575a7c` | |
| `--color-primary-50` | `#85879e` | |
| `--color-primary-25` | `#b5b6c1` | |
| `--color-primary-10` | `#d2d2d7` | |
| `--color-primary-5` | `#dadadc` | see INCONSISTENCY below vs `#e3e4ef` |
| `--color-secondary-shade-dark` | `#416e58` | |
| `--color-secondary-shade` | `#5c8e75` | |
| `--color-secondary` | `#6eaa8c` | **brand sage** |
| `--color-secondary-75` | `#8bb9a2` | |
| `--color-secondary-50` | `#a8c6b8` | |
| `--color-secondary-25` | `#c6d5ce` | |
| `--color-secondary-10` | `#d9dfdc` | |
| `--color-secondary-5` | `#dde0df` | |
| `--posts-page-background` | `#f1f7f3` | matches known bg |
| `--color-confirmation-error` | `#c02b0a` | |
| `--color-confirmation-success` | `#2e7d31` | |
| `--box-shadow-primary` | `0 4px 16px rgba(0,0,0,.1)` | |
| `--box-shadow-primary-hover` | `0 8px 18px rgba(0,0,0,.2)` | |
| `--gradient-primary-shade` | `linear-gradient(180deg,#1b1d3b,rgba(27,29,59,0))` | |
| `--gradient-primary` | `linear-gradient(0deg,rgba(40,44,89,0),#282c59)` | |
| `--gradient-primary-reversed` | `linear-gradient(0deg,#282c59,rgba(40,44,89,0))` | |
| `--navbar-height` | `115px` (default) → `80px` @ ≤1099px | |

### 1.2 theme.json colour presets (`--wp--preset--color--*`, from `global-styles-inline-css`)

| Preset | Value | Theme-specific? |
|---|---|---|
| `primary` | `#282c59` | yes |
| `secondary` | `#6eaa8c` | yes |
| `primary-50` | `#85879e` | yes |
| `secondary-50` | `#a8c6b8` | yes |
| `primary-light` | `#F7F9FD` | yes (note capitalised hex, others lowercase — cosmetic inconsistency) |
| `primary-10` | `#CACBD6` | yes — **does not match** `--color-primary-10` (`#d2d2d7`) in the CSS custom-property set; two different "primary-10" values exist across the two token systems (INCONSISTENCY) |
| `page-bg` | `#f1f7f3` | yes |
| `black` | `#1b1d3b` | yes, aliases WP's default "black" slot |
| `white`, `cyan-bluish-gray`, `pale-pink`, `vivid-red`, `luminous-vivid-orange`, `luminous-vivid-amber`, `light-green-cyan`, `vivid-green-cyan`, `pale-cyan-blue`, `vivid-cyan-blue`, `vivid-purple` | WP core defaults | **not brand colours** — these are Gutenberg's stock default palette, left in place; grep found no evidence they're used in the compiled theme CSS (all hits are inside the `global-styles-inline.css` preset block itself, and the WP core block-library stylesheets, not template CSS) |

### 1.3 All distinct colours found, by occurrence count (hex, across `dist/style.css` + `global-styles-inline.css`)

| Hex | Count | Group |
|---|---|---|
| `#fff` | 54 | white |
| `#282c59` | 32 | brand primary |
| `#575a7c` | 16 | primary-75 / secondary text |
| `#1b1d3b` | 15 | primary-shade / black (near-dup of primary) |
| `#f7f9fd` | 9 | background |
| `#dbeae2` | 7 | background/border tint (not in `:root` list — likely a section-specific sage tint) |
| `#b4b2c9` | 6 | border (facet search input) |
| `#e8e8f0` | 6 | border/divider |
| `#f1f7f3` | 5 | background |
| `#e3e4ef` | 5 | near-dup of primary-5 (see inconsistency) |
| `#6eaa8c` | 4 | brand secondary |
| `#cacbd6` | 4 | primary-10 (theme.json variant) |
| `#333`, `#000` | 4, 3 | generic dark (likely from a third-party plugin, e.g. FacetWP/social icons) |
| `#85879e` | 2 | primary-50 |
| `#a8c6b8` | 2 | secondary-50 |
| `#d5d6e2`, `#fcfcfc`, `#fafafd` | 2 each | one-off neutrals |
| `#f5f5f5`, `#eaeaea`, `#d0d0d0`, `#636362`, `#b5b6c1`, `#d2d2d7`, `#dadadc` | 1 each | match the `:root` tint ramp (extra-light/light/medium/dark/primary-25/10/5) |
| `#416e58`, `#5c8e75`, `#8bb9a2`, `#c6d5ce`, `#d9dfdc`, `#dde0df` | 1 each | secondary tint ramp |
| `#c02b0a`, `#2e7d31` | 1 each | error/success states |
| `#3b5998`, `#00aced`, `#cb2027` | 1 each | social brand colours (Facebook/Twitter/Pinterest) — third-party, not site brand |
| `#005fcc`, `#1a73e8`, `#4299e1` | 1 each | likely browser-default/plugin focus-ring blues, not brand |
| `#f7f7fb`, `#f8f9fa`, `#f7fafc`, `#f1f1f1`, `#c1c1c1`, `#a8a8a8`, `#4a5568`, `#eee` | 1 each | generic greys, appear to be from a bundled third-party component (form/table library) rather than the theme's own palette |
| `#282d59` | 1 | **typo-looking near-duplicate** of `#282c59` |

### 1.4 rgba()/rgb() usage

Overwhelmingly built on the brand navy: `rgba(40,44,89,.1)` through `.9)` (≈27 combined uses — this is `#282c59` in rgb with varying opacity, used for overlays/scrims) and `rgba(27,29,59,…)` (the `#1b1d3b` navy, ~7 uses). Generic `rgba(0,0,0,…)` black overlays appear ~14 times at various opacities (.1–.75) with no single standard opacity — worth noting if a redesign wants to standardise overlay opacity.

The `rgb(…)` values only in `global-styles-inline.css` (e.g. `rgb(6,147,227)`, `rgb(155,81,224)`, `rgb(74,234,220)` …) are all WP's default gradient/palette presets, unused in template CSS.

---

## 2. Typography

### 2.1 Font loading

- **Inter**, weights **400, 500, 700**, loaded via `@import url(fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap)` inside `dist/style.css`.
- `Bstyle-regular` (400) and `Bstyle-bold` (700) — local `@font-face` (`.ttf`/`.woff2`/`.woff`) declared but **not referenced by any selector** in the compiled CSS. Dead font-face declarations.
- `lg` (icon font, from the LightGallery plugin) — not a content font.
- `body { font-family: Inter, sans-serif; }` is the sole family in normal use; a few embedded plugin widgets set `Roboto,Arial` / `Open Sans,Helvetica Neue,…` but these look like third-party embed defaults (e.g. a review/map widget), not intentional theme choices.

### 2.2 theme.json font-size presets (`--wp--preset--font-size--*`)

| Preset | Value |
|---|---|
| small | 16px |
| default | 18px |
| medium | 24px |
| large | 32px |
| x-large | 42px |

(Used sparingly in template CSS — only one direct reference found, `.cards-grid--news .card:first-child .card__text h2 { font-size: var(--wp--preset--font-size--large) }` at ≥1101px.)

### 2.3 Heading / body scale (base class rules, fluid between 500px and 1920px viewport via `calc()`)

| Element | <500px | 500–1920px | ≥1920px |
|---|---|---|---|
| body / `.p`, `p` | 16px | `calc(16px + 2 * (100vw - 500px) / 1420)` | 18px |
| `.h6`, h6 | 14px | fluid | 16px |
| `.h5`, h5 | 16px | fluid | 18px |
| `.h4`, h4 | 22px | fluid (+2px range) | 24px |
| `.h3`, h3 | 22px | fluid | 32px |
| `.h2`, h2 | 32px | fluid | 48px |
| `.h1`, h1 | 36px | fluid | 56px |

`.p` also carries `max-width:75ch`.

**Small text:** `.p.p--small,p.p--small` → 14px (seen in the button/form context grep).

### 2.4 Hero heading overrides (template-specific — do NOT reuse `.h1`/`.h2`, each hard-codes its own fluid range)

| Selector | <500px | ≥1920px |
|---|---|---|
| `.hero--big h1` | 36px | 112px |
| `.hero--text-reveal h1 …__last` | 46px | 150px |
| `.hero--archive h1` | 36px | 112px |
| `.hero--single h1` | 30px | 80px |
| `.hero--single-projects h1` | 36px | 64px |
| `.hero--single-pages h1` | 32px | 48px |
| `.hero--single-posts h1` | 44px (line-height 1.3) fixed steps: 36px @≤1599px, 24px @≤899px | — (non-fluid, step-based instead of clamp) |
| `.hero--department … h1` | 40px | 112px |
| `.about-section__welcome-heading h1` | 46px | 112px |
| `.about-section .h1` | 64px desktop → 33px @≤1099px | — |
| `.front-page-card--first h1` | 46px fixed @≥1120px only | — |
| `.cta-card h2` | 28px | 64px |

This is the clearest sign the **type scale isn't systematised** — 8+ different h1 ranges exist across templates rather than a small set of named sizes.

### 2.5 Small text / eyebrow / label pattern

| Selector | font-size | weight | letter-spacing | text-transform |
|---|---|---|---|---|
| `.downloads-table__th` | 12px | 700 | .04em | uppercase |
| `.mobile-menu__featured-heading` | 11px | 700 | .04em | uppercase |
| `.sidebar-hierarchy__item… .sidebar-hierarchy__title` | .85rem (13.6px) | 700 | .05em | uppercase (implied) |
| `.footer__menu-heading` | 14px | — | — | uppercase |

Other `letter-spacing` values found: `.08em`, `-.16px` (×2), `-.5px`, `-.3px` — a small, reasonably tight set, no runaway variety.

### 2.6 Nav / footer text

| Selector | font-size |
|---|---|
| Main nav links (`.header__main-nav-menu … a`) | 14px |
| Mobile menu item links | 24px |
| Dropdown sub-menu links | 15px → 13px (≤1599px) → 12px (≤1399px) |
| Footer menu links | 18px → 15px (≤1749px) |
| Footer copyright text/links | 14px, line-height 1.5 |
| Footer contact heading | 22px fluid → 32px (≥1920px), 18px (≤374px) |

### 2.7 Buttons (typography)

`.btn`, `.wp-block-button__link`: `font-weight:700`, base `font-size:16px` (inherited from body, not separately set on `.btn`), `line-height:1` / `1.1`.

---

## 3. Spacing

### 3.1 theme.json spacing presets (`--wp--preset--spacing--*`, two overlapping sets found — one in px, one in rem)

Px set (from `style-css-inline-css`, all clean 8px multiples):
`8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128px`

Rem set (from `global-styles-inline-css`, WP's default numeric scale, NOT 8px-aligned):
`--spacing--20: 0.44rem (7px), --30: 0.67rem (10.7px), --40: 1rem (16px), --50: 1.5rem (24px), --60: 2.25rem (36px), --70: 3.38rem (54px), --80: 5.06rem (81px)`

**INCONSISTENCY:** two parallel spacing-preset systems exist (the clean 8px px-scale and WP's default rem-scale, which isn't 8px-based) — likely the theme defines its own scale but WordPress's default 20–80 rem-scale is still being emitted alongside it, unclear which one authors actually pick from in the block editor.

### 3.2 Section vertical rhythm (`:root` custom properties, redefined at breakpoints)

| Token | Desktop default | ≤1199px | ≤899px |
|---|---|---|---|
| `--section-x-small` | 4rem (64px) | 5rem (80px) | 3rem (48px) |
| `--section-small` | 5rem (80px) | 6rem (96px) | 4rem (64px) |
| `--section-medium` | **18rem (288px)** | 8rem (128px) | 5rem (80px) |
| `--section-big` | **17rem (272px)** | 14rem (224px) | 6rem (96px) |

**INCONSISTENCY:** at the desktop default, `--section-medium` (288px) is larger than `--section-big` (272px) — the two labels invert. At both breakpoints below 1199px the ordering is corrected (medium < big), suggesting the desktop default is a typo.

### 3.3 Most common `gap` values (count)

24px ×39, 40px ×34, 16px ×21, 8px ×15, 48px ×10, 10px ×8, 4px ×7, 32px ×6, 6px ×5, 20px ×4, 14px ×4, 80px ×3, 60px ×3, 12px ×3 … long tail down to 2px.

All of the top values are 8px multiples except 10, 6, 14px, which recur enough (8+5+4=17 instances) to be a real secondary pattern, not noise.

### 3.4 Most common `margin-bottom` values (count)

16px ×15, 24px ×13, 80px ×12, 60px ×10, 10px ×8, 8px ×7, 48px ×7, 40px ×7, 30px ×6, 20px ×6, 50px ×5, 4px ×5, 150px ×4, 14px ×4, 32px ×3 …

Off-8px-grid values with meaningful counts: 10px(8), 30px(6), 50px(5), 14px(4), 150px(4) — a real secondary off-grid pattern (10/30/50/14/150 do not divide evenly by 8).

### 3.5 Most common `padding` shorthand values (count)

24px ×7, 48px ×5, 16px ×5, 12px ×5, `11px 24px` ×5 (button padding), `6px 12px` ×3, `32px 16px` ×3, `24px 16px` ×3, 20px ×3, `16px 24px` ×3, 10px ×3 …

`11px 24px` (buttons) and several `Npx Mpx` combos use odd numbers (11px, 54px, 88px, 72px) that don't cleanly follow the 8px scale — buttons in particular are anchored on 11px vertical, not 8/16.

---

## 4. Layout

- **No `--wp--style--global--content-size` / `wide-size` custom properties are emitted** by theme.json (checked home + critical.css) — the theme relies entirely on its own `.container` classes, not core WP layout constraints.
- **Primary container:** `.container { margin:auto; width:min(100% - 0rem, 84rem) }` → **max-width 1344px**. Side inset becomes `100% - 4rem` (32px each side) at ≤1749px, and switches to fixed `padding:0 24px` at ≤499px.
- **Small container:** `.container--small { width:min(100% - 8rem, 55rem) }` → max-width 880px (inset narrows to 6rem at ≤1339px).
- **Sidebar-nav template container** (docs/assets pages with a left nav): max-width 1728px (108rem) desktop, stepping to 1600px (1699px bp), 1344px (1099px bp), same 24px mobile padding.
- **One-off, non-systematic width:** `.section--upcoming-events .container { max-width:1100px }` — a hardcoded px value outside the rem-based container system (INCONSISTENCY).
- **Grid patterns:** front-page hero uses `grid-template-columns:3fr 1fr` → `1.7fr 1fr` (≤1199px) → `1fr` (≤999px, stacks). Department gallery: 3-column (`1fr 1fr 1fr`) grid with 40px gap.

### 4.1 Breakpoints — all `@media` values found, with counts (desktop-down `max-width`, `dist/style.css`)

| Breakpoint | Count | Note |
|---|---|---|
| 899px | 104 | core breakpoint |
| 499px | 63 | core / mobile |
| 599px | 48 | core |
| 1099px | 40 | core |
| 1199px | 32 | core |
| 999px | 24 | core |
| 1399px | 23 | common |
| 781px | 12 | |
| 699px | 11 | |
| 1699px | 11 | |
| 399px | 8 | |
| 799px, 649px | 7, 7 | |
| 1749px | 6 | |
| 767px, 374px | 5, 5 | |
| 1599px | 5 | |
| plus 25+ more one-off values (349, 1549, 639, 559, 453, 1313, 1299, 1149, 1103, 1100px, etc.), each used 1–4 times | — | looks auto-generated per block instance rather than hand-picked |

`min-width` breakpoints in use: 768px, 1101px, 1120px, and a fluid-typography pair **500px / 1920px** used consistently for all `clamp()`-style `calc()` scaling. A few very large-screen tweaks exist at `min-width:2201px`, `2301px`, `2501px`.

**Practical breakpoint system** (the ones worth treating as "real"): **≤499 / ≤599 / ≤899 / ≤999 / ≤1099 / ≤1199 / ≤1399px**, with fluid type scaling continuously between **500–1920px**.

---

## 5. Radius, shadow, transitions, z-index

### 5.1 Border-radius (count)

16px ×23, 24px ×18, 12px ×9, 17px ×5, 8px ×4, 3px ×4, 2px ×4, `clamp(1rem,.65rem + 1.13vw,2rem)` ×3–4 (fluid radius, two near-identical clamp formulas differing by a rounding digit — `.6479rem` vs `.6477rem`, likely a build artefact), 50%/100% ×3+2 (circles), 48px ×2, 22px ×2 (buttons), 100px ×2.

No single "radius scale" — 16/24/12px are the dominant three, but 17px (form submit button) and 22px (`.btn`) sit awkwardly between them (INCONSISTENCY — three different "pill-ish" radii: 17, 22, 24px, all used for similar button-shaped elements).

### 5.2 Box-shadow

Mostly `none` (14 occurrences — most cards/panels are flat by default). Named tokens: `--box-shadow-primary: 0 4px 16px rgba(0,0,0,.1)`, `--box-shadow-primary-hover: 0 8px 18px rgba(0,0,0,.2)`. A handful of one-off shadows exist outside these tokens (`0 8px 32px rgba(0,0,0,.2)`, `0 2px 8px rgba(0,0,0,.4)`, `2px 0 12px rgba(0,0,0,.15)`, `0 0 72px rgba(0,0,0,.3)`) — not consolidated into the token pair.

### 5.3 Transitions

Dominant pattern: `transition: all .25s ease-in-out` (7), `.5s ease-in-out` (6), `.3s ease-in-out` (5) — i.e., mostly `all` transitions at 250/300/500ms with `ease-in-out`. A separate `cubic-bezier(0,0,.25,1)` custom easing is used twice for transform-heavy interactions (dropdown chevrons). No CSS custom properties define standard durations/easings — each rule repeats the raw values.

### 5.4 z-index

Small integers 0–15 dominate (site chrome/stacking), plus a cluster around **1080–1084** and one **9999**/**999** — likely modal/lightbox layers (LightGallery plugin) sitting far above the rest of the site's z-index range.

---

## 6. Buttons, links, inputs

### 6.1 Buttons — `.btn` / `.wp-block-button__link` family

- Shape: `border-radius:22px`, `padding:11px 24px` (small variant `8px 14px`), `display:flex; align-items:center; gap:8px`, `font-weight:700`, `line-height:1`.
- `transition:all .25s ease-in-out`; hover = `transform:translateY(-3px)` (consistent lift effect across `.btn`, `.btn--outline-secondary`, `.wp-block-button__link`).
- Variants: `--primary` (navy fill/border, white text), `--secondary` (sage fill/border), `--neutral` (`--color-medium` fill, navy text/border `--color-neutral` — note `--color-neutral` isn't in the `:root` token list found, likely undefined/fallback), `--outline` (transparent, navy border+text), `--outline-white`, `--outline-secondary`.
- Core WP block button (`.wp-block-button__link`) duplicates much of `.btn`'s styling independently (separate `!important` background/padding rule for `.wp-block-button__link` background/padding) rather than sharing one class — two parallel button implementations exist in the CSS.

### 6.2 Inputs / forms (Gravity Forms + FacetWP)

- `.gform_wrapper` panel: `background:#f7f9fd; border-radius:24px; padding:48px` → `30px 24px` (≤899px) → `24px 16px` (≤499px).
- Text inputs (`.gform_wrapper input`, `.gfield textarea.small`): `background:#fff; border:1px solid var(--Primary-5,#e3e4ef); border-radius:12px; padding:11.5px 12px`.
  - **INCONSISTENCY:** the fallback value `#e3e4ef` for this custom property doesn't match the theme's actual `--color-primary-5` token (`#dadadc`) — looks like a hand-copied Figma value that drifted from the real design token.
- Submit button: `border-radius:17px; padding:10px 20px; background:var(--color-primary); color:#fff` (Gravity Forms) vs a separate generic `input[type=submit]` rule using `--color-secondary` fill with navy text, `padding:8px 18px` — two different submit-button treatments coexist.
- FacetWP search inputs use yet another style: transparent background, bottom-border only (`1px solid var(--color-secondary)`), no radius — appropriate for header/dark contexts, but confirms there's no single shared "input" component style, each plugin/context reinvents it.

### 6.3 Links

No single global link-hover treatment found beyond `.btn`-style translateY lifts on button-styled links; plain inline text links inherit colour with no separately extracted `a:hover` token (not enough signal to generalise — would need targeted page-level QA).
