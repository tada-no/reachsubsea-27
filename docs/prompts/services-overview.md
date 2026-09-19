Let's build the **Services Overview** page (`/services/`) in the reach-web-2027 prototype.

**Read first**
- `CLAUDE.md` and `docs/08-page-review-checklist.md`: the review checklist is mandatory. Run it yourself before showing me anything.
- Your memory for this project: the Home, Why invest and Investors overview lessons.
- `docs/05-blocks-spec.md` (§2 blocks, §3 page layouts) and `src/blocks/README.md`.

**Source content**
- Client PDF `ref/Reach Subsea Website - Full Resolution Page Screens.pdf`, pages 4–6 ("02 — Services — Overview", parts 1–3). The pages are images: render them with pymupdf (`fitz`) into the scratchpad to read them. Strip any internal editorial notes.
- Take the PDF's content and page intent, but be far more creative than its layout. Where the dev site (reachsubsea.no) already has a working data-driven solution, prefer it.
- Services nav: `src/data/navigation.ts` (Subsea, Survey, Monitoring, Technology & Innovation → Research & Publications, Explore 3D World).

**Tie it together**
- It sits between Home and the service single pages. Reuse what's built: photo hero with the breadcrumb at the top, a Services section subnav under the hero if the pattern fits, the service pictograms and their trim-path micro loops, shared Card presets, the bento, Feed grid editorial, the 3D World embed, FAQ and the CTA panel.
- Key figures come from `src/data/key-figures.ts`. Don't hand-type numbers.
- A custom data visual outside the design system is welcome if it adds real value, like the investor year track. Keep it slim: short labels, quiet axes, markers do the highlighting.

**How to work**
1. Look at the PDF pages, the dev site and our Home, then propose the page outline with a one-line reason per section. Include what you'd cut or add from the PDF, and why, by visitor intent. Ask me anything open with AskUserQuestion.
2. Build section by section. After each section, run the checklist at 1440 · ~1100 · 800 · 375: card rows share one structure with actions lined up, no hairlines inside cards, one-line meta, no half-empty cards, no tint-on-tint, figures fit, data and labels align, text columns flow, grounds alternate, contrast holds. Fix what fails before showing me.
3. Show me screenshots, with a line on what you checked and fixed.
4. After I approve: update `docs/05` §3 and `docs/00-questions.md`, and update Figma (new tokens, components and variants, plus a "Services overview" frame on the Pages page; IDs in the ledger). Then commit only your own files by path and push.

Use cheaper subagents (Sonnet or Haiku) for mechanical sub-tasks where it makes sense, and tell me if it's worth starting a new chat partway through.
