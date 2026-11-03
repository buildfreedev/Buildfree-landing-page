import { useEffect, useMemo, useRef, useState } from 'react';
import Pill from '../../components/ui/Pill';
import { gsap, E } from '../../lib/motion';
import { esc, hlJSON } from '../../lib/format';
import { parse, sampleVal, snippet } from '../../lib/schema';
import { GEN_PRESETS } from '../../data/content';

const highlightCode = s => esc(s)
  .replace(/"(https:[^"]+)"/g, '"<span class="s">$1</span>"')
  .replace(/^(\s*\/\/ .*)$/gm, '<span class="c">$1</span>')
  .replace(/\b(const|await)\b/g, '<span class="k">$1</span>');

export default function ApiGenerator() {
  const [input, setInput] = useState('products with name, price, photo and in stock');
  const [query, setQuery] = useState(input);      // what the output is built from
  const [mode, setMode] = useState('json');       // 'json' | 'code'
  const [copyLabel, setCopyLabel] = useState('Copy');
  const out = useRef(null);

  // Typing updates the output after a short pause.
  useEffect(() => {
    const t = setTimeout(() => setQuery(input), 250);
    return () => clearTimeout(t);
  }, [input]);

  const { coll, fields } = useMemo(() => parse(query || ''), [query]);
  const text = useMemo(() => {
    if (mode === 'code') return snippet(coll, fields);
    const data = [0, 1].map(i => Object.fromEntries([['id', i + 1], ...fields.map(f => [f.name, sampleVal(f, i, coll)])]));
    return JSON.stringify({ data, count: data.length }, null, 2);
  }, [coll, fields, mode]);

  const generate = (q = input) => {
    setInput(q);
    setQuery(q);
    gsap.fromTo(out.current, { opacity: .3, y: 8 }, { opacity: 1, y: 0, duration: .5, ease: E });
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopyLabel('Copied ✓'); } catch { setCopyLabel('Select & copy'); }
    setTimeout(() => setCopyLabel('Copy'), 1600);
  };

  return (
    <div className="gen">
      <div className="gen-in">
        <label htmlFor="genQ">Describe what you want to store</label>
        <div className="inrow">
          <input id="genQ" value={input} autoComplete="off" onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} />
          <button className="pill sm" id="genGo" onClick={() => generate()}><span>Generate</span><i>→</i></button>
        </div>
        <div className="presets">
          <span>Try:</span>
          {GEN_PRESETS.map(([label, q]) => <button key={label} onClick={() => generate(q)}>{label}</button>)}
        </div>
        <p className="lbl">Collection <b>{coll}</b></p>
        <ul className="schema">{fields.map(f => <li key={f.name}><span>{f.name}</span><em>{f.type}</em></li>)}</ul>
      </div>
      <div className="gen-out ui">
        <div className="otabs">
          <button aria-pressed={mode === 'json'} onClick={() => setMode('json')}>Response</button>
          <button aria-pressed={mode === 'code'} onClick={() => setMode('code')}>Paste-in code</button>
          <button className="copyb" onClick={copy}>{copyLabel}</button>
        </div>
        <pre ref={out} dangerouslySetInnerHTML={{ __html: mode === 'json' ? hlJSON(text) : highlightCode(text) }} />
        <div className="gen-cta"><span>This is a preview. Make it a real, live link:</span><Pill variant="sm">Make it live, free</Pill></div>
      </div>
    </div>
  );
}
