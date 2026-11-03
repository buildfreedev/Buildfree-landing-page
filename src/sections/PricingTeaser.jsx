import Pill from '../components/ui/Pill';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';
import { PLANS } from '../data/content';

// Home page: the three plans at a glance. The full story lives on /pricing/.
export default function PricingTeaser() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.from('.sec-h>*', { y: 26, opacity: 0, duration: 1, stagger: .08, ease: E, scrollTrigger: { trigger: '.sec-h', start: 'top 88%', once: true } });
    gsap.from('.tier', { y: 50, opacity: 0, duration: 1, stagger: .09, ease: E, scrollTrigger: { trigger: '.tiers', start: 'top 85%', once: true } });
  });

  return (
    <section className="pricing" id="pricing" ref={ref}>
      <div className="wrap">
        <div className="sec-h">
          <div>
            <p className="kicker">Pricing</p>
            <h2 className="display md">One plan in rupees. <em>Not five bills in dollars.</em></h2>
          </div>
          <p className="sec-p">Start free. Move up when your site gets busy. Every plan includes collections, forms, live links and the SDK.</p>
        </div>
        <div className="tiers">
          {PLANS.map(p => (
            <div key={p.id} className={p.hot ? 'tier hot spot' : 'tier spot'}>
              {p.hot && <p className="pop">Most picked</p>}
              <h3>{p.name}</h3>
              <p className="amt">{p.price}</p>
              <p className="per">{p.per === 'forever' ? 'forever' : 'per month'}</p>
              <ul>{p.stats.map(s => <li key={s}>{s}</li>)}</ul>
              <Pill variant={p.hot ? '' : 'ghost'}>{p.cta}</Pill>
            </div>
          ))}
        </div>
        <div className="cta center pt-cta">
          <Pill href="/pricing/">See full pricing</Pill>
          <a className="tlink" href="/pricing/#diy">Compare with doing it yourself</a>
        </div>
      </div>
    </section>
  );
}
