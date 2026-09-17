# 07 · Live operations map: scope and prototype

17 Sep 2026 · Status: **on the homepage** after the Stats band (Live state, dotted map, SAMPLE DATA badge). The review page shows the automatic Stale and Unavailable states.
Review page: `http://localhost:4321/live-operations-review/`

Files: [src/blocks/LiveOperations.astro](../src/blocks/LiveOperations.astro) · [src/data/live-operations.ts](../src/data/live-operations.ts) · [src/lib/world-dots.ts](../src/lib/world-dots.ts) · [src/pages/live-operations-review.astro](../src/pages/live-operations-review.astro). Build-only dev dependencies added: `world-atlas`, `topojson-client`, `d3-geo` (nothing ships to the browser). Backup: `backups/package.json.2026-09-17-pre-liveops`.

**Keep these two ideas apart.** The **3D World** (`/3d-world/`, `src/data/world.ts`) shows *illustrative zones*: Subsea Infrastructure, Oil Field Operations, and so on. The **live operations map** shows *where assets are actually working*. The block therefore says **"regions"** and never "zones".

---

## 1. What the client PDF shows

**Where it sits:** Home, p3 in the Design Reference and part 1 of 3 in the Full Resolution screens. It's a wide white card that overlaps the bottom of the navy gradient hero, between the hero CTAs and the stats strip. The Design Reference lists it as "a live-zones map graphic".

**Copy:**
- Status eyebrow with a sage dot: *LIVE ACROSS THE OCEAN*
- Heading: *Active in 4 zones today*
- Body: *Crewed and uncrewed vessels, both carrying ROV and survey capability, operating across offshore energy and infrastructure projects worldwide.*
- Outline button: *See our assets →*
- Right half: a pale sage panel with an abstract dot scatter (no coastlines), 4 larger sage dots among about 25 small ones, and a chip reading *4 active zones*.

**States:** only one is drawn, and it's static. There's no timestamp, no data source, no filter, no list, no hover or selected state, no mobile version and no fallback. The "map" is decorative: the dots aren't geographic. The "A global fleet, local expertise" bento tile on the same page reuses the dot motif.

**Numbers:** the rendered page says **4** twice (heading and chip). I couldn't find the "6 active zones" that docs/03 §4F records in the rendered pages or the PDF text layer. It may be in an earlier export. Either way, the count isn't backed by any data.

## 2. Data approach

### Options

| | A. Manual list in WordPress (ACF) | B. AIS API | C. Hybrid (chosen, Q54) |
|---|---|---|---|
| How | An options page, **Current operations**: a repeater of region, asset type, asset label, scope, sector and "since". `updatedAt` is set on save | Scheduled server job that pulls positions by MMSI/IMO from Datalastic, VesselFinder, MarineTraffic (Kpler) or Spire, then maps each position to a region polygon | A: the editor owns what is shown. A daily AIS check only *confirms* that each row's vessel (internal MMSI field, never rendered) is inside its stated region, and flags drift to the editor |
| Covers ROV spreads | ✅ | ❌ An ROV spread has no AIS. It sits on a Reach or client vessel | ✅ |
| Covers Reach Remote USVs | ✅ | Only if the USV transmits AIS, and some operations turn it off | ✅ |
| Accuracy | As good as the editor's discipline | Position-accurate, but "in a region" isn't the same as "working on a project" (transits, port calls, standby) | Editor intent plus machine sanity check |
| Commercial sensitivity | Full control: the region level, generic labels and what to omit are all chosen per row | Risky by default: exact positions and vessel names | Positions never leave the server. Only region names are published |
| Update frequency | When operations change (weekly at most) | Every 1–24 h | Content on change; AIS check daily |
| Cost | Build only | Recurring subscription, credit-based or enterprise quote. Satellite coverage (Brazil, SE Asia) costs more than terrestrial | Smallest AIS tier: about 10 vessels, one position lookup a day each |
| Failure mode | Goes stale silently (handled by the Stale state) | API outage, key expiry, rate limits, provider pricing changes | Degrades to A |

Pricing isn't quoted here on purpose. All four providers change plans often, and MarineTraffic and Spire are quote-based. **I haven't signed up for or committed to any provider.** Quotes are the next step now that C is chosen (Q54).

### Decision (Q54, 17 Sep 2026): **C, hybrid from launch**
The user chose to launch with the hybrid. Claude had recommended starting with A and adding C later. The steps below apply from launch. **Still open:** which provider (quotes needed), and the client's MMSI/IMO list. Nothing is signed up to.

### Original recommendation: A now, C later

1. **Launch with A.** It's the only option that covers all three asset types, and it puts the client in control of what's public. It's also a normal ACF build for the same developer as `reach-subsea-2023`.
2. **Add the AIS check (C) as phase 2**, only if the client asks for freshness guarantees. It works like this:
   - A WP-Cron or server cron job calls the provider once a day, server-side, with the key in `wp-config.php` and never in the browser.
   - It stores `aisConfirmed` / `lastSeenRegion` per row in a transient or option.
   - It emails the editor when a vessel is outside its stated region for more than 48 h.
   - It never writes coordinates to the page, the REST API or the HTML.
3. **Don't show raw AIS positions publicly.** They're already on MarineTraffic, but a Reach page that ties a named vessel to a scope of work and a sector effectively publishes client project information. Also, some regions have security reasons to hide vessel movement.

### Sensitivity rules built into the block
- **Region, not position.** Label points are rounded to whole degrees, and nearby pins are pushed apart for legibility, so the map can't be read as a position.
- **No client names** in the field set. "Scope" describes the work, not the customer.
- **Generic asset labels by default** ("Crewed IMR vessel"). Named vessels link to their Asset single only when the client clears it (`assetUrl` field).
- **Omit rows freely.** A region with no public rows disappears, and the count drops with it.
- ~~A visible note under the list~~ Removed 17 Sep 2026: the status line already shows when the data was updated, and the region level comes from the data and the zoom cap, not a sentence. If the client wants the reassurance on the page, it can go back as a caption.

### Caching and freshness
- The page can be fully cached (static HTML plus CDN). The block carries `data-updated`, and its script re-checks the age in the browser, so a cached page moves itself to **Stale** when the data gets old.
- Saving the options page purges the page cache for the pages that use the block.
- With the AIS check (C): cache the provider response for 24 h server-side. On error, keep the last good result and never block page rendering on the API.

### States (all on the review page)
| State | When | What changes |
|---|---|---|
| **Live** | `updatedAt` less than 72 h old | Pulsing pins and beacon; "Active in N regions today"; "Updated N hours ago" |
| **Stale** | older than 72 h (`STALE_AFTER_HOURS`) | No pulse, grey beacon; "Recently active in N regions"; "Last confirmed 13 Sep 2026" |
| **Unavailable** | no rows, or the feed failed | Map without pins; "Working across 9 countries" (Key figures `countries`); short note plus *See our assets* |

## 3. Map approach

### Options
| | Stylised SVG, region pins (prototype) | MapLibre GL, custom navy style |
|---|---|---|
| Weight | About 35 KB of inline path, 0 KB of JS for the map, one DOM node for the land | About 230 KB gzipped of JS, plus a style, tiles and glyphs. WebGL |
| Hosting | None. For WordPress, export the SVG once into the theme | A tile host (MapTiler, Stadia or self-hosted PMTiles) and a key or bucket |
| Fits the data | Yes: regions are a world-scale idea | Designed for zoom, pan and exact points we shouldn't show |
| Brand | Dot-matrix land in navy tokens echoes the client's own dot motif | Needs a full custom style to stop looking like a generic web map |
| Accessibility | `role="img"` with a text summary; the list is the control | Canvas: needs the same list, plus keyboard traps to manage (scroll zoom, pan) |
| Mobile | Crops to the Brazil–Asia band; no gestures to fight | Pan and zoom compete with page scroll |
| Privacy | No third-party requests | Tile requests to a third party (consent, as for the Map embed) |

**Recommendation: the stylised SVG.** MapLibre only makes sense if the client later wants a zoomable fleet tracker, which would be a separate product decision.

How the prototype works:
- **Geometry:** Natural Earth 1:110m land (`world-atlas`) with an Equal Earth projection, centred on 10°E so the seam falls in the Bering Strait and no continent is split across the edges. Grid points outside the map's rounded outline are dropped (they used to print phantom land in the corners). Artistic licence: Alaska and the North Pacific islands (west of 140°W) and Russia's far east (east of 145°E, north of 45°N) are hidden, and the world view is cropped to the remaining land. The land is a hex dot grid drawn as a single path (zero-length segments with round caps). Everything is computed at build time. In WordPress, ship the SVG as a theme file and place pins using precomputed x/y per region, or the same projection maths in PHP.
- **Layout:**
  - Headline, status and filters sit above a full-width map.
  - On desktop the region list has its own column beside the map.
  - Below 900px, everything stacks: map, then list.
- **Interaction:**
  - The region list is an `<ol>` of disclosure buttons (`aria-expanded`), one open at a time.
  - Hovering or focusing a row highlights its pin; clicking a pin opens and focuses its row.
  - The asset-type filters (`aria-pressed`) update the count, the rows and the pins, and announce the result through a polite live region.
- **Accessibility:**
  - Everything readable is in the list, which works with no JS (all panels open), no CSS and no map.
  - Pins are pointer shortcuts only.
  - There's one `h2`, and the rows are `h3`.
- **Reduced motion:** no pulse, beacon or row entry animation; pins get a static halo instead.
- **Mobile:** the map crops to where the regions are and drops pin labels (the pins are too small to tap). The list is the control, and the filters scroll sideways. There's no page-level horizontal scroll (checked at 375px).

### Clusters and zoom (17 Sep 2026, user request)
- **Clusters:** regions that share a `group` (in WordPress, the parent term in the Regions taxonomy, e.g. *Northern Europe*) show on the world map as one hotspot. It shows the total asset count and has a slowly turning dashed ring. Hovering it highlights its rows in the list.
- **Zoom in:** clicking the hotspot, or opening one of its regions in the list, animates the map in (700 ms). The regions then show one by one, always labelled, on a finer dot grid drawn from 1:50m land. A **World map** button over the map, or Escape, zooms back out. Opening a region outside the cluster also zooms back out.
- **Pin size:** pins and labels are sized in screen pixels at every zoom level and map width: 26 px pins, 34 px cluster hotspots, 15 px labels (13 px on phones). Each label points away from the centre of its cluster.
- **Phones:** the zoom is wider so labels on both sides fit. The world view is cropped to the band where the hotspots are.
- **Reduced motion:** the zoom jumps with no animation. The ring and pulse don't move.
- **Weight:** the detail grid for one cluster is about 65 KB of inline path. If there are many clusters in production, load each one when it's first zoomed.

### Layout (17 Sep 2026)
- **Map and list:** the map is smaller (about 864 px at 1440) and sits beside the region list instead of under it.
- **Filters:** the chips moved out of the header and sit directly above the map they control, 48 px below the intro.
- **Filter labels:** *All · Crewed · Uncrewed · ROVs*. Not "Reach Remote", which is also the name of individual vessels (Reach Remote 1, 2…). The asset label is now "Uncrewed surface vessel".
- **Region rows:** two lines. The name, then the area with the asset-type icons. Below 1200 px the area can wrap to a third line rather than being cut off.

### Decision (17 Sep 2026): interactive GL map, like the dev site's Contact map
This replaces the SVG recommendation above. Contact on dev runs **Mapbox GL JS v3.3.0** with a custom navy style (`danieltada` account), Mapbox's zoom/compass buttons (currently hidden under the fixed header on dev) and a numbered Europe cluster. The user chose the same approach.

**Prototype setup:**
- **Engine:** **MapLibre GL 6**, the open-source fork of Mapbox GL with the same API. It needs no access token, and I didn't copy the dev site's token.
- **Map data:** local Natural Earth 1:110m countries, served as `/data/world-countries.json` (about 45 KB gzipped).
- **Two land styles**, switchable on the review page:
  - *Dots*: the brand dot matrix as a screen-pixel pattern, so the dots stay crisp at every zoom.
  - *Solid*: filled countries with thin borders, like Contact.
- **Markers:** HTML elements, so the pulse and the turning dashed cluster ring are plain CSS.
- **Clusters:** built into MapLibre, by distance, and split from zoom 3. Clicking a cluster zooms to where it splits. Opening a row in the list flies to that region.
- **Controls:** + / − / "show all regions", as design-system buttons inside the top-right corner of the map.
- **Gestures:** drag to pan. Scroll-zoom needs Ctrl or ⌘ (two fingers on touch), so the page still scrolls normally.
- **Limits:** zoom is capped at level 5, which is region level. Rotation and pitch are off.
- **Loading:** the static dot map shows first. MapLibre (about 230 KB gzipped of JS, loaded with its CSS) only loads when the block comes within 400 px of the viewport, then fades in over it.
- **Data fixes:** Natural Earth rings are re-wound to the GeoJSON standard, and the rings for Russia and Fiji are unwrapped across 180°. Without both fixes, blocks of false land fill whole map tiles.
- **Prototype-only settings:** the MapLibre worker is bundled with `?worker&url`, because Vite's dependency pre-bundling breaks MapLibre's own worker path.

**Swapping to Mapbox in production** (for the same style as Contact):
- `import mapboxgl from 'mapbox-gl'`
- set `accessToken` from theme settings, never hard-coded
- set `style: 'mapbox://styles/danieltada/…'`
- `getClusterLeaves` and `getClusterExpansionZoom` take callbacks in mapbox-gl v3 instead of promises
- markers, controls, clustering and the token-coloured CSS carry over unchanged

Billing is per map load (there's a free monthly tier), and loading only near the viewport keeps loads down. **Needs from the developer:** the token (URL-restricted) and the style ID.

**Accessibility:** the list is still the content. The map region has a text summary, the controls are real buttons with labels, and the markers are pointer shortcuts (`aria-hidden`). Reduced motion turns off the pulse and the ring, and zooms jump instead of animating.

**Trimmed (17 Sep 2026):** the solid "like Contact" land style and the White-background variant were review options only, and both have been removed. Stale and Unavailable stay: the block switches to them automatically. The sample `updatedAt` is 17 Sep 2026 06:00 UTC, so the homepage block will show itself as Stale ("Recently active in…") from 20 Sep unless the sample date is moved on.

## 4. Placement

**Decided with the user (17 Sep 2026): a standalone block, not a hero overlay.** Why:
- The video hero already carries the headline and two CTAs.
- A "live" claim at the very top is the first thing that looks wrong when the data goes stale.
- The list, filters and privacy note, which make the feature useful, can't fit in a chip.

**Decided (Q56):** Home straight after the Stats band, plus the Assets overview, once the prototype is approved. Exposure (Q55): regions with generic labels. Both need the client's sign-off. Why these spots:
- **Home, straight after the Stats band.** "9 countries" leads into where the fleet is today. This keeps it well away from the 3D World stage, which is also a navy world-ish feature, so the two aren't read as the same thing.
- **Assets overview.** This is the natural home, next to the fleet listing.
- Contact, as a smaller "where we are working" band. This one is optional.

## 5. WordPress handoff (when approved)

- Block `reach/live-operations`: fields `intro`, `showFilters`, `action`, plus `background`, `spacing`, `anchor`. The data comes from the options page, not per block, so every instance agrees.
- Options page **Current operations**:
  - `updated_at` (auto on save)
  - repeater `operations[]`: `region` (select from a fixed Regions taxonomy with a label point), `asset_type` (crewed / remote / rov), `asset_label`, `asset` (optional post object → Asset single), `scope`, `sector`, `since`, `mmsi` (internal only: used by the AIS check, never output, so generic public labels still work)
- Regions taxonomy: name, area, lon and lat (whole degrees), and a precomputed map x/y.
- From launch (Q54): a daily cron job for the AIS check, `ais_confirmed` / `last_seen_region` per row, editor email alerts, and an admin column showing the check status.

## 6. Open questions
Answered: Q54–Q56 in [00-questions.md](00-questions.md). Still open: AIS provider and quote, the client's MMSI/IMO list, client sign-off on exposure, and which vessels (if any) may be named later.
