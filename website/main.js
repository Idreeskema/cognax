// Shared behaviour: nav, form, GSAP setup. Page-specific motion lives in js/<page>.js.
const FORM_ENDPOINT = ''; // set to your form backend URL to enable the contact form

window.CX = { reduced: matchMedia('(prefers-reduced-motion: reduce)').matches };
if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const burger = document.getElementById('burger');
const links = document.getElementById('links');
burger?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && links?.classList.contains('open')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
});

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
