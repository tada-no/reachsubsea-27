# Old Figma Token Extract — Reach Subsea website (file `IqEKofKVdD06iF3A1Dlzrz`)

Read-only extraction. No nodes were created, edited, renamed or deleted in Figma.

## Key takeaways

1. Core palette is real and consistent: navy **#282C59** (Primary/100) and sage **#6EAA8C** (Secondary/100) are genuine local Figma styles, not just given assumptions — confirmed by both style defs and heavy usage on real pages.
2. Backgrounds **#F1F7F3** (Secondary/5) and **#F7F9FD** (Primary/Lightest) also exist as named styles; #F7F9FD is used moderately (21×), #F1F7F3 almost never used directly as a fill (1×) in the sampled frames — it's mostly a page-canvas colour, not a component fill.
3. A muted lavender-grey **#B4B2C9** (Primary/25) is the single most-used non-navy fill (107×) across sampled pages — a real, heavily-used colour not in the "known brand" list given.
4. **#D53626** red appears 20× across the *latest* sampled pages (not just the messy Symbols page) — brand-foreign colour bleeding into current designs, not fully cleaned up.
5. One style, **Other/Variants = #9747FF**, is Figma's default placeholder purple — dead/unused style, not a real token.
6. Type scale in local text styles runs H1 112 → H2 80 → H3 64 → H4 32 → H5 24, but sampled desktop pages never use H1/H2 (112/80px) — largest heading actually used is 64px (2 instances) and 48px (H4.5, 3 instances). Body copy is dominated by 18/32 "Paragraph large" (90 uses) and 16/150% "Paragraph regular" (66 uses).
7. Desktop frame is consistently **1440px**; simple pages use a **1320px content column** (60px side margins — off the 8px grid, 60÷8=7.5). Sidebar pages (Services/Vessels) are inconsistent: sidebar 272px vs 284px, content column 1168px vs 1096px for the same template.
8. Section vertical rhythm varies by template: 112px (Home), 160px (Services/Vessels), 48px (News card rows) — all multiples of 8, but not one shared value.
9. Corner radii are inconsistent: clean 8-grid values (16, 24, 32) sit alongside odd values (12, 17, 19, 21) with no obvious system.
10. Icons mix three different sources/styles under one roof: Phosphor-style outline icons (MagnifyingGlass/List/X, 24px, near-zero "stroke" — actually filled vectors), a 2px true-stroke Open/Close chevron pair (24px), and imported Iconify icons (`mdi:linkedin`, `ri:chat-quote-fill`) — no single consistent line-icon system.

## 1. Local styles & variables

**Variables:** none found — `figma.variables.getLocalVariableCollectionsAsync()` returned an empty array. All tokens in this file are Figma **styles**, not variables.

### Colour styles (paint styles)

| Style name | Hex | Notes |
|---|---|---|
| White | #FFFFFF | |
| Primary/100 | #282C59 | = brand navy |
| Primary/90 | #3D416A | |
| Primary/75 | #575A7C | heavily used (40× in sample) |
| Primary/50 | #9494AB | |
| Primary/25 | #B4B2C9 | most-used non-navy fill (107×) |
| Primary/10 | #CACAD6 | |
| Primary/5 | #E3E4EF | |
| Primary/shade | #1B1D3B | |
| Primary/Light | #F5F6FF | |
| Primary/Lightest | #F7F9FD | = brand bg (21×) |
| Secondary/100 | #6EAA8C | = brand sage |
| Secondary/75 | #8BB9A2 | |
| Secondary/50 | #A8C6B8 | |
| Secondary/25 | #B7D5C6 | |
| Secondary/10 | #DBEAE2 | |
| Secondary/5 | #F1F7F3 | = brand bg (used as canvas colour, only 1× as a fill) |
| Secondary/shade | #5B9A7B | |
| Secondary/shade dark | #416E58 | |
| Neutral/Extra light | #F5F5F5 | |
| Neutral/Light | #EAEAEA | |
| Neutral/Medium | #D0D0D0 | |
| Neutral/Dark | #636362 | |
| Neutral/Black | #40403F | |
| Other/Variants | #9747FF | Figma default placeholder purple — unused/dead style |
| Gradient card / Gradient card hover / card grad 2025 | navy 40%→100% linear | 3 near-duplicate gradient styles |
| Gradient dark / Gradient dark reverse | #282C59 → #1B1D3B linear | duplicate pair (reversed direction only) |

### Text styles (30 total)

| Style | Size | Line-height | Letter-spacing | Case |
|---|---|---|---|---|
| H1 | 112 | 124px | -1px | — |
| H2 / H2 bold | 80 | 82px | -0.5px | — |
| H3 | 64 | 120% | -1px | — |
| H3 bold | 64 | 120% | 0px | — |
| H4 / H4 bold | 32 | 130% | -0.3px | — |
| H4.5 bold | 48 | 130% | -0.3px | — |
| H5 / H5 bold | 24 | 140% | -0.5px | — |
| Paragraph large / bold | 18 | 32px | 0px | — |
| Paragraph large bold button | 18 | 24px | 0px | — |
| Paragraph large bold CAPS | 18 | 32px | 0px | UPPER |
| Paragarph regular [sic] | 16 | 150% | -1% | — |
| Paragraph regular bold | 16 | 160% | -1% | — |
| Body small 14 / bold | 14 | 24px | 0px | — |
| Body small 14 list | 14 | 28px | 0.2px | — |
| Label small | 11 | auto | 0.25px | — |
| Button Default Bold / Reg / Reg sm | 16 / 16 / 14 | auto | 0px | — |
| Button Small Bold / Bold UL | 14 | auto | 0px | — |
| head mobile | 24 | 36px | 0px | — |
| Head mobile large | 42 | 48px | 0px | — |
| paragraph mobile / bold / black | 16 | 28px / 24px | 0px | — |
| Paragraph menu mobile | 16 | 28px | 0px | — |
| Paragraph small mobile | 13 | 24px | 0.2px | — |
| p large list | 18 | 32px | 0px | — |

Font family throughout: **Inter** (Regular / Bold). Note the misspelled style name "Paragarph regular" — evidence of drift/typos in the system itself.

### Effect styles

| Style | Type | Radius | Y-offset | Colour/opacity |
|---|---|---|---|---|
| card hover | Drop shadow | 72 | 0 | black 30% |
| small card | Drop shadow | 16 | 0 | black 4% |

Only these 2 effect styles exist file-wide; neither appeared as an applied effect anywhere in 3 of the 4 sampled frames — only Home 2025 v3 used a shadow directly (`DROP_SHADOW r16 y0 a4%` ×4, matching "small card").

### Grid style

"left grid": 11 columns, gutter 30, section 65, offset 3 (plus a hidden 2-col centred variant, gutter 1110, section 15). This looks like a small-scale layout grid (e.g. for icon/logo construction), not the page-level column grid — no page-level layout grid style was found bound to the sampled frames.

## 2. Colours actually used (tallied across 4 sampled desktop frames)

| Hex | Count | Notes |
|---|---|---|
| #282C59 | 217 | navy — dominant |
| #B4B2C9 | 107 | lavender-grey accent (Primary/25) |
| #6EAA8C | 91 | sage |
| #575A7C | 40 | Primary/75, used as a real UI colour |
| #FFFFFF | 47 | |
| #F7F9FD | 21 | |
| #D53626 | 20 | **brand-foreign red — flag** |
| #000000 | 15 | (shadows/overlays, not necessarily fills) |
| #282C59 @30% | 7 | overlay tint |
| #D8D8D8 | 4 | near-duplicate of Neutral/Light (#EAEAEA) — off-style grey |
| #9494AB | 4 | Primary/50 |
| #E3E4EF | 3 | Primary/5 |
| #F1F7F3 | 1 | brand bg, rarely used as a fill |
| GRADIENT_LINEAR | 12 | navy gradients |
| IMAGE fills | 43 | photography |

Near-duplicates/flags: **#D8D8D8** vs styled Neutral/Light #EAEAEA (two greys doing the same job); **#D53626** has no matching local style at all — it's a hard-coded, off-system colour.

## 3. Typography actually used (role mapping, tallied across the 4 sampled frames)

| Role (nearest style) | Size/LH/LS seen | Count | Node evidence |
|---|---|---|---|
| H3 bold (hero page title) | 64 / 120% / 0 | 2 | e.g. "Services", "Vessels" page titles |
| H4.5 bold | 48 / 130% / -0.3 | 3 | |
| H4 | 32 / 130% / -0.3 | 14 | |
| H5 | 24 / 140% / -0.5 | 24 | |
| Paragraph large (body/eyebrow lead) | 18 / 32px / 0 | 90 (58 mixed + 32 explicit) | dominant body style |
| Paragraph regular | 16 / 150–160% / -1% | 66 | |
| Body small 14 | 14 / 24px / 0 | 45 | |
| Button Small Bold | 14 / auto / 0 | 31 | |
| Button Default Reg | 16 / auto / 0 | 22 | |
| Label small (eyebrow) | 11 / auto / 0.25 | 15 | |
| Button Default Reg sm | 14 / auto / 0 | 12 | |
| **Off-style outlier** | 14 / 20px / 0 | 4 | doesn't match any defined text style (Body small is 14/24) |
| **Mobile style used on desktop** | 16 / 28px / 0 ("paragraph mobile") | 4 | style bleed between mobile/desktop kits |

H1 (112px) and H2 (80px) — defined in the type scale — were **not used at all** in the 4 sampled desktop frames.

## 4. Layout

- **Desktop frame width:** 1440px (all sampled frames).
- **Simple/full-bleed pages** (Home, News & Projects): content column **1320px**, side margin **60px** each (1440 − 1320 = 120 ÷ 2). 60px is off the 8px grid.
- **Sidebar pages** (Services, Vessels): sidebar width **272px** (Services) vs **284px** (Vessels) — inconsistent; content column **1168px** (Services) vs **1096px** (Vessels) — inconsistent for the same template type. Both share top padding **140px** and internal item spacing **80px**.
- **Section vertical spacing** (`itemSpacing` on the outer vertical stack): Home 2025 v3 = 112px; Services/Vessels = 160px; News & Projects card rows = 48px.
- **Common auto-layout gaps** (tallied): 0 (191, mostly zero-gap wrappers), 8 (78), 24 (43), 32 (38), 16 (25), 6 (21), 12 (20), 4 (15), 48 (13) — clean 4/8 multiples. Two outliers: **162** (15×) and **587** (4×) — one-off, not on any grid, likely accidental.
- **Common paddings** (top uses): `T6 R16 B6 L16` (49× — button/tag padding), `T10 L0 B10` (20×), `T0 R4 B0 L4` (21×), `T0 R16 B0 L16` (9×), `T8 R16 B8 L16` (9×).
- **Mobile frame width:** 375px (iPhone). Side-margin evidence is inconsistent between samples: `home mobile` (284:2913) shows repeated left-inset x=42 (5×, implying ~42–43px symmetric margins with 290px-wide children), while `assets - havila` (329:4417) shows x=43 (12×, 290px children) alongside a narrower x=13 pattern (349px children, ~13px margins). No single clean mobile margin value.

## 5. Radius, strokes, shadows (tallied across the 4 sampled frames)

| cornerRadius | Count | On 8-grid? |
|---|---|---|
| 12 | 49 | no |
| 16 | 31 | yes |
| 32 | 14 | yes |
| 21 | 21 | no |
| 19 | 10 | no |
| 17 | 7 | no |
| 24 | 3 | yes |

Strokes: weights seen — 1px (20×), 2px (6×), 0px (6×, likely disabled/legacy strokes left on nodes). Stroke colours: #282C59 (10×), #575A7C (8×), #6EAA8C (8×) — all on-brand.

Shadows: only 4 instances found across all 4 frames, all `DROP_SHADOW r16 y0 a4%` (matches the "small card" effect style), all on Home 2025 v3. Services/Vessels/News use no shadows at all in the sampled frames, despite a "card hover" (r72) style existing in the library — that heavier shadow wasn't found applied anywhere sampled.

## 6. Line icons

No single, cohesive line-icon system. Found on the **Icons** page (`4104:21222`) and inline on **Reach Subsea 2025** (`4508:16623`):

- **Decorative topic icons** ("icons-green-flat_*", "icons-green_venn", etc.) — 96×96px frames, green, stroke weights 1–3px, used for sustainability/topic tiles. Not a UI icon kit.
- **UI icons found inline on page frames**: `MagnifyingGlass`, `List`, `X` — 24×24px, named after **Phosphor Icons**, but their vectors are filled shapes with a near-zero stroke (0.09375px) rather than true outline strokes.
- **`Action=Open/Close, State=Default/Hover`** — 24×24px, 2 vectors each, true 2px stroke — a real line-icon pair (accordion/expand chevrons).
- **Imported one-offs**: `mdi:linkedin` (32px, Material Design Icons), `ri:chat-quote-fill` (24px, Remix Icon) — icons pulled from at least two different icon libraries plus Phosphor, with no unified naming or sizing convention.

## 7. Logo

No component-set (no colour/negative variant switcher) — logo exists as separate flat components/instances:

| Node ID | Name | Type | Size | Where |
|---|---|---|---|---|
| 3:440 | Logo / Reach logo | COMPONENT | 119×26 | Symbols (3:351) |
| 1757:11064 | Logo / Reach logo | COMPONENT | 94×18 | Symbols (3:351) |
| 1757:11304 | Logo / Reach logo 2 | COMPONENT | 80×18 | Symbols (3:351) |
| 5710:50788 | Logo / Reach logo dark | INSTANCE | 178×40 | Sticky page (5672:2375) |
| 1842:13396 | Logo / Reach logo 2 | INSTANCE | 1280×288 | Cover (1842:13394) — large hero lockup |
| 2173:18920 | Logo / Reach logo 2 | INSTANCE | 675×152 | Cover (1842:13394) |
| I3:352;3:28 / ;3:50 / ;3:63 / ;3:66 | "Reach logo" / "Reach logo line Copy/Copy 2/Copy 3" | nested frames inside instance 3:352 | 183×40, 203×40, 416×40, 384×40 | Symbols (3:351) — look like alternate wordmark/lockup widths rather than colour variants |

No explicit "negative"/"white"-on-dark variant was located by name beyond the one "dark" instance above — worth a manual check in Figma before reuse, since naming doesn't cleanly separate positive/negative treatments.

## Sampled frames (node IDs, for revisiting)

| Page | Frame | Node ID | Size |
|---|---|---|---|
| Reach Subsea 2025 (4508:16623) | Home 2025 v3 | 4926:90766 | 1440×2682 |
| Reach Subsea 2025 | Services 2026 | 5379:24176 | 1440×4687 |
| Reach Subsea 2025 | Vessels | 5953:22375 | 1440×3224 |
| Reach Subsea 2025 | News & Projects | 4948:19645 | 1440×3318 |
| Mobile (284:2912) | home mobile | 284:2913 | 375×4246 |
| Mobile (284:2912) | assets - havila | 329:4417 | 375×4242 |
| Icons (4104:21222) | Frame 1 / Icons Flat / icon instances | 4104:22080, 4316:4571, etc. | 96×96 |
| Symbols (3:351) | Logo components (see §7) | see table | — |

**Note:** "Home 2026" (4733:29982, 1440×1116) was initially sampled as the "home" candidate but turned out to contain only a Mega Menu overlay instance, not real page content — screenshot confirmed it's essentially blank navy. "Home 2025 v3" was substituted as the genuinely latest, fully-built homepage.

## Access notes / not accessible

- `get_metadata` on the whole "Symbols" page (3:351) failed twice with a JSON parse/size error — too large to dump directly; worked around by targeted `use_figma` read-only scripts instead.
- Two `get_metadata` calls on `3:351` errored identically; no other tool access failures. Variables API returned zero collections — this file has no Figma Variables, only Styles.
- Full document also contains many older/irrelevant pages not sampled per the brief's scope: Reach Subsea 2024, Reach Subsea 2023, Reach Network, Reach Company Intranet, OLD, Wire 2022 (A/B), Style 2022, Blocks, Avatars, Page 23, Page 1 — available if a deeper historical comparison is ever wanted.
