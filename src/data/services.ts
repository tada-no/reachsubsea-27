// Service lines (19 Sep 2026, Services overview). One source for the three service lines and the technology
// under them (Technology & Innovation, kept as the fourth entry; 5 Oct 2026, Q79: the client counts three): the overview
// cards, the lifecycle visual and (later) the service single pages read from here.
// WP note: each line is a Service page (hierarchical, children = sub-services, as on the dev site's
// /services/<line>/<sub-service>/ pages). `summary` = excerpt, `pictogram` = ACF field.
// 5 Oct 2026 (Q80): no sub-service child pages. Each line's `scope` is the overview card's plain list, short
// labels cut from the client PDF's capability boxes (Subsea p8, Survey p10, Monitoring p12); the dev site's
// /services/<line>/<sub-service>/ child URLs redirect to the line's capability section (#what-we-do).
import type { LinkField } from '../lib/types';

export type ServiceId = 'subsea' | 'survey' | 'monitoring' | 'technology';


export interface Capability {
  title: string;
  summary: string;
  /** 3 short scope items */
  scope: string[];
  link?: LinkField;
  /** Monitoring (6 Oct 2026): the PDF p12 splits its nine capabilities under two headings. */
  group?: 'geophysical' | 'environmental';
}

/** One named contact per service line (19 Sep 2026, Subsea; shared shape for all four lines). It
 * closes the service single in the CTA panel; the full office directory stays on /contact/.
 * WP: a Person post (dev `employee-card`: name, position, phone, email, photo) picked on the Service. */
export interface ServiceContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface ServiceLine {
  id: ServiceId;
  title: string;
  /** Short name for tight labels (lifecycle rows, chips). */
  short: string;
  href: string;
  pictogram: string;
  summary: string;
  /** Child pages: 3–4 shown on the overview card. */
  /** The overview card's list (5 Oct 2026, Q80): 6 short labels from the PDF capability boxes, no links. */
  scope: string[];
  contact?: ServiceContact;
  /** What the line delivers, in the client's own wording (PDF p8 "What we deliver, end to end", six
   * boxes). Not links: the cards are the full answer, the thin dev child pages are dropped and their
   * URLs redirect to /services/subsea/#what-we-do (Q, 19 Sep 2026). */
  capabilities?: Capability[];
  /** Industries the line serves (client PDF p8 "Industries we serve"), each with a pictogram. */
  industries?: { label: string; pictogram: string }[];
}

export const serviceLines: ServiceLine[] = [
  {
    id: 'subsea',
    title: 'Subsea services',
    short: 'Subsea',
    href: '/services/subsea/',
    pictogram: 'subsea-infrastructure',
    summary: 'Inspection, maintenance and repair with work-class ROVs from our DP2 vessels.',
    scope: [
      'Inspection, maintenance & repair',
      'Asset integrity & inspection',
      'Light construction & intervention',
      'Crewed, remote & uncrewed operations',
      'Decommissioning & seabed intervention',
      'Engineering, planning & execution',
    ],
    // Titles verbatim from the client PDF p8; summary and scope from the dev child pages and projects
    capabilities: [
      {
        title: 'Inspection, maintenance and repair (IMR)',
        summary: 'Our core work, under frame agreements in oil & gas and renewables.',
        scope: ['Structural inspection', 'SCM changeout', 'Repair'],
      },
      {
        title: 'Subsea inspections and asset integrity services',
        summary: 'Export pipelines and interfield networks, inspected with MMT.',
        scope: ['Pipeline inspection', 'CP measurement', 'Photogrammetry'],
      },
      {
        title: 'Light construction and intervention work',
        summary: 'Positioning, monitoring and ROV work on schedule-driven jobs.',
        scope: ['Touchdown monitoring', 'Suction anchors', 'Pre- and post-lay survey'],
      },
      {
        title: 'Operations using crewed, remote and uncrewed assets',
        summary: 'The same ROV spread from our DP2 vessels or from shore.',
        scope: ['DP2 crewed vessels', 'Reach Remote, run from shore', 'Work-class ROVs'],
      },
      {
        title: 'Decommissioning support and seabed intervention',
        summary: 'Removal and seabed work at the end of an asset’s life.',
        scope: ['Structure removal', 'Boulder clearance', 'Dredging'],
      },
      {
        title: 'Engineering, planning and offshore execution',
        summary: 'In-house engineering, and projects run from start to finish.',
        scope: ['FEED studies', 'Installation analysis', 'Project management'],
      },
    ],
    industries: [
      { label: 'Oil & gas', pictogram: 'oil-gas' },
      { label: 'Renewables', pictogram: 'offshore-wind' },
      { label: 'Subsea infrastructure', pictogram: 'subsea-infrastructure' },
      { label: 'Emerging offshore sectors', pictogram: 'technology' },
    ],
    // Dev site Team block, Subsea Services (Stavanger office), 19 Sep 2026. No headshot on dev
    contact: {
      name: 'Emil Spieler Palmers',
      role: 'Subsea BD Manager',
      email: 'esp@reachsubsea.com',
      phone: '+47 915 24 951',
    },
  },
  {
    id: 'survey',
    title: 'Survey',
    short: 'Survey',
    href: '/services/survey/',
    pictogram: 'survey',
    summary: 'Geophysical, geotechnical and positioning survey across the asset lifecycle.',
    scope: [
      'Seabed, site, route & pipeline surveys',
      'UXO detection & clearance',
      'Cable route engineering & installation',
      'Marine construction survey',
      'Rig positioning & mooring analysis',
      'Hydrographic & geophysical data',
    ],
    // Titles verbatim from the client PDF p10 (the six capability boxes). Summaries and scope items are
    // short drafts from the PDF's intro copy, the FAQs and the dev project pages. Reach to confirm. Video /
    // spec-sheet links render only once a real file exists (PDF p31), so none yet.
    capabilities: [
      {
        title: 'Seabed & site surveys, route and pipeline surveys',
        summary: 'Multibeam, sidescan and sub-bottom data that show what is on and under the seabed.',
        scope: ['Multibeam bathymetry', 'Sidescan sonar', 'Sub-bottom profiling'],
      },
      {
        title: 'UXO detection and clearance surveys',
        summary: 'Magnetometer and gradiometer surveys that find unexploded ordnance before work starts.',
        scope: ['Gradiometer survey', 'Target identification', 'Clearance support'],
      },
      {
        title: 'Offshore cable route engineering & installation support',
        summary: 'Route surveys and engineering data from the landfall to the platform, then support through installation.',
        scope: ['Route survey', 'Seabed conditions', 'Installation support'],
      },
      {
        title: 'Marine construction survey support',
        summary: 'Survey and positioning for the ports, foundations and structures built in the water.',
        scope: ['Pre-construction', 'As-built survey', 'Positioning'],
      },
      {
        title: 'Rig positioning and mooring analysis',
        summary: 'Positioning and mooring analysis for rigs and floating units moving onto location.',
        scope: ['Rig positioning', 'Mooring analysis', 'Seabed checks'],
      },
      {
        title: 'Hydrographic & geophysical data acquisition',
        summary: 'Hydrographic and geophysical data from crewed vessels, uncrewed vessels and ROVs.',
        scope: ['Hydrography', 'Geophysics', 'Crewed or uncrewed'],
      },
    ],
    industries: [
      { label: 'Oil & gas', pictogram: 'oil-gas' },
      { label: 'Offshore wind & renewables', pictogram: 'offshore-wind' },
      { label: 'Subsea cables & interconnectors', pictogram: 'subsea-infrastructure' },
      { label: 'Ports & marine construction', pictogram: 'marine' },
    ],
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    short: 'Monitoring',
    href: '/services/monitoring/',
    pictogram: 'global-monitoring',
    summary: 'Continuous asset and environmental monitoring, on the seabed or the surface.',
    scope: [
      'gWatch 4D gravity monitoring',
      'Seafloor subsidence',
      'DepthWatch & real-time seismic',
      'Wellwatch & Drillwatch',
      'CO2 storage monitoring',
      'Earthquake & geothermal monitoring',
    ],
    // Titles verbatim from the client PDF p12 (no third-party brand names, PDF p31). Summaries for the
    // three environmental boxes are the PDF's; the geophysical ones are short drafts from the PDF's
    // intro copy and the dev projects. Reach to confirm. Video / spec-sheet links render only once a
    // real file exists (PDF p31), so none yet.
    capabilities: [
      {
        group: 'geophysical',
        title: 'gWatch: 4D gravity monitoring',
        summary: 'Gravity measured on the seabed, repeated over years, to track reservoir change.',
        scope: ['Seabed gravimetry', 'Repeat surveys', 'Reservoir behaviour'],
      },
      {
        group: 'geophysical',
        title: 'Seafloor subsidence monitoring',
        summary: 'Millimetre-level seabed movement above producing fields and storage sites.',
        scope: ['Depth change', 'Benchmark networks', 'Long-term trends'],
      },
      {
        group: 'geophysical',
        title: 'DepthWatch',
        summary: 'Seabed depth measured continuously, to support 4D seismic.',
        scope: ['Pressure sensors', '4D seismic support', 'Continuous data'],
      },
      {
        group: 'geophysical',
        title: 'Wellwatch: injection integrity monitoring',
        summary: 'Monitoring around injection wells, to confirm the injected volume stays where it should.',
        scope: ['Injection wells', 'Integrity checks', 'Early warning'],
      },
      {
        group: 'geophysical',
        title: 'Drillwatch: well drilling control',
        summary: 'Monitoring while a well is drilled, to keep the operation inside its limits.',
        scope: ['Drilling phase', 'Well control', 'Live data'],
      },
      {
        group: 'geophysical',
        title: 'Real-time seismic monitoring',
        summary: 'Seabed seismic sensors reporting as the ground moves.',
        scope: ['Seabed sensors', 'Real-time data', 'Seismic risk'],
      },
      {
        group: 'environmental',
        title: 'Earthquake monitoring and prediction',
        summary: 'Real-time seismic networks providing early insight into seismic activity in monitored regions.',
        scope: ['Seismic networks', 'Early insight', 'Monitored regions'],
      },
      {
        group: 'environmental',
        title: 'CO2 storage monitoring',
        summary: 'Long-term surveillance of CO2 storage sites, supporting safe and verifiable carbon storage operations.',
        scope: ['Storage surveillance', 'Verification', 'Long-term baseline'],
      },
      {
        group: 'environmental',
        title: 'Geothermal energy monitoring',
        summary: 'Monitoring geothermal reservoirs and operations to support safe, sustainable energy production.',
        scope: ['Reservoir response', 'Operations', 'Safe production'],
      },
    ],
    // PDF p12 chips, five folded to four (reservoir management + well integrity & drilling → one) so the strip fills a row. Pictograms are library glyphs picked as best fits (no geothermal / seismic glyph): Ross to confirm.
    industries: [
      { label: 'Oil & gas reservoirs and wells', pictogram: 'oil-gas' },
      { label: 'CO2 & carbon storage', pictogram: 'carbon-storage' },
      { label: 'Geothermal energy', pictogram: 'geothermal' },
      { label: 'Seismic risk monitoring', pictogram: 'subsea-telemetry' },
    ],
  },
  {
    id: 'technology',
    title: 'Technology & Innovation',
    short: 'Technology',
    href: '/services/technology-innovation/',
    pictogram: 'technology',
    summary: 'Remote operations and in-house ROV technology, including Reach Remote.',
    scope: ['Reach Pilot', 'Reach Remote', 'Reach Horizon', 'Reach Relay'],
  },
];

// ── Asset lifecycle (19 Sep 2026) ─────────────────────────────────────────────
// Which service line works at which stage of an offshore asset's life. PLACEHOLDER MAPPING, drafted
// from the dev site's sub-service pages: Reach to confirm the stages and every label before launch.
// WP: an options-page repeater (phases) + one repeater per service line (phase, label).

export interface LifecyclePhase {
  id: string;
  label: string;
}

export const lifecyclePhases: LifecyclePhase[] = [
  { id: 'plan', label: 'Plan & survey' },
  { id: 'install', label: 'Install' },
  { id: 'operate', label: 'Operate' },
  { id: 'extend', label: 'Extend life' },
  { id: 'decommission', label: 'Decommission' },
];

export interface LifecycleRow {
  service: ServiceId;
  /** Short label per phase id, where the line works in that phase. */
  cells: Partial<Record<string, string>>;
}

/** The line under every other line (Technology & Innovation): one sentence across every phase. */
export interface LifecycleFoundation {
  service: ServiceId;
  /** Shared product-name prefix, said once: "Reach Pilot, Remote, Horizon and Relay". */
  brand: string;
  items: { label: string; url: string }[];
  caption: string;
}

export const lifecycleRows: LifecycleRow[] = [
  { service: 'survey', cells: { plan: 'Site & route survey', install: 'Positioning, as-laid', operate: 'Inspection survey', decommission: 'As-left survey' } },
  { service: 'subsea', cells: { install: 'Construction support', operate: 'IMR', extend: 'Repair & integrity', decommission: 'Removal' } },
  { service: 'monitoring', cells: { plan: 'Baseline', operate: 'Reservoir & wells', extend: 'Subsidence', decommission: 'CO2 storage' } },
];

/** A line's row, zoomed in (19 Sep 2026, Subsea single): 2–3 concrete tasks per phase it works in.
 * PLACEHOLDER, drafted from the dev child pages and project references. Reach to confirm. */
export const lifecycleTasks: Partial<Record<ServiceId, Partial<Record<string, string[]>>>> = {
  subsea: {
    install: ['Touchdown monitoring', 'Suction anchors', 'Pre- and post-lay survey'],
    operate: ['Structural inspection', 'SCM changeout', 'Scale squeeze'],
    extend: ['Pipeline inspection', 'CP survey', 'Repair'],
    decommission: ['Jack-up removal', 'Seabed intervention', 'Boulder clearance'],
  },
};

// Monitoring (6 Oct 2026). PLACEHOLDER tasks, drafted from the capability boxes. Reach to confirm.
lifecycleTasks.monitoring = {
  plan: ['Baseline gravity survey', 'Benchmark placement'],
  operate: ['gWatch 4D gravity', 'DepthWatch', 'Wellwatch & Drillwatch'],
  extend: ['Seafloor subsidence', 'Repeat surveys'],
  decommission: ['CO2 storage monitoring', 'Long-term verification'],
};

// Survey (5 Oct 2026). PLACEHOLDER tasks, drafted from the capability boxes and dev projects. Reach to confirm.
lifecycleTasks.survey = {
  plan: ['Seabed mapping', 'UXO detection', 'Cable route engineering'],
  install: ['Rig positioning', 'Mooring analysis', 'Marine construction survey'],
  operate: ['Pipeline inspection', 'Hydrographic data', 'Seabed change'],
  decommission: ['Debris survey', 'UXO clearance'],
};

// Client PDF p15 (Technology & Innovation): the four in-house products, named once in one line.
export const lifecycleFoundation: LifecycleFoundation = {
  service: 'technology',
  brand: 'Reach',
  items: [
    { label: 'Pilot', url: '/services/technology-innovation/reach-pilot/' },
    { label: 'Remote', url: '/assets/reach-remote/' },
    { label: 'Horizon', url: '/services/technology-innovation/reach-horizon/' },
    { label: 'Relay', url: '/services/technology-innovation/reach-relay/' },
  ],
  caption: 'in-house technology under every line, in every phase.',
};
