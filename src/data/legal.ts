// Privacy & Cookie Policy (9 Oct 2026, Q157). Source: live https://reachsubsea.no/privacy-policy/ ("Privacy Policy",
// last modified 29 March 2023), in its own wording. Light English fixes only ("counts for" → "applies to", "e-mail
// address is stored" → "email address are stored", British -ise spellings as elsewhere on the site, "NOTE:" → "Note:").
// The opening two paragraphs became the hero lead; the closing "Contact us" became the CTA panel.
// Added: Google's opt-out page behind "opt out of Google Analytics", which the live sentence points to without a link.
//
// Kept although they may no longer match the site (for Reach, docs/00 Q157): the contact forms (the new site has none,
// Q39) and Facebook Pixels (the live HTML loads Google Analytics 4 through Tag Manager and no pixel; Tag Manager could
// still add one). Not covered: the videos, maps, share data and social feed that load only when a visitor asks
// (Consent placeholder, docs/05 §2.13).
//
// WordPress: a Page with core blocks. Each section is a core Group (block style "Legal section") holding a Heading
// and its Paragraphs; the theme sets the heading beside the text. Last updated = the page's modified date.

export interface LegalSection {
  title: string;
  /** Rich text: the section's paragraphs as HTML */
  body: string;
}

export const privacyPolicy = {
  title: 'Privacy & Cookie Policy',
  url: '/privacy-policy/',
  updated: 'Updated March 2023',
  lead: 'How we collect, handle, store and protect information about you when you use reachsubsea.no, the Reach Subsea website.',
  sections: [
    {
      title: 'What information do we collect?',
      body: '<p>Information about your use of the website, in terms of browser settings, IP address and which pages are visited. If contact forms are used, your name, company and email address are stored.</p>',
    },
    {
      title: 'How we use information about you',
      body: '<p>The information collected on our website is used to optimise the website’s user experience and functions based on your user pattern, what you show interest in and what appears to be your intention when visiting reachsubsea.no. Our goal is to easily give you the information you are looking for, as well as an inspiring and intuitive experience.</p>',
    },
    {
      title: 'The grounds we use for processing personal information',
      body: '<p>The website uses cookies to collect information automatically. You can read more about how we use cookies further down this page. If contact forms are used, your name, company and email address are stored.</p>',
    },
    {
      title: 'How personal information is stored',
      body: '<p>Information about your use of the website is stored in various cookies. Read more about our use of cookies further down this page.</p>',
    },
    {
      title: 'Voluntary consent',
      body:
        '<p>Browsers are set to accept cookies. If you prefer not to, you can set your browser to reject cookies, or to reject third-party cookies.</p>' +
        '<p>Note: if you choose to decline cookies, you may lose access to certain features of other websites that rely on cookies to provide services or user experience, such as e-commerce and login. You can also <a href="https://tools.google.com/dlpage/gaoptout" rel="external">opt out of Google Analytics</a>.</p>',
    },
    {
      title: 'What are cookies?',
      body: '<p>reachsubsea.no uses cookies: tiny data files placed in your browser to keep track of what happens during your visit and to recognise your computer. A cookie cannot be used to identify you, and it does not contain viruses.</p>',
    },
    {
      title: 'What cookies do we use on reachsubsea.no?',
      body:
        '<p><strong>Google Analytics 4.</strong> reachsubsea.no uses Google Analytics 4 to analyse user patterns and traffic trends on the website. The collected data is used to optimise and improve the user experience as well as the content of the website. According to Google’s policy for the use of Google Analytics, no personal information about the user is collected. The collected data is stored on Google’s servers, and deleted after 24 months if you have not returned to the website during this period.</p>' +
        '<p><strong>Facebook Pixels.</strong> We use Facebook Pixels to register your visit on reachsubsea.no so that we can advertise to you through Facebook’s network. Several sites use this cookie to allow Facebook to show you ads that are relevant to you and your past search history. In this way, Facebook can downgrade ads that are not relevant or interesting to you, and improve your overall user experience with Facebook.</p>' +
        '<p>We do not collect personal information through Facebook Pixels, only the user history that is stored in the cookie locally on your machine.</p>',
    },
  ] satisfies LegalSection[],
  /** Live "Contact us" section, as the CTA panel */
  contactTitle: 'Questions about your information?',
  contactText: 'Contact us if you have any questions, or need to correct your personal information or withdraw your consent.',
};
