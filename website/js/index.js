import { createStage } from '../three/stage.js';
import { buildHeroScene } from '../three/home.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// ---- hero 3D ----
const stage = createStage($('[data-stage="home"]'), buildHeroScene, { shadows: false, exposure: 1.08 });
if (stage && (reduced || !window.gsap || !window.ScrollTrigger)) stage.state.progress = 1; // finished still

if (!window.gsap || !window.ScrollTrigger) {
  root.classList.remove('nx-js'); // content is complete without JS motion
} else if (!reduced) {
  const mm = gsap.matchMedia();

  // ---- hero copy intro ----
  gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
    .to('.nx-line > span', { y: 0, duration: 1.3, stagger: 0.12 }, 0)
    .to('.nx-fade', { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.5);

  // ---- hero scroll choreography: files upload into the Cognax window ----
  if (stage) {
    mm.add('(min-width: 981px)', () => {
      const st = ScrollTrigger.create({ trigger: '.nx-hero-pin', start: 'top top+=44', end: 'bottom bottom', scrub: 0.6, onUpdate: (s) => { stage.state.progress = s.progress; } });
      gsap.fromTo('.nx-caption', { opacity: 0, y: 10 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.nx-hero-pin', start: '55% bottom', end: '80% bottom', scrub: true } });
      return () => { st.kill(); stage.state.progress = 0; };
    });
    mm.add('(max-width: 980px)', () => {
      // not pinned: play the upload sequence once when the visual enters the viewport
      const tw = { t: null };
      const st = ScrollTrigger.create({ trigger: '.nx-hero-visual', start: 'top 80%', once: true, onEnter: () => { tw.t = gsap.to(stage.state, { progress: 1, duration: 6, ease: 'none' }); } });
      return () => { st.kill(); tw.t?.kill(); stage.state.progress = 0; };
    });
  }

  // ---- tools index: scroll + hover drive the preview ----
  const rows = $$('.nx-ix'), pvs = $$('.nx-pv');
  const setTool = (i) => {
    rows.forEach((r, k) => r.classList.toggle('is-on', k === i));
    pvs.forEach((p, k) => p.classList.toggle('is-on', k === i));
  };
  mm.add('(min-width: 981px)', () => {
    // hold the list in place and step through the tools as the user scrolls, then release the page
    const sts = [ScrollTrigger.create({ trigger: '.nx-index', start: 'top top+=76', end: `+=${rows.length * 110}`, pin: true, anticipatePin: 1,
      onUpdate: (s) => setTool(Math.min(rows.length - 1, Math.floor(s.progress * rows.length))) })];
    const hovers = rows.map((r, i) => {
      const f = () => setTool(i);
      r.addEventListener('mouseenter', f); r.addEventListener('focus', f);
      return () => { r.removeEventListener('mouseenter', f); r.removeEventListener('focus', f); };
    });
    const wrap = $('.nx-pv-wrap'), tilt = $('.nx-pv-tilt');
    const mv = (e) => {
      const b = wrap.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      gsap.to(tilt, { rotateY: -9 + x * 8, rotateX: 3 - y * 6, duration: 0.8, ease: 'power3.out' });
    };
    wrap.addEventListener('pointermove', mv);
    return () => { sts.forEach((s) => s.kill()); hovers.forEach((h) => h()); wrap.removeEventListener('pointermove', mv); };
  });

  // ---- how it works: one scrubbed timeline builds the product card ----
  const q = $('.nx-typed').textContent;
  const typed = { n: q.length };
  const steps = $$('.nx-steps li');
  const setStep = (i) => steps.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-done', k < i); });

  gsap.set('.nx-chat, .nx-source', { opacity: 0, y: 24 });
  gsap.set('.nx-answer', { opacity: 0, y: 12 });
  gsap.set('.nx-mark', { backgroundSize: '0% 100%' });
  gsap.set('.nx-prog u', { scaleX: 0, transformOrigin: 'left' });
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.to('.nx-prog u', { scaleX: 1, stagger: 0.14, duration: 0.5 }, 0.15)
    .to('.nx-chat', { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 1.0)
    .fromTo(typed, { n: 0 }, { n: q.length, duration: 0.8, onUpdate() { $('.nx-typed').textContent = q.slice(0, Math.round(typed.n)); $('.nx-caret').classList.toggle('is-on', typed.n < q.length || this.progress() < 1); } }, 1.05)
    .to('.nx-answer', { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 2.0)
    .to('.nx-source', { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 2.45)
    .to('.nx-mark', { backgroundSize: '100% 100%', duration: 0.5 }, 2.7)
    .to('.nx-card', { rotateY: -4, rotateX: 2, duration: 3.2 }, 0);
  tl.to({}, { duration: 0.3 });
  const total = tl.duration();
  const stat = $$('.nx-fstat');
  let lastStep = -1;
  ScrollTrigger.create({
    trigger: '.nx-how-pin', start: 'top top+=76', end: 'bottom bottom', scrub: 0.5, animation: tl,
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

  // ---- statement underline ----
  gsap.to('.nx-under', { backgroundSize: '100% .09em', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.nx-statement h2', start: 'top 70%' } });
}
