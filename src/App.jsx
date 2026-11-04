import { useEffect, useState } from 'react';
import Nav from './components/layout/Nav';
import Dock from './components/layout/Dock';
import Hero from './sections/Hero';
import Logos from './sections/Logos';
import Manifesto from './sections/Manifesto';
import Roast from './sections/Roast';
import Stack from './sections/Stack';
import How from './sections/How';
import Playground from './sections/Playground';
import Sdk from './sections/Sdk';
import AiBuilders from './sections/AiBuilders';
import Who from './sections/Who';
import Tools from './sections/Tools';
import Lines from './sections/Lines';
import PricingTeaser from './sections/PricingTeaser';
import Fit from './sections/Fit';
import Final from './sections/Final';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { usePointerFx } from './hooks/usePointerFx';
import { ScrollTrigger } from './lib/motion';

// Temporary simple site. Set to false to bring back the full landing page below.
const TEMP_SITE = true;

export default function App() {
  return TEMP_SITE ? <TempSite /> : <FullSite />;
}

// The full landing page, top to bottom. Each section owns its markup, state and animation.
// Hidden while TEMP_SITE is on; nothing here was changed.
function FullSite() {
  useSmoothScroll();
  usePointerFx();

  // Pinned sections measure the page; re-measure once fonts load and on resize.
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    let t;
    const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 150); });
    ro.observe(document.getElementById('main'));
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Logos />
        <Manifesto />
        <Roast />
        <Stack />
        <How />
        <Playground />
        <Sdk />
        <AiBuilders />
        <Who />
        <Tools />
        <Lines />
        <PricingTeaser />
        <Fit />
        <Final />
      </main>
      <Dock />
    </>
  );
}

/* ===================== Temporary simple site ===================== */

const CONTACT = {
  name: 'Jaromthiyanesh',
  email: 'buildfreedev@gmail.com',
  phone: '+91 98943 77125',
  tel: '+919894377125',
  address: 'Pandian Street, Velachery, Chennai, Tamil Nadu 600042',
};

const SERVICES = [
  ['Websites', 'Website design and development', 'A fast, clean site that looks like the business you really are. Works on phones, tablets and desktops.'],
  ['Websites', 'Online stores', 'Product pages, orders and payments, set up so you can run the shop yourself.'],
  ['Back office', 'Content back office', 'Edit products, posts, prices and photos from one dashboard. No code needed after launch.'],
  ['Back office', 'Forms and enquiries', 'Contact, booking and order forms that land in one inbox you can check from your phone.'],
  ['Developers', 'Connect any site or AI builder', 'One link or our Node.js SDK hooks your content into React, Next.js, WordPress or sites made with AI tools.'],
  ['Support', 'Maintenance and support', 'Updates, fixes and content changes after launch, so your site stays safe and current.'],
];

const STEPS = [
  ['Tell us', 'Call, email or message us with what you need. We reply within one working day.'],
  ['Plan', 'We agree on pages, features, price and a launch date in writing before work starts.'],
  ['Build', 'You see progress as we go and can ask for changes along the way.'],
  ['Launch', 'We put the site live, show you how to update it, and stay on for support.'],
];

const TERMS = [
  ['Who we are', <>These terms cover the website and services of buildfree, run by {CONTACT.name} and based at {CONTACT.address}. "We", "us" and "our" mean buildfree. "You" means the person or business using our website or services. By using our website or services, you agree to these terms.</>],
  ['Our services', <>We provide website design and development, online stores, a content back office, forms, integrations and ongoing support. What we deliver for a project, and when, is set out in the quote or plan you accept.</>],
  ['Quotes and payment', <>Prices are in Indian rupees (₹) and are exclusive of applicable taxes unless stated. For projects we may ask for an advance before work begins, with the balance due before launch. Plans are billed in advance for each billing period. Payments are made through our listed payment methods or payment partners.</>],
  ['Cancellation and refunds', <>You can cancel a plan at any time; it stays active until the end of the period you have paid for, and is not renewed after that. Advances for project work already started are not refundable. If you are charged twice or charged in error, write to us at {CONTACT.email} and we will refund the extra amount to the original payment method within 7 working days of confirming it.</>],
  ['Your responsibilities', <>You agree to give us accurate information and the content we need on time, and to keep your login details safe. You must not use our services for anything unlawful, harmful or misleading, or to send spam or break the security of any system.</>],
  ['Your content and ownership', <>You keep ownership of the content, logos and data you give us. Once a project is fully paid, the website we build for you is yours. You give us permission to use your content only to provide the services.</>],
  ['Third-party services', <>Some features rely on others, such as domain registrars, hosting, payment gateways and email providers. Their own terms and fees apply, and we are not responsible for their outages or changes.</>],
  ['Availability', <>We work to keep our services running and your data safe, but we cannot promise they will be free of interruptions or errors. We may carry out maintenance or updates from time to time.</>],
  ['Limitation of liability', <>To the extent the law allows, we are not liable for indirect or consequential losses, such as lost profit or lost data. Our total liability for any claim is limited to the amount you paid us for the service in the three months before the claim.</>],
  ['Privacy', <>We collect only the details we need to provide and bill our services, such as your name, email, phone number and project content. We do not sell your personal information. We share it only with service providers who help us run the services, or when the law requires it.</>],
  ['Changes to these terms', <>We may update these terms. The latest version is always on this page with its date. If you keep using our services after a change, you accept the updated terms.</>],
  ['Governing law', <>These terms are governed by the laws of India. Any dispute is subject to the courts of Chennai, Tamil Nadu.</>],
  ['Contact', <>Questions about these terms? Email <a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a> or call <a href={'tel:' + CONTACT.tel}>{CONTACT.phone}</a>.</>],
];

// "#terms" opens the terms on their own; any other hash shows the home view.
const viewFromHash = () => (window.location.hash === '#terms' ? 'terms' : 'home');

function TempSite() {
  const [view, setView] = useState(viewFromHash);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = view === 'terms' ? 'Terms and conditions · buildfree' : 'buildfree · Websites, stores and back office';
    // Switching views: start the terms at the top; going home, jump to the section the link named.
    const target = view === 'home' && window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    const els = document.querySelectorAll('.tmp-rv');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [view]);

  const mail = 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent('Project enquiry');

  return (
    <div className="tmp">
      <style>{TEMP_CSS}</style>
      <a className="skip" href="#tmp-main">Skip to content</a>

      <header className="tmp-nav">
        <div className="tmp-w tmp-nav-in">
          <a href="#top" className="tmp-brand"><img src="/logo-mark.svg" alt="" width="22" height="25" />buildfree</a>
          <nav aria-label="Main">
            <a href="#services">Services</a>
            <a href="#process">How we work</a>
            <a href="#terms">Terms</a>
            <a href="#contact" className="tmp-nav-cta">Contact</a>
          </nav>
        </div>
      </header>

      {view === 'terms' ? (
      <main id="tmp-main">
        <section className="tmp-tpage">
          <div className="tmp-w tmp-terms">
            <div className="tmp-terms-h tmp-up">
              <a className="tmp-back" href="#top"><span aria-hidden="true">←</span> Back to home</a>
              <p className="tmp-k">Legal</p>
              <h1 className="tmp-h2">Terms and conditions</h1>
              <p className="tmp-date">Last updated 3 November 2026</p>
            </div>
            <ol className="tmp-tlist">
              {TERMS.map(([t, body], i) => (
                <li className="tmp-up" key={t} style={{ animationDelay: Math.min(i, 6) * .05 + .1 + 's' }}><h3>{t}</h3><p>{body}</p></li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      ) : (
      <main id="tmp-main">
        <section className="tmp-hero" id="top">
          <div className="tmp-w">
            <h1 className="tmp-h1 tmp-up">Your business is great.<br />Your website should <em>prove it.</em></h1>
            <p className="tmp-lede tmp-up" style={{ animationDelay: '.12s' }}>We design and build websites, online stores and simple back offices for small businesses, freelancers and creators in India.</p>
            <div className="tmp-cta tmp-up" style={{ animationDelay: '.22s' }}>
              <a className="tmp-btn" href={mail}>Tell us what you need <span aria-hidden="true">→</span></a>
              <a className="tmp-link" href="#services">See our services</a>
            </div>
          </div>
        </section>

        <section className="tmp-sec" id="services">
          <div className="tmp-w">
            <p className="tmp-k tmp-rv">Services</p>
            <h2 className="tmp-h2 tmp-rv">Whatever you need, <em>one team builds it.</em></h2>
            <div className="tmp-grid">
              {SERVICES.map(([tag, t, d], i) => (
                <article className="tmp-card tmp-rv" key={t} style={{ transitionDelay: (i % 3) * 70 + 'ms' }}>
                  <p className="tmp-tag"><span>{String(i + 1).padStart(2, '0')}</span>{tag}</p>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tmp-sec tmp-alt" id="process">
          <div className="tmp-w">
            <p className="tmp-k tmp-rv">How we work</p>
            <h2 className="tmp-h2 tmp-rv">Four steps, <em>no surprises.</em></h2>
            <ol className="tmp-steps">
              {STEPS.map(([t, d], i) => (
                <li className="tmp-rv" key={t} style={{ transitionDelay: i * 70 + 'ms' }}>
                  <span className="tmp-no">{i + 1}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="tmp-sec" id="contact">
          <div className="tmp-w tmp-contact tmp-rv">
            <div>
              <h2 className="tmp-h2">Have a project in mind? <em>Let's talk.</em></h2>
              <p className="tmp-lede">Tell us a little about your business and what you need. We reply within one working day.</p>
            </div>
            <ul className="tmp-ways">
              <li><small>Name</small><span>{CONTACT.name}</span></li>
              <li><small>Email</small><a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a></li>
              <li><small>Phone</small><a href={'tel:' + CONTACT.tel}>{CONTACT.phone}</a></li>
              <li><small>Address</small><span>{CONTACT.address}</span></li>
              <li className="tmp-ways-t"><a className="tmp-tbtn" href="#terms">Terms and conditions <span aria-hidden="true">→</span></a></li>
            </ul>
          </div>
        </section>
      </main>
      )}

      <footer className="tmp-foot">
        <div className="tmp-w">
          <div className="tmp-foot-top">
            <div>
              <a href="#top" className="tmp-brand"><img src="/logo-mark.svg" alt="" width="22" height="25" />buildfree</a>
              <p>Websites, online stores and back offices for growing businesses.</p>
            </div>
            <address className="tmp-foot-c">
              <b>{CONTACT.name}</b>
              <a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a>
              <a href={'tel:' + CONTACT.tel}>{CONTACT.phone}</a>
              <span>{CONTACT.address}</span>
              <a className="tmp-tbtn tmp-tbtn-d" href="#terms">Terms and conditions <span aria-hidden="true">→</span></a>
            </address>
          </div>
          <div className="tmp-foot-b">
            <span>© {new Date().getFullYear()} buildfree. All rights reserved....</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const TEMP_CSS = `
html{scroll-behavior:smooth}
.tmp{--w:1180px;background:#fff;color:var(--ink);min-height:100vh}
.tmp a{transition:color .25s,background .25s,border-color .25s,transform .35s var(--ease)}
.tmp-w{max-width:var(--w);margin:0 auto;padding:0 clamp(16px,5vw,48px)}
.tmp em{font-family:var(--serif);font-style:italic;font-weight:300;color:#3b3bd6}
.tmp-nav{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.tmp-nav-in{display:flex;align-items:center;justify-content:space-between;height:64px;gap:16px}
.tmp-brand{display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:19px;letter-spacing:-.02em}
.tmp-nav nav{display:flex;align-items:center;gap:clamp(12px,2.6vw,30px);font-size:15px}
.tmp-nav nav a:not(.tmp-nav-cta){color:var(--mute)}
.tmp-nav nav a:not(.tmp-nav-cta):hover{color:var(--ink)}
.tmp-nav-cta{background:var(--ink);color:#fff;padding:8px 16px;border-radius:99px}
.tmp-nav-cta:hover{background:#3b3bd6}
.tmp-hero{padding:clamp(64px,12vw,150px) 0 clamp(56px,9vw,110px)}
.tmp-h1{font-family:var(--serif);font-weight:300;font-size:clamp(42px,7.4vw,104px);line-height:1;letter-spacing:-.035em}
.tmp-h2{font-family:var(--serif);font-weight:300;font-size:clamp(32px,4.6vw,60px);line-height:1.05;letter-spacing:-.03em;max-width:18ch}
.tmp-lede{color:var(--ink2);font-size:clamp(17px,1.6vw,20px);max-width:52ch;margin-top:24px}
.tmp-cta{display:flex;flex-wrap:wrap;align-items:center;gap:14px 28px;margin-top:36px}
.tmp-btn{display:inline-flex;align-items:center;gap:10px;background:var(--ink);color:#fff;padding:16px 28px;border-radius:99px;font-weight:500}
.tmp-btn span{transition:transform .35s var(--ease)}
.tmp-btn:hover{background:#3b3bd6}.tmp-btn:hover span{transform:translateX(4px)}
.tmp-link{border-bottom:1px solid currentColor;padding-bottom:2px;font-weight:500}
.tmp-link:hover{color:#3b3bd6}
.tmp-sec{padding:clamp(64px,9vw,120px) 0;border-top:1px solid var(--line)}
.tmp-alt{background:#FAFAF8}
.tmp-k{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin-bottom:16px}
.tmp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
.tmp-card{border:1px solid var(--line);border-radius:20px;padding:28px;background:#fff;transition:opacity .8s var(--ease),transform .8s var(--ease),border-color .3s,box-shadow .4s}
.tmp-card:hover{border-color:rgba(20,20,19,.22);box-shadow:0 18px 40px -24px rgba(20,20,19,.25)}
.tmp-tag{display:flex;gap:10px;font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
.tmp-tag span{color:var(--ink)}
.tmp-card h3{font-size:21px;font-weight:600;letter-spacing:-.02em;margin:40px 0 10px}
.tmp-card p:last-child{color:var(--ink2);font-size:16px}
.tmp-steps{list-style:none;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:48px}
.tmp-steps li{border-top:1px solid var(--ink);padding-top:22px}
.tmp-no{font-family:var(--serif);font-size:44px;font-weight:300;line-height:1}
.tmp-steps h3{font-size:19px;font-weight:600;margin:18px 0 8px}
.tmp-steps p{color:var(--ink2);font-size:16px}
.tmp-contact{display:grid;grid-template-columns:1.2fr 1fr;gap:48px;align-items:end}
.tmp-ways{list-style:none;display:grid;gap:12px}
.tmp-ways li{display:grid;gap:2px;border:1px solid var(--line);border-radius:16px;padding:16px 20px}
.tmp-ways small{font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
.tmp-ways a,.tmp-ways span{font-size:18px;font-weight:500;overflow-wrap:anywhere}
.tmp-ways a:hover{color:#3b3bd6}
.tmp-ways-t{border:0!important;padding:4px 0 0!important}
.tmp-tbtn{display:inline-flex;align-items:center;gap:8px;justify-self:start;border:1px solid var(--ink);border-radius:99px;padding:10px 18px;font-size:15px!important;font-weight:500}
.tmp-tbtn span{transition:transform .35s var(--ease)}
.tmp-tbtn:hover{background:var(--ink);color:#fff!important}.tmp-tbtn:hover span{transform:translateX(4px)}
.tmp-tbtn-d{border-color:rgba(255,255,255,.4);margin-top:10px}
.tmp-tbtn-d:hover{background:#fff;color:var(--ink)!important}
.tmp-tpage{padding:clamp(48px,7vw,96px) 0 clamp(64px,9vw,120px)}
.tmp-back{display:inline-flex;gap:8px;color:var(--mute);font-size:15px;margin-bottom:36px}
.tmp-back:hover{color:var(--ink)}
.tmp-back span{transition:transform .35s var(--ease)}.tmp-back:hover span{transform:translateX(-4px)}
.tmp-terms{display:grid;grid-template-columns:1fr 1.7fr;gap:48px;align-items:start}
.tmp-terms-h{position:sticky;top:96px}
.tmp-date{color:var(--mute);font-size:15px;margin-top:16px}
.tmp-tlist{list-style:none;counter-reset:t;display:grid;gap:28px}
.tmp-tlist li{counter-increment:t;padding-bottom:28px;border-bottom:1px solid var(--line)}
.tmp-tlist li:last-child{border-bottom:0;padding-bottom:0}
.tmp-tlist h3{font-size:18px;font-weight:600;margin-bottom:8px}
.tmp-tlist h3::before{content:counter(t) ". ";color:var(--mute)}
.tmp-tlist p{color:var(--ink2);font-size:16px}
.tmp-tlist a{border-bottom:1px solid currentColor}
.tmp-foot{background:var(--ink);color:#fff;padding:64px 0 28px}
.tmp-foot-top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:32px}
.tmp-foot-top p{color:rgba(255,255,255,.6);margin-top:12px;max-width:34ch}
.tmp-foot .tmp-brand img{filter:brightness(0) invert(1)}
.tmp-foot-c{font-style:normal;display:grid;gap:8px;font-size:16px}
.tmp-foot-c a:hover{color:#9fdfe8}
.tmp-foot-c b{font-weight:600}
.tmp-foot-c span{color:rgba(255,255,255,.6)}
.tmp-foot-b{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-top:56px;padding-top:22px;border-top:1px solid rgba(255,255,255,.14);font-size:14px;color:rgba(255,255,255,.55)}
.tmp-foot-b a:hover{color:#fff}
@keyframes tmpUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.tmp-up{animation:tmpUp 1s var(--ease) both}
.tmp-rv{opacity:0;transform:translateY(24px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.tmp-rv.in{opacity:1;transform:none}
@media (max-width:900px){
  .tmp-grid{grid-template-columns:1fr 1fr}
  .tmp-steps{grid-template-columns:1fr 1fr;row-gap:32px}
  .tmp-contact,.tmp-terms{grid-template-columns:1fr;gap:32px}
  .tmp-terms-h{position:static}
}
@media (max-width:600px){
  .tmp-nav nav a:not(.tmp-nav-cta):not([href="#terms"]){display:none}
  .tmp-grid,.tmp-steps{grid-template-columns:1fr}
  .tmp-card h3{margin-top:28px}
  .tmp-btn{width:100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .tmp-up{animation:none}.tmp-rv{opacity:1;transform:none;transition:none}
}
`;
