import { useLayoutEffect, useRef, useState } from 'react';
import Pill from '../../components/ui/Pill';
import { gsap, E } from '../../lib/motion';
import { QUIZ } from '../../data/content';

const RESULTS = {
  fit: { title: <>buildfree is a <em>great fit.</em></>, text: 'You need content, forms and a link, not a server. You can be live today, free.' },
  mid: { title: <>buildfree now, <em>a developer later.</em></>, text: 'Start simple with buildfree for content and forms. If you outgrow it, a developer can add custom logic alongside.' },
  no: { title: <>You need a <em>full backend platform.</em></>, text: "For user accounts, realtime and heavy logic, Supabase, Firebase or your own server fit better. Honest answer. buildfree can still run your marketing site's content and forms." },
};

// "Do I need a backend?" — three questions, a score, an honest answer.
export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const el = useRef(null);

  // Fade each new question / the result in.
  useLayoutEffect(() => {
    const tween = gsap.fromTo(el.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, ease: E });
    return () => tween.kill();
  }, [index]);

  const answer = v => { setScore(s => s + v); setIndex(i => i + 1); };
  const restart = () => { setScore(0); setIndex(0); };
  const done = index >= QUIZ.length;

  if (!done) {
    const [question, options] = QUIZ[index];
    return (
      <div className="quiz" ref={el}>
        <div className="qbar"><i style={{ width: `${(index / QUIZ.length) * 100}%` }}></i></div>
        <p className="kicker">Question {index + 1} of {QUIZ.length}</p>
        <h3>{question}</h3>
        <div className="qopts">
          {options.map(([label, sub, v]) => <button key={label} onClick={() => answer(v)}>{label}{sub && <small>{sub}</small>}</button>)}
        </div>
      </div>
    );
  }

  const key = score >= 7 ? 'fit' : score >= 4 ? 'mid' : 'no';
  const r = RESULTS[key];
  return (
    <div className="quiz" ref={el}>
      <div className="qbar"><i style={{ width: '100%' }}></i></div>
      <div className="qres">
        <p className="kicker">Your answer</p>
        <p className="big">{r.title}</p>
        <p>{r.text}</p>
        <div className="cta">
          {key !== 'no' && <Pill>Start free</Pill>}
          <button className="tlink" onClick={restart}>Take it again</button>
        </div>
      </div>
    </div>
  );
}
