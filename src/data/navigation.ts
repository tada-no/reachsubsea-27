// Header family content (docs/04 §16, docs/extract/header-recommendation.md §3.3).
// WP note: in production, Menu link rows come from the `primary` menu; intro/feature come
// from one ACF options row per section. Here it's typed placeholder data for the static prototype.
import type { CardField, LinkField } from '../lib/types';
import { worldPath, worldLabel } from './world';

/** One row in a Mega menu / Site menu / Mobile menu link list. */
export interface MenuLinkItem {
  label: string;
  href: string;
  external?: boolean;
  children?: MenuLinkItem[];
}

/** A `Link`-style row (Strip, Search popular links, utility links). */
export interface NavLink extends LinkField {
  external?: boolean;
}

/** One of the 7 Mega menu panels. */
export interface NavSection {
  id: string;
  label: string;
  href: string;
  /** Intro slot: name + one line + overview link (cols 1–3). */
  description: string;
  overview: NavLink;
  /** Links slot (cols 4–8): ≤6 rows, L1 with optional L2 children. */
  links: MenuLinkItem[];
  /** Feature slot (cols 9–12): 0–1 Card. */
  feature?: CardField;
}

/** One primary nav item. `panel` points at a NavSection id; items without it (Contact) are plain links. */
export interface NavItemData {
  id: string;
  label: string;
  href: string;
  panel?: string;
}

// 17 Sep 2026 (Q49): the bar carries 6 links. Projects and Newsroom moved into the Site menu, where
// they lead with real content (latest project, news, events) instead of a bare label. Their Mega
// menu panels stay defined in `navSections` below: the Mobile menu still lists every section.
export const primaryNav: NavItemData[] = [
  { id: 'services', label: 'Services', href: '/services/', panel: 'services' },
  { id: 'assets', label: 'Assets', href: '/assets/', panel: 'assets' },
  { id: 'company', label: 'Company', href: '/company/', panel: 'company' },
  { id: 'investors', label: 'Investors', href: '/investors/', panel: 'investors' },
  { id: 'careers', label: 'Careers', href: '/careers/', panel: 'careers' },
  { id: 'contact', label: 'Contact', href: '/contact/' },
];

export const navSections: NavSection[] = [
  {
    id: 'services',
    label: 'Services',
    href: '/services/',
    description: 'Subsea, survey and monitoring services delivered from our own vessels and remote technology.',
    overview: { label: 'All services', url: '/services/' },
    links: [
      { label: 'Subsea', href: '/services/subsea/' },
      { label: 'Survey', href: '/services/survey/' },
      { label: 'Monitoring', href: '/services/monitoring/' },
      {
        label: 'Technology & Innovation',
        href: '/services/technology-innovation/',
        children: [{ label: 'Research & Publications', href: '/services/technology-innovation/research-publications/' }],
      },
      { label: 'Explore 3D World', href: worldPath },
    ],
    feature: {
      media: 'image-bg',
      image: { src: `${import.meta.env.BASE_URL}images/reach-remote-bow.jpg`, alt: 'Reach Remote 1 uncrewed surface vessel seen from the bow', focalPoint: { x: 0.6, y: 0.45 } },
      eyebrow: 'Remote operations',
      title: 'Reach Remote, controlled from shore',
      action: { label: 'Meet Reach Remote', url: '/assets/reach-remote/' },
    },
  },
  {
    id: 'assets',
    label: 'Assets',
    href: '/assets/',
    description: 'Our fleet of vessels, uncrewed surface vessels, ROVs and survey equipment.',
    overview: { label: 'Fleet overview', url: '/assets/' },
    links: [
      { label: 'Vessels', href: '/assets/vessels/' },
      {
        label: 'Reach Remote',
        href: '/assets/reach-remote/',
        children: [{ label: 'Reach Remote 3 & 4', href: '/assets/reach-remote/3-4/' }],
      },
      { label: 'ROVs', href: '/assets/rovs/' },
      { label: 'Survey & monitoring equipment', href: '/assets/survey-monitoring-equipment/' },
    ],
    feature: {
      media: 'image-bg',
      image: { src: `${import.meta.env.BASE_URL}images/vessel-olympic-zeus.jpg`, alt: 'Olympic Zeus, a Reach Subsea construction support vessel, at sea', focalPoint: { x: 0.35, y: 0.55 } },
      eyebrow: 'Reach Remote',
      badge: { label: 'In build', tone: 'navy' },
      title: 'Reach Remote 3 & 4',
      action: { label: 'Read more', url: '/assets/reach-remote/3-4/' },
    },
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects/',
    description: 'Selected work for offshore energy, wind and infrastructure clients.',
    overview: { label: 'All projects', url: '/projects/' },
    links: [
      { label: 'Subsea projects', href: '/projects/?service=subsea' },
      { label: 'Survey projects', href: '/projects/?service=survey' },
      { label: 'Monitoring projects', href: '/projects/?service=monitoring' },
    ],
    feature: {
      media: 'none',
      surface: 'tint',
      eyebrow: 'Latest project',
      title: 'Cable route survey, southern North Sea',
      action: { label: 'Read project', url: '/projects/cable-route-survey-southern-north-sea/' },
    },
  },
  {
    id: 'company',
    label: 'Company',
    href: '/company/',
    description: 'Who we are, how we are governed and how we work safely and sustainably.',
    overview: { label: 'About Reach', url: '/company/' },
    links: [
      { label: 'Leadership & Board', href: '/company/leadership-board/' },
      { label: 'HSEQ', href: '/company/hseq/' },
      { label: 'Sustainability', href: '/company/sustainability/' },
    ],
    feature: {
      media: 'image-bg',
      image: { src: `${import.meta.env.BASE_URL}images/windfarm-turbine-install.jpg`, alt: 'Vessel installing turbines at an offshore wind farm', focalPoint: { x: 0.6, y: 0.55 } },
      eyebrow: 'Sustainability',
      badge: { label: 'PDF', tone: 'neutral' },
      title: 'Sustainability report 2025',
      action: { label: 'Download report (PDF)', url: '#', action: 'file' },
    },
  },
  {
    id: 'investors',
    label: 'Investors',
    href: '/investors/',
    description: 'Financial reports, presentations, share information and governance.',
    overview: { label: 'Investor overview', url: '/investors/' },
    links: [
      { label: 'Why invest', href: '/investors/why-invest/' },
      { label: 'Charter agreements', href: '/investors/charter-agreements/' },
      { label: 'Reports & presentations', href: '/investors/reports-presentations/' },
      { label: 'Governance & meetings', href: '/investors/governance-meetings/' },
      { label: 'Financial calendar', href: '/investors/financial-calendar/' },
      { label: 'Share information', href: '/investors/share-information/' },
    ],
    feature: {
      media: 'image-bg',
      image: { src: `${import.meta.env.BASE_URL}images/ocean-horizon-calm.jpg`, alt: 'Calm open ocean at the horizon', focalPoint: { x: 0.5, y: 0.4 } },
      eyebrow: 'Next event',
      badge: { label: 'Upcoming', tone: 'navy' },
      title: 'Next results presentation',
      description: 'Date and webcast link from the financial calendar.',
      action: { label: 'Financial calendar', url: '/investors/financial-calendar/' },
    },
  },
  {
    id: 'careers',
    label: 'Careers',
    href: '/careers/',
    description: 'Life at Reach and how to join our offshore and onshore teams.',
    overview: { label: 'Careers overview', url: '/careers/' },
    links: [
      { label: 'Life at Reach', href: '/careers/life-at-reach/' },
      { label: 'Our culture', href: '/careers/our-culture/' },
      { label: 'Why work with us', href: '/careers/why-work-with-us/' },
    ],
    feature: {
      media: 'image-bg',
      image: { src: `${import.meta.env.BASE_URL}images/team-lounge-harbour.jpg`, alt: 'Colleagues talking in a lounge overlooking the harbour', focalPoint: { x: 0.4, y: 0.45 } },
      eyebrow: 'Join us',
      title: 'Open positions',
      description: 'Current vacancies are listed on HR-Manager.',
      action: { label: 'View open positions', url: 'https://hr-manager.net/reachsubsea', action: 'external' },
    },
  },
  {
    id: 'newsroom',
    label: 'Newsroom',
    href: '/newsroom/',
    description: 'News, stock exchange announcements, events and press resources.',
    overview: { label: 'All news', url: '/newsroom/' },
    links: [
      { label: 'Stock exchange announcements', href: '/newsroom/stock-exchange-announcements/' },
      { label: 'Events', href: '/newsroom/events/' },
      { label: 'Press & media', href: '/newsroom/press-media/' },
    ],
    feature: {
      media: 'none',
      surface: 'tint',
      eyebrow: '12 Aug 2026 · 3 min read',
      badge: { label: 'Contract', tone: 'navy' },
      title: 'Headline of the latest news article',
      action: { label: 'Read more', url: '/newsroom/headline-of-the-latest-news-article/' },
    },
  },
];

/** Site menu (hamburger, ≥1200): big links for what the bar no longer carries, plus featured content.
 * WP note: `links` = a `site-menu` menu location; project/news/events are queries (latest sticky
 * project, 3 latest posts, next 2 events), so the menu stays fresh without editor work. */
export const siteMenu = {
  links: [
    { label: 'Projects', href: '/projects/', note: 'Our track record, by service' },
    { label: 'Newsroom', href: '/newsroom/', note: 'News, announcements and press' },
    { label: 'Events', href: '/newsroom/events/', note: 'Conferences where we exhibit' },
    { label: 'FAQ', href: '/faq/', note: 'Answers, organised by topic' },
  ],
  project: {
    media: 'image-bg',
    eyebrow: 'Latest project',
    title: 'Cable route survey, southern North Sea',
    description: 'Geophysical and geotechnical survey along a 140 km export cable corridor.',
    image: { src: `${import.meta.env.BASE_URL}images/usv-drix-wind.jpg`, alt: 'Uncrewed survey vessel passing an offshore wind farm' },
    action: { label: 'Read project', url: '/projects/cable-route-survey-southern-north-sea/' },
  } satisfies CardField,
  news: [
    { date: '04.08.2026', title: 'MoA signed for sale of Viking Reach and onboard WROV', href: '/newsroom/' },
    { date: '13.10.2025', title: 'Reach Remote 1 cleared for operations without supporting vessel', href: '/newsroom/' },
    { date: '24.09.2025', title: 'Reach Subsea orders Reach Remote 3 and 4 from Kongsberg Maritime', href: '/newsroom/' },
  ],
  events: [
    { date: '15 Oct 2026', title: 'Offshore Technology Conference', place: 'Stavanger', href: '/newsroom/events/' },
    { date: '14 Apr 2027', title: 'Ocean Business 2027', place: 'Southampton', href: '/newsroom/events/' },
  ],
  world: { label: worldLabel, href: worldPath },
};

export const navSectionById = new Map(navSections.map((section) => [section.id, section]));

/** Site menu / Mobile menu "Get in touch" utility block. */
export const getInTouch: MenuLinkItem[] = [
  { label: 'Contact', href: '/contact/' },
  { label: 'FAQ', href: '/faq/' },
  { label: '+47 400 07 710', href: 'tel:+4740007710' },
  { label: 'post@reachsubsea.com', href: 'mailto:post@reachsubsea.com' },
];

/** Mobile menu utility block below the accordion (docs/04 §16 Mobile menu panel). */
export const mobileUtility: NavLink[] = [
  { label: 'Open positions', url: 'https://hr-manager.net/reachsubsea', action: 'external', external: true },
  { label: 'FAQ', url: '/faq/' },
];

export const contactDetails = {
  phone: { label: '+47 400 07 710', href: 'tel:+4740007710' },
  email: { label: 'post@reachsubsea.com', href: 'mailto:post@reachsubsea.com' },
};

export const socialLinks: { icon: string; label: string; href: string }[] = [
  { icon: 'brand-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/reach-subsea/' },
  { icon: 'brand-facebook', label: 'Facebook', href: 'https://www.facebook.com/reachsubsea/' },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy & Cookie Policy', url: '/privacy-cookie-policy/' },
  { label: 'Transparency Act', url: '/transparency-act/' },
];

/** Search panel "Popular" quick links (editor-set, docs/04 §16 Search panel). */
export const popularSearchLinks: NavLink[] = [
  { label: 'Fleet overview', url: '/assets/' },
  { label: 'Reports & presentations', url: '/investors/reports-presentations/' },
  { label: 'Open positions', url: 'https://hr-manager.net/reachsubsea', action: 'external', external: true },
  { label: 'Explore 3D World', url: worldPath },
  { label: 'Contact', url: '/contact/' },
];
