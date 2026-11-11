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

/** Background (Q184, client copy 11 Nov 2026): grant, investment and order, as announced. Rich text, all shown. */
export const background = `<p>On 22 October 2024 Reach Subsea announced the award of a EUR 14.3 million grant from the European Union through the Emission Trading System Innovation Fund. A large part of this grant is dedicated towards co-funding of the investment in Reach Remote 3 and 4.</p>
<p>The total investment from Reach Subsea in Reach Remote 3 and 4, ready for commercial operations and after EU funding, is approximately NOK 620 million. Of this, the bank financing related to Reach Remote 3 and 4 covers two-thirds of Reach’s investment.</p>
<p>On 24 September 2025 Reach Subsea announced that it has exercised the first in a series of exclusive options with Kongsberg Maritime for the delivery of the next two uncrewed surface vessels (USVs), Reach Remote 3 and 4. Delivery is scheduled for the second half of 2027. The specifications for Reach Remote 3 and 4 will mirror the first two vessels, with targeted adjustments based on insights gained through the technical qualification programme and recent operational experience.</p>
<p>These deployments represent a major step forward in Reach Subsea’s development of remote operations architecture. In close collaboration with clients, the company has built a robust framework of ocean robotics capabilities, integrating advanced control systems, sensor technologies and remote piloting protocols. This structure enables efficient and safe subsea operations from onshore control centres around the world.</p>`;

/** The project summary as the Innovation Fund publishes it (Q184, client copy 11 Nov 2026): word for word, so the
 * first paragraph shows and the rest sits behind Read more. */
export const projectSummary = {
  lead: `<p>Reach Remote seeks to transform subsea and offshore operations through advanced remote and autonomous technologies. The project’s Uncrewed Surface Vessels (USVs) have a potential Greenhouse Gas (GHG) emission reduction of up to 90% compared to traditional manned vessels, including reduced black carbon, methane and nitrous oxide emissions due to the smaller size of installed engines. The project’s remote-controlled and optimised system will deliver the same high-quality service while substantially decreasing the associated environmental impact.</p>`,
  more: `<p>Reach Remote’s approach surpasses current industry standards by integrating automation and electrification in USVs. While conventional offshore operations require crewed vessels with high emissions, Reach Remote’s autonomous technology enables real-time control from onshore, reducing operational costs, personnel risks, and environmental impact. Key pathways include electrification, digitalisation, and advanced robotics, which create new applications for renewable energy and offshore inspection sectors. Reach Remote reduces GHG emissions by removing the need for manned vessels in routine operations, potentially saving emissions equivalent to the annual energy use of about 12 000 individual European Union and EEA households. This solution highlights a significant advance towards climate-neutral offshore operations.</p>
<p>The project promotes policies on decarbonising the maritime sector, safe offshore operations, and advancing energy efficiency and infrastructure resilience to achieve net-zero emissions in Europe by 2050. By deploying electrification and automation in traditional sectors, Reach Remote contributes to the international agenda on emission reductions, showcasing how technology-driven GHG cuts can lead to a sustainable maritime industry. The project positively impacts biological diversity and will prevent and limit noise, air, and water pollution.</p>
<p>Reach Remote will enhance the maritime sector by employing European land operators and shipyards and creating automation, remote operations, and robotics jobs. This will reinforce Europe’s leadership in sustainable maritime innovation. The project can potentially develop different transport networks, improve services in remote areas, and build a more flexible supply chain.</p>`,
};

/** The project coordinator, as the grant's communication rules list them (Q184). */
export const coordinator = { name: 'Christer Hollekim', country: 'Norway', email: 'christer.hollekim@reachsubsea.com' };
