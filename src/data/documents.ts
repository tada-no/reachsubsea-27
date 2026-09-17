// Sample data for the Data list block (docs/05 §2.7). Placeholder Reach Subsea content: no real
// people, plausible file/webcast URLs stand in for the media library ("#" in demos per block rules).
// Quarter and meeting *labels* (short table cells vs. named mobile/Latest links) are built by
// DataList.astro from this raw data, so a link here only needs a url.

export interface FileRef {
  url: string;
}

export interface ReportQuarter {
  /** Publication date, e.g. "24 Apr 2026". */
  date: string;
  report?: FileRef;
  presentation?: FileRef;
  webcast?: FileRef;
}

export interface ReportYear {
  year: number;
  q1?: ReportQuarter | null;
  q2?: ReportQuarter | null;
  q3?: ReportQuarter | null;
  q4?: ReportQuarter | null;
}

export interface SimpleDocument {
  /** Full, named label ("Annual report 2025 (PDF)"). */
  label: string;
  url: string;
  date?: string;
}

export interface Meeting {
  year: number;
  name: string;
  date: string;
  documents: { label: string; url: string }[];
}

export interface CalendarDate {
  date: string;
  event: string;
  icsHref?: string;
}

export interface Publication {
  year: number;
  /** Facet bucket: the year, or "older" for anything before the newest 3. */
  yearId: string;
  topicId: 'survey' | 'monitoring' | 'autonomy';
  topicLabel: string;
  title: string;
  byline: string;
  link: { label: string; url: string; action: 'file' | 'external' };
}

const CURRENT_YEAR = 2026;
const OLDEST_REPORT_YEAR = 2016;

/** Quarterly reports, newest first. 2026 Q3–Q4 have not been published yet. */
export const reportYears: ReportYear[] = [];
for (let year = CURRENT_YEAR; year >= OLDEST_REPORT_YEAR; year--) {
  const q1: ReportQuarter = { date: `24 Apr ${year}`, report: { url: '#' }, presentation: { url: '#' }, webcast: { url: '#' } };
  const q2: ReportQuarter = { date: `20 Aug ${year}`, report: { url: '#' }, presentation: { url: '#' }, webcast: { url: '#' } };
  const q3: ReportQuarter | null =
    year === CURRENT_YEAR ? null : { date: `6 Nov ${year}`, report: { url: '#' }, presentation: { url: '#' }, webcast: { url: '#' } };
  const q4: ReportQuarter | null =
    year === CURRENT_YEAR ? null : { date: `12 Feb ${year + 1}`, report: { url: '#' }, presentation: { url: '#' }, webcast: { url: '#' } };
  reportYears.push({ year, q1, q2, q3, q4 });
}

export const reportsLatest = {
  title: 'Q2 2026 results',
  date: 'Published 20 Aug 2026',
  links: [
    { label: 'Q2 2026 report (PDF)', url: '#', action: 'file' as const },
    { label: 'Q2 2026 presentation (PDF)', url: '#', action: 'file' as const },
    { label: 'Q2 2026 webcast', url: '#', action: 'external' as const },
  ],
};

/** Annual reports, sustainability reports and other filings: the non-Quarterly tab panels. */
export const annualReports: SimpleDocument[] = Array.from({ length: 10 }, (_, i) => ({
  label: `Annual report ${CURRENT_YEAR - 1 - i} (PDF)`,
  url: '#',
}));

export const sustainabilityReports: SimpleDocument[] = Array.from({ length: 6 }, (_, i) => ({
  label: `Sustainability report ${CURRENT_YEAR - 1 - i} (PDF)`,
  url: '#',
}));

export const otherReports: SimpleDocument[] = [
  { label: 'Pillar III disclosure 2025 (PDF)', url: '#' },
  { label: 'Articles of association (PDF)', url: '#' },
  { label: 'Corporate governance report 2025 (PDF)', url: '#' },
];

/** General meetings, newest first. */
export const meetings: Meeting[] = [
  {
    year: 2026,
    name: 'Annual general meeting',
    date: '28 May 2026',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Nomination committee recommendation (PDF)', url: '#' },
      { label: 'Executive remuneration report (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2025,
    name: 'Extraordinary general meeting',
    date: '14 Nov 2025',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2025,
    name: 'Annual general meeting',
    date: '28 May 2025',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Nomination committee recommendation (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
      { label: 'Appendix to minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2024,
    name: 'Annual general meeting',
    date: '23 May 2024',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2023,
    name: 'Annual general meeting',
    date: '25 May 2023',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Nomination committee recommendation (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2022,
    name: 'Annual general meeting',
    date: '19 May 2022',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2021,
    name: 'Extraordinary general meeting',
    date: '3 Sep 2021',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2021,
    name: 'Annual general meeting',
    date: '27 May 2021',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2020,
    name: 'Annual general meeting',
    date: '21 May 2020',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2019,
    name: 'Annual general meeting',
    date: '23 May 2019',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2018,
    name: 'Annual general meeting',
    date: '24 May 2018',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
  {
    year: 2018,
    name: 'Extraordinary general meeting',
    date: '12 Jan 2018',
    documents: [
      { label: 'Notice (PDF)', url: '#' },
      { label: 'Minutes (PDF)', url: '#' },
    ],
  },
];

export const meetingsLatest = {
  title: 'Annual general meeting 2026',
  date: '28 May 2026',
  links: [
    { label: 'AGM 2026 notice (PDF)', url: '#', action: 'file' as const },
    { label: 'AGM 2026 minutes (PDF)', url: '#', action: 'file' as const },
  ],
};

/** Financial calendar: confirmed dates only. */
export const financialCalendar: CalendarDate[] = [
  { date: '12 Nov 2026', event: 'Q3 2026 report and presentation', icsHref: '#' },
  { date: '11 Feb 2027', event: 'Q4 2026 report and presentation', icsHref: '#' },
  { date: '26 Mar 2027', event: 'Annual report 2026', icsHref: '#' },
  { date: '12 May 2027', event: 'Q1 2027 report and presentation', icsHref: '#' },
  { date: '27 May 2027', event: 'Annual general meeting', icsHref: '#' },
];

const TOPIC_LABEL: Record<Publication['topicId'], string> = {
  survey: 'Survey',
  monitoring: 'Monitoring',
  autonomy: 'Autonomy',
};

const yearId = (year: number) => (year >= 2024 ? String(year) : 'older');

const pub = (
  year: number,
  topicId: Publication['topicId'],
  title: string,
  byline: string,
  link: Publication['link'],
): Publication => ({ year, yearId: yearId(year), topicId, topicLabel: TOPIC_LABEL[topicId], title, byline, link });

/** Research and publications, newest first. */
export const publications: Publication[] = [
  pub(
    2026,
    'survey',
    'Uncrewed surface vessels for pipeline route surveys: lessons from the North Sea',
    'A. Hansen, K. Olsen · Oceanology International 2026',
    { label: 'Paper (PDF)', url: '#', action: 'file' },
  ),
  pub(2025, 'monitoring', 'Long-term seabed monitoring with resident sensors', 'M. Berg, L. Nilsen · OCEANS 2025', {
    label: 'Publisher',
    url: '#',
    action: 'external',
  }),
  pub(2025, 'autonomy', 'Human factors in remote vessel operations', 'T. Larsen · Journal of Ocean Engineering', {
    label: 'Publisher',
    url: '#',
    action: 'external',
  }),
  pub(2024, 'survey', 'Multibeam data quality from uncrewed platforms', 'R. Johansen, E. Dahl · Hydro 2024', {
    label: 'Paper (PDF)',
    url: '#',
    action: 'file',
  }),
  pub(2024, 'monitoring', 'Resident ROV inspection intervals for offshore wind foundations', 'K. Solberg · OCEANS 2024', {
    label: 'Paper (PDF)',
    url: '#',
    action: 'file',
  }),
  pub(2024, 'autonomy', 'Autonomy levels for uncrewed survey vessels: a field comparison', 'A. Hansen, M. Berg · Sea Technology 2024', {
    label: 'Publisher',
    url: '#',
    action: 'external',
  }),
  pub(2023, 'survey', 'Route survey efficiency gains from dual-vessel operations', 'E. Dahl · Hydro 2023', {
    label: 'Paper (PDF)',
    url: '#',
    action: 'file',
  }),
  pub(2023, 'monitoring', 'Environmental baseline monitoring for subsea infrastructure', 'L. Nilsen, T. Larsen · OCEANS 2023', {
    label: 'Publisher',
    url: '#',
    action: 'external',
  }),
  pub(2022, 'autonomy', 'Remote operations centres: crewing and shift design', 'K. Solberg, R. Johansen · Journal of Ocean Engineering', {
    label: 'Paper (PDF)',
    url: '#',
    action: 'file',
  }),
  pub(2022, 'survey', 'Comparing multibeam sensors on uncrewed and crewed platforms', 'A. Hansen · Hydro 2022', {
    label: 'Publisher',
    url: '#',
    action: 'external',
  }),
  pub(2021, 'monitoring', 'Resident sensor networks for pipeline integrity monitoring', 'M. Berg · OCEANS 2021', {
    label: 'Paper (PDF)',
    url: '#',
    action: 'file',
  }),
  pub(2021, 'autonomy', 'Early trials of remotely operated survey work in the North Sea', 'E. Dahl, K. Olsen · Sea Technology 2021', {
    label: 'Publisher',
    url: '#',
    action: 'external',
  }),
];

export const publicationFacets = [
  {
    id: 'year',
    label: 'Year',
    options: [
      { id: '2026', label: '2026' },
      { id: '2025', label: '2025' },
      { id: '2024', label: '2024' },
      { id: 'older', label: 'Older' },
    ],
  },
  {
    id: 'topic',
    label: 'Topic',
    options: [
      { id: 'survey', label: 'Survey' },
      { id: 'monitoring', label: 'Monitoring' },
      { id: 'autonomy', label: 'Autonomy' },
    ],
  },
];
