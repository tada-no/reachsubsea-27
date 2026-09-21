# Reach Subsea 2027 — Foundations proposal (Phase 1)

_Status: approved (Q20) and **built** in Figma `HAvCQCXzWNFOKQ1AZxqNTX` on 15 Sep 2026: 6 collections, 130 variables, 14 text styles, 3 effect styles, 2 grid styles, and the Foundations page (page skeleton per Q21). Validation passed: 0 broken aliases, 0 ALL_SCOPES, code syntax on all variables._
Sources: [`extract/dev-theme-tokens.md`](extract/dev-theme-tokens.md), [`extract/old-figma-tokens.md`](extract/old-figma-tokens.md). Decisions Q11–Q18 in [`00-questions.md`](00-questions.md).

## 0. Agreed rules

| Topic | Decision |
|---|---|
| Naming | Figma names describe the role (`color/text/primary`, `space/24`). Dev Mode code syntax points to WordPress `theme.json` output: palette, font size and spacing **presets** use `var(--wp--preset--…)`, and everything else uses `settings.custom` → `var(--wp--custom--…)` (Q11). |
| Responsive | The Typography and Layout collections have **Desktop (1440)** and **Mobile (375)** modes. In code, type and section spacing use `clamp()` between 375 and 1440px viewports, and tablet interpolates (Q12). |
| Colour | New 50–900 ramps anchored on the exact brand hexes (Q13). The semantic Color collection has **Light** and **Navy** modes, so setting Navy on a section or card flips every token inside it (Q14). |
| Tint surface | `navy/50 #F7F9FD`. Sage/50 `#F1F7F3` is only for small accents (Q15). |
| Red | Errors only: `#C02B0A`. `#D53626` is dropped (Q16). |
| Grid | 12 columns, container max 1600px, text column 880px (Q17). |
| Largest heading | Display 80/88 desktop, 44/48 mobile (Q18). |
| Grid unit | Spacing, layout, radius and shadows are on the **8px** grid. Type sizes and line heights sit on a **4px** baseline (the only 4px values are 20, 28 and 44). |
| Fonts | Inter only, Regular 400 / Medium 500 / Bold 700, the three weights the theme already loads. |

## 1. Variable collections

| # | Collection | Modes | Contents | Scopes |
|---|---|---|---|---|
| 1 | Primitives | Value | colour ramps, status colours, navy alphas | hidden (`[]`), shadow alphas `EFFECT_COLOR` |
| 2 | Color | Light, Navy | 31 semantic colours → aliases to Primitives | fill / text / stroke per role |
| 3 | Spacing | Value | `space/0…160` | `GAP` |
| 4 | Radius | Value | `radius/none…full` | `CORNER_RADIUS` |
| 5 | Layout | Desktop, Mobile | section rhythm, stack gaps, grid margin/gutter, container widths | `GAP` / `WIDTH_HEIGHT` |
| 6 | Typography | Desktop, Mobile | font size + line height per text style, family, weights | `FONT_SIZE` / `LINE_HEIGHT` / `FONT_FAMILY` / `FONT_STYLE` |

Styles: 14 text styles (size and line height bound to Typography variables), 3 effect styles (shadow colour bound to alpha primitives), 2 grid styles.

## 2. Colour primitives

Code syntax `var(--wp--preset--color--{ramp}-{step})`. Contrast ratios computed against white and navy/800.

### Navy
| Step | Hex | vs white | vs navy/800 | Source |
|---|---|---|---|---|
| 50 | `#F7F9FD` | 1.05 | 12.5 | old Primary/Lightest, dev `primary-light` |
| 100 | `#E3E4EF` | 1.26 | 10.4 | old Primary/5 (the form border value) |
| 200 | `#CACBD6` | 1.61 | 8.2 | theme.json `primary-10` |
| 300 | `#B4B2C9` | 2.07 | 6.4 | old Primary/25 (107 uses) |
| 400 | `#9494AB` | 2.96 | 4.4 | old Primary/50 |
| 500 | `#757693` | 4.40 | 3.0 | new (OKLab midpoint of 400/600) |
| 600 | `#575A7C` | 6.65 | 2.0 | old/dev Primary/75, secondary text |
| 700 | `#3D416A` | 9.71 | 1.4 | old Primary/90 |
| **800** | **`#282C59`** | 13.17 | — | **brand navy** |
| 900 | `#1B1D3B` | 16.34 | 1.2 | old/dev shade, theme.json `black` |

### Sage (lightness matched to navy at every step, so the brand sits at 400)
| Step | Hex | vs white | vs navy/800 | Source |
|---|---|---|---|---|
| 50 | `#F1F7F3` | 1.09 | 12.1 | old Secondary/5, dev `page-bg` |
| 100 | `#DBEAE2` | 1.24 | 10.6 | old Secondary/10 |
| 200 | `#B7D5C6` | 1.57 | 8.4 | old Secondary/25 |
| 300 | `#8BB9A2` | 2.20 | 6.0 | old/dev Secondary/75 |
| **400** | **`#6EAA8C`** | 2.70 | 4.9 | **brand sage** |
| 500 | `#5C8E75` | 3.76 | 3.5 | dev secondary-shade |
| 600 | `#416E58` | 5.84 | 2.3 | old/dev shade dark, text-safe sage |
| 700 | `#2A4E3D` | 9.31 | — | new |
| 800 | `#1B392B` | 12.60 | — | new |
| 900 | `#0F261B` | 15.99 | — | new |

Dropped: `#A8C6B8` (old Secondary/50, 2 uses) → use sage/300.

### White (no neutral ramp — Q19)
`white #FFFFFF` is the only neutral. Navy 50–400 are already near-grey tints (OKLCH chroma 0.006–0.034), so they cover borders, disabled states and image placeholders. A separate grey ramp would duplicate them and cause the same drift the old file had. The old warm greys (`#F5F5F5`, `#EAEAEA`, `#D0D0D0`, `#636362`, `#40403F`, and the stray `#D8D8D8`) are retired.
Primitives total: navy 10 + sage 10 + white 1 + status 6 + alphas 4 = **31**.

### Status
| Token | Hex | Note |
|---|---|---|
| red/50 | `#FFF1ED` | error background |
| red/300 | `#F0A08E` | error text on navy (6.4:1) |
| red/600 | `#C02B0A` | error text/border on light (5.9:1) |
| green/50 | `#ECFAEB` | success background |
| green/300 | `#96CF95` | success text on navy (7.3:1) |
| green/700 | `#2E7D31` | success text on light (5.1:1) |

### Alphas (navy/900 `#1B1D3B`)
`alpha/navy-8` 8% · `alpha/navy-12` 12% · `alpha/navy-16` 16% (shadows) · `alpha/navy-64` 64% (image scrim)

### Legacy slug mapping (for the developer's theme.json)
| Existing slug | Old value | Maps to |
|---|---|---|
| `primary` | `#282c59` | navy/800 (same) |
| `secondary` | `#6eaa8c` | sage/400 (same) |
| `black` | `#1b1d3b` | navy/900 (same) |
| `primary-light` | `#F7F9FD` | navy/50 (same) |
| `page-bg` | `#f1f7f3` | sage/50 (same) |
| `primary-10` | `#CACBD6` / CSS `#d2d2d7` | navy/200 |
| `primary-50` | `#85879e` | navy/500 (nearest) |
| `secondary-50` | `#a8c6b8` | sage/300 (nearest) |
| WP core defaults (vivid-red etc.) | — | remove from the palette |

New ramps use `navy-*` / `sage-*` slugs, **not** `primary-50`-style slugs. The old `primary-50` meant a 50% tint, so reusing that name for the lightest step would silently recolour existing content. Legacy slugs stay as aliases until migration.

## 3. Semantic colour (Light | Navy)

Code syntax `var(--wp--custom--color--{group}--{name})`. The Navy mode is one CSS class (e.g. `.has-surface-navy`) that redefines these custom properties.

| Token | Light | Navy | Scopes |
|---|---|---|---|
| **bg/default** | white | navy/800 | frame, shape fill |
| **bg/tint** | navy/50 | navy/900 | frame, shape fill |
| bg/accent-subtle | sage/50 | navy/700 | frame, shape fill |
| bg/disabled | navy/100 | navy/700 | frame, shape fill |
| bg/overlay | alpha/navy-64 | alpha/navy-64 | frame, shape fill |
| bg/error-subtle | red/50 | red/50 | frame, shape fill |
| bg/success-subtle | green/50 | green/50 | frame, shape fill |
| **text/primary** | navy/800 (13.2) | white (13.2) | text fill |
| text/secondary | navy/600 (6.7) | navy/100 (10.4) | text fill |
| text/accent | sage/600 (5.8) | sage/300 (6.0) | text fill |
| text/disabled | navy/400 | navy/400 | text fill |
| text/on-overlay | white | white | text fill |
| text/error | red/600 | red/300 | text fill |
| text/success | green/700 | green/300 | text fill |
| border/subtle | navy/100 | navy/700 | stroke |
| border/default | navy/200 | navy/600 | stroke |
| border/strong | navy/500 (4.4, inputs ≥3:1) | navy/400 (4.4) | stroke |
| border/accent | sage/400 | sage/400 | stroke |
| border/focus | sage/600 (5.8) | sage/300 (6.0) | stroke |
| border/error | red/600 | red/300 | stroke |
| icon/primary | navy/800 | white | shape fill, stroke |
| icon/accent | sage/500 (3.8) | sage/400 (4.9) | shape fill, stroke |
| action/primary/bg | navy/800 | sage/400 | frame, shape fill |
| action/primary/bg-hover | navy/900 | sage/300 | frame, shape fill |
| action/primary/fg | white (13.2) | navy/900 (6.1) | text, shape fill |
| action/secondary/bg | sage/400 | white | frame, shape fill |
| action/secondary/bg-hover | sage/300 | navy/50 | frame, shape fill |
| action/secondary/fg | navy/900 (6.1) | navy/900 (16.3) | text, shape fill |
| action/outline/border | navy/800 | white | stroke |
| action/outline/fg | navy/800 | white | text, shape fill |
| action/outline/bg-hover | navy/50 | navy/700 | frame, shape fill |

Notes: white text on sage fails (2.7:1), so sage buttons always use navy text, as the dev submit button already does. Alerts on navy backgrounds should set Light mode on the alert itself.

## 4. Typography (Desktop | Mobile)

Code syntax: size `var(--wp--preset--font-size--{style})` (fluid preset, min = Mobile, max = Desktop), line height `var(--wp--custom--line-height--{style})`. Letter spacing is set as a percentage on the style, so it scales automatically.

| Style | Desktop size/LH | Mobile size/LH | Weight | Tracking | Use | Replaces |
|---|---|---|---|---|---|---|
| display-xl | 128 / 0.9 | 64 / 0.9 | Bold | −4% | the one giant data figure (Figures block). Added 21 Sep 2026 | none |
| display | 80 / 88 | 44 / 48 | Bold | −2% | hero headline | old H2 80, dev hero 112 |
| h1 | 64 / 72 | 40 / 48 | Bold | −1.5% | page title, stat value | old H3 64, dev h1 56 |
| h2 | 48 / 56 | 32 / 40 | Bold | −1% | section header | old H4.5 48, dev h2 48 |
| h3 | 32 / 40 | 24 / 32 | Bold | −0.5% | sub-section, featured card | old H4 32, dev h3 32 |
| h4 | 24 / 32 | 20 / 28 | Bold | 0 | card title | old H5 24, dev h4 24 |
| h5 | 20 / 28 | 18 / 24 | Bold | 0 | small card title, list heading | dev h5 18 |
| lead | 20 / 32 | 18 / 28 | Regular | 0 | intro paragraph | old Paragraph large 18/32 |
| body | 18 / 28 | 16 / 24 | Regular | 0 | body copy | dev body 16→18 |
| body-sm | 16 / 24 | 14 / 20 | Regular | 0 | card text, meta list | old Paragraph regular 16 |
| figure | 40 / 1 | 32 / 1 | Bold | −3% | a data figure inside a card, row or band (Results band, Figures cards). One step below h2. Added 21 Sep 2026 | none |
| caption | 14 / 20 | 14 / 20 | Regular | 0 | footnotes, image credits, legal | old Body small 14 |
| eyebrow | 14 / 20 | 12 / 16 | Bold | +6%, UPPER | eyebrow, badge, table head | old Label small 11, dev 11–12 |
| label | 14 / 20 | 14 / 20 | Medium | 0 | nav, chips, form labels | dev nav 14 |
| button | 16 / 24 | 16 / 24 | Bold | 0 | button | dev .btn 16/700 |
| button-sm | 14 / 20 | 14 / 20 | Bold | 0 | small button | old Button Small Bold 14 |

This replaces the dev theme's 8+ one-off hero `h1` ranges and the old file's 30 text styles. Dropped: H1 112, mobile-only duplicates, typo'd styles.

Two more tokens for text that is not a style: `line-height/tight` = 1.3 (unitless; short labels, dates and chart captions, never running text) and `letter-spacing/figure` −0.03em, `letter-spacing/display-xl` −0.04em. Figure and display-xl set their own unitless leading (1 and 0.9). Added 21 Sep 2026 (Q69) so no block sets a raw size, leading or tracking.

Typography variables: `font/family/sans = Inter`, `font/weight/regular|medium|bold` (style strings), plus `font/size/{style}` and `font/line-height/{style}` × 14 styles × 2 modes.

## 5. Spacing

`space/{n}`, code syntax `var(--wp--preset--spacing--{n})`, which reuses the dev theme's px preset slugs:
**0, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128, 160**
The dev set is kept intact, with 0, 4 and 12 added for component internals and 160 for large sections. WordPress's default rem spacing scale (`--spacing--20…80`) should be switched off in theme.json.

## 6. Layout (Desktop | Mobile)

| Token | Desktop | Mobile | Code syntax |
|---|---|---|---|
| section/sm | 64 | 48 | `--wp--custom--section--sm` |
| section/md (default) | 96 | 64 | `--wp--custom--section--md` |
| section/lg | 128 | 80 | `--wp--custom--section--lg` |
| stack/xs | 8 | 8 | `--wp--custom--stack--xs` |
| stack/sm | 16 | 16 | `--wp--custom--stack--sm` |
| stack/md | 24 | 16 | `--wp--custom--stack--md` |
| stack/lg | 40 | 24 | `--wp--custom--stack--lg` |
| stack/xl | 64 | 40 | `--wp--custom--stack--xl` |
| grid/margin | 64 | 24 | `--wp--style--root--padding-left/right` |
| grid/gutter | 32 | 16 | `--wp--custom--grid--gutter` |
| grid/columns | 12 | 4 | documentation only |
| container/wide | 1600 | 1600 | `--wp--style--global--wide-size` |
| container/content | 880 | 880 | `--wp--style--global--content-size` |

Section values fix the dev theme's inverted `--section-medium` (288) / `--section-big` (272).

**Grid maths.** 1440 frame: 64 + 12×80 + 11×32 + 64 = 1440. At the 1600 max, columns are 104px. 375 frame: 4 columns, 16 gutter, 24 margins. Content reaches its max at a 1728px viewport.
**Grid styles:** `Grid/Desktop 1440` (12 col stretch, 64 margin, 32 gutter), `Grid/Mobile 375` (4 col stretch, 24 margin, 16 gutter).
**Breakpoints (code):** <600 mobile · 600–899 tablet · 900–1199 small desktop · ≥1200 desktop. These reuse the dev theme's 599/899/1199 and replace its 40+ one-off values.

## 7. Radius

| Token | Value | Use | Replaces |
|---|---|---|---|
| radius/none | 0 | full-bleed media | — |
| radius/sm | 8 | tags, thumbnails inside cards | old 12, dev 8 |
| radius/md | 16 | inputs, small cards, dropdowns | old 12/16/17/19/21, dev 12/16/17 |
| radius/lg | 24 | cards, panels, form panel | dev 24 |
| radius/xl | 32 | large media, hero panels | old 32 |
| radius/full | 9999 | buttons, badges, chips | dev btn 22 |

Code syntax `var(--wp--custom--radius--{name})`.

## 8. Shadows (effect styles, navy-tinted)

| Style | Value | Use | Replaces |
|---|---|---|---|
| shadow/sm | 0 2 8 alpha/navy-8 | resting raised card | old "small card" r16 4%, dev 0 4 16 10% |
| shadow/md | 0 8 24 alpha/navy-12 | card hover | dev hover 0 8 18 20% |
| shadow/lg | 0 16 48 alpha/navy-16 | mega menu, dialogs | old "card hover" r72 30% |

Code syntax (in the style description) `var(--wp--preset--shadow--{sm|md|lg})`.

## 9. Out of scope for Phase 1
Motion (dev `.25s ease-in-out` and the −3px hover lift carry into Phase 2 Button/Card), gradients/scrims (Card image-bg in Phase 2), icons (a single outline set to be chosen in Phase 2), logo components.

## 10. Figma build plan (after approval)
1. Collections + Primitives → 2. Color (Light/Navy) → 3. Spacing, Radius → 4. Layout → 5. Typography variables → 6. Text styles (bound) → 7. Effect + grid styles → 8. Validation (counts, aliases, scopes, code syntax) → 9. **Foundations** page: primitive ramps, Light/Navy surface demo, type specimens (Desktop + Mobile), spacing bars, grid diagrams, radius, shadows. Everything bound to variables, followed by a screenshot review.
