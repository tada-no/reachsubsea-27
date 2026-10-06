# 3D World: what the website now needs from the world

Written 6 Oct 2026 in the website chat (reach-web-2027), after decisions Q94–Q96. **Paste this into a chat started in `~/Desktop/reach-world`.** The website side is built; everything below is work inside the world. Checked against the world's source at v59 (local `main`, not yet published; the public demo is v58).

## What the website decided

- **Q94 · Hosting and content.** The world stays a separate static app on its own host. Its words, images and links move to WordPress and reach the world through a read-only API. Positions, cameras and animation stay in the world's code.
- **Q95 · Landing page.** `/services/3d-world/` explains the world, shows the four zones (the world's names, order and assets) and launches it.
- **Q96 · Framed under the site header.** The world opens inside the website at `/3d-world/`, in an iframe that fills the screen below the site header, like the dev site's Unity world today. Every website link into the world goes there. The in-place poster embeds on Services and Careers (a 16:9 stage that loads the scene on click) stay too.

So the world will run framed in two sizes:

| Where | Frame size (approx.) | URL the frame loads |
|---|---|---|
| `/3d-world/` page | full width × (viewport − header): 1440 × 803, 1100 × 704, 375 × 627 | `…/reach-world/?embed=1` (+ `&zone=N` or `&careers=1`) |
| In-place embeds (Services, Careers) | container width × 16:9, about 1312 × 738 at 1440 | `…/reach-world/?embed=1` (Careers adds `&careers=1`) |

## To do, in priority order

### 1. Read `?zone=1–4`

Open straight on that zone. The website's zone cards and the Services zone links already send it, but today the world ignores it, so every zone link opens the ordinary world.

- Mapping, in the world's arrow order: `1` = `pipelines` (Subsea Infrastructure), `2` = `oilfield` (Oil Field Operations), `3` = `wind` (Offshore Wind & Renewables), `4` = `reservoir` (Subsea Production & Monitoring).
- Skip the welcome panel and go to the zone's overview after the intro (or shorten the intro for a deep link: your call).
- Ignore an invalid value. If both `careers` and `zone` arrive, `careers` wins.

### 2. Escape hands the keyboard back to the website

Inside the frame the world keeps every key, so a keyboard user can't Tab back to the site header. Escape already closes the drawer, then the pilot card, then leaves Pilot mode, then closes the welcome panel (`src/ui.js`, the `keydown` handler). Add one last step:

- When the world is framed (`window.parent !== window`) and Escape has nothing left to close, post this to the parent:
  ```js
  window.parent.postMessage({ type: 'reach-world:release-focus' }, origin)
  ```
  Send it once for each allowed origin (`postMessage` takes a single target origin). Never use `'*'`.
- Allowed origins: `https://www.reachsubsea.com`, `https://reachsubsea.com`, `https://reachsubseadev.wpenginepowered.com`, `http://localhost:4321`, `http://localhost:4322`. Keep the list in one constant, so the WordPress developer can add staging.
- The website already listens: it checks the origin and the frame, then moves focus to its header (`reach-web-2027/src/pages/3d-world.astro`).
- Add it to the keyboard help line ("Escape closes panels or leaves Pilot mode…") as "…then returns to the website menu".

### 3. Links leave the frame properly

- Any link to a reachsubsea.com page (WordPress marker links from step 5, contact, services) opens with `target="_top"` when framed, so the Reach page replaces the whole tab instead of loading inside the frame.
- Links to other sites keep `target="_blank" rel="noopener"`, for example HR-Manager in `src/careers.js`.

### 4. `?embed=1`

The website now always sends it when the world is framed. Use it only where framing should change something:
- the Escape handoff above;
- the `_top` links above;
- anything else that duplicates the site (there's no "back to site" control today, so probably nothing).

**Keep the Full screen button.** The frame allows fullscreen, and it's the way to lose the site header for a while. Check the layout at the frame sizes in the table above, especially the 16:9 embed and 375 × 627.

### 5. Content from WordPress (Q94)

The full contract is in `reach-web-2027/docs/09-wordpress-handoff.md` §7.1. In short:

- On load, `GET https://www.reachsubsea.com/wp-json/reach/v1/world` with about a 3 s timeout. Make the URL one constant, plus `?content=<url>` to point it elsewhere for testing.
- The response has `zones[]` (`slug`, `number`, `name`, `blurb`), `markers[]` (`slug`, `zone`, `name`, `sub`, `text`, `image {url, alt}`, `link {label, url}`), `careers` (`stops[]`, `vacanciesUrl`) and `links` (`contact`, `home`).
- **Merge by slug over the built-in copy.** A missing field, a failed request or a timeout keeps the built-in text, so the world always opens. A WordPress slug with no match in code is ignored.
- Slugs are the contract, so keep them stable:
  - Zones: `pipelines`, `oilfield`, `wind`, `reservoir`.
  - Markers: `vessel`, `surveyor`, `rov`, `rr1`, `zeerov1`, `drix`, `rr2`, `zeerov2`, `vessel2`, `rr3`, `gwatch`, `dragonet`.
  - Careers stops: the keys of `COPY` in `src/careers.js`.
- Text arrives as plain text: escape it, never `innerHTML` it. Images are WordPress media URLs shown as `<img>` in the drawer, not WebGL textures, so they need no CORS.
- Show a marker's `link` in its drawer, with `target="_top"` (step 3).
- Until the endpoint exists, test with a local fixture JSON in that shape.

### 6. Real names for the draft assets

The website's zone cards list each zone's clickable assets. Two pins still have placeholder names: **"Vessel 1"** (its text says Viking Vigor) and **"Vessel 2"** (zone 4, unnamed). Give them real vessel names, or tell the website chat which vessel each one is. All zone blurbs and pin texts are still marked DRAFT for Reach to confirm.

### 7. Host, headers, publishing

- **Publish v59.** The public demo is v58.
- **Move to a Reach-owned host** (`world.reachsubsea.com` proposed) off the personal `tada-no` GitHub account. It's static files, so any host works.
- **Framing headers.** The host must let reachsubsea.com frame it:
  - `Content-Security-Policy: frame-ancestors 'self' https://www.reachsubsea.com https://reachsubsea.com` (plus staging and localhost for testing);
  - no `X-Frame-Options: DENY` or `SAMEORIGIN`.
- **Self-host three.js, the Draco decoder and Inter** (today they come from jsDelivr and Google Fonts). That removes the third-party requests and the cookie-consent question.

## Tell the website chat if any of these change

- **Zone names, order or numbers.** The website's landing page cards and the embed zone links use them (`src/data/world.ts`, later the WordPress zone posts).
- **Asset names.** Zone cards list up to three per zone.
- **Download size.** "An 18 MB scene" is typed on the Services and Careers embeds and in the landing page FAQ.
- **A big change in look.** The landing page uses stills from `film/out/` (17 Sep 2026 renders) for its hero and zone cards.

## Website files, for reference

- `src/pages/3d-world.astro`: the framed page. It passes `zone` and `careers` through, adds `embed=1` and listens for `reach-world:release-focus`.
- `src/data/world.ts`: the scene URL, the in-site paths and the zone list.
- `src/blocks/Embed.astro`: the in-place poster embeds.
- `docs/09-wordpress-handoff.md` §7 and §7.1: the hosting and API contract the WordPress developer builds against.
