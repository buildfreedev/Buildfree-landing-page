import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/motion';

/**
 * Runs GSAP code scoped to a component and cleans it up on unmount.
 *
 *   const ref = useGsap(() => { gsap.from('.card', { y: 40 }); });
 *   return <section ref={ref}>…</section>;
 *
 * Selector strings inside the callback only match elements inside `ref`,
 * and every tween / ScrollTrigger it creates is reverted on cleanup
 * (which also makes it safe under React StrictMode's double effects).
 * The callback may return its own cleanup function.
 */
export function useGsap(setup, deps = []) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    let cleanup;
    const ctx = gsap.context(() => { cleanup = setup(scope.current); }, scope);
    return () => { cleanup?.(); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}
