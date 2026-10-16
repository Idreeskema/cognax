module.exports = (ctx) => {
  const rows = [
    ['Alder Freight', '412', 2], ['Birch Packaging', '298', 3], ['Cobalt Metals', '655', 4],
    ['Delta Logistics', '371', 5], ['Elm Components', '520', 6], ['Fjord Plastics', '244', 7],
  ].map(([n, v, r]) => `<tr tabindex="0"><td>${n}</td><td class="num">${v}</td><td class="src">Row ${r}</td></tr>`).join('');

  const body = `
${ctx.localnav('Dashboards', [{ href: '#overview', label: 'Overview' }, { href: '#groups', label: 'Groups' }, { href: '#source', label: 'Source-backed' }])}

<section class="ahero dx-hero" id="overview">
  <div class="wrap">
    <h1 class="reveal">Reports that point back to their source.</h1>
    <p class="lede reveal">Group reports into dashboards, then build each one from a connected source so every number can be traced.</p>
    <div class="cta-row reveal"><a class="pill lg" href="contact.html">Request a demo</a><a class="alink" href="#source">See how a number is traced</a></div>
  </div>
  <div class="wrap wide">
    <div class="stage3d dx-hero-stage" data-stage="dash-hero" role="img" aria-label="A 3D bar chart on a plinth, linked by a thin line to the spreadsheet it was built from"><span class="fallback">Bar chart linked to its source spreadsheet</span></div>
  </div>
</section>

<section class="dx-groups" id="groups" aria-labelledby="dx-g-h">
  <div class="dx-pin">
    <div class="dx-pin-head wrap">
      <h2 id="dx-g-h">Organize reports into groups.</h2>
      <p class="lede">Keep operational views, finance and project reports apart and open each in one click.</p>
      <ol class="dx-glist" aria-label="Example dashboards">
        <li><b>Operations review</b><span>3 reports</span></li>
        <li><b>Vendor performance</b><span>3 reports</span></li>
        <li><b>Finance</b><span>Add a description</span></li>
      </ol>
    </div>
    <div class="stage3d dx-groups-stage" data-stage="dash-groups" role="img" aria-label="Three report groups separating from one platform into their own, with the camera circling them"><span class="fallback">Report groups</span></div>
  </div>
</section>

<section class="sec dx-source" id="source" aria-labelledby="dx-s-h">
  <div class="wrap wide">
    <h2 id="dx-s-h" class="reveal">Source-backed, not screenshot-backed.</h2>
    <p class="lede reveal">Each report is created from a connection, such as an Excel file. When the source changes, you know where to look.</p>
    <div class="dx-source-body sec-visual">
      <div class="stage3d dx-source-stage" data-stage="dash-source" role="img" aria-label="Interactive 3D bar chart. Hover a column to highlight its source row in the table."><span class="fallback">Chart</span></div>
      <div class="ui dx-sheet">
        <div class="ui-bar"><i></i><i></i><i></i><span style="margin-left:8px">vendor_spend.xlsx</span><span class="tag ok" style="margin-left:auto">Connected</span></div>
        <table class="tbl dx-tbl"><thead><tr><th>Vendor</th><th class="num">Q3 spend ($k)</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="dx-trace" aria-live="polite">Hover a column, or a row, to see where the number comes from.</p>
      </div>
    </div>
    <p class="muted dx-points">Build reports from Excel connections &middot; Share reports with teammates &middot; Ungrouped reports are kept in their own tab</p>
  </div>
</section>

<section class="sec gray dx-works" aria-labelledby="dx-w-h">
  <div class="wrap">
    <h2 id="dx-w-h" class="dx-works-h">Works with</h2>
    <p class="lede">Dashboards sit on top of your connections and feed your decks.</p>
    <nav class="cta-row" aria-label="Related products"><a class="alink" href="connections.html">Connections</a><a class="alink" href="presentations.html">Presentations</a><a class="alink" href="naxie.html">Naxie</a></nav>
  </div>
</section>

${ctx.cta('Turn a spreadsheet into a report you can defend', 'We will build a first dashboard from one of your own files during the demo.')}
`;
  return { file: 'dashboards.html', title: 'Dashboards | Cognax', desc: 'Group reports into dashboards and build each report from a connected source so every number can be traced.', body };
};
