/* Data & Automation page: hero dock steps complete in sequence; Prompt Studio fields pair with their marked passage on hover/focus; record rows appear in view. */
(function () {
  var CX = window.CX || {};
  var gsap = CX.gsap, motion = CX.motion;

  // template field <-> source passage pairing (works without GSAP)
  var root = document.getElementById('auStudio');
  if (root) {
    var items = root.querySelectorAll('.au-tpl li'), marks = root.querySelectorAll('.hl[data-f]');
    var set = function (f, on) {
      items.forEach(function (li) { li.classList.toggle('is-on', on && li.dataset.f === f); });
      marks.forEach(function (m) { m.style.outline = on && m.dataset.f === f ? '2px solid var(--source)' : ''; });
    };
    items.forEach(function (li) {
      li.tabIndex = 0;
      li.addEventListener('mouseenter', function () { set(li.dataset.f, true); });
      li.addEventListener('mouseleave', function () { set(li.dataset.f, false); });
      li.addEventListener('focus', function () { set(li.dataset.f, true); });
      li.addEventListener('blur', function () { set(li.dataset.f, false); });
    });
  }

  if (!motion) return;

  // hero: each step completes in turn, the last stays running
  var steps = document.querySelectorAll('.au-step');
  var dots = document.querySelectorAll('.au-step .au-dot');
  gsap.set(steps, { autoAlpha: 0, y: 10 });
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to(steps, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.28 }, 0.4);
  dots.forEach(function (d, i) {
    if (d.querySelector('svg')) tl.fromTo(d, { scale: 0.6 }, { scale: 1, duration: 0.4, ease: 'back.out(2.5)' }, 0.55 + i * 0.28);
  });

  if (!window.ScrollTrigger) return;
  var rows = document.querySelectorAll('[data-row]');
  gsap.set(rows, { autoAlpha: 0, y: 10 });
  ScrollTrigger.create({ trigger: '.au-records', start: 'top 82%', once: true, onEnter: function () {
    gsap.to(rows, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1, delay: 0.3 });
  } });
})();
