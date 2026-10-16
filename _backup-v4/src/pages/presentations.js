module.exports = (ctx) => {
  const body = `
<section class="px-hero" aria-labelledby="px-h1">
  <div class="px-hero-pin wrap">
    <div class="px-hero-copy">
      <h1 id="px-h1" class="reveal">Decks that build themselves from your data</h1>
      <p class="lede reveal">Create presentations from the data you have connected, and keep them in one list you can search, share and reopen.</p>
      <div class="hero-actions reveal"><a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a><a class="btn btn-ghost btn-lg" href="#from-data">How a deck gets made</a></div>
      <div class="px-progress reveal" aria-hidden="true"><span class="px-count">Slide <b>1</b> of 5</span><span class="px-bar"><i></i></span></div>
    </div>
    <div class="stage3d px-hero-stage" data-stage="pres-hero" role="img" aria-label="A stack of slides dealing out into a row that flips through as you scroll, fed by a spreadsheet"><span class="fallback">Slides generated from a spreadsheet</span></div>
  </div>
</section>

<section class="section px-from" id="from-data" aria-labelledby="px-f-h">
  <div class="wrap row flip">
    <div class="row-copy">
      <h2 id="px-f-h">Start from the data, not a blank slide</h2>
      <p>Pick a connection, create a presentation and let Cognax generate the first draft of the deck from it.</p>
      <ul class="ticks">
        <li>Generated from connected data</li>
        <li>My presentations and shared decks in separate views</li>
        <li>Search across everything you have made</li>
      </ul>
    </div>
    <div class="stage3d px-from-stage" data-stage="pres-build" role="img" aria-label="Slides emerging one by one from a spreadsheet"><span class="fallback">Slides emerging from a spreadsheet</span></div>
  </div>
</section>

<section class="section soft px-latest" aria-labelledby="px-l-h">
  <div class="wrap row">
    <div class="row-copy">
      <h2 id="px-l-h">Always the latest figures</h2>
      <p>Because decks come from connected sources, refreshing the story means starting from current data rather than copying numbers by hand.</p>
      <div class="px-demo">
        <button class="btn btn-brand" type="button" id="px-change">Change the source data</button>
        <p class="px-live" id="px-live" aria-live="polite">The slide matches the sheet.</p>
      </div>
      <ul class="ticks">
        <li>Less copy and paste between tools</li>
        <li>One source behind dashboards and decks</li>
        <li>Share the result with the people who need it</li>
      </ul>
    </div>
    <div class="stage3d px-latest-stage" data-stage="pres-latest" role="img" aria-label="A spreadsheet feeding a slide: when a cell changes, the chart and total on the slide update"><span class="fallback">Spreadsheet feeding a slide</span></div>
  </div>
</section>

<section class="px-works" aria-labelledby="px-w-h">
  <div class="wrap px-works-grid">
    <div class="px-works-copy">
    <h2 id="px-w-h" class="px-works-line">Works with <a href="dashboards.html">Dashboards</a>, <a href="connections.html">Connections</a> and <a href="naxie.html">Naxie</a>.</h2>
    <p>Presentations reuse the sources behind your dashboards.</p>
    </div>
    <div class="stage3d px-works-stage" data-stage="pres-works" role="img" aria-label="A slide at the centre with Dashboards, Connections and Naxie orbiting it and feeding it data"><span class="fallback">Dashboards, Connections and Naxie feeding a slide</span></div>
  </div>
</section>

${ctx.cta('Skip the Monday-morning slide rebuild', 'Show us the deck you rebuild every week. We will show you how Cognax handles it.')}
`;
  return { file: 'presentations.html', title: 'Presentations | Cognax', desc: 'Create presentations from your connected data and keep every deck current, searchable and shareable.', body };
};
