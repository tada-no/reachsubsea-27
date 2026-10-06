// 3D World: the scene is a separate static app on its own host, with its content served from WordPress over an
// API (Q94, docs/09 §7.1). The scene URL is the published reach-world build (Ross, 21 Sep 2026), in development
// too, so nothing depends on a local server.
export const worldSceneUrl = 'https://tada-no.github.io/reach-world/';
// The scene opens in the site, under the header (Q96, 6 Oct 2026, like the dev site's Unity world today): every
// link into the world goes to /3d-world/explore/ (src/pages/3d-world/explore.astro), which frames the scene full
// height and passes `?zone=N` and `?careers=1` through. Only the in-place poster embeds load `worldSceneUrl` directly.
export const worldPath = '/3d-world/explore/';
export const worldLabel = 'Explore Reach in interactive 3D';
// Landing page (6 Oct 2026, client screens PDF p28–29): Home › Explore 3D World (Q108: it spans the service lines,
// the fleet and Careers, so it sits on its own rather than under Services). Site-wide entries (the Services menu
// strip, footer, overview links) go here; its Launch button and zone cards open the world.
export const worldPagePath = '/3d-world/';
// Careers route (20 Sep 2026, reach-world v45–v48): `?careers=1` opens the world's home panel on "From ship to
// seabed" (the five-stop route, and "Fly a survey line"). The Careers banner loads the scene with it in place, and
// its full-screen link opens the in-site page with it.
export const worldCareersUrl = `${worldSceneUrl}?careers=1`;
export const worldCareersPath = `${worldPath}?careers=1`;

/** Scene link for one zone, `?zone=1`–`4`. */
export const worldZoneUrl = (zone: number, url = worldSceneUrl) => `${url}${url.includes('?') ? '&' : '?'}zone=${zone}`;

export interface WorldZone {
  /** The world's own zone id (`ZONES` in reach-world). The WordPress `world_zone` slug (docs/09 §7.1). */
  slug: string;
  /** Query value, `?zone=1`–`4`, in the world's arrow order. */
  zone: number;
  /** The zone's own name in the world, not "Zone 1". */
  label: string;
  /** What happens in the zone, in the world's words. */
  blurb: string;
  /** Up to three of the assets visitors can click in the zone. */
  assets: string[];
  image: { src: string; alt: string };
}

// Names, order and assets from the 3D World build itself (reach-world `ZONES` and `HOTSPOTS` in
// reach-ocean-realism.html, v52). The blurbs are the world's own, marked DRAFT there, tightened for the page:
// Reach to confirm (client PDF p28 flagged its own zone copy as a first draft too). Images are stills from the
// world's films (reach-world film/out, 17 Sep 2026). In WordPress these are the `world_zone` posts.
export const worldZones: WorldZone[] = [
  {
    slug: 'pipelines',
    zone: 1,
    label: 'Subsea Infrastructure',
    blurb: 'A subsea template and its pipelines. A work-class ROV works at the template while a sensor-carrier ROV surveys the pipeline.',
    assets: ['Viking Vigor', 'Surveyor ROV', 'Supporter ROV'],
    image: { src: 'images/world-zone-1.jpg', alt: 'The Viking Vigor on station, with platforms and a wind turbine on the horizon' },
  },
  {
    slug: 'oilfield',
    zone: 2,
    label: 'Oil Field Operations',
    blurb: 'A steel jacket platform at the end of the pipeline. An uncrewed surface vessel flies an electric ROV at one of the jacket legs.',
    assets: ['Reach Remote 1', 'ZeeROV 1'],
    image: { src: 'images/world-zone-2.jpg', alt: 'A ZeeROV and its tether cage beside a leg of a steel jacket platform' },
  },
  {
    slug: 'wind',
    zone: 3,
    label: 'Offshore Wind & Renewables',
    blurb: 'Floating wind turbines moored to the seabed. An electric ROV inspects a mooring line while the DriX maps the seabed.',
    assets: ['DriX', 'Reach Remote 2', 'ZeeROV 2'],
    image: { src: 'images/world-zone-3.jpg', alt: 'Floating wind turbines on a calm sea, with a support vessel in the distance' },
  },
  {
    slug: 'reservoir',
    zone: 4,
    label: 'Subsea Production & Monitoring',
    blurb: 'A second subsea template, with the seabed cut away to show the wells running down to the gas reservoir and the monitoring above it.',
    assets: ['ZeeROV gWatch', 'Supporter Dragonet', 'Reach Remote 3'],
    image: { src: 'images/world-zone-4.jpg', alt: 'A cutaway of the seabed showing the gas reservoir below a subsea template' },
  },
];
