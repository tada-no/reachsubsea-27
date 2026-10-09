// Newsroom › Press & media (9 Oct 2026, Q162). Client PDF Design Reference p28 / screens p57–58 for the structure
// (latest news, logo & brand assets, press photos, media contact, FAQ); the live and dev Press & Media page
// (reachsubsea.no/press-media/, page 305, modified 13 Mar 2025) for the content: the three logo packs and every colour
// value, word for word. The logos shown are Reach's own files from the live SVG pack (public/images/brand/, cropped
// to the artwork): the full-colour logo is navy with the sage bar, and its negative white with sage. Reach's Stipl
// brandpad (stipl.site/reach-subsea-1, v1.0.0) only knows the site's one-colour logo and says "never recolour it in
// sage", which the packs contradict: only its clear space is used. Its colours are the site tokens with CMYK
// converted from screen values and no Pantone or RAL, so the press colours stay the live page's print values.
//
// In WordPress:
// - Logo packs: a Press options page (or the Brand assets block's own fields): label, file (Media Library), note.
//   The zips are the live uploads; sizes are read from the attachment, not typed.
// - Colours: the Brand assets block's colour repeater, two groups. Each colour picks its swatch from the theme
//   palette (`token`, so the fill is the same token the site uses) and carries the print values as text.
// - Press photos: a Card grid; each card's action is the pack's file once uploaded, until then the request email
//   (never a dead Download, PDF "Governing conventions").

const base = import.meta.env.BASE_URL;

export const pressHero = {
  title: 'Press & media',
  lead: 'Logos, brand colours and press photos, and a direct line to our media team.',
};

export const mediaEmail = 'media@reachsubsea.com';

/** The named press contact, as on the live page (Ross, 9 Oct 2026: "Jorunn can be the contact"). */
export const pressContact = {
  label: 'Press contact',
  name: 'Jorunn Håvardsholm',
  role: 'Group Communications & Marketing Director',
  phone: '+47 941 54 657',
  email: 'jorunn.havardsholm@reachsubsea.com',
};

/** A mailto that names what is being asked for, so the media team can sort requests. */
export const mediaRequest = (subject: string) => `mailto:${mediaEmail}?subject=${encodeURIComponent(subject)}`;

export interface LogoPack {
  label: string;
  url: string;
  /** What the format is for, shown beside the size. */
  note: string;
  /** From the attachment (HEAD content-length, 9 Oct 2026). */
  size: string;
}

/** One version of the logo as a light | navy pair: the file for white and light grounds, and its negative for navy. */
export interface BrandLogo {
  label: string;
  kind: 'logo' | 'icon';
  light: string;
  navy: string;
}

export const brandAssets = {
  eyebrow: 'Brand resources',
  title: 'Logo & colours',
  // Live copy, trimmed: "Download a logo pack below, which includes EPS files for print and PNG and SVG files for
  // digital use. Each download contains five logos and two icons."
  intro: 'EPS files for print, PNG and SVG files for digital use. Each pack contains five logos and two icons.',
  /** The pack's logos as light | navy pairs: full colour, one colour (navy | white; Ross: keep them in), the icon. The
   * black one-colour logo is in the packs only. In WordPress: Media Library files (SVG). */
  logos: [
    { label: 'Full colour', kind: 'logo', light: `${base}images/brand/logo-full-colour.svg`, navy: `${base}images/brand/logo-full-colour-negative.svg` },
    { label: 'One colour', kind: 'logo', light: `${base}images/brand/logo-navy.svg`, navy: `${base}images/brand/logo-white.svg` },
    { label: 'Icon', kind: 'icon', light: `${base}images/brand/icon-full-colour.svg`, navy: `${base}images/brand/icon-full-colour-negative.svg` },
  ] satisfies BrandLogo[],
  /** From the packs, plus the Stipl brandpad's clear space; cut for a press reader. */
  logoRules: [
    { title: 'Full colour first', text: 'Navy with the green bar on white and light grounds; white with the green bar on navy and over photos.' },
    { title: 'One colour', text: 'Navy, white or black, when print or the background allows only one colour.' },
    { title: 'Clear space', text: 'Keep 10% of the logo’s shorter side clear on every side.' },
    { title: 'Keep it as drawn', text: 'Use the supplied files: no new colours, effects or redrawn wordmark.' },
  ],
  logoPacks: [
    { label: 'EPS', url: 'https://reachsubsea.no/wp-content/uploads/2023/03/EPS.zip', note: 'For print', size: '1.5 MB' },
    { label: 'PNG', url: 'https://reachsubsea.no/wp-content/uploads/2023/03/PNG.zip', note: 'For digital', size: '100 KB' },
    { label: 'SVG', url: 'https://reachsubsea.no/wp-content/uploads/2023/03/SVG.zip', note: 'For digital', size: '11 KB' },
  ] satisfies LogoPack[],
};

export interface BrandColour {
  /** The live page's name: Primary, P1–P4, Secondary, S1–S4. */
  name: string;
  /** Theme palette slug for the fill (tokens.css), so the swatch is the site's own colour. */
  token: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string;
  ral?: string;
}

export interface BrandColourGroup {
  title: string;
  colours: BrandColour[];
}

// The live values unchanged. Two look wrong and are listed for Reach to confirm (client checklist): Primary's CMYK
// (9, 90, 30, 28 is a red-purple, not navy) and S3's Pantone (7443 C, the same as P3).
export const brandColours: BrandColourGroup[] = [
  {
    title: 'Primary colours',
    colours: [
      { name: 'Primary', token: 'navy-800', hex: '#282C59', rgb: '40, 44, 89', cmyk: '9, 90, 30, 28', pantone: '648 C', ral: '5022' },
      { name: 'P1', token: 'navy-400', hex: '#9494AB', rgb: '148, 148, 171', cmyk: '45, 39, 21, 0', pantone: '5285 C' },
      { name: 'P2', token: 'navy-300', hex: '#B4B2C9', rgb: '180, 178, 201', cmyk: '33, 29, 11, 0', pantone: '5295 C' },
      { name: 'P3', token: 'navy-100', hex: '#E3E4EF', rgb: '227, 228, 239', cmyk: '13, 9, 3, 0', pantone: '7443 C' },
      { name: 'P4', token: 'navy-900', hex: '#1B1D3B', rgb: '27, 29, 59', cmyk: '100, 95, 44, 55', pantone: '276 C' },
    ],
  },
  {
    title: 'Secondary colours',
    colours: [
      { name: 'Secondary', token: 'sage-400', hex: '#6EAA8C', rgb: '110, 170, 140', cmyk: '62, 14, 50, 0', pantone: '556 C', ral: '6024' },
      { name: 'S1', token: 'sage-200', hex: '#B7D5C6', rgb: '183, 213, 198', cmyk: '38, 1, 28, 0', pantone: '559 C' },
      { name: 'S2', token: 'sage-100', hex: '#DBEAE2', rgb: '219, 234, 226', cmyk: '20, 0, 14, 0', pantone: '621 C' },
      { name: 'S3', token: 'sage-50', hex: '#F1F7F3', rgb: '241, 247, 243', cmyk: '8, 0, 7, 0', pantone: '7443 C' },
      { name: 'S4', token: 'sage-600', hex: '#416E58', rgb: '65, 110, 88', cmyk: '86, 32, 70, 22', pantone: '5545 C' },
    ],
  },
];

export interface PressPhotoSet {
  title: string;
  /** Format line, e.g. "High-resolution JPG". */
  format: string;
  image: { file: string; alt: string; focalPoint?: { x: number; y: number } };
  /** The pack once Reach uploads it. Unset: the card asks the media team instead. */
  file?: string;
}

// The PDF's four categories were placeholders (two photo sets, two video b-roll sets). Reach has sent no press
// library, so these are the photo sets we can show from the site's own photos; no video b-roll until it exists.
export const pressPhotos = {
  eyebrow: 'Press materials',
  title: 'Photos for press use',
  intro: 'Vessel, ROV and people photography for editorial use. Ask the media team and we send the high-resolution files.',
  sets: [
    {
      title: 'Vessels',
      format: 'High-resolution JPG',
      image: { file: 'vessel-olympic-zeus.jpg', alt: 'Olympic Zeus, a Reach Subsea construction support vessel, at sea', focalPoint: { x: 0.35, y: 0.55 } },
    },
    {
      title: 'ROVs & operations',
      format: 'High-resolution JPG',
      image: { file: 'rov-supporter-launch.jpg', alt: 'A yellow Supporter work-class ROV lowered through the splash zone' },
    },
    {
      title: 'Reach Remote',
      format: 'High-resolution JPG',
      image: { file: 'reach-remote-side.jpg', alt: 'A Reach Remote uncrewed surface vessel in Reach livery on calm water' },
    },
    {
      title: 'Leadership',
      format: 'Portraits, JPG',
      image: { file: 'people/jostein-alendal.jpg', alt: 'Jostein Alendal, Chief Executive Officer', focalPoint: { x: 0.5, y: 0.3 } },
    },
  ] satisfies PressPhotoSet[],
};

export const pressImage = (file: string) => `${base}images/${file}`;
