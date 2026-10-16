module.exports = (ctx) => {
  const { LOGIN, cta } = ctx;
  const body = `
<section class="nx-hero" aria-labelledby="nx-h1">
  <div class="wrap nx-hero-grid">
    <div class="nx-hero-copy">
      <h1 id="nx-h1"><span>Ask about your work.</span> <span>Check the answer.</span></h1>
      <p class="lede">Naxie is the Cognax assistant. Ask about uploaded documents, extracted data and dashboards, and see where each answer came from.</p>
      <div class="hero-actions"><a class="btn btn-primary btn-lg" href="contact.html">Request a demo</a><a class="btn btn-ghost btn-lg" href="${LOGIN}">Sign in</a></div>
    </div>
    <div class="nx-stage">
      <div class="stage3d" data-stage="nx-hero" role="img" aria-label="A question and its answer floating in front of the source document, with a line from the answer's citation to the highlighted passage"><span class="fallback">A question, its answer, and the passage it came from.</span></div>
      <p class="nx-cap" data-step="0" aria-hidden="true">
        <span>Ask in plain language.</span>
        <span>Every answer links to the passage it came from.</span>
        <span>Read it for yourself before you act.</span>
      </p>
    </div>
  </div>
</section>

<section class="section nx-sec-clause">
  <div class="wrap row">
    <div class="row-copy">
      <h2>Find the clause, not just a summary</h2>
      <p>Ask in plain language and Naxie points you to the passage in the document, so you can read it yourself before you act on it.</p>
      <ul class="ticks"><li>Find a clause in a contract or policy</li><li>Summarize risk or obligations from a document</li><li>Jump from an answer to the source</li></ul>
    </div>
    <div class="nx-clause" aria-label="Illustration: an answer pointing at a clause in a contract">
      <div class="nx-clause-tilt">
        <div class="nx-doc">
          <div class="nx-doc-bar"><b>Services Agreement</b><span>Page 7</span></div>
          <h3>12. Term and termination</h3>
          <p class="dim">12.1 This Agreement begins on the Effective Date and continues for an initial term of twelve (12) months unless ended earlier under this clause.</p>
          <p class="nx-hl"><span class="nx-mark">12.2 Either party may terminate this Agreement for convenience by giving sixty (60) days&rsquo; prior written notice to the other party.</span></p>
          <p class="dim">12.3 On termination, each party will return or delete the other party&rsquo;s confidential information within thirty (30) days.</p>
        </div>
        <div class="nx-ans">
          <small>Naxie</small>
          <p>Either party can end the agreement with 60 days&rsquo; written notice.</p>
          <span class="nx-cite">Services Agreement, p. 7</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section soft nx-sec-numbers">
  <div class="wrap row flip">
    <div class="row-copy">
      <h2>Ask questions of your numbers</h2>
      <p>Naxie works with the tables and dashboards already in your workspace. Ask for totals, trends or comparisons without building a query.</p>
      <ul class="ticks"><li>Totals, trends and comparisons on demand</li><li>Works with extracted data and connected sources</li><li>Explains what a figure means in plain words</li></ul>
    </div>
    <div class="stage3d wide nx-wide" data-stage="nx-numbers" role="img" aria-label="Illustration: a bar chart of monthly spend with a question above it and Naxie's answer below"><span class="fallback">A chart of monthly spend and Naxie's answer.</span></div>
  </div>
</section>

<section class="section nx-sec-threads">
  <div class="wrap row">
    <div class="row-copy">
      <h2>Pick a thread back up</h2>
      <p>Every question is saved as a conversation. Come back later, add a follow-up and keep working from where you stopped.</p>
      <ul class="ticks"><li>Conversations stay in your workspace</li><li>Start a new thread whenever the topic changes</li><li>Follow-ups keep the earlier context</li></ul>
    </div>
    <div class="stage3d wide nx-wide" data-stage="nx-threads" role="img" aria-label="Illustration: a list of saved conversations, one opened with a new follow-up"><span class="fallback">A list of saved conversations, one opened.</span></div>
  </div>
</section>

<section class="nx-with">
  <div class="wrap">
    <p><strong>Naxie answers from what you have already put into Cognax.</strong>
      <span class="nx-with-links"><a href="knowledge-base.html">Knowledge Base</a><a href="dashboards.html">Dashboards</a><a href="connections.html">Connections</a></span></p>
  </div>
</section>
${cta('See Naxie answer from your own documents', 'Book a walkthrough and bring a document you know well. You will know within minutes whether the answers hold up.')}`;
  return { file: 'naxie.html', title: 'Naxie: ask, then check the answer | Cognax', desc: 'Naxie is the Cognax assistant. Ask about uploaded documents, extracted data and dashboards, and see where each answer came from.', body };
};
