// Unique, readable ids for aria-labelledby / aria-controls. A module counter keeps ids unique
// when the review pages render the same copy in several variants.
let counter = 0;

export function makeId(prefix: string, text = ''): string {
  counter += 1;
  const slug = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .slice(0, 32);
  return [prefix, slug, counter.toString(36)].filter(Boolean).join('-');
}

/** Maps a Background field to its surface class. White needs none. */
export function surfaceClass(background?: string): string | undefined {
  return background === 'tint' || background === 'navy' ? `has-surface-${background}` : undefined;
}
