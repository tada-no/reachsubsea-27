// Investors › Governance & general meetings (7 Oct 2026). Sources, all read 7 Oct 2026:
// - Client PDF p46–47 ("20 — Investors — Governance & General Meetings") for the page's intent, sections, FAQs and
//   CTA wording. Its committee cards were marked "illustrative" and its archive was empty.
// - The live site's General meetings page (reachsubsea.no/investors/general-meetings-2/) for every meeting and file.
//   URLs are the live files. In WordPress each meeting is one Document post group (kind, date, files).
// - The dev site's Corporate Governance page (/investors/key-information/corporate-governance/) for the governance,
//   investor relations and dividend policies, the articles of association and the remuneration policy.
// - Annual report 2025 p78–84 (corporate governance statement) for the committees, the AGM rules and the
//   nomination committee; the nomination committee's proposal to the 2026 AGM for the current Board (five members,
//   one-year terms from 2026) and the committee's re-election to 2028; the 2026 AGM minutes for the dividend
//   authority (up to NOK 0.17 per share, to the 2027 AGM).
//
// Corrections to the live page (not invented; raise with Reach):
// - 2017: the live "Protocol General Meeting" opens the February EGM notice. The 29 May 2017 AGM minutes aren't on
//   the site, so that meeting has a notice only.
// - 2012: the live "General Meeting" pair are files named EO-GM 28.11.12, so both 2012 meetings are listed as
//   extraordinary (28 Nov and 18 Dec 2012).
// - 2013: the live "Extra ordinary" pair (files 29.05.13) and "General Meeting" pair (files 29.04.13) keep their
//   live labels; dates from the file names.
// - Dates before 2021 come from the file names.
// - The articles of association are in Norwegian only (vedtekter, 28 Mar 2023). Ask Reach for an English version.
// - The 2027 AGM has no date yet: the live financial calendar runs to Q4 2026. investor-calendar.ts holds a
//   placeholder (27 May 2027, `confirmed: false`), so the Next row reads "Date to come" until Reach confirms it.
import { board } from './people';
import { investorCalendar } from './investor-calendar';

const UP = 'https://reachsubsea.no/wp-content/uploads';
const up = (path: string) => `${UP}/${path}`;

export type MeetingKind = 'annual' | 'extraordinary';

export interface MeetingFiles {
  notice?: string;
  minutes?: string;
  nomination?: string;
  remunerationReport?: string;
  remunerationPolicy?: string;
  appendix?: string;
}

export interface GeneralMeeting {
  /** ISO date the meeting was held. */
  date: string;
  kind: MeetingKind;
  files: MeetingFiles;
}

/** Every general meeting with papers on the live site, newest first. */
export const generalMeetings: GeneralMeeting[] = [
  {
    date: '2026-05-28',
    kind: 'annual',
    files: {
      notice: up('2026/05/Reach-Subsea-ASA-OGM-notice-28.05.2026-v1.2.pdf'),
      minutes: up('2026/05/Reach-Subsea-ASA-OGM-minutes-28.05.2026-incl-app.pdf'),
      nomination: up('2026/05/Proposal-Nomination-committee-of-Reach-Subsea-ASA-2026.pdf'),
      remunerationReport: up('2026/05/Executive-Rem-report-Reach-Subsea-ASA-2025-v3.pdf'),
    },
  },
  {
    date: '2025-05-28',
    kind: 'annual',
    files: {
      notice: up('2025/05/Reach-Subsea-ASA-OGM-notice-28.05.2025-v2.pdf'),
      minutes: up('2025/05/Reach-Subsea-ASA-OGM-Minutes-28.05.2025-final.pdf'),
      nomination: up('2025/05/Proposal-Nomination-committee-of-Reach-Subsea-ASA-2025.pdf'),
      remunerationReport: up('2025/05/Executive-Remuneration-report-Reach-Subsea-ASA-2024.pdf'),
      appendix: up('2025/05/VEDLEGG-TIL-PROTOKOLL.pdf'),
    },
  },
  {
    date: '2024-05-31',
    kind: 'annual',
    files: {
      notice: up('2024/05/Reach-Subsea-ASA-OGM-notice-31.05.2024-final.pdf'),
      minutes: up('2024/06/620375_Reach-Subsea-ASA-Annual-GM-31.05.2024.pdf'),
      nomination: up('2024/05/Proposal-Nomination-committee-of-Reach-Subsea-ASA-2024.pdf'),
      remunerationReport: up('2024/05/Executive-Rem-report-Reach-Subsea-ASA-2023.pdf'),
      remunerationPolicy: up('2024/05/Reach-Subsea-ASA-executive-remuneration-policy-2024.pdf'),
    },
  },
  {
    date: '2023-05-31',
    kind: 'annual',
    files: {
      notice: up('2023/05/Reach-Subsea-ASA-OGM-notice-31.05.2023.pdf'),
      minutes: up('2023/05/Reach-Subsea-ASA-Annual-GM-31.5.2023-Minutes.pdf'),
      nomination: up('2023/05/Proposal-Nomination-committee-of-Reach-Subsea-ASA-2023.pdf'),
      remunerationReport: up('2023/05/Remuneration-Report-RS-ASA-incl-auditor.pdf'),
    },
  },
  {
    date: '2023-03-10',
    kind: 'extraordinary',
    files: {
      notice: up('2023/04/Reach-Subsea-ASA-EGM-notice-10.03.2023.pdf'),
      minutes: up('2023/04/Reach-Subsea-ASA-EGM-10.03.23-minutes.pdf'),
    },
  },
  {
    date: '2022-05-30',
    kind: 'annual',
    files: {
      notice: up('2023/04/Reach-Subsea-ASA-OGM-30.05.22-web-file-for-printing.pdf'),
      minutes: up('2023/04/REACH-SUBSEA-ASA-Annual-General-Meeting-30.05.2022-minutes.pdf'),
      nomination: up('2023/04/Reach-Subsea-ASA-OGM-30-May-2022-Proposal-Nomination-committee.pdf'),
      remunerationReport: up('2023/04/Reach-Subsea-ASA-OGM-30-May-2022-Executive-Remuneration-sign.pdf'),
    },
  },
  {
    date: '2022-03-15',
    kind: 'extraordinary',
    files: {
      notice: up('2023/04/Reach-Subsea-ASA-notice-of-extraordinary-general-meeting.pdf'),
      minutes: up('2023/04/15-March-2022-Reach-Subsea-ASA-EGM-Signed.pdf'),
    },
  },
  {
    date: '2021-06-11',
    kind: 'annual',
    files: {
      notice: up('2023/04/Notice-General-Meeting-Reach-Subsea-ASA-11062021.pdf'),
      minutes: up('2023/04/Minutes-AGM-Reach-Subsea-ASA-2021.pdf'),
      nomination: up('2023/04/Attachment-to-AGM-notice-Reach-Subsea-ASA-Proposal-Nomination-committee.pdf'),
      remunerationPolicy: up('2023/04/Attachment-to-AGM-notice-Reach-Subsea-ASA-Executive-remuneration-policy.pdf'),
    },
  },
  {
    date: '2020-05-26',
    kind: 'annual',
    files: {
      notice: up('2023/04/Notice-General-Meeting-Reach-Subsea-ASA-26-05-2020.pdf'),
      minutes: up('2023/04/Minutes-AGM-Reach-Subsea-ASA-2020.pdf'),
    },
  },
  {
    date: '2019-05-27',
    kind: 'annual',
    files: {
      notice: up('2023/04/General-Meeting-Notice-Reach-Subsea-ASA-27-05-2019.pdf'),
      minutes: up('2023/04/Generalforsamlingsprotokoll-27.05.2019-Reach-Subsea-ASA.pdf'),
    },
  },
  {
    date: '2018-05-22',
    kind: 'annual',
    files: {
      notice: up('2023/04/Generalforsamling-General-Meeting-Reach-Subsea-ASA-22-05-2018-Notice.pdf'),
      minutes: up('2023/04/REACH-GA-2018-05-22.pdf'),
    },
  },
  {
    date: '2017-05-29',
    kind: 'annual',
    files: {
      notice: up('2023/04/Generalforsamling-General-Meeting-Reach-Subsea-ASA-29-05-2017-notice.pdf'),
    },
  },
  {
    date: '2017-02-07',
    kind: 'extraordinary',
    files: {
      notice: up('2023/04/EGM-REACH-SUBSEA-ASA-07-02-2017-Notice-3.pdf'),
      minutes: up('2023/04/EGF-REACH-SUBSEA-ASA-07022017-protocol.pdf'),
    },
  },
  {
    date: '2016-05-30',
    kind: 'annual',
    files: {
      notice: up('2023/04/General-Meeting-Reach-Subsea-ASA-30052016-notice.pdf'),
      minutes: up('2023/04/Annual-General-Meeting-Reach-Subsea-ASA-30052016-protocol.pdf'),
    },
  },
  {
    date: '2015-05-28',
    kind: 'annual',
    files: {
      notice: up('2023/04/Innkalling-GF-Reach-Subsea-ASA-2015.pdf'),
      minutes: up('2023/04/Generalforsamlingsprotokoll-28052015-Reach-Subsea-ASA.pdf'),
    },
  },
  {
    date: '2014-05-26',
    kind: 'annual',
    files: {
      notice: up('2023/04/Announcement-General-Meeting-Reach-Subsea-ASA-26052014.pdf'),
      minutes: up('2023/04/Generalforsamlingsprotokoll-26052014-Reach-Subsea-ASA.pdf'),
    },
  },
  {
    date: '2013-05-29',
    kind: 'extraordinary',
    files: {
      notice: up('2023/04/NOTICE-GENERAL-MEETING-REACH-SUBSEA-290513.pdf'),
      minutes: up('2023/04/EO-GM-290513-REACH-SUBSEA-ASA-minutes.pdf'),
    },
  },
  {
    date: '2013-04-29',
    kind: 'annual',
    files: {
      notice: up('2023/04/Innkalling-GF-Reach-Subsea-ASA-290413-English.pdf'),
      minutes: up('2023/04/Generalforsamlingsprotokoll-29042013.pdf'),
    },
  },
  {
    date: '2012-12-18',
    kind: 'extraordinary',
    files: {
      notice: up('2023/04/Notice-EO-GM-181212.pdf'),
      minutes: up('2023/04/Minutes-from-E-O-G-M-181212.pdf'),
    },
  },
  {
    date: '2012-11-28',
    kind: 'extraordinary',
    files: {
      notice: up('2023/04/Notice-of-EO-GM-281112.pdf'),
      minutes: up('2023/04/Minute-EO-GM-281112.pdf'),
    },
  },
];

/** The next annual general meeting, from the investor calendar (one source for every AGM date). Its date shows, with
 * Add to calendar, only once Reach has confirmed it; until then the row reads "Date to come". */
const todayIso = new Date().toISOString().slice(0, 10);
const nextAgm = investorCalendar.find((d) => /annual general meeting/i.test(d.title) && d.isoDate >= todayIso);
export const nextGeneralMeeting: { year: number; date?: string; confirmed?: boolean; usually: string } | undefined = nextAgm
  ? {
      year: Number(nextAgm.isoDate.slice(0, 4)),
      date: nextAgm.confirmed ? nextAgm.isoDate : undefined,
      confirmed: nextAgm.confirmed,
      usually: 'usually late May',
    }
  : undefined;

/** Client PDF p46 ("Annual general meeting" · "Extraordinary general meetings"), in its words; the em dash and the
 * AGM/EGM abbreviations dropped (site style); the EGM heading shortened from "…when needed" (Ross), so it fits one line. The 5% threshold is the Public Limited Liability Companies Act §5-7. */
export const meetingGuide = [
  {
    eyebrow: 'Annual general meeting',
    title: 'Held once a year, for every shareholder',
    text: 'The annual general meeting is where shareholders exercise their rights: approving the annual accounts, electing the Board of Directors, approving the dividend and appointing the auditor. Notice is published ahead of the meeting date, alongside the full agenda and any proposed resolutions.',
  },
  {
    eyebrow: 'Extraordinary general meetings',
    title: 'Called between annual meetings',
    text: 'An extraordinary general meeting may be called by the Board, the auditor, or shareholders representing at least 5% of share capital, to decide on matters that cannot wait until the next annual general meeting.',
  },
];

/** Annual report 2025: its corporate governance statement starts on p78. */
const annualReport2025 = up('2026/04/Annual-and-Sustainability-Report-2025.pdf');

/** Who governs the company (annual report 2025 §7–10, the 2026 nomination committee proposal). Board size from
 * people.ts, so it follows the board list. */
export const governingBodies = [
  {
    eyebrow: 'Elected by shareholders',
    title: 'Board of Directors',
    description:
      'Sets strategy, oversees management and safeguards the interests of all shareholders. No member is part of executive management.',
    meta: `${board.length} members, elected each year`,
  },
  {
    eyebrow: 'Elected by shareholders',
    title: 'Nomination committee',
    description:
      'Proposes Board candidates and Board fees to the general meeting. Geir Flæsen (chair), Rune Lande and Didrik Leikvang.',
    meta: '3 members, elected to 2028',
  },
  {
    eyebrow: 'Appointed by the Board',
    title: 'Audit committee',
    description:
      'Monitors financial and ESG reporting, internal control, risk management and the statutory audit.',
    meta: '3 Board members',
  },
  {
    eyebrow: 'Appointed by the Board',
    title: 'Remuneration committee',
    description:
      'Reviews the pay of the CEO and executive management every year and makes recommendations to the Board.',
    meta: '3 Board members',
  },
];

/** Dividend and investor relations policies, as label · value rows. Dividend: the dev Corporate Governance page ("around
 * 50% of adjusted net profit… adjusted for items the Board regards as transitory"); current authority from the 2026 AGM
 * minutes, item 5. IR: the dev page (equal treatment; results per the financial calendar; Newsweb) and annual report
 * 2025 §13 ("identical and simultaneous information"; "open physical or digital presentations"; announcements on
 * newsweb.no and our website). Values kept
 * to one line in the narrower start column (~256 at 1440). Current authority: the 2026 AGM, valid to the 2027 AGM. */
export const dividendPolicy = [
  { label: 'Payout ratio', value: 'Around 50%' },
  { label: 'Basis', value: 'Adjusted net profit' },
  { label: 'Adjusted for', value: 'Items the Board deems transitory' },
  { label: 'Current authority', value: 'Up to NOK 0.17 per share' },
];

export const investorRelationsPolicy = [
  { label: 'Shareholders', value: 'Equal, simultaneous information' },
  { label: 'Results', value: 'Quarterly, as the financial calendar' },
  { label: 'Presentations', value: 'Open, in person or online' },
  { label: 'Announcements', value: 'On Newsweb and our website' },
];

/** Governance documents, the corporate governance statement first (annual report 2025 from p78). The policies are
 * the HSEQ page's files (hseq.ts), linked here too. Six, so the list fills 3 × 2; the Transparency Act statement
 * has its own page. */
export const governanceDocuments = [
  { label: 'Corporate governance statement 2025', url: `${annualReport2025}#page=78` },
  { label: 'Articles of association (Norwegian)', url: up('2023/05/Reach-Subsea-ASA-Vedtekter-Vedtatt-28032311118569.2.pdf') },
  { label: 'Executive remuneration policy', url: up('2024/05/Reach-Subsea-ASA-executive-remuneration-policy-2024.pdf') },
  { label: 'Code of Conduct 2025', url: up('2025/12/Code-of-Conduct-2025.pdf') },
  { label: 'Anti-bribery policy', url: up('2025/09/REACH-MS-POL-007-Anti-bribery-Policy.pdf') },
  { label: 'Whistleblowing policy', url: up('2025/11/REACH-MS-POL-024-Whistleblowing-Policy.pdf') },
];
