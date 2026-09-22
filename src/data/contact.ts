// Contact (22 Sep 2026, Q73). Offices, "also present" places, topic mailboxes and the Contact FAQs.
// Every value has a source: the client PDF p59 ("27 — Contact") or the dev site's /contact/ map data
// (`window.contactMapData.locations`, Sep 2026). Nothing is invented; where the two disagree, Q73 decides
// (Singapore: PDF; Aberdeen: PDF email + dev phone). Pins use the dev site's coordinates (city level:
// these are offices, not vessels). Counts are never typed here: the FAQ reads them from key-figures.ts.
//
// WordPress proposal: an **Office** post type (or a Contact options repeater), one row per place:
// `name`, `label` (display name when it differs, e.g. "Sandnes (Stavanger)"), `country`, `address`
// (lines), `phone`, `email`, `lat`, `lng`, `hq` (flag, one row), `type` office | presence, `order`.
// The Offices map block queries it; the footer and the header's "Get in touch" read the HQ row.
// Topic mailboxes: a repeater on the same options page (`topic`, `email`, `pictogram`), rendered as a
// Card grid (3 columns, icon media) on the page (Q75).
// FAQs: the FAQ post type, topic Contact.
import { contactDetails } from './navigation';
import { pickFigures } from './key-figures';

export interface Office {
  id: string;
  /** City, as on the pin. */
  city: string;
  /** Display name in the list when it differs from the city (the client's "Sandnes (Stavanger)"). */
  label?: string;
  country: string;
  /** Office (address, phone or email) or presence (a place Reach is "also present in": pin only). */
  type: 'office' | 'presence';
  hq?: boolean;
  /** Address lines, verbatim from the source. Empty for a presence with no published address. */
  address: string[];
  phone?: { label: string; href: string };
  email?: { label: string; href: string };
  lon: number;
  lat: number;
  /** Where each value came from (handover note, never rendered). */
  source: string;
}

const tel = (label: string) => ({ label, href: `tel:${label.replace(/\(0\)/, '').replace(/[^\d+]/g, '')}` });
const mail = (label: string) => ({ label, href: `mailto:${label}` });

/** The eight offices (PDF p59 order: HQ first, then Norway, then abroad) and the three presence places. */
export const offices: Office[] = [
  {
    id: 'haugesund',
    city: 'Haugesund',
    country: 'Norway',
    type: 'office',
    hq: true,
    address: ['Møllervegen 6', 'NO-5525 Haugesund'],
    phone: contactDetails.phone,
    email: contactDetails.email,
    lon: 5.265066,
    lat: 59.4143575,
    source: 'PDF p59 (address, phone); post@ from contactDetails (footer); pin from dev map',
  },
  {
    id: 'bergen',
    city: 'Bergen',
    country: 'Norway',
    type: 'office',
    address: ['Kanalvegen 119', 'NO-5068 Bergen'],
    phone: tel('+47 55 38 30 00'),
    lon: 5.3457038,
    lat: 60.3640496,
    source: 'PDF p59 (address, phone; dev map agrees); pin from dev map',
  },
  {
    id: 'sandnes',
    city: 'Sandnes',
    label: 'Sandnes (Stavanger)',
    country: 'Norway',
    type: 'office',
    address: ['Vestre Svanholmen 12', '4313 Sandnes'],
    lon: 5.6978546,
    lat: 58.8894092,
    source: 'PDF p59 (label, address; no phone in either source); pin from dev map ("Stavanger (NO)")',
  },
  {
    id: 'harstad',
    city: 'Harstad',
    country: 'Norway',
    type: 'office',
    address: ['Margrethe Jørgensens vei 13', 'N-9406 Harstad'],
    phone: tel('+47 971 82 929'),
    lon: 16.538601,
    lat: 68.7926502,
    source: 'PDF p59 (address, phone; dev map agrees); pin from dev map',
  },
  {
    id: 'billingstad',
    city: 'Billingstad',
    country: 'Norway',
    type: 'office',
    address: ['Billingstadsletta 14', 'NO-1396 Billingstad'],
    phone: tel('+47 4541 4100'),
    lon: 10.4996603,
    lat: 59.8759101,
    source: 'PDF p59 (address, phone; dev map agrees); pin from dev map',
  },
  {
    id: 'west-perth',
    city: 'West Perth',
    country: 'Australia',
    type: 'office',
    address: ['1 Altona Street, Level 3', 'West Perth WA 6005'],
    phone: tel('+61 8 6118 0927'),
    lon: 115.8393995,
    lat: -31.9515788,
    source: 'PDF p59 (address, phone; dev map agrees); pin from dev map ("Australia")',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    type: 'office',
    address: ['100G Pasir Panjang Road', '#03-07/08, Singapore 118523'],
    phone: tel('+65 6513 0589'),
    lon: 103.7518281,
    lat: 1.2998061,
    source: 'PDF p59 (address, Q73; dev map has 22 Pandan Road, 609274); phone in both; pin from dev map',
  },
  {
    id: 'aberdeen',
    city: 'Aberdeen',
    country: 'United Kingdom',
    type: 'office',
    address: ['H1 Building', 'Hill of Rubislaw, AB15 6BL'],
    phone: tel('+44 (0)1224 418210'),
    email: mail('commercial.abz@reachsubsea.com'),
    lon: -2.1510853,
    lat: 57.1419081,
    source: 'PDF p59 (address, email); dev map (phone, Q73); pin from dev map ("United Kingdom")',
  },
  // "Also present in Sweden, Brazil and Cyprus" (PDF p59). Pins only, no cards (Q73).
  {
    id: 'goteborg',
    city: 'Göteborg',
    country: 'Sweden',
    type: 'presence',
    address: ['Första Långgatan 22', '413 28 Göteborg'],
    lon: 11.9475137,
    lat: 57.699567,
    source: 'PDF p59 ("Sweden"); dev map ("Sweden": address, pin)',
  },
  {
    id: 'rio-de-janeiro',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    type: 'presence',
    address: [],
    lon: -43.1728965,
    lat: -22.9068467,
    source: 'PDF p59 ("Brazil"); dev map ("Rio de Janeiro": pin, no address)',
  },
  {
    id: 'cyprus',
    city: 'Cyprus',
    country: 'Cyprus',
    type: 'presence',
    address: [],
    lon: 33.429859,
    lat: 35.126413,
    source: 'PDF p59 ("Cyprus"); dev map ("Cyprus": pin only)',
  },
];

export const officeList = offices.filter((o) => o.type === 'office');
export const presenceList = offices.filter((o) => o.type === 'presence');
export const headquarters = offices.find((o) => o.hq)!;

/** Office cities in list order, HQ marked, for the FAQs (About reuses this). */
export const officeCities = officeList.map((o) => (o.hq ? `${o.city} (HQ)` : o.city));
/** "Sweden, Brazil and Cyprus". */
export const presenceCountries = presenceList.map((o) => o.country);

const joinAnd = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items.join(''));

export interface Mailbox {
  id: string;
  topic: string;
  email: { label: string; href: string };
  /** Line pictogram for the topic card (src/assets/pictograms; Q75). */
  pictogram: string;
}

/** Key contacts by topic (PDF p59), in the PDF's order. Pictograms are the design system's own
 * (Figma page Foundations › Components / Pictograms, `33:74`; docs/extract/figma-pictograms-ledger.json),
 * with their parts tagged for the micro loops in Pictogram.astro (Q75). */
export const mailboxes: Mailbox[] = [
  { id: 'investors', topic: 'Investor relations', email: mail('investors@reachsubsea.com'), pictogram: 'increase-percent-arrows' },
  { id: 'media', topic: 'Press & media', email: mail('media@reachsubsea.com'), pictogram: 'chat-active' },
  { id: 'career', topic: 'Careers & recruitment', email: mail('career@reachsubsea.com'), pictogram: 'team' },
  { id: 'sales', topic: 'Sales', email: mail('sales@reachsubsea.com'), pictogram: 'handshake' },
  { id: 'invoices', topic: 'Invoices', email: mail('invoices@reachsubsea.com'), pictogram: 'money-stack-dollars' },
  { id: 'hseq', topic: 'HSEQ', email: mail('hseq@reachsubsea.com'), pictogram: 'shield-tick' },
];

const [officesFigure, officeCountriesFigure] = pickFigures(['offices', 'office-countries']);
const mailboxFor = (id: string) => mailboxes.find((m) => m.id === id)!;

/** The page's opening words (PDF p59 hero). No Page hero on Contact (Q75): the Offices map block carries them as its h1. */
export const contactIntro = {
  title: 'Get in touch',
  lead: 'If you have any questions, please feel free to get in touch. Use the topic-specific address below, or find the office nearest you.',
};

/** PDF p59 FAQs (FAQ post type, topic Contact). Counts come from Key figures; lists from the data above. */
export const contactFaqs = [
  {
    slug: 'how-to-get-in-touch',
    question: 'How do I get in touch with Reach Subsea?',
    answer: `Use the topic-specific email address that matches your question, or find the office nearest you, both above. For anything else, email ${contactDetails.email.label} or call ${contactDetails.phone.label}.`,
    open: true,
  },
  {
    slug: 'where-are-the-offices',
    question: 'Where are Reach Subsea’s offices located?',
    answer: `${officesFigure.value} offices across ${officeCountriesFigure.value} countries: ${joinAnd(officeCities)}, with further presence in ${joinAnd(presenceCountries)}.`,
  },
  {
    slug: 'investor-or-press',
    question: 'Who do I contact for investor or press inquiries specifically?',
    answer: `Use the dedicated addresses above: ${mailboxFor('investors').email.label} for investor relations and ${mailboxFor('media').email.label} for press.`,
  },
];

if (import.meta.env.DEV && String(officeList.length) !== officesFigure.value) {
  console.warn(`contact.ts: ${officeList.length} offices listed, but Key figures says ${officesFigure.value}`);
}
