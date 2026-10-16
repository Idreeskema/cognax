module.exports = (ctx) => {
  const rows = [
    ['Alder Freight', '412', 2], ['Birch Packaging', '298', 3], ['Cobalt Metals', '655', 4],
    ['Delta Logistics', '371', 5], ['Elm Components', '520', 6], ['Fjord Plastics', '244', 7],
  ].map(([n, v, r]) => `<tr tabindex="0"><td>${n}</td><td class="num">${v}</td><td class="src">Row ${r}</td></tr>`).join('');

  const COLORS = ['#5b4fd6', '#ff7a1a', '#9a90ea', '#2f2a6b', '#ffb27a', '#c9c4f3'];
  const slices = (data) => {
    const total = data.reduce((s, d) => s + d[1], 0);
    let acc = 0;
    return data.map(([label, v], i) => { const s = acc / total, e = (acc += v) / total; return { label, v, s, e, pct: Math.round((v / total) * 100), color: COLORS[i % COLORS.length] }; });
  };
  const legend = (sl) => `<ul class="dx-legend">${sl.map((d) => `<li><i style="background:${d.color}"></i>${d.label}<b>${d.pct}%</b></li>`).join('')}</ul>`;

  const donutData = slices([['Alder Freight', 412], ['Birch Packaging', 298], ['Cobalt Metals', 655], ['Delta Logistics', 371], ['Elm Components', 520], ['Fjord Plastics', 244]]);
  const pieData = slices([['Freight', 40], ['Materials', 30], ['Packaging', 20], ['Other', 10]]);
  const sliceAttr = (sl) => JSON.stringify(sl.map((d) => [d.v, d.color])).replace(/"/g, '&quot;');
  const months = [['Apr', 610], ['May', 700], ['Jun', 655], ['Jul', 740], ['Aug', 810], ['Sep', 950]];

  const body = `
<section class="hero dx-hero">
  <div class="wrap hero-grid">
    <div class="dx-hero-copy">
      <h1 class="reveal">Reports that point back to their source</h1>
      <p class="lede reveal">Group reports into dashboards, then build each report from a connected source so every number can be traced.</p>
      <div class="hero-actions reveal"><a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a><a class="btn btn-ghost btn-lg" href="#source">See how a number is traced</a></div>
    </div>
    <div class="stage3d dx-hero-stage" data-stage="dash-hero" role="img" aria-label="A 3D bar chart on a plinth, linked by a thin line to the spreadsheet it was built from"><span class="fallback">Bar chart linked to its source spreadsheet</span></div>
  </div>
</section>

<section class="dx-groups" aria-labelledby="dx-g-h">
  <div class="dx-groups-pin wrap">
    <div class="dx-groups-copy">
      <h2 id="dx-g-h">Organize reports into groups</h2>
      <p>A dashboard holds a set of related reports. Keep operational views, finance and project reports apart and open each in one click.</p>
      <ol class="dx-glist" aria-label="Example dashboards">
        <li><b>Operations review</b><span>3 reports &middot; updated this month</span></li>
        <li><b>Vendor performance</b><span>3 reports &middot; updated this month</span></li>
        <li><b>Finance</b><span>Create a dashboard for each topic and add a description</span></li>
      </ol>
    </div>
    <div class="stage3d dx-groups-stage" data-stage="dash-groups" role="img" aria-label="Three report groups separating from one platform into their own, with the camera circling them"><span class="fallback">Report groups</span></div>
  </div>
</section>

<section class="section dx-source" id="source" aria-labelledby="dx-s-h">
  <div class="wrap">
    <div class="dx-source-pin">
    <div class="dx-source-head row-copy">
      <h2 id="dx-s-h">Source-backed, not screenshot-backed</h2>
      <p>Each report is created from a connection, such as an Excel file. When the source changes, you know where to look.</p>
    </div>
    <div class="dx-source-body">
      <div class="stage3d dx-source-stage" data-stage="dash-source" role="img" aria-label="Interactive 3D bar chart. Hover a column to highlight its source row in the table."><span class="fallback">Chart</span></div>
      <div class="ui dx-sheet">
        <div class="ui-bar"><i></i><i></i><i></i><span style="margin-left:8px">vendor_spend.xlsx</span><span class="tag ok" style="margin-left:auto">Connected</span></div>
        <table class="tbl dx-tbl"><thead><tr><th>Vendor</th><th class="num">Q3 spend ($k)</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="dx-trace" aria-live="polite">Hover a column, or a row, to see where the number comes from.</p>
      </div>
    </div>
    </div>
    <ul class="ticks dx-ticks">
      <li>Build reports from Excel connections</li>
      <li>Share reports with teammates</li>
      <li>Ungrouped reports are kept in their own tab</li>
    </ul>
  </div>
</section>

<section class="section dx-charts" aria-labelledby="dx-c-h">
  <div class="wrap">
    <div class="dx-source-head row-copy">
      <h2 id="dx-c-h">The right chart for each question</h2>
      <p>Share of spend, composition and trend: pick the chart type that fits, and each one still reads from its connected source.</p>
    </div>
    <div class="dx-chart-grid">
      <figure class="dx-card"><figcaption><b>Donut</b><span>Q3 spend share by vendor</span></figcaption><div class="stage3d dx-chart" data-stage="dash-donut" data-slices="${sliceAttr(donutData)}" role="img" aria-label="3D donut chart of Q3 spend share by vendor"><span class="fallback">Donut chart</span></div>${legend(donutData)}</figure>
      <figure class="dx-card"><figcaption><b>Pie</b><span>Spend by category (example data)</span></figcaption><div class="stage3d dx-chart" data-stage="dash-pie" data-slices="${sliceAttr(pieData)}" role="img" aria-label="3D pie chart of example spend by category"><span class="fallback">Pie chart</span></div>${legend(pieData)}</figure>
      <figure class="dx-card"><figcaption><b>Line</b><span>Monthly spend, $k (example data)</span></figcaption><div class="stage3d dx-chart" data-stage="dash-line" data-values="[${months.map((m) => m[1]).join(',')}]" role="img" aria-label="3D line chart of monthly spend"><span class="fallback">Line chart</span></div><ul class="dx-legend dx-months">${months.map(([m, v]) => `<li>${m}<b>${v}</b></li>`).join('')}</ul></figure>
    </div>
  </div>
</section>

<section class="dx-works-sec" aria-labelledby="dx-w-h">
  <div class="wrap dx-works">
    <h2 id="dx-w-h">Works with</h2>
    <p>Dashboards sit on top of your connections and feed your decks.</p>
    <nav aria-label="Related products"><a href="connections.html">Connections</a><a href="presentations.html">Presentations</a><a href="naxie.html">Naxie</a></nav>
  </div>
</section>

${ctx.cta('Turn a spreadsheet into a report you can defend', 'We will build a first dashboard from one of your own files during the demo.')}
`;
  return { file: 'dashboards.html', title: 'Dashboards | Cognax', desc: 'Group reports into dashboards and build each report from a connected source so every number can be traced.', body };
};
