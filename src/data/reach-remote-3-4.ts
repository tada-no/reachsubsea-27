// Reach Remote 3 & 4: build and EU funding status (11 Oct 2026, Q169; client screens PDF p26–27, design reference p12).
// The page the EU Innovation Fund grant's communication duties point to. The editor updates it at each reporting date:
// `reportingDate`, `spend` and the milestones' statuses, from the latest quarterly report's notes on assets under
// construction. Every figure here comes from a source named beside it; nothing is estimated.
// Sources: NEWS 22 Oct 2024 (grant: up to EUR 14.3 million, Net Zero Technologies), NEWS 24 Sep 2025 (order from
// Kongsberg Maritime; specs "will mirror the first two vessels, with targeted adjustments"; bank financing DNB,
// SpareBank 1 Sør-Norge, Eksfin), NEWS 24 Sep 2026 ("expected to enter operation in 2027"), Q2 2026 report p30, p40,
// p54 (NOK 622.7 million in total; NOK 252.8 million capitalised and NOK 369.9 million to complete at 30 June 2026;
// NOK 62.3 million of EU funding received in the first half of 2026).
// Not known yet (client checklist): the grant agreement number and the project's name under the Innovation Fund, and
// dated build stages (design, hull, systems integration, sea trials) from the operations team. Add them here; empty
// spec rows and milestones simply don't render.
import type { MilestoneField } from '../blocks/Timeline.astro';

/** The quarter end the page reports at. */
export const reportingDate = '30 June 2026';

/** Project facts (Split media Spec table). Facts that don't change per quarter; dated events are milestones. */
export const projectFacts: { label: string; value: string }[] = [
  { label: 'Vessels', value: 'Reach Remote 3 and 4' },
  { label: 'Builder', value: 'Kongsberg Maritime' },
  { label: 'In operation', value: '2027, expected' },
  { label: 'Project cost', value: 'About NOK 622.7 million' },
  { label: 'EU funding', value: 'Up to EUR 14.3 million' },
  { label: 'Programme', value: 'EU Innovation Fund' },
  { label: 'Coordinator', value: 'Reach Subsea ASA' },
];

/** Invested so far against the project total, NOK million (Share bars: one bar, the latest reporting date). */
export const spend = { invested: 252.8, toComplete: 369.9 };
export const spendShare = Math.round((spend.invested / (spend.invested + spend.toComplete)) * 100);

/** Build timeline, oldest first. Status set by hand: only the editor knows when a stage is done. */
export const milestones: MilestoneField[] = [
  {
    date: 'October 2024',
    title: 'EU Innovation Fund grant',
    text: 'Awarded under the Net Zero Technologies call to scale up Reach Remote, most of it towards these two vessels.',
    status: 'done',
  },
  {
    date: 'September 2025',
    title: 'Ordered from Kongsberg Maritime',
    text: 'The first of a series of exclusive options, with bank financing from DNB, SpareBank 1 Sør‑Norge and Eksfin.',
    status: 'done',
  },
  {
    date: 'First half of 2026',
    title: 'First EU funding received',
    text: 'NOK 62.3 million from the Innovation Fund towards the build.',
    status: 'done',
  },
  {
    date: reportingDate,
    title: 'In build',
    text: 'Both vessels under construction at Kongsberg Maritime.',
    status: 'current',
  },
  {
    date: '2027',
    title: 'Into operation',
    text: 'Reach Remote 3 and 4 join Reach Remote 1 and 2 in service.',
    status: 'upcoming',
  },
];
