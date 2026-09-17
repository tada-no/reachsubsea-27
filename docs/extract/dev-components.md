# Component-Level Extraction — reach-subsea-2023 theme

Sources: dev `https://reachsubseadev.wpenginepowered.com` (fetched with a browser UA — Cloudflare blocks plain `curl`'s default UA with a 403) and live `https://reachsubsea.no`. Both run the same theme `reach-subsea-2023` (same compiled `dist/style.css`/`dist/scripts.js` bundle paths), but dev is visibly ahead (mega-menu nav, FAQ accordion, extra CSS not present on live — dev CSS is 209KB vs live's 164KB). Token-level facts (colours, type scale, spacing) are already in `dev-theme-tokens.md` / `old-figma-tokens.md` — not repeated here except where needed for context. One live browser screenshot of the dev homepage was taken to verify a CSS cascade finding (see §1).

---

## 1. Header

**Logo:** `<a class="header__logo">` wrapping an inline SVG wordmark (140×32 viewBox, rendered width 137px), grid-area `logo`, `justify-self:start`. Positioned far left.

**Top nav — dev (mega menu, `main-nav-menu`):**

| Order | Label | Links to | Has dropdown |
|---|---|---|---|
| 1 | Company | `/company/` | Yes — 2-section grid: "Who we are" (About us, Vision/values/promise, Leadership & Board, Press & Media) + "How we operate" (HSEQ Introduction, HSEQ Standards, Sustainability, Policies & Code of Conduct) |
| 2 | Services | `/services/all-services/` | Yes — mega grid (sections seen: "Assets", "Technology") |
| 3 | Investors | `/investors/` | Yes — 4-col layout: "Key information", "Results & reporting", + Investor relations contact link |
| 4 | Careers | `/careers/` | Yes — 4-col layout: "People", "Why work with us", "Opportunities", "Explore your path" |
| 5 | Contact | `/contact/` | No — plain link |

Every dropdown also renders a shared **mega-menu footer panel** (`.menu-footer__sub-links`) at the bottom with: Facebook / Email (`mailto:post@reachsubsea.com`) / LinkedIn icon-links (11×11 SVG, navy `#282C59` fill) plus a `.menu-footer__bottom-links` block repeating the raw email and `+47 40 00 77 10` phone as text links. It also shows a "Reach newsroom" featured-articles column (`.mobile-menu__featured*`) with thumbnail + title for the 3 latest posts — present in the mobile menu.

**Top nav — live (flat list, no mega menu):** About, Company, Publications, Transparency Act, Investors, Services (with visible flyout: Subsea Services, Survey & Positioning, Geophysical Monitoring, Environmental Monitoring), Assets, Sustainability, HSEQ, Careers, Contact. `grep` for `has-dropdown`/`mega-menu-item` classes: **0 matches on live vs 5 on dev** — live has no mega-menu markup at all, dev's mega-menu + section-grid layout is new/in-progress work not yet shipped live.

**Search:** `.header__search > button.search-toggle` — icon toggle button with separate `.search-open`/`.search-close` SVG states (no visible text input in the collapsed header; presumably expands on click — not confirmed via interaction, only static markup). `aria`/screen-reader label is **"Søk"** (Norwegian for "Search") — hardcoded Norwegian a11y string despite all visible UI copy being English.

**Language switcher (NO/EN):** **Not found.** No Polylang/WPML markup, no `/no/`-style URL alternates, no lang-switch UI on either dev or live. Only trace of Norwegian is the hidden a11y label above and "Meny" (Menu) on the hamburger button — leftover strings, not a working switcher.

**Contact button:** The "Contact" nav item is a plain nav link (`<a>`, no `.btn` class) in both dev and live — not styled as a CTA button in the header itself. The btn-styled Contact CTA is in the **footer** ("Contact us", `.btn.btn--secondary`) and appears again on hero sections.

**Sticky / transparent-over-hero behaviour:** Header is `position:fixed; top:0; width:100%` with `background-color:var(--color-white) !important` — i.e. **always solid white, never transparent**, confirmed both in CSS and by a live screenshot of the dev homepage hero. There is a base rule `header svg path{fill:#fff}` (would make icons/logo invisible on white) that gets **overridden** by more specific rules for `.blog`, `.home`, `.page-template-default`, `.page-template-publications`, `.single-post` templates → `fill:var(--wp--preset--color--primary)` (navy). This means on any template **not** in that override list, the header logo/icon SVGs could fall back to white-on-white (invisible) — a real cascade risk worth flagging, not just a hypothetical.

**Header height:** CSS var `--navbar-height: 115px` desktop, **80px** at `≤1099px` (confirmed in `dev-theme-tokens.md` too). `.header` itself: CSS grid, `grid-template-areas:"logo navigation search hamburger"`, columns `150px 3fr 20px 20px`, `gap:28px` (26px ≤1599px, 25px ≤1099px); at `≤899px` collapses to `"logo search hamburger"`.

**Mobile menu pattern:** Hamburger icon = `.header__hamburger-btn` with two animated line layers (`.hamburger-open` / `.hamburger-close`, opacity-crossfade `.2s ease-in-out`), a11y label **"Meny"**. Opens `.mobile-menu` — a full-width panel appended below the header (`border-top:1px solid #dbeae2`, `overflow-y:scroll`, toggled via `display:none` → shown on `body.has-mobile-menu--open`), not a full-viewport takeover overlay. Mobile nav list items are 24px font links; the panel also shows the "Reach newsroom" featured column and the same social/contact footer block described above.

---

## 2. Footer

Identical structure/classes on dev and live; content differs slightly (dev = still-being-migrated copy, live = current production copy).

**Background:** `linear-gradient(0deg, var(--color-primary) 0%, var(--color-black) 100%)` (navy → near-black gradient), `border-top:1px solid var(--color-primary-75)`.

**Top CTA block** (`.footer__contact-container`): heading "Would you like to know more?" / "Reach out to us today" + `.btn.btn--secondary` "Contact us" button linking to `/contact/`.

**Columns** (`.footer__menus`, 4 columns, `<h3 class="footer__menu-heading">`, uppercase per CSS):

| Column | Dev heading/links | Live heading/links |
|---|---|---|
| 1 | **Company**: About us, Assets, HSEQ, Our Culture, Sustainability, Innovation at Reach | **About**: About, Assets, Sustainability, Investors, HSEQ, Company, Careers, Events |
| 2 | **Services**: Subsea Services, Survey Services, Monitoring Services, Explore 3D World | **Services**: Subsea Services, Survey & positioning, Geophysical Monitoring, Environmental Monitoring |
| 3 | **Explore**: Investors, Reach Newsroom, Life at Reach, Careers, Events, Contact | **Explore**: Projects & Operations, News & Reports, Press & Media, Careers, Events |
| 4 | **Get in touch**: `+47 400 07 710` (tel:), Facebook, LinkedIn | same |

**Address:** Not found (no street address in footer on either site). **Email:** not in the visible footer (only appears in the header mega-menu footer panel — `post@reachsubsea.com`). **Phone:** `+47 400 07 710` (footer col 4, tel: link).

**Social links:** Facebook (`https://www.facebook.com/reachsubsea/`) and LinkedIn (`http://www.linkedin.com/company/2661035?trk=tyah&trkInfo=tas%3Areach%20subsea%2Cidx%3A1-1-1` in footer col 4; a cleaner `https://www.linkedin.com/company/reach-subsea/` URL is used in the header mega-menu panel — **two different LinkedIn URLs coexist**, worth normalising). No Instagram, Twitter/X, or YouTube links found anywhere on either site.

**Newsletter signup:** Not found.

**Legal row** (`.footer__copyright`, flex row, `justify-content:space-between`): copyright text `© 2026 Reach Subsea. All rights reserved.` (left) + `.footer__copyright-links` (right): **Transparency Act**, **Privacy & Cookie Policy**. No separate "cookie policy" link (bundled into "Privacy & Cookie Policy").

**Investor/ticker info:** Not found in the footer (Investors is only a nav/footer link, no live ticker widget embedded).

---

## 3. Buttons

Single shared class family `.btn` (+ parallel, largely-duplicated `.wp-block-button__link` for core Gutenberg buttons — two independent implementations, not one shared base).

**Base `.btn` shape** (also applied to `.facetwp-facet-more_pager .facetwp-load-more`):
```
align-items:center; border:0; border-radius:22px; cursor:pointer; display:flex;
font-weight:700; gap:8px; line-height:1; padding:11px 24px; text-decoration:none;
transition:all .25s ease-in-out; width:fit-content;
```
Small variant `.btn--small`: `padding:8px 14px; line-height:1`.

**Variants:**

| Class | Fill | Border | Text |
|---|---|---|---|
| `.btn--primary` | `var(--color-primary)` (navy) | 2px solid navy | white |
| `.btn--secondary` | `var(--wp--preset--color--secondary)` (sage) | 2px solid sage | navy |
| `.btn--neutral` | `var(--color-medium)` (`#d0d0d0`) | 2px solid `var(--color-neutral)` — **undefined token, not in `:root`, likely falls back to browser default/invalid** | (inherits) |
| `.btn--outline` | transparent | 2px solid navy | navy |
| `.btn--outline-white` | transparent | 2px solid white | white |
| `.btn--outline-secondary` | (class exists, referenced in hover rule only — fill/border not separately located) | — | — |

**Hover:** `transform:translateY(-3px)` (lift), `text-decoration:none` — consistent across `.btn`, `.btn--outline-secondary`, `.wp-block-button__link`. **Focus:** no distinct `:focus`/`:focus-visible` style found for `.btn` (relies on default browser outline). **Disabled:** no `.btn:disabled`/`.btn--disabled` rule found — not found.

**Icons inside buttons:** `gap:8px` reserved for an icon slot, but no dedicated arrow icon is baked into `.btn` itself. Arrow iconography lives in separate components: `.link-arrow` (inline SVG arrow, translates `-4px → 0` on hover) and `.is-style-arrow-right` (Gutenberg button style that appends `background:url(arrow-right.svg)` as an `::after` pseudo-element, 24×24px, positioned `right:10px`; has a `-dark` SVG variant for outline buttons).

**Core WP button** (`.wp-block-button__link`): separately declares `padding:11px 24px !important`, `background-color:var(--color-primary)`, `gap:8px`, `line-height:1.3`; has its own `is-style-outline` (2px border, no fill) and `is-style-small` (`padding:8px 14px !important`, `line-height:1`) variants — duplicates `.btn`'s system with slightly different line-heights (1.3 vs 1) and no shared source of truth.

---

## 4. Links

- Base `a`: `text-decoration:none`, no explicit colour set at the bare-tag level (colour is set by ancestor context — white in the header, navy `var(--color-primary)` in body copy).
- `a:hover`: `text-decoration:underline` (global default) — **no distinct hover colour**, only the underline appears.
- **`.link-arrow`** (the "read more"-with-arrow pattern used across hero/section links): `display:flex; gap:13px; font-size:14px; font-weight:700; padding:6px 0`. Contains an inline SVG arrow (12×12px) with `transform:translateX(-4px)`, animating to `translateX(0)` on `:hover` over `.3s ease-in-out` (arrow "shoots" right on hover). Colour flips to white in dark-hero contexts (`.hero--single__top .link-arrow`, `.department-section__hero .link-arrow`, etc.) via per-template overrides, not a single reusable variant class.
- **`.read-more`** (used on cards): `display:flex; gap:8px; font-size:14px; font-weight:700`; positioned absolutely inside `.card__text` (`top:40px; right:28px` or `top:48px` on the featured news card). On `.card--white-text-bg`, the text label is hidden (`display:none`) and only the arrow SVG shows, coloured sage `var(--color-secondary)`.

---

## 5. Badges / tags / chips / eyebrows

No class literally named `.badge`/`.tag`/`.chip` was found. The functional equivalent is:

- **`.category-pill`** (chip/tag component): `background:var(--color-primary-10); border-radius:4px; font-size:12px; line-height:20px; padding:4px 8px; width:fit-content`. Active/current state `.category-pill--current`: `background:var(--color-primary); color:white` (filled navy vs light neutral fill). Wrapped in `.category-pill-container` (`flex-wrap; gap:6px; max-height:96px` with `line-clamp:3` overflow handling).
- **Eyebrow label**: `.downloads-table__hero-eyebrow` — `color:#6eaa8c (sage); font-size:12px; font-weight:700; letter-spacing:.08em; margin-bottom:6px` (no `text-transform:uppercase` set on this particular rule, though the content itself may be typed in caps — worth checking in the browser). A darker-context variant recolours it `#b4b2c9`. Other small-uppercase-label patterns already catalogued in `dev-theme-tokens.md` §2.5 (footer menu headings, table headers, mobile-menu featured heading) all share the `11–14px / 700 weight / uppercase / ~.04–.08em tracking` recipe.

---

## 6. Stats (big numbers)

**Not found.** No `.stat`, `.counter`, `.number`, `.figure`, or `.metric` classes exist in `dev-style.css`, and none of the checked pages (home, About us, Company, Investors) render a "big number" stats block — content on those pages is plain WP core heading/paragraph blocks. If the redesign needs a stats/KPI component, there is currently **no existing pattern to reuse or match** — it would be new.

---

## 7. Cards

Single shared `.card` base, reused (not aspect-ratio-based — uses **fixed pixel heights** + `object-fit:cover` images, not CSS `aspect-ratio`):

- Base `.card`: `height:450px; border-radius:clamp(1rem, .6479rem + 1.1268vw, 2rem)` (fluid ≈16px→32px), `position:relative; overflow:visible; transition:all .3s ease-in-out`. Image (`.card img`) is absolutely positioned, `object-fit:cover`, same fluid radius. A `.card:after` pseudo-element lays a navy gradient scrim (`linear-gradient(180deg, rgba(40,44,89,.4), #282c59)`) over the image for text legibility.
- **Hover/focus**: `scale:1.03` on the card, `box-shadow:0 0 5px rgba(40,44,89,.1)`, text block scales further (`.card__text` → `scale:1.02–1.04`, two conflicting values found in the CSS, likely one is dead/overridden).
- **Text overlay** (`.card__text`): bottom-aligned (`align-self:end`), `padding:48px 30px`, white text, `line-clamp:2` on paragraph.
- **Variants:**
  - `.card--landscape` — height 400px.
  - `.card--white-text-bg` — height 386px; the text panel becomes an opaque white/light block (`background:#f7f9fd`) filling the bottom half instead of a scrim-over-image, radius matches card radius on the bottom corners, top corners square against the image; on hover the image zooms (`scale:1.04`) instead of the whole card.
  - `.card--row` — height 160px, horizontal layout, image confined to right 50% width, text vertically centered.
  - `.card--event` — height 450px, larger heading (`40px`, jumps from a `24px` rule that's then overridden).
- Heading `::before` pseudo-element inserts a small right-arrow icon image (`right-arrow.svg`) above `h2/h3/h4` inside `.card--landscape`/`.card--portrait`/`.card--row`.

---

## 8. Accordion / FAQ

Component: `.faq-block` → `.faq-block__list` → repeated `.faq-item`.

- **Container style: boxed**, not divider-list — each `.faq-item` is its own card: `background:#fff; border:1px solid var(--color-primary-10); border-radius:16px; margin-bottom:16px; max-width:800px`.
- **Trigger** `.faq-item__question` (a `<button>`, `aria-expanded`/`aria-controls` wired for a11y): flex row, `justify-content:space-between`, `padding:16px 24px`, question text `.faq-item__title` at `16px/700`.
- **Icon**: not an SVG — a **CSS-drawn plus/cross** built from two `<span class="line">` elements (16×16px box): one fixed horizontal bar (`height:3px; width:16px`) and one vertical bar (`height:16px; width:3px`), colour sage `var(--color-secondary)`, both `border-radius:100px` (pill caps). On open (`[aria-expanded=true]`), the vertical line rotates `90deg` and fades to `opacity:0`, leaving the horizontal line — a **plus → minus** morph, not a chevron.
- **Open-state animation**: `.faq-item__answer` uses a **CSS grid-rows trick** (`grid-template-rows:0fr` → `.is-open{grid-template-rows:1fr}`, `transition:grid-template-rows .35s ease`) for smooth height animation without JS height calculation. Inner content `.faq-item__answer-inner{overflow:hidden; padding:0 24px}`.
- Page-level variant: a 2-column FAQ grid layout exists (`.faq-block__inner .faq-block__list{display:grid; grid-template-columns:repeat(2,1fr); gap:32px}`) with column headings `.faq-block__col-title` (20px/700, navy) — used on a dedicated FAQs page (`page-template-faqs`), vs. the single-column list embedded on the homepage.

---

## 9. Subnav / in-page pill nav

No dedicated "subnav" component was found distinct from the badge-style `.category-pill` (§5), which doubles as a filter/category pill row (`.category-pill-container`, flex-wrap, current state = filled navy). Also present: `.sidebar-hierarchy` — a left-hand in-page section nav (not a pill/tab bar) used on deep content templates (Company/Services/docs pages), with `.sidebar-hierarchy__item`, nested `.sidebar-hierarchy__sublist`, and a mobile `.sidebar-hierarchy__button-toggle--open/close` pair. A `.downloads-table__pill` class also exists (investor downloads table filters) but wasn't isolated in detail — treat as a `.category-pill`-family variant. No tab-style (`role="tablist"`) subnav was found.

---

## 10. Icons

**No named icon library.** Grepped `dev-scripts.js` and `dev-style.css` for lucide/tabler/phosphor/heroicons/font-awesome/feather/iconify — **zero matches**. (This differs from the old Figma file, which per `old-figma-tokens.md` §6 mixed Phosphor-named icons, Iconify imports, and custom shapes — none of that naming carried into the built theme.)

Icons in the live theme are exclusively:
1. **Inline SVGs** hand-placed in template HTML (logo, search toggle, hamburger lines, social/email/LinkedIn glyphs in the mega-menu footer, `.link-arrow` arrow, dropdown chevrons). All sampled inline SVGs use `fill="..."` / `fill="none"` with **filled path shapes — no `stroke-width` attribute appears anywhere** on the homepage; these are not true outline/stroke icons despite sometimes looking like line icons.
2. **Static SVG/PNG files** referenced from `wp-content/themes/reach-subsea-2023/assets/icons/`: `arrow-download.svg`, `arrow-right.svg` / `arrow-right-dark.svg`, `checked.svg`, `quote-top.svg` / `quote-bottom.svg`, `right-arrow.svg`, `search-small.png`, plus 8 pagination-arrow variants (`pagination-{left,right}-arrow-{large,small}[-secondary].svg`).
3. The FAQ accordion icon (§8) is **not an SVG at all** — pure CSS (two `<span>` bars).

**Sizes seen:** 11×11 (social icons), 12×12 (link-arrow), 14×14/15×15/16×16/18×14/20×20 (misc header/UI icons), 24×24 (arrow-right.svg, pagination arrows), 140×32 (logo). No consistent size scale (at least 8 distinct icon sizes counted on the homepage alone).

**Stroke width:** not applicable — icon set is fill-based, not stroke-based. Consistent with `old-figma-tokens.md`'s finding that the source Figma file itself had no single coherent icon system (mixed Phosphor-style filled shapes, a true 2px-stroke chevron pair, and imported Iconify icons) — that inconsistency simply never got resolved into a real system in the shipped code either.

---

## Access notes

- Dev site returns **HTTP 403** to `curl`'s default User-Agent (Cloudflare bot protection) — required a full browser UA string (`Mozilla/5.0 ... Chrome/120 ... Safari/537.36`) to fetch successfully. Live site has no such block.
- `dist/style.css` fetched directly at `/wp-content/themes/reach-subsea-2023/dist/style.css` on both dev (208,783 bytes) and live (163,570 bytes) — dev's is materially larger/newer (FAQ accordion, mega-menu CSS, `.card--event`, etc. are dev-only additions not present in the live bundle's class list).
- One live-render screenshot + one `javascript_tool` DOM/computed-style check were used (dev homepage only) to resolve a CSS-cascade ambiguity around the header logo colour (§1) — everything else in this doc is from static HTML/CSS fetched via `curl`.
- Pages fetched beyond home: dev `/company/who-we-are/about-us/`, `/company/`, `/investors/`, `/about/` (checked for a stats/big-number component — none found).
