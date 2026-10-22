// Client checklist (prototype only, not for WordPress; Ross, 9 Oct 2026). What Reach still has to send, confirm or
// decide before launch, as a page on the prototype (/client-checklist/) so the client needs no Claude sign-in. They
// answer by email: each item's link opens a message to Ross with "Reach checklist <n>: <subject>" as the subject, so
// the weekday sync task (reach-checklist-sync) can match the reply to the item and move it from open to progress.
// Statuses: open → progress (In progress: an answer has arrived, or, on the client's own browser only, they clicked
// Answer by email) → done (acted on; set by hand or by the fix's commit).
// Items are numbered 1, 2, 3… in page order, with no gaps (Ross, 13 Oct 2026): a dropped or added item renumbers the
// rest. The email subject also carries the item's subject, so the sync task can match a reply sent before a renumber.
// Statuses only, never the client's answers: the repo and the prototype are public.

export type ChecklistStatus = 'open' | 'progress' | 'done';

export interface ChecklistItem {
  /** Stable number, used in the email subject. */
  n: number;
  /** A few words for the email subject. */
  subject: string;
  text: string;
  /** The pages the item affects: a page name from checklistPages, with an optional #section on it
   * ('Careers#values'), or plain words with no link ('most pages'). */
  pages?: string[];
  status: ChecklistStatus;
}

export interface ChecklistGroup {
  title: string;
  intro?: string;
  items: ChecklistItem[];
}

/** Where each page name links, relative to the site base. */
export const checklistPages: Record<string, string> = {
  Home: '',
  About: 'company/',
  'Leadership & Board': 'company/leadership-board/',
  HSEQ: 'company/hseq/',
  'HSEQ campaigns': 'company/hseq/campaigns/',
  Sustainability: 'company/sustainability/',
  Sponsorship: 'company/sustainability/sponsorship/',
  Services: 'services/',
  Subsea: 'services/subsea/',
  Survey: 'services/survey/',
  Monitoring: 'services/monitoring/',
  'Technology & Innovation': 'services/technology-innovation/',
  'Research & Publications': 'services/technology-innovation/research-publications/',
  Assets: 'assets/',
  'Reach Remote 3 & 4': 'assets/reach-remote/3-4/',
  'Explore 3D World': '3d-world/explore/',
  Projects: 'projects/',
  Investors: 'investors/',
  'Why invest': 'investors/why-invest/',
  'Charter agreements': 'investors/charter-agreements/',
  'Financial calendar': 'investors/financial-calendar/',
  'Reports & presentations': 'investors/reports-presentations/',
  'Share information': 'investors/share-information/',
  'Governance & general meetings': 'investors/governance-meetings/',
  Careers: 'careers/',
  'Life at Reach': 'careers/life-at-reach/',
  'Our culture': 'careers/our-culture/',
  'Why work with us': 'careers/why-work-with-us/',
  'Careers FAQ': 'faq/#careers',
  Newsroom: 'newsroom/',
  'Press & media': 'newsroom/press-media/',
  FAQ: 'faq/',
  Search: 'search/',
  'Page not found': '404.html',
  'Privacy & Cookie Policy': 'privacy-policy/',
  'Transparency Act': 'transparency-act/',
};

/** A page entry as a label and, when the page is known, its path with the section anchor. */
export const checklistPageLink = (entry: string) => {
  const [label, anchor] = entry.split('#');
  const path = checklistPages[label];
  return { label, path: path === undefined ? undefined : path + (anchor ? `#${anchor}` : '') };
};

export const checklistEmail = 'ross@tada.no';
/** The date the statuses were last checked against the inbox. */
export const checklistUpdated = '2026-10-22';

export const checklistGroups: ChecklistGroup[] = [
  {
    title: 'Needed before launch',
    intro: "The site can't go live until these are done.",
    items: [
      { n: 1, subject: 'Employee quotes', text: "Can you send three or more real quotes from employees, crew or trainees? Three sample quotes are standing in for them.", pages: ['Life at Reach#in-their-own-words'], status: 'open' },
      { n: 2, subject: 'Privacy & Cookie Policy', text: "Can you send new wording for your Privacy & Cookie Policy? We moved the current one (March 2023) across as it is, but it describes contact forms and Facebook Pixels the new site doesn't have. It also leaves out the videos, maps, share data and LinkedIn feed, and names no legal basis under GDPR. We'll use your new wording as written.", pages: ['Privacy & Cookie Policy'], status: 'open' },
      { n: 3, subject: 'Cookie consent tool', text: "Which cookie consent tool should the site use, and do you approve the wording it shows visitors? Videos, the share graph and maps load only after consent.", status: 'open' },
      { n: 4, subject: 'Benefits package', text: "Can you send the benefits package?", pages: ['Why work with us#reasons'], status: 'open' },
      { n: 5, subject: 'Transparency Act wording', text: "Can your legal adviser check the Transparency Act wording? The second paragraph calls the Act the \"Transparency in Supply Chains Act\" (a California law) and frames it around trafficking and modern slavery. Norway's Åpenhetsloven is about human rights and decent working conditions.", pages: ['Transparency Act'], status: 'open' },
    ],
  },
  {
    title: 'Wording to check and approve',
    intro: "We wrote some text where we had none from you. Please read it and correct anything that isn't right.",
    items: [
      { n: 6, subject: 'FAQ answers and page introductions', text: "Are the FAQ answers and the short introductions under page titles right?", pages: ['FAQ', 'most pages'], status: 'open' },
      { n: 7, subject: 'Service descriptions', text: "Are the service descriptions, scope lists and project-lifecycle stages right?", pages: ['Services#service-lines', 'Subsea#what-we-do', 'Survey#what-we-do', 'Monitoring#what-we-do', 'Technology & Innovation#investing'], status: 'open' },
      { n: 8, subject: 'Leave no one behind', text: 'Can we use "Leave no one behind" as the short form of your value "never leave anyone behind"?', pages: ['Careers#values'], status: 'open' },
      { n: 9, subject: 'HOP principles', text: "Does Reach work by the five Human and Organisational Performance (HOP) principles, and should they stay on Our culture? The design lists them, but they're the industry's standard principles, not a Reach programme.", pages: ['Our culture#hop'], status: 'open' },
      { n: 10, subject: 'Offices and countries', text: 'Is "8 offices in 4 countries" right? The design said "nine countries", which is where you have worked.', pages: ['Our culture', 'Why work with us#reasons'], status: 'open' },
      { n: 11, subject: 'Life at Reach details', text: "Are the Life at Reach details right: the Husøy technical base, the workshop location and how rotations work?", pages: ['Life at Reach#where-you-work'], status: 'open' },
      { n: 12, subject: '3D World zones', text: "Are the 3D World zone descriptions and the careers stops right?", pages: ['Explore 3D World', 'Careers#try-it-in-3d'], status: 'open' },
      { n: 13, subject: 'Research publications', text: "Is the grouping of the research publications by topic right, and are there 48 or 49 of them?", pages: ['Research & Publications#library'], status: 'open' },
      { n: 14, subject: 'Q4 2025 report spellings', text: 'Can we correct two spellings in the Q4 2025 report: "Rech Remote" to "Reach Remote", and "Pyreenes" to "Pyrenees"? And what does "100% remote vessel utilized" mean?', pages: ['Projects'], status: 'open' },
      { n: 15, subject: 'Page not found and Popular links', text: 'Is the wording on the "page not found" page right, and are these the right five Popular links under the search box: Fleet overview, Reports & presentations, Open positions, Explore 3D World and Contact? You can change these links yourselves after launch.', pages: ['Search', 'Page not found'], status: 'open' },
    ],
  },
  {
    title: 'Figures and dates to confirm',
    items: [
      { n: 16, subject: 'Headcount', text: "What headcount should we use? The live site says 400, the design says 500+. We use 500+.", pages: ['Home', 'other pages'], status: 'open' },
      { n: 17, subject: 'Uncrewed days and fuel saving', text: 'Is "~750 uncrewed operational days" a running total, and since when? And where does the 90% fuel saving figure come from?', pages: ['Home', 'Why invest', 'Why work with us#reasons'], status: 'open' },
      { n: 18, subject: '2027 financial dates', text: 'What are the 2027 dates for the annual report, the Q1 results and the AGM? They show as "Date to come" until then.', pages: ['Financial calendar#key-dates'], status: 'open' },
      { n: 19, subject: 'Publication dates', text: "Which publication dates are right: annual report 2025 (30 Apr or 26 Mar), Q1 2026 (5 May or 24 Apr) and Q4 2025 (12 or 13 Feb)?", pages: ['Investors#investor-year'], status: 'open' },
      { n: 20, subject: 'Diversity figures and emissions base year', text: "What are the current diversity figures for women on the Board, in management and in the workforce (18%?), and what is the base year for the 45% emissions target?", pages: ['Sustainability#esg'], status: 'open' },
      { n: 21, subject: 'Hilde Drønen board year', text: "What year did Hilde Drønen join the Board?", pages: ['Leadership & Board#board'], status: 'done' },
      { n: 22, subject: 'Charter details', text: "What are Offshore Surveyor's 6-month options and the firm periods for Viking Vigor and NB76? And can we show each vessel's charter status?", pages: ['Charter agreements#timeline', 'Assets#vessels'], status: 'open' },
      { n: 23, subject: 'Supporter WROV depth rating', text: "What is the Supporter WROV's depth rating?", pages: ['Subsea#how-we-deliver'], status: 'open' },
      { n: 24, subject: 'News post dates', text: "Can you send dates for the 15 news posts whose date we could only estimate? And should we keep the 11 undated posts? We suggest dropping them.", pages: ['Newsroom'], status: 'open' },
      { n: 25, subject: 'Ocean Business 2027', text: "What are the details and web address for Ocean Business 2027?", pages: ['Home'], status: 'open' },
      { n: 26, subject: 'Brand colour print values', text: "What are the right print values from your brand manual? Two on the current Press & Media page look wrong: Primary navy's CMYK (9, 90, 30, 28 prints as a red-purple) and S3's Pantone (7443 C, the same as P3).", pages: ['Press & media#brand-assets'], status: 'open' },
      { n: 27, subject: 'Reach Remote 3 & 4 funding and build details', text: "What are the grant agreement number and the project's name under the EU Innovation Fund? And can the operations team give dates for the build stages?", pages: ['Reach Remote 3 & 4'], status: 'open' },
    ],
  },
  {
    title: 'Files and links to send',
    items: [
      { n: 28, subject: 'Q1 2021 report', text: "Can you send the Q1 2021 report? Your current site's Report link for that quarter opens the presentation.", pages: ['Reports & presentations'], status: 'done' },
      { n: 29, subject: 'AGM 2017 minutes and articles', text: "Can you send the minutes of the 29 May 2017 AGM, and an English version of the articles of association? Your current site's 2017 minutes link opens the notice of the February 2017 extraordinary meeting, and the articles are only in Norwegian.", pages: ['Governance & general meetings#general-meetings'], status: 'open' },
      { n: 30, subject: 'HSEQ campaign posters', text: "Can you send the original PDFs of the five HSEQ campaign posters we still miss: Q4 2021 and Q1 to Q4 2022? The other posters now use your originals; these five have stand-ins for now.", pages: ['HSEQ campaigns'], status: 'progress' },
      { n: 31, subject: 'Spec sheets', text: "Do you have spec sheets (PDF) for the other vessels and the Supporter WROV? We link the six on your current site: Havila Subsea, Surveyor Interceptor, HD WROV, Constructor WROV, ZEEROV and the Reach Remote brochure.", pages: ['Assets#vessels', 'Survey#fleet', 'Monitoring'], status: 'done' },
      { n: 32, subject: 'EU emblem file', text: 'Can you send the official "Co-funded by the European Union" emblem file from your grant documents? A stand-in is in place for now.', pages: ['Reach Remote 3 & 4'], status: 'done' },
      { n: 33, subject: 'Trainee programme link', text: 'Where should the "Learn about the trainee programme" button go: a new page or an existing one?', pages: ['Careers#trainees'], status: 'open' },
      { n: 34, subject: 'Sponsorship portal', text: "What is the address of the sponsorship application portal?", pages: ['Sponsorship'], status: 'open' },
      { n: 35, subject: 'Current website addresses', text: "Which address should the new site use, reachsubsea.com or reachsubsea.no? Today reachsubsea.com forwards to reachsubsea.no. And do you use any other addresses, such as campaign domains? Every page on your current site is already mapped to its new page.", status: 'open' },
      { n: 36, subject: 'Logo packs', text: "Are the EPS, PNG and SVG logo packs from March 2023 still current? We link to them as they are. If not, can you send updated packs?", pages: ['Press & media#brand-assets'], status: 'done' },
    ],
  },
  {
    title: 'Photos and video',
    items: [
      { n: 37, subject: 'Project photos at full size', text: "Can you send full-size original photos, at least 1240 px wide, for the project pages? The copies we have are too small: U-864, the 36-inch pipeline, Scarborough, the FPSO inspection, Ormen Lange, the Balder thruster and Njord A.", pages: ['Projects'], status: 'open' },
      { n: 38, subject: 'Project photo check', text: "Does each project photo show the right job? A few may not, for example the decommissioning, fibre-optic and Black Sea photos.", pages: ['Projects'], status: 'open' },
      { n: 39, subject: 'HSEQ hero photo', text: "Can you send a landscape version of the HSEQ hero photo?", pages: ['HSEQ'], status: 'open' },
      { n: 40, subject: 'Careers photos', text: "Can you send a calm careers hero photo without people, and a better team photo?", pages: ['Careers'], status: 'open' },
      { n: 41, subject: 'ASUMO photo', text: "Can you send a photo of ASUMO? It currently borrows the gWatch photo.", pages: ['Monitoring#how-we-deliver'], status: 'open' },
      { n: 42, subject: 'Product films', text: "Can you send the films for Reach Remote's control centre and Reach Pilot, and the gWatch video link? The promo film stands in for them.", pages: ['Technology & Innovation#in-action', 'Monitoring'], status: 'open' },
      { n: 43, subject: 'Q2 2026 webcast clip', text: "Can you send the Q2 2026 webcast? We'll take the CEO video clip from it.", pages: ['Home'], status: 'open' },
      { n: 44, subject: 'News image backup', text: "Optional: can you send a backup of the news images that are broken on the current site?", pages: ['Newsroom'], status: 'open' },
      { n: 45, subject: 'News photo alt text', text: "Optional: can you write short descriptions (alt text) for the news photos, for people using screen readers? None of the current posts have them.", pages: ['Newsroom'], status: 'open' },
      { n: 46, subject: 'Press photo packs', text: "Can you send high-resolution photo packs for the press: vessels, ROVs and operations, Reach Remote, and leadership portraits? Until they arrive, each set has a Request photos link that emails the media team.", pages: ['Press & media#press-photos'], status: 'open' },
      { n: 47, subject: 'Press video', text: "Optional: do you have video footage (b-roll) for the press, of the company and Reach Remote and of the leadership team? The design shows it, but there is no footage to offer yet.", pages: ['Press & media#press-photos'], status: 'open' },
    ],
  },
  {
    title: 'People and quotes',
    items: [
      { n: 48, subject: 'Press quotes on careers pages', text: "Can we reuse the press quotes on the careers pages?", pages: ['Life at Reach#in-their-own-words'], status: 'open' },
      { n: 49, subject: 'CEO quote', text: "Do you approve the CEO quote?", pages: ['Home', 'Investors'], status: 'open' },
      { n: 50, subject: 'Management contact details', text: "What is the direct phone number and email for each person in the management team?", pages: ['Leadership & Board#management', 'About#leadership'], status: 'open' },
      { n: 51, subject: "Martha Kold Monclair's company", text: "Martha Kold Monclair's company: MKOLD AS or MMOLD AS?", pages: ['Leadership & Board#board'], status: 'open' },
      { n: 52, subject: 'Survey and Monitoring contacts', text: "Who should be the named contact for Survey, and who for Monitoring?", pages: ['Survey#contact', 'Monitoring#contact'], status: 'open' },
      { n: 53, subject: 'Careers recruiter', text: "Is Alexander Nygård Bakke the right recruiter to show on the careers pages?", pages: ['Careers#contact'], status: 'open' },
      { n: 54, subject: 'Visa and rotation answers', text: "Can we publish the visa sponsorship and rotation answers from the old dev site?", pages: ['Careers FAQ'], status: 'open' },
      { n: 55, subject: 'Named press contact', text: 'Should the Press & media page name a contact? The current page shows Jorunn Håvardsholm, Group Communications & Marketing Director, with her phone number. The design shows only media@reachsubsea.com, which is what we use.', pages: ['Press & media#contact'], status: 'done' },
    ],
  },
  {
    title: 'Accounts and services',
    intro: "These connect the site to live data. Sample data is shown until they're set up.",
    items: [
      { n: 56, subject: 'Live operations map', text: "For the live operations map, do you approve showing regions and generic labels only (no positions, clients or vessel names)? And which vessel-tracking (AIS) and map provider should we use?", pages: ['Home#live-operations', 'Assets'], status: 'open' },
      { n: 57, subject: 'LinkedIn feed', text: "Which account or embed tool should the LinkedIn feed use for the latest posts?", pages: ['Home'], status: 'open' },
      { n: 58, subject: 'HR-Manager feed', text: "Can you give us access to the HR-Manager vacancies feed? Until then the Careers page shows four sample vacancies, already out of date.", pages: ['Careers#open-positions'], status: 'open' },
      { n: 59, subject: 'Share graph', text: "Can you ask Euronext / OMS for a compact share graph?", pages: ['Share information#share', 'Investors'], status: 'open' },
      { n: 60, subject: 'Video hosting', text: "Where should videos and webcasts be hosted: YouTube, Vimeo or qcnl.tv? Every film with speech will need captions.", status: 'open' },
      { n: 61, subject: 'Old 3D World address', text: "What should happen to world.reachsubsea.com, the old 3D World address?", status: 'open' },
    ],
  },
  {
    title: 'Decisions for Reach',
    items: [
      { n: 62, subject: 'Main email address', text: "Which main email address should we use: post@reachsubsea.com or post@reachsubsea.no? We use .com, and hseq@reachsubsea.com for HSEQ.", status: 'open' },
      { n: 63, subject: 'Career growth and Meet our people cards', text: 'Should we keep or drop the "Career growth" and "Meet our people" cards? They have no pages behind them yet.', pages: ['Careers#more'], status: 'open' },
      { n: 64, subject: 'Pages planned for later', text: "Some pages won't be ready at launch: a page each for Reach Pilot, Reach Horizon and Reach Relay, and a page for each research publication. Until then, the three products are described on Technology & Innovation, and the publications are listed on Research & Publications. Can these pages wait until after launch, or do you need any of them at launch?", pages: ['Technology & Innovation', 'Research & Publications#library'], status: 'open' },
      { n: 65, subject: 'Accessibility contact', text: "Who should people contact about accessibility problems on the site? The accessibility statement needs an email address, for example post@reachsubsea.com.", status: 'open' },
      { n: 66, subject: 'Go Explorer, Go Supporter and Perth ROC', text: "Should Go Explorer and Go Supporter be in the fleet, and should the Perth Remote Operations Centre be on the site? You sent data sheets for both vessels and a brochure for the centre, but none of them are on your current site or in the design.", pages: ['Assets#vessels', 'Technology & Innovation'], status: 'open' },
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
