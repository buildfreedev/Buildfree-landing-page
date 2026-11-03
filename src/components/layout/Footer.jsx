import Logo from '../ui/Logo';
import { APP_URL } from '../../lib/format';
import { NPM_URL } from '../../data/sdk';

export default function Footer({ page = 'home' }) {
  const base = page === 'home' ? '' : '/';
  return (
    <footer className="foot wrap">
      <Logo home={page === 'home' ? '#top' : '/'} />
      <nav>
        <a href={base + '#how'}>How it works</a>
        <a href="/pricing/">Pricing</a>
        <a href="/docs/">Docs</a>
        <a href={NPM_URL} target="_blank" rel="noreferrer">npm</a>
        <a href={APP_URL}>Log in</a>
        <a href="#top">Back to top ↑</a>
      </nav>
      <small>© 2026 buildfree.dev · Product names and logos are trademarks of their owners; no affiliation or endorsement implied.</small>
    </footer>
  );
}
