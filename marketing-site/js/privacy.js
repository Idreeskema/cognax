/* Legal pages: highlight the table-of-contents entry for the section being read. */
(function () {
  var links = [].slice.call(document.querySelectorAll('.lg-toc a'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('on'); a.removeAttribute('aria-current'); });
      var a = map[e.target.id]; if (a) { a.classList.add('on'); a.setAttribute('aria-current', 'true'); }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  [].slice.call(document.querySelectorAll('.lg-sec')).forEach(function (s) { io.observe(s); });
})();
