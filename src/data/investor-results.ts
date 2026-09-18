// Latest results options page (18 Sep 2026, Why invest): one record, edited once a quarter when the
// report is published. Why invest (Stats band · Results) and the Investors Overview both read it, and
// the investor FAQ answers quote the same figures. Values: Q2 2026 as reported, published 18 Aug 2026
// (client PDF p40, "Why invest in Reach Subsea"). Next report date from the Financial calendar.
import type { StatField } from '../lib/types';

export interface ResultsRecord {
  period: string;
  /** ISO date the report was published. */
  published: string;
  headline: StatField[];
  secondary: StatField[];
  /** Revenue by segment, percent of the period's revenue. */
  revenueMix: { label: string; value: number }[];
  report: { label: string; url: string; context?: string };
  next: { label: string; date: string };
}

export const latestResults: ResultsRecord = {
  period: 'Q2 2026',
  published: '2026-08-18',
  headline: [
    { key: 'revenue', value: '988.1', unit: 'NOK', suffix: 'm', label: 'Revenue', delta: '+44% year on year', trend: 'up' },
    { key: 'ebit', value: '192.4', unit: 'NOK', suffix: 'm', label: 'EBIT', delta: '+111% year on year', trend: 'up' },
    { key: 'backlog', value: '1,850', unit: 'NOK', suffix: 'm', label: 'Order backlog', delta: '+61% year on year', trend: 'up' },
    { key: 'pipeline', value: '9', unit: 'NOK', suffix: 'bn', label: 'Tender pipeline', delta: 'Active opportunities' },
  ],
  secondary: [
    { key: 'ebitda', value: 'NOK 428.3m', label: 'EBITDA' },
    { key: 'net-profit', value: 'NOK 133.6m', label: 'Net profit' },
    { key: 'utilisation', value: '83%', label: 'Fleet utilisation' },
    { key: 'cash', value: 'NOK 410.4m', label: 'Cash and equivalents' },
  ],
  revenueMix: [
    { label: 'Oil & gas', value: 54 },
    { label: 'Renewables & other', value: 46 },
  ],
  report: { label: 'Q2 2026 report', url: '#', context: 'PDF' },
  next: { label: 'Q3 2026 results', date: '2026-11-17' },
};
