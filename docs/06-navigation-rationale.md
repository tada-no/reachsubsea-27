# Why the header and hero differ from the client PDF

_16 Sep 2026. Compares the client's Design Reference PDF (`ref/Reach Subsea Website - Design Reference_1.pdf`) with the proposed header (docs/04 §16) and Page hero (docs/05 §2.1). Coded prototypes: `/header` and `/blocks/page-hero`._

# 1. Dropdown panels instead of a second nav bar

## The two approaches

**Client PDF:** the header lists the sections. Once you're on a section page, a dark bar of pills under the header lists that section's pages. For Services it reads: Overview · Subsea Services · Survey Services · Monitoring Services · Technology & Innovation · Assets & Fleet · Reach Remote & Horizon · Explore.

**Proposed:** clicking a section in the header opens a panel with that section's pages, a one-line intro and one featured item. Sections with many pages can still add a page-level subnav under the hero.

## Why panels

**1. Every page is one click away, from anywhere.**
With the bar, a section's pages only appear after you've landed on that section. An investor who wants the financial calendar has to click Investors, wait for the page, find the pill, and click again. With a panel it's Investors → Financial calendar, from any page on the site. Visitors can also see what a section contains before they commit to it.

**2. It doesn't take space from the content.**
The bar adds about 72px under the header on every section page. Together with the header, that's roughly a fifth of a 768px-high laptop screen before the page starts. Panels only take space while they're open.

**3. It scales.**
The Services bar already fills the full width with 8 pills. Investors has 6 pages with long names ("Reports, Presentations & Shareholder Information"). Adding a page, lengthening a label or adding a Norwegian version would overflow the bar. On tablets and phones the pills have to scroll sideways, which hides some of them. A panel's columns simply get longer.

**4. Panels can explain, not just list.**
A pill carries only a name. A panel adds one line of context and a feature chosen by editors, such as the 3D World, Reach Remote 3 & 4, the next investor event or the latest report.

**5. One menu for every screen size.**
The same section lists drive the desktop panels and the mobile accordion menu, so editors maintain a single WordPress menu. The bar would still need a separate mobile menu.

Panels open on click, not hover. That makes them work on touch screens and with a keyboard, and stops them flickering open as the cursor passes over them.

## Where a subnav still helps

A row of sibling pages is useful once someone is deep inside a section and wants to move sideways, for example between the Investors pages, or between topics on a long FAQ page. So the pattern stays as an optional **Section subnav** block placed under the page hero, used only where it earns its space, rather than a fixed second bar on every section page.

## Other differences, briefly

- **Assets and Projects are top-level items.** The fleet and the track record are what buyers look for first, and the PDF buries the fleet inside Services.
- **Contact is a plain link** at the end of the nav, not a filled button. It's still one click away on every page.
- **Trade-off:** 8 items instead of 5, so the full bar needs more width and collapses to Search + Menu below 1200px.

# 2. No stats or cards overlapping the hero

**Client PDF:** on Home, Investors and Careers, a white panel of key figures or a row of "latest" cards overlaps the bottom edge of the hero.

**Proposed:** the hero only holds the page title, a short intro and up to two actions. Key figures go in a Stats band and latest items in a card row, placed directly below the hero.

**1. The hero has one job.**
It tells visitors where they are and offers the next step. On Home, the overlap adds four figures on top of a headline, an intro, two actions and eight nav items. That's too many things asking for attention in the first view, and none of them stands out.

**2. The overlap lands on the fold.**
On a typical 1366 × 768 laptop the header and photo hero fill about 736px, so the panel starts right at the bottom of the screen and is cut in half. A half-visible row of numbers looks like a layout glitch rather than an invitation to scroll.

**3. On phones it pushes the page down.**
The four figures become a 2 × 2 grid and the cards stack, which adds 300–700px of detail before the page's first real section.

**4. Figures read better with context.**
In their own band, the figures can have a heading ("Reach in numbers") and sit next to related content. Floating under a headline, "9" and "2" don't say much.

**5. A simpler system.**
The Page hero goes from 12 variants to 4. It no longer needs negative margins, special spacing rules or Figma layer workarounds.

The overlap does have one real advantage: it signals that the page continues. For Investors, the latest report and the next event are among the most common tasks. So that content stays high, as the first block below the hero, not further down the page.

# 3. To confirm with Reach: Projects

The client site map has no Projects section. Projects appear only as reference cards on service pages. They may have intended projects to be reached only from those pages, with no Projects landing page.

Our recommendation:

- **Keep project pages and an all-projects page in any case.** Reference cards need somewhere to link, procurement teams share individual project URLs, and the live site already has 24 projects. The all-projects page is the standard Feed grid, so it adds almost no build cost.
- **Whether Projects sits in the top nav is Reach's call.** If they'd rather keep the nav tighter, Projects can drop out of the header. It would then be reached from the Services panels, service and asset pages, and the footer, which leaves 7 items.
