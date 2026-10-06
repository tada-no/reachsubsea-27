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
  /** Facet bucket: a run of years (2025-26, 2023-24, 2020-22, 2017-19, 2013-16). */
  yearId: string;
  topicId: 'gravity' | 'carbon' | 'seismic';
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
  { date: '17 Nov 2026', event: 'Q3 2026 report and presentation', icsHref: '#' },
  { date: '11 Feb 2027', event: 'Q4 2026 report and presentation', icsHref: '#' },
  { date: '26 Mar 2027', event: 'Annual report 2026', icsHref: '#' },
  { date: '12 May 2027', event: 'Q1 2027 report and presentation', icsHref: '#' },
  { date: '27 May 2027', event: 'Annual general meeting', icsHref: '#' },
];

// Reach's published research (6 Oct 2026, Research & Publications): the live site's Selection of Publications
// (reachsubsea.no/selection-of-publications/, 49 entries; the client PDF says 48). Topic is a draft grouping for Reach to confirm.
const TOPIC_LABEL: Record<Publication['topicId'], string> = {
  gravity: '4D gravity & subsidence',
  carbon: 'CO2 storage',
  seismic: 'Seismic',
};

const yearId = (year: number) =>
  year >= 2025 ? '2025-26' : year >= 2023 ? '2023-24' : year >= 2020 ? '2020-22' : year >= 2017 ? '2017-19' : '2013-16';

const pub = (
  year: number,
  topicId: Publication['topicId'],
  title: string,
  byline: string,
  link: Publication['link'],
): Publication => ({ year, yearId: yearId(year), topicId, topicLabel: TOPIC_LABEL[topicId], title, byline, link });

/** Research and publications, newest first. */
export const publications: Publication[] = [
  pub(2026, 'carbon', 'Case studies of time-lapse gravity and seafloor deformation monitoring and prospects for carbon storage', 'Ruiz · The Leading Edge', { label: 'Publisher', url: 'https://doi.org/10.1190/tle-2025-1036', action: 'external' }),
  pub(2026, 'gravity', 'Improving Time-Lapse OBN Seismic through Accurate Node Depths and Subsidence Measurements', 'Dutta · First Break', { label: 'Publisher', url: 'https://doi.org/10.3997/1365-2397.fb2026017', action: 'external' }),
  pub(2026, 'gravity', 'Estimation of gravity changes related to slow earthquakes and fluid accumulation in the Nankai Trough accretionary prism off southwestern Japan', 'Vassvåg · Marine Geophysical Research', { label: 'Publisher', url: 'https://doi.org/10.1007/s11001-025-09606-2', action: 'external' }),
  pub(2025, 'gravity', 'Pioneering Fully Remote Reservoir Monitoring with Time-Lapse Gravimetry and Seafloor Deformation Measurements', 'Bergfjord · First Break', { label: 'Publisher', url: 'https://doi.org/10.3997/1365-2397.fb2025057', action: 'external' }),
  pub(2025, 'carbon', 'Monitoring CO2 Injection in the Viking CCS Project using Offshore Time-Lapse Gravity', 'Fletcher · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.2025101011', action: 'external' }),
  pub(2025, 'gravity', 'Implementation of time-lapse gravity and subsidence monitoring for optimising the development of the Scarborough gas field', 'Hourani · First Break', { label: 'Publisher', url: 'https://www.earthdoc.org/content/journals/10.3997/1365-2397.fb2025024', action: 'external' }),
  pub(2025, 'gravity', 'Twenty five years of monitoring the Troll gas and oil field with time-lapse gravity and seafloor deformation surveys', 'Vassvåg · First Break', { label: 'Publisher', url: 'https://www.earthdoc.org/content/journals/10.3997/1365-2397.fb2025020', action: 'external' }),
  pub(2024, 'carbon', 'Monitoring of CO2 injection in depleted gas reservoirs through measurements of seafloor deformation and 4D gravity', 'Basford · Seismic 2024', { label: 'Publisher', url: 'https://www.spe-aberdeen.org/uploads/0950_Monitoring-of-CO2-injection-in-depleted-gas-reservoirs-through-measurements-of-seafloor-deformation-and-4D-gravity_SEISMIC_24_Slides.pdf', action: 'external' }),
  pub(2024, 'carbon', 'Monitoring CO2 Storage in the Morecambe Depleted Gas Reservoirs through Seafloor Deformation and Time-Lapse Gravimetry Measurements', 'Borges · First Break', { label: 'Publisher', url: 'https://doi.org/10.3997/1365-2397.fb2024025', action: 'external' }),
  pub(2023, 'carbon', 'Feasibility of 4D microgravimetric monitoring of a CO2 flood in a depleted gas reservoir', 'Lien · EGCI', { label: 'Paper (PDF)', url: 'https://reachsubsea.no/wp-content/uploads/2023/12/Feasibility-of-4D-microgravimetric-monitoring-of-a-CO2-flood-in-a-depleted-gas-reservoir.pdf', action: 'file' }),
  pub(2023, 'gravity', 'Subsidence measurement and improved statics solutions through accurate node depth determination during time-lapse deep-water OBN surveys', 'Dutta · IMAGE', { label: 'Publisher', url: 'https://library.seg.org/doi/abs/10.1190/image2023-3910135.1', action: 'external' }),
  pub(2023, 'gravity', 'Improving Seismic Processing and Measuring Seabed Subsidence through Accurate Node Depths', 'Ruiz · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.2023628022', action: 'external' }),
  pub(2023, 'gravity', 'Time-Lapse Gravity and Subsidence Applied in History Matching of a Gas-Condensate Field', 'Solbu · First Break', { label: 'Publisher', url: 'https://www.earthdoc.org/content/journals/10.3997/1365-2397.fb2023075', action: 'external' }),
  pub(2022, 'gravity', 'Monitoring the Snøhvit gas field using seabed gravimetry and subsidence', 'Ruiz · First Break', { label: 'Publisher', url: 'https://www.earthdoc.org/content/journals/10.3997/1365-2397.fb2022027', action: 'external' }),
  pub(2022, 'carbon', 'On the Organisation of Translation—An Inter- and Transdisciplinary Approach to Developing Design Options for CO2 Storage Monitoring Systems', 'Otto · Energies', { label: 'Publisher', url: 'https://www.mdpi.com/1996-1073/15/15/5678', action: 'external' }),
  pub(2022, 'carbon', 'A technology readiness assessment for CCS site monitoring systems', 'Vandeweijer · GHGT', { label: 'Publisher', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4286443', action: 'external' }),
  pub(2021, 'seismic', 'Real-time lookahead imaging with drill-bit seismic in the central North Sea', 'Goertz · First Break', { label: 'Publisher', url: 'https://www.earthdoc.org/content/journals/10.3997/1365-2397.fb2021084', action: 'external' }),
  pub(2021, 'carbon', 'A Toolbox to Assist in Designing Marine Monitoring Programs for Offshore Storage Sites', 'Blackford · GHGT', { label: 'Publisher', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3821572', action: 'external' }),
  pub(2021, 'carbon', 'Digital monitoring of CO2 storage projects (DigiMon)', 'Nøttvedt · GHGT', { label: 'Publisher', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3823153', action: 'external' }),
  pub(2021, 'carbon', 'Monitoring of CO2 Saturation Plume Movement from Time-Lapse Inverted-Seismic and Gravity Data Using an Ensemble-Based Method', 'Bhakta · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.202112746', action: 'external' }),
  pub(2020, 'gravity', 'Accurate Measurement of Seabed Subsidence at the Ormen Lange Field', 'Ruiz · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.202010727', action: 'external' }),
  pub(2020, 'gravity', '4D gravity and subsidence monitoring as cost-effective alternatives to 4D seismic', 'Ruiz · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.2020611003', action: 'external' }),
  pub(2020, 'seismic', 'Reservoir imaging-while-drilling with PRM arrays', 'Goertz · First Break', { label: 'Publisher', url: 'https://www.earthdoc.org/content/journals/10.3997/1365-2397.fb2020083', action: 'external' }),
  pub(2020, 'seismic', 'Vertical Seismic Profiling While Drilling Using Passive Monitoring Data', 'Goertz · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.202010707', action: 'external' }),
  pub(2019, 'gravity', 'Precise depth and subsidence measurements during deepwater OBN surveys', 'Paul Hatchell · SEG Annual', { label: 'Publisher', url: 'https://library.seg.org/doi/abs/10.1190/segam2019-3214533.1', action: 'external' }),
  pub(2019, 'seismic', 'Seismic While Drilling Using a Large-Aperture Ocean Bottom Array', 'Flavio Poletto · SEG Annual', { label: 'Publisher', url: 'https://library.seg.org/doi/abs/10.1190/segam2019-3215742.1', action: 'external' }),
  pub(2019, 'gravity', '4D Gravity and Seafloor Subsidence Surveys for Cost-Effective Monitoring of Offshore Gas Reservoirs', 'Lien · OMC', { label: 'Publisher', url: 'https://onepetro.org/OMCONF/proceedings-abstract/OMC19/All-OMC19/OMC-2019-1012/1503', action: 'external' }),
  pub(2019, 'gravity', 'A New Method for Measuring Regional Seabed Subsidence with Sub-Centimeter Accuracy', 'Lien · OMC', { label: 'Publisher', url: 'https://onepetro.org/OMCONF/proceedings-abstract/OMC19/All-OMC19/OMC-2019-1013/1504', action: 'external' }),
  pub(2018, 'gravity', 'Marine 4D Gravity And Seafloor Subsidence Monitoring: Recent Development And Prospects', 'Lien · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201802087', action: 'external' }),
  pub(2018, 'seismic', 'Real-time passive monitoring with a fibre-optic ocean bottom array', 'Goertz · First Break', { label: 'Publisher', url: 'https://www.earthdoc.org/content/journals/10.3997/1365-2397.n0083', action: 'external' }),
  pub(2018, 'gravity', '4D Gravity And Seafloor Subsidence Monitoring: Recent Developments And Prospects', 'Ruiz · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201803053', action: 'external' }),
  pub(2018, 'seismic', 'Real Time Seismic Monitoring of Drilling Operations', 'Lindgård · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201802099', action: 'external' }),
  pub(2017, 'gravity', 'Mapping water influx and hydrocarbon depletion in offshore reservoirs using gravimetry: requirements on gravimeter calibration', 'Agersborg · SEG Annual', { label: 'Publisher', url: 'https://library.seg.org/doi/abs/10.1190/segam2017-17431756.1', action: 'external' }),
  pub(2017, 'carbon', 'Monitoring Offshore CO2 Storage Using Time-lapse Gravity and Seafloor Deformation', 'Ruiz · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201701941', action: 'external' }),
  pub(2017, 'gravity', 'Density Changes and Reservoir Compaction from In-situ Calibrated 4D Gravity and Subsidence Measured at the Seafloor', 'Agersborg · SPE Annual', { label: 'Publisher', url: 'https://onepetro.org/SPEATCE/proceedings-abstract/17ATCE/3-17ATCE/D031S044R006/193244', action: 'external' }),
  pub(2017, 'seismic', 'Real Time Offshore Monitoring – Key Learnings – Pitfalls and Potentials', 'Bergfjord · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201700013', action: 'external' }),
  pub(2017, 'gravity', 'How 4D Gravity and Subsidence Monitoring Provide Improved Decision Making at a Lower Cost', 'Lien · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201700028', action: 'external' }),
  pub(2017, 'gravity', 'Monitoring the Ormen Lange field with 4D gravity and seafloor subsidence', 'Vatshelle · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201700484', action: 'external' }),
  pub(2016, 'gravity', 'A New Method for Field-wide Real-time Subsidence Monitoring with Sub-centimeter Accuracy', 'Ruiz · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201600575', action: 'external' }),
  pub(2016, 'seismic', 'Offshore injection and overburden surveillance using real-time passive seismic', 'Bussat · First Break', { label: 'Publisher', url: 'https://www.earthdoc.org/content/journals/10.3997/1365-2397.34.7.86052', action: 'external' }),
  pub(2016, 'seismic', 'Real-time microseismic monitoring in the North Sea with advanced noise removal methods', 'Dando · SEG Annual', { label: 'Publisher', url: 'https://library.seg.org/doi/abs/10.1190/segam2016-13840150.1', action: 'external' }),
  pub(2016, 'gravity', 'Monitoring offshore reservoirs using 4D gravity and subsidence with improved tide corrections', 'Ruiz · SEG Annual', { label: 'Publisher', url: 'https://onepetro.org/SEGAM/proceedings-abstract/SEG16/All-SEG16/101112', action: 'external' }),
  pub(2015, 'gravity', 'Monitoring of offshore reservoirs using 4D gravimetry at the seafloor: state of the art', 'Ruiz · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201412551', action: 'external' }),
  pub(2015, 'gravity', 'Permanent reservoir monitoring for increased surveillance and safety', 'Bjerrum · SPE Workshop', { label: 'Publisher', url: 'https://sbgf.org.br/mysbgf/eventos/expanded_abstracts/14th_CISBGf/session/RESERVOIR%20MONITORING%20AND%20MANAGEMENT/PRM%20system%20monitoring%20of%20injection%20and%20production%20processes%20for%20safe%20operation.pdf', action: 'external' }),
  pub(2015, 'seismic', 'Real Time Caprock Integrity Monitoring Becomes Reality', 'Matveeva · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.201412547', action: 'external' }),
  pub(2014, 'seismic', 'Assimilation of Time-lapse CSEM Data for Fluid Flow Monitoring', 'Lien · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/docserver/fulltext/2214-4609/401/WS9-C07.pdf', action: 'external' }),
  pub(2014, 'seismic', 'Comparison of Noise Characteristics on an Un-trenched and Trenched Cable Deployed in the North Sea for a PRM System', 'Bjerrum · EAGE Annual', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.20141050', action: 'external' }),
  pub(2013, 'gravity', 'Using gravity to Enhance Recovery', 'Fageraas · GeoExpro', { label: 'Publisher', url: 'https://archives.datapages.com/data/geo-expro-magazine/010/010006/pdfs/62.htm', action: 'external' }),
  pub(2013, 'seismic', 'Utilizing PRM Systems for Injection Monitoring', 'Lindgard · EAGE Workshop', { label: 'Publisher', url: 'https://www.earthdoc.org/content/papers/10.3997/2214-4609.20131307', action: 'external' }),
];

// Topic first (Q89): researchers start from the subject; the Year bars chart above already covers time
export const publicationFacets = [
  {
    id: 'topic',
    label: 'Topic',
    options: [
      { id: 'gravity', label: '4D gravity & subsidence' },
      { id: 'carbon', label: 'CO2 storage' },
      { id: 'seismic', label: 'Seismic' },
    ],
  },
  {
    id: 'year',
    label: 'Year',
    options: [
      { id: '2025-26', label: '2025–26' },
      { id: '2023-24', label: '2023–24' },
      { id: '2020-22', label: '2020–22' },
      { id: '2017-19', label: '2017–19' },
      { id: '2013-16', label: '2013–16' },
    ],
  },
];

/** Publications per year, first to last, for the year-by-year chart. */
export const publicationsByYear = (): { year: number; count: number }[] => {
  const years = publications.map((p) => p.year);
  const first = Math.min(...years);
  const last = Math.max(...years);
  return Array.from({ length: last - first + 1 }, (_, i) => ({ year: first + i, count: years.filter((y) => y === first + i).length }));
};
