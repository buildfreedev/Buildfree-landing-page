// "Hand it to your AI agent": where BUILDFREE.md goes in each tool, and what to say first.
// Each tool: how it picks the file up (steps), an optional terminal line (`cmd(url)`),
// and the first message to send.

export const AGENT_TOOLS = [
  {
    id: 'claude-code', label: 'Claude Code', brand: 'Claude', where: 'CLAUDE.md in your project folder',
    steps: [
      'Open a terminal in your project folder and save the file as CLAUDE.md. Claude Code reads that name every time it starts in the folder.',
      'Create your .env file yourself (BUILDFREE_URL and BUILDFREE_KEY). The agent never needs to see the key.',
      'Start Claude Code and send the message below.',
    ],
    cmd: url => `curl -o CLAUDE.md ${url}`,
  },
  {
    id: 'cursor', label: 'Cursor', brand: 'Cursor', where: 'BUILDFREE.md in your project folder',
    steps: [
      'Save the file in your project folder.',
      'In the Cursor chat, type @BUILDFREE.md so the file is attached to your message.',
      'Create your .env file yourself, then send the message below.',
    ],
    cmd: url => `curl -O ${url}`,
  },
  {
    id: 'chat', label: 'ChatGPT · Claude · Gemini', where: 'Attached to your first message',
    steps: [
      'Open a new chat and attach BUILDFREE.md with the paperclip (or paste its text if your plan cannot attach files).',
      'Send the message below as your first message.',
      'Copy the files it writes into your project, and keep your key in .env. Never paste the key into the chat.',
    ],
  },
  {
    id: 'copilot', label: 'GitHub Copilot', where: '.github/copilot-instructions.md',
    steps: [
      'Save the file as .github/copilot-instructions.md in your repository. Copilot loads it as project instructions.',
      'Open Copilot Chat in your editor.',
      'Send the message below.',
    ],
    cmd: url => `mkdir -p .github && curl -o .github/copilot-instructions.md ${url}`,
  },
  {
    id: 'builders', label: 'Lovable · Bolt · v0', brand: 'v0', where: 'Pasted into your first prompt',
    steps: [
      'Open your project and paste the contents of BUILDFREE.md at the start of your first prompt (or into its Knowledge / Project instructions, if your plan has them).',
      'Add the message below underneath.',
      'Add your key as a secret or environment variable in the builder, never in the prompt.',
    ],
  },
  {
    id: 'any', label: 'Any other agent', where: 'AGENTS.md in your project folder',
    steps: [
      'Many coding agents read a file called AGENTS.md from the project folder. Save the file with that name.',
      'If yours does not, attach the file or paste it into the chat.',
      'Send the message below.',
    ],
    cmd: url => `curl -o AGENTS.md ${url}`,
  },
];

export const STYLES = ['warm and friendly', 'modern and minimal', 'bold and playful', 'elegant and calm'];

export const STUDIO_DEFAULTS = {
  business: 'Sweet Crumbs Bakery',
  sells: 'cakes and cookies',
  project: 'sweet-crumbs-website',
  collection: 'products',
  fields: 'name, price, photo, in_stock',
  form: 'contact-form',
  formFields: 'name, email, occasion, message',
  style: STYLES[0],
};

export const MD_MARK = "## This project's BuildFree setup";

// The prompt you send after the agent has the file.
export const buildPrompt = v => `Read BUILDFREE.md first and follow its rules.

Build a website for ${v.business}, which sells ${v.sells}.

- Show every entry of my buildfree collection "${v.collection}" as cards. Its fields are: ${v.fields}. Use these names exactly as written.
- Add a contact form that sends to my buildfree form "${v.form}". Its fields are: ${v.formFields}.
- Keep my API key on the server. Read BUILDFREE_URL and BUILDFREE_KEY from .env and never put them in the browser.
- Make it ${v.style} and work well on phones.

My .env file already exists. Do not ask me for the key. When you are done, tell me in simple words how to start the site.`;

// The filled-in bottom section of BUILDFREE.md (the part the site owner is meant to complete).
export const setupSection = v => `${MD_MARK}

(The site owner filled this in. The API key is NOT here: it lives in .env.)

- Project: \`${v.project}\`
- BASE address: \`https://.../api/v1/public/${v.project}\` (the real address is BUILDFREE_URL in .env)
- Collections and their fields:
  - \`${v.collection}\`: ${v.fields}
- Forms and their fields:
  - \`${v.form}\`: ${v.formFields}
- Payments: not connected yet
`;

// Keep what is above the setup section and swap in the filled-in one.
export const personalise = (md, v) => {
  const i = md.indexOf(MD_MARK);
  return (i >= 0 ? md.slice(0, i) : md.trimEnd() + '\n\n') + setupSection(v);
};
