import { useEffect, useRef, useState } from 'react';
import Logo from '../ui/Logo';
import Pill from '../ui/Pill';
import { APP_URL } from '../../lib/format';

const LINKS = [['how', 'How it works'], ['who', "Who it's for"], ['tools', 'Free tools']];

// Top bar: turns solid after a little scroll, hides when scrolling down,
// shows reading progress, marks the section you're in, and opens a menu on phones.
// On other pages (`page` is 'docs' or 'pricing') the section links point back to the home page.
export default function Nav({ page = 'home' }) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const bar = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = scrollY;
      setSolid(y > 30);
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > 120);
        lastY.current = y;
      }
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      // The last section whose top has passed the middle of the screen.
      let cur = '';
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * .5) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // Sticky things below the bar (table headers, side panels) read --nav-offset,
  // so they slide up into the gap when the bar hides and back down when it returns.
  const header = useRef(null);
  useEffect(() => {
    const h = hidden && !open ? 0 : header.current.offsetHeight;
    document.documentElement.style.setProperty('--nav-offset', h + 'px');
  }, [hidden, open]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const onKey = e => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  const base = page === 'home' ? '' : '/';
  const cls = ['nav', solid && 'solid', hidden && !open && 'hide', open && 'open'].filter(Boolean).join(' ');
  return (
    <header className={cls} id="nav" ref={header}>
      <Logo home={base + '#top'} />
      <nav className="links" aria-label="Main">
        {LINKS.map(([id, label]) => <a key={id} href={base + '#' + id} className={active === id ? 'on' : undefined}>{label}</a>)}
        <a href="/pricing/" className={page === 'pricing' ? 'on' : undefined}>Pricing</a>
        <a href="/docs/" className={page === 'docs' ? 'on' : undefined}>Docs</a>
      </nav>
      <div className="nav-r">
        <a className="login" href={APP_URL}>Log in</a>
        <Pill variant="sm">Start free</Pill>
        <button className="burger" aria-label="Menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}><i></i><i></i></button>
      </div>
      <div className="menu" id="menu" onClick={() => setOpen(false)}>
        {LINKS.map(([id, label], i) => <a key={id} href={base + '#' + id} style={{ '--i': i }}>{label}</a>)}
        <a href="/pricing/" style={{ '--i': LINKS.length }}>Pricing</a>
        <a href="/docs/" style={{ '--i': LINKS.length + 1 }}>Docs</a>
        <a href={APP_URL} style={{ '--i': LINKS.length + 2 }}>Log in</a>
      </div>
      <span className="progress" ref={bar} aria-hidden="true"></span>
    </header>
  );
}
