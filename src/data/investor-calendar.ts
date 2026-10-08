// Investor year (19 Sep 2026, Investors overview): every reporting date, past and future, in one list
// with ISO dates. The Timeline block's Track layout reads it: done/upcoming is derived from today, the
// newest done primary item is marked Latest, the first upcoming one Next. The Financial calendar page reads it
// too (financial-calendar.ts), and shows only the confirmed dates.
// Real (7 Oct 2026): every `confirmed` date is from Reach's published Financial calendar
// (reachsubsea.no/investors/financial-calendar/, read 7 Oct 2026), which runs to Q4 2026 (16 Feb 2027).
// PLACEHOLDER: the three 2027 dates after it (annual report, Q1, AGM) follow last year's pattern. The Track still
// draws them; the Financial calendar shows them as "Date to come" without a date. Confirm them with Reach.
import type { MilestoneField } from '../blocks/Timeline.astro';
import { latestResults as r } from './investor-results';

export interface CalendarDate extends MilestoneField {
  isoDate: string;
  /** Reach has published this date. Only confirmed dates show their day or get Add to calendar. */
  confirmed: boolean;
}

// `short` is the label on the track (Q4 25 · AR 25 · AGM); `title` is what screen readers hear.
const q = (period: string) => period.replace(/^(Q\d) \d\d(\d\d)$/, '$1 $2');

export const investorCalendar: CalendarDate[] = [
  { isoDate: '2026-02-13', title: 'Q4 2025 results', short: 'Q4 25', kind: 'primary', confirmed: true },
  { isoDate: '2026-04-30', title: 'Annual report 2025', short: 'AR 25', kind: 'secondary', confirmed: true },
  { isoDate: '2026-05-05', title: 'Q1 2026 results', short: 'Q1 26', kind: 'primary', confirmed: true },
  { isoDate: '2026-05-28', title: 'Annual general meeting 2026', short: 'AGM', kind: 'secondary', confirmed: true },
  { isoDate: r.published, title: `${r.period} results`, short: q(r.period), kind: 'primary', confirmed: true },
  { isoDate: r.next.date, title: r.next.label, short: q(r.next.label.replace(' results', '')), kind: 'primary', confirmed: true },
  { isoDate: '2027-02-16', title: 'Q4 2026 results', short: 'Q4 26', kind: 'primary', confirmed: true },
  { isoDate: '2027-03-26', title: 'Annual report 2026', short: 'AR 26', kind: 'secondary', confirmed: false },
  { isoDate: '2027-05-12', title: 'Q1 2027 results', short: 'Q1 27', kind: 'primary', confirmed: false },
  { isoDate: '2027-05-27', title: 'Annual general meeting 2027', short: 'AGM', kind: 'secondary', confirmed: false },
];
