/* Knowledge Base page: status filter on the example list (works without GSAP); rows and upload bars appear in view. */
(function () {
  var CX = window.CX || {};
  var gsap = CX.gsap, motion = CX.motion;

  var chips = document.querySelectorAll('.kb-filter [data-f]');
  var rows = document.querySelectorAll('.kb-ft tbody tr');
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.f;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      var shown = [];
      rows.forEach(function (r) {
        var on = f === 'all' || r.dataset.s.split(' ').indexOf(f) > -1;
        r.hidden = !on;
        if (on) shown.push(r);
      });
      if (motion) gsap.fromTo(shown, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out', stagger: 0.05, clearProps: 'opacity,visibility,transform' });
    });
  });

  if (!motion || !window.ScrollTrigger) return;
  var once = function (trigger, fn, start) { ScrollTrigger.create({ trigger: trigger, start: start || 'top 80%', once: true, onEnter: fn }); };

  var lib = document.querySelectorAll('.kb-lib [data-row]');
  gsap.set(lib, { autoAlpha: 0, y: 10 });
  once('.kb-lib', function () { gsap.to(lib, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.2 }); }, 'top 90%');

  var fills = document.querySelectorAll('#kbProg [data-fill]');
  fills.forEach(function (i) { i.style.setProperty('--w', i.dataset.fill + '%'); });
  gsap.set(fills, { scaleX: 0 });
  once('#kbProg', function () { gsap.to(fills, { scaleX: 1, duration: 1.1, ease: 'power3.out', stagger: 0.15, delay: 0.3 }); });
})();
