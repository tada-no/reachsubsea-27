# 07 · Live operations map: scope and prototype

17 Sep 2026 · Status: **on the homepage** after the Stats band (Live state, dotted map, SAMPLE DATA badge). The review page shows the automatic Stale and Unavailable states.
Review page: `http://localhost:4321/live-operations-review/`

Files: [src/blocks/LiveOperations.astro](../src/blocks/LiveOperations.astro) · [src/data/live-operations.ts](../src/data/live-operations.ts) · [src/lib/world-dots.ts](../src/lib/world-dots.ts) · [src/pages/live-operations-review.astro](../src/pages/live-operations-review.astro). Build-only dev dependencies: `world-atlas`, `topojson-client`, `d3-geo` and `sharp` (nothing ships to the browser). Shared maths in [src/lib/dot-map.ts](../src/lib/dot-map.ts). Backup: `backups/package.json.2026-09-17-pre-liveops`.

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
- **Geometry (superseded 22 Sep 2026, see "Dots and poster" below):** was Natural Earth 1:110m land with an Equal Earth projection. Now Web Mercator, so the poster and the GL map are the same picture. Artistic licence stays: Alaska and the North Pacific islands (west of 140°W) and Russia's far east (east of 145°E, north of 45°N) are hidden. The land is a hex dot grid drawn as a single path (zero-length segments with round caps), computed at build time. In WordPress, ship the SVG as a theme file and place pins using precomputed x/y per region, or the same projection maths in PHP.
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
- **Map data:** none. MapLibre runs with no tiles and no land layer: it provides the camera, gestures and clustering only. The land is drawn by the block (below). The 1:110m countries GeoJSON and the *Solid* land style are gone (22 Sep 2026).
- **Markers:** HTML elements, so the pulse and the turning dashed cluster ring are plain CSS.
- **Clusters:** built into MapLibre, by distance, and split from zoom 3. Clicking a cluster zooms to where it splits. Opening a row in the list flies to that region.
- **Controls:** + / − / "show all regions", as design-system buttons inside the top-right corner of the map.
- **Gestures:** drag to pan. Scroll-zoom needs Ctrl or ⌘ (two fingers on touch), so the page still scrolls normally.
- **Limits:** zoom is capped at level 5, which is region level. Rotation and pitch are off.
- **Loading:** the static dot map shows first. MapLibre (about 230 KB gzipped of JS, loaded with its CSS) and the 23 KB land mask only load when the block comes within 400 px of the viewport, then the live map fades in over the poster. Because both are the same picture, the fade is invisible.

### Dots and poster (22 Sep 2026)
Two problems in review: the map appeared to zoom when it loaded (the poster was an Equal Earth world, the GL map a cropped Mercator one), and dots were cut into segments at every coastline (the land was a tiled dot image clipped to the country polygons). Fix: one picture, drawn the same way twice.
- **Land mask:** Natural Earth 1:50m land → Web Mercator, latitude −56° to 78°, rasterised once at build time with sharp to a 2048 px-wide two-colour PNG with the hidden far ends painted out (`src/lib/world-dots.ts`, served as `/data/land-mask.png`, 23 KB). One mask pixel is about 8 screen px at the zoom cap of 5.
- **Grid:** an equilateral hex lattice **fixed to the screen** (user decision): the land moves under the grid as you pan and zoom. Each grid point is unprojected to Mercator and looked up in the mask; a dot is drawn whole or not at all, so nothing is ever clipped.
- **Live map:** a `<canvas>` overlay inside MapLibre's canvas container (under the markers), redrawn on every `render` and `resize` event. Screen → Mercator is linear because rotation and pitch are off, so two `unproject` calls per frame are enough; a world view is about 1,500 dots.
- **Poster:** the same grid, tested against the same mask at build time, emitted as one `<path>`. Its `viewBox` is the framing box, and the MapLibre camera is computed from the same box (`cameraFor`), replacing `fitBounds`, so the poster and the live view are pixel-aligned (99% or more of poster dots sit under a live dot at 1440, 1100, 800 and 375).
- **Framing:** `FRAMES` in `src/lib/dot-map.ts`: `wide` (2:1, lon −125°..165°, lat −50°..70°) for desktop and tablet, `tall` (5:4, the Brazil–Asia band) for phones. Each is grown to the figure's CSS aspect ratio with a 4% margin, so keep the CSS `aspect-ratio` and the frame aspects in step. Home view = minimum zoom, recomputed on resize.
- **Density:** columns are fixed per width band (`DOT_PRESETS`: `regular`, `fine`, `finer`, with `wide` bands switching at 680 and 960 px of map width (`WIDE_BREAK`, `WIDE_BREAK_XL`) and one `tall` count), so the pitch scales with the map and the poster (an SVG that scales) and the overlay (drawn in px) always agree. The third band (22 Sep 2026, Q75) keeps the pitch near 11–15 px on a full-width map (Contact's Offices map is 1312 wide against Home's 828), so both maps have the same dot feel. The block has one poster per band, shown by container and media queries. The `dots` prop picks the preset: **Regular** (Q72, chosen over Fine and Finer with a live compare on the review page, toggle since removed).
- **WordPress:** the theme ships `land-mask.png` and the poster SVGs (one per band and density) as static files, and the overlay script as is. The mask can be regenerated with the same Node script if the crop or hidden areas change.
- **Prototype-only settings:** the MapLibre worker is bundled with `?worker&url`, because Vite's dependency pre-bundling breaks MapLibre's own worker path.

### Shared map (22 Sep 2026, Contact)
The map was extracted from the block so the Contact page's Offices map (docs/05 §2.16) reuses it rather than forking 1,200 lines. Three files, one owner:
- `src/components/DotMap.astro`: the `<figure>`: posters (one per band and the tall frame), the live canvas container, the marker CSS (dot, pulse, ring, label, quiet, active, hover states) and the points as JSON. Props: `points`, `summary`, `dots`, `pulse`, `labels` (always show labels, Offices map), `class`. Without points it is poster-only.
- `src/components/DotMapZoom.astro`: the − / + pill (Live operations only; the Offices map has no zoom buttons).
- `src/lib/dot-map-client.ts`: `createDotMap(figure, options)` returns a handle: `load`, `refresh` (after a filter), `fitHome`, `fitTo(ids)`, `flyTo(id)`, `setActive`, `setHover`, `showOverlay(id, el)` / `hideOverlay` (pins a block-rendered card above a marker and pans it into view), `map`. Options: `controls`, `maxZoom`, `focusZoom`, `fitMaxZoom`, `clusterMaxZoom`, `clusterRadius`, `clusterClick` (`expand`: one step, Live operations; `fit`: every member in view, Offices map), `showCount` (always · clusters · never), `clusterLabel`, `countOf`, `onSelect`, `onHover` (clusters report all members; a hover is released when its marker leaves the map, so a split cluster never leaves cards lit), `announce`, `onView(home)`, `autoload`. Quiet points (`quiet: true`) draw hollow and count 0 in clusters.
- The block owns the content and the meaning of a point (a region's asset count, an office) and drives the map through the handle; the module only knows points with an id, a name and a count.

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
