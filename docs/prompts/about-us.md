Let's build the **About us** page (`/company/`, "About Reach" in the nav) in the reach-web-2027 prototype. It's the Company landing page: Leadership & Board, HSEQ and Sustainability sit under it.

**Read first**
- `CLAUDE.md` and `docs/08-page-review-checklist.md`: the review checklist is mandatory. Run it yourself before showing me anything.
- Your memory for this project, especially the type/tablet lessons (tight leading only for short labels, tablet layouts fill the width, one standout element) and the feedback from the Services and Subsea builds (icon-led visuals over heavy photo cards, keep the client's own wording where they've written it, no thin child pages, one animation feel across pictograms).
- `docs/05-blocks-spec.md` (§0 rules including the site-wide photo tint and scrims, §2 blocks, §3 "About" row) and `src/blocks/README.md`. The §3 row predates Q57 (photo or video heroes on story pages, text heroes on data pages). About is a story page, so reconcile the two and tell me what you chose.
- `docs/00-questions.md` Q57–Q64 for the latest decisions.
- Check `git status` and `git log` first. The Services overview (`src/pages/services/index.astro`, `src/data/services.ts`, `src/blocks/Lifecycle.astro`) and the Subsea page (`src/pages/services/subsea/`, `src/data/projects.ts`) may still be uncommitted. They belong to other chats: build on them if you need to, but don't commit them.

**Source content**
- Client PDF `ref/Reach Subsea Website - Full Resolution Page Screens.pdf`, pages 30–31 ("12 — Company — About Us", parts 1–2). The pages are images: render them with pymupdf (`fitz`) into the scratchpad. Strip internal editorial notes (chips like "illustrative", footnotes about placeholders). `docs/03-client-pdf-review.md` rates this page "Keep" (a benchmark).
- Dev site https://reachsubsea.no/: it has two About pages, `/about/` and `/company/who-we-are/about-us/`. Survey both. Say which content wins, and list the old URLs that should redirect to `/company/`.
- Take the PDF's content and page intent, but be far more creative than its layout.

**Tie it together**
- Company section: the same hero pattern with the breadcrumb at the top (Home › Company), and a Section subnav from the Company panel in `src/data/navigation.ts` (About · Leadership & Board · HSEQ · Sustainability), with About active. Link the siblings even though those pages aren't built yet.
- Figures come only from `src/data/key-figures.ts` (people, founded year, vessels, ROVs, countries), never hand-typed. Add missing figures there, with a source.
- Reuse what fits: Statement, Split media, Timeline/Milestone (company history), Card grid Numbered (values or pillars), Logo strip (certifications), Stats band or bento, Feed grid (News or Projects), Accordion (genuine FAQs only), CTA band. A custom visual is welcome if it earns its place. Keep it slim: short labels, quiet axes, markers do the highlighting.
- If you add pictograms, they get the same loop feel as the existing ones (trim paths, movement, rotation, scale; solid colour only, no transparency; 3.2s cycle, rests at 0% and 100%).
- Photos get the site-wide navy tint automatically (docs/05 §0). Scrims use the `scrim/*` tokens.

**How to work**
1. Look at the PDF pages, the dev site's two About pages and our Services pages, then propose the page outline with a one-line reason per section. Say what you'd cut or add from the PDF and why, by visitor intent (a prospective client, investor or hire deciding whether Reach is credible and a good fit). Ask me anything open with AskUserQuestion.
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

   Fix what fails before showing me. Headless Chrome can't do 375 (it clips) and skips scroll reveals at 800/1100, so check those widths in the browser pane.
3. Show me screenshots, with a line on what you checked and fixed.
4. After I approve:
   - Update `docs/05` §3 and `docs/00-questions.md`.
   - Update Figma: new tokens, components and variants, plus an "About us" frame on the Pages page, with the IDs in the ledger.
   - Commit only your own files, by path, and push. If a shared file (Card, types, a block) also holds another chat's uncommitted hunks, stage only your own hunks, and check that the staged snapshot builds on its own before committing.

Use cheaper subagents (Sonnet or Haiku) for mechanical sub-tasks (dev-site survey, PDF rendering) where it makes sense, and tell me if it's worth starting a new chat partway through.
