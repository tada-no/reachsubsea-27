// Reports & presentations (7 Oct 2026): every document Reach Subsea has published to the market, from the live
// site's Financial reports page (reachsubsea.no/investors/financial-reports/, read 7 Oct 2026). The live site runs
// to Q2 2026; the dev site's copy stops at Q2 2025 and has two misplaced 2023 cells, so the live site is the source.
// URLs are the live files. In WordPress each entry is one Document post (type, period, year, date, file/url).
//
// Publication dates: the results-presentation day from the webcast URL (Royalcast ids are dated) where there is
// one, otherwise the file's upload date (HTTP Last-Modified) from 2023 on. Files bulk-uploaded on 31 Mar 2023 carry
// no usable date, so quarters before Q2 2021 have none.
//
// Gaps on the live site, to raise with Reach (not invented here):
// - No webcast link for Q4 2025, Q1 2026 or Q2 2026.
// - Q1 2021's "Report" link opens the Q1 2021 presentation; the Q1 2021 report itself isn't on the site.
// - Annual report 2025 was uploaded 30 Apr 2026; investor-results.ts still has the placeholder 26 Mar 2026.
// - Q1 2026 was uploaded 5 May 2026; investor-calendar.ts has the placeholder 24 Apr 2026.
import { latestResults } from './investor-results';
import { investorCalendar } from './investor-calendar';

const base = import.meta.env.BASE_URL;
const UP = 'https://reachsubsea.no/wp-content/uploads';
const cast = (id: string) => `https://channel.royalcast.com/landingpage/hegnarmedia/${id}/`;

export type Quarter = 1 | 2 | 3 | 4;

export interface QuarterRelease {
  year: number;
  quarter: Quarter;
  /** ISO date the results were published. */
  published?: string;
  report?: string;
  presentation?: string;
  webcast?: string;
}

/** Quarterly results, newest first. */
export const quarterlyReleases: QuarterRelease[] = [
  { year: 2026, quarter: 2, published: '2026-08-18', report: `${UP}/2026/08/Reach-Subsea-ASA-2Q-2026-Report.pdf`, presentation: `${UP}/2026/08/Reach-Subsea-ASA-2Q-2026-Presentation.pdf` },
  { year: 2026, quarter: 1, published: '2026-05-05', report: `${UP}/2026/05/Reach-Subsea-ASA_1Q-2026-Report.pdf`, presentation: `${UP}/2026/05/Reach-Subsea-ASA_1Q-2026-Presentation.pdf` },

  { year: 2025, quarter: 4, published: '2026-02-12', report: `${UP}/2026/02/Reach-Subsea-ASA-4Q-2025-Report.pdf`, presentation: `${UP}/2026/02/Reach-Subsea-ASA-4Q-2025-Presentation.pdf` },
  { year: 2025, quarter: 3, published: '2025-11-18', report: `${UP}/2025/11/Reach-Subsea-ASA_3Q-2025-Report.pdf`, presentation: `${UP}/2025/11/Reach-Subsea-ASA_3Q-2025-Presentation.pdf`, webcast: cast('20251118_2') },
  { year: 2025, quarter: 2, published: '2025-08-26', report: `${UP}/2025/08/Reach-Subsea-ASA-2Q-2025-Report.pdf`, presentation: `${UP}/2025/08/Reach-Subsea-ASA-2Q-2025-Presentation.pdf`, webcast: cast('20250826_3') },
  { year: 2025, quarter: 1, published: '2025-05-08', report: `${UP}/2025/05/Reach-Subsea-ASA_1Q2025_Report.pdf`, presentation: `${UP}/2025/05/Reach-Subsea-ASA_1Q2025_Presentation.pdf`, webcast: cast('20250508_8') },

  { year: 2024, quarter: 4, published: '2025-02-13', report: `${UP}/2025/02/Reach-Subsea-ASA-Q42024-Report.pdf`, presentation: `${UP}/2025/02/Reach-Subsea-ASA-Q42024-Presentation.pdf`, webcast: cast('20250213_11') },
  { year: 2024, quarter: 3, published: '2024-11-12', report: `${UP}/2024/11/Reach-Subsea-ASA-Q3-2024-Report.pdf`, presentation: `${UP}/2024/11/Reach-Subsea-ASA-Q3-2024-Presentation.pdf`, webcast: cast('20241112_1') },
  { year: 2024, quarter: 2, published: '2024-08-27', report: `${UP}/2024/08/Reach-Subsea-ASA-Q2-2024-Report.pdf`, presentation: `${UP}/2024/08/Reach-Subsea-ASA-Q2-2024-Presentation.pdf`, webcast: cast('20240827_4') },
  { year: 2024, quarter: 1, published: '2024-05-08', report: `${UP}/2024/05/Reach-Subsea-ASA-Q12024-Report.pdf`, presentation: `${UP}/2024/05/Reach-Subsea-ASA-Q12024-Presentation.pdf`, webcast: cast('20240508_15') },

  { year: 2023, quarter: 4, published: '2024-02-14', report: `${UP}/2024/02/Reach-Subsea-ASA-Q4-Report.pdf`, presentation: `${UP}/2024/02/Reach-Subsea-ASA-Q42023-Presentation.pdf`, webcast: cast('20240214_8') },
  { year: 2023, quarter: 3, published: '2023-11-07', report: `${UP}/2023/11/Reach-Subsea-ASA-3Q2023-consolidated-report.pdf`, presentation: `${UP}/2023/11/Reach-Subsea-ASA-3Q2023-presentation.pdf`, webcast: cast('20231107_7') },
  { year: 2023, quarter: 2, published: '2023-08-23', report: `${UP}/2023/08/Reach-Subsea-ASA-consolidated-report-2Q2023.pdf`, presentation: `${UP}/2023/08/Reach-Subsea-ASA-Presentation-2Q2023.pdf`, webcast: cast('20230823_5') },
  { year: 2023, quarter: 1, published: '2023-05-09', report: `${UP}/2023/05/Reach-Subsea-ASA-consolidated-report-1Q2023.pdf`, presentation: `${UP}/2023/05/Reach-Subsea-ASA-Q1-2023_Presentation.pdf`, webcast: cast('20230509_4') },

  { year: 2022, quarter: 4, published: '2023-02-14', report: `${UP}/2023/03/Reach-Subsea-ASA-consolidated-report-31.12.2022-Q4.pdf`, presentation: `${UP}/2023/03/Reach-Subsea-ASA-Q4-2022-presentation.pdf`, webcast: cast('20230214_3') },
  { year: 2022, quarter: 3, published: '2022-11-08', report: `${UP}/2023/03/Reach-Subsea-ASA-consolidated-report-30.09.2022-Q3.pdf`, presentation: `${UP}/2023/03/Reach-Subsea-ASA-Q3-2022-presentation.pdf`, webcast: cast('20221108_3') },
  { year: 2022, quarter: 2, published: '2022-08-23', report: `${UP}/2023/03/Reach-Subsea-ASA-consolidated-report-30.06.2022-Q2.pdf`, presentation: `${UP}/2023/03/Reach-Subsea-ASA-Q2-2022-presentation.pdf`, webcast: cast('20220823_3') },
  { year: 2022, quarter: 1, published: '2022-05-06', report: `${UP}/2023/03/Reach-Subsea-ASA-Group-consolidated-report-2022-Q1.pdf`, presentation: `${UP}/2023/03/Reach-Subsea-ASA-Q1-2022-presentation.pdf`, webcast: cast('20220506_2') },

  { year: 2021, quarter: 4, published: '2022-02-08', report: `${UP}/2023/03/REACH-SUBSEA-ASA-4Q2021-Consolidated-report.pdf`, presentation: `${UP}/2023/03/Reach-Subsea-ASA-Q4-2021-presentation.pdf`, webcast: cast('20220208_2') },
  { year: 2021, quarter: 3, published: '2021-11-04', report: `${UP}/2023/03/REACH-SUBSEA-ASA-3Q2021-Consolidated-Report.pdf`, presentation: `${UP}/2023/03/Reach-Subsea-ASA-Q3-2021-presentation.pdf`, webcast: cast('20211104_10') },
  { year: 2021, quarter: 2, published: '2021-08-17', report: `${UP}/2023/03/REACH-SUBSEA-ASA-2Q2021-consolidated-report.pdf`, presentation: `${UP}/2023/03/Reach-Subsea-ASA-Q2-2021-presentation.pdf`, webcast: cast('20210817_6') },
  // The live site labels this file "Report"; it is the Q1 2021 presentation
  { year: 2021, quarter: 1, presentation: `${UP}/2023/03/Reach-Subsea-ASA-Q1-2021-presentation.pdf` },

  // 2012–2020: the quarterly report only
  { year: 2020, quarter: 4, report: `${UP}/2023/03/Reach-Subsea-ASA-Consolidated-report-for-4Q2020.pdf` },
  { year: 2020, quarter: 3, report: `${UP}/2023/03/Reach-Subsea-ASA-Group-3Q2020.pdf` },
  { year: 2020, quarter: 2, report: `${UP}/2023/03/Reach-Subsea-ASA-Group-2Q2020.pdf` },
  { year: 2020, quarter: 1, report: `${UP}/2023/03/Reach-Subsea-ASA-Group-1Q2020.pdf` },
  { year: 2019, quarter: 4, report: `${UP}/2023/03/Reach-Subsea-ASA-4Q2019.pdf` },
  { year: 2019, quarter: 3, report: `${UP}/2023/03/3Q2019-Reach-Subsea-ASA.pdf` },
  { year: 2019, quarter: 2, report: `${UP}/2023/03/Reach-Subsea-ASA-2-Q2019.pdf` },
  { year: 2019, quarter: 1, report: `${UP}/2023/03/Reach-Subsea-ASA-1Q2019.pdf` },
  { year: 2018, quarter: 4, report: `${UP}/2023/03/Reach-Subsea-ASA-4Q2018.pdf` },
  { year: 2018, quarter: 3, report: `${UP}/2023/03/Reach-Subsea-ASA-3Q2018.pdf` },
  { year: 2018, quarter: 2, report: `${UP}/2023/03/Reach-Subsea-ASA-2-Q2018.pdf` },
  { year: 2018, quarter: 1, report: `${UP}/2023/03/ReachSubseaASA1Q2018-2.pdf` },
  { year: 2017, quarter: 4, report: `${UP}/2023/03/4Q2017-REACH-SUBSEA-ASA.pdf` },
  { year: 2017, quarter: 3, report: `${UP}/2023/03/3Q2017-REACH-SUBSEA-ASA.pdf` },
  { year: 2017, quarter: 2, report: `${UP}/2023/03/2Q2017-REACH-SUBSEA-ASA.pdf` },
  { year: 2017, quarter: 1, report: `${UP}/2023/03/1Q2017-REACH-SUBSEA-ASA.pdf` },
  { year: 2016, quarter: 4, report: `${UP}/2023/03/4Q2016-REACHSUBSEAASA.pdf` },
  { year: 2016, quarter: 3, report: `${UP}/2023/03/3Q2016-REACH-SUBSEA.pdf` },
  { year: 2016, quarter: 2, report: `${UP}/2023/03/2Q2016-REACH-SUBSEA.pdf` },
  { year: 2016, quarter: 1, report: `${UP}/2023/03/1Q2016-REACH-SUBSEA-ASA.pdf` },
  { year: 2015, quarter: 4, report: `${UP}/2023/03/4Q2015-REACH-SUBSEA-ASA.pdf` },
  { year: 2015, quarter: 3, report: `${UP}/2023/03/3Q2015REACHSUBSEAASA.pdf` },
  { year: 2015, quarter: 2, report: `${UP}/2023/03/2Q2015-REACH-SUBSEA-ASA.pdf` },
  { year: 2015, quarter: 1, report: `${UP}/2023/03/1Q2015-REACH-SUBSEA-ASA.pdf` },
  { year: 2014, quarter: 4, report: `${UP}/2023/03/4Q2014-REACH-SUBSEA-ASA-.pdf` },
  { year: 2014, quarter: 3, report: `${UP}/2023/03/3Q2014-REACH-SUBSEA-ASA.pdf` },
  { year: 2014, quarter: 2, report: `${UP}/2023/03/2Q2014-REACH-SUBSEA-ASA.pdf` },
  { year: 2014, quarter: 1, report: `${UP}/2023/03/1Q2014-REACH-SUBSEA-ASA.pdf` },
  { year: 2013, quarter: 4, report: `${UP}/2023/03/4Q2013-REACH-SUBSEA-ASA.pdf` },
  { year: 2013, quarter: 3, report: `${UP}/2023/03/3Q2013-REACHSUBSEA-ASA.pdf` },
  { year: 2013, quarter: 2, report: `${UP}/2023/03/2Q2013-REACHSUBSEA-ASA.pdf` },
  { year: 2013, quarter: 1, report: `${UP}/2023/03/1Q2013-REACH-SUBSEA-ASA.pdf` },
  { year: 2012, quarter: 4, report: `${UP}/2023/03/REACH-SUBSEA-ASA-4Q2012.pdf` },
];

/** The next results date, from the Latest results record (Financial calendar). */
const nextMatch = latestResults.next.label.match(/^Q([1-4]) (\d{4})/);
export const nextRelease = nextMatch
  ? { year: Number(nextMatch[2]), quarter: Number(nextMatch[1]) as Quarter, date: latestResults.next.date }
  : undefined;

/** Later results dates from the investor calendar ("Q4 2026 results" → 2027-02-16), for the quarters still to come.
 * `confirmed` comes from the calendar itself (one source with the Financial calendar, 8 Oct 2026, Q143): only dates
 * Reach has published get Add to calendar, the rest show as provisional. */
export const upcomingReleases = investorCalendar
  .map((m) => ({ m, match: m.title.match(/^Q([1-4]) (\d{4}) results$/) }))
  .filter(({ match }) => match)
  .map(({ m, match }) => ({
    year: Number(match![2]),
    quarter: Number(match![1]) as Quarter,
    date: m.isoDate,
    confirmed: m.confirmed,
  }));

export interface ReportCover {
  src: string;
  width: number;
  height: number;
}

export interface PublishedReport {
  year: number;
  /** The title printed on the cover: "Annual report" to 2022, "Annual and sustainability report" from 2023. */
  title: string;
  report: string;
  /** ESEF: the regulatory iXBRL filing of the annual report (ZIP), 2021 on. */
  esef?: string;
  /** Page 1 of the PDF, rendered 7 Oct 2026: the 2023–2025 landscape covers only (earlier years are listed
   * without thumbnails, Ross 7 Oct 2026). */
  cover?: ReportCover;
}

const landscape = (file: string): ReportCover => ({ src: `${base}images/reports/${file}`, width: 960, height: 540 });
const annual = (year: number, report: string, esef?: string): PublishedReport => ({
  year,
  title: year >= 2023 ? 'Annual and sustainability report' : 'Annual report',
  report: `${UP}/${report}`,
  esef: esef && `${UP}/${esef}`,
  cover: year >= 2023 ? landscape(`annual-report-${year}.jpg`) : undefined,
});

/** Annual reports, newest first. From 2023 the sustainability report is part of it. */
export const annualReports: PublishedReport[] = [
  annual(2025, '2026/04/Annual-and-Sustainability-Report-2025.pdf', '2026/04/reachsubseaasa20251231en.zip'),
  annual(2024, '2025/04/Reach-Subsea-ASA_Annual-and-Sustainability-Report-2024.pdf', '2025/04/REACH-2024-12-31-en.zip'),
  annual(2023, '2024/04/Reach-Subsea-ASA_Annual-and-Sustainability-Report-2023.pdf', '2024/04/REACH-2023-12-31-en.zip'),
  annual(2022, '2023/03/Reach-Subsea-ASA-Annual-Report-2022.pdf', '2023/05/REACH-2022-12-31-en.zip'),
  annual(2021, '2023/03/Reach-Subsea-Annual-Report-2021.pdf', '2023/03/REACH-2021-12-31-en.zip'),
  annual(2020, '2023/03/Reach-Subsea-ASA-Group-Annual-Report-2020.pdf'),
  annual(2019, '2023/03/REACH-SUBSEA-ASA-Group-Annual-Report-2019.pdf'),
  annual(2018, '2023/03/Reach-Subsea-ASA-Annual-Report-2018.pdf'),
  annual(2017, '2023/03/REA18-405-10-Arsmelding-2017-14.pdf'),
  annual(2016, '2023/03/REA170452-Arsmelding-2016-web-small.pdf'),
  annual(2015, '2023/03/Reach-Subsea-ASA-Group-Annual-Report-2015.pdf'),
  annual(2014, '2023/03/REA-15-0008-Annual-report-english-11.pdf'),
  annual(2013, '2023/03/REA-14-0006-Annual-report-english.pdf'),
  annual(2012, '2023/03/Reach-Subsea-ASA-Annual-Report-2012.pdf'),
];

const sustainability = (year: number, report: string): PublishedReport => ({
  year,
  title: 'Sustainability report',
  report: `${UP}/${report}`,
});

/** Standalone sustainability reports, 2019–2022, newest first. */
export const sustainabilityReports: PublishedReport[] = [
  sustainability(2022, '2023/03/Reach-Subsea-ASA-Sustainability-Report-2022.pdf'),
  sustainability(2021, '2023/03/REACH-SUBSEA-ASA-Group-Sustainability-Report-2021.pdf'),
  sustainability(2020, '2023/03/Reach-Subsea-ASA-Sustainability-Report-2020.pdf'),
  sustainability(2019, '2023/03/REACH-SUBSEA-ASA-Group-Sustainability-Report-2019.pdf'),
];

export interface InvestorDocument {
  /** ISO date, or "YYYY-MM" / "YYYY" where the day isn't known. */
  date: string;
  title: string;
  links: { kind: 'Presentation' | 'Prospectus' | 'Webcast'; url: string }[];
}

/** Presentations and prospectuses outside the quarterly cycle (the live site's "Miscellaneous"), newest first. */
export const otherDocuments: InvestorDocument[] = [
  { date: '2026-09-16', title: 'Pareto Securities Energy Conference 2026', links: [{ kind: 'Presentation', url: `${UP}/2026/09/Reach-Subsea-Pareto-2026-CEO-16.09.2026.pdf` }] },
  { date: '2025-12-12', title: 'Bond prospectus', links: [{ kind: 'Prospectus', url: `${UP}/2025/12/Bond-Prospectus.pdf` }] },
  { date: '2025-07-03', title: 'Credit investor presentation', links: [{ kind: 'Presentation', url: `${UP}/2025/07/Reach-Subsea-Credit-investor-presentation-3-July-2025_webside.pdf` }] },
  { date: '2023-04-11', title: 'Prospectus, subsequent offering', links: [{ kind: 'Prospectus', url: `${UP}/2023/04/Reach-National-Prospectus-Subsequent-Offering.pdf` }] },
  { date: '2022-06-03', title: 'Prospectus', links: [{ kind: 'Prospectus', url: `${UP}/2023/03/Reach-Subsea-Prospectus-3-June-2022-vF.pdf` }] },
  {
    date: '2022-02-18',
    title: 'Acquisition of iSurvey and Wilhelmsen as a new strategic partner',
    links: [
      { kind: 'Presentation', url: `${UP}/2023/03/Reach-Subsea-ASA-transaction-presentation.pdf` },
      { kind: 'Webcast', url: cast('20220218_10') },
    ],
  },
  { date: '2017-02', title: 'Prospectus', links: [{ kind: 'Prospectus', url: `${UP}/2023/03/Reach-Subsea-ASA_prospectus_2017-02.pdf` }] },
  { date: '2016', title: 'Prospectus', links: [{ kind: 'Prospectus', url: `${UP}/2023/03/Reach-Subsea-ASA_Prospectus_2016.pdf` }] },
  { date: '2013-06-26', title: 'Prospectus', links: [{ kind: 'Prospectus', url: `${UP}/2023/03/Reach-Subsea-ASA-Prospectus-260613-1.pdf` }] },
  { date: '2012-12-17', title: 'Prospectus', links: [{ kind: 'Prospectus', url: `${UP}/2023/03/Reach-Subsea-ASA-%E2%80%93-Prospectus-171212.pdf` }] },
];

/** "18 Aug 2026", "Feb 2017" or "2016", from a full or partial ISO date. */
export { shortDate as formatDocDate } from '../lib/dates';
