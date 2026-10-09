// Browser helpers shared by the Search results and 404 templates: load the index once, fill a Search result row.
import type { SearchEntry, SearchType } from '../data/search';
import { highlight, withBase, type SearchHit } from './search';

const BASE = import.meta.env.BASE_URL;
let loading: Promise<SearchEntry[]> | null = null;

export function loadIndex(): Promise<SearchEntry[]> {
  loading ??= fetch(`${BASE}search-index.json`).then((r) => {
    if (!r.ok) throw new Error(`search index ${r.status}`);
    return r.json();
  });
  return loading;
}

/** One filled row from the page's <template data-result-template>. */
export function renderResult(template: HTMLTemplateElement, hit: SearchHit, terms: string[], label: Record<SearchType, string>): HTMLElement {
  const row = (template.content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;
  const slot = (name: string) => row.querySelector<HTMLElement>(`[data-slot="${name}"]`)!;
  slot('eyebrow').textContent = [label[hit.type], hit.context].filter(Boolean).join(' · ');
  // Marks in the excerpt only: titles are links, and a mark on every "Reach" in a title list was noise
  slot('title').textContent = hit.title;
  slot('excerpt').innerHTML = highlight(hit.snippet, terms);
  const link = slot('link') as HTMLAnchorElement;
  link.href = withBase(hit.url, BASE);
  if (hit.link) {
    row.dataset.link = hit.link;
    slot('note').textContent = hit.link === 'external' ? ' (opens in a new tab)' : ' (download)';
    if (hit.link === 'external') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }
  return row;
}
