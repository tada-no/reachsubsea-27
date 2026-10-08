// Short dates for investor documents (7 Oct 2026): "18 Aug 2026", "Feb 2017", "2016". Fixed three-letter months,
// because en-GB `toLocaleDateString` now prints "Sept" in some runtimes.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A full ("2026-08-18") or partial ("2017-02", "2016") ISO date as a short date. */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!m) return y;
  const month = MONTHS[Number(m) - 1];
  return d ? `${Number(d)} ${month} ${y}` : `${month} ${y}`;
}
