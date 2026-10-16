import { createStage, reduced } from '../three/stage.js';
import { heroScene, groupsScene, sourceScene, SOURCE_ROWS } from '../three/dashboards.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* hero */
createStage($('[data-stage="dash-hero"]'), (api) => heroScene(api));

/* groups: sticky section, scroll drives separation + orbit */
const gHooks = {};
const gStage = createStage($('[data-stage="dash-groups"]'), (api) => groupsScene(api, gHooks));
const items = $$('.dx-glist li');
const setActive = (a) => items.forEach((li, i) => li.classList.toggle('is-active', i === a));
if (reduced) { items.forEach((li) => li.classList.add('is-active')); }
else if (gStage && window.ScrollTrigger) {
  ScrollTrigger.create({
    trigger: '.dx-groups', start: 'top top+=96', end: 'bottom bottom', scrub: 0.6,
    onUpdate(self) {
      gStage.state.progress = self.progress;
      const p = self.progress;
      setActive(p < 0.4 ? -1 : Math.min(2, Math.floor(((p - 0.4) / 0.6) * 3)));
    },
  });
}

/* source-backed: hover column <-> row */
const sHooks = {};
createStage($('[data-stage="dash-source"]'), (api) => sourceScene(api, sHooks));
const rows = $$('.dx-tbl tbody tr');
const trace = $('.dx-trace');
let touched = false, timer = 0;
function show(i) {
  rows.forEach((r, k) => r.classList.toggle('is-hot', k === i));
  if (i < 0) { trace.innerHTML = 'Hover a column, or a row, to see where the number comes from.'; return; }
  const r = SOURCE_ROWS[i];
  trace.innerHTML = `<b>${r.vendor}</b> reads <b>${r.v}</b> from <code>vendor_spend.xlsx</code>, row ${r.row}.`;
}
sHooks.onHover = (i, user) => { if (user) { touched = true; clearInterval(timer); } show(i); };
rows.forEach((r, i) => {
  const on = () => { touched = true; clearInterval(timer); sHooks.set?.(i); show(i); };
  r.addEventListener('pointerenter', on); r.addEventListener('focus', on);
  r.addEventListener('pointerleave', () => { sHooks.set?.(-1); show(-1); });
  r.addEventListener('blur', () => { sHooks.set?.(-1); show(-1); });
});
if (reduced) { sHooks.set?.(2); show(2); }
else {
  let n = 0;
  const io = new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting && !touched) timer = setInterval(() => { n = (n + 1) % rows.length; sHooks.set?.(n); show(n); }, 1700);
  }, { threshold: 0.4 });
  io.observe($('.dx-source'));
  show(-1);
}

/* light reveals for copy */
if (!reduced && window.gsap && window.ScrollTrigger) {
  gsap.from('.dx-hero .reveal', { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.09, delay: 0.1 });
  $$('.dx-source .reveal, .dx-works .wrap > *').forEach((el) => gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
}

