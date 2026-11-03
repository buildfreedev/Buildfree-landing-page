import { APP_URL } from '../../lib/format';

/**
 * The rounded call-to-action button with an arrow.
 *   <Pill>Start free</Pill>                → links to the app
 *   <Pill variant="sm ghost" icon="↓" …>   → extra classes, custom icon
 */
export default function Pill({ children, href = APP_URL, variant = '', icon = '→', className = '', ...rest }) {
  const cls = ['pill', variant, className].filter(Boolean).join(' ');
  return (
    <a className={cls} href={href} {...rest}>
      <span>{children}</span>
      <i aria-hidden="true">{icon}</i>
    </a>
  );
}
