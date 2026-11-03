import Pill from '../../components/ui/Pill';

export default function PromptPack() {
  return (
    <div className="pack">
      <div className="pack-cover ui">
        <small>Prompt pack · .md</small>
        <p className="display sm">Give your AI-built app <em>a real backend.</em></p>
        <span>7 copy-paste prompts</span>
      </div>
      <div>
        <h3>Copy-paste prompts for Lovable, Bolt, v0 and Cursor</h3>
        <p>Tell your AI builder exactly how to load products, save form entries and show blog posts from your buildfree links. Free, no email needed.</p>
        <Pill href="/buildfree-ai-prompt-pack.md" icon="↓" download>Download the pack</Pill>
      </div>
    </div>
  );
}
