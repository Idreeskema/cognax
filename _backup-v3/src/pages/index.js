module.exports = (ctx) => {
  const { LOGIN, svg, cta } = ctx;

  const tools = [
    { href: 'naxie.html', name: 'Naxie', desc: 'Ask about documents, data and dashboards. Find a clause, summarize an obligation, explain a total.' },
    { href: 'knowledge-base.html', name: 'Knowledge Base', desc: 'Files, folders and metadata in one place. Upload, star, and filter by status, domain and tags.' },
    { href: 'dashboards.html', name: 'Dashboards', desc: 'Source-backed reports, organized in groups and shared with your team.' },
    { href: 'presentations.html', name: 'Presentations', desc: 'Decks generated from the data you have connected.' },
    { href: 'connections.html', name: 'Connections', desc: 'Reusable sources, starting with Excel, for dashboards, decks and automation.' },
    { href: 'automation.html', name: 'Data &amp; Automation', desc: 'Data tables, Prompt Studio templates and Automation Docks that run your workflows.' },
  ];

  const previews = [
    `<div class="ui-bar"><i></i><i></i><i></i><span>Naxie</span></div>
     <div class="ui-body">
       <div class="nx-b nx-b-u">Which clause covers early termination?</div>
       <div class="nx-b nx-b-a">Either party can end the agreement with 60 days' written notice. <span class="nx-cite">${svg('file', 13)}Services Agreement, p. 7</span></div>
       <div class="nx-b nx-b-a nx-b-quiet">Summarize the payment obligations.</div>
     </div>`,
    `<div class="ui-bar"><i></i><i></i><i></i><span>Knowledge Base</span></div>
     <div class="ui-body"><table class="tbl"><thead><tr><th>Name</th><th>Status</th><th>Tags</th></tr></thead><tbody>
       <tr><td>Contracts</td><td><span class="tag">Folder</span></td><td class="muted">-</td></tr>
       <tr><td>Services Agreement.pdf</td><td><span class="tag ok">Ready</span></td><td>legal</td></tr>
       <tr><td>Vendor pricing.xlsx</td><td><span class="tag ok">Ready</span></td><td>finance</td></tr>
       <tr><td>Onboarding notes.docx</td><td><span class="tag">Processing</span></td><td>hr</td></tr>
     </tbody></table></div>`,
    `<div class="ui-bar"><i></i><i></i><i></i><span>Dashboards / Operations review</span></div>
     <div class="ui-body"><div class="nx-kpis"><div><b>128</b><small>Open items</small></div><div><b>$4.2M</b><small>Committed</small></div><div><b>94%</b><small>On track</small></div></div>
     <div class="nx-bars" role="img" aria-label="Illustrative bar chart"><span style="height:38%"></span><span style="height:52%"></span><span style="height:46%"></span><span style="height:70%"></span><span style="height:62%"></span><span style="height:90%" class="on"></span></div></div>`,
    `<div class="ui-bar"><i></i><i></i><i></i><span>Presentations</span></div>
     <div class="ui-body"><div class="nx-slide"><small>Quarterly review</small><b>Revenue grew in every region</b></div>
     <div class="nx-thumbs"><span>Summary</span><span>By region</span><span>Next steps</span></div></div>`,
    `<div class="ui-bar"><i></i><i></i><i></i><span>Connections</span></div>
     <div class="ui-body"><table class="tbl"><thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead><tbody>
       <tr><td>Sales forecast</td><td>Excel</td><td><span class="tag ok">Ready</span></td></tr>
       <tr><td>Vendor register</td><td>Excel</td><td><span class="tag ok">Ready</span></td></tr>
       <tr><td>Headcount plan</td><td>Excel</td><td><span class="tag ok">Ready</span></td></tr>
     </tbody></table></div>`,
    `<div class="ui-bar"><i></i><i></i><i></i><span>Automation Docks</span></div>
     <div class="ui-body"><div class="nx-flow"><span>Upload</span><span>Extract with prompt</span><span>Data table</span><span>Dashboard</span></div></div>`,
  ];

  const body = `
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('nx-js')</script>

<section class="nx-hero-pin" id="top">
  <div class="nx-hero-sticky">
    <div class="wrap hero-grid nx-hero-grid">
      <div class="nx-hero-copy">
        <h1 aria-label="Upload anything. Ask anything. Trust the answer."><span class="nx-line"><span>Upload anything.</span></span><span class="nx-line"><span>Ask anything.</span></span><span class="nx-line"><span>Trust the answer.</span></span></h1>
        <p class="lede nx-fade">Cognax is a workspace for your documents and data. Upload files, ask Naxie in plain language, and check every answer against the passage it came from.</p>
        <div class="hero-actions nx-fade"><a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a><a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a></div>
      </div>
      <div class="nx-hero-visual">
        <div class="stage3d" data-stage="home" role="img" aria-label="A desktop where a PDF contract, a spreadsheet, a Word document and a folder are uploaded into the Cognax workspace, ending with a Naxie answer that cites its source"><span class="fallback">Upload a contract, a sheet and a document to Cognax, then ask Naxie and get a cited answer.</span></div>
        <p class="nx-caption" aria-hidden="true">Drop in your files. Ask. Get the source.</p>
      </div>
    </div>
  </div>
</section>

<section class="section nx-tools" id="tools">
  <div class="wrap">
    <div class="nx-tools-grid">
      <div class="nx-tools-left">
        <div class="nx-tools-head"><h2>Six tools, one workspace</h2><p class="lede">Everything you upload is available to every tool. Pick one to see what it looks like.</p></div>
        <ul class="nx-index">
          ${tools.map((t, i) => `<li><a class="nx-ix${i === 0 ? ' is-on' : ''}" href="${t.href}" data-i="${i}"><span class="nx-ix-name">${t.name}</span><span class="nx-ix-desc">${t.desc}</span><svg class="nx-ix-go" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a></li>`).join('')}
        </ul>
      </div>
      <div class="nx-pv-wrap" aria-hidden="true">
        <div class="nx-pv-tilt">
          ${previews.map((p, i) => `<div class="ui nx-pv${i === 0 ? ' is-on' : ''}" data-i="${i}">${p}</div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="nx-how-pin" id="how">
  <div class="nx-how-sticky">
    <div class="wrap nx-how-grid">
      <div class="nx-how-copy">
        <h2>From a file to an answer you can check</h2>
        <ol class="nx-steps">
          <li class="is-on" data-step="0"><b>Upload</b><p>Add contracts, reports and spreadsheets to the Knowledge Base. They are ready for Naxie, dashboards and automations.</p></li>
          <li data-step="1"><b>Ask</b><p>Type a question the way you would ask a colleague. Find a clause, summarize a risk, explain a total.</p></li>
          <li data-step="2"><b>Verify</b><p>Every answer points to the passage it came from. Open it, read it, and decide for yourself.</p></li>
        </ol>
      </div>
      <div class="nx-how-stage">
        <div class="ui nx-card">
          <div class="ui-bar"><i></i><i></i><i></i><span>Cognax workspace</span></div>
          <div class="ui-body">
            <div class="nx-zone nx-files">
              <div class="nx-file"><span class="nx-fname">${svg('file', 16)}Services Agreement.pdf</span><span class="nx-fstat"><i class="nx-prog"><u></u></i><em class="tag ok">Ready</em></span></div>
              <div class="nx-file"><span class="nx-fname">${svg('file', 16)}Vendor pricing.xlsx</span><span class="nx-fstat"><i class="nx-prog"><u></u></i><em class="tag ok">Ready</em></span></div>
              <div class="nx-file"><span class="nx-fname">${svg('file', 16)}Onboarding notes.docx</span><span class="nx-fstat"><i class="nx-prog"><u></u></i><em class="tag ok">Ready</em></span></div>
            </div>
            <div class="nx-zone nx-chat">
              <div class="nx-b nx-b-u"><span class="nx-typed">Which clause covers early termination?</span><i class="nx-caret"></i></div>
              <div class="nx-b nx-b-a nx-answer">Either party can end the agreement with 60 days' written notice. <span class="nx-cite">${svg('file', 13)}Services Agreement, p. 7</span></div>
            </div>
            <div class="nx-zone nx-source">
              <small>Services Agreement &middot; Section 12.2</small>
              <p>Either party may terminate this Agreement for convenience by giving <mark class="nx-mark">sixty (60) days' prior written notice</mark> to the other party.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section nx-statement">
  <div class="wrap nx-st-grid">
    <h2>An answer you cannot check is just a <span class="nx-under">guess</span>.</h2>
    <div class="nx-st-side">
      <p class="lede">Cognax keeps the source next to the result, so trusting it never means taking its word for it.</p>
      <dl class="nx-facts">
        <div><dt>Naxie</dt><dd>Answers point to the passage they came from.</dd></div>
        <div><dt>Dashboards</dt><dd>Reports are created from connected sources.</dd></div>
        <div><dt>Presentations</dt><dd>Decks are generated from connected data.</dd></div>
      </dl>
      <a class="link-arrow" href="naxie.html">See how Naxie answers</a>
    </div>
  </div>
</section>

${cta('Ask your own documents a question', 'Book a walkthrough and bring a document you know well. You will know within minutes whether the answers hold up.')}
`;

  return {
    file: 'index.html',
    title: 'Cognax: upload anything, ask anything, trust the answer',
    desc: 'Cognax is a workspace where you upload documents and spreadsheets, ask Naxie questions in plain language, and get answers that point to their source.',
    body,
  };
};
