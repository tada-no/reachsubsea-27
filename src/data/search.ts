// Site search index (9 Oct 2026, Q158): every page, project, story, FAQ, report, publication, person and fleet unit
// as one flat list, served as /search-index.json and read by the Search results and 404 templates.
//
// In WordPress: the theme's search.php runs the main query (`?s=`), with `post_type` from the type chip (`&type=`).
// Core search only matches title, excerpt and content, so use Relevanssi (free) or SearchWP to index the custom
// fields this list draws on (project field and vessels, asset kind, person role, report year) and to weight titles
// above body text, as `src/lib/search.ts` does. Reports, publications and the fleet are not posts on the dev site:
// in WordPress they are the Report, Publication and Asset post types the Data list and Fleet register read, so they
// come through the same query. Pages that only exist as a menu anchor (Vessels, ROVs) are covered by their assets.
import { navSections } from './navigation';
import { newsPosts, postUrl } from './news';
import { projects } from './projects';
import { faqs, faqTopics, faqHubHref } from './faqs';
import { publications } from './documents';
import { quarterlyReleases, annualReports, sustainabilityReports, otherDocuments } from './reports';
import { people } from './people';
import { assets } from './assets';
import { serviceLines } from './services';
import { vision } from './company';
import { hseqIntro, lifeSavingRulesIntro, campaignsIntro, transparencyAct } from './hseq';
import { sustainabilityIntro, sponsorship } from './sustainability';
import { lifeHero } from './life-at-reach';
import { cultureIntro } from './culture';
import { whyWorkHero } from './why-work';
import { privacyPolicy } from './legal';
import { contactIntro } from './contact';
import { shortDate } from '../lib/dates';

export type SearchType = 'page' | 'project' | 'news' | 'report' | 'publication' | 'faq' | 'person' | 'asset';

export interface SearchEntry {
  type: SearchType;
  title: string;
  /** Site path ("/services/subsea/") or a full URL for files and other sites. */
  url: string;
  /** The row's eyebrow after the type label: section, date, year. */
  context?: string;
  /** Shown under the title: the page's lead, the story's excerpt, the answer. */
  excerpt: string;
  /** Matched but never shown, weighted near the title: the words people type that the entry never says (synonyms,
   * a role's initials, report codes, vessel names). Editor-set in WordPress (a "Search terms" field). */
  aliases?: string;
  /** Matched but never shown, weighted low: the start of a story's body. */
  keywords?: string;
  /** ISO date, newest first among equal scores. */
  date?: string;
  link?: 'file' | 'external';
}

/** Chip order and labels (plural for the chip, singular for the row's eyebrow). */
export const searchTypes: { id: SearchType; label: string; single: string }[] = [
  { id: 'page', label: 'Pages', single: 'Page' },
  { id: 'project', label: 'Projects', single: 'Project' },
  { id: 'news', label: 'News', single: 'News' },
  { id: 'report', label: 'Reports', single: 'Report' },
  { id: 'publication', label: 'Publications', single: 'Publication' },
  { id: 'faq', label: 'FAQs', single: 'FAQ' },
  { id: 'person', label: 'People', single: 'Person' },
  { id: 'asset', label: 'Fleet', single: 'Fleet' },
];

const strip = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Pages: title as the menus name them, the hero lead as the excerpt, section as context. Keywords carry the words
// people type that the page never says in its lead.
const page = (title: string, url: string, context: string, excerpt: string, aliases?: string): SearchEntry => ({
  type: 'page',
  title,
  url,
  context,
  excerpt,
  aliases,
});
const service = (id: string) => serviceLines.find((s) => s.id === id)!;

const pages: SearchEntry[] = [
  page('Home', '/', 'Reach Subsea', 'Subsea survey, inspection, monitoring and intervention services worldwide, through crewed vessels, remote operations and uncrewed surface vessels.'),
  page('Services', '/services/', 'Services', 'From inspection and repair to survey and monitoring, delivered by crewed and uncrewed vessels.', 'services overview lifecycle'),
  ...['subsea', 'survey', 'monitoring', 'technology'].map((id) => {
    const s = service(id);
    return page(s.title, s.href, 'Services', s.summary, `${s.short} ${s.scope.join(' ')}`);
  }),
  page('Research & Publications', '/services/technology-innovation/research-publications/', 'Services', 'Conference papers and journal articles co-authored by our geophysics and monitoring teams, published continuously since 2013.', 'papers science research'),
  page('Explore 3D World', '/3d-world/', 'Services', 'Fly between four working zones and click any vessel, ROV or structure to see what it does.', '3d world interactive'),
  page('Fleet overview', '/assets/', 'Assets', 'High-specification crewed and uncrewed vessels, both equipped with work-class ROVs and survey systems.', 'assets fleet vessels ships rovs usv equipment'),
  page('Projects', '/projects/', 'Projects', 'Subsea, survey and monitoring work from the North Sea to Western Australia, with crewed vessels and the uncrewed Reach Remote.', 'case studies track record references'),
  page('About Reach Subsea', '/company/', 'Company', vision.text, 'about us company history values who we are'),
  page('Leadership & Board', '/company/leadership-board/', 'Company', 'Deep offshore, engineering and capital-markets experience, guiding Reach Subsea from our headquarters in Haugesund, Norway.', 'management team board of directors ceo'),
  page('HSEQ', '/company/hseq/', 'Company', hseqIntro.lead, 'health safety environment quality certificates iso policies code of conduct'),
  page('Life-Saving Rules', '/company/hseq/life-saving-rules/', 'Company', lifeSavingRulesIntro.lead, 'iogp safety rules'),
  page('HSEQ campaigns', '/company/hseq/campaigns/', 'Company', campaignsIntro.lead, 'safety posters'),
  page('Sustainability', '/company/sustainability/', 'Company', sustainabilityIntro.lead, 'esg climate emissions sdg'),
  page('Sponsorship', '/company/sustainability/sponsorship/', 'Company', sponsorship.lead, 'sponsor apply support'),
  page('Investor relations', '/investors/', 'Investors', 'Reach Subsea delivers survey, monitoring and subsea services worldwide through a versatile fleet, advanced ROV technology and a pioneering remote and uncrewed operations platform.', 'investors ir shareholders'),
  page('Why invest in Reach Subsea', '/investors/why-invest/', 'Investors', 'A technology-driven subsea partner with record results, a growing uncrewed operations platform and a fleet built for the next phase of offshore energy.', 'investment case'),
  page('Reports & presentations', '/investors/reports-presentations/', 'Investors', 'Everything we publish to the market: quarterly and annual reports, presentations and webcasts.', 'financial reports quarterly results annual report webcast'),
  page('Share information', '/investors/share-information/', 'Investors', 'Reach Subsea ASA is listed on Euronext Oslo Børs under the ticker REACH. Price, trading and key facts, live.', 'share price stock ticker oslo bors shareholders'),
  page('Financial calendar', '/investors/financial-calendar/', 'Investors', 'Key dates for Reach Subsea ASA’s financial reporting and shareholder events.', 'dates results release agm'),
  page('Governance & general meetings', '/investors/governance-meetings/', 'Investors', 'Reach Subsea ASA is governed in line with the Norwegian Code of Practice for Corporate Governance, including how shareholders exercise their rights at general meetings.', 'agm egm articles of association corporate governance'),
  page('Charter agreements', '/investors/charter-agreements/', 'Investors', 'Firm charter periods and options across the chartered fleet, with our own Reach Remote vessels alongside.', 'charters backlog contracts'),
  page('Careers', '/careers/', 'Careers', 'Are you ready to discover if your potential is within reach?', 'jobs vacancies open positions work apply'),
  page('Why work with us', '/careers/why-work-with-us/', 'Careers', whyWorkHero.lead, 'jobs graduates trainees apprentices'),
  page('Our culture', '/careers/our-culture/', 'Careers', cultureIntro.lead, 'values people'),
  page('Life at Reach', '/careers/life-at-reach/', 'Careers', lifeHero.lead, 'offices crew offshore'),
  page('Reach Newsroom', '/newsroom/', 'Newsroom', 'Stay up to date with Reach Subsea, from news and reports to the projects and operations shaping offshore services.', 'news press releases'),
  page('Frequently asked questions', '/faq/', 'FAQ', 'Answers to what we are asked most, organised by topic.', 'faq questions help'),
  page('Contact', '/contact/', 'Contact', contactIntro.lead, 'contact us offices phone email address haugesund'),
  page(transparencyAct.title, transparencyAct.url, 'Company', transparencyAct.text, 'human rights supply chain apenhetsloven'),
  page(privacyPolicy.title, privacyPolicy.url, 'Legal', privacyPolicy.lead, 'privacy cookies gdpr data'),
];

// The section a page sits in, for the 404's "nearest section" fallback
export const searchSections = navSections.map((s) => ({ label: s.label, href: s.href }));

const projectEntries: SearchEntry[] = projects.map((p) => ({
  type: 'project',
  title: p.title,
  url: p.url,
  context: [service(p.service)?.short, p.year].filter(Boolean).join(' · '),
  excerpt: p.lead ?? [p.work, p.field].filter(Boolean).join(' · '),
  aliases: [p.work, p.field, p.client, p.place?.name, ...(p.vessels ?? [])].filter(Boolean).join(' '),
  keywords: strip(p.story?.join(' ') ?? '').slice(0, 600),
  date: p.year ? String(p.year) : undefined,
}));

const newsEntries: SearchEntry[] = newsPosts.map((p) => ({
  type: 'news',
  title: p.title,
  url: postUrl(p),
  context: p.dateSource === 'undated' ? 'Undated' : shortDate(p.date),
  excerpt: p.excerpt,
  keywords: strip(p.content).slice(0, 800),
  date: p.dateSource === 'undated' ? undefined : p.date,
}));

const topicLabel = new Map(faqTopics.map((t) => [t.id, t.label]));
const faqEntries: SearchEntry[] = faqs.map((f) => ({
  type: 'faq',
  title: f.question,
  url: `${faqHubHref(f.topics[0]).split('#')[0]}#faq-${f.slug}`,
  context: topicLabel.get(f.topics[0]),
  excerpt: f.answer,
}));

const reportEntries: SearchEntry[] = [
  ...quarterlyReleases
    .filter((r) => r.report)
    .map<SearchEntry>((r) => ({
      type: 'report',
      title: `Q${r.quarter} ${r.year} report`,
      url: r.report!,
      context: r.published ? shortDate(r.published) : String(r.year),
      excerpt: `Quarterly results for the ${['first', 'second', 'third', 'fourth'][r.quarter - 1]} quarter of ${r.year}${r.presentation ? ', with the presentation' : ''}${r.webcast ? ' and webcast' : ''} on Reports & presentations.`,
      aliases: `${r.quarter}Q ${r.year} ${r.quarter}Q${r.year} Q${r.quarter}${r.year} quarterly interim results`,
      date: r.published,
      link: 'file',
    })),
  ...[...annualReports, ...sustainabilityReports].map<SearchEntry>((r) => ({
    type: 'report',
    title: `${r.title} ${r.year}`,
    url: r.report,
    context: String(r.year),
    excerpt: `${r.title} for ${r.year}, PDF.`,
    aliases: 'annual report arsrapport esg',
    date: String(r.year + 1),
    link: 'file',
  })),
  ...otherDocuments.map<SearchEntry>((d) => ({
    type: 'report',
    title: d.title,
    url: d.links[0].url,
    context: shortDate(d.date),
    excerpt: `${d.links.map((l) => l.kind).join(' and ')}.`,
    date: d.date,
    link: d.links[0].kind === 'Webcast' ? 'external' : 'file',
  })),
];

const publicationEntries: SearchEntry[] = publications.map((p) => ({
  type: 'publication',
  title: p.title,
  url: p.link.url,
  context: `${p.year} · ${p.topicLabel}`,
  excerpt: p.byline,
  date: String(p.year),
  link: p.link.action,
}));

// "Chief Executive Officer" → "ceo", so people find the CEO, CFO or COO by the letters they type
const initials = (role: string) =>
  role
    .split(/[,&]| and /)
    .map((part) => part.trim().split(/\s+/).filter((w) => /^[A-Z]/.test(w)))
    .filter((words) => words.length >= 2)
    .map((words) => words.map((w) => w[0]).join('').toLowerCase())
    .join(' ');

const personEntries: SearchEntry[] = people.map((p) => ({
  type: 'person',
  title: p.name,
  url: `/company/leadership-board/#${p.group}`,
  context: p.group === 'board' ? 'Board of Directors' : 'Management',
  excerpt: p.role,
  aliases: initials(p.role),
  keywords: p.bio,
}));

const assetAnchor = { vessel: 'vessels', usv: 'uncrewed', rov: 'rovs', equipment: 'equipment' } as const;
const assetEntries: SearchEntry[] = assets.map((a) => ({
  type: 'asset',
  title: a.name,
  url: a.type === 'usv' ? '/assets/reach-remote/' : `/assets/#${assetAnchor[a.type]}`,
  context: a.kindShort ?? a.kind,
  excerpt: a.summary,
  aliases: [a.kind, a.owner, ...(a.unitNames ?? []), ...(a.rovs ?? [])].filter(Boolean).join(' '),
}));

export const searchIndex: SearchEntry[] = [
  ...pages,
  ...assetEntries,
  ...personEntries,
  ...projectEntries,
  ...faqEntries,
  ...reportEntries,
  ...publicationEntries,
  ...newsEntries,
];

/** The Search panel's and the 404's "Popular" links, from the header data. */
export { popularSearchLinks } from './navigation';
