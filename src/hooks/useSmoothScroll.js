import { useEffect } from 'react';
import Lenis from 'lenis';
import { anim, gsap, ScrollTrigger } from '../lib/motion';

// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
// Also makes every in-page "#hash" link scroll smoothly.
export function useSmoothScroll() {
  useEffect(() => {
    let lenis;
    const raf = t => lenis.raf(t * 1000);
    if (anim) {
      lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 0.9, touchMultiplier: 1.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }
    window.__lenis = lenis;

    const onClick = e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(target, { duration: 1.4, offset: -20 }) : target.scrollIntoView();
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (lenis) { gsap.ticker.remove(raf); lenis.destroy(); }
    };
  }, []);
}
