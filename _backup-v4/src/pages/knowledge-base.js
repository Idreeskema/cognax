module.exports = (ctx) => {
  const { LOGIN, cta } = ctx;
  const rows = [
    ['Q3 vendor review.pdf', 'Ready', 'Finance', 'q3, vendors', 'Oct 2', 1],
    ['Pricing sheet.xlsx', 'Ready', 'Sales', 'pricing', 'Oct 1', 1],
    ['Services agreement.pdf', 'Ready', 'Legal', 'contracts', 'Sep 28', 1],
    ['Onboarding notes.docx', 'Processing', 'HR', 'onboarding', 'Sep 27', 0],
    ['Vendor register.xlsx', 'Ready', 'Finance', 'vendors', 'Sep 24', 0],
    ['Forecast.xlsx', 'Ready', 'Sales', 'q3, forecast', 'Sep 22', 0],
    ['Policy handbook.pdf', 'Ready', 'HR', 'policy', 'Sep 18', 0],
    ['Headcount.xlsx', 'Processing', 'HR', 'planning', 'Sep 15', 0],
  ];
  const btn = (g, v) => `<button type="button" class="kb-f" data-g="${g}" data-v="${v}" aria-pressed="false">${v}</button>`;
  const body = `
<section class="kb-hero" aria-labelledby="kb-h1">
  <div class="wrap kb-head">
    <h1 id="kb-h1">One place for every file Cognax can use</h1>
    <div class="kb-head-side">
      <p class="lede">Upload files, organize them in folders and keep their metadata together. Whatever lives here is available to Naxie, dashboards and automations.</p>
      <div class="hero-actions"><a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a><a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a></div>
    </div>
  </div>
  <div class="kb-track" data-kb-track>
    <div class="kb-sticky">
      <div class="wrap kb-sticky-in">
        <div class="stage3d kb-stage" data-stage="kb-hero" role="img" aria-label="A shelf of files and folders that fans out into an organized grid and re-sorts when a filter is chosen"><span class="fallback">Files and folders, organized in a grid.</span></div>
        <div class="kb-chips" role="group" aria-label="Show the library filtered by">
          <button type="button" class="kb-chip" data-i="0" aria-pressed="true">All files</button>
          <button type="button" class="kb-chip" data-i="1" aria-pressed="false">Status: Ready</button>
          <button type="button" class="kb-chip" data-i="2" aria-pressed="false">Domain: Finance</button>
          <button type="button" class="kb-chip" data-i="3" aria-pressed="false">Starred</button>
          <span class="kb-hint" aria-hidden="true">Scroll to sort</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section kb-sec-flow">
  <div class="wrap row">
    <div class="row-copy">
      <h2>Upload once, use everywhere</h2>
      <p>Add documents and spreadsheets to the Knowledge Base and they become available across the workspace, with no re-importing for each tool.</p>
      <ul class="ticks"><li>Upload files or create folders</li><li>Star the files you return to most</li><li>See each file&rsquo;s status at a glance</li></ul>
    </div>
    <div class="stage3d wide kb-wide" data-stage="kb-flow" role="img" aria-label="Illustration: one spreadsheet is added to the Knowledge Base and then appears in Naxie, Dashboards and Automations"><span class="fallback">One file, used in Naxie, dashboards and automations.</span></div>
  </div>
</section>

<section class="section soft kb-sec-find">
  <div class="wrap kb-find">
    <div class="kb-find-copy">
      <h2>Find things by what they are</h2>
      <p>Filter by status, domain and tags so a large library stays easy to move around in.</p>
      <ul class="ticks"><li>Filter by status, domain and tags</li><li>Sort by name or modified date</li><li>Pagination that stays out of the way</li></ul>
    </div>
    <div class="kb-lib" data-lib>
      <div class="kb-lib-tilt">
        <div class="ui">
          <div class="ui-bar"><i></i><i></i><i></i><span style="margin-left:8px">Knowledge Base</span></div>
          <div class="kb-lib-filters" role="group" aria-label="Filter the example file list">
            <div><span>Status</span>${btn('status', 'Ready')}${btn('status', 'Processing')}</div>
            <div><span>Domain</span>${btn('domain', 'Finance')}${btn('domain', 'Sales')}${btn('domain', 'HR')}${btn('domain', 'Legal')}</div>
            <div><span>Tags</span>${btn('tag', 'q3')}${btn('tag', 'vendors')}${btn('tag', 'policy')}</div>
          </div>
          <div class="kb-lib-scroll"><table class="tbl kb-tbl">
            <thead><tr><th scope="col"><button type="button" class="kb-sort" data-sort="name">Name</button></th><th scope="col">Status</th><th scope="col">Domain</th><th scope="col">Tags</th><th scope="col"><button type="button" class="kb-sort" data-sort="date">Modified</button></th></tr></thead>
            <tbody>${rows.map((r, i) => `<tr data-status="${r[1]}" data-domain="${r[2]}" data-tags="${r[3]}" data-i="${i}" data-name="${r[0]}"><td>${r[5] ? '<span class="kb-star" title="Starred" aria-label="Starred">&#9733;</span>' : ''}${r[0]}</td><td><span class="tag${r[1] === 'Ready' ? ' ok' : ''}">${r[1]}</span></td><td>${r[2]}</td><td class="muted">${r[3]}</td><td class="muted">${r[4]}</td></tr>`).join('')}</tbody>
          </table></div>
          <div class="kb-lib-foot"><span data-count aria-live="polite">Showing 8 of 8 files</span><button type="button" class="kb-clear" data-clear hidden>Clear filters</button></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="kb-with">
  <div class="wrap">
    <p><strong>Files in the Knowledge Base feed the rest of the workspace.</strong>
      <span class="kb-with-links"><a href="naxie.html">Naxie</a><a href="connections.html">Connections</a><a href="automation.html">Data &amp; Automation</a></span></p>
  </div>
</section>
${cta('Start with the documents you already have', 'Tell us what you keep in shared drives and inboxes and we will show how it would look in Cognax.')}`;
  return { file: 'knowledge-base.html', title: 'Knowledge Base: every file in one place | Cognax', desc: 'Upload files, organize them in folders and keep their metadata together. Whatever lives in the Knowledge Base is available to Naxie, dashboards and automations.', body };
};
