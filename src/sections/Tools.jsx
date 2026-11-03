import { useLayoutEffect, useRef, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import ApiGenerator from './tools/ApiGenerator';
import Quiz from './tools/Quiz';
import SavingsCalc from './tools/SavingsCalc';
import PromptPack from './tools/PromptPack';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';

const TABS = [
  { id: 'gen', label: 'API generator', Panel: ApiGenerator },
  { id: 'quiz', label: 'Do I need a backend?', Panel: Quiz },
  { id: 'calc', label: 'Savings calculator', Panel: SavingsCalc },
  { id: 'pack', label: 'AI prompt pack', Panel: PromptPack },
];

// Accessible tabs: click or ←/→ to switch. Panels stay mounted (just hidden)
// so each tool keeps its state when you come back to it.
export default function Tools() {
  const [active, setActive] = useState('gen');
  const buttons = useRef({});
  const panels = useRef({});
  const shown = useRef(active);
  const thumb = useRef(null);

  // The dark pill slides under whichever tab is selected.
  useLayoutEffect(() => {
    const place = () => {
      const b = buttons.current[active];
      thumb.current.style.transform = `translateX(${b.offsetLeft}px)`;
      thumb.current.style.width = b.offsetWidth + 'px';
    };
    place();
    document.fonts.ready.then(place);
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [active]);

  // Fade a panel in only when the tab actually changes (not on mount).
  useLayoutEffect(() => {
    if (shown.current === active) return;
    shown.current = active;
    gsap.fromTo(panels.current[active], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, ease: E });
  }, [active]);

  const onKeyDown = e => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    const i = TABS.findIndex(t => t.id === active);
    const next = TABS[(i + dir + TABS.length) % TABS.length].id;
    setActive(next);
    buttons.current[next].focus();
  };

  const ref = useGsap(() => {
    if (anim) gsap.from('.sec-h', { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: '.sec-h', start: 'top 90%' } });
  });

  return (
    <section className="tools" id="tools" ref={ref}>
      <div className="wrap">
        <SectionHeader kicker="Free tools · no sign-up" title={<>Don't take our word. <em>Take it for a spin.</em></>}>
          Four free tools. No sign-up, no email, no catch. If you like what comes out, make it live in one click.
        </SectionHeader>
        <div className="ttabs" role="tablist" aria-label="Free tools" onKeyDown={onKeyDown}>
          <span className="tthumb" ref={thumb} aria-hidden="true"></span>
          {TABS.map(t => (
            <button key={t.id} role="tab" id={'tb-' + t.id} aria-controls={'t-' + t.id} aria-selected={active === t.id}
              ref={el => (buttons.current[t.id] = el)} onClick={() => setActive(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="tpanels">
          {TABS.map(({ id, Panel }) => (
            <div key={id} className="tpanel" id={'t-' + id} role="tabpanel" aria-labelledby={'tb-' + id}
              hidden={active !== id} ref={el => (panels.current[id] = el)}>
              <Panel />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
