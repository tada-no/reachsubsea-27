// Careers › Overview (20 Sep 2026). Copy comes from the live /careers/ page (the values copy, the Trainees block,
// the candidate-portal links, the named recruiter) and the dev site's Explore your path, Trainees and Careers
// FAQ pages, in their own wording. Nothing here is written by us except short lead-ins; the PDF's illustrative
// role areas, quotes and benefits are not used. Figures are never typed here: they come from key-figures.ts.
// In WordPress: a Careers options page (recruiter, HR-Manager links) + the FAQ post type (topic Careers) +
// vacancies from the HR-Manager feed (the developer's job; the four below are a snapshot).
import { pickFigures } from './key-figures';

const [traineeSince] = pickFigures(['trainee-since']);

/** One page for vacancies, apply, register (Q24). The candidate portal is the same HR-Manager customer. */
export const hrManager = {
  vacancies: 'https://hr-manager.net/reachsubsea',
  register: 'https://candidate.hr-manager.net/Agent/Subscription.aspx?cid=1021',
  openApply:
    'https://candidate.hr-manager.net/ApplicationForm/SinglePageApplicationForm.aspx?cid=1021&departmentId=8562&ProjectId=66704&MediaId=5&wStep=1',
};

export interface Vacancy {
  title: string;
  workplace: string;
  /** ISO application deadline. */
  due: string;
  url: string;
}

/** SNAPSHOT of the live HR-Manager list, 20 Sep 2026 (identical on the live and dev sites). Placeholder for
 * the developer's feed: never hard-code vacancies in production. */
export const vacancies: Vacancy[] = [
  {
    title: 'Data Processor',
    workplace: 'Perth, Australia',
    due: '2026-09-20',
    url: 'https://candidate.hr-manager.net/ApplicationInit.aspx?cid=1021&ProjectId=66977&DepartmentId=8568&MediaId=5',
  },
  {
    title: 'HSEQ Engineer',
    workplace: 'Perth, Australia',
    due: '2026-09-20',
    url: 'https://candidate.hr-manager.net/ApplicationInit.aspx?cid=1021&ProjectId=66979&DepartmentId=8562&MediaId=5',
  },
  {
    title: 'Electronics Engineer',
    workplace: 'Bergen',
    due: '2026-09-30',
    url: 'https://candidate.hr-manager.net/ApplicationInit.aspx?cid=1021&ProjectId=66980&DepartmentId=8566&MediaId=5',
  },
  {
    title: 'Crewing Coordinator',
    workplace: 'Aberdeen, UK',
    due: '2026-10-04',
    url: 'https://candidate.hr-manager.net/ApplicationInit.aspx?cid=1021&ProjectId=66981&DepartmentId=8562&MediaId=5',
  },
];

/** "Who thrives here": the live /careers/ copy, verbatim except that the values sentence is split into its
 * four points (Learn, Teach, Reach, never leave anyone behind). */
export const thrive = {
  title: 'You will thrive if your values are in line with ours.',
  /** The live copy, unchanged, in two paragraphs (two columns under the heading). */
  body: [
    'We value competence and experience, but we set an even higher regard to attitude and potential! Sounds good, doesn’t it? Does it come without frustrations? We can assure you that it does not.',
    'Nothing comes for free folks. Ultimately, the sense of accomplishment we experience when overcoming challenges, coupled with the celebrations we share as a team, makes all the effort worthwhile.',
  ],
  items: [
    { title: 'Learn', pictogram: 'value-learn', text: 'We continuously search for new and relevant insight to challenge established ways of performance.' },
    { title: 'Teach', pictogram: 'value-teach', text: 'We value sharing of knowledge throughout the team, and succeeding in alignment with our clients.' },
    { title: 'Reach', pictogram: 'value-reach', text: 'We substantiate the importance of having ambitions, and of reaching for them.' },
    { title: 'Never leave anyone behind', pictogram: 'value-behind', text: 'A commitment we have manifested. It is the attitude we expect from our people.' },
  ],
};

/** Trainees (live /careers/ Trainees block; dev /careers/opportunities/trainees-laerlinger/). */
export const trainees = {
  title: 'Trainees (lærlinger)',
  image: { file: 'trainee-workshop.jpg', alt: 'Three engineers working on cables and electronics at a workshop bench', focalPoint: { x: 0.55, y: 0.5 } },
  /** The commitment, then the two tracks as bold lead-ins (the "rooted in our belief…" sentence is left out). */
  body: [
    `Since ${traineeSince.value}, Reach Subsea has embraced a culture of welcoming trainees (lærlinger) into our organisation. Each trainee who successfully completes their final exams during their traineeship has been offered a full-time position.`,
    '<strong>Offshore trainees</strong> have completed ‘Grunnkurs elektro og datateknologi’ or ‘Teknologi og industrifag’, in addition to ‘VG2 Automatisering’.',
    '<strong>Onshore trainees</strong> vary, with traineeships in administration, IT, media and similar fields.',
  ],
};

/** Named recruiter (live /careers/, Feb 2026). */
export const recruiter = {
  label: 'Recruitment',
  name: 'Alexander Nygård Bakke',
  role: 'Group Talent Acquisition Specialist',
  phone: '+47 981 112 83',
  email: 'alexander.bakke@reachsubsea.com',
};

/** Dev /careers/opportunities/careers-faq/, in its own wording. Left out: visa sponsorship and global rotation
 * (policy claims that are not on the live site: the client should confirm them). Trainee vs graduate: the dated
 * "2026 intake" clause is dropped. */
export const careersFaqs = [
  {
    slug: 'how-do-i-apply',
    question: 'How do I apply?',
    answer:
      'All applications must be submitted through our Candidate Portal. To comply with GDPR and ensure your data is handled securely, we do not accept applications via email.',
    open: true,
  },
  {
    slug: 'open-application',
    question: 'Can I send an open application?',
    answer:
      'Yes. If you don’t see a current vacancy that matches your profile, use the “Open Apply” link in our portal to submit your details for future consideration.',
  },
  {
    slug: 'stay-updated',
    question: 'How can I stay updated on new roles?',
    answer:
      'We recommend using the “Register” function in our portal. You will receive an automated notification as soon as a role matching your interests is posted.',
  },
  {
    slug: 'trainee-or-graduate',
    question: 'What is the difference between a trainee and a graduate?',
    answer:
      'Trainees (lærlinger) are vocational students working toward a trade certificate (for example Automation or Electrical). Graduates are university or technical college students entering the workforce with a degree.',
  },
  {
    slug: 'onshore-experience',
    question: 'Do I need offshore experience for an onshore role?',
    answer:
      'Not necessarily. While maritime knowledge is helpful, our onshore teams focus on engineering, data analytics and project management where diverse technical backgrounds are highly valued.',
  },
];
