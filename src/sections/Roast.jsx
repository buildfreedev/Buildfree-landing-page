import BMark from '../components/ui/BMark';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap } from '../lib/motion';

// Seven sticky notes, one per tool in the "usual" stack. Each has a tiny
// illustration (`mini`) and a caption (`nt`). Pure decoration.
function Notes() {
  return (
    <div className="notes" aria-hidden="true">
      <span className="note n1 c-lime">
        <span className="mini term"><i className="tl"><b></b><b></b><b></b></i><code>$ db migrate</code><code>0042_add_size… <em>99%</em></code><span className="bar"><i></i></span><code className="dim">est. 3h left</code></span>
        <span className="nt"><b>Database</b>"just one more migration"</span>
      </span>
      <span className="note n2 c-pink">
        <span className="mini mail"><span className="mr"><i className="d"></i>New submission<em>9:41</em></span><span className="mr hot"><i className="d"></i>Invoice · Pro plan<em>$</em></span><span className="mr"><i className="d"></i>New submission<em>9:12</em></span></span>
        <span className="nt"><b>Form tool</b>a second bill, for an inbox</span>
      </span>
      <span className="note n3 c-orange">
        <span className="mini pager"><span className="pt">ALERT · SUN 03:12</span><b>api-prod is down</b><span className="pb"><em>Acknowledge</em><em className="g">Snooze</em></span></span>
        <span className="nt"><b>Server</b>who's on call this Sunday?</span>
      </span>
      <span className="note n4 c-violet">
        <span className="mini set"><span className="sr">Webhooks<i className="t on"></i></span><span className="sr">Locales<i className="t"></i></span><span className="sr">Draft mode<i className="t on"></i></span><span className="sr dim">+ 44 more screens</span></span>
        <span className="nt"><b>Headless CMS</b>47 settings screens later…</span>
      </span>
      <span className="note n5 c-yellow">
        <span className="mini sheet"><span className="h"><i></i><i>A</i><i>B</i><i>C</i></span><span><i>999</i><i>Tote</i><i>12</i><i>✓</i></span><span><i>1,000</i><i>Shirt</i><i>24</i><i>✓</i></span><span className="r"><i>1,001</i><i>#REF!</i><i>#REF!</i><i>✗</i></span></span>
        <span className="nt"><b>Spreadsheet DB</b>works great until row 1,001</span>
      </span>
      <span className="note n6 c-cyan">
        <span className="mini bill"><span className="bt">MONTHLY BILL</span><span className="br">Storage<em>$4.20</em></span><span className="br">Database<em>$38.00</em></span><span className="br">Data transfer<em>$61.40</em></span><span className="br tot">Total<em>↑ 380%</em></span></span>
        <span className="nt"><b>Cloud console</b>check the bill. Sit down first.</span>
      </span>
      <span className="note n7 c-blue">
        <span className="mini plug"><span className="pr">SEO Pro<em>v2.1</em></span><span className="pr x">Cache+<em>conflict</em></span><span className="pr">Forms Lite<em>update</em></span></span>
        <span className="nt"><b>Plugins</b>the 9th one broke the 3rd</span>
      </span>
    </div>
  );
}

// Pinned while scrolling: notes drift in, then collapse into the one buildfree card.
export default function Roast() {
  const ref = useGsap(root => {
    if (!anim) return;
    const notes = gsap.utils.toArray('.note');
    // Pass the section element itself: scoped selectors only see its children.
    const tally = root.querySelector('.tally b');
    gsap.timeline({
      scrollTrigger: {
        trigger: root, start: 'top top', end: '+=140%', pin: '.roast-pin', scrub: .6,
        // Counts the stack down from 7 tools to 1 as the notes fold into the card.
        onUpdate: s => { tally.textContent = 7 - Math.round(gsap.utils.clamp(0, 1, (s.progress - .55) / .4) * 6); },
      },
    })
      .from(notes, { opacity: 0, scale: .85, y: i => (i % 2 ? 160 : -160), x: i => (i % 2 ? 120 : -120), stagger: .05, duration: .5, ease: 'power2.out' })
      .from('.roast-c>*:not(.one)', { opacity: 0, y: 30, stagger: .06, duration: .3 }, .1)
      .to(notes, {
        x: (i, el) => { const r = el.getBoundingClientRect(); return innerWidth / 2 - (r.left + r.width / 2); },
        y: (i, el) => { const r = el.getBoundingClientRect(); return innerHeight * .7 - (r.top + r.height / 2); },
        scale: .2, opacity: 0, rotate: 0, stagger: .03, duration: .5, ease: 'power3.in',
      }, .9)
      .from('.one', { scale: .6, opacity: 0, duration: .35, ease: 'back.out(1.6)' }, 1.3);
  });

  return (
    <section className="roast" id="roast" ref={ref}>
      <div className="roast-pin">
        <Notes />
        <div className="roast-c">
          <p className="kicker light">The usual way</p>
          <h2 className="display md">Five tools. Five bills. <em>One very long weekend.</em></h2>
          <p className="roast-p">Or one back office that does the boring bits, and gets out of your way.</p>
          <div className="one ui">
            <BMark />
            <div><b>buildfree</b><small>content · forms · API keys · team</small></div>
            <span className="tag live">● one login</span>
          </div>
        </div>
        <p className="tally" aria-hidden="true">Tools in your stack <b>7</b></p>
      </div>
    </section>
  );
}
