import SectionHeader from '../components/ui/SectionHeader';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';
import { CASES } from '../data/content';

function CaseCard({ who, thought, big, cap, points }) {
  return (
    <article className="case spot">
      <small>{who}</small>
      <p className="thought">{thought}</p>
      <p className="big">{big}</p>
      <p className="cap">{cap}</p>
      <ul>{points.map(p => <li key={p}>{p}</li>)}</ul>
    </article>
  );
}

export default function Who() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.from('.case', { y: 60, opacity: 0, duration: 1.1, stagger: .09, ease: E, scrollTrigger: { trigger: '.cases', start: 'top 82%' } });
    gsap.utils.toArray('.sec-h, .display, .kicker').forEach(el => gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: el, start: 'top 90%' } }));
  });

  return (
    <section className="who dark" id="who" ref={ref}>
      <div className="wrap">
        <SectionHeader light kicker="Who it's for" title={<>One back office. <em>Very different Mondays.</em></>}>
          Whoever you are, the job is the same: keep your stuff, show it anywhere, change it without calling anyone.
        </SectionHeader>
        <div className="cases">{CASES.map(c => <CaseCard key={c.who} {...c} />)}</div>
        <p className="fine light">Quotes are example scenarios, not customer testimonials.</p>
      </div>
    </section>
  );
}
