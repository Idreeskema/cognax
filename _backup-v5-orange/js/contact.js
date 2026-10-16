import { createStage } from '../three/stage.js';
import { contactScene } from '../three/contact.js';

const hooks = {};
createStage(document.querySelector('[data-stage="contact"]'), (api) => contactScene(api, hooks));

// the card in the scene follows the form: focus lights the row, typing fills it, a successful send pops the reply
const form = document.getElementById('contact-form');
const fields = ['name', 'email', 'company', 'msg'].map((id) => document.getElementById(id));
fields.forEach((el, i) => {
  el.addEventListener('focus', () => hooks.focus?.(i));
  el.addEventListener('blur', () => hooks.focus?.(-1));
  el.addEventListener('input', () => hooks.fill?.(i, el.value.length / (i === 3 ? 40 : 16)));
});
const status = document.getElementById('form-status');
new MutationObserver(() => { if (status.textContent.startsWith('Thanks')) { hooks.sent?.(); fields.forEach((_, i) => hooks.fill?.(i, 0)); } })
  .observe(status, { childList: true, characterData: true, subtree: true });
form?.addEventListener('reset', () => fields.forEach((_, i) => hooks.fill?.(i, 0)));
