// Investor year (19 Sep 2026, Investors overview): every reporting date, past and future, in one list
// with ISO dates. The Timeline block's Track layout reads it: done/upcoming is derived from today, the
// newest done primary item is marked Latest, the first upcoming one Next.
// Real: Q2 2026 published 18 Aug 2026 and Q3 2026 on 17 Nov 2026 (client PDF p38–40, investor-results.ts).
// PLACEHOLDER until the client sends the financial calendar: every other date follows the pattern
// already used in documents.ts (reports, AGMs, annual report).
import type { MilestoneField } from '../blocks/Timeline.astro';
import { latestResults as r } from './investor-results';

// `short` is the label on the track (Q4 25 · AR 25 · AGM); `title` is what screen readers hear.
const q = (period: string) => period.replace(/^(Q\d) \d\d(\d\d)$/, '$1 $2');

export const investorCalendar: MilestoneField[] = [
  { isoDate: '2026-02-12', title: 'Q4 2025 results', short: 'Q4 25', kind: 'primary' },
  { isoDate: '2026-03-26', title: 'Annual report 2025', short: 'AR 25', kind: 'secondary' },
  { isoDate: '2026-04-24', title: 'Q1 2026 results', short: 'Q1 26', kind: 'primary' },
  { isoDate: '2026-05-28', title: 'Annual general meeting', short: 'AGM', kind: 'secondary' },
  { isoDate: r.published, title: `${r.period} results`, short: q(r.period), kind: 'primary' },
  { isoDate: r.next.date, title: r.next.label, short: q(r.next.label.replace(' results', '')), kind: 'primary' },
  { isoDate: '2027-02-11', title: 'Q4 2026 results', short: 'Q4 26', kind: 'primary' },
  { isoDate: '2027-03-26', title: 'Annual report 2026', short: 'AR 26', kind: 'secondary' },
  { isoDate: '2027-05-12', title: 'Q1 2027 results', short: 'Q1 27', kind: 'primary' },
  { isoDate: '2027-05-27', title: 'Annual general meeting', short: 'AGM', kind: 'secondary' },
];
