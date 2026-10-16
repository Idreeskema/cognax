/* Cognax marketing site - shared behaviour: nav, mobile menu, scroll reveals.
   Page scripts (js/<page>.js) load after this and can use window.CX. */
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var motion = hasGsap && !reduced;

  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  // The inline <head> script adds .motion optimistically; remove it if we cannot animate.
  if (!motion) root.classList.remove('motion');

  window.CX = { reduced: reduced, motion: motion, gsap: hasGsap ? window.gsap : null };

  /* ---------- nav ---------- */
  var burger = document.getElementById('nav-burger');
  var links = document.getElementById('nav-links');
  var trigger = document.getElementById('nav-trigger');
  var panel = document.getElementById('nav-panel');

  function setPanel(open) {
    if (!trigger || !panel) return;
    trigger.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
  }
  function setMenu(open) {
    if (!burger || !links) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links.classList.toggle('is-open', open);
  }
  if (trigger) trigger.addEventListener('click', function () { setPanel(trigger.getAttribute('aria-expanded') !== 'true'); });
  if (burger) burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var wasOpen = trigger && trigger.getAttribute('aria-expanded') === 'true';
    setPanel(false); setMenu(false);
    if (wasOpen) trigger.focus();
  });
  document.addEventListener('click', function (e) {
    if (trigger && panel && !trigger.contains(e.target) && !panel.contains(e.target)) setPanel(false);
    if (links && burger && !links.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });
  if (panel) panel.addEventListener('focusout', function (e) {
    if (e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== trigger) setPanel(false);
  });
  if (links) links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  /* ---------- scroll reveal: [data-reveal] ----------
     Use sparingly (section heads, big visuals). Items revealed in the same batch stagger. */
  if (motion && window.ScrollTrigger) {
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: function (els) {
        gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09, overwrite: true });
      }
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
