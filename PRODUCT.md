# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Clients and prospects** in offshore energy, offshore wind, subsea cables and ocean industries, evaluating Reach Subsea for survey, inspection, monitoring and intervention work.
- **Investors and analysts** following an Oslo Stock Exchange (Euronext) listed company: latest results, the investment case, reports, the financial calendar and share information.
- **Candidates** for offshore and onshore roles (applications go to HR-Manager).
- **Press and partners** looking for news, events and media material.

## Product Purpose
The corporate website of Reach Subsea ASA (reachsubsea.no), redesigned for 2027. It explains what Reach does and proves it with real operations, assets, projects and results. Success means clients understand the services and fleet, investors find the case and the numbers quickly, and editors can keep it current in WordPress without a developer.

## Positioning
A technology-driven subsea partner: a crewed fleet with work-class ROVs, plus Reach Remote, a pioneering uncrewed surface vessel operated from shore through Reach Horizon (750+ uncrewed operational days per quarter, DNV's world-first AROS class notation). The company serves both oil & gas and renewables.

## Operating Context
- The deliverable is a Figma design system (file `HAvCQCXzWNFOKQ1AZxqNTX`) plus this coded Astro prototype. Its blocks map 1:1 to future WordPress blocks, and the build is handed to the developer of the `reach-subsea-2023` theme.
- Investor data comes from Euronext OMS (`ir.oms.no`) iframes and the quarterly reports.
- Content types: Services, Assets, Projects, News, Events, FAQs, Documents (see docs/01-discovery-brief.md).

## Capabilities and Constraints
- Everything is CSS plus small vanilla JS, so it ports to the WP theme as is.
- 8px grid, container 1440, 12-column grid, no sidebar.
- Block budget of around 15 editor blocks (docs/05-blocks-spec.md) with one Card component (docs/04-components-spec.md).
- One `h1` per page, in the Page hero.

## Brand Commitments
- The existing brand stays: navy `#282c59`, sage `#6eaa8c`, the Reach logo, and the Tabler outline icons plus the custom "Icons Flat" pictograms.
- A new layout, not a new identity.

## Evidence on Hand
- Client PDFs in `ref/` (the copy is mostly real, but they leak editorial notes, so strip them).
- Photography in `public/images` and the promo video.
- Q2 2026 reported results, published 18 Aug 2026 (from the client PDF).
- The live and dev sites.
- **Absences:** no testimonials, no client names on live operations, and no share price data except the live OMS feed. Never fabricate these.

## Product Principles
1. Real proof over claims: every assertion carries a figure, a date or a real asset.
2. Data-driven where the dev site already is (downloads table, OMS feeds, CPTs). Take the PDF's intent, keep the dev data model.
3. One component, few options. Editors must not be able to break the system.
4. Calm, editorial chrome. No CTA pills in the nav, no generic AI-site patterns.

## Accessibility & Inclusion
WCAG 2.2 AA:
- Pause controls on any moving media.
- `prefers-reduced-motion` respected.
- 44px targets.
- White text over photos needs at least 4.5:1 (navy scrim).
