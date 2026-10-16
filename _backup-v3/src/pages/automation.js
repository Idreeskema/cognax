module.exports = (ctx) => {
  const { cta, LOGIN } = ctx;

  const body = `
<section class="hero au-hero">
  <div class="wrap">
    <div class="au-hero-top">
      <h1 data-hero>From uploaded file to running workflow</h1>
      <div class="au-hero-side">
        <p class="lede" data-hero>Data tables hold structured records, Prompt Studio shapes document extraction, and Automation Docks run and monitor your pipelines.</p>
        <div class="hero-actions" data-hero>
          <a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a>
          <a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a>
        </div>
      </div>
    </div>
    <div class="stage3d au-hero-stage" data-stage="auto-hero" role="img" aria-label="A document travels along a belt, is read by an extraction gate, becomes rows in a data table and lands on a dashboard"><span class="fallback">A document moving from upload, through extraction, into a data table and onto a dashboard.</span></div>
  </div>
</section>

<section class="section au-seq" id="pipeline">
  <div class="wrap">
    <div class="au-seq-head">
      <h2>Follow one file through the pipeline</h2>
      <p class="lede">Each stop is a place in Cognax you can open and work in.</p>
    </div>
    <div class="au-seq-grid">
      <div class="au-copy">
        <article class="au-stage" data-au-stage>
          <span class="au-where">Extract</span>
          <h3>Prompt Studio shapes the extraction</h3>
          <p>Create a template from a real document to shape what Cognax extracts from similar files, then reuse it downstream.</p>
          <ul class="ticks"><li>Create a template from a real document</li><li>Templates guide extraction prompts</li><li>Reuse the same template for similar documents</li></ul>
          <div class="ui au-snip" role="img" aria-label="Illustrative Prompt Studio template"><div class="ui-body"><b>Template: Contract terms</b><span class="muted">Extract parties, term length, renewal and notice period.</span></div></div>
        </article>
        <article class="au-stage" data-au-stage>
          <span class="au-where">Data table</span>
          <h3>Data tables hold the records</h3>
          <p>Collect the records your dashboards, automations and reports depend on in tables you create.</p>
          <ul class="ticks"><li>Create tables for the records you track</li><li>Used by dashboards and automations</li><li>Created dates and actions in one list</li></ul>
          <div class="ui au-snip" role="img" aria-label="Illustrative list of data tables"><table class="tbl"><thead><tr><th>Table name</th><th>Created</th></tr></thead><tbody><tr><td>Vendor register</td><td>This month</td></tr><tr><td>Contract terms</td><td>This month</td></tr></tbody></table></div>
        </article>
        <article class="au-stage" data-au-stage>
          <span class="au-where">Dashboard</span>
          <h3>Automation Docks run the pipeline</h3>
          <p>A dock is an operational pipeline. Build a workflow, run it, deploy it and watch what it does.</p>
          <ul class="ticks"><li>Create a dock to build and run a workflow</li><li>Run, deploy and monitor from one place</li><li>Status and creation date for every dock</li></ul>
          <div class="ui au-snip" role="img" aria-label="Illustrative automation dock with run, deploy and monitor actions"><div class="ui-body au-dock"><b>Contract intake</b><span class="au-acts"><span class="tag">Deploy</span><span class="tag ok">Run</span><span class="tag">Monitor</span></span></div></div>
        </article>
      </div>
      <div class="au-pin">
        <div class="stage3d au-seq-stage" data-stage="auto-seq" role="img" aria-label="The pipeline, with the camera moving between the extraction gate, the data table and the dashboard"><span class="fallback">The pipeline: extraction gate, data table and dashboard.</span></div>
        <ol class="au-rail" aria-hidden="true"><li class="on">Extract</li><li>Data table</li><li>Dashboard</li></ol>
      </div>
    </div>
  </div>
</section>

<section class="au-works">
  <div class="wrap">
    <p>Automations draw on files in the <a href="knowledge-base.html">Knowledge Base</a>, sources in <a href="connections.html">Connections</a> and reports in <a href="dashboards.html">Dashboards</a>.</p>
  </div>
</section>

${cta('Automate the work you repeat every week', 'Describe a recurring task and we will map it onto a dock in the demo.')}`;

  return {
    file: 'automation.html',
    title: 'Data & Automation: tables, prompts and docks | Cognax',
    desc: 'Data tables hold structured records, Prompt Studio shapes document extraction, and Automation Docks run and monitor your pipelines.',
    body,
  };
};
