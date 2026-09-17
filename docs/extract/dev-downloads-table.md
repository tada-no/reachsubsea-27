# Downloads-Table Component: Existing Implementation

## 1. Financial Reports Page

**URL:** `/investors/results-reporting/financial-reports/`

**Wrapper:** `<div class="downloads-table alignwide">`

**Tabs (4):** Use `<button role="tab">` with ARIA attributes (`aria-selected`, `aria-controls`, `aria-expanded`). Labels: "Quarterly Reports" (default active), "Annual Reports", "Sustainability Reports", "Miscellaneous". Data attributes: `data-tab`, `data-label`.

**"LATEST" Card:** `.downloads-table__hero` variant classes: `--quarterly`, `--annual`, `--sustainability`, `--misc`. Shows:
- Eyebrow (green text, 12px): `.downloads-table__hero-eyebrow` 
- Title (white, 32px): `.downloads-table__hero-title`
- Subtitle: `.downloads-table__hero-subtitle`
- Icon row: `.downloads-table__icon-row` with 3 icon links (Report, Presentation, Webcast)

**Table Structure:**
| Column | Class | Content |
|--------|-------|---------|
| Year | `.downloads-table__year` | 4-digit year |
| Q1–Q4 | `.downloads-table__cell` | Icon links (3–4 per quarter) or `.downloads-table__empty-cell` |

**Icon Links:** `.downloads-table__icon-link` with `aria-label="Report|Presentation|Webcast"`, `title="Report|Presentation|Webcast"`, external links to `.pdf` or Royalcast webcast URLs. Icon SVG: `.downloads-table__icon` (aria-hidden).

**"Show all archive years" Control:** `<button class="downloads-table__toggle" data-show-archive aria-expanded="false">`. Button text toggles: `.downloads-table__toggle-show` (visible) and `.downloads-table__toggle-hide` (hidden). Shows count: "(7)" archive years.

**Pills:** 6 empty `.downloads-table__pill` elements (purpose unclear; empty text).

**Coverage:** 14 years visible (2025–2012). 102 total document links: 68 Reports, 17 Presentations, 17 Webcasts. Files hosted in `/wp-content/uploads/` and Royalcast CDN.

---

## 2. General Meetings Page

**URL:** `/investors/results-reporting/general-meetings-2/`

**Uses downloads-table:** Yes, same component but single tab layout.

**Table Headers:** `YEAR | DOCUMENT | DOWNLOADS` (3-column, row-based).

**Document Name Cells:** `.downloads-table__document` with descriptive text (e.g., "General meeting 28.05.2025").

**Document Links:** `.downloads-table__doc-list` (unordered list) with `.downloads-table__doc-link` items. Each link includes:
- PDF icon (SVG, aria-hidden)
- Text label (e.g., "Notice", "Nomination Committee", "Protocol", "Appendix to protocol", "Executive Remuneration")
- All files in `/wp-content/uploads/`

**Document Types:** Notice, Nomination Committee, Executive Remuneration, Protocol, Appendix to protocol.

---

## 3. Financial Calendar Page

**URL:** `/investors/results-reporting/financial-calendar/`

**Uses downloads-table:** No. Simple WordPress block table (`wp-block-table`).

**Structure:**
| Column | Content |
|--------|---------|
| Event | Text (e.g., "Quarterly Report Q1 2025") |
| Date | YYYY-MM-DD, right-aligned (`has-text-align-right`) |

**Markup:** No table header; events grouped by financial year in separate `<figure>` blocks (e.g., "Financial year 2025"). 2–5 rows per year.

---

## 4. Data Source & Technical Details

**Data Attributes:** `data-tab`, `data-label`, `data-panel`, `data-archive`, `data-show-archive`.

**ACF / Custom Fields:** No ACF class names detected. Content appears inline in HTML.

**REST API:** Standard `/wp-json/wp/v2/pages` only; no custom post types for documents exposed.

**File Hosting:**
- PDFs: `wp-content/uploads/` (domain-hosted)
- Webcasts: `channel.royalcast.com` (external CDN)

---

## 5. CSS Breakpoints (`.downloads-table`)

Key responsive changes:

| Breakpoint | Changes |
|------------|---------|
| `@media (max-width: 639px)` | `.downloads-table__hero` and `.downloads-table__th--document` adjust layout |
| `@media (max-width: 559px)` | `.downloads-table__hero-title` font size reduction |

**Table Wrapper:** `.downloads-table__table-wrap` has `border: 1px solid #e8e8f0`, `border-radius: 12px`, white background.

**Hero Color Variants:**
- Quarterly/Misc: `--dt-hero-bg: var(--color-primary)` (#282c59)
- Annual: `--color-primary-shade` (#1b1d3b)
- Sustainability: `--color-secondary-shade-dark` (#416e58)
- General Meetings: `--color-primary-75` (#575a7c)

---

## 6. Accessibility Findings

**Strengths:**
- Icon links have both `title` and `aria-label` attributes
- Tabs use proper ARIA roles (`role="tab"`, `aria-selected`, `aria-controls`)
- Toggle button has `aria-expanded` state
- SVG icons marked `aria-hidden="true"`

**Concerns:**
- Icon-only links with small hit area (15px × 15px SVG; link padding 10px 8px)
- Tab navigation relies on horizontal scroll on mobile; no visible scroll indicator
- Document description text ("General meeting 28.05.2025") lacks unique identifiers
- Empty `.downloads-table__pill` elements; purpose not documented
- Financial calendar uses plain `<table>` with no `<caption>` or summary

---

## 7. Access Notes

- All pages fetch via browser UA; Cloudflare blocks default curl UA
- HTML saved to scratchpad at fetch time
- Theme CSS: `/wp-content/themes/reach-subsea-2023/dist/style.css`
- No authentication required; public investor pages
- Site uses WP Engine hosting with custom theme
