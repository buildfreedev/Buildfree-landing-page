import { useLayoutEffect, useRef } from 'react';
import BrandIcon from './BrandIcon';

// Pill-style tabs with a dark thumb that slides under the selected one (same idea as the free-tools tabs).
export default function Tabs({ tabs, value, onChange, label, className = '' }) {
  const thumb = useRef(null);
  const buttons = useRef({});

  useLayoutEffect(() => {
    const place = () => {
      const b = buttons.current[value];
      thumb.current.style.transform = `translateX(${b.offsetLeft}px)`;
      thumb.current.style.width = b.offsetWidth + 'px';
    };
    place();
    document.fonts.ready.then(place);
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [value]);

  const onKeyDown = e => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    const i = tabs.findIndex(t => t.id === value);
    const next = tabs[(i + dir + tabs.length) % tabs.length].id;
    onChange(next);
    buttons.current[next].focus();
  };

  return (
    <div className={'ttabs ' + className} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      <span className="tthumb" ref={thumb} aria-hidden="true"></span>
      {tabs.map(t => (
        <button key={t.id} role="tab" aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1}
          ref={el => (buttons.current[t.id] = el)} onClick={() => onChange(t.id)}>
          {t.brand && <BrandIcon name={t.brand} />}{t.label}
        </button>
      ))}
    </div>
  );
}
