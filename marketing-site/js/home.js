/* Home page behaviour: hero intro, source connector, Naxie example switcher, small in-view moments. */
(function () {
  var CX = window.CX || {};
  var gsap = CX.gsap, motion = CX.motion;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- Naxie example switcher (answers a user action; works without GSAP) ---------- */
  var EX = {
    clause: { q: 'Which clause covers early termination?', a: 'Either party can end the agreement with 60 days’ written notice.', c: 'Services Agreement, section 12.2', dt: 'Services Agreement, 12.2', dp: '…may terminate this Agreement for convenience by giving <mark class="hl">sixty (60) days’ prior written notice</mark> to the other party…' },
    risk: { q: 'Summarize the obligations in this contract.', a: 'The supplier reports monthly. The customer pays within 30 days of invoice and gives 60 days’ written notice to end the agreement.', c: 'Services Agreement, sections 4, 6 and 12', dt: 'Services Agreement, 6.1', dp: '…the Customer shall <mark class="hl">pay each undisputed invoice within thirty (30) days</mark> of receipt…' },
    trend: { q: 'How did vendor spend change by quarter?', a: 'Spend rose every quarter, with the biggest jump between Q2 and Q3.', c: 'Vendor spend.xlsx, Summary sheet', dt: 'Vendor spend.xlsx, Summary', dp: '<mark class="hl">Q1 &rarr; Q2 &rarr; Q3 &rarr; Q4</mark> totals, grouped by vendor and quarter.' }
  };
  var chips = document.querySelectorAll('[data-q]');
  var els = { q: $('#nxQ'), a: $('#nxA'), c: $('#nxCt'), dt: $('#nxDt'), dp: $('#nxDp') };
  function show(key) {
    var d = EX[key]; if (!d || !els.q) return;
    chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.q === key)); });
    var apply = function () { els.q.textContent = d.q; els.a.textContent = d.a; els.c.textContent = d.c; els.dt.textContent = d.dt; els.dp.innerHTML = d.dp; };
    if (!motion) { apply(); return; }
    var box = $('.naxie-demo');
    gsap.killTweensOf(box.children);
    gsap.to(box.children, { opacity: 0, y: -6, duration: 0.12, ease: 'power2.in', onComplete: function () {
      apply();
      gsap.fromTo(box.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power3.out', stagger: 0.08, clearProps: 'opacity,transform' });
    } });
  }
  chips.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.q); }); });

  /* ---------- hero source connector: chat citation -> highlighted clause ---------- */
  var stage = $('#heroStage'), path = $('#heroLinkPath'), dot = $('#heroLinkDot');
  var chip = $('#citeChip'), target = $('#hlTarget');
  var pathLen = 0;
  function layoutLink() {
    if (!stage || !path || !chip || !target || getComputedStyle($('#heroLink')).display === 'none') return;
    var s = stage.getBoundingClientRect(), a = chip.getBoundingClientRect(), b = (function () { var r = target.getClientRects(); return r[r.length - 1]; })();
    var chat = $('.hero-chat').getBoundingClientRect();
    var sx = a.right - s.left, sy = a.top + a.height / 2 - s.top;
    var X = chat.right - s.left + 20, r = 16, r2 = 8;
    var ey = b.bottom - s.top + 2, yh = ey + 14, ex = b.left - s.left + b.width * 0.8;
    path.setAttribute('d', 'M' + sx + ' ' + sy + ' H' + (X - r) + ' Q' + X + ' ' + sy + ' ' + X + ' ' + (sy - r) + ' V' + (yh + r) + ' Q' + X + ' ' + yh + ' ' + (X - r) + ' ' + yh + ' H' + (ex + r2) + ' Q' + ex + ' ' + yh + ' ' + ex + ' ' + (yh - r2) + ' V' + ey);
    pathLen = path.getTotalLength();
    dot.setAttribute('cx', ex); dot.setAttribute('cy', ey);
  }
  layoutLink();
  window.addEventListener('resize', function () { layoutLink(); if (linkDrawn) { path.style.strokeDasharray = 'none'; } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutLink);
  var linkDrawn = !motion;

  /* ---------- hero intro: one orchestrated sequence ---------- */
  if (motion) {
    var hl = $('#hlTarget'), tHl = $('#titleHl');
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('[data-hero-line]', { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 0.9, stagger: 0.1 }, 0.05)
      .fromTo('.hero [data-hero]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.45)
      .fromTo('.hero-doc', { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.3)
      .fromTo('.hero-chat', { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.5)
      .fromTo('#titleHl', { '--hl-w': '0%' }, { '--hl-w': '100%', duration: 0.8, ease: 'power2.inOut' }, 1.0)
      .fromTo('#msgUser', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.3)
      .fromTo('#msgBot', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.9)
      .fromTo(hl, { '--hl-w': '0%' }, { '--hl-w': '100%', duration: 0.8, ease: 'power2.inOut' }, 2.5)
      .add(function () { layoutLink(); if (pathLen) { path.style.strokeDasharray = pathLen; path.style.strokeDashoffset = pathLen; } }, 2.9)
      .to(path, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', onComplete: function () { path.style.strokeDasharray = 'none'; linkDrawn = true; } }, 3.0)
      .fromTo(dot, { attr: { r: 0 } }, { attr: { r: 4.5 }, duration: 0.3, ease: 'back.out(3)' }, 3.55);
    // keep the link hidden until it draws
    gsap.set(dot, { attr: { r: 0 } });
    path.style.strokeDasharray = '2000'; path.style.strokeDashoffset = '2000';
  }

  /* ---------- small in-view moments (reveal once) ---------- */
  if (motion && window.ScrollTrigger) {
    var once = function (trigger, fn, start) { ScrollTrigger.create({ trigger: trigger, start: start || 'top 78%', once: true, onEnter: fn }); };

    var bars = document.querySelectorAll('#dashChart .bar');
    if (bars.length) {
      gsap.set(bars, { transformOrigin: '50% 100%', scaleY: 0 });
      once('#dashChart', function () { gsap.to(bars, { scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07 }); });
    }
    var rows = document.querySelectorAll('[data-row]');
    if (rows.length) {
      gsap.set(rows, { autoAlpha: 0, y: 10 });
      once('.kb-win', function () { gsap.to(rows, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.09, delay: 0.25 }); }, 'top 80%');
    }
    var links = document.querySelectorAll('#pipeline .link');
    if (links.length) {
      gsap.set(links, { transformOrigin: '0 50%', scaleX: 0 });
      var small = window.matchMedia('(max-width: 899px)').matches;
      if (small) gsap.set(links, { transformOrigin: '50% 0', scaleX: 1, scaleY: 0 });
      once('#pipeline', function () { gsap.to(links, small ? { scaleY: 1, duration: 0.4, stagger: 0.15, ease: 'power2.out' } : { scaleX: 1, duration: 0.5, stagger: 0.18, ease: 'power2.out', delay: 0.3 }); });
    }
  }
})();
