// 3D World: every link and embed points at the published reach-world build (Ross, 21 Sep 2026), in
// development too, so nothing depends on a local server. `?zone=N` and `?careers=1` are passed through
// to it. The in-site /3d-world/ page (src/pages/3d-world.astro) still exists but nothing links to it.
export const worldSceneUrl = 'https://tada-no.github.io/reach-world/';
export const worldPath = worldSceneUrl;
export const worldLabel = 'Explore Reach in interactive 3D';
// Careers route (20 Sep 2026, reach-world v45–v48): `?careers=1` opens the world's home panel on "From ship to
// seabed" (the five-stop route, and "Fly a survey line"). Linked from the Careers page banner. Until the scene
// with the route is published, the GitHub Pages build ignores the parameter and opens the ordinary world.
export const worldCareersUrl = `${worldSceneUrl}?careers=1`;
