import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Pill from '../components/ui/Pill';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';
import { JOBS, HIDDEN, WEEKEND, USD_INR, HOUR_DEFAULT } from '../data/diy';
import { PLANS } from '../data/content';
import { createSky } from './sky';

const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const PRO = PLANS.find(p => p.id === 'pro');
const PRO_MONTH = Number(PRO.price.replace(/\D/g, ''));
const WEEKEND_HOURS = 16;

// A number that counts to its new value instead of jumping.
function Count({ value, format }) {
  const el = useRef(null);
  const shown = useRef({ v: value });
  useLayoutEffect(() => {
    const t = gsap.to(shown.current, { v: value, duration: anim ? .6 : 0, ease: E, onUpdate: () => { el.current.textContent = format(shown.current.v); } });
    return () => t.kill();
  }, [value, format]);
  return <span ref={el}>{format(value)}</span>;
}

const usd = n => '$' + Math.round(n);
const hrs = n => (Math.round(n * 2) / 2).toString();

// Pick the tools you'd use for each job; the ledger adds up money and time.
function Calculator() {
  const [picks, setPicks] = useState(() => Object.fromEntries(JOBS.map(j => [j.id, 0])));
  const [rate, setRate] = useState(HOUR_DEFAULT);

  const chosen = JOBS.filter(j => picks[j.id] >= 0).map(j => ({ job: j, opt: j.options[picks[j.id]] }));
  const monthUsd = chosen.reduce((s, c) => s + (c.opt.usd || 0), 0);
  const usage = chosen.filter(c => c.opt.usd === null).length;
  const setup = chosen.reduce((s, c) => s + c.job.setup, 0);
  const upkeep = chosen.reduce((s, c) => s + c.job.upkeep, 0);
  const monthInr = monthUsd * USD_INR;
  const yearDiy = monthInr * 12 + setup * rate + upkeep * rate * 12;
  const yearUs = PRO_MONTH * 12;
  const saved = yearDiy - yearUs;

  return (
    <div className="calc2">
      <div className="calc2-jobs">
        {JOBS.map(j => {
          const cur = picks[j.id];
          return (
            <div key={j.id} className={cur < 0 ? 'job off' : 'job'}>
              <div className="job-h">
                <div><b>{j.job}</b><small>{j.plain}</small></div>
                <button type="button" className="job-skip" aria-pressed={cur < 0} onClick={() => setPicks(p => ({ ...p, [j.id]: cur < 0 ? 0 : -1 }))}>
                  {cur < 0 ? 'Add back' : "Don't need it"}
                </button>
              </div>
              <div className="job-opts" role="radiogroup" aria-label={j.job}>
                {j.options.map((o, k) => (
                  <button key={o.name} type="button" role="radio" aria-checked={cur === k} disabled={cur < 0}
                    onClick={() => setPicks(p => ({ ...p, [j.id]: k }))}>
                    {o.name}<em>{o.usd === null ? 'usage' : `$${o.usd}/mo`}</em>
                  </button>
                ))}
              </div>
              {cur >= 0 && <p className="job-note">{j.options[cur].note}</p>}
            </div>
          );
        })}
      </div>

      <aside className="ledger" aria-live="polite">
        <p className="ledger-k">The usual way, every month</p>
        <div className="ledger-big">
          <Count value={monthUsd} format={usd} /><small> / month</small>
          {usage > 0 && <span className="ledger-plus">+ {usage} pay-as-you-go bill{usage > 1 ? 's' : ''}</span>}
        </div>
        <p className="ledger-inr">≈ <Count value={monthInr} format={inr} /> a month, in dollars</p>
        <ul className="ledger-rows">
          <li><span>Setting it up</span><b><Count value={setup} format={hrs} /> hours</b><small>≈ {Math.max(1, Math.round(setup / WEEKEND_HOURS * 10) / 10)} weekends</small></li>
          <li><span>Keeping it running</span><b><Count value={upkeep} format={hrs} /> hours / month</b><small>updates, fixes, alerts</small></li>
          <li><span>Dashboards to check</span><b>{chosen.length}</b><small>{chosen.length} logins, {chosen.length} bills</small></li>
        </ul>
        <label className="ledger-rate">Your hour is worth <output>{inr(rate)}</output>
          <input type="range" min="100" max="3000" step="100" value={rate} onChange={e => setRate(+e.target.value)} />
        </label>
        <div className="ledger-cmp">
          <div><small>First year, doing it yourself</small><b><Count value={yearDiy} format={inr} /></b><span>bills + your time</span></div>
          <div className="us"><small>First year on {PRO.name}</small><b>{inr(yearUs)}</b><span>{PRO.price} a month, in rupees</span></div>
        </div>
        <p className="ledger-save">
          {saved > 0 ? <>You keep about <b><Count value={saved} format={inr} /></b> and every weekend.</> : <>Cheaper on paper. Still {hrs(setup)} hours of setup, and the 3 a.m. alerts are yours.</>}
        </p>
        <Pill variant="light">Start free</Pill>
      </aside>
    </div>
  );
}

// Deterministic "random" numbers, so the stars and windows don't jump between renders.
const rand = seed => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const CITY = (() => {
  const r = rand(11), out = [];
  for (let x = 0; x < 600;) {
    const w = 26 + Math.floor(r() * 46), h = 40 + Math.floor(r() * 90);
    const wins = [];
    for (let wy = 600 - h + 10; wy < 590; wy += 12) for (let wx = x + 6; wx < x + w - 8; wx += 10) if (r() < .22) wins.push([wx, wy, r() < .12]);
    out.push({ x, w, h, wins });
    x += w + 2;
  }
  return out;
})();

// A live WebGL sky behind a card; it only animates while the card is on screen.
function useSky(kind) {
  const ref = useRef(null);
  useEffect(() => {
    const sky = createSky(ref.current, kind);
    if (!sky) return;
    sky.resize();
    if (!anim) { sky.once(); return () => sky.dispose(); }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? sky.start() : sky.stop()));
    io.observe(ref.current);
    const ro = new ResizeObserver(() => sky.resize());
    ro.observe(ref.current);
    return () => { io.disconnect(); ro.disconnect(); sky.dispose(); };
  }, [kind]);
  return ref;
}

// The night: moonlit clouds and stars over a sleeping city. One window is still lit, and
// a red warning light blinks on the tallest tower.
function NightSky() {
  const gl = useSky('night');
  const tall = CITY.reduce((a, b) => (b.h > a.h ? b : a));
  return (
    <div className="sky night-sky" aria-hidden="true">
      <canvas className="sky-gl" ref={gl}></canvas>
      <span className="shoot"></span>
      <svg className="city" viewBox="0 460 600 140" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2240" /><stop offset="1" stopColor="#060914" /></linearGradient>
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#26305a" stopOpacity="0" /><stop offset="1" stopColor="#26305a" stopOpacity=".55" /></linearGradient>
        </defs>
        <path className="far" d="M0 600V540h30v-20h24v30h40v-44h22v24h36v-30h18v40h50v-26h30v36h44v-50h20v30h40v-22h36v40h34v-30h26v20h40v-36h22v50h68v62z" />
        <rect x="0" y="520" width="600" height="80" fill="url(#mist)" />
        {CITY.map(b => (
          <g key={b.x}>
            <rect x={b.x} y={600 - b.h} width={b.w} height={b.h} fill="url(#bldg)" />
            {b.w > 50 && <rect x={b.x + b.w / 2 - 6} y={600 - b.h - 6} width="12" height="6" fill="#0b1022" />}
            {b.wins.map(([wx, wy, on]) => <rect key={wx + '-' + wy} className={on ? 'wnd on' : 'wnd'} x={wx} y={wy} width="4" height="5" />)}
          </g>
        ))}
        <line x1={tall.x + tall.w / 2} y1={600 - tall.h} x2={tall.x + tall.w / 2} y2={600 - tall.h - 18} stroke="#0b1022" strokeWidth="2" />
        <circle className="beacon" cx={tall.x + tall.w / 2} cy={600 - tall.h - 19} r="2.4" />
        <rect className="wnd you" x="312" y="548" width="5" height="6" />
      </svg>
    </div>
  );
}

// The day: a bright sky with drifting clouds over hazy far hills and green fields.
function DaySky() {
  const gl = useSky('day');
  return (
    <div className="sky day-sky" aria-hidden="true">
      <canvas className="sky-gl" ref={gl}></canvas>
      <svg className="birds" viewBox="0 0 60 20"><path d="M2 10q5-6 10 0q5-6 10 0M34 6q4-5 8 0q4-5 8 0" /></svg>
      <svg className="hills" viewBox="0 0 600 140" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="hfar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fbfc4" /><stop offset="1" stopColor="#b9d1c6" /></linearGradient>
          <linearGradient id="hmid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fbf6e" /><stop offset="1" stopColor="#6fa052" /></linearGradient>
          <linearGradient id="hnear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f9a45" /><stop offset="1" stopColor="#3f7430" /></linearGradient>
        </defs>
        <path fill="url(#hfar)" d="M0 140V60C60 44 110 30 170 42S280 70 340 52 470 20 600 40v100z" />
        <path fill="url(#hmid)" d="M0 140V84C80 56 170 60 250 76S420 104 600 66v74z" />
        <path fill="url(#hnear)" d="M0 140V108C120 82 220 92 320 106S500 122 600 100v40z" />
        <g className="trees">
          <ellipse cx="90" cy="96" rx="12" ry="14" /><rect x="88" y="104" width="4" height="10" />
          <ellipse cx="112" cy="100" rx="8" ry="10" /><rect x="110" y="104" width="3" height="9" />
          <ellipse cx="468" cy="100" rx="11" ry="13" /><rect x="466" y="108" width="4" height="9" />
          <ellipse cx="300" cy="74" rx="5" ry="6" opacity=".55" /><ellipse cx="312" cy="73" rx="4" ry="5" opacity=".55" />
        </g>
      </svg>
    </div>
  );
}

const Phone = () => (
  <svg className="buzz" viewBox="0 0 16 24" aria-hidden="true"><rect x="2" y="1" width="12" height="22" rx="3" /><circle cx="8" cy="19" r="1.2" /></svg>
);

function Weekend() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.utils.toArray('.wk-col').forEach(col => gsap.from(col.querySelectorAll('li'), { y: 24, opacity: 0, duration: .8, stagger: .12, ease: E, scrollTrigger: { trigger: col, start: 'top 75%', once: true } }));
  });
  return (
    <div className="wk" ref={ref}>
      <div className="wk-col night">
        <NightSky />
        <div className="wk-body">
          <p className="wk-h">The usual way<small>Fri night → Monday</small></p>
          <ol>
            {WEEKEND.diy.map(([t, d]) => {
              const alarm = t.startsWith('Sun 3');
              return <li key={t} className={alarm ? 'alarm' : undefined}><time>{t}{alarm && <Phone />}</time><p>{d}</p></li>;
            })}
          </ol>
        </div>
      </div>
      <div className="wk-col day">
        <DaySky />
        <div className="wk-body">
          <p className="wk-h">With buildfree<small>Fri night → Monday</small></p>
          <ol>{WEEKEND.buildfree.map(([t, d]) => <li key={t}><time>{t}</time><p>{d}</p></li>)}</ol>
        </div>
      </div>
    </div>
  );
}

export default function Diy() {
  const ref = useGsap(() => {
    if (!anim) return;
    gsap.utils.toArray('.diy-h>*, .hidden-g>div').forEach(el => gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  });

  return (
    <section className="diy-s" id="diy" ref={ref}>
      <div className="wrap">
        <div className="diy-h">
          <p className="kicker">Compared with doing it yourself</p>
          <h2 className="display md">Free tiers end. <em>Lost weekends don't come back.</em></h2>
          <p className="sec-p">To show products, take messages and let your team in, the usual way stitches together a database, a server, file storage, a form tool and logins. Pick what you'd use and see what it really costs.</p>
        </div>
        <Calculator />

        <div className="diy-h sub">
          <p className="kicker">Your weekend, both ways</p>
          <h2 className="display md">Same site. <em>Very different Sunday.</em></h2>
        </div>
        <Weekend />

        <div className="diy-h sub">
          <p className="kicker">What the price tags leave out</p>
          <h2 className="display md">The costs nobody <em>puts on the bill.</em></h2>
        </div>
        <div className="hidden-g">
          {HIDDEN.map((h, k) => <div key={h.t} className="spot"><span>{String(k + 1).padStart(2, '0')}</span><b>{h.t}</b><p>{h.d}</p></div>)}
        </div>
        <p className="fine">Tool prices are the cheapest paid monthly tier on each provider's pricing page (checked November 2026), before tax, converted at about ₹{USD_INR} per $1. Hours are our rough estimate for a first-timer. Your numbers will differ.</p>
      </div>
    </section>
  );
}
