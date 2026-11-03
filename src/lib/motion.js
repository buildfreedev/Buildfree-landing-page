// Shared animation setup: one place to register GSAP plugins and read motion flags.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const mobile = matchMedia('(max-width: 860px)').matches;
// ?static in the URL turns every animation off (handy for screenshots).
export const STATIC = new URLSearchParams(location.search).has('static');
if (STATIC) document.documentElement.classList.add('static');

export const anim = !reduced && !STATIC;
export const E = 'power3.out';

export { gsap, ScrollTrigger };
