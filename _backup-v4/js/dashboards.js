import { createStage, reduced } from '../three/stage.js';
import { donutScene, pieScene, lineScene } from '../three/dash-charts.js';
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
    trigger: '.dx-groups', start: 'top top+=76', end: 'bottom bottom', scrub: 0.6,
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
  /* pin the section and step through the rows as the user scrolls, then release */
  show(-1);
  let last = -1;
  const pinEl = $('.dx-source-pin');
  const navH = () => ($('.nav')?.offsetHeight || 44) + 12;
  /* pin heading + table together while they fit below the nav; on small screens just step through without pinning */
  const fits = () => pinEl.offsetHeight <= innerHeight - navH();
  if (window.ScrollTrigger) ScrollTrigger.create({
    trigger: pinEl, start: () => (fits() ? `top top+=${navH()}` : 'top 60%'), end: () => `+=${rows.length * 120}`, pin: fits(), anticipatePin: 1, invalidateOnRefresh: true,
    onUpdate(self) {
      const i = Math.min(rows.length - 1, Math.floor(self.progress * rows.length));
      if (i === last || self.progress === 0) return;
      last = i; sHooks.set?.(i); show(i);
    },
    onLeaveBack() { last = -1; sHooks.set?.(-1); show(-1); },
  });
  /* the 3D stages and fonts change page height after load; re-measure the pins */
  addEventListener('load', () => window.ScrollTrigger?.refresh());
}

/* chart types: 3D donut, pie and line; legend rows and slices highlight each other */
[['dash-donut', donutScene], ['dash-pie', pieScene]].forEach(([name, scene]) => {
  const hooks = {};
  const el = $(`[data-stage="${name}"]`);
  createStage(el, (api) => scene(api, hooks));
  const lis = $$('.dx-legend li', el.parentElement);
  hooks.onHover = (i) => lis.forEach((li, k) => li.classList.toggle('is-on', k === i));
  lis.forEach((li, k) => { li.addEventListener('pointerenter', () => { hooks.set?.(k); hooks.onHover(k); }); li.addEventListener('pointerleave', () => { hooks.set?.(-1); hooks.onHover(-1); }); });
});
createStage($('[data-stage="dash-line"]'), (api) => lineScene(api));

/* light reveals for copy */
if (!reduced && window.gsap && window.ScrollTrigger) {
  gsap.from('.dx-hero .reveal', { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.09, delay: 0.1 });
  const cs = { trigger: '.dx-chart-grid', start: 'top 80%', once: true };
  gsap.from('.dx-card', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, scrollTrigger: cs });
  $$('.dx-source .row-copy > *, .dx-works > *').forEach((el) => gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
}
