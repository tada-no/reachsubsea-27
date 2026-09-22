// Dot-matrix map, browser side (22 Sep 2026, extracted from LiveOperations.astro for the Contact
// page's Offices map). One module drives every DotMap figure: MapLibre GL for the camera, gestures
// and clustering (no tiles, no land layer), a canvas overlay that draws the brand dot grid from the
// land mask, HTML markers (so their pulse and ring are plain CSS), the zoom pill, and reduced motion.
//
// The block owns the content (its list) and the meaning of a point; this module only knows points
// with an id, a name and a count. It reports clicks and hovers back through callbacks, and the block
// drives it through the handle (refresh after a filter, flyTo when a row opens, setActive/setHover).
//
// Land: a hex grid FIXED TO THE SCREEN; each grid point is unprojected to Mercator and looked up in
// the land mask, so a dot is drawn whole or not at all (docs/07 §3 "Dots and poster"). The static
// poster in DotMap.astro is the same grid against the same mask in the same framing box, so the fade
// from poster to live map shows no jump.
//
// WordPress: ships as is (with maplibre-gl); production can swap to mapbox-gl and the dev site's
// style (docs/07 §3). Prototype-only: the worker is bundled with `?worker&url` because Vite's
// dependency pre-bundling breaks MapLibre's own worker path.
import type { GeoJSONSource, LngLatLike, Map as GLMap, Marker } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { DOT_PRESETS, FRAMES, MASK_H, MASK_W, cameraFor, colsFor, frameBox, frameFor, gridPoints, maskIndex, mercX, mercY, type DotPreset } from './dot-map';

export interface DotMapPoint {
  id: string;
  name: string;
  lon: number;
  lat: number;
  /** What the marker counts (assets in a region, 1 per office). Clusters add these up. */
  count?: number;
  /** A quieter marker (a place without a card): hollow dot, counts 0 in clusters. */
  quiet?: boolean;
}

export interface DotMapOptions {
  /** Element holding the [data-map-zoom-in] / [data-map-zoom-out] buttons (DotMapZoom). */
  controls?: HTMLElement | null;
  /** Zoom cap: region level (5) for Live operations, city level for offices. */
  maxZoom?: number;
  /** Zoom used by flyTo (a point with context around it). */
  focusZoom?: number;
  /** fitTo never zooms closer than this. */
  fitMaxZoom?: number;
  /** Clusters split from this zoom up. */
  clusterMaxZoom?: number;
  clusterRadius?: number;
  /** Show the count in every marker, in clusters only, or never. */
  showCount?: 'always' | 'clusters' | 'never';
  /** A cluster click zooms one step, to where the cluster splits (`expand`, Live operations), or fits
   * every member of the cluster in view (`fit`, Offices map: one click opens Norway up to its offices). */
  clusterClick?: 'expand' | 'fit';
  /** Cluster label ("3 regions", "5 offices"). `points` = markers inside, `count` = their counts summed. */
  clusterLabel?: (points: number, count: number) => string;
  /** Live count per point (a filter can change it; 0 hides the marker). Defaults to the point's `count`. */
  countOf?: (id: string) => number;
  /** A single marker was clicked. */
  onSelect?: (id: string) => void;
  /** The pointer entered (on) or left a marker; clusters report all their members. */
  onHover?: (ids: string[], on: boolean) => void;
  announce?: (text: string) => void;
  /** The view settled: `home` is true at the framed home view (zoomed all the way out). */
  onView?: (home: boolean) => void;
  /** Load when the figure nears the viewport (default) or only on `load()`. */
  autoload?: boolean;
}

export interface DotMapHandle {
  /** Load MapLibre, the mask and the map (idempotent). */
  load(): Promise<void>;
  /** Rebuild the markers after the counts changed (a filter). */
  refresh(): void;
  /** Back to the framed home view. */
  fitHome(): void;
  /** Frame these points. */
  fitTo(ids: string[]): void;
  /** Centre on one point at `focusZoom`. */
  flyTo(id: string): void;
  setActive(id: string | null): void;
  setHover(ids: string[]): void;
  /** Pin `el` (a card the block rendered, `hidden` until now) to a point, above its marker. One at a time. */
  showOverlay(id: string, el: HTMLElement): void;
  hideOverlay(): void;
  readonly map: GLMap | undefined;
}

const MASK_URL = `${import.meta.env.BASE_URL}data/land-mask.png`;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** The land mask, one byte per pixel, shared by every map on the page. */
let maskPromise: Promise<Uint8Array> | undefined;
function loadMask() {
  maskPromise ??= (async () => {
    const img = new Image();
    img.src = MASK_URL;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = MASK_W;
    c.height = MASK_H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, MASK_W, MASK_H);
    const { data } = ctx.getImageData(0, 0, MASK_W, MASK_H);
    const bits = new Uint8Array(MASK_W * MASK_H);
    for (let i = 0; i < bits.length; i++) bits[i] = data[i * 4] > 127 ? 1 : 0;
    return bits;
  })();
  return maskPromise;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/**
 * Drive one DotMap figure (`.dot-map`, from DotMap.astro). Points come from the figure's own JSON
 * (`[data-dot-map-points]`). Without a canvas container (poster-only figures) nothing loads and
 * every method is a no-op.
 */
export function createDotMap(figure: HTMLElement, options: DotMapOptions = {}): DotMapHandle {
  const {
    controls,
    maxZoom = 5,
    focusZoom = 3.5,
    fitMaxZoom = 3.5,
    clusterMaxZoom = 2,
    clusterRadius = 48,
    clusterClick = 'expand',
    showCount = 'always',
    clusterLabel = (n) => `${n} places`,
    countOf,
    onSelect,
    onHover,
    announce,
    onView,
    autoload = true,
  } = options;
  const say = (text: string) => announce?.(text);

  const canvas = figure.querySelector<HTMLElement>('[data-dot-map-canvas]');
  const points: DotMapPoint[] = JSON.parse(figure.querySelector('[data-dot-map-points]')?.textContent ?? '[]');
  const pointFor = (id: string) => points.find((p) => p.id === id);
  const count = (p: DotMapPoint) => (countOf ? countOf(p.id) : (p.count ?? 1));
  const preset: DotPreset = (figure.dataset.dots as DotPreset) in DOT_PRESETS ? (figure.dataset.dots as DotPreset) : 'regular';

  let map: GLMap | undefined;
  let ml: typeof import('maplibre-gl') | undefined;
  let overlay: Marker | undefined;
  /** Where the overlay element came from: MapLibre moves it into the map, and remove() detaches it. */
  let overlayHome: HTMLElement | null = null;
  let activeId: string | null = null;
  let hoverIds: string[] = [];
  let paintAll = () => {};
  let refreshMarkers = () => {};

  const featureCollection = () => ({
    type: 'FeatureCollection' as const,
    features: points
      .filter((p) => count(p) > 0)
      .map((p) => ({
        type: 'Feature' as const,
        // Quiet points count 0 in a cluster: "5 offices" stays true when a presence place joins it
        properties: { id: p.id, name: p.name, count: p.quiet ? 0 : count(p), quiet: Boolean(p.quiet) },
        geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] },
      })),
  });

  /** The home view for the map's current size: the frame box as a MapLibre camera. */
  const homeCamera = () => cameraFor(frameBox(FRAMES[frameFor(figure.clientWidth, figure.clientHeight)]), figure.clientWidth);

  async function load() {
    if (!canvas || map) return;
    const [lib, bits] = await Promise.all([import('maplibre-gl'), loadMask(), import('maplibre-gl/dist/maplibre-gl.css')]);
    ml = lib;
    ml.setWorkerUrl(workerUrl);
    const css = getComputedStyle(figure);
    const token = (name: string) => css.getPropertyValue(name).trim();

    map = new ml.Map({
      container: canvas,
      style: {
        version: 8,
        sources: {
          points: {
            type: 'geojson',
            data: featureCollection(),
            cluster: true,
            clusterRadius,
            clusterMaxZoom,
            clusterProperties: { count: ['+', ['get', 'count']] },
          },
        },
        layers: [
          // Markers are HTML; this invisible layer only makes the clustered source load and be queryable
          { id: 'points-query', type: 'circle', source: 'points', paint: { 'circle-radius': 1, 'circle-opacity': 0 } },
        ],
      },
      ...homeCamera(),
      maxZoom,
      renderWorldCopies: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      cooperativeGestures: true,
      attributionControl: false,
      fadeDuration: reduceMotion.matches ? 0 : 300,
    });
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();
    const m = map;

    // ── Dot-matrix land: a canvas overlay, redrawn every frame ─────────────────
    const overlay = document.createElement('canvas');
    overlay.className = 'dot-map__dots';
    overlay.setAttribute('aria-hidden', 'true');
    m.getCanvasContainer().appendChild(overlay);
    const ctx = overlay.getContext('2d')!;

    function drawDots() {
      const w = figure.clientWidth;
      const h = figure.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      if (overlay.width !== Math.round(w * dpr) || overlay.height !== Math.round(h * dpr)) {
        overlay.width = Math.round(w * dpr);
        overlay.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // No rotation or pitch, so screen → Mercator is linear: two corners are enough
      const tl = m.unproject([0, 0]);
      const br = m.unproject([w, h]);
      const x0 = mercX(tl.lng);
      const y0 = mercY(tl.lat);
      const sx = (mercX(br.lng) - x0) / w;
      const sy = (mercY(br.lat) - y0) / h;
      const spec = DOT_PRESETS[preset];
      const cols = colsFor(spec, frameFor(w, h), w);
      const r = ((w / cols) * spec.dot) / 2;
      ctx.fillStyle = token('--map-dot');
      ctx.beginPath();
      for (const [gx, gy] of gridPoints(w, h, cols)) {
        const i = maskIndex(x0 + gx * sx, y0 + gy * sy);
        if (i >= 0 && bits[i]) {
          ctx.moveTo(gx + r, gy);
          ctx.arc(gx, gy, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }
    m.on('render', drawDots);
    m.on('load', () => {
      drawDots();
      figure.classList.add('is-ready');
    });

    // ── Zoom buttons ───────────────────────────────────────────────────────────
    const zoomIn = controls?.querySelector<HTMLButtonElement>('[data-map-zoom-in]');
    const zoomOut = controls?.querySelector<HTMLButtonElement>('[data-map-zoom-out]');
    function syncZoomButtons() {
      if (zoomIn) zoomIn.disabled = m.getZoom() >= maxZoom - 0.01;
      if (zoomOut) zoomOut.disabled = m.getZoom() <= m.getMinZoom() + 0.01;
    }
    // The home view is as far out as it goes, so "Zoom out" is disabled there on every screen size.
    // The map's size sets that zoom, so it follows resizes (and the wide ↔ tall frame switch).
    const syncMinZoom = () => m.setMinZoom(homeCamera().zoom);
    m.once('load', () => {
      syncMinZoom();
      syncZoomButtons();
    });
    m.on('resize', () => {
      syncMinZoom();
      drawDots();
      syncZoomButtons();
    });
    m.on('moveend', () => {
      syncZoomButtons();
      onView?.(m.getZoom() <= m.getMinZoom() + 0.01);
    });
    zoomIn?.addEventListener('click', () => m.zoomIn({ animate: !reduceMotion.matches }));
    zoomOut?.addEventListener('click', () => m.zoomOut({ animate: !reduceMotion.matches }));

    // ── HTML markers from the clustered source ─────────────────────────────────
    const markers = new Map<string, Marker>();
    let onScreen = new Map<string, Marker>();

    function markerEl(key: string, label: string, n: number, cluster: boolean, quiet: boolean) {
      const el = document.createElement('div');
      el.className = `dot-map__marker${cluster ? ' dot-map__marker--cluster' : ''}${quiet ? ' dot-map__marker--quiet' : ''}`;
      el.dataset.key = key;
      el.setAttribute('aria-hidden', 'true');
      const showN = showCount === 'always' || (showCount === 'clusters' && cluster);
      el.innerHTML = `
        <span class="dot-map__marker-pulse"></span>
        ${cluster ? '<span class="dot-map__marker-ring"></span>' : ''}
        <span class="dot-map__marker-dot">${showN ? n : ''}</span>
        <span class="dot-map__marker-label">${esc(label)}</span>`;
      return el;
    }

    refreshMarkers = () => {
      markers.forEach((mk) => drop(mk));
      markers.clear();
      onScreen = new Map();
      (m.getSource('points') as GeoJSONSource | undefined)?.setData(featureCollection());
    };

    // The marker under the pointer. A marker can vanish while hovered (a cluster splits when it is
    // clicked, a filter hides it), and then its pointerleave never fires: release the hover here.
    let hovered: HTMLElement | null = null;
    const enter = (el: HTMLElement, list: string[]) => ((hovered = el), onHover?.(list, true));
    const leave = (el: HTMLElement, list: string[]) => {
      if (hovered === el) hovered = null;
      onHover?.(list, false);
    };
    const drop = (mk: Marker) => {
      const el = mk.getElement();
      if (hovered === el) leave(el, el.classList.contains('dot-map__marker--cluster') ? ids(el) : [el.dataset.key!]);
      mk.remove();
    };

    function updateMarkers() {
      const source = m.getSource('points') as GeoJSONSource | undefined;
      if (!source || !m.isSourceLoaded('points')) return;
      const next = new Map<string, Marker>();
      const width = canvas!.clientWidth;
      const placed: { el: HTMLElement; x: number }[] = [];
      for (const f of m.querySourceFeatures('points')) {
        const p = f.properties as Record<string, unknown>;
        const cluster = Boolean(p.cluster);
        const key = cluster ? `c${p.cluster_id}` : String(p.id);
        if (next.has(key)) continue;
        let mk = markers.get(key);
        if (!mk) {
          const members = Number(p.point_count ?? 1);
          const n = Number(p.count) || members;
          const el = markerEl(key, cluster ? clusterLabel(members, n) : String(p.name), n, cluster, Boolean(p.quiet));
          const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number];
          mk = new lib.Marker({ element: el }).setLngLat(coords);
          if (cluster) {
            const clusterId = Number(p.cluster_id);
            source.getClusterLeaves(clusterId, Infinity, 0).then((leaves) => {
              el.dataset.ids = leaves.map((l) => String(l.properties?.id)).join(' ');
              paint(el);
            });
            el.addEventListener('click', async () => {
              const zoom = Math.min(maxZoom, (await source.getClusterExpansionZoom(clusterId)) + 0.5);
              const duration = reduceMotion.matches ? 0 : 700;
              // Fit the members when that gets at least as close as the split; otherwise just split
              const fit = clusterClick === 'fit' ? boundsCamera(ids(el)) : undefined;
              if (fit && fit.zoom >= zoom) m.easeTo({ ...fit, duration });
              else m.easeTo({ center: coords, zoom, duration });
              say(`Map zoomed in to ${clusterLabel(members, n)}`);
            });
            el.addEventListener('pointerenter', () => enter(el, ids(el)));
            el.addEventListener('pointerleave', () => leave(el, ids(el)));
          } else {
            const id = String(p.id);
            el.addEventListener('click', () => onSelect?.(id));
            el.addEventListener('pointerenter', () => enter(el, [id]));
            el.addEventListener('pointerleave', () => leave(el, [id]));
          }
          markers.set(key, mk);
        }
        next.set(key, mk);
        if (!onScreen.has(key)) mk.addTo(m);
        placed.push({ el: mk.getElement(), x: m.project(mk.getLngLat()).x });
        paint(mk.getElement());
      }
      // Labels point away from the middle of the visible markers, so neighbours' labels don't cross
      // each other's markers; near an edge they point inwards
      const mid = placed.length > 1 ? placed.reduce((sum, p) => sum + p.x, 0) / placed.length : width / 2;
      placed.forEach(({ el, x }) => {
        const left = x < 170 ? false : x > width - 170 ? true : x < mid;
        el.classList.toggle('is-label-left', left);
      });
      onScreen.forEach((mk, key) => !next.has(key) && drop(mk));
      onScreen = next;
      // Once clusters have split, every marker carries its name
      figure.classList.toggle('is-detail', m.getZoom() > clusterMaxZoom + 0.25);
    }

    const ids = (el: HTMLElement) => (el.dataset.ids ?? el.dataset.key ?? '').split(' ').filter(Boolean);
    function paint(el: HTMLElement) {
      const members = el.classList.contains('dot-map__marker--cluster') ? ids(el) : [el.dataset.key!];
      el.classList.toggle('is-active', activeId !== null && members.includes(activeId));
      el.classList.toggle('is-hover', members.some((id) => hoverIds.includes(id)));
    }
    paintAll = () => onScreen.forEach((mk) => paint(mk.getElement()));

    m.on('render', updateMarkers);
  }

  if (canvas && autoload) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load().catch((err) => console.error('Dot map failed to load', err));
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(figure);
  }

  /** Camera that shows every listed point. Padding keeps markers and labels clear of the edges;
   * fitMaxZoom keeps one point at its level, not a close-up. Undefined when nothing is listed. */
  function boundsCamera(idList: string[]): { center: LngLatLike; zoom: number } | undefined {
    if (!map) return undefined;
    const shown = idList.map(pointFor).filter((p): p is DotMapPoint => Boolean(p));
    if (shown.length === 0) return undefined;
    const lons = shown.map((p) => p.lon);
    const lats = shown.map((p) => p.lat);
    const camera = map.cameraForBounds(
      [
        [Math.min(...lons), Math.min(...lats)],
        [Math.max(...lons), Math.max(...lats)],
      ],
      { padding: { top: 72, bottom: 56, left: 72, right: 96 }, maxZoom: fitMaxZoom },
    );
    return camera ? { center: camera.center as LngLatLike, zoom: camera.zoom ?? fitMaxZoom } : undefined;
  }

  const handle: DotMapHandle = {
    load,
    refresh: () => refreshMarkers(),
    fitHome() {
      map?.easeTo({ ...homeCamera(), animate: !reduceMotion.matches, duration: 900 });
    },
    fitTo(idList) {
      if (!map) return;
      const camera = boundsCamera(idList);
      if (!camera) return handle.fitHome();
      map.easeTo({ ...camera, animate: !reduceMotion.matches, duration: 900 });
    },
    flyTo(id) {
      const pt = pointFor(id);
      if (!map || !pt) return;
      const camera = { center: [pt.lon, pt.lat] as [number, number], zoom: focusZoom };
      if (reduceMotion.matches) map.jumpTo(camera);
      else map.flyTo({ ...camera, duration: 900 });
    },
    setActive(id) {
      activeId = id;
      figure.classList.toggle('has-selection', id !== null);
      paintAll();
    },
    setHover(idList) {
      hoverIds = idList;
      paintAll();
    },
    showOverlay(id, el) {
      const pt = pointFor(id);
      if (!map || !ml || !pt) return;
      handle.hideOverlay();
      overlayHome = el.parentElement;
      el.hidden = false;
      // Bottom-anchored just above the 26px marker; added last, so it sits over the other markers
      overlay = new ml.Marker({ element: el, anchor: 'bottom', offset: [0, -22] }).setLngLat([pt.lon, pt.lat]).addTo(map);
      // Pan so the card stays inside the map when its point sits near an edge (the figure clips)
      const edge = 16;
      const at = map.project([pt.lon, pt.lat]);
      const w = el.offsetWidth;
      const h = el.offsetHeight + 22 + edge;
      const dx = Math.max(0, w / 2 + edge - at.x) - Math.max(0, at.x + w / 2 + edge - map.getContainer().clientWidth);
      const dy = Math.max(0, h - at.y);
      if (dx || dy) map.panBy([-dx, -dy], { duration: reduceMotion.matches ? 0 : 400 });
    },
    hideOverlay() {
      if (!overlay) return;
      const el = overlay.getElement();
      overlay.remove();
      overlayHome?.appendChild(el);
      el.hidden = true;
      overlay = undefined;
    },
    get map() {
      return map;
    },
  };
  (figure as HTMLElement & { dotMap?: DotMapHandle }).dotMap = handle;
  return handle;
}
