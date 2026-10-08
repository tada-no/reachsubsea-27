// Charter agreements (7 Oct 2026, Investors › Charter agreements, Q125). The structured charter record for each
// vessel, read by the Charter timeline block (docs/05 §2.26). Every value is from the Q2 2026 report p13–16
// ("Status of vessels and assets", published 18 Aug 2026), the newest client source; the client PDF p20 / screens
// p42–43 (Charter agreement overview) supplied the grouping (Normand Jarstein as a project charter).
//
// WordPress (docs/09): these are fields on the Asset post, in a "Charter" field group, not a separate post type, so
// a vessel is edited in one place and the Assets cards' "Charter" line can be generated from the same fields:
//   charterType   select   long-term · project · owned · (none: not on the chart, e.g. ROVs, DriX)
//   start         month    first month of the firm period ("2022-04"); a year alone for a newbuild ("2026")
//   firmEnd       month    last day of the firm period falls at the start of this month; empty = open-ended
//   options       repeater one row per option, its length in months (12, 6 + 6, 36…), drawn and worded in order
//   quarterStatus textarea what the vessel did last quarter, one or two sentences (the report's "2Q26 status")
//   note          textarea optional footnote under the chart, the row marked ¹ ² … (a sale, a delivery date); vessels
//                          with the same note text share one footnote (Reach Remote 3 and 4)
// The period the statuses describe ("Q2 2026") and the source are set once, on the Investors options page
// (`charterSource` below), so a quarterly update is: each vessel's status, then the period label.
// Name, owner and status (in service · newbuild · sale agreed) come from the Asset post itself (assets.ts).
// One row per vessel (Ross, 7 Oct 2026): Reach Remote 1, 2, 3 and 4 are four rows, as in the Q2 report. The prototype's
// assets.ts keeps them as two pair entries (the Assets page cards), so a row here names its `unit`; in WordPress the
// cleaner model is one Asset post per vessel, which the 3D World markers and this chart both want.
import { assets, type Asset } from './assets';

export type CharterType = 'long-term' | 'project' | 'owned';

export interface CharterFields {
  /** Asset post slug (assets.ts). */
  slug: string;
  /** For an asset that stands for a pair (Reach Remote 1 & 2): which vessel this row is, 1-based, named from the
   * asset's `unitNames`. Each vessel is its own row (Ross, 7 Oct 2026), as the Q2 report lists them. */
  unit?: number;
  charterType: CharterType;
  /** "YYYY-MM" for a firm period; "YYYY" alone when only the year is published (newbuilds). */
  start?: string;
  /** "YYYY-MM": the firm period ends at the start of this month. Empty = open-ended. */
  firmEnd?: string;
  /** Option lengths in months, in the order they would run. */
  options?: number[];
  /** What the vessel did in the reporting quarter. */
  quarterStatus: string[];
  note?: string;
  source: string;
}

/** Investors options page: what the statuses describe and where the record comes from. */
export const charterSource = {
  period: 'Q2 2026',
  label: 'Q2 2026 report',
  published: '18 Aug 2026',
  url: '/investors/reports-presentations/',
};

export const charterFields: CharterFields[] = [
  {
    slug: 'deep-cygnus',
    charterType: 'long-term',
    start: '2022-04',
    firmEnd: '2027-04',
    options: [12],
    quarterStatus: ["Finalised ROV and survey services for Nexans' cable installation projects, followed by a cable repair project on a UK offshore wind farm."],
    source: 'Q2 2026 report p13.',
  },
  {
    slug: 'northern-maria',
    charterType: 'long-term',
    start: '2023-04',
    firmEnd: '2027-04',
    options: [6, 6],
    quarterStatus: ['Geotechnical survey for SSEN for most of the quarter.'],
    source: 'Q2 2026 report p14 ("2x 6 months option").',
  },
  {
    slug: 'offshore-surveyor',
    charterType: 'long-term',
    start: '2024-06',
    firmEnd: '2027-06',
    options: [12, 6],
    quarterStatus: ['Finalised a CCS project, then moved to geophysical surveys for Woodside, the Australian Government and other clients.'],
    source: 'Q2 2026 report p15 ("1 year option + x 6 months option"; the dev site reads "1 year option + 6 months option", used here).',
  },
  {
    slug: 'olympic-taurus',
    charterType: 'long-term',
    start: '2024-04',
    firmEnd: '2027-04',
    options: [12],
    quarterStatus: ['IMR scopes in the North Sea, followed by a UXO campaign for Saipem and an IMR campaign for Harbour Energy.'],
    source: 'Q2 2026 report p14.',
  },
  {
    slug: 'go-electra',
    charterType: 'long-term',
    start: '2023-03',
    firmEnd: '2027-03',
    options: [12, 12],
    quarterStatus: ['16 days of IMR scopes and testing of a subsea desalination plant with Flocean; idle for the rest of the quarter.'],
    source: 'Q2 2026 report p14.',
  },
  {
    slug: 'olympic-triton',
    charterType: 'long-term',
    start: '2023-02',
    firmEnd: '2027-02',
    options: [12],
    quarterStatus: ['A construction support campaign in the first part of the quarter, followed by cable inspection and the U-864 submarine wreck survey and intervention campaign.'],
    source: 'Q2 2026 report p14.',
  },
  {
    slug: 'havila-subsea',
    charterType: 'long-term',
    start: '2024-06',
    firmEnd: '2027-06',
    options: [12, 12],
    quarterStatus: ['Several Surveyor Interceptor campaigns for SSEN, Equinor and Ørsted; idle for the last 15 days.'],
    source: 'Q2 2026 report p13.',
  },
  {
    slug: 'viking-reach',
    charterType: 'long-term',
    start: '2023-04',
    firmEnd: '2029-04',
    options: [36],
    quarterStatus: ['Cable route survey for SSEN in the UK throughout the quarter.'],
    note: 'A memorandum of agreement to sell Viking Reach and its onboard WROV was signed on 4 Aug 2026. The sale is expected to close in Q4 2026, unlocking more than NOK 200m in liquidity, with gains for Reach of about NOK 70m. The bar shows the charter as agreed before the sale.',
    source: 'Q2 2026 report p13 (charter), p3 (more than NOK 200 million in liquidity), p54 (signed 4 Aug 2026 by Eidesvik Reach AS; completion Q4 2026; gains of approximately NOK 70 million on the WROV and the 49.9 % interest). The client PDF footnote said ~NOK 65m; the report wins.',
  },
  {
    slug: 'normand-jarstein',
    charterType: 'project',
    start: '2026-05',
    firmEnd: '2028-05',
    options: [12],
    quarterStatus: ['Transit to Turkey and start-up of a long-term IMR campaign.'],
    note: 'Normand Jarstein joined the fleet in May 2026 for a long-term IMR campaign in the Black Sea and the Mediterranean. It is a project charter, as in the Q2 2026 presentation, rather than one of the long-term chartered vessels.',
    source: 'Q2 2026 report p15 (charter), p12 (Black Sea); client PDF p20 footnote (project charter, Jorunn, Sep 2026; Black Sea and Mediterranean).',
  },
  {
    slug: 'viking-vigor',
    charterType: 'long-term',
    start: '2026',
    quarterStatus: ['Under construction. It will be mobilised with work-class ROVs and survey equipment.'],
    note: 'Viking Vigor is expected to be delivered in the second half of 2026.',
    source: 'Q2 2026 report p16 ("2026 -->"), p54 (delivery in the second half of 2026). The firm period and options are not published.',
  },
  {
    slug: 'newbuild-nb76',
    charterType: 'long-term',
    start: '2027',
    quarterStatus: ['Under construction. It will be mobilised with work-class ROVs and survey equipment.'],
    source: 'Q2 2026 report p16 ("2027 -->"). The firm period and options are not published.',
  },
  {
    slug: 'reach-remote-1-2',
    unit: 1,
    charterType: 'owned',
    quarterStatus: ['A pipeline inspection and survey campaign for Equinor, and IMR scopes for other clients.'],
    source: 'Q2 2026 report p15 ("Charter period: Owned vessel").',
  },
  {
    slug: 'reach-remote-1-2',
    unit: 2,
    charterType: 'owned',
    quarterStatus: ['IMR scopes for Woodside and other Australian clients at several fields; idle for the last month.'],
    source: 'Q2 2026 report p15 ("Charter period: Owned vessel").',
  },
  {
    slug: 'reach-remote-3-4',
    unit: 1,
    charterType: 'owned',
    start: '2027',
    quarterStatus: ['Under construction.'],
    note: 'Reach Remote 3 and 4 are under construction, part-funded by the EU Innovation Fund. No delivery date is confirmed yet, so their bars mark the build, not a firm date.',
    source: 'Q2 2026 report p16 ("2027 -->", under construction) and p54 (EU Innovation Fund).',
  },
  {
    slug: 'reach-remote-3-4',
    unit: 2,
    charterType: 'owned',
    start: '2027',
    quarterStatus: ['Under construction.'],
    note: 'Reach Remote 3 and 4 are under construction, part-funded by the EU Innovation Fund. No delivery date is confirmed yet, so their bars mark the build, not a firm date.',
    source: 'Q2 2026 report p16 ("2027 -->", under construction) and p54 (EU Innovation Fund).',
  },
];

// ── Derived (the block and the Assets cards read these; nothing below is typed by an editor) ──────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "2027-04" → months since year 0, so periods add up in whole months. */
export const toMonth = (ym: string) => {
  const [y, m = '1'] = ym.split('-');
  return Number(y) * 12 + Number(m) - 1;
};
export const monthLabel = (n: number, long = false) => `${(long ? MONTHS_LONG : MONTHS)[n % 12]} ${Math.floor(n / 12)}`;

const lengthLabel = (months: number) => (months % 12 === 0 ? `${months / 12}-year` : `${months}-month`);

/** "1-year option" · "2 × 6-month options" · "1-year + 6-month options". */
export function optionsLabel(options: number[] = []): string {
  if (options.length === 0) return '';
  if (options.length === 1) return `${lengthLabel(options[0])} option`;
  if (options.every((o) => o === options[0])) return `${options.length} × ${lengthLabel(options[0])} options`;
  return `${options.map(lengthLabel).join(' + ')} options`;
}

export interface CharterRow extends CharterFields {
  asset: Asset;
  /** The vessel's name: the unit's name for a pair ("Reach Remote 3"), else the asset's. */
  name: string;
  /** Row id for deep links: the asset slug, or the unit's name for a pair ("reach-remote-3"). */
  id: string;
  /** Months (toMonth) for drawing; undefined = before the record / open-ended. */
  startMonth?: number;
  /** True when only a year is known (newbuilds, Reach Remote 3 & 4). */
  startYearOnly: boolean;
  firmEndMonth?: number;
  optionEndMonth?: number;
  /** Not yet in the fleet: drawn as a dashed "joining" bar. */
  joining: boolean;
  /** The row's one line under the name: "Apr 2022 – Apr 2027 · 1-year option". */
  period: string;
  optionsText: string;
}

export function charterRows(): CharterRow[] {
  return charterFields.flatMap((c) => {
    const asset = assets.find((a) => a.slug === c.slug);
    if (!asset) return [];
    const name = (c.unit && asset.unitNames?.[c.unit - 1]) || asset.name;
    const id = c.unit ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : c.slug;
    const startYearOnly = !!c.start && !c.start.includes('-');
    const startMonth = c.start ? toMonth(c.start) : undefined;
    const firmEndMonth = c.firmEnd ? toMonth(c.firmEnd) : undefined;
    const optionEndMonth = firmEndMonth !== undefined && c.options?.length ? firmEndMonth + c.options.reduce((s, o) => s + o, 0) : undefined;
    const joining = asset.status === 'newbuild';
    const optionsText = optionsLabel(c.options);
    let period: string;
    if (joining) period = `Joining ${c.start ?? asset.joining ?? ''}`.trim() + (c.charterType === 'owned' ? ' · in build' : ' · terms not yet published');
    else if (c.charterType === 'owned') period = 'In operation';
    else period = [`${monthLabel(startMonth!)} – ${monthLabel(firmEndMonth!)}`, optionsText].filter(Boolean).join(' · ');
    return [{ ...c, asset, name, id, startMonth, startYearOnly, firmEndMonth, optionEndMonth, joining, period, optionsText }];
  });
}

export const charterGroups: { type: CharterType; title: string }[] = [
  { type: 'long-term', title: 'Long-term charters' },
  { type: 'project', title: 'Project charter' },
  { type: 'owned', title: 'Owned vessels' },
];
