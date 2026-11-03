import { useGsap } from '../hooks/useGsap';
import { anim, gsap } from '../lib/motion';
import { LINES } from '../data/content';

// "Content before code." etc. — words slide up and fill in with scroll.
export default function Lines() {
  const ref = useGsap(root => {
    if (!anim) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 70%', end: 'bottom 60%', scrub: 1 } });
    root.querySelectorAll('.line').forEach((l, i) => {
      tl.fromTo(l.querySelector('.lw em'), { yPercent: 110 }, { yPercent: 0, ease: 'power2.out', duration: 1 }, i)
        .fromTo(l.querySelector('.lr'), { backgroundPositionX: '100%' }, { backgroundPositionX: '0%', ease: 'none', duration: 1.2 }, i + .2);
    });
  });

  return (
    <section className="lines dark" ref={ref}>
      <div className="wrap">
        {LINES.map(([word, rest]) => (
          <p className="line" key={word}><span className="lw"><em>{word}</em></span> <span className="lr">{rest}</span></p>
        ))}
      </div>
    </section>
  );
}
