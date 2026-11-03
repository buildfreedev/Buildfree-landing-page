import { useEffect } from 'react';
import { anim } from '../lib/motion';

const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Two pointer effects for the whole page, both delegated from the document:
//  - `.spot` cards get a soft light that follows the cursor (--mx / --my)
//  - `.pill` buttons lean a few pixels toward the cursor
export function usePointerFx() {
  useEffect(() => {
    if (!anim || !fine) return;
    let lean = null;

    const move = e => {
      const spot = e.target.closest('.spot');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', e.clientX - r.left + 'px');
        spot.style.setProperty('--my', e.clientY - r.top + 'px');
      }
      const pill = e.target.closest('.pill');
      if (pill) {
        const r = pill.getBoundingClientRect();
        pill.style.translate = `${(e.clientX - r.left - r.width / 2) * .12}px ${(e.clientY - r.top - r.height / 2) * .2}px`;
        lean = pill;
      } else if (lean) {
        lean.style.translate = '';
        lean = null;
      }
    };

    document.addEventListener('pointermove', move, { passive: true });
    return () => document.removeEventListener('pointermove', move);
  }, []);
}
