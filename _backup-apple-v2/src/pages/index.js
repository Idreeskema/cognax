module.exports = (ctx) => {
  const { svg, cta } = ctx;

  const win = (title, inner) => `<div class="ui"><div class="ui-bar"><i></i><i></i><i></i><span>${title}</span></div><div class="ui-body">${inner}</div></div>`;

  const links = (href) => `<div class="cta-row"><a class="alink" href="${href}">Learn more</a><a class="alink" href="contact.html">Request a demo</a></div>`;

  const tile = (cls, h, line, href, media) => `
  <article class="atile ${cls}" data-tile>
    <h3>${h}</h3>
    <p>${line}</p>
    ${links(href)}
    <div class="media">${media}</div>
  </article>`;

  const naxieMedia = `
    <div class="nx-duo">
      ${win('Services Agreement', `<div class="nx-docbody"><small>Section 12.2 &middot; Termination for convenience</small><p>Either party may terminate this Agreement for convenience by giving <mark class="nx-hl">sixty (60) days' prior written notice</mark> to the other party.</p><span class="nx-line-bar"></span><span class="nx-line-bar s"></span></div>`)}
      ${win('Naxie', `<div class="nx-b nx-b-u">Which clause covers early termination?</div><div class="nx-b nx-b-a">Either party can end the agreement with 60 days' written notice. <span class="nx-cite">${svg('file', 13)}Services Agreement, p. 7</span></div>`)}
    </div>`;

  const kbMedia = win('Knowledge Base', `<table class="tbl"><thead><tr><th>Name</th><th>Status</th><th>Tags</th></tr></thead><tbody>
       <tr><td>Contracts</td><td><span class="tag">Folder</span></td><td class="muted">-</td></tr>
       <tr><td>Services Agreement.pdf</td><td><span class="tag ok">Ready</span></td><td>legal</td></tr>
       <tr><td>Vendor pricing.xlsx</td><td><span class="tag ok">Ready</span></td><td>finance</td></tr>
       <tr><td>Onboarding notes.docx</td><td><span class="tag">Processing</span></td><td>hr</td></tr>
     </tbody></table>`);

  const dashMedia = win('Dashboards / Operations review', `<div class="nx-kpis"><div><b>128</b><small>Open items</small></div><div><b>$4.2M</b><small>Committed</small></div><div><b>94%</b><small>On track</small></div></div>
     <div class="nx-bars" role="img" aria-label="Illustrative bar chart"><span style="height:38%"></span><span style="height:52%"></span><span style="height:46%"></span><span style="height:70%"></span><span style="height:62%"></span><span style="height:90%" class="on"></span></div>`);

  const presMedia = win('Presentations', `<div class="nx-slide"><small>Quarterly review</small><b>Revenue grew in every region</b></div>
     <div class="nx-thumbs"><span>Summary</span><span>By region</span><span>Next steps</span></div>`);

  const connMedia = win('Connections', `<table class="tbl"><thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead><tbody>
       <tr><td>Sales forecast</td><td>Excel</td><td><span class="tag ok">Ready</span></td></tr>
       <tr><td>Vendor register</td><td>Excel</td><td><span class="tag ok">Ready</span></td></tr>
       <tr><td>Headcount plan</td><td>Excel</td><td><span class="tag ok">Ready</span></td></tr>
     </tbody></table>`);

  const autoMedia = `<div class="nx-flow"><span>Upload</span><span>Extract with prompt</span><span>Data table</span><span>Dashboard</span></div>`;

  const body = `
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('nx-js')</script>

<section class="ahero" id="overview">
  <div class="wrap wide">
    <h1 aria-label="Upload anything. Ask anything. Trust the answer."><span class="nx-line"><span>Upload anything.</span></span><span class="nx-line"><span>Ask anything.</span></span><span class="nx-line"><span>Trust the answer.</span></span></h1>
    <p class="lede nx-fade">One workspace for your documents and data, with answers that point to their source.</p>
    <div class="cta-row nx-fade"><a class="pill lg" href="contact.html">Request a demo</a><a class="alink" href="${ctx.LOGIN}">Sign in</a></div>
  </div>
</section>

<div class="nx-pin">
  <div class="nx-pin-sticky">
    <div class="stage3d nx-stage" data-stage="home" role="img" aria-label="The Cognax mark surrounded by a contract, a spreadsheet, a chart and an answer card"><span class="fallback">Cognax: documents, sheets and charts in one workspace.</span></div>
    <p class="nx-caption" aria-hidden="true">Documents, sheets and charts. One workspace.</p>
  </div>
</div>

<section class="sec nx-tools-head" id="tools">
  <div class="wrap"><h2>Six tools. One workspace.</h2><p class="lede">Everything you upload is available to every tool.</p></div>
</section>
<div class="tiles nx-tiles">
  ${tile('dark wide', 'Naxie', 'Ask in plain language. See the passage behind the answer.', 'naxie.html', naxieMedia)}
  ${tile('', 'Knowledge Base', 'Every file, folder and tag in one place.', 'knowledge-base.html', kbMedia)}
  ${tile('', 'Dashboards', 'Source-backed reports, grouped and shared.', 'dashboards.html', dashMedia)}
  ${tile('', 'Presentations', 'Decks generated from your connected data.', 'presentations.html', presMedia)}
  ${tile('', 'Connections', 'Reusable sources for everything you build.', 'connections.html', connMedia)}
  ${tile('wide nx-light', 'Data &amp; Automation', 'Data tables, Prompt Studio and Automation Docks.', 'automation.html', autoMedia)}
</div>

<section class="nx-how-pin sec gray" id="how">
  <div class="nx-how-sticky">
    <div class="wrap">
      <h2 class="nx-how-h">From a file to an answer you can check</h2>
      <ol class="nx-steps">
        <li class="is-on" data-step="0"><i class="nx-bar"><u></u></i><b>Upload</b><p>Add contracts, reports and spreadsheets to the Knowledge Base.</p></li>
        <li data-step="1"><i class="nx-bar"><u></u></i><b>Ask</b><p>Type a question the way you would ask a colleague.</p></li>
        <li data-step="2"><i class="nx-bar"><u></u></i><b>Verify</b><p>Every answer points to the passage it came from.</p></li>
      </ol>
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

<section class="sec nx-statement">
  <div class="wrap">
    <h2>An answer you cannot check is just a <span class="nx-under">guess</span>.</h2>
    <p class="lede">Cognax keeps the source next to the result, so trusting it never means taking its word for it.</p>
    <div class="cta-row"><a class="alink" href="naxie.html">See how Naxie answers</a></div>
  </div>
</section>

${cta('Ask your own documents a question.', 'Book a walkthrough and bring a document you know well.')}
`;

  return {
    file: 'index.html',
    title: 'Cognax: upload anything, ask anything, trust the answer',
    desc: 'Cognax is a workspace where you upload documents and spreadsheets, ask Naxie questions in plain language, and get answers that point to their source.',
    body,
  };
};
