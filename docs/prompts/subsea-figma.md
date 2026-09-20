Let's bring the Figma design system up to date with the approved **Subsea services** page (`/services/subsea/`) and the site-wide photo treatment. Figma file: `HAvCQCXzWNFOKQ1AZxqNTX`.

**Read first**
- `CLAUDE.md`. Load the **figma-use** skill before any `use_figma` call. Figma writes happen one agent at a time: no parallel writers. Before writing, ask me whether another chat (for example the Services overview chat) is writing to Figma right now.
- `docs/extract/figma-blocks-ledger.json`. Look closely at `phase4InvestorsOverview`: it's the pattern to follow, and its `gotchas` list is from the last Figma session. Also read `docs/extract/figma-components-ledger.json` and `docs/extract/figma-pictograms-ledger.json`.
- `docs/05-blocks-spec.md` §0 (the Photo tint row), §2.2 Card grid, §2.3 Feed grid, §2.4 Split media, §3 Service single. Then `docs/00-questions.md` Q63–Q64. Everything marked *Figma to add* in those notes is in scope.
- The code is the source of truth:
  - `src/pages/services/subsea/index.astro`
  - `src/components/Card.astro` (scope list, scrim)
  - `src/blocks/CardGrid.astro` (Strip layout)
  - `src/blocks/SplitMedia.astro` (pictogram)
  - `src/blocks/Lifecycle.astro` (Focus layout)
  - `src/styles/tokens.css` and `src/styles/base.css` (image-tint, scrim tokens)
  - `src/assets/pictograms/oil-gas.svg` and `offshore-wind.svg`
- Run the dev server, or use the running one on :4321, for reference screenshots at 1440 and 375.

**What to add or update**
1. **Variables:** `color/image-tint` (navy/900), `scrim/solid` (navy/900) and `scrim/floor` (navy/900 at 10%), in the collection and naming style of the existing semantic colours, with explicit scopes.
2. **Photo treatment:** every photo sits on an `image-tint` fill with the image layer on **Screen** blend. This covers Card image-top and image-bg, Page hero Photo, and Media frame. Rework the image-bg and banner scrims to ramp from `scrim/solid` to `scrim/floor`, never 0, and bind the gradient stops where Figma allows. Logos, pictograms and the 3D World poster stay untouched.
3. **Card:** an optional **Scope** list: 3 items, `Body/Small`, `text/secondary`, a 12×2 sage dash per item, placed under the description. Add a boolean property plus editable text. Don't bloat the variant count.
4. **Block/Card grid:** a new `Layout=Strip` variant, Desktop and Mobile:
   - an eyebrow and no section header
   - `bg/accent-subtle` tiles, each a 64 pictogram beside a label
   - 4 across on Desktop; compact rows with 48 icons on Mobile

   Also add the 3-columns → 2-columns tablet rule to the block's usage notes. That rule is code-only.
5. **Block/Split media:** an optional pictogram, 96, above the eyebrow and pulled 12px left. Use an instance-swap property that defaults to the subsea pictogram.
6. **Pictograms:** update `oil-gas` (32:76) and `offshore-wind` (32:98) to the new static art in the SVGs:
   - oil-gas: the wave line, the crane jib as its own layer, the riser line, and the hook line with its ball
   - offshore-wind: the wave line and the rotor group

   Keep the component names and IDs if you can. The motion lives in code: note in each component description what moves.
7. **Lifecycle:** check whether a `Block/Lifecycle` exists (the Services overview chat may have added it).
   - If it exists, add a `Layout=Focus` variant, Desktop and Mobile: one line's row with a marker rail, off-phase ring markers, and tasks per phase. The off phase becomes a handoff link to the owning line.
   - If it doesn't exist, stop and ask me before building the whole block.
8. **Page frame:** a "Subsea services" frame on the Pages page (250:22), to the right of the existing page frames, built from block instances in the §3 order and grounds:
   1. hero
   2. subnav
   3. split media with pictogram
   4. industries strip
   5. navy lifecycle Focus
   6. capabilities in tint cards with scope lists, on white
   7. fleet bento on tint
   8. projects feed, 4 cols
   9. FAQ
   10. CTA panel with the named contact

   Use the real copy from the page. For photos, try `upload_assets`. If images can't be placed, log that as a gap, as the Investors frame did.

**How to work**
- Inspect before writing, and work in small steps: one component or variant per `use_figma` call. Return every created or changed node ID, and screenshot each piece to check it against the code at 1440 and 375.
- Reuse existing components, variables and text styles. Bind every fill, stroke, text style and spacing: no raw values. Before finishing, run a binding audit like the ledger's `finalQA` (0 unbound paints and text).
- Record everything in `docs/extract/figma-blocks-ledger.json` as a new `phase4SubseaServices` entry, same shape as `phase4InvestorsOverview` (variables, components, blocks, pages, gaps, gotchas). Also update `figma-pictograms-ledger.json` if pictogram IDs change.
- Show me screenshots of the new variants and the page frame, with a line on what you checked.
- After I approve, commit only the ledger files (and any doc notes you changed) by explicit path, and push. Check `git status` and `git log` first: other chats may have uncommitted files in the repo.

Use a cheaper subagent (Sonnet) for mechanical Figma steps once the first variant has set the pattern. Keep Figma writes strictly sequential, and tell me if it's worth starting a new chat partway through.
