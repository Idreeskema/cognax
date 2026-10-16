import { createStage, reduced } from '../three/stage.js';
import { buildKb } from '../three/knowledge-base.js';
import { buildFlow } from '../three/kb-flow.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const gsap = window.gsap, ST = window.ScrollTrigger;
const canMotion = !reduced && gsap && ST;

// ---- hero: shelf -> grid -> filters, driven by scroll (or by the chips) ----
const stage = createStage($('[data-stage="kb-hero"]'), buildKb, { exposure: 1.0, keyIntensity: 1.5 });
const chips = $$('.kb-chip');
const setChip = (i) => chips.forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
if (stage) {
  const st = stage.state;
  // scroll segments: [0, .2] fan out, then four equal filter steps
  const seg = [0.2, 0.4, 0.6, 0.8];
  let trig = null;
  if (canMotion) {
    trig = ST.create({
      trigger: $('[data-kb-track]'), start: 'top top+=88', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (s) => {
        const p = s.progress;
        st.fan = Math.min(1, p / 0.2);
        const f = p < 0.2 ? 0 : p < 0.4 ? 0 : p < 0.6 ? 1 : p < 0.8 ? 2 : 3;
        if (st.filter !== f) { st.filter = f; setChip(f); }
      },
    });
  }
  chips.forEach((c) => c.addEventListener('click', () => {
    const i = +c.dataset.i;
    if (trig) {
      const mid = [0.3, 0.5, 0.7, 0.9][i];
      window.scrollTo({ top: trig.start + (trig.end - trig.start) * mid, behavior: 'smooth' });
    } else {
      st.filter = i; setChip(i); st.refresh?.();
    }
  }));
}

// ---- upload-once flow, scrubbed ----
const flow = createStage($('[data-stage="kb-flow"]'), buildFlow, { exposure: 1.0, keyIntensity: 1.5 });
if (flow && canMotion) {
  ST.create({ trigger: $('[data-stage="kb-flow"]'), start: 'top 85%', end: 'bottom 25%', scrub: 0.6, onUpdate: (s) => { flow.state.progress = s.progress; } });
}

// ---- filterable library card ----
const lib = $('[data-lib]');
if (lib) {
  const rows = $$('tbody tr', lib), tbody = $('tbody', lib);
  const active = { status: null, domain: null, tag: null };
  const count = $('[data-count]', lib), clear = $('[data-clear]', lib);
  const sortBtns = $$('.kb-sort', lib);
  let sort = { by: null, dir: 1 };
  const apply = () => {
    let n = 0;
    rows.forEach((r) => {
      const ok = (!active.status || r.dataset.status === active.status) && (!active.domain || r.dataset.domain === active.domain) && (!active.tag || r.dataset.tags.split(', ').includes(active.tag));
      r.hidden = !ok; if (ok) n++;
    });
    count.textContent = `Showing ${n} of ${rows.length} files`;
    clear.hidden = !(active.status || active.domain || active.tag);
    if (canMotion) gsap.fromTo(rows.filter((r) => !r.hidden), { opacity: 0.35 }, { opacity: 1, duration: 0.5, stagger: 0.03, ease: 'power2.out' });
  };
  $$('.kb-f', lib).forEach((b) => b.addEventListener('click', () => {
    const g = b.dataset.g, on = b.getAttribute('aria-pressed') !== 'true';
    $$(`.kb-f[data-g="${g}"]`, lib).forEach((x) => x.setAttribute('aria-pressed', 'false'));
    if (on) b.setAttribute('aria-pressed', 'true');
    active[g] = on ? b.dataset.v : null;
    apply();
  }));
  clear.addEventListener('click', () => { Object.keys(active).forEach((k) => (active[k] = null)); $$('.kb-f', lib).forEach((x) => x.setAttribute('aria-pressed', 'false')); apply(); });
  sortBtns.forEach((b) => b.addEventListener('click', () => {
    const by = b.dataset.sort;
    sort = { by, dir: sort.by === by ? -sort.dir : 1 };
    sortBtns.forEach((x) => { x.removeAttribute('data-dir'); x.setAttribute('aria-pressed', 'false'); });
    b.dataset.dir = sort.dir; b.setAttribute('aria-pressed', 'true');
    const sorted = [...rows].sort((a, c) => (by === 'name' ? a.dataset.name.localeCompare(c.dataset.name) : +a.dataset.i - +c.dataset.i) * sort.dir);
    sorted.forEach((r) => tbody.appendChild(r));
  }));

  const tilt = $('.kb-lib-tilt', lib);
  if (canMotion && tilt && matchMedia('(min-width: 981px)').matches) {
    gsap.set(tilt, { rotateY: 7, rotateX: 3 });
    lib.addEventListener('pointermove', (e) => {
      const r = lib.getBoundingClientRect();
      gsap.to(tilt, { rotateY: 7 + ((e.clientX - r.left) / r.width - 0.5) * -6, rotateX: 3 - ((e.clientY - r.top) / r.height - 0.5) * 5, duration: 0.6, ease: 'power3.out' });
    });
    lib.addEventListener('pointerleave', () => gsap.to(tilt, { rotateY: 7, rotateX: 3, duration: 0.9, ease: 'power3.out' }));
  }
}
