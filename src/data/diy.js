// "Doing it yourself": the usual stack a small site stitches together, and what it costs.
// Prices are the cheapest paid monthly tier on each provider's pricing page (checked Nov 2026;
// Render's Postgres price comes from third-party trackers). Hours are our rough estimate for a
// first-timer, not a measurement. Change any number here and the pricing page follows.

export const USD_INR = 95; // ≈ mid-2026 rate; used only to show dollar bills in rupees
export const HOUR_DEFAULT = 500; // ₹ an hour of your time, the slider's starting point

// One job your site needs. `options[0]` is picked by default; `null` price = pay-as-you-go.
export const JOBS = [
  {
    id: 'db', job: 'A database', plain: 'Where your products, posts and orders live.',
    options: [
      { name: 'Supabase Pro', usd: 25, note: 'Free projects pause after a week without activity' },
      { name: 'MongoDB Atlas Flex', usd: 8, note: 'From $8, up to $30 as traffic grows' },
      { name: 'AWS RDS (micro)', usd: 15, note: 'Mumbai, before storage and backups' },
    ],
    setup: 6, upkeep: 2,
  },
  {
    id: 'api', job: 'A server for your API', plain: 'The program that hands your data to your site.',
    options: [
      { name: 'Render Starter', usd: 7, note: 'Free services sleep when idle; team seats cost extra' },
      { name: 'Railway Hobby', usd: 5, note: 'Pay the full usage once you pass $5' },
      { name: 'AWS Lambda', usd: null, note: 'Pay per request; hard to predict' },
    ],
    setup: 8, upkeep: 3,
  },
  {
    id: 'media', job: 'Photo and file storage', plain: 'So product photos load fast everywhere.',
    options: [
      { name: 'Cloudinary Plus', usd: 99, note: '225 credits a month' },
      { name: 'AWS S3 + CloudFront', usd: null, note: 'Usage-based, plus bucket policies and CORS rules' },
    ],
    setup: 5, upkeep: 1,
  },
  {
    id: 'forms', job: 'A form inbox', plain: 'Contact, booking and order messages.',
    options: [
      { name: 'Formspree Personal', usd: 15, note: '200 submissions a month' },
      { name: 'Formspree Professional', usd: 30, note: '2,000 submissions a month' },
    ],
    setup: 2, upkeep: .5,
  },
  {
    id: 'auth', job: 'Logins for your team', plain: 'So staff and clients can edit safely.',
    options: [
      { name: 'Auth0 Essentials', usd: 35, note: 'Up to 500 monthly active users' },
    ],
    setup: 6, upkeep: 1,
  },
];

export const HIDDEN = [
  { t: 'Bills in dollars', d: 'Every tool above charges in USD, so your bank can add a foreign-exchange fee on top of each one.' },
  { t: 'Free tiers that fall asleep', d: 'Free databases pause and free servers spin down when nobody visits. Your first customer of the day waits.' },
  { t: 'Bills that move', d: 'Usage pricing means a busy week can mean a bigger invoice, and you only find out when it arrives.' },
  { t: 'Five dashboards, five passwords', d: 'Five places to check, five things to update, five ways for something to break at once.' },
  { t: 'Security homework', d: 'Access policies, CORS rules, secret keys and backups. Skip one and your data is exposed.' },
  { t: 'Someone is on call', d: 'When the server goes down on a Sunday, that someone is you.' },
];

// Your weekend, both ways.
export const WEEKEND = {
  diy: [
    ['Fri 9:40 pm', 'Create accounts on five sites. Two want a card in dollars.'],
    ['Sat 11:15 am', 'Your photos won\'t load: "blocked by CORS policy". Three hours of forum threads.'],
    ['Sat 6:30 pm', 'The deploy fails. Then it works. You don\'t know why.'],
    ['Sun 3:12 am', 'Phone buzzes: "api-prod is down". You get up.'],
    ['Mon 9:00 am', 'Five invoices arrive. You still haven\'t added a single product.'],
  ],
  buildfree: [
    ['Fri 9:40 pm', 'Make a "products" collection and add your first items.'],
    ['Fri 9:52 pm', 'Paste one link into your site. Your products are live.'],
    ['Sat, Sun', 'Free. Change a price from your phone if you feel like it.'],
    ['Mon 9:00 am', 'One plan, in rupees. Nothing to fix.'],
  ],
};
