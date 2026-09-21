// The blocks with a demo (docs/05-blocks-spec.md §2), in spec order; split blocks (Q67) sit beside their parent.
// Drives the /blocks review route. `figma` is empty where the Figma component is still to add.
// Each block's variants live in src/demos/<slug>.astro; the block itself in src/blocks/<component>.astro.
export interface BlockEntry {
  slug: string;
  name: string;
  component: string;
  spec: string;
  /** Figma component set (or doc frame) on page Blocks 12:25. */
  figma: string;
  variants: string;
}

export const blocks: BlockEntry[] = [
  { slug: 'page-hero', name: 'Page hero', component: 'PageHero', spec: '§2.1', figma: '141:827', variants: 'Style Text · Photo' },
  { slug: 'card-grid', name: 'Card grid', component: 'CardGrid', spec: '§2.2', figma: '148:1288', variants: 'Layout 2 columns · 3 columns · 4 columns · Featured first' },
  { slug: 'card-bento', name: 'Card bento', component: 'CardBento', spec: '§2.2b', figma: '', variants: 'Pattern lead-quad · lead-tall-wide · lead-tall-trio-a · lead-tall-trio-b · trio-wide' },
  { slug: 'feed-grid', name: 'Feed grid', component: 'FeedGrid', spec: '§2.3', figma: '156:2012', variants: 'Filters Off · On; sources incl. Latest; empty state' },
  { slug: 'split-media', name: 'Split media', component: 'SplitMedia', spec: '§2.4', figma: '166:2339', variants: 'Media Image · Video · Spec table · Numbered list × Position End · Start' },
  { slug: 'figures', name: 'Figures', component: 'Figures', spec: '§2.4b', figma: '', variants: 'Layout Sticky · Cards' },
  { slug: 'split-embed', name: 'Split embed', component: 'SplitEmbed', spec: '§2.4c', figma: '', variants: 'Position End · Start' },
  { slug: 'stats', name: 'Stats band', component: 'StatsBand', spec: '§2.5', figma: '169:2557', variants: 'Count 3 · 4 × Style Plain · Panel' },
  { slug: 'results-band', name: 'Results band', component: 'ResultsBand', spec: '§2.5b', figma: '', variants: 'Latest results with report cards' },
  { slug: 'accordion', name: 'Accordion / FAQ', component: 'Accordion', spec: '§2.6', figma: '175:2673', variants: 'Layout Stacked · Split' },
  { slug: 'data-list', name: 'Data list', component: 'DataList', spec: '§2.7', figma: '200:4079', variants: 'Type Reports · Documents · Dates · Publications' },
  { slug: 'timeline', name: 'Timeline', component: 'Timeline', spec: '§2.8', figma: '187:3005', variants: 'One layout; milestones Done · Current · Upcoming' },
  { slug: 'cta', name: 'CTA band', component: 'CtaBand', spec: '§2.9', figma: '179:5432', variants: 'Style Band · Inline; Show contact' },
  { slug: 'statement', name: 'Statement / quote', component: 'Statement', spec: '§2.10', figma: '182:2824', variants: 'Style Statement · Quote' },
  { slug: 'logo-strip', name: 'Logo & badge strip', component: 'LogoStrip', spec: '§2.11', figma: '190:3228', variants: 'Type Logos · Certifications · SDGs' },
  { slug: 'gallery', name: 'Media gallery', component: 'MediaGallery', spec: '§2.12', figma: '192:3618', variants: 'Type Photos · Videos' },
  { slug: 'embed', name: 'Embed', component: 'Embed', spec: '§2.13', figma: '203:4644', variants: 'Type 3D World · Iframe · Map × State Poster/Consent · Loaded' },
  { slug: 'subnav', name: 'Section subnav', component: 'SectionSubnav', spec: '§2.14', figma: '207:4710', variants: 'Source Section pages · In-page' },
];

export const FIGMA_FILE = 'HAvCQCXzWNFOKQ1AZxqNTX';

export const figmaUrl = (nodeId: string) =>
  `https://www.figma.com/design/${FIGMA_FILE}/?node-id=${nodeId.replace(':', '-')}`;
