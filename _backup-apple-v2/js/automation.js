import { createStage } from '../three/stage.js';
import { buildPipeline } from '../three/automation.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);

const hero = createStage(document.querySelector('[data-stage="auto-hero"]'), buildPipeline({ mode: 'hero' }), { shadows: true, exposure: 1.1 });
hero?.play?.();

const seqEl = document.querySelector('[data-stage="auto-seq"]');
const seq = createStage(seqEl, buildPipeline({ mode: 'track' }), { shadows: true, exposure: 1.1 });
const blocks = [...document.querySelectorAll('[data-au-stage]')];
const rail = [...document.querySelectorAll('.au-rail li')];

if (seq && hasGsap && !reduced) {
  ScrollTrigger.create({ trigger: seqEl, start: 'top 95%', once: true, onEnter: () => seq.play() });
  // camera progress: from first block reaching mid-screen to last block leaving it
  const first = blocks[0], last = blocks[blocks.length - 1];
  gsap.to(seq.state, {
    progress: 1, ease: 'none',
    scrollTrigger: {
      trigger: first, endTrigger: last, start: () => 'center ' + Math.round(innerHeight * 0.78), end: () => 'center ' + Math.round(innerHeight * 0.78), scrub: 0.6,
      onUpdate: () => { const s = Math.round(seq.state.progress * 2); rail.forEach((li, i) => li.classList.toggle('on', i === s)); },
    },
  });
  blocks.forEach((el) => ScrollTrigger.create({ trigger: el, start: () => 'top ' + Math.round(innerHeight * 0.8), end: () => 'bottom ' + Math.round(innerHeight * 0.8), onToggle: (s) => el.classList.toggle('is-on', s.isActive) }));
} else {
  seq?.play?.();
  blocks.forEach((el) => el.classList.add('is-on'));
}

if (hasGsap && !reduced) {
  gsap.from('[data-hero]', { y: 22, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.05 });
}



