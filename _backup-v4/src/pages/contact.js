module.exports = ({ LOGIN }) => ({
  file: 'contact.html',
  title: 'Request a demo | Cognax',
  desc: 'Talk to the Cognax team and see the workspace on your own documents.',
  body: `
<section class="ct-hero"><div class="wrap ct-grid">
  <div class="ct-copy">
    <h1>Request a demo</h1>
    <p class="lede">Tell us what you work with and we will show Cognax on something close to it.</p>
    <form class="ct-form" id="contact-form" novalidate>
      <div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="email">Work email</label><input id="email" name="email" type="email" autocomplete="email" required><small>We will only use this to reply to you.</small></div>
      <div class="field"><label for="company">Company</label><input id="company" name="company" autocomplete="organization"></div>
      <div class="field"><label for="msg">What would you like to ask Cognax?</label><textarea id="msg" name="msg" placeholder="For example: contracts, vendor reports, weekly decks"></textarea></div>
      <button class="btn btn-brand btn-lg" type="submit">Send request</button>
      <p id="form-status" role="status" class="muted" style="margin-top:14px"></p>
    </form>
  </div>
  <div class="stage3d ct-stage" data-stage="contact" role="img" aria-label="A request card that fills in as you type, with a confirmation appearing once it is sent"><span class="fallback">Request card</span></div>
</div></section>

<section class="ct-next" aria-labelledby="ct-n-h"><div class="wrap">
  <h2 id="ct-n-h">What happens next</h2>
  <div>
    <ol class="ct-steps">
      <li><b>We read your note</b><span>A person on the team reviews it and replies by email.</span></li>
      <li><b>We plan a short walkthrough</b><span>Focused on the documents and data you described.</span></li>
      <li><b>You try it your way</b><span>Bring a file you know well and check the answers yourself.</span></li>
    </ol>
    <p class="ct-signin">Already a customer? <a class="link-arrow" href="${LOGIN}">Sign in</a></p>
  </div>
</div></section>`,
});
