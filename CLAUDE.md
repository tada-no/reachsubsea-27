# Reach Subsea 2027: working rules

Coded prototype (Astro, static) of the Reach Subsea website redesign, handed off to a WordPress developer. Figma design system file: `HAvCQCXzWNFOKQ1AZxqNTX`.

## Always

- **Review every page and section yourself before showing it**, against [docs/08-page-review-checklist.md](docs/08-page-review-checklist.md). Check 1440 · ~1100 · 800 · 375; card rows and data alignment; text flow; contrast. Fix what fails, then report what you checked. Ross shouldn't have to ask for these checks.
- **Blocks and tokens:** follow [src/blocks/README.md](src/blocks/README.md) and [docs/05-blocks-spec.md](docs/05-blocks-spec.md). Tokens only, no raw colours or spacing. Shared components over near-copies.
- **Nothing overlaps the hero:** no stats panel, cards or any block over the bottom edge of a page hero, on any page, even where the client PDF shows it (removed 16 Sep 2026; [docs/05](docs/05-blocks-spec.md) Page hero, [docs/06](docs/06-navigation-rationale.md) §2). Put that content in the first block below the hero.
- **Decisions:** ask with AskUserQuestion (recommended option first). Log them in [docs/00-questions.md](docs/00-questions.md) and record page layouts in docs/05 §3.
- **Git:** another chat often works in this repo at the same time. Stage only your own files, by explicit path, and check `git status` / `git log` before committing.
- **Figma:** once a page is approved, update the design system: new tokens, components and block variants, plus a page frame on the Pages page. Record the IDs in `docs/extract/figma-blocks-ledger.json`. Load the figma-use skill first, and make Figma writes one agent at a time.

## Dev server

`npm run dev` (http://localhost:4321). Only one dev server can run per project: if another chat owns :4321, browse to it instead. If styles look stale, `touch` the changed files.
