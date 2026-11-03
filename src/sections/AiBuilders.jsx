import { useRef, useState } from 'react';
import BrandIcon, { Brand } from '../components/ui/BrandIcon';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, ScrollTrigger, E } from '../lib/motion';
import { AI_STEPS, AI_TOOLS, AI_PROMPT, AI_BOT_STEPS, AI_MENU } from '../data/content';

// A fake AI-builder chat: the prompt types, the agent "thinks", ticks off what it did and
// shows the table. Then you edit a price in buildfree and the app updates. Loops while on screen.
function AiDemo({ tool }) {
  const ref = useGsap(root => {
    const typed = root.querySelector('.typed');
    const price = root.querySelector('.atr.r0 .pr');
    if (!anim) { typed.textContent = AI_PROMPT; price.textContent = '$10'; return; }
    const conn = root.querySelector('.ad-conn');
    const steps = gsap.utils.toArray('.ads', root);
    const rows = gsap.utils.toArray('.atr:not(.h)', root);
    const o = { n: 0 };
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .8 })
      .call(() => { typed.textContent = ''; o.n = 0; price.textContent = '$9'; conn.classList.remove('on'); })
      .set(['.msg.me', '.ad-steps', '.ad-table', '.ad-edit'], { opacity: 0, y: 12 })
      .set('.ad-think', { display: 'none', opacity: 0 })
      .set(steps, { opacity: 0, x: -10 }).set(rows, { opacity: 0, x: 12 })
      .to('.msg.me', { opacity: 1, y: 0, duration: .3 }, .3)
      .to(o, { n: AI_PROMPT.length, duration: 1, ease: 'none', onUpdate: () => { typed.textContent = AI_PROMPT.slice(0, Math.round(o.n)); } }, .35)
      .set('.ad-think', { display: 'flex' }, 1.45)
      .to('.ad-think', { opacity: 1, duration: .2 }, 1.45)
      .call(() => conn.classList.add('on'), null, 1.9)
      .to('.ad-think', { opacity: 0, duration: .15 }, 2.15)
      .set('.ad-think', { display: 'none' }, 2.3)
      .to('.ad-steps', { opacity: 1, y: 0, duration: .3 }, 2.25)
      .to(steps, { opacity: 1, x: 0, stagger: .22, duration: .35, ease: E }, 2.3)
      .to('.ad-table', { opacity: 1, y: 0, duration: .4, ease: E }, 3.1)
      .to(rows, { opacity: 1, x: 0, stagger: .1, duration: .35, ease: E }, 3.2)
      .to('.ad-edit', { opacity: 1, y: 0, duration: .45, ease: E }, 4.3)
      .call(() => { price.textContent = '$10'; }, null, 4.6)
      .fromTo(price, { backgroundColor: 'rgba(255,205,86,.7)' }, { backgroundColor: 'rgba(255,205,86,0)', duration: 1.1 }, 4.6)
      .to({}, { duration: 1.4 });
    ScrollTrigger.create({ trigger: root, start: 'top 80%', end: 'bottom top', onToggle: s => (s.isActive ? tl.play() : tl.pause()) });
  }, []);

  return (
    <div className="aix-demo ui" data-tool={tool} aria-hidden="true" ref={ref}>
      <div className="ad-bar">
        <span className="ad-tool"><BrandIcon name={tool} />{tool}<small>· your AI builder</small></span>
        <span className="ad-conn on"><i></i><span className="c0">Connecting…</span><span className="c1">Using your link</span></span>
      </div>
      <div className="ad-chat">
        <div className="msg me"><span className="typed"></span></div>
        <div className="ad-think"><i></i><i></i><i></i></div>
        <div className="ad-steps">{AI_BOT_STEPS.map(t => <span className="ads" key={t}><b>✓</b>{t.replace(/^✓\s*/, '')}</span>)}</div>
        <div className="ad-table">
          <div className="atr h"><i>dish</i><i>price</i><i>veg</i></div>
          {AI_MENU.map(([dish, p], i) => <div className={'atr r' + i} key={dish}><i>{dish}</i><i className="pr">{p}</i><i>●</i></div>)}
        </div>
        <div className="ad-edit"><i>✎</i><span>You changed <b>Avocado toast</b> in buildfree</span><em>$9 → $10</em></div>
      </div>
    </div>
  );
}

export default function AiBuilders() {
  const [tool, setTool] = useState(AI_TOOLS[0]);
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.utils.toArray('.aix-t>*').forEach(el => gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: el, start: 'top 90%' } }));
  });

  return (
    <section className="aix" id="ai" ref={ref}>
      <div className="wrap">
        <div className="aix-panel">
          <div className="aix-t">
            <p className="kicker">Works with AI builders</p>
            <h2 className="display md">Give your AI app <em>real data.</em></h2>
            <p className="sec-p">AI builders make beautiful screens full of fake data. Paste your buildfree link into the prompt and your app loads your real products, posts and forms. Edit content in buildfree; the app updates. No backend for the AI to invent.</p>
            <ol className="ai-steps">{AI_STEPS.map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}</ol>
            <ul className="aitools" aria-label="Pick your AI builder">
              {AI_TOOLS.map(t => <li key={t}><button type="button" aria-pressed={tool === t} onClick={() => setTool(t)}><Brand name={t} /></button></li>)}
            </ul>
          </div>
          <AiDemo tool={tool} />
        </div>
      </div>
    </section>
  );
}
