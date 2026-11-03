import { useLayoutEffect, useRef, useState } from 'react';
import Tabs from '../components/ui/Tabs';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';
import { FIT, FAQ } from '../data/content';

// One FAQ row. Still a native <details> (keyboard and no-JS friendly),
// but the answer slides open and closed instead of snapping.
export function FaqItem({ q, a }) {
  const el = useRef(null), body = useRef(null);

  const toggle = e => {
    e.preventDefault();
    const d = el.current, b = body.current;
    if (!anim) { d.open = !d.open; return; }
    gsap.killTweensOf(b);
    if (d.open) {
      d.classList.add('closing');
      gsap.to(b, { height: 0, opacity: 0, duration: .45, ease: 'power3.inOut', onComplete: () => { d.open = false; d.classList.remove('closing'); gsap.set(b, { clearProps: 'height,opacity' }); } });
    } else {
      d.open = true;
      gsap.fromTo(b, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: .55, ease: E, onComplete: () => gsap.set(b, { clearProps: 'height' }) });
    }
  };

  return (
    <details ref={el}>
      <summary onClick={toggle}>{q}</summary>
      <div className="faq-a" ref={body}><p>{a}</p></div>
    </details>
  );
}

// "Made for you if…" checklist, then the FAQ accordion.
const FAQ_TABS = [
  { id: 'plans', label: 'Plans and pricing', items: FAQ.filter(f => f.tab === 'plans') },
  { id: 'using', label: 'Using buildfree', items: FAQ.filter(f => !f.tab) },
];

// Big soft panel with topic tabs and the questions under them. `tabs`: [{ id, label, items: [{ q, a }] }].
export function FaqPanel({ tabs, start = tabs[0].id, title = <>Before <em>you ask.</em></> }) {
  const [tab, setTab] = useState(start);
  const list = useRef(null);
  const first = useRef(true);
  const items = tabs.find(t => t.id === tab).items;

  // The questions fade in when you switch tabs (not on first load).
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (anim) gsap.fromTo(list.current.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, stagger: .05, ease: E, overwrite: true, clearProps: 'opacity,transform' });
  }, [tab]);

  // Reveal the question list as one block: its rows change with the tabs, so they
  // must never be left waiting on their own scroll triggers (that hid them before).
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.from('.faq-top>*', { y: 26, opacity: 0, duration: 1, stagger: .08, ease: E, scrollTrigger: { trigger: '.faq-top', start: 'top 90%', once: true } });
    gsap.from('.faq', { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: '.faq', start: 'top 92%', once: true } });
  });

  return (
    <div className="faq-panel" id="faq" ref={ref}>
      <div className="wrap">
        <div className="faq-top">
          <p className="kicker">FAQ</p>
          <h2 className="display md">{title}</h2>
          <Tabs className="faq-tabs" tabs={tabs.map(({ id, label }) => ({ id, label }))} value={tab} onChange={setTab} label="Question topics" />
        </div>
        <div className="faq" ref={list} role="tabpanel">
          {items.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </div>
      </div>
    </div>
  );
}

export default function Fit() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.utils.toArray('.fit-g>div, .fitlist li')
      .forEach(el => gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  });

  return (
    <section className="fit" ref={ref}>
      <div className="wrap fit-g">
        <div><p className="kicker">Honest check</p><h2 className="display md">Made for you <em>if…</em></h2></div>
        <ul className="fitlist">
          {FIT.map(f => <li key={f.text} className={f.no ? 'no' : undefined}>{f.text}</li>)}
        </ul>
      </div>
      <FaqPanel tabs={FAQ_TABS} start="using" />
    </section>
  );
}
