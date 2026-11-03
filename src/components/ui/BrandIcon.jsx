import { BRAND_ICONS } from '../../data/brandIcons';

// Renders the brand mark for `name`, or nothing if we don't have one.
export default function BrandIcon({ name }) {
  const icon = BRAND_ICONS[name];
  if (!icon) return null;
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      <path fill={icon.fill} d={icon.d} />
    </svg>
  );
}

// A brand name with its icon in front, e.g. inside chips and logo rows.
export function Brand({ name, wrapLabel = false }) {
  return (
    <>
      <BrandIcon name={name} />
      {wrapLabel ? <span>{name}</span> : name}
    </>
  );
}
