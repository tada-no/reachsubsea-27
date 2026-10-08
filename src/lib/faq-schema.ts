// FAQPage structured data (schema.org). One per page: an Accordion with source FAQ emits it for its own items; the FAQ
// page, which has one Accordion per group, turns that off and emits one for all of them.
export const faqPageSchema = (items: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});
