module.exports = (ctx) => {
  const { cta, LOGIN, localnav } = ctx;

  const body = `
${localnav('Data & Automation', [{ href: '#overview', label: 'Overview' }, { href: '#pipeline', label: 'The pipeline' }])}

<section class="ahero" id="overview">
  <div class="wrap">
    <h1 data-hero>From file to<br>running workflow.</h1>
    <p class="lede" data-hero>Data tables hold structured records, Prompt Studio shapes extraction, and Automation Docks run and monitor your pipelines.</p>
    <div class="cta-row" data-hero><a class="pill lg" href="contact.html">Request a demo</a><a class="alink" href="${LOGIN}">Sign in</a></div>
  </div>
  <div class="wrap wide">
    <div class="stage3d au-hero-stage" data-stage="auto-hero" role="img" aria-label="A document travels along a belt, is read by an extraction gate, becomes rows in a data table and lands on a dashboard"><span class="fallback">A document moving from upload, through extraction, into a data table and onto a dashboard.</span></div>
  </div>
</section>

<section class="sec gray au-seq" id="pipeline">
  <div class="wrap">
    <h2>Follow one file through the pipeline.</h2>
    <p class="lede">Each stop is a place in Cognax you can open and work in.</p>
  </div>
  <div class="wrap wide au-seq-grid">
    <div class="au-pin">
      <div class="stage3d au-seq-stage" data-stage="auto-seq" role="img" aria-label="The pipeline, with the camera moving between the extraction gate, the data table and the dashboard"><span class="fallback">The pipeline: extraction gate, data table and dashboard.</span></div>
      <ol class="au-rail" aria-hidden="true"><li class="on">Extract</li><li>Data table</li><li>Dashboard</li></ol>
    </div>
    <div class="au-copy">
      <article class="au-stage" data-au-stage>
        <p class="kicker">Prompt Studio</p>
        <h3>Shape what gets extracted.</h3>
        <p class="au-p">Create a template from a real document to guide what Cognax extracts from similar files, then reuse it downstream.</p>
        <div class="ui au-snip" role="img" aria-label="Illustrative Prompt Studio template"><div class="ui-body"><b>Template: Contract terms</b><span class="muted">Extract parties, term length, renewal and notice period.</span></div></div>
      </article>
      <article class="au-stage" data-au-stage>
        <p class="kicker">Data Tables</p>
        <h3>Records you can build on.</h3>
        <p class="au-p">Collect the records your dashboards, automations and reports depend on in tables you create.</p>
        <div class="ui au-snip" role="img" aria-label="Illustrative list of data tables"><table class="tbl"><thead><tr><th>Table name</th><th>Created</th></tr></thead><tbody><tr><td>Vendor register</td><td>This month</td></tr><tr><td>Contract terms</td><td>This month</td></tr></tbody></table></div>
      </article>
      <article class="au-stage" data-au-stage>
        <p class="kicker">Automation Docks</p>
        <h3>Run the pipeline.</h3>
        <p class="au-p">A dock is an operational pipeline. Build a workflow, run it, deploy it and watch what it does.</p>
        <div class="ui au-snip" role="img" aria-label="Illustrative automation dock with deploy, run and monitor actions"><div class="ui-body au-dock"><b>Contract intake</b><span class="au-acts"><span class="tag">Deploy</span><span class="tag ok">Run</span><span class="tag">Monitor</span></span></div></div>
      </article>
    </div>
  </div>
</section>

<section class="sec au-works">
  <div class="wrap">
    <h2>Draws on the rest of Cognax</h2>
    <div class="cta-row"><a class="alink" href="knowledge-base.html">Knowledge Base</a><a class="alink" href="connections.html">Connections</a><a class="alink" href="dashboards.html">Dashboards</a></div>
  </div>
</section>

${cta('Automate the work you repeat every week.', 'Describe a recurring task and we will map it onto a dock in the demo.')}`;

  return {
    file: 'automation.html',
    title: 'Data & Automation: tables, prompts and docks | Cognax',
    desc: 'Data tables hold structured records, Prompt Studio shapes document extraction, and Automation Docks run and monitor your pipelines.',
    body,
  };
};
