// Project references (19 Sep 2026, Subsea single). Real projects from the dev site's Projects post type
// (reachsubsea.no/projects/), with client, field, year and vessel read from each project's body copy:
// the dev CPT has no structured fields and no service relation (the Subsea page curates them by hand).
// WP proposal: Project fields `service` (relationship to the Service line), `subService`, `field`,
// `year`, `vessels` (relationship to Assets), so a service single queries its own projects.
// Images: the dev projects' featured images, resized to 1240 wide.
import type { ServiceId } from './services';

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
  image: { src: string; alt: string; focalPoint?: { x: number; y: number } };
  /** Dev URL, until the redirect map fixes the new one. */
  url: string;
}

const base = import.meta.env.BASE_URL;

export const projects: ProjectRef[] = [
  {
    slug: 'pipelay-installation-support',
    title: 'Pipelay and installation support on Tolmount',
    service: 'subsea',
    work: 'Construction support',
    year: 2020,
    field: 'Tolmount, UK North Sea',
    vessels: ['Topaz Tiamat'],
    image: { src: `${base}images/project-tolmount-pipelay.jpg`, alt: 'The pipelay vessel Castoro Sei at sea during the Tolmount pipeline installation', focalPoint: { x: 0.55, y: 0.5 } },
    url: '/projects/pipelay-installation-support/',
  },
  {
    slug: 'structure-inspection',
    title: 'IMR campaign on Trinidad’s north and east coast',
    service: 'subsea',
    work: 'IMR',
    year: 2020,
    field: 'Trinidad',
    vessels: ['Havila Subsea'],
    image: { src: `${base}images/project-trinidad-inspection.jpg`, alt: 'An offshore platform at sunset, seen from the helideck of Havila Subsea', focalPoint: { x: 0.6, y: 0.5 } },
    url: '/projects/structure-inspection/',
  },
  {
    slug: 'haven-jack-up-removal',
    title: 'Removing the Haven jack-up from Johan Sverdrup',
    service: 'subsea',
    work: 'Decommissioning',
    year: 2020,
    field: 'Johan Sverdrup, North Sea',
    vessels: ['Olympic Challenger', 'Topaz Tiamat'],
    image: { src: `${base}images/project-haven-removal.jpg`, alt: 'The Haven jack-up rig at sea with a Reach Subsea vessel alongside', focalPoint: { x: 0.4, y: 0.55 } },
    url: '/projects/haven-jack-up-removal/',
  },
  {
    slug: 'boulder-removal',
    title: 'Boulder removal at 350 m on Troll B',
    service: 'subsea',
    work: 'Seabed intervention',
    year: 2023,
    field: 'Troll B, North Sea',
    image: { src: `${base}images/project-troll-boulder.jpg`, alt: 'A ScanMachine dredging tool lifted over the side by a vessel crane', focalPoint: { x: 0.4, y: 0.5 } },
    url: '/projects/boulder-removal/',
  },
  {
    slug: 'suction-anchor-installation',
    title: 'Installing 14 suction anchors in the North and Norwegian Seas',
    service: 'subsea',
    work: 'Construction support',
    year: 2019,
    field: 'North Sea and Norwegian Sea',
    vessels: ['Havila Subsea', 'Topaz Tiamat'],
    image: { src: `${base}images/project-suction-anchors.jpg`, alt: 'Two yellow suction anchors on deck, with a crew member in red overalls', focalPoint: { x: 0.5, y: 0.6 } },
    url: '/projects/suction-anchor-installation/',
  },
  // Monitoring (6 Oct 2026): the dev site's real monitoring projects (PDF p13 names three; ASUMO has no
  // featured image on dev, so it borrows the gWatch ROV photo until Reach supplies one).
  {
    slug: 'gwatch-equinor-gas-fields',
    title: 'gWatch surveys at Equinor gas fields',
    service: 'monitoring',
    work: 'gWatch',
    year: 2023,
    field: 'Equinor gas fields, North Sea',
    image: { src: `${base}images/project-gwatch-equinor.jpg`, alt: 'Two engineers at the control room desk preparing for a gWatch campaign', focalPoint: { x: 0.5, y: 0.45 } },
    url: '/projects/reservoir-monitoring-surveys-using-gwatch-at-several-equinor-operated-gas-fields/',
  },
  {
    slug: 'depthwatch-shell-4d-seismic',
    title: 'DepthWatch for 4D seismic, with Shell',
    service: 'monitoring',
    work: 'DepthWatch',
    year: 2023,
    field: 'Shell',
    image: { src: `${base}images/project-depthwatch-shell.jpg`, alt: 'Engineers assembling a DepthWatch seabed unit in the workshop', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/projects/unlocking-enhanced-value-in-4d-seismic-with-reach-subseas-depthwatch-technology-insights-from-reach-subsea-and-shell/',
  },
  {
    slug: 'ormen-lange-gravimetry',
    title: 'Gravimetry milestone at Ormen Lange',
    service: 'monitoring',
    work: 'gWatch',
    year: 2023,
    field: 'Ormen Lange, Shell Norge',
    image: { src: `${base}images/project-ormen-lange.jpg`, alt: 'A gravimetry sensor on the seabed, lit by the ROV’s lamps', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/projects/reach-subsea-sets-a-new-milestone-for-accuracy-and-efficiency-of-gravimetry-surveys-with-shell-norge-at-ormen-lange-field/',
  },
  {
    slug: 'asumo',
    title: 'ASUMO marine-earth monitoring',
    service: 'monitoring',
    work: 'Research',
    year: 2023,
    field: 'With JAMSTEC and the University of Bergen',
    image: { src: `${base}images/rov-zeerov-gwatch.jpg`, alt: 'A gWatch seabed monitoring unit carried by an ROV', focalPoint: { x: 0.5, y: 0.5 } },
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
    image: { src: `${base}images/project-site-survey-norway.jpg`, alt: 'A white and black survey vessel under way on grey water, seen from above', focalPoint: { x: 0.5, y: 0.5 } },
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
    image: { src: `${base}images/project-pipeline-ormen-lange.jpg`, alt: 'The red and white vessel Siem Pride at anchor under a grey sky', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/projects/pipeline-inspection-campaign/',
  },
  {
    slug: 'geophysical-and-uxo-power-cable-route-survey',
    title: 'Cable-route survey to Seagreen Offshore Windfarm',
    service: 'survey',
    work: 'Cable route',
    field: 'Carnoustie to Seagreen, UK',
    image: { src: `${base}images/project-cable-route-seagreen.jpg`, alt: 'A sidescan sonar mosaic of the seabed, rippled sand with a cable corridor running across it', focalPoint: { x: 0.4, y: 0.5 } },
    url: '/projects/geophysical-and-uxo-power-cable-route-survey/',
  },
];

/** A service line's projects, newest first. */
export function projectsFor(service: ServiceId, limit?: number): ProjectRef[] {
  const list = projects.filter((p) => p.service === service).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  return limit ? list.slice(0, limit) : list;
}
