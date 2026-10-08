// Project references (19 Sep 2026, Subsea single). Real projects from the dev site's Projects post type
// (reachsubsea.no/projects/), with client, field, year and vessel read from each project's body copy:
// the dev CPT has no structured fields and no service relation (the Subsea page curates them by hand).
// WP proposal: Project fields `service` (relationship to the Service line), `subService`, `field`,
// `year`, `vessels` (relationship to Assets), so a service single queries its own projects.
// Images: the dev projects' featured images, resized to 1240 wide.
//
// Project single (8 Oct 2026, Q149): the quarterly reports' featured projects (4Q 2025 p20–21, 2Q 2025 p19,
// 2Q 2026 p12 and p23) as structured fields: a lead, the story, key facts (client, period, location, water depth,
// vessels), 0–4 figures and an optional spotlight. A project with a `story` gets its own page at /projects/<slug>/
// (src/templates/ProjectSingle.astro); the rest still link to the dev site until they are migrated.
// WP: the Project post type gains these as fields; the spotlight is a relationship, written once per technology.
import type { ServiceId } from './services';
import type { CardField, StatField } from '../lib/types';
import { cardPresets } from './card-presets';
import stories from './project-stories.json';

/** Explains the technology behind a project (the reports' "Operational spotlight"). One per technology, shared by
 * every project that uses it, so the same paragraph is never typed twice. */
export interface ProjectSpotlight {
  title: string;
  text: string;
  link: { label: string; url: string };
}

export const spotlights = {
  // 4Q 2025 report p20–21, verbatim apart from spelling out CPs
  gwatch: {
    title: 'gWatch: 4D gravity monitoring',
    text: 'gWatch operations measure minute changes in gravity and vertical seabed movement at pre-defined control points. These measurements help clients monitor reservoir behaviour, fluid movement and field integrity over time.',
    link: { label: 'Monitoring services', url: '/services/monitoring/' },
  },
} satisfies Record<string, ProjectSpotlight>;

export type SpotlightId = keyof typeof spotlights;

export interface ProjectRef {
  slug: string;
  title: string;
  service: ServiceId;
  /** Short work type for the card kicker, e.g. "Construction support". */
  work: string;
  /** Left out where the source gives no date (never guessed). */
  year?: number;
  /** Field or area, one short line. */
  field: string;
  vessels?: string[];
  /** The source's pixel size: the single never enlarges a small one, and crops a tall one to 3:2. */
  image: { src: string; alt: string; focalPoint?: { x: number; y: number }; width?: number; height?: number; caption?: string };
  /** Map pin (Projects archive and the single's location). Projects at one place share its name and point, and
   * one pin. Left out where the source gives no usable location; a region centroid says so in a comment. */
  place?: { name: string; lat: number; lon: number };
  /** Dev URL, until the redirect map fixes the new one. A project with a `story` links to its own page. */
  url: string;
  // Project single fields (all optional; a field left out renders nothing)
  /** "Undisclosed" where the report says so. */
  client?: string;
  /** As the report gives it: "4Q 2025", "December 2025". */
  period?: string;
  waterDepth?: string;
  /** One or two sentences under the title. */
  lead?: string;
  /** Body paragraphs (rich text in WP). */
  story?: string[];
  /** 3–4 figures, the first leading. */
  stats?: StatField[];
  spotlight?: SpotlightId;
  /** Where the content comes from, for Reach to check. */
  source?: string;
}

const base = import.meta.env.BASE_URL;

/** The curated fields; `projects` adds each one's migrated body (lead, story, period) from project-stories.json. */
const entries: ProjectRef[] = [
  {
    slug: 'pipelay-installation-support',
    title: 'Pipelay and installation support on Tolmount',
    service: 'subsea',
    work: 'Construction support',
    year: 2020,
    field: 'Tolmount, UK North Sea',
    vessels: ['Topaz Tiamat'],
    image: { src: `${base}images/project-tolmount-pipelay.jpg`, alt: 'The pipelay vessel Castoro Sei at sea during the Tolmount pipeline installation', focalPoint: { x: 0.55, y: 0.5 }, width: 1240, height: 930 },
    url: '/projects/pipelay-installation-support/',
    place: { name: 'Tolmount', lat: 53.9, lon: 0.9 },
  },
  {
    slug: 'structure-inspection',
    title: 'IMR campaign on Trinidad’s north and east coast',
    service: 'subsea',
    work: 'IMR',
    year: 2020,
    field: 'Trinidad',
    vessels: ['Havila Subsea'],
    image: { src: `${base}images/project-trinidad-inspection.jpg`, alt: 'An offshore platform at sunset, seen from the helideck of Havila Subsea', focalPoint: { x: 0.6, y: 0.5 }, width: 1240, height: 933 },
    url: '/projects/structure-inspection/',
    place: { name: 'Trinidad', lat: 10.9, lon: -60.8 },
  },
  {
    slug: 'haven-jack-up-removal',
    title: 'Removing the Haven jack-up from Johan Sverdrup',
    service: 'subsea',
    work: 'Decommissioning',
    year: 2020,
    field: 'Johan Sverdrup, North Sea',
    vessels: ['Olympic Challenger', 'Topaz Tiamat'],
    image: { src: `${base}images/project-haven-removal.jpg`, alt: 'The Haven jack-up rig at sea with a Reach Subsea vessel alongside', focalPoint: { x: 0.4, y: 0.55 }, width: 1240, height: 988 },
    url: '/projects/haven-jack-up-removal/',
    place: { name: 'Johan Sverdrup', lat: 58.8, lon: 2.6 },
  },
  {
    slug: 'boulder-removal',
    title: 'Boulder removal at 350 m on Troll B',
    service: 'subsea',
    work: 'Seabed intervention',
    year: 2023,
    field: 'Troll B, North Sea',
    image: { src: `${base}images/project-troll-boulder.jpg`, alt: 'A ScanMachine dredging tool lifted over the side by a vessel crane', focalPoint: { x: 0.4, y: 0.5 }, width: 1240, height: 697 },
    url: '/projects/boulder-removal/',
    place: { name: 'Troll', lat: 60.8, lon: 3.5 },
  },
  {
    slug: 'suction-anchor-installation',
    title: 'Installing 14 suction anchors in the North and Norwegian Seas',
    service: 'subsea',
    work: 'Construction support',
    year: 2019,
    field: 'North Sea and Norwegian Sea',
    vessels: ['Havila Subsea', 'Topaz Tiamat'],
    image: { src: `${base}images/project-suction-anchors.jpg`, alt: 'Two yellow suction anchors on deck, with a crew member in red overalls', focalPoint: { x: 0.5, y: 0.6 }, width: 1240, height: 1653 },
    url: '/projects/suction-anchor-installation/',
  },
  // Monitoring (6 Oct 2026): the dev site's real monitoring projects (PDF p13 names three; ASUMO has no
  // featured image on dev, so it borrows the gWatch ROV photo until Reach supplies one).
  // The first project single (8 Oct 2026, Q149): 4Q 2025 report p20, "Reach Remote project #1". Photo: the report's
  // own (Reach Remote 1 from the bow). Not the 2023 Ormen Lange gravimetry project below: a new campaign.
  {
    slug: 'ormen-lange-gwatch-reach-remote',
    title: 'Ormen Lange gWatch gravity campaign',
    service: 'monitoring',
    work: 'gWatch',
    year: 2025,
    field: 'Ormen Lange, Norway',
    vessels: ['Reach Remote 1'],
    image: { src: `${base}images/reach-remote-bow.jpg`, alt: 'Reach Remote 1, an uncrewed surface vessel, on calm water at dusk', focalPoint: { x: 0.45, y: 0.5 }, width: 1240, height: 820 },
    url: '/projects/ormen-lange-gwatch-reach-remote/',
    place: { name: 'Ormen Lange', lat: 63.5, lon: 5.4 },
    client: 'Norske Shell',
    period: '4Q 2025',
    waterDepth: '295–1,130\u00a0m',
    lead: 'The first full commercial subsea operation performed without a support vessel, run from shore with Reach Remote 1.',
    story: [
      'In the fourth quarter of 2025 we completed the Ormen Lange gWatch gravity campaign using Reach Remote 1, an uncrewed surface vessel, marking a historic milestone in remote offshore operations.',
      'Reach Remote 1 demonstrated safe and efficient execution, including long-duration ROV operations in water depths from 295\u00a0m to 1,130\u00a0m in rough sea conditions.',
      'The operation was run from several remote operations centres across Norway, in Haugesund, Bergen and Horten. It delivered a fully processed gravity and subsidence report equal to previous campaigns, confirming the technological maturity of the Reach Remote gWatch concept.',
    ],
    stats: [
      { key: 'carbon', value: '95%', label: 'Carbon reduction achieved' },
      { key: 'centres', value: '3', label: 'Operations centres linked' },
      { key: 'depth', value: '1,130\u00a0m', label: 'Maximum depth reached' },
      { key: 'remote', value: '100%', label: 'Remote vessel utilised' },
    ],
    spotlight: 'gwatch',
    source: '4Q 2025 report p20',
  },
  {
    slug: 'gwatch-equinor-gas-fields',
    title: 'gWatch surveys at Equinor gas fields',
    service: 'monitoring',
    work: 'gWatch',
    year: 2023,
    field: 'Equinor gas fields, North Sea',
    image: { src: `${base}images/project-gwatch-equinor.jpg`, alt: 'Two engineers at the control room desk preparing for a gWatch campaign', focalPoint: { x: 0.5, y: 0.45 }, width: 1240, height: 696 },
    url: '/projects/reservoir-monitoring-surveys-using-gwatch-at-several-equinor-operated-gas-fields/',
  },
  {
    slug: 'depthwatch-shell-4d-seismic',
    title: 'DepthWatch for 4D seismic, with Shell',
    service: 'monitoring',
    work: 'DepthWatch',
    year: 2023,
    field: 'Shell',
    image: { src: `${base}images/project-depthwatch-shell.jpg`, alt: 'Engineers assembling a DepthWatch seabed unit in the workshop', focalPoint: { x: 0.5, y: 0.5 }, width: 1240, height: 930 },
    url: '/projects/unlocking-enhanced-value-in-4d-seismic-with-reach-subseas-depthwatch-technology-insights-from-reach-subsea-and-shell/',
  },
  {
    slug: 'ormen-lange-gravimetry',
    title: 'Gravimetry milestone at Ormen Lange',
    service: 'monitoring',
    work: 'gWatch',
    year: 2020,
    field: 'Ormen Lange, Shell Norge',
    image: { src: `${base}images/project-ormen-lange.jpg`, alt: 'A gravimetry sensor on the seabed, lit by the ROV’s lamps', focalPoint: { x: 0.5, y: 0.5 }, width: 1240, height: 620 },
    url: '/projects/reach-subsea-sets-a-new-milestone-for-accuracy-and-efficiency-of-gravimetry-surveys-with-shell-norge-at-ormen-lange-field/',
    place: { name: 'Ormen Lange', lat: 63.5, lon: 5.4 },
  },
  {
    slug: 'asumo',
    title: 'ASUMO marine-earth monitoring',
    service: 'monitoring',
    work: 'Research',
    year: 2022,
    field: 'With JAMSTEC and the University of Bergen',
    image: { src: `${base}images/rov-zeerov-gwatch.jpg`, alt: 'A gWatch seabed monitoring unit carried by an ROV', focalPoint: { x: 0.5, y: 0.5 }, width: 1240, height: 820 },
    url: '/projects/asumo/',
  },
  // Survey (5 Oct 2026): the three real projects the client PDF p10 names, read from the dev site. The
  // cable-route page gives no date, so none is shown. Pipeline-inspection photo is the charter vessel.
  {
    slug: 'site-survey-campaign',
    title: 'Site survey campaign in the Norwegian sector',
    service: 'survey',
    work: 'Site survey',
    year: 2019,
    field: 'Norwegian sector, 100–390 m',
    image: { src: `${base}images/project-site-survey-norway.jpg`, alt: 'A white and black survey vessel under way on grey water, seen from above', focalPoint: { x: 0.5, y: 0.5 }, width: 800, height: 501 },
    url: '/projects/site-survey-campaign/',
  },
  {
    slug: 'pipeline-inspection-campaign',
    title: 'Annual pipeline inspection at Ormen Lange',
    service: 'survey',
    work: 'Pipeline inspection',
    year: 2020,
    field: 'Ormen Lange, Norske Shell',
    vessels: ['Siem Pride'],
    image: { src: `${base}images/project-pipeline-ormen-lange.jpg`, alt: 'The red and white vessel Siem Pride at anchor under a grey sky', focalPoint: { x: 0.5, y: 0.5 }, width: 631, height: 370 },
    url: '/projects/pipeline-inspection-campaign/',
    place: { name: 'Ormen Lange', lat: 63.5, lon: 5.4 },
  },
  {
    slug: 'geophysical-and-uxo-power-cable-route-survey',
    title: 'Cable-route survey to Seagreen Offshore Windfarm',
    service: 'survey',
    work: 'Cable route',
    field: 'Carnoustie to Seagreen, UK',
    image: { src: `${base}images/project-cable-route-seagreen.jpg`, alt: 'A sidescan sonar mosaic of the seabed, rippled sand with a cable corridor running across it', focalPoint: { x: 0.4, y: 0.5 }, width: 1140, height: 594 },
    url: '/projects/geophysical-and-uxo-power-cable-route-survey/',
    place: { name: 'Seagreen', lat: 56.6, lon: -2.2 },
  },
  // Scarborough gWatch (8 Oct 2026, Q149): 4Q 2025 report p21, "Reach Remote project #2". Figures: four of the
  // report's six; "100% remote vessel utilized" and "60% campaign target met" (a campaign still running) left out.
  {
    slug: 'scarborough-gwatch-reach-remote-2',
    title: 'Scarborough gWatch gravity campaign',
    service: 'monitoring',
    work: 'gWatch',
    year: 2025,
    field: 'Scarborough, Australia',
    vessels: ['Reach Remote 2'],
    image: { src: `${base}images/project-scarborough-rr2.jpg`, alt: 'Reach Remote 2 under way off Fremantle, with the coast and a sailing boat behind', focalPoint: { x: 0.5, y: 0.6 }, width: 1102, height: 521 },
    url: '/projects/scarborough-gwatch-reach-remote-2/',
    place: { name: 'Scarborough', lat: -19.9, lon: 113.2 },
    client: 'Woodside',
    period: 'December 2025',
    waterDepth: 'Over 900 m',
    lead: 'Our first commercial operation in Australia: Reach Remote 2 began the Scarborough gWatch campaign, run from shore in Fremantle.',
    story: [
      'In the fourth quarter of 2025 we started the Scarborough gWatch campaign using Reach Remote 2, an uncrewed surface vessel. The remote operation is based in Fremantle, where ROV pilots and marine crew work side by side.',
      'Following full AMSA certification of Reach Remote 2, the campaign was the first commercial operation for Reach Remote in Australia, a historic milestone in its international scale-up.',
      'The gravimetry survey runs at water depths over 900 m. Reach Remote 2 demonstrated 26 days of uninterrupted offshore endurance and a 20-day uninterrupted subsea dive, an exceptional achievement that confirms the expected technical capacity of the vessel and ROV.',
    ],
    stats: [
      { key: 'carbon', value: '91%', label: 'Carbon reduction achieved' },
      { key: 'days', value: '26', label: 'Continuous days subsea' },
      { key: 'hours', value: '528', label: 'Operational hours logged' },
      { key: 'readings', value: '300+', label: 'Total readings taken' },
    ],
    spotlight: 'gwatch',
    source: '4Q 2025 report p21',
  },
  // U-864 (8 Oct 2026, Q149): 2Q 2025 report p19, "Project update". No figures in the report. Written U-864, as the
  // 2Q 2026 report and the Coastal Administration do (the 2025 page has U864). The sub-surface system's maker is left
  // out (PDF p31: no third-party brand names in our own copy).
  {
    slug: 'u-864-wreck-survey',
    title: 'U-864 high-definition wreck survey',
    service: 'survey',
    work: 'Wreck survey',
    year: 2025,
    field: 'Off Fedje, Norway',
    vessels: ['Go Electra'],
    image: { src: `${base}images/project-u864-wreck-model.jpg`, alt: 'A 3D model of the U-864 submarine wreck on the seabed, built from photogrammetry and multibeam data', focalPoint: { x: 0.5, y: 0.5 }, width: 1101, height: 519, caption: 'High-resolution photogrammetry model of the wreck, with multibeam (MBES) data' },
    url: '/projects/u-864-wreck-survey/',
    place: { name: 'U-864 wreck, off Fedje', lat: 60.8, lon: 4.6 },
    client: 'Norwegian Coastal Administration',
    period: 'May 2025',
    waterDepth: '140–170 m',
    lead: 'A new survey of the WW2-era German submarine U-864 and the seabed around it, 160 m below the surface off the coast of Norway.',
    story: [
      'We were awarded the contract to carry out a new survey of the site, giving the Norwegian Coastal Administration updated data at a resolution not seen before at this site. The wreck rests in two parts, split by a torpedo.',
      'Using an ROV, our team ran a high-resolution multibeam echosounder (MBES) survey of the wreck and the area around it, to get an overview of the site and detect any entangling risks. A general visual inspection (GVI) with a 4K camera followed.',
      'For even greater detail, more than 160,000 images were captured in a high-resolution photogrammetry campaign, then processed with our in-house workflow into a highly detailed 3D model of the wreck.',
      'With the whole area mapped by MBES, video and photogrammetry, the team turned to the sub-surface, combining a sub-bottom profiler with a new electromagnetic system.',
      'Together, MBES and photogrammetry produced a comprehensive model of the wreck, while the sub-bottom profiler, the electromagnetic data and CPT samples gave a better estimate of how deep it is buried. Access to the keel is one of the Coastal Administration’s key objectives, and the new data tells them more about its possible depth below the seabed and whether it is still intact.',
    ],
    source: '2Q 2025 report p19',
  },
  // 2Q 2026 report p12, "Project features" (crewed vessels): three cards, each a short story and four facts.
  {
    slug: 'u-864-environmental-recovery',
    title: 'Environmental recovery at the U-864 wreck site',
    service: 'subsea',
    work: 'Environmental recovery',
    year: 2026,
    field: 'Off Fedje, Norway',
    vessels: ['Olympic Triton'],
    image: { src: `${base}images/project-u864-recovery.jpg`, alt: 'ROV camera view of corroded mercury containers on the seabed at the U-864 wreck, with the dive data along the top', focalPoint: { x: 0.5, y: 0.6 }, width: 537, height: 280 },
    url: '/projects/u-864-environmental-recovery/',
    place: { name: 'U-864 wreck, off Fedje', lat: 60.8, lon: 4.6 },
    client: 'Norwegian Coastal Administration',
    period: '2Q 2026',
    waterDepth: '160 m',
    lead: 'We supported the recovery of mercury containers and associated debris from the U-864 wreck site off Fedje.',
    story: [
      'The project included high-precision ROV operations, seabed surveys and environmental characterisation, providing important data for future recovery and remediation.',
      'It demonstrated our capabilities in complex subsea intervention and environmental response operations.',
    ],
    source: '2Q 2026 report p12',
  },
  {
    slug: 'black-sea-long-term-imr',
    title: 'Long-term IMR operations in the Black Sea',
    service: 'subsea',
    work: 'IMR',
    year: 2026,
    field: 'Black Sea',
    vessels: ['Normand Jarstein'],
    // The report's card shows a deck view at 534px; the vessel itself, from the contract news (May 2026), is larger
    image: { src: `${base}images/project-black-sea-jarstein.jpg`, alt: 'Normand Jarstein, an orange and white construction vessel with a helideck, under way on calm sea', focalPoint: { x: 0.5, y: 0.5 }, width: 1240, height: 930 },
    url: '/projects/black-sea-long-term-imr/',
    // Region centroid: the report gives only "Black Sea"
    place: { name: 'Black Sea', lat: 43.2, lon: 34.0 },
    client: 'Undisclosed',
    period: '2Q 2026',
    waterDepth: '2,150 m',
    lead: 'A long-term inspection, maintenance and light construction campaign across the client’s large portfolio of assets in the region.',
    story: [
      'The scope includes asset installations, drill support operations and BOP intervention.',
      'In its first quarter the project achieved strong mobilisation and utilisation, delivering critical subsea engineering and operational support while keeping execution safe and efficient during complex operations.',
    ],
    source: '2Q 2026 report p12',
  },
  {
    slug: 'pipeline-counteract-recovery',
    title: 'End-to-end subsea recovery on a 36-inch pipeline',
    service: 'subsea',
    work: 'Subsea recovery',
    year: 2026,
    field: 'North Sea, Norwegian sector',
    vessels: ['Olympic Triton'],
    image: { src: `${base}images/project-counteract-recovery.jpg`, alt: 'The back deck of Olympic Triton with recovered counteracts lined up by the crane, open sea behind', focalPoint: { x: 0.6, y: 0.6 }, width: 541, height: 287 },
    url: '/projects/pipeline-counteract-recovery/',
    // Region centroid: the report gives only "North Sea, Norwegian Sector"
    place: { name: 'Norwegian North Sea', lat: 59.8, lon: 2.8 },
    client: 'Undisclosed',
    period: '2Q 2026',
    waterDepth: '320 m',
    lead: 'We recovered 34 temporary counteracts from six lay curves of a 36-inch pipeline once pipelay was complete.',
    story: [
      'The counteracts had kept the pipeline stable during installation. Working from Olympic Triton, the scope covered ROV-supported as-found inspection, pipelay monitoring and support, subsea recovery, deck handling and transport, then ROV and MBES as-left surveys of the recovered locations.',
      'It showed our ability to run complex subsea recovery, lifting and survey operations as one integrated offshore campaign.',
    ],
    source: '2Q 2026 report p12',
  },
  // 2Q 2026 report p23, "Reach Remote | Project features" (uncrewed vessels)
  {
    slug: 'reach-remote-1-pipeline-inspection',
    title: 'Pipeline inspection with Reach Remote 1',
    service: 'survey',
    work: 'Pipeline inspection',
    year: 2026,
    field: 'North Sea, UK and Norwegian sectors',
    vessels: ['Reach Remote 1'],
    // The report's card photo is 537px; this Reach Remote 1 photo is from the contract news (Feb 2026)
    image: { src: `${base}images/project-gassco-pipeline-rr1.jpg`, alt: 'Reach Remote 1 on grey water, a snowy wooded shore behind', focalPoint: { x: 0.45, y: 0.55 }, width: 1240, height: 931 },
    url: '/projects/reach-remote-1-pipeline-inspection/',
    // Region centroid: the inspection scope spans the North Sea pipeline network
    place: { name: 'North Sea pipelines', lat: 58.0, lon: 1.5 },
    client: 'Equinor and Gassco',
    period: '2Q 2026',
    waterDepth: '40–1,200 m',
    lead: 'The first large-scale use of an uncrewed surface vessel for pipeline inspection across Gassco-operated assets in the North Sea.',
    story: [
      'The campaign covered an inspection scope of about 3,500 km of pipelines across 24 work packages.',
      'Reach Remote 1 showed it can deliver efficient, high-quality pipeline inspection. The campaign was also an important regulatory and operational milestone, with Reach Remote 1 inspecting in both Norwegian and UK waters.',
    ],
    source: '2Q 2026 report p23',
  },
  {
    slug: 'reach-remote-2-scarborough-commissioning',
    title: 'Cold commissioning support at Scarborough',
    service: 'subsea',
    work: 'IMR',
    year: 2026,
    field: 'Scarborough, Australia',
    vessels: ['Reach Remote 2'],
    image: { src: `${base}images/project-scarborough-commissioning.jpg`, alt: 'Reach Remote 2 on calm water, seen from the air', focalPoint: { x: 0.5, y: 0.55 }, width: 537, height: 283 },
    url: '/projects/reach-remote-2-scarborough-commissioning/',
    place: { name: 'Scarborough', lat: -19.9, lon: 113.2 },
    client: 'Woodside',
    period: '2Q 2026',
    waterDepth: '950 m',
    lead: 'Pre-start-up and cold commissioning support from Reach Remote 2, to verify subsea production infrastructure before first gas.',
    story: [
      'Reach Remote 2 performed as-found inspections and valve operations covering eight production trees, multiple flowline end terminations and inline tee assemblies.',
      'It demonstrated Reach Remote 2’s IMR capability in deep water, giving the client reliable, live data during a critical commissioning programme.',
    ],
    source: '2Q 2026 report p23',
  },
  {
    slug: 'reach-remote-2-fpso-inspection',
    title: 'Post-cyclone FPSO inspection',
    service: 'subsea',
    work: 'Inspection',
    year: 2026,
    field: 'Pyrenees Venture FPSO, Australia',
    vessels: ['Reach Remote 2'],
    image: { src: `${base}images/project-fpso-inspection.jpg`, alt: 'Reach Remote 2 under way off the coast, a sailing boat behind', focalPoint: { x: 0.55, y: 0.6 }, width: 537, height: 283 },
    url: '/projects/reach-remote-2-fpso-inspection/',
    // The report spells it "Pyreenes"; the FPSO is the Pyrenees Venture
    place: { name: 'Pyrenees Venture FPSO', lat: -21.6, lon: 114.1 },
    client: 'Woodside',
    period: '2Q 2026',
    waterDepth: '200 m',
    lead: 'After a cyclone off Western Australia, Reach Remote 2 inspected the Pyrenees Venture FPSO’s subsea risers and moorings to verify their integrity and readiness.',
    story: [
      'The campaign covered integrity inspection of critical FPSO infrastructure, including risers and moorings.',
      'It showed that Reach Remote can safely inspect infrastructure inside a producing offshore field and within an FPSO’s operational zone.',
    ],
    source: '2Q 2026 report p23',
  },
  // Dev projects (8 Oct 2026, Q150): the remaining live Projects, read by an agent from each post's body (year, client
  // and depth only where the body states them). Not migrated: fleet-update-2 (a 2021 charter press release) and
  // 500-imr-days (a milestone story); both go to the Newsroom in the redirect map.
  // Dev project (live slug digimon. No year in body (page dated Mar 2023 = migration date only). No client or depth stated. Located nowhere (CO2 storage reservoirs in general), so no coords.
  // R&D project, like ASUMO. Body: aim is to speed up CCS with an affordable digital early-warning monitoring system for any CO2 storage reservoir; Reach contributes 4D gravity, seafloor deformation and passive seismic monitoring and leads one work package; links to the DigiMon website. Image is a rendered illustration, not a photo.
  {
    slug: 'digimon',
    title: 'DIGIMON CO2 storage monitoring',
    service: 'monitoring',
    work: 'Research',
    field: 'Digital monitoring for CO2 storage',
    image: { src: `${base}images/project-digimon.jpg`, alt: 'A seabed monitoring unit on the sea floor, with a subsea structure fading into the blue water behind it', focalPoint: { x: 0.8, y: 0.6 }, width: 1024, height: 768 },
    url: '/projects/digimon/',
  },
  // Dev project (live slug decomissioning-3 (sic). Body says only "In November" (no year; image filename carries "4Q2019" but the body does not, so year left out). Depth "approximately 125 m" and vessel from body. Client "a major Oil & Gas Company", not named.
  // Pin: Body says only "on NCS in the North Sea": approximate centroid of the Norwegian North Sea, not the actual field.
  // Live slug is misspelt ("decomissioning-3"); the redirect map should keep the old URL. Body: removal of several risers (umbilical and flowlines) from an FPSO, recovered through the moonpool with the 250 t crane and cut on deck with a hydraulic shear cutter, plus cleaning and inspection ahead of future decommissioning. Image is a vessel at quay, not the work.
  {
    slug: 'decomissioning-3',
    title: 'Riser removal from an FPSO in the North Sea',
    service: 'subsea',
    work: 'Decommissioning',
    field: 'Norwegian North Sea',
    vessels: ['Olympic Challenger'],
    waterDepth: 'About 125 m',
    image: { src: `${base}images/project-riser-decommissioning.jpg`, alt: 'The Olympic Challenger alongside a quay, seen from above, with the Reach logo on her bridge', focalPoint: { x: 0.45, y: 0.55 }, width: 1231, height: 710 },
    url: '/projects/decomissioning-3/',
    place: { name: 'Norwegian North Sea', lat: 59.8, lon: 2.8 },
  },
  // Dev project (live slug sabella-sas-2. Body: "In October" (no year, left out). Client Sabella SAS and vessel stated. 107 t turbine, 1 MW. Location "2km South-East off the coast of Ushant Island, France".
  // Pin: Body: turbine installed 2 km south-east off Ushant Island (Ouessant), Brittany; point set just south-east of the island.
  // Renewables project: 1 MW horizontal axis tidal turbine, 107 t dry weight, gravity base, jumper cable to shore; ROVs did pre/post survey, preparatory work and electrical hook-up. The body gives no year.
  {
    slug: 'sabella-sas-2',
    title: 'Installing a tidal turbine off Ushant',
    service: 'subsea',
    work: 'Construction support',
    field: 'Ushant, France',
    vessels: ['Olympic Challenger'],
    client: 'Sabella SAS',
    image: { src: `${base}images/project-sabella-tidal-turbine.jpg`, alt: 'A yellow and blue tidal turbine hanging from a crane beside the vessel, with a crew member in a hi-vis vest watching', focalPoint: { x: 0.58, y: 0.6 }, width: 1090, height: 819 },
    url: '/projects/sabella-sas-2/',
    place: { name: 'Ushant', lat: 48.4, lon: -5.0 },
  },
  // Dev project (live slug diver-less-riser-flange-replacement. Body: "December 2019", Havila Subsea, "a Caribbean client" (not named), 2 WROV systems, 40 % ahead of schedule, zero incidents.
  // Two WROV systems worked in parallel from the vessel; finished 40 % ahead of schedule with zero incidents. Client not named in the body.
  {
    slug: 'diver-less-riser-flange-replacement',
    title: 'Diver-less riser flange replacement in the Caribbean',
    service: 'subsea',
    work: 'IMR',
    year: 2019,
    field: 'Caribbean',
    vessels: ['Havila Subsea'],
    image: { src: `${base}images/project-riser-flange.jpg`, alt: 'The Havila Subsea in green and white hull colours at anchor, with another subsea vessel and offshore ships behind her', focalPoint: { x: 0.6, y: 0.6 }, width: 1240, height: 826 },
    url: '/projects/diver-less-riser-flange-replacement/',
  },
  // Dev project (live slug autonomous-survey. No year in body (image filename suggests Jan 2020 but that is not body evidence). No client named. Partners MMT and XOCEAN named; X-05 USV.
  // Pin: Body: nearshore geophysical surveys in Trinidad & Tobago; country centroid.
  // Body: Reach introduced USV services in the Caribbean, with joint venture partner MMT and XOCEAN, using XOCEAN’s X-05 unmanned surface vessel for multiple nearshore geophysical surveys (also geotechnical for multiple clients in the region). No year given in the body.
  {
    slug: 'autonomous-survey',
    title: 'Autonomous nearshore surveys in Trinidad and Tobago',
    service: 'survey',
    work: 'Geophysical survey',
    field: 'Trinidad and Tobago',
    image: { src: `${base}images/project-autonomous-survey.jpg`, alt: 'An orange and black XOCEAN X-05 unmanned surface vessel riding choppy green water', focalPoint: { x: 0.5, y: 0.55 }, width: 1240, height: 880 },
    url: '/projects/autonomous-survey/',
    place: { name: 'Trinidad and Tobago', lat: 10.5, lon: -61.3 },
  },
  // Dev project (live slug thruster-changeout. Body gives vessel (Olympic Challenger), the 65 t (65Te) old thruster and the Balder FPSO, North Sea. No year, client or depth.
  // Pin: Approximate position of the Balder field in the Norwegian North Sea (named FPSO); not surveyed, so 1 decimal place only.
  // Very short body (two sentences): the vessel recovered the 65 t old thruster and re-installed the new one. Image is portrait (750 x 1334); focal point suits a landscape crop around the thruster.
  {
    slug: 'thruster-changeout',
    title: 'Thruster changeout on the Balder FPSO',
    service: 'subsea',
    work: 'Construction support',
    field: 'Balder FPSO, North Sea',
    vessels: ['Olympic Challenger'],
    image: { src: `${base}images/project-thruster-changeout.jpg`, alt: 'A grey thruster unit lifted on slings beside the red hull of the Balder FPU', focalPoint: { x: 0.35, y: 0.35 }, width: 750, height: 1334 },
    url: '/projects/thruster-changeout/',
    place: { name: 'Balder', lat: 59.2, lon: 2.3 },
  },
  // Dev project (live slug water-pipeline. Client Kalyon Insaat, vessel Olympic Challenger ("one of the lead vessels") and 500 m segment from body. No year or depth in body (image filename suggests Sept 2020, not body evidence).
  // Pin: Body: pipeline carries fresh water from the Turkish mainland to the Turkish Republic of Northern Cyprus; point set mid-way across the strait. The repair location along the line is not stated.
  // Body: inspection and repair of the pipeline, including replacing a 500 m long segment, with multiple vessels. The photo shows two vessels but only the Olympic Challenger is named.
  {
    slug: 'water-pipeline',
    title: 'Repairing the fresh water pipeline to Northern Cyprus',
    service: 'subsea',
    work: 'Repair',
    field: 'Turkey to Northern Cyprus',
    vessels: ['Olympic Challenger'],
    client: 'Kalyon Insaat',
    image: { src: `${base}images/project-cyprus-water-pipeline.jpg`, alt: 'Two work vessels side by side on open blue water, one with a crane and helideck and the other with yellow equipment on deck', focalPoint: { x: 0.55, y: 0.5 }, width: 1240, height: 696 },
    url: '/projects/water-pipeline/',
    place: { name: 'Northern Cyprus', lat: 35.7, lon: 33.1 },
  },
  // Dev project (live slug fiber-optic-cable-installation. Body: "May 2020", Equinor, Olympic Challenger, 39.2 km cable Halten Link to Njord A, Global Maritime led execution for Equinor.
  // Pin: Body: 39.2 km cable ending at Njord A; point set at the Njord field in the Norwegian Sea (approximate).
  // Body: Reel Drive System with tensioners mobilised in Kristiansund 9 May, laying 17 to 22 May; execution led by Global Maritime for Equinor, with Reach providing vessel, ROV and construction services. The photo carries a Global Maritime logo in the top right corner and is portrait (786 x 1051): consider a crop or a different image. Live slug uses "fiber"; house spelling in the title is "fibre".
  {
    slug: 'fiber-optic-cable-installation',
    title: 'Laying a 39 km fibre optic cable to Njord A',
    service: 'subsea',
    work: 'Construction support',
    year: 2020,
    field: 'Halten Link to Njord A, Norwegian Sea',
    vessels: ['Olympic Challenger'],
    client: 'Equinor',
    image: { src: `${base}images/project-fibre-optic-cable.jpg`, alt: 'The back deck of a vessel with a yellow cable reel and crew in orange overalls, with a moonpool in the foreground', focalPoint: { x: 0.5, y: 0.6 }, width: 786, height: 1051 },
    url: '/projects/fiber-optic-cable-installation/',
    place: { name: 'Njord', lat: 64.3, lon: 7.6 },
  },
  // Dev project (live slug efficient-light-construction. Body: "1st Quarter of 2020", Equinor, Topaz Tiamat, ~11 % fuel saving after a new battery pack for hybrid propulsion. No location or depth.
  // Body: various light construction and survey projects for Equinor in 1Q 2020, finished very efficiently with effective tools; first project after a new battery pack for hybrid propulsion, which gave about 11 % fuel savings. The body names no field, so the card field is generic; the photo shows Johan Sverdrup structures (signage reads Equinor) but the body does not say the work was there.
  {
    slug: 'efficient-light-construction',
    title: 'Light construction and survey for Equinor from Topaz Tiamat',
    service: 'subsea',
    work: 'Light construction',
    year: 2020,
    field: 'Equinor-operated fields',
    vessels: ['Topaz Tiamat'],
    client: 'Equinor',
    image: { src: `${base}images/project-light-construction.jpg`, alt: 'A crew member on the vessel deck beside a lifting frame and a grab, between two Johan Sverdrup platform structures', focalPoint: { x: 0.55, y: 0.6 }, width: 923, height: 671 },
    url: '/projects/efficient-light-construction/',
  },
  // Dev project (live slug black-sea-map-project. Body: press release, cruise sets sail 25 Aug 2017 from Burgas, Bulgaria aboard R/V Havila Subsea, 25 days at sea; MMT/Reach provided marine surveying. Client: EEF Expeditions Limited (Expedition and Education Foundation).
  // Pin: Body: third and final cruise left the port of Burgas, Bulgaria; point set at Burgas. The survey area at sea is not given beyond "the Black Sea".
  // Third and final cruise of the Black Sea Maritime Archaeological Project (University of Southampton, Bulgarian partners), investigating sea-level change since the last glacial maximum. Body is a client press release (EEF Expeditions) with quotes and media contacts, so it reads like news. MMT/Reach provided the marine surveying capability. The photo shows the yellow survey vehicle on a Reach Subsea crane but the platforms behind suggest it may not be from the Black Sea cruise, so check before use.
  {
    slug: 'black-sea-map-project',
    title: 'Black Sea MAP archaeology survey cruise',
    service: 'survey',
    work: 'Marine survey',
    year: 2017,
    field: 'Black Sea, from Burgas, Bulgaria',
    vessels: ['Havila Subsea'],
    client: 'EEF Expeditions Limited',
    image: { src: `${base}images/project-black-sea-map.jpg`, alt: 'A yellow survey vehicle hanging from the Reach Subsea crane at dusk, with offshore platforms on the horizon and crew on deck', focalPoint: { x: 0.6, y: 0.5 }, width: 1240, height: 826 },
    url: '/projects/black-sea-map-project/',
    place: { name: 'Black Sea', lat: 43.2, lon: 34.0 },
  },
];

// Migrated bodies (8 Oct 2026, Q150): the 22 dev projects' lead, story and period, rewritten from each live post's
// body by an agent (no brand names, no quotes or press boilerplate). Fields set in an entry above win.
export const projects: ProjectRef[] = entries.map((p) => ({ ...(stories as Record<string, Partial<ProjectRef>>)[p.slug], ...p }));

/** A service line's projects, newest first. */
export function projectsFor(service: ServiceId, limit?: number): ProjectRef[] {
  const list = projects.filter((p) => p.service === service).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  return limit ? list.slice(0, limit) : list;
}

/** Projects with their own page (a story), for getStaticPaths. The page lives at its `url`: a dev project keeps
 * its live URL, so most need no redirect. */
export const projectSingles = projects.filter((p) => p.story?.length);

/** Related projects for a single: the same place first (the U-864 survey and its recovery), then the same work type
 * (other gWatch campaigns), then the same service line, newest first within each. */
export function relatedProjects(project: ProjectRef, limit = 3): ProjectRef[] {
  const rank = (p: ProjectRef) =>
    p.place && p.place.name === project.place?.name ? 0 : p.work === project.work ? 1 : p.service === project.service ? 2 : 3;
  return projects
    .filter((p) => p.slug !== project.slug && rank(p) < 3)
    .sort((a, b) => rank(a) - rank(b) || (b.year ?? 0) - (a.year ?? 0))
    .slice(0, limit);
}

/** A project as a Card (Feed grid Projects, the archive, a single's related row): kicker work · year, the place as
 * the one meta line. On a white ground pass `tint`, on tint `white`. */
export function projectCard(p: ProjectRef, surface: CardField['surface'] = 'tint'): CardField {
  return cardPresets.project({
    media: 'image-top',
    surface,
    image: p.image,
    eyebrow: [p.work, p.year].filter(Boolean).join(' · '),
    title: p.title,
    description: undefined,
    meta: [{ icon: 'map-pin', text: p.field }],
    action: { label: 'Read project', url: p.url, context: p.title },
  });
}
