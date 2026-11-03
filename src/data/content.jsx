// Page copy that comes in lists. Components map over these arrays,
// so adding a card / FAQ / tier is a data change, not a markup change.
import Placeholder from '../components/ui/Placeholder';

export const HERO_WORDS = ['products.', 'messages.', 'blog posts.', 'sign-ups.'];

export const HERO_STATS = [
  { color: 'c-sage', chip: 'Time to first link', n: '2 min', caption: 'From sign-up to a live link your site can read.' },
  { color: 'c-lilac', chip: 'Servers to babysit', n: 'Zero', caption: 'Nothing to install, patch or wake up for at 2 a.m.' },
  { color: 'c-butter', chip: 'Logins to remember', n: 'One', caption: 'Content, forms, API keys and your team, in one place.' },
];

export const WORKS_WITH = ['React', 'Next.js', 'HTML5', 'Webflow', 'Framer', 'Flutter', 'v0', 'Cursor', 'Claude', 'Lovable', 'Bolt'];

export const MANIFESTO = 'They come for the shirt, the menu, the booking, the blog post. They never see the server, the tables, or the weekend you spent wiring them up. Your visitors only meet the front of the shop. So spend your time there, and let the back office run itself.';

export const PAINS = [
  { title: 'Show product photos', chips: ['AWS S3', 'IAM policy', 'CORS rules', 'CloudFront CDN', 'Cloudinary'], ouch: 'Create a bucket, write a policy, fix CORS, add a CDN… then a bill.' },
  { title: 'Store products & orders', chips: ['MongoDB Atlas', 'Supabase', 'Firebase', 'AWS RDS', 'Airtable'], ouch: 'Pick a database, design tables, write an API to read them.' },
  { title: 'Run the API', chips: ['Render', 'AWS Lambda', 'Vercel', 'Netlify'], ouch: 'Deploy a server, keep it awake, watch it at 3 a.m.' },
  { title: 'Collect forms & logins', chips: ['Formspree', 'Typeform', 'Auth0'], ouch: 'One more dashboard for messages, another for logins.' },
  { title: 'Take payments', chips: ['Stripe', 'Razorpay', 'Webhooks'], ouch: 'Keys, webhooks and a server to confirm every order.' },
];

export const BILLS = [
  ['Database', '$25*'],
  ['Image storage + CDN', '$20*'],
  ['API server', '$19*'],
  ['Hosting (team plan)', '$20*'],
  ['Form inbox', '$10*'],
  ['Logins / auth', '$35*'],
];

export const HOW_STEPS = [
  { title: 'Name it.', text: "Say what you're keeping: products with a name, price and photo. That's a collection." },
  { title: 'Fill it.', text: 'Add items like a spreadsheet. Change a price from your phone at midnight.' },
  { title: 'Paste it.', text: 'Every collection gets a link. Drop it into any site, app or AI builder.' },
  { title: 'Hear back.', text: 'Forms land in one inbox. No extra tool, no extra bill.' },
];

export const INBOX = [
  { av: 'E', cls: '', name: 'Emma S.', msg: 'Do you ship to Berlin?', time: '2m', unread: true },
  { av: 'D', cls: 'b', name: 'Daniel K.', msg: 'Bulk order for our café, 40 mugs', time: '1h', unread: true },
  { av: 'A', cls: 'c', name: 'Aiko T.', msg: 'Loved the tote. Restock date?', time: '3h' },
  { av: 'M', cls: 'd', name: 'Marco R.', msg: 'Booking for Saturday, 4 people', time: '1d' },
];

export const PLAYGROUND_PRODUCTS = [
  { name: 'Linen shirt', price: 24, stock: true, img: '/img/shirt.webp' },
  { name: 'Denim jeans', price: 32, stock: true, img: '/img/jeans.webp' },
  { name: 'Houndstooth tote', price: 12, stock: false, img: '/img/tote.webp' },
];

export const AI_STEPS = ['Copy your collection link', 'Paste it into your prompt', 'Your app shows real, editable data'];
export const AI_TOOLS = ['Claude', 'Cursor', 'v0', 'ChatGPT', 'Lovable', 'Bolt'];
export const AI_PROMPT = 'Show my menu from api.buildfree.dev/cafe/menu as cards with price and photo.';
export const AI_BOT_STEPS = ['✓ Fetched 3 items from your link', '✓ Built a menu grid', '✓ Prices update when you edit them'];
export const AI_MENU = [['Avocado toast', '$9'], ['Falafel wrap', '$8'], ['Cold brew', '$5']];

export const CASES = [
  { who: 'Shop owners', thought: '"I just want to change a price without calling my web guy."', big: 'Prices', cap: 'you can change from your phone', points: ['Products, offers, reviews', 'Order & contact forms', 'No developer on speed-dial'] },
  { who: 'AI & no-code builders', thought: '"The UI took an hour. The backend is eating my weekend."', big: '1 link', cap: 'your Lovable, Bolt or v0 app can read', points: ['Real data, not mock arrays', 'Waitlists that actually save', 'Works with any AI builder'] },
  { who: 'Agencies & freelancers', thought: '"Every \'tiny text change\' email costs me an hour."', big: '1 login', cap: 'per client, for their content only', points: ['One project per client', 'Clients edit, you keep the code', 'All sites, one dashboard'] },
  { who: 'Developers', thought: '"I\'m not spinning up a server for a landing page."', big: 'GET', cap: 'clean JSON endpoints & API keys', points: ['Public read endpoints', 'Form POST endpoints', 'Keys you can revoke'] },
];

export const LINES = [['Content', 'before code.'], ['Launch', 'before setup.'], ['Ideas', 'before invoices.']];

// Plans, as set up in the billing admin. Prices in INR; request limits reset monthly.
// `icon` picks the 3D model in the pricing section (bolt, flame or sun).
export const PLANS = [
  { id: 'free', name: 'Free', price: '₹0', per: 'forever', icon: 'bolt', cta: 'Start free',
    lede: 'Everything you need to launch a small site and see it work end to end.',
    stats: ['1 project', '5 collections', '500 reads / month', '204 MB storage'] },
  { id: 'pro', name: 'Pro', price: '₹1,000', per: '/ month', icon: 'flame', cta: 'Choose Pro', hot: true,
    lede: 'Room for real traffic and a handful of sites, with more keys and a bigger team.',
    stats: ['10 projects', '50,000 reads / month', '5 team members', '2 GB storage'] },
  { id: 'max', name: 'Pro Max', price: '₹2,000', per: '/ month', icon: 'sun', cta: 'Choose Pro Max',
    lede: 'For agencies and busy shops: the most projects, unlimited team members and the most room to grow.',
    stats: ['15 projects', '500,000 reads / month', 'Unlimited team', '5 GB storage'] },
];

// Full limits, side by side: [label, Free, Pro, Pro Max].
export const PLAN_LIMITS = [
  ['Projects', '1', '10', '15'],
  ['Collections', '5', '10', '20'],
  ['API keys', '1', '5', '10'],
  ['Team members', '2', '5', 'Unlimited'],
  ['Reads (GET) per month', '500', '50,000', '500,000'],
  ['Writes per month', '200', '5,000', '50,000'],
  ['Storage', '204 MB', '2 GB', '5 GB'],
  ['Analytics', 'Basic', 'Basic', 'Basic'],
  ['Support', 'Community', 'Community', 'Community'],
];

export const FIT = [
  { text: 'Your site needs content, forms or a list, not a custom server.' },
  { text: 'You want to change things yourself, without waiting on a developer.' },
  { text: "You'd rather pay for one tool than babysit five." },
  { text: "Need realtime chat, user accounts or heavy logic? Firebase or Supabase will serve you better. We'd rather tell you now.", no: true },
];

export const FAQ = [
  { q: 'What\'s a "backend", in plain words?', a: 'The back office of your website: the place that stores your products, posts and messages and hands them to your site. buildfree is that back office, ready-made.' },
  { tab: 'plans', q: 'Is it really free?', a: 'Yes. The Free plan costs ₹0: 1 project, 5 collections, 1 API key, 2 team members, 500 reads and 200 writes a month and 204 MB of storage. Move to Pro or Pro Max when you need more.' },
  { tab: 'plans', q: 'What happens when I reach a limit?', a: "You'll see “You have reached your limit”. Delete something you don't need, or upgrade under Billing. Your new limits switch on as soon as the payment is confirmed." },
  { tab: 'plans', q: 'Do the limits reset?', a: 'Yes. Monthly reads and writes reset every month. Projects, collections, keys and storage are what your plan allows at any time.' },
  { q: 'Will it work with my site?', a: 'If it can load a link, it works: React, Next.js, plain HTML, Webflow, Framer, Lovable, Bolt, v0, Flutter and more.' },
  { q: 'Can my client edit their own content?', a: "Yes. Invite them to their project only. They edit content; they can't touch your code." },
  { tab: 'plans', q: 'What if I want to leave?', a: "Your content is yours, and it's already available as JSON through your own links. Take it anywhere." },
  { q: 'Does it work with AI builders?', a: "Yes. Paste your collection link into Lovable, Bolt, v0, Cursor or any AI tool and ask it to load your data. It's a normal public API, so anything that can fetch a link can use it." },
];

// Questions on the pricing page. `tab`: 'plans' or 'diy'.
export const PRICING_FAQ = [
  { tab: 'plans', q: 'Do I pay in rupees?', a: 'Yes. Plans are priced in rupees: Free is ₹0, Pro is ₹1,000 a month and Pro Max is ₹2,000 a month.' },
  { tab: 'plans', q: 'What counts as a read and a write?', a: 'A read is a request that fetches content, like your site loading its products. A write is a request that sends something in, like a form submission. Each plan has a monthly allowance of both, and they reset every month.' },
  { tab: 'diy', q: 'Why not just stay on free tiers?', a: 'They are great for trying things. But free databases pause and free servers sleep when nobody visits, and each tool has its own limits to watch. buildfree keeps your collections, forms and live links in one place, with one set of limits.' },
  { tab: 'diy', q: 'Does buildfree replace a database and a server?', a: "For content, forms and lists, yes: that's the whole back office. If you need realtime chat, user accounts for your visitors or heavy custom logic, Firebase or Supabase will serve you better. We'd rather tell you now." },
  { tab: 'diy', q: 'Where do the comparison prices come from?', a: "Each provider's own pricing page: the cheapest paid monthly tier, checked in November 2026 and converted at about ₹95 to the dollar, before tax. Prices change, so check before you decide." },
  { tab: 'diy', q: 'How did you estimate the hours?', a: "They're our rough estimate for someone doing it the first time: creating accounts, wiring the pieces together, fixing the first errors. Experienced developers will be faster. The bills stay the same." },
];

// Quiz: [question, [label, sub-label, score]]
export const QUIZ = [
  ['What are you building?', [['A website or landing page', 'shop, portfolio, blog, business site', 3], ['A client project', 'for someone else to edit', 3], ['A complex app', 'user accounts, realtime, heavy logic', 0]]],
  ['Who will update the content?', [['Me, without code', '', 3], ['My client', '', 3], ['Engineers, via SQL or code', '', 0]]],
  ['How much backend do you want to manage?', [['None, just give me a link', '', 3], ['A little, if it helps', '', 2], ['Full control of servers and database', '', 0]]],
];

export const GEN_PRESETS = [
  ['Café menu', 'menu items with name, price, photo and category'],
  ['Blog', 'blog posts with title, cover image, body and date'],
  ['Bookings', 'bookings with name, email, date, time and guests'],
  ['Reviews', 'testimonials with name, quote, rating and photo'],
];
