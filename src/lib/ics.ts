// One all-day calendar event as a data: URL. Editors only set the label and date; the file is generated.
export function icsHref(summary: string, isoDate: string): string {
  const day = isoDate.replace(/-/g, '');
  return (
    'data:text/calendar;charset=utf-8,' +
    encodeURIComponent(
      [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Reach Subsea//Investors//EN', 'BEGIN:VEVENT',
        `UID:${isoDate}-investors@reachsubsea.com`, `DTSTAMP:${day}T000000Z`,
        `DTSTART;VALUE=DATE:${day}`, `SUMMARY:${summary}`,
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n'),
    )
  );
}
