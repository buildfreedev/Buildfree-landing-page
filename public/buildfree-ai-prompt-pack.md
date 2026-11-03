# buildfree.dev: AI builder backend prompt pack (free)

Copy these prompts into Lovable, Bolt, v0, Replit, Cursor or Claude. Replace `YOUR-PROJECT` and `YOUR-LINK` with the values from your free buildfree account (Project → Collections → copy link).

## 1. Load products into a shop page
> My product data lives at YOUR-LINK (a public JSON API from buildfree.dev). Fetch it on page load and render a responsive product grid with image, title and price. Show a skeleton while loading and a friendly message if the list is empty. Don't hard-code any products.

## 2. Contact form that saves every message
> Build a contact form (name, email, message). On submit, POST JSON to https://cms-backend-9nkz.onrender.com/api/v1/public/YOUR-PROJECT/forms/contact. Show a success state and disable the button while sending. Validate the email client-side.

## 3. Blog list + post page
> Fetch blog posts from YOUR-LINK. Each item has title, slug, cover image, excerpt, body and published date. Make a list page sorted by date and a /blog/:slug detail page. Only show items where status is published.

## 4. Booking / appointment request
> Add a booking form (name, phone, date, time, notes) that POSTs to my buildfree form endpoint YOUR-FORM-LINK. After submit, show "We'll confirm on WhatsApp/email shortly".

## 5. Menu / services page
> Fetch menu items from YOUR-LINK with fields name, price, category, description, image. Group by category with sticky category tabs on mobile.

## 6. Testimonials carousel (only real ones)
> Fetch testimonials from YOUR-LINK (name, role, quote, photo). Render an accessible carousel. If there are none, hide the section entirely.

## 7. Rules for your AI (paste once)
> Backend rules: Content comes from buildfree.dev public GET endpoints (JSON with a `data` array). Forms submit via POST JSON to buildfree form endpoints. Never put API keys in front-end code; public GET links don't need a key. Handle loading, empty and error states for every fetch.

Made with buildfree.dev · Free to start · https://buildfree-dev.netlify.app
