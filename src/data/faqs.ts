// FAQ post type (7 Oct 2026, Q126). Every FAQ on the site, each one once. Pages never type their own: they ask for a
// topic (`faqsFor('subsea')`), and the FAQ page lists them all, grouped (`faqGroupsForHub()`).
//
// In WordPress:
// - **FAQ** CPT `faq`: title = question, content = answer, `post_name` = slug (the `#faq-{slug}` deep link),
//   `menu_order` = position in the list below.
// - **FAQ topic** taxonomy `faq_topic`, hierarchical, terms as `faqTopics` below. The six parent terms are the FAQ
//   page's groups, and they double as the topic of their section's overview page (Services overview asks for
//   `services` without children). A FAQ can carry several topics, so a question that belongs on three pages is one
//   post; its first topic is the primary term (Yoast/Rank Math "primary"), which is where the FAQ page lists it.
// - The Accordion block (docs/05 §2.6) with source FAQ: a `topic` select; WP_Query `tax_query` on that term,
//   `include_children` false, `orderby` menu_order. The first item opens. The FAQ page: one Accordion per parent
//   term, `include_children` true, ordered by child term order then menu_order, each post listed once (primary term).
// - Answers are read on their own page and on the FAQ page, so they never say "above" or "on this page"; they name
//   the page instead.
// - Answers built from data below (`${…}`): figures, people, lists and dates. In WordPress, use the Key figures /
//   Latest results shortcodes or block bindings for those values so the answer can't go stale.
//
// Adding a page with FAQs: add its topic to `faqTopics` (under its section's parent), add the FAQs below with that
// topic, and give its Accordion `items={faqsFor('<topic>')}`, `topic`, and the "See all FAQs" action `faqHubHref`.
// Sources are noted per topic; the client PDF's FAQ copy is draft until Reach approves it (Design Reference p30).
import { pickFigures } from './key-figures';
import { contactDetails } from './navigation';
import { officeCities, presenceCountries, mailboxes } from './contact';
import { management, board } from './people';
import { goals } from './sustainability';
import { latestResults as r } from './investor-results';
import { quarterlyReleases, annualReports } from './reports';
import { publications } from './documents';
import { fleetCounts } from './assets';

export interface FaqTopic {
  id: string;
  label: string;
  /** Parent term (a FAQ page group). Unset = a group itself. */
  parent?: string;
  /** The page whose Accordion asks for this topic. */
  page: string;
}

/** A FAQ page group: a parent term, with its section header there. */
export interface FaqGroup extends FaqTopic {
  title: string;
  action?: { label: string; url: string };
}

export interface Faq {
  slug: string;
  question: string;
  answer: string;
  /** Topic ids. The first is the primary topic, which places the FAQ on the FAQ page. */
  topics: string[];
}

/** The six groups, in the main navigation's order (General first: Home, Contact and Explore 3D World). */
export const faqGroups: FaqGroup[] = [
  { id: 'general', label: 'General', page: '/', title: 'About Reach Subsea' },
  { id: 'services', label: 'Services', page: '/services/', title: 'Services & technology', action: { label: 'All services', url: '/services/' } },
  { id: 'assets', label: 'Assets', page: '/assets/', title: 'Vessels, ROVs & the fleet', action: { label: 'Fleet overview', url: '/assets/' } },
  { id: 'company', label: 'Company', page: '/company/', title: 'Leadership, HSEQ & sustainability', action: { label: 'About Reach', url: '/company/' } },
  { id: 'investors', label: 'Investors', page: '/investors/', title: 'Results, reports & governance', action: { label: 'Investor overview', url: '/investors/' } },
  { id: 'careers', label: 'Careers', page: '/careers/', title: 'Working at Reach Subsea', action: { label: 'Careers overview', url: '/careers/' } },
];

/** Every topic: the groups, then the child pages under each, in the order the FAQ page lists them. */
export const faqTopics: FaqTopic[] = [
  faqGroups[0],
  { id: 'contact', label: 'Contact', parent: 'general', page: '/contact/' },
  { id: '3d-world', label: 'Explore 3D World', parent: 'general', page: '/3d-world/' },
  { id: 'press', label: 'Press & media', parent: 'general', page: '/newsroom/press-media/' },
  faqGroups[1],
  { id: 'subsea', label: 'Subsea', parent: 'services', page: '/services/subsea/' },
  { id: 'survey', label: 'Survey', parent: 'services', page: '/services/survey/' },
  { id: 'monitoring', label: 'Monitoring', parent: 'services', page: '/services/monitoring/' },
  { id: 'technology', label: 'Technology & Innovation', parent: 'services', page: '/services/technology-innovation/' },
  { id: 'research', label: 'Research & Publications', parent: 'services', page: '/services/technology-innovation/research-publications/' },
  faqGroups[2],
  { id: 'reach-remote', label: 'Reach Remote', parent: 'assets', page: '/assets/reach-remote/' },
  faqGroups[3],
  { id: 'leadership', label: 'Leadership & Board', parent: 'company', page: '/company/leadership-board/' },
  { id: 'hseq', label: 'HSEQ', parent: 'company', page: '/company/hseq/' },
  { id: 'sustainability', label: 'Sustainability', parent: 'company', page: '/company/sustainability/' },
  faqGroups[4],
  { id: 'why-invest', label: 'Why invest', parent: 'investors', page: '/investors/why-invest/' },
  { id: 'reports', label: 'Reports & presentations', parent: 'investors', page: '/investors/reports-presentations/' },
  { id: 'governance', label: 'Governance & meetings', parent: 'investors', page: '/investors/governance-meetings/' },
  faqGroups[5],
  { id: 'life-at-reach', label: 'Life at Reach', parent: 'careers', page: '/careers/life-at-reach/' },
  { id: 'culture', label: 'Our culture', parent: 'careers', page: '/careers/our-culture/' },
  { id: 'why-work', label: 'Why work with us', parent: 'careers', page: '/careers/why-work-with-us/' },
];

// Values the answers quote
const [established, people, offices, officeCountries, countries, fleet, newbuilds] = pickFigures([
  'established',
  'people',
  'offices',
  'office-countries',
  'countries',
  'fleet',
  'newbuilds',
]);
const [traineeSince] = pickFigures(['trainee-since']);
const [fuelSaving] = pickFigures(['fuel-saving']);
const joinAnd = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items.join(''));
const mailboxFor = (id: string) => mailboxes.find((m) => m.id === id)!;
const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const ceo = management[0];
const chair = board.find((p) => p.chair)!;
const boardMembers = board.filter((p) => !p.chair).map((p) => p.name);
const goalNames = goals.map((g) => `${g.title.toLowerCase()} (${g.goal})`);
const firstReportYear = Math.min(...quarterlyReleases.map((q) => q.year));
const latestAnnual = annualReports[0];
const oldestAnnual = annualReports[annualReports.length - 1];
const publicationYears = publications.map((p) => p.year);

/** Every FAQ. The order is `menu_order`: each page lists its topic's FAQs in this order. The first eight interleave
 * Home, Company and Contact so the shared offices question keeps its place on all three pages. */
export const faqs: Faq[] = [
  // Home, Company and Contact (Home: client PDF p3; Company: PDF p31; Contact: PDF p59)
  {
    slug: 'what-does-reach-subsea-do',
    question: 'What does Reach Subsea do?',
    answer:
      'Reach Subsea delivers subsea survey, inspection, maintenance, intervention and data services for customers operating in offshore energy, infrastructure and other ocean industries.',
    topics: ['general'],
  },
  {
    slug: 'what-industries-do-you-serve',
    question: 'What industries do you serve?',
    answer:
      'We primarily support offshore energy, offshore wind, subsea cables and emerging ocean industries with subsea services, technology and data solutions.',
    topics: ['general'],
  },
  {
    slug: 'when-established',
    question: 'When was Reach Subsea established?',
    answer: `In ${established.value}. We are headquartered in Haugesund, Norway.`,
    topics: ['company'],
  },
  {
    slug: 'how-to-get-in-touch',
    question: 'How do I get in touch with Reach Subsea?',
    answer: `Use the topic-specific email address that matches your question, or find the office nearest you: both are on our Contact page. For anything else, email ${contactDetails.email.label} or call ${contactDetails.phone.label}.`,
    topics: ['contact'],
  },
  {
    // One post for Home ("Where does Reach Subsea operate?", typed), About and Contact (Q126)
    slug: 'where-are-the-offices',
    question: 'Where does Reach Subsea have offices?',
    answer: `${offices.value} offices across ${officeCountries.value} countries: ${joinAnd(officeCities)}, with further presence in ${joinAnd(presenceCountries)}. Together they reach clients in ${countries.value} countries.`,
    topics: ['general', 'company', 'contact'],
  },
  {
    slug: 'what-makes-reach-subsea-different',
    question: 'What makes Reach Subsea different?',
    answer:
      'A combination of deep offshore engineering experience, in-house ROV and monitoring technology, and Reach Remote: our uncrewed surface vessel platform operated from shore via Reach Horizon.',
    topics: ['general'],
  },
  {
    slug: 'how-many-people',
    question: 'How many people work at Reach Subsea?',
    answer: `${people.value} people across our operations, offshore and onshore.`,
    topics: ['company'],
  },

  // Press & media (PDF p28, Q162): the PDF's three questions. The third is investor-or-press below (primary topic
  // Contact, topic press too); these two come first so the Press page opens on releases.
  {
    slug: 'press-releases',
    question: 'Where can I find Reach Subsea’s press releases and announcements?',
    answer:
      'In our Newsroom, newest first. Stock exchange announcements are also published on Oslo Børs Newsweb, which holds the full regulatory disclosure history.',
    topics: ['press'],
  },
  {
    slug: 'media-kit',
    question: 'Is there a brand or media kit?',
    answer: `Yes. Our Press & media page has the logo as EPS, PNG and SVG packs, the rules for using it, and the brand colours with their HEX, RGB, CMYK and Pantone values. For photos, write to ${mailboxFor('media').email.label}.`,
    topics: ['press'],
  },
  {
    slug: 'investor-or-press',
    question: 'Who do I contact for investor or press inquiries specifically?',
    answer: `Each has its own address: ${mailboxFor('investors').email.label} for investor relations and ${mailboxFor('media').email.label} for press.`,
    topics: ['contact', 'press'],
  },

  // Explore 3D World (PDF p29)
  {
    slug: 'what-is-explore-3d-world',
    question: 'What is Explore 3D World?',
    answer:
      'An interactive 3D environment where you can fly between four working zones and click on vessels, ROVs, platforms and structures to learn more about each one.',
    topics: ['3d-world'],
  },
  {
    slug: 'install-explore-3d-world',
    question: 'Do I need to install anything to use Explore 3D World?',
    answer:
      'No. It runs in your web browser. It loads an 18 MB scene, so it works best on a computer or tablet with a current version of Chrome, Edge, Firefox or Safari. On a phone it may run slowly.',
    topics: ['3d-world'],
  },
  {
    slug: 'what-can-i-click-3d-world',
    question: 'What can I click on inside the 3D world?',
    answer: 'The assets in each zone: vessels, ROVs, platforms and subsea structures, each with its own information panel.',
    topics: ['3d-world'],
  },

  // Services overview
  {
    slug: 'which-service-lines',
    question: 'What service lines does Reach Subsea offer?',
    answer:
      'Three: Subsea (inspection, maintenance, repair and construction support), Survey (seabed, cable and positioning data) and Monitoring (gWatch, DepthWatch, Wellwatch and Drillwatch). Under all three sits our in-house technology, Reach Pilot, Reach Remote, Reach Horizon and Reach Relay. All are delivered from crewed or uncrewed vessels.',
    topics: ['services'],
  },
  {
    slug: 'which-service-do-i-need',
    question: 'How do I know whether I need Subsea, Survey or Monitoring?',
    answer:
      'Subsea covers physical work on the asset, Survey collects seabed and positioning data, and Monitoring measures reservoirs, wells and the environment over time. Many projects combine more than one. Tell us about the asset and we will help scope it.',
    topics: ['services'],
  },
  {
    slug: 'crewed-or-uncrewed',
    question: 'Do you use crewed or uncrewed vessels?',
    answer:
      'Both. Reach Remote runs uncrewed operations from shore through Reach Horizon, and our crewed vessels carry the same ROV and survey spreads. The project decides which fits, not the service line.',
    topics: ['services'],
  },

  // Subsea (PDF p8): genuine operator questions
  {
    slug: 'what-is-imr',
    question: 'What is IMR, and does Reach Subsea provide it?',
    answer:
      'IMR stands for inspection, maintenance and repair. It is the core of our subsea work, alongside asset integrity, light construction and intervention, delivered from crewed vessels or from Reach Remote, both carrying the same ROV capability.',
    topics: ['subsea'],
  },
  {
    slug: 'subsea-vessels-equipment',
    question: 'What vessels and equipment do you use for subsea work?',
    answer:
      'Work-class ROVs such as Supporter and Constructor, deployed from DP2 vessels like Havila Subsea or from the uncrewed Reach Remote. The scope of work is the same either way.',
    topics: ['subsea'],
  },
  {
    slug: 'uncrewed-intervention',
    question: 'Can subsea intervention be done without a crew on the vessel?',
    answer: 'Yes. Reach Remote carries a work-class ROV and delivers IMR and light construction scope, operated from shore through Reach Horizon.',
    topics: ['subsea'],
  },

  // Survey (PDF p11)
  {
    slug: 'survey-services-cover',
    question: 'What does Reach Subsea’s Survey Services cover?',
    answer:
      'Seabed mapping, cable route and pipeline surveys, and positioning data for offshore construction and operations, delivered by crewed vessels or by Reach Remote’s uncrewed survey spread.',
    topics: ['survey'],
  },
  {
    slug: 'survey-equipment',
    question: 'What survey equipment do you operate?',
    answer:
      'Multibeam echosounders, sub-bottom profilers and ROV-mounted sensors for bathymetry, seabed imagery and sub-surface geological data, the same technology whether the vessel is crewed or uncrewed.',
    topics: ['survey'],
  },
  {
    slug: 'uncrewed-survey',
    question: 'Can survey work be carried out without a crew onboard?',
    answer:
      'Yes. Reach Remote carries the same multibeam and sub-bottom survey package as our crewed vessels, operated from shore through the Remote Operations Control Centre.',
    topics: ['survey'],
  },

  // Monitoring (PDF p13)
  {
    slug: 'monitoring-technology-operated',
    question: 'What monitoring technology does Reach Subsea operate?',
    answer:
      'Our own proprietary systems: gWatch for 4D gravity monitoring, DepthWatch for seafloor subsidence, Wellwatch for injection integrity and Drillwatch for well drilling control, alongside environmental monitoring covering seismic, CO2 storage and geothermal sites.',
    topics: ['monitoring'],
  },
  {
    slug: 'gwatch-depthwatch-wellwatch-drillwatch',
    question: 'What is the difference between gWatch, DepthWatch, Wellwatch and Drillwatch?',
    answer:
      'gWatch measures 4D gravity change to track reservoir behaviour; DepthWatch tracks seafloor subsidence; Wellwatch monitors well injection integrity; Drillwatch monitors well drilling control. All four are developed and operated in-house.',
    topics: ['monitoring'],
  },
  {
    slug: 'environmental-monitoring',
    question: 'Can your monitoring systems track the surrounding environment as well as reservoirs and wells?',
    answer:
      'Yes. Alongside the reservoir and well systems, we operate environmental monitoring covering earthquake and seismic activity, CO2 storage sites and geothermal operations.',
    topics: ['monitoring'],
  },

  // Technology & Innovation (PDF p16) and Research & Publications (which shares two of them)
  {
    // One post for both pages (Q126); the two copies differed by a word, this is Reach Pilot's own wording
    slug: 'research-development-investment',
    question: 'What research and development does Reach Subsea invest in?',
    answer:
      'Several active programmes: AI-enabled perception and robotics for our ROV fleet (Reach Pilot), autonomous and remote vessel operations (Reach Remote), in-house data infrastructure (Reach Relay) and geophysical monitoring technology developed with research partners including ASUMO and DIGIMON.',
    topics: ['technology', 'research'],
  },
  {
    slug: 'what-is-reach-pilot',
    question: 'What is Reach Pilot?',
    answer:
      'A suite of perception and robotics applications developed in-house, giving ROV operators real-time situational awareness (obstacle detection, pipeline tracking and computer-vision tools) and laying the groundwork for autonomous ROV capability.',
    topics: ['technology'],
  },
  {
    slug: 'research-partnerships',
    question: 'Who does Reach Subsea do research with?',
    answer:
      'DIGIMON (CCS monitoring) and ASUMO (seafloor and earthquake monitoring), delivered with research institutes, universities and industry partners.',
    topics: ['research'],
  },
  {
    // One post for both pages (Q126); the years now come from the list on both
    slug: 'published-research',
    question: 'Where can I read Reach Subsea’s published research?',
    answer: `Our Research & Publications library lists ${publications.length} conference papers and journal articles from ${Math.min(...publicationYears)} to ${Math.max(...publicationYears)}, co-authored by our geophysics and monitoring teams.`,
    topics: ['technology', 'research'],
  },

  // Assets (PDF p21): answers rebuilt from the fleet data
  {
    slug: 'how-many-vessels',
    question: 'How many vessels does Reach Subsea operate?',
    answer: `A fleet of ${fleet.value} in service: ${fleetCounts.vessels.inService} chartered vessels plus Reach Remote 1 & 2, our own uncrewed surface vessels, together with two DriX survey vehicles. ${newbuilds.value} more are joining: Viking Vigor, Newbuild NB76 and Reach Remote 3 & 4.`,
    topics: ['assets'],
  },
  {
    slug: 'chartered-vs-newbuilds',
    question: 'What is the difference between the chartered fleet and the newbuilds?',
    answer:
      'The chartered fleet is operating today. The newbuilds, Viking Vigor and Newbuild NB76, are vessels still under construction or mobilising, shown separately until they enter service.',
    topics: ['assets'],
  },
  {
    slug: 'owned-or-chartered',
    question: 'Does Reach Subsea own any vessels outright, or are they all chartered?',
    answer:
      'Both. Most of the active fleet is chartered from partners such as Olympic Subsea, Havila Shipping and Solstad Maritime, while Reach Remote 1–4 and the DriX vehicles are owned and operated by Reach Subsea.',
    topics: ['assets'],
  },

  // Reach Remote (Q167, 10 Oct 2026): the client PDF p11's first question, then the plan's five. Sources: the brochure
  // (REA25 2595 170: p3, p5, p8–9, p11), the Perth ROC brochure, the Q2 2026 report p18–19
  {
    slug: 'what-is-reach-remote',
    question: 'What is Reach Remote?',
    answer:
      'Our uncrewed vessel platform: the vessels themselves, Reach Remote 1 and 2, our onshore remote operations centres, and Reach Horizon, our software platform, working together as one way of delivering subsea services. Two more vessels, Reach Remote 3 and 4, are being built.',
    topics: ['reach-remote'],
  },
  {
    slug: 'reach-remote-crew',
    question: 'Is anyone on board Reach Remote?',
    answer:
      'No. Reach Remote is uncrewed by design. The master, navigator, ROV pilots and surveyors all work from shore, and the vessel stays at sea for at least 30 days at a time.',
    topics: ['reach-remote'],
  },
  {
    slug: 'reach-remote-control',
    question: 'Where is Reach Remote operated from?',
    answer:
      'From our remote operations centres in Haugesund, Norway, and Perth, Australia, over several redundant links: VSAT, Starlink, Iridium, maritime broadband radio, 5G and Ceragon Pointlink. Operators can work at four levels of oversight, from monitoring the vessel as it runs its mission to taking direct control.',
    topics: ['reach-remote'],
  },
  {
    slug: 'reach-remote-rov',
    question: 'What can Reach Remote’s ROV do?',
    answer:
      'Reach Remote carries a ZEEROV, a fully electric work-class ROV rated to 2,000 m with 115 kW of power and a 600 kg payload, launched through the hull with its tether management system. It carries out the same inspection, survey and light intervention work as the ROVs on our crewed vessels, and can stay submerged for up to 30 days.',
    topics: ['reach-remote'],
  },
  {
    slug: 'reach-remote-certification',
    question: 'How is Reach Remote certified?',
    answer:
      'Reach Remote holds DNV’s AROS notation for autonomous and remotely operated ships, a world first, and has sailing permits in Norway, the UK and Australia. Our Perth remote operations centre is the first DNV-certified one in the Southern Hemisphere.',
    topics: ['reach-remote'],
  },
  {
    slug: 'reach-remote-savings',
    question: 'What does an uncrewed vessel save?',
    answer: `Fuel, emissions and risk. Reach Remote uses up to ${fuelSaving.value} less fuel than a crewed vessel doing the same work, and nobody has to travel offshore or work on deck in rough weather for that scope.`,
    topics: ['reach-remote'],
  },

  // Leadership & Board (PDF p33): answers built from people.ts
  {
    slug: 'who-is-ceo',
    question: 'Who is the CEO of Reach Subsea?',
    answer: `${ceo.name}.`,
    topics: ['leadership'],
  },
  {
    slug: 'who-sits-on-board',
    question: 'Who sits on Reach Subsea’s Board of Directors?',
    answer: `${chair.name} (Chairperson), ${joinAnd(boardMembers)}.`,
    topics: ['leadership'],
  },
  {
    slug: 'contact-leadership',
    question: 'How can I get in touch with a member of the leadership team?',
    answer:
      'Each member of the management team has a direct phone number and email address on our Leadership & Board page. For anything else, use our general contact channels on the Contact page.',
    topics: ['leadership'],
  },

  // HSEQ (PDF p34–35). The PDF's "see this page for our full policies and performance record" is cut.
  {
    slug: 'hseq-standards',
    question: 'What safety and quality standards does Reach Subsea hold?',
    answer:
      'We are certified to ISO 9001 (quality), ISO 14001 (environmental) and ISO 45001 (occupational health and safety), and registered with industry schemes including Achilles and SeQual.',
    topics: ['hseq'],
  },
  {
    slug: 'hseq-management',
    question: 'How does Reach Subsea manage HSEQ across its operations?',
    answer:
      'Through a group-wide HSEQ management system covering every vessel and operation, crewed and uncrewed alike: risk and opportunity reviews every month, a risk evaluation for every project, and HSEQ training for every employee.',
    topics: ['hseq'],
  },
  {
    slug: 'uncrewed-safety',
    question: 'How does using uncrewed vessels affect offshore safety?',
    answer:
      'Reach Remote’s uncrewed operations remove personnel from offshore risk entirely for that scope of work, while delivering the same ROV and survey capability as a crewed vessel.',
    topics: ['hseq'],
  },

  // Sustainability (PDF p37). The PDF's first two answers only pointed back at the page, so they answer from it.
  {
    slug: 'sustainability-priorities',
    question: "What are Reach Subsea's sustainability priorities?",
    answer:
      'Each ESG pillar leads with where our own decisions matter most: the technology we build and deploy for the environment, with Reach Remote the biggest lever; health and safety first for our people; and cyber security, alongside anti-corruption and supply-chain checks, in how we are governed.',
    topics: ['sustainability'],
  },
  {
    slug: 'sustainability-sdgs',
    question: 'Which UN Sustainable Development Goals does Reach Subsea support?',
    answer: `The ${goals.length} goals where our work can make the most difference: ${joinAnd(goalNames)}.`,
    topics: ['sustainability'],
  },
  {
    slug: 'sustainability-report',
    question: "Where can I read Reach Subsea's sustainability report?",
    answer:
      'Sustainability reporting is integrated into our annual report from 2023 onward; standalone sustainability reports were published separately for 2019–2022. Both are in the Reports & presentations archive.',
    topics: ['sustainability'],
  },

  // Investors overview: figures from Latest results
  {
    slug: 'where-is-reach-subsea-listed',
    question: 'Where is Reach Subsea listed?',
    answer: 'Reach Subsea ASA is listed on the Oslo Stock Exchange (Euronext) under the ticker REACH.',
    topics: ['investors'],
  },
  {
    slug: 'latest-quarterly-results',
    question: 'What were the latest reported quarterly results?',
    answer: `${r.period}: revenue NOK 988.1m (+44% year on year), EBIT NOK 192.4m (+111%), net profit NOK 133.6m (+84%) and an order backlog of NOK 1,850m (+61%).`,
    topics: ['investors'],
  },
  {
    slug: 'next-quarterly-report',
    question: 'When is the next quarterly report due?',
    answer: `${longDate(r.next.date)} (${r.next.label}). Every reporting date is in the financial calendar.`,
    topics: ['investors'],
  },

  // Why invest
  {
    slug: 'why-invest-in-reach-subsea',
    question: 'Why should I invest in Reach Subsea?',
    answer: `Strong recent growth (${r.period} revenue +44% and EBIT +111% year on year), a NOK 1,850m order backlog and a NOK 9bn tender pipeline, together with a differentiated uncrewed operations platform in Reach Remote and Reach Horizon.`,
    topics: ['why-invest'],
  },
  {
    slug: 'reach-subsea-growth-strategy',
    question: "What is Reach Subsea's growth strategy?",
    answer:
      'Scaling Reach Remote and Reach Horizon commercially, including a carve-out into a dedicated technology company, alongside continued growth in the core chartered-vessel business.',
    topics: ['why-invest'],
  },
  {
    slug: 'reach-subsea-revenue-growth',
    question: 'How has revenue grown recently?',
    answer: `Revenue reached NOK 988.1m in ${r.period}, up 44% year on year, with EBIT up 111% and net profit up 84% over the same period.`,
    topics: ['why-invest'],
  },

  // Reports & presentations (PDF p44–45, plus what ESEF is, since the shelf labels it)
  {
    slug: 'past-annual-reports',
    question: "Where can I find Reach Subsea's past annual reports?",
    answer: `Every annual report from ${oldestAnnual.year} to ${latestAnnual.year} is on our Reports & presentations page, under Annual reports. From 2023 the annual report includes our sustainability report; the standalone sustainability reports for 2019 to 2022 are listed beside their years.`,
    topics: ['reports'],
  },
  {
    slug: 'reports-archive-how-far-back',
    question: 'How far back does the reports archive go?',
    answer: `To our first quarterly report, for Q4 ${firstReportYear}, and through to the latest quarter. Results presentations are here from 2021, and webcast recordings from the second quarter of 2021.`,
    topics: ['reports'],
  },
  {
    slug: 'largest-shareholders',
    question: "Where can I find information on Reach Subsea's largest shareholders?",
    answer:
      'On our Reports & presentations page, under 20 largest shareholders. The list comes live from Oslo Market Solutions, with data from the shareholder register at Euronext Securities.',
    topics: ['reports'],
  },
  {
    slug: 'what-is-esef',
    question: 'What is the ESEF file?',
    answer:
      'ESEF (European Single Electronic Format) is the machine-readable version of the annual report that listed companies file under EU rules, packed as a ZIP. It holds the same accounts as the PDF; most readers want the PDF.',
    topics: ['reports'],
  },

  // Governance & general meetings (PDF p46–47, answered from the annual report and the articles, plus how to take part)
  {
    slug: 'governance-framework',
    question: 'What corporate governance framework does Reach Subsea follow?',
    answer:
      'Reach Subsea ASA is listed on Euronext Oslo Børs and follows the Norwegian Code of Practice for Corporate Governance on a comply-or-explain basis, alongside the Norwegian Public Limited Liability Companies Act. The Board reviews our principles every year and reports on them in the corporate governance statement in our annual report.',
    topics: ['governance'],
  },
  {
    slug: 'governance-documents',
    question: 'Where can I find governance documents and general meeting notices?',
    answer:
      'On our Governance & general meetings page: the notice, minutes and supporting papers for every general meeting since 2012 under General meetings, and the articles of association and our policies under Articles & policies. Notices are also published as stock exchange announcements on Newsweb.',
    topics: ['governance'],
  },
  {
    slug: 'board-committees',
    question: 'Does Reach Subsea have board committees?',
    answer:
      'Yes. The Board has appointed an audit committee and a remuneration committee, each of three Board members. Shareholders also elect a nomination committee, which proposes Board candidates and fees to the general meeting.',
    topics: ['governance'],
  },
  {
    slug: 'take-part-general-meeting',
    question: 'How can I take part in a general meeting?',
    answer:
      'The notice is published on our website and sent to shareholders at least 21 days before the meeting. It explains how to attend, vote in advance or appoint a proxy, and how to propose a resolution. Shareholders who want to attend must register at least three days before the meeting.',
    topics: ['governance'],
  },

  // Careers (dev /careers/opportunities/careers-faq/, in its own wording). Left out: visa sponsorship and global
  // rotation (answers are Lorem Ipsum on dev).
  {
    slug: 'how-do-i-apply',
    question: 'How do I apply?',
    answer:
      'All applications must be submitted through our Candidate Portal. To comply with GDPR and ensure your data is handled securely, we do not accept applications via email.',
    topics: ['careers'],
  },
  {
    slug: 'open-application',
    question: 'Can I send an open application?',
    answer:
      'Yes. If you don’t see a current vacancy that matches your profile, use the “Open Apply” link in our portal to submit your details for future consideration.',
    topics: ['careers'],
  },
  {
    slug: 'stay-updated',
    question: 'How can I stay updated on new roles?',
    answer:
      'We recommend using the “Register” function in our portal. You will receive an automated notification as soon as a role matching your interests is posted.',
    topics: ['careers'],
  },
  {
    slug: 'trainee-or-graduate',
    question: 'What is the difference between a trainee and a graduate?',
    answer:
      'Trainees (lærlinger) are vocational students working toward a trade certificate (for example Automation or Electrical). Graduates are university or technical college students entering the workforce with a degree.',
    topics: ['careers'],
  },
  {
    slug: 'onshore-experience',
    question: 'Do I need offshore experience for an onshore role?',
    answer:
      'Not necessarily. While maritime knowledge is helpful, our onshore teams focus on engineering, data analytics and project management where diverse technical backgrounds are highly valued.',
    topics: ['careers'],
  },

  // Life at Reach (client PDF "23 — Careers — Life at Reach"; the PDF's three questions, answered from the dev Life at
  // Reach copy, the live news post quoting the Technical Manager (9 Apr 2024) and the HSEQ certificates). Draft until
  // Reach approves it.
  {
    slug: 'day-to-day',
    question: 'What is it like to work at Reach Subsea day to day?',
    answer:
      'Whether you are based in one of our offices or working offshore, you work with engaging and energetic colleagues across vessels, control rooms and onshore teams, in a workplace where safety and well-being come first.',
    topics: ['life-at-reach'],
  },
  {
    slug: 'offshore-to-onshore',
    question: 'Do people move between offshore and onshore roles?',
    answer:
      'Yes. Our Technical Manager, for one, spent six years as Offshore Manager before moving onshore, and our control-room teams work closely with the crews at sea.',
    topics: ['life-at-reach'],
  },
  {
    slug: 'safety-everyday',
    question: 'How is safety built into everyday work?',
    answer:
      'Safety and quality are part of every role and every project, not a separate function. We are certified to ISO 9001, ISO 14001 and ISO 45001, and quarterly HSEQ campaigns keep everyone involved. Our HSEQ page has the full record.',
    topics: ['life-at-reach'],
  },

  // Our culture (client PDF "24 — Careers — Our Culture"; draft until Reach approves it). The Code of Conduct answer
  // points to HSEQ, where the policy is published (the PDF said Sustainability).
  {
    slug: 'core-values',
    question: 'What are Reach Subsea’s core values?',
    answer:
      'Learn, Teach, Reach: a commitment to constant learning, sharing knowledge across the team and pushing for what is next. Alongside them, we leave no one behind.',
    topics: ['culture'],
  },
  {
    slug: 'values-day-to-day',
    question: 'How do Reach Subsea’s values show up day to day?',
    answer:
      'In structured onboarding and cross-training, in mentoring every trainee toward a permanent role, and in an R&D programme that has produced technology like Reach Remote.',
    topics: ['culture'],
  },
  {
    slug: 'code-of-conduct',
    question: 'Does Reach Subsea have a Code of Conduct?',
    answer:
      'Yes. It sets out how we keep improving our ethical business practices and personal conduct, and it is published with our other policies on our HSEQ page.',
    topics: ['culture'],
  },

  // Why work with us (client PDF "25 — Careers — Why Work With Us"; draft until Reach approves it). The PDF's "a
  // close-knit team spanning nine countries" counted the countries worked in: the answer uses the head count.
  // The trainee answer is the live site's wording, with the figures from Key figures.
  {
    slug: 'why-a-career',
    question: 'Why should I consider a career at Reach Subsea?',
    answer: `Real ownership from early on, work on technology at the edge of the industry, including AI-enabled tools like Reach Pilot and autonomous vessel operations like Reach Remote, and a close-knit team of ${people.value} people offshore and onshore.`,
    topics: ['why-work'],
  },
  {
    slug: 'growth-opportunities',
    question: 'What growth opportunities does Reach Subsea offer?',
    answer:
      'Structured development paths from graduate and trainee roles through to senior offshore and engineering positions, plus cross-training across disciplines.',
    topics: ['why-work'],
  },
  {
    slug: 'trainee-track-record',
    question: 'What is the trainee programme’s track record?',
    answer: `We have welcomed trainees (lærlinger) since ${traineeSince.value}, and every trainee who passed their final exams during the traineeship has been offered a full-time position.`,
    topics: ['why-work'],
  },
];

export interface FaqItem extends Faq {
  open?: boolean;
}

const topicById = new Map(faqTopics.map((t) => [t.id, t]));
const groupOf = (topicId: string) => topicById.get(topicId)?.parent ?? topicId;

/** A page's FAQs (the Accordion's FAQ source): its topic only, in list order, the first one open. */
export function faqsFor(topic: string): FaqItem[] {
  if (!topicById.has(topic)) throw new Error(`[faqs] unknown topic "${topic}"`);
  return faqs.filter((f) => f.topics.includes(topic)).map((f, i) => ({ ...f, open: i === 0 }));
}

/** "See all FAQs" from a page: the FAQ page, at that page's group. */
export const faqHubHref = (topic: string) => `/faq/#${groupOf(topic)}`;

/** The FAQ page: each group with every FAQ whose primary topic sits in it, by topic order then list order, the
 * first one open as on every page. */
export function faqGroupsForHub(): (FaqGroup & { items: FaqItem[] })[] {
  const topicIndex = (id: string) => faqTopics.findIndex((t) => t.id === id);
  return faqGroups.map((group) => ({
    ...group,
    items: faqs
      .map((f, index) => ({ f, index }))
      .filter(({ f }) => groupOf(f.topics[0]) === group.id)
      .sort((a, b) => topicIndex(a.f.topics[0]) - topicIndex(b.f.topics[0]) || a.index - b.index)
      .map(({ f }, i) => ({ ...f, open: i === 0 })),
  }));
}

// Every FAQ needs a known topic and a unique slug (the slug is its deep link)
for (const f of faqs) {
  const unknown = f.topics.filter((t) => !topicById.has(t));
  if (unknown.length) throw new Error(`[faqs] "${f.slug}" has unknown topic ${unknown.join(', ')}`);
}
const slugs = faqs.map((f) => f.slug);
const duplicate = slugs.find((s, i) => slugs.indexOf(s) !== i);
if (duplicate) throw new Error(`[faqs] duplicate slug "${duplicate}"`);
