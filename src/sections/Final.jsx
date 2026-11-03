import Pill from '../components/ui/Pill';
import Footer from '../components/layout/Footer';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';

export default function Final({ page = 'home' }) {
  const ref = useGsap(root => {
    if (!anim) return;
    gsap.from('.ln>span', { yPercent: 110, duration: 1.3, stagger: .1, ease: E, scrollTrigger: { trigger: root, start: 'top 70%' } });
    gsap.from('.cta', { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: '.cta', start: 'top 90%' } });
  });

  return (
    <section className="final dark" ref={ref}>
      <div className="wrap">
        <h2 className="display xl">
          <span className="ln"><span>Bring the idea.</span></span>
          <span className="ln"><span><em>We'll do the boring bits.</em></span></span>
        </h2>
        <div className="cta center">
          <Pill variant="light">Start free</Pill>
          <a className="tlink light" href={page === 'home' ? '#tools' : '/#tools'}>Try the free tools first</a>
        </div>
        <p className="fine light">Your first live link before your <span>coffee</span> cools.</p>
      </div>
      <Footer page={page} />
    </section>
  );
}
