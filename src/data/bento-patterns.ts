// Card bento patterns (21 Sep 2026, Q67): the layouts the Card bento block can take. An editor picks a
// pattern and fills its cells in order; nobody sets a column or row span on a card. Each cell is where
// the card at that position lands on the 12-column desktop grid (cols × rows). Patterns were lifted
// from the bentos already approved on Home, Services, Subsea, Investors and Careers.
// WordPress: a `pattern` select on the block (with a small preview of each), and a card repeater whose
// min and max rows equal the pattern's cell count.

export type BentoPatternId = 'lead-quad' | 'lead-tall-wide' | 'lead-tall-trio-a' | 'lead-tall-trio-b' | 'trio-wide';

export interface BentoCell {
  cols: 3 | 4 | 5 | 6 | 8;
  rows: 1 | 2;
}

export interface BentoPattern {
  label: string;
  /** Where it is used today. */
  usedOn: string;
  cells: BentoCell[];
}

const c = (cols: BentoCell['cols'], rows: BentoCell['rows'] = 1): BentoCell => ({ cols, rows });

export const bentoPatterns: Record<BentoPatternId, BentoPattern> = {
  // One large lead (6×2) beside four quarter tiles.
  'lead-quad': {
    label: 'Lead and four tiles',
    usedOn: 'Investors overview',
    cells: [c(6, 2), c(3), c(3), c(3), c(3)],
  },
  // Lead (6×2), a small tile, a tall tile (3×2), a small tile, then two half-width tiles.
  'lead-tall-wide': {
    label: 'Lead, tall tile and two wide tiles',
    usedOn: 'Subsea',
    cells: [c(6, 2), c(3), c(3, 2), c(3), c(6), c(6)],
  },
  // Lead (6×2), small, tall (3×2), small, then a row of 4 · 5 · 3.
  'lead-tall-trio-a': {
    label: 'Lead, tall tile and a row of three (4 · 5 · 3)',
    usedOn: 'Home',
    cells: [c(6, 2), c(3), c(3, 2), c(3), c(4), c(5), c(3)],
  },
  // The same top as above, then a row of 5 · 3 · 4.
  'lead-tall-trio-b': {
    label: 'Lead, tall tile and a row of three (5 · 3 · 4)',
    usedOn: 'Services overview',
    cells: [c(6, 2), c(3), c(3, 2), c(3), c(5), c(3), c(4)],
  },
  // Three equal tiles, then a wide (8) and a narrow (4) tile.
  'trio-wide': {
    label: 'Three across, then wide and narrow',
    usedOn: 'Careers overview',
    cells: [c(4), c(4), c(4), c(8), c(4)],
  },
};
