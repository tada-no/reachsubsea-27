// Key figures for results releases (9 Oct 2026, Q159): the quarter's revenue, EBIT and order backlog, shown as a row
// under a release's lead (src/blocks/KeyFigures.astro). Every value is the release's own figure, in NOK million, as
// rounded there. The change line is the year-earlier figure the release gives; where it gives none, the figure from
// the release a year before (marked `prior release`); where it gives only a percentage, that. A figure the release
// doesn't state is left out (1Q 2026, 3Q 2023 and 4Q 2021 state no backlog figure).
// WordPress: the Key figures block (reach/key-figures) placed after the lead, its rows typed by the editor; this file
// is only the migration data for the 16 releases since 2Q 2021 (older releases link to the report PDF only).
import type { StatField } from '../lib/types';

export interface KeyFigures {
  /** The release's period, as its title writes it: "2Q 2026". */
  period: string;
  figures: StatField[];
}

const earlier = (v: string) => `${v}m a year earlier`;
const up = (pct: number) => `Up ${pct}% on a year earlier`;
const row = (revenue: [string, string], ebit: [string, string], backlog?: [string, string]): StatField[] => [
  { key: 'revenue', label: 'Revenue', value: revenue[0], suffix: 'm', delta: revenue[1] },
  { key: 'ebit', label: 'EBIT', value: ebit[0], suffix: 'm', delta: ebit[1] },
  ...(backlog ? [{ key: 'backlog', label: 'Order backlog', value: backlog[0], suffix: 'm', delta: backlog[1] }] : []),
];

export const newsKeyFigures: Record<string, KeyFigures> = {
  // Backlog a year earlier: 2Q 2025 release (NOK 1.15 billion)
  'reach-subsea-asa-2q-2026-strong-results-building-the-fleet-for-the-future': {
    period: '2Q 2026',
    figures: row(['988.1', earlier('684.2')], ['192.4', earlier('91.1')], ['1,850', earlier('1,150')]),
  },
  'reach-subsea-asa-1q-2026-weak-quarterly-results-reach-remote-entering-scale-up-phase': {
    period: '1Q 2026',
    figures: row(['551.4', earlier('699')], ['−192.1', earlier('68')]),
  },
  // The release writes the backlog "NOK 1.175 million" (1,175 million; "1.2 billion" in its outlook); a year earlier
  // from the Q4 2024 release
  'reach-subsea-asa-4q-2025-results-down-milestones-on-reach-remote-delivered': {
    period: '4Q 2025',
    figures: row(['606', earlier('685')], ['−60', earlier('80')], ['1,175', earlier('1,200')]),
  },
  // Backlog a year earlier: Q3 2024 release
  'reach-subsea-asa-3q-2025-weaker-results-solid-performance-on-remote-milestones': {
    period: '3Q 2025',
    figures: row(['688', earlier('835')], ['51', earlier('134')], ['1,050', earlier('1,500')]),
  },
  // Backlog a year earlier: Q2 2024 release
  'reach-subsea-asa-2q-2025-impacted-by-a-cautious-market': {
    period: '2Q 2025',
    figures: row(['684', earlier('623')], ['91', earlier('121')], ['1,150', earlier('1,600')]),
  },
  // Backlog a year earlier: Q1 2024 release
  'reach-subsea-asa-1q-2025-another-record-quarter': {
    period: '1Q 2025',
    figures: row(['698.7', earlier('575.3')], ['68.2', earlier('28.7')], ['1,300', earlier('1,300')]),
  },
  // Revenue and backlog a year earlier: Q4 2023 release
  'reach-subsea-asa-q4-2024-another-record-year': {
    period: 'Q4 2024',
    figures: row(['685', earlier('474')], ['80', earlier('79.5')], ['1,200', earlier('1,200')]),
  },
  // Revenue a year earlier: Q3 2023 release; the backlog "nearly a threefold increase"
  'reach-subsea-asa-q3-2024-continued-steady-progress': {
    period: 'Q3 2024',
    figures: row(['835', earlier('651')], ['134.1', earlier('112.4')], ['1,500', 'Nearly three times a year earlier']),
  },
  // Revenue and EBIT a year earlier: Q2 2023 release (its EBIT includes a NOK 29.8 million gain)
  'reach-subsea-asa-q2-2024-confirming-steady-progress': {
    period: 'Q2 2024',
    figures: row(['623', earlier('636')], ['121', earlier('148.2')], ['1,600', up(170)]),
  },
  'reach-subsea-asa-q1-2024-starting-the-year-with-new-records': {
    period: 'Q1 2024',
    figures: row(['575', up(146)], ['28.7', earlier('−8.4')], ['1,300', earlier('815')]),
  },
  'reach-subsea-asa-q4-2023-record-high-numbers-and-strong-outlook': {
    period: 'Q4 2023',
    figures: row(['474', up(45)], ['79.5', earlier('34.6')], ['1,200', earlier('740')]),
  },
  'reach-subsea-asa-q3-2023-strong-growth-in-revenue-and-profitability-continued-positive-outlook': {
    period: 'Q3 2023',
    figures: row(['651', up(79)], ['112.4', earlier('58.4')]),
  },
  // EBIT includes a one-off gain of NOK 29.8 million
  'reach-subsea-asa-q2-2023-continued-strong-growth-in-revenue-profitability-and-order-book': {
    period: 'Q2 2023',
    figures: row(['636', up(78)], ['148.2', earlier('49.8')], ['590', up(69)]),
  },
  'reach-subsea-asa-q1-2023-continued-strong-growth-and-record-high-order-book': {
    period: 'Q1 2023',
    figures: row(['234', up(81)], ['−8.4', earlier('−37.7')], ['815', up(133)]),
  },
  'financial-report-for-4q-2021-and-strategic-partner': {
    period: '4Q 2021',
    figures: row(['191', earlier('131')], ['26', earlier('15')]),
  },
  'reach-second-quarter-and-first-half-2021-report': {
    period: '2Q 2021',
    figures: row(['170', earlier('217')], ['18', earlier('29')], ['253', earlier('290')]),
  },
};
