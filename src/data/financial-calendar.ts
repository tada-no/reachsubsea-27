// Financial calendar (7 Oct 2026): the investor calendar's dates as rows for the Date list block, each past date
// with the files it produced. Dates from investor-calendar.ts (Reach's published Financial calendar); files from
// reports.ts (results, annual reports) and governance.ts (general meetings), matched by title, so a file added
// there shows here too. In WordPress: the Event post type (type = financial calendar) with a relation to its
// Document posts.
import { investorCalendar, type CalendarDate } from './investor-calendar';
import { quarterlyReleases, annualReports } from './reports';
import { generalMeetings, nextGeneralMeeting } from './governance';

export interface DateFile {
  /** Fixed slot, so the same kind of file sits in the same column down the list. */
  slot: 0 | 1 | 2;
  label: string;
  url: string;
}

export interface DateRow {
  title: string;
  /** Unset until Reach publishes the date. */
  isoDate?: string;
  /** Shown after "Date to come" when there's no date yet ("usually late May"). */
  usually?: string;
  files: DateFile[];
}

const file = (slot: DateFile['slot'], label: string, url?: string): DateFile[] => (url ? [{ slot, label, url }] : []);

/** The labels each slot can take (the block keeps invisible copies, so the columns hold their width). */
export const DATE_SLOTS = [
  ['Report', 'Annual report', 'Notice'],
  ['Presentation', 'ESEF', 'Minutes'],
  ['Webcast'],
];

function filesFor(m: CalendarDate): DateFile[] {
  const results = m.title.match(/^Q([1-4]) (\d{4}) results$/);
  if (results) {
    const r = quarterlyReleases.find((x) => x.quarter === Number(results[1]) && x.year === Number(results[2]));
    return [...file(0, 'Report', r?.report), ...file(1, 'Presentation', r?.presentation), ...file(2, 'Webcast', r?.webcast)];
  }
  const annual = m.title.match(/^Annual report (\d{4})$/);
  if (annual) {
    const a = annualReports.find((x) => x.year === Number(annual[1]));
    return [...file(0, 'Annual report', a?.report), ...file(1, 'ESEF', a?.esef)];
  }
  if (m.title.startsWith('Annual general meeting')) {
    const g = generalMeetings.find((x) => x.kind === 'annual' && x.date === m.isoDate);
    return [...file(0, 'Notice', g?.files.notice), ...file(1, 'Minutes', g?.files.minutes)];
  }
  return [];
}

export const financialCalendar: DateRow[] = investorCalendar.map((m) => ({
  title: m.title,
  isoDate: m.confirmed ? m.isoDate : undefined,
  usually: !m.confirmed && m.title === `Annual general meeting ${nextGeneralMeeting.year}` ? nextGeneralMeeting.usually : undefined,
  files: filesFor(m),
}));
