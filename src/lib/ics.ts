// All-day calendar events as a data: URL. Editors only set the label and date; the file is generated.
const vevent = (summary: string, isoDate: string) => {
  const day = isoDate.replace(/-/g, '');
  return [
    'BEGIN:VEVENT',
    `UID:${isoDate}-investors@reachsubsea.com`, `DTSTAMP:${day}T000000Z`,
    `DTSTART;VALUE=DATE:${day}`, `SUMMARY:${summary}`,
    'END:VEVENT',
  ];
};

const calendar = (events: string[]) =>
  'data:text/calendar;charset=utf-8,' +
  encodeURIComponent(['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Reach Subsea//Investors//EN', ...events, 'END:VCALENDAR'].join('\r\n'));

/** One all-day event. */
export function icsHref(summary: string, isoDate: string): string {
  return calendar(vevent(summary, isoDate));
}

/** Several all-day events in one file (Financial calendar: "Add all dates"). */
export function icsAllHref(events: { summary: string; isoDate: string }[]): string {
  return calendar(events.flatMap((e) => vevent(e.summary, e.isoDate)));
}
