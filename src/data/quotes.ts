// Quotes (8 Oct 2026, Life at Reach, Q130). Real, named quotes from Reach's own news posts, verbatim. A trailing
// "…" marks a quote cut short; nothing is reworded. Careers pages use them until Reach supplies employee quotes
// (crew, trainees, control-room staff). TO CONFIRM with Reach: reusing press quotes on Careers.
//
// WordPress proposal: a **Quote** post type: `quote`, `name`, `role`, optional `photo`, `source` (URL + date, never
// rendered), and a `topic` taxonomy (careers, …). The Statement block's Quotes style picks quotes by topic or by hand.

export interface Quote {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** Where the quote was published (handover note, never rendered). */
  source: string;
  /** PLACEHOLDER (Latin): stands in for an employee quote Reach has yet to supply. Never ship one. */
  placeholder?: boolean;
  topics: string[];
}

export const quotes: Quote[] = [
  {
    id: 'christiansen-offshore-influence',
    quote:
      'Those who operate the vehicles offshore have quite a significant influence on the equipment chosen in Reach, which is highly appreciated.',
    name: 'Bjarte Christiansen',
    role: 'Technical Manager, formerly Offshore Manager',
    source: 'reachsubsea.no/reach-subsea-invests-in-local-suppliers/ (9 Apr 2024); the role line is from the same post',
    topics: ['careers'],
  },
  {
    id: 'doving-joyride',
    quote:
      'To be part of such a groundbreaking project has been a joyride and I have had the time of my life. I am so proud of the unstoppable efforts from the diverse teams…',
    name: 'Bjørg Mathisen Døving',
    role: 'VP Reach Remote',
    source: 'reachsubsea.no/reach-remote-1-named-ship-of-the-year-2024/ (3 Sep 2024)',
    topics: ['careers'],
  },
  {
    id: 'alendal-think-big',
    quote:
      'To revolutionize an industry, you need to innovate. To innovate you need people within the organization and partners alongside you who can think big, think differently, and overcome the challenges that arise along the way.',
    name: 'Jostein Alendal',
    role: 'CEO',
    source: 'reachsubsea.no/reach-remote-1-named-ship-of-the-year-2024/ (3 Sep 2024)',
    topics: ['careers'],
  },
  // PLACEHOLDERS (Ross, 8 Oct 2026): Latin stand-ins so the Life at Reach carousel shows how it reads with more
  // voices. Replace with real employee quotes (crew, trainees, control-room staff) when Reach supplies them.
  {
    id: 'placeholder-offshore',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name: 'Lorem Ipsum',
    role: 'Dolor sit amet',
    source: 'PLACEHOLDER',
    topics: ['careers'],
    placeholder: true,
  },
  {
    id: 'placeholder-trainee',
    quote: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    name: 'Consectetur Adipiscing',
    role: 'Sed do eiusmod',
    source: 'PLACEHOLDER',
    topics: ['careers'],
    placeholder: true,
  },
  {
    id: 'placeholder-control-room',
    quote: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    name: 'Tempor Incididunt',
    role: 'Ut labore et dolore',
    source: 'PLACEHOLDER',
    topics: ['careers'],
    placeholder: true,
  },
];

/** Quotes by id, in the order given. */
export const pickQuotes = (ids: string[]) =>
  ids.map((id) => {
    const q = quotes.find((x) => x.id === id);
    if (!q) throw new Error(`[quotes] unknown quote "${id}"`);
    return q;
  });
