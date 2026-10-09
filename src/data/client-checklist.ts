// Client checklist (prototype only, not for WordPress; Ross, 9 Oct 2026). What Reach still has to send, confirm or
// decide before launch, as a page on the prototype (/client-checklist/) so the client needs no Claude sign-in. They
// answer by email: each item's link opens a message to Ross with "Reach checklist <n>: <subject>" as the subject, so
// the morning sync task (reach-client-sync) can match the reply to the item and move its status.
// Item numbers are stable: never renumber; a new item takes the next free number, a dropped one keeps its gap.
// Statuses only, never the client's answers: the repo and the prototype are public.

export type ChecklistStatus = 'open' | 'received' | 'done';

export interface ChecklistItem {
  /** Stable number, used in the email subject. */
  n: number;
  /** A few words for the email subject. */
  subject: string;
  text: string;
  /** The pages the item affects. */
  pages?: string;
  status: ChecklistStatus;
}

export interface ChecklistGroup {
  title: string;
  intro?: string;
  items: ChecklistItem[];
}

export const checklistEmail = 'ross@tada.no';
/** The date the statuses were last checked against the inbox. */
export const checklistUpdated = '2026-10-09';

export const checklistGroups: ChecklistGroup[] = [
  {
    title: 'Needed before launch',
    intro: "The site can't go live until these are done.",
    items: [
      { n: 1, subject: 'Employee quotes', text: 'Send three or more real quotes from employees, crew or trainees. Three sample quotes are standing in for them.', pages: 'Life at Reach', status: 'open' },
      { n: 2, subject: 'Privacy & Cookie Policy', text: "Update your Privacy & Cookie Policy. We moved the current one (March 2023) across as it is, but it describes contact forms and Facebook Pixels the new site doesn't have. It also leaves out the videos, maps, share data and LinkedIn feed, and names no legal basis under GDPR. Send new wording and we'll use it as written.", pages: 'Privacy & Cookie Policy', status: 'open' },
      { n: 3, subject: 'Cookie consent tool', text: 'Choose a cookie consent tool and approve its wording. Videos, the share graph and maps load only after consent.', status: 'open' },
      { n: 4, subject: 'Photo rights', text: 'Confirm you have the rights to use every photo on the site at launch, including photos of people.', status: 'open' },
      { n: 5, subject: '3D World hosting', text: 'Agree where the 3D World will be hosted, on a server Reach owns.', status: 'done' },
      { n: 6, subject: 'Benefits package', text: 'Send the benefits package.', pages: 'Why work with us', status: 'open' },
      { n: 7, subject: 'Transparency Act wording', text: "Have your legal adviser check the Transparency Act wording. It currently describes a Californian law rather than Norway's Åpenhetsloven.", pages: 'Transparency Act', status: 'open' },
    ],
  },
  {
    title: 'Wording to check and approve',
    intro: "We wrote some text where we had none from you. Please read it and correct anything that isn't right.",
    items: [
      { n: 8, subject: 'FAQ answers and page introductions', text: 'The FAQ answers and the short introductions under page titles.', pages: 'FAQ and most pages', status: 'open' },
      { n: 9, subject: 'Service descriptions', text: 'The service descriptions, scope lists and project-lifecycle stages.', pages: 'Services, Subsea, Survey, Monitoring, Technology & Innovation', status: 'open' },
      { n: 10, subject: 'Product icons', text: 'Which icon goes with each product: Reach Pilot, Reach Remote, Reach Horizon and Reach Relay.', pages: 'Technology & Innovation', status: 'open' },
      { n: 11, subject: 'Leave no one behind', text: '"Leave no one behind" as the short form of your value "never leave anyone behind".', pages: 'Careers', status: 'open' },
      { n: 12, subject: 'HOP principles', text: "The five Human and Organisational Performance (HOP) principles. These are the industry's standard principles, not a Reach programme.", pages: 'Our culture', status: 'open' },
      { n: 13, subject: 'Offices and countries', text: '"8 offices in 4 countries". The design said "nine countries", which is where you have worked.', pages: 'Our culture, Why work with us', status: 'open' },
      { n: 14, subject: 'Life at Reach details', text: 'Life at Reach details: the Husøy technical base, the workshop location and how rotations work.', pages: 'Life at Reach', status: 'open' },
      { n: 15, subject: '3D World zones', text: 'The 3D World zone descriptions and the careers stops.', pages: 'Explore 3D World, Careers', status: 'open' },
      { n: 16, subject: 'Research publications', text: 'How the research publications are grouped by topic, and whether there are 48 or 49 of them.', pages: 'Research & Publications', status: 'open' },
      { n: 17, subject: 'Q4 2025 report spellings', text: 'Spellings in the Q4 2025 report: "Rech Remote" should read "Reach Remote", and "Pyreenes" should read "Pyrenees". Also tell us what "100% remote vessel utilized" means.', pages: 'Projects', status: 'open' },
      { n: 18, subject: 'Page not found and Popular links', text: 'The wording on the "page not found" page, and the five Popular links under the search box: Fleet overview, Reports & presentations, Open positions, Explore 3D World and Contact. You can change these links yourselves after launch.', pages: 'Search, Page not found', status: 'open' },
    ],
  },
  {
    title: 'Figures and dates to confirm',
    items: [
      { n: 19, subject: 'Headcount', text: 'Headcount: the live site says 400, the design says 500+. We use 500+.', pages: 'Home and other pages', status: 'open' },
      { n: 20, subject: 'Uncrewed days and fuel saving', text: '"~750 uncrewed operational days": is it a running total, and since when? Also, where does the 90% fuel saving figure come from?', pages: 'Home, Why invest, Why work with us', status: 'open' },
      { n: 21, subject: '2027 financial dates', text: 'The 2027 dates for the annual report, the Q1 results and the AGM. They show as "Date to come" until then.', pages: 'Financial calendar', status: 'open' },
      { n: 22, subject: 'Publication dates', text: 'Publication dates in our data: annual report 2025 (30 Apr or 26 Mar?), Q1 2026 (5 May or 24 Apr?) and Q4 2025 (12 or 13 Feb?).', pages: 'Investors', status: 'open' },
      { n: 23, subject: 'Diversity figures and emissions base year', text: 'Current diversity figures: women on the Board, in management and in the workforce (18%?), plus the base year for the 45% emissions target.', pages: 'Sustainability', status: 'open' },
      { n: 24, subject: 'Hilde Drønen board year', text: 'The year Hilde Drønen joined the Board.', pages: 'Leadership & Board', status: 'open' },
      { n: 25, subject: 'Charter details', text: "Charter details: Offshore Surveyor's 6-month options, the firm periods for Viking Vigor and NB76, and permission to show each vessel's status.", pages: 'Charter agreements, Assets', status: 'open' },
      { n: 26, subject: 'Supporter WROV depth rating', text: 'The Supporter WROV depth rating.', pages: 'Subsea', status: 'open' },
      { n: 27, subject: 'News post dates', text: 'Dates for the 15 news posts whose date we could only estimate, and whether to keep the 11 undated posts (we suggest dropping them).', pages: 'Newsroom', status: 'open' },
      { n: 28, subject: 'Ocean Business 2027', text: 'Ocean Business 2027 details and the event web address.', pages: 'Home', status: 'open' },
    ],
  },
  {
    title: 'Files and links to send',
    items: [
      { n: 29, subject: 'Q2 2026 files and annual report 2025', text: 'Q2 2026 report, presentation and webcast links. Also the title and file of the 2025 annual report.', pages: 'Home, Investors, Why invest', status: 'open' },
      { n: 30, subject: 'Sustainability report 2025', text: 'Sustainability report 2025 (PDF).', pages: 'Home, Sustainability', status: 'open' },
      { n: 31, subject: 'Webcast links and Q1 2021 report', text: 'Webcast links for Q4 2025, Q1 2026 and Q2 2026, and the correct Q1 2021 report file.', pages: 'Reports & presentations', status: 'open' },
      { n: 32, subject: 'AGM 2017 minutes and articles', text: 'Minutes of the 29 May 2017 AGM, and an English version of the articles of association.', pages: 'Governance & general meetings', status: 'open' },
      { n: 33, subject: 'HSEQ campaign posters', text: 'The original PDFs of the 18 HSEQ campaign posters. Stand-ins are in place for now.', pages: 'HSEQ campaigns', status: 'open' },
      { n: 34, subject: 'ISO certificates', text: 'ISO certificate PDFs.', pages: 'HSEQ', status: 'open' },
      { n: 35, subject: 'Spec sheets', text: 'Vessel and equipment spec sheets (PDF).', pages: 'Assets, Survey, Monitoring', status: 'open' },
      { n: 36, subject: 'Trainee programme link', text: 'Where the "Learn about the trainee programme" button should go: a new page or an existing one.', pages: 'Careers', status: 'open' },
      { n: 37, subject: 'Sponsorship portal', text: 'The sponsorship application portal address.', pages: 'Sponsorship', status: 'open' },
      { n: 38, subject: 'Current website addresses', text: 'Your current website addresses, so old links can be redirected to the new pages.', status: 'open' },
    ],
  },
  {
    title: 'Photos and video',
    items: [
      { n: 39, subject: 'Project photos at full size', text: 'Full-size original photos, at least 1240 px wide, for the project pages. The copies we have are too small: U-864, the 36-inch pipeline, Scarborough, the FPSO inspection, Ormen Lange, the Balder thruster and Njord A.', pages: 'Projects', status: 'open' },
      { n: 40, subject: 'Project photo check', text: 'Check that each project photo shows the right job. A few may not, for example the decommissioning, fibre-optic and Black Sea photos.', pages: 'Projects', status: 'open' },
      { n: 41, subject: 'HSEQ hero photo', text: 'A landscape version of the HSEQ hero photo.', pages: 'HSEQ', status: 'open' },
      { n: 42, subject: 'Careers photos', text: 'A calm careers hero photo without people, and a better team photo.', pages: 'Careers', status: 'open' },
      { n: 43, subject: 'ASUMO photo', text: 'A photo of ASUMO. It currently borrows the gWatch photo.', pages: 'Monitoring', status: 'open' },
      { n: 44, subject: 'Product films', text: "The films for Reach Remote's control centre and Reach Pilot, and the gWatch video link. The promo film stands in for them.", pages: 'Technology & Innovation, Monitoring', status: 'open' },
      { n: 45, subject: 'Q2 2026 webcast clip', text: 'The Q2 2026 webcast, for the CEO video clip.', pages: 'Home', status: 'open' },
      { n: 46, subject: 'News image backup', text: 'Optional: a backup of the news images that are broken on the current site.', pages: 'Newsroom', status: 'open' },
      { n: 47, subject: 'News photo alt text', text: 'Optional: short descriptions (alt text) for the news photos, for people using screen readers. None of the current posts have them.', pages: 'Newsroom', status: 'open' },
    ],
  },
  {
    title: 'People and quotes',
    items: [
      { n: 48, subject: 'Press quotes on careers pages', text: 'Permission to reuse the press quotes on the careers pages.', pages: 'Life at Reach', status: 'open' },
      { n: 49, subject: 'CEO quote', text: 'Approval of the CEO quote.', pages: 'Home, Investors', status: 'open' },
      { n: 50, subject: 'Management contact details', text: 'The direct phone number and email for each person in the management team.', pages: 'Leadership & Board, About', status: 'open' },
      { n: 51, subject: "Martha Kold Monclair's company", text: "Martha Kold Monclair's company: MKOLD AS or MMOLD AS?", pages: 'Leadership & Board', status: 'open' },
      { n: 52, subject: 'Survey and Monitoring contacts', text: 'A named contact for Survey and one for Monitoring.', pages: 'Survey, Monitoring', status: 'open' },
      { n: 53, subject: 'Careers recruiter', text: 'Confirm the recruiter shown on the careers pages, Alexander Nygård Bakke.', pages: 'Careers', status: 'open' },
      { n: 54, subject: 'Visa and rotation answers', text: 'Permission to publish the visa sponsorship and rotation answers from the old dev site.', pages: 'Careers FAQ', status: 'open' },
    ],
  },
  {
    title: 'Accounts and services',
    intro: "These connect the site to live data. Sample data is shown until they're set up.",
    items: [
      { n: 55, subject: 'Live operations map', text: 'Live operations map: approve showing regions and generic labels only (no positions, clients or vessel names), and choose the vessel-tracking (AIS) and map provider.', pages: 'Home, Assets', status: 'open' },
      { n: 56, subject: 'LinkedIn feed', text: 'LinkedIn feed: the account or embed tool for the latest posts.', pages: 'Home', status: 'open' },
      { n: 57, subject: 'HR-Manager feed', text: 'HR-Manager: access to the vacancies feed.', pages: 'Careers', status: 'open' },
      { n: 58, subject: 'Share graph', text: 'Euronext / OMS: ask for a compact share graph.', pages: 'Share information, Investors', status: 'open' },
      { n: 59, subject: 'Video hosting', text: 'Video and webcast hosting (YouTube, Vimeo or qcnl.tv), with captions on every film with speech.', status: 'open' },
      { n: 60, subject: 'Old 3D World address', text: 'Decide what happens to world.reachsubsea.com, the old 3D World address.', status: 'open' },
    ],
  },
  {
    title: 'Decisions for Reach',
    items: [
      { n: 61, subject: 'Projects in the main menu', text: 'Should Projects appear in the main menu? That would make eight items instead of seven.', status: 'open' },
      { n: 62, subject: 'Services and Assets menus', text: 'Approve Services and Assets as separate menu sections. This differs from the design and the original sitemap.', status: 'open' },
      { n: 63, subject: 'Technology & Innovation in the menu', text: 'Approve where Technology & Innovation sits in the menu.', status: 'open' },
      { n: 64, subject: 'Main email address', text: 'Main email address: post@reachsubsea.com or post@reachsubsea.no? We use .com, and hseq@reachsubsea.com for HSEQ.', status: 'open' },
      { n: 65, subject: 'Career growth and Meet our people cards', text: 'Keep or drop the "Career growth" and "Meet our people" cards. They have no pages behind them yet.', pages: 'Careers', status: 'open' },
      { n: 66, subject: 'Pages planned for later', text: 'Approve the pages planned for later: Reach Pilot, Reach Horizon, Reach Relay, Reach Remote 3 & 4 and the publication detail pages.', status: 'open' },
    ],
  },
];

/** "Reach checklist 12: HOP principles", the subject the sync task matches on. */
export const checklistSubject = (item: ChecklistItem) => `Reach checklist ${item.n}: ${item.subject}`;

export const checklistMailto = (item?: ChecklistItem) => {
  const subject = item ? checklistSubject(item) : 'Reach checklist';
  const body = item ? `Item ${item.n}: ${item.text}\n\nAnswer:\n` : 'Item numbers and answers:\n';
  return `mailto:${checklistEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
