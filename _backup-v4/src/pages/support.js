module.exports = ({ LOGIN }) => {
  const faqs = [
    ['Signing in', 'How do I sign in?', `Go to <a href="${LOGIN}">the sign-in page</a> and use your email and password, or continue with Google. If you forgot your password, choose &ldquo;Forgot password?&rdquo; on that page.`],
    ['Files', 'Where do I find my files?', 'Files and folders are in the Knowledge Base. Use the filters for status, domain and tags to narrow a long list.'],
    ['Naxie', 'Why is Naxie not answering from my document?', 'Check that the document is in the Knowledge Base and its status shows as ready. Documents that are still processing may not be available yet.'],
    ['Dashboards', 'How do I build a dashboard?', 'Create a connection to your spreadsheet, create a dashboard, then add a report that uses the connection.'],
  ];
  const items = faqs.map(([topic, q, a], i) => `
      <details class="sp-item" data-i="${i}"${i === 0 ? ' open' : ''}>
        <summary><span class="sp-topic">${topic}</span><span class="sp-q">${q}</span></summary>
        <p>${a}</p>
      </details>`).join('');
  return {
    file: 'support.html',
    title: 'Support | Cognax',
    desc: 'Help with signing in and using Cognax.',
    body: `
<section class="sp-hero"><div class="wrap sp-grid">
  <div class="sp-side">
    <h1>Support</h1>
    <p class="lede">Quick answers for the most common questions.</p>
    <div class="stage3d sp-stage" data-stage="support" role="img" aria-label="A question card and its answer card that change as you open each topic"><span class="fallback">Question and answer</span></div>
  </div>
  <div class="sp-main">
    <label class="sp-search"><span class="sr-only">Search the answers</span><input id="sp-q" type="search" placeholder="Search the answers" autocomplete="off"></label>
    <div class="sp-list" id="sp-list">${items}
    </div>
    <p class="sp-empty" id="sp-empty" hidden>Nothing matches that. Send us a note and we will help.</p>
    <div class="sp-still">
      <h2>Still stuck?</h2>
      <p>Send us a note through the contact page and describe what you expected to happen.</p>
      <a class="btn btn-primary" href="contact.html">Contact us</a>
    </div>
  </div>
</div></section>`,
  };
};
