// "Connect your website" (from zero) and "Let an AI tool do it" sections.
// The code shown on the page lives in ../code (copied from the tested starter kit
// and snippets), so the page and the download never disagree.
import helperCode from "../code/kit-helper.txt?raw";
import viteConfigCode from "../code/kit-vite-config.txt?raw";
import productsCode from "../code/kit-products.txt?raw";
import contactCode from "../code/kit-contact.txt?raw";
import buyCode from "../code/kit-buy.txt?raw";
import appCode from "../code/kit-app.txt?raw";
import envCode from "../code/kit-env.txt?raw";
import htmlCode from "../code/html-index.txt?raw";
import ngConfigCode from "../code/ng-config.txt?raw";
import ngServiceCode from "../code/ng-service.txt?raw";
import ngProductsCode from "../code/ng-products.txt?raw";
import ngContactCode from "../code/ng-contact.txt?raw";
import ngAppCode from "../code/ng-app.txt?raw";
import wpCode from "../code/wp-snippet.txt?raw";

import { INSTALL_CMD } from "../../data/sdk";

export const KIT_URL = "/buildfree-starter-kit.zip";
export const AI_FILE_URL = "/BUILDFREE.md";

// Things to have ready in buildfree before touching any code
export const BEFORE = [
  ["A published collection called products", "Fields: name (Text), price (Number), photo (Image), in_stock (Boolean) — and a few entries."],
  ["A published form called contact-form", "Fields: name, email, occasion (Select), message."],
  ["An API key", "From the API Keys tab. Keep it safe."],
  ["Your buildfree address", "Open the API tab and copy the address. Keep the part up to and including your project name, e.g. …/api/v1/public/sweet-crumbs-website."],
  ["(For payments) a form called order-form + Razorpay connected", "Fields: name, email, phone, address, product, quantity, total. Connect Razorpay in the Payments tab."],
];

// The easy way: the ready-made starter kit
export const KIT_STEPS = [
  {
    title: "Install Node.js",
    text: "Node.js is the free program that runs website projects on your computer. Go to nodejs.org, download the version marked “LTS” and install it like any other app (click Next until it finishes). Then open a terminal (Windows: search “Command Prompt”; Mac: search “Terminal”) and type:",
    cmd: "node -v",
    check: "You should see a version number like v22.x.x. If it says “not recognized”, close the terminal and open a new one.",
  },
  {
    title: "Download the starter kit",
    text: "Click the download button above. Unzip it (right-click → Extract All). You will get a folder called my-buildfree-site.",
  },
  {
    title: "Open the folder in a terminal",
    text: "Windows: open the my-buildfree-site folder, click the address bar at the top, type cmd and press Enter. Mac: right-click the folder → New Terminal at Folder.",
  },
  {
    title: "Download the packages",
    text: "This downloads the small building blocks the website needs. It takes about a minute. Run it once.",
    cmd: "npm install",
    check: "When it finishes you will see a node_modules folder appear. Warnings in yellow are fine.",
  },
  {
    title: "Add your buildfree address and key",
    text: "In the folder, rename .env.example to .env (exactly “.env”). Open it with Notepad (or any text editor) and replace the two example values with your own. Save.",
    file: { name: ".env", code: envCode },
    warn: "The .env file is your secret. Never email it, post it, or paste it into an AI chat.",
  },
  {
    title: "Start your website",
    text: "Run this, then open the address it shows — usually http://localhost:5173 — in your browser.",
    cmd: "npm run dev",
    check: "You should see “My Shop” with your products from buildfree and a contact form. Add a new entry in buildfree, refresh — it appears!",
  },
  {
    title: "Put it online (free)",
    text: "Create a free account at vercel.com. Back in the terminal, press Ctrl + C to stop the website, then run the command below and press Enter to accept each question.",
    cmd: "npx vercel",
    check: "In the Vercel website open your new project → Settings → Environment Variables. Add BUILDFREE_URL and BUILDFREE_KEY with the same values as your .env. Then run “npx vercel --prod”. Vercel gives you your live web address.",
  },
];

// The same thing, file by file, for people who want to understand or add it to an existing site
export const FILES = [
  {
    name: "api/buildfree.js",
    title: "The safe helper",
    plain: "The only file that knows your API key. The website asks this helper for products, and the helper asks buildfree. Visitors never see the key.",
    code: helperCode,
  },
  {
    name: "vite.config.js",
    title: "Runs the helper on your computer",
    plain: "While you build the site, this runs the safe helper locally. When the site is online, Vercel runs it instead — you do not change anything.",
    code: viteConfigCode,
  },
  {
    name: "src/Products.jsx",
    title: "Shows your products",
    plain: "Asks the helper for the products collection and draws a card for each entry: photo, name, price and a Buy button.",
    code: productsCode,
  },
  {
    name: "src/ContactForm.jsx",
    title: "Sends the contact form",
    plain: "Each box's name (name, email, occasion, message) must match a field key in your buildfree form. Messages appear under Submissions.",
    code: contactCode,
  },
  {
    name: "src/BuyButton.jsx",
    title: "Takes a payment",
    plain: "Asks for delivery details, then asks the helper to start a payment and opens Razorpay. It never sends a price — the helper reads it from buildfree.",
    code: buyCode,
  },
  {
    name: "src/App.jsx",
    title: "Puts the page together",
    plain: "The page itself: a heading, the products and the contact form. Change the words here.",
    code: appCode,
  },
];

// Changing names to match your own buildfree project
export const CUSTOMISE = [
  ["Your collection is not called products", "In api/buildfree.js change ALLOWED and “/products”, and in src/Products.jsx change “list=products”."],
  ["Your fields have other names", "In src/Products.jsx, p.data.name / p.data.price must match your field names exactly (same spelling, same capitals)."],
  ["Your form is not called contact-form", "In src/ContactForm.jsx change “form=contact-form”, and give each input the same name as its buildfree field."],
  ["Your shop name", "In src/App.jsx and the name: line in src/BuyButton.jsx."],
];

// ---------- Step 8: pick your kind of website ----------

const READY = {
  title: "Have these three things ready",
  text: "From the steps above: (1) your buildfree API address — it is shown in your project's API tab and looks like https://…/api/v1/public/your-project-name, (2) your API key, and (3) a published collection called products with a few entries.",
};

const KEY_VISIBLE_WARNING =
  "On this kind of website the key can be seen by anyone who views the page's source. So create a separate key just for the website (name it “Website key”) and switch it off in buildfree if it is ever misused. Never use your Razorpay secret here, and for a shop with payments use the React starter kit or WordPress, where the key stays on the server.";

export const PLATFORMS = [
  {
    id: "node",
    label: "Node.js SDK",
    icon: "node",
    who: "For any Node.js server: Express, Next.js route handlers, serverless functions or a plain script. The simplest way if you write code. One small package, no addresses or headers to remember.",
    level: "Recommended · key stays on your server",
    steps: [
      {
        title: "Have these three things ready",
        text: "(1) Your project name as it appears in the address (its “slug”, for example sweet-crumbs-website), (2) your API key, which starts with cms_live_, and (3) a published collection called products with a few entries. You do not need the API address: the SDK already knows where buildfree lives.",
      },
      {
        ...KIT_STEPS[0],
        text: "The SDK runs on Node.js 20 or newer. Check what you have by opening a terminal and typing:",
      },
      {
        title: "Install the SDK",
        text: "In your project folder, run this. (No project yet? Run “npm init -y” first to create one.)",
        cmd: INSTALL_CMD,
        check: "Your package.json now lists buildfree under dependencies.",
      },
      {
        title: "Put your key in a .env file",
        text: "Create a file called .env (exactly that name) next to your code and paste your key after the equals sign. Save.",
        file: { name: ".env", code: "BUILDFREE_KEY=cms_live_paste-your-key-here" },
        warn: "The key is a secret. Keep it in .env, never in code that runs in the browser, and never paste it into a chat or a public repository.",
      },
      {
        title: "Read your content",
        text: "Create products.js, paste this in and change my-shop to your project name. Then run it.",
        file: {
          name: "products.js",
          code: `const { BuildFree } = require("buildfree");

const buildfree = new BuildFree({ apiKey: process.env.BUILDFREE_KEY });

async function main() {
  const products = await buildfree.getRecords({
    projectSlug: "my-shop",
    collectionSlug: "products",
  });

  products.data.forEach((p) => console.log(p.data.name, p.data.price));
}

main();`,
        },
        cmd: "node --env-file=.env products.js",
        check: "You see the names and prices of your entries. Nothing shows? Check that the collection is published and that the key is Active.",
      },
      {
        title: "Send a form message",
        text: "Create contact.js. Each key inside data must match a field key of your form.",
        file: {
          name: "contact.js",
          code: `const { BuildFree } = require("buildfree");

const buildfree = new BuildFree({ apiKey: process.env.BUILDFREE_KEY });

async function main() {
  await buildfree.submitForm({
    projectSlug: "my-shop",
    formSlug: "contact-form",
    data: { name: "Rahul", email: "rahul@mail.com", message: "Hello!" },
  });
  console.log("Sent!");
}

main();`,
        },
        cmd: "node --env-file=.env contact.js",
        check: "Open your form's Submissions in buildfree. Your test message is there.",
      },
      {
        title: "Show it on your website",
        text: "Call the same functions inside a route on your server and send the result to your page. Here is a complete example with Express. Install it first, then paste the code into server.js and run it.",
        cmd: "npm install express",
        file: {
          name: "server.js",
          code: `const express = require("express");
const { BuildFree } = require("buildfree");

const app = express();
const buildfree = new BuildFree({ apiKey: process.env.BUILDFREE_KEY });

app.get("/api/products", async (req, res) => {
  const products = await buildfree.getRecords({
    projectSlug: "my-shop",
    collectionSlug: "products",
  });
  res.json(products.data);
});

app.listen(3000, () => console.log("Open http://localhost:3000/api/products"));`,
        },
        check: "Run “node --env-file=.env server.js”, open http://localhost:3000/api/products and you see your products as data. Your page can fetch that address.",
        warn: "The SDK is for servers. For a plain HTML page with no server, use the HTML website tab instead.",
      },
    ],
  },
  {
    id: "html",
    label: "HTML website",
    icon: "html",
    who: "For a simple website made of .html files — or if you don't have a website yet and just want to try it.",
    level: "Easiest · nothing to install",
    steps: [
      READY,
      {
        title: "Create the page file",
        text: "Open Notepad (Windows) or TextEdit (Mac: Format → Make Plain Text). Create a new file and save it as index.html. The name must end in .html.",
      },
      {
        title: "Paste the code",
        text: "Click Copy below and paste everything into your file. This one file shows your products and has a working contact form.",
        file: { name: "index.html", code: htmlCode },
      },
      {
        title: "Put in your address and key",
        text: "Near the bottom, find “1. PASTE YOUR TWO VALUES HERE”. Replace the example address and the example key with your own. Keep the quote marks. Save the file.",
        warn: KEY_VISIBLE_WARNING,
      },
      {
        title: "Open it",
        text: "Double-click index.html. It opens in your browser.",
        check: "You see “My Shop” with your products. Add a new entry in buildfree and refresh the page — it appears. Send a test message with the form and look under Submissions in buildfree.",
      },
      {
        title: "Put it online",
        text: "Upload index.html to any web host. A free and very easy one is Netlify Drop: open app.netlify.com/drop and drag your folder onto the page. You get a live web address in seconds.",
      },
    ],
  },
  {
    id: "react",
    label: "React",
    icon: "react",
    who: "For React websites (Vite). The starter kit is a complete React shop — products, contact form and payments — with the safe server helper built in.",
    level: "Recommended for shops · key stays hidden",
    steps: KIT_STEPS,
    showKit: true,
  },
  {
    id: "angular",
    label: "Angular",
    icon: "angular",
    who: "For Angular 17 or newer. You add one service and two small components.",
    level: "Needs Node.js and the Angular CLI",
    steps: [
      READY,
      KIT_STEPS[0],
      {
        title: "Create an Angular project (skip if you already have one)",
        text: "In a terminal, run the command below. Press Enter to accept the default answers. If it asks about SSR or SSG, choose No.",
        cmd: "npx @angular/cli new my-shop",
        check: "A folder called my-shop appears. Run “cd my-shop” to go inside. If it says your Node.js is too old, install the newest LTS version from nodejs.org and try again.",
      },
      {
        title: "Allow web requests",
        text: "Open src/app/app.config.ts. Add the import line and add provideHttpClient() inside providers, exactly where it says NEW.",
        file: { name: "src/app/app.config.ts", code: ngConfigCode },
      },
      {
        title: "Create the buildfree service",
        text: "Create a new file src/app/buildfree.service.ts and paste this in. Then replace the address and key at the top with your own.",
        file: { name: "src/app/buildfree.service.ts", code: ngServiceCode },
        warn: KEY_VISIBLE_WARNING,
      },
      {
        title: "Create the products component",
        text: "Create src/app/products.component.ts and paste this in. It lists your products collection as cards.",
        file: { name: "src/app/products.component.ts", code: ngProductsCode },
      },
      {
        title: "Create the contact form component",
        text: "Create src/app/contact.component.ts and paste this in. Its input names (name, email, message) must match the field keys of your buildfree form.",
        file: { name: "src/app/contact.component.ts", code: ngContactCode },
      },
      {
        title: "Show them on your page",
        text: "Open your main component (src/app/app.ts, or app.component.ts in older versions). Add the two imports, add both names to imports: [...], and put the two tags in the template.",
        file: { name: "src/app/app.ts", code: ngAppCode },
      },
      {
        title: "Run it",
        text: "Start your site, then open http://localhost:4200 in your browser.",
        cmd: "npm start",
        check: "You see “My Shop” with your products and a contact form. Add a new entry in buildfree and refresh — it appears.",
      },
    ],
  },
  {
    id: "wordpress",
    label: "WordPress",
    icon: "wordpress",
    who: "For any WordPress website. You paste one snippet, then place a shortcode on any page — no theme editing.",
    level: "Key stays on your server · safe",
    steps: [
      READY,
      {
        title: "Install the free “Code Snippets” plugin",
        text: "In your WordPress admin, go to Plugins → Add New Plugin. Search for Code Snippets, click Install Now, then Activate.",
        check: "A new “Snippets” item appears in the left menu.",
      },
      {
        title: "Add a new snippet",
        text: "Go to Snippets → Add New. Give it the title “buildfree”. Paste the code below into the code box. Don't add a <?php line — the plugin does that.",
        file: { name: "buildfree snippet (PHP)", code: wpCode },
      },
      {
        title: "Put in your address and key",
        text: "At the top of the snippet replace the example address and key with your own. Keep the quote marks. This code runs on your WordPress server, so visitors can never see your key.",
      },
      {
        title: "Switch it on",
        text: "Choose “Run snippet everywhere” and click Save Changes and Activate.",
      },
      {
        title: "Show your products on a page",
        text: "Go to Pages → Add New (or open an existing page). Add a Shortcode block and type the line below. Add a second block with the contact-form shortcode if you want the form. Click Publish.",
        cmd: "[buildfree_products]",
        check: "Open the page. You see your products. For the form, type [buildfree_contact_form] in another Shortcode block.",
      },
      {
        title: "Good to know",
        text: "Products are remembered for 5 minutes to keep your site fast, so a new entry can take up to 5 minutes to show. To show a different collection use [buildfree_products collection=\"your-collection-name\"].",
      },
    ],
  },
];

// ---------- AI tools ----------

export const AI_TOOLS = [
  ["AI chat", "Claude, ChatGPT, Gemini", "You copy code from the chat into your files. Good for small changes and explanations."],
  ["AI that works in your folder", "Claude Code, Cursor, GitHub Copilot, Windsurf", "It opens your project, writes the files and runs commands for you. Best for building a whole site."],
  ["AI website builders", "Lovable, Bolt, v0, Replit", "Builds a full site from a description in the browser. Ask it to call your server helper, never to put the key in the page."],
];

export const AI_STEPS = [
  {
    title: "Download the AI instructions file",
    text: "BUILDFREE.md explains buildfree to the AI: the API addresses, what data comes back, how payments work and the safety rules. Put it in your project folder (or attach it in the chat).",
  },
  {
    title: "Fill in the bottom of the file",
    text: "Open BUILDFREE.md in Notepad and write your collection names, field names and form names at the bottom (look them up in your buildfree dashboard). Do NOT write your API key there.",
  },
  {
    title: "Put your key in .env yourself",
    text: "Create the .env file and paste your address and key into it with Notepad. The AI only needs to know the file exists — it never needs to see the key.",
  },
  {
    title: "Copy a prompt below and paste it into your AI tool",
    text: "Change the words in [square brackets] to match your project. Send one prompt at a time and check the result before the next one.",
  },
  {
    title: "Test it",
    text: "Run npm run dev and open the site. If something is wrong, use the “Fix an error” prompt and paste the exact error message.",
  },
];

export const PROMPTS = [
  {
    title: "Build me a new website",
    when: "Starting from nothing",
    text: `Read BUILDFREE.md first and follow its rules.

Create a new website with React and Vite in this folder for my business, [your business name], that sells [what you sell].

- Show all entries of my buildfree collection "[products]" as cards with photo, name and price.
- Add a contact form that sends my buildfree form "[contact-form]".
- Keep my API key safe: put a small server helper in api/buildfree.js that reads BUILDFREE_URL and BUILDFREE_KEY from .env, and make it run during "npm run dev" too.
- Make it look [warm and friendly / modern and minimal] and work well on phones.

My .env file already exists. Do not ask me for the key. When you are done, tell me in simple words how to start the site.`,
  },
  {
    title: "Add buildfree to my existing website",
    when: "You already have a site",
    text: `Read BUILDFREE.md first and follow its rules.

Connect my existing website to buildfree:
- On the page [Shop / Home / Menu], replace the hard-coded items with the entries of my collection "[products]".
- Fields are: [name (Text), price (Number), photo (Image)].
- Add a safe server route so the API key is never in the browser. Use what fits this project (Vercel function, Next.js route, or Express).

Explain each file you change in one simple sentence.`,
  },
  {
    title: "Add online payments",
    when: "Razorpay is connected in buildfree",
    text: `Read BUILDFREE.md first and follow the payment flow exactly.

Add a "Buy now" button to each product:
1. Ask the customer for name, email, phone and delivery address.
2. My server route looks up the real price in buildfree (never from the browser), saves the order in my form "[order-form]" (fields: [name, email, phone, address, product, quantity, total]) and then calls POST /api/v1/order with recordId, submissionId, amount in paise and currency INR.
3. Open Razorpay Checkout with the returned keyId and razorpayOrderId, prefill the customer details and add notes.submissionId.
4. After payment show "Thank you! Your payment is being confirmed."`,
  },
  {
    title: "Add a booking / feedback form",
    when: "Any new form",
    text: `Read BUILDFREE.md first.

Add a [booking] form to the [Contact] page that sends my buildfree form "[booking-form]".
Fields (use these keys exactly): [name (Text), phone (Phone), date (Date), guests (Number), notes (Textarea)].
Show "Sending…" while it sends, a thank-you message when it works, and the error message if it fails.`,
  },
  {
    title: "Fix an error",
    when: "Something does not work",
    text: `Read BUILDFREE.md first.

My website is not working. This is what I did: [I ran npm run dev and opened the Shop page].
This is what I expected: [to see my products].
This is what happened instead: [a blank page / "Not found" / an error].

Here is the exact error message from the terminal or the browser:
[paste the error here — but remove any API key if you see one]

Please find the cause, fix it, and explain in simple words what was wrong.`,
  },
  {
    title: "Explain this to me",
    when: "You want to understand",
    text: `Explain to me, like I am not a programmer, what each file in this project does and how my products get from buildfree onto the page. Use short sentences and a simple example.`,
  },
];

export const AI_RULES = {
  do: [
    "Give the AI the BUILDFREE.md file and your exact collection, field and form names.",
    "Ask for one thing at a time, then test it before asking for the next.",
    "Paste the exact error message when something breaks.",
    "Ask the AI to explain what it changed in simple words.",
  ],
  dont: [
    "Never paste your API key, Razorpay Key Secret or .env file into an AI chat.",
    "Never accept code that puts the API key in the browser (look for “VITE_” or “NEXT_PUBLIC_” next to the key).",
    "Never let the website send the price to the server — the server must look it up in buildfree.",
    "Don't publish the site until you have tested it on your own computer first.",
  ],
};
