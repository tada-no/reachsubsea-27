// Newsroom (8 Oct 2026, Q145). Every post on the live site, pulled by scripts/import-news.mjs into news-posts.json:
// title, slug, date, category, featured image, a summary and the cleaned body. In WordPress these are ordinary
// Posts (core post type, core categories News and Reports), imported from the live site, so nothing here is a
// custom field. The archive is the posts index (home.php) and the category archives; the single is single.php.
//
// Permalinks: /newsroom/%postname%/ (Q145), category base newsroom/category. Redirects from the live root URLs:
// docs/extract/news-redirects.csv. Paging: the lead (newest post) shows on page 1 only and the rest run 10 a page
// in the 4 · 2 · 4 rhythm, so the main query is offset by one (pre_get_posts + found_posts, docs/09 §News).
import raw from './news-posts.json';
import { shortDate } from '../lib/dates';
import type { CardField } from '../lib/types';

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  /** ISO date ("2016-08" for a month estimate). `dateSource`: 'post' = the live post date; for the 109 posts whose
   * live date is the 21 Mar 2023 bulk import (Q146): 'newsweb' = the matching Oslo Børs release, 'estimate' = a date
   * in the text or the month of its images, 'undated' = no evidence (kept last, shown as "Undated"). */
  date: string;
  dateSource: 'post' | 'newsweb' | 'estimate' | 'dateline' | 'undated';
  categories: string[];
  excerpt: string;
  readMinutes: number;
  image: { card: string; large: string; width: number | null; height: number | null; alt: string } | null;
  oldUrl: string;
  content: string;
}

export const newsPosts = raw as NewsPost[];

export const NEWSROOM = '/newsroom/';
export const PER_PAGE = 10;

export const newsCategories = [
  { slug: 'news', label: 'News' },
  { slug: 'reports', label: 'Reports' },
].map((c) => ({ ...c, count: newsPosts.filter((p) => p.categories.includes(c.slug)).length }));

export const categoryLabel = (slug: string) => newsCategories.find((c) => c.slug === slug)?.label ?? slug;

/** The date as shown: "18 Aug 2026", "Aug 2016" for a month estimate, "Undated" with no evidence. */
export const postDate = (post: NewsPost) => (post.dateSource === 'undated' ? 'Undated' : shortDate(post.date));

export const postUrl = (post: NewsPost) => `${NEWSROOM}${post.slug}/`;
export const archiveUrl = (category?: string, page = 1) =>
  `${NEWSROOM}${category ? `category/${category}/` : ''}${page > 1 ? `page/${page}/` : ''}`;

export const postsIn = (category?: string) => (category ? newsPosts.filter((p) => p.categories.includes(category)) : newsPosts);

/** Pages of an archive: the lead (newest) on page 1 only, then PER_PAGE a page. */
export function archivePages(category?: string) {
  const [lead, ...rest] = postsIn(category);
  const total = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  return Array.from({ length: total }, (_, i) => ({
    page: i + 1,
    total,
    lead: i === 0 ? lead : undefined,
    posts: rest.slice(i * PER_PAGE, (i + 1) * PER_PAGE),
  }));
}

/** No featured image (5 posts): the calm sea the Careers pages use, as WordPress's default featured image. */
const FALLBACK_IMAGE = '/images/ocean-horizon-calm.jpg';

/** A post as a News card (cardPresets.news shape). Reports carry a badge; news is the default and doesn't. The read
 * time is on the single only: beside the date it pushed the Report badge to a second line in a 4-across row, so
 * those titles started lower than their neighbours'. */
export function newsCard(post: NewsPost, size: CardField['size'] = 'default'): CardField {
  const featured = size === 'featured';
  return {
    media: 'image-top',
    surface: 'white',
    size,
    // Decorative: the title beside it says what the story is (the live images have no alt text)
    image: { src: post.image ? (featured ? post.image.large : post.image.card) : FALLBACK_IMAGE, alt: '' },
    eyebrow: postDate(post),
    badge: post.categories.includes('reports') ? { label: 'Report', tone: 'accent' } : undefined,
    title: post.title,
    description: post.excerpt,
    action: { label: 'Read more', url: postUrl(post), action: 'page', context: post.title },
  };
}
