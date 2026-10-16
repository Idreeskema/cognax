import { createStage, reduced } from '../three/stage.js';
import { worksScene } from '../three/pres-works.js';
import { heroScene, buildScene, latestScene } from '../three/presentations.js';

const $ = (s, r = document) => r.querySelector(s);
const hasST = !!(window.gsap && window.ScrollTrigger);

/* hero: cover-flow scrubbed by scroll while the section is pinned (desktop) or while passing (mobile) */
const hero = createStage($('[data-stage="pres-hero"]'), (api) => heroScene(api));
const countB = $('.px-count b'), barI = $('.px-bar i');
const setCount = (p) => { countB.textContent = String(Math.round(p * 4) + 1); barI.style.transform = `scaleX(${p})`; };
if (reduced) { if (hero) hero.state.progress = 0; setCount(0); }
else if (hero && hasST) {
  const mm = gsap.matchMedia();
  const drive = (self) => { hero.state.progress = self.progress; setCount(self.progress); };
  mm.add('(min-width: 981px)', () => {
    ScrollTrigger.create({ trigger: '.px-hero', start: 'top top+=76', end: 'bottom bottom', scrub: 0.7, onUpdate: drive });
  });
  mm.add('(max-width: 980px)', () => {
    ScrollTrigger.create({ trigger: '.px-hero-stage', start: 'top 85%', end: 'bottom 15%', scrub: 0.7, onUpdate: drive });
  });
}

/* start from the data */
const build = createStage($('[data-stage="pres-build"]'), (api) => buildScene(api));
if (build && !reduced && hasST) {
  ScrollTrigger.create({ trigger: '.px-from-stage', start: 'top 80%', end: 'bottom 45%', scrub: 0.6, onUpdate: (s) => (build.state.progress = s.progress) });
}

/* latest figures: the button (or a gentle auto cycle) changes the source */
const hooks = {};
createStage($('[data-stage="pres-latest"]'), (api) => latestScene(api, hooks));
const live = $('#px-live'), btn = $('#px-change');
const names = ['The slide matches the sheet.', 'Two rows changed in the sheet. The slide followed.', 'Two more rows changed. The slide followed again.'];
hooks.onVersion = (i, changed) => {
  live.textContent = i === 0 ? names[0] : names[i] ;
};
let ver = 0, touched = false, timer = 0;
const next = () => { ver = (ver + 1) % (hooks.versions || 3); hooks.setVersion?.(ver); };
btn.addEventListener('click', () => { touched = true; clearInterval(timer); next(); });
if (!reduced && hooks.setVersion) {
  const io = new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting && !touched) timer = setInterval(next, 4200);
  }, { threshold: 0.5 });
  io.observe($('.px-latest-stage'));
}

createStage($('[data-stage="pres-works"]'), (api) => worksScene(api));

if (!reduced && hasST) {
  gsap.from('.px-hero .reveal', { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.09, delay: 0.1 });
  document.querySelectorAll('.px-from .row-copy > *, .px-latest .row-copy > *, .px-works-copy > *').forEach((el) => gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
}

