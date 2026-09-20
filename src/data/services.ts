// Service lines (19 Sep 2026, Services overview). One source for the four service lines: the overview
// cards, the lifecycle visual and (later) the service single pages read from here.
// WP note: each line is a Service page (hierarchical, children = sub-services, as on the dev site's
// /services/<line>/<sub-service>/ pages). `summary` = excerpt, `pictogram` = ACF field.
// Sub-service names follow the dev site (reachsubsea.no, 19 Sep 2026). URLs are placeholders until the
// redirect map fixes the new slugs.
import type { LinkField } from '../lib/types';

export type ServiceId = 'subsea' | 'survey' | 'monitoring' | 'technology';

/** A sub-service (child page): the overview card's links and the nav. */
export type SubService = LinkField;

export interface Capability {
  title: string;
  summary: string;
  /** 3 short scope items */
  scope: string[];
  link?: LinkField;
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
  subServices: SubService[];
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
    subServices: [
      {
        label: 'Inspection, maintenance & repair',
        url: '/services/subsea/imr/',
      },
      {
        label: 'Asset integrity & pipeline inspection',
        url: '/services/subsea/asset-integrity/',
      },
      {
        label: 'Construction support',
        url: '/services/subsea/construction-support/',
      },
      {
        label: 'Engineering & project management',
        url: '/services/subsea/engineering/',
      },
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
    subServices: [
      { label: 'Seabed surveys', url: '/services/survey/seabed-surveys/' },
      { label: 'Offshore cable', url: '/services/survey/offshore-cable/' },
      { label: 'Marine construction', url: '/services/survey/marine-construction/' },
      { label: 'Rig & mooring', url: '/services/survey/rig-mooring/' },
    ],
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    short: 'Monitoring',
    href: '/services/monitoring/',
    pictogram: 'global-monitoring',
    summary: 'Continuous asset and environmental monitoring, on the seabed or the surface.',
    subServices: [
      { label: 'gWatch reservoir monitoring', url: '/services/monitoring/gwatch/' },
      { label: 'Wellwatch & Drillwatch', url: '/services/monitoring/wellwatch-drillwatch/' },
      { label: 'DepthWatch seismic nodes', url: '/services/monitoring/depthwatch/' },
      { label: 'CO2 storage monitoring', url: '/services/monitoring/co2-storage/' },
    ],
  },
  {
    id: 'technology',
    title: 'Technology & Innovation',
    short: 'Technology',
    href: '/services/technology-innovation/',
    pictogram: 'technology',
    summary: 'Remote operations and in-house ROV technology, including Reach Remote.',
    subServices: [
      { label: 'Reach Pilot', url: '/services/technology-innovation/reach-pilot/' },
      { label: 'Reach Remote', url: '/assets/reach-remote/' },
      { label: 'Reach Horizon', url: '/services/technology-innovation/reach-horizon/' },
      { label: 'Reach Relay', url: '/services/technology-innovation/reach-relay/' },
    ],
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
