/* Connections page: hero list rows arrive, the processing row turns Ready; the source-to-outputs rails draw in view. */
(function () {
  var CX = window.CX || {};
  if (!CX.motion) return;
  var gsap = CX.gsap;
  var rows = document.querySelectorAll('[data-row]');
  var flip = document.getElementById('cnFlip');

  gsap.set(rows, { autoAlpha: 0, y: 12 });
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to(rows, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.4);
  if (flip) {
    tl.to(flip, { scale: 0.9, autoAlpha: 0, duration: 0.2, ease: 'power2.in', delay: 1.0, onComplete: function () {
      flip.textContent = 'Ready'; flip.className = 'tag tag--ok';
    } }, '>')
      .to(flip, { scale: 1, autoAlpha: 1, duration: 0.35 });
  }

  if (!window.ScrollTrigger) return;
  var map = document.getElementById('cnMap');
  var lines = map.querySelectorAll('.cn-rails i');
  var outs = map.querySelectorAll('.cn-outs li');
  gsap.set(outs, { autoAlpha: 0, x: 16 });
  gsap.set(lines, { '--s': 0 });
  ScrollTrigger.create({ trigger: map, start: 'top 78%', once: true, onEnter: function () {
    gsap.to(lines, { '--s': 1, duration: 0.5, ease: 'power2.out', stagger: 0.12 });
    gsap.to(outs, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12, delay: 0.2 });
  } });
})();
