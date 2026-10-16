/* Contact form: client-side validation and success state. There is no backend yet. */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var done = document.getElementById('ct-done');
  var summary = document.getElementById('ct-summary');
  var rules = {
    name: function (v) { return v.trim() ? '' : 'Enter your full name.'; },
    email: function (v) {
      if (!v.trim()) return 'Enter your work email.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter an email address like name@company.com.';
    },
    msg: function (v) { return v.trim() ? '' : 'Tell us what you would like to ask Cognax.'; }
  };
  function check(id) {
    var el = form.elements[id], msg = rules[id](el.value);
    document.getElementById(id + '-err').textContent = msg;
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return msg;
  }
  Object.keys(rules).forEach(function (id) {
    var el = form.elements[id];
    el.addEventListener('blur', function () { if (el.value || el.hasAttribute('aria-invalid')) check(id); });
    el.addEventListener('input', function () { if (el.hasAttribute('aria-invalid')) check(id); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = Object.keys(rules).filter(function (id) { return check(id); });
    if (bad.length) {
      summary.innerHTML = '<b>Fix ' + (bad.length === 1 ? 'this field' : 'these fields') + ' to send your request:</b><ul>' +
        bad.map(function (id) { return '<li><a href="#' + id + '">' + document.getElementById(id + '-err').textContent + '</a></li>'; }).join('') + '</ul>';
      summary.hidden = false;
      form.elements[bad[0]].focus();
      return;
    }
    summary.hidden = true;
    document.getElementById('ct-who').textContent = form.elements.name.value.trim().split(/\s+/)[0];
    document.getElementById('ct-mail').textContent = form.elements.email.value.trim();
    form.hidden = true; done.hidden = false; done.focus();
  });
  summary.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    e.preventDefault(); document.getElementById(a.getAttribute('href').slice(1)).focus();
  });
  document.getElementById('ct-again').addEventListener('click', function () {
    form.reset(); form.hidden = false; done.hidden = true; form.elements.name.focus();
  });
})();
