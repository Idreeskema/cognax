import { createStage } from '../three/stage.js';
import { buildConnections } from '../three/connections.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);
const OFF = 96; // global nav 44 + local nav 52

const hero = createStage(document.querySelector('[data-stage="conn-hero"]'), buildConnections({ mode: 'hero' }), { exposure: 1.3 });
hero?.play?.();

const fanEl = document.querySelector('[data-stage="conn-fan"]');
const fan = createStage(fanEl, buildConnections({ mode: 'scroll' }), { exposure: 1.3 });
const steps = [...document.querySelectorAll('[data-step]')];

if (fan && hasGsap && !reduced) {
  ScrollTrigger.create({ trigger: fanEl, start: `top ${window.innerHeight - 100}`, once: true, onEnter: () => fan.play() });
  steps.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el, start: () => `top ${Math.round(innerHeight * 0.78)}`, end: () => `bottom ${Math.round(innerHeight * 0.78)}`,
      onToggle: (self) => el.classList.toggle('is-on', self.isActive),
      onEnter: () => gsap.to(fan.state.lit, { [i]: 1, duration: 0.9, ease: 'power3.out' }),
      onLeaveBack: () => gsap.to(fan.state.lit, { [i]: 0, duration: 0.6, ease: 'power2.out' }),
    });
  });
  gsap.to(fan.state, { progress: 1, ease: 'none', scrollTrigger: { trigger: '.cn-fan-grid', start: `top ${OFF}`, end: 'bottom bottom', scrub: true } });
} else {
  fan?.play?.();
  steps.forEach((el) => el.classList.add('is-on'));
}

const tilt = document.querySelector('.cn-ui');
if (tilt && !reduced && matchMedia('(hover:hover) and (min-width: 981px)').matches) {
  const box = tilt.parentElement;
  box.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateX(${4 - y * 4}deg) rotateY(${x * 5}deg)`;
  });
  box.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
}

if (hasGsap && !reduced) {
  gsap.from('[data-hero]', { y: 22, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.05 });
  gsap.from('.cn-tilt', { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.cn-tilt', start: 'top 85%' } });
}
