// Careers › Life at Reach (8 Oct 2026, Q129). Copy comes from the dev site's Life at Reach page
// (/careers/why-work-with-us/life-at-reach/, three sentences), the live site's news and events and the dev Careers
// FAQ, in their own wording. Figures come from key-figures.ts and offices from contact.ts, never typed here.
//
// Not used from the client PDF ("23 — Careers — Life at Reach", Full Resolution screen p51): the two photo cards
// over the hero (nothing overlaps the hero; both are on the Careers overview), the three illustrative quotes
// (three real ones instead, below), the stats band (the overview's, word for word). Our culture covers the values
// and HSEQ, Why work with us the offshore and onshore roles: this page is the places and the people.
//
// Sources:
// - Intro: dev Life at Reach, verbatim but for the last sentence, which is the heading.
// - On board: dev Explore your path › Offshore careers ("DP2 IMR vessels … the expanding Reach Remote fleet") and the
//   dev Careers FAQ on rotations ("from the North Sea to new international markets"). Rotation patterns: not
//   published anywhere; ask Reach.
// - Headquarters: live event "Reach Beyond" (5 Jul 2024: "our headquarters … at the quayside in Haugesund").
// - Technical base: live news "Reach Subsea invests in local suppliers" (9 Apr 2024: Husøy, "a center for
//   technical support and maintenance … workshop facilities, warehouses, and office facilities including quay
//   facilities"). TO CONFIRM: it was being built in April 2024.
// - Control rooms: live Reach Remote copy ("control rooms … both fixed facilities and mobile containment setups")
//   and live news "Close to 1,000 days of offshore operation with nobody on board" (24 Sep 2026: "personnel working
//   across Bergen, Oslo and Aberdeen, enabling continuous 24-hour support regardless of vessel location").
// - Quotes: quotes.ts (live news, 2024; Q130). TO CONFIRM with Reach that press quotes can be reused on Careers;
//   swap in crew or trainee quotes when they come.
//
// WordPress proposal: a Life at Reach section on the Careers options page (intro, places[] with an optional Key
// figures key each) + the Quote post type (quotes.ts) + the FAQ post type (topic Life at Reach).
import { pickFigures } from './key-figures';
import { offices as officeList } from './contact';
import { pickQuotes } from './quotes';

const [fleet, offices, officeCountries] = pickFigures(['fleet', 'offices', 'office-countries']);
const hq = officeList.find((o) => o.hq)!;

/** Hero: the dev page's opening sentence. */
export const lifeHero = {
  title: 'Life at Reach',
  lead: 'Working with us is about more than just a job, it’s about belonging to a team that values sharing knowledge and leaving no one behind.',
};

/** The dev page's other two sentences (the last one is the heading), beside a photo from the 2024 open day at the Haugesund office. */
export const lifeIntro = {
  eyebrow: 'Offshore and onshore',
  title: 'Expect to be inspired and challenged',
  body: [
    `Whether you are based in our offices in ${hq.city} or working offshore, you will collaborate with engaging and energetic colleagues. We provide a secure and meaningful workplace where safety and well-being are the cornerstones of every operation.`,
  ],
  image: {
    file: 'team-lounge-open-day.jpg',
    alt: 'Five colleagues talking in the office lounge, a Reach Remote banner behind them',
    focalPoint: { x: 0.55, y: 0.5 },
  },
};

export interface LifePlace {
  title: string;
  text: string;
  meta: { icon: string; text: string };
  /** A photo of the place (live media, 2023–24; file in public/images). */
  image: { file: string; alt: string; focalPoint: { x: number; y: number } };
}

/** Where a working day happens: at sea, in a control room, at headquarters, in the workshop (paired by length, so the
 * meta lines stay level when the row goes two across). */
export const lifePlaces = {
  eyebrow: 'Where you’ll work',
  title: 'From the quayside to the seabed',
  places: [
    {
      title: 'On board',
      text: 'On our DP2 IMR vessels and the expanding Reach Remote fleet, from the North Sea to new international markets.',
      meta: { icon: 'ship', text: `${fleet.value} ${fleet.label.toLowerCase()}` },
      // live media 2023/03 "Havila Subsea: Reach Subsea personnel on deck during mobilization"
      image: { file: 'life-crew-on-deck.jpg', alt: 'Two crew members in orange overalls on a vessel deck at dusk', focalPoint: { x: 0.68, y: 0.6 } },
    },
    {
      title: 'In a control room',
      text: 'Fixed and mobile control rooms keep specialists in Bergen, Oslo and Aberdeen working alongside the vessels.',
      meta: { icon: 'clock', text: '24-hour support' },
      // live media 2023/03 "Remote-Control-Room-7"
      image: { file: 'life-control-room.jpg', alt: 'Two colleagues at control-room desks lined with screens', focalPoint: { x: 0.5, y: 0.45 } },
    },
    {
      title: 'At headquarters',
      text: `Our headquarters sits on the quayside in ${hq.city}, with more offices across Norway and abroad.`,
      meta: { icon: 'map-pin', text: `${offices.value} offices in ${officeCountries.value} countries` },
      // live media 2024/07 "Kontorer-230913-8" (the same 2023 office shoot as the lounge photos)
      image: { file: 'life-office-harbour-desk.jpg', alt: 'A colleague at his desk by a window looking out over the harbour', focalPoint: { x: 0.55, y: 0.5 } },
    },
    {
      title: 'In the workshop',
      text: 'Our technical base for support and maintenance, with workshops, warehouses, offices and its own quay.',
      meta: { icon: 'map-pin', text: 'Husøy' },
      // live media 2023/09 "IMG_6890" (the same series as the Careers trainee photo). TO CONFIRM: where it was taken
      image: { file: 'life-electronics-workshop.jpg', alt: 'Three engineers talking in an electronics workshop', focalPoint: { x: 0.5, y: 0.4 } },
    },
  ] satisfies LifePlace[],
};

/** "In their own words" (the PDF's heading and title; its three quotes were illustrative): real quotes from
 * quotes.ts, the Quote post type. */
export const lifeQuotes = {
  eyebrow: 'In their own words',
  title: 'What it is like to work here',
  /** Bjørg's first (the most personal, Ross 8 Oct 2026). A carousel: more quotes can join as Reach supplies them. */
  // The placeholder-* quotes are Latin stand-ins (quotes.ts) until Reach supplies employee quotes
  quotes: pickQuotes([
    'doving-joyride',
    'placeholder-offshore',
    'christiansen-offshore-influence',
    'placeholder-trainee',
    'alendal-think-big',
    'placeholder-control-room',
  ]),
};

/** CTA (the PDF's wording). */
export const lifeCta = {
  title: 'Ready to find out more?',
  text: 'Browse current openings on our Candidate Portal.',
};
