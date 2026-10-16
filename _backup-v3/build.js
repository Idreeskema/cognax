// Generates the static site from src/pages/*.js. Run: node build.js
// Each page module exports (ctx) => ({ file, title, desc, body }).
// Optional per-page assets are picked up automatically: css/<name>.css and js/<name>.js (ES module).
const fs = require('fs');
const path = require('path');
const { layout, ctx } = require('./src/layout');

const dir = path.join(__dirname, 'src', 'pages');
let n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
  const page = require(path.join(dir, f))(ctx);
  fs.writeFileSync(path.join(__dirname, page.file), layout(page), 'utf8');
  n++;
}
console.log('Built', n, 'pages');
