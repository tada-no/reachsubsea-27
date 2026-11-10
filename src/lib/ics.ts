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

/** One timed event (the results webcast, Q181). Start and end as ISO with an offset; written in UTC. */
export function icsTimedHref(summary: string, startIso: string, endIso: string, url?: string): string {
  const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const start = utc(startIso);
  return calendar([
    'BEGIN:VEVENT',
    `UID:${start}-webcast@reachsubsea.com`, `DTSTAMP:${start}`,
    `DTSTART:${start}`, `DTEND:${utc(endIso)}`, `SUMMARY:${summary}`,
    ...(url ? [`URL:${url}`] : []),
    'END:VEVENT',
  ]);
}
