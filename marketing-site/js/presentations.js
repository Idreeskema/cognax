/* Presentations page: hero draft assembles once; wizard draft and list rows appear in view. */
(function () {
  var CX = window.CX || {};
  if (!CX.motion) return;
  var gsap = CX.gsap;
  var $$ = function (s) { return document.querySelectorAll(s); };

  // hero: the deck is "generated" - filmstrip fills in, headline lands, bars grow
  var bars = $$('.pr-b');
  gsap.set(bars, { transformOrigin: '50% 100%', scaleY: 0 });
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.pr-strip li', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.09 }, 0.3)
    .fromTo('.pr-main strong', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.5)
    .fromTo('.pr-main .pr-chart', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.9)
    .to(bars, { scaleY: 1, duration: 0.8, stagger: 0.08 }, 0.95);

  if (!window.ScrollTrigger) return;
  var once = function (t, fn, start) { ScrollTrigger.create({ trigger: t, start: start || 'top 78%', once: true, onEnter: fn }); };

  var slides = $$('#prDraft .slide');
  gsap.set(slides, { autoAlpha: 0, y: 14 });
  once('#prWizard', function () { gsap.to(slides, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.12, delay: 0.3 }); });

  var rows = $$('[data-row]');
  gsap.set(rows, { autoAlpha: 0, y: 10 });
  once('.pr-listwin', function () { gsap.to(rows, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.09, delay: 0.25 }); }, 'top 80%');
})();
