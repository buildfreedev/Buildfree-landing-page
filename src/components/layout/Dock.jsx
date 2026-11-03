import { useEffect, useState } from 'react';
import Pill from '../ui/Pill';

// Floating "Start free" button. Shown after the hero, hidden over the
// free tools and pricing sections and once the final CTA is on screen.
export default function Dock() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = scrollY;
      const final = document.querySelector('.final');
      if (!final) return;
      const top = el => el.getBoundingClientRect().top + y;
      const over = id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const t = top(el);
        return y + innerHeight > t + 100 && y < t + el.offsetHeight - 100;
      };
      setOn(y > 600 && !over('tools') && !over('pricing') && y + innerHeight < top(final) + 100);
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return <Pill className={on ? 'dock on' : 'dock'} id="dock">Start free, no card</Pill>;
}
