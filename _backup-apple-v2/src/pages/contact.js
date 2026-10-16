module.exports = ({ LOGIN }) => ({
  file: 'contact.html',
  title: 'Request a demo | Cognax',
  desc: 'Talk to the Cognax team and see the workspace on your own documents.',
  body: `
<section class="page-head"><div class="wrap"><h1>Request a demo</h1><p class="lede">Tell us what you work with and we will show Cognax on something close to it.</p></div></section>
<section class="section" style="padding-top:32px"><div class="wrap two">
  <form class="card" id="contact-form" novalidate>
    <div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="email">Work email</label><input id="email" name="email" type="email" autocomplete="email" required><small>We will only use this to reply to you.</small></div>
    <div class="field"><label for="company">Company</label><input id="company" name="company" autocomplete="organization"></div>
    <div class="field"><label for="msg">What would you like to ask Cognax?</label><textarea id="msg" name="msg" placeholder="For example: contracts, vendor reports, weekly decks"></textarea></div>
    <button class="btn btn-brand btn-lg" type="submit">Send request</button>
    <p id="form-status" role="status" class="muted" style="margin-top:14px"></p>
  </form>
  <div>
    <h2 style="font-size:1.8rem;margin-bottom:24px">What happens next</h2>
    <ol class="steps-list">
      <li><b>We read your note</b><span>A person on the team reviews it and replies by email.</span></li>
      <li><b>We plan a short walkthrough</b><span>Focused on the documents and data you described.</span></li>
      <li><b>You try it your way</b><span>Bring a file you know well and check the answers yourself.</span></li>
    </ol>
    <p class="muted" style="margin-top:32px">Already a customer? <a class="link-arrow" href="${LOGIN}">Sign in</a></p>
  </div>
</div></section>`,
});
