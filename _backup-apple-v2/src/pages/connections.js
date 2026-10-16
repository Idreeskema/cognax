module.exports = (ctx) => {
  const { cta, PRODUCTS, LOGIN, localnav } = ctx;
  const works = ['dashboards.html', 'presentations.html', 'automation.html', 'knowledge-base.html']
    .map((h) => PRODUCTS.find((p) => p.href === h))
    .map((p) => `<a class="alink" href="${p.href}">${p.name}</a>`).join('');

  const rows = [
    ['Sales forecast', 'finance', 'forecast', 'Mar 4', 'Today'],
    ['Vendor register', 'operations', 'vendors', 'Feb 19', 'Mar 2'],
    ['Pricing sheet', 'sales', 'pricing', 'Feb 11', 'Feb 27'],
    ['Headcount plan', 'people', 'planning', 'Jan 30', 'Feb 20'],
  ].map((r) => `<tr><td><b>${r[0]}</b></td><td>Excel</td><td><span class="tag ok">Ready</span></td><td><span class="tag">${r[1]}</span> <span class="tag">${r[2]}</span></td><td class="cn-dim">${r[3]}</td><td class="cn-dim">${r[4]}</td></tr>`).join('');

  const step = (h, p) => `
        <article class="cn-step" data-step>
          <h3>${h}</h3>
          <p>${p}</p>
        </article>`;

  const body = `
${localnav('Connections', [{ href: '#overview', label: 'Overview' }, { href: '#list', label: 'Your sources' }, { href: '#outputs', label: 'One source, many outputs' }])}

<section class="ahero" id="overview">
  <div class="wrap">
    <h1 data-hero>Connect once.<br>Reuse everywhere.</h1>
    <p class="lede" data-hero>Connections are the reusable sources behind your dashboards, presentations and automations.</p>
    <div class="cta-row" data-hero><a class="pill lg" href="contact.html">Request a demo</a><a class="alink" href="${LOGIN}">Sign in</a></div>
    <p class="fineprint" data-hero>Excel connections are available today.</p>
  </div>
  <div class="wrap wide">
    <div class="stage3d cn-hero-stage" data-stage="conn-hero" role="img" aria-label="A spreadsheet connected to a hub, which feeds a dashboard, a presentation and an automation"><span class="fallback">A spreadsheet source feeding a dashboard, a presentation and an automation.</span></div>
  </div>
</section>

<section class="sec gray" id="list">
  <div class="wrap">
    <p class="kicker">Connections list</p>
    <h2>See everything that is connected</h2>
    <p class="lede">Every source shows its type, whether it is ready, and when it was created and last changed. Tag them to keep things organized.</p>
    <div class="cta-row"><a class="alink" href="contact.html">See it in a demo</a></div>
    <div class="sec-visual cn-tilt" data-tilt>
      <div class="ui cn-ui" role="img" aria-label="Illustrative Connections list showing four Excel sources, each marked Ready with tags">
        <div class="ui-bar"><i></i><i></i><i></i><span style="margin-left:8px">Connections</span></div>
        <div class="cn-tools"><span class="cn-chip on">All</span><span class="cn-chip">Excel</span><span class="cn-search">Search connections</span><span class="cn-new">New connection</span></div>
        <div class="cn-scroll"><table class="tbl cn-tbl"><thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Tags</th><th>Created</th><th>Changed</th></tr></thead><tbody>${rows}</tbody></table></div>
      </div>
    </div>
  </div>
</section>

<section class="sec cn-fan" id="outputs">
  <div class="wrap">
    <h2>One source. Many outputs.</h2>
    <p class="lede">The same connection can power a dashboard report, a presentation and an automation, so the numbers agree across all three.</p>
  </div>
  <div class="wrap wide cn-fan-grid">
    <div class="cn-fan-stage">
      <div class="stage3d cn-fan-3d" data-stage="conn-fan" role="img" aria-label="One spreadsheet powering a dashboard, a presentation and an automation"><span class="fallback">One source powering a dashboard, a presentation and an automation.</span></div>
    </div>
    <div class="cn-steps">${step('A report in a dashboard', 'Create a report inside a dashboard from the connection. When the source changes, you know where to look.')}${step('A presentation', 'Pick the same connection when you create a presentation and Cognax drafts the deck from its data.')}${step('An automation', 'Automations can start from the same source, so a workflow runs on the numbers your reports already show.')}
    </div>
  </div>
</section>

<section class="sec gray cn-works">
  <div class="wrap">
    <h2>Works with the rest of Cognax</h2>
    <div class="cta-row">${works}</div>
  </div>
</section>

${cta('Bring your first data source.', 'We can walk through connecting one of your spreadsheets in the demo.')}`;

  return {
    file: 'connections.html',
    title: 'Connections: reusable data sources | Cognax',
    desc: 'Connections are the reusable sources behind dashboards, presentations and automations, each with a type, a status and tags.',
    body,
  };
};
