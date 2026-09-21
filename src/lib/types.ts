// Shared field types. Block props are named like the block fields in docs/05-blocks-spec.md §2,
// which are the WordPress handoff contract (ACF or native attributes).

/** Block background (docs/05 §0). White = bg/default, Tint = bg/tint, Navy = Navy colour mode. */
export type Background = 'white' | 'tint' | 'navy';

/** Block vertical spacing → padding y section/sm|md|lg. */
export type Spacing = 'sm' | 'md' | 'lg';

/** Fields every block has. */
export interface BlockFields {
  background?: Background;
  spacing?: Spacing;
  /** Optional anchor id, used by Section subnav in-page links. */
  anchor?: string;
}

/** Tabler Outline icon name (node_modules/@tabler/icons/icons/outline/<name>.svg). */
export type IconName = string;

/** Link component `Action` (docs/04 §6). */
export type LinkAction = 'page' | 'external' | 'file' | 'video' | 'expand' | 'anchor';

export interface ImageField {
  /** Omit for the Figma placeholder (bg/disabled + photo icon). */
  src?: string;
  alt: string;
  /** Focal point from the media library, 0–1 on each axis. */
  focalPoint?: { x: number; y: number };
  width?: number;
  height?: number;
}

/** A link-style action (Link component). */
export interface LinkField {
  label: string;
  url?: string;
  action?: LinkAction;
  /** Visually hidden context appended to the label ("Q2 2025 report, PDF"). */
  context?: string;
}

/** A Page hero / CTA action: the first is usually a Button, the second a Link. */
export interface ActionField extends LinkField {
  type?: 'button' | 'link';
  buttonStyle?: 'primary' | 'secondary' | 'outline';
}

export interface MetaField {
  icon: IconName;
  text: string;
  /** Optional link: tel:, mailto: or a maps url. */
  href?: string;
}

export type BadgeTone = 'neutral' | 'accent' | 'navy' | 'success' | 'error';

export interface BadgeField {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
}

/** Shared Section header (docs/05 §1). */
export interface SectionHeaderField {
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: LinkField;
  align?: 'start' | 'center';
}

/** Card (docs/04 §13). */
export interface CardField {
  /** `icon` = 96 pictogram above the text; `pictogram-panel` = large square pictogram on a tint panel;
   * `stat` = one key figure as the card's media (Display value, counts up once in view). */
  media?: 'none' | 'icon' | 'pictogram-panel' | 'image-top' | 'image-bg' | 'stat';
  surface?: 'white' | 'tint' | 'navy';
  size?: 'default' | 'featured';
  pictogram?: string;
  image?: ImageField;
  /** Media `stat`: the figure, e.g. "750+". Pick it from the Key figures options page. */
  statValue?: string;
  eyebrow?: string;
  badge?: BadgeField;
  title: string;
  description?: string;
  meta?: MetaField[];
  /** Sub-page links under the text (19 Sep 2026, Services overview: a service line's sub-services).
   * A card with links is not a stretched link: every link is its own target. */
  links?: LinkField[];
  /** 3 short scope items as a quiet list under the text (19 Sep 2026, service singles).
   * Not links. */
  scope?: string[];
  action?: LinkField;
}

/** Key figures options page row (brief §5.3). */
export interface StatField {
  key?: string;
  value: string;
  label: string;
  note?: string;
  /** Results style: small unit before the figure ("NOK") and the scale after it ("m", "bn"). */
  unit?: string;
  suffix?: string;
  /** Results style: change line under the label, e.g. "+44% year on year". */
  delta?: string;
  trend?: 'up' | 'down';
}

/** Report card (19 Sep 2026): one document or date in the investor report cards. */
export interface ReportCardField {
  /** A date tile (month · day) when set, else a PDF tile. */
  date?: string;
  kicker: string;
  title: string;
  meta?: string;
  /** ISO date: appends "· in N days" to the meta, refreshed in the browser. */
  countdownTo?: string;
  /** 1–3 actions, in one ruled row at the foot of the card. */
  links: (LinkField & { download?: string })[];
  tone?: 'tint' | 'navy';
}
