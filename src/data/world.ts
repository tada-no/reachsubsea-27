// 3D World (17 Sep 2026): lives inside the site at /3d-world/, under the header, not as an external
// link. The scene itself is the reach-world build: the local dev server while developing, the
// published GitHub Pages build otherwise. `?zone=N` on the page is passed through to the scene.
export const worldPath = '/3d-world/';
export const worldSceneUrl = import.meta.env.DEV
  ? 'http://localhost:8765/reach-ocean-realism.html'
  : 'https://tada-no.github.io/reach-world/';
export const worldLabel = 'Explore Reach in interactive 3D';
