import { createStage, reduced } from '../three/stage.js';
import { buildHero } from '../three/naxie.js';
import { buildNumbers } from '../three/naxie-numbers.js';
import { buildThreads } from '../three/naxie-threads.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const gsap = window.gsap, ST = window.ScrollTrigger;
const canMotion = !reduced && gsap && ST;

// ---- hero: time-based arrival, scroll-driven camera ----
const heroStage = createStage($('[data-stage="nx-hero"]'), buildHero, { exposure: 1.1, keyIntensity: 1.5 });
if (heroStage && canMotion) {
  const st = heroStage.state;
  gsap.to(st, { intro: 1, duration: 3.2, ease: 'none', delay: 0.25 });
    ST.create({ trigger: $('[data-nx-track]'), start: 'top top+=96', end: 'bottom bottom', scrub: 0.7, onUpdate: (s) => { st.progress = s.progress; } });
}

// ---- feature scenes driven by scroll ----
function scrubScene(el, build, opts) {
  const s = createStage(el, build, opts);
  if (s && canMotion) {
    ST.create({ trigger: el, start: 'top 85%', end: 'bottom 30%', scrub: 0.6, onUpdate: (self) => { s.state.progress = self.progress; } });
  }
  return s;
}
scrubScene($('[data-stage="nx-numbers"]'), buildNumbers, { exposure: 1.1, keyIntensity: 1.5 });
scrubScene($('[data-stage="nx-threads"]'), buildThreads, { exposure: 1.1, keyIntensity: 1.5 });

// ---- clause card: pointer tilt + highlight wipe ----
const card = $('.nx-clause');
if (card && canMotion) {
  const inner = $('.nx-clause-tilt', card);
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(inner, { rotateY: -10 + x * 8, rotateX: 4 - y * 7, duration: 0.6, ease: 'power3.out' });
  });
  card.addEventListener('pointerleave', () => gsap.to(inner, { rotateY: -10, rotateX: 4, duration: 0.9, ease: 'power3.out' }));
  gsap.set(inner, { rotateY: -10, rotateX: 4 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 70%' } });
  tl.from('.nx-ans', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo('.nx-mark', { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', duration: 1.1, ease: 'power2.inOut' }, '-=0.1');
}
