// Generates the static site. Run: node build.js
const fs = require('fs');
const path = require('path');

const APP = 'https://cognax.expentor.com';
const LOGIN = APP + '/login';

const I = {
  naxie: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
  kb: '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z"/><path d="M8 7h6M8 11h6"/>',
  dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  pres: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/>',
  conn: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  auto: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h4a4 4 0 0 1 4 4v5"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/>',
};
const svg = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

const PRODUCTS = [
  { href: 'naxie.html', name: 'Naxie', blurb: 'Ask questions, get answers you can check', icon: 'naxie' },
  { href: 'knowledge-base.html', name: 'Knowledge Base', blurb: 'Files, folders and metadata in one place', icon: 'kb' },
  { href: 'dashboards.html', name: 'Dashboards', blurb: 'Source-backed reports in groups', icon: 'dash' },
  { href: 'presentations.html', name: 'Presentations', blurb: 'Decks generated from connected data', icon: 'pres' },
  { href: 'connections.html', name: 'Connections', blurb: 'Reusable data sources', icon: 'conn' },
  { href: 'automation.html', name: 'Data & Automation', blurb: 'Tables, prompts and docks', icon: 'auto' },
];

function layout({ file, title, desc, body }) {
  const cur = (f) => (f === file ? ' aria-current="page"' : '');
  const drop = PRODUCTS.map((p) => `<a href="${p.href}"${cur(p.href)}>${p.name}<small>${p.blurb}</small></a>`).join('');
  const isProduct = PRODUCTS.some((p) => p.href === file);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="icon" href="assets/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#07070d">
</head>
<body>
<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="nav-in">
    <a class="brand" href="index.html" aria-label="Cognax home"><img src="assets/logo-light.svg" alt="Cognax" width="128" height="29"></a>
    <nav class="links" id="links" aria-label="Main">
      <div class="drop">
        <button class="menu-btn" aria-expanded="false" aria-haspopup="true"${isProduct ? ' style="color:var(--ink)"' : ''}>Product ▾</button>
        <div class="drop-panel">${drop}</div>
      </div>
      <a href="index.html#how"${''}>How it works</a>
      <a href="support.html"${cur('support.html')}>Support</a>
      <a href="contact.html"${cur('contact.html')}>Contact</a>
    </nav>
    <div class="nav-cta">
      <a class="btn btn-ghost" href="${LOGIN}">Sign in</a>
      <a class="btn btn-primary" href="contact.html">Request a demo</a>
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
        <img src="assets/logo-light.svg" alt="Cognax" width="128" height="29" class="brand-foot">
        <p class="muted" style="margin-top:14px;max-width:32ch;font-size:.92rem">Upload anything. Ask anything. Trust the answer.</p>
      </div>
      <div><h4>Product</h4><ul>${PRODUCTS.map((p) => `<li><a href="${p.href}">${p.name}</a></li>`).join('')}</ul></div>
      <div><h4>Company</h4><ul><li><a href="contact.html">Contact</a></li><li><a href="support.html">Support</a></li><li><a href="${LOGIN}">Sign in</a></li></ul></div>
      <div><h4>Legal</h4><ul><li><a href="privacy.html">Privacy</a></li><li><a href="terms.html">Terms</a></li></ul></div>
    </div>
    <div class="foot-base"><span>© ${new Date().getFullYear()} Cognax. All rights reserved.</span><span>cognax.ai</span></div>
  </div>
</footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="main.js" defer></script>
</body>
</html>`;
}

const cta = (h, p, label = 'Request a demo', href = 'contact.html') => `
<section class="section" style="padding-bottom:0"><div class="wrap"><div class="cta" data-reveal>
  <h2>${h}</h2><p>${p}</p>
  <div class="hero-actions"><a class="btn btn-primary btn-lg" href="${href}">${label}</a><a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a></div>
</div></div></section>`;

const li = (t) => `<li>${svg('check', 18)}<span>${t}</span></li>`;
const row = (h, p, items, mock, flip) => `
<div class="row${flip ? ' flip' : ''}" data-reveal>
  <div class="row-copy"><h2>${h}</h2><p>${p}</p><ul>${items.map(li).join('')}</ul></div>
  <div>${mock}</div>
</div>`;

const win = (title, inner) => `<div class="win"><div class="win-bar"><i></i><i></i><i></i><span>${title}</span></div><div class="win-body">${inner}</div></div>`;

// ---------- mockups (illustrative demo content, not customer data) ----------
const M = {
  naxie: () => win('Naxie', `
    <div class="bubble-u">Which clause covers early termination?</div>
    <div class="bubble-a">Either party may end the agreement with 60 days' written notice <span class="cite">${svg('file', 12)} Services Agreement, p. 7</span></div>
    <div class="doc"><b>Services Agreement · Section 12.2</b>…may terminate this Agreement for convenience by giving <mark>sixty (60) days' prior written notice</mark> to the other party…</div>`),
  kb: () => win('Knowledge Base', `
    <table class="mock-table"><thead><tr><th>Name</th><th>Status</th><th>Tags</th></tr></thead><tbody>
    <tr><td>Contracts</td><td><span class="pill">Folder</span></td><td>—</td></tr>
    <tr><td>Q3 vendor review.pdf</td><td><span class="pill ok">Ready</span></td><td>finance</td></tr>
    <tr><td>Pricing sheet.xlsx</td><td><span class="pill ok">Ready</span></td><td>sales</td></tr>
    <tr><td>Onboarding notes.docx</td><td><span class="pill">Processing</span></td><td>hr</td></tr></tbody></table>`),
  dash: () => win('Dashboards', `
    <div class="kpis"><div class="kpi"><b>128</b><small>Open items</small></div><div class="kpi"><b>$4.2M</b><small>Committed</small></div><div class="kpi"><b>94%</b><small>On track</small></div></div>
    <div class="bars" role="img" aria-label="Bar chart of monthly totals rising over time"><span style="height:38%"></span><span style="height:52%"></span><span style="height:46%"></span><span style="height:70%"></span><span style="height:64%"></span><span style="height:88%"></span></div>`),
  pres: () => `<div class="panel"><div class="slide"><small>Quarterly review</small>Revenue grew in every region</div><div class="slides"><div class="slide">Summary</div><div class="slide">By region</div><div class="slide">Next steps</div></div></div>`,
  conn: () => win('Connections', `
    <table class="mock-table"><thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead><tbody>
    <tr><td>Sales forecast</td><td>Excel</td><td><span class="pill ok">Ready</span></td></tr>
    <tr><td>Vendor register</td><td>Excel</td><td><span class="pill ok">Ready</span></td></tr></tbody></table>`),
  auto: () => `<div class="panel"><div class="flow"><span class="node">Upload</span><span class="arrow">→</span><span class="node">Extract with prompt</span><span class="arrow">→</span><span class="node">Data table</span><span class="arrow">→</span><span class="node">Dashboard</span></div></div>`,
};

// ---------- product page template ----------
function productPage(p) {
  const body = `
<section class="hero"><div class="wrap">
  <div class="pill-badge" data-hero><b>${p.name}</b> part of the Cognax workspace</div>
  <h1 data-hero>${p.h1}</h1>
  <p class="lede" data-hero>${p.lede}</p>
  <div class="hero-actions" data-hero><a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a><a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a></div>
  <div class="stage" data-hero style="max-width:860px">${p.mock}</div>
</div></section>
<section class="section"><div class="wrap">
${p.rows.map((r, i) => row(r[0], r[1], r[2], r[3], i % 2 === 1)).join('')}
</div></section>
<section class="section" style="padding-top:0"><div class="wrap">
  <div class="section-head"><h2>Works with the rest of Cognax</h2><p class="section-sub">${p.related.lead}</p></div>
  <div class="bento" style="grid-template-columns:repeat(3,1fr)">${p.related.links.map((k) => { const x = PRODUCTS.find((q) => q.name === k); return `<a class="tile glass" style="grid-column:span 1;min-height:220px" href="${x.href}"><span class="ico">${svg(x.icon)}</span><h3>${x.name}</h3><p>${x.blurb}.</p><span class="go">Learn more</span></a>`; }).join('')}</div>
</div></section>
${cta(p.ctaH, p.ctaP)}`;
  return layout({ file: p.href, title: `${p.name} — Cognax`, desc: p.lede, body });
}

const PAGES = [
  {
    href: 'naxie.html', name: 'Naxie',
    h1: 'Ask about your work. Check the answer.',
    lede: 'Naxie is the Cognax assistant. Ask about uploaded documents, extracted data and dashboards, and see where each answer came from.',
    mock: M.naxie(),
    rows: [
      ['Find the clause, not just a summary', 'Ask in plain language and Naxie points you to the passage in the document, so you can read it yourself before you act on it.', ['Find a clause in a contract or policy', 'Summarize risk or obligations from a document', 'Jump from an answer to the source'], M.naxie()],
      ['Ask questions of your numbers', 'Naxie works with the tables and dashboards already in your workspace. Ask for totals, trends or comparisons without building a query.', ['Totals, trends and comparisons on demand', 'Works with extracted data and connected sources', 'Explains what a figure means in plain words'], M.dash()],
      ['Pick a thread back up', 'Every question is saved as a conversation. Come back later, add a follow-up and keep working from where you stopped.', ['Conversations stay in your workspace', 'Start a new thread whenever the topic changes', 'Follow-ups keep the earlier context'], win('Conversations', '<div class="bubble-a">Contract review — 4 follow-ups</div><div class="bubble-a">Vendor spend by region</div><div class="bubble-a">Onboarding checklist questions</div>')],
    ],
    related: { lead: 'Naxie answers from what you have already put into Cognax.', links: ['Knowledge Base', 'Dashboards', 'Connections'] },
    ctaH: 'See Naxie answer from your own documents', ctaP: 'Book a walkthrough and bring a document you know well. You will know within minutes whether the answers hold up.',
  },
  {
    href: 'knowledge-base.html', name: 'Knowledge Base',
    h1: 'One place for every file Cognax can use',
    lede: 'Upload files, organize them in folders and keep their metadata together. Whatever lives here is available to Naxie, dashboards and automations.',
    mock: M.kb(),
    rows: [
      ['Upload once, use everywhere', 'Add documents and spreadsheets to the Knowledge Base and they become available across the workspace, with no re-importing for each tool.', ['Upload files or create folders', 'Star the files you return to most', 'See each file’s status at a glance'], M.kb()],
      ['Find things by what they are', 'Filter by status, domain and tags so a large library stays easy to move around in.', ['Filter by status, domain and tags', 'Sort by name or modified date', 'Pagination that stays out of the way'], win('Filters', '<div class="flow"><span class="pill">Status</span><span class="pill">Domain</span><span class="pill">Tags</span><span class="pill ok">Starred</span></div><div class="doc"><b>Folders</b>Home · Ask Me Anything</div>')],
    ],
    related: { lead: 'Files in the Knowledge Base feed the rest of the workspace.', links: ['Naxie', 'Connections', 'Data & Automation'] },
    ctaH: 'Start with the documents you already have', ctaP: 'Tell us what you keep in shared drives and inboxes and we will show how it would look in Cognax.',
  },
  {
    href: 'dashboards.html', name: 'Dashboards',
    h1: 'Reports that point back to their source',
    lede: 'Group reports into dashboards, then build each report from a connected source so every number can be traced.',
    mock: M.dash(),
    rows: [
      ['Organize reports into groups', 'A dashboard holds a set of related reports. Keep operational views, finance and project reports apart and open each in one click.', ['Create a dashboard for each topic', 'Add a description so teammates know what it covers', 'See report counts and dates on every card'], win('Dashboards', '<div class="doc"><b>Operations review</b>3 reports · updated this month</div><div class="doc"><b>Vendor performance</b>3 reports · updated this month</div>')],
      ['Source-backed, not screenshot-backed', 'Each report is created from a connection, such as an Excel file. When the source changes, you know where to look.', ['Build reports from Excel connections', 'Share reports with teammates', 'Ungrouped reports are kept in their own tab'], M.dash()],
    ],
    related: { lead: 'Dashboards sit on top of your connections and feed your decks.', links: ['Connections', 'Presentations', 'Naxie'] },
    ctaH: 'Turn a spreadsheet into a report you can defend', ctaP: 'We will build a first dashboard from one of your own files during the demo.',
  },
  {
    href: 'presentations.html', name: 'Presentations',
    h1: 'Decks that build themselves from your data',
    lede: 'Create presentations from the data you have connected, and keep them in one list you can search, share and reopen.',
    mock: M.pres(),
    rows: [
      ['Start from the data, not a blank slide', 'Pick a connection, create a presentation and let Cognax generate the first draft of the deck from it.', ['Generated from connected data', 'My presentations and shared decks in separate views', 'Search across everything you have made'], M.pres()],
      ['Always the latest figures', 'Because decks come from connected sources, refreshing the story means starting from current data rather than copying numbers by hand.', ['Less copy and paste between tools', 'One source behind dashboards and decks', 'Share the result with the people who need it'], M.dash()],
    ],
    related: { lead: 'Presentations reuse the sources behind your dashboards.', links: ['Dashboards', 'Connections', 'Naxie'] },
    ctaH: 'Skip the Monday-morning slide rebuild', ctaP: 'Show us the deck you rebuild every week. We will show you how Cognax handles it.',
  },
  {
    href: 'connections.html', name: 'Connections',
    h1: 'Connect a source once. Reuse it everywhere.',
    lede: 'Connections are the reusable sources behind dashboards, presentations and automations, each with a type, a status and tags.',
    mock: M.conn(),
    rows: [
      ['A clear list of what is connected', 'See every source with its type, whether it is ready, when it was created and when it last changed.', ['Filter by connection type', 'Status shows when a source is ready to use', 'Tag connections to keep them organized'], M.conn()],
      ['One source, many outputs', 'The same connection can power a dashboard report, a presentation and an automation, so numbers agree across all three.', ['Excel connections available today', 'Create a connection from the Connections page', 'Open the menu on any row to manage it'], M.auto()],
    ],
    related: { lead: 'Connections are the starting point for most workflows.', links: ['Dashboards', 'Presentations', 'Data & Automation'] },
    ctaH: 'Bring your first data source', ctaP: 'We can walk through connecting one of your spreadsheets in the demo.',
  },
  {
    href: 'automation.html', name: 'Data & Automation',
    h1: 'From uploaded file to running workflow',
    lede: 'Data tables hold structured records, Prompt Studio shapes document extraction, and Automation Docks run and monitor your pipelines.',
    mock: M.auto(),
    rows: [
      ['Data tables for structured records', 'Collect the records your dashboards, automations and reports depend on in tables you create.', ['Create tables for the records you track', 'Used by dashboards and automations', 'Created dates and actions in one list'], win('Data Tables', '<table class="mock-table"><thead><tr><th>Table name</th><th>Created</th></tr></thead><tbody><tr><td>Vendor register</td><td>This month</td></tr><tr><td>Contract terms</td><td>This month</td></tr></tbody></table>')],
      ['Prompt Studio for extraction', 'Create a template from a document to shape what Cognax extracts from similar files, and reuse it downstream.', ['Create a template from a real document', 'Templates guide extraction prompts', 'Reuse the same template for similar documents'], win('Prompt Studio', '<div class="doc"><b>Template: Contract terms</b>Extract parties, term length, renewal and notice period.</div>')],
      ['Automation Docks that run the pipeline', 'A dock is an operational pipeline. Build a workflow, run it, deploy it and watch what it does.', ['Create a dock to build and run a workflow', 'Run, deploy and monitor from one place', 'Status and creation date for every dock'], M.auto()],
    ],
    related: { lead: 'Automations draw on files, sources and extraction templates.', links: ['Knowledge Base', 'Connections', 'Dashboards'] },
    ctaH: 'Automate the work you repeat every week', ctaP: 'Describe a recurring task and we will map it onto a dock in the demo.',
  },
];

const write = (f, html) => fs.writeFileSync(path.join(__dirname, f), html, 'utf8');
PAGES.forEach((p) => write(p.href, productPage(p)));

// ---------- home ----------
write('index.html', layout({
  file: 'index.html',
  title: 'Cognax — Upload anything. Ask anything. Trust the answer.',
  desc: 'Cognax brings documents, tables, dashboards and assistant workflows into one calmer workspace.',
  body: `
<section class="hero"><div class="wrap">
  <div class="pill-badge" data-hero><b>New</b> Naxie answers come with their source</div>
  <h1 data-hero>Upload anything. Ask anything. <span class="grad">Trust the answer.</span></h1>
  <p class="lede" data-hero>Cognax brings documents, tables, dashboards and assistant workflows into one calmer workspace, so you can ask a question and see exactly where the answer came from.</p>
  <div class="hero-actions" data-hero><a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a><a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a></div>
  <div class="stage" data-hero>
    <div class="win" id="demo" role="img" aria-label="Example of Naxie answering a question and showing the source passage">
      <div class="win-bar"><i></i><i></i><i></i><span>Cognax &middot; Naxie</span></div>
      <div class="app">
        <div class="app-side" aria-hidden="true"><span class="on">${svg('naxie', 20)}</span><span>${svg('kb', 20)}</span><span>${svg('dash', 20)}</span><span>${svg('pres', 20)}</span><span>${svg('conn', 20)}</span></div>
        <div class="app-main">
          <div class="bubble-u" id="d-q"><span id="d-q-text">Which clause covers early termination?</span></div>
          <div class="bubble-a" id="d-a">Either party may end the agreement with 60 days&rsquo; written notice. <span class="cite" id="d-cite">${svg('file', 12)} Services Agreement, p. 7</span></div>
          <div id="d-ok"><span class="chip-ok">${svg('check', 14)} Answer matches the source</span></div>
        </div>
        <div class="app-src">
          <h4>Source</h4>
          <div class="doc" id="d-doc"><b>Services Agreement &middot; Section 12.2</b>&hellip;either party may terminate this Agreement for convenience by giving <mark id="d-mark">sixty (60) days&rsquo; prior written notice</mark> to the other party&hellip;<div class="skel" style="margin-top:12px;width:90%"></div><div class="skel" style="margin-top:8px;width:70%"></div></div>
        </div>
      </div>
    </div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head" data-reveal><h2>One workspace for the way you actually work</h2><p class="section-sub">Six tools that share the same files and the same data, so nothing has to be copied between them.</p></div>
  <div class="bento">
    <a class="tile glass t-naxie" href="naxie.html" data-reveal><span class="ico">${svg('naxie')}</span><h3>Naxie</h3><p>Ask about uploaded documents, extracted data and dashboards. Find a clause, summarize risk, explain a number, then pick the thread back up later.</p>
      <div class="vis"><div class="mini-row">Which clause covers early termination?<span class="pill ok">Sourced</span></div><div class="mini-row">Summarize the risks in this contract<span class="pill ok">Sourced</span></div></div><span class="go">Meet Naxie</span></a>
    <a class="tile glass t-kb" href="knowledge-base.html" data-reveal><span class="ico">${svg('kb')}</span><h3>Knowledge Base</h3><p>Files, folders and metadata available to everything else.</p><div class="vis"><div class="mini-row"><span class="dot"></span>Contracts</div><div class="mini-row"><span class="dot"></span>Vendor review.pdf</div></div><span class="go">Explore</span></a>
    <a class="tile glass t-dash" href="dashboards.html" data-reveal><span class="ico">${svg('dash')}</span><h3>Dashboards</h3><p>Group reports by topic and build each one from a connected source.</p><div class="vis"><div class="bars" style="height:90px"><span style="height:40%"></span><span style="height:58%"></span><span style="height:48%"></span><span style="height:76%"></span><span style="height:66%"></span><span style="height:92%"></span></div></div><span class="go">Explore</span></a>
    <a class="tile glass t-pres" href="presentations.html" data-reveal><span class="ico">${svg('pres')}</span><h3>Presentations</h3><p>Generate decks from the data you have already connected.</p><div class="vis"><div class="slide" style="font-size:1rem;padding:14px"><small>Quarterly review</small>Revenue grew in every region</div></div><span class="go">Explore</span></a>
    <a class="tile glass t-conn" href="connections.html" data-reveal><span class="ico">${svg('conn')}</span><h3>Connections</h3><p>Reusable sources for reports, decks and automations.</p><div class="vis"><div class="mini-row">Sales forecast<span class="pill ok">Ready</span></div></div><span class="go">Explore</span></a>
    <a class="tile glass t-auto" href="automation.html" data-reveal><span class="ico">${svg('auto')}</span><h3>Data &amp; Automation</h3><p>Data tables for structured records, Prompt Studio for shaping extraction, and Automation Docks for pipelines that run, deploy and monitor your workflows.</p><div class="vis flow"><span class="node">Upload</span><span class="arrow">→</span><span class="node">Extract</span><span class="arrow">→</span><span class="node">Table</span><span class="arrow">→</span><span class="node hot">Dashboard</span></div><span class="go">Explore</span></a>
  </div>
</div></section>

<section class="section" id="how" style="padding-top:0"><div class="wrap">
  <div class="section-head center" data-reveal><h2>From a pile of files to an answer you can stand behind</h2></div>
  <div class="steps">
    <div class="step glass" data-reveal><span class="step-n">1</span><h3>Upload</h3><p>Add documents and spreadsheets to the Knowledge Base, or connect an Excel source.</p></div>
    <div class="step glass" data-reveal><span class="step-n">2</span><h3>Ask</h3><p>Ask Naxie in plain language, or build dashboards and decks from the same data.</p></div>
    <div class="step glass" data-reveal><span class="step-n">3</span><h3>Verify</h3><p>Open the source behind an answer and read the passage yourself before you rely on it.</p></div>
  </div>
</div></section>

<section class="section" style="padding-top:0"><div class="wrap">
  <p class="statement" id="statement">Answers are only useful if you can check them. Cognax points every answer to its source, so you spend your time deciding, not double-checking.</p>
</div></section>
${cta('Ready to see it on your own files?', 'Book a short walkthrough. Bring a document you know well and judge the answers yourself.')}
`,
}));

// ---------- contact ----------
write('contact.html', layout({
  file: 'contact.html', title: 'Request a demo — Cognax', desc: 'Talk to the Cognax team and see the workspace on your own documents.',
  body: `
<section class="page-head"><div class="wrap"><h1>Request a demo</h1><p class="lede">Tell us what you work with and we will show Cognax on something close to it.</p></div></section>
<section class="section" style="padding-top:24px"><div class="wrap two">
  <form class="card" id="contact-form" novalidate>
    <div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="email">Work email</label><input id="email" name="email" type="email" autocomplete="email" required><small>We will only use this to reply to you.</small></div>
    <div class="field"><label for="company">Company</label><input id="company" name="company" autocomplete="organization"></div>
    <div class="field"><label for="msg">What would you like to ask Cognax?</label><textarea id="msg" name="msg" placeholder="For example: contracts, vendor reports, weekly decks"></textarea></div>
    <button class="btn btn-primary" type="submit">Send request</button>
    <p id="form-status" role="status" class="muted" style="margin-top:14px"></p>
  </form>
  <div>
    <h2 style="font-size:1.5rem;margin-bottom:18px">What happens next</h2>
    <ul class="list-plain">
      <li><b>We read your note</b><span>A person on the team reviews it and replies by email.</span></li>
      <li><b>We plan a short walkthrough</b><span>Focused on the documents and data you described.</span></li>
      <li><b>You try it your way</b><span>Bring a file you know well and check the answers yourself.</span></li>
    </ul>
    <p class="muted" style="margin-top:28px">Already a customer? <a href="${LOGIN}" style="color:var(--brand);font-weight:600">Sign in</a> or visit <a href="support.html" style="color:var(--brand);font-weight:600">Support</a>.</p>
  </div>
</div></section>`,
}));

// ---------- support ----------
write('support.html', layout({
  file: 'support.html', title: 'Support — Cognax', desc: 'Help with signing in and using Cognax.',
  body: `
<section class="page-head"><div class="wrap"><h1>Support</h1><p class="lede">Quick answers for the most common questions.</p></div></section>
<section class="section" style="padding-top:24px"><div class="wrap prose">
  <h2>Signing in</h2><p>Go to <a href="${LOGIN}" style="color:var(--brand)">the sign-in page</a> and use your email and password, or continue with Google. If you forgot your password, choose “Forgot password?” on that page.</p>
  <h2>Where do I find my files?</h2><p>Files and folders are in the Knowledge Base. Use the filters for status, domain and tags to narrow a long list.</p>
  <h2>Why is Naxie not answering from my document?</h2><p>Check that the document is in the Knowledge Base and its status shows as ready. Documents that are still processing may not be available yet.</p>
  <h2>How do I build a dashboard?</h2><p>Create a connection to your spreadsheet, create a dashboard, then add a report that uses the connection.</p>
  <h2>Still stuck?</h2><p>Send us a note through the <a href="contact.html" style="color:var(--brand)">contact page</a> and describe what you expected to happen.</p>
</div></section>`,
}));

// ---------- legal ----------
const legal = (file, title, intro) => layout({
  file, title: `${title} — Cognax`, desc: `${title} for Cognax.`,
  body: `<section class="page-head"><div class="wrap"><h1>${title}</h1><p class="lede">${intro}</p></div></section>
<section class="section" style="padding-top:24px"><div class="wrap prose">
<p><b>Draft placeholder.</b> This page is a template and has not been reviewed by legal counsel. Replace this text with Cognax’s approved ${title.toLowerCase()} before publishing the site.</p>
</div></section>`,
});
write('privacy.html', legal('privacy.html', 'Privacy', 'How Cognax handles your information.'));
write('terms.html', legal('terms.html', 'Terms', 'The terms that apply when you use Cognax.'));

console.log('Built', PAGES.length + 5, 'pages');
