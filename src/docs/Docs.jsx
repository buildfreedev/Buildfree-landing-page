import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import Pill from '../components/ui/Pill';
import NpmChip from '../components/ui/NpmChip';
import { FaqItem } from '../sections/Fit';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { usePointerFx } from '../hooks/usePointerFx';
import { anim, gsap, E } from '../lib/motion';
import { Note, Code, Cmd, KeyValue, Table, Steps, Tabs, Download, OpenApp, DoDont, Flow, H3 } from './blocks';
import { WORDS, SECTIONS, RECIPE, FAQ } from './content/guide';
import { REGISTER_URL, LOGIN_URL } from './content/links';
import {
  KIT_URL, PLATFORMS, FILES, CUSTOMISE, AI_TOOLS, AI_STEPS, PROMPTS,
} from './content/website';
import { SHOP } from './content/shop';
import { INSTALL_CMD, sdkSamples } from '../data/sdk';
import { AgentTeaser, UseAi } from './Agent';

// The docs show one step at a time. Pick a step in the menu (or use Next / Previous)
// and only that step is on screen. The address (#collection) follows along.
//   Phase 1: set up buildfree -> Phase 2: put it on a website
//   -> Phase 3: extras -> Phase 4: let an AI tool help
// Step numbers come from the lists below, so adding or removing a step renumbers the rest.
const byId = ids => ids.map(id => SECTIONS.find(s => s.id === id));
const SETUP = byId(['account', 'project', 'collection', 'entry', 'apikey', 'website']);
const EXTRAS = byId(['form', 'payments', 'team', 'billing']);
const WEBSITE_STEP = SETUP.length + 1;
const STEP_OF = s => {
  const i = SETUP.indexOf(s);
  return i >= 0 ? i + 1 : WEBSITE_STEP + 1 + EXTRAS.indexOf(s);
};

// Every page in reading order. `group` is the menu heading it sits under.
const PAGES = [
  { id: 'start', group: '', title: 'Start here' },
  ...SETUP.map(s => ({ id: s.id, group: 'Phase 1 · Set up buildfree', title: s.title, n: STEP_OF(s), section: s })),
  { id: 'connect', group: 'Phase 2 · Your website', title: 'Put it on your website', n: WEBSITE_STEP },
  ...EXTRAS.flatMap(s => [
    { id: s.id, group: 'Phase 3 · Add more', title: s.title, n: STEP_OF(s), section: s },
    ...(s.id === 'payments' ? [
      { id: 'shop', group: 'Phase 3 · Add more', title: 'Shop setup: what to create' },
      { id: 'payment-data', group: 'Phase 3 · Add more', title: 'What you send for payments' },
    ] : []),
  ]),
  { id: 'ai', group: 'Phase 4 · AI tools', title: 'Let an AI tool build it' },
  { id: 'recipe', group: 'Help', title: 'Full example' },
  { id: 'faq', group: 'Help', title: 'Problems & answers' },
];

// Everything searchable about a page, in one lowercase string.
const FIND = {
  connect: JSON.stringify([PLATFORMS, FILES, CUSTOMISE]),
  shop: JSON.stringify(SHOP.collections) + JSON.stringify(SHOP.forms) + JSON.stringify(SHOP.pages),
  'payment-data': JSON.stringify([SHOP.payment, SHOP.orderFields, SHOP.replyFields]),
  ai: JSON.stringify([AI_TOOLS, AI_STEPS, PROMPTS]),
  recipe: JSON.stringify(RECIPE),
  faq: JSON.stringify(FAQ),
  start: JSON.stringify(WORDS),
};
const haystack = p => (p.title + ' ' + (p.section ? JSON.stringify(p.section) : FIND[p.id] || '')).toLowerCase();

// Menu badge: the step number, or a small icon for pages that are not numbered steps.
const GLYPH = {
  start: 'M3 9.5 10 3l7 6.5V17H3z',
  ai: 'M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8z',
  shop: 'M4 7h12l-1 10H5zM7 7a3 3 0 0 1 6 0',
  'payment-data': 'M2.5 5h15v10h-15zM2.5 9h15',
  recipe: 'M6 5h11M6 10h11M6 15h11M3 5h.01M3 10h.01M3 15h.01',
  faq: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8 8a2 2 0 1 1 3 1.7c-.7.4-1 .8-1 1.5M10 14h.01',
};
const Badge = ({ p }) => p.n
  ? <span className="nb">{p.n}</span>
  : <span className="nb ic"><svg viewBox="0 0 20 20" aria-hidden="true"><path d={GLYPH[p.id]} /></svg></span>;

const ROADMAP = [
  { phase: 'Phase 1', title: 'Set up buildfree', text: 'Register, make a project, add your content, create your key.', steps: `Steps 1–${SETUP.length}`, go: 'account', tone: 'c-sage' },
  { phase: 'Phase 2', title: 'Put it on your website', text: 'Copy a ready-made snippet for HTML, React, Angular or WordPress.', steps: `Step ${WEBSITE_STEP}`, go: 'connect', tone: 'c-lilac' },
  { phase: 'Phase 3', title: 'Add more', text: 'Contact forms, online payments, team members and your plan.', steps: `Steps ${WEBSITE_STEP + 1}–${WEBSITE_STEP + EXTRAS.length}`, go: 'form', tone: 'c-butter' },
  { phase: 'Phase 4', title: 'Or let AI do it', text: 'Copy a prompt into Claude, ChatGPT or Cursor.', steps: 'Optional', go: 'ai', tone: 'c-blush' },
];

const Head = ({ kicker, title, children }) => (
  <header className="dx-head">
    <p className="kicker">{kicker}</p>
    <h1 className="dx-title">{title}</h1>
    {children && <p className="dx-intro">{children}</p>}
  </header>
);

// ---------- pages ----------

// The whole integration in three steps, with the code rewritten as you type your own names.
const clean = (v, fallback) => v.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || fallback;

const PATHS = [
  ['connect/node', 'Node.js'], ['connect/html', 'HTML'], ['connect/react', 'React'],
  ['connect/angular', 'Angular'], ['connect/wordpress', 'WordPress'], ['ai', 'Let an AI do it'],
];

const QuickStart = ({ go }) => {
  const [project, setProject] = useState('my-shop');
  const [collection, setCollection] = useState('products');
  const code = useMemo(
    () => sdkSamples({ project: clean(project, 'my-shop'), collection: clean(collection, 'products') }).read.code,
    [project, collection],
  );
  return (
    <section className="dx-quick" id="path-code" aria-labelledby="dx-quick-h">
      <p className="kicker">Path 3 · Quick start with code</p>
      <h2 className="dx-qh" id="dx-quick-h">Three steps. <em>That's the whole integration.</em></h2>
      <div className="dx-qg">
        <ol className="dx-q3">
          <li><span>1</span><div><b>Install</b><Cmd>{INSTALL_CMD}</Cmd></div></li>
          <li><span>2</span><div><b>Add your key</b><Cmd>BUILDFREE_KEY=cms_live_your_key</Cmd><small>Put it in a .env file. Your key starts with cms_live_.</small></div></li>
          <li><span>3</span><div><b>Ask for your content</b><small>Copy the code. It already has your names in it.</small></div></li>
        </ol>
        <div className="dx-qcode">
          <div className="dx-mine">
            <label>Project name<input value={project} onChange={e => setProject(e.target.value)} maxLength={40} spellCheck={false} autoComplete="off" /></label>
            <label>Collection<input value={collection} onChange={e => setCollection(e.target.value)} maxLength={40} spellCheck={false} autoComplete="off" /></label>
          </div>
          <Code title="products.js" text={code} />
        </div>
      </div>
      <p className="dx-paths">
        <span>Not using Node? Pick your way:</span>
        {PATHS.map(([to, label]) => <button key={to} type="button" onClick={() => go(to)}>{label}</button>)}
      </p>
    </section>
  );
};

const jump = id => {
  const el = document.getElementById(id);
  if (!el) return;
  window.__lenis ? window.__lenis.scrollTo(el, { offset: -96, duration: 1.2 }) : el.scrollIntoView({ behavior: 'smooth' });
};

// Three ways in. Each card takes you to its own section below.
const CHOOSE = [
  { n: '1', tone: 'c-sage', tag: 'No code', title: 'Do it yourself', text: 'Click through buildfree one short job at a time.', cta: 'Start the guide', act: go => go('account') },
  { n: '2', tone: 'c-lilac', tag: 'Least typing', title: 'Let your AI agent build it', text: 'Hand it one file, say what you want, and watch it work.', cta: 'See how', act: () => jump('path-ai') },
  { n: '3', tone: 'c-butter', tag: 'For developers', title: 'Install the SDK', text: 'npm install, paste your key, call one function.', cta: 'Quick start', act: () => jump('path-code') },
];

const Start = ({ go }) => (
  <>
    <header className="dx-head dx-start">
      <p className="kicker"><span className="dot"></span>Getting started</p>
      <h1 className="dx-title bigger">How to build with <em>buildfree.</em></h1>
      <p className="dx-intro">
        buildfree is where you keep everything your website shows: products, blog posts, photos, contact forms and
        payments. Fill it in with simple forms and your website reads it automatically. Pick the way that suits you.
      </p>
      <div className="cta">
        <Pill href={REGISTER_URL} target="_blank" rel="noreferrer">Register on buildfree</Pill>
        <a className="tlink" href={LOGIN_URL} target="_blank" rel="noreferrer">Sign in</a>
      </div>
      <NpmChip />
    </header>

    <ol className="dx-choose" aria-label="Pick your way">
      {CHOOSE.map(c => (
        <li key={c.n}>
          <button type="button" className={'spot ' + c.tone} onClick={() => c.act(go)}>
            <span className="top"><em>{c.n}</em><span className="chip">{c.tag}</span></span>
            <b>{c.title}</b>
            <span className="tx">{c.text}</span>
            <span className="go">{c.cta} <i aria-hidden="true">→</i></span>
          </button>
        </li>
      ))}
    </ol>

    <section className="dx-pathsec" id="path-manual" aria-labelledby="dx-man-h">
      <p className="kicker">Path 1 · Do it yourself</p>
      <h2 className="dx-qh" id="dx-man-h">Click through it. <em>One short job per page.</em></h2>
      <ol className="dx-road">
        {ROADMAP.map(r => (
          <li key={r.phase}>
            <button type="button" className={'spot ' + r.tone} onClick={() => go(r.go)}>
              <span className="chip">{r.phase}</span>
              <b>{r.title}</b>
              <span className="tx">{r.text}</span>
              <small>{r.steps}</small>
              <i aria-hidden="true">↗</i>
            </button>
          </li>
        ))}
      </ol>
      <div className="dx-oneline">
        <p>The whole idea in one line</p>
        <Flow items={['Account', '→', 'Project', '→', 'Collection', '→', 'Entries', '→', 'API key', '→', 'Your website']} />
      </div>
    </section>

    <AgentTeaser go={go} />
    <QuickStart go={go} />

    <H3>Words you will see</H3>
    <div className="dx-words">
      {WORDS.map(([word, meaning]) => (
        <div key={word} className="spot"><b>{word}</b><p>{meaning}</p></div>
      ))}
    </div>
  </>
);

// One numbered step of the guide.
const Section = ({ section, n }) => (
  <>
    <Head kicker={`Step ${n}`} title={section.title}>{section.intro}</Head>

    {section.details && <><H3>{section.details.title}</H3><KeyValue rows={section.details.rows} /></>}
    {section.steps && <Steps steps={section.steps} />}
    {section.cta && (
      <div className="dx-ctas">
        {[].concat(section.cta).map(kind => kind === 'register'
          ? <OpenApp key={kind} url={REGISTER_URL} label="Register on buildfree" hint="Opens the sign-up page in a new tab" />
          : <OpenApp key={kind} url={LOGIN_URL} label="Sign in to buildfree" hint="Opens the sign-in page in a new tab" />)}
      </div>
    )}
    {section.tip && <Note type="tip">{section.tip}</Note>}
    {section.warn && <Note type="warn">{section.warn}</Note>}

    {section.example && <><H3>{section.example.title}</H3><KeyValue rows={section.example.rows} /></>}
    {section.fieldTypes && (
      <>
        <H3>Which field type should I pick?</H3>
        <Table head={section.fieldTypes[0].length > 2 ? ['Type', 'Use it for', 'Example'] : ['Type', 'Use it for']} rows={section.fieldTypes} />
      </>
    )}
    {section.more && <><H3>More ideas</H3><KeyValue rows={section.more} /></>}
    {section.code && (
      <details className="dx-more">
        <summary>For developers: show the code</summary>
        <p className="dx-sub">{section.code.title}</p>
        <Code title={section.code.lang} text={section.code.text} />
      </details>
    )}
  </>
);

// What is inside the React starter kit, file by file.
const KitFiles = () => (
  <>
    <H3>What's inside the kit (and how it works)</H3>
    <p className="dx-sub">
      You don't need to read the code. But if you are curious, or adding buildfree to a React site you already have,
      here is every file in one sentence.
    </p>
    <div className="dx-oneline">
      <p>How the pieces talk to each other</p>
      <Flow items={["Visitor's browser", '→', 'Safe helper · holds the key', '→', 'buildfree']} />
    </div>
    <div className="dx-files">
      {FILES.map(f => (
        <div key={f.name} className="spot">
          <code>{f.name}</code>
          <b>{f.title}</b>
          <p>{f.plain}</p>
          <details className="dx-more">
            <summary>Show the code</summary>
            <Code title={f.name} text={f.code} />
          </details>
        </div>
      ))}
    </div>
    <H3>Your names are different? Change these</H3>
    <Table head={['If…', 'Change this']} rows={CUSTOMISE} />
  </>
);

// Step 7: choose the kind of website, then follow its numbered steps.
const Connect = ({ sub }) => {
  const [id, setId] = useState(PLATFORMS.some(p => p.id === sub) ? sub : 'node');
  useEffect(() => { if (PLATFORMS.some(p => p.id === sub)) setId(sub); }, [sub]);
  const pick = next => { setId(next); history.replaceState(null, '', '#connect/' + next); };
  const platform = PLATFORMS.find(p => p.id === id);
  const tabs = PLATFORMS.map(p => ({ id: p.id, label: p.label, brand: { node: 'Node.js', html: 'HTML5', react: 'React', angular: 'Angular', wordpress: 'WordPress' }[p.id] }));
  const panel = useRef(null);

  // The steps fade in when you switch tabs, not on first load.
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (anim) gsap.fromTo(panel.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, ease: E });
  }, [id]);

  return (
    <>
      <Head kicker={`Phase 2 · Step ${WEBSITE_STEP}`} title="Put your content on your website">
        Your content is ready in buildfree. Now show it on your website. Pick what you use; each one has numbered steps
        and code to copy. Writing code? The Node.js SDK is the shortest path.
      </Head>
      <Tabs className="dx-tabs" tabs={tabs} value={id} onChange={pick} label="Kind of website" />
      <div ref={panel} key={platform.id} role="tabpanel">
        <div className="dx-who">
          <p>{platform.who}</p>
          <span className="tag live">{platform.level}</span>
        </div>
        {platform.showKit && (
          <Download href={KIT_URL} file="buildfree-starter-kit.zip" title="Download the starter kit" sub="buildfree-starter-kit.zip · a small, ready-to-run shop website" />
        )}
        <Steps steps={platform.steps} />
        {platform.showKit && <KitFiles />}
      </div>
      <Note type="tip">Using something else, or don't want to write code? An AI tool can do these steps for you. See “Let an AI tool build it”.</Note>
    </>
  );
};

const ShopSetup = () => (
  <>
    <Head kicker="Phase 3 · Shop" title={SHOP.title}>{SHOP.intro}</Head>
    <H3>What to create in buildfree</H3>
    <p className="dx-sub">Three <b>collections</b> (lists you fill in) and two <b>forms</b> (things customers send you).</p>
    <div className="dx-blocks">
      {SHOP.collections.map(col => (
        <div key={col.name}>
          <p className="dx-label"><span className="tag">Collection · {col.name}</span>{col.what}</p>
          <Table head={['Field', 'Type', 'Example']} rows={col.fields} />
        </div>
      ))}
      {SHOP.forms.map(form => (
        <div key={form.name}>
          <p className="dx-label"><span className="tag draft">Form · {form.name}</span>{form.what}</p>
          <Table head={['Field', 'What it holds', 'Example']} rows={form.fields} />
        </div>
      ))}
    </div>
    <H3>How each page of the shop uses it</H3>
    <KeyValue rows={SHOP.pages} />
    <H3>Why it is built this way</H3>
    <div className="dx-why">
      {SHOP.safety.map(([q, a]) => <div key={q} className="spot"><b>{q}</b><p>{a}</p></div>)}
    </div>
  </>
);

const PaymentDetails = () => (
  <>
    <Head kicker="Payment integration, made simple" title="What you send for a payment, and why">
      Think of it like a shop counter: first you write the order in the order book (the form) and get a ticket number
      (submissionId). Then you hand the ticket number and the amount to the cashier (buildfree + Razorpay).
    </Head>
    <ol className="dx-flowcards">
      {SHOP.payment.map((step, i) => (
        <li key={step.title} className="spot">
          <p><span>{i + 1}</span>{step.who}</p>
          <b>{step.title}</b>
          <small>{step.text}</small>
        </li>
      ))}
    </ol>
    <H3>The 4 details you send to create a payment</H3>
    <Table head={['Detail', 'What it means', 'Example']} rows={SHOP.orderFields} />
    <H3>What buildfree sends back</H3>
    <KeyValue rows={SHOP.replyFields} />
    <H3>Extra details you give Razorpay</H3>
    <Table head={['Option', 'What to put in', 'Why']} rows={SHOP.extras} />
    <DoDont yes={SHOP.canSend} no={SHOP.neverSend} yesTitle="Details you CAN send along" noTitle="Never send" />
    <Note type="tip">Want to collect something new, like a cake size or a gift message? Add it as a field on your order form in buildfree, then send it with the order. It shows up in Submissions next to that order.</Note>
    <H3>The exact messages (for your developer or AI tool)</H3>
    <div className="dx-blocks">
      <Code title={SHOP.examples.save.title} text={SHOP.examples.save.text} />
      <Code title={SHOP.examples.order.title} text={SHOP.examples.order.text} />
      <Code title={SHOP.examples.razorpay.title} text={SHOP.examples.razorpay.text} />
    </div>
    <Note type="warn">{SHOP.cod}</Note>
  </>
);

const Recipe = () => (
  <>
    <Head kicker="Help" title={RECIPE.title}>{RECIPE.story}</Head>
    <ol className="dx-tl">
      {RECIPE.steps.map(([label, text], i) => (
        <li key={label}><span>{i + 1}</span><b>{label}</b><p>{text}</p></li>
      ))}
    </ol>
  </>
);

const Faq = () => (
  <>
    <Head kicker="Help" title="Problems & answers">Most things that go wrong are one of these.</Head>
    <div className="faq">{FAQ.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}</div>
  </>
);

const renderPage = (page, go, sub) => {
  if (page.section) return <Section section={page.section} n={page.n} />;
  switch (page.id) {
    case 'start': return <Start go={go} />;
    case 'connect': return <Connect sub={sub} />;
    case 'shop': return <ShopSetup />;
    case 'payment-data': return <PaymentDetails />;
    case 'ai': return <UseAi go={go} />;
    case 'recipe': return <Recipe />;
    default: return <Faq />;
  }
};

// ---------- the page ----------

// #collection opens a page; #connect/react also picks a tab on it.
const routeFromHash = () => {
  const [id, sub = ''] = location.hash.slice(1).split('/');
  return { id: PAGES.some(p => p.id === id) ? id : 'start', sub };
};

// Pages you have opened, remembered in this browser (just a convenience; fine if storage is blocked).
const loadSeen = () => { try { return JSON.parse(localStorage.getItem('bf-docs-seen')) || []; } catch { return []; } };

export default function Docs() {
  useSmoothScroll();
  usePointerFx();

  const [route, setRoute] = useState(routeFromHash);
  const pageId = route.id;
  const [seen, setSeen] = useState(loadSeen);
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState(false);
  const article = useRef(null);

  const index = PAGES.findIndex(p => p.id === pageId);
  const page = PAGES[index];
  const prev = PAGES[index - 1], next = PAGES[index + 1];

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  // Remember pages you've opened, set the tab title, and slide the new page in.
  useEffect(() => {
    document.title = `${page.title} · buildfree docs`;
    setSeen(s => {
      if (s.includes(page.id)) return s;
      const n = [...s, page.id];
      try { localStorage.setItem('bf-docs-seen', JSON.stringify(n)); } catch { /* ignore */ }
      return n;
    });
  }, [page]);

  useLayoutEffect(() => {
    if (!anim) return;
    const kids = article.current.children;
    const t = gsap.fromTo(kids, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .045, ease: E, clearProps: 'transform,opacity' });
    return () => t.kill();
  }, [pageId]);

  const go = id => {
    history.pushState(null, '', '#' + id);
    setRoute(routeFromHash());
    setMenu(false);
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0);
  };

  const hay = useMemo(() => PAGES.map(haystack), []);
  const q = query.trim().toLowerCase();
  const visible = PAGES.filter((p, i) => !q || hay[i].includes(q));

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav page="docs" />
      <div className="docs" id="top">
        <button type="button" className="dx-mbar" aria-expanded={menu} onClick={() => setMenu(m => !m)}>
          <span>{page.n ? `Step ${page.n} · ` : ''}{page.title}</span><i aria-hidden="true">{menu ? '×' : '☰'}</i>
        </button>

        <aside className={menu ? 'dx-side open' : 'dx-side'} aria-label="Docs menu" data-lenis-prevent>
          <label className="dx-search">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5" /><path d="M13.5 13.5L17 17" /></svg>
            <input type="search" placeholder="Search the guide" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search the guide" />
          </label>
          <nav>
            {visible.map((p, i) => (
              <div key={p.id}>
                {p.group && p.group !== visible[i - 1]?.group && <p className="dx-g">{p.group}</p>}
                <button type="button" className={'dx-i' + (seen.includes(p.id) && p.id !== 'start' ? ' done' : '')} aria-current={p.id === page.id ? 'page' : undefined} onClick={() => go(p.id)}>
                  <Badge p={p} />
                  <span className="nm">{p.title}</span>
                  <span className="ck" aria-hidden="true">✓</span>
                </button>
              </div>
            ))}
            {!visible.length && <p className="dx-none">Nothing matches “{query}”. Try a simpler word, like “form” or “key”.</p>}
          </nav>
        </aside>

        <main className="dx-main" id="main">
          <article className="dx-page" ref={article} key={page.id}>{renderPage(page, go, route.sub)}</article>

          <div className="dx-pn">
            {prev ? (
              <button type="button" onClick={() => go(prev.id)}>
                <small>← Previous</small><b>{prev.title}</b>
              </button>
            ) : <span />}
            {next && (
              <button type="button" className="next" onClick={() => go(next.id)}>
                <small>Next →</small><b>{next.title}</b>
              </button>
            )}
          </div>
        </main>
      </div>
      <div className="dark dx-foot"><Footer page="docs" /></div>
    </>
  );
}
