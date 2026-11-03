// Marks copy that still needs sign-off, e.g. <Placeholder /> → "[confirm]".
export default function Placeholder({ children = '[confirm]' }) {
  return <span className="ph">{children}</span>;
}
