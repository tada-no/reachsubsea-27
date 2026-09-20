// Key figures options page (brief §5.3): one repeater (value, label, note, key). Blocks pick keys, so a
// figure is edited once for the whole site (Stats band). Values are the client's real, current
// company facts from the Design Reference PDF's Home quick-facts strip (Q45, 16 Sep 2026), which
// replaced the earlier placeholder set (employees/vessels/operating-modes/remote-centre).
import type { StatField } from '../lib/types';

export const keyFigures: StatField[] = [
  { key: 'established', value: '2008', label: 'Established' },
  { key: 'fleet', value: '11', label: 'Vessels in the fleet' },
  { key: 'people', value: '500+', label: 'People offshore and onshore' },
  { key: 'countries', value: '9', label: 'Countries reached' },
  { key: 'uncrewed-days', value: '750+', label: 'Uncrewed operational days, per quarter' },
  // Design Reference PDF p10: 13 WROV + 2 Surveyor Interceptor, cited to the 2Q 2026 Report (added 17 Sep 2026)
  { key: 'rov-systems', value: '15', label: 'ROV systems' },
  // Design Reference PDF p10 and p18, 2Q 2026: kept distinct from Countries reached (offices = physical locations)
  { key: 'offices', value: '8', label: 'Offices' },
  // Design Reference PDF p30 (About us, "8, in 4 countries"): Norway, UK, Singapore and Australia.
  // Distinct from Countries reached (clients in 9 countries). Added 19 Sep 2026
  { key: 'office-countries', value: '4', label: 'Countries with an office' },
  { key: 'newbuilds', value: '4', label: 'Newbuilds joining the fleet' },
  // Live /careers/ Trainees block ("Since 2013 … each trainee who successfully completes their final exams
  // … has been offered a full-time position") and the PDF's Careers stats (p22: 2013, 100%). Added 20 Sep 2026
  { key: 'trainee-since', value: '2013', label: 'Trainee programme since' },
  { key: 'trainee-offer', value: '100%', label: 'Trainees offered a full-time role' },
];

/** Returns the figures for the given keys, in that order, skipping unknown keys. */
export function pickFigures(keys: string[]): StatField[] {
  return keys.flatMap((key) => keyFigures.filter((figure) => figure.key === key));
}
