// Company › Sustainability (7 Oct 2026). Sources, in their own wording (condensed only where a card or panel
// needs it; em dashes swapped for commas):
// - Client PDF p36–37 ("15 — Company — Sustainability", Full Resolution screens) and Design Reference p17: the
//   hero, the ESG pillars (each led by its claim), the SDG list, "Read the full picture" and the FAQs.
// - Dev /company/hseq/sustainability/ and its children (7 Oct 2026): what we do for each UN goal (Our UN
//   Sustainability Goals), the 2050 climate-neutral fleet ambition (Sustainability Introduction), the CFO as the
//   sustainability contact.
// - 2Q 2026 report p26 (ESG 2Q highlights) and p28–29 (revenue by segment): the figures in the numbers band.
// Figures are never typed here when a shared data file has them: key-figures.ts and investor-results.ts.
//
// Not used, for Ross / Reach to confirm:
// - The PDF's "4 ISO management-system certifications" and its ISO 31000:2018 tile: ISO 31000 is a guideline
//   standard that cannot be certified, and the live HSEQ page lists three certificates (company.ts).
// - "A Board with 43% female representation" (PDF governance pillar, dev Goal 5): 43% is 3 of 7, and the current
//   Board (people.ts) has five members. Left out until Reach gives the current figure. Dev's "Group Management
//   consists of 20% women" is left out for the same reason.
// - "529 employees" (PDF social pillar): the site says 500+ everywhere (key-figures.ts), so the copy uses that.
//
// WordPress proposal: a Sustainability options page (intro, pillars[], goals[] with goal number, title and
// actions[], contact) and the FAQ post type (topic Sustainability). The SDG tiles are the UN's official icons
// (media library), used unaltered for information (UN SDG logo guidelines).
import { pickFigures } from './key-figures';
import { people as team } from './people';

const [people, ghgTarget] = pickFigures(['people', 'ghg-target']).map((f) => f.value);

/** Hero (PDF p36). The PDF's three-line lead is cut to the vision and the framework. */
export const sustainabilityIntro = {
  title: 'A sustainable future for our people, our clients and the ocean',
  lead: 'Our vision, sustainable access to ocean space, is built on an ESG framework that keeps us accountable.',
};

/** The ESG pillars (PDF p36), each led by its claim. The PDF's priority labels are back as a tag over the claim
 * (Ross, 7 Oct 2026; over the pillar name they read in the wrong order, Q117). `proof` is the PDF's line
 * under each card, shown after the copy. Pictograms:
 * Ross's redraws for the pillars (Figma 421:9631 globe-hand, 421:9647 handshake, 421:9691 legal, 7 Oct 2026). */
export const pillars = [
  {
    slug: 'environmental',
    priority: 'Our biggest lever',
    pillar: 'Environmental',
    pictogram: 'globe-hand',
    title: 'Technology choices drive our impact',
    text: 'The decisions with the greatest environmental effect are the technology we choose to build and deploy. Reach Remote is the single biggest of these: replacing crewed transits with uncrewed operations cuts fuel burn and emissions per project, alongside monitoring technologies like gWatch, which detect seabed and reservoir issues earlier, before they require a larger intervention. Beyond that: a continued shift toward lower-CO2 vessels, degradable hydraulic oils where possible, and no major environmental releases to date.',
    proof: `${ghgTarget} GHG emission reduction target by 2030, in line with the Paris Agreement.`,
  },
  {
    slug: 'social',
    priority: 'Our first priority',
    pillar: 'Social',
    pictogram: 'handshake',
    title: 'Health and safety, first',
    text: `We operate offshore, in one of the highest-risk industries there is, so health and safety comes before schedule or cost in every decision we make: not one priority alongside several others. That shows up in our safety management system and ongoing training across our ${people} people, alongside a deliberate push for a more diverse pipeline into offshore and technical roles; 18% of our workforce is women today.`,
    proof: 'ISO 45001-certified occupational health & safety management.',
  },
  {
    slug: 'governance',
    priority: 'Why it matters now',
    pillar: 'Governance',
    pictogram: 'legal',
    title: 'Cyber security, as a technology company',
    text: "As a technology company whose assets and operations run increasingly on remote systems and data, from Reach Remote's uncrewed vessels to the information we handle on behalf of clients, cyber security is core to how we are governed, not an add-on. Alongside it: anti-corruption measures and modern slavery prevention across our supply chain, and reporting aligned with the Transparency Act.",
    proof: 'Working toward ISO 27001 certification for information security.',
  },
];

/** Section intros (PDF p36–37). */
export const pillarsIntro = {
  eyebrow: 'Our ESG framework',
  title: 'Environmental, Social and Governance',
  intro: 'Each pillar leads with where our own decisions have the greatest effect, not a general survey of activity.',
};

export const goalsIntro = {
  eyebrow: 'Global goals',
  title: 'The UN Sustainable Development Goals most relevant to our work',
  intro: 'We direct our sustainability efforts toward the goals where Reach Subsea can have the most meaningful impact.',
};

/** The nine goals (PDF p37 list; dev "Our UN Sustainability Goals" for what we do under each, typos fixed:
 * "degradeable", "Live below water", "Installment of"). Goal 5's Board and management percentages are left out
 * (see the header note). Names are the UN's official goal titles. */
export const goals = [
  {
    goal: 3,
    title: 'Good health and well-being',
    actions: [
      'Health and safety measures for all personnel involved in our operations',
      'HSEQ campaigns with a focus on health and well-being',
    ],
  },
  {
    goal: 4,
    title: 'Quality education',
    actions: [
      'An online training portal with courses for employees',
      'Local training programmes in Norway and Trinidad & Tobago',
      'Contributing to engineering studies',
    ],
  },
  {
    goal: 5,
    title: 'Gender equality',
    actions: ['Equal opportunities for all', 'A deliberate push for a more diverse pipeline into offshore and technical roles'],
  },
  {
    goal: 6,
    title: 'Clean water and sanitation',
    actions: ['A focus on reducing water use, at the office and on our vessels'],
  },
  {
    goal: 7,
    title: 'Affordable and clean energy',
    actions: [
      'A focus on the future transition to renewable segments',
      'Reducing emissions by hiring vessels with lower emissions',
      'Installing battery packs',
    ],
  },
  {
    goal: 8,
    title: 'Decent work and economic growth',
    actions: [
      'Quality in everything we do',
      'A focus on health and safety measures',
      'Trainee programmes in several locations',
      'Good working conditions',
    ],
  },
  {
    goal: 9,
    title: 'Industry, innovation and infrastructure',
    actions: [
      'Contributing to engineering studies',
      'Sustainability as a key factor in innovation',
      'Encouraging innovation by hiring emission-friendly vessels',
    ],
  },
  {
    goal: 13,
    title: 'Climate action',
    actions: [
      'A future transition to renewable segments',
      'A focus on lower CO2 emissions when hiring vessels',
      'Degradable hydraulic oils in our ROV systems',
      'Environmentally friendly chemicals',
    ],
  },
  {
    goal: 14,
    title: 'Life below water',
    actions: [
      'Zero major spills',
      'Degradable hydraulic oils in our ROV systems',
      'Degradable options for subsea equipment',
      'Marine mammal preservation programmes',
    ],
  },
];

/** Sustainability contact (dev "Our UN Sustainability Goals": "please feel free to contact CFO, Arne Joa"). Name,
 * role and details from people.ts, never retyped. */
const cfo = team.find((p) => p.slug === 'arne-joa')!;
export const sustainabilityContact = {
  label: 'Sustainability',
  name: cfo.name,
  role: cfo.role,
  phone: cfo.phone?.label.replace(/\u00a0/g, ' '),
  email: cfo.email?.label,
};

// ── Sponsorship (dev /company/hseq/sustainability/sponsorship-at-reach-subsea/, 8 Oct 2026) ────────────────────
// The dev page in its own wording, in the dev order: intro, Our purpose, Sponsorship criteria, What we don't
// sponsor, then Governance, Application process and Reporting merged into one process (the steps an applicant
// meets). Left out: dev's "next due date is 01 April 2026" (already past; the two yearly dates say it without
// going stale) and "Deadlines and evaluation timelines are communicated regularly".
// For Reach to confirm: the sponsorship portal's address (dev says "submitted via our sponsorship portal" but has
// no link), so `portal` is `#`.
// WordPress: a Sponsorship options page (intro, the three lists, the steps, the two due dates, portal URL, email).

export const sponsorship = {
  title: 'Sponsorship',
  lead: 'How we select, support and manage sponsorships that make a measurable difference.',
  introTitle: 'More than support',
  intro:
    'At Reach Subsea, sponsorship is more than support: it’s a strategic commitment to communities, causes and initiatives that reflect our values and purpose. Through our sponsorship programme, we aim to make a meaningful impact while fostering pride and engagement across our organisation.',
  /** Hub teaser (Sustainability page). */
  teaser:
    'We sponsor events, organisations and initiatives that reflect our values, especially those supporting underrepresented and vulnerable groups in local communities.',
  /** Dev's "Reach Subsea maintains a non-political and non-religious sponsorship policy", the policy block's intro. */
  policyIntro: 'We maintain a non-political and non-religious sponsorship policy.',
  /** Dev's three lists, each card's title now its lead-in (dev: "We sponsor … that:", "applicants must
   * demonstrate:", "We do not fund:"), so the lists start on one line across the row. */
  policy: [
    {
      title: 'What we sponsor',
      points: [
        'Initiatives that align with our business objectives and corporate social responsibility',
        'Support for underrepresented and vulnerable groups, especially in local communities',
        'Causes with personal involvement from our employees',
        'Activities that strengthen our employer brand and showcase Reach Subsea as a great place to work',
      ],
    },
    {
      title: 'What we look for',
      points: [
        'Relevance: alignment with our values, goals and CSR strategy',
        'Positive impact: clear societal, environmental or industry benefit',
        'Professionalism: a structured and credible approach to planning and execution',
        'Target audience: reach and relevance to our markets or CSR priorities',
      ],
    },
    {
      title: 'What we don’t fund',
      points: [
        'Political campaigns or candidates',
        'Religious campaigns or activities',
        'Initiatives that present conflicts of interest or lack transparency',
      ],
    },
  ],
  /** Applications are reviewed twice a year (dev: "due dates 01 April and 01 November"). */
  dueDates: ['1 April', '1 November'],
  process:
    'Sponsorships are managed by a dedicated Sponsorship Committee of cross-functional team members. Only complete applications submitted through our portal are considered.',
  processTitle: 'Reviewed twice a year',
  steps: [
    {
      title: 'Apply through our portal',
      text: 'Submit your application through our sponsorship portal. Relevant documentation can be sent to sponsorship@reachsubsea.com.',
    },
    {
      title: 'Committee review',
      text: 'The Sponsorship Committee reviews applications and evaluates their impact and alignment with our policy.',
    },
    {
      title: 'Decision',
      text: 'If your application is approved, you will receive formal feedback within two weeks of the submission deadline.',
    },
    {
      title: 'Reporting & evaluation',
      text: 'Every sponsored activity is evaluated after the event, with its impact included in our monthly internal reporting and public disclosures, so we keep improving.',
    },
  ],
  portal: '#',
  email: 'sponsorship@reachsubsea.com',
};

/** The CTA panel's contact: the committee, by email (dev "Questions"). No label: the panel's title already asks. */
export const sponsorshipContact = {
  name: 'Sponsorship Committee',
  email: sponsorship.email,
};
