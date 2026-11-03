import { useEffect, useRef, useState } from 'react';
import BMark from '../components/ui/BMark';
import Pill from '../components/ui/Pill';
import SectionHeader from '../components/ui/SectionHeader';
import { Brand } from '../components/ui/BrandIcon';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';
import { PAINS, BILLS } from '../data/content';

function PainCard({ title, chips, ouch }) {
  return (
    <article className="pain spot">
      <h3>{title}</h3>
      <p className="chips">{chips.map(c => <span key={c}><Brand name={c} /></span>)}</p>
      <p className="ouch">{ouch}</p>
    </article>
  );
}

// Receipt-style list of monthly bills vs. one buildfree plan.
// Tap a bill to take it out of (or put it back into) the total.
function Bills() {
  const [on, setOn] = useState(BILLS.map(() => true));
  const total = BILLS.reduce((sum, [, amt], i) => sum + (on[i] ? parseInt(amt.replace(/\D/g, ''), 10) : 0), 0);
  const count = on.filter(Boolean).length;

  // The total counts to its new value instead of jumping.
  const out = useRef(null);
  const shown = useRef({ v: total });
  useEffect(() => {
    const tween = gsap.to(shown.current, { v: total, duration: anim ? .6 : 0, ease: E, onUpdate: () => { out.current.textContent = '≈ $' + Math.round(shown.current.v) + '*'; } });
    return () => tween.kill();
  }, [total]);

  return (
    <div className="bills" aria-label="Typical monthly bills, estimates">
      <p className="bills-k">Your month, stitched <small>tap to remove</small></p>
      <div className="billstack">
        {BILLS.map(([label, amt], i) => (
          <button key={label} className={on[i] ? 'bl' : 'bl off'} aria-pressed={on[i]}
            onClick={() => setOn(o => o.map((v, j) => (j === i ? !v : v)))}>
            <span>{label}</span><b>{amt}</b>
          </button>
        ))}
      </div>
      <div className="btotal"><span>{count} {count === 1 ? 'bill' : 'bills'}, every month</span><b ref={out}>≈ $129*</b></div>
      <div className="bone">
        <BMark />
        <div><b>buildfree</b><small>your data, API, forms, keys &amp; team</small></div>
        <strong>1 plan</strong>
      </div>
      <p className="fine">*Rough monthly estimates for a small production site, based on public entry-level paid tiers (Oct 2026). Free tiers exist; prices vary by usage and region.</p>
    </div>
  );
}

export default function Stack() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.from('.sec-h', { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: '.sec-h', start: 'top 90%' } });
    gsap.from('.pain', { y: 40, opacity: 0, duration: 1, stagger: .08, ease: E, scrollTrigger: { trigger: '.pains', start: 'top 80%' } });
    gsap.from('.bl', { x: 60, y: -30, rotate: 8, opacity: 0, ease: 'power2.out', stagger: .15, scrollTrigger: { trigger: '.stk-g', start: 'top 70%', end: 'center 45%', scrub: .8 } });
    gsap.from('.btotal, .bone', { y: 30, opacity: 0, stagger: .1, scrollTrigger: { trigger: '.billstack', start: 'bottom 75%', end: 'bottom 50%', scrub: .8 } });
  });

  return (
    <section className="stk" id="stack" ref={ref}>
      <div className="wrap">
        <SectionHeader kicker="The stitch-it-yourself stack" title={<>Want photos on your site? <em>That's four accounts.</em></>}>
          Every "small" feature means another service, another setup weekend, and another bill that renews every month.
        </SectionHeader>
        <div className="stk-g">
          <div className="pains">{PAINS.map(p => <PainCard key={p.title} {...p} />)}</div>
          <Bills />
        </div>
        <div className="cta center stk-cta"><Pill>Swap the stack for one login</Pill></div>
      </div>
    </section>
  );
}
