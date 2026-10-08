// Careers › Our culture (8 Oct 2026, Q127). Copy comes from the client PDF ("24 — Careers — Our Culture", Full
// Resolution screens p53–54; Design Reference p26) in its own wording, and from the live /careers/ page (the
// comfort-zone paragraph the overview leaves out, and the fourth value). The value statements are About's
// (company.ts, the same PDF wording), never retyped. Figures come from key-figures.ts and the office list from
// contact.ts. Long dashes in the PDF copy are now commas or colons, as across the site.
//
// For Ross / Reach to confirm:
// - HOP: the PDF itself notes the five principles are the industry-wide standard, not a Reach programme; the copy
//   should be checked against Reach's own HOP material, if there is any (docs/03 scorecard: "confirm HOP copy").
// - "A team across nine countries" (PDF): nine is the countries Reach has worked in (key figure `countries`);
//   the offices are in four. The heading uses the office count.
// - "Certified to ISO 9001, ISO 14001 and ISO 45001" (PDF): matches the three certificates in company.ts.
// - The fourth value's "in practice" line names the Stop the Job policy and the 2021 "We are one team" campaign
//   (both real, hseq.ts); the PDF has no fourth value.
//
// WordPress proposal: a Culture section on the Careers options page (intro, values' practice lines, people and
// safety cards, HOP intro and principles[]) + the FAQ post type (topic Our culture). The values themselves stay on
// the Company options page.
import { pickFigures } from './key-figures';
import { values as companyValues } from './company';
import { officeList } from './contact';

const [people, officeCountries, traineeSince, traineeOffer] = pickFigures([
  'people',
  'office-countries',
  'trainee-since',
  'trainee-offer',
]);
const joinAnd = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items.join(''));
const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** Hero (PDF). Its lead opened with "Learn. Teach. Reach. Within Reach —": cut, the values head the first block. */
export const cultureIntro = {
  title: 'Our culture',
  lead: 'The same values that shape how we work with clients also shape how we work with each other.',
};

/** The values block's header. The intro is the live /careers/ paragraph the overview leaves out, shortened. */
export const valuesIntro = {
  title: 'Our values, in practice',
  intro: 'Our values move us out of the comfort zone. That asks us to be awake, curious and open, and to keep a steady eye on the goal through the setbacks.',
};

export interface CultureValue {
  word: string;
  pictogram: string;
  /** A short tag over the copy: what the value is about, from the live /careers/ values sentence. */
  eyebrow: string;
  /** The value statement, then the PDF's "In practice" example in the same paragraph (Ross, 8 Oct 2026: not bold,
   * not a paragraph of its own). */
  text: string;
}

const practice: Record<string, string> = {
  learn: `In practice: structured onboarding, cross-training between vessel, ROV and survey disciplines, and a trainee programme that has run since ${traineeSince.value}.`,
  teach: `In practice: experienced offshore and engineering staff mentor every trainee, with a ${traineeOffer.value} offer rate for participants to date.`,
  reach: 'In practice: our own R&D programme and Reach Remote, our uncrewed vessel platform, both grew out of this value.',
};

/** Tags from the live /careers/ values sentence ("search for new and relevant insight", "sharing of knowledge",
 * "having ambitions", "we have manifested our commitment to never leave anyone behind"). */
const eyebrow: Record<string, string> = {
  learn: 'New and relevant insight',
  teach: 'Sharing knowledge',
  reach: 'Having ambitions',
};

/** Learn · Teach · Reach (About's wording) with the PDF's practice lines, then the live site's fourth value. */
export const cultureValues: CultureValue[] = [
  ...companyValues.map((v) => ({ word: v.word, pictogram: v.pictogram, eyebrow: eyebrow[v.id], text: `${v.text} ${practice[v.id]}` })),
  {
    word: 'Leave no one behind',
    pictogram: 'value-behind',
    eyebrow: 'Our commitment',
    text: 'A commitment we have manifested. It is the attitude we expect from our people. In practice: our Stop the Job policy, and HSEQ campaigns such as “We are one team, let’s care for each other”.',
  },
];

const cities = officeList.map((o) => (o.hq ? `${o.city} (HQ)` : o.city));

/** "Our people" and "Safety & quality" (PDF, two columns on tint), as two photo cards. */
export const peopleAndSafety = {
  people: {
    eyebrow: 'Our people',
    title: `One team across ${numberWords[Number(officeCountries.value)] ?? officeCountries.value} countries`,
    text: `${people.value} people across offshore, engineering, technology and commercial functions, working from ${joinAnd(cities)}.`,
    image: {
      file: 'team-operations-centre.jpg',
      alt: 'Two colleagues smiling at their desks in an operations centre lined with screens',
      focalPoint: { x: 0.45, y: 0.4 },
    },
    action: { label: 'Our offices', url: '/contact/' },
  },
  safety: {
    eyebrow: 'Safety & quality',
    title: 'HSEQ is everyone’s job',
    text: 'Certified to ISO 9001, ISO 14001 and ISO 45001: safety and quality are built into every role, not treated as a separate function.',
    image: {
      file: 'hero-hseq.jpg',
      alt: 'The open back deck of a Reach vessel under a cloudy sky, a crew member in red overalls by the superstructure',
      focalPoint: { x: 0.5, y: 0.6 },
    },
    action: { label: 'HSEQ', url: '/company/hseq/' },
  },
};

/** Human and Organisational Performance (PDF "Safety philosophy"), the five principles in the PDF's wording. */
export const hop = {
  eyebrow: 'Safety philosophy',
  title: 'Human and Organisational Performance (HOP)',
  body: 'Alongside our ISO-certified management systems, we apply HOP principles: a safety approach widely adopted across the maritime and offshore industry that starts from how people and systems actually work, not how procedures assume they should.',
  principles: [
    {
      title: 'Error is normal',
      text: 'Even skilled, well-trained people make mistakes, so we design work and equipment around that reality, not the assumption of perfect performance.',
    },
    {
      title: 'Blame fixes nothing',
      text: 'We look for what the situation made likely, not who to hold responsible. Blame closes down the learning that prevents repeat incidents.',
    },
    {
      title: 'Context drives behaviour',
      text: 'How work is designed (the equipment, the schedule, the procedure) shapes outcomes far more than individual willpower.',
    },
    {
      title: 'Learning is vital',
      text: 'We learn as much from everyday work as from incidents: waiting for something to go wrong is the slow way to improve.',
    },
    {
      title: 'Response matters',
      text: 'A just, learning-focused response to failure builds the trust that makes people willing to report and improve. A punitive one teaches people to hide problems.',
    },
  ],
};

/** CTA (PDF wording). */
export const cultureCta = {
  title: 'Want to be part of it?',
  text: 'Browse current openings on our Candidate Portal.',
};
