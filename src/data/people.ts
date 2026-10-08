// People (6 Oct 2026, Q103): the management team and the Board of Directors, one list for the whole site.
// Feeds Company › Leadership & Board, the About page's management table and, later, Investors › Governance.
// In WordPress: the People post type (`group` management | board, `order`, `role`, `portrait` with focal
// point, `phone`, `email`, `born`, `since`, `bio`), as docs/03 §5 proposed.
//
// Sources: names, roles and contact details from the dev /company/who-we-are/about-us/ page (Sep 2026, they
// match the client PDF p32); the board and its bios from the client PDF p32–33 ("13 — Company — Leadership &
// Board") in its own condensed wording, checked against the live /investors/ page, which lists the same five
// (the dev board page is out of date). The PDF opens each bio with "Born 1969. Board member since 2020,"; that
// lead moved into `born` and `since` and shows as the meta line. Management in the order of the Q2 2026 report
// (p7). Portraits in public/images/people/: management from Reach's colour originals (assets/, 2024–2026
// shoots), square, head and shoulders with headroom as in the report (Q104–Q105); the board cropped from Reach's colour
// group photo of the five (assets/10543 Reach subsea-001.jpg, 5138px), square to the same framing (Q107, Q110).
// Both take the site's photo tint.
//
// To confirm with Reach (docs/03 F, flagged in the handover): every phone number and email (published on the
// dev site, not yet confirmed for the new one), Hilde Drønen's year on the board (in neither source), and
// "MKOLD AS" (live site) against the PDF's "MMOLD AS".

const base = import.meta.env.BASE_URL;
const portrait = (slug: string) => `${base}images/people/${slug}.jpg`;

export interface Person {
  slug: string;
  name: string;
  group: 'management' | 'board';
  role: string;
  /** Board: the chair gets the accent badge. */
  chair?: boolean;
  /** Square colour portrait, head and shoulders; the focal point is the face. */
  portrait: { src: string; focalPoint: { x: number; y: number } };
  phone?: { label: string; href: string };
  email?: { label: string; href: string };
  born?: number;
  /** Year joined the board. */
  since?: number;
  bio?: string;
}

// Non-breaking spaces in the label, like Contact's numbers: a number never wraps (and passes tel-non-breaking)
const tel = (label: string) => ({ label: label.replace(/ /g, '\u00a0'), href: `tel:${label.replace(/\s/g, '')}` });
const mail = (label: string) => ({ label, href: `mailto:${label}` });
const face = { x: 0.5, y: 0.3 };

export const people: Person[] = [
  {
    slug: 'jostein-alendal',
    name: 'Jostein Alendal',
    group: 'management',
    role: 'Chief Executive Officer',
    portrait: { src: portrait('jostein-alendal'), focalPoint: face },
    phone: tel('+47 928 80 412'),
    email: mail('jal@reachsubsea.com'),
  },
  {
    slug: 'bard-thuen-hogheim',
    name: 'Bård Thuen Høgheim',
    group: 'management',
    role: 'Chief Commercial Officer',
    portrait: { src: portrait('bard-thuen-hogheim'), focalPoint: face },
    phone: tel('+47 413 39 373'),
    email: mail('bth@reachsubsea.com'),
  },
  {
    slug: 'arne-joa',
    name: 'Arne Joa',
    group: 'management',
    role: 'Chief Financial Officer',
    portrait: { src: portrait('arne-joa'), focalPoint: face },
    phone: tel('+47 474 51 344'),
    email: mail('arne.joa@reachsubsea.com'),
  },
  {
    slug: 'inge-grutle',
    name: 'Inge Grutle',
    group: 'management',
    role: 'Chief Operating Officer',
    portrait: { src: portrait('inge-grutle'), focalPoint: face },
    phone: tel('+47 402 46 524'),
    email: mail('igr@reachsubsea.com'),
  },
  {
    slug: 'audun-brandtzaeg',
    name: 'Audun Brandtzæg',
    group: 'management',
    role: 'Chief Technology Officer',
    portrait: { src: portrait('audun-brandtzaeg'), focalPoint: face },
    phone: tel('+47 941 55 952'),
    email: mail('abr@reachsubsea.com'),
  },
  {
    slug: 'rachid-bendriss',
    name: 'Rachid Bendriss',
    group: 'board',
    role: 'Chairperson of the Board',
    chair: true,
    portrait: { src: portrait('rachid-bendriss'), focalPoint: face },
    born: 1969,
    since: 2020,
    bio: 'Holds a Master of Management degree from BI – Norwegian Business School. More than 25 years of capital markets and transaction experience through employment at firms including Morgan Stanley, Danske Bank and Carnegie, and as an independent strategic and financial advisor to companies in the energy sector. CEO of North Energy ASA, which owns 50,832,449 shares in Reach Subsea.',
  },
  {
    slug: 'espen-gjerde',
    name: 'Espen Gjerde',
    group: 'board',
    role: 'Board member',
    portrait: { src: portrait('espen-gjerde'), focalPoint: face },
    born: 1981,
    since: 2022,
    bio: 'Holds an MSc in Naval Architecture and Marine Technology from NTNU. Shipping, Offshore & Renewable Energy investment professional with offshore operational experience and broad experience across equity capital, bond debt and bank financing markets. Senior Vice President at Wilhelmsen New Energy AS, which owns 96,844,009 shares in Reach Subsea. Holds several other board positions, both as a Wilhelmsen ownership representative and independently.',
  },
  {
    slug: 'martha-kold-monclair',
    name: 'Martha Kold Monclair',
    group: 'board',
    role: 'Board member',
    portrait: { src: portrait('martha-kold-monclair'), focalPoint: face },
    born: 1962,
    since: 2020,
    bio: 'Founder and managing partner of MKOLD AS and non-executive director of Hexagon Purus, Edda Wind and BW LPG. Previously CEO of Steinsvik Group and, for ten years, CEO of DeepWell. Holds a master’s degree and PhD from NTNU and a Doctorate in Economics from BI Norwegian Business School. Beneficially owns 949,534 shares through her wholly-owned company Kold Invest AS.',
  },
  {
    slug: 'arvid-pettersen',
    name: 'Arvid Pettersen',
    group: 'board',
    role: 'Board member',
    portrait: { src: portrait('arvid-pettersen'), focalPoint: face },
    born: 1957,
    since: 2022,
    bio: 'A background as naval officer and vessel master. More than 35 years of experience in the offshore and subsea business, including 15 years as CEO of subsea companies in Brazil and Norway. Currently CCO at Whatif EV. Does not own shares in Reach Subsea ASA.',
  },
  {
    slug: 'hilde-dronen',
    name: 'Hilde Drønen',
    group: 'board',
    role: 'Board member',
    portrait: { src: portrait('hilde-dronen'), focalPoint: face },
    born: 1961,
    // since: to confirm with Reach (not in the PDF or on the live site)
    bio: 'Holds an MBA from the Norwegian School of Economics (NHH), a bachelor’s degree from BI Norwegian Business School and a law degree from the University of Bergen. CFO of DOF Group ASA for 20 years until retiring in January 2025; previously CFO of Bergen Yards AS (today Endur ASA) and Group Controller at Møgster Group. More than 35 years of experience, mainly in the oil service industry. Current board positions include BW Energy Ltd., Eviny AS and Outlet Group AS.',
  },
];

export const management = people.filter((p) => p.group === 'management');
export const board = people.filter((p) => p.group === 'board');

/** "Born 1969 · On the board since 2020": the PDF's bio lead, as one meta line. */
export const personMeta = (p: Person) =>
  [p.born && `Born ${p.born}`, p.since && `On the board since ${p.since}`].filter(Boolean).join(' · ');
