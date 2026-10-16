// Shared page shell + helpers handed to every page module as `ctx`.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const APP = 'https://cognax.expentor.com';
const LOGIN = APP + '/login';

const ICONS = {
  naxie: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
  kb: '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z"/><path d="M8 7h6M8 11h6"/>',
  dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  pres: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/>',
  conn: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  auto: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h4a4 4 0 0 1 4 4v5"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/>',
};
const svg = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

const PRODUCTS = [
  { href: 'naxie.html', name: 'Naxie', blurb: 'Ask questions, get answers you can check', icon: 'naxie' },
  { href: 'knowledge-base.html', name: 'Knowledge Base', blurb: 'Files, folders and metadata in one place', icon: 'kb' },
  { href: 'dashboards.html', name: 'Dashboards', blurb: 'Source-backed reports in groups', icon: 'dash' },
  { href: 'presentations.html', name: 'Presentations', blurb: 'Decks generated from connected data', icon: 'pres' },
  { href: 'connections.html', name: 'Connections', blurb: 'Reusable data sources', icon: 'conn' },
  { href: 'automation.html', name: 'Data & Automation', blurb: 'Tables, prompts and docks', icon: 'auto' },
];

// Closing call-to-action band (the one dark block on a page).
const cta = (h, p, label = 'Request a demo', href = 'contact.html') => `
<section class="section" style="padding-bottom:0"><div class="wrap"><div class="cta-band" data-cta>
  <h2>${h}</h2><p>${p}</p>
  <div class="hero-actions"><a class="btn btn-primary btn-lg" href="${href}">${label}</a><a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a></div>
</div></div></section>`;

const ctx = { APP, LOGIN, svg, PRODUCTS, cta };

function layout({ file, title, desc, body }) {
  const base = file.replace(/\.html$/, '');
  const hasCss = fs.existsSync(path.join(ROOT, 'css', base + '.css'));
  const hasJs = fs.existsSync(path.join(ROOT, 'js', base + '.js'));
  const cur = (f) => (f === file ? ' aria-current="page"' : '');
  const links = PRODUCTS.map((p) => `<a href="${p.href}"${cur(p.href)}>${p.name}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="assets/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">${hasCss ? `\n<link rel="stylesheet" href="css/${base}.css">` : ''}
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="nav-in">
    <a class="brand" href="index.html" aria-label="Cognax home"><img src="assets/logo.svg" alt="Cognax" width="96" height="22"></a>
    <nav class="links" id="links" aria-label="Main">
      ${links}
      <a href="support.html"${cur('support.html')}>Support</a>
      <a href="contact.html"${cur('contact.html')}>Contact</a>
    </nav>
    <div class="nav-cta">
      <a class="nav-signin" href="${LOGIN}">Sign in</a>
      <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="links">${svg('menu', 18)}</button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <img src="assets/logo.svg" alt="Cognax" width="128" height="29">
        <p class="muted" style="margin-top:14px;max-width:32ch;font-size:.95rem">Upload anything. Ask anything. Trust the answer.</p>
      </div>
      <div><h4>Product</h4><ul>${PRODUCTS.map((p) => `<li><a href="${p.href}">${p.name}</a></li>`).join('')}</ul></div>
      <div><h4>Company</h4><ul><li><a href="contact.html">Contact</a></li><li><a href="support.html">Support</a></li><li><a href="${LOGIN}">Sign in</a></li></ul></div>
      <div><h4>Legal</h4><ul><li><a href="privacy.html">Privacy</a></li><li><a href="terms.html">Terms</a></li></ul></div>
    </div>
    <div class="foot-base"><span>&copy; ${new Date().getFullYear()} Cognax. All rights reserved.</span><span>cognax.ai</span></div>
  </div>
</footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="main.js" defer></script>${hasJs ? `\n<script type="module" src="js/${base}.js"></script>` : ''}
</body>
</html>`;
}

module.exports = { layout, ctx };
