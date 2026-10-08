# Open questions

Questions are asked in Claude with clickable options, then recorded here. You can also tick `[x]` or write under **Answer** directly.

---

_No open questions right now._

---

## Answered log

### Q148. Newsroom: breadcrumb ends at the category; a light archive header like dev (8 Oct 2026)
Context: Ross asked whether stories with long titles should have a trimmed breadcrumb. Claude: no, drop the title instead, since the H1 sits right under it and a title cut with "…" looks broken. Ross agreed, and asked for a lighter, smaller archive hero, a bit like the dev site.
- [x] Story breadcrumb: Home › Newsroom › News (or Reports), every item a link to its archive; phones show "‹ News". Breadcrumb gains `endsWithCurrent` (default true, so every other page is unchanged)
- [x] The category eyebrow on stories goes: the breadcrumb now names the category, so it said "News" twice
- [x] Archive header: no Page hero. Solid site header, then on white "Reach Newsroom" (H1 at H2 size) and the dev intro, with the chips straight under; no breadcrumb (depth 2). The lead story starts at 436px on desktop, and title and chips sit in the same place on every archive page. Section landing pages elsewhere keep the one hero height (7 Oct 2026)

**Answer:** as ticked.

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

**Answer:** as ticked. Waiting on the world: `?zone`, the Escape message, `_top` links, the WordPress content, publishing v59, and a Reach-owned host that allows framing.

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

**Answer:** as ticked. API contract, CORS and caching in docs/09 §7. Still open: the final host and owner. The Explore 3D World landing page followed (Q95).

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
