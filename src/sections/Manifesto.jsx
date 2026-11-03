import { Fragment, useState } from 'react';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, ScrollTrigger, E } from '../lib/motion';
import { MANIFESTO } from '../data/content';

const WORDS = MANIFESTO.split(/\s+/);

// Words darken one by one as the paragraph scrolls through the viewport.
export default function Manifesto() {
  const [lit, setLit] = useState(anim ? 0 : WORDS.length);

  const ref = useGsap(() => {
    if (!anim) return;
    ScrollTrigger.create({
      trigger: '.scrub', start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: s => setLit(Math.round(s.progress * WORDS.length)),
    });
    gsap.from('.mani-h', { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: '.mani-h', start: 'top 90%' } });
  });

  return (
    <section className="manifesto" aria-label="Why it matters" ref={ref}>
      <div className="wrap mani-g">
        <h2 className="display md mani-h">Nobody visits a website <em>for its database.</em></h2>
        <div className="scrub-w">
          <span className="rail" aria-hidden="true"><i style={{ transform: `scaleY(${lit / WORDS.length})` }}></i></span>
          <p className="scrub" id="scrub">
            {WORDS.map((w, i) => <Fragment key={i}><span className={i < lit ? 'w on' : 'w'}>{w}</span>{' '}</Fragment>)}
          </p>
        </div>
      </div>
    </section>
  );
}
