import { useEffect, useState } from 'react';
import Pill from '../components/ui/Pill';
import Placeholder from '../components/ui/Placeholder';
import NpmChip from '../components/ui/NpmChip';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';
import { slug } from '../lib/format';
import { HERO_WORDS, HERO_STATS } from '../data/content';

// "We'll keep the products. / messages. / …" — cycles every 2.4s.
function RotatingWord() {
  const [cur, setCur] = useState(0);
  const [out, setOut] = useState(-1);

  useEffect(() => {
    if (!anim) return;
    let outTimer;
    const id = setInterval(() => {
      setCur(c => {
        setOut(c);
        clearTimeout(outTimer);
        outTimer = setTimeout(() => setOut(-1), 900);
        return (c + 1) % HERO_WORDS.length;
      });
    }, 2400);
    return () => { clearInterval(id); clearTimeout(outTimer); };
  }, []);

  return (
    <em className="rot" aria-live="polite">
      {HERO_WORDS.map((w, i) => (
        <span key={w} className={'rw' + (i === cur ? ' on' : i === out ? ' out' : '')}>{w}</span>
      ))}
    </em>
  );
}

// "Name your project" → live preview of the API link.
function ClaimForm({ name, setName, preview }) {
  return (
    <form className="claim" id="claim" onSubmit={e => e.preventDefault()}>
      <label htmlFor="proj">Name your project, see your link</label>
      <div className="inrow">
        <input id="proj" value={name} onChange={e => setName(e.target.value)} maxLength={24} autoComplete="off" spellCheck={false} />
        <Pill variant="sm">Claim it free</Pill>
      </div>
      <p className="claim-out"><code>api.buildfree.dev/<b id="projOut">{preview}</b>/products</code><span>preview</span></p>
      <p className="claim-npm"><span>Prefer code?</span><NpmChip /></p>
    </form>
  );
}

export default function Hero() {
  const [name, setName] = useState('my-shop');
  const preview = slug(name).replace(/_/g, '-') || 'my-shop';

  const ref = useGsap(root => {
    if (!anim) return;
    // Intro
    gsap.timeline({ defaults: { ease: E } })
      .from('.hero-h .ln>span', { yPercent: 110, duration: 1.3, stagger: .09 })
      .from('.eyebrow', { opacity: 0, y: 10, duration: .8 }, 0)
      .from('.hero-t>.lede, .claim, .hero-t>.fine', { opacity: 0, y: 20, duration: 1, stagger: .08 }, .5)
      .from('.hc', { y: 70, opacity: 0, duration: 1.3, stagger: .1, clearProps: 'transform' }, .7);
  });

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="wrap hero-g">
        <div className="hero-t">
          <p className="eyebrow"><span className="dot"></span>For websites, apps &amp; AI-built sites</p>
          <h1 className="display hero-h">
            <span className="ln"><span>Build the site.</span></span>
            <span className="ln"><span><em>We'll keep the</em></span></span>
            <span className="ln"><span><RotatingWord /></span></span>
          </h1>
          <p className="lede">Every website has stuff to keep: products, posts, orders, sign-ups. buildfree keeps it safe and hands your site one link to show it. No developer, no servers, no SQL.</p>
          <ClaimForm name={name} setName={setName} preview={preview} />
          <p className="fine">Free to start · No card needed <Placeholder /></p>
        </div>
      </div>
      <div className="wrap hcards">
        {HERO_STATS.map(s => (
          <article key={s.chip} className={'hc spot ' + s.color}>
            <span className="chip">{s.chip}</span>
            <p className="hc-n">{s.n}</p>
            <p className="hc-c">{s.caption}</p>
            <span className="hc-i">↗</span>
          </article>
        ))}
      </div>
    </section>
  );
}
