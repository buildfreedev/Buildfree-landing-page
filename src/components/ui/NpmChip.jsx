import { useCopy } from '../../hooks/useCopy';
import { INSTALL_CMD } from '../../data/sdk';

// "npm install buildfree", copied in one click.
export default function NpmChip({ dark = false }) {
  const [copied, copy] = useCopy(INSTALL_CMD);
  return (
    <span className={dark ? 'npmchip dark' : 'npmchip'}>
      <button type="button" onClick={copy} aria-label={`Copy: ${INSTALL_CMD}`}>
        <i aria-hidden="true">$</i><code>{INSTALL_CMD}</code><span>{copied ? 'Copied ✓' : 'Copy'}</span>
      </button>
    </span>
  );
}
