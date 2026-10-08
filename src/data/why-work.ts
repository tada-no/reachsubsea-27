// Careers › Why work with us (8 Oct 2026, Q128). Copy comes from the client PDF ("25 — Careers — Why Work With Us",
// Full Resolution screen p55; Design Reference p27) and the dev site's Why work with us and Explore your path pages
// (/careers/why-work-with-us/everything-within-reach/, …/career-growth/, …/sustainability-in-work/,
// /careers/explore-your-path/offshore-careers/, …/onshore-careers/, …/graduates-students/), in their own wording.
// Figures come from key-figures.ts, never typed here. Long dashes in the PDF copy are now commas or colons, as
// across the site.
//
// Not used: the PDF's "Support to grow, on and offshore" tiles (flagged illustrative there: the real benefits
// package is open with the client, Q128), the dev site's comfort-zone paragraph (Our culture uses it) and the
// Meet our people contacts (three named contacts, no portraits: Life at Reach territory).
//
// For Ross / Reach to confirm:
// - "A close-knit, global team: 500+ people across nine countries" (PDF): nine is the countries Reach has worked in
//   (key figure `countries`); the offices are in four. The copy uses the office count, as Our culture does.
// - Graduates: the dev page recruits for a "2026 intake"; the year is dropped until Reach confirms the next one.
//
// WordPress proposal: a Why work with us section on the Careers options page (intro, reasons[] with a Key figures
// key each, paths[] with facts[]) + the FAQ post type (topic Why work with us).
import { pickFigures } from './key-figures';

const [traineeOffer, traineeSince, uncrewedDays, fuelSaving, people, offices, officeCountries] = pickFigures([
  'trainee-offer',
  'trainee-since',
  'uncrewed-days',
  'fuel-saving',
  'people',
  'offices',
  'office-countries',
]);

/** Hero: the PDF's title and lead. */
export const whyWorkHero = {
  title: 'Why work with us',
  lead: 'Career growth at Reach Subsea is built around learning from experienced colleagues, teaching what you know, and reaching further, together.',
};

/** "Everything within Reach" (dev): the innovators paragraph, then Career growth (dev), one per column. */
export const whyWorkIntro = {
  eyebrow: 'Everything within Reach',
  /** The dev sentence's first clause; the rest opens the first column (the full sentence ran to six lines at 375). */
  title: 'We are not just operators; we are innovators.',
  body: [
    'We push the boundaries of what is possible in the ocean. Our vision is to be the preferred partner for those who need the best subsea solutions. Joining our team means embracing a culture where “Everything is within Reach.” We constantly strive for improvements, knowing that our current capabilities are not the endpoint but a stepping stone to new technological heights.',
    'Our values “Learn, Teach, Reach” are the foundation of your professional journey. We view our people as a strategic investment in our future. From our dedicated trainee programs to professional development for experienced staff, we encourage a continuous drive for solutions, and as we expand into new countries and technological segments, we provide the platform for you to reach your full potential.',
  ],
};

export interface WhyWorkReason {
  title: string;
  text: string;
  figure: string;
  caption: string;
}

/** The PDF's three reasons to join (its cards over the hero), plus the dev site's Sustainability in work. Each
 * carries one proof figure from Key figures. */
export const whyWorkReasons = {
  title: 'Four reasons to build your career with us',
  points: [
    {
      title: 'Real ownership, early on',
      text: 'Structured development paths from graduate and trainee roles through to senior offshore and engineering positions.',
      figure: traineeOffer.value,
      caption: `${traineeOffer.label}, since ${traineeSince.value}.`,
    },
    {
      title: 'Work at the edge of the industry',
      text: 'We build our own technology rather than just buying it off the shelf: AI-enabled perception tools for our ROV fleet, autonomous vessel operations, in-house data infrastructure. Join teams developing what the industry has not built yet.',
      figure: uncrewedDays.value,
      caption: `${uncrewedDays.label}.`,
    },
    {
      title: 'Sustainability in your work',
      text: 'Your career here is tied to a clear objective: delivering safe, effective services that minimise the environmental impact of offshore operations. Sustainability and long-term profitability go hand in hand.',
      figure: fuelSaving.value,
      // The Key figures label ("Fuel saving versus a crewed vessel, up to") is written for a stats row
      caption: 'Maximum fuel saving with Reach Remote, versus a crewed vessel.',
    },
    {
      title: 'A close-knit, global team',
      text: `Working across vessels, operations centres and onshore functions, from ${offices.value} offices in ${officeCountries.value} countries.`,
      figure: people.value,
      caption: `${people.label}.`,
    },
  ] satisfies WhyWorkReason[],
};

/** Explore your path (dev): offshore and onshore on the dev pages' five points, as one comparison (Q134). The
 * dev labels differ in two rows (Key assets / Key tech, Core roles / Core departments): one shared label each. */
export const whyWorkPaths = {
  eyebrow: 'Explore your path',
  title: 'Offshore and onshore',
  intro: 'Start your career where the future of ocean robotics is being written: we recruit graduates through internships and entry-level positions across technical and commercial roles.',
  options: [
    { title: 'Offshore careers', lead: 'Join our first-class offshore crew and work at the forefront of maritime technology.' },
    { title: 'Onshore careers', lead: 'Our onshore teams are the strategic engine behind our global subsea operations.' },
  ],
  rows: [
    {
      label: 'Primary focus',
      values: [
        'Safe and reliable execution of complex subsea tasks using advanced robotics.',
        'Mission management, vessel performance monitoring and real-time data analytics.',
      ],
    },
    {
      label: 'Assets and tech',
      values: [
        'DP2 IMR vessels, high-spec ROVs like the ZeeROV, and the expanding Reach Remote fleet.',
        'AI and digitalisation to manage uncrewed, over-the-horizon maritime operations.',
      ],
    },
    {
      label: 'Work environment',
      values: [
        'High-stakes offshore settings with a focus on HSE performance and the Life-Saving Rules.',
        'Modern office and control centre facilities designed for close collaboration.',
      ],
    },
    {
      label: 'Roles and teams',
      values: [
        'ROV pilots, surveyors, marine crew and offshore project engineers.',
        'Engineering, project management, HSEQ, IT and corporate support.',
      ],
    },
    {
      label: 'Impact',
      values: [
        'Direct involvement in seabed surveys, monitoring and construction support worldwide.',
        'Unlocking capacity and delivering precise, low-emission subsea operations from land.',
      ],
    },
  ],
};

/** CTA (PDF wording). */
export const whyWorkCta = {
  title: 'Ready to find out more?',
  text: 'Browse current openings on our Candidate Portal.',
};
