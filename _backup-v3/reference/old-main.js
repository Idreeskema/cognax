// Set to your form backend URL (e.g. Formspree, or your own API) to enable the contact form.
const FORM_ENDPOINT = '';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// nav
const burger = document.getElementById('burger');
const links = document.getElementById('links');
burger?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
const drop = document.querySelector('.drop');
const dropBtn = drop?.querySelector('.menu-btn');
dropBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = drop.classList.toggle('open');
  dropBtn.setAttribute('aria-expanded', open);
});
document.addEventListener('click', (e) => { if (drop && !drop.contains(e.target)) { drop.classList.remove('open'); dropBtn.setAttribute('aria-expanded', false); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { drop?.classList.remove('open'); dropBtn?.setAttribute('aria-expanded', false); } });

// cursor spotlight on glass cards
document.querySelectorAll('.glass').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  });
});

// contact form
const form = document.getElementById('contact-form');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('form-status');
  const data = Object.fromEntries(new FormData(form));
  if (!data.name?.trim() || !/^\S+@\S+\.\S+$/.test(data.email || '')) {
    status.textContent = 'Please enter your name and a valid work email.';
    (data.name?.trim() ? form.email : form.name).focus();
    return;
  }
  if (!FORM_ENDPOINT) { status.textContent = 'This form is not connected yet. Please try again later.'; return; }
  status.textContent = 'Sending…';
  try {
    const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error();
    form.reset();
    status.textContent = 'Thanks. We will reply to your email soon.';
  } catch {
    status.textContent = 'Something went wrong sending your request. Please try again.';
  }
});

// statement: split into words so scroll can light them up
const statement = document.getElementById('statement');
if (statement) {
  statement.innerHTML = statement.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
}

window.addEventListener('load', () => {
  if (reduced || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // ambient light drifts slowly
  document.querySelectorAll('.aurora i').forEach((b, i) => {
    gsap.to(b, { x: i % 2 ? -80 : 80, y: i === 2 ? -50 : 40, duration: 9 + i * 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  // hero entrance, one orchestrated sequence
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro.from('[data-hero]', { autoAlpha: 0, y: 28, duration: 1.1, stagger: 0.12 });

  const demo = document.getElementById('demo');
  if (demo) {
    const q = document.getElementById('d-q-text');
    const full = q.textContent;
    q.textContent = '';
    gsap.set('#d-a, #d-ok', { autoAlpha: 0, y: 10 });
    gsap.set('#d-doc', { autoAlpha: 0.25 });
    const state = { n: 0 };
    gsap.timeline({ delay: 1.2, defaults: { ease: 'power2.out' } })
      .to(state, { n: full.length, duration: 1.1, ease: 'none', onUpdate: () => { q.textContent = full.slice(0, Math.round(state.n)); } })
      .to('#d-a', { autoAlpha: 1, y: 0, duration: 0.55 }, '+=0.2')
      .to('#d-doc', { autoAlpha: 1, duration: 0.5 }, '+=0.15')
      .from('#d-mark', { backgroundColor: 'transparent', boxShadow: '0 0 0 1px transparent', duration: 0.7 }, '-=0.1')
      .to('#d-ok', { autoAlpha: 1, y: 0, duration: 0.45 }, '+=0.15');
    // gentle tilt follows the pointer
    const stage = demo.parentElement;
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      gsap.to(demo, { rotateY: ((e.clientX - r.left) / r.width - 0.5) * 4, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 3, duration: 0.8, ease: 'power3.out' });
    });
    stage.addEventListener('pointerleave', () => gsap.to(demo, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power3.out' }));
  }

  // content reveals as it enters
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, { autoAlpha: 0, y: 36, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // charts grow when seen
  gsap.utils.toArray('.bars').forEach((b) => {
    gsap.from(b.children, { scaleY: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: b, start: 'top 92%', once: true } });
  });

  // statement lights up word by word as you scroll
  if (statement) {
    gsap.to('.statement .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  }
});
