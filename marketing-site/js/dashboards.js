/* Dashboards page: tab switch (works without GSAP); hero cards settle in, chart bars grow and source cells highlight in view. */
(function () {
  var CX = window.CX || {};
  var gsap = CX.gsap, motion = CX.motion;

  var tabs = document.querySelectorAll('.db-tabs [data-t]');
  var items = document.querySelectorAll('.db-list li');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.dataset.t, shown = [];
      tabs.forEach(function (c) { c.setAttribute('aria-selected', String(c === b)); });
      items.forEach(function (li) { var on = li.dataset.t === t; li.hidden = !on; if (on) shown.push(li); });
      if (motion) gsap.fromTo(shown, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out', stagger: 0.06, clearProps: 'opacity,visibility,transform' });
    });
  });

  if (!motion) return;
  gsap.fromTo('[data-card]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.2 });

  if (!window.ScrollTrigger) return;
  var bars = document.querySelectorAll('#dbChart .bar');
  var hls = document.querySelectorAll('#dbRep .hl');
  gsap.set(bars, { transformOrigin: '50% 100%', scaleY: 0 });
  ScrollTrigger.create({ trigger: '#dbRep', start: 'top 70%', once: true, onEnter: function () {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(bars, { scaleY: 1, duration: 0.9, stagger: 0.07 }, 0.2)
      .to(hls, { '--hl-w': '100%', duration: 0.7, ease: 'power2.inOut', stagger: 0.12 }, 1.0);
  } });
})();
