module.exports = (ctx) => {
  const body = `
${ctx.localnav('Presentations', [{ href: '#overview', label: 'Overview' }, { href: '#from-data', label: 'From data' }, { href: '#latest', label: 'Latest figures' }])}

<section class="ahero px-hero" id="overview" aria-labelledby="px-h1">
  <div class="wrap">
    <h1 id="px-h1" class="reveal">Decks that build themselves from your data.</h1>
    <p class="lede reveal">Create presentations from the data you have connected, and keep them in one list you can search, share and reopen.</p>
    <div class="cta-row reveal"><a class="pill lg" href="contact.html">Request a demo</a><a class="alink" href="#from-data">How a deck gets made</a></div>
  </div>
  <div class="px-flip">
    <div class="px-pin">
      <div class="wrap wide px-pin-in">
        <div class="stage3d px-hero-stage" data-stage="pres-hero" role="img" aria-label="A stack of slides dealing out into a row that flips through as you scroll, fed by a spreadsheet"><span class="fallback">Slides generated from a spreadsheet</span></div>
        <p class="px-progress" aria-hidden="true"><span class="px-count">Slide <b>1</b> of 5</span><span class="px-bar"><i></i></span></p>
      </div>
    </div>
  </div>
</section>

<section class="sec gray px-from" id="from-data" aria-labelledby="px-f-h">
  <div class="wrap wide">
    <h2 id="px-f-h">Start from the data, not a blank slide.</h2>
    <p class="lede">Pick a connection, create a presentation and let Cognax generate the first draft of the deck from it.</p>
    <div class="cta-row"><a class="alink" href="connections.html">About connections</a></div>
    <div class="stage3d px-from-stage sec-visual" data-stage="pres-build" role="img" aria-label="Slides emerging one by one from a spreadsheet"><span class="fallback">Slides emerging from a spreadsheet</span></div>
    <p class="muted px-points">Generated from connected data &middot; My presentations and shared decks in separate views &middot; Search across everything you have made</p>
  </div>
</section>

<section class="sec px-latest" id="latest" aria-labelledby="px-l-h">
  <div class="wrap wide">
    <h2 id="px-l-h">Always the latest figures.</h2>
    <p class="lede">Because decks come from connected sources, refreshing the story means starting from current data rather than copying numbers by hand.</p>
    <div class="cta-row px-demo"><button class="pill lg" type="button" id="px-change">Change the source data</button><span class="px-live" id="px-live" aria-live="polite">The slide matches the sheet.</span></div>
    <div class="stage3d px-latest-stage sec-visual" data-stage="pres-latest" role="img" aria-label="A spreadsheet feeding a slide: when a cell changes, the chart and total on the slide update"><span class="fallback">Spreadsheet feeding a slide</span></div>
    <p class="muted px-points">Less copy and paste between tools &middot; One source behind dashboards and decks &middot; Share the result with the people who need it</p>
  </div>
</section>

<section class="sec gray px-works" aria-labelledby="px-w-h">
  <div class="wrap">
    <h2 id="px-w-h" class="px-works-h">Works with</h2>
    <p class="lede">Presentations reuse the sources behind your dashboards.</p>
    <nav class="cta-row" aria-label="Related products"><a class="alink" href="dashboards.html">Dashboards</a><a class="alink" href="connections.html">Connections</a><a class="alink" href="naxie.html">Naxie</a></nav>
  </div>
</section>

${ctx.cta('Skip the Monday-morning slide rebuild', 'Show us the deck you rebuild every week. We will show you how Cognax handles it.')}
`;
  return { file: 'presentations.html', title: 'Presentations | Cognax', desc: 'Create presentations from your connected data and keep every deck current, searchable and shareable.', body };
};
