Let's build the **Subsea Services** page (`/services/subsea/`) in the reach-web-2027 prototype: the first service single page.

**Read first**
- `CLAUDE.md` and `docs/08-page-review-checklist.md`: the review checklist is mandatory. Run it yourself before showing me anything.
- Your memory for this project, especially the Services overview notes and the type/tablet lessons (tight leading only for short labels, tablet layouts fill the width, one standout element).
- `docs/05-blocks-spec.md` (§2 blocks, §3 "Service single" row) and `src/blocks/README.md`.
- The Services overview we just built: `src/pages/services/index.astro`, `src/data/services.ts` (single source for the four lines, their sub-services and the lifecycle mapping), `src/blocks/Lifecycle.astro`, and the Card `links[]` option in `src/components/Card.astro`. Check `git status` first: if the overview isn't committed yet, those files belong to that chat. Build on them, don't commit them.

**Source content**
- Client PDF `ref/Reach Subsea Website - Full Resolution Page Screens.pdf`, pages 8–9 ("03 — Services — Subsea Services", parts 1–2). The pages are images: render them with pymupdf (`fitz`) into the scratchpad. Strip internal editorial notes (chips like "illustrative", footnotes about placeholders).
- Dev site https://reachsubsea.no/services/subsea-services/ and its child pages (Engineering & Project Management, Inspection Maintenance & Repair, Asset integrity/pipeline inspection, Construction Support) plus the featured projects pulled from the Projects post type. Where the dev site has a working data-driven solution, prefer it. Note: dev contact blocks differ per service line; propose one shared shape.
- Take the PDF's content and page intent, but be far more creative than its layout.

**Tie it together**
- It sits under the Services overview. Same photo hero with the breadcrumb at the top (Home › Services › Subsea), the same Services subnav with Subsea active, the subsea pictogram and its trim-path loop.
- Read the service's name, summary, sub-services and lifecycle cells from `src/data/services.ts`. Don't retype them. Extend that file (e.g. per-sub-service details) rather than forking.
- Reuse: Split media, Card grid (capabilities), Stats band or bento (figures from `src/data/key-figures.ts` only, never hand-typed), Feed grid Projects scoped to Subsea (and related Assets: vessels, ROVs), Accordion (only genuine FAQs), CTA panel with a named contact if the dev site has one.
- A custom visual is welcome if it earns its place (e.g. the Subsea row of the lifecycle, zoomed in: what we do at Install · Operate · Extend life · Decommission). Keep it slim: short labels, quiet axes, markers do the highlighting.

**How to work**
1. Look at the PDF pages, the dev site and our Services overview, then propose the page outline with a one-line reason per section. Include what you'd cut or add from the PDF, and why, by visitor intent (an operator looking for IMR or construction support). Ask me anything open with AskUserQuestion.
2. Build section by section. After each section, run the checklist at 1440 · ~1100 · 800 · 375: card rows share one structure with actions lined up, no hairlines inside cards, one-line meta, no half-empty cards or half-empty tablet rows, no tint-on-tint, figures fit, data and labels align, leading suits the text length, grounds alternate, contrast holds. Fix what fails before showing me.
3. Show me screenshots, with a line on what you checked and fixed.
4. After I approve: update `docs/05` §3 and `docs/00-questions.md`, and update Figma (new tokens, components and variants, plus a "Subsea services" frame on the Pages page; IDs in the ledger). Then commit only your own files by path and push.

Use cheaper subagents (Sonnet or Haiku) for mechanical sub-tasks (dev-site survey, PDF rendering) where it makes sense, and tell me if it's worth starting a new chat partway through.
