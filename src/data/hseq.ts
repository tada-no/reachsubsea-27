// Company › HSEQ (6 Oct 2026, Q115). One hub (/company/hseq/) and two child pages: Life-Saving Rules and HSEQ
// campaigns. Sources, in their own wording (condensed only where a card or tile needs it):
// - Client PDF p34–35 ("14 — Company — HSEQ"): the title, the six areas, "Operating to recognised industry
//   standards", the three FAQs and the CTA. Its "re-verify each ID" note is internal and not used.
// - Live https://reachsubsea.no/hseq/ (6 Oct 2026): intro, the six areas in full, standards and supplier IDs,
//   the 11 policies and the Code of Conduct 2025, the whistleblowing channel, the campaign archive, the HSEQ
//   contact. Every file URL below is the live media-library URL, checked 200 on 6 Oct 2026.
// - Dev /company/hseq/* (six child pages): the Life-Saving Rules page (the nine rules, their "I …" commitments
//   and the IOGP icons).
// - Live https://reachsubsea.no/transparency-act/ (8 Oct 2026): the Transparency Act page and its June 2026 statement
//   (newer than dev's June 2025 one: the procedure is now owned by the CEO, and an early-2026 audit is added).
// - The Q2 2026 campaign poster (live, 2026/07): the featured campaign's copy, transcribed.
// Not used: the Q2 2026 report's HSEQ figures (LTIs, spills): quarterly figures stay in Investors (Q115).
//
// WordPress proposal:
// - HSEQ options page: intro, areas[] (title, text), certificates[] (standard, scope, file), registrations[]
//   (scheme, id, country), policies[] (title, file), codeOfConduct (title, file), whistleblowing url, contact.
// - Life-Saving Rules: a repeater on the child page (icon SVG, title, rule, commitments[]), poster file.
// - HSEQ campaign post type: year, quarter, topic, title, poster image, optional PDF, optional body (the
//   featured campaign's sections). The latest published campaign is the featured one; the archive is the rest.

/** Hero and intro (PDF p34 hero; live /hseq/ intro). */
export const hseqIntro = {
  title: 'Zero harm to people, environment and equipment',
  lead: 'HSEQ is a core value in our day-to-day operations, built on systematic risk management and respectful, constructive dialogue.',
  cultureTitle: 'Commitment to compliance stems from a strong HSEQ culture',
  /** Trimmed from the live intro (two paragraphs) to a two-line section intro over the six area cards (7 Oct 2026). */
  cultureIntro:
    'We implement Quality and HSE measures systematically, from early Project Risk Assessments through ongoing risk management, on a culture of respectful, constructive dialogue.',
};

/** The six areas (PDF p34 cards, live /hseq/ sections), condensed to two sentences each. Pictograms from the
 * library (Figma 33:74), Ross's request (7 Oct 2026): cards with icons. */
export const hseqAreas = [
  {
    title: 'Risk management',
    pictogram: 'planner',
    text: 'Formal risk and opportunity reviews are held monthly at corporate level. Every project has an operational, commercial and HSE risk evaluation, and the HSEQ department follows up the mitigation.',
  },
  {
    title: 'Safety',
    pictogram: 'life-ring',
    text: 'Safe delivery starts with the offshore workforce taking an active part in planning. The competence of every person approved to work for us is the technical integrity we operate on.',
  },
  {
    title: 'Employee involvement & competence',
    pictogram: 'teach-people',
    text: 'Employees take part in risk assessments, HSEQ meetings, audits and the Working Environment Committee. Everyone gets HSEQ training for their tasks and risks, much of it through our own e-learning platform, ReachED.',
  },
  {
    title: 'Environmental management',
    pictogram: 'leaf-hand',
    text: 'Our target is zero spill to the environment. We favour modern, energy-efficient assets, encourage vessel owners to install battery packs, and report and follow up every environmental impact.',
  },
  {
    title: 'Security',
    pictogram: 'fingerprint',
    text: 'As our operations expand geographically, we continuously assess emerging risks and adapt our safety and security measures to local regulations.',
  },
  {
    title: 'Quality',
    pictogram: 'goals',
    text: 'Quality is at the heart of everything we do: safe, efficient and reliable operations that meet the highest standards for our people, clients and the environment.',
  },
];

const up = (path: string) => `https://reachsubsea.no/wp-content/uploads/${path}`;

/** ISO certificates (live /hseq/, editions dated 1 Jul 2026). */
export const certificates = [
  { standard: 'ISO 9001:2015', scope: 'Quality management', file: up('2026/07/ISO_9001-ENG-C578900-10-20260701.pdf') },
  { standard: 'ISO 14001:2015', scope: 'Environmental management', file: up('2026/07/ISO_14001-ENG-C578901-10-20260701.pdf') },
  { standard: 'ISO 45001:2018', scope: 'Occupational health and safety', file: up('2026/07/ISO_45001-ENG-C578899-10-20260701.pdf') },
];

/** Supplier qualification registrations (live /hseq/ "HSEQ Standards"). */
export const registrations = [
  { scheme: 'Achilles FPAL / Global Energy', id: '39873', country: 'UK' },
  { scheme: 'Achilles UVDB', id: '21589', country: 'UK' },
  { scheme: 'Achilles JQS', id: '37245', country: 'Norway' },
  { scheme: 'Magnet JQS', id: '2009', country: 'Norway' },
  { scheme: 'SeQual', id: '1520', country: 'UK' },
];

/** Policies (live /hseq/ "Reach Subsea Policies", in the live order) and the Code of Conduct. */
/** One paragraph (Ross, 7 Oct 2026): the live policies intro, condensed, plus the Code of Conduct line. */
export const policiesIntro =
  'Clear, well-developed policies keep our operations consistent, safe and of high quality, and are the foundation of our HSEQ culture. Our Code of Conduct sets out how we keep improving our ethical business practices and personal conduct.';

export const policies = [
  { title: 'Quality policy', file: up('2025/09/REACH-MS-POL-001-Quality-Policy.pdf') },
  { title: 'HSE policy', file: up('2025/09/REACH-MS-POL-003-HSE-policy.pdf') },
  { title: 'Alcohol and drug policy', file: up('2026/01/REACH-MS-POL-002-Alcohol-and-Drug-Policy.pdf') },
  { title: 'Environmental policy', file: up('2025/09/REACH-MS-POL-016-Environmental-Policy.pdf') },
  { title: 'Corporate social responsibility policy', file: up('2025/09/REACH-MS-POL-004-Corporate-Social-Responsibility-Policy.pdf') },
  { title: 'Modern slavery policy', file: up('2025/09/REACH-MS-POL-017-Modern-Slavery-Policy.pdf') },
  { title: 'Security policy', file: up('2026/01/REACH-MS-POL-006-Security-Policy.pdf') },
  { title: 'Anti-bribery policy', file: up('2025/09/REACH-MS-POL-007-Anti-bribery-Policy.pdf') },
  { title: 'Stop the job policy', file: up('2025/09/REACH-MS-POL-011-Stop-the-job-Policy.pdf') },
  { title: 'Phone policy', file: up('2025/09/REACH-MS-POL-012-Phone-Policy.pdf') },
  { title: 'Whistleblowing policy', file: up('2025/11/REACH-MS-POL-024-Whistleblowing-Policy.pdf') },
];

export const codeOfConduct = {
  title: 'Code of Conduct 2025',
  text: 'We are always working to improve our ethical business practices and personal conduct.',
  file: up('2025/12/Code-of-Conduct-2025.pdf'),
};

/** Whistleblowing (live /hseq/). */
export const whistleblowing = {
  title: 'Whistleblowing channel',
  text: 'Report suspected misconduct or wrongdoing in our organisation, with enhanced protection for the person reporting.',
  url: 'https://reachsubsea.whistlelink.com',
};

/**
 * The Transparency Act (live /transparency-act/, the June 2026 statement), the legal page at /transparency-act/.
 * The live wording, with its grammar fixed ("that offer" → "that offers", "efforts in to identifying" → "efforts in
 * identifying"). For Reach to confirm: the live intro calls it "also known as the Transparency in Supply Chains Act"
 * and describes it as aimed at human trafficking, forced labour and modern slavery. Norway's Transparency Act
 * (Åpenhetsloven) is about fundamental human rights and decent working conditions, and the Transparency in Supply
 * Chains Act is a Californian law; kept as published until Reach (or their counsel) confirms.
 */
export const transparencyAct = {
  title: 'Transparency Act',
  text: 'How we respect fundamental human rights and ensure decent working conditions in our operations and supply chains.',
  url: '/transparency-act/',
  statement: 'Statement, June 2026',
  file: up('2026/07/The-Transparency-Act-Reach-Subsea-ASA-statement-June-2026.pdf'),
  introTitle: 'Transparency and accountability',
  intro: [
    'Reach Subsea ASA (“Reach Subsea”, “Reach” or “the Group”) is a prominent offshore contractor that offers high quality solutions and technology to clients in need of ocean data and services. With a strong commitment to transparency and accountability, Reach Subsea has taken proactive steps to ensure compliance with the Transparency Act.',
    'The Transparency Act, also known as the Transparency in Supply Chains Act, is a legislative framework aimed at promoting transparency and combating human trafficking, forced labour and modern slavery in supply chains. Organisations are required to disclose their efforts in identifying and addressing these issues within their operations and supply chains.',
    'Recognising the significance of these global challenges and the importance of ethical practices, Reach Subsea has adopted the Transparency Act as part of its corporate responsibility strategy. The company firmly believes in the principles of human rights, fair labour practices and environmental sustainability.',
  ],
  processTitle: 'Process to fulfil the Transparency Act',
  /** Live: the procedure "has been put in place to ensure that we fully adhere to the regulations", "is owned by the
   * Reach Subsea CEO", and the early-2026 audit "was concluded with a satisfactory result". */
  process:
    'Our procedure, Safeguarding the Transparency Act (REACH‑ADM‑WP‑011), ensures that we fully adhere to the regulations. It is owned by our CEO, and an audit in early 2026 verified our compliance with a satisfactory result.',
  /** "The procedure applies to all activities concerning the Company’s actions including:" (short titles added). */
  scope: [
    { title: 'Human rights', text: 'Promoting our respect for fundamental human rights.' },
    { title: 'Working conditions', text: 'Ensuring decent working conditions in connection with the delivery of our services.' },
    { title: 'Public access', text: 'Ensuring public access to information accordingly.' },
  ],
};

/** HSEQ contact (live /hseq/ "Would you like to talk to us about HSEQ?"). */
export const hseqContact = {
  label: 'HSEQ',
  name: 'Sigbjørn Aga',
  role: 'VP HSEQ',
  phone: '+47 901 91 330',
  email: 'sag@reachsubsea.no',
};

// ── Life-Saving Rules (dev /company/hseq/life-saving-rules/) ──────────────────────────────────────────

export const lifeSavingRulesIntro = {
  title: 'Life-Saving Rules',
  lead: 'The IOGP Life-Saving Rules focus on the most common causes of serious injuries and fatalities, so everyone can work safer and go home unharmed.',
  poster: up('2023/03/Reach-Subsea-Life-saving-rules.pdf'),
};

export interface LifeSavingRule {
  slug: string;
  title: string;
  rule: string;
  commitments: string[];
}

/** The nine rules in IOGP order; the icon is `/images/hseq/life-saving-rules/<n>.svg` (dev media, IOGP icons). */
export const lifeSavingRules: LifeSavingRule[] = [
  {
    slug: 'bypassing-safety-controls',
    title: 'Bypassing safety controls',
    rule: 'Obtain authorisation before overriding or disabling safety controls',
    commitments: [
      'I understand and use safety-critical equipment and procedures which apply to my task',
      'I obtain authorisation before disabling or overriding safety equipment, deviating from procedures or crossing a barrier',
    ],
  },
  {
    slug: 'confined-space',
    title: 'Confined space',
    rule: 'Obtain authorisation before entering a confined space',
    commitments: [
      'I confirm energy sources are isolated',
      'I confirm the atmosphere has been tested and is monitored',
      'I check and use my breathing apparatus when required',
      'I confirm there is an attendant standing by',
      'I confirm a rescue plan is in place',
      'I obtain authorisation to enter',
    ],
  },
  {
    slug: 'driving',
    title: 'Driving',
    rule: 'Follow safe driving rules',
    commitments: [
      'I always wear a seatbelt',
      'I do not exceed the speed limit, and reduce my speed for road conditions',
      'I do not use phones or operate devices while driving',
      'I am fit, rested and fully alert while driving',
      'I follow journey management requirements',
    ],
  },
  {
    slug: 'energy-isolation',
    title: 'Energy isolation',
    rule: 'Verify isolation and zero energy before work begins',
    commitments: [
      'I have identified all energy sources',
      'I confirm that hazardous energy sources have been isolated, locked and tagged',
      'I have checked there is zero energy and tested for residual or stored energy',
    ],
  },
  {
    slug: 'hot-work',
    title: 'Hot work',
    rule: 'Control flammables and ignition sources',
    commitments: [
      'I identify and control ignition sources',
      'Before starting any hot work, I confirm flammable material has been removed or isolated, and I obtain authorisation',
      'Before starting hot work in a hazardous area, I confirm a gas test has been completed and gas will be monitored continually',
    ],
  },
  {
    slug: 'line-of-fire',
    title: 'Line of fire',
    rule: 'Keep yourself and others out of the line of fire',
    commitments: [
      'I position myself to avoid moving objects, vehicles, pressure releases and dropped objects',
      'I establish and obey barriers and exclusion zones',
      'I take action to secure loose objects and report potential dropped objects',
    ],
  },
  {
    slug: 'safe-mechanical-lifting',
    title: 'Safe mechanical lifting',
    rule: 'Plan lifting operations and control the area',
    commitments: [
      'I confirm that the equipment and load have been inspected and are fit for purpose',
      'I only operate equipment that I am qualified to use',
      'I establish and obey barriers and exclusion zones',
      'I never walk under a suspended load',
    ],
  },
  {
    slug: 'work-authorisation',
    title: 'Work authorisation',
    rule: 'Work with a valid permit when required',
    commitments: [
      'I have confirmed if a permit is required',
      'I am authorised to perform the work',
      'I understand the permit',
      'I have confirmed that hazards are controlled and it is safe to start',
      'I stop and reassess if conditions change',
    ],
  },
  {
    slug: 'working-at-height',
    title: 'Working at height',
    rule: 'Protect yourself against a fall when working at height',
    commitments: [
      'I inspect my fall protection equipment before use',
      'I secure tools and work materials to prevent dropped objects',
      'I tie off 100% to approved anchor points while outside a protected area',
    ],
  },
];

// ── HSEQ campaigns (live /hseq/ archive; dev /company/hseq/hseq-campaigns/) ──────────────────────────────

export const campaignsIntro = {
  title: 'HSEQ campaigns',
  lead: 'Our quarterly HSEQ campaigns keep awareness high, reduce risk and strengthen our HSEQ culture.',
  body: 'Every campaign poster since 2021. Our campaigns support compliance, improve efficiency and show our commitment to people, safety, quality and the environment.',
  /** The poster's address (Ross, 7 Oct 2026: .com, as on the Q2 2026 poster; dev had .no). */
  feedback: 'hseq@reachsubsea.com',
};

export interface Campaign {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  /** The poster's kicker, e.g. "Safety first". */
  topic: string;
  title: string;
  /** `/images/hseq/campaigns/<year>-q<quarter>.<ext>` (live media, downloaded 6 Oct 2026). */
  poster: string;
  width: number;
  height: number;
  /** The poster as a PDF (Ross, 7 Oct 2026: a poster opens its PDF, with a Download link). Originals for Q2 2026
   * and Q1–Q3 2021; the rest are `placeholderPdf` until Reach sends them. */
  file?: string;
}

const poster = (year: number, q: number, ext: 'png' | 'jpg') => `/images/hseq/campaigns/${year}-q${q}.${ext}`;
/** PLACEHOLDER (7 Oct 2026): a one-page PDF made from the poster image, so every archive poster opens a PDF
 * (Ross). Replace each with Reach's original poster PDF. */
const placeholderPdf = (year: number, q: number) => `/files/hseq/placeholder/hseq-campaign-${year}-q${q}.pdf`;

/** Newest first. Titles and topics transcribed from the posters. Q2 2026: the poster PDF Ross supplied
 * (ref/REA26 2842.110 Q2 HSEQ Manual handling V3.pdf), its image rendered from it. */
export const campaigns: Campaign[] = [
  { year: 2026, quarter: 2, topic: 'Safety first', title: 'Stop & think before lifting', poster: poster(2026, 2, 'png'), width: 1000, height: 1415, file: '/files/hseq/hseq-campaign-q2-2026-stop-think-before-lifting.pdf' },
  { year: 2026, quarter: 1, topic: 'Tired minds make risky decisions', title: 'Fatigue reduces performance long before you notice it', poster: poster(2026, 1, 'png'), width: 671, height: 955, file: placeholderPdf(2026, 1) },
  { year: 2025, quarter: 4, topic: 'Well-being & mental health', title: 'Take care of your emotional health and well-being', poster: poster(2025, 4, 'jpg'), width: 724, height: 1024, file: placeholderPdf(2025, 4) },
  { year: 2025, quarter: 3, topic: 'Aligning voices & values', title: 'Culture shapes how we connect', poster: poster(2025, 3, 'png'), width: 1000, height: 1424, file: placeholderPdf(2025, 3) },
  { year: 2025, quarter: 2, topic: 'It’s the little things', title: 'Covered. Protected. Ready.', poster: poster(2025, 2, 'png'), width: 867, height: 1180, file: placeholderPdf(2025, 2) },
  { year: 2025, quarter: 1, topic: 'Inclusive & healthy workplaces', title: 'Integrity and respect help people thrive', poster: poster(2025, 1, 'png'), width: 553, height: 787, file: placeholderPdf(2025, 1) },
  { year: 2024, quarter: 4, topic: 'Stay sober, stay safe', title: 'Clear minds ensure a safer workplace', poster: poster(2024, 4, 'png'), width: 552, height: 785, file: placeholderPdf(2024, 4) },
  { year: 2024, quarter: 3, topic: 'Empowering safety mindsets', title: 'Safety first: Stop the Job policy', poster: poster(2024, 3, 'png'), width: 553, height: 783, file: placeholderPdf(2024, 3) },
  { year: 2024, quarter: 2, topic: 'Well-being & mental health', title: 'Take care of your emotional health and well-being', poster: poster(2024, 2, 'png'), width: 589, height: 835, file: placeholderPdf(2024, 2) },
  { year: 2024, quarter: 1, topic: 'Navigate safely', title: 'Smooth onboarding process', poster: poster(2024, 1, 'png'), width: 601, height: 850, file: placeholderPdf(2024, 1) },
  { year: 2023, quarter: 4, topic: 'IT security awareness', title: 'Protecting our digital world', poster: poster(2023, 4, 'png'), width: 662, height: 937, file: placeholderPdf(2023, 4) },
  { year: 2023, quarter: 3, topic: 'Dropped object prevention', title: 'Safe position & gear, to keep you clear', poster: poster(2023, 3, 'jpg'), width: 784, height: 1114, file: placeholderPdf(2023, 3) },
  { year: 2023, quarter: 2, topic: 'IOGP', title: 'Life-Saving Rules', poster: poster(2023, 2, 'jpg'), width: 789, height: 1105, file: placeholderPdf(2023, 2) },
  { year: 2023, quarter: 1, topic: 'Well-being & mental health', title: 'Take care of your emotional, psychological & social well-being', poster: poster(2023, 1, 'jpg'), width: 789, height: 1119, file: placeholderPdf(2023, 1) },
  { year: 2022, quarter: 4, topic: 'Prevention of eye injuries', title: 'Look after your eyes, prevent a life in the dark', poster: poster(2022, 4, 'jpg'), width: 647, height: 914, file: placeholderPdf(2022, 4) },
  { year: 2022, quarter: 3, topic: 'Inclusive & healthy workplaces', title: 'Integrity and respect, enabling people to thrive', poster: poster(2022, 3, 'jpg'), width: 575, height: 789, file: placeholderPdf(2022, 3) },
  { year: 2022, quarter: 2, topic: 'Quality control focus', title: 'Meet the expectations, deliver quality in every step', poster: poster(2022, 2, 'jpg'), width: 612, height: 843, file: placeholderPdf(2022, 2) },
  { year: 2022, quarter: 1, topic: 'Environmental spill prevention', title: 'Maintain and contain, prevent spills from our operations', poster: poster(2022, 1, 'jpg'), width: 802, height: 1048, file: placeholderPdf(2022, 1) },
  { year: 2021, quarter: 4, topic: 'Dropped object prevention', title: 'Safe position & gear, to keep you clear', poster: poster(2021, 4, 'jpg'), width: 1000, height: 1414, file: placeholderPdf(2021, 4) },
  { year: 2021, quarter: 3, topic: 'Hand & finger injury prevention', title: 'Hold on to your hands', poster: poster(2021, 3, 'jpg'), width: 1000, height: 1419, file: up('2023/03/HSEQ-Campaign-Q3-2021-Hand-injury-2.pdf') },
  { year: 2021, quarter: 2, topic: 'Well-being & mental health', title: 'We are one team, let’s care for each other', poster: poster(2021, 2, 'jpg'), width: 1000, height: 1414, file: up('2023/03/HSEQ-Campaign-Q2-2021-Wellbeing-Mental-Health.pdf') },
  { year: 2021, quarter: 1, topic: 'Trust your gut', title: 'Because of you', poster: poster(2021, 1, 'jpg'), width: 1000, height: 1414, file: up('2023/03/Q1-2021-Because-of-you-gut.pdf') },
];

/** The featured campaign: the newest, its poster written out as page text (Q2 2026, from the poster PDF; Ross,
 * 7 Oct 2026). Order follows the poster: intro, Stop · Think · Lift safe, Offshore risks beside The golden rules,
 * then the closing line. */
export const featuredCampaign = {
  ...campaigns[0],
  lead: 'Manual handling causes 1 in 3 workplace injuries and can lead to lifelong chronic pain. Before you grab it, remember:',
  leadStrong: 'It’s never “just a quick lift.” Stop and think before you lift.',
  /** The poster's worker illustration on its own (Ross, 7 Oct 2026), square, on the poster's ground. */
  illustration: { src: '/images/hseq/campaigns/2026-q2-illustration.jpg', width: 1200, height: 1200 },
  steps: [
    { title: 'Stop', pictogram: 'shield-stop', points: ['Do I need to lift this at all?', 'Is it safe to handle manually?', 'Can I use a trolley, hoist or crane?'] },
    { title: 'Think', pictogram: 'brain', points: ['Is the load too heavy or awkward?', 'Can I team lift?', 'Is my path clear, stable and dry?'] },
    { title: 'Lift safe', pictogram: 'shield-tick', points: ['Keep the load close to your body.', 'Bend your knees, not your back.', 'Smooth movements, no twisting.'] },
  ],
  offshoreRisks: [
    { label: 'Vessel movement', value: 'Wait if unsafe' },
    { label: 'Slippery decks', value: 'Check footing' },
    { label: 'Cold conditions', value: 'Ensure good grip' },
    { label: 'Awkward loads', value: 'Reassess before lift' },
  ],
  /** The poster's four golden rules as Spec rows, condition then action like Offshore risks (Ross, 7 Oct 2026:
   * the sage panel felt wrong). Poster: Max limit 20 kg · No lift is routine · If in doubt, stop · Always ask for help. */
  goldenRules: [
    { label: 'Max limit', value: '20 kg' },
    { label: 'Every lift', value: 'Never routine' },
    { label: 'In doubt', value: 'Stop' },
    { label: 'Need help', value: 'Always ask' },
  ],
  /** The poster's closing question; the slogan under it is dropped (the steps' titles already say it) for the
   * poster's own call to give feedback. */
  closing: { title: 'Still think it’s just a quick lift?', text: 'Please give us your feedback on this campaign.' },
  /** The poster's references line: the source of the 1-in-3 figure, so it sits as fine print under the intro. */
  references: 'Sources: Health and Safety Executive (UK); Safe Work Australia.',
};
