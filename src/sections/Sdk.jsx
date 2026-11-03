import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Pill from '../components/ui/Pill';
import Tabs from '../components/ui/Tabs';
import NpmChip from '../components/ui/NpmChip';
import { useGsap } from '../hooks/useGsap';
import { useCopy } from '../hooks/useCopy';
import { highlight } from '../lib/highlight';
import { anim, gsap, E } from '../lib/motion';
import { NPM_URL, sdkSamples } from '../data/sdk';

const SAMPLES = sdkSamples();
const TABS = Object.entries(SAMPLES).map(([id, s]) => ({ id, label: s.label }));
const FACTS = [
  'Four methods: getRecords, getRecord, getForm, submitForm',
  'Your API key stays on your server, in an environment variable',
  'MIT licensed and published on npm',
];

// For developers: the whole SDK in three tabs of code. Tabs swap the sample with a short fade.
export default function Sdk() {
  const [tab, setTab] = useState('read');
  const sample = SAMPLES[tab];
  const [copied, copy] = useCopy(sample.code);
  const html = useMemo(() => highlight(sample.code), [sample]);
  const pre = useRef(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (anim) gsap.fromTo(pre.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .45, ease: E });
  }, [tab]);

  const ref = useGsap(() => {
    if (!anim) return;
    gsap.from('.sdk-t>*', { y: 26, opacity: 0, duration: 1, stagger: .08, ease: E, scrollTrigger: { trigger: '.sdk-t', start: 'top 85%' } });
    gsap.from('.sdk-card', { y: 50, opacity: 0, duration: 1.2, ease: E, scrollTrigger: { trigger: '.sdk-card', start: 'top 88%' } });
  });

  return (
    <section className="sdk" id="sdk" ref={ref}>
      <div className="wrap sdk-g">
        <div className="sdk-t">
          <p className="kicker">For developers</p>
          <h2 className="display md">Prefer code? <em>One package.</em></h2>
          <p className="sec-p">Install the SDK, paste your key, and your collections and forms are a function call away. No endpoints to remember, no headers to set.</p>
          <ul className="sdk-facts">{FACTS.map(f => <li key={f}>{f}</li>)}</ul>
          <NpmChip />
          <div className="cta">
            <Pill href="/docs/#connect/node">See the Node.js guide</Pill>
            <a className="tlink" href={NPM_URL} target="_blank" rel="noreferrer">Package page on npm</a>
          </div>
        </div>

        <div className="sdk-card ui">
          <Tabs tabs={TABS} value={tab} onChange={setTab} label="SDK examples" className="sdk-tabs" />
          <div className="sdk-code">
            <div className="sdk-bar"><code>{sample.file}</code><button type="button" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button></div>
            <pre ref={pre} tabIndex={0}><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
          </div>
        </div>
      </div>
    </section>
  );
}
