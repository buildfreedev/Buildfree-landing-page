export const APP_URL = 'https://webzspot-cms.netlify.app';

export const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

export const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

// Wraps keys, strings and numbers of pretty-printed JSON in highlight spans.
export const hlJSON = s => esc(s)
  .replace(/("[^"]+")(\s*:)/g, '<span class="k">$1</span>$2')
  .replace(/:\s("[^"]*")/g, ': <span class="s">$1</span>')
  .replace(/:\s(-?\d+(\.\d+)?|true|false)/g, ': <span class="n">$1</span>');

export const CUR = {
  sym: '$', loc: 'en-US', rate: 40, host: 25, tool: 20,
  note: '*Estimate: dev hours × $40/hr + $25/mo hosting + $20/mo per extra tool. Your numbers will differ.',
};
export const money = n => CUR.sym + Math.round(n).toLocaleString(CUR.loc);
