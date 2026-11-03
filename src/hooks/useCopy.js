import { useState } from 'react';

// Copies `text` to the clipboard; `copied` stays true for a moment so the button can say "Copied".
export const useCopy = text => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { return; }
    setTimeout(() => setCopied(false), 1600);
  };
  return [copied, copy];
};
