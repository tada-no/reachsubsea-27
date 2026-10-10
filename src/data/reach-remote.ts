// Reach Remote walk-around (Q165, Q167): the Model stage block's content for Reach Remote 1 & 2, shared by the page
// (/assets/reach-remote/) and the review page (/reach-remote-review/), so the tour is written once.
//
// Each chapter carries its camera key (`cam`: distance, elevation, azimuth in the launch's convention where 0 =
// starboard beam and +π/2 = ahead of the bow, the target on the hull in the holder's frame with the waterline at
// y = 0 and the bow at +X, and the composition shift), its text and spec rows, and its points: the brochure p7's
// labels as fact cards, each anchored to a place on the model. The last chapter is the launch scrubber, driven by
// the same scroll. In WordPress (`reach/model-stage`, docs/05 §2.32) editors own the copy, spec rows, card labels and
// stills; camera keys and anchors are developer presets per model, not editor fields.
//
// Sources: the brochure (ref/reach remote/REA25 2595 170 Reach Remote Brochure A5.pdf: p7 labels, p9 ROV and TMS,
// p11 main particulars), the Perth ROC brochure, the Q2 2026 report p17–25.

export interface TourPoint {
  id: string;
  /** The card's eyebrow (the feature) and its one short line (the fact) */
  label: string;
  line: string;
  /** Holder frame (x along the hull, bow +X; y above the waterline; z to starboard), or `tms` / `rov` for the launch's moving parts */
  anchor: [number, number, number] | 'tms' | 'rov';
  /** Label offset from the marker, px */
  dx?: number;
  dy?: number;
  /** The side the card prefers (it still moves when that side runs off the stage) */
  side?: 'left' | 'right';
}

export interface TourSpec {
  label: string;
  value: string;
  /** The point this row describes (a spec row under the pointer lights its marker only) */
  point?: string;
}

export interface TourChapter {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  /** dist, elev, az, tx, ty, tz, shift. The launch chapter has none: the launch's own camera takes over */
  cam?: [number, number, number, number, number, number, number];
  runs?: number;
  specs: TourSpec[];
  points: TourPoint[];
}

export interface TourDimension {
  id: string;
  /** The chapter (1-based) whose run draws it */
  chapter: number;
  order: number;
  label: string;
  /** Holder frame endpoints; the label sits at the midpoint */
  a: [number, number, number];
  b: [number, number, number];
}

/** The vessel in numbers (Ross, 10 Oct 2026: one short spec table, not eight groups): the brochure's key particulars
 *  (REA25 2595 170, A5, p3, p6, p9, p11). The finer detail rides on the model's fact cards and stays in the brochure. */
export const reachRemoteKeySpecs: TourSpec[] = [
  { label: 'Length', value: '23.9 m' },
  { label: 'Breadth', value: '8.0 m' },
  { label: 'Max speed', value: '11 knots' },
  { label: 'Endurance', value: 'Min. 30 days at sea' },
  { label: 'ROV', value: 'ZEEROV, 115 kW electric' },
  { label: 'ROV depth rating', value: '2,000 m' },
  { label: 'Hull survey depth', value: 'To 500 m' },
  { label: 'Autonomy', value: 'IMO degree three, no crew' },
];

/** Dimension lines drawn on the model at the deck chapter */
export const reachRemoteDims: TourDimension[] = [
  { id: 'length', chapter: 1, order: 0, label: '23.9 m', a: [-11.95, 0.3, -5.8], b: [11.95, 0.3, -5.8] },
  { id: 'breadth', chapter: 1, order: 1, label: '8.0 m', a: [7.5, 2.6, -4.3], b: [7.5, 2.6, 4.3] },
];

// Measured on the model (9 Oct 2026, holder frame): hull x −13.4 (stern) … +13.4 (bow); deckhouse roof 4.4 m above the
// waterline from x −5 to +6; foredeck and aft deck 2.0 m; the forward lattice mast with the radar at x ≈ 7.3 (9–10.3 m up);
// the satellite dome at x ≈ −5.5 (10.6 m up); the A-frame over the stern at x ≈ −6.5 (8.7 m up). Under the hull, from
// reach-remote-propulsion.js: thrusters at x +9.1 and −8.5 with hubs 0.85 m under the keel (keel −2.1); the gondola from
// x −4.35 to +4.15 with its pods 2.95 m under the keel and the profiler bar across its front at y −4.6.
export const reachRemoteChapters: TourChapter[] = [
  {
    id: 'deck',
    eyebrow: 'Deck, drone and tools',
    title: 'Drone and tools on deck',
    text: 'A drone on the foredeck, tool garages for the ROV’s skids, and a launch system rated for three-metre seas.',
    cam: [45, 0.55, 2.45, 3, 3, 0, 0.1],
    specs: [
      { label: 'Drone', value: 'Foredeck capacity', point: 'drone' },
      { label: 'Tool garages', value: 'Two, for mission skids' },
      { label: 'Launch system', value: '8.6 t lift, seas to 3 m' },
    ],
    points: [{ id: 'drone', label: 'Drone deck', line: 'Foredeck capacity for a drone', anchor: [9.5, 3.0, 0], dx: 28, dy: -32, side: 'left' }],
  },
  {
    id: 'connected',
    eyebrow: 'Communications and awareness',
    title: 'Always connected',
    text: 'Redundant carriers keep the vessel in touch, and radar, cameras and AIS give shore the bridge’s view.',
    cam: [40, 0.22, 2.97, 2, 7, 0, 0.08],
    specs: [
      { label: 'Carriers', value: 'VSAT, Starlink ×2, Iridium, MBR, 5G, Pointlink', point: 'dome' },
      { label: 'Awareness', value: 'Radar, PTZ camera, AIS', point: 'radar' },
      { label: 'Positioning', value: 'Dual Seapath 380, DPS i4' },
    ],
    points: [
      { id: 'dome', label: 'Satellite dome', line: 'VSAT, Starlink, Iridium, 5G', anchor: [-5.5, 10.6, 0], dx: 28, dy: -24 },
      { id: 'radar', label: 'Radar and antennas', line: 'Radar, PTZ camera, AIS', anchor: [7.3, 10.3, 0], dx: 28, dy: -24 },
    ],
  },
  {
    id: 'onboard',
    eyebrow: 'Run from shore',
    title: 'Nobody on board',
    text: 'The master, navigator, ROV pilots and surveyors work from remote operations centres in Haugesund and Perth.',
    cam: [52, 0.25, 3.58, 0, 3, 0, 0.14],
    specs: [
      { label: 'Run from', value: 'Control rooms in Haugesund and Perth', point: 'shore' },
      { label: 'Autonomy', value: 'IMO degree three' },
      { label: 'Class', value: 'AROS notation, a world first' },
    ],
    points: [
      { id: 'shore', label: 'Run from shore', line: 'Control rooms in Haugesund and Perth', anchor: [0, 4.6, -3.6], dx: 28, dy: -30 },
      { id: 'lars-1', label: 'Launch and recovery', line: '8.6 t lift, seas to 3 m', anchor: [-6.5, 8.5, 0], dx: 28, dy: -20 },
    ],
  },
  {
    id: 'power',
    eyebrow: 'Power and propulsion',
    title: 'Hybrid power',
    text: 'Batteries and variable-speed gensets drive two azimuth thrusters, on up to 90% less fuel than a crewed vessel.',
    cam: [50, -0.32, 3.87, 0, -2, 0, 0.14],
    specs: [
      { label: 'Batteries', value: '2 × 369 kWh' },
      { label: 'Gensets', value: '2 × 441 kW' },
      { label: 'Thrusters', value: '2 × 350 kW azimuth', point: 'thruster-fwd' },
    ],
    points: [
      { id: 'thruster-fwd', label: 'Azimuth thruster', line: '2 × 350 kW', anchor: [9.1, -2.95, 0], dx: 28, dy: 24 },
      { id: 'thruster-aft', label: 'Hybrid plant', line: '2 × 369 kWh, 2 × 441 kW', anchor: [-3, -1.6, -3.9], dx: 28, dy: -40 },
    ],
  },
  {
    id: 'sensors',
    eyebrow: 'Survey sensors under the hull',
    title: 'Sensors in the keel',
    text: 'Multibeam and sub-bottom sensors in the gondola map the seabed to 500\u00a0m with no ROV in the water.',
    cam: [27, -0.8, 4.4, 0, -3.5, 0, 0.1],
    specs: [
      { label: 'Multibeam', value: 'Dual EM2040', point: 'mbes' },
      { label: 'Sub-bottom', value: 'Topas PS120', point: 'sbp' },
      { label: 'Positioning', value: 'HiPAP 502' },
    ],
    points: [
      { id: 'mbes', label: 'Multibeam', line: 'Dual EM2040', anchor: [-0.1, -4.95, -2.45], dx: 28, dy: 24 },
      { id: 'sbp', label: 'Sub-bottom profiler', line: 'Topas PS120', anchor: [3.6, -4.6, 0], dx: 28, dy: -24 },
    ],
  },
  {
    id: 'launch',
    eyebrow: 'Through the moonpool',
    title: 'The ROV goes to work',
    text: 'The TMS and ZEEROV lower out through the hull, then the electric work-class ROV flies off on its tether.',
    runs: 2,
    specs: [
      { label: 'ROV', value: 'ZEEROV, 115 kW electric', point: 'rov' },
      { label: 'Depth rating', value: '2,000 m' },
      { label: 'Tether', value: '330 m from the E-TMS', point: 'tms' },
    ],
    points: [
      { id: 'tms', label: 'E-TMS', line: '330 m tether', anchor: 'tms', dx: 72, dy: -56 },
      { id: 'rov', label: 'ZEEROV', line: '115 kW electric, rated to 2,000 m', anchor: 'rov', dx: 80, dy: 64 },
    ],
  },
];
