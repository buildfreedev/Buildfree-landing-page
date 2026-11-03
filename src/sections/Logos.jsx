import { Brand } from '../components/ui/BrandIcon';
import { WORKS_WITH } from '../data/content';

// A slow marquee: the list is rendered twice and the track slides by half its width.
// Pauses on hover; the second copy is hidden from screen readers.
export default function Logos() {
  return (
    <section className="logos" aria-label="Works with">
      <div className="wrap">
        <p className="logos-k">Works with anything that can load a link</p>
      </div>
      <div className="marq">
        <ul className="lgrow">
          {[0, 1].map(copy => WORKS_WITH.map(name => (
            <li key={copy + name} aria-hidden={copy ? 'true' : undefined}><Brand name={name} wrapLabel /></li>
          )))}
        </ul>
      </div>
    </section>
  );
}
