// 3D World (17 Sep 2026): meant to live inside the site at /3d-world/, under the header, once that
// page is built. Until then, "Open full screen" and the zone links go straight to the published
// scene so they don't 404. The embedded scene itself is the reach-world build: the local dev server
// while developing, the published GitHub Pages build otherwise. `?zone=N` is passed through to it.
export const worldSceneUrl = import.meta.env.DEV
  ? 'http://localhost:8765/reach-ocean-realism.html'
  : 'https://tada-no.github.io/reach-world/';
export const worldPath = worldSceneUrl;
export const worldLabel = 'Explore Reach in interactive 3D';
