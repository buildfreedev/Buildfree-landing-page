# Component structure

The site is a Vite + React (JSX) app. `index.html` holds just `<div id="root">`,
and everything else is a component.

```bash
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

## Folder map

```
src/
├── main.jsx               Entry: loads fonts + CSS, mounts <App/> into #root
├── App.jsx                The page, top to bottom: <Nav/>, 14 sections, <Dock/>
├── style.css              All styles (unchanged from the HTML version)
│
├── sections/              One file per page section, in page order
│   ├── Hero.jsx             RotatingWord, HeroCards, ClaimForm live inside
│   ├── Logos.jsx
│   ├── Manifesto.jsx
│   ├── Roast.jsx            pinned scroll animation
│   ├── Stack.jsx            PainCard, Bills
│   ├── How.jsx              pinned card stack + 4 small "screen" components
│   ├── Playground.jsx       Editor, JsonPreview, ShopPhone share one state
│   ├── AiBuilders.jsx       AiDemo (typing animation)
│   ├── Who.jsx              CaseCard
│   ├── Tools.jsx            tab container…
│   ├── tools/               …and one file per tool
│   │   ├── ApiGenerator.jsx
│   │   ├── Quiz.jsx
│   │   ├── SavingsCalc.jsx
│   │   └── PromptPack.jsx
│   ├── Lines.jsx
│   ├── Pricing.jsx          Tier
│   ├── Fit.jsx              checklist + FAQ
│   └── Final.jsx            includes <Footer/>
│
├── components/
│   ├── ui/                Small reusable pieces, used across sections
│   │   ├── Pill.jsx         CTA button  <Pill variant="sm">Start free</Pill>
│   │   ├── SectionHeader.jsx kicker + heading + paragraph
│   │   ├── BrandIcon.jsx    <BrandIcon name="Stripe"/>, <Brand name="Stripe"/>
│   │   ├── BMark.jsx        the logo mark SVG
│   │   ├── Logo.jsx         mark + wordmark link
│   │   └── Placeholder.jsx  "[confirm]" marker for unapproved copy
│   └── layout/            Page chrome outside the sections
│       ├── Nav.jsx          hides on scroll down, solid after 30px
│       ├── Dock.jsx         floating CTA
│       └── Footer.jsx
│
├── data/
│   ├── content.jsx        Every repeated list: stats, pains, bills, steps,
│   │                      cases, tiers, FAQ, quiz questions, presets…
│   └── brandIcons.js      SVG paths for the brand logos (generated)
│
├── hooks/
│   ├── useGsap.js         Scoped GSAP animations with automatic cleanup
│   └── useSmoothScroll.js Lenis smooth scroll + smooth #anchor links
│
└── lib/
    ├── motion.js          GSAP setup + flags: anim, mobile, reduced, STATIC
    ├── format.js          APP_URL, slug, hlJSON, money, CUR
    └── schema.js          API generator: text → collection + fields
```

## How the pieces relate

```
App
 ├─ Nav ─────────────── Logo, Pill
 ├─ Hero ────────────── RotatingWord · HeroCards · ClaimForm · Pill
 ├─ Stack ───────────── SectionHeader · PainCard ×5 (Brand) · Bills
 ├─ How ─────────────── 4 cards: CollectionEditor · EntryForm · ApiAndPhone · Inbox
 ├─ Playground ──────── state: products[]
 │                        ├─ Editor      (writes via onChange)
 │                        ├─ JsonPreview (reads)
 │                        └─ ShopPhone   (reads, own cart state)
 ├─ Tools ───────────── state: active tab
 │                        └─ ApiGenerator · Quiz · SavingsCalc · PromptPack
 ├─ … Who, Pricing, Fit (map over arrays in data/content.jsx)
 ├─ Final ───────────── Footer
 └─ Dock
```

## The patterns to recognise

**1. Section = markup + its own state + its own animation.**
Each section file is self-contained. To remove a section, delete one line in `App.jsx`.

**2. Data-driven lists.** Repeating markup lives once in a small component and the
copy lives in `data/content.jsx`:

```jsx
// Who.jsx
<div className="cases">{CASES.map(c => <CaseCard key={c.who} {...c} />)}</div>
```

To add a FAQ, tier or case study, add an object to the array. You don't touch JSX.

**3. Lifting state up (Playground).** One `products` array lives in `Playground`.
`Editor` changes it through an `onChange` prop, while `JsonPreview` and `ShopPhone`
only read it. React re-renders all three, so they can't get out of sync. The old
version kept them in sync by hand with `innerHTML`.

**4. Controlled inputs.** Inputs take `value` from state and call `onChange`
(see `ClaimForm`, `ApiGenerator`, `SavingsCalc`). What's on screen always comes
from state.

**5. Refs for imperative bits.** GSAP and the typing animation need real DOM
nodes, so they use `useRef` (see `SavingsCalc`, `AiDemo`). Use refs when a library
needs a node. Use state for anything else.

**6. `useGsap` for animation.**

```jsx
const ref = useGsap(root => {
  gsap.from('.tier', { y: 50, scrollTrigger: { trigger: '.tiers' } });
});
return <section ref={ref}>…</section>;
```

Selectors only match inside that section, and every tween and ScrollTrigger is
reverted on unmount. Return a function to remove your own event listeners
(see `Hero`).

> **Gotcha:** because selectors are scoped to the section's *children*, a selector
> that names the section itself (`trigger: '.roast'`) finds nothing, and the
> ScrollTrigger silently starts at the top of the page. To target the section
> itself, use the `root` argument: `trigger: root`.

**7. Motion flags.** Animations check `anim` from `lib/motion.js`. The flag is
false when the user prefers reduced motion or when the URL has `?static`.

## Where to change things

| I want to…                         | Edit                                  |
|------------------------------------|---------------------------------------|
| Change copy in a list (FAQ, tiers) | `src/data/content.jsx`                |
| Change a heading / paragraph       | that section's file in `src/sections` |
| Change the app link everywhere     | `APP_URL` in `src/lib/format.js`      |
| Add a brand logo                   | `src/data/brandIcons.js`              |
| Add a new section                  | new file in `sections/`, add to `App.jsx` |
| Change colours / spacing           | `src/style.css`                       |
