module.exports = (ctx) => {
  const { cta, PRODUCTS, LOGIN } = ctx;
  const works = ['dashboards.html', 'presentations.html', 'automation.html', 'knowledge-base.html']
    .map((h) => PRODUCTS.find((p) => p.href === h))
    .map((p) => `<a class="cn-works-card" href="${p.href}"><b>${p.name}</b><span>${p.blurb}</span></a>`).join('');

  const rows = [
    ['Sales forecast', 'finance', 'forecast', 'Mar 4', 'Today'],
    ['Vendor register', 'operations', 'vendors', 'Feb 19', 'Mar 2'],
    ['Pricing sheet', 'sales', 'pricing', 'Feb 11', 'Feb 27'],
    ['Headcount plan', 'people', 'planning', 'Jan 30', 'Feb 20'],
  ].map((r) => `<tr><td><b>${r[0]}</b></td><td>Excel</td><td><span class="tag ok">Ready</span></td><td><span class="tag">${r[1]}</span> <span class="tag">${r[2]}</span></td><td class="cn-dim">${r[3]}</td><td class="cn-dim">${r[4]}</td><td class="cn-more" aria-hidden="true">&middot;&middot;&middot;</td></tr>`).join('');

  const step = (h, p, label) => `
      <article class="cn-step" data-step>
        <h3>${h}</h3>
        <p>${p}</p>
        <span class="cn-step-tag">${label}</span>
      </article>`;

  const body = `
<section class="hero cn-hero">
  <div class="wrap hero-grid">
    <div class="cn-hero-copy">
      <h1 data-hero><span>Connect a source once.</span> <span>Reuse it everywhere.</span></h1>
      <p class="lede" data-hero>Connections are the reusable sources behind dashboards, presentations and automations, each with a type, a status and tags.</p>
      <div class="hero-actions" data-hero>
        <a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a>
        <a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a>
      </div>
      <p class="hero-note" data-hero>Excel connections are available today.</p>
    </div>
    <div class="stage3d cn-hero-stage" data-stage="conn-hero" role="img" aria-label="A spreadsheet connected to a hub, which feeds a dashboard, a presentation and an automation"><span class="fallback">A spreadsheet source feeding a dashboard, a presentation and an automation.</span></div>
  </div>
</section>

<section class="section cn-list">
  <div class="wrap">
    <div class="cn-list-grid">
      <div class="cn-list-copy">
        <h2>A clear list of what is connected</h2>
        <p class="lede">See every source with its type, whether it is ready, when it was created and when it last changed.</p>
        <ul class="ticks">
          <li>Filter by connection type</li>
          <li>Status shows when a source is ready to use</li>
          <li>Tag connections to keep them organized</li>
          <li>Open the menu on any row to manage it</li>
        </ul>
      </div>
      <div class="cn-tilt" data-tilt>
        <div class="ui cn-ui" role="img" aria-label="Illustrative Connections list showing four Excel sources, each marked Ready with tags">
          <div class="ui-bar"><i></i><i></i><i></i><span style="margin-left:8px">Connections</span></div>
          <div class="cn-tools"><span class="cn-chip on">All</span><span class="cn-chip">Excel</span><span class="cn-search">Search connections</span><span class="cn-new">New connection</span></div>
          <table class="tbl cn-tbl"><thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Tags</th><th>Created</th><th>Changed</th><th></th></tr></thead><tbody>${rows}</tbody></table>
          <div class="cn-menu"><b>Sales forecast</b><span>Manage connection</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section soft cn-fan" id="fan">
  <div class="wrap">
    <div class="cn-fan-grid">
      <div class="cn-fan-stage">
        <div class="stage3d cn-fan-3d" data-stage="conn-fan" role="img" aria-label="One spreadsheet powering a dashboard, a presentation and an automation"><span class="fallback">One source powering a dashboard, a presentation and an automation.</span></div>
      </div>
      <div class="cn-fan-copy">
        <div class="cn-fan-head">
          <h2>One source, many outputs</h2>
          <p class="lede">The same connection can power a dashboard report, a presentation and an automation, so numbers agree across all three.</p>
        </div>
        ${step('A report in a dashboard', 'Create a report inside a dashboard from the connection. When the source changes, you know exactly where to look.', 'Dashboards')}
        ${step('A presentation', 'Pick the same connection when you create a presentation and Cognax drafts the deck from its data.', 'Presentations')}
        ${step('An automation', 'Automations can start from the same source, so a workflow runs on the numbers your reports already show.', 'Data &amp; Automation')}
      </div>
    </div>
  </div>
</section>

<section class="cn-works" aria-labelledby="cn-w-h">
  <div class="wrap">
    <div class="cn-works-head row-copy">
      <h2 id="cn-w-h">Works with the rest of Cognax</h2>
      <p>A connection is set up once, then reused wherever your data shows up.</p>
    </div>
    <div class="cn-works-body">
      <div class="stage3d cn-works-stage" data-stage="conn-works" role="img" aria-label="A spreadsheet in the centre feeding Dashboards, Presentations, Data and Automation and the Knowledge Base"><span class="fallback">One connection feeding the rest of Cognax</span></div>
      <nav class="cn-works-links" aria-label="Related products">${works}</nav>
    </div>
  </div>
</section>

${cta('Bring your first data source', 'We can walk through connecting one of your spreadsheets in the demo.')}`;

  return {
    file: 'connections.html',
    title: 'Connections: reusable data sources | Cognax',
    desc: 'Connections are the reusable sources behind dashboards, presentations and automations, each with a type, a status and tags.',
    body,
  };
};
