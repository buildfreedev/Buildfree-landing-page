import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, E } from '../../lib/motion';
import { CUR, money } from '../../lib/format';

function Slider({ label, value, display, onChange, ...range }) {
  return (
    <label>{label} <output>{display}</output>
      <input type="range" value={value} onChange={e => onChange(+e.target.value)} {...range} />
    </label>
  );
}

export default function SavingsCalc() {
  const [hrs, setHrs] = useState(40);
  const [tools, setTools] = useState(2);
  const [months, setMonths] = useState(12);
  const total = hrs * CUR.rate + (CUR.host + tools * CUR.tool) * months;

  // The number counts up/down and the bar grows; both tweened by GSAP.
  const bar = useRef(null), diy = useRef(null), keep = useRef(null);
  const shown = useRef({ v: 0 });
  const prevTotal = useRef(null);
  useLayoutEffect(() => {
    // First render (and StrictMode's repeat of it) sets the values instantly.
    const d = prevTotal.current === null || prevTotal.current === total ? 0 : 1;
    prevTotal.current = total;
    gsap.to(bar.current, { scaleX: Math.min(1, .25 + total / 8000), duration: .6 * d, ease: E });
    gsap.to(shown.current, {
      v: total, duration: .5 * d, overwrite: true, ease: E,
      onUpdate: () => { diy.current.textContent = keep.current.textContent = money(shown.current.v); },
    });
  }, [total]);

  return (
    <div className="calc">
      <div className="sliders">
        <Slider label="Developer hours to build it" min="5" max="120" value={hrs} onChange={setHrs} display={hrs + ' hrs'} />
        <Slider label="Extra tools you'd pay for" min="0" max="5" value={tools} onChange={setTools} display={tools} />
        <Slider label="Months running" min="1" max="24" value={months} onChange={setMonths} display={months + (months === 1 ? ' month' : ' months')} />
      </div>
      <div className="calc-r">
        <p className="kicker">Doing it yourself, roughly</p>
        <p className="diy" ref={diy}>—</p>
        <div className="bars">
          <div className="bar b1"><i ref={bar}></i><span>DIY</span></div>
          <div className="bar b2"><i></i><span>buildfree, free plan</span></div>
        </div>
        <p className="keep">You keep <b ref={keep}>—</b>*</p>
        <p className="fine">{CUR.note}</p>
      </div>
    </div>
  );
}
