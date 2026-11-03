import { useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import { useGsap } from '../hooks/useGsap';
import { anim, gsap, E } from '../lib/motion';
import { CUR, hlJSON } from '../lib/format';
import { PLAYGROUND_PRODUCTS } from '../data/content';

const price = n => CUR.sym + Number(n).toLocaleString(CUR.loc);

// Left: editable rows. Edits flow up via onChange.
function Editor({ products, onChange, onReset, dirty }) {
  return (
    <div className="pg-ed ui">
      <div className="pg-h"><div><small>Collection</small><h4>products</h4></div><span className="pg-act"><button className="mini-btn" onClick={onReset} disabled={!dirty}>Reset</button><span className="tag live">● Live</span></span></div>
      <div className="pg-rows">
        {products.map((p, i) => (
          <div className="pg-row" key={i}>
            <img src={p.img} alt="" width="48" height="60" loading="lazy" />
            <input aria-label="Name" value={p.name} maxLength={28} onChange={e => onChange(i, { name: e.target.value })} />
            <label className="pr">
              <span>{CUR.sym}</span>
              <input aria-label="Price" inputMode="numeric" maxLength={6} value={p.price}
                onChange={e => onChange(i, { price: e.target.value.replace(/\D/g, '') })} />
            </label>
            <button className={p.stock ? 'tog on' : 'tog'} aria-label="In stock" aria-pressed={p.stock}
              onClick={() => onChange(i, { stock: !p.stock })}><i></i></button>
          </div>
        ))}
      </div>
      <p className="pg-tip">Tip: click a name or price and type.</p>
    </div>
  );
}

// Middle: the JSON the API would return. The last-edited item flashes.
function JsonPreview({ products, lastEdit }) {
  const pre = useRef(null);
  const html = useMemo(() => {
    const data = products.map((p, i) => ({
      id: i + 1, name: p.name || ' ', price: +p.price || 0, currency: 'USD',
      photo: p.img.replace('/img/', 'https://cdn.buildfree.dev/my-shop/'), in_stock: p.stock,
    }));
    let out = hlJSON(JSON.stringify({ data }, null, 2));
    if (lastEdit >= 0) {
      const parts = out.split(/(?=\{\n\s+<span class="k">"id")/);
      if (parts[lastEdit + 1]) parts[lastEdit + 1] = '<span class="flash">' + parts[lastEdit + 1].replace(/\}(,?)\n/, '}</span>$1\n');
      out = parts.join('');
    }
    return out;
  }, [products, lastEdit]);

  // Remove the highlight right away; the CSS transition fades it out.
  useEffect(() => {
    const t = setTimeout(() => pre.current?.querySelector('.flash')?.classList.remove('flash'), 60);
    return () => clearTimeout(t);
  }, [html]);

  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText('https://api.buildfree.dev/my-shop/products').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="pg-json ui code">
      <div className="ph-h"><small>GET</small><code>/my-shop/products</code><button className="mini-btn dark" onClick={copy}>{copied ? 'Copied ✓' : 'Copy link'}</button><span className="tag live">200</span></div>
      <pre ref={pre} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

// Right: a phone showing the shop built from the same data.
function ShopPhone({ products }) {
  const [cart, setCart] = useState(0);
  const [bump, setBump] = useState(false);
  const add = () => { setCart(n => n + 1); setBump(true); setTimeout(() => setBump(false), 300); };

  return (
    <div className="pg-shop">
      <div className="phone pg-phone">
        <div className="ph-top"><b>my-shop</b><span className={bump ? 'cart bump' : 'cart'}>Bag · {cart}</span></div>
        <div className="pg-grid">
          {products.map((p, i) => (
            <div key={i} className={p.stock ? 'pcard' : 'pcard out'}>
              <span className="so">SOLD OUT</span>
              <img src={p.img} alt={p.name} width="64" height="80" loading="lazy" />
              <div><b>{p.name || ' '}</b><small>{price(+p.price || 0)}</small><br /><button onClick={add}>{p.stock ? 'Add to bag' : 'Sold out'}</button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// One piece of state (`products`) feeds all three panels — the core idea of the section.
export default function Playground() {
  const [products, setProducts] = useState(PLAYGROUND_PRODUCTS);
  const [lastEdit, setLastEdit] = useState(-1);

  const update = (i, patch) => {
    setProducts(ps => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));
    setLastEdit(i);
  };

  const reset = () => { setProducts(PLAYGROUND_PRODUCTS); setLastEdit(-1); };

  const ref = useGsap(() => {
    if (anim) gsap.from('.sec-h', { y: 26, opacity: 0, duration: 1, ease: E, scrollTrigger: { trigger: '.sec-h', start: 'top 90%' } });
  });

  return (
    <section className="play" id="play" ref={ref}>
      <div className="wrap">
        <SectionHeader kicker="Try it right here" title={<>Change it here. <em>See it everywhere.</em></>}>
          Rename a product, change a price, mark it sold out. The link and the shop update instantly, just like the real thing.
        </SectionHeader>
        <div className="pg">
          <Editor products={products} onChange={update} onReset={reset} dirty={JSON.stringify(products) !== JSON.stringify(PLAYGROUND_PRODUCTS)} />
          <JsonPreview products={products} lastEdit={lastEdit} />
          <ShopPhone products={products} />
        </div>
        <p className="fine center">Runs in your browser with sample products. Photos from Pexels.</p>
      </div>
    </section>
  );
}
