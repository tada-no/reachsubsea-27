# Blocks (Phase 3b)

Static Astro versions of the WordPress section blocks (22 in code, 21 Sep 2026; the original 14 plus Live operations, Lifecycle, Values, Social feed and the four blocks split out for editors: Card bento, Figures, Split embed, Results band) in [docs/05-blocks-spec.md](../../docs/05-blocks-spec.md). Figma file `HAvCQCXzWNFOKQ1AZxqNTX`, page **Blocks** (`12:25`), is the source of truth; node ids are in [docs/extract/figma-blocks-ledger.json](../../docs/extract/figma-blocks-ledger.json).

```bash
npm run dev    # http://localhost:4321/blocks/
```

## Files

| Path | What |
|---|---|
| `src/styles/tokens.css` | Figma variables as the custom properties theme.json outputs (`--wp--preset--*`, `--wp--custom--*`). Light on `:root`, Navy on `.has-surface-navy`, `.has-surface-light` forces Light |
| `src/styles/base.css` | Reset, text-style classes (`.text-h2`, `.text-lead`, `.text-eyebrow`…), `.container`, `.layout-grid`, `.block` surfaces + `.has-spacing-sm/lg`, `.prose`, `.visually-hidden`, `.scroll-row` |
| `src/components/` | Phase 2 components and shared block parts (below) |
| `src/blocks/<Name>.astro` | One block = one WordPress block `reach/<slug>` |
| `src/demos/<slug>.astro` | Every variant of one block, for the review route |
| `src/review/` | `/blocks` review chrome (registry, iframes, variant labels) |

## Rules for a block

1. **Props = block fields.** Name props after the fields in spec §2 (camelCase for two words: `showContact`, `focalPoint`), plus `background`, `spacing`, `anchor` from `BlockFields` in `src/lib/types.ts`. Figma variant axes that are editor settings become props too (`style`, `layout`, `media`, `position`). `Breakpoint` is never a prop: Mobile is CSS.
2. **Wrapper.** Render `<BlockSection slug="cta" root="cta-band" background={background} spacing={spacing} anchor={anchor} labelledBy={titleId}>`. It outputs `<section class="wp-block-reach-cta cta-band block has-surface-navy has-spacing-lg">` and the `.container`. Use `bleed` if the block handles its own container (Page hero photo).
3. **CSS.** `<style is:global>` in the block file. Every selector starts with the block's root class, BEM inside (`.cta-band__actions`). Tokens only: no hex, no `rgb()`, no raw font size, line height, letter-spacing or spacing. A translucent navy or white is `color-mix(in srgb, var(--wp--preset--color--navy-900) 40%, transparent)`, and a photo scrim is one of the `--wp--custom--scrim--*` tokens. Sizes come from the type scale (`display-xl`, `display`, `h1`–`h5`, `figure`, `lead`, `body`, `body-sm`, `caption`, `eyebrow`, `label`); short labels take `--wp--custom--line-height--tight`. Raw px only for fixed geometry the spec names (control heights, 16px markers, 1–3px rules and rings, min-heights like 640/520, fixed column widths like 416/864 when the spec gives them) and `em` optical nudges. Run the audit in [docs/08](../../docs/08-page-review-checklist.md) §7 before you finish.
4. **Surfaces.** Never hard-code navy styling. A Navy area is an element with `.has-surface-navy`: every token inside flips. A white panel on Tint/Navy uses `.has-surface-light` + `bg/default`.
5. **Breakpoints.** `max-width` media queries at `599px` (mobile, 4 columns), `899px` (tablet: grids drop to 2 columns, 600–1199 per spec) and `1199px`. Type and section spacing are already fluid.
6. **Conditional.** Empty fields render nothing, wrappers included. A block with no items renders nothing (Feed grid filters show the empty state instead).
7. **Headings.** One `h1` per page, only in the Page hero. Section header titles `h2`, card and item titles `h3`. Visual style is a class, not the level.
8. **Landmarks.** `<section aria-labelledby>` pointing at the title id (`makeId()` from `src/lib/ids.ts`). Blocks without a visible title pass `label`.
9. **Images.** `MediaFrame` (3:2, 4:3, 16:9), lazy by default; Page hero passes `priority`.
10. **JS.** A `<script>` in the block file: vanilla TypeScript, event delegation on `document`, works for every instance on the page, progressive enhancement (content visible without JS). Motion respects `prefers-reduced-motion` (base.css already shortens transitions).
11. **No viewport-height units** in blocks (`vh`, `dvh`, `svh`): the review iframes size to content and would grow forever. Use the spec's px min-heights.

## Split blocks (21 Sep 2026, Q67)

A block does one job. If a field only applies to one of its media types or styles, split it. Card grid → **Card bento** (`pattern` from `src/data/bento-patterns.ts`, cards fill the cells in order, no per-card span); Split media → **Figures** and **Split embed** (Card media dropped); Stats band → **Results band**. Each is a normal block file with its own root class (`.card-bento`, `.figures`, `.split-embed`, `.results-band`), a demo in `src/demos/` and an entry in `src/review/registry.ts`.

## Shared components

| Component | Props |
|---|---|
| `BlockSection` | `slug`, `root`, `background`, `spacing`, `anchor`, `labelledBy`, `label`, `bleed`, `class` |
| `SectionHeader` | `eyebrow`, `title`, `intro`, `action` (LinkField), `align` start/center, `id`, `as` |
| `Button` | `label`, `href`, `variant` primary/secondary/outline, `size` medium/small, `leadingIcon`, `trailingIcon`, `disabled` |
| `Link` (.link-arrow) | `label`, `href`, `action` page/external/file/video/expand/anchor, `size`, `showIcon`, `context` (hidden text), `open` |
| `IconButton` | `icon`, `label` (required), `href`, `variant` primary/secondary/outline/ghost, `size` |
| `Icon` | `name` (Tabler outline), `size`, `label` |
| `Pictogram` | `name` (file in `src/assets/pictograms`), `size` 64/96 |
| `Eyebrow` | `text`, `tone` accent/muted, `as` |
| `Badge` | `label`, `tone` neutral/accent/navy/success/error, `icon` |
| `MetaItem` | `icon`, `text`, `href` (tel:/mailto:; sits above a card's stretched link), `as` |
| `Stat` | `value`, `label`, `note`, `size` large/medium, `align`, `as` |
| `FilterChip` | `label`, `count`, `selected` (aria-pressed), `disabled` |
| `SubnavItem` | `label`, `href`, `active`, plus aria attrs (`aria-current`, `role="tab"`, `aria-selected`) |
| `AccordionItem` (.faq-item) | `question`, `answer` or slot, `open`, `id` (use `faq-{slug}` for deep links), `headingLevel` |
| `Card` | `CardField`: `media`, `surface`, `size`, `pictogram`, `image`, `eyebrow`, `badge`, `title`, `description`, `meta[]`, `action`, `headingLevel`. Presets in `src/data/card-presets.ts` |
| `MediaFrame` | `ratio`, `image`, `radius`, `caption`, `showPlay`, `playLabel`, `playAttrs`, `priority` |
| `Dialog` | rendered once per page. Open with `data-lightbox="<group>" data-src data-alt data-caption`, or `data-video-src data-video-title` (`#` = placeholder) |
| `Breadcrumb` | `items` (`{label, href?}[]`, last = current page). Mobile shows the parent link only |
| `Milestone` | `date`, `title`, `text`, `status` done/current/upcoming, `showLine` (off on the last item) |
| `ConsentPlaceholder` | `pictogram`, `title`, `text`, `loadLabel`, `openLabel`, `openHref`, `loadAttrs` |
| `SpecRow` | `label`, `value` |
| `NumberedItem` | `title`, `text`, `headingLevel` |
| `LogoTile` | `type` logo/certificate/sdg, `label`, `logo`, `file`, `goal` |

Pictograms available: `subsea-infrastructure`, `seabed-repair`, `survey`, `survey-rov`, `global-monitoring`, `technology`, `marine`, `shield-tick`.

## Demos

`src/demos/<slug>.astro` renders every Figma variant (Desktop and Mobile are the same markup: the review shows it in a 1440 and a 375 iframe), each preceded by `<VariantLabel name="Photo" props='style="photo"' />`, then the Figma doc's surface examples (Tint, Navy). Copy is plausible Reach placeholder text: no internal notes, no real people's names.
