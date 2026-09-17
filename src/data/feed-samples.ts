// Sample items for Feed grid (docs/05 §2.3) demos, built from `cardPresets` like a real feed query
// would after WordPress resolves the post type fields. In WordPress these come from the query;
// here they're typed placeholders with the `facets` a real facet plugin (FacetWP) would expose.
// Feed grid forces White surface for every source (docs/05 §2.3 "Card | Set by source: the
// matching Card preset, White surface"), so every preset call below overrides `surface`.
import { cardPresets } from './card-presets';
import type { CardField } from '../lib/types';

export interface FeedFacetOption {
  value: string;
  label: string;
}

export interface FeedFacet {
  key: string;
  label: string;
  options: FeedFacetOption[];
}

/** A Feed grid item: a CardField plus the facet values a filter row matches against. */
export interface FeedItem extends CardField {
  facets?: Record<string, string>;
}

export const projectFacets: FeedFacet[] = [
  {
    key: 'service',
    label: 'Service',
    options: [
      { value: 'subsea', label: 'Subsea' },
      { value: 'survey', label: 'Survey' },
      { value: 'monitoring', label: 'Monitoring' },
    ],
  },
  {
    key: 'region',
    label: 'Region',
    options: [
      { value: 'north-sea', label: 'North Sea' },
      { value: 'norwegian-sea', label: 'Norwegian Sea' },
      { value: 'baltic-sea', label: 'Baltic Sea' },
      { value: 'international', label: 'International' },
    ],
  },
];

const regionLabel: Record<string, string> = {
  'north-sea': 'North Sea',
  'norwegian-sea': 'Norwegian Sea',
  'baltic-sea': 'Baltic Sea',
  international: 'International',
};
const serviceLabel: Record<string, string> = {
  subsea: 'Subsea',
  survey: 'Survey',
  monitoring: 'Monitoring',
};

interface ProjectSeed {
  title: string;
  service: string;
  region: string;
  year: number;
  vessel: string;
}

const projectSeeds: ProjectSeed[] = [
  { title: 'IMR campaign, Njord field', service: 'subsea', region: 'north-sea', year: 2026, vessel: 'Reach Falcon' },
  { title: 'Pipeline route survey', service: 'survey', region: 'norwegian-sea', year: 2025, vessel: 'Reach Endeavour' },
  { title: 'Structure monitoring, Ekofisk', service: 'monitoring', region: 'north-sea', year: 2026, vessel: 'Reach Falcon' },
  { title: 'Cable repair, offshore wind farm', service: 'subsea', region: 'baltic-sea', year: 2025, vessel: 'Olympic Taurus' },
  { title: 'Seabed mapping campaign', service: 'survey', region: 'international', year: 2026, vessel: 'Reach Endeavour' },
  { title: 'Asset integrity survey', service: 'monitoring', region: 'norwegian-sea', year: 2025, vessel: 'Reach Falcon' },
  { title: 'Riser inspection, Troll field', service: 'subsea', region: 'north-sea', year: 2025, vessel: 'Viking Reach' },
  { title: 'Export cable route survey', service: 'survey', region: 'baltic-sea', year: 2026, vessel: 'Reach Endeavour' },
  { title: 'Environmental monitoring, Sleipner', service: 'monitoring', region: 'north-sea', year: 2025, vessel: 'Reach Falcon' },
  { title: 'Wellhead intervention, Gullfaks', service: 'subsea', region: 'norwegian-sea', year: 2026, vessel: 'Viking Reach' },
  { title: 'Geophysical survey, Dogger Bank', service: 'survey', region: 'north-sea', year: 2025, vessel: 'Reach Endeavour' },
  { title: 'Pipeline integrity monitoring', service: 'monitoring', region: 'international', year: 2026, vessel: 'Olympic Taurus' },
];

export const projectItems: FeedItem[] = projectSeeds.map((seed) => ({
  ...cardPresets.project({
    surface: 'white',
    eyebrow: `${serviceLabel[seed.service]} · ${seed.year}`,
    title: seed.title,
    meta: [
      { icon: 'map-pin', text: regionLabel[seed.region] },
      { icon: 'ship', text: seed.vessel },
    ],
  }),
  facets: { service: seed.service, region: seed.region, year: String(seed.year) },
}));

interface AssetSeed {
  title: string;
  status: 'In service' | 'In build' | 'Joining fleet';
  length: string;
  pax: string;
  dp: string;
  type: string;
}

const assetSeeds: AssetSeed[] = [
  { title: 'Viking Reach', status: 'In service', length: '120 m', pax: '120 PAX', dp: 'DP2', type: 'vessel' },
  { title: 'Reach Falcon', status: 'In service', length: '93 m', pax: '90 PAX', dp: 'DP2', type: 'vessel' },
  { title: 'Reach Endeavour', status: 'In service', length: '84 m', pax: '75 PAX', dp: 'DP2', type: 'vessel' },
  { title: 'Olympic Taurus', status: 'In service', length: '87 m', pax: '80 PAX', dp: 'DP2', type: 'vessel' },
  { title: 'Reach Pioneer', status: 'Joining fleet', length: '98 m', pax: '95 PAX', dp: 'DP2', type: 'vessel' },
  { title: 'Reach Voyager', status: 'In build', length: '101 m', pax: '100 PAX', dp: 'DP3', type: 'vessel' },
  { title: 'Reach Remote 3', status: 'In build', length: '24 m', pax: 'Uncrewed', dp: 'DP2', type: 'USV' },
  { title: 'Reach Remote 4', status: 'In build', length: '24 m', pax: 'Uncrewed', dp: 'DP2', type: 'USV' },
];

const assetBadgeTone: Record<AssetSeed['status'], 'success' | 'neutral' | 'accent'> = {
  'In service': 'success',
  'In build': 'neutral',
  'Joining fleet': 'accent',
};

export const assetItems: FeedItem[] = assetSeeds.map((seed) => ({
  ...cardPresets.asset({
    surface: 'white',
    eyebrow: seed.type === 'USV' ? 'Uncrewed surface vessel' : 'Vessel',
    badge: { label: seed.status, tone: assetBadgeTone[seed.status] },
    title: seed.title,
    meta: [
      { icon: 'ruler-measure', text: `Length ${seed.length}` },
      { icon: 'users', text: seed.pax },
      { icon: 'anchor', text: seed.dp },
    ],
  }),
  facets: { status: seed.status.toLowerCase().replace(/\s+/g, '-'), type: seed.type.toLowerCase() },
}));

interface NewsSeed {
  title: string;
  date: string;
  readTime: string;
  category: string;
}

const newsSeeds: NewsSeed[] = [
  { title: 'Reach Subsea wins survey contract in the North Sea', date: '12 Aug 2026', readTime: '3 min read', category: 'Contract' },
  { title: 'Reach Falcon completes IMR campaign ahead of schedule', date: '2 Jul 2026', readTime: '2 min read', category: 'Operations' },
  { title: 'Reach Subsea to present at Ocean Business 2027', date: '18 Jun 2026', readTime: '2 min read', category: 'Events' },
  { title: 'New charter agreement extends Olympic Taurus deployment', date: '30 Apr 2026', readTime: '3 min read', category: 'Contract' },
  { title: 'Reach Remote 3 keel-laid at the Haugesund yard', date: '11 Mar 2026', readTime: '4 min read', category: 'Fleet' },
  { title: 'Reach Subsea publishes Q1 2026 trading update', date: '24 Feb 2026', readTime: '3 min read', category: 'Investors' },
];

export const newsItems: FeedItem[] = newsSeeds.map((seed) => ({
  ...cardPresets.news({
    surface: 'white',
    eyebrow: `${seed.date} · ${seed.readTime}`,
    badge: { label: seed.category, tone: 'accent' },
    title: seed.title,
    description: 'A short summary of the announcement, written for the newsroom index and social sharing.',
  }),
  facets: { category: seed.category.toLowerCase() },
}));

interface EventSeed {
  title: string;
  dates: string;
  city: string;
  note: string;
}

const eventSeeds: EventSeed[] = [
  { title: 'Ocean Business 2027', dates: '14–16 April 2027', city: 'Southampton, UK', note: 'Stand B21' },
  { title: 'Offshore Technology Conference', dates: '4–7 May 2027', city: 'Houston, US', note: 'Stand 3410' },
  { title: 'Nor-Shipping 2027', dates: '2–5 June 2027', city: 'Oslo, Norway', note: 'Hall B, Stand 214' },
];

export const eventItems: FeedItem[] = eventSeeds.map((seed) => ({
  ...cardPresets.event({
    surface: 'white',
    title: seed.title,
    meta: [
      { icon: 'calendar', text: seed.dates },
      { icon: 'map-pin', text: seed.city },
      { icon: 'info-circle', text: seed.note },
    ],
  }),
}));

interface PersonSeed {
  name: string;
  role: string;
  phone: string;
  email: string;
}

const personSeeds: PersonSeed[] = [
  { name: 'Anne Fossum', role: 'Chief Executive Officer', phone: '+47 400 07 711', email: 'anne.fossum@reachsubsea.com' },
  { name: 'Jonas Berge', role: 'Chief Financial Officer', phone: '+47 400 07 712', email: 'jonas.berge@reachsubsea.com' },
  { name: 'Marte Lund', role: 'Chief Operating Officer', phone: '+47 400 07 713', email: 'marte.lund@reachsubsea.com' },
  { name: 'Henrik Aas', role: 'Head of HSEQ', phone: '+47 400 07 714', email: 'henrik.aas@reachsubsea.com' },
];

export const peopleItems: FeedItem[] = personSeeds.map((seed) => ({
  ...cardPresets.person({
    surface: 'white',
    eyebrow: seed.role,
    title: seed.name,
    meta: [
      { icon: 'phone', text: seed.phone },
      { icon: 'mail', text: seed.email },
    ],
  }),
}));

interface OfficeSeed {
  eyebrow: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

const officeSeeds: OfficeSeed[] = [
  { eyebrow: 'Head office', city: 'Haugesund, Norway', address: 'Garpeskjærveien 2, 5527 Haugesund', phone: '+47 400 07 710', email: 'post@reachsubsea.com' },
  { eyebrow: 'Office', city: 'Aberdeen, UK', address: '20 Exchange Street, Aberdeen AB11 6PH', phone: '+44 1224 900 710', email: 'uk@reachsubsea.com' },
  { eyebrow: 'Office', city: 'Singapore', address: '1 Marina Boulevard, Singapore 018989', phone: '+65 6700 0710', email: 'apac@reachsubsea.com' },
];

export const officeItems: FeedItem[] = officeSeeds.map((seed) => ({
  ...cardPresets.office({
    surface: 'white',
    eyebrow: seed.eyebrow,
    title: seed.city,
    meta: [
      { icon: 'map-pin', text: seed.address },
      { icon: 'phone', text: seed.phone },
      { icon: 'mail', text: seed.email },
    ],
  }),
}));

interface DocumentSeed {
  eyebrow: string;
  title: string;
  size: string;
  date: string;
}

const documentSeeds: DocumentSeed[] = [
  { eyebrow: 'Annual report · 2025', title: 'Annual & Sustainability Report 2025', size: '12.4 MB', date: '27 Mar 2026' },
  { eyebrow: 'Quarterly report · Q2 2026', title: 'Q2 2026 interim results', size: '2.1 MB', date: '14 Aug 2026' },
  { eyebrow: 'Governance', title: 'Notice of annual general meeting 2027', size: '640 KB', date: '2 Apr 2027' },
];

export const documentItems: FeedItem[] = documentSeeds.map((seed) => ({
  ...cardPresets.document({
    surface: 'white',
    eyebrow: seed.eyebrow,
    title: seed.title,
    meta: [
      { icon: 'file-text', text: seed.size },
      { icon: 'calendar', text: `Published ${seed.date}` },
    ],
  }),
}));

/**
 * Latest = Document + News + Event presets side by side (docs/05 §2.3). The Figma example
 * ("Latest info (Source = Latest), on Tint") shows all three with a thumbnail image rather than
 * each preset's own native media (Document and Event default to `none`) — followed here as a
 * deliberate deviation, see the block report.
 */
export const latestItems: FeedItem[] = [
  cardPresets.document({
    media: 'image-top',
    surface: 'white',
    image: { alt: 'Cover of the Q2 2026 interim results' },
    eyebrow: 'Report · Q2 2026',
    badge: undefined,
    title: 'Q2 2026 interim results',
    description: undefined,
    meta: [],
    action: { label: 'Download report (PDF)', url: '#', action: 'file' },
  }),
  cardPresets.news({
    media: 'image-top',
    surface: 'white',
    image: { alt: 'Reach Falcon at berth' },
    eyebrow: 'News · 3 Sep 2026',
    badge: undefined,
    title: 'Reach Subsea wins new subsea contract',
    description: 'A multi-year IMR agreement covering three fields in the North Sea.',
    action: { label: 'Read article', url: '#', action: 'page' },
  }),
  cardPresets.event({
    media: 'image-top',
    surface: 'white',
    image: { alt: 'Conference hall' },
    eyebrow: 'Event · 15 Oct 2026',
    badge: undefined,
    title: 'Offshore Technology Conference',
    meta: [],
    action: { label: 'Event details', url: '#', action: 'external' },
  }),
];

export const feedSamples = {
  projects: projectItems,
  assets: assetItems,
  news: newsItems,
  events: eventItems,
  people: peopleItems,
  offices: officeItems,
  documents: documentItems,
  latest: latestItems,
};
