import { esc } from './format';

// Colours comments, strings, tags and a few keywords. One pass, so a quote inside a comment stays a comment.
const TOKENS = /(^[ \t]*#[^\n]*|\/\/[^\n]*|&lt;!--[\s\S]*?--&gt;)|("(?:[^"\\\n]|\\.)*"|`[^`]*`)|(&lt;\/?[a-zA-Z][\w-]*)|\b(const|let|await|async|import|from|export|default|return|function|new|class|if|else|true|false)\b|\b(\d+(?:\.\d+)?)\b/gm;
export const highlight = text => esc(text).replace(TOKENS, (m, c, s, t, k, n) =>
  `<span class="${c ? 'c' : s ? 's' : t || k ? 'k' : 'n'}">${m}</span>`);
