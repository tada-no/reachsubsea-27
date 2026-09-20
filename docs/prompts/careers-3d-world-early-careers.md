# 3D World for early careers: brief for a new chat

Written 20 Sep 2026 at the end of the Careers overview build. **Start this chat in `~/Desktop/reach-world`** (the Three.js project), not in reach-web-2027: the work is inside the scene. The website only needs a link or embed slot at the end.

## The ask (Ross)

Explore how we could engage trainees and young people in a career at Reach by adding something interesting to the 3D World we have built. Ideas first, then one small prototype the website can point at. Do not build all of it.

## Who we're trying to reach

Two real groups, both on the live Careers page:
- **Trainees (lærlinger):** vocational students. Offshore trainees have completed "Grunnkurs elektro og datateknologi" or "Teknologi og industrifag" plus "VG2 Automatisering"; onshore trainees are in administration, IT, media and similar. Reach has taken trainees since 2013, and every trainee who passes their final exams has been offered a full-time position.
- **Graduates and students:** engineering, data, technology and business, met at career fairs (Glasgow, Plymouth, Szczecin, Oslo).

Do not invent facts about roles, pay or benefits. Only use what the client has supplied (see `reach-web-2027/docs/prompts/careers-overview.md` and `src/data/careers.ts`).

## What the 3D World is (checked against `~/Desktop/reach-world/README.md`, v39)

- A Three.js rebuild of Reach's Unity 3D world. One page, `reach-ocean-realism.html`, plus modules in `src/` (`src/CONTRACTS.md` says what each promises). Published demo: https://tada-no.github.io/reach-world/ (`Publish demo.command`). Local: `Open preview.command`, port 8765.
- **Purpose on the website:** the big interactive feature on Home and under Services (Q2, Q9): "walk through a Reach Remote uncrewed operation and every other vessel and ROV combination we work with". It loads as a poster, on click, because it is a 15–19 MB download with about 6.6 s to first render; phones get the poster plus a link to the full-screen page.
- **Four zones** (ids unchanged): Subsea Infrastructure, Oil Field Operations, Offshore Wind & Renewables, Subsea Production & Monitoring. Nine assets. Each zone has hotspots that open an info drawer.
- **Current interactions:** orbit and fly camera between zone and hotspot shots; an info drawer per hotspot with generic widgets (Zone 4 has a magnetometer trace and a Year 0–10 reservoir slider); **Pilot mode**, a flyable Reach mini-ROV underwater with a telemetry console, that folds into a drone at the surface and flies above the water (WASD, E/Q rise and sink, arrow keys look, Shift boost; touch joystick on phones); two easter eggs that already reward exploration: **ROV coins** (four spinning gold coins underwater, one per zone, collected for a gold ROV) and **helideck landings** (three helidecks, stamps fill in, gold drone unlock, saved in localStorage); a scripted **film mode** (`?film=1`) for UI-free video.
- **URL parameters that exist:** `?q=high|medium|low`, `?v=`, `?film=1`, `?ktx2=1`, `?texcap=0`, `?bloomskip=0`, `?dynres=0`, `?resetdecks`. **`?zone=N` and `?embed=1` are not implemented** as far as I could find, although the website's `src/data/world.ts` and docs/05 §2.13 assume them (Q10 asked for them in a separate task in reach-world). Any careers link into the scene needs `?zone=` or a new parameter first.
- Known limits: phones struggle until KTX2 textures are done; the intro downloads 19 MB before it starts; only Chrome's phone emulation has been tested.

## Constraints from the website side

- The scene must stay optional and never be the only way to learn about a career: the Careers page is complete without it.
- Any new interaction needs a fallback for phones and for reduced motion.
- No invented content. Anything about roles must come from client copy; labelled placeholder text is fine while exploring.
- Keep Reach's tone: curious and hands-on ("Learn, Teach, Reach"), not gamey. The existing easter eggs (coins, helidecks) are the right temperature.

## Suggested first steps

1. Read `README.md` (State as of v39, sections 5 and 6) and `src/CONTRACTS.md`; run `Open preview.command`; fly Pilot mode once.
2. Propose 3 to 5 ideas, each with a one-line reason by visitor intent (a 16-year-old choosing a trade, a graduate comparing employers). Starting points, not a list to build: a "day in the life" route through the four zones with the roles that work on each asset; a "pick a role" tour that opens the offshore, ROC and workshop views; a Pilot-mode mission with a skill the trainee track actually teaches (survey line, ROV launch and recovery); zone hotspots that name the role behind each asset.
3. Ask Ross with AskUserQuestion which to prototype. Build one behind a URL parameter (for example `?careers=1`), following the module pattern in `src/CONTRACTS.md`; commit and bump `RELEASE` as the README says.
4. Report back with what the Careers page in reach-web-2027 should link to (a URL with `?zone=` or the new parameter). That change is a one-line link edit there, in a separate chat.

## Do not

- Change the four zones, the asset set or the interface colours without asking.
- Publish (`Publish demo.command`) without Ross's go-ahead.
- Edit the reach-web-2027 repo from that chat.
