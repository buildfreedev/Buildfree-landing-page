# BuildFree — instructions for AI coding tools

Put this file in the main folder of your website project. Then tell your AI tool:
"Read BUILDFREE.md first and follow it."

---

## What BuildFree is

BuildFree is a headless CMS. The site owner manages content in the BuildFree dashboard.
The website reads that content (and sends forms and payments) through BuildFree's public API.

Words used in the dashboard:
- **Project**: one website. It has a slug, e.g. `sweet-crumbs-website`.
- **Collection**: a list of entries with fixed fields (Text, Number, Boolean, Rich Text, Image, File, Date, JSON).
  Only **published** collections can be read.
- **Form**: fields people fill in on the website (Text, Email, Number, Textarea, Select, Multi-select,
  Radio, Checkbox, Date, Time, Date & time, Phone). Only **published** forms accept submissions.
- **API key**: created in the project's API Keys tab. Sent in the `x-api-key` header.

## The API

`BASE` = the address shown in the project's **API** tab, ending in `/api/v1/public/<project-slug>`.
Every request needs the header `x-api-key: <API key>`.

| What | Request | Body | Reply |
|---|---|---|---|
| Read a collection | `GET {BASE}/{collection-slug}` | – | `{ success, data: [ { recordId, data: { <field>: value }, media: [ { url, fieldId, ... } ], createdAt } ] }` |
| Send a form | `POST {BASE}/forms/{form-slug}/submit` | JSON, one key per form field, at the top level | `{ success, message, submissionId }` |
| Start a payment | `POST {ORIGIN}/api/v1/order` (`ORIGIN` = the scheme + host of BASE) | `{ recordId, submissionId, amount, currency }` | `{ success, data: { orderId, razorpayOrderId, amount, currency, keyId } }` |

Notes:
- Field values are inside `record.data`, keyed by the field name, e.g. `record.data.price`.
- Uploaded images and files are **not** in `data`; use `record.media[i].url`.
- `amount` is in paise (₹1 = 100). ₹789 → `78900`.
- `recordId` = the product's `recordId` in its collection. `submissionId` = the id returned when the
  order form was submitted.

## Payment flow (Razorpay, connected in the project's Payments tab)

1. Browser sends the server: product ids, quantities, coupon code, customer details. **No prices.**
2. Server reads prices from BuildFree, calculates the total.
3. Server submits the order form → gets `submissionId`.
4. Server calls `POST /api/v1/order` with `{ recordId, submissionId, amount: total * 100, currency: "INR" }`.
5. Browser loads `https://checkout.razorpay.com/v1/checkout.js` and opens
   `new Razorpay({ key: keyId, order_id: razorpayOrderId, amount, currency, prefill: { name, email, contact },
   notes: { submissionId, buildFreeOrderId: orderId } })`.
6. BuildFree's Razorpay webhook updates the payment to PENDING / CAPTURED / FAILED.
   The browser `handler` callback is NOT proof of payment.

Cash on Delivery: do steps 1–3 only.

## Rules you must follow

1. **Never put the API key in browser code.** Read it only on the server, from environment variables
   `BUILDFREE_URL` and `BUILDFREE_KEY` (no `VITE_` / `NEXT_PUBLIC_` prefix). Keep `.env` in `.gitignore`.
2. The browser calls a small server route (e.g. a Vercel function `api/buildfree.js`, a Next.js route
   handler, or an Express route). Only that route talks to BuildFree.
3. Only allow the browser to read the collections it needs (an allow-list), never "any collection".
4. **Never trust a price from the browser.** Always look it up in BuildFree on the server.
5. Show a friendly message when a list is empty, when loading, and when a request fails.
6. Do not invent field names. Use the field names the site owner gives you (see below), exactly as written.

## This project's BuildFree setup

(The site owner fills this in. Do not paste the API key here.)

- BASE address: `https://.../api/v1/public/...`
- Collections and their fields:
  - `products`: name (Text), price (Number), photo (Image), in_stock (Boolean)
- Forms and their fields:
  - `contact-form`: name (Text), email (Email), occasion (Select), message (Textarea)
  - `order-form`: name, email, phone, address, product, quantity, total
- Payments: Razorpay connected? yes / no
