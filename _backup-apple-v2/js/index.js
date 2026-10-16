import { createStage } from '../three/stage.js';
import { buildHeroScene } from '../three/home.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const NAV = 44;

const stage = createStage($('[data-stage="home"]'), buildHeroScene, { shadows: false, exposure: 1.08 });

if (!window.gsap || !window.ScrollTrigger) {
  root.classList.remove('nx-js');
} else if (!reduced) {
  const mm = gsap.matchMedia();

  // hero copy intro
  gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
    .to('.nx-line > span', { y: 0, duration: 1.3, stagger: 0.12 }, 0)
    .to('.nx-fade', { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.5);

  // hero 3D: slabs converge into the mark as the pinned stage scrolls
  if (stage) {
    mm.add('(min-width: 981px)', () => {
      const st = ScrollTrigger.create({ trigger: '.nx-pin', start: `top top+=${NAV}`, end: 'bottom bottom', scrub: 0.6, onUpdate: (s) => { stage.state.progress = s.progress; } });
      gsap.fromTo('.nx-caption', { opacity: 0, y: 10 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.nx-pin', start: '55% bottom', end: '80% bottom', scrub: true } });
      return () => { st.kill(); stage.state.progress = 0; };
    });
    mm.add('(max-width: 980px)', () => {
      const st = ScrollTrigger.create({ trigger: '.nx-stage', start: 'top 55%', end: 'bottom 5%', scrub: 0.6, onUpdate: (s) => { stage.state.progress = s.progress; } });
      return () => { st.kill(); stage.state.progress = 0; };
    });
  }

  // tiles: media rises into place
  $$('[data-tile] .media').forEach((m) => {
    gsap.from(m, { y: 70, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: m, start: 'top 92%', toggleActions: 'play none none none' } });
  });

  // how it works: one scrubbed timeline builds the product card
  const q = $('.nx-typed').textContent;
  const typed = { n: q.length };
  const steps = $$('.nx-steps li');
  const setStep = (i) => steps.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-done', k < i); });

  gsap.set('.nx-chat, .nx-source', { opacity: 0, y: 24 });
  gsap.set('.nx-answer', { opacity: 0, y: 12 });
  gsap.set('.nx-mark', { backgroundSize: '0% 100%' });
  gsap.set('.nx-prog u', { scaleX: 0, transformOrigin: 'left' });
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.fromTo('.nx-card', { rotateX: 14, y: 30 }, { rotateX: 0, y: 0, duration: 1.2, ease: 'power2.out' }, 0)
    .to('.nx-prog u', { scaleX: 1, stagger: 0.14, duration: 0.5 }, 0.15)
    .to('.nx-chat', { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 1.0)
    .fromTo(typed, { n: 0 }, { n: q.length, duration: 0.8, onUpdate() { $('.nx-typed').textContent = q.slice(0, Math.round(typed.n)); $('.nx-caret').classList.toggle('is-on', typed.n < q.length); } }, 1.05)
    .to('.nx-answer', { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 2.0)
    .to('.nx-source', { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 2.45)
    .to('.nx-mark', { backgroundSize: '100% 100%', duration: 0.5 }, 2.7);
  tl.to({}, { duration: 0.3 });
  const total = tl.duration();
  const stat = $$('.nx-fstat');
  let lastStep = -1;
  ScrollTrigger.create({
    trigger: '.nx-how-pin', start: `top top+=${NAV}`, end: 'bottom bottom', scrub: 0.5, animation: tl,
    onUpdate: (s) => {
      const t = s.progress * total;
      stat.forEach((el, i) => {
        const done = t >= 0.15 + i * 0.14 + 0.5;
        el.querySelector('.nx-prog').classList.toggle('is-done', done);
        el.querySelector('em').classList.toggle('is-shown', done);
      });
      const step = t < 1.0 ? 0 : t < 2.4 ? 1 : 2;
      if (step !== lastStep) { lastStep = step; setStep(step); }
    },
  });
  setStep(0);
  $('.nx-typed').textContent = '';

  // statement underline
  gsap.to('.nx-under', { backgroundSize: '100% .07em', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.nx-statement h2', start: 'top 70%' } });
}
