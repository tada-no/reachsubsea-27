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
  // PLACEHOLDER wording (7 Oct 2026, Ross): the Q2 2026 report (p18) gives "~750 uncrewed operations days" with no
  // period, a running total (two Reach Remote vessels cannot log more than ~182 days a quarter). The Design Reference
  // PDF's "750+ … per quarter" is dropped until Reach confirms the period.
  { key: 'uncrewed-days', value: '~750', label: 'Uncrewed operational days to date' },
  // Design Reference PDF p10: 13 WROV + 2 Surveyor Interceptor, cited to the 2Q 2026 Report (added 17 Sep 2026)
  { key: 'rov-systems', value: '15', label: 'ROV systems' },
  // Design Reference PDF p10 and p18, 2Q 2026: kept distinct from Countries reached (offices = physical locations)
  { key: 'offices', value: '8', label: 'Offices' },
  // Design Reference PDF p30 (About us, "8, in 4 countries"): Norway, UK, Singapore and Australia.
  // Distinct from Countries reached (clients in 9 countries). Added 19 Sep 2026
  { key: 'office-countries', value: '4', label: 'Countries with an office' },
  { key: 'newbuilds', value: '4', label: 'Newbuilds joining the fleet' },
  // Design Reference PDF p15 (Technology & Innovation), from the 2Q 2026 Report: Reach Remote's fuel saving against a crewed vessel, and Reach Relay's speed against the third-party link it replaced (6 Oct 2026)
  { key: 'fuel-saving', value: '90%', label: 'Fuel saving versus a crewed vessel, up to' },
  { key: 'relay-speed', value: '25x', label: 'Faster than the third-party solution it replaces, up to' },
  // Client PDF p36 (Sustainability stats bar and the Environmental pillar): the Paris-aligned 2030 target (7 Oct 2026)
  { key: 'ghg-target', value: '45%', label: 'GHG emission cut targeted by 2030' },
  // Live /careers/ Trainees block ("Since 2013 … each trainee who successfully completes their final exams
  // … has been offered a full-time position") and the PDF's Careers stats (p22: 2013, 100%). Added 20 Sep 2026
  { key: 'trainee-since', value: '2013', label: 'Trainee programme since' },
  { key: 'trainee-offer', value: '100%', label: 'Trainees offered a full-time role' },
];

/** Returns the figures for the given keys, in that order, skipping unknown keys. */
export function pickFigures(keys: string[]): StatField[] {
  return keys.flatMap((key) => keyFigures.filter((figure) => figure.key === key));
}
