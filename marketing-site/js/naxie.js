/* Naxie page: one hero moment (question, answer, source highlight), in-view highlight and bars. */
(function () {
  var CX = window.CX || {};
  var gsap = CX.gsap, motion = CX.motion;
  if (!motion) return;
  var $ = function (s) { return document.querySelector(s); };

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.nx-hero h1, .nx-hero .lede, .nx-hero .btn-row', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.05)
    .fromTo('.nx-app', { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.2)
    .fromTo('#nxHq', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.9)
    .fromTo('#nxHa', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.5)
    .fromTo('#nxHd', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.0)
    .fromTo('#nxHm', { '--hl-w': '0%' }, { '--hl-w': '100%', duration: 0.8, ease: 'power2.inOut' }, 2.4);

  if (!window.ScrollTrigger) return;
  var pm = $('#nxPm');
  if (pm) {
    gsap.set(pm, { '--hl-w': '0%' });
    ScrollTrigger.create({ trigger: '#nxPage', start: 'top 70%', once: true, onEnter: function () {
      gsap.to(pm, { '--hl-w': '100%', duration: 0.9, ease: 'power2.inOut', delay: 0.3 });
    } });
  }
  var bars = document.querySelectorAll('#nxBars .bar');
  if (bars.length) {
    gsap.set(bars, { transformOrigin: '50% 100%', scaleY: 0 });
    ScrollTrigger.create({ trigger: '#nxBars', start: 'top 82%', once: true, onEnter: function () {
      gsap.to(bars, { scaleY: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.3 });
    } });
  }
})();
