// Turns "products with name, price and photo" into a collection + typed fields,
// and makes plausible sample values for the API generator.
import { slug, CUR } from './format';

// [pattern, label shown in the schema, internal kind]
const TYPES = [
  [/price|cost|amount|fee|salary/, 'number', 'price'], [/image|photo|picture|cover|logo|thumbnail|avatar/, 'image', 'image'],
  [/date|day|when|deadline/, 'date', 'date'], [/time|hour|slot/, 'time', 'time'], [/email/, 'email', 'email'],
  [/phone|mobile|whatsapp/, 'phone', 'phone'], [/body|content|description|bio|notes?|message|quote|details/, 'long text', 'text'],
  [/rating|stars|score/, '1–5', 'rating'], [/url|link|website/, 'url', 'url'],
  [/status|published|active|available|in stock|in_stock|veg/, 'yes/no', 'bool'],
  [/category|tag|type|role|size|color|colour/, 'choice', 'choice'], [/qty|quantity|stock|count|guests|people/, 'number', 'int'],
];

export function parse(q) {
  q = q.toLowerCase().trim();
  let [coll, rest = ''] = q.split(/\s+(?:with|having|that have|:)\s+/);
  coll = slug((coll || 'items').replace(/^(a|an|the|my|list of|some)\s+/, '')) || 'items';
  let fields = rest.split(/,|&|\band\b|\+|\//).map(s => s.trim()).filter(Boolean)
    .map(f => slug(f.replace(/^(a|an|the)\s+/, ''))).filter(Boolean);
  if (!fields.length) fields = ['title', 'description', 'image'];
  if (!fields.some(f => /name|title/.test(f))) fields.unshift('title');
  fields = [...new Set(fields)].slice(0, 10);
  return {
    coll,
    fields: fields.map(f => {
      const t = TYPES.find(([r]) => r.test(f.replace(/_/g, ' ')));
      return { name: f, type: t ? t[1] : 'text', k: t ? t[2] : 'str' };
    }),
  };
}

const SAMPLE = { products: ['Linen shirt', 'Canvas tote'], blog_posts: ['Hello world', 'Our first month'], bookings: ['Emma S.', 'Daniel K.'], menu_items: ['Avocado toast', 'Cold brew'], testimonials: ['Aiko T.', 'Marco R.'] };

export function sampleVal(f, i, coll) {
  const n = SAMPLE[coll] || ['Item one', 'Item two'];
  switch (f.k) {
    case 'price': return [24, 12][i];
    case 'image': return `https://cdn.example.com/${coll}-${i + 1}.jpg`;
    case 'date': return ['2026-10-20', '2026-10-24'][i];
    case 'time': return ['18:30', '12:00'][i];
    case 'email': return ['emma@example.com', 'dan@example.com'][i];
    case 'phone': return ['+44 20 7946 0958', '+1 415 555 0134'][i];
    case 'text': return ['Soft, breathable and made to last.', 'Short and sweet.'][i];
    case 'rating': return [5, 4][i];
    case 'url': return 'https://example.com';
    case 'bool': return [true, false][i];
    case 'choice': return ['featured', 'new'][i];
    case 'int': return [2, 4][i];
    default: return /name|title/.test(f.name) ? n[i] : `${f.name.replace(/_/g, ' ')} ${i + 1}`;
  }
}

// The "Paste-in code" snippet for a parsed schema.
export function snippet(coll, fields) {
  const url = `https://api.buildfree.dev/my-site/${coll}`;
  const f0 = fields[0].name, img = fields.find(f => f.k === 'image'), pr = fields.find(f => f.k === 'price');
  return `// Paste into your site (React, Next.js or plain JS)\nconst res = await fetch("${url}");\nconst { data } = await res.json();\n\ndocument.querySelector("#list").innerHTML = data.map(item => \`\n  <article>\n    ${img ? `<img src="\${item.${img.name}}" alt="">\n    ` : ''}<h3>\${item.${f0}}</h3>${pr ? `\n    <p>${CUR.sym}\${item.${pr.name}}</p>` : ''}\n  </article>\`).join("");`;
}
