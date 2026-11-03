// "Online shop with payments" – a complete example of how a shop website
// uses buildfree, with every detail that travels during a payment.

export const SHOP = {
  title: "Online shop with payments — the full picture",
  intro:
    "Here is how a complete online shop uses buildfree: products, coupons, reviews, orders and online payments. Copy the same setup for your own shop.",

  collections: [
    {
      name: "products",
      what: "Everything you sell",
      fields: [
        ["name", "Text", "Chocolate Truffle Cake"],
        ["category", "Text", "Cakes"],
        ["price", "Number", "450"],
        ["sale_price", "Number", "399 (leave empty when there is no sale)"],
        ["photo", "Image", "The main photo"],
        ["description", "Rich Text", "About the product"],
        ["details", "JSON", '{ "weight": "1 kg", "flavour": "Dark chocolate" }'],
        ["bestseller", "Boolean", "Yes = show a Bestseller badge"],
        ["in_stock", "Boolean", "No = show Out of stock"],
      ],
    },
    {
      name: "coupons",
      what: "Discount codes",
      fields: [
        ["code", "Text", "SWEET100"],
        ["discount", "Number", "100 (₹ taken off the bill)"],
      ],
    },
    {
      name: "reviews",
      what: "Reviews shown on product pages",
      fields: [
        ["product_id", "Text", "Which product it is about"],
        ["reviewer_name", "Text", "Kavya"],
        ["stars", "Number", "5"],
        ["comment", "Text", "Fresh and delicious!"],
      ],
    },
  ],

  forms: [
    {
      name: "order-form",
      what: "Every order — online payment and Cash on Delivery",
      fields: [
        ["name", "Customer's name", "Rahul Verma"],
        ["email", "For the order confirmation", "rahul@mail.com"],
        ["phone", "Delivery contact", "9876543210"],
        ["address", "Where to deliver", "4 MG Road, Bengaluru 560001"],
        ["product", "Filled in by the website", "Chocolate Truffle Cake × 1, Butter Cookies × 2"],
        ["quantity", "Filled in by the website", "3"],
        ["total", "Filled in by the server — the final bill", "789"],
      ],
    },
    {
      name: "review-form",
      what: "The “Write a review” box on each product page",
      fields: [
        ["product_id", "Filled in by the website", "The product being reviewed"],
        ["reviewer_name, reviewer_email", "Typed by the customer", "Kavya, kavya@mail.com"],
        ["stars", "The stars they clicked", "5"],
        ["comment", "Their words", "Fresh and delicious!"],
      ],
    },
  ],

  pages: [
    ["Home & Shop", "Read the products collection. Categories, Bestseller and Sale badges come straight from the product fields."],
    ["Product page", "Shows photo, details and price from products, plus reviews from the reviews collection."],
    ["Write a review", "Sends the review-form. It appears under Submissions in buildfree."],
    ["Cart → coupon", "The server checks the code in coupons and only answers “valid, ₹100 off”. The coupon list is never shown to visitors."],
    ["Checkout", "Saves the order in order-form. For online payment it then opens Razorpay."],
  ],

  payment: [
    {
      who: "Customer",
      title: "Clicks “Pay Online”",
      text: "The website sends only: which products, how many, the coupon code and the delivery details. It does NOT send any price.",
    },
    {
      who: "Your server",
      title: "Works out the bill",
      text: "It reads the real prices from buildfree, uses the sale price if there is one, takes off the coupon and adds shipping. Nobody can change the price from their browser.",
    },
    {
      who: "buildfree · Forms",
      title: "Saves the order",
      text: "The order is saved as an order-form submission. buildfree replies with a submissionId — think of it as the order's ticket number.",
    },
    {
      who: "buildfree · Payments",
      title: "Creates the payment",
      text: "The server sends recordId (the product), submissionId (the ticket number), amount (in paise) and currency. buildfree creates the Razorpay order and sends back what is needed to open the payment window.",
    },
    {
      who: "Razorpay",
      title: "Customer pays",
      text: "The Razorpay window opens with the customer's name, email and phone already filled in. They pay by UPI, card, net banking or wallet.",
    },
    {
      who: "buildfree · Orders",
      title: "Status updates by itself",
      text: "Razorpay tells buildfree (through the webhook) whether the payment worked. The order shows PENDING, CAPTURED (paid) or FAILED in the Orders tab.",
    },
  ],

  orderFields: [
    ["recordId", "Which product is being bought (its recordId in the products collection). For a cart with many items, send the first product.", "\"6650f1…\""],
    ["submissionId", "The ticket number of the saved order form. It links the payment to the customer's order details.", "\"6651a9…\""],
    ["amount", "The final bill in paise. ₹1 = 100 paise, so multiply rupees by 100.", "78900 (= ₹789)"],
    ["currency", "Which money.", "\"INR\""],
  ],

  replyFields: [
    ["orderId", "buildfree's own order number — keep it as your reference."],
    ["razorpayOrderId", "Razorpay's order number — used to open the payment window."],
    ["amount, currency", "The amount to charge, so the window shows the right price."],
    ["keyId", "Your public Razorpay key (safe to show; the secret stays inside buildfree)."],
  ],

  extras: [
    ["prefill", "Name, email, phone", "So the customer does not have to type them again in Razorpay."],
    ["notes", "submissionId, buildFreeOrderId", "Small labels Razorpay carries with the payment, so the webhook can find and update the right order."],
  ],

  canSend: [
    "Any detail you add as a field on your order form — gift message, cake size, delivery date, preferred time, GST number, “gift wrap: yes”.",
    "Customer details — name, email, phone, full address.",
    "Order details — product names with quantity, the coupon used, the final price.",
    "Short labels in Razorpay notes — e.g. the order ticket number, so you can match payments later.",
  ],
  neverSend: [
    "Card numbers, UPI PINs or bank passwords — Razorpay collects these itself, safely.",
    "Your buildfree API key inside the website's browser code — keep it on the server.",
    "A price chosen by the browser — always calculate the total on the server from buildfree prices.",
  ],

  examples: {
    save: {
      title: "1 · Save the order (order-form)",
      lang: "JSON",
      text: `POST …/forms/order-form/submit
{
  "name": "Rahul Verma",
  "email": "rahul@mail.com",
  "phone": "9876543210",
  "address": "4 MG Road, Bengaluru 560001",
  "product": "Chocolate Truffle Cake × 1, Butter Cookies × 2",
  "quantity": 3,
  "total": 789
}

// buildfree replies:
{ "success": true, "message": "…", "submissionId": "6651a9…" }`,
    },
    order: {
      title: "2 · Create the payment (POST /api/v1/order)",
      lang: "JSON",
      text: `{
  "recordId": "6650f1…",        // the product
  "submissionId": "6651a9…",    // the saved order from step 1
  "amount": 78900,              // ₹789 in paise
  "currency": "INR"
}

// buildfree replies (inside "data"):
{
  "orderId": "…",
  "razorpayOrderId": "order_…",
  "amount": 78900,
  "currency": "INR",
  "keyId": "rzp_live_…"
}`,
    },
    razorpay: {
      title: "3 · Open the Razorpay payment window (in the website)",
      lang: "JavaScript",
      text: `new Razorpay({
  key: keyId,
  order_id: razorpayOrderId,
  amount,
  currency,
  name: "Sweet Crumbs Bakery",
  prefill: { name: "Rahul Verma", email: "rahul@mail.com", contact: "9876543210" },
  notes: { submissionId: "6651a9…", buildFreeOrderId: orderId },
}).open();`,
    },
  },

  cod: "Cash on Delivery is simpler: only do the “Saves the order” step. No payment is created — the order waits in Submissions and you collect the cash on delivery.",

  safety: [
    ["Why a server in the middle?", "The website never talks to buildfree directly. A small server file holds the API key, so visitors can never see or copy it."],
    ["Why calculate the price on the server?", "If the browser sent the price, someone could change ₹789 to ₹1. The server always reads the real prices from buildfree."],
    ["Why trust the webhook, not the “thank you” screen?", "The thank-you screen only means the window closed. The webhook message from Razorpay is the real proof the money arrived."],
    ["What if the customer closes Razorpay and tries again?", "Reopen the same payment instead of creating a new one, so you never get duplicate orders."],
  ],
};
