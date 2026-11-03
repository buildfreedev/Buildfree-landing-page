import BMark from './BMark';

export default function Logo({ home = '#top' }) {
  return (
    <a className="logo" href={home} aria-label="buildfree home">
      <BMark />
      <span className="wm">build<span>free</span></span>
    </a>
  );
}
