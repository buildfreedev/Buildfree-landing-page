import { useEffect } from 'react';
import Nav from '../components/layout/Nav';
import Pill from '../components/ui/Pill';
import Final from '../sections/Final';
import { FaqPanel } from '../sections/Fit';
import { useGsap } from '../hooks/useGsap';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { usePointerFx } from '../hooks/usePointerFx';
import { anim, gsap, ScrollTrigger, E } from '../lib/motion';
import { PLANS, PLAN_LIMITS, FAQ, PRICING_FAQ } from '../data/content';
import Diy from './Diy';

// Included on every plan (shown as ticks under the limits).
const FEATURES = [
  'Collections, entries and forms',
  'Live links for any site or AI builder',
  'Form submissions in one inbox',
  'Node.js SDK, snippets and AI instructions',
];

const FAQ_TABS = [
  { id: 'plans', label: 'Plans and billing', items: [...PRICING_FAQ.filter(f => f.tab === 'plans'), ...FAQ.filter(f => f.tab === 'plans')] },
  { id: 'diy', label: 'Compared with doing it yourself', items: PRICING_FAQ.filter(f => f.tab === 'diy') },
];

const jump = id => {
  const el = document.getElementById(id);
  if (el) window.__lenis ? window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
};

// Plans side by side, like twain.ai's pricing table. The plan picked on the dial is highlighted.
function PlanTable({ plan }) {
  const col = p => (p.id === plan ? 'on' : undefined);
  return (
    <div className="cmp" role="table" aria-label="Compare plans">
      <div className="cmp-r cmp-h" role="row">
        <span role="columnheader"><b>What you get</b><small>Every plan includes the whole back office.<br />Monthly requests reset every month.</small></span>
        {PLANS.map(p => (
          <span role="columnheader" key={p.id} className={col(p)}>
            <b>{p.name}{p.hot && <em>Most picked</em>}</b>
            <span className="cmp-amt">{p.price}<small>{p.per === 'forever' ? '' : '/mo'}</small></span>
          </span>
        ))}
      </div>
      {FEATURES.map(f => (
        <div className="cmp-r" role="row" key={f}>
          <span role="rowheader">{f}</span>
          {PLANS.map(p => <span role="cell" key={p.id} className={col(p)}><span className="yes" aria-label="Included">✓</span></span>)}
        </div>
      ))}
      {PLAN_LIMITS.map(([label, ...vals]) => (
        <div className="cmp-r" role="row" key={label}>
          <span role="rowheader">{label}</span>
          {vals.map((v, k) => <span role="cell" key={k} className={col(PLANS[k])}><span className="txt">{v}</span></span>)}
        </div>
      ))}
      <div className="cmp-r cmp-cta" role="row">
        <span role="cell"></span>
        {PLANS.map(p => <span role="cell" key={p.id} className={col(p)}><Pill variant={p.hot ? 'sm' : 'sm ghost'}>{p.cta}</Pill></span>)}
      </div>
    </div>
  );
}

export default function PricingPage() {
  useSmoothScroll();
  usePointerFx();

  // Sticky sections measure the page; re-measure once fonts load and on resize.
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    let t;
    const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 150); });
    ro.observe(document.getElementById('main'));
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []);

  const ref = useGsap(() => {
    if (!anim) return;
    gsap.timeline({ defaults: { ease: E } })
      .from('.pp-t>*', { y: 30, opacity: 0, duration: 1.1, stagger: .08 })
      .from('.pp-plans .tier', { y: 50, opacity: 0, duration: 1.1, stagger: .09 }, .35);
    gsap.from('.pp-table .cmp-r', { y: 18, opacity: 0, duration: .8, stagger: .04, ease: E, scrollTrigger: { trigger: '.pp-table', start: 'top 80%', once: true } });
  });

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav page="pricing" />
      <main id="main" ref={ref}>
        <section className="pp-hero" id="top">
          <div className="wrap pp-t">
            <p className="kicker"><span className="dot"></span>Pricing</p>
            <h1 className="display pp-h">One back office. <em>One bill, in rupees.</em></h1>
            <p className="lede">The usual way is five tools, five bills in dollars and a weekend of setup. buildfree is one plan you can start free and grow into.</p>
          </div>
        </section>

        <section className="pp-plans" aria-label="Plans">
          <div className="wrap">
            <div className="tiers">
              {PLANS.map(p => (
                <div key={p.id} className={p.hot ? 'tier hot spot' : 'tier spot'}>
                  {p.hot && <p className="pop">Most picked</p>}
                  <h3>{p.name}</h3>
                  <p className="amt">{p.price}</p>
                  <p className="per">{p.per === 'forever' ? 'forever' : 'per month'}</p>
                  <p className="tier-lede">{p.lede}</p>
                  <ul>{p.stats.map(st => <li key={st}>{st}</li>)}</ul>
                  <Pill variant={p.hot ? '' : 'ghost'}>{p.cta}</Pill>
                </div>
              ))}
            </div>
            <div className="pp-btns">
              <button type="button" className="pp-b ghost" onClick={() => jump('diy')}>Compare with doing it yourself</button>
              <button type="button" className="pp-b ghost" onClick={() => jump('faq')}>What counts as a request?</button>
            </div>
          </div>
        </section>

        <section className="pp-table" aria-label="Plans side by side">
          <div className="wrap"><PlanTable plan="pro" /></div>
        </section>

        <Diy />
        <section className="pp-faq"><FaqPanel tabs={FAQ_TABS} title={<>Questions about <em>money.</em></>} /></section>
        <Final page="pricing" />
      </main>
    </>
  );
}
