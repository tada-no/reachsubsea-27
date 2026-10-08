// Latest results options page (18 Sep 2026, Why invest): one record, edited once a quarter when the
// report is published. Why invest (Stats band · Results) and the Investors Overview both read it, and
// the investor FAQ answers quote the same figures. Values: Q2 2026 as reported, published 18 Aug 2026
// (client PDF p40, "Why invest in Reach Subsea"). Next report date from the Financial calendar.
import type { ReportCardField, StatField } from '../lib/types';
import { icsHref } from '../lib/ics';

export interface ResultsRecord {
  period: string;
  /** All values are in this currency, stated once beside the publication date. */
  currency: string;
  /** ISO date the report was published. */
  published: string;
  headline: StatField[];
  secondary: StatField[];
  /** Revenue by segment, percent of revenue, for the latest `revenueShift` period (Why invest's donut). Derived from
   * `revenueShift`, so the site shows one revenue split (Q117, 7 Oct 2026: the donut had shown 2Q alone, 46%, while
   * Sustainability showed the first half, 51%). */
  revenueMix: { label: string; value: number }[];
  /** Renewables & other, percent of revenue, year to date against the same period a year earlier (Sustainability,
   * 7 Oct 2026). The report's year-to-date paragraph; oil & gas is the rest. Written out, never "H1" (Ross, 7 Oct 2026). */
  revenueShift: { label: string; value: number }[];
  report: { label: string; url: string; context?: string };
  /** Latest annual report. PLACEHOLDER until the client confirms the title, date and file. */
  annualReport: { label: string; meta: string; url: string; context?: string; published: string };
  next: { label: string; date: string };
}

// 2Q 2026 report p29: "Oil & Gas revenues constituted 49 % (61 %), while Renewable/Other revenues constituted 51 % (39 %)"
const revenueShift = [
  { label: 'First half 2025', value: 39 },
  { label: 'First half 2026', value: 51 },
];
const shiftNow = revenueShift[revenueShift.length - 1];

export const latestResults: ResultsRecord = {
  period: 'Q2 2026',
  currency: 'NOK',
  published: '2026-08-18',
  headline: [
    { key: 'revenue', value: '988.1', suffix: 'm', label: 'Revenue', delta: '+44% year on year', trend: 'up' },
    { key: 'ebit', value: '192.4', suffix: 'm', label: 'EBIT', delta: '+111% year on year', trend: 'up' },
    { key: 'backlog', value: '1,850', suffix: 'm', label: 'Order backlog', delta: '+61% year on year', trend: 'up' },
    { key: 'pipeline', value: '9', suffix: 'bn', label: 'Tender pipeline', delta: 'Active opportunities' },
  ],
  secondary: [
    { key: 'ebitda', value: '428.3m', label: 'EBITDA' },
    { key: 'net-profit', value: '133.6m', label: 'Net profit' },
    { key: 'utilisation', value: '83%', label: 'Fleet utilisation' },
    { key: 'cash', value: '410.4m', label: 'Cash and equivalents' },
  ],
  // First half 2026 (2Q report p29), not 2Q alone (p28: 54% oil & gas, 46% renewables/other): Ross, 7 Oct 2026, Q117
  revenueMix: [
    { label: 'Oil & gas', value: 100 - shiftNow.value },
    { label: 'Renewables & other', value: shiftNow.value },
  ],
  revenueShift,
  report: { label: 'Q2 2026 report', url: '#', context: 'PDF' },
  annualReport: { label: 'Annual report 2025', meta: 'Annual and sustainability report', url: '#', context: 'PDF', published: '2026-03-26' },
  next: { label: 'Q3 2026 results', date: '2026-11-17' },
};

// Short dates keep every card's meta to one line ("Published 18 Aug 2026", "17 Nov 2026 · in 59 days")
const shortDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const r = latestResults;

/** The three report cards (19 Sep 2026), shared by Why invest (under the Results band) and the Investors
 * overview (under the investor year track). Ordered by date, like the track: annual · latest · next. */
export const reportCards: ReportCardField[] = [
  {
    kicker: 'Annual',
    title: r.annualReport.label,
    meta: `Published ${shortDate(r.annualReport.published)}`,
    links: [{ label: 'Report', url: r.annualReport.url, action: 'file', context: `${r.annualReport.label}, PDF` }],
  },
  {
    kicker: 'Latest',
    title: `${r.period} results`,
    meta: `Published ${shortDate(r.published)}`,
    links: [
      { label: 'Report', url: r.report.url, action: 'file', context: `${r.period} report, PDF` },
      { label: 'Presentation', url: '#', action: 'file', context: `${r.period} presentation, PDF` },
      { label: 'Webcast', url: '#', action: 'external', context: `${r.period} webcast` },
    ],
  },
  {
    date: r.next.date,
    kicker: 'Next',
    title: r.next.label,
    meta: shortDate(r.next.date),
    countdownTo: r.next.date,
    links: [
      {
        label: 'Add to calendar',
        url: icsHref(`Reach Subsea ${r.next.label}`, r.next.date),
        action: 'file',
        context: r.next.label,
        download: `reach-subsea-${r.next.date}.ics`,
      },
    ],
    tone: 'navy',
  },
];
