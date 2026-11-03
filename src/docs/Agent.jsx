import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Pill from '../components/ui/Pill';
import Tabs from '../components/ui/Tabs';
import { useGsap } from '../hooks/useGsap';
import { useCopy } from '../hooks/useCopy';
import { esc } from '../lib/format';
import { anim, gsap, ScrollTrigger, E } from '../lib/motion';
import { Code, Cmd, Note, Table, DoDont, H3 } from './blocks';
import { AI_TOOLS, PROMPTS, AI_RULES, AI_FILE_URL } from './content/website';
import { AGENT_TOOLS, STYLES, STUDIO_DEFAULTS, buildPrompt, setupSection, personalise } from './content/agent';

// The AI-agent path: a small looping demo for the start page, and the full page.

const FILE_URL = location.origin + AI_FILE_URL;

// BUILDFREE.md itself is the single source: fetched, so the preview and the download never differ.
const useMd = () => {
  const [text, setText] = useState('');
  useEffect(() => {
    fetch(AI_FILE_URL).then(r => (r.ok ? r.text() : '')).then(setText).catch(() => {});
  }, []);
  return text;
};

const mdHtml = md => esc(md)
  .replace(/^(#{1,3} .*)$/gm, '<span class="k">$1</span>')
  .replace(/`([^`\n]+)`/g, '<span class="s">`$1`</span>');

const download = (name, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const DEMO_PROMPT = 'Read BUILDFREE.md first, then build my bakery site.';
const DEMO_STEPS = ['Read BUILDFREE.md', 'Fetched 4 products from buildfree', 'Built the shop page and contact form', 'Kept the API key on the server'];

// A fake agent session that types the prompt and ticks off what it did. Loops while on screen.
function AgentDemo() {
  const ref = useGsap(root => {
    const typed = root.querySelector('.typed');
    if (!anim) { typed.textContent = DEMO_PROMPT; return; }
    const steps = gsap.utils.toArray('.stp', root);
    const o = { n: 0 };
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.4 })
      .call(() => { typed.textContent = ''; o.n = 0; })
      .set(steps, { opacity: 0, x: -10 })
      .set('.dx-doc', { opacity: 0, y: 10 })
      .to('.dx-doc', { opacity: 1, y: 0, duration: .6, ease: E }, .4)
      .to(o, { n: DEMO_PROMPT.length, duration: 2, ease: 'none', onUpdate: () => { typed.textContent = DEMO_PROMPT.slice(0, Math.round(o.n)); } }, 1.2)
      .to(steps, { opacity: 1, x: 0, stagger: .55, duration: .5, ease: E }, 3.5)
      .to({}, { duration: 3 });
    ScrollTrigger.create({ trigger: root, start: 'top 85%', end: 'bottom top', onToggle: s => (s.isActive ? tl.play() : tl.pause()) });
  });

  return (
    <div className="dx-term" aria-hidden="true" ref={ref}>
      <div className="tbar"><i></i><i></i><i></i><span>Your AI agent</span></div>
      <div className="body">
        <span className="dx-doc"><b>↓</b>BUILDFREE.md<small>attached</small></span>
        <p className="you"><b>You</b><span className="typed"></span></p>
        <ul>{DEMO_STEPS.map(s => <li className="stp" key={s}><i>✓</i>{s}</li>)}</ul>
      </div>
    </div>
  );
}

// Start page, path 2: the idea in one glance.
export function AgentTeaser({ go }) {
  const [copied, copy] = useCopy(DEMO_PROMPT);
  return (
    <section className="dx-teaser" id="path-ai" aria-labelledby="dx-ai-h">
      <div className="txt">
        <p className="kicker light">Path 2 · AI agent</p>
        <h2 className="dx-qh" id="dx-ai-h">Give your agent one file. <em>It does the rest.</em></h2>
        <p>BUILDFREE.md teaches any AI coding tool how buildfree works: the addresses, the replies, the payment flow and the safety rules. Hand it over, say what you want, and watch it build.</p>
        <ol>
          <li><span>1</span>Download BUILDFREE.md</li>
          <li><span>2</span>Drop it in your project or attach it to your chat</li>
          <li><span>3</span>Say what to build</li>
        </ol>
        <div className="cta">
          <Pill href={AI_FILE_URL} download="BUILDFREE.md" icon="↓" variant="light">Download BUILDFREE.md</Pill>
          <button type="button" className="ghostb" onClick={copy}>{copied ? 'Copied ✓' : 'Copy a starter prompt'}</button>
          <button type="button" className="tlink light" onClick={() => go('ai')}>Full AI guide</button>
        </div>
      </div>
      <AgentDemo />
    </section>
  );
}

// ---------- the full page ----------

const Field = ({ label, children, wide }) => <label className={wide ? 'wide' : undefined}>{label}{children}</label>;

export function UseAi({ go }) {
  const md = useMd();
  const [v, setV] = useState(STUDIO_DEFAULTS);
  const [toolId, setToolId] = useState(AGENT_TOOLS[0].id);
  const [promptId, setPromptId] = useState(0);
  const set = k => e => setV(s => ({ ...s, [k]: e.target.value }));
  const clean = k => e => setV(s => ({ ...s, [k]: e.target.value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+/, '') }));

  const tool = AGENT_TOOLS.find(t => t.id === toolId);
  const prompt = useMemo(() => buildPrompt(v), [v]);
  const mine = useMemo(() => (md ? personalise(md, v) : ''), [md, v]);
  const preview = useMemo(() => mdHtml(md || 'Loading BUILDFREE.md…'), [md]);
  const [copiedMd, copyMd] = useCopy(md);
  const [copiedPrompt, copyPrompt] = useCopy(prompt);
  const lines = md ? md.split('\n').length : 74;
  const kb = md ? (new Blob([md]).size / 1024).toFixed(1) : '4.1';

  // Panels fade in when you switch tabs (not on first load).
  const toolPanel = useRef(null), promptPanel = useRef(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (anim) gsap.fromTo(toolPanel.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, ease: E });
  }, [toolId]);
  const firstP = useRef(true);
  useLayoutEffect(() => {
    if (firstP.current) { firstP.current = false; return; }
    if (anim) gsap.fromTo(promptPanel.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, ease: E });
  }, [promptId]);

  const toolTabs = AGENT_TOOLS.map(t => ({ id: t.id, label: t.label, brand: t.brand }));
  const promptTabs = PROMPTS.map((p, i) => ({ id: String(i), label: p.title }));
  const picked = PROMPTS[promptId];

  return (
    <>
      <header className="dx-head">
        <p className="kicker">Path 2 · AI agent</p>
        <h1 className="dx-title">Let your AI agent <em>build it for you.</em></h1>
        <p className="dx-intro">Give your agent one file and one message. It learns how buildfree works, then writes the site while you watch. You stay in charge of the key; the agent never needs to see it.</p>
      </header>

      {/* the file */}
      <div className="dx-agent">
        <div className="dx-agent-t">
          <ol>
            <li><span>1</span><div><b>Download the file</b><small>It explains buildfree to the AI.</small></div></li>
            <li><span>2</span><div><b>Give it to your agent</b><small>Pick your tool below.</small></div></li>
            <li><span>3</span><div><b>Say what to build</b><small>Copy the message we write for you.</small></div></li>
          </ol>
          <div className="cta">
            <Pill href={AI_FILE_URL} download="BUILDFREE.md" icon="↓">Download BUILDFREE.md</Pill>
            <button type="button" className="tlink" onClick={copyMd}>{copiedMd ? 'Copied ✓' : 'Copy the whole file'}</button>
          </div>
        </div>
        <figure className="dx-md">
          <figcaption><i></i><i></i><i></i><span>BUILDFREE.md</span><small>{lines} lines · {kb} KB</small></figcaption>
          <pre tabIndex={0} data-lenis-prevent><code dangerouslySetInnerHTML={{ __html: preview }} /></pre>
        </figure>
      </div>

      {/* step 1: where the file goes */}
      <H3>1 · Give the file to your agent</H3>
      <Tabs className="dx-tabs" tabs={toolTabs} value={toolId} onChange={setToolId} label="Your AI tool" />
      <div className="dx-tool" ref={toolPanel} role="tabpanel">
        <div>
          <p className="dx-label"><span className="tag">Where it goes</span><code>{tool.where}</code></p>
          <ol className="dx-mini">{tool.steps.map((s, i) => <li key={i}><span>{i + 1}</span>{s}</li>)}</ol>
          {tool.cmd && <Cmd>{tool.cmd(FILE_URL)}</Cmd>}
        </div>
      </div>
      <Note type="warn">Keep your API key out of the chat. Put it in your .env file yourself. The agent only needs to know the file exists.</Note>

      {/* step 2: studio */}
      <H3>2 · Make it yours</H3>
      <p className="dx-sub">Type your own names. The message and the bottom of BUILDFREE.md rewrite themselves, so your agent never has to guess a field name.</p>
      <div className="dx-studio">
        <div className="dx-form">
          <Field label="Business name"><input value={v.business} onChange={set('business')} maxLength={50} /></Field>
          <Field label="What you sell"><input value={v.sells} onChange={set('sells')} maxLength={60} /></Field>
          <Field label="Project name (slug)"><input value={v.project} onChange={clean('project')} maxLength={50} spellCheck={false} /></Field>
          <Field label="Collection"><input value={v.collection} onChange={clean('collection')} maxLength={40} spellCheck={false} /></Field>
          <Field label="Collection fields" wide><input value={v.fields} onChange={set('fields')} maxLength={120} spellCheck={false} /></Field>
          <Field label="Form"><input value={v.form} onChange={clean('form')} maxLength={40} spellCheck={false} /></Field>
          <Field label="Form fields"><input value={v.formFields} onChange={set('formFields')} maxLength={120} spellCheck={false} /></Field>
          <Field label="Look and feel" wide>
            <select value={v.style} onChange={set('style')}>{STYLES.map(s => <option key={s}>{s}</option>)}</select>
          </Field>
        </div>
        <div className="dx-out">
          <Code title="BUILDFREE.md · your setup section" text={setupSection(v)} wrap />
          <button type="button" className="dx-big" disabled={!md} onClick={() => download('BUILDFREE.md', mine)}>
            <span aria-hidden="true">↓</span>Download my BUILDFREE.md<small>filled in with your names</small>
          </button>
        </div>
      </div>

      {/* step 3: the message */}
      <H3>3 · Tell your agent</H3>
      <Code wrap title="Send this after the file" text={prompt} />
      <div className="dx-row">
        <button type="button" className="dx-solid" onClick={copyPrompt}>{copiedPrompt ? 'Copied ✓' : 'Copy this message'}</button>
        <span>Tool can open links? Send one line instead:</span>
      </div>
      <Code wrap title="One line, for tools that can open links" text={`Read ${FILE_URL} and follow it, then build my site.`} />

      {/* more prompts */}
      <H3>More messages for later</H3>
      <p className="dx-sub">Change the words in [square brackets]. Send one at a time and test before the next.</p>
      <Tabs className="dx-tabs" tabs={promptTabs} value={String(promptId)} onChange={id => setPromptId(+id)} label="Ready-made messages" />
      <div ref={promptPanel} role="tabpanel">
        <p className="dx-label"><b>{picked.title}</b>· {picked.when}</p>
        <Code wrap title="Message" text={picked.text} />
      </div>

      <H3>Which kind of AI tool?</H3>
      <Table head={['Kind', 'Examples', 'Good for']} rows={AI_TOOLS} />
      <DoDont yes={AI_RULES.do} no={AI_RULES.dont} />

      {/* the other way */}
      <aside className="dx-alt">
        <div>
          <p className="kicker">Prefer to do it by hand?</p>
          <b>Two manual paths, both short.</b>
        </div>
        <div className="cta">
          <button type="button" className="dx-solid" onClick={() => go('account')}>Click-through guide</button>
          <button type="button" className="dx-ghost" onClick={() => go('connect/node')}>Code it with the SDK</button>
        </div>
      </aside>
    </>
  );
}
