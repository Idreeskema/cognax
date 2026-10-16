module.exports = (ctx) => {
  const { LOGIN, cta, localnav } = ctx;
  const body = `
${localnav('Naxie', [{ href: '#overview', label: 'Overview' }, { href: '#clause', label: 'Find a clause' }, { href: '#numbers', label: 'Your numbers' }, { href: '#threads', label: 'Conversations' }])}
<section class="ahero" id="overview" aria-labelledby="nx-h1">
  <div class="wrap">
    <h1 id="nx-h1">Ask. Then check the answer.</h1>
    <p class="lede">Naxie answers from your uploaded documents, extracted data and dashboards, and shows where each answer came from.</p>
    <div class="cta-row"><a class="pill lg" href="contact.html">Request a demo</a><a class="alink" href="${LOGIN}">Sign in</a></div>
  </div>
  <div class="nx-track" data-nx-track>
    <div class="nx-sticky">
      <div class="nx-sticky-in">
        <div class="stage3d" data-stage="nx-hero" role="img" aria-label="A question and its answer floating in front of the source document, with a line from the answer's citation to the highlighted passage"><span class="fallback">A question, its answer, and the passage it came from.</span></div>
        <p class="nx-cap" data-step="0" aria-hidden="true">
          <span>Ask in plain language.</span>
          <span>Every answer links to the passage it came from.</span>
          <span>Read it for yourself before you act.</span>
        </p>
      </div>
    </div>
  </div>
</section>

<section class="sec gray nx-sec-clause" id="clause">
  <div class="wrap">
    <h2>Find the clause, not just a summary.</h2>
    <p class="lede">Naxie points you to the passage in the document, so you can read it yourself before you act on it.</p>
    <div class="nx-clause sec-visual" aria-label="Illustration: an answer pointing at a clause in a contract">
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

<section class="sec nx-sec-numbers" id="numbers">
  <div class="wrap">
    <h2>Ask questions of your numbers.</h2>
    <p class="lede">Totals, trends and comparisons from the tables and dashboards already in your workspace, without building a query.</p>
    <div class="stage3d wide sec-visual nx-wide" data-stage="nx-numbers" role="img" aria-label="Illustration: a bar chart of monthly spend with a question above it and Naxie's answer below"><span class="fallback">A chart of monthly spend and Naxie's answer.</span></div>
  </div>
</section>

<section class="sec gray nx-sec-threads" id="threads">
  <div class="wrap">
    <h2>Pick a thread back up.</h2>
    <p class="lede">Every question is saved as a conversation. Add a follow-up and keep working from where you stopped.</p>
    <div class="stage3d wide sec-visual nx-wide" data-stage="nx-threads" role="img" aria-label="Illustration: a list of saved conversations, one opened with a new follow-up"><span class="fallback">A list of saved conversations, one opened.</span></div>
  </div>
</section>

<section class="sec nx-with">
  <div class="wrap">
    <p class="muted">Naxie answers from what you have already put into Cognax.</p>
    <div class="cta-row"><a class="alink" href="knowledge-base.html">Knowledge Base</a><a class="alink" href="dashboards.html">Dashboards</a><a class="alink" href="connections.html">Connections</a></div>
  </div>
</section>
${cta('See Naxie answer from your own documents', 'Book a walkthrough and bring a document you know well. You will know within minutes whether the answers hold up.')}`;
  return { file: 'naxie.html', title: 'Naxie: ask, then check the answer | Cognax', desc: 'Naxie is the Cognax assistant. Ask about uploaded documents, extracted data and dashboards, and see where each answer came from.', body };
};
