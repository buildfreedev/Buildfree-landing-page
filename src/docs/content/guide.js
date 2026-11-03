// All the words on the help page live here, so they can be changed without
// touching the layout. Each section can have:
//   intro    – one or two plain sentences
//   steps    – what to click, in order
//   example  – a real-life example (title + rows of [label, value])
//   code     – a code snippet for the web developer
//   tip / warn – a helpful note or a warning

export const WORDS = [
  ["Project", "One website or app. Example: “Sweet Crumbs Website”."],
  ["Collection", "A list of similar things inside a project, like Products, Blog Posts or Team Members."],
  ["Field", "One detail every item in the list has — like name, price or photo."],
  ["Entry", "One item in a collection. Example: “Chocolate Truffle Cake, ₹450”."],
  ["Publish", "Switches something on so your website can use it. Unpublished = hidden draft."],
  ["API key", "A secret password your website uses to read your content from buildfree."],
  ["Form", "A form on your website (contact, booking, feedback). Messages are saved in buildfree."],
  ["Submission", "One message someone sent through your form."],
];

export const SECTIONS = [
  {
    id: "account",
    title: "Create your account and sign in",
    intro:
      "Do this once. Fill in four details, type the 6-digit code we email you, then sign in. The person who signs up becomes the Admin — the owner of the workspace.",
    details: {
      title: "The details you fill in",
      rows: [
        ["Full Name", "Priya Sharma"],
        ["Email", "priya@sweetcrumbs.in"],
        ["Company Name", "Sweet Crumbs Bakery"],
        ["Password", "Choose one, and type it again to confirm"],
      ],
    },
    tip: "Didn't get the code? Check your spam folder. If you register again with the same email, buildfree sends you a fresh code. After you sign in you land on your Dashboard — nothing is public until you click “Publish”.",
    cta: ["register", "login"],
  },
  {
    id: "project",
    title: "Create a project",
    intro: "A project is a box for one website. Everything else — content, forms, keys, payments — lives inside it.",
    steps: [
      "Click “Projects” in the left menu.",
      "Click “New project”.",
      "Type a Project name and (optional) a short description.",
      "Click “Create project”, then click the project card to open it.",
    ],
    example: {
      title: "Example",
      rows: [
        ["Project name", "Sweet Crumbs Website"],
        ["Description", "Cakes and cookies for our online shop"],
      ],
    },
    tip: "Inside a project you will see tabs along the top: API Keys, Collections, Media, Forms, Analytics, API, Payments and Orders.",
    warn: "If it says you have reached your project limit, your plan allows no more projects. See “Plans & billing” below.",
  },
  {
    id: "collection",
    title: "Create a collection (your content list)",
    intro:
      "A collection is like a table in a notebook. You decide the columns (fields) once, then fill in as many rows (entries) as you like.",
    steps: [
      "Open your project and click the “Collections” tab.",
      "Click “New collection” and type a name, e.g. Products.",
      "Click “Add field” for each detail. Type a field name and pick its type.",
      "Tick “Required” for details that must always be filled in.",
      "Click “Create collection”.",
      "Open the collection and click “Publish”.",
    ],
    fieldTypes: [
      ["Text", "Short words — a name or title", "Chocolate Truffle Cake"],
      ["Number", "Prices, quantities, ages", "450"],
      ["Boolean", "A Yes / No tick box", "In stock: Yes"],
      ["Rich Text", "Long text with bold, lists, links", "A product description"],
      ["Image", "A photo or picture", "cake.jpg"],
      ["File", "Any file — a PDF menu, a brochure", "menu.pdf"],
      ["Date", "A calendar date", "2026-12-25"],
      ["JSON", "For developers: structured data", '{ "sizes": ["1kg", "2kg"] }'],
    ],
    example: {
      title: "Example: a “Products” collection for a bakery",
      rows: [
        ["name", "Text · Required"],
        ["price", "Number · Required"],
        ["photo", "Image"],
        ["in_stock", "Boolean"],
      ],
    },
    more: [
      ["Blog", "title (Text), cover (Image), body (Rich Text), published_on (Date)"],
      ["Team members", "name (Text), role (Text), photo (Image)"],
      ["Events", "event_name (Text), date (Date), venue (Text), free_entry (Boolean)"],
    ],
    warn: "The “Publish” button stays grey until the collection has at least one field. Your website can only read published collections.",
  },
  {
    id: "entry",
    title: "Add entries (fill in your content)",
    intro: "Entries are the actual things your visitors will see — each product, post or event.",
    steps: [
      "Open the collection (it must be Published).",
      "Click “New entry”.",
      "Fill in each field. Fields marked * are required.",
      "Click “Save entry”. Repeat for each item.",
      "To change or delete an entry later, use the pencil or bin icon on its row.",
    ],
    example: {
      title: "Example entries",
      rows: [
        ["Chocolate Truffle Cake", "price 450 · photo truffle.jpg · in stock ✓"],
        ["Butter Cookies (box)", "price 180 · photo cookies.jpg · in stock ✓"],
      ],
    },
    tip: "Type numbers without symbols: 450, not ₹450. Your website adds the ₹ sign.",
  },
  {
    id: "apikey",
    title: "Create an API key",
    intro:
      "Your website needs a key to read your content — like a secret password between buildfree and your site.",
    steps: [
      "Open your project and click the “API Keys” tab.",
      "Click “New API key” and give it a name, e.g. Website key.",
      "Click “Create”.",
      "Click “Copy” and save the key somewhere safe.",
      "Click “I've saved it”.",
    ],
    warn: "The full key is shown only once. If you lose it, create a new key and revoke (switch off) the old one.",
    tip: "Never post your API key in public places like social media or a public code page.",
  },
  {
    id: "website",
    title: "Test it: see your content as data",
    intro:
      "Before you touch any website, check that buildfree is serving your content. The API tab is a built-in test page — no code needed.",
    steps: [
      "Open your project and click the “API” tab.",
      "Pick your collection (for example Products).",
      "Paste your API key into the key box.",
      "Click “Send request”. You will see your entries as data — exactly what your website will receive.",
      "Copy the address (endpoint) shown there. You need it in the next step.",
    ],
    code: {
      title: "Example code for your developer (runs on the server, never in the browser)",
      lang: "JavaScript",
      text: `// Read the "products" collection of the "sweet-crumbs-website" project.
// Copy your real address from the API tab — it may look different.
const res = await fetch(
  "https://YOUR-BUILDFREE-ADDRESS/api/v1/public/sweet-crumbs-website/products",
  { headers: { "x-api-key": process.env.BUILDFREE_KEY } }
);
const { data } = await res.json();

// Each entry: { recordId, data: { name, price, ... }, media: [{ url }] }
data.forEach((entry) => {
  console.log(entry.data.name, entry.data.price, entry.media[0]?.url);
});`,
    },
    tip: "If you see your entries here, buildfree is ready. Next: put them on your website.",
  },
  {
    id: "form",
    title: "Build a form (contact, booking, feedback)",
    intro:
      "Create a form in buildfree, put it on your website, and every message people send is saved for you to read.",
    steps: [
      "Open your project and click the “Forms” tab.",
      "Click “New form”. Type a name — the slug fills in by itself. Click “Create form”.",
      "Open the form and click “Add fields”. For each field set a label and a type.",
      "For choice fields (Select, Radio, Checkbox, Multi-select), type each choice and press Enter.",
      "Click “Publish”.",
      "Read messages under “Submissions”.",
    ],
    fieldTypes: [
      ["Text / Textarea", "Short answer / long message"],
      ["Email / Phone", "Contact details"],
      ["Number", "Quantity, guests"],
      ["Select / Radio", "Pick one option"],
      ["Checkbox / Multi-select", "Pick several options"],
      ["Date / Time / Date & time", "Bookings and appointments"],
    ],
    example: {
      title: "Example: “Contact Form” for a bakery",
      rows: [
        ["Your name", "Text"],
        ["Email address", "Email"],
        ["Occasion", "Select — Birthday, Wedding, Other"],
        ["Message", "Textarea"],
      ],
    },
    code: {
      title: "Example code: send a message (runs on the server)",
      lang: "JavaScript",
      text: `// Each key must match a field key in your buildfree form
await fetch(
  "https://YOUR-BUILDFREE-ADDRESS/api/v1/public/sweet-crumbs-website/forms/contact-form/submit",
  {
    method: "POST",
    headers: { "x-api-key": process.env.BUILDFREE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Rahul Verma",
      email: "rahul@mail.com",
      occasion: "Birthday",
      message: "Need a 1kg cake for Saturday",
    }),
  }
);`,
    },
    warn: "To add or change fields on a published form, click “Unpublish” first, make your changes, then publish again.",
  },
  {
    id: "payments",
    title: "Take payments (Razorpay)",
    intro: "Connect your Razorpay account so customers can pay on your website. Paid orders show up in buildfree.",
    steps: [
      "Log in to your Razorpay Dashboard and create a Test Key (for trying) or a Live Key (real money).",
      "Copy the Key ID and Key Secret.",
      "In buildfree open your project → “Payments” tab. Paste both keys and click “Save and validate”.",
      "Copy the webhook URL buildfree shows and add it in your Razorpay dashboard.",
      "Click “Test Connection”. When it says Connected, you are ready.",
      "See every order and its payment status in the “Orders” tab.",
    ],
    tip: "Start in Test mode. Switch to Live keys only after a test payment works.",
    warn: "Your Key Secret is private — never share it in chat or email.",
  },
  {
    id: "team",
    title: "Invite your team",
    intro:
      "Let staff add products or read messages without giving them full control. Team members only see the projects you choose.",
    steps: [
      "Click “Team” in the left menu.",
      "Click “New user”.",
      "Enter their Name, Email and a starting Password.",
      "Under Project access, choose the project(s) they can use.",
      "Click “Create user” and share the email and password with them privately.",
    ],
    example: {
      title: "What a team member can do",
      rows: [
        ["See", "Only the projects you shared (under “My Projects”)"],
        ["Collections", "Add, edit and delete entries in published collections"],
        ["Forms", "Read form submissions"],
        ["Orders", "View orders"],
      ],
    },
  },
  {
    id: "billing",
    title: "Plans & billing",
    intro:
      "Your plan decides how many projects, collections and API keys you can have. The Dashboard always shows what you are using.",
    steps: [
      "Click “Billing” in the left menu to see your current plan and what it includes.",
      "Compare the plans and click upgrade on the one you want.",
      "Pay securely; your new limits switch on once the payment is confirmed.",
    ],
    tip: "Messages like “You have reached your limit” or “Your subscription is inactive” mean it is time to upgrade or activate a plan.",
  },
];

export const RECIPE = {
  title: "Full example: a bakery website in 15 minutes",
  story:
    "Priya runs Sweet Crumbs Bakery. She wants her cakes on her website, a contact form for custom orders, and online payments.",
  steps: [
    ["Sign up", "Priya creates her account and verifies her email."],
    ["Project", "She creates a project called “Sweet Crumbs Website”."],
    ["Collection", "She makes a “Products” collection with name, price, photo and in_stock — and publishes it."],
    ["Entries", "She adds Chocolate Truffle Cake (₹450) and Butter Cookies (₹180)."],
    ["API key", "She creates “Website key” and sends it to her web developer."],
    ["Website", "The developer connects the site once. New cakes now appear automatically."],
    ["Form", "She builds a “Contact Form” and publishes it. Orders for wedding cakes arrive in Submissions."],
    ["Payments", "She connects Razorpay. Paid orders show up in Orders."],
    ["Team", "She adds her helper Arjun, who updates prices every morning."],
  ],
};

export const FAQ = [
  ["The “Publish” button is grey.", "Add at least one field to the collection or form first."],
  ["I can't add entries.", "The collection is still a Draft. Open it and click “Publish”."],
  ["I can't add fields to my form.", "The form is published. Click “Unpublish”, edit, then publish again."],
  ["My website shows nothing.", "Check that the collection is published, it has entries, and the API key is Active and copied correctly."],
  ["I lost my API key.", "Create a new key in the API Keys tab and switch off the old one."],
  ["“You have reached your limit”.", "Your plan is full. Delete something you don't need, or upgrade in Billing."],
  ["I didn't get the email code.", "Check spam. Registering again with the same email sends a fresh code."],
  ["“npm is not recognized” / “command not found: npm”.", "Node.js is not installed yet, or the terminal was open before you installed it. Install Node.js (LTS), close the terminal, open a new one and try again."],
  ["My starter kit site says “Not found” or shows no products.", "Check the .env file: it must be called exactly .env, BUILDFREE_URL must end with your project name (no slash at the end), and the key must be Active. After changing .env, stop the site (Ctrl + C) and run npm run dev again."],
  ["My HTML or Angular page says “Could not load products” and the browser console mentions CORS.", "The browser is blocking the request because buildfree does not yet allow your website's address. Either use the React starter kit or WordPress (they call buildfree from a server, so this never happens) or ask the person who runs buildfree to allow your website's address."],
  ["“buildfree is not reachable”.", "The address in .env is wrong or your internet is off. Copy the address again from the API tab."],
  ["Payment says “Could not save the order”.", "Create and publish a form called order-form with the fields name, email, phone, address, product, quantity, total."],
  ["The site works on my computer but not online.", "Add BUILDFREE_URL and BUILDFREE_KEY in Vercel → Settings → Environment Variables, then run npx vercel --prod again."],
];
