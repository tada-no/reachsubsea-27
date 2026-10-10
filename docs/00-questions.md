# Open questions

Questions are asked in Claude with clickable options, then recorded here. You can also tick `[x]` or write under **Answer** directly.

---

_No open questions right now._


---

## Answered log

### Q167. Reach Remote page: the walk-around and the blocks below it (9 Oct 2026)
Context: Ross: "plan the rest of the Reach Remote page, think carefully about the UX and UI of the user scrolling and experiencing all the features of the Reach Remote model." Builds on Q165 (the stage is the hero, at sea in daylight on a slight swell; scrolling pins it for a walk-around; the descent fades into the next block). Sources: the brochure (`ref/reach remote/REA25 2595 170…`: p7's six labels, p10 oversight levels, p11 spec), the Perth ROC brochure, client PDF p11 (section list), Q2 2026 report p17–25 (milestones, projects, quotes, carve-out), the render test on `/reach-remote-review/`.

**The scroll (one pinned stage, six chapters).** The stage is a sticky section the height of the viewport under the header (never under 640) and a runway of chapters scrolls past behind it. The scroll position sets one number, T, through the chapters; the camera follows T on rails through a critically damped smoothing (so wheel steps and flings never jerk it) and the chapter text switches at thresholds, as the Figures block's pinned pair does (the state comes from the scroll position, not an IntersectionObserver, so a fling can't skip a chapter). Nothing is hijacked: the page scrolls at native speed and the stage looks where the scroll is. Each chapter owns one run of scroll (`clamp(360px, 55vh, 560px)`, as Figures; the launch gets two), so the whole tour is about three and a half screens at 1440 × 900, and someone who scrolls straight through is past it in two seconds with nothing hidden from them (every chapter's text is in the page below, see fallback).
- **Hero (T = 0):** as the render test: port bow at the waterline, the vessel right, the title stack left on the navy scrim, the breadcrumb pinned at the top (Home › Assets › Reach Remote). Drag to orbit, sway idle. Under the lead, a scroll cue, "Walk around the vessel" with a down chevron that nudges (movement, no fade), which leaves once the tour starts. Orbit is off during the tour (the camera is on rails) and back at the hero.
- **The chapters**, in the order you would walk round the vessel at the quay: the deck first, then under the water, then the ROV goes to work. Each chapter = a camera key (azimuth, polar, distance, a target point on the hull that rides the swell with it), a text panel and up to four points.
  1. **Nobody on board.** Port quarter at deck height, pulling back to the whole deck. The concept: controlled from a remote operations centre ashore (Haugesund, Perth), IMO degree three, DNV's world-first AROS notation. Points: the deckhouse ("run from shore"), the LARS over the stern.
  2. **Always connected.** The camera climbs to the masthead (close, fit ≈ 0.4). The brochure's "multiple redundant communication carriers": VSAT, dual Starlink, Iridium, MBR, 5G, Ceragon Pointlink; and situational awareness: radar, PTZ camera, AIS. Spec rows: Communication · Situational awareness.
  3. **Deck, drone and tools.** Over the starboard bow looking aft along the deck: aerial drone capacity (brochure p7), the two tool garages, the launch and recovery system (8.6 t SWL). Spec rows: Drone · Tool garages · LARS.
  4. **Power and propulsion.** The camera drops to the waterline amidships and dips under by the end of the chapter (Snell's window overhead), looking at the two azimuth thrusters. Battery packs 2 × 369 kWh, variable-speed gensets 2 × 441 kW, thrusters 2 × 350 kW; "optimised for low energy consumption", up to 90% less fuel than a crewed vessel. Spec rows: Batteries · Gensets · Thrusters · Speed (11 kn max, 9 service).
  5. **Survey sensors under the hull.** Fully under water, looking up at the keel gondola from below-aft (the brochure p7's lower labels): dual EM2040 multibeam, Topas PS120 sub-bottom profiler, HiPAP 502 positioning. Bathymetry and sub-bottom surveys to 500 m water depth from the hull alone. Spec rows: Multibeam · Sub-bottom profiler · Positioning · Survey depth.
  6. **The ROV goes to work** (two runs). The launch as built on the review page: the camera swings under the moonpool, the E-TMS and ZEEROV lower out, descend and release on the tether, lamps on. Points as they appear: E-TMS (tether 330 m), ZEEROV (115 kW, 2,000 m, 600 kg payload, 30 days submerged). Spec rows: ROV · Depth rating · Payload · Tether. The navy scrim rises over the stage in the last tenth of the run, so the next block (navy) takes over without a cut (Q165: fade to the next block).
- **Text panel:** cols 1–5 (the hero's column), one flow: eyebrow (the chapter's name), H2, body of two or three lines, then the chapter's Spec rows (label · value; hairlines belong here, docs/08 §5), an optional link. Switches as the Figures slot does (rises from a floor, exits through a ceiling; no fades). Under it, six ticks as Figures (the current one accent), each a button that scrolls to its chapter, and a "Skip the tour" link to the subnav for anyone who wants the facts without the walk.
- **Points (the brochure's labels, on the model):** a 16 px ring marker (`icon/accent`) at an anchor on the hull, projected every frame, a 1 px leader to a short label (Label style on a `bg/overlay` pill, as the 3D World's panels). They land one by one as the chapter arrives (scale, no fades) and hide when their anchor faces away from the camera. Hovering or focusing a spec row lights its marker, and only that (one highlight channel, as the Fleet register). Labels are two or three words; the numbers live in the spec rows, never on the model. Markers are `aria-hidden`: the spec rows are the content.
- **Phones (< 900):** the tour runs too (it is the point of the page). The stage takes the top 56% of the viewport (the vessel composed by the lift that exists), the chapter text the bottom 44% in a navy panel; no points (too small at 375), the spec rows carry the facts; ticks stay; the hero's drag-to-orbit stays (vertical swipes scroll, `touch-action: pan-y` as now).
- **Fallback (no JS, no WebGL, Save-Data, reduced motion):** the chapters are the content and render as a plain list: each one a Split media row (a still of the model at that chapter's camera, rendered once from the stage and saved as a JPG, beside the text and spec rows). JS adds the pin and the live model; the markup is the same either way. The stills double as the stage's poster (the hero is never blank while 950 KB loads) and are what the WordPress editor uploads per chapter.
- **Loading:** poster under the canvas; the vessel on page load (950 KB); the ZEEROV and TMS (1.7 MB) start loading when the tour reaches chapter 4, ready for chapter 6; three.js bundled on this page only. Level 1 model everywhere (Q165).

**Below the tour.** Subnav Section pages (Assets; Reach Remote active), sticky from here. Then, in order:
1. **More than a vessel** (navy, joined to the fade): the vessel · the ROC · Reach Horizon as one system, with Reach Relay as the link between them. Layout to decide (below).
2. **Stats band Feature** (tint): ~750 uncrewed operational days (key-figures, placeholder wording) · up to 90% fuel saving · 24/7 operations · 3 countries with sailing permits (Norway, UK, Australia). All from the Q2 report; the two new ones go in `key-figures.ts`.
3. **Four levels of oversight** (white): Split media Numbered list, image end: Monitor and observe · Control and support · Operate and overrule · Direct control (brochure p10), the control-room photo (brochure p5, 1468 px) and the "human in the loop" line.
4. **Built with partners** (white, joined): Card grid Strip, text only, no logos: Kongsberg Maritime (vessel, LARS, hull sensors) · Massterly (manoeuvring, remote and autonomous control) · Kystdesign (ZEEROV, E-TMS) · DNV (AROS notation, ROC certification). The client PDF p11 asks for the first two; the brochure names all four.
5. **Where it has worked** (tint): Feed grid Projects, 3 cols, `vessels` = Reach Remote 1 or 2: Ormen Lange gWatch and Scarborough gWatch (built), plus the Q2 report's three features to add to `projects.ts` (Gassco pipeline inspection, ~3,500 km across 24 work packages; Scarborough cold commissioning; Pyrenees Venture post-cyclone inspection). Action "All projects".
6. **In their words** (white): one Statement quote, not a carousel: "This is a small step for survey, but one giant leap for marine operations." (Q2 p22, a client, unattributed). Optional; dropped if Ross finds it generic.
7. **What's next** (tint): Split media Image (the 3 & 4 photo): eyebrow "What's next", H2 "Reach Remote 3 & 4, and a company of their own", two short paragraphs (the build at Kongsberg Maritime with the EU Innovation Fund; the planned standalone company and Reach Horizon as SaaS, flagged as investor-sourced per the client PDF), two links: Build & EU funding → `/assets/reach-remote/3-4/`, Why invest.
8. **Accordion Split** (white): new topic `reach-remote` in `faqs.ts` (Is anyone on board? Where is it operated from? What can the ROV do? How is it certified? What does uncrewed save?), answers that read right on the FAQ page.
9. **CTA panel** (white, same ground as the accordion): "Would you like to know more?", one action, no named contact (client PDF p11).

**WordPress:** a new block `reach/model-stage` (docs/05 §2.32 once approved): model file (GLB), poster, scene (studio · sea), sea state, hero (eyebrow, title, lead, breadcrumb from the page), `chapters[]` (eyebrow, title, text, `specs[]` label · value, `points[]` label · anchor, still, link). Editors edit copy, spec rows, point labels and stills; camera keys and anchors are developer presets per model (a named view per chapter), not editor fields. **Figma:** Block/Model stage (Hero · Chapter × Desktop · Mobile), parts Chapter panel, Callout, Chapter tick; Pages / Reach Remote frame; after approval.

**Build order and gates:** (1) the tour on the review page: six chapters, points, the phone layout, and a live toggle "Camera follows the scroll · Camera snaps per chapter" to compare the two feels (memory: taste calls are compared live, not described); Ross's render pass (Q165's open gate) happens on this; (2) stills rendered from the stage for the posters and the fallback; (3) the page at `/assets/reach-remote/` with the blocks above, FAQs and projects added; (4) docs/08: 1440 · 1100 · 800 · 375, the card sweep, no-jump measurements on the ticks and the spec-row hover, axe, the token audit, dev vs build CSS; (5) Figma and the ledger; (6) the 3 & 4 child page (Hero Text · Split media Spec table of project facts · Timeline of milestones · the EU emblem and disclaimer · CTA; no FAQ, no subnav pill, as the client PDF p12).

**Chapters:**
- [x] **Six, as above** (recommended): one per thing the model can show, deck to keel to ROV
- [ ] ~~Four: Always connected · Under the hull · The ROV goes to work · Nobody on board (power and deck folded into the spec rows)~~
- [ ] ~~The brochure's six labels one to one: Aerial drone · Communication carriers · Battery packs · Electric ROV · Multibeam · Sub-bottom profiler~~

**Phones:**
- [x] **The tour runs, text under the stage** (recommended)
- [ ] ~~The stills list (the fallback) on phones; the live model only from 900~~

**More than a vessel:**
- [x] **A system chain** (recommended): three nodes on one line, Vessel · ROC · Reach Horizon, each a pictogram, H3 and two lines, Reach Relay named on the connector ("up to 25× faster data transfer"); the connector draws in as the block reveals (as the Lifecycle rail); stacks vertically below 900 with the connector down the left
- [ ] ~~Card grid 3 cols, icon media (the Technology page's pattern)~~
- [ ] ~~Card bento trio-wide: the three parts as cards, Reach Relay as a fourth wide card~~

**Answer (Ross, 9 Oct 2026):** six chapters, deck to keel to ROV; the tour runs on phones with the text under the stage; "More than a vessel" as a system chain. Next: the tour on the review page (build order step 1), with the camera-feel toggle, before the page is built.

**Build step 1 done (9 Oct 2026): the tour on `/reach-remote-review/`.** The stage is pinned (`position: sticky`, the viewport's height, the header over its top as on the photo heroes) and a runway of seven items scrolls behind it: a short hero run (0.6 of a run), five chapters of one run each (`clamp(360px, 55vh, 560px)`) and the launch at two, plus one band of runway after the last so the pin holds until the launch has played out. The scroll position drives everything (`src/scripts/reach-remote-stage.ts`, "The tour"): each chapter has a camera key (distance, elevation, azimuth, a target on the hull that rides the swell, a composition shift that keeps the picture right of the text column); the camera's rails chase the key through an exponential damping (rate 6/s), moving over the first 45% of a chapter's run and holding for the rest; the text switches a fifth of the way in; the launch chapter hands the rails' position to the launch scrubber as its first camera key, so there is no cut, and its scrub is damped the same way; a navy fade covers the last 12% of the launch run. Points are DOM pills projected every frame, hidden behind the hull by a raycast, landing one by one (scale, 90 ms apart); a spec row under the pointer lights its marker only. Ticks jump to chapters, "Skip the tour" lands on what follows. Two camera feels to compare live (`Camera feel` chips): follows the scroll (recommended) · snaps per chapter (the same damping at 4.5/s toward the chapter's own key, ignoring progress). Phones (< 900): picture in the top 48%, words in a navy panel below (the hero's too, so every stop reads the same way); the body line and any fourth spec row are left to the accessible copy; no points. Fallback (no JS, reduced motion, or `?static=1` for review): the chapters as rows, text beside spec rows. Checked at 1440 · 1100 · 800 · 375: nothing moves on hover or tick hover (rects measured), no sideways scroll, tokens audit clean.
- **Anchors measured on the model:** deckhouse roof 4.4 m up; the forward lattice mast with the radar at x ≈ 7.3 (10.3 m up); the satellite dome at x ≈ −5.5 (10.6 m); the A-frame over the stern at x ≈ −6.5 (8.5 m); foredeck 2 m; thrusters at x +9.1 and −8.5, hubs 0.85 m under the keel; the multibeam pod and profiler bar from the gear module's own numbers. Not marked, because the model gives no place for them: the tool garages, the battery packs (inside the hull; the brochure's label just points at the hull side), HiPAP 502, the PTZ camera. They stay as spec rows.
- **Critique round (9 Oct 2026, Ross: "critique the scroll UX and UI … smooth, fluid, information clear on top of the render, not too much detail"):** five faults found by scrolling it end to end, all fixed. (1) A dead start: the stage pinned and nothing moved for 300 px; the hero run is now a quarter run, so the camera starts almost as the stage docks. (2) Whip pans: chapter 1 to 2 swung the camera 166° in 220 px of scroll; the route now stays on the port side (port quarter · port beam masthead · over the port bow · under the port side · below-aft), no leg over 95°. (3) Markers slid across the picture while landing; they now wait until the camera has arrived (distance, elevation, azimuth and target all within tolerance). (4) Titles sat on bright sky; a copy ellipse scrim from the bottom-left (as the photo heroes, 92% → 70% → 0) sits under the text column only, so the vessel stays lit on the right. (5) Too much per stop; copy cut to eyebrow, a short title, one sentence and three one-line spec rows (the brochure's numbers stay in the rows, the names on the markers). Also: tick jumps are instant (the stage is pinned, so only the camera glides to the chapter, no whip through the ones between). Measured: a continuous scroll at 0.45 px/ms moves the camera at most 4.7 m per frame, all during the moves, no spikes at chapter boundaries or into the launch; phone panels fit every stop (320 of 382 px). Two scares that were the review browser, not the page: its pane pauses animation frames and CSS transitions while hidden, which once showed two chapter texts at once and once a static camera.
- **Scrub round (10 Oct 2026, Ross: "wouldn't it be better if there was less text info and the scroll was scrubbing through the 3D?"; answers: title and labels only, "could possibly be as a card"; continuous scrub, eased at waypoints):** built on the review page. (1) The stage carries one title line per chapter in a card (the overlay surface, as the labels; a review chip compares it with solid navy) with the ticks and the skip link in the same card; at the hero the card holds the scroll cue. The sentences and spec rows left the stage: "The vessel in numbers" under the tour lists every chapter's three rows (three groups across from 900, two from 600, one on phones); the static fallback keeps its rows and hides that block, so nothing repeats. (2) The camera runs the whole chapter from the previous key to its own, eased at both ends (smoothstep over the run, damping as before), so it never holds and never jumps; the title and tick change halfway through the run (the launch's at 12%, the ROV being the subject from its first frame). (3) Labels carry the number where one earns its place (Launch and recovery · 8.6 t, 350 kW azimuth thruster, Dual EM2040 multibeam, Topas PS120 profiler, E-TMS · 330 m tether, ZEEROV · 115 kW electric); they show from 70% of a chapter's run until halfway through the next, so they ride the model while it moves. A label sits to the marker's right, flips left when it would run off the stage, and goes under the marker when neither side fits; one that would cover another is pushed clear. (4) Phones and tablets (under 900) now get the picture for the whole band with the card as a strip under it, the hero's words on the picture as on desktop, and the labels on (there is room now that the copy has gone). (5) The at-sea scrim drops to 35% while touring (the card carries the words). Checked: 1440 · 1100 · 800 · 375 captures of every chapter (headless Chrome with software WebGL, which runs the frame loop; the review pane pauses it while hidden), tick hover and tick click leave the card's rects identical, no sideways scroll, numbers block three-up/one-up, token audit clean.
- **Smoothness fix (10 Oct 2026, Ross: "the camera is very jumpy, it needs to be smooth"):** two causes found and fixed. (1) The rails only engaged when the title changed, which the scrub round had moved to halfway through chapter 1, so the camera sat still for half a run and then lurched to catch up; the rails now engage from the first chapter's first pixel (the camera handoff from the hero's orbit is its own step, the title change another). (2) A mouse-wheel notch is a 100 px step, and the camera's goal stepped with it; the scroll line the camera reads is now smoothed (a 10/s chase) before the camera chases the goal (5/s), so a notch gives an S-shaped move, not a kick. A tick jump sets the smoothed line outright, so the camera still glides straight to that chapter rather than through the ones between. Measured in the review pane with a 100 px step every 120 ms through the whole tour: no frame moves the camera more than 2.4 m-equivalent, no spikes at the handoff, the chapter boundaries or the launch; one notch ramps 0.17 → 0.49 → 0 over about 40 frames; a tick jump peaks at 3.6 and decays evenly.
- **One continuous pan (10 Oct 2026, Ross: "it might be the order of things, it should scroll through as if the camera was panning in one continuous move"):** right; the route doubled back. From the hero at the port bow (az 128°) it went aft to the quarter (220°), forward to the beam (166°), forward again to the bow (132°), aft under the water (212°), astern (252°), then the launch swung back the other way. The chapters are reordered so the azimuth only ever grows, one sweep from the bow round the port side to the stern and under: Drone and tools on deck (port bow, high, 140°) · Always connected (port beam at mast height, 170°) · Nobody on board (port quarter: deckhouse and LARS, 205°) · Hybrid power (port quarter below the water, 222°) · Sensors in the keel (astern, deep, 252°) · The ROV goes to work (the launch orbit now continues the same way round, to 318°). Elevation rises once over the bow (0.09 → 0.55 rad) and then only falls (0.22 · 0.25 · −0.32 · −0.8). Legs of 12° · 30° · 35° · 17° · 30°. The narrative still reads deck → keel → ROV; "Nobody on board" moves from first to third, which the hero's lead already states. Every chapter recaptured at 1440 with its labels on and nothing occluded.
- **Ross's nine notes (10 Oct 2026), all built on the review page:** (1) the hero eyebrow on one line (only the title keeps the 18-character cap). (2) Chapters 1–4 pulled back about a sixth (45 · 40 · 52 · 50 m; the cover framing and the keel stay). (3) The eyebrow and title ride up to the stage's top and stay for the whole tour, driven by the scroll over the first chapter's first half (the title at half size, the lead fading out, a navy scrim at the top so the name reads over sky); the lead is not pinned (it would compete with the cards for six chapters). (4) The pop-ups are cards in the title card's container: eyebrow (the feature) and one short line (the fact), the overlay surface, radius md, 12/16 padding, 26 characters wide at most; the aft thruster's card carries the hybrid plant line so the two thrusters don't repeat. Phones show one card per chapter. (5) The cards rise and fade in with the scroll (each a step after the one before, over a run's 55–80%) and go out over the next run's 20–45%; the launch's with the ROV's descent; no timers. (6) The launch camera continues from where the keel chapter leaves it (the old first key pulled out to 58 m and dived back in, written for a start from the cover). (7) Marine snow under the water: 2,000 motes (1,000 on phones) drifting down in a box that follows the camera, faded with distance and above the surface. (8) The fade covers the last 5% of the launch run, not 12%; the pin still releases exactly as the launch ends, so on the page a navy block should follow the tour for the fade to land on. (9) The water column is pulled towards navy-900, 10% at the surface light to 50% in the deep, so the sea's blues are the site's; the daylight surface stays. Also: the drone card's anchor raised off the deck surface and the hull-occlusion tolerance widened to 1 m (it had flickered with the swell). Checked at 1440 and 375, every stop.
- **Quieter stage (10 Oct 2026, Ross: the bottom-left title box distracted; dots and a shorter skip; the hero needn't shrink so far; the eyebrow green too light; cards need more padding, white line and a small solid white dot; the sea surface from below looked glassy):** the title card is gone; the stage carries only the pinned name line, the fact cards, a row of six dots (white, the current one full) and "Skip" in label size, bottom left; on phones the same row is a thin navy strip under the picture. The hero title shrinks to 70% on the way up, not 50%. Eyebrows on the stage use icon/accent (sage-400 on navy) instead of text/accent (sage-300), which read too pale over the picture; a site-wide question whether hero eyebrows on navy should follow (Q168 candidate). Cards: padding 16/20, white leader, an 8 px solid white marker (no outline). The sea surface from below: wave detail carried to 260 m instead of 130, stronger ripple modulation, a softer edge on Snell's window, so it reads as water, not glass. Also: on portrait stages the chapters sit back only 35% of the hero's extra distance (the hero fits the whole vessel; a chapter frames a part of it), so phones see the deck, masts and keel large instead of a toy-sized hull. Reviewed with the design-taste-frontend and impeccable skills (critique below); review-animations is user-invoked only (Ross runs /review-animations).
- **Critique (10 Oct 2026; impeccable critique run as two isolated agents, design review and detector, plus the design-taste-frontend lens):** verdict authored, not interchangeable (camera keys measured on the hull, brochure labels on real geometry, the red hull and marine snow are this product's); heuristics 25/36 (help n/a). Detector: zero findings at source; at runtime one real note (the "Skip" link resolved to the light theme's secondary grey because the panel lost its navy surface class) and three false positives (the shared header's height transition, the review intro's 85-character measure, eyebrow-plus-heading read as a heading with no space above). Fixed from the review: (1) the launch cards sat on the TMS and ROV they describe; offsets raised so the leader does the pointing; (2) "Hybrid plant" was anchored to the aft thruster, which says the batteries live in a propeller; it now points at the hull side midships (engine room) with the line shortened to "2 × 369 kWh, 2 × 441 kW"; (3) the keel stop pulled back from 22 to 27 m so the gondola sits in a frame rather than against it; (4) the progress row was aria-hidden yet held seven focusable controls; it is a named nav now, the current dot carries aria-current="step", the skip's hidden text says where it goes; (5) the white marker and leader vanished on the white deckhouse roof; both carry a navy-64 edge; (6) the skip's colour. Left as taste calls for Ross: the pinned name at 70% is the loudest thing on every stop (the review would land it near h3, Ross had just asked for it bigger); the card eyebrow in sage over the 64% overlay drops to about 3:1 where the card lands on sky or the white superstructure (the review-page chip "Fact cards: solid navy" shows the fix); the numbers block repeats the cards (could be the static fallback only, or a navy-50 band for the fade to land on); one chapter with no card at all to let the asset speak. The taste lens flags the scroll cue as a banned pattern in general; kept here because this hero's scroll does something the visitor cannot predict.
- **Cards and cue (10 Oct 2026, Ross's screenshot: card text spilling past its ground; try solid navy or 80–90%; drop "Walk around the vessel"):** the spill was a missing token: the padding asked for `spacing/20`, which does not exist, so the whole padding shorthand fell to zero and the text sat on the card's edge; it is 16/24 now (both real tokens), and the card's body is a fixed 26-character box the card shrinks to fit inside, so the ground always contains the text (measured: every card's line sits inside its ground at 1440 and 375). New token `color/alpha/navy-88` (rgb 27 29 59 / 0.88) for cards over a picture; the fact cards use it, the review chip compares it with solid navy-900 (Figma variable to add with the next design-system update). The scroll cue is gone (agreed: the dots row and the pinned stage say enough, and the taste lens had flagged it).
- **Dots, underside, readout (10 Oct 2026, Ross: should the dots be clickable; the underside still glassy; drop the ZeeROV readout and put "Skip tour" bottom right):** the dots stay clickable (they are the chapter index for anyone who wants to jump; each carries its chapter's name for assistive tech and aria-current on the current one). The readout now shows only while something loads (the vessel, then the ROV and TMS); the loaded sizes were review chrome. "Skip tour" sits bottom right, the dots bottom left, on the stage from 900 and on the navy strip under it on phones. The underside of the surface: the mirror term dimmed and drifting light patches added from the world's noise (two octaves of fbm over the plane, moving with time), so it reads as moving water with caustic light rather than a glass sheet.
- **The end of the tour, and size (10 Oct 2026, Ross: the jump from the ROV to a blank navy viewport feels weird; would size specs be good?):** the fade is gone. The runway holds the pin one band longer and the block after the tour starts one band early, above the stage (margin-top minus one band, z-index over the pin), so as the launch ends the next block slides up over the picture with the ROV still hanging in it, and the pin releases once the block covers the stage. On the review page that block is "The vessel in numbers" on a navy surface (`has-surface-navy`); on the page it should be the navy "More than a vessel" block for the same reason. Skip scrolls to that block's top. Size: yes. The brochure's main particulars (REA25 2595 170, A5: length rule 23.90 m, breadth 8.00 m, draught 5.5 m max, deadweight 105 t, gross tonnage 230, max speed 11 knots, service speed 9, endurance min. 30 days, DP limits 3.5 m Hs / 20 m/s wind) give a first group under the tour, "The vessel": Length 23.9 m · Breadth 8.0 m · Max speed 11 knots · Endurance Min. 30 days. On the model, two dimension lines at the deck chapter, as a technical drawing: the length along the waterline beside the port side and the breadth across the foredeck, 1 px white with end ticks and the figure at the midpoint, revealed with the scroll like the cards. The drone card prefers the left side there (over the water) so the lines stay clear; cards that sit under their marker now slide sideways to stay on the stage (phones). Open: on phones the drone card can still sit over the "8.0 m" figure; a per-width card offset would fix it if it matters.
- **Drawn dimensions, and the dots (10 Oct 2026, Ross: could the measure spec be an animated dotted line, smooth with the scroll, starting as the hero text moves up? The dots and Skip tour don't seem to work):** the lines are dotted now (round 1.5 px dots every 5 px) and grow from the centre with the scroll (Ross, same day: could they grow from the centre?), dot by dot, as the hero's words rise: the figure lands first at the midpoint, the line runs out from under it to both ends (the length over the deck run's 6–44%, the breadth a step behind, 28–66%), and the end ticks land as it gets there; the whole goes out with the cards over the next run. The dot pattern is offset each frame so a dot stays pinned at the midpoint while the ends move (`public/review/tour/dims-grow-centre.jpg`). Scroll-driven, no timers, so it reverses with the scroll. The dots and Skip were taking no clicks because the runway's chapters (positioned, later in the DOM) painted over the sticky pin and swallowed them; the pin now sits above the runway (z-index 1, still under the block that slides over at the end). A dot also now lands on its chapter's stop (Ross, same day: should the dot clicks land where the pop-ups are visible? Yes): 92% of the run, where the camera is at its key and the last card has landed; the launch at 55%, with the ROV out. Before, it landed at 30%, with the dot before it lit and no cards yet. Verified by clicking in the browser (dot → its chapter, Skip → the numbers block at the top of the screen) and by captures at 1440 and 375 (`public/review/tour/dims-draw-1440-375.jpg`).
- [ ] **Ross's render pass (Q165's open gate), on the tour:** chapter order and copy, each chapter's framing, the camera feel, the phone layout. Then build step 2 (stills from the stage for the posters and the fallback rows) and step 3 (the page).
- **Build step 3 done (10 Oct 2026): the page at `/assets/reach-remote/`.** The tour is the review page's, unchanged, now a block (Model stage, docs/05 §2.32) with its content in `src/data/reach-remote.ts`, so the page and `/reach-remote-review/` share one source (the review page keeps its chips and its numbers block on navy). Order below the tour, as planned: Subnav (Assets, Reach Remote current) and the navy "More than a vessel" slide up over the stage together as the launch ends (the first element after the tour starts one band early; the subnav's docking sentinel moves with it) · The vessel in numbers (white) · Stats band Feature (tint) · Four levels of oversight (white) · Built with partners (white, joined) · Where Reach Remote has worked (tint) · the client quote (white) · What's next (tint) · FAQ (white) · CTA (white). Decisions:
  - **The numbers block** (Ross): white, straight after the navy chain. First built as eight spec groups (size, at sea, then each chapter's rows); Ross, same day: "not sure this is the best way of showing this?" and chose **one short spec table**: Split media Spec table, one line of body beside the brochure's eight key particulars (length, breadth, max speed, endurance, ROV, ROV depth rating, hull survey depth, autonomy) and the Brochure (PDF) link. The finer detail rides on the tour's fact cards and stays in the brochure. The Spec groups block is withdrawn (no docs/05 entry); the review page's numbers block uses the same table.
  - **Figma (11 Oct 2026, build step 5, at Ross's request):** the page frame (Pages page, 727:38784) and the design system: new blocks Model stage (Hero and Chapter, Desktop and Mobile, the stills taken from the live stage) and System chain; new parts Fact card, Marker, Leader, Dimension line and label, Chapter dot, Tour nav, System chain Node and Link; variable `alpha/navy-88`; Stats band Count=4 Feature (Desktop, Mobile); Card text Strip tiles (Media=None, Accent, Strip and Strip mobile); Split media Spec table rows 7–8 and Accordion items 4–6 as toggles. The project cards reuse the Projects frame's content and photos; the 3 and 4 photo is the Assets bento's; the ROC render is uploaded. Not drawn: the scroll motion and hand-off, What's next's second link (Split media has one action slot), the page's compressed spec rows, a mobile page frame. IDs in docs/extract/figma-blocks-ledger.json (phase4ReachRemoteQ167_11Oct).
  - **Load time (10 Oct 2026, Ross: "quite a wait for the 3D Reach Remote to load"):** measured, then fixed without changing the picture (hull geometry and the IMO checked identical by checksum). Most of the wait was not the download: fitting the hull logo cast a ray from every logo vertex against every hull triangle (1.4 s), and placing the IMO number did the same (0.3 s); both now test only the triangles in a grid cell under each ray (16 ms and 11 ms). The vessel, the Draco decoder and the page script now download side by side (preloaded by the block, the decoder started at once) instead of one after another. The ROV and TMS fetch quietly once the vessel is in, so the launch chapter no longer waits. Production build at 20 Mbps: the vessel shows at 1.5 s, was 3.4 s; on the dev server about 0.8 s, was 2.8 s. Left: the stern name (90 ms), the underwater gear (120 ms) and the first frame's shader compile (130 ms); the 3D World has the same two raycasts (reach-world hulllogo.js, hullname.js) if it wants the same fix.
  - **Second pass (10 Oct 2026, Ross on three blocks):** (1) the Feature stats band's navy lead ran full width over the figures ("the text needs to be trimmed"): from 900 the panel no longer stacks; the lead stays beside the figures and the labels wrap where needed, the lead's too (Technology & Innovation and Sustainability now sit side by side from 900 as well; below 900 unchanged). (2) The spec table "compress a bit": on this page the labels take their own width, the values follow 48 later instead of at the half (one column, so they line up) and the rows are 8 px, not 12; the values no longer wrap on phones. (3) More than a vessel "feels a bit unbalanced": the Reach Relay pill filled the first gap and left the second bare; it is unboxed now, "Reach Relay" just above the dots and its line just below, so the connector runs unbroken from the first disc to the last.
  - **More than a vessel** as the planned system chain (System chain, §2.33): The vessel · The ROC · Reach Horizon, the client screens' wording cut to two lines each, Reach Relay named on the dotted connector ("Data link, up to 25x faster", from key figures). The ROC's pictogram (Ross): the library's "profile laptop" (Figma 33:74), added as `profile-laptop`, filled artwork as the library draws it.
  - **Stats band:** ~750 uncrewed days (leads) · 90% fuel · 24/7 "Operated from shore" · 3 "Countries with sailing permits" (new keys `rr-around-the-clock`, `rr-sailing-permits`, Q2 2026 report p18). Labels shortened, and the Feature band now wraps its labels only where they would run past the panel (it clipped the third figure at 800; the Technology page's band had the same fault, 62 px, now fixed too). 24/7 doesn't count up ("0/7" read as a count).
  - **Oversight:** first built as a numbered list beside the photo; Ross, same day: "this is bad ui" (the list ran far past the image) and chose **split + levels in a row**: a short Split media (the "person in the loop" lead, the ROC image) over the four levels as numbered Tint cards in one row (Card grid 4 columns, joined; 2 × 2 at 600–1199, one column on phones), the client screens' one-line wording. Each name holds two lines so the descriptions start level (measured: equal tops at 1440, 1100 and 800). The image is the brochure p5 ROC render, only 691 px wide in the brochure PDF: ask Reach for the original.
  - **Partners:** text tiles with a role line each (Card grid Strip gains text tiles). DNV is named, as planned (the AROS notation and the Perth ROC's certification are DNV's).
  - **Projects:** the newest three of the five Reach Remote projects (2026: pipeline inspection, Scarborough commissioning, post-cyclone FPSO), so the row has no hole.
  - **Quote kept** ("a small step for survey…"), attributed "A Reach Remote client, quoted in our Q2 2026 report". Drop it if it reads generic.
  - **What's next:** the carve-out and Reach Horizon as software attributed in the copy to the Q2 2026 report (the PDF's "investor-sourced" flag). "Build and funding update" links to `/assets/reach-remote/3-4/`, not built yet (the nav already links there).
  - **FAQs:** topic `reach-remote` under Assets, six questions (the PDF's "What is Reach Remote?" and the plan's five).
  - Checked at 1440 · 1100 · 800 · 375 (headless Chrome with software WebGL): the hero, mid-tour, the hand-off (subnav and navy over the stage with the TMS still in frame), every block; no sideways scroll; static fallback (no pin, no overlap); the review page unchanged; token audit clean (the stage's 640 floor is spec geometry); dev and build identical on the probed styles. Still open: build step 2 (stills for the posters and fallback rows), step 5 (Figma after approval), step 6 (the 3 & 4 page).

### Q166. Card hover on Tint cards (9 Oct 2026)
Context: Ross, on Technology & Innovation's Reach Remote card: "on tinted cards, the shadow hover looks mucky". The shadow is navy already; on a Tint card the pale fill and the shadow's edge are nearly one value, so the edge melts into a halo instead of lifting. Compared live on a temporary review page (Hover style chips + Freeze hover; Tint cards on White, White cards on Tint, image cards on White), stacked image `review/card-hover-compare-1440.png`.
- [x] **Turns white** (recommended): a Tint card fades to White as it lifts (3px, shadow/md unchanged); the pictogram loops' eraser colour follows
- [ ] ~~Turns white + layered shadow~~: as above, and every linked card's shadow becomes a tight contact shadow (0 1 3, navy 12%) under a softer ambient one (0 12 32, navy 8%) in place of shadow/md
- [ ] ~~Current: lift + shadow/md~~

**Answer:** Turns white (Ross). In `src/components/Card.astro`: `.card--tint.card--linked:hover` swaps `--pg-bg` to bg/default, with background-color in the card's transition; shadow tokens unchanged. The review page is removed; the image stays.

### Q165. Reach Remote pages: structure, 3D model hero, render test first (9 Oct 2026)
Context: Ross asked for a Reach Remote page "a bit different to the rest of the site", wondered whether the 3D World's model could rotate as you scroll and highlight features (brochure p7 has six labels), and whether RR 1 & 2 and RR 3 & 4 should be sub-pages. Sources: `ref/reach remote/` (Reach Remote brochure REA25 2595 170, Perth ROC brochure, 26 photos), client PDF p11–12 (Design Reference 09 and 10), Q2 2026 report p17–25, reach-world `glb/reach_remote_lod0–2.glb`.
- [x] **Structure:** one flagship page `/assets/reach-remote/` (the vessel, the ROCs and Reach Horizon as one system; 1 & 2 in service, 3 & 4 in build) and `/assets/reach-remote/3-4/` as its child: a short build and EU-funding status page (EU Innovation Fund communication obligations: emblem, disclaimer, project facts, milestones), the editor updates it per reporting date. Matches the nav and redirects already in place. Ross: "could a lot of the client PDF messaging get in the way of something more creative?" Answer: the PDF's facts stay, its layout doesn't; the walk-around carries most of its content (sensor and ZEEROV cards, emissions and risk cards, the vessel · ROC · Horizon trio) as chapters, so little is left for plain card rows. Only the 3 & 4 page is rigid, by design.
- [ ] ~~Two sibling pages, 1 & 2 and 3 & 4~~ (the same hull described twice) · ~~One page only~~ (grant updates would edit the flagship)
- [x] **3D stage:** the model is the hero, idling on solid navy under the title (brochure cover), and scrolling pins it for a walk-around that orbits through the feature chapters (mast and comms, situational awareness, aerial drone deck, moonpool and LARS with ZEEROV and E-TMS, tool garages, keel gondola with EM2040 · Topas PS120 · HiPAP 502, batteries and gensets, azimuth thrusters, nobody on board), then releases into normal blocks.
- [ ] ~~Photo hero, walk-around as block two~~ · ~~Stills only~~
- [x] **Gate:** render test first, on `/reach-remote-review/`, before the page depends on the model.

**Answer:** as ticked. Render test (9 Oct 2026, `src/pages/reach-remote-review.astro`, `src/scripts/reach-remote-stage.ts`): the 3D World's `reach_remote_lod1.glb` (950 KB, Draco, one baked atlas) holds up at hero scale at 1440 and 375 with studio lighting on navy/900, subject right and the hero text left, with a slow sway (yaw, roll, heave) as the idle. Level 0 (1,181 KB) adds nothing visible; level 2 (586 KB) is faceted and is out, phones take level 1. Three.js r160 as the world, bundled; Draco decoder self-hosted in `public/draco/`. Missing from the model: the hull name "REACH REMOTE 1" (the world paints it separately, `reach-world/src/hullname.js`), to add the same way. Open for the page: a faint waterline reflection under the hull (the brochure cover has one), lighting for the dark port side, and the WordPress block (a GLB upload plus a repeater of chapters: label, text, camera, anchor).

**Second pass, the vessel in its environment (9 Oct 2026, Ross: "have you considered it in its environment, like the 3D World, and the ROV launch?").** The review page now has three scenes and a launch scrubber:
- **At sea:** the hull floats at the world's draft (2.6 m) on a reflecting water plane (three.js Water, a fine tileable normal map of our own, the world's moonpool housing under the keel), with the hull name "REACH REMOTE 1" painted on the port and starboard bow by the world's own `hullname.js` (cap height 0.32 m, forward of the model's painted REACH SUBSEA logo). Two palettes: *dusk* (the brand navy as sky and water, a warm low sun, the hero text stays white on dark) and *daylight* (the 3D World's blue sky and teal water, which makes the white hero text read poorly). The hero composition moves the orbit target, not the camera's view offset: a view offset breaks the Water addon's mirror (the hull floated above its own reflection).
- **Launch (scroll stand-in):** scrubbing plays the world's deploy sequence: the E-TMS and ZEEROV lower out of the moonpool housing, the camera dips under the surface (water hidden, an opaque seen-from-below surface, water-column fog and bounce light) and follows them down, then the ROV flies out on its yellow tether and the lamps come on. Four chapters, Ready · Launch · Descent · Release, every frame a pure function of the scrub position, so scroll can drive it directly. Works at 375 (4:5 stage).
- **Findings:** the sea scenes cost nothing visible in frame rate on a laptop; the under-hull shot reads as the vessel from below once the fog is thin enough to see 60 m (the world's fog density hid the hull); the descent is an empty blue void without the world's seabed or structure, so the real page needs either a short descent or a destination (a jacket leg, the seabed) to arrive at; the daylight palette needs a dark text panel or the dusk palette for the hero.
- [x] **Scene (Ross): at sea, daylight.** Ross sent a 3D World screenshot of Reach Remote 1 beside the jacket and asked whether this chat has the world ("also built here in Claude"): yes, `~/Desktop/reach-world` in full (24 GLBs, 17,800 lines, git to v70). So the daylight scene is no longer an imitation: the world's own sky (procedural clouds, sun), Gerstner swell, hull shadow and waterline foam, the sea seen from below as Snell's window, the water column's colours, fog and backdrop dome, and its sun, sky fill and hemisphere are ported from `reach-ocean-realism.html` and `src/lighting.js` into `src/scripts/reach-remote-ocean.js` (left out: seabed, marine snow, light shafts, lamps, grade and bloom). The hull rides the swell with the world's own buoyancy (heave, pitch and roll read off the wave under the hull), the sky is baked as the environment map, exposure 0.92 as the world. The dusk palette and the three.js Water addon are gone (its normal-map texture deleted). The hero text sits on a navy scrim rising from the stage's foot (70% tall, 0.85, like the photo heroes' tint). Hull name at the world's cap height (0.30 m) but y 2.2 and aftEnd 0.1: at the world's y 2.55 the name module finds no skin forward of the bow flare on this placement and the strip slides aft into the painted logo; measured in the console, 2.2 / 0.1 lays "REACH REMOTE 1" just aft of the stem, clear of the deckhouse door and the logo, as in Ross's screenshot.
- [x] **Sea state (Ross: "let's make the sea a little calmer"), Ross picked Slight 0.6:** every wave's steepness now scales by one live factor (`uSwell` in the shader and the CPU swell the hull rides, so the buoyancy still matches the surface); the review page has a Sea state row, Calm 0.45 · Slight 0.6 · The world as it is 1.0, default Slight, for Ross to pick live. Foam and whitecaps fall away with the lower crests on their own.
- [x] **Models synced?** (Ross asked the 3D World chat to check the wording placement.) The site's `reach-remote-lod1.glb`, `rov-zeerov.glb` and `etms.glb` are byte-identical to the world's (md5 checked), and `reach-remote-hullname.js` is identical to the world's `src/hullname.js` at v70. Only the placement numbers differ (world: cap 0.30, y 2.55, aftEnd 0.27 with its own bow detection; here cap 0.30, y 2.2, aftEnd 0.1, bow +X), because here the module's probe finds no hull skin forward of x ≈ 9 above y 2.4 and slides the strip aft into the logo. Ross's photos (`ref/reach remote/260616-REACH-1309 copy.jpg`, bow; `…-0186 copy.jpg`, stern) show the real name high on the navy band, under the white strake, starting about a quarter of the way from the stem to the deckhouse door and ending before it; ours sits lower on the band and closer to the stem. Ross: build with this placement and mirror the world's numbers once the world chat fixes the probe, so both match. The transom also carries "REACH REMOTE 1 / HAUGESUND" (photo 0186), which neither the world nor the stage paints: a possible later addition to the module.
- [x] **The vessel mirrored in the water (Ross: "the reflection, can we add it here like before"):** a mirror pass in `reach-remote-ocean.js`: once a frame, above water only, the scene is drawn from a camera reflected in the surface (three.js Reflector's camera and oblique near plane at y = 0, so nothing below the surface leaks in) into a 1024² texture, with the sea, sky and dome hidden and the background clear, so only the vessel and its fittings land in it. The world's ocean shader samples it where it would reflect the sky, bent by the ripples, through the same filmic curve and gamma the hull gets on screen, and keeps the world's Fresnel, so the mirror is strongest at the grazing hero angle. One extra draw of the hull per frame: 61 fps at 1440 on this laptop. Review toggle: Vessel mirrored · Sky only (the world). The same limited pass is what the world could take later (see the reflection note above).
- [x] **The ROV matches the world (Ross):** the ZeeROV and E-TMS now take the world's finish rules (albedo-only materials satin 0.78 / 0.06, materials with their own metalness map keep it, reflections driven per frame by depth), so the ZeeROV is the world's bright yellow, and carry the world's lamp rig ported from `src/lighting.js` makeZeeRov: two cool-white LED housings with lens discs on the front cross-member, the SpotLight, two additive haze cones, a glow blob per lens and the amber nav dome, fading on as the stack clears the moonpool and with the haze deepening with depth as the world does. The ROV flies off with its lamps about 40° off the camera so they read.
- [x] **Descent (Ross): fade to the next block.**
- [ ] **Gate (Ross, after the world's sea and the ROV rig): one more render pass on the review page before the page is built; notes to come.** The launch chapter ends on the ROV flying out on its tether near the hull, then the stage fades into the "more than a vessel" block before the water goes empty. No seabed or jacket to load.
- [ ] **The water reflection in the world** (Ross: "I really like the reflection you've made in that version, is that something we could add to the world or is it too heavy?"): the first pass used three.js's Water addon, a planar mirror that renders the whole scene a second time per frame, too heavy for the world (seabed, rigs, particles, post). A limited version is feasible: a mirror pass of the surface vessels only, half resolution, above water only, blended into the world's ocean shader where it reflects the sky, within a couple of hull lengths, high tier only; roughly one extra render of three hulls. A separate task in the world's repo after this page.

### Q164. Newsroom menu: "Stock exchange announcements" (9 Oct 2026)
Context: Ross spotted it in the mobile menu's Newsroom group. In the menu data since 17 Sep (the brief's sitemap), but no page was ever built: a 404.
- [x] Remove it (Recommended): the Newsroom group is Press & media (Events while hidden), with All news as its overview. Releases are in the Newsroom; the official record is Newsweb, linked from the Investors overview
- [ ] ~~Link to Newsweb~~ · ~~Hide it behind a switch like Events~~

**Answer:** removed.

### Q163. Technology & Innovation: product order, Reach Remote link, pictogram suggestions (9 Oct 2026)
Context: Ross, on the "Where we are investing now" cards: "Have the box first, add link in the Reach Remote box, Reach Pilot 3rd, Relay 4th, suggest in the comments for icons".
- [x] Order: Reach Horizon · Reach Remote · Reach Relay · Reach Pilot (was Pilot, Remote, Horizon, Relay; Ross then swapped Pilot and Relay)
- [x] Reach Remote card: Link "Meet Reach Remote" → `/assets/reach-remote/`, the label and URL the menu, footer and hero already use (the page itself isn't built yet)
- [x] Pictograms, Ross's picks from the library (Figma 33:74), unused elsewhere: Reach Horizon `settings-screen` (658:30054; the dots hop, the cog turns a little in its slot, the hub pings), Reach Pilot `reach-pilot` (658:30341; the eye blinks, the pupil looks left and right), Reach Relay `satellite` ("satilite" 658:30201; the feed flares, the signal arcs ping, each panel rolls on its spar in turn). The Figma tiles for satilite and reach pilot sit in frames named "Tile/legal" (to rename)
- [x] Cards switched to icon cards, as the heritage block (the pictogram above the heading; the beside-the-text panels left each glyph's built-in margin showing as a gap under the heading). With the full-width text the PDF's full Horizon and Pilot wording is back (it had been trimmed for the panels)

**Answer:** as ticked.

### Q162. Press & media page (9 Oct 2026)
Context: Ross: "connect to Reach Stipl or use what you have in the design system and build the Press & Media page, list anything you're missing". The Stipl connector's workspace had no Reach brandpad; Ross shared the brandpad (stipl.studio, read in his Chrome) and its public page (stipl.site/reach-subsea-1). It mirrors the design system (the site's tokens, Inter, the horizontal logo in two colourways, Guidelines for logo, colour, type, voice and imagery); its Media and Assets are empty, its logo pack holds two SVGs, and its CMYK values are converted from screen colours (no Pantone or RAL). The live Press & Media page (reachsubsea.no/press-media/, Mar 2025) has the EPS · PNG · SVG logo packs (still live) and every colour's HEX, RGB, CMYK, Pantone and RAL. Client PDF p28: hero, announcements, logo & colour swatches, four press-material cards (placeholders: two photo, two video), a media contact card, FAQ, CTA.
- [x] Content from the live page (logo packs and print values); from Stipl only the clear space (10% of the shorter side). Stipl's computed CMYK not used
- [x] ~~The site's one-colour logo in two colourways~~ → Reach's own files (Ross: "what about the green and navy logo?"): the packs lead with a full-colour logo, navy with the sage bar, and its negative, white with sage. Shown as six tiles in light | navy pairs (full colour and negative; ~~icons only after them~~ the all-navy and all-white one-colour logos, Ross: "keep all neg and all navy logos in"; the icon and its negative), from `public/images/brand/`. ~~Six tiles in three rows beside the text~~ → (Ross: "this can be laid out better") two full-width rows: three sets (Full colour · One colour · Icon), each a white | navy pair named once, one row of six tiles from 1200; then Logo packs beside Using the logo (242 and 240 tall at 1440, was a 570 text column against 850 of tiles), cropped from the live SVG pack (the black logo is there too, in the packs only), and the rules now say full colour first, one colour when only one is possible. The Stipl brandpad's "never recolour it in sage" contradicts the packs: to correct in Stipl. Open: the site header and footer use the one-colour logo
- [x] New block **Brand assets** (docs/05 §2.31): the logo in both colourways beside the packs and rules; swatch cards with every value under the fill, never on it (the PDF's hex-on-fill failed contrast), fills from palette tokens, HEX copies in place without moving anything
- [x] Press photos as a Card grid of four sets from the site's own photos (Vessels, ROVs & operations, Reach Remote, Leadership). The PDF hides a category until files exist; instead each card asks the media team ("Request photos", mailto with the set in the subject) until its pack is uploaded, then becomes Download. No video cards: no footage
- [x] Media contact: the stories' "Press enquiries" CTA panel (Email the media team) with ~~no named person~~ Jorunn Håvardsholm, Group Communications & Marketing Director, as the named contact (Ross: "Jorunn can be the contact"; the live page's), checklist 71 done. One action only, Email the media team: "Contact us" went (Ross: "did we make a rule about having too many cta in this block?"; yes, the Sustainability rule: two actions plus a contact is too much). Her address ran 27px out of the phone card: Meta item now lets an email wrap before its "@" (`<wbr>`, nothing changes where it fits; Contact, Leadership, Investors, Life at Reach checked at 375)
- [x] FAQ topic `press` (under General): the PDF's three questions, two new and Contact's investor-or-press (now topics contact + press)
- [x] ~~Latest news, the three newest posts as cards~~ → a "Latest news" Link in the hero (Ross: "is there any point having these here?"; Claude agreed: they repeated the parent Newsroom and pushed the logo and colours ~800px down; the PDF had three text rows, not cards). The page opens on Logo & colours
- [x] Where to find it (Ross picked): the Newsroom header, "Press & media" Link at the far end of the chip row (the chips and grid don't move: the link is pulled in 4px top and bottom so the row stays chip-high; 600–630 it drops under the chips, phones under them too), and the footer's legal row before Privacy & Cookie Policy (`footerPressLink`). Already in the mobile menu's Newsroom group and search
- [x] Search entry; redirects from live `/press-media/` and dev `/company/who-we-are/press-media/` noted in the page header
- [x] Checked 375 · 600 · 700 · 800 · 900 · 1000 · 1080–1095 · 1100 · 1150 · 1200 · 1300 · 1399 · 1440: no sideways scroll, no value wraps or overflows (CMYK "100, 95, 44, 55" was the tightest, fixed with padding 12 and gap 4 at five across), photo titles one height, copy state measured identical; production build matches dev
- [ ] For Reach (client checklist 67–71): brand colour print values (Primary CMYK, S3 Pantone), logo packs still current, high-resolution press photo packs, optional press video
- [x] Figma (9 Oct 2026, Ross: update Figma): Brand artwork components from Reach's own SVGs, Logo tile, Logo set, Pack row, Swatch card and Icon/copy (Components / Brand assets 685:2732); Block/Brand assets 690:16159 (Desktop · Mobile); page frame Press & media 690:38034; Footer legal row and the Newsroom chip row gain the Press & media link (ledger `phase4PressMediaQ162_9Oct`)
- [x] Figma review (9 Oct 2026, Ross: "fix them all"): Pack rows hug to 64 as the code (were 40, rules under the labels); the photo cards show the press sets' own photos (were the Careers ones); the CTA panel's contact card is 400 wide (360 clipped Jorunn's role and email); the Text hero takes the Photo hero's height and layout (680 Desktop, 525 Mobile, breadcrumb pinned top, title stack at the bottom; all 13 Text-hero page frames follow); Blocks doc frames under the Report shelf moved clear of it (ledger `phase4PressReviewFixes_9Oct`)

**Answer:** built; Reach items open.

### Q161. Client checklist on the prototype, answered by email (9 Oct 2026)
Context: Ross wanted the "what we need from you" checklist open to Reach without a Claude sign-in (the Claude Doc needed one), linked from the footer next to Privacy & Cookie Policy.
- [x] A page on the prototype + email (Recommended): `/client-checklist/` (prototype only, not for WordPress), the 66 items from the doc in its eight groups, numbered for good. Each row: number · text with its pages · status badge (Open · Received · Done) · "Answer by email", which opens a message to ross@tada.no with "Reach checklist <n>: <subject>". An "Email your answers" button covers several items in one message. Data: `src/data/client-checklist.ts` (statuses only, never the answers: the repo is public)
- [x] Footer legal row: "Client checklist" before Privacy & Cookie Policy (`prototypeLinks` in navigation.ts); remove both at launch
- [x] The weekday sync task now reads ross@tada.no for "Reach checklist" emails from @reachsubsea.com: answered items go to Received in a daily status PR, and a fix PR sets its item to Done. The Claude Doc is no longer linked
- [x] Checked 375–1440 (13 widths): no sideways scroll, badges and email links in one column per group, both on the item's first line; the text keeps the 720 prose measure

### Q160. Reports & presentations: quarterly results as a report shelf (9 Oct 2026)
Context: Ross: the Quarterly results section "feels a bit like the financial calendar, can we make it similar to the annual reports section?" Claude agreed: the Date tiles, dashed future quarters and countdown were the Financial calendar's language. The Results archive is replaced by the Report shelf, generalised for both series.
- [x] Covers: the latest 3 (Recommended), page 1 of each report as the annual covers; with the next date as the first slot that leaves Q2 and Q1 2026. Q1 2026 downloaded from the live site (Ross, yes), rendered to `public/images/reports/quarterly-report-2026-q1.jpg` and the PDF deleted; Q2 2026 from `ref/`. In WordPress the cover is the Document's featured image
- [x] Earlier quarters as rows like the annual archive (Recommended): 2021–2025 one row per quarter, Report · Presentation · Webcast in fixed slots, two columns from 1040; 2012–2020 one row per year with Q1–Q4. No year tabs
- [x] Next results date as a placeholder cover (Recommended): a cover-sized dashed outline with "Next results", 17 Nov 2026 and the countdown, then "Q3 2026" and Add to calendar; gone once the date passes. The later provisional quarters (Q4 2026) are left to the Financial calendar link
- [x] Phones: quarter rows stack (label over links, one line at 375); covers go one per row under 600 in both shelves (first the quarterly ones, as Report · Presentation doesn't fit half a phone; then the annual ones too, Ross: Report · ESEF wrapped as well)
- [x] Checked 375 · 600 · 640 · 800 · 900 · 1000 · 1100 · 1120 · 1200 · 1300 · 1440: no sideways scroll, rows one height, no link wraps, cover and next slot the same height. The section is longer than the tabbed version (2003 at 1440, was 948)
- [x] Older reports in drawers (Ross: "the older reports both annual and quarter should be hidden in expandable draws, agree?"; Claude agreed: open, the quarterly section had grown from 948 to 2003 at 1440). Each shelf ends on one Link Expand, "Earlier quarterly results, 2012–2025" and "Earlier annual reports, 2012–2022" (stack/lg under the covers); it stays where it is and opens the rows below itself (measured: no move at 1440 or 375). Both sections are now 783 tall at 1440. The annual archive drops its "2012–2022" heading (the link says it) and keeps its note. Without JS the rows show
- [x] Figma (9 Oct 2026): Report shelf gains Series=Quarterly (Desktop · Mobile) and an Open property for the drawer; Shelf item State=Next; Year row Layout=Quarter files; Annual variants end on their toggle with covers one per row on Mobile; the page frame uses the Quarterly shelf (ledger `phase4ReportsQ160_9Oct`)
- [ ] Remove `src/blocks/ResultsArchive.astro` and its Figma set once the page is approved

### Q159. News single: third critique fixes (9 Oct 2026)
Context: the third critique of the story pages scored 24/36 (no P0, three P1: tall featured photos, a fixed measure that ran 85–91 characters, results leads cut to the dateline sentence). Ross picked all four groups of fixes and asked whether they carry over to the WordPress blocks. Done in base.css, NewsSingle and `scripts/news-cleanup.mjs` (steps 9–10, idempotent; 76 posts changed).
- [x] Featured photo cropped to 3:2: a portrait or square upload ran 1036–1249px tall (OCTIO, the 2013 reports) and put the story a screen and a half down; now 587 at 1440
- [x] ~~Measure 32em (576 for Body at 1440, ~68 characters)~~ → **40em** (Ross: "text columns seem narrow, 720 is probably good on desktop… apply this across the site, like the privacy page"; Claude agreed: 576 read cramped beside the 880 photo). 720 for Body at 1440 (~85 characters in Inter), 694 at 1100, 672 at 800 as Body steps down (a fixed 720 had run 91 there); the boilerplate 640, captions 560. One running-text measure sitewide: news stories, the Privacy & Cookie Policy, project stories (752 → 720) and FAQ answers (814 → 640 at Body small, in every accordion). Split media halves, card rows and list rows keep their own widths
- [x] Release leads: the dateline ("Haugesund, 18 August 2026 –") leaves the lead, the date is in the meta (62); a dated lead under 25 words takes the next paragraph's opening sentences up to 50 words (23), so the 2Q 2026 lead now gives revenue and EBIT; 5 leads that had lost their style get it back
- [x] Rhythm: lists, quotes and link rows step out 24 at every width (16 on phones before, the same as two paragraphs). A link row's first and last Link pull out by their 12 of target padding, so the row's text sits 24 from the paragraphs (was ~40 at 1440); targets stay 48
- [x] One quote treatment (74 quote blocks): a quote block names its speaker in the cite and has no marks of its own. Marks round a whole quote go; a name and title left after the last sentence, or a closing ", said Jostein Alendal, CEO of Reach Subsea.", moves to the cite; a quote that names its speaker inside keeps marks round the quoted words ("…,” said Alendal. “…”); quotes inside paragraphs keep their marks. Missing full stops added (Beacon), cites carry none, 2 empty quote blocks removed
- [x] Boilerplate names linked to /contact/ become plain text (5), which also fixes OCTIO's duplicate link and the comma inside "Jostein Alendal,"
- [x] Key figures row for results releases: under the lead, revenue, EBIT and order backlog as on the Results band (the figure is now a shared Result figure component), each with the year-earlier figure from the release (or its percentage), the period and "All figures in NOK" once above. 16 releases, 2Q 2021 to 2Q 2026, every value from the release's own text; a figure a release doesn't state is left out (1Q 2026 states no backlog, so it shows two). Columns with rules between at the text measure, one column on phones
- [x] Figma (9 Oct 2026): Key figures component 669:2696 (Desktop · Mobile, built from Result figure instances); Result item renamed Result figure 465:9591; Article quote and doc text descriptions; container/prose described as 40em; News single frames' quote at space/24 with the new quote text (ledger `phase4NewsroomQ159_9Oct`)

**Answer:** Photo crop + measure (Recommended), Release leads, Rhythm + quote consistency, Key-figures row for results.

### Q158. Search results and 404 pages (9 Oct 2026)
Context: Ross: "make Search results and a 404 page, is there anything creative worth doing on the 404 page?" Claude's view: the useful creative move is to read the broken address (most 404s after launch will be old reachsubsea.no links the redirect map missed) and show the likely page straight away; the picture is the flourish. Ross picked the Seabed scan from four options (Seabed scan · Sonar ping · Fleet map · Plain). Layouts recorded in docs/05 §3, parts in docs/04 §10c–10f.
- [x] Search results at `/search/?s=…` (WordPress search.php, `/?s=`): the archives' light header (Q148), the Search box with the query, type chips as links with counts (`&type=`, filtered in place, URL kept), the count line, reading-list rows (eyebrow type · context, H5 title link, two-line excerpt with the words marked), 10 then Show more, Popular links and a contact line beside
- [x] One index of 481 entries (`src/data/search.ts` → `/search-index.json`): 33 pages, 20 fleet units, 10 people, 31 projects, 67 FAQs, 82 reports, 49 publications, 189 stories. Ranking in `src/lib/search.ts`: words match from a word's start, accents folded (hogheim → Høgheim), plurals folded, every word must match (else the best partial matches, said so), titles and editor "search terms" (aliases: a role's initials, report codes like 2Q2026, vessel names) above body text; pages, fleet, people and reports a little above news
- [x] The header's Search panel now uses the same Search box (docs/04 §10c): looks the same, submits to `/search/`, and its clear button shows only once there is text
- [x] 404: navy band, "We surveyed this spot. Nothing here.", Go to the home page, and the Seabed scan: the dot matrix as a tilted patch of seabed, a survey line sweeping it, "404" lighting up as a raised mound on each pass, readout Depth 404 m · Contact None, pause button; still for reduced motion. Below: the Search box holding words read from the broken address and up to three matches (`/investor-relations/financial-reports/` → Reports & presentations, Financial calendar; `/no/om-oss/` → About)
- [x] ~~Tilted seabed~~ → flat, and the scan is the headline (Ross: "no tilt, the scan can be under the eyebrow and act as the heading, then the hero text and subhead joined to be one subhead"; Claude agreed, keeping "Page not found" as the real H1 in eyebrow style, since the dot 404 is a picture). The digits start at the left edge; the seabed runs across the container after them; the height scales smoothly with the viewport. `?scan=flat` review toggle removed
- [x] Search help as two `bg/tint` panels (Ross); cols 9–12 at 1100–1399 so the email fits
- [x] The dot field fills the whole hero, the copy on navy halos and a navy fade under the header (Ross). The "Depth 404 m · Contact None" readout dropped into the subhead: "We surveyed this spot to a depth of 404 m and found nothing." Pause button dropped: the scan now makes one pass (4.5 s) and stops with the 404 lit, which WCAG 2.2.2 allows without a control (Ross asked if it was needed; Claude: only while it loops)
- [x] Taller on desktop (Ross): the band takes the site's one hero height from 900 (680 at 1440, 800 from 1695; was content height, 645), the dot field extended to cover it
- [x] Same feel as the other heroes (Ross, with the Services hero as reference): navy/900 ground, copy pinned to the bottom, the Photo hero's scrim over the dots (side and bottom fades, an ellipse under the copy, the header bar) so they fade in from the edges; the navy halos behind each line of copy are gone. The digits sit above the scrim on their own layer
- [x] "to 404 m" → "to a depth of 404 m" (Ross asked; Claude: yes, without "depth" 404 m can read as a distance, and the survey line only lands if it reads as depth)
- [x] Figma (9 Oct 2026): Search box 673:2724, Search result 674:2708, Search help 674:2718 (Components / Search 673:2678) and Seabed scan 675:2771 (Components / Seabed scan 675:2766); page frames Search results 677:25318 and 404 · Page not found 678:25556; Search field Focus and the Search panel brought in line (2px text/primary focus border, Search box instances, no "Popular" eyebrow). IDs in figma-blocks-ledger.json `phase4SearchAnd404_9Oct`
- [x] After review (Ross, 9 Oct 2026): search fields show focus as a 2px text/primary border, not the green ring (a field takes focus on a click, so the ring read as a keyboard highlight); site sweep: Fleet register groups and Lifecycle rows now light on `:has(:focus-visible)`, not `:focus-within`; the Search panel drops its "Popular" eyebrow

**Answer:** Seabed scan (Recommended).

### Q157. Privacy & Cookie Policy page (9 Oct 2026)
Context: Ross: "Make Privacy & Cookie Policy page". Built from the live https://reachsubsea.no/privacy-policy/ (last modified 29 March 2023) in its own wording. Layout recorded in docs/05 §3.
- [x] URL `/privacy-policy/`, the live one (as the Transparency Act keeps its live URL); the footer's and menu's legal link point there (was `/privacy-cookie-policy/`, which never existed). Title "Privacy & Cookie Policy", as the legal links name it
- [x] Navy Text hero as the Transparency Act (Q57), eyebrow "Updated March 2023" (in WordPress, the page's modified date); the policy's two opening paragraphs became the lead
- [x] ~~The seven sections heading beside text on the 12-column grid~~ → headings above their text (Ross: "this layout feels hard to read, keep headings above body"; Claude agreed: the eye crossed a 400 px gap for every section). The policy now uses the article style as a news story (Heading/H4, text at the 720 measure), the column on the container's left edge under the hero title rather than centred, so plain Heading + Paragraph blocks in WordPress
- [x] Light English fixes only ("counts for" → "applies to", "is stored" → "are stored", -ise spellings, "NOTE:" → "Note:"); "opt out of Google Analytics" links to Google's opt-out page; the live "Contact us" section is the CTA panel
- [ ] For Reach: the policy no longer matches the site in places. (1) It describes contact forms; the new site has none (Q39). (2) It describes Facebook Pixels; the live HTML loads Google Analytics 4 through Tag Manager and no pixel is in the page (Tag Manager could still add one). (3) It doesn't mention the videos (YouTube no-cookie, Vimeo), maps, share data (ir.oms.no) and social feed, which load only when a visitor chooses to. (4) "The grounds we use" names no lawful basis under GDPR. (5) A cookie banner, if Reach wants one, should be keyboard-operable with no dark patterns (docs/09). Reach to send updated wording; the page takes it as is

**Answer:** as ticked.

### Q148. Newsroom: breadcrumb ends at the category; a light archive header like dev (8 Oct 2026)
Context: Ross asked whether stories with long titles should have a trimmed breadcrumb. Claude: no, drop the title instead, since the H1 sits right under it and a title cut with "…" looks broken. Ross agreed, and asked for a lighter, smaller archive hero, a bit like the dev site.
- [x] Story breadcrumb: Home › Newsroom › News (or Reports), every item a link to its archive; phones show "‹ News". Breadcrumb gains `endsWithCurrent` (default true, so every other page is unchanged)
- [x] The category eyebrow on stories goes: the breadcrumb now names the category, so it said "News" twice
- [x] Archive header: no Page hero. Solid site header, then on white "Reach Newsroom" (H1 at H2 size) and the dev intro, with the chips straight under; no breadcrumb (depth 2). The lead story starts at 436px on desktop, and title and chips sit in the same place on every archive page. Section landing pages elsewhere keep the one hero height (7 Oct 2026)

**Answer:** as ticked.

### Q156. News bodies: minor polish from the critique (9 Oct 2026)
Context: the last items from the Q154 critique. Ross: "do the minor polish next". `scripts/news-cleanup.mjs` step 10 (idempotent), CSS in base.css, titles in `scripts/import-news.mjs`.
- [x] Captions and tables stop at the 720 text measure (a caption ran ~126 characters under an 880 photo; both tables have two columns). Photos and embeds keep 880
- [x] The featured photo repeated in the body goes (6 posts); the two copies with a caption stay
- [x] Quote marks: entities (&#8220;) become the characters; marks typed the wrong way or padded with spaces ("the “ Company “", "says: ” We", «…”) are set right (7); 17 one-off corrections in 11 posts, each a find/replace in the script's `CORRECTIONS` table (missing opening or closing marks, a quote's second paragraph not reopened, a vessel name in double marks inside a quote → single). A check over every post finds no unbalanced quote left
- [x] Old posts typed line by line: paragraphs broken mid-sentence are joined (38: next starts in lower case, or the first stops on "the", "are", "NOK"…), line breaks mid-sentence joined (18); bullets typed as "– " or "• " paragraphs become lists (7), "o" sub-items nest under theirs (OCTIO in short); four "– END –" markers typed as entities go
- [x] Titles: a dash keeps to the word before it (no-break space), so "Reach Subsea ASA –2Q 2026" no longer starts the H1's second line with "–2Q" (30 titles; the missing space added)
- [x] Sub-bullets in a story take an open circle
- [x] Not changed: the Deep Cygnus story opens without a lead because it is three paragraphs (leads start at four, Q147)

**Answer:** as ticked.

### Q155. News bodies: boilerplate labels, results-release links, long leads (9 Oct 2026)
Context: the second critique (Q154) found the press boilerplate's labels typed four ways, and results releases with a 60–115 word lead, the same report linked twice, raw webcast addresses and an empty link. Ross: "do the boilerplate and results release clean-ups next". Done in `scripts/news-cleanup.mjs` steps 7–9 (run by the import and on its own; idempotent), 114 of 189 posts changed.
- [x] Boilerplate labels: every one is a bold line of its own, no colon (128), so every release ends the same way. A line that carries its content after the colon ("please contact: <name>") or the first line of a hand-wrapped sentence stays as written
- [x] Webcast: "Webcast link: <address>" → a "Watch the webcast" link row (18)
- [x] Downloads typed as paragraph lines or loose links → a file row, the "Download report and presentation here:" label dropped (26); a file already listed earlier in the post isn't listed again (18; one of them was labelled "Q3 2024 Report" on the Q4 release)
- [x] Addresses typed as text or linked as themselves → short links: "reachsubsea.no", "newsweb.no", "hydro.gov.au/NHP" (84); empty links removed (4)
- [x] Bold-only labels in the story ("Quarterly presentation", "CEO Letter") → headings (19); a heading repeated straight after itself goes
- [x] Leads over 45 words keep their opening sentence (41: "Haugesund, 18 August 2026 – Reach Subsea ASA today announced its second-quarter and half-year 2026 results."), the figures follow as body text; 8 with no sentence end between 10 and 45 words lose the lead style. Not cut inside a quotation, a link or after an abbreviation
- [x] Fix found on the way: Q154's 8px between list items also spread the Links in a file row apart; link rows are excluded
- [ ] Later: caption and table measure, duplicate featured/inline photos, unbalanced quotes (Q154 minor list)

**Answer:** as ticked.

### Q154. News single: second critique, breadcrumb fix, rhythm tweaks (9 Oct 2026)
Context: Ross asked for the critique to be run again after Q153. It scored 24/36 (heuristic 9 n/a; first run 28/40). The drop was mostly a P0 that Q153 introduced: `spacing="sm"` on the story section let `.block.has-spacing-sm` take away the header clearance, so the breadcrumb sat under the fixed header. Also flagged: quotes and list items broke the text into islands, and More news at H2 matched the story's own title. Ross chose the rhythm tweaks; boilerplate and results-release clean-ups and the minor polish wait.
- [x] Breadcrumb clears the header again; the story's bottom padding (section/sm) is set on `.news-article`, not with `spacing="sm"`
- [x] The lead keeps its stack--lg gap above a download row (a links row's own margin had overridden it)
- [x] Quotes step out stack--md, as lists (not stack--lg); list items 8 apart
- [x] More news on the story page at H3 (32 / 24), below the story title's H2 size
- [x] Measure note corrected: 720 is ~80 characters at Body 18, not ~72
- [ ] Later: boilerplate label lines split; results releases (lead only up to 45 words, duplicate links, bare webcast addresses as links); caption and table measure, duplicate featured/inline photos, unbalanced quotes

**Answer:** as ticked.

### Q153. News single: spacing and measure after a taste + impeccable review (8 Oct 2026)
Context: Ross asked for a taste and impeccable run over the stories, "maybe the spacing could look better". The critique (28/40, `.impeccable/critique/`) found: lines of 85–97 characters at 1440; photos, quotes and lists only 8px further out than paragraphs (and the same 16 on phones); quotes styled exactly like the lead; imported leftovers (-ENDS-, press boilerplate as body text, labels typed as paragraphs, email hard wraps) breaking the rhythm; 192px from the story's end to More news. Ross: all five fixes, text 720 with photos at 880, no results-release layout for now.
- [x] Measure: running text stops at 720 (`--wp--custom--measure--prose`, Figma `container/prose`, ~72 characters); photos, tables and embeds keep 880, one left edge
- [x] Rhythm: paragraphs stack--sm · lists stack--md · lead, photos, quotes, tables, embeds stack--lg · a heading opens at stack--xl, 8 to its text. Breadcrumb to title stack--md (it floated). Story end: section padding sm, no margin on the last block
- [x] Quotes in Body, medium, navy, with the green rule; the lead keeps Lead size to itself
- [x] Import clean-up (`scripts/news-cleanup.mjs`, run by the import and on its own): "-ENDS-" markers go (30); email hard wraps joined (427) and paragraphs run together with line breaks split (95); labels typed as paragraphs become headings (30: "2Q 2026 highlights", "Quarterly presentation"); whole sentences typed as headings become paragraphs (10); the press boilerplate closes a release small and grey (84 posts); a "please contact:" left with nothing under it goes
- [x] Long links (webcast addresses) wrap on phones
- [x] Figma: `container/prose` variable, Article quote and lead at 720, new Article boilerplate component, Article header gap, News single frames in the new rhythm
- [ ] Later: a results-release layout (key figures, report as a button) with the Investors pages

**Answer:** as ticked.

### Q152. News single: no bold in the lead paragraph (8 Oct 2026)
Context: nine live posts set their opening paragraph in bold: five bold the whole paragraph (the Pareto conference story among them), four bold only the dateline ("Haugesund, 9 May 2023:"). Set larger and navy as the lead (Q147), the bold made it heavier than every other story. Ross: "yes, strip the bold from lead paragraphs".
- [x] The import drops `<strong>` inside the lead paragraph (both kinds), so every lead reads the same. Bold elsewhere in a post stays
- [x] WordPress: the same step in the migration (docs/09 §News, step 7)

**Answer:** as ticked.

### Q151. Story photos: the Reach grade, and the Press enquiries button (8 Oct 2026)
Context: Ross: "the colour grading has gone on the news and project post, is there a reason, I wanted to try and cheat a little so that all the images have a certain Reach feel". There was no reason. The photo tint (19 Sep 2026: every photo screen-blended over navy-900) is a list of wrappers in base.css, and the new single templates' figures weren't on it. He also found the panel's button label "Email media@reachsubsea.com" wrapping to two lines on phones.
- [x] News single: the featured image and every photo in the body (JPEG and PNG) take the tint. A figure can hold a caption, so the tint is a grid-stacked layer under the photo, not the figure's background. SVGs keep their colours. WordPress: the same rule on core/image inside a post
- [x] Checked the eight PNGs in post bodies for transparency: all photos or screenshots. The one semi-transparent PNG (Aqoryx, a photo) read washed out on white and now reads like the rest
- [x] Project single (`.project-single__image`): the same treatment, done in its template (8 Oct 2026). Every project photo now fills the main column (Q150), so the tint layer is the photo's own cell; project cards were already tinted through Card
- [x] Press enquiries button: "Email the media team" (mailto unchanged), one line at every width
- [x] More news cards on a story: the summary stops at three lines, as in the archive (the 240-character excerpts ran a card to nine lines)

**Answer:** as ticked.

### Q150. Projects: U-864, every project migrated, and an archive led by a map (8 Oct 2026)
Context: Ross: do U864 next, make the projects parent page, and think about whether it should feel different to the Newsroom. He also noted the reports' panels have a faint green tint.
- [x] Panels: the report's panel tint is #f0f7f3, which is sage-50 (`bg/accent-subtle`, an existing token). Key facts and spotlight panels now use it; the page stays white
- [x] All nine report projects have pages (4Q 2025 Ormen Lange and Scarborough, 2Q 2025 U-864 survey, the six 2Q 2026 cards), and so do the 22 dev projects: their bodies were rewritten into lead and story by an agent (`src/data/project-stories.json`; no brand names, quotes or press boilerplate). 31 pages, each at its live URL where it has one, so most need no redirect. Not migrated: `fleet-update-2` (a 2021 charter press release) and `500-imr-days` (a milestone story); redirect them to the Newsroom
- [x] Single additions: a **Location** dot map (eases in to the place; region centroids are marked in the data); the photo's caption; every photo fills the main column, enlarged where the source is small (Ross: "just make them all big photos", originals to follow, list below), and a photo taller than 3:2 is cropped to 3:2 at its focal point; two vessels share one Vessels row; related projects rank same place first (the U-864 survey ↔ recovery); breadcrumb ends on Projects (as News, Q148)
- [x] Archive (`/projects/`), unlike the Newsroom: news is about when, projects about where and what. Title and intro beside the brand dot map, one pin per place (Ormen Lange's three projects share one), clusters with counts; a pin opens its place's projects on the map; chips (All, Subsea, Survey, Monitoring) head the list and filter the map and the cards together (`?service=`, the menu's links); cards carry work · year and place, not a date and excerpt; 12 then "Show more projects"
- [x] Fixed: two Services overview cards and the Projects menu feature linked to slugs that never existed. Services fixed; the menu feature (`navigation.ts`, "Cable route survey, southern North Sea") still needs pointing at `/projects/geophysical-and-uxo-power-cable-route-survey/`, left for the chat editing that file
- [x] Layout follow-ups (Ross, 8 Oct 2026): the **Location** map moved to the side column under Key facts, zoomed out one step past the world view so the place reads globally; on tablets it sits beside the facts, as tall as them. **Key facts are stacked**, as the reports (Ross: "this kind of layout works better"): each label (Label, `text/accent`) over its value (Body), so long values ("Norwegian Coastal Administration") no longer wrap in a 50/50 row. It is the new `stacked` option of the shared Spec row; the report's paler sage label fails contrast on the panel, so the label uses `text/accent` (5.6:1). Ross then found the report's rule under every label and the full-weight link underline fussy: no rules (space groups each pair; compared live against hairlines between pairs and a two-up Period/Depth row), labels medium not bold, linked values take the Meta item underline (`border/default`, firms up on hover)
- [x] Taste/impeccable pass on the stories (spacing): both sage panels share one padding (`stack/lg` all round; the facts panel was tighter top and bottom than the spotlight); on phones the story now follows the key facts and the map comes after it, so the reading starts a screen sooner. Checked and kept: story measure ~73 characters at 1440 (within 65–75), the same Prose as the News single; head → photo → story on one `stack/lg` rhythm; detector clean, axe 0
- [x] **Location map → Locator map** (Ross asked whether a simple stylised Google Map would be better; Claude: real geography yes, Google no: its cookies need a consent placeholder, a styled map needs an API key and billing, and it looks like Google. Ross: build the solid-land version). New component `src/components/LocatorMap.astro`: Natural Earth 1:110m land as solid sage-200 on the sage-50 tile, Web Mercator, 150° of longitude centred on the place, one navy pin in the middle; drawn at build time as one SVG path (~16 KB), no script, no cookies. The dot map stays for maps you explore (archive, Live operations, offices)
- [x] Panels and map water to the navy tint (Ross: "the key facts box should be the navy tint and the water in the map box"; supersedes the sage panels above): Key facts, the spotlight and the Locator map's sea use `bg/tint`, the site's panel colour; sage stays the accent (labels, land, the pin's ring). The spotlight moved too, so the side column has one panel colour
- [x] Side-by-side card trios (768–1199, Related projects and the service pages' projects): one height for the three, set by the text; the photo covers its 40% (Ross: the portrait Njord A photo stretched its card to twice the others). Shared Card fix, checked on project singles and Survey at 780, 1000 and 1190
- [x] Archive top as the home page's Live operations (Ross, 9 Oct 2026: "the project map under the heading and on the left, then the most recent project card on the right"): title and lead across the top (cols 1–7), the map (cols 1–8) beside the latest project (cols 9–12) at the map's height. The latest is a photo card (Card `image-bg`, badge "Latest") so it reads as the lead, not one more grid card; it follows the chip (the newest Survey project under Survey) and leaves the grid while shown, so a chip's count is the card plus the grid. All the chips' cards share one cell (the others hidden, not removed), so a chip never moves the chips under it. Below 1200 it is a wide band under the map (bento short-card scrim, text from the top), on phones the card's photo-over-panel form. The current latest, U-864, has a 537 px ROV video still with burned-in telemetry: fine at 416 wide, soft as the 600–1199 band; it is on the original-photos list below. Then the chips moved up under the intro (Ross: "the pill should be under the intro text"; Claude agreed: they filter the map, the latest card and the list, so they head all three, as the Live operations filters sit over the home map): stack/lg after the lead, stack/md to the map; picking a chip moves nothing above the grid. Then (Ross: "more padding under the pills", "the first card should be like the others"; Claude agreed): stack/lg under the chips too, and the latest is the grid's Project card unchanged (3:2 photo, "Latest" badge). Pinned to the map's height its photo shrank to a 31–87 px strip at 1200–1320, and the map must stay 2:1 for its framing, so the card keeps its own height and the boxless map sits centred beside it ("All places" stays at the map's corner). Below 1200 the latest is just first in the grid (a full-width grid card would carry a 600-tall photo). Then (Ross): the shared zoom pill (− +) at the end of the chips row, as the home page; the row spans the map's columns, so the zoom ends at the map's edge and the latest card's top is level with the chips; space/32 under the row on both pages (was stack/lg here, space/24 on the home map); cluster pins show their count only (Ross asked whether "15 projects" needs writing out; Claude: no, the pin's number says it and the words crowded the map; the words stay in the announcements, single places keep their names). "All places" dropped (Ross): the zoom pill's − gets back to the full view. Taste + impeccable critique (9 Oct 2026, 20/32; Ross chose map clarity, the richer popup, top 3): zoom stops at 5 (at 6 a phone showed only sea; the North Sea keeps its coasts and every place its own pin); a chip also brings the map back to the world view (the one-step way out, instead of a new button); a quiet line under the map says how many projects have no single site and are in the list only (8 of 31, follows the chip, keeps its space at 0; the map's text alternative says it too); a pin's panel lists its projects with a 64 px photo (the photo tint) beside each title (Ross: title only, no year or work type; no "N projects" eyebrow either, as the marker and the rows already count them; the × centres on the place name), so a pin answers "what was done here" without the grid below the fold; on phones the panel docks inside the map and scrolls (the map and its panels in their own box), and the phone map is truly edge to edge (was 8 px in); "Show more" now announces how many it added. Cards left as they are (Ross): only ~12 of 31 projects name a client; the popup carries the at-a-glance detail
- [ ] For Reach: the report spells "Pyreenes" (the FPSO is Pyrenees Venture); U864 v U-864 (we use U-864); several dev photos are not of the work (decommissioning shows the vessel at quay, the fibre optic photo carries a Global Maritime logo, the Black Sea MAP photo may not be from that cruise); the 2Q 2026 card photos are ~540px
- [ ] For Reach: **original photos** (at least 1240 wide, landscape) for the projects whose photo is enlarged on its page. Ross will collect them. Most needed (under 800 wide, or portrait):
  - Environmental recovery at the U-864 wreck site (537 px, from the 2Q 2026 report)
  - End-to-end subsea recovery on a 36-inch pipeline (541 px, 2Q 2026 report)
  - Cold commissioning support at Scarborough (537 px, 2Q 2026 report)
  - Post-cyclone FPSO inspection (537 px, 2Q 2026 report; the same shot as Scarborough gWatch, so a different one is better)
  - Annual pipeline inspection at Ormen Lange (631 px, dev)
  - Thruster changeout on the Balder FPSO (750 × 1334 portrait, dev)
  - Laying a 39 km fibre optic cable to Njord A (786 × 1051 portrait with a Global Maritime logo, dev)
  - Then, under 1240: Site survey campaign in the Norwegian sector (800), Light construction and survey for Equinor (923), DIGIMON (1024, a rendering), Installing a tidal turbine off Ushant (1090), U-864 wreck survey 3D model (1101, report), Scarborough gWatch (1102, report), Cable-route survey to Seagreen (1140), Riser removal from an FPSO (1231, but it shows the vessel at quay, not the work)

**Answer:** as ticked; Reach items open.

### Q149. Project single: the quarterly reports' featured projects (8 Oct 2026)
Context: the client wants project pages like the "featured projects" in last year's quarterly reports (heading, intro, body, images, stats, key facts). Claude found nine across the reports: full pages in 4Q 2025 (p20 Ormen Lange, p21 Scarborough) and 2Q 2025 (p19 U864 wreck survey), three-up cards in 2Q 2026 (p12 crewed, p23 Reach Remote). All share one structure, so it is a template, not a layout per project. Ross: yes, start with Ormen Lange.
- [x] Template: light article header (as the News single, Q146: project photos are rarely calm enough for the Photo hero) · the report's spread: photo with Key facts beside it (Vessel linked to its asset, Client, Location, Period, Water depth, Service), story with the Operational spotlight beside it · Stats band Feature (tint) · Feed Projects, 3 related (same work type first, then the service line) · CTA Panel. Under 1200 one centred 880 column; the facts run two across from 600
- [x] Data: Project fields, not page copy (`src/data/projects.ts`): `client`, `period`, `waterDepth`, `lead`, `story`, `stats`, `spotlight`. Every field is optional and renders nothing when empty, so a 2Q 2026 card with no figures still makes a whole page
- [x] Spotlight is written once per technology (the gWatch paragraph is the same on both 4Q 2025 pages) and linked from each project: a relationship in WP
- [x] Lead in navy, not the report's green (Q147). Labels in sentence case, not the report's capitals
- [x] Ormen Lange (4Q 2025) is a new project, not the 2023 Ormen Lange gravimetry project on dev; it now leads the Monitoring and Assets project feeds as the newest
- [ ] For Reach: "Rech Remote project #1/#2" typo in the 4Q 2025 report; what "100% remote vessel utilized" means (kept as "Remote vessel utilised" for now)

**Answer:** as ticked; Reach items open. Next: test the template on U864 (map, no figures) and one 2Q 2026 card.

### Q147. News single: a lead paragraph in navy (8 Oct 2026)
Context: Ross asked whether long stories could open with larger green intro text. Claude: larger yes, green no. Green is the label colour (the category eyebrow sits right above the title, and accent-display is for big figures), a paragraph of it reads as a callout, and it drops contrast to about 5.8:1 against roughly 11:1 for navy.
- [x] Navy at Lead size (20) against the grey body (Ross: "go with navy")
- [x] Rule: stories of 4+ paragraphs whose opening paragraph is a full sentence of 15+ words. A bare dateline before it ("Haugesund, 6 February 2023:") stays above in body grey. Old posts that open with a title repeat, a heading typed as a paragraph or a broken sentence get no lead. 113 of 189 stories have one
- [x] WordPress: a "Lead" block style on core/paragraph (`is-style-lead`), set by the import on that first paragraph; editors can set it on new posts

**Answer:** as ticked.

### Q146. Newsroom: real dates from Newsweb, a light article header (8 Oct 2026)
Context: Ross asked to match the 99 undated posts (Q145) against Newsweb, and suggested the story template's hero be light and not so tall. Claude agreed: the navy Text hero on 189 articles was heavy, put the story below the fold, and its text ran the container width while the body sits in the 880 column.
- [x] Dates: Reach's whole Oslo Børs Newsweb archive (1,042 releases from 2008, public API) matched to the 109 bulk-imported posts by body text (4-word shingles, Dice) plus title, checked by hand. **83 dated from their release** (73 of the 99, plus the 10 dateline dates, 9 confirmed). Newsweb corrects one: the 4Q 2021 report's dateline says 8 Feb 2021, the release is **8 Feb 2022**
- [x] **15 estimated** (web stories, never releases): a date in the text ("contract signed 4 May 2017", "ONS 2012") or the month the post's own images were uploaded; shown as a month ("Aug 2016"). Each has its evidence in `scripts/news-dates.json`
- [x] **11 undated** (three "We're hiring", Teamday!, Business Development Manager, early Surveyor Interceptor and Supporter test notes, NB 825, Establishment of Reach Subsea AS): shown as "Undated", kept last
- [x] Single: a light article header instead of the Page hero. Solid header, then in the 880 column: breadcrumb, category eyebrow, title (H1 at H2 size), date and read time, then the image and the text, one left edge. The image starts at 500px on desktop; on a phone the story starts within the first screen. Section landing pages keep the one hero height (7 Oct 2026); the Newsroom archive keeps its navy hero
- [ ] For Reach: the 11 undated posts. Recommend not migrating them (hiring calls and team notes from 2012–2020), or Reach supplies dates
- [ ] For Reach: confirm the 15 estimates if exact dates matter

**Answer:** as ticked; Reach items open.

### Q145. Newsroom: dev site layout, all live posts, built for migration (8 Oct 2026)
Context: Ross: set up the Newsroom like the dev site, not the client PDF; all posts on the live site will be pulled into WordPress, so plan the build that way. Dev `/news/`: All · Reports (18) · News (160) chips, a full-width lead, cards in rows of 4 · 2 · 4, 11 a page, FacetWP pager. Live REST API: 189 standard posts, core categories News (174) and Reports (19), 4 in both; no tags, no custom fields; 184 with a featured image, none with alt text.
- [x] Layout: the dev rhythm (lead story with its image beside the text, then 4 · 2 · 4), rebuilt with our Card and tokens
- [x] Paging: numbered pages (`/newsroom/page/2/`, `paginate_links()`), new **Pagination** component; the lead (newest post) on page 1 only, then 10 a page
- [x] Data: all 189 live posts via `scripts/import-news.mjs` → `src/data/news-posts.json`; every single is built from the post's real body, so the article styles are tested on the content being migrated
- [x] URLs: `/newsroom/<slug>/` and `/newsroom/category/<slug>/`, with a generated redirect map from the live root URLs (`docs/extract/news-redirects.csv`, 192 rows)
- [x] Chips are links to the category archives (FilterChip gains `href`, selected = `aria-current`), with counts; the hero is the same on every archive page so the chips never move
- [x] Breakpoints (from the docs/08 sweep): four across from 1400, not the Feed grid's 1320 (titles ran to six lines at 278px); H5 titles in the four-across cards, H4 for the wide pair, H3 for the lead; two across at 768–1399, where the wide pair becomes full-row cards with the image beside the text; one column below 768. The date row keeps a Report badge's height so titles line up; read time is on the single only
- [x] Single: Text hero on navy (breadcrumb, category, date, read time) · featured image and the body in the 880 column (new `.article` styles: subheading, quote with cite, image + caption, embed, table, separator, gallery; file and button rows render as Link) · More news / More reports (3 from the same category) on tint · CTA panel "Press enquiries" (media@reachsubsea.com)
- [x] Site menu: the Newsroom feature card and the three news links are now the latest real posts
- [x] ~~For migration: 99 posts still need their real date~~ Done in Q146 (83 from Newsweb, 15 estimated, 11 undated)
- [ ] **For migration:** 56 of the 112 body images are already broken on the live site (404, and the old imgix CDN answers 410), in 28 posts; 14 more were recovered from the original upload. The import drops the dead ones. Restore from a backup if Reach has one
- [ ] For Reach: alt text for the featured images (none have any; cards treat them as decorative)

**Answer:** as ticked; migration items open.

### Q144. Sponsorship and Transparency Act pages (8 Oct 2026)
Context: Ross asked to add the dev site's Transparency Act and Sponsorship pages. Both were already planned (Q115: the Transparency Act stays the legal page `/transparency-act/`; Q117: Sponsorship a child page of Sustainability with a teaser on the hub) but not built.
- [x] `/company/sustainability/sponsorship/`: Text hero on navy · Company subnav · Split media Image ("More than support" beside the stacked-hands photo) · three white cards on tint (What we sponsor · What we look for · What we don't fund, each title the list's lead-in; the non-political, non-religious line as the header intro) · Numbered list split ("Reviewed twice a year", due 1 April and 1 November, the portal link, four steps: apply, committee review, decision, reporting) · CTA panel with the committee's email. Dev's "next due date is 01 April 2026" dropped (already past)
- [x] `/transparency-act/`: from the live page, not dev. Live has the June 2026 statement (dev still shows June 2025): the CEO owns the procedure, and an early-2026 audit came back satisfactory. Text hero on navy (eyebrow "Statement, June 2026") · Split media Beside (the three intro paragraphs) · three white cards on tint (Human rights · Working conditions · Public access), the procedure, owner and audit as the header intro, statement PDF at its far end · CTA panel with the HSEQ contact (as live). The HSEQ hub card now reads "Statement, June 2026" and its data points at the 2026 PDF
- [x] Sustainability hub: a Sponsorship teaser under the goals; the FAQ and the CTA panel move to white so the grounds alternate. First a text-only Split media Beside; Ross: "a bit more interesting", so now Split media Image on tint, the stacked-hands photo first (Position Start), eyebrow Sponsorship, "More than support", the teaser line and "Our sponsorship policy"
- [x] Card: a scope list only drops to the card's foot when the card has a summary above it. With no summary it follows the title, so lists of different lengths start on the same line (campaign cards unchanged)
- [x] HSEQ Policies (Ross asked if Q121 applied): the Code of Conduct 2025 was still a header action beside the policy list. Same as Governance & meetings now: the first file in the list, no action; 12 files fill 4 × 3 (2 columns at 600–1199, 1 on phones)
- [ ] For Reach: the sponsorship portal's address (dev mentions it but has no link; `#` for now)
- [ ] For Reach: the live statement calls the Act "also known as the Transparency in Supply Chains Act" and frames it around trafficking and modern slavery. Norway's Transparency Act (Åpenhetsloven) covers fundamental human rights and decent working conditions, and the Transparency in Supply Chains Act is a Californian law. Kept as published until Reach or their counsel confirm
- [x] Sponsorship photo (Ross offered `assets/Sponsorship.jpg`, stacked hands from above, as the hero): Claude advised against it as a hero (busy, subject filling the centre, no calm area for the title; child pages use the navy Text hero). Ross: in the intro block instead. Split media Image beside "More than support" (`public/images/sponsorship.jpg`, 1600 wide)

- [x] Figma (Ross: update Figma for both pages): page frames Sponsorship 523:13260 and Transparency Act 528:13561; Sustainability Desktop/Mobile gain the teaser (532:14196, 532:24697), FAQ and CTA on white. New: List item 519:2513 and Card's Show scope list; Split media Media=Beside variant (520:11966 / 520:11979). Ledger key phase4SponsorshipTransparency8Oct. HSEQ frame left to the site-sweep chat

**Answer:** as ticked; open items pending.

### Q143. Full-site sweep: image trios, the accent badge on navy, Figma scope (8 Oct 2026)
Context: Ross asked for a sweep of the whole site once the page chats had finished: everything committed and pushed, every page checked (docs/08), and Figma brought up to date with repeated items as components and variants. The sweep ran the docs/08 card sweep on all 28 pages at 16 widths (375–1440), axe-core on every page, the token audit and an internal link check on the production build.
- [x] Three image cards in a row (Ross: one column, image beside text): at 900–1199 three across left 190–250px of text (3D World's How it works to eight lines, Survey's project titles to five). Card grid (3 columns, Image top, exactly three) and Feed grid (3 columns, no filters, exactly three image cards: Subsea, Survey, Monitoring projects) are one column of side-by-side cards at 768–1199, the image 40% beside the text; three across from 1200. Shared in Card (`.cards-beside`)
- [x] Accent badge on navy (Ross: lighter text on navy): sage-300 on navy-700 was 4.42:1 (Home, Investors). New token `text/on-accent-subtle` (sage-600 light, sage-200 Navy, about 6:1), used by Badge Accent only; other accent text on navy unchanged. Figma (8 Oct 2026): variable `text/on-accent-subtle` VariableID:480:22 (Color, aliased sage/600 · sage/200, TEXT_FILL); Badge 87:249 Tone=Accent label and icon rebound to it
- [x] Life-Saving Rules: the rule titles were h3 straight under the h1 (no Section header). Checklist grid item titles are h2 when the block has no Section header, H4 look unchanged
- [x] 15 pages declared the Accordion's `topic` twice (four with different values); the duplicate dropped, keeping the value that matches `faqsFor()`. Field contract only, nothing on the page changes
- [x] docs/05 §3: rows added for HSEQ, Life-Saving Rules, Research & Publications, Assets overview, Why work with us and Life at Reach
- [x] Checked: no sideways scroll on any page at any width; axe 0 violations once reveals are forced visible (the only hits were the badge above); token audit clean apart from the noted exceptions (Values' min(), Date tile's 22px, header-height and hero art-direction offsets); internal links all resolve apart from template pages outside the prototype (projects, asset singles, newsroom, legal, Reach Pilot/Horizon/Relay)
- [x] Reports & presentations showed Q4 2026 (16 Feb 2027) as provisional with no Add to calendar while the Financial calendar offered it: reports.ts kept its own confirmed list (only the next date). It now reads `confirmed` from `investor-calendar.ts`, so Q4 2026 gets Add to calendar on both pages; the Data list demo's stale 11 Feb fixed
- [x] Links still pointing at the asset single pages Q78 dropped now go to the Assets page anchors: Home's ROV card (`/assets/#rovs`), Services overview's Our vessels (`/assets/#vessels`), Subsea's bento vessel and ROV cards ("Our vessels" · "Our ROVs", were "View vessel" Havila Subsea / "View ROV" Supporter WROV)
- [x] HTML validator (html-validate, all 31 pages, after the Figma batches): two real errors fixed. Research & Publications' Data list carried two `id`s (its own and the block anchor `library`); it now takes its own only without an anchor. The site menu's Reach Newsroom and Events columns were labelled `<section>`s, so on Home two region landmarks were both named "Reach Newsroom" (with the news Feed grid); they are plain groups now. Left on purpose: `scrolling="no"` on the Split embed iframe; recommended-preset style rules noted in docs/08 §6
- [x] Final round (9 Oct 2026, after the Projects and Newsroom chats): html-validate on all 291 built pages. Pagination's disabled Previous / Next kept `rel` without an `href` (6 Newsroom archive pages): `rel` now only on a live link. 12 imported news posts carried broken markup from the live site (unclosed tags, a boilerplate block opened inside a table cell, `<em>` around whole paragraphs, links in links, a date typed as a link): scripts/news-cleanup.mjs gains step 6 (bare emails get `mailto:`, other non-URL links unwrap, paragraph-wrapping inline tags unwrap, a boilerplate or file row not at the top level unwraps, unbalanced bodies re-serialised by parse5, new dev dependency); idempotent, the other posts unchanged. Only the Split embed's `scrolling` remains. Figma: Components / Card had grown over Nav item; the frames under it moved down
- [ ] Known, left: Home's three service cards are three across from 900 (Q79), so at 900–950 their descriptions run to four lines at 191px
- [x] Figma scope (Ross): a desktop page frame for every built page, built from block instances; every new block with Desktop and Mobile variants; no separate mobile page frames
- [x] Figma final audit (8 Oct 2026, ledger `sweep8OctFinalAudit`): Subsea services 359:4009 bento links read Our vessels / Our ROVs; loose layers on Components and Blocks moved into their doc frames' Group/Parts (22 part components) or deleted (5 leftovers); new parts Filter facet 617:34277 and Footer column 621:2544, Region status Show type 2/3; Footer 125:3011 brought to Footer.astro (tagline, column order and links, legal hairline); CTA Panel lead to Body/Lead; size/eyebrow Desktop 14 → 13. Overlaps none, repeated-structure scan empty, every page-frame section an instance; 30 of 31 coded pages have a desktop frame (not /3d-world/explore/: header + iframe, no blocks)

**Answer:** one column of side-by-side image cards at 768–1199; a badge-only lighter accent on navy; desktop frames plus block mobile variants.

### Q142. Filter chips: a word space before the count (8 Oct 2026)
Context: Ross, on the Research & publications chips: "don't think we need these big gaps on the pills, just a space is good".
- [x] Filter chip: the count sits a word space (4) after its label instead of the 8 gap, so "2025–26 (7)" reads as one phrase. The tick keeps its 8 (now a margin on the tick), so selecting still doesn't move anything (Q92). Applies wherever chips are used (Data list, Feed grid, FAQ, Live operations)
- [x] Follow-up (Ross: "weird spacing"): the count's two-digit slot was centred (the button centres its text), so a one-digit count had spare room both sides and the gap still looked wide. Now start-aligned: the label and count sit together and the spare room (about one digit) falls at the pill's end
- [x] Checked at 788 and 375: chips the same position and width before and after selecting, no sideways scroll; at 1440 the side-panel checklist rows are unchanged (tick to label 8, counts in a right-aligned column)
- [x] Then (Ross: "fix the chip so it hugs the content"): no fixed two-digit slot. The count holds a hidden copy of the count it is built with in the same grid cell; Data list counts are each option's share of that, so they only fall and the chip keeps its width. The single-year chip (from the chart) holds its year's full count, set when picked. Every chip now has 28 both sides (16 when selected); about 6–16 narrower than before
- [x] Checked at 1067 · 1440 · 375: even padding on every chip; topic and year picks that take counts from 14 to 1 move nothing (positions and widths measured before and after); the chart-picked year 2017 stays 111 wide as its count falls from 6 to 1; the 1440 side panel unchanged, counts still in a right-aligned column; Home's Live operations chips (fixed counts) hug; no sideways scroll
- [x] Figma: Filter chip 92:337, Chip variants: label to count space/4, the check in a Check slot so it keeps 8; strokes out of layout, so Default and Selected match (they were 2px apart)

### Q141. FAQ page: one sticky rail with search, beside every group (8 Oct 2026)
Context: Ross: the FAQ page "could make better use of the 1 col". Each of the six Accordion Split blocks held only its group heading on the left, beside 3–16 questions (Services ran 1,870px at 1440), and the six white / tint bands broke one list of 67 questions into six.
- [x] New block **FAQ index** (docs/05 §2.27): a sticky rail (cols 1–3) with Search questions, the count, and the six topics as vertical Subnav item pills with counts and the group in view marked; every group beside it (cols 5–12) on one White ground, Section header over its items. Recommended and chosen
- [ ] Keep the six Split blocks, the left column filled with an intro and count per topic · [ ] Questions in two columns across the full width (opening one would push the column down)
- [x] Search filter (Ross: yes): over question and answer, accents folded; groups with no match hide, topic counts follow (empty topics greyed, on the phone bar too), matches marked, an item matched only in its answer opens; clearing restores the open state. The field never moves (the rail sits clear of the header whether it shows or not; checked keystroke by keystroke at 1440 and 375)
- [x] The duplicate "Clear" link next to the count dropped: the field's ✕ (and Esc) clear it, "Clear search" in the no-match message
- [x] Below 1100: search and count above the groups, topics in the page's Section subnav (new `hideOnDesktop`, so they show once at every width)
- [x] Subnav item gains an optional bracketed count and a disabled look (`aria-disabled`)
- [x] Checked at 1440 · 1100 · 800 · 375: no sideways scroll, rail and list aligned, scroll-spy follows, token audit clean
- [x] Figma (8 Oct 2026, Ross: push the FAQ page): Subnav item gains Layout=Vertical, State=Disabled and Show count / Count (101:448); Block/FAQ index 476:9533 (Desktop 476:9368, Mobile 476:9461) on Blocks / FAQ index 476:9363; page frame Pages / FAQ 478:9665 (all six groups, 67 questions). The page's CTA panel moved to white, the FAQ index's ground (docs/08 §6: on tint it left a tint strip above the panel), in code and Figma
- [x] Figma, components not copies (8 Oct 2026, final audit): the page frame's detached FAQ index replaced by Block/FAQ index instance 616:33670 (Show group 3–6 on); the groups are `FAQ group` 614:14991 instances (Desktop 614:14896, Mobile 614:14990; Show item 4–16) carrying the page's 67 questions

### Q140. The fourth value: "Leave no one behind", and no numbers on the overview (8 Oct 2026)
Context: Ross, on the Careers overview's four value cards (Learn · Teach · Reach · Never leave anyone behind, numbered 01–04): should the fourth go navy as on Our culture? Answered no: in an equal row of four a navy card reads as "selected", against the numbering. Instead the numbers go, and a shorter wording.
- [x] The 01–04 numbers dropped from the four cards (Careers overview, `numbered` off)
- [x] "Leave no one behind" (Ross): the live site's "never leave anyone behind", shortened and verb-led like Learn · Teach · Reach. Changed in careers.ts (overview card), culture.ts (Our culture row) and the Our culture values FAQ ("Alongside them, we leave no one behind.")
- [ ] No one left behind · [ ] Keep Never leave anyone behind
- [ ] **TO CONFIRM with Reach:** the shortened wording of their stated value. Also the dev site's Life at Reach sentence, now "leaving no one behind" (Life at Reach hero lead, Careers overview's Life at Reach card; Ross)
- [x] Checked at 1440 and 375: titles in place (the fourth still wraps to two lines in the 4-column card at 1440), no sideways scroll

### Q139. Careers overview: Who thrives beside its heading; Trainees in two paragraphs (8 Oct 2026)
Context: Ross, on the Careers overview: the Trainees copy "looks bitty, remove bold and tidy to 1 (max 2) para"; then Who thrives "could this be in col2?", with Figma 435:17585 (heading left, one paragraph right).
- [x] Trainees: two plain paragraphs (the commitment; then the offshore and onshore tracks together), no bold lead-ins, the client's wording kept; "rooted in our belief…" left out
- [x] Split media gets a new Layout **Beside**: eyebrow on top, the heading in cols 1–6, one paragraph in cols 7–12 top-aligned with the heading's first line, no media; below 900 the paragraph follows the heading. Who thrives uses it, its two paragraphs joined into one (the live copy, unchanged). Wide stays for Our story and Why work with us
- [x] Checked at 1440 · 1100 · 800 · 375: no sideways scroll; body top level with the heading top (140 / 140 at 1440)
- [x] Figma after approval: Split media Layout=Beside variant (the 435:17585 frame as the reference): Media=Beside Desktop 520:11966, Mobile 520:11979 (built with Q144); Careers overview frame 302:8729 now uses it for Who thrives (590:33025), with the values cards unnumbered and "Leave no one behind" (Q140), the code's four stats, Trainees in two paragraphs with its photo, the five Careers FAQs and the bento photos (sweep 8 Oct 2026, ledger `sweep8OctCareers`)

### Q138. Row cards: padding, and tags on the Our culture values (8 Oct 2026)
Context: Ross, on the Card grid Rows cards (Sustainability, Our culture): more padding; then, on Our culture, the "In practice" line did not need to be bold or its own paragraph, and the cards should carry eyebrows.
- [x] Row cards: 80 all round from 1200 (Ross: first 64, then 80 top and bottom, then the sides to match); 48 at 600–1199 (the copy column is near its narrowest there), 32 × 24 on phones. Copy column at 1440: 659 (was 696)
- [x] Our culture values: the "In practice" example joins the value statement in one paragraph at body weight (the `note` is no longer used there)
- [x] A tag over each value's copy, from the live /careers/ values sentence: New and relevant insight · Sharing knowledge · Having ambitions · Our commitment. Card now shows `leadEyebrow` with a description alone (it needed a `lead` before); in the navy feature row (Q131) the tag sits over the title
- [x] Checked at 1440 · 1200 · 1100 · 375 on Our culture and Sustainability: no sideways scroll; Sustainability unchanged but for the padding
- [x] Every Our culture row in the navy row's mirrored layout (Ross: "the navy card layout works best"): tag, title and copy as one column in cols 1–7, the pictogram on the right in cols 9–12; Learn · Teach · Reach on Tint cards, the last row still Navy. New Card grid option `mirrored` (rows + cards); the layout CSS now keys on `card-grid__item--mirrored`, which the feature row also carries. Below 900 the rows stack (pictogram, tag, title, copy). Checked at 1440 · 1000 · 800 · 375, no sideways scroll. Sustainability unchanged
- [x] Figma: Desktop Row variants at 80 padding; Card Size=Row mirrored in Tint 454:8340 and Navy 454:8354 (copy left, pictogram right), used in the Our culture frame. No mobile mirrored variant yet (the Row mobile variants stack the same way)
- [x] Figma, found while building the frame: Accordion Split's items were fixed at 880 in a 640 list and ran off the frame edge (Careers too); now Fill. Card Default/Featured: the action pins to the foot as in code (`margin-top: auto`), so actions line up across a row of unequal copy; Stat cards unchanged

### Q137. Life at Reach: quotes as a carousel of cards (8 Oct 2026)
Context: Ross, after the split version (Q136): "not working either, lets think more standard, no icon, then eyebrow, head, then carousel of quote cards".
- [x] Statement › Quotes is now a carousel: the Section header (eyebrow, H2) with arrow buttons at its far end, then a rail of quote cards that starts on the container's left edge and runs off the right edge (scroll-snap, the Social feed's mechanics). Cards: Tint on White, 560 wide (82vw on phones), quote in Lead with hung curly quotes, name and role at the foot so they line up along the rail. Arrows page one card and disable at either end (fine pointers; touch swipes; the rail takes keyboard focus). No autoplay
- [x] Follow-up (Ross: more padding, some green in the text): card padding 48 (32 on phones); the curly quote marks in accent-display, bold; the role line in text/accent, as the Profiles grid's roles (5.5:1 on the tint card)
- [x] Three Latin **placeholder** quotes added (Ross), interleaved with the real three so the carousel has six cards; flagged `placeholder: true` in `quotes.ts`. **Replace before launch** with employee quotes from Reach
- [x] Position bars, touch only (Ross): one short bar per card under the rail, the current one green, following the card at the rail's start (the last at the far end). Shown on `(hover: none), (pointer: coarse)`, where the arrows are hidden; not tappable (swipe moves the cards), aria-hidden. In the markup from first paint, so nothing shifts. Checked on an emulated phone (bars track all six cards, arrows hidden) and at 1440 (bars hidden, arrows shown)
- [x] The `needed-quote` pictogram is dropped (no icon), and the block moves from Navy to White (white · tint · white · tint down the page)
- [x] Checked at 1440 · 1100 · 800 · 375: no sideways scroll on the page, names level, next/prev scroll and disable at the ends
- [x] Figma after approval: Statement › Quotes carousel variant: Style=Quotes on Block/Statement 182:2824, Desktop 587:14560, Mobile 587:14629; parts Quote card 587:14556 and Carousel tick 587:14559; used in the Life at Reach frame 589:31472 (six cards, the three Latin placeholders named PLACEHOLDER)

### Q136. Life at Reach: the quotes as a split, one quote leading (8 Oct 2026)
Context: Ross asked to rethink "In their own words" (Statement Quotes, Q130): three equal columns of loose text on navy read as a generic testimonial strip, ended raggedly (one quote two lines longer), and the "Icon needed" box floated above the eyebrow. Two of the three quotes are press lines about Reach Remote and innovation, not working life.
- [x] Header left, quotes right (Ross): pictogram, eyebrow and H2 in cols 1–4; quotes in cols 6–12, as Card grid Rows. The first quote leads at H3 size; the other two follow as a pair, two across once the quotes column is 560 wide (container query: a quote never drops under 260), names on a shared row. Below 900 the header stacks over the quotes; on phones the pair stacks too
- [ ] Lead quote full width, the pair below
- [x] Bjørg Mathisen Døving's "time of my life" leads (the most personal); Bjarte Christiansen and Jostein Alendal follow (Ross). Still TO CONFIRM with Reach: press quotes on Careers, and real crew or trainee quotes to replace them
- [ ] Drop the CEO quote · [ ] Keep the order
- [x] Curly quotes added, the opening one hung outside the text edge (the bold lead otherwise read as a second heading)
- [x] Checked at 1440 · 1100 · 800 · 375: no sideways scroll, names aligned in the pair, reveal works (`.statement__quotes-item` unchanged in motion.ts); axe 0 violations on the section
- [x] Figma: the Statement Quotes style is not in Figma yet: superseded by the Q137 carousel, now in Figma (Style=Quotes 587:14560 / 587:14629); the split version was never drawn

### Q135. Why work with us: the four reasons as a grid (8 Oct 2026)
Context: Ross: the four-reason block (Figures Sticky, the Figma frame `316:6184`) "still feels clunky and not the best UX or UI": make it smoother and more contained. Even as the Q132 pinned pair it took 2,586px of scroll at 1440 to read four short points, one at a time.
- [x] New Figures layout **Grid**: the heading, then the four points as 2 × 2 tiles from 900 (one column below), each in Why invest's card order (title → text → figure and caption) so every figure sits with its point. Tiles are subgrids of three rows, so titles, texts and figures share lines across a row. Tiles on `bg/tint` (navy/900 in the Navy band; White on Tint); figures at Display, sage on navy, counting up once; tiles rise in with the page reveal. No pinning, no scroll-driven state. 1,224px at 1440 (was 2,586)
- [ ] Keep the pinned pair (Q132): Sticky stays in the block for other pages
- [x] Checked at 1440 · 1100 · 920 · 800 · 375: figures level across each row, no sideways scroll, axe 0 violations. Before/after: `review/why-work-reasons-before-after.png`
- [x] Figma after approval: Figures Grid variant (Desktop, Mobile): Layout=Grid on Block/Figures 316:6183, Desktop 584:31096 (Navy), Mobile 584:31145, from Figure card Layout=Tile (584:14497 / 584:14504)

### Q134. Why work with us: offshore and onshore as a comparison (8 Oct 2026)
Context: Ross: the two path cards "look badly laid out". They repeated every label, their rows didn't line up across the two cards, and all the copy was small type.
- [x] New block **Comparison** (`reach/comparison`, outside the 14-block budget): the labels said once in their own column (cols 1–2), the two options in cols 3–7 and 8–12, each heading with an H3 and its lead; the labels column and both options are subgrids of the same rows, so each row is as tall as its longest value and one rule runs across all three. Values in Body, labels in Body/Small medium, secondary. Hairlines only between label · value rows (the site rule). Below 900: one stack per option, each label over its value. DOM reads option by option with its own `<dl>` (the shared labels column is aria-hidden)
- [x] The dev labels that differed become one shared label each: Key assets / Key tech → "Assets and tech", Core roles / Core departments → "Roles and teams"
- [x] Q128's Card grid spec-row rules (one column below 900, label over value under 480) removed: nothing else used them
- [x] Checked at 1440 · 1100 · 920 · 800 · 375: rows aligned across the three columns at 900+, no sideways scroll, axe 0 violations
- [x] Figma after approval: `Block/Comparison` (Desktop, Mobile): set 581:31144 (Desktop 581:31015, Mobile 581:31079), parts Comparison head 581:14436 and Comparison row 581:14447, doc frame 581:14425; docs/05 §2.29

### Q133. Two-column text: a wider gap (8 Oct 2026)
Context: Ross: does the gutter on the 2-col text block feel tight? (Split media Wide: Why work with us, About › Our story, Careers › Who thrives.) It was one gutter (32 at 1440) between two ~90-character columns.
- [x] Yes: the two paragraphs now sit on the 12-column grid, cols 1–5 and 7–11. Gap 144 at 1440 (112 at 1100, 94 at 900), lines ~65–70 characters; stacked below 900 as before. All three pages pick it up (checked 1440 · 1100 · 900 · 800 · 375, no sideways scroll)
- [x] Figma after approval: Split media Wide body columns: Media=Wide Desktop 302:4980 now has the paragraphs on cols 1–5 and 7–11 (528 each), title max 880; Wide Mobile 585:14546 added. About's Our story picks it up

### Q132. Why work with us: each reason comes through as one unit (8 Oct 2026)
Context: Ross, on the Figures block (Sticky): can the transitions be worked through better, so each section comes through together? The figure was pinned on the left while the points scrolled past on the right with 400px gaps, so the figure sat beside empty space or the next point for much of the scroll.
- [x] Pinned pair (Ross): from 900 with JS, a band pins under the subnav (the viewport below header and subnav, 520 at least) with the heading and four quiet step ticks on top; each point's figure (cols 1–5) and title and text (cols 7–12) swap as one unit, the next rising in as the last leaves (clip + rise, no fade). State from the scroll position, as the Values block, so a fling can't skip a point. The list stays as the runway and the accessible copy; below 900 and without JS it reads as the list with figures inline
- [ ] Paired rows, no pinning
- [ ] Keep it, tighten it
- [x] Checked at 1440 (each of the four states, then the release), 1000 and 375: no sideways scroll, no console errors. Figures › Cards (Why invest) unchanged
- [x] Figma after approval: update the Figures Sticky variant notes: Block/Figures 316:6183 description now describes the pinned pair (the variants show one state; the motion is code-only)

### Q131. Our culture: the fourth value set apart (8 Oct 2026)
Context: Ross, on the Our culture values: "Never leave anyone behind" should feel different to the three cards above, maybe in purple and a different layout.
- [x] Card grid Rows gains `featureLast` (row cards only): the last row is a Navy card and mirrored, the title and copy as one column in cols 1–7 and the pictogram on the right in cols 9–12, centred on the text. Below 900 it stacks as the others, on navy. On Our culture only (Ross)
- [x] Checked at 1440 · 1000 · 375: no sideways scroll
- [x] Figma after approval: the feature row as a Card grid Rows variant: covered by Card Size=Row mirrored, Surface=Navy 454:8354 (Q138), swapped into the last row of the Our culture frame's Card grid Rows 454:18090; no separate block variant, as it is an instance swap

### Q130. Life at Reach: a collection of quotes (8 Oct 2026)
Context: Ross: one quote is not enough, make it a collection; he will supply an animated quote pictogram, used once on the block, not per quote.
- [x] Equal row of quotes (Ross): pictogram, Section header ("In their own words" · "What it is like to work here", the PDF's), then three quotes, three across from 900, stacked below. Lead text, name and role on a shared subgrid row so the names line up at every width (measured 950–1440)
- [ ] Featured + row
- [ ] One at a time
- [x] Christiansen, Døving, Alendal (Ross), verbatim from the live news posts (2024); Døving's cut short with "…"; Christiansen's role shortened to "Technical Manager, formerly Offshore Manager"
- [ ] Christiansen and Døving only
- [ ] All four (adds the COO)
- [x] Built as Statement › style **Quotes** (new), fed by `src/data/quotes.ts` (the Quote post type: quote, name, role, source, topics). The quote items reveal on scroll with the others (`motion.ts`)
- [ ] **Needed:** Ross's animated quote pictogram; `needed-quote` placeholder until then
- [x] Figma after approval: Statement › Quotes variant: drawn as the Q137 carousel (587:14560 / 587:14629)

### Q129. Life at Reach built, first pass (8 Oct 2026)
Context: Ross: make a start on Life at Reach. Sources: client PDF "23 — Careers — Life at Reach" (screen p51: people-photo hero, two photo cards over it, three quotes marked illustrative, the overview's stats band, three FAQs, "Ready to find out more?"); dev /careers/why-work-with-us/life-at-reach/ (three sentences); a survey of every live and dev post, page and media item for people content (almost none: no rotation pattern, no staff events, no crew or trainee voices; a few named staff quotes in press posts). Our culture (Q127) already holds the values, HSEQ and the control-room photo, Why work with us (Q128) the offshore and onshore roles, so this page is the places and the people.
- [x] Quotes: one real press quote, Bjarte Christiansen (Technical Manager, six years as Offshore Manager; live news 9 Apr 2024), as Statement Quote on navy, eyebrow "In their own words" (Ross). **To confirm with Reach:** reuse of a press quote on Careers; crew or trainee quotes to replace it
- [ ] Labelled placeholder slot
- [ ] No quotes for now
- [x] Hero: the Careers overview's calm sea (Ross); the people photo moves to the intro (new `team-lounge-open-day.jpg`, live media from the 2024 open day)
- [ ] The PDF's lounge photo
- [ ] Navy text hero
- [x] Where people are based: figures only, in the places cards (8 offices in 4 countries), no offices map (Ross)
- [ ] The offices map, as on Contact
- [x] The PDF's stats band cut: the overview's, word for word (Ross)
- [ ] Keep it
- [x] Built: Hero Photo (dev's opening sentence as lead, 2 lines at 900–1000) · Subnav · Split media Image ("Expect to be inspired and challenged": the rest of the dev copy) (white) · Card grid 4 cols, image-top cards, one meta line each ("From the quayside to the seabed": On board · In a control room · At headquarters · In the workshop; vessel and office counts from key-figures.ts; four live-media photos used nowhere else on the site: crew on deck at a mobilisation, the remote control room, a desk by the harbour window from the 2023 office shoot, the electronics workshop; Ross asked for photos over text cards) (tint) · Statement Quote (navy) · Accordion Split, new FAQ topic `life-at-reach`, the PDF's three questions (tint) · CTA Panel, the PDF's wording + recruiter (tint). Copy: `src/data/life-at-reach.ts`
- [x] Card fix: a text or image-top card whose description ends on a meta line now pins the meta to the card foot, so rows keep their meta level when descriptions differ by a line (measured 375–1600). Cards with no description (Contact's office cards) keep the meta under the title (checked)
- [ ] **To confirm with Reach:** the Husøy technical base (being built in April 2024) and where the workshop photo was taken (Sep 2023 series, unlabelled); rotation patterns (not published anywhere)
- [x] Checked at 1440 · 1100 · 800 · 375: no sideways scroll, one h1, card meta level in every row 375–1600
- [x] docs/05 §3 row and Figma page frame after approval (no new components or tokens): §3 row in place; page frame Life at Reach 589:31472 (it needed the Statement Quotes variant, Quote card and Carousel tick after all)

### Q128. Why work with us built, first pass (8 Oct 2026)
Context: Ross: start the Why work with us page. Sources: client PDF "25 — Careers — Why Work With Us" (screen p55, Design Reference p27: hero, three "reasons to join" cards over the hero, four "Support to grow" benefit tiles flagged illustrative, three FAQs, "Ready to find out more?"); dev /careers/why-work-with-us/ leaves (Everything Within Reach, Career growth, Sustainability in work, Meet our people) and /careers/explore-your-path/ (Offshore, Onshore, Graduates & students). The live site has one Careers page, used by the overview. Outline put to Ross, four questions, all on the recommended option:
- [x] Benefits: the PDF's tiles left out; the real package is listed as open with the client (a block is added when it arrives)
- [ ] Labelled placeholder · [ ] Only the sourced tiles
- [x] Hero Photo: `project-trinidad-inspection.jpg` (platform at sunset on the right, calm sky and sea, echoes the PDF's platform; unused elsewhere)
- [ ] Deep Cygnus · [ ] Ask the client for a new one
- [x] Reasons as **Figures Sticky on navy** (first use on a page; Why invest uses the Cards layout of the same block): the PDF's three reasons + the dev's Sustainability in work, each with a proof figure from key-figures (100% trainees offered a role · ~750 uncrewed days · 90% fuel saving · 500+ people)
- [ ] Figures Cards as Why invest · [ ] Card grid 4 columns numbered
- [x] FAQs: new topic `why-work` under Careers in `faqs.ts`, the PDF's three questions (figures from key-figures; the trainee answer in the live site's wording)
- [ ] Add to the Careers topic · [ ] No FAQ
- [x] Not repeated from the siblings: the values copy, Trainees, open positions and the 3D World (overview); the comfort-zone paragraph and the operations-centre photo (Our culture). The PDF's second hero button (Life at Reach) dropped: the subnav links it
- [x] Intro: Split media Wide without an image ("Everything within Reach": the dev innovators paragraph and Career growth, one per column; heading cut to the sentence's first clause, the full one ran to six lines at 375)
- [x] Offshore and onshore: first built as Card grid 2 columns with spec rows; replaced by the Comparison block (Q134)
- [ ] **To confirm with Reach:** the benefits package; the graduates intake year (dev says "2026 intake", dropped); "500+ people across nine countries" (PDF) became "8 offices in 4 countries" (nine is where Reach has worked)
- [x] Redirects to this page: dev /careers/why-work-with-us/{everything-within-reach, career-growth, sustainability-in-work, meet-our-people}/ and /careers/explore-your-path/{offshore-careers, onshore-careers, graduates-students}/
- [x] Checked at 1440 · 1220 · 1100 · 1000 · 920 · 800 · 620 · 375: no sideways scroll, one h1, path cards equal height with facts ≤3 lines, sticky figures swap per point
- [x] After approval: docs/05 §3 row, Figma page frame (+ the Card grid tablet / phone spec-row frames): §3 row in place; page frame Why work with us 588:19574 (Wide, Figures Grid, Comparison). The spec-row frames are moot: Q134 replaced the spec rows with the Comparison block

### Q127. Our culture built, first pass (8 Oct 2026)
Context: Ross: start the Our Culture page. Sources: client PDF "24 — Careers — Our Culture" (screens p53–54, Design Reference p26: hero, Learn · Teach · Reach cards each with an "In practice" line, Our people + Safety & quality, the five HOP principles, three FAQs, "Want to be part of it?"); live /careers/ (the comfort-zone paragraph and the fourth value). The dev page and the dev People leaves are empty. No question put to Ross; defaults below, for review.
- [x] Hero Text on navy, as the PDF's gradient hero (the calm-sea photo already heads Careers and About); lead one sentence, the PDF's "Learn. Teach. Reach. Within Reach —" opener cut
- [x] Values as Card grid Rows, row cards (Sustainability's pattern): pictogram and value, then About's value statement (company.ts, not retyped) and the PDF's "In practice" line as the proof line. Never leave anyone behind added as a fourth row, as on the Careers overview; its practice line names the Stop the Job policy and the 2021 "We are one team" campaign (both real, hseq.ts)
- [x] Our people + Safety & quality as two photo cards (2 cols, white on tint): new photo `team-operations-centre.jpg` (live site, "Operations Engineer Geir Clement Wagen"), and the HSEQ hero deck photo, each linking on (Our offices, HSEQ)
- [x] HOP as Split media Numbered list beside the intro (docs/03: "5-up → numbered list"), the PDF's wording
- [x] FAQs: new topic `culture` under Careers in `faqs.ts`, the PDF's three questions; the Code of Conduct answer points to HSEQ, where the policy is published (the PDF said Sustainability)
- [x] CTA Panel: the PDF's wording, View vacancies (HR-Manager), the named recruiter, as the Careers overview
- [ ] **To confirm with Reach:** the HOP copy (the PDF notes it is the industry-standard five principles, not a Reach programme); "A team across nine countries" became "four countries" (nine is where Reach has worked, the offices are in four)
- [x] Checked at 1440 · 1100 · 800 · 375: no sideways scroll, card actions aligned, one h1, axe 0 violations; the three FAQs also list on /faq/ under Careers
- [x] Figma: page frame 454:17974 on Pages (desktop only; no mobile frame yet). Needed two component additions after all: a mirrored Card Row (Q138) and Split media Show 5th item (the HOP list has five). Sweep 8 Oct 2026: the Our people / Safety & quality cards showed only their eyebrows (fixed-height Content clipped the title, copy and action), now hugging and level; the FAQ gains See all FAQs

### Q126. FAQ page, and FAQs as one post type (7 Oct 2026)
Context: Ross: build the FAQ page, gather every FAQ made so far, and set them up as a post type so the move to WordPress is smooth. There were 58 FAQs on 19 pages: 7 sets in data files, 12 typed inline in pages; three questions repeated across pages (offices ×3, R&D ×2, published research ×2), and seven answers said "above" or "on this page". Client PDF Design Reference p30 / screens p61–62: hero, jump chips, five groups of four drafted questions, "Still have a question?" CTA.
- [x] The FAQ page holds every FAQ, each once, grouped as the main navigation: General (Home, Contact, Explore 3D World) · Services · Assets · Company · Investors · Careers, so each page's "See all FAQs" lands on a group that holds its questions (Ross)
- [ ] The PDF's curated four per group (about 20)
- [x] Duplicates merged into one post tagged to several pages; the seven "above / on this page" answers name the page instead, so every answer reads right on its page and on the FAQ page (Ross). Home's "Where does Reach Subsea operate?" (typed offices list) is now the shared, data-built "Where does Reach Subsea have offices?"
- [ ] Keep page copies as they are
- [x] The PDF's extra drafted questions (dividend policy, outside oil & gas, trainee programme…) are not added now: they come with the pages still to build (Ross)
- [x] `src/data/faqs.ts` is the FAQ post type: `faqs` (slug, question, answer, topics; list order = `menu_order`), `faqTopics` (the hierarchical `faq_topic` taxonomy: six parent terms = the FAQ page's groups and their overview pages, child terms = the other pages), `faqsFor(topic)` for a page, `faqGroupsForHub()` for the FAQ page (each FAQ under its primary topic's group), `faqHubHref(topic)` → `/faq/#<group>`. Answers that quote figures, people or lists are still built from the data files. All 19 pages now ask for their topic; each page's questions, order and open item are unchanged (checked)
- [x] Built `/faq/`: Hero Text on navy (PDF title, lead "Answers to what we are asked most, organised by topic.") · Subnav In-page (six groups) · Accordion Split × 6, white / tint in turn, first item open in each · CTA Panel (tint, the PDF's "Still have a question?"). One FAQPage JSON-LD for the page (new Accordion `structuredData` switch, off on the FAQ page); Services group title "Services & technology" (the PDF's longer title broke over three lines)
- [x] Fix found on the way: a Split accordion's sticky header slid under a docked Section subnav when the header came back on scroll-up (Services, the service pages, now the FAQ page). It now docks below the subnav (measured: 24 clear, header hidden and shown)
- [x] Checked at 1440 · 1100 · 800 · 375: no sideways scroll, chips scroll sideways on phones, `#faq-{slug}` and `#<group>` deep links open and clear the subnav; axe 0 violations
- [x] Figma: FAQ page frame 478:9665, built from the Q141 FAQ index (see Q141)

**Answer:** every FAQ, grouped; merged and reworded; new questions with their pages.

### Q125. Charter agreements built as a live chart (7 Oct 2026)
Context: Ross: next the charter agreements page, with lots of care for the UI and UX, thought through so the client can add the data in WordPress neatly and easily. Sources: client PDF p20 / screens p42–43 (two Gantts 2025–2029, five bar styles, Normand Jarstein as a Project charter, the owned Reach Remote fleet in a second chart, banner and footnotes, CTA, no FAQ) and the Q2 2026 report p13–16 (every period, owner and the "2Q26 status" line per vessel). No question put to Ross yet; defaults from the sibling Investors pages.
- [x] Reverses Q26 (presentation slide as an image): a chart drawn from structured data, so a charter change is one edit in WordPress and the page can't go stale against the report
- [x] Where the data lives: fields on the **Asset** post (Charter field group: type, start, firm end, options repeater in months, quarter status, note), not a repeater on the page; the block has no data fields and queries the posts. Period wording ("Apr 2022 – Apr 2027, 2 × 1-year options") is generated, never typed. Prototype: `src/data/charters.ts` (joined to assets.ts by slug, so the other chat's assets.ts was not touched)
- [x] One chart on one time axis, not the PDF's two: Long-term charters · Project charter · Owned vessels as groups, so every bar is comparable. Rows sorted by when the firm period ends, so it reads as a staircase of expiries (what investors look for); newbuilds last
- [x] Four bar styles, not five: firm period sage-400; each option its own lighter segment (sage-200) with a 2px gap, so "2 × 6-month options" reads as two; Owned a 4px navy rule (a shape, not a fifth colour; it has no end to show); Joining the fleet a dashed outline (the "not yet" dash from Reports and the Financial calendar), starting today at the earliest since a newbuild can't have joined in the past. Project charter is a group heading, not a bar style
- [x] Today line through every row, the past washed in tint; the axis rolls (last year + 4) and docks under the subnav while the chart scrolls
- [x] Each row opens (whole row clickable, the name is the button): vessel owner, "If every option is declared: to April 2028", the Q2 2026 status, a note (Viking Reach sale; Reach Remote 3 & 4 EU funding), Fleet overview link. "Show all Q2 2026 updates" opens every row. Rows deep-link (`#charter-viking-reach`). No JS: all open
- [x] PDF banner, footnotes and the Olympic Taurus correction note dropped (the data is now current); Viking Reach carries the Assets "Sale agreed" badge
- [x] Text hero on navy (Q124), CTA panel with the PDF's heading and the IR contact, on white (the block above)
- [x] Measured: rows all 86px at 1100 (name column 5 of 12 between 900 and 1279 so the period stays on one line); opening rows and Show all move nothing sideways; the Show all button keeps its width when its label changes; no sideways scroll at 375. axe: 0 violations, rows closed and open. html-validate: same as the Financial calendar (no block-level findings). Build passes
- [x] Ross: point the Investors overview card here. The bento's one-pager card is now "Fleet · Charter agreements", no PDF badge, "See the charter timeline" → this page
- [x] Ross: the Reach Remote fleet in a separate graph. Charter timeline gains `fleet` (Chartered · Owned); the page has two, both white, same time window: the charters (Long-term · Project groups), then "Reach Remote fleet" (the PDF's point: owned and operated, so outside the charter backlog). With one group the chart has no group heading and the rows are `h3`. Owned is a full navy bar again in its own chart (the 4px rule was only to keep it quiet beside the charters); its row reads "In operation"
- [x] Ross: the "Today" key entry dropped; the axis labels the line. Each chart's key lists only the styles it uses
- [x] Ross: Reach Remote 1, 2, 3 and 4 as separate rows (each with its own Q2 2026 status, deep links `#charter-reach-remote-1` …). charters.ts rows take a `unit` (index into the pair asset's `unitNames`); WordPress: one Asset post per vessel (docs/09 §3)
- [x] Ross: what happened to the PDF's small print? Most was cut or hidden in the rows, and real facts were lost. Restored as visible numbered footnotes under each chart (Ross chose this over keeping them in the rows), the number beside the vessel's name, each fact said once (no longer in the open row): Viking Reach (MoA 4 Aug 2026, close Q4 2026, more than NOK 200m liquidity, gains about NOK 70m, the bar shows the charter before the sale), Viking Vigor (delivery second half of 2026), Normand Jarstein (Black Sea and Mediterranean campaign, a project charter as in the presentation), Reach Remote 3 and 4 (EU Innovation Fund, no delivery date, bar marks the build; one note shared by both rows). All from the Q2 report (p3, p12, p54); the PDF's ~NOK 65m gain is replaced by the report's ~NOK 70m. Not restored: the banner's Olympic Taurus correction and the † Taurus footnote (internal editing notes)
- [ ] The PDF linked a "Reach Remote 3 & 4 build & EU funding report"; add the link to the note once that page exists (`/assets/reach-remote/3-4/`, not built)
- [x] Ross: below 900 the chevron moves to the row's top right, as the Accordion, so name, period, bar and open detail share one left edge (measured: all at 24, chevron's right edge on the plot's at 351, 375 wide). From 900 it stays left, where the name column's right end meets the plot
- [x] Ross: what happened to the project charter pattern? The PDF marked Normand Jarstein three ways (navy striped bar and lighter striped option, a key entry, a PROJECT CHARTER badge) plus a divider label. Kept: the divider, as the "Project charter" group heading, and footnote 3. Ross chose the group heading only (over restoring a striped bar, or a live comparison): its firm period and option work like the long-term charters', so the same styles keep them comparable; navy means Owned on this page; stripes would read close to the dashed "joining" style. If Reach (Jorunn's Sep 2026 correction) asks for the striped bar, it is a new segment kind in CharterTimeline plus a key entry
- [ ] assets.ts keeps its verbatim `charter` strings for the Assets cards; once approved, the cards should read the generated text from charters.ts so the period exists once (another chat's file)
- [ ] Ask Reach: Offshore Surveyor's "1 year option + x 6 months option" (how many 6-month options; drawn as one); the firm periods for Viking Vigor and NB76 once signed; whether a vessel's quarterly status may be published as is
- [x] Figma after approval: Block/Charter timeline 508:12049, Bar/Charter segment 505:10935, Charter row 507:11084 (+ Charter key 505:10936, footnote 505:10939, fact 505:10942), page frame Charter agreements 515:11849 (ledger sweep8OctInvestors)

**Answer:** awaiting Ross's review.

### Q124. One hero image across the Investors pages? (7 Oct 2026)
Context: Ross: shall we use the Investors overview's hero image across all the sub pages? The section had three photos (Overview calm horizon, Why invest wind farm, Reports Go Electra) and three navy text heroes (Governance, Financial calendar, Share information). Also Ross asked to make the Financial calendar's three "Date to come" rows compact, then to undo it (reverted, no change).
- [x] Rule by page type: Overview and Why invest keep their own photos; every data page (Reports, Governance, Financial calendar, Share information) uses the navy Text hero (Q57). Reports drops Go Electra, which was busier than the calm-hero rule anyway (Q120) (Ross)
- [ ] The Overview photo on all seven pages
- [ ] The Overview photo on the four data pages

**Answer:** rule by page type.

### Q123. Keep the Share information pill? (7 Oct 2026)
Context: Ross: do we still need a share info pill? The 20 largest shareholders and the announcements are on Reports & presentations, and Overview and Why invest show the share chart (cropped), but six links pointed to `/investors/share-information/`, which wasn't built. The full OMS share page also has the profit calculator, returns against the index, last trades, order depth and company facts (ISIN, shares issued), which no other page shows.
- [x] Keep, live data only: the full OMS share page; shareholders and announcements stay on Reports (Ross)
- [ ] Keep, and move the shareholders and announcements there (Reports documents only)
- [ ] Drop the pill and page, re-point the six links
- [x] Built: Hero Text · Subnav · Embed Iframe (the OMS standard page) · CTA Panel. OMS switches to one column below ~838 wide, so the frame is 2352 tall at 900–960 (page CSS), 1792 above
- [x] Figma: page frame Share information 515:13417 (Embed Iframe Loaded, frame 1792); the Subnav component's 7th item (Show 7th item#497:0) is now on in every Investors frame (ledger sweep8OctInvestors)
- [ ] Reports' "20 largest shareholders" block has no anchor, so this page can't link straight to it (another chat's file)

**Answer:** keep, live data only.

### Q122. Financial calendar built (7 Oct 2026)
Context: Ross: start to build the financial calendar page. Sources: client PDF p48 (Design reference 21: hero, a short list of upcoming dates with Confirmed / Estimated pills, CTA, no FAQ) and the live Financial calendar (reachsubsea.no/investors/financial-calendar/, read 7 Oct 2026), which has every 2026 date and Q4 2026 on 16 Feb 2027. No question put to Ross yet; defaults from the sibling Investors pages.
- [x] Real dates in `investor-calendar.ts` with a `confirmed` flag: Q4 2025 13 Feb · annual report 2025 30 Apr · Q1 5 May · AGM 28 May · Q2 18 Aug · Q3 17 Nov 2026 · Q4 2026 16 Feb 2027 (was the placeholder 11 Feb). The 2027 annual report, Q1 and AGM stay placeholders (`confirmed: false`); the page shows them as "Date to come", never their date
- [x] A new **Date list** block (docs/05 §2.25) in the Results / Meeting archive row language, used twice: Key dates (upcoming; Next on Navy, as the page's main task, with countdown and Add to calendar; later dates dashed) and Earlier dates (this year's past dates with the files each produced, so the calendar also answers "where's that report?")
- [x] "Add all confirmed dates to your calendar": one .ics with every confirmed upcoming date
- [ ] The Investors overview Track still draws the three 2027 placeholder dates (AR 26 · Q1 27 · AGM). Hide unconfirmed markers there too? (not this page's file)
- [x] (Done 8 Oct 2026, Q143: reports.ts reads `confirmed` from investor-calendar.ts) Reports & presentations: Q4 2026 now reads "16 Feb 2027 · provisional"; it should be confirmed. reports.ts `CONFIRMED_DATES` could read `confirmed` from investor-calendar.ts (another chat's uncommitted file, not edited)
- [ ] The live calendar says Q4 2025 on 13 Feb 2026; reports.ts has published 12 Feb (upload date). Calendar date used here
- [ ] Ask Reach: the 2027 dates (annual report, Q1, AGM), and whether results days have a fixed time/webcast to show in the rows
- [ ] DateList, ResultsArchive and MeetingArchive each carry a copy of the row CSS; fold them into one shared Row part once the three pages are approved
- [x] Figma (Ross: update Figma for the page): Date tile Type=TBC, Date row part, Block/Date list, page frame 426:12486 (ledger phase4FinancialCalendar7Oct)

**Answer:** pushed to Figma.

### Q121. Governance & general meetings built (7 Oct 2026)
Context: Ross: start the page, thinking about balance and layout and what the other pages taught today. Sources: client PDF p46–47 (committee cards marked illustrative, empty archive), the live General meetings page (20 meetings, 2012–2026), the dev Corporate Governance page (governance, IR and dividend policies, articles, remuneration policy), annual report 2025 p78–84 and the 2026 AGM papers.
- [x] Built as a sibling of Reports & presentations: the meetings first, because the notice and minutes are what most visitors come for; a new **Meeting archive** block in the Results archive's row language (Navy Latest, dashed Next, files in aligned columns) rather than Data list type Documents (another generation of table)
- [x] Next AGM 2027: no date yet (the live financial calendar stops at Q4 2026), so greyed "Date to come · usually late May", no calendar link; it switches to date, countdown and Add to calendar when `nextGeneralMeeting.date` is set and confirmed
- [x] Ross: the files should align with the text. Stacked rows (below a 1232 container, ~1360 viewport; at 1080 the titles squeezed to two lines at 1255) now start the files on the title's left edge, not under the date tile; below 480 one per line (measured: title and first file at the same x at 1100, 800, 375)
- [x] Four years open, 2012–2022 under "Earlier meetings" (the Data list spec's archive toggle); the toggle stays put and opens below itself
- [x] Real structure instead of the PDF's illustrative cards: Board (5, elected each year from 2026), nomination committee (Geir Flæsen, Rune Lande, Didrik Leikvang, re-elected to 2028), audit and remuneration committees (3 Board members each), 2 × 2 so the rows read "elected by shareholders" over "appointed by the Board"
- [x] Ross asked where the policy rows came from: sourced row by row in governance.ts. Two rows overstated their source and were corrected: "Excludes" → "Adjusted for" (the policy says adjusted, not excluded) and "Open to all, with webcasts" → "Open, in person or online" (the annual report says open physical or digital presentations; there are no webcasts for the last three quarters)
- [x] Dividend and IR policies kept on this page (Why invest links here for them), as two Spec-row lists side by side (the HSEQ campaigns pattern), values cut to one line
- [x] Governance documents as HSEQ's Policies block on navy. Ross: the statement as a header action beside a block of file links felt like too much, so it is the first file in the list, no action; the Transparency Act statement dropped to keep 3 × 2 (it has its own page, linked from the footer)
- [ ] Ask Reach: the 29 May 2017 AGM minutes (the live link opens the Feb 2017 EGM notice); the 2012 "General Meeting" files are both EGMs (28 Nov, 18 Dec 2012), listed as such; an English articles of association; the 2027 AGM date
- [ ] Why invest's "Dividend & IR policy" link could point to `/investors/governance-meetings/#policies` (not edited: another chat's uncommitted file)
- [ ] investor-calendar.ts has a placeholder AGM 27 May 2027 (not this page's file)
- [x] Ross: stay truer to the client PDF and include its AGM / EGM explainer. Asked: (1) where → **opens the meetings section** (recommended; meetings stay first): "General meetings" header, the PDF's two columns in its words (no em dash, no AGM/EGM abbreviations), then "Notices & minutes" over the archive; (2) how far → **PDF headings and lead** (recommended): "Articles & policies", "Notices & minutes", the PDF's hero lead with its listing clause cut (three lines → two; the listing is in the first FAQ). No extra eyebrows. The explainer's paragraphs share rows with each other (subgrid), level at 900–1440. Toned down (Ross): titles H4 size, copy Body/Small, now one line each from 1200 and level at every width. Then moved under the rows (Ross: "could even be moved under the calendar lists"; agreed, the papers are the task, the explainer background). With nothing between the section header and the rows, the "Notices & minutes" subheading went (two headings for one list); its wording is now the section intro. Under the rows it went back to full type (H3 titles, Body copy; Ross); the shared-row alignment removed, since at H3 it left an empty line above the AGM paragraph. EGM heading shortened to "Called between annual meetings" (Ross). Open rows cut to Next, 2026 and 2025 (Ross: hide 2024 and the 2023 meetings); "Earlier meetings, 2012–2024"

- [x] Figma: Block/Meeting archive 503:10948 (Meeting archive row 500:10914, Meeting guide item 501:10732), Split media Documents Stacked 511:11845 and Spec table Stacked paired 511:11890 (+ Mobile), page frame Governance & general meetings 513:11216 (ledger sweep8OctInvestors)

**Answer:** awaiting Ross's review.

### Q120. Reports & presentations built fresh (7 Oct 2026)
Context: Ross: build the page fresh in the new design system, from the client PDF (p44–45) and a good look at the dev site, thinking hard about the UX. Dev: 4 tabs (Quarterly · Annual · Sustainability · Misc), a Latest card per tab, a year × quarter grid of 15px icon links, data to Q2 2025 (with two misplaced 2023 cells). PDF: accordion by year, chip list, four document cards, a hand-typed top-5 shareholder table and visible accuracy notes. Live site: the full archive to Q2 2026, which is the data used.
- [x] Covers: downloaded the 18 annual and sustainability report PDFs (Ross, yes) and rendered page 1 of each into `public/images/reports/`; PDFs deleted. Since the fourth pass only 2023–2025 are used
- [x] Three blocks, one per kind of document, each shaped by how it is used: **Results archive** (year tabs, one row per quarter, labelled links in aligned columns), **Report shelf** (annual reports as covers, sustainability reports beside them), **File list** (ten other documents as dated rows). New blocks rather than editing Data list or Media gallery, which have another chat's uncommitted changes
- [x] No separate Latest card: the current year opens first, so the latest results and the next date (with Add to calendar) are the first thing under the hero. The current year always shows four quarters (later ones in outline with their Financial calendar date), so every year is the same height and a tab switch never moves the page
- [x] Second pass (Ross: Q3 took all the attention, it should be the latest): Latest Q2 is the one Navy row; Q3 Next and Q4 are dashed outlines with no fill, Q4 greyed. Why invest's report cards keep Next on Navy: each page weights its own main task
- [x] Third pass (Ross: why no Add to calendar on Q4 2026; a hover on the wide bar?): Add to calendar only for dates Reach has confirmed (`CONFIRMED_DATES` in reports.ts); Q4 2026 is our placeholder, so it reads "11 Feb 2027 · provisional", greyed, no calendar link. No row hover: a row holds 2–3 separate files, so it would promise a click that doesn't exist; each link has its own hover
- [x] Fourth pass (Ross): Feb 11 tile fainter (an outline tile, since navy-400 failed contrast at 2.96:1); 2012–2020 quarterly rows: year column 80 at desktop so Q1 clears the year; annual reports: only 2025–2023 as covers, 2012–2022 as compact rows (Report · ESEF · Sustainability report, the standalone sustainability reports beside their years; the 15 older cover images deleted); Other documents: date and title were 4px apart (a subgrid quirk: each row's gap overrode the list's), now 32
- [x] Real publication dates (webcast day, or the file's upload date from 2023 on); none shown where unknown. Webcast and file links only where a file exists
- [x] Largest shareholders not hand-typed. Banner, footnotes and reference-data badge dropped
- [x] Fifth pass (Ross: the 20 largest shareholders and the announcements block were missing): both back, live from OMS, after Other documents. I had dropped them because Share information (Q27) has the list and Newsweb was in the closing panel; that broke our rule that a hub page keeps the PDF's key content. Embed Iframe, sized to each component's measured content height per breakpoint; the closing panel's action is now Contact us (Newsweb has its own block); the shareholders FAQ points to this page
- [x] Embed Iframe (Ross: careful with the rounded corners, the white frame on tint): the provider page now sits 16 inside the frame, so OMS's table rules no longer run into the corners; new Tablet height (600–899) and Bleed on mobile (edge to edge under 600, since the shareholder table needs 375). docs/05 §2.13
- [ ] Between 600 and 899 the announcements frame can show up to ~100px of white under the last row: the OMS list gets shorter as it widens, and a fixed height must fit the narrowest width. Ask OMS whether the components can post their height (auto-resize), which would remove this on every page
- [x] FAQ: the PDF's three plus "What is the ESEF file?", since the shelf labels it
- [ ] Ask Reach: webcast links for Q4 2025, Q1 2026 and Q2 2026 (none on the live site); the Q1 2021 report (the live "Report" link opens the presentation)
- [ ] Placeholder dates to fix at source (not this page's files): Annual report 2025 was published 30 Apr 2026 (investor-results.ts says 26 Mar); Q1 2026 on 5 May 2026 (investor-calendar.ts says 24 Apr); Q4 2026 (11 Feb 2027) is still a placeholder (fixed: 16 Feb 2027, confirmed, Q122/Q143)
- [ ] Hero: Go Electra, as in the PDF; it is busier than our calm-hero rule (harbour town behind). Swap if Ross prefers
- [x] Figma (8 Oct 2026): `Block/Results archive` 486:10207 (Desktop 486:9500, Mobile 486:9856, Report-only 486:9619 / 486:9972), `Block/Report shelf` 490:10568 (Desktop 490:10099, Mobile 490:10345), `Block/File list` 492:10759 (Desktop 492:10455, Mobile 492:10607); parts Results row 484:9566, Year row 485:9546, Shelf item 490:10086 (the real covers), File row 492:10454; page frame Pages / Reports & presentations 494:10132

**Answer:** as ticked.

### Q119. Uncrewed days figure; Sustainability share bars (7 Oct 2026)
Context: Ross on the Sustainability "Revenue outside oil & gas" panel: should it be in a box, is the data factual, could it be displayed nicer.
- [x] Revenue split checked: Q2 2026 report p29, first half 2026 Renewable/Other 51 % (39 %); correct. (Q2 alone 46 % (42 %), p28.)
- [x] "750+ uncrewed operational days, per quarter" was wrong: two Reach Remote vessels can't log more than ~182 days a quarter, and the Q2 report (p18) gives "~750 uncrewed operations days" with no period. Now **~750 · Uncrewed operational days to date** (placeholder wording until Reach confirms), from `key-figures.ts` on all six pages; Home and Why invest no longer hard-code it
- [ ] Ask Reach: is ~750 a running total, and since when? Source for the 90 % fuel saving (not in the Q2 report)
- [x] Why invest donut: the two shares sit at the card's left and right edges at 1280+ and on phones (the base card's grid centring had shrunk the labels row to the middle). At 768–1279 they stay side by side under the text
- [x] No "H1"/"H2" shorthand in copy: "first half of 2026", "second half of 2026"; the ring centre reads "First half 2026" (Ross: what does H1 mean?). Quarters always "Q2 2026" (Ross): Technology & Innovation's "2Q 2026 report" and the Fleet register demo's "3Q 2026" changed (the Assets badges already read "Joining 2026")
- [x] Share bars redesign (no box, the 50 % line as the story, one label per bar, no legend, the three figures split out): Ross chose to brief the Sustainability chat rather than edit its uncommitted page here

**Answer:** as ticked.

### Q118. HSEQ campaigns rebuilt from the poster (7 Oct 2026; renumbered from a clashing Q117)
Context: Ross: the campaigns page looked messy; write the poster's content out on the page, the first section a text/media block (ref/REA26 2842.110 Q2 HSEQ Manual handling V3.pdf), and make every poster a PDF. Then a review round (Ross: "tell me what's wrong… use taste and impeccable… think about the repetition, eg Stop, think, lift"; a better illustration supplied).
- [x] Order follows the poster: intro (Split media Image, Ross's square worker illustration as `artwork`, shown whole, no tint) · Stop · Think · Lift safe as three white icon cards (shield-stop, brain, shield-tick; the poster's questions as Card `scope`) · The golden rules beside Offshore risks · archive · CTA. One run on Tint, the two blocks under the intro `joined` (Ross: the blocks felt disconnected)
- [x] Review round: "Stop / think / lift" said four times (title, slogan, step H2, CTA). Kept once in the title and once as the card titles: the steps' H2 dropped (`ariaLabel`), the CTA slogan dropped for the poster's feedback line
- [x] Review round: duplicate CTAs. The intro carries Campaign poster (PDF) only; the CTA carries Send us your feedback only. The sources line sits as fine print under the 1-in-3 figure it supports
- [x] Review round: tablet. Pictogram card rows at 600–767 (and a trio at 768–899) put the 96 pictogram beside the text instead of over a narrow column; applies to every open icon-card row (Home's services too)
- [x] The golden rules: the sage panel with a "20 kg" display figure felt wrong (Ross). Now Spec rows like Offshore risks, condition → action: Max limit 20 kg · Every lift: Never routine · In doubt: Stop · Need help: Always ask (the poster's four rules, split into label and value). The `bg/accent` and `text/on-accent` tokens and Split media `panel`/`figure` were removed
- [x] Archive: a poster opens its PDF in a new tab (the browser's viewer) with a Poster (PDF) link under the title, no lightbox (Ross). Originals: Q2 2026 and Q1–Q3 2021. **Placeholder** PDFs made from the poster images for the other 18 (`public/files/hseq/placeholder/`); ask Reach for the originals
- [x] Feedback address hseq@reachsubsea.com (the poster's; dev had .no)
- [x] brain and shield-stop: Ross's 2.5 stroke redraws (Figma 421:9718, 421:9717), looped in shield-tick's family: Stop's cross rewinds and redraws, the sign shakes "no", the shield breathes; Think's folds rewind and redraw in three waves top to bottom
- [x] File links follow one convention site-wide (Ross: "Download (PDF)" had crept in): the document's name then "(PDF)", no "Download" verb. Renamed: Download report (PDF) → Report (PDF) ×4, Download (PDF) → One-pager (PDF), Download spec sheet (PDF) → Spec sheet (PDF), Download the poster (PDF) → Campaign poster (PDF) / Life-Saving Rules poster (PDF), archive "Download" → Poster (PDF). Figma: Document card and Spec link defaults to rename on approval
- [ ] Waiting on Reach: the 18 poster PDFs
- New: Split media `artwork`, `joined`, `pairSpecs`/`pairHeading`, `titleHidden`; Card grid `ariaLabel` and tablet icon rows; Card Navy inside a Navy section raised to navy/700; Media gallery poster `file`. Figma variants to add on approval. Figma (8 Oct 2026): Media gallery Posters 553:14115 / 553:14320; `artwork`, `joined`, `pairSpecs`/`pairHeading` and `titleHidden` drawn as instance overrides in the HSEQ campaigns frame 558:16363 (no new variants needed)

**Answer:** as ticked.

### Q117. Sustainability page: stats, ESG layout, UN goals (7 Oct 2026)
Context: client PDF p36–37 ("15 — Company — Sustainability"), dev `/company/hseq/sustainability/` and its four children, 2Q 2026 report. Ross: start the page; rethink the stats bar; ESG cards "at 2 cols, each one stacked"; make the UN goals more interesting, as the dev site does. Claude built its recommendation for each; taste calls put to Ross after the first look.
- [x] Stats bar → new **Share bars** block (§2.19). The PDF's four figures were unrelated, with long labels, and one was wrong. The one figure that is moving leads: revenue outside oil & gas, first half 2025 → 2026, 39% → 51% (2Q report p29), as two 100% bars with a 50% tick, beside three Key figures (750+ uncrewed days per quarter, up to 90% fuel saving, 45% GHG cut targeted by 2030, new key `ghg-target`). The PDF's 41% (full year 2025) is replaced by the latest year-to-date pair
- [x] Dropped "4 ISO management-system certifications" and the ISO 31000:2018 tile: ISO 31000 is a guideline standard that cannot be certified, and live HSEQ lists three. The certificates show as About's strip (three)
- [x] ESG pillars → Card grid **Rows**: one wide white card per pillar on tint, PDF wording, priority badge, the PDF's proof line as the card's meta (icon on its first line); the card splits into claim (cols 1–5) and copy (cols 7–12) from an 880 card. Read as "each card in two columns, stacked", not "header left, cards right"
- [x] UN goals → new **SDG goals** block (§2.20): the UN's official tiles (from the dev media library, 400px) as tabs, the dev site's actions for each goal under them (typos fixed). Measured: switching goals moves nothing at 1400 · 1100 · 800 · 375; keyboard arrows/Home/End; axe clean
- [x] "Read the full picture" folds into the closing CTA panel (no second navy band): Annual report 2025 (the Latest results record, file still `#`), Policies & Code of Conduct → HSEQ, and the dev site's sustainability contact (CFO Arne Joa, from `people.ts`)
- [x] FAQs: the PDF's first two answers only pointed at the page ("See this page for…"); they now answer (the goal list built from the data)
- [x] Copy: "529 employees" → the site's 500+ (key figure); em dashes swapped for commas
- [ ] For Reach: "a Board with 43% female representation" (PDF) and dev's "Group Management 20% women" are left out. 43% is 3 of 7 and the current Board has five (`people.ts`); ask for current figures. Also confirm "18% of our workforce is women today" and the 45% GHG target's base year
- [x] ESG pictograms (Ross, 7 Oct 2026: his 2.5 stroke redraws, Figma 421:9631 `globe-hand`, 421:9647 `handshake`, 421:9691 `legal`): Environmental, Social, Governance, 96 above each card's eyebrow (Card grid Rows takes icon media). Loops (3.2s, movement and trim only): the hand lifts the globe while its land redraws west then east; the handshake keeps its clasp-and-shake loop (the redraw replaced the 22 Sep trace, so Contact's Sales card gets it too); the scales tip one way, then the other, and settle, each pan moving with its end of the beam
- [x] Dev extras (Ross): Sponsorship becomes a child page (`/company/sustainability/sponsorship/`, to build) with a teaser card on the hub; Material Sustainability Matters (double materiality, ESRS) folds into the hub's ESG intro
- [x] Hero title (Ross): keep the PDF's wording (3 lines at 1440, 5 at 375); the lead is already one sentence
- [x] ESG cards, second pass (Ross: "very unbalanced"; the claim, badge and proof crowded the left and the copy sat alone on the right). Ross suggested the pillar as the heading, the priority as the eyebrow and the claim over the copy; Claude agreed, with the priority over the claim, since it describes the claim ("Our biggest lever" → technology choices), not the pillar. Now: the pillar in H2 size top-left and the 128 pictogram on the card's foot (cols 1–5); eyebrow (priority, no pill), the claim in H4, the copy, then the proof line in bold, no icon (cols 7–12). Stacked: pictogram, pillar, eyebrow, claim, copy, proof. Card gains two optional fields for this, `lead` and `note` (docs/04 §13). Governance's copy no longer repeats the ISO 27001 line that the proof now states straight after it
- [x] ESG cards, third pass (Ross: still unbalanced, and a pictogram on a card's foot had no precedent). Splitting a wide card in two leaves one side half empty whatever goes where: the content is one heading pair and ~80 words of copy. So the block splits instead, as Accordion Split on the same page: the Section header in cols 1–5, sticky under the subnav (cols 1–4 at 900–1199), and the three cards stacked one per row in cols 7–12 (6–12), each a plain icon card in one column: 96 pictogram, eyebrow (priority), title (pillar, H3), lead (the claim, `Lead` style), copy at ~60ch, then the proof line in bold. Below 900 the header sits above. The second pass's H2-size title and foot pictogram are gone. Pending: the Material Sustainability Matters text (double materiality, ESRS) can join the sticky header's intro
- [x] ESG cards, fourth pass (Ross: the sticky left column did no work; Claude agreed, since the header is three short lines and nothing changes beside it, the same lesson as Q106 on Leadership). Now as Leadership's board rows: header full width above, one open row per pillar (no card box), the pictogram on a square tint tile where the portrait sits (200; a fifth of the container from 1320; 160 below 1200; 112/96 beside the heading on phones), beside one text column: priority, pillar (H3), claim (Lead), copy (max 44rem), proof line in bold. The section moves to white (the tiles carry the tint), so it alternates with the Share bars above
- [x] Share bars, second pass (Ross's review): no panel, the block on tint; the heading is the story ("More than half our revenue now comes from outside oil & gas"); 51% said once as the big figure with "First half 2026, up from 39%"; slim 32px bars with only the share marked (its percentage inside, its name once over the bars, no legend), the rest a quiet track, the 50% tick the line the 2026 bar crosses; the three figures (~750 uncrewed days to date, from the other chat's key-figures fix, up to 90% fuel saving, 45% GHG target) in their own row below, rules between
- [x] Share bars, third pass (Ross): the text column (sentence heading, 51%, "First half 2026, up from 39%") in cols 1–5 and the bars in cols 7–12 on its bottom line; the 50% marker dropped (the heading and the figure already say "more than half"; the bars show the change); the three figures move to a **Stats band Feature** under it (`joined`, new option: no top padding), ~750 uncrewed days leading in navy. No donut here: Why invest already has one for the same measure
- [x] One revenue split site-wide (Ross): the 2Q report gives 2Q alone (p28: 54% oil & gas / 46% renewables & other) and the first half (p29: 49% / 51%). Why invest's donut showed 2Q, so a reader saw 46% there and "more than half" here. Both now use the first half: `revenueMix` is derived from `revenueShift`, the donut centre reads "H1 2026", and its text says "more than half of revenue: 51% in H1 2026, up from 39% in H1 2025"
- [x] ESG order (Ross: "Why it matters now" above "Governance" didn't read): the PDF's priority labels are dropped, since they describe the claim, not the pillar, and the claim already carries the priority. Each row reads pillar → claim → copy → proof
- [x] SDG goals, second pass (Ross: cramped, and the tabs didn't carry over to mobile): no tabs. Nine white cards on tint, each the UN tile beside "Goal N" and the goal's name as text, then the ticked actions; three across from 900, two at 600–899 (the odd last one spans), one on phones
- [x] Share bars, fourth pass (Ross): the heading across the top on two lines; the bars in the left column and the 51% as a ring in the right (the Why invest donut, now a shared **Donut** component that Figures uses too), "First half 2026, up from 39%" in its centre
- [x] Stats band Feature gap (Ross: "why such a big gap?"): figures were content-width with the spare width in the gaps, so two figures beside the lead left half the panel empty and pushed the last to the edge. With two figures they now share the width equally, a rule between (Tech & Innovation's band gets the same fix; three or more figures unchanged)
- [x] ESG rows, fifth pass (Ross): pictogram, pillar and claim in cols 1–5; copy and proof line in cols 7–12, starting level with the pillar heading; no tile, no card
- [x] SDG cards (Ross: disjointed beside the tile): tile 120 (96 on phones), "Goal N" and the name under it, all on one left edge with the list
- [x] SDG goals without cards (Ross): the tiles are already strong coloured blocks, so the white cards were a frame round a frame. Open items on tint, rows `space/64` apart (48 on phones)
- [x] Share bars fifth pass (Ross): the heading with the bars right under it in cols 1–7, the ring beside the pair in cols 9–12 (the bars had sat low under the full-width heading)
- [x] ESG rows: pictograms at the Services overview's service-line size (200 / 160 / 96), the copy starting level with the title (Ross)
- [x] Stats band Feature rows: figures in equal columns, each left-aligned after its rule, at every count (Ross, Company: the middle figure floated and the last sat on the right edge)
- [x] Share bars sixth pass (Ross): the block on white (the Stats band keeps tint, no longer joined); bars 48 tall on the heading's left edge, periods under them, "Oil & gas" named over the right end; ring up to 400 with a thinner stroke (6) so the centre text has room; bars and ring side by side from 600
- [x] Counterpart colour (oil & gas) in the bars and ring: **navy/100** (Ross; navy/200 read grey; brand navy would compete with the sage and vanish on Why invest's navy card). Comparison: review/sustainability-share-bars-colours.png
- [x] ESG rows split 30/70 (Ross): cols 1–4 | 6–12, the Accordion Split pattern (was 1–5 | 7–12). Comparison: review/sustainability-esg-ratios.png
- [x] ESG rows: the copy (body and proof line) centred on the whole first column (pictogram, title, claim), not level with the title (Ross: the top right sat empty). Card wraps description and note in `.card__copy` (`display: contents` unless a layout places it)
- [x] ESG rows in cards (Ross: tighten them up): Rows `rowStyle="cards"`, a Tint card per pillar on White (Why invest's value-card pattern), gutter apart instead of 96. Comparison: review/sustainability-esg-cards-vs-open.png
- [x] ESG cards, sixth pass (Ross): the pillar at H2 size beside its pictogram; the copy side opens with the PDF's priority tag ("Our biggest lever", "Our first priority", "Why it matters now") over the claim at H3 size, then the copy and proof line. The tag sits over the claim, not the pillar (that order read wrongly). Comparison: review/sustainability-esg-claim-right.png
- [x] Backgrounds rebalanced (Ross): Share bars White · Stats band White, joined (white half edged) · ESG White cards on Tint · certificates White · SDG goals White · FAQ Tint · CTA panel Tint
- [x] CTA panel ground bug (Ross spotted it on Sustainability): the panel's `background` must equal the block above it. 9 pages were wrong (3D World, Assets, Tech & Innovation, Research & publications, Monitoring, HSEQ, HSEQ campaigns, Life-saving rules, Sustainability); all fixed, all 17 panel pages checked. Added to docs/08
- [x] Site-wide motion rule (Ross): charts lead, figures follow. Where a chart ([data-grow]) and counting figures share the screen, the chart draws first and the figures rise and count 1s later (held 1.2s at most for a half-visible chart); motion.ts `afterCharts`
- [x] Charts on screen at load draw at once (Ross), even if only partly in view (they waited for 90%, so a chart just under the hero sat half-drawn until a scroll). Further down the 90% rule stays
- [x] Closing CTA (Ross: two actions plus a contact is too much): only the annual report button stays; Policies & Code of Conduct dropped

**Answer:** as ticked; the Reach items stay open.

### Q116. One hero height across the site (7 Oct 2026)
Context: Ross: make every hero but Home the same height. Photo heroes already shared `clamp(640px, 47.2vw, 800px)`; the HSEQ child pages' Text heroes were content-height (as short as 343).
- [x] Text hero takes the Photo hero's height and layout from 900: crumbs at the same place (120 at 1440), title stack 96 from the bottom, 680 tall at 1440. Measured equal on HSEQ, Life-Saving Rules, Campaigns and Why invest at 1440, 1100 and 900
- [x] Below 900 Photo heroes are content-height (their photo band sits above the text: 532–772 at 375, 634–803 at 800), so an exact match would need empty space; the Text hero gets a floor of `min(140vw, 640px)` instead (525 at 375, 640 at 600–899)
- [x] Home's video hero is unchanged
- [x] A Navy Text hero uses the Photo hero's `navy/900` ground, not the block Navy, so heroes with and without a photo match (Ross)

**Answer:** as ticked.

### Q115. HSEQ: one hub and two child pages, hero, figures, campaign archive (6 Oct 2026)
Context: client PDF p34–35 (one page: hero with six cards over it, certification chips, three related documents, FAQ, CTA); dev splits HSEQ into six child pages (Introduction, Standards, Policies & Code of Conduct, Campaigns, Life Saving Rules, Transparency Act); live `/hseq/` is one long page. Claude proposed one page; Ross: two, since the Life-Saving Rules are a lot for one page and the current campaign can be featured on its own page with the poster archive below, as dev does. Claude agreed for those two only: Standards and Policies would be thin lists on their own.
- [x] `/company/hseq/` hub + `/company/hseq/life-saving-rules/` + `/company/hseq/campaigns/`. The hub keeps a teaser of each (the nine IOGP icons linking to each rule; a campaign card). Transparency Act stays the legal page `/transparency-act/`
- [x] Hero: the dev HSEQ Standards deck photo (open deck, one crew member, big sky). Portrait 768 × 1024, so it is soft at 1440: ask Reach for a landscape original
- [x] No HSEQ figures from the quarterly report (LTIs, spills, ROV uptime): they date the page and belong in Investors
- [x] Campaigns: the full poster archive (22 posters, 2021 to 2026) as a year × quarter gallery, three years shown, "Show all years" for the rest; the newest campaign (Q2 2026 "Stop & think before lifting") featured above it with its poster copy as page text
- [x] Child pages use the Text hero on navy under the overlay header (Q57's plain navy Text hero; Ross, 7 Oct 2026, after a first white build). The CTA panel keeps only Contact us: "Back to HSEQ" went, since the breadcrumb and subnav already lead back
- [x] How we operate (Ross, 7 Oct 2026): a one-column header like Standards, the live intro trimmed to one sentence, then the six areas as icon cards (3 × 2, tint cards on white; 2 × 3 below 1200). Library pictograms: `planner` (Risk management), `life-ring` (Safety), `teach-people` (Employee involvement), `leaf-hand` (Environment), `fingerprint` (Security), `goals` (Quality). Ross redrew all six as 2.5 strokes (Figma 421:9572–9576, 421:9590); each loops once (3.2s): the play drawn towards the target, the ring thrown and bobbing, knowledge passed across and back, the seedling lifted and swaying, the frame closing on a print that redraws from the core, the arrow drawn back and striking
- [x] Page-wide patterns (Ross, 7 Oct 2026): every full-width block heads with the Section header (stacked Split media too: Lead intro, link at the far end); hairlines only where they help (Spec rows, Accordion, the ISO tiles beside the registrations), none on the policy list
- [x] Figma (8 Oct 2026): `Block/Checklist grid` 545:14226 (Full Desktop 545:12342 / Mobile 545:13284, Compact Desktop 545:12936 / Mobile 545:13875), the nine IOGP icons as Rule icon components 543:24581–543:24589, Checklist item 544:12342, Checklist link 544:12373; page frames HSEQ 555:14272 (Policies list with the Code of Conduct, twelve files), Life-Saving Rules 557:15336, HSEQ campaigns 558:16363. New variants: Split media Tiles and spec Stacked 551:15971 / 551:16051 (Pictogram tile 551:2544), Media gallery Posters 553:14115 / 553:14320. Ledger key sweep8OctCompany

**Answer:** as ticked.

### Q114. Mobile menu: the 3D World as the desktop menu strip (6 Oct 2026)
Context: Ross: the Explore 3D World entry could be more of a button in the footer and the mobile menu. Claude: yes for the mobile menu, as the desktop menu strip (Q113's plain row undersold it, and the earlier button floated among mixed links); no for the footer, where a button would be the one loud thing in four quiet link columns.
- [x] Mobile menu: after the Contact row, a full-bleed `bg/tint` strip (`space/16` padding, `stack/md` above) holding the navy 3D World button at full width, label left, cube icon right: the same button as every Mega menu and the Site menu. The 3D World row goes
- [x] The small links and legal links share one grid: the first column as wide as its longest link (Privacy & Cookie Policy no longer wraps), the second takes the rest, `grid/gutter` apart
- [x] Footer unchanged: Explore 3D World stays a link under Explore

**Answer:** as ticked.

### Q113. Mobile menu foot tidied: rows and one link grid (6 Oct 2026)
Context: Ross: tidy the links under the mobile menu, and after a first pass, "still a mess". The foot mixed four looks: a navy button, bold Link Small rows with arrows, a social row and a caption row, each spaced differently, and "Contact us" repeated the Contact row.
- [x] Explore 3D World becomes a menu row after Contact, the same 56px `Heading/H5` row, with the cube icon where a chevron sits (replaces Q112's navy button)
- [x] Open positions ↗ · FAQ · LinkedIn ↗ · Facebook ↗ as one 2-column grid in the accordion children's style (48px rows, `Body/Body` `text/secondary`, a small ↗ on external links), `stack/md` below the rows
- [x] Privacy & Cookie Policy · Transparency Act (Caption) in the same two columns, `stack/sm` below
- [x] "Contact us" removed (the Contact row covers it). The list reads `mobileUtility` and `socialLinks` in `navigation.ts`

**Answer:** as ticked.

### Q112. Explore 3D World in the footer's Explore column and in the mobile menu (6 Oct 2026)
Context: after Q108, Ross: the footer link should move, and the mobile menu needs a link. Claude agreed: the footer listed it under Services & Assets, and below 900 the menu had no way to the 3D World (desktop has it in every menu strip and the Site menu).
- [x] Footer: out of Services & Assets, into Explore after Projects
- [x] Mobile menu: a 3D World entry after the Contact row (first the menu strips' navy button; a menu row since Q113)
- [x] Not a row in the Services accordion: the page left Services (Q108) and Q79 took the row out of the Services menu

**Answer:** as ticked.

### Q111. Board rows spaced out (6 Oct 2026)
Context: Ross: vertically space the board out.
- [x] Space between directors: `space/96` from 1200 (was 48), `space/64` at 768–1199 (was 48), `space/48` on phones (was 40)

**Answer:** as ticked.

### Q110. Board portraits from Reach's group photo (6 Oct 2026)
Context: Ross supplied the board's group photo (`assets/10543 Reach subsea-001.jpg`, 5138px square, colour) to crop the five portraits from. Standing, left to right: Rachid Bendriss, Hilde Drønen, Arvid Pettersen; seated: Espen Gjerde (left) and Martha Kold Monclair (right, identified by elimination: her live-site photo shows different hair, so worth confirming).
- [x] Each cropped square from the group photo to the management framing (head about 46% of the tile, a little headroom), 800 × 800, in colour, with the standard photo tint
- [x] Replaces the live site's black-and-white shots; management and board now read as one colour set

**Answer:** as ticked. The two seated crops have colleagues behind them (a group photo), kept as is.

### Q108. Explore 3D World moves to Home › Explore 3D World (6 Oct 2026)
Context: Ross asked whether the page should sit at Home › Explore 3D World. Claude: yes. It spans the three service lines, the fleet and the Careers route, and isn't a service; under Services it showed a pill row with nothing current. Against: the client screens PDF files it as "11 — Services — Explore 3D World", so tell the client.
- [x] Landing page `/3d-world/` (was `/services/3d-world/`), breadcrumb Home › Explore 3D World, no Services subnav
- [x] The framed world moves to `/3d-world/explore/` (was `/3d-world/`); `?zone=N` and `?careers=1` unchanged. Every link reads `worldPath` / `worldPagePath` in `src/data/world.ts`
- [x] The menu entries stay where they are (Services menu strip, footer, Site menu, popular searches); menu placement is not the page's parent
- [x] How it works gains a section header action "Our services" → `/services/`, standing in for the intro links lost in Q102
- [x] The live site's `/3d-world/` (the Unity world) becomes the landing page, so old links still land one click from the world: no redirect (docs/09 §7)

**Answer:** as ticked. Departs from the client PDF's Services placement and the discovery brief's sitemap (docs/01), to confirm with the client.

### Q107. Board portraits the same size as management (6 Oct 2026)
Context: Ross: the board images can be the same dimensions as the management ones.
- [x] Board portraits square (were 4:5), re-cropped from the live-site sources to the management framing (head about 46% of the tile, a little headroom), black and white as before
- [x] From 1320 a board portrait is exactly one management tile wide (a fifth of the container less four gutters: 230 at 1440) and shares its left edge; 200 at 1200–1319, 160 at 768–1199 (where management tiles are three across and larger); 112 / 96 on phones, the same as management's rows

**Answer:** as ticked.

### Q106. Board of Directors: header above the rows (6 Oct 2026)
Context: Ross: the Profiles Rows block felt tight with the intro in the first column (cols 1–4, sticky, beside the rows from 1200).
- [x] The section header runs full width above the rows, like the management grid (eyebrow, H2, intro; "Governance & meetings" at the far end from 900), no sticky column
- [x] The rows take the full container: portrait 200 from 1200 (160 below), the bio's measure opened from 40 to 44rem (~6 lines at 1440)

**Answer:** as ticked. Below 768 unchanged.

### Q105. Leadership: management portraits from the colour originals, standard tint (6 Oct 2026)
Context: Ross: use the originals in `assets/` for the management images (Jostein Alendal 2024, Audun Brandtzæg and Inge Grutle 2024, Arne Joa and Bård Thuen Høgheim Oct 2025: the shoots behind the Q2 report's page 7, up to 6300px). He first asked for them untinted, then for the standard site filter.
- [x] Re-cropped square from the originals to the report's framing (head about 46% of the tile, a little headroom, shoulders in), 800 × 800, in colour
- [x] The standard site photo tint (navy screen blend, base.css), like every other photo
- [ ] No tint (tried, reverted the same day)

**Answer:** as ticked. Replaces the black-and-white web copies and the old 479px Høgheim shot. No exception to the site-wide photo tint.

### Q104. Leadership: management portraits like the Q2 report (6 Oct 2026)
Context: Ross: the management cards' portraits felt squeezed; the Q2 2026 report (p7) crops better. Claude agreed: the 3:2 card crop cut the tops of heads and pressed faces between the card edge and the text, and the bordered card read as a product card. The report uses square tiles with headroom and shoulders, no box, the same framing for all five. It also carries bios and "years in subsea".
- [x] Report style, five across: square rounded portrait tiles (`radius/md`), no card box; name (`Heading/H5`), role in `text/accent`, phone and email meta. Five across from 1320, 3 + 2 at 768–1319, compact rows (square 112, 96 on phones) below 768
- [ ] Report crop, keep the 3 + 2 cards · [ ] Report style, 3 + 2
- [ ] Use the report's bios and "years in subsea"
- [x] Names, roles and contacts only

**Answer:** as ticked. Built as a second Profiles layout, **Grid** (docs/05 §2.18), so management and board come from one block fed by the People post type; the Card grid `contacts` shape from Q103 is removed. Portraits re-cropped square from the 800px sources to the report's framing (its own images are ~300px with the tint baked in); management order now follows the report (CEO, CCO, CFO, COO, CTO). Worth asking Reach for: the report's colour originals and its newer photo of Bård Thuen Høgheim (ours is the older 479px casual shot); the report calls Inge Grutle "Chief Operations Officer", the dev site "Chief Operating Officer".

### Q103. Company › Leadership & Board (6 Oct 2026)
Context: Client PDF p32–33 (Design reference p15): hero, five executives with initials avatars and direct phone and email, five board members with long bios, three FAQs. All ten people have matching black-and-white portraits on the live and dev sites; the dev board page is out of date (seven names), the live /investors/ page and the PDF agree on the current five.
- [x] Real black-and-white portraits, not initials (live/dev photos, cropped 4:5 into `public/images/people/`, the site's navy photo tint on top)
- [ ] Initials as in the PDF
- [x] Management: five equal portrait cards, 3 + 2 (Card grid 3 columns, image-top: name · role · phone · email)
- [ ] CEO lead + four · [ ] Five across
- [x] Board: editorial rows with the bios open (new **Profiles** block, docs/05 §2.18: portrait · name + role badge · "Born 1969 · On the board since 2020" · bio)
- [ ] Portrait grid with bios on expand · [ ] Cards as in the PDF
- [x] Show the executives' direct phone and email, flagged to confirm with Reach
- [ ] Leave them off
- [x] Figma (8 Oct 2026): `Block/Profiles` 542:12318 (Grid Desktop 542:11990 / Mobile 542:12155, Rows Desktop 542:12077 / Mobile 542:12242), parts Profile tile 541:12013 and Profile row 541:12039, real portraits; page frame Leadership & Board 548:13802. Ledger key sweep8OctCompany

**Answer:** as ticked. Claude's calls on the way: one `people.ts` (People post type) feeds this page and About's management table; FAQ answers are built from it (the PDF's "See this page for the full current Board…" pointed at itself); the hero lead is cut to two lines and the Euronext listing stays as the board intro; contact cards keep three columns down to 900 and become compact rows below 768 (Card grid `contacts`, set automatically when image-top cards carry only name, role and meta); the board header sits beside the rows from 1200 and stacks below; hero `hero-leadership.jpg` is *Northern Maria* with the sea extended left so the vessel sits right of the title. To confirm with Reach: every phone and email, Hilde Drønen's year on the board, "MKOLD AS" (live) vs "MMOLD AS" (PDF).

### Q102. How it works: the steps become a 3-column card row with explaining screenshots (6 Oct 2026)
Context: Ross: choosing a step wasn't intuitive. The steps should be their own 3-column block, with images that explain each one; Take the controls should at least show the ROV and the controls (Ross supplied a Pilot mode screenshot).
- [x] How it works is a Card grid: 3 columns, `image-top`, white cards on white. The section header carries the intro and the two notes (Section header gains an optional `meta` row)
- [x] Images: Fly between four zones = the zone switcher with pins and the welcome panel listing the zones; Click any vessel or ROV = Reach Remote 1 selected with its panel open; Take the controls = Ross's Pilot mode screenshot (ROV, keyboard controls, depth/heading/speed). The first two are crops of reach-world `review/shots/careers_8_v42_desktop.jpg` (846 px wide, and the panel is the careers-route version); clean renders asked of the 3D World chat
- [x] The intro loses its links to Subsea, Survey and Monitoring (a section header intro is plain text); the Services subnav right under the hero links them
- [x] Removed as unused: Split media's Steps layout and `meta` field (Q98–Q101), and the earlier step stills

**Answer:** as ticked. Supersedes Q99–Q101.

### Q101. How it works: steps you choose, not scroll-driven (6 Oct 2026)
Context: Ross: the section felt very sensitive, with a lot of text visible before the next image arrived. Claude: the scroll trigger was the wrong build. Three short steps fit on one screen on a tall monitor, so they were all readable while the still lagged behind, and the swap fired on small scrolls through a narrow band in the middle of the viewport. Making each step a full screen tall would only add empty space.
- [x] Each step's heading is a button; choosing it swaps the still with the same wipe and moves the accent marker. Step 1 is chosen on load
- [x] No sticky stage: the still sits beside the list, centred on the text column, so nothing moves while you read
- [x] Below 900: one still between the meta and the steps (replacing a still per step), so the still is next to what changes it
- [x] Measured: no element moves when a step is chosen, at 1440, 1100, 800 and 375

**Answer:** Claude's call after Ross asked whether this was the best build; easy to revert to the scroll version. Supersedes Q99's scroll trigger and sticky stage.

### Q100. How it works: stills, no numbers, steps that say what you can do (6 Oct 2026)
Context: Ross: the block felt laggy, the step text small and unhelpful, and asked whether the numbers 1–3 help. Claude: three films swapping on a sticky stage (each screen-blended over the tint, decoding as it wipes) is the lag, and the steps aren't a sequence, so the numbers only add noise.
- [x] Stills, no films: the sticky stage swaps stills with the same wipe. The Media frame film loop (Q98–Q99) and its three clips are removed
- [x] No numbers: each step is an H3 (`Heading/H4`) and `Body/Body` copy on a 1px `border/subtle` rail; the step that owns the media gets a `space/4` `border/accent` marker that grows down the rail, the others' headings drop to `text/secondary`
- [x] Steps rewritten around what you do in the world: Fly between four zones · Click any vessel or ROV (with Watch the launch) · Take the controls (Pilot mode and the survey line). "See the range we work with" is dropped: the zone cards list each zone's assets
- [x] New still for Take the controls: a Pilot mode survey-line screenshot from reach-world `review/shots` (1056 px wide; a clean 1600 × 1200 still is asked of the 3D World chat)

**Answer:** as ticked. Supersedes Q99's films, numbers and pause control; the sticky stage and wipe stay.

### Q99. How it works: notes under the intro, steps swap the media on scroll (6 Oct 2026)
Context: Ross: the two notes are best under the intro text, then steps 1, 2, 3 change the media on the right as you scroll. Claude agreed, reusing the Figures Sticky swap so the site has one scroll behaviour, with one clip per step from the world's films. Ross chose to build now with the existing films.
- [x] Meta row under the body copy, before the steps (Split media `meta` now always sits there)
- [x] New Split media layout **Steps**: sticky 4:3 stage held in the middle of the viewport, swapping on the Figures wipe; active step number accent, others secondary; one pause control; only the showing film plays and loads
- [x] Clips (from reach-world `film/out`, 17 Sep renders): 01 the dive from the hull down the jacket (`world-dive-loop.mp4`, 16 s, 2.1 MB), 02 the Surveyor with its pin (1.4 MB), 03 Viking Vigor → Reach Remote 1 → ZeeROV gWatch with cross-dissolves (`world-range-loop.mp4`, 12.6 s, 2.0 MB); soft fades through the tint at the loop point
- [x] Below 900: each step's media above its text, no sticky. Reduced motion: stills, instant swap
- [x] Fixed on the way: a playing loop no longer shows its still through it (both screen-blend over the tint)
- [x] Asked of the 3D World chat: a pin being clicked with its panel opening (step 2), and a zone-to-zone flight (step 1), to swap in (docs/prompts/3d-world-embed.md)

**Answer:** as ticked. Resolves the Q98 tablet imbalance: the media now holds the middle of the viewport at every width from 900.

### Q98. Explore 3D World: hero meta moves into How it works, redesigned (6 Oct 2026)
Context: Ross: the hero heading ran into the vessel, and the two hero notes ("Best on a computer or tablet", "Runs in your browser") belong in the first block under the pills, which could be designed better. It was a plain list beside a heading.
- [x] Hero heading "Explore Reach in 3D" (was "Explore our operations in 3D"): one line from 800 up, clear of the vessel; matches the menu's "Explore Reach in interactive 3D"
- [x] How it works = Split media Image with the text column as one piece: heading, short intro, three tighter steps, then the two notes as a Meta row
- [x] Media: the world's own film of the Surveyor with its pin (`video/world-surveyor-loop.mp4`, 1.4 MB, 16 s, fades in and out of blue so it loops softly), so "click any asset" is shown. Loads and plays only in view, never under reduced motion or Save-Data, pause control
- [x] New, reusable: Media frame `loop`; Split media `loop` (Image) and `meta` (docs/05 §1, §2.4)
- [x] Zone 1 card now shows the Viking Vigor, so the Surveyor isn't shown twice
- [x] Superseded by Q99 (Steps layout): the 900–1199 imbalance is gone

**Answer:** as ticked.

### Q97. Year bars: review demo, short runs (6 Oct 2026)
Context: Ross asked whether the bar chart was on the blocks review (/blocks/stats/). It wasn't anywhere in /blocks; it now has its own entry, /blocks/year-bars/ (White, Tint with eyebrow, Navy with a five-year run). The five-year run showed two edge cases the Research page (14 years) never hits.
- [x] Bar width capped at 48 (`space/48`), centred in the column: five years had stretched to 100px blocks at 1440 (61 at 375). Fourteen years stay about 34, so the Research page doesn't change
- [x] Every-other-year labels under 400px only with 10+ years: five years at 327px had dropped two labels for no reason
- [ ] Leave bars filling their columns

**Answer:** cap at 48 (Recommended option).

### Q96. The 3D World opens framed under the site header (6 Oct 2026)
Context: Ross and the developer want the world to launch in an iframe with the site header still there, like the dev site's Unity world. Claude agreed, on one condition: the frame gets its own page that doesn't scroll, not a slot inside the landing page, because the world's wheel and trackpad controls fight page scrolling, and a 16:9 slot is small for its panels.
- [x] `/3d-world/` (the dev site's current URL, so no redirect needed): solid header that never hides, the scene filling the rest of the visible viewport (`dvh`), no footer, no page scroll
- [x] Every link into the world goes there: the landing page's Launch and zone cards (`?zone=N`), the embeds' "Open full screen" and zone links, the service heroes' "See … in 3D", the Careers banner (`?careers=1`). Same tab throughout. The in-place poster embeds on Services and Careers stay
- [x] The page passes `zone` and `careers` through and adds `embed=1`
- [x] Escape handoff: when the scene has nothing left to close it posts `reach-world:release-focus`, and the page moves focus to the header (listener built; the world side is in the notes below)
- [x] Link: an "external" action pointing at a site path (`/…`) renders as a page link (same tab, arrow-right), so the hero links keep working without per-page edits
- [x] Notes for the 3D World chat: `docs/prompts/3d-world-embed.md`
- [ ] Launch in place on the landing page (scroll conflict, too small)

**Answer:** as ticked. Waiting on the world: `?zone`, the Escape message, `_top` links, the WordPress content, publishing v59, and the Tada host (client checklist 5) allowing framing.

### Q95. Explore 3D World landing page (6 Oct 2026, Services)
Context: client screens PDF p28–29 draw a Services page for the 3D World: hero with Launch and "Discuss your project", three cards over the hero's edge (How it works, Best viewed on, a photo), four zone cards with DRAFT badges and the PDF's own draft names, the 500+ / 9 / 2 modes stats band, Related services, FAQ, CTA. The Design Reference (p13) calls it a landing page for the real tool. Ross: build it. Built to Claude's lean recommendation.
- [x] URL `/services/3d-world/`, breadcrumb Home › Services › Explore 3D World; not a Services pill or menu row (Q79 stands)
- [x] Site-wide entries go to the page: every mega menu strip and the Site menu, the footer, popular searches, the Services overview hero link. The page's Launch button and zone cards open the scene; embeds, service-hero "in 3D" links and the Careers banner still go straight to the scene
- [x] Hero: one button (Launch 3D World); "Best viewed on" becomes the Meta row; "Discuss your project" dropped (the CTA covers it)
- [x] How it works below the hero, as Split media Numbered list; its copy links Subsea, Survey and Monitoring (replaces Related services)
- [x] Four zone cards, 2 columns: the world's names, order and assets (`worldZones` in `src/data/world.ts`, shared with the Embed block), not the PDF's draft names; stills from the world's films
- [x] Cut: cards over the hero (docs/06 §2), stats band (repeats Home and Services), Related services
- [x] FAQ: the PDF's three questions; CTA: the PDF's wording

**Answer:** as ticked. **Open, for Reach:** the zone blurbs are the world's DRAFT copy, tightened; the zone links (`?zone=`) and the 18 MB figure depend on the world (docs/09 §7: `?zone` is not read yet). Figma page frame to follow once approved. **Figma (8 Oct 2026):** page frame Pages / Explore 3D World 566:30780; Section header `Show meta#566:0` (the two notes, new Icon/device-desktop 566:2526 and Icon/browser 566:2537) and Card Image top White scope 566:2551 for the zone cards.

### Q94. 3D World: hosted separately, content from WordPress over an API (6 Oct 2026)
Context: the world's info panels, zone texts, careers route and links are hard-coded in the reach-world source, and much of it repeats what WordPress will hold (Assets, Careers, Contact, Services). Ross asked whether the world should live inside the Reach site; Claude suggested a WordPress plugin on the same domain. Ross then agreed with the WordPress developer: the world stays a separate static app on its own host, and reads its content from the Reach site through an API.
- [x] Hosting: the world is its own static app on its own host (for example `world.reachsubsea.com`), not a WordPress plugin or theme route
- [x] Content: editors manage zones, markers (pins), careers stops and links in WordPress; one read-only REST endpoint serves them to the world (contract in docs/09 §7)
- [x] 3D placement and camera stay in the world's code, matched to WordPress by slug; editors change words, images and links, never coordinates
- [x] The world keeps its built-in copy as a fallback, so it still opens if the API is slow or down
- [x] The website's zone names (Embed block, any zone cards) read the same WordPress zones, so the site and the world can't disagree
- [ ] Inside WordPress: a plugin route at `/3d-world/` with the content inlined (Claude's first suggestion; not chosen)

**Answer:** as ticked. API contract, CORS and caching in docs/09 §7. **Host decided (9 Oct 2026, client checklist 5):** Tada's servers, not a Reach-owned host. The Explore 3D World landing page followed (Q95).

### Q93. Filter chip counts in brackets (6 Oct 2026)
Context: Ross: "2025–26  7" is confusing; brackets? And why wasn't it caught? Agreed: a bare count after a label that is itself a number reads as part of it. Missed because the counts were checked by measurement (update, no jump), never read as text in chip form; in the rail they sat in their own column.
- [x] Counts bracketed site-wide (Filter chip): "2025–26 (7)", "Crewed (4)"; right-aligned as a column in the rail; min 4ch so widths still hold
- [x] Disabled chip: the count takes the label's disabled colour (was darker than its label)
- [x] docs/08 §4: read every label as a stranger would, in every state

**Answer:** as ticked.

### Q92. No UI jumps on interaction (6 Oct 2026, rule for this site and every site)
Context: Ross: ticking a filter made the list jump ("Clear all" grew the count line); avoid jumps like this across the site and on every site we build.
- [x] Clear all: its 44px target overhangs the 24px count line (negative margin), and it is always laid out, shown with `visibility` (was 24 → 44, pushing the filters down 20px)
- [x] Filter chip (site-wide): the check sits inside the chip's own padding (28 unselected, 16 selected), so ticking keeps the width; counts are tabular with 2ch room. Was +24px per tick and ~9px when a count lost a digit, nudging every chip after it (Data list, Feed grid, Live operations)
- [x] Measured after: no movement at 1440, 1000 or 375 except the count text itself (sub-pixel)
- [x] Rule added to docs/08 §6 (checked on every page), and to the global CLAUDE.md for all projects

**Answer:** as ticked.

### Q91. Publications list: space instead of hairlines (6 Oct 2026)
Context: Ross: "instead of a hairline between each listed, maybe just a bit more space". Agreed for this list only (a reading list); Reports, Documents and Dates are tables and keep their rules.
- [x] No dividers; papers spaced `stack/lg` (24 → 40), 40 below 600 where the link drops under the byline
- [x] Filters to list `stack/xl`, so the chips never read as part of the first paper in the stacked layout; the no-match message lost its rule too

**Answer:** as ticked.

### Q90. Library filters: multi-select; search stays in the rail (6 Oct 2026)
Context: Ross asked whether several filters should be selectable, and whether the search should be full width.
- [x] Multi-select: OR within a facet (CO2 storage + Seismic), AND across facets; the "All topics" / "All years" rows are gone (nothing ticked = no limit, Clear all resets). In the rail the tick slot is a checkbox; chips below 1100 tick the same way
- [x] Option counts are each option's own share (search + the other facet), so they hold still while ticking within a facet; 0 = disabled unless ticked
- [x] A Year bars pick replaces the year ticks with that one year (a jump, not an add)
- [x] Search stays in the sticky rail (not full width): it stays in reach down the list, a 1312 field would read as an empty bar for short queries, and search + filters + count read as one panel

**Answer:** multi-select, search in the rail.

### Q89. Library rail: a refinement list, not pills (6 Oct 2026)
Context: Ross: the rail could be narrower, the pills stack, maybe not pills, the count should sit nearer the search; "have a good think of the best UX and UI".
- [x] Narrow rail: cols 1–3 from 1280 (col 4 as air), cols 1–4 at 1100–1279 (3 cols clipped the search hint at 1100); the list keeps cols 5–12
- [x] Count right under the search field, with "Clear all" beside it once a search or facet narrows the list
- [x] Topic before Year (researchers start from the subject; the chart above covers time); "All topics" / "All years" (removed in Q90)
- [x] Options as a plain list in the rail (Filter chip Layout List): tick + bold for the picked one, no pill or navy fill; a live count per option (search + the other facet), 0 = disabled
- [x] Below 1100 the same options stay chip rows (now with counts); the search hint shortened to "Title, author or journal" (the icon says search)
- [x] The rail sticks only on screens 800+ tall, so its last options never hang below the fold

**Answer:** built as ticked.

### Q88. Research & publications library: search, rail, green eyebrows, chart filter (6 Oct 2026)
Context: Ross asked whether the library is the best design: ticks on the chips, year order vs the chart, green row eyebrows, a search bar. My view given first; he picked all four of the options put to him.
- [x] Search field above the chips (new component, docs/04 §10b): title, authors, venue, topic, year; accents folded; works with the chips; count "12 of 49 publications"; no-match message with "Clear search and filters"
- [x] Sticky filter rail from 1100 (search, chips, count in cols 1–4; list cols 5–12). At 900 the rail was 255 wide (hint cut off, four-line titles), so 900–1099 keeps the stacked layout
- [x] Row eyebrows `text/accent` for every Data list type, matching card eyebrows
- [x] Year bars columns filter the library: a click picks that year (a removable "2017" chip appears in the Year row) and scrolls to the list; hover darkens the bar
- [x] Kept: the tick on selected chips (the site-wide Filter chip, and a non-colour selected cue) and newest-first year chips (they filter a newest-first list; the chart reads as a timeline)
- [x] Figma (6 Oct 2026): Search field component (417:13857), Data list Publications Desktop/Mobile rebuilt as the rail + reading list (199:3984, 199:4096; new property `Show clear all`), Filter chip `Layout` Chip · List, page frame "Research & Publications" (419:13892) on Pages

**Answer:** as ticked.

### Q87. Year bars felt loose: tighter chart (6 Oct 2026)
Context: Ross: "it feels a bit loose" (taste-skill audit). Chart 160px with 24px bars and 22px gaps beside a taller text column, vertically centred, so nothing lined up and the bars read as a comb; the "Year by year" eyebrow repeated the H2.
- [x] Chart 240px (tokens 128 + 112), bottom-aligned with the text so the body's last line sits level with the year labels
- [x] Bars fill their columns with a 12px gap (34px at 1440, 16–23px at 900–1100, 19px with a 4px gap at 375)
- [x] Eyebrow dropped from the block on this page
- [x] Tighter chosen over Before after a live compare (dev-only toggle, now removed; `review/year-bars-compare-1440.png`)

**Answer:** Tighter.

### Q86. Research & Publications: hero and year-bars style (6 Oct 2026)
Context: Ross's first review of the page. Hero copy and image changed on his call; the chart questions put to him with a recommendation.
- [x] Hero: the PDF's title "The science behind how we work" and its lead (the breadcrumb already says Research & Publications); new photo `hero-publications.jpg` (Adobe Stock 1666853394, the wider crop: paper stack right, library shelves behind the text). The year-bars sentence takes the topics and venues the hero lead used to carry
- [x] Bars: square base on one hairline baseline, 2px top corners (new token `radius/xs`; the 8px `radius/sm` rounded a 24px bar into a pill). The Figures key swatch (raw 3px) moves onto it
- [x] Each count sits just above its own bar (was a row along the top of the chart)
- [x] Motion: the bars grow from the baseline left to right once the chart is in view, each count fading in as its bar lands; reduced motion shows the chart at once
- [x] No y axis: every bar carries its count, so an axis repeats it
- [ ] Not taken: taller chart (160 → 200) and a "2026 so far" label for the part year
- Found in the review: under 560px the full year was `display:none` and the short one `aria-hidden`, so screen readers heard no year; now a hidden full year is always read. Short years sat 2–5px apart at 375, so under 400px every other year is labelled (from 2026 back); full years now need 600px (they sat 6px apart at 1280)

**Answer:** as ticked. Figma (6 Oct 2026, on page approval): `radius/xs` variable (VariableID:417:22) and `Block/Year bars` (417:14015) added.

### Q85. Hero copy short, icons never reused, Tech video cards (6 Oct 2026)
Context: Ross found the service-page heroes busy. Claude agreed with all points.
- [x] Leads cut to 2 lines (checked at 900 and 1000): Services overview, Survey, Technology, Research, Assets; the dropped copy is already in each page's first block (Tech: the products intro now carries "Technology is one of the core drivers…"). Services title "Services built for…" → "Services for the full offshore asset lifecycle"
- [x] Tech hero image changed to Reach Remote from the bow, focal point set low so the vessel sits top right and the copy has plain water
- [x] Icons: the six pictograms on the Tech page (four products, monitoring heritage, research partnerships) were all in use elsewhere. Each is now a `needed-…` placeholder (dashed "Icon needed" box, `Pictogram.astro`). **Ross to suggest or make:** Reach Pilot, Reach Horizon, Reach Relay (Reach Remote now uses Ross's `reach-remote`, Figma 52:95; Research partnerships uses Ross's stroked `book`, Figma 412:7967; the Monitoring card now carries the Monitoring line's own pictogram, Ross 6 Oct 2026: same meaning, so not a reuse)
- [x] Assets ROV section (Ross, 6 Oct 2026): PDF p20's bento info partly restored: title "15 ROV systems, by class" (Key figures) with the PDF's intro (carried aboard the crewed vessels; 13 work-class and 2 Surveyor Interceptor), and each class card shows "N in service" and a "Carried on" row, counted from the vessels' ROV lists (Normand Jarstein, a project charter, left out as in the PDF; ZEEROV carried on the Reach Remote pair, no count). The Q2 report quote is not repeated and the bento boxes are not rebuilt (one uniform card row). The named vessels do not sum to 15 (the PDF's own reconciliation note), so no total is claimed
- [x] `book` loop (Ross, 6 Oct 2026): reworked from Ross's Icons8 literature Lottie: the right page lifts about 4px as it narrows edge-on, turns over the spine onto the left and holds, the whole book dips 1px as it lands, then the page resets to the right (a duplicate page, so the turn only runs one way). Solid, transform only, 3.2s, plays on reveal and hover like the other pictograms. `reach-remote` loop (Ross: no lines appearing on the antenna): the clouds ease across the icon at a constant speed on a seamless loop (the set is drawn twice inside a fixed clip) while the sea flows as in every other icon, 3.2s, solid
- [x] Sea is the same in every icon (Ross, 6 Oct 2026): `marine` (two waves), `seabed-repair` and `survey-rov` had a flattened static wave; each now carries the shared stroked sea (`pg-flow`, two extra periods outside a fixed clip) and the three icons now play that loop on reveal and hover
- [x] Two dummy video cards added to Tech (the PDF's "Reach Remote — the onshore ROC in action", "Reach Pilot — computer vision in action"), no badge on the card (Ross: the word is not needed), both opening the promo film until real footage exists
- [x] Plain-left heroes (Ross: "pad the left of the best candidates"): Survey, Services overview, Monitoring, Research and Technology use padded copies in `public/images/hero-*.jpg` (the left, and for Monitoring and Tech the sky and water around it, extended with a blurred stretch of the photo's own edge, feathered in; the originals are untouched and still used elsewhere). Focal point x = 1 keeps the subject right. In WordPress the editor would pick a photo with the subject on the right and click the focal point
- [x] Photo-hero lead: 760 measure and balanced wrapping (Ross: unbalanced lines), all two lines
- [x] Section subnav (Ross: a glitch clicking between pills): each pill is a full page load, which threw the page to the top and reset the row's sideways scroll. The bar now remembers whether it was docked and its sideways scroll and restores both on the next page

### Q84. Services › Technology & Innovation › Research & Publications (6 Oct 2026)
Context: the library of Reach's published research, a secondary page under Technology & Innovation. Source: client PDF p9 and the live Selection of Publications page (reachsubsea.no/selection-of-publications/). No question put to Ross; defaults taken from the template.
- [x] Sections: Hero Photo (ROV on the seabed) · Subnav (Research & Publications active; the PDF shows no active pill, but a lit pill tells people where they are) · Year bars (new, slim: a count per year 2013–2026, the PDF's "year-by-year counts") · Data list Publications (49 real entries, filter chips for year runs and topic, 10 shown then Load more) · Accordion (3 FAQs, drafted) · CTA panel
- [x] The live site lists **49** publications, the PDF says 48: the live list is used and the count comes from the data, never typed
- [x] Real data replaces the sample publications in `src/data/documents.ts`; the Investors demo reads it too
- [ ] Open for Reach: the topic grouping (Gravity & subsidence 25 · CO2 storage 11 · Passive seismic 13) is my draft; bylines carry only the first author's surname as on the live site; the FAQ answers and hero lead are drafted (the PDF has no copy for them); confirm 48 vs 49

**Answer:** built at `/services/technology-innovation/research-publications/`; new block `src/blocks/YearBars.astro` (docs/05 §2.17).

### Q83. Services › Technology & Innovation single (6 Oct 2026)
Context: the page for the technology under the three lines (Q79), on the service-single template. Source: client PDF p15–16 (from the 2Q 2026 Report). No question put to Ross; defaults taken from the template.
- [x] Sections: Hero Photo (Reach Remote 3 & 4 from above, dark water) · Subnav · Card grid 2 cols `pictogram-panel` (Pilot, Remote, Horizon, Relay: the page's focus) · Stats band Feature (750+ lead, 90%, 25x; two new key figures `fuel-saving`, `relay-speed`) · Split media (Reach Remote in service, links to the Assets page) · Card grid 2 cols icon "Established technology and research heritage" (Monitoring, Research) · Accordion (the PDF's 3 FAQs) · CTA panel
- [x] Dropped: the PDF's two illustrative video cards (no real footage), the "REAL" badges (review annotation), the research-library callout (folded into the heritage card), DNV named beside AROS (PDF p31, no third-party brands)
- [x] Pictograms from the library: Pilot survey-rov, Remote marine, Horizon technology, Relay subsea-telemetry. Reach to confirm the matches
- [ ] Open: Pilot, Horizon, Relay and Research & Publications pages are not built (links point at the planned URLs); DigiMon and ASUMO kept as the client wrote them

- [x] Figma (8 Oct 2026): page frame Pages / Technology & Innovation 566:30170; `Pictogram/needed` placeholder 571:2563 for Reach Pilot, Horizon and Relay

**Answer:** built at `/services/technology-innovation/`.

### Q82. Services › Survey single (5 Oct 2026)
Context: third service single, on the Subsea / Monitoring template. Source: client PDF p10–11 (Survey Services, Full Resolution screens), dev site survey projects. No question put to Ross; defaults taken from the template.
- [x] Sections: Hero Photo · Subnav · Split media (the PDF's "How we deliver", two paragraphs tightened to one pair) · Industries strip (4, PDF chips) · Lifecycle Focus (navy, placeholder tasks) · Card grid 3 cols (the PDF's six capability boxes, titles verbatim) · Card bento (Northern Maria, Surveyor Interceptor, DriX Orca, Reach Remote + the PDF's 500+ / 9 stats; "2 modes" is shown by crewed vs uncrewed cards) · Feed Projects (3) · Accordion (the PDF's 3 FAQs) · CTA Panel
- [x] The PDF's overlapping "How we deliver / Industries / photo" cards and the "Related services" row are dropped (nothing overlaps the hero; the Subnav does the related links); the video cards are dropped (no real footage, PDF p31)
- [x] Hero: Offshore Surveyor from above (calm green water, subject right); the PDF's blue Go Electra moves into the Split media
- [ ] Open for Ross/Reach: a named Survey contact (none on dev or PDF, so no contact card); capability summaries, scope items and lifecycle tasks are drafts; cable-route project has no date on dev (none shown); the site-survey project's dev photo shows a fishing-type vessel, and the cable-route photo is a sidescan mosaic (real, but not a vessel); Siem Pride and the other third-party vessels are named only in alt text

- [x] Figma (8 Oct 2026): page frame Pages / Survey 566:28950 (Split media `Show pictogram#566:5`, Lifecycle Focus Rail track 566:31484, Card scope)

**Answer:** built at `/services/survey/`; data in `services.ts` (survey capabilities, industries, `lifecycleTasks.survey`) and `projects.ts` (three survey projects, `year` now optional).

### Q81. Services › Monitoring single (6 Oct 2026)
Context: second service single, on the Subsea template. Source: client PDF p12–14 (Monitoring), dev site Monitoring page and its monitoring projects.
- [x] Capabilities as two grouped sections, as the PDF: Geophysical (6) and Environmental (3), each with its own heading and intro; the overview card's six labels are unchanged
- [x] Lifecycle block included (navy, Monitoring row, placeholder tasks for Reach to confirm)
- [x] Proof is the projects feed only (no video block): dev site has no gWatch video URL, and PDF p31 says video/spec links render only when a real file exists, so none yet
- [x] Hero: Northern Maria at sea (calm water, subject right), not the PDF's red vessel
- [ ] Open for Ross/Reach: a named Monitoring contact (none on dev or in the PDF, so the CTA panel shows no contact card); real gWatch video URL; a real ASUMO image (borrows the gWatch ROV photo); industries folded 5→4 (reservoir management + well integrity & drilling) with stand-in pictograms for geothermal and seismic; the gWatch ROV photo shows a third-party brand on the unit (PDF p31 bans third-party names in copy, not photos: confirm); the geophysical capability summaries and scope lists are drafts from the PDF intro and dev projects.

**Seismic risk monitoring pictogram (6 Oct 2026, same session):** the library's flattened glyphs can't be trimmed, so Ross pointed to the stroked originals in Figma (`Pictogram/subsea-telemetry` 394:7809; `seabed-scanner` is 394:7777): real 2.5 strokes, one vector per part, on the 96 grid. `src/assets/pictograms/subsea-telemetry.svg` is that file with parts tagged (`pg-arc`, `pg-cable`, `pg-sea`/`pg-wave`, `pg-dot`), and its 3.2s loop is in `Pictogram.astro` (swell, seabed sensors ping, box pings, a gap runs up the cable, antenna pings, sediment stirs). Industry tiles now use stroked Figma originals too: `carbon-storage` (394:7870) and `geothermal` (394:7959), both animated in `Pictogram.astro` on the same 3.2s cycle (CO2 letters hop, a gap runs round each arrow; swell + a gap rising up each heat arrow). The flattened `co2`/`mountain` exports are gone.

- [x] Figma (8 Oct 2026): page frame Pages / Monitoring 566:29560 (Feed grid Layout=Grid 4 columns 566:28682)

**Answer:** as ticked. Built at `/services/monitoring/`; data in `services.ts` (`Capability.group`, monitoring capabilities, industries, `lifecycleTasks.monitoring`) and `projects.ts` (four monitoring projects).

### Q80. Services overview cards: the sub-service lists (5 Oct 2026)
Context: the three line cards listed four chevron links each, to the dev site's child pages (`/services/subsea/imr/` and the like). Those pages are not being built (Q63: the capability detail lives on the single, the dev child URLs redirect there), and the client PDF has no sub-service pages in its sitemap, so every link led to a 404. Ross asked where they were meant to go and whether the PDF referenced them.
- [x] Plain list, no links or chevrons, six short labels per card cut from the PDF's capability boxes (Subsea p8, Survey p10, Monitoring p12), so the overview and the single say the same things; the card's one action does the navigating
- [ ] Chevron links, all to the single's capability section
- [ ] Drop the lists

**Answer:** as ticked. `subServices` is gone from `services.ts`; each line carries `scope` instead. Closes the open item in Q63. **Card stroke (same day):** the White card keeps its 1px stroke only on a white ground; on tint (as on navy since 4 Oct) the ground draws the edge. Site-wide, one rule in Card. **List marker (same day):** card scope lists take a 6px accent dot instead of the 19 Sep dash (Ross: a bullet, nearer the discs in rich-text prose); applies to the Subsea capability cards too. *Figma: Card scope list marker.* Done: List item 519:2513 (8 Oct 2026, Q144); scope also in Card None/Tint 566:2546 and Image top/White 566:2551 (8 Oct 2026, Services sweep).

### Q79. Three service lines, Technology & Innovation as the technology under them; 3D stage off Home (5 Oct 2026)
Context: the client now counts three services, Subsea, Survey and Monitoring. Technology & Innovation stays under Services but is what the three draw on (client PDF p15), not a fourth line. The client also asked for the "See our operations in 3D" stage to come off the Home page, since the 3D World already has enough entries. Ross asked what Claude thought: agreed on both, and recommended carrying the three-line count through the site rather than changing the Home block alone.
- [x] Full sweep: Home "Three services, one partner" (3 icon cards, 3 columns); Services overview "Our three service lines" (3 pictogram panels) with Technology & Innovation as its own Split media block after the lifecycle's foundation row; the Services mega menu keeps Technology & Innovation after a hairline, with Research & Publications as a plain row under it (Ross's review of the first cut: group labels and the Explore 3D World row and pill removed, the panel's foot strip carries the 3D World); the Services FAQ answer says three; brief sitemap noted
- [ ] Home block only
- [x] Remove the 3D World stage from Home; it stays on Services overview and Careers, plus the Services menu strip, the footer and the Assets hero
- [ ] Keep the Home stage until the client confirms in writing

**Answer:** as ticked. `serviceLines` keeps the Technology & Innovation entry (the Lifecycle foundation row, the Subsea single's handoffs and the menu read it); pages that list the lines filter it out. The Technology block's wording is drafted from the line's summary and the PDF p15 product names, for Reach to confirm. Figma to follow with the Assets overview pass.

### Q78. Assets: no single pages for vessels or ROVs; cards like the Q2 report (4 Oct 2026, Assets overview)
Context: the first build gave every vessel and ROV card a "View" link to a single page, with icon meta rows. Ross: none of the vessel or ROV cards will have a page of their own; the cards should be like the dev site's listing cards, the client PDF and p13 of the Q2 2026 report (`ref/REA26 2842 130 Q2 Report 2026 digital v3.pdf`, "Status of vessels and assets"), without the status row.
- [x] Card gains a `specs` field (label · value rows, no rules, labels in one column per card). Vessels: Charter · Owner · Crane · Assets (the client PDF's own labels, p20; Ross, 4 Oct 2026: short labels so the column never wraps). ROVs: Power · Depth rating · Size · Weight · Payload ("Size" for the dev's "Dimensions"; "Depth rating" kept), plus the spec sheet link where the file exists. DriX gets its four rows too. No actions on any of them
- [x] Vessel grid three across (the rows need the room), as in the report. **5 Oct 2026 sweep (Ross):** two across below 1320, where three squashed the values to three lines; the "In service" badge dropped from the vessel cards (Joining and Sale agreed stay), it stacked under the long kickers and the fleet register already says it
- [x] The Q2 2026 report (p13–16) is the newest client source and wins where the sites differ: Olympic Taurus's charter (April 2024 – April 2027, 1-year option), Havila Subsea's ROVs (2 Schilling HD WROV + 1 Surveyor Interceptor), Normand Jarstein's record (IMR and Construction Vessel, May 2026 – May 2028 + 1 year, Solstad Maritime ASA, 250 ton, 2 Constructors), Viking Vigor "2026 →"
- [x] With no single pages, the Vessels, ROVs and Equipment nav items become anchors into the overview (`/assets/#vessels`, `/assets/#rovs`, `/assets/#equipment`); Reach Remote, with Reach Remote 3 & 4 under it, is the section's one child page
- [x] Survey & monitoring equipment is its own block, not a card in the ROV grid (Ross, 4 Oct 2026: an instrument list is not an ROV; the PDF p20 also gives it its own section). Split media, image Start (the gWatch placement photo), with the two items as pictogram tiles under the lead (new Split media `tiles` field, library pictograms survey · global-monitoring) and Survey / Monitoring services as the actions
- [ ] Keep Vessels, ROVs and Equipment as pages of their own
- [ ] Vessels and ROVs as anchors, Equipment as a page

**Answer:** as ticked. This reverses the Q77 note "no charter periods on the overview cards": the report's cards carry them, so ours do. The `url` on each asset stays in `assets.ts` for the redirect map only (every live and dev `/assets/<slug>/` vessel and ROV single redirects to the overview's anchor).

### Q77. Assets overview: fleet visual, vessel row, Viking Reach (3 Oct 2026, Assets overview)
Context: first build of `/assets/` (Fleet overview), the Assets section landing page. Source: client PDF p19–22 ("08 — Services — Assets & Fleet"), rated "Dev" in docs/03 §5, so the dev site's `assets` post type supplies the data (survey of both sites, 3 Oct 2026: dev has 20 posts with spec tables, live 17 with almost none; neither has a type or status field). Page outline proposed by Claude: Hero Photo (PDF title and lead, stats moved below) · Subnav (Overview · Vessels · Reach Remote · ROVs · Survey & monitoring equipment) · **Fleet at a glance** · the chartered fleet as Asset cards · the uncrewed fleet as a Card bento · ROV systems on navy · Survey & monitoring equipment · projects feed · the PDF's three FAQs · CTA panel with Knut Jacob Medhaug, VP Group Assets.
- [x] First block under the hero: a slim custom visual, one marker per unit grouped by type (filled = in service, ring = joining), big figure per group, derived from `src/data/assets.ts`
- [ ] Fleet timeline track (vessel bars by year)
- [ ] Plain Stats band
- [x] Vessel row: all 11 vessels, one Asset card each (9 in service, Viking Vigor and NB76 with a "Joining" badge), four across from 1320; the Vessels child page adds filters and full specs
- [ ] 9 in service, newbuilds as their own section (PDF)
- [ ] A featured few plus "All vessels"
- [x] Viking Reach: stays in the fleet with a "Sale agreed" badge (MoA 4 Aug 2026, close expected Q4 2026; neither site marks it). Flag for the client in the handoff
- [ ] In service, no mention
- [ ] Leave it out (fleet would drop to 10 against the key figure 11)
- [x] Figma (8 Oct 2026): `Block/Fleet register` 601:15053 (Desktop 601:14839, Mobile 601:14943; Fleet group 601:14728, Fleet unit 601:14644, Fleet legend item 601:14645) on Blocks / Fleet register 601:14637; Card spec 599:31872 and Card `Show specs#599:6` (Q78 spec rows); Feed grid `Show row 3/4`; page frame Pages / Assets 606:20465. Ledger key sweep8OctAssetsFixes

**Answer:** as ticked. Also decided by Claude, open to change: no charter periods on the overview cards (they live on the Investors charter page); no per-class ROV unit counts (the per-vessel breakdown does not reconcile with the reported 15, and the Viking Reach sale changes it); where prose and spec table disagree on a dev page (Deep Cygnus and Olympic Triton ROVs, DriX 8 m vs 7.7 m) the spec table wins; Olympic Taurus keeps "In service" although its published charter ended April 2026 (the 2Q 2026 report lists it); spec-sheet links render only where a PDF exists.

### Q76. Favicon from the brand icon (22 Sep 2026, deploy sweep)
Context: the site had no icon link, so browsers asked for /favicon.ico and got a 404. Ross supplied `Reach-icon-600x600.svg` (navy R, sage bars bleeding to both edges). On the full 600 canvas the R is 40% of the square and smudges at 16px; a 478px crop around the R keeps 60px of each bar and reads. Comparison sheet: full canvas and crop, bare and on a navy tile, at 16 / 32 / 64 / 180 on light and dark.
- [x] Tab icon: the bare mark, 478 crop (`public/favicon.svg`, navy R in light tabs, white in dark; `favicon.ico` 16 + 32 for old browsers). Matches the header logo
- [ ] Tab icon: navy tile with the white R
- [x] iOS home screen: navy tile, white R, sage bars (`apple-touch-icon.png`, 180)

**Answer:** bare mark for the tab, tile for iOS. Built by `scripts/favicon.mjs`; listed for the WordPress developer in docs/09 §11.

### Q75. Contact page: open with the map, cards under it, pictogram contact cards (22 Sep 2026, Contact review)
Context: first build had a Text hero, the map beside a column of office rows, and the six mailboxes as two columns of rows. Ross found the right-hand address column confusing, the emails too far from their topics, and asked whether the hero was needed.
- [x] No hero: "Get in touch" (the page's h1) and the PDF lead are the map block's own header; the map follows straight under the site header. One-off to the "h1 lives in the Page hero" rule (docs/05 §0), because Contact has no siblings and nothing else to say first
- [ ] Keep a slim Text hero
- [x] Offices map: full-width map, the eight offices as a 4 × 2 grid of cards under it. A pin click opens an address card on the map and highlights its grid card; hovering a card lights its pin; a cluster click zooms until it splits and an "All offices" button appears to zoom back out. No zoom pill, no row buttons
- [ ] Keep the − / + pill too
- [ ] Keep the list beside the map
- [x] Key contacts by topic: six cards (3 × 2) with a line pictogram each from the design system's own library (Figma `33:74`, 74 pictograms), the mailbox as the card's link: `increase-percent-arrows` (Investor relations), `chat-active` (Press & media), `team` (Careers & recruitment), `handshake` (Sales), `money-stack-dollars` (Invoices), `shield-tick` (HSEQ). Ross's rule (22 Sep 2026): never invent a pictogram; if one is missing, ask. The library glyphs are flattened fills; their parts are tagged and moved by transform in Pictogram.astro. All six are traced as 2.5px strokes on the outline's centreline (Ross, third review: "redraw if it helps, line for line"; the handshake buttons keep the library's filled rings; the chat dots are drawn smaller than the library's, r 1.6 against 2.03, at Ross's request, so the Figma glyph should follow), checked by overlaying the trace on the glyph. Loops (after Ross's fourth review): the hands draw back, clasp with a spring and shake with a dying-away wobble; the coin spins and a settle ripple runs down both stacks; the tick trims and redraws while the ring turns; the arrowheads redraw first, the speed lines stay hidden until then and draw in column by column, then the percent pops; the bubbles take turns with small dot pops; the team does a plain roll call (each lifts in turn, no leaning)
- [ ] Library pictograms only
- [ ] Keep the list, address under the topic

- [x] Follow-up (Ross, second review): the address card and the "All offices" button had no padding (they used a spacing token that doesn't exist, `--20`; now 16/24 and 16). The full-width map's dots were coarser than Home's (columns are fixed per width band, and the Contact map is 1312 wide against Home's 828), so `DOT_PRESETS` gets a third band from 960px of map width (regular 88 columns; fine 128; finer 176) and the poster CSS a matching container query: the pitch now stays near 11–15px on both pages. Also from this review: a cluster click fits every office in the cluster in one go (`clusterClick: 'fit'`; Home keeps the one-step `expand`), and the map pans when an address card would open past its edge.
- [x] Third review: hovering a grid card pulses its pin once (the Live operations pulse, one cycle, only on maps that aren't already pulsing). Address card padding 24 all round; the card itself takes focus on open (the close button's focus ring showed on every pointer open). Footer: the Contact link moves from the Company column to the top of Get in touch. Rule (docs/08 §2): an icon beside text aligns to the first line of the text (MetaItem), never the middle of a wrapped address.

**Answer:** as ticked. The Contact list block (§2.17 draft) is dropped: the mailboxes are a Card grid, 3 columns, icon media. The 4:3 `offices` map frame from the first build is removed again: the full-width map uses the standard `wide` frame.

### Q74. Site-wide mobile and scrim notes (22 Sep 2026, all pages)
Context: Ross's notes with ref/side scrim.jpg, ref/mobile hero.jpg and ref/service cards mobile.jpg. On phones the photo heroes and image cards ran the photo behind all the text, so both read as busy; the tint service cards inside the page gutter left the text about 260 wide.
- [x] Photo hero, right fade: 22% → 10% of the photo, and only above 1240, where the photo has an edge to hide
- [x] Photo hero below 900: the photo becomes a band across the top (90vw tall, max 560; near square on phones, so ~75% of a 3:2 image shows instead of ~30%), fading into a solid navy panel that holds the text. The title starts 70% of the way down the band; breadcrumb stays pinned under the header
- [x] Hero type on phones: the lead steps down to Body (16/24). The title keeps H1 (40): H2 is 32 on phones, the same as the section headings, so a smaller title would flatten the page's top level
- [x] Pictogram card grids (Media icon or pictogram panel) below 600: no container; open rows across the full column with a hairline between rows, pictogram 96. Light grounds only
- [x] Image bg cards below 600: the photo takes the top of the card (4:3, about 55% of a typical card) and fades into a solid navy/900 panel for the text

- [x] Follow-up (Ross: cards too narrow at ~620): card rows (Card grid, Card bento, Feed grid) go to one column below 768, not 600; wide pictogram cards (Services' four lines) stay one column below 900, where the card puts its pictogram beside the text; the editorial feed's lead + stack starts at 1000, not 900. A card sweep (600–1399, every page) is now in docs/08 §1
- [x] Photo hero height (ref/squashed.jpg): min-height grows with the width, `clamp(640px, 47.2vw, 800px)`: 640 to ~1360, 680 at 1440, 800 from ~1700 (inside the photo's native 820, so no enlarging). Phones and tablets unchanged
- [x] Photo hero right edge on wide screens (ref/scrim.jpg): first built as A (a blurred copy of the photo filling the frame); Ross tried it and it didn't work. **Final: C + D**: above 1240 the photo keeps a centred 1240 photo's left edge and grows right to the screen edge, capped at 1600 (≤1.29×, ~1.25× at 1870), with a 30% right fade into navy. The left fade and the ellipse under the copy stay 1240-based. Not chosen: B the 10% fade to flat navy
- [x] Four-across rows (Card grid 4 columns, Card bento, Feed grid 4 columns) start at 1320, not 1200 (Ross picked this over leaving them or tightening padding)

**Answer:** as ticked (Ross's proposals; details decided by Claude, open to change). ref/image cards.jpg arrived later; it shows the before state (text over the photo) that the image card change fixes.

### Q73. Contact page: source conflicts and page shape (22 Sep 2026, Contact)
Context: the client PDF (p59, "27 — Contact") and the dev site's /contact/ disagree on a few values, and the dev map pins places the PDF only mentions. Every address, number and email on the page must come from one of the two, cited per entry in `src/data/contact.ts`.
- [x] Singapore: the PDF's 100G Pasir Panjang Road, #03-07/08, Singapore 118523 (the client's newer document)
- [ ] Singapore: the dev site's 22 Pandan Road, 609274
- [x] Aberdeen: both the PDF's email (commercial.abz@reachsubsea.com) and the dev site's phone (+44 (0)1224 418210)
- [ ] Aberdeen: one of them only
- [x] Presence pins: the PDF's three "also present" places (Göteborg, Rio de Janeiro, Cyprus) as quieter pins without cards; Houston and Trinidad & Tobago (dev only) left off
- [ ] All dev pins, including Houston
- [ ] Offices only, presence as a text line
- [x] No CTA band: the FAQ closes the page, as in the PDF (the footer carries phone, email and socials)
- [ ] CTA panel (Open positions or Investors)

**Answer:** as ticked. Also decided by Claude, open to change: the office keeps the client's label "Sandnes (Stavanger)" with "Sandnes" on the map pin; no mailbox is tied to an office (they are company-wide) and the HQ row carries the general phone and post@ from `contactDetails`. Page: Hero Text (navy) · **Offices map** (new block: dot-matrix map beside the office list, HQ first, "Also present in…" under the list) (white) · **Contact list** (the six topic mailboxes as a two-column list of rows, not six cards) (tint) · Accordion Split, the PDF's three FAQs with answers built from the data (white). The map is the homepage's dot-matrix map, extracted into shared pieces (`src/lib/dot-map-client.ts`, `src/components/DotMap.astro`) that Live operations and Offices map both use; the Live operations block was checked element by element before and after (docs/07 §3).

### Q72. Live operations map: dot density (22 Sep 2026, Live operations)
Context: with the dots no longer cut at coastlines (Q71), the density was a free choice. Compared live on the review page with a temporary Dot density toggle (Regular · Fine · Finer) and a stacked comparison image at 1440.
- [x] Regular: about the size of the old map's dots (3.4px on a 13px pitch at 1440)
- [ ] Fine: the smaller dots from the review screenshot
- [ ] Finer: reads as a texture

**Answer:** Regular. It is the block's default (`dots="regular"`); the toggle was removed after the choice. The presets stay in `src/lib/dot-map.ts` so Contact or a future page can pick a finer grid if it ever suits.

### Q71. Live operations map: jump on load, and dots cut at coastlines (22 Sep 2026, Live operations)
Context: the static poster (an Equal Earth world) and the MapLibre map (Web Mercator, cropped) were two different pictures, so the map appeared to zoom when it faded in. And the live map drew land by clipping a tiled dot image to the country polygons, so any dot on a coastline was sliced; smaller dots only made it rarer.
- [x] Dots fixed to the screen while panning and zooming: the land moves under the grid (as before, and the usual dot-matrix look)
- [ ] Dots stuck to the land, re-gridding at each zoom step
- [x] Poster becomes the same Mercator view, framing, grid and land mask as the live map
- [ ] Keep the Equal Earth poster
- [x] Dot size: smaller than before, but compare first (Q72)

**Answer:** Fixed. The live map no longer draws land with MapLibre at all: a canvas overlay lays a hex grid over the map every frame and draws a whole dot wherever the grid point falls on land in a Mercator land mask (`/data/land-mask.png`, 23 KB, Natural Earth 1:50m rasterised at build time with sharp). The poster is the same grid, tested against the same mask, in the same framing box (`src/lib/dot-map.ts` holds the framing, presets and maths for both), so the fade-in is invisible: 99% or more of poster dots sit under a live dot at 1440, 1100, 800 and 375. Columns are fixed per width band so the pitch scales with the map and the poster and overlay stay aligned. The 45 KB countries GeoJSON is gone. Docs/07 §3.

### Q70. Web standards and accessibility audit (21 Sep 2026, WordPress handoff)
Context: HTML validator (html-validate) and axe-core (WCAG 2.2 AA + best practice) on the 8 built pages, plus manual checks of motion, focus, keyboard and contrast over photos. Nothing seriously wrong. Two WCAG failures: the 3D World poster loop had no pause control (2.2.2) and the Investors Timeline track couldn't be scrolled by keyboard (2.1.1).
- [x] Fix the failures and the minor validity items, and log the WordPress handover points
- [ ] Log only

**Answer:** Fixed. New shared **`MediaToggle`** component (pause/play), used by the hero video and the 3D World poster loop. The Timeline track is a focusable region with an inset focus ring. Mega-menu panels lose their stray `aria-label`. Hero `h1` uses a `visually-hidden` full title instead of `aria-label`. Section subnav is named "{Section} section", so it no longer clashes with the footer's "Company" nav. `#3d-world` becomes `#world-3d`. The Euronext iframe loses `width="100%"` (CSS sets it). Phone numbers don't wrap, and CTA contact links are at least 24px tall. Result: axe finds zero violations on all 8 pages. Handover points are in docs/09 §10, and the new checks are in docs/08 §6. **Figma (22 Sep 2026):** Media toggle component set (State Playing/Paused × Interaction) on the Components page, a new player-pause icon, and instances in the Page hero Video and 3D World Poster stage; IDs are in `docs/extract/figma-*-ledger.json`. **Kept the pause button (22 Sep 2026)** over the other passing option (stop every loop within 5 seconds), so the hero and 3D World poster keep their living loops.

### Q69. No stray type sizes, colours or spacings (21 Sep 2026, project tidy)
Context: an audit of `src/` found 25 font sizes and 20 line heights off the token scale, 5 raw letter-spacings, 52 raw `rgb()` scrim and hairline colours, a duplicated card scrim, two hex colours in the mobile review frames and a handful of raw 2-12px gaps.
- [x] Snap to the existing scale wherever the difference is a pixel or two: 13 px labels → `caption`, 15 px → `body-sm`, FAQ question and answer → `body` and `body-sm`, the Stats band lead figure → `display`, the mobile video hero title → `h2`, map markers → `eyebrow` and `caption`
- [x] Add tokens only where a real, repeated role had none: **`display-xl`** (64 → 128, the Figures block's giant figure), **`figure`** (32 → 40, figures in cards and bands), `line-height/tight` (1.3), `letter-spacing/figure` and `letter-spacing/display-xl`
- [x] Every `rgb(27 29 59 / a)` and white-alpha becomes `color-mix()` over a palette token; the two card scrims are tokens (`--wp--custom--scrim--card-up`, `--card-across`)
- [ ] Leave the raw values

**Answer:** Done in code, with no layout change beyond about a pixel (checked on Why invest, Investors, About, Subsea, Careers and the Home mobile hero). **Left on purpose:** 1-3px rules and rings, optical nudges in `em` (`-0.05em`, `0.12em`), fixed geometry (control heights, column widths, the 22px Date tile band) and animation timings, which are choreography rather than tokens. **Figma to add:** the six tokens above (Typography and Layout collections, Desktop and Mobile modes).

### Q68. Norwegian version (21 Sep 2026, WordPress handoff)
- [x] No Norwegian version: the site is English only
- [ ] Norwegian at launch
- [ ] English first, Norwegian later

**Answer:** English only, with no translation plugin. Fields stay single-language. If a translation is ever wanted, it is a separate project (WPML or Polylang plus translatable fields).

### Q67. Split three flexible blocks (21 Sep 2026, WordPress handoff review, docs/09)
Context: the review found three blocks too flexible for editors: Card grid's Bento (a column and row span on every card), Split media (7 media types × 4 layouts, most fields apply to one type) and Stats band's Results style (a different block).
- [x] Split them now, in the prototype, before the developer starts
- [ ] Leave them for the developer

**Answer:** Split now. Built:
- **Card bento** (`reach/card-bento`): pick a `pattern`, fill its cells in order. Five patterns, lifted from the approved bentos: lead-quad (Investors), lead-tall-wide (Subsea), lead-tall-trio-a (Home), lead-tall-trio-b (Services), trio-wide (Careers). `CardField.span` removed.
- **Figures** (`reach/figures`) and **Split embed** (`reach/split-embed`) out of Split media. Split media is Image · Video · Spec table · Numbered list. The Card media (and the banner card under a stacked list) was **dropped: unused on every page** (git history and `backups/SplitMedia.astro.2026-09-21-pre-split` have it if it is wanted back).
- **Results band** (`reach/results-band`) out of Stats band, which is now Plain · Panel · Feature.
- **Checked:** no visual change. Every element's position, size and 16 computed styles on the seven built pages at 1440 · 1100 · 800 · 375 were compared before and after (zero differences), plus the reveal start states. Block count in code: 22. Demos and registry entries added for the four new blocks.
- **Figma: added 21 Sep 2026.** Doc frames on page Blocks (`12:25`): **Card bento** `310:4981` (set `312:10744`), **Figures** `314:6177` (set `316:6183`), **Split embed** `319:6246` (set `320:6274`), **Results band** `321:6312` (set `322:6434`), plus the two custom visuals that were also missing, **Lifecycle** `324:6654` (set `328:6684`) and **Values** `329:6823` (set `331:6958`). IDs and gotchas in [extract/figma-blocks-ledger.json](extract/figma-blocks-ledger.json) → `phase4Tidy21Sep`.
- **Open:** The Split embed loads its iframe without the Embed block's consent placeholder (as before): route it through consent before launch. Why invest's four reasons still type a few figures (`+84%`, `750+`, `1,172.5m`) that should be quoted from the options pages.

### Q66. Careers overview (20 Sep 2026, Careers overview)
Proposal answers and review rounds, `/careers/`:
- [x] Hero: calm sea photo (`ocean-horizon-calm`), Animate, "Open positions" to HR-Manager; the PDF's stats panel moves to the first block below the hero (never over its edge)
- [x] Vacancies: a link plus a **sample snapshot** of the live HR-Manager list (20 Sep 2026), marked as a placeholder for the developer's feed
- [x] Offshore / Onshore: the dev site's two paths were tried as cards, then dropped in review; the PDF's "Offshore & onshore, side by side" photo card covers it
- [x] "Who thrives here": heading over two text columns (About's Wide layout, no image), copy from the live page unchanged. The four value cards use the animated Learn / Teach / Reach pictograms and a new **Never leave anyone behind** one (friend drifts along a rope)
- [x] Trainees: Split media with the workshop photo (no stacked CTAs); the PDF's "Learn about the trainee program" link is back, pointing at `#`
- [x] "More about working here": the PDF's composition (three text cards to the child pages, then a wide and a narrow photo card)
- [x] CTA panel: PDF wording, short (rule in docs/05 §2.9); panel and contact stack below 1200
- [x] Backgrounds do not have to alternate white / tint / navy
- [x] **3D World banner (21 Sep 2026):** now that reach-world has a careers route (v45–v48: "From ship to seabed", five stops, "Fly a survey line"), the Careers page gets the Home page's poster embed after Trainees (Ross chose the poster embed, after Trainees), titled with the world's own start-view wording and opening the world on `?careers=1` (`worldCareersUrl` in `src/data/world.ts`). Phones get the poster plus "Open 3D World". **Open:** the published GitHub Pages scene has no careers route yet, so until reach-world is republished the link opens the ordinary world; the stop paragraphs there are still marked "Draft text, Reach to confirm"

**Answer:** Built as above; section list in docs/05 §3. **Redirects:** `/careers-subpage-contacts-questions/` (live and dev); dev `/careers/people/*`, `/careers/opportunities/*` and `/careers/explore-your-path/*` → `/careers/`; dev `/careers/why-work-with-us/life-at-reach/` → `/careers/life-at-reach/`; dev `/careers/people/our-culture/` → `/careers/our-culture/`; the other Why-work leaves → `/careers/why-work-with-us/`.
**Photos (Ross, 20 Sep 2026):** every photo taken from the live or dev site is approved for the prototype as a rule, people included; no per-photo permission questions. Client-side licensing is the client's to clear at launch.
**Open with the client:**
- Target of "Learn about the trainee program" (no trainee page in the client sitemap: new page, or a section of an existing one?)
- Dev role lists (ROV pilots, surveyors and so on: kept in the dev site's Explore your path, not shown) and the recruiter details (Alexander Nygård Bakke, from the live page)
- A calmer, people-free hero shot and a better people photo than the lounge one
- Real quotes and a benefits list (blocked for the Life at Reach and Why work with us pages)
- Headcount: 400 on the live site vs 500+ in the PDF (the page uses 500+ from `key-figures.ts`)
- Vacancies are a 20 Sep 2026 sample; two of the four closed that day
- The PDF's "Career growth" and "Meet our people" cards have no page in the sitemap; the third card links Why work with us instead
- Visa sponsorship and global rotation answers on the dev FAQ are not on the live site: left out until the client confirms

### Q64. Photo tint and scrims, site-wide (19 Sep 2026, Subsea review)
Context: Ross's Figma card (Reach-Subsea 4773:22545) screen-blends the photo over navy, so every image carries a subtle brand colour.
- [x] Site-wide on photos (hero, cards, media frames, video, social and statement photos; logos, SVGs and the 3D World poster untouched)
- [ ] Subsea page only for now
- [ ] Site-wide, but not people

**Answer:** Site-wide. Token `image-tint` = navy/900; to soften, point it at navy/800. Follow-up (same review): photo scrims never fade to 0. They ramp from `scrim/solid` (navy/900) behind the text to `scrim/floor` (navy 10%) at the far edge, on every image-bg card, bento card and Split media banner. docs/05 §0. *Figma to add both tokens and the treatment.*

### Q63. Subsea services page (19 Sep 2026, service single)
Proposal answers and review rounds, `/services/subsea/`:
- [x] Download the dev site's asset and project photos for the fleet bento and projects feed
- [x] Named contact on the CTA panel: Emil Spieler Palmers, Subsea BD Manager (shared `ServiceContact` shape in services.ts, one per service line)
- [x] Lifecycle as a **Focus** layout (the overview's Subsea row, zoomed in), not a new diagram
- [x] Hero photo: rov-supporter-subsea; title shortened to "Subsea inspection, maintenance and repair", lead to one line
- [x] Capabilities keep the PDF's **six boxes in its own wording**, as tint cards with 3-item scope lists (a first build merged them into four and read too text heavy)
- [x] **No child pages, no links** on the capability cards (they would be thin pages; the detail lives here)
- [x] "Industries we serve" (PDF pills) as an icon strip after Ross's "Where it's used" reference, not photo cards (too heavy). New Oil & gas and Offshore wind pictograms with the same loop feel (wave flow; rotor turn; crane luffs, pays out the hook line and runs a gap down the line into the sea)
- [x] Lifecycle moved up under the industries strip on **navy**, to break up the text-heavy first half; capabilities follow on white
- [x] Figma (8 Oct 2026): Pages / Subsea services 359:4009 brought up to the code: subnav 6th pill Research & Publications, Split media pictogram and copy, capability cards with scope lists (603:33422), bento title "Vessels and ROVs" with photos, projects as Feed grid Grid 4 columns (604:21600), CTA on tint. Ledger key sweep8OctAssetsFixes

**Answer:** Built as above; section list in docs/05 §3. **Open:** the lifecycle cell mapping and per-phase tasks are placeholders until Reach confirms. The Services overview's Subsea card sub-links point to child pages that won't exist: they should go to `/services/subsea/#what-we-do` or be dropped (overview chat), and the old dev child URLs redirect there too. The Supporter WROV depth rating is left out until confirmed.

### Q62. Investors overview: what comes back from the PDF (19 Sep 2026, Investors overview)
Context: the first build cut the PDF's share-price card, Highlights tabs and CEO letter + video.
- [x] Share price: show the live OMS graph on the Overview too (Split media Embed, same crop as Why invest)
- [x] Highlights: the "Q2 2026 at a glance" bento is the highlights; only the Q2 / Annual / Sustainability tabs stay cut (no figures behind them)
- [x] CEO letter: the PDF's Q2 quote (Jostein Alendal, CEO) + a 53 s clip from the Q4 2025 webcast (qcnl.tv, 1:30–2:23) in the video dialog

**Answer:** All three as above. Split media gained a `quote` option (quote as H3 in place of the heading, the title kept as a hidden H2). Client to supply: confirmation the quote is approved for the site, and the Q2 2026 webcast so the clip matches the quarter.

### Q61. Why invest: four reasons layout (18 Sep 2026, review round 3)
Context: with the Results band now directly above, the pinned-figure scroll took ~1,700px for ~200 words, showed one figure at a time, and repeated two figures from the band (EBIT +111%, cash 410.4m).
- [x] 2×2 figure grid: all four visible, each led by a figure the band doesn't show (+84% net profit, 750+ days, 54/46 revenue mix bar, NOK 1,172.5m equity)
- [ ] Keep the pinned scroll, shortened
- [ ] Keep as is

**Answer:** 2×2 grid, on the light (tint) background. **Review round 4:** reworked to cards on white. The three value reasons are stacked as cards (title → body → figure), and revenue mix is a feature card with a donut chart. The Results footer moved to a Navy panel with three evenly spaced items. Section grounds (round 4): Results white with a tint footer strip · Reasons white · Share tint · Strategy white (tint cards; the market opportunity banner removed) · FAQ tint · CTA tint.

### Q60. Share price on Why invest (18 Sep 2026, Why invest)
Context: the PDF's chart is sample data. The dev Share info page embeds `https://ir.oms.no/component/standardPage?token=reach_std&lang=en` (a full ~2,200px OMS page: quote, chart, profit calculator, etc.).
- [ ] Placeholder slot
- [ ] Link out only
- [ ] Styled sample chart
- [x] Use the real OMS iframe

**Answer:** Use the ir.oms.no iframe, as on the dev Share info page. Prototype: the same standard page, cropped to the quote + chart (top ~520px), plus a link to Share info for the rest. Developer note: ask OMS for a compact share-graph module token so we don't need to crop.

### Q59. Why invest additions (18 Sep 2026, Why invest)
All built from the client PDF's own data.
- [x] Proof figure per reason (cuts the separate "Proof points" section, which repeated them)
- [x] Revenue mix bar (54% oil & gas / 46% renewables & other, Q2 2026) inside reason 3
- [x] Next report date strip (Q3 2026 · 17 Nov 2026 + add to calendar)
- [x] IR contact in the CTA (Arne Joa, CFO, from the live site)

**Answer:** All four.

### Q58. Investors section subnav placement (18 Sep 2026, Why invest)
- [x] Directly under the hero, sticky; docks under the header on scroll (keeps the transparent header over the photo)
- [ ] Under the header, above the hero
- [ ] Inside the hero, bottom edge

**Answer:** Under the hero, sticky. The breadcrumb moves to the top of the hero (just under the header), apart from the title stack. Drop the eyebrow where the breadcrumb and title already say it.

### Q57. Hero direction across the site (18 Sep 2026, Why invest)
Context: the PDF uses a navy→sage gradient on Investors/Company pages and photos elsewhere.
- [x] Photo/video hero (navy scrim) on story pages; plain navy Text hero on data pages (Reports, Calendar, Governance). No gradients anywhere
- [ ] Photo everywhere
- [ ] Gradient everywhere

**Answer:** Photo + text hero. Consistency comes from shared structure (height, breadcrumb position, type, scrim), not an identical look. The gradient is dropped: it reads as generic, and the PDF only needed it because its photo heroes lacked a scrim (fixed by Q40).

### Q56. Live operations map: placement (17 Sep 2026, docs/07)
Context: the client PDF puts a "live zones" panel over the Home hero. The user decided on a standalone block instead of a hero overlay.
- [x] Home straight after the Stats band, plus the Assets overview
- [ ] Assets overview only
- [ ] Home only

**Answer:** Home after Stats + Assets overview, once the prototype is approved. The homepage is unchanged until then.

### Q55. Live operations map: public exposure (17 Sep 2026)
- [x] Sea regions with generic asset labels. No positions, no client names, no vessel names
- [ ] Regions + named vessels
- [ ] Nothing public yet

**Answer:** Regions, generic labels. Still needs the client's sign-off before anything goes public.

### Q54. Live operations map: data approach (17 Sep 2026)
Context: AIS can't see ROV spreads; a manual list goes stale. Options: manual ACF list, AIS API, or a hybrid.
- [ ] Manual ACF list, AIS check later
- [x] Hybrid from launch: manual ACF list plus a daily server-side AIS check that flags drift to the editor
- [ ] AIS API only

**Answer:** Hybrid from launch. No provider chosen or signed up to yet. Next: the client supplies the MMSI/IMO numbers of the vessels to track, and we get quotes (Datalastic, VesselFinder, MarineTraffic/Kpler, Spire) for about 10 vessels checked once a day, with satellite coverage for Brazil and SE Asia. The provider choice comes back to the user before any commitment.

### Q53. Home redesign brief (17 Sep 2026, Phase 4 — Home page)
Context: the first coded Home felt generic. The user's brief, all built the same day: container 1440; video hero (hero.mp4) at viewport height with navy side/bottom fades, animated title and CTAs, scroll parallax, no photo caption; more space above CTAs; "What we do" as a bento of mixed Card variants with no intro; Stats with no header, stats entering one by one and counting up from 0; 3D World with one CTA, no eyebrow, zones inside the stage under their own names; Selected projects removed; LinkedIn (dummy), FAQ, CTA, darker footer; the four service cards moved down into one row of portrait cards.
- [x] Built as briefed. This supersedes Q45-Q48's cuts (bento, LinkedIn row and FAQ are back on Home).

**Answer:** Built. Notes: Astro stays (everything is CSS + small vanilla JS, which ports to the WP theme as-is). hero.mp4 is a 3D World screen recording with its UI baked in, so the hero crops/fades around it and loops at 15 s before a side panel appears: a clean export without UI is wanted. Photos come from `~/Desktop/reach-world/3dw-reach images` (local, no downloads). Zone names come from the reach-world build, not the client PDF's draft names. Figma still needs the same changes (container 1440, Card Media Stat, Card grid Bento, Feed grid Editorial, CTA Panel, Page hero Video).

### Q52. Home: "Latest from Reach" and "Reach Newsroom" (17 Sep 2026)
Context: with a news card in the bento, then Latest, then Newsroom, then LinkedIn, Home had four news-like sections in a row.
- [x] Merge into one "Reach Newsroom" section with a mixed-card editorial layout (lead story + report + news + event), then LinkedIn
- [ ] Keep both

**Answer:** Merge (Claude's recommendation, accepted).

### Q51. Imagery for the prototype (17 Sep 2026)
- [x] Real Reach photos. Recommendation was to download from the dev site, but 12 suitable photos were already local in the reach-world project, so nothing was downloaded.
- [ ] Only stills from hero.mp4
- [ ] Keep placeholders

**Answer:** Real photos, sourced locally into `public/images/`.

### Q50. Header over the hero (17 Sep 2026)
Context: changes the 15 Sep "always solid white" decision for pages with a photo or video hero.
- [x] Transparent over the hero (white logo and links), solid white once scrolled or when a panel opens (`<Header overlay />`)
- [ ] Keep solid white everywhere

**Answer:** Transparent over the hero (Claude's recommendation, accepted).

### Q49. Header bar links and the hamburger menu (17 Sep 2026)
Context: eight links felt like too many. The dev site's hamburger shows featured content.
- [x] 6 links: Services, Assets, Company, Investors, Careers, Contact. Projects and Newsroom move into a reimagined Site menu (large links + latest project card + news + events + 3D World). Site menu now starts at 1200; 900-1199 gets the Mobile menu.
- [ ] 5 links, like the dev site
- [ ] 4 links

**Answer:** 6 links (Claude's recommendation, accepted).

### Q48. News on Home (16 Sep 2026, Phase 4 — Home page)
Context: the PDF has both a 3-card "Latest from Reach" spotlight (report/news/event) and a separate 4-card "Reach Newsroom" grid right below it. docs/05 §3 already specs a single "Feed Latest" block for Home.
- [x] Just Feed Latest (report + news + event) — matches the already-agreed docs/05 §3 Home row
- [ ] Replace it with a Feed News grid instead (4 recent news cards + "See all News & Reports")
- [ ] Keep both, stacked

**Answer:** Just Feed Latest. Cuts the separate Newsroom grid and the LinkedIn feed row (already flagged as placeholder-only in docs/03).

### Q47. Hero CTA #2 label (16 Sep 2026, Phase 4 — Home page)
Context: the PDF's second hero button is labelled "Beyond the surface" with no clear destination.
- [ ] Relabel it "About Reach Subsea" → /company/
- [x] Keep "Beyond the surface" as the label → /company/
- [ ] Drop the second action

**Answer:** Keep "Beyond the surface", linking to /company/.

### Q46. "Ocean operations, reimagined" bento (16 Sep 2026, Phase 4 — Home page)
Context: the PDF's bento between the hero and the stats strip has 5–6 tiles: global fleet, uncrewed pioneer, a crewed-vs-remote comparison, a "750+ uncrewed operational days" stat, and two service-image tiles that repeat the Services card grid below it.
- [ ] Cut it entirely
- [ ] Keep a 3-card "Why Reach Subsea" pillar row
- [x] Fold the 750+ stat into the Stats band

**Answer:** Fold "750+ uncrewed operational days, per quarter" into the Stats band as a 5th key figure (`uncrewed-days` in key-figures.ts); Home picks Fleet · People · Countries · Uncrewed days for its 4 stats, dropping Established for this page (kept in the data file for other pages). The rest of the bento (fleet/uncrewed pillars, the two service-image tiles, the crewed-vs-remote comparison) is cut — the Services card grid, 3D World embed and Split media on other pages already cover that ground.

### Q45. Home stats: which key figures (16 Sep 2026, Phase 4 — Home page)
Context: the PDF's Home stats strip (Established 2008 · Fleet 11 · People 500+ · Countries reached 9) didn't match the placeholder set already in `key-figures.ts` (Employees 500+ · Vessels 9 · Operating modes 2 · Remote ops centre 24/7) — both used "9" for a different fact.
- [ ] Keep the existing key-figures set
- [x] Switch to the PDF's numbers
- [ ] Add the PDF's numbers as new keys, keep both

**Answer:** Switched `key-figures.ts` to the PDF's real, current figures (Established 2008 · Fleet 11 · People 500+ · Countries reached 9), since it's the one shared stats source for the whole site. See Q46 for the 5th key added for Home specifically.

### Q41. CTA band on mobile (16 Sep 2026, Phase 3b)
Context: docs/05 §2.9 said `space/24` inside the Inline callout on mobile; Figma drew 48. The designer then updated both Mobile variants in Figma (Band `178:2767`, Inline `179:2774`).
- [x] Use the updated Figma Mobile frames: callout padding 48 top/bottom and 40 sides
- [ ] 24 on mobile, as the old spec text

**Answer:** Two follow-ups settled the conflicts with the foundations: the **Band insets its content to 40** on mobile (CTA band only — the grid margin stays 24 for every other block), and the block's own vertical padding on mobile is **48 for both styles** (`space/48`, not `section/md` = 64). Figma's Inline Mobile outer frame (24 vertical) should be updated to 48 to match.

### Q42. Gallery videos: type and duration line (15 Sep 2026, Phase 3b)
Context: Figma video cards show an eyebrow like "ANIMATION · 1:45", but the Gallery fields in docs/05 have no type or duration, so the build leaves it out.
- [ ] Add `type` + `duration` fields to each video, rendered as the card eyebrow
- [x] Leave it out and remove it from Figma

**Answer:** Leave it out. The eyebrow still needs deleting from the Figma video cards.

### Q43. Logo strip SDGs per row (15 Sep 2026, Phase 3b)
Context: the spec text says 4 SDG tiles per row; Figma shows 6.
- [x] 6 per row, as Figma (as built)
- [ ] 4 per row, as the spec

### Q44. Data list archive toggle label (15 Sep 2026, Phase 3b)
Context: the dev site swaps "Show all years" to "Show fewer years" when open. The build keeps "Show all years (N)" and flips the plus/minus icon plus `aria-expanded`.
- [x] Keep the label, flip the icon (as built)
- [ ] Swap to "Show fewer years" when open

### Q37. Phase 3 scope (15 Sep 2026, Phase 3)
Context: the brief says "Figma block specs + coded equivalents"; there is no code project yet. Spec: docs/05-blocks-spec.md.
- [x] Figma first for all 14 blocks (sequential writes), then code them as Phase 3b with parallel Sonnet agents
- [ ] Figma + code per block
- [ ] Figma only, code in Phase 4

### Q38. Prototype stack (15 Sep 2026, Phase 3)
- [x] Astro, static: one component per block, props = block fields, CSS custom properties named like theme.json output (`--wp--preset--*`, `--wp--custom--*`)
- [ ] WordPress block theme (wp-env + ACF blocks)
- [ ] Plain HTML/CSS/JS

### Q39. Contact forms (15 Sep 2026, Phase 3)
Context: dev has a Gravity Forms contact form under tables and a slide-out on every page; PDF Contact uses offices + topic mailboxes; Phase 2 built no form fields.
- [x] No forms in v1: topic mailboxes, phone and named contacts (CTA band + Card grid). Embed = 3D World · Iframe · Map
- [ ] One contact form
- [ ] Forms on key pages

### Q40. Page hero with a photo (15 Sep 2026, Phase 3)
Context: the PDF puts white text on busy photos with little scrim (~8 pages).
- [x] Full photo + flat 64% navy scrim (`bg/overlay`), text bottom-left; white text ≈5:1 even over a white photo. Same treatment as Card Image bg
- [ ] Split: text + framed photo
- [ ] Both as variants

### Q33. What does the header hamburger open at ≥1200? (15 Sep 2026, Phase 2)
Context: the header recommendation benchmarked 8 peers; only Vard uses a desktop hamburger, and it hides its nav. See docs/extract/header-recommendation.md.
- [x] Site menu: full site index + utility (FAQ, Open positions, contact, social, legal); same content as the mobile menu
- [ ] Utility links only
- [ ] No icon at ≥1200

### Q34. Sticky header behaviour (15 Sep 2026, Phase 2)
- [x] Fixed; 96 → 72 after scrolling; hides on scroll down past 400px, returns on scroll up; the subnav docks to the top while hidden
- [ ] Always visible at 72
- [ ] Static

### Q35. Header over dark photo heroes (15 Sep 2026, Phase 2)
- [x] Solid white on every template in v1; a Navy header remains possible later via the Color mode
- [ ] Transparent on photo heroes

### Q36. Contact email in footer and menus (15 Sep 2026, Phase 2)
Context: the old Figma footer says post@reachsubsea.no; the dev mega menu says post@reachsubsea.com.
- [x] post@reachsubsea.com
- [ ] post@reachsubsea.no
- [ ] Placeholder

### Q29. Header scope (15 Sep 2026, Phase 2)
Context: the dev site has mega-menu dropdowns and a solid white fixed header. The brief listed a Contact button.
- [x] Header (Desktop + Mobile) + Mega menu panel + Mobile menu panel
- [ ] Header bar only
- [ ] Simple dropdowns

**Answer:** Option 1, but the main nav is **right-aligned** plain links. **Contact is a regular link, not a highlighted button** (overused, especially in AI sites). Then search and hamburger icons. Use a powerful model to find the best solution → Opus benchmark in `docs/extract/header-recommendation.md`.

### Q30. Section subnav style (15 Sep 2026, Phase 2)
- [x] Pill bar: sticky under the header, full-radius pills, active = navy fill, hover = bg/tint, scrolls sideways on mobile
- [ ] Underline tabs
- [ ] Pills in a tint tray

### Q31. Footer content and structure (15 Sep 2026, Phase 2)
- [x] Solid navy, logo + 4 columns (Company · Services & Assets · Explore · Get in touch with phone, email, address, social) + legal row (© 2027, Transparency Act, Privacy & Cookie Policy). CTA band stays a separate block
- [ ] Mirror the top nav (7 columns)
- [ ] Dev footer as is

### Q32. Custom pictograms (old file "Icons Flat", 74 × 96px) (15 Sep 2026, Phase 2)
- [x] Import all 74 as `Pictogram/…` components bound to icon/accent; used by Card media = Icon
- [ ] Core subset
- [ ] Reference only

### Q22. Which outline icon set? (15 Sep 2026, Phase 2)
Context: the old file mixes Material, Phosphor, MDI and Remix glyphs, and the dev theme uses ad hoc fill-based inline SVGs. No existing outline system.
- [x] Tabler Outline (MIT, ~6,000 icons, true strokes, brand + subsea icons), stroke 1.5px
- [ ] Lucide
- [ ] Phosphor Regular

**Answer:** Tabler Outline, plus the custom green icons in the old Figma (`IqEKofKVdD06iF3A1Dlzrz`, node 4316:4571, "Icons Flat", 74 × 96px) are also in use.

### Q23. Card variant model (15 Sep 2026, Phase 2)
Context: image-bg has a dark scrim, so white and tint surfaces don't apply to it.
- [x] 10 × 2 sizes: media none/icon/image-top × white/tint/navy (9) + image-bg on navy (1), × Size Default | Featured = 20 variants. Hover drawn once as a spec example
- [ ] 10 × Default/Hover
- [ ] Full 12 × 2 sizes

### Q24. Supporting components added in Phase 2 (15 Sep 2026, Phase 2)
Icon and Logo (Light/Navy) are included regardless.
- [x] Icon button
- [x] External-link action (Link + Card)
- [x] Filter chip
- [x] Breadcrumb

### Q25. Basis for the Data list block (Reports, General meetings) (15 Sep 2026, PDF review)
Context: dev `downloads-table` (Latest card, tabs, year × quarter grid, archive expander, 121 real docs) vs PDF p21 (accordion by year, chips, cards, hand-typed shareholder table). See docs/03-client-pdf-review.md §1.
- [x] Dev component + PDF upgrades: publication dates, named 44px links, year→quarter list below 768px, IR contact + Newsweb footer
- [ ] Dev component as-is
- [ ] PDF accordion by year

### Q26. Charter agreement Gantt (PDF p20) (15 Sep 2026, PDF review)
Context: no dev equivalent; two Gantts, 5 bar styles; most expensive component on the site.
- [ ] Bespoke Timeline block from a repeater, stacked list on mobile
- [x] Image/PDF one-pager for v1 (fleet slide from the quarterly presentation + download)
- [ ] Leave out for now

### Q27. Share data (15 Sep 2026, PDF review)
Context: dev has 3 thin ir.oms.no iframe pages (Share info, Largest shareholders, News web); PDF hand-types a shareholder table.
- [x] One Share information page combining the live ir.oms.no embeds as sections
- [ ] Keep 3 separate pages
- [ ] Hand-maintained tables

### Q28. How to feed the review back to the client (15 Sep 2026, PDF review)
- [x] Client-facing summary page (private artifact for the user to check before sharing)
- [ ] User relays it from docs/03-client-pdf-review.md
- [ ] Annotations in Figma

### Q19. Is a neutral grey ramp needed? (15 Sep 2026, Phase 1)
Context: navy 50–400 are already near-grey. In the proposal, neutral was used only by bg/disabled and text/disabled.
- [x] Drop it. Keep white. bg/disabled → navy/100, text/disabled → navy/400. 31 primitives, 130 variables
- [ ] Keep 2–3 greys
- [ ] Keep full ramp

### Q20. Build approval (15 Sep 2026, Phase 1)
- [x] Approve and build all: variables and styles, validation, then the Foundations page with screenshot review
- [ ] Variables first, then pause
- [ ] Not yet

### Q21. Page structure of the 2027 file (15 Sep 2026, Phase 1)
- [x] Full skeleton: Cover · Foundations · --- · Components · Blocks · --- · Archive
- [ ] Foundations only

### Q15. Which light colour is the 'tint' surface? (15 Sep 2026, Phase 1)
Context: the latest old-Figma pages use #F7F9FD 21× and #F1F7F3 once. The dev theme calls #F1F7F3 `page-bg`.
- [x] Cool #F7F9FD (navy/50). Sage/50 #F1F7F3 stays for small accents (chips, highlight rows, badges)
- [ ] Sage #F1F7F3
- [ ] Both as options

### Q16. What is red for? (15 Sep 2026, Phase 1)
Context: #D53626 appears 20× in the latest old-Figma pages with no style. The dev error red is #C02B0A.
- [x] Errors only, using #C02B0A (5.9:1 on white). #D53626 dropped
- [ ] Keep as accent
- [ ] Check usage first

### Q17. Container and grid (15 Sep 2026, Phase 1)
- [x] 1600 max, 12 columns. At 1440: 64 margins, 80 columns, 32 gutters. Text column 880. Mobile: 4 columns, 16 gutters, 24 margins
- [ ] 1440 max
- [ ] 1344 max (dev today)

### Q18. Hero display size (15 Sep 2026, Phase 1)
- [x] 80px: display 80/88 desktop, 44/48 mobile; H1 64/72
- [ ] 96px
- [ ] 112px

### Q11. Token naming and Dev Mode code syntax (15 Sep 2026, Phase 1)
Context: the dev theme already uses theme.json slugs `primary`, `secondary`, `primary-light`, `page-bg`. The TADA Variable Library uses numeric primitives plus t-shirt semantic names.
- [x] WP presets: Figma names read by role (`color/text/primary`, `spacing/24`), code syntax points at theme.json preset vars (`var(--wp--preset--color--primary)`), reusing the developer's slugs
- [ ] TADA library style
- [ ] Keep dev CSS names

### Q12. Responsive type and section spacing in Figma (15 Sep 2026, Phase 1)
Context: the dev theme scales type fluidly between 500 and 1920px. The Figma plan is Pro (max 4 modes).
- [x] Desktop + Mobile modes (1440 / 375 frames). Code uses clamp() between them, tablet interpolates
- [ ] Desktop, Tablet, Mobile
- [ ] Single desktop scale

### Q13. Colour ramp structure (15 Sep 2026, Phase 1)
Context: the dev tints (5/10/25/50/75) are muddy, and there are two different `primary-10` values (#d2d2d7 vs #CACBD6).
- [x] New 50–900 ramps for navy, sage and a navy-tinted neutral, anchored on the exact brand hexes; keep #f1f7f3 and #f7f9fd as named backgrounds; old→new mapping shown for approval
- [ ] Keep dev tints
- [ ] Minimal palette

### Q14. Colours inside navy sections and cards (15 Sep 2026, Phase 1)
- [x] Surface modes: the semantic Color collection has Light and Navy modes, so setting the mode on a section or card flips its text, border and button tokens (one CSS class in WP)
- [ ] Separate on-navy tokens

### Q1. Newsroom: keep the News archive and Events? (15 Sep 2026)
- [x] Keep both under Newsroom: News & announcements, Events, Press & media

### Q2. Where do Reach Remote and Explore 3D World sit? (15 Sep 2026)
- [x] Reach Remote under Assets, 3D World under Services

**Answer:** 3D World will/should also be a large feature on the home page. It's based on the local build at `http://localhost:8765/reach-ocean-realism.html` (`~/Desktop/reach-world`).

### Q3. Page-level FAQs (15 Sep 2026)
- [x] Only on pages with genuine questions, pulled from the FAQ post type by topic

### Q4. Redirect map and content migration (15 Sep 2026)
- [x] Claude drafts the redirect map (cheap agent), the developer implements it

### Q5. Hosting for the coded prototype review links (15 Sep 2026)
- [x] Local only for now, decide later

### Q6. Same developer as the `reach-subsea-2023` theme? (15 Sep 2026)
- [x] Yes, same developer. Reuse their post types and field names where sensible.

### Q7. Client source HTML for the PDF mockups (15 Sep 2026)
- [x] Still waiting (the user has asked the client)

### Q8. How should we use the awesome-design-md library? (15 Sep 2026)
- [x] Keep it as reference only for now

### Q9. How should the 3D World work as the big home page feature? (15 Sep 2026)
Context: the scene is a 15–19 MB download with ~6.6s to first render, and phones struggle.
- [x] Poster, click to load in place. A large still or short loop with a "Launch 3D World" button; the live scene loads only on click. Phones get the poster plus a link to the full-screen version.

### Q10. Add zone deep links and an embed mode to the 3D World? (15 Sep 2026)
Context: the page only reads `?q=` (quality) and `?v=` (build) today.
- [x] Yes, in its own chat or task in `~/Desktop/reach-world` (`?zone=1–4`, `?embed=1`), keeping this project's chat on the website
