import { createStage } from '../three/stage.js';
import { supportScene } from '../three/support.js';

const hooks = {};
createStage(document.querySelector('[data-stage="support"]'), (api) => supportScene(api, hooks));

const items = [...document.querySelectorAll('.sp-item')];
const show = () => hooks.set?.(items.findIndex((d) => d.open));
// one open at a time; the scene shows the question and answer of the open item
items.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
  show();
}));
show();

const input = document.getElementById('sp-q'), empty = document.getElementById('sp-empty');
input.addEventListener('input', () => {
  const q = input.value.trim().toLowerCase();
  let n = 0;
  items.forEach((d) => { const hit = !q || d.textContent.toLowerCase().includes(q); d.hidden = !hit; if (hit) n++; });
  empty.hidden = n > 0;
});
