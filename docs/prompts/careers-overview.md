Let's build the **Careers overview** page (`/careers/`) in the reach-web-2027 prototype. It's the landing page of the Careers section: Life at Reach, Our culture and Why work with us sit under it (siblings, not part of this task), and open vacancies live on HR-Manager (external, `https://hr-manager.net/reachsubsea`).

**Read first**
- `CLAUDE.md` and `docs/08-page-review-checklist.md`: the review checklist is mandatory. Run it yourself before showing me anything.
- Your memory for this project, especially: creative not generic, hub pages keep the key content of their children (no thin child pages, but don't fake their content), the type/tablet lessons, hero image choice, card rows share one structure, no transparency in pictogram loops.
- `docs/05-blocks-spec.md` (§0 rules incl. the site-wide photo tint and scrims, §2 blocks, §3 "Careers overview" row) and `src/blocks/README.md`. The §3 row predates Q57 (photo or video heroes on story pages, text heroes on data pages). Careers is a story page: reconcile the two and tell me what you chose.
- `docs/00-questions.md` Q57–Q65. Q65 (About) may not be logged yet: check, and use the next free number for your own decisions.
- `docs/prompts/about-us-handoff.md`: the About page (`/company/`, commit `8878a99`) is the closest sibling. Reuse what it built instead of making near-copies: the Values block (`reach/values`, Split layout), Split media `layout="wide"` (long copy as two columns + a 21:9 banner), the Stats band Feature style (one figure leads in a navy tile), MediaFrame 21:9, the Card grid strip (3 tiles, keeps its top padding after a tint/navy section), `scripts/shot.mjs` for screenshots.
- `git status` and `git log` first. The Services and Subsea pages (`src/pages/services/`, `src/data/services.ts`, `src/data/projects.ts`, `src/blocks/Lifecycle.astro`) and some hunks in `FeedGrid`, `Card`, `types.ts` may still be uncommitted. They belong to other chats: build on them if you need to, but don't commit them. The About docs/Figma follow-ups (docs/05 §3, docs/00 Q65, Figma) may still be pending in another chat: re-read a file right before editing it.

**Source content**
- Client PDF `ref/Reach Subsea Website - Full Resolution Page Screens.pdf`, page 22 ("Careers overview"); read pages 23–25 (Life at Reach, Our Culture, Why work with us) for context on what the siblings will hold. The pages are images: render them with pymupdf (`fitz`) into the scratchpad. Strip internal editorial notes (chips like "illustrative", placeholder footnotes). `docs/03-client-pdf-review.md` rates p22 "Adapt: good flow; role areas illustrative". The PDF shows a stats/reasons panel overlapping the bottom of the hero on the Careers pages (p24, p27): **never do this. No block ever overlaps the hero, site-wide** (docs/05 §2 Page hero, docs/06 §2: overlap variants were removed 16 Sep 2026). Put the figures or cards in the first block below the hero instead.
- Do not invent content. The PDF's role areas are illustrative, and Life at Reach (real quotes) and Why work with us (real benefits) are blocked on the client. Only show role areas, benefits or quotes you can source from the PDF, the live site (https://reachsubsea.no/) or the dev site (https://reachsubseadev.wpenginepowered.com/, plain `curl` works). Where the client still has to supply something, build the section so it works without it, or use a clearly labelled placeholder, and list it under "Open with the client".
- Survey the Careers pages on both sites. Say which content wins, and list the old URLs that should redirect to `/careers/`. Also check `ref/reach sitemap from client.jpg`.
- Take the PDF's content and page intent, but be far more creative than its layout.

**Tie it together**
- Careers section: the same hero pattern as Company (breadcrumb Home › Careers), and a Section subnav from the Careers panel in `src/data/navigation.ts` (Overview · Life at Reach · Our culture · Why work with us), Overview active. Link the siblings even though those pages aren't built. The PDF used a light subnav for Company and Careers: use the same one as About.
- "Open positions" is an external link (HR-Manager, arrow-up-right icon, Q24). It is the page's main action: make it obvious, but the site rule is no highlighted buttons in the nav. Ask me if you want anything richer than a link (for example a live vacancy count, which we don't have a source for).
- Figures come only from `src/data/key-figures.ts` (people, offices, countries, vessels, ROVs, established), never hand-typed. Add missing figures there, with a source. Watch labels: "8 offices in 4 countries" read as clumsy in About and became separate figures.
- Photography: there is `public/images/team-lounge-harbour.jpg` (the Careers nav feature), and the site-wide tint applies automatically. Check `feedback-hero-image-choice` before using a people photo as a hero: calm image, subject right, no subject that fills the frame. Propose the hero image and tell me if a better one is needed from the client.
- If you add pictograms, they get the same loop feel as the existing ones (trim paths, movement, rotation, scale; solid colour only, no transparency; 3.2s cycle, rests at 0% and 100%). If a pictogram exists on the live/dev site, extract the original SVG instead of redrawing it (the first About icons were redrawn by eye and were wrong).

**Lessons from the About review (Ross), apply them here**
- Long text in a half-width column is too much: use two columns or a wide layout.
- Put the heading with its body. Don't let a decorative element sit between a title and its copy.
- Kill dead space: a block should be as tall as its content, or a full viewport with everything vertically centred, never top-aligned with empty space below.
- Don't add hairline progress bars or extra CTA links that the section doesn't need.
- Reuse the shared block (Stats band Feature) rather than building a custom figure row.
- One animation feel across pictograms and block reveals; transform and clip, no fades in the pinned/scroll sections.

**How to work**
1. Look at the PDF pages, both Careers sites and our About and Services pages, then propose the page outline with a one-line reason per section. Say what you'd cut or add from the PDF and why, by visitor intent (a prospective hire, or a candidate deciding whether Reach is a good place to work). Ask me anything open with AskUserQuestion.
2. Build section by section. After each section, run the checklist at 1440 · ~1100 · 800 · 375:
   - card rows share one structure, with their actions lined up
   - no hairlines inside cards
   - meta stays on one line
   - no half-empty cards and no half-empty tablet rows
   - no tint-on-tint
   - figures fit, and data and labels align
   - leading suits the text length
   - grounds alternate, including a navy block to break up any text-heavy stretch
   - contrast holds

   Fix what fails before showing me. Headless Chrome via `scripts/shot.mjs` can do 375 and scroll steps; the in-app browser pane can't screenshot while it's hidden.
3. Show me screenshots, with a line on what you checked and fixed.
4. After I approve:
   - Update `docs/05` §3 (replace the Careers overview row) and `docs/00-questions.md`.
   - Update Figma: new tokens, components and variants, plus a "Careers overview" frame on the Pages page, with the IDs in `docs/extract/figma-blocks-ledger.json`. Load the figma-use skill first, and make Figma writes one agent at a time.
   - Commit only your own files, by path, and push. If a shared file also holds another chat's uncommitted hunks, stage only your own hunks, and check that the staged snapshot builds on its own before committing (`git checkout-index -a --prefix=<tmp>/`, symlink `node_modules`, `npx astro build --outDir <tmp>`).

**Practicalities**
- Only one `astro dev` can run per project: if another chat owns http://localhost:4321, browse it instead (it serves the same working tree). Never use `--force`. If styles look stale, `touch` the changed files.
- Use cheaper subagents (Sonnet or Haiku) for mechanical sub-tasks (site survey, PDF rendering) where it makes sense, and tell me if it's worth starting a new chat partway through.
