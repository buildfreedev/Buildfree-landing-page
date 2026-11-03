import { useRef, useState } from 'react';
import Pill from '../components/ui/Pill';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';
import { HOW_STEPS, INBOX } from '../data/content';

// ---- The four product "screens" in the card stack ----

function CollectionEditor() {
  return (
    <div className="ui panel editor">
      <div className="ph-h"><small>New collection</small><h4>products</h4></div>
      <ul className="fields">
        <li><span>name</span><em>Text</em></li>
        <li><span>price</span><em>Number</em></li>
        <li><span>photo</span><em>Image</em></li>
        <li><span>in_stock</span><em>Yes / No</em></li>
        <li className="add">+ Add field</li>
      </ul>
      <span className="btn-dark">Create collection</span>
    </div>
  );
}

function EntryForm() {
  return (
    <div className="ui panel entry">
      <div className="ph-h"><small>products › new</small><h4>Denim jeans</h4></div>
      <label>Name<span className="inp">Denim jeans</span></label>
      <div className="two"><label>Price<span className="inp">$32</span></label><label>In stock<span className="tog on"><i></i></span></label></div>
      <label>Photo URL<span className="drop"><img className="thumb" src="/img/jeans.webp" alt="" width="44" height="55" loading="lazy" />https://…/jeans.webp</span></label>
      <div className="row-end"><span className="tag draft">Draft</span><span className="btn-dark">Publish</span></div>
    </div>
  );
}

function ApiAndPhone() {
  return (
    <div className="feat-v duo">
      <div className="ui panel code">
        <div className="ph-h"><small>GET</small><code>/my-shop/products</code><span className="tag live">200</span></div>
        <pre>{'{\n  '}<span className="k">"data"</span>{': [\n    { '}<span className="k">"name"</span>{': '}<span className="s">"Linen shirt"</span>{',\n      '}<span className="k">"price"</span>{': '}<span className="n">24</span>{',\n      '}<span className="k">"in_stock"</span>{': '}<span className="n">true</span>{' },\n    { '}<span className="k">"name"</span>{': '}<span className="s">"Denim jeans"</span>{', … }\n  ]\n}'}</pre>
      </div>
      <div className="ui phone">
        <div className="ph-top"><b>my-shop</b><span>☰</span></div>
        <div className="prod"><img className="pimg" src="/img/shirt.webp" alt="Linen shirt" loading="lazy" width="480" height="600" /><b>Linen shirt</b><small>$24</small></div>
        <div className="prod"><img className="pimg" src="/img/jeans.webp" alt="Denim jeans" loading="lazy" width="480" height="600" /><b>Denim jeans</b><small>$32</small></div>
      </div>
    </div>
  );
}

function Inbox() {
  return (
    <div className="ui panel inbox">
      <div className="ph-h"><small>Forms</small><h4>contact <span className="cnt">38</span></h4></div>
      <ul className="mail">
        {INBOX.map(m => (
          <li key={m.name} className={m.unread ? 'unread' : undefined}>
            <span className={m.cls ? 'av ' + m.cls : 'av'}>{m.av}</span>
            <div><b>{m.name}</b><small>{m.msg}</small></div>
            <time>{m.time}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CARDS = [
  { k: 'k1 f-sage', label: "01 · Name it. Say what you're keeping.", Screen: CollectionEditor },
  { k: 'k2 f-butter', label: '02 · Fill it. Like a spreadsheet.', Screen: EntryForm },
  { k: 'k3 f-lilac', label: '03 · Paste it. One link, any site.', Screen: ApiAndPhone },
  { k: 'k4 f-blush', label: '04 · Hear back. Every form, one inbox.', Screen: Inbox },
];

// Pinned on desktop: cards fly off the top one at a time while the
// matching step on the left lights up.
export default function How() {
  const [step, setStep] = useState(0);
  const pin = useRef(null);

  const ref = useGsap(root => {
    if (!anim) return;
    const mm = gsap.matchMedia(root);

    mm.add('(min-width: 861px)', () => {
      const [k1, k2, k3, k4] = gsap.utils.toArray('.card');
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: '+=260%', pin: '.how-pin', scrub: .8,
          onUpdate: s => {
            setStep(Math.min(3, Math.floor(s.progress * 3.6)));
            root.querySelector('.steps').style.setProperty('--p', s.progress);
          },
        },
      });
      pin.current = tl.scrollTrigger;
      [[k1, [k2, k3, k4]], [k2, [k3, k4]], [k3, [k4]]].forEach(([out, rest], i) => {
        tl.to(out, { yPercent: -125, rotateX: 22, rotate: i % 2 ? 4 : -4, opacity: 0, duration: 1 }, i)
          .to(rest, { y: j => -22 * j, scale: j => 1 - .04 * j, duration: 1 }, i);
      });
      tl.to({}, { duration: .3 });
    });

    mm.add('(max-width: 860px)', () => {
      gsap.utils.toArray('.card').forEach(c => gsap.from(c, { y: 60, opacity: 0, duration: 1.1, ease: E, scrollTrigger: { trigger: c, start: 'top 88%' } }));
    });

    gsap.from('.stack', { y: 80, opacity: 0, duration: 1.3, ease: E, scrollTrigger: { trigger: root, start: 'top 75%' } });
    gsap.from('.tog i', { left: 3, scrollTrigger: { trigger: '.f-butter', start: 'top 40%' }, duration: .6, ease: E });
    gsap.utils.toArray('.how-t>*').forEach(el => gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: el, start: 'top 90%' } }));

    return () => { pin.current = null; mm.revert(); };
  });

  // Clicking a step scrolls the pinned stack to the matching card.
  const goTo = i => {
    const st = pin.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * Math.min(1, (i + .3) / 3.6);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="how" id="how" ref={ref}>
      <div className="how-pin">
        <div className="wrap how-g">
          <div className="how-t">
            <p className="kicker">How it works</p>
            <h2 className="display md">Idea to live link <em>in three moves.</em></h2>
            <ol className="steps">
              {HOW_STEPS.map((s, i) => (
                <li key={s.title} className={i === step ? 'on' : undefined}>
                  <button type="button" aria-current={i === step ? 'step' : undefined} onClick={() => goTo(i)}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <div><b>{s.title}</b><p>{s.text}</p></div>
                  </button>
                </li>
              ))}
            </ol>
            <Pill>Make my first link</Pill>
          </div>
          <div className="stack" aria-label="Product screens, illustrations with sample data">
            {CARDS.map(({ k, label, Screen }) => (
              <div key={k} data-step={label} className={'card ' + k}><Screen /></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
