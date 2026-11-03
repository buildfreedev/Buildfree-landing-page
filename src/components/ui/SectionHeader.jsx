// The kicker + big heading on the left, short paragraph on the right.
export default function SectionHeader({ kicker, title, children, light = false }) {
  return (
    <div className="sec-h">
      <div>
        <p className={light ? 'kicker light' : 'kicker'}>{kicker}</p>
        <h2 className="display md">{title}</h2>
      </div>
      <p className={light ? 'sec-p light' : 'sec-p'}>{children}</p>
    </div>
  );
}
