// Investor year (19 Sep 2026, Investors overview): every reporting date, past and future, in one list
// with ISO dates. The Timeline block's Track layout reads it: done/upcoming is derived from today, the
// newest done item with links becomes "Latest", the first upcoming one "Next".
// Real: Q2 2026 published 18 Aug 2026 and Q3 2026 on 17 Nov 2026 (client PDF p38–40, investor-results.ts).
// PLACEHOLDER until the client sends the financial calendar: every other date follows the pattern
// already used in documents.ts (reports, AGMs, annual report).
import type { MilestoneField } from '../blocks/Timeline.astro';
import { latestResults as r } from './investor-results';

export const investorCalendar: MilestoneField[] = [
  { isoDate: '2026-02-12', title: 'Q4 2025 results', kind: 'primary' },
  { isoDate: '2026-03-26', title: 'Annual report 2025', kind: 'secondary' },
  { isoDate: '2026-04-24', title: 'Q1 2026 results', kind: 'primary' },
  { isoDate: '2026-05-28', title: 'Annual general meeting', kind: 'secondary' },
  {
    isoDate: r.published,
    title: `${r.period} results`,
    kind: 'primary',
    links: [
      { label: 'Report', url: r.report.url, action: 'file', context: `${r.period} report, PDF` },
      { label: 'Presentation', url: '#', action: 'file', context: `${r.period} presentation, PDF` },
      { label: 'Webcast', url: '#', action: 'external', context: `${r.period} webcast` },
    ],
  },
  { isoDate: r.next.date, title: r.next.label, kind: 'primary' },
  { isoDate: '2027-02-11', title: 'Q4 2026 results', kind: 'primary' },
  { isoDate: '2027-03-26', title: 'Annual report 2026', kind: 'secondary' },
  { isoDate: '2027-05-12', title: 'Q1 2027 results', kind: 'primary' },
  { isoDate: '2027-05-27', title: 'Annual general meeting', kind: 'secondary' },
];
