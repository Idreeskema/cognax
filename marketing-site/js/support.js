/* Support: filter the answers as you type. */
(function () {
  var input = document.getElementById('sp-q');
  if (!input) return;
  var items = [].slice.call(document.querySelectorAll('.sp-item'));
  var groups = [].slice.call(document.querySelectorAll('.sp-group'));
  var empty = document.getElementById('sp-empty');
  var count = document.getElementById('sp-count');
  var side = document.querySelector('.sp-side');
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase(), shown = 0;
    items.forEach(function (it) {
      var hit = !q || it.textContent.toLowerCase().indexOf(q) !== -1;
      it.hidden = !hit;
      if (hit) shown++;
      if (q && hit) it.open = true;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('.sp-item:not([hidden])'); });
    empty.hidden = shown > 0;
    if (side) side.hidden = !!q;
    count.textContent = q ? (shown + (shown === 1 ? ' answer matches' : ' answers match')) : '';
  });
})();
