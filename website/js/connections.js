import { createStage } from '../three/stage.js';
import { connWorksScene } from '../three/conn-works.js';
import { buildConnections } from '../three/connections.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);

// Hero scene: plays its intro right away
const hero = createStage(document.querySelector('[data-stage="conn-hero"]'), buildConnections({ mode: 'hero' }), { exposure: 1.3 });
hero?.play?.();

// Fan-out scene: outputs light up as each step scrolls in
const fanEl = document.querySelector('[data-stage="conn-fan"]');
const fan = createStage(fanEl, buildConnections({ mode: 'scroll' }), { exposure: 1.3 });
const steps = [...document.querySelectorAll('[data-step]')];

if (fan && hasGsap && !reduced) {
  ScrollTrigger.create({ trigger: fanEl, start: 'top 85%', once: true, onEnter: () => fan.play() });
  steps.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 62%', end: 'bottom 62%',
      onToggle: (self) => {
        el.classList.toggle('is-on', self.isActive);
      },
      onEnter: () => gsap.to(fan.state.lit, { [i]: 1, duration: 0.9, ease: 'power3.out' }),
      onLeaveBack: () => gsap.to(fan.state.lit, { [i]: 0, duration: 0.6, ease: 'power2.out' }),
    });
  });
  gsap.to(fan.state, { progress: 1, ease: 'none', scrollTrigger: { trigger: '.cn-fan-grid', start: 'top top+=70', end: 'bottom bottom', scrub: true } });
} else {
  fan?.play?.();
  steps.forEach((el) => el.classList.add('is-on'));
}

// Product card: pointer tilt on desktop
const tilt = document.querySelector('[data-tilt] .cn-ui');
if (tilt && !reduced && matchMedia('(hover:hover) and (min-width: 981px)').matches) {
  const box = tilt.parentElement;
  box.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateY(${-9 + x * 6}deg) rotateX(${3 - y * 5}deg) rotateZ(.6deg)`;
  });
  box.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
}

// Works-with hub: hovering a card lifts its tile in the scene
const wHooks = {};
createStage(document.querySelector('[data-stage="conn-works"]'), (api) => connWorksScene(api, wHooks));
document.querySelectorAll('.cn-works-card').forEach((a, i) => {
  a.addEventListener('pointerenter', () => wHooks.set?.(i)); a.addEventListener('focus', () => wHooks.set?.(i));
  a.addEventListener('pointerleave', () => wHooks.set?.(-1)); a.addEventListener('blur', () => wHooks.set?.(-1));
});

if (hasGsap && !reduced) {
  gsap.from('[data-hero]', { y: 28, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.1 });
  gsap.from('.cn-tilt', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.cn-list-grid', start: 'top 75%' } });
}
