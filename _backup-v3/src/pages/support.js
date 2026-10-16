module.exports = ({ LOGIN }) => ({
  file: 'support.html',
  title: 'Support | Cognax',
  desc: 'Help with signing in and using Cognax.',
  body: `
<section class="page-head"><div class="wrap"><h1>Support</h1><p class="lede">Quick answers for the most common questions.</p></div></section>
<section class="section" style="padding-top:32px"><div class="wrap prose">
  <h2>Signing in</h2><p>Go to <a href="${LOGIN}" style="color:var(--brand)">the sign-in page</a> and use your email and password, or continue with Google. If you forgot your password, choose &ldquo;Forgot password?&rdquo; on that page.</p>
  <h2>Where do I find my files?</h2><p>Files and folders are in the Knowledge Base. Use the filters for status, domain and tags to narrow a long list.</p>
  <h2>Why is Naxie not answering from my document?</h2><p>Check that the document is in the Knowledge Base and its status shows as ready. Documents that are still processing may not be available yet.</p>
  <h2>How do I build a dashboard?</h2><p>Create a connection to your spreadsheet, create a dashboard, then add a report that uses the connection.</p>
  <h2>Still stuck?</h2><p>Send us a note through the <a href="contact.html" style="color:var(--brand)">contact page</a> and describe what you expected to happen.</p>
</div></section>`,
});
