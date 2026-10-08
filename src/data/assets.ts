// Assets (3 Oct 2026, Assets overview, Q77). One source for the fleet: the overview's Fleet at a glance
// figures, the vessel cards, the uncrewed bento and the ROV cards all read from here, and the sibling
// listings and asset singles will too. Every value is quoted from one of the two sites or the client PDF,
// cited per entry in `source`; nothing is rounded or invented. Where a dev page's prose and spec table
// disagree, the spec table wins (Q77). The 24 Sep 2026 news post's "fifteen ROVs and four uncrewed surface
// vessels" is the fleet-wide figure; the per-vessel ROV breakdown on the dev pages does not reconcile with
// it, so ROV classes carry no unit counts (the 15 comes from key-figures.ts, `rov-systems`).
//
// WP proposal (Asset post type, dev `assets`, hierarchical off): `type` taxonomy (vessel · usv · rov ·
// equipment), `status` select (in-service · newbuild · sale-agreed · sold), `kind` (the dev subtitle),
// `summary` (excerpt), `units` (number, for Reach Remote and DriX pairs), `owner`, `charter` (period text,
// shown on the Investors charter page, not on asset cards), `joining` (quarter or year, newbuilds), spec
// group (crane, pax, deck, length, draft, beam, speed, endurance, power, depth, payload, weight, dimensions),
// `rovs` (relationship to ROV assets, with a count, replacing the dev "ROVs onboard" card), `specSheet`
// (file), `related` (projects and services, both missing on dev). Fleet counts are derived from the posts
// (`fleetCounts` below), never typed twice.
//
// Sources: Q2 2026 report = ref/REA26 2842 130 Q2 Report 2026 digital v3.pdf p13–16 ("Status of vessels and assets",
// the newest client source, 4 Oct 2026: it wins where the sites differ); DEV = reachsubseadev.wpenginepowered.com/assets/<slug>/ (spec tables, 3 Oct 2026);
// LIVE = reachsubsea.no/assets/<slug>/; PDF = client Design Reference p19–22 (Assets & Fleet) and p42
// (Charter agreement overview), both cited to the 2Q 2026 report; NEWS = reachsubsea.no news post (date).
import type { ImageField, LinkField } from '../lib/types';

export type AssetType = 'vessel' | 'usv' | 'rov' | 'equipment';
export type AssetStatus = 'in-service' | 'newbuild' | 'sale-agreed';

export interface AssetSpecs {
  crane?: string;
  pax?: string;
  deck?: string;
  length?: string;
  draft?: string;
  beam?: string;
  speed?: string;
  endurance?: string;
  tonnage?: string;
  power?: string;
  depth?: string;
  payload?: string;
  weight?: string;
  dimensions?: string;
}

export interface Asset {
  slug: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  /** Number of physical units this entry stands for (Reach Remote 1 & 2 = 2). Default 1. */
  units?: number;
  /** One name per unit when `units` > 1 (the Fleet at a glance markers). */
  unitNames?: string[];
  /** The dev subtitle: "IMR & Light Construction Vessel", "Heavy duty ROV". */
  kind: string;
  /** Card kicker, short enough for one line in a four-across row ("IMR & construction"). */
  kindShort?: string;
  /** One short line for cards. */
  summary: string;
  owner?: string;
  /** Published charter period, verbatim (dev). Shown on the Investors charter page only. */
  charter?: string;
  /** Newbuilds: when the unit joins the fleet, verbatim from the source. */
  joining?: string;
  specs: AssetSpecs;
  /** ROVs carried, from the Q2 2026 report's "Assets" row (the dev spec table matches). */
  rovs?: string[];
  /** Omit `src` for the media-library placeholder (no approved photo yet). */
  image: ImageField;
  /** Spec sheet or brochure, only where the file exists on the live site. */
  specSheet?: LinkField;
  /** The dev single's URL, for the redirect map only: vessels and ROVs have no page of their own on the new
   * site (Ross, 4 Oct 2026). The card is the record, as in the Q2 report's "Status of vessels and assets". */
  url: string;
  source: string;
  /** Anything the client must confirm before launch. */
  note?: string;
}

const base = import.meta.env.BASE_URL;
const files = 'https://reachsubsea.no/wp-content/uploads';

export const assets: Asset[] = [
  // ── Vessels, in service (dev hub order) ─────────────────────────────────────
  {
    slug: 'deep-cygnus',
    name: 'Deep Cygnus',
    type: 'vessel',
    status: 'in-service',
    kind: 'Construction vessel',
    kindShort: 'Construction',
    summary: 'Subsea construction, IMR and walk-to-work vessel with a long track record in renewables.',
    owner: 'Volstad Maritime AS',
    charter: 'April 2022 – April 2027. 1 year option.',
    specs: { crane: '150 t', pax: '92', deck: '1,400 m²' },
    rovs: ['1 Supporter WROV'],
    image: { src: `${base}images/vessel-deep-cygnus.jpg`, alt: 'Deep Cygnus, a red construction vessel, seen from above in open sea', focalPoint: { x: 0.62, y: 0.5 } },
    url: '/assets/deep-cygnus/',
    source: 'DEV spec table and intro (crane 150 ton, 92 PAX, 1400m2 deck); the intro also names a Constructor ROV that the table does not list.',
  },
  {
    slug: 'northern-maria',
    name: 'Northern Maria',
    type: 'vessel',
    status: 'in-service',
    kind: 'Survey & IMR vessel',
    kindShort: 'Survey & IMR',
    summary: 'DP2 survey and ROV vessel with hull-mounted multibeam and sub-bottom profiler, plus towed sonar and UXO equipment.',
    owner: 'Northern Survey ApS',
    charter: 'April 2023 – April 2027. 2x 6 months option.',
    specs: { crane: '20 t', pax: '47', deck: '492 m²' },
    image: { src: `${base}images/vessel-northern-maria.jpg`, alt: 'Northern Maria, a red survey vessel, under way on calm water', focalPoint: { x: 0.6, y: 0.5 } },
    url: '/assets/northern-maria/',
    source: 'DEV spec table and intro (20 ton crane, 47 PAX, 492 m2 deck, EM 2040 MBE, Innomar SBP).',
  },
  {
    slug: 'offshore-surveyor',
    name: 'Offshore Surveyor',
    type: 'vessel',
    status: 'in-service',
    kind: 'Survey vessel',
    kindShort: 'Survey',
    summary: 'Multipurpose survey vessel with a 2 m draft for nearshore work, a moonpool and an A-frame.',
    owner: 'Guardian Offshore AU',
    charter: 'June 2024 – June 2027. 1 year option + 6 months option.',
    specs: { draft: '2 m' },
    image: { src: `${base}images/vessel-offshore-surveyor.jpg`, alt: 'Offshore Surveyor, a red and white survey vessel, seen from above', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/assets/offshore-surveyor/',
    source: 'DEV spec table and intro; LIVE hero photo. The table says Crane "None" while the intro says "moonpool, crane and A-frame", so no crane figure is shown.',
    note: 'Crane: confirm with Reach (table and intro disagree).',
  },
  {
    slug: 'olympic-taurus',
    name: 'Olympic Taurus',
    type: 'vessel',
    status: 'in-service',
    kind: 'IMR & light construction vessel',
    kindShort: 'IMR & construction',
    summary: 'Diesel-electric multipurpose vessel with a helideck, low fuel consumption and two Constructor work-class ROVs.',
    owner: 'Olympic Subsea ASA',
    charter: 'April 2024 – April 2027. 1-year option.',
    specs: { crane: '150 t' },
    rovs: ['2 Constructor WROV'],
    image: { src: `${base}images/vessel-olympic-taurus.jpg`, alt: 'Olympic Taurus, an offshore vessel with a large crane and helideck, at sea', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/assets/olympic-taurus/',
    source: 'Q2 2026 report p14 (charter April 2024 – April 2027, 1-year option; 150 ton; 2 x WROV Constructors); DEV intro. Photo is the dev hero (800 px).',
    note: 'The dev page still shows the old charter period (to April 2026). A larger photo is needed.',
  },
  {
    slug: 'go-electra',
    name: 'Go Electra',
    type: 'vessel',
    status: 'in-service',
    kind: 'Survey, IMR & light construction vessel',
    kindShort: 'Survey, IMR & construction',
    summary: 'Survey, IMR and light construction vessel with a dual WROV hangar and an observation ROV system.',
    owner: 'Go Offshore Pty Ltd',
    charter: 'March 2023 – March 2027. 2x 1 year option.',
    specs: { crane: '25 t', pax: '66', deck: '500 m²' },
    rovs: ['1 Supporter WROV'],
    image: { src: `${base}images/vessel-go-electra.jpg`, alt: 'Go Electra, a blue offshore vessel with Reach Subsea markings, alongside a quay', focalPoint: { x: 0.45, y: 0.5 } },
    url: '/assets/go-electra/',
    source: 'DEV spec table and intro (25t AHC crane, 500m2 deck, 66 PAX); DEV hero photo.',
  },
  {
    slug: 'olympic-triton',
    name: 'Olympic Triton',
    type: 'vessel',
    status: 'in-service',
    kind: 'IMR & light construction vessel',
    kindShort: 'IMR & construction',
    summary: 'Subsea construction, IMR and walk-to-work vessel with a dual WROV hangar and a long track record in renewables.',
    owner: 'Olympic Subsea ASA',
    charter: 'February 2023 – February 2027. 1 year option.',
    specs: { crane: '150 t', pax: '100', deck: '940 m²' },
    rovs: ['2 Constructor WROV'],
    image: { src: `${base}images/vessel-olympic-triton.jpg`, alt: 'Olympic Triton, a dark-hulled construction vessel with a helideck, at sea', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/assets/olympic-triton/',
    source: 'DEV spec table and intro (150t AHC crane, 940m2 deck, 100 PAX); the "ROVs onboard" card lists Constructor x2.',
  },
  {
    slug: 'havila-subsea',
    name: 'Havila Subsea',
    type: 'vessel',
    status: 'in-service',
    kind: 'Survey, IMR & light construction vessel',
    kindShort: 'Survey, IMR & construction',
    summary: 'DP2 IMR and light construction vessel, chartered since 2017, with two ROV handling systems in an enclosed hangar.',
    owner: 'Havila Shipping ASA',
    charter: 'June 2024 – June 2027. 2x 1 year option.',
    specs: { crane: '150 t', pax: '78', deck: '600 m²', length: '98 m' },
    rovs: ['2 Schilling HD WROV', '1 Surveyor Interceptor ROV'],
    image: { src: `${base}images/asset-havila-subsea.jpg`, alt: 'Havila Subsea, a green-hulled DP2 subsea vessel, at sea', focalPoint: { x: 0.45, y: 0.5 } },
    specSheet: { label: 'Spec sheet (PDF)', url: `${files}/2023/03/Havila-Subsea-data-sheet.pdf`, action: 'file', context: 'Havila Subsea' },
    url: '/assets/havila-subsea/',
    source: 'Q2 2026 report p13 (charter, owner, 150 ton, 2 x Schilling HD WROV, 1 Surveyor Interceptor ROV); DEV intro (approx. 600 m2 deck, 78 persons); LIVE spec table (LOA 98.00 m).',
  },
  {
    slug: 'viking-reach',
    name: 'Viking Reach',
    type: 'vessel',
    status: 'sale-agreed',
    kind: 'Survey, IMR & light construction vessel',
    kindShort: 'Survey, IMR & construction',
    summary: 'Survey, IMR and light construction vessel carrying a Supporter WROV and a Surveyor Interceptor survey ROV.',
    owner: 'Eidesvik Offshore ASA (50.1 %) / Reach Subsea ASA (49.9 %)',
    charter: 'April 2023 – April 2029. 3 year option.',
    specs: { crane: '70 t', pax: '72', deck: '650 m²' },
    rovs: ['1 Supporter WROV', '1 Surveyor Interceptor'],
    image: { src: `${base}images/vessel-viking-reach.jpg`, alt: 'Viking Reach, a red offshore vessel with a helideck, leaving a Norwegian harbour', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/assets/viking-reach-2/',
    source: 'DEV spec table and intro (70t AHC crane, approx. 650 m2 deck, 72 pax). Status: NEWS 4 Aug 2026 "MoA signed for sale of Viking Reach and onboard WROV"; PDF p19 footnote (sale expected to close Q4 2026).',
    note: 'Sale agreed, not closed. Neither site marks it. Drop the vessel (and its ROVs) when the sale completes.',
  },
  {
    slug: 'normand-jarstein',
    name: 'Normand Jarstein',
    type: 'vessel',
    status: 'in-service',
    kind: 'IMR & construction vessel',
    kindShort: 'IMR & construction',
    summary: 'IMR and construction vessel on a long-term IMR campaign in the Black Sea and Mediterranean since May 2026.',
    owner: 'Solstad Maritime ASA',
    charter: 'May 2026 – May 2028. 1 year option.',
    specs: { crane: '250 t' },
    rovs: ['2 Constructor WROV'],
    image: { alt: 'Normand Jarstein' },
    url: '/assets/normand-jarstein/',
    source: 'Q2 2026 report p15 (IMR and Construction Vessel; May 2026 – May 2028, 1 year option; Solstad Maritime ASA; 250 ton; 2 x WROV Constructors and survey equipment). PDF p42 marks it a project charter. No asset page on either site, so no photo.',
    note: 'No page or photo on the dev or live site. Needs an approved photo.',
  },
  // ── Vessels, joining ──────────────────────────────────────────────────────
  {
    slug: 'viking-vigor',
    name: 'Viking Vigor',
    type: 'vessel',
    status: 'newbuild',
    kind: 'IMR & light construction vessel',
    kindShort: 'IMR & construction',
    summary: 'Newbuild under construction, to be mobilised with work-class ROVs and survey equipment.',
    owner: 'Eidesvik Agalas AS',
    charter: '2026 →',
    joining: '2026',
    specs: { crane: '150 t' },
    image: { src: `${base}images/vessel-agalas.jpg`, alt: 'Rendering of a red newbuild offshore vessel with Reach Subsea markings, at sea', focalPoint: { x: 0.55, y: 0.5 } },
    url: '/assets/viking-vigor/',
    source: 'Q2 2026 report p16 (2026 →, Eidesvik Agalas AS, 150 ton, "Will be mobilized with state-of-the-art WROVs and survey equipment", under construction); NEWS 21 Oct 2025 (delivery delayed to Q3 2026, Sefine Shipyard). The dev hero is the same rendering as NB76.',
    note: 'The photo is a rendering shared with NB76.',
  },
  {
    slug: 'newbuild-nb76',
    name: 'Newbuild NB76',
    type: 'vessel',
    status: 'newbuild',
    kind: 'IMR & light construction vessel',
    kindShort: 'IMR & construction',
    summary: 'DP2 newbuild with a 150 t crane, two WROV hangars and accommodation for 100, delivering in 2027.',
    owner: 'Eidesvik Agalas AS (66.7 %) / Reach Subsea ASA (33.3 %)',
    charter: '2027 →',
    joining: '2027',
    specs: { crane: '150 t', pax: '100', deck: '900 m²', length: '99.9 m', beam: '21 m' },
    image: { src: `${base}images/vessel-agalas.jpg`, alt: 'Rendering of a red newbuild offshore vessel with Reach Subsea markings, at sea', focalPoint: { x: 0.55, y: 0.5 } },
    url: '/assets/newbuild/',
    source: 'Q2 2026 report p16 and DEV spec table (crane 150 ton, 2027 →, owner split); NEWS 20 Feb 2025 (99,9 x 21m, DNV, 150t AHC knuckle boom crane, ~900m2 deck, 100 persons, DP2, 2 x WROV hangars, spring 2027 delivery).',
  },
  // ── Uncrewed surface vessels ───────────────────────────────────────────────
  {
    slug: 'reach-remote-1-2',
    name: 'Reach Remote 1 & 2',
    type: 'usv',
    status: 'in-service',
    units: 2,
    unitNames: ['Reach Remote 1', 'Reach Remote 2'],
    kind: 'Uncrewed surface vessels',
    summary: 'Uncrewed 24 m surface vessels with hull-mounted survey sensors and a work-class electric ROV, operated from shore.',
    owner: 'Reach Subsea ASA',
    specs: { length: '23.90 m', speed: '11.0 knots', tonnage: '230 t', endurance: '30 days' },
    rovs: ['ZEEROV'],
    image: { src: `${base}images/reach-remote-bow.jpg`, alt: 'Reach Remote 1 uncrewed surface vessel seen from the bow', focalPoint: { x: 0.6, y: 0.45 } },
    specSheet: { label: 'Brochure (PDF)', url: `${files}/2024/11/REA25-2595-170-Reach-Remote-Brochure-A5.pdf`, action: 'file', context: 'Reach Remote' },
    url: '/assets/reach-remote/',
    source: 'DEV spec table (Length 23.90 m, Max speed 11.0 knots, Gross tonnage 230 t, Min. Endurance 30 days) and intro; NEWS 16 Jan and 12 Jun 2025 (deliveries), 24 Sep 2026 ("already in service").',
  },
  {
    slug: 'reach-remote-3-4',
    name: 'Reach Remote 3 & 4',
    type: 'usv',
    status: 'newbuild',
    units: 2,
    unitNames: ['Reach Remote 3', 'Reach Remote 4'],
    kind: 'Uncrewed surface vessels',
    summary: 'The next two uncrewed vessels, under construction at Kongsberg Maritime and co-funded by the EU Innovation Fund.',
    owner: 'Reach Subsea ASA',
    joining: '2027',
    specs: {},
    rovs: ['ZEEROV'],
    image: { src: `${base}images/usv-reach-remote-3-4.jpg`, alt: 'Reach Remote 1 uncrewed surface vessel seen from above at sea', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/assets/reach-remote/3-4/',
    source: 'Q2 2026 report p16 (2027 →, owned, ZeeROV and survey equipment, under construction); DEV page body ("Delivery is scheduled for the second half of 2027"; specs "will mirror the first two vessels"; EUR 14.3 million EU Innovation Fund grant, 22 Oct 2024); NEWS 24 Sep 2025 (option exercised with Kongsberg Maritime). The dev hero shows Reach Remote 1.',
  },
  {
    slug: 'drix-orca-1-2',
    name: 'DriX Orca 1 & 2',
    type: 'usv',
    status: 'in-service',
    units: 2,
    unitNames: ['DriX Orca 1', 'DriX Orca 2'],
    kind: 'Autonomous survey vehicles',
    summary: 'Remotely controlled survey vehicles for high-quality hydrographic surveys in shallow water, with an EM2040 multibeam.',
    owner: 'Reach Subsea ASA',
    specs: { length: '7.7 m', draft: '2 m', beam: '0.82 m' },
    image: { src: `${base}images/usv-drix-wind.jpg`, alt: 'A red DriX uncrewed survey vessel passing an offshore wind turbine', focalPoint: { x: 0.55, y: 0.55 } },
    url: '/assets/drix-orca-1-and-orca-2/',
    source: 'DEV spec table (Length 7.7 m, Draft 2 m, Beam 0.82 m, MBES EM2040) and intro (the intro says "8 meter"; the table wins).',
  },
  // ── ROV systems (classes; the fleet-wide count is key-figures `rov-systems`) ──
  {
    slug: 'constructor-wrov',
    name: 'Constructor WROV',
    type: 'rov',
    status: 'in-service',
    kind: 'Heavy-duty work-class ROV',
    summary: 'Heavy-duty ROV for carrying and operating large tools and modules, with more power and payload than the Supporter.',
    specs: { power: '160 kW / 220 hp', depth: '2,000–6,000 m', payload: '400 kg', weight: '4,600 kg', dimensions: '3.2 × 1.7 × 1.9 m' },
    image: { src: `${base}images/asset-constructor-wrov.jpg`, alt: 'A Constructor work-class ROV on deck', focalPoint: { x: 0.6, y: 0.45 } },
    specSheet: { label: 'Spec sheet (PDF)', url: `${files}/2023/03/Constructor-data-sheet.pdf`, action: 'file', context: 'Constructor WROV' },
    url: '/assets/constructor-wrov/',
    source: 'DEV spec table (Power 160 Kw / 220 Hp, Depth rating 2-6000 msg, Dimensions 3.2 L / 1.7W / 1.9H m, Weight 4600 Kg, Payload 400 Kg) and intro.',
  },
  {
    slug: 'supporter-wrov',
    name: 'Supporter WROV',
    type: 'rov',
    status: 'in-service',
    kind: 'Compact work-class ROV',
    summary: 'Compact and powerful work-class ROV, refined from years of hands-on operational experience.',
    specs: { power: '93 kW / 125 hp', depth: '2,000–3,000 m', payload: '220 kg', weight: '2,450 kg', dimensions: '2.5 × 1.7 × 1.65 m' },
    image: { src: `${base}images/rov-supporter-launch.jpg`, alt: 'A yellow Supporter work-class ROV lowered through the splash zone', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/assets/supporter-wrov/',
    source: 'DEV spec table (Power 93 Kw / 125 Hp, Depth rating 2-3000 msg, Dimensions 2.5 L / 1.7 W / 1.65 H m, Weight 2450 Kg, Payload 220 Kg) and intro. No data sheet on either site.',
  },
  {
    slug: 'schilling-robotics-hd-wrov',
    name: 'HD WROV',
    type: 'rov',
    status: 'in-service',
    kind: 'Compact work-class ROV',
    summary: 'Compact 150 hp ROV for IMR and drill support, built for rigs and vessels where deck space is limited.',
    specs: { power: '112 kW / 150 hp', depth: '3,000 m', payload: '250 kg', weight: '3,600 kg', dimensions: '2.9 × 1.7 × 1.9 m' },
    image: { src: `${base}images/rov-hd-wrov.jpg`, alt: 'A yellow HD work-class ROV on deck beside a vessel', focalPoint: { x: 0.5, y: 0.5 } },
    specSheet: { label: 'Spec sheet (PDF)', url: `${files}/2023/03/HDROV-data-sheet.pdf`, action: 'file', context: 'HD WROV' },
    url: '/assets/schilling-robotics-hd-wrov/',
    source: 'DEV spec table (Power 112 Kw / 150 Hp, Depth rating 3000 msg, Dimensions 2.9 L / 1.7 W / 1.9 H m, Weight 3600 Kg, Payload 250 Kg) and intro. Vessel pages call it "Schilling HD WROV".',
  },
  {
    slug: 'surveyor-interceptor',
    name: 'Surveyor Interceptor',
    type: 'rov',
    status: 'in-service',
    kind: 'Survey ROV',
    summary: 'Pure sensor carrier for fast, stable survey, developed with MMT and Kystdesign, free-swimming or on a TMS.',
    specs: { power: '164 kW / 220 hp', depth: '2,000 m', payload: '700 kg', weight: '4,700 kg', dimensions: '5.5 × 3.6 × 1.2 m' },
    image: { src: `${base}images/rov-surveyor-launch.jpg`, alt: 'A Surveyor Interceptor survey ROV launched from a vessel side', focalPoint: { x: 0.5, y: 0.5 } },
    specSheet: { label: 'Spec sheet (PDF)', url: `${files}/2023/03/Surveyor-Interceptor-data-sheet.pdf`, action: 'file', context: 'Surveyor Interceptor' },
    url: '/assets/surveyor-interceptor/',
    source: 'DEV spec table (Power 164 Kw / 220 Hp, Depth rating 2000 msg, Dimensions 5.5 L / 3.6 W / 1.2 H m, Weight 4700 Kg, Payload 700 Kg) and intro.',
  },
  {
    slug: 'zeerov',
    name: 'ZEEROV',
    type: 'rov',
    status: 'in-service',
    kind: 'Zero-emission electric ROV',
    summary: 'Fully electric work-class ROV carried by Reach Remote, with AutoPOS and AutoTRACK for control from shore.',
    specs: { power: '115 kW / 150 hp', depth: '2,000 m', payload: '600 kg', weight: '3,800 kg', dimensions: '2.75 × 1.7 × 1.69 m' },
    image: { src: `${base}images/rov-zeerov-seabed.jpg`, alt: 'A ZEEROV electric work-class ROV working on the seabed', focalPoint: { x: 0.5, y: 0.5 } },
    specSheet: { label: 'Spec sheet (PDF)', url: `${files}/2024/11/KD-ZEEROV.pdf`, action: 'file', context: 'ZEEROV' },
    url: '/assets/zeerov/',
    source: 'DEV spec table (Power 115 Kw / 150 Hp, Depth rating 2000 msg, Dimensions 2.75 L / 1.7 W / 1.69 H m, Weight 3800 Kg, Payload 600 Kg, Umbilical length 1065 m) and intro.',
  },
  // ── Equipment (no post on either site: one entry for the overview card) ────
  {
    slug: 'survey-monitoring-equipment',
    name: 'Survey & monitoring equipment',
    type: 'equipment',
    status: 'in-service',
    kind: 'Sensors and instrumentation',
    summary: 'Multibeam echosounders, sub-bottom profilers and positioning carried by the vessels and USVs, and the gWatch family of monitoring systems.',
    specs: {},
    image: { src: `${base}images/rov-zeerov-gwatch.jpg`, alt: 'A gWatch seabed monitoring unit being placed by an ROV', focalPoint: { x: 0.5, y: 0.5 } },
    url: '/assets/survey-monitoring-equipment/',
    source: 'PDF p20 (Survey & monitoring assets: EM2040, Topas PS120, gWatch / DepthWatch / WellWatch / DrillWatch); DEV Reach Remote and Northern Maria intros (EM 2040, Innomar SBP, HiPAP 502). Neither site has an equipment post type.',
  },
];

/** Named contact for the fleet (dev ROV pages). WP: a Person post picked on the Assets options page. */
export const fleetContact = {
  name: 'Knut Jacob Medhaug',
  role: 'VP Group Assets',
  phone: '+47 472 45 343',
  email: 'kjm@reachsubsea.com',
};

export const assetsOf = (type: AssetType) => assets.filter((a) => a.type === type);
export const unitsOf = (list: Asset[]) => list.reduce((n, a) => n + (a.units ?? 1), 0);
const inService = (a: Asset) => a.status === 'in-service' || a.status === 'sale-agreed';

/** Fleet counts derived from the entries; the page never types these. */
export const fleetCounts = {
  vessels: { inService: unitsOf(assetsOf('vessel').filter(inService)), joining: unitsOf(assetsOf('vessel').filter((a) => a.status === 'newbuild')) },
  usvs: { inService: unitsOf(assetsOf('usv').filter(inService)), joining: unitsOf(assetsOf('usv').filter((a) => a.status === 'newbuild')) },
};

/** Status badge for cards: In service · Joining Q3 2026 · Sale agreed. */
export function statusBadge(asset: Asset): { label: string; tone: 'success' | 'navy' | 'neutral' } {
  if (asset.status === 'newbuild') return { label: asset.joining ? `Joining ${asset.joining}` : 'Newbuild', tone: 'navy' };
  if (asset.status === 'sale-agreed') return { label: 'Sale agreed', tone: 'neutral' };
  return { label: 'In service', tone: 'success' };
}
