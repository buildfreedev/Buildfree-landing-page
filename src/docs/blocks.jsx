import { useMemo, useState } from 'react';
import Pill from '../components/ui/Pill';
import Tabs from '../components/ui/Tabs';
import { esc } from '../lib/format';
import { highlight } from '../lib/highlight';
import { useCopy } from '../hooks/useCopy';

export { Tabs };

// Small building blocks shared by every page of the docs.

export const H3 = ({ children }) => <h3 className="dx-h">{children}</h3>;

export const Note = ({ type = 'tip', children }) => (
  <p className={'dx-note ' + type}>
    <i aria-hidden="true">{type === 'warn' ? '!' : 'i'}</i>
    <span><b>{type === 'warn' ? 'Good to know' : 'Tip'}</b>{children}</span>
  </p>
);

// A code or prompt box with a Copy button. `wrap` keeps long lines on screen (for prompts).
export const Code = ({ title, text, wrap = false }) => {
  const [copied, copy] = useCopy(text);
  const html = useMemo(() => (wrap ? esc(text) : highlight(text)), [text, wrap]);
  return (
    <figure className="dx-code">
      <figcaption><span>{title}</span><button type="button" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button></figcaption>
      <pre className={wrap ? 'wrap' : undefined} tabIndex={0}><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
    </figure>
  );
};

// One terminal command, ready to copy.
export const Cmd = ({ children }) => {
  const [copied, copy] = useCopy(children);
  return (
    <div className="dx-cmd">
      <span aria-hidden="true">&gt;</span>
      <code>{children}</code>
      <button type="button" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
    </div>
  );
};

export const KeyValue = ({ rows }) => (
  <dl className="dx-kv">
    {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
  </dl>
);

export const Table = ({ head, rows }) => (
  <div className="dx-tbl" data-lenis-prevent-wheel>
    <table>
      <thead><tr>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

// Numbered steps you can tick off as you go. Each: { title?, text, cmd?, check?, warn?, file? }.
// Plain strings are allowed too.
export const Steps = ({ steps }) => {
  const [done, setDone] = useState(() => new Set());
  const toggle = i => setDone(d => { const n = new Set(d); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <>
      <ol className="dx-steps">
        {steps.map((raw, i) => {
          const step = typeof raw === 'string' ? { text: raw } : raw;
          return (
            <li key={i} className={done.has(i) ? 'dx-step done' : 'dx-step'}>
              <button type="button" className="tick" aria-pressed={done.has(i)} aria-label={`Mark step ${i + 1} as done`} onClick={() => toggle(i)}>
                <span>{i + 1}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
              </button>
              <div className="body">
                {step.title && <p className="st">{step.title}</p>}
                <p className="tx">{step.text}</p>
                {step.file && <Code title={step.file.name} text={step.file.code} />}
                {step.cmd && <Cmd>{step.cmd}</Cmd>}
                {step.check && <p className="dx-check"><b>✓ Check</b>{step.check}</p>}
                {step.warn && <Note type="warn">{step.warn}</Note>}
              </div>
            </li>
          );
        })}
      </ol>
      {steps.length > 2 && <p className="dx-count" aria-live="polite">{done.size} of {steps.length} done</p>}
    </>
  );
};

// A download card (starter kit, AI instructions file).
export const Download = ({ href, file, title, sub, tone = 'butter' }) => (
  <a className={'dx-dl f-' + tone} href={href} download={file}>
    <span className="ic-box" aria-hidden="true">↓</span>
    <span><b>{title}</b><small>{sub}</small></span>
  </a>
);

// Opens buildfree itself (sign-up or sign-in) in a new tab.
export const OpenApp = ({ url, label, hint }) => (
  <div className="dx-open">
    <Pill href={url} target="_blank" rel="noreferrer" icon="↗">{label}</Pill>
    <p>{hint}</p>
    <code>{url}</code>
  </div>
);

// Two side-by-side lists: do / don't.
export const DoDont = ({ yes, no, yesTitle = 'Do', noTitle = "Don't" }) => (
  <div className="dx-dd">
    <div className="yes"><p>{yesTitle}</p><ul>{yes.map(t => <li key={t}>{t}</li>)}</ul></div>
    <div className="no"><p>{noTitle}</p><ul>{no.map(t => <li key={t}>{t}</li>)}</ul></div>
  </div>
);

// Small chips joined by arrows, e.g. Account → Project → Collection.
export const Flow = ({ items }) => (
  <div className="dx-flow">
    {items.map((t, i) => (
      <span key={i}>
        {t === '→' ? <em aria-hidden="true">→</em> : <b>{t}</b>}
      </span>
    ))}
  </div>
);
