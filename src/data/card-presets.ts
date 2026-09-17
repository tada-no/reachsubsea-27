// Card presets (docs/04 §13): one configured Card per post type, pre-filled like the Figma
// `Card preset/<Name>` components. Pass overrides for real content: cardPresets.project({ title }).
// Copy is placeholder until the CPT fields exist.
import type { CardField } from '../lib/types';

type Preset = (overrides?: Partial<CardField>) => CardField;

const preset =
  (base: CardField): Preset =>
  (overrides = {}) => ({ ...base, ...overrides });

export const cardPresets = {
  service: preset({
    media: 'icon',
    surface: 'white',
    pictogram: 'subsea-infrastructure',
    eyebrow: 'Service',
    title: 'Subsea services',
    description: 'Inspection, maintenance and repair with work-class ROVs from our DP2 vessels.',
    action: { label: 'Explore subsea services', url: '#', action: 'page' },
  }),
  asset: preset({
    media: 'image-top',
    surface: 'white',
    image: { alt: 'Vessel at sea' },
    eyebrow: 'Vessel',
    badge: { label: 'In service', tone: 'success' },
    title: 'Viking Reach',
    meta: [
      { icon: 'ruler-measure', text: 'Length 120 m' },
      { icon: 'users', text: '120 PAX' },
      { icon: 'anchor', text: 'DP2' },
    ],
    action: { label: 'View vessel', url: '#', action: 'page' },
  }),
  project: preset({
    media: 'image-top',
    surface: 'tint',
    image: { alt: 'Survey vessel on the North Sea' },
    eyebrow: 'Offshore wind · 2025',
    title: 'Cable route survey, southern North Sea',
    description: 'Geophysical and geotechnical survey along a 140 km export cable corridor.',
    meta: [
      { icon: 'map-pin', text: 'North Sea' },
      { icon: 'ship', text: 'Viking Reach' },
    ],
    action: { label: 'Read project', url: '#', action: 'page' },
  }),
  news: preset({
    media: 'image-top',
    surface: 'white',
    image: { alt: 'News image' },
    eyebrow: '12 Aug 2026 · 3 min read',
    badge: { label: 'Contract', tone: 'accent' },
    title: 'Reach Subsea wins survey contract in the North Sea',
    description: 'A six-month geophysical survey for an offshore wind developer, starting in spring 2027.',
    action: { label: 'Read more', url: '#', action: 'page' },
  }),
  event: preset({
    media: 'none',
    surface: 'tint',
    eyebrow: 'Conference',
    badge: { label: 'Upcoming', tone: 'navy' },
    title: 'Ocean Business 2027',
    meta: [
      { icon: 'calendar', text: '14–16 April 2027' },
      { icon: 'map-pin', text: 'Southampton, UK' },
      { icon: 'info-circle', text: 'Stand B21' },
    ],
    action: { label: 'Event website', url: '#', action: 'external' },
  }),
  person: preset({
    media: 'image-top',
    surface: 'white',
    image: { alt: 'Portrait' },
    eyebrow: 'Chief Executive Officer',
    title: 'Kari Nordmann',
    meta: [
      { icon: 'phone', text: '+47 400 00 000' },
      { icon: 'mail', text: 'name@reachsubsea.com' },
    ],
    action: { label: 'Read bio', action: 'expand' },
  }),
  document: preset({
    media: 'none',
    surface: 'tint',
    eyebrow: 'Annual report · 2025',
    badge: { label: 'PDF', tone: 'neutral' },
    title: 'Annual & Sustainability Report 2025',
    meta: [
      { icon: 'file-text', text: '4.2 MB' },
      { icon: 'calendar', text: '28 Mar 2026' },
    ],
    action: { label: 'Download report (PDF)', url: '#', action: 'file' },
  }),
  office: preset({
    media: 'none',
    surface: 'white',
    eyebrow: 'Head office',
    title: 'Haugesund',
    meta: [
      { icon: 'map-pin', text: 'Garpeskjærveien 2, 5527 Haugesund' },
      { icon: 'phone', text: '+47 400 07 710' },
      { icon: 'mail', text: 'post@reachsubsea.com' },
    ],
    action: { label: 'Open in Maps', url: '#', action: 'external' },
  }),
} satisfies Record<string, Preset>;

export type CardPresetName = keyof typeof cardPresets;
