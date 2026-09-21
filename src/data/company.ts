// Company › About (19 Sep 2026). Copy comes from the client PDF p30–31 ("12 — Company — About Us") in its own
// wording, plus the promise ("Everything within Reach.", live /about/ and dev vision-values-and-promise), the
// ISO certificates and the management team (dev /company/who-we-are/about-us/). Figures are never typed here:
// they come from key-figures.ts. In WordPress: a Company options page (vision, promise, values) + the People
// post type (management) + the FAQ post type (topic Company).
import { pickFigures } from './key-figures';

const [established, people, offices, officeCountries, countries] = pickFigures([
  'established',
  'people',
  'offices',
  'office-countries',
  'countries',
]);

/** The vision (PDF p30 hero and "Our vision"). */
export const vision = {
  title: 'Sustainable access to ocean space',
  text: 'Our vision underpins our commitment to take part in the creation of a sustainable future, for our clients, our people and the ocean we work in.',
};

/** Our story (PDF p30), verbatim. The PDF hero's "Established in 2008…" lead is carried by the founded figure. */
export const story = {
  title: 'Deep operational experience, moving technology forward',
  body: [
    'We have built our reputation on deep operational experience across the oil &amp; gas and renewables industries: flexible, highly competitive delivery, backed by people who know these environments inside out.',
    'Today that same experience carries our fleet of survey, IMR and remote-operated vessels across subsea, survey &amp; positioning, geophysical monitoring and environmental monitoring, worldwide, and increasingly through technology we have developed ourselves, like Reach Remote and Reach Horizon.',
  ],
};

export interface CompanyValue {
  id: 'learn' | 'teach' | 'reach';
  word: string;
  text: string;
  pictogram: string;
}

/** Learn · Teach · Reach (PDF p30 value cards, the client's condensed wording). */
export const values: CompanyValue[] = [
  {
    id: 'learn',
    word: 'Learn',
    pictogram: 'value-learn',
    text: 'We are in constant search for new and relevant insight, making us agile and difficult to keep up with. We question and challenge established ways of performance, acquiring and developing technology to constantly improve data acquisition, analysis and operations.',
  },
  {
    id: 'teach',
    word: 'Teach',
    pictogram: 'value-teach',
    text: 'We share our knowledge to grow as a team and to improve industry standards, continuously striving to find solutions beyond current paradigms. We share knowledge in-house and use it to succeed in alignment with our clients.',
  },
  {
    id: 'reach',
    word: 'Reach',
    pictogram: 'value-reach',
    text: 'We have ambitions, and we believe everything is within reach. By investing in R&D and driving technological and methodological leaps, we reach for new heights, because no matter how good we get, there is always something better ahead.',
  },
];

/** The promise (live /about/, dev vision-values-and-promise). The last word is the one the values carry. */
export const promise = { lead: 'Everything within', word: 'Reach', short: 'Within Reach.' };

/** Management team (dev /company/who-we-are/about-us/, Sep 2026). Names and roles only on About;
 * portraits and bios live on Leadership & Board. */
export const management = [
  { name: 'Jostein Alendal', role: 'Chief Executive Officer' },
  { name: 'Arne Joa', role: 'Chief Financial Officer' },
  { name: 'Inge Grutle', role: 'Chief Operating Officer' },
  { name: 'Bård Thuen Høgheim', role: 'Chief Commercial Officer' },
  { name: 'Audun Brandtzæg', role: 'Chief Technology Officer' },
];

/** HSEQ certificates (dev about-us). Certificate PDFs to come from Reach; they live on HSEQ. */
export const certificates = [
  { standard: 'ISO 9001:2015', scope: 'Quality' },
  { standard: 'ISO 14001:2015', scope: 'Environment' },
  { standard: 'ISO 45001:2018', scope: 'Health and safety' },
];

/** Office locations (PDF p31 FAQ). */
export const officeCities = ['Haugesund (HQ)', 'Bergen', 'Sandnes', 'Harstad', 'Billingstad', 'Aberdeen', 'Singapore', 'West Perth'];

/** PDF p31 FAQs: genuine questions, answers built from the figures above (FAQ post type, topic Company). */
export const companyFaqs = [
  {
    slug: 'when-established',
    question: 'When was Reach Subsea established?',
    answer: `In ${established.value}. We are headquartered in Haugesund, Norway.`,
    open: true,
  },
  {
    slug: 'where-offices',
    question: 'Where does Reach Subsea have offices?',
    answer: `${officeCities.slice(0, -1).join(', ')} and ${officeCities.at(-1)}, with further presence in Sweden, Brazil and Cyprus: ${offices.value} offices across ${officeCountries.value} countries, reaching clients in ${countries.value} countries in total.`,
  },
  {
    slug: 'how-many-people',
    question: 'How many people work at Reach Subsea?',
    answer: `${people.value} people across our operations, offshore and onshore.`,
  },
];
