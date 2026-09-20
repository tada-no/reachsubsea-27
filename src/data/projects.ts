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
  year: number;
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
];

/** A service line's projects, newest first. */
export function projectsFor(service: ServiceId, limit?: number): ProjectRef[] {
  const list = projects.filter((p) => p.service === service).sort((a, b) => b.year - a.year);
  return limit ? list.slice(0, limit) : list;
}
