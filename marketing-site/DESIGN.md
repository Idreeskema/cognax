# Cognax marketing site: design system and conventions

Plain static site, no build step. Serve from this folder (`python -m http.server 8090`). Product facts, tagline and the
content rules live in `../website/DESIGN.md` and `../website/reference/old-build.js`; follow them. Tagline: "Upload anything.
Ask anything. Trust the answer."

**Do not edit shared files** (`css/tokens.css`, `css/base.css`, `css/components.css`, `js/main.js`, the nav/footer blocks).
Add `css/<page>.css` and `js/<page>.js` for page work. If something shared is missing, work around it in your page file and
report it.

## Direction
Bright, confident, editorial, product-first. White paper, deep navy ink, one cobalt for interface, and **orange used only to mean
"source"** (the highlight on a cited passage, citation chips, the connector line). That single idea runs through the hero: the
third headline line is highlighted the way a source passage is. Reuse it: wherever a mock shows an answer, show where it came
from with `.cite` and `.hl`. Mock UI is built in HTML/CSS and is always illustrative, never customer data.

Differs on purpose from `../website`: no Three.js, no indigo-everything, no tilted cards. Display type is a tight grotesque, layouts
alternate 5/7 and 7/5 splits, one tinted band behind dashboards, hairline definition lists instead of icon cards.

Hard don'ts (same as website): gradient text, glow/aurora blobs, glass cards, dark-by-default, announcement pills, three identical
icon cards, ALL-CAPS tracked eyebrows, numbering that is not a real sequence, emoji, fake stats/logos/testimonials/pricing/security
claims, lorem ipsum, arrows on every button. Sentence case, active voice, plain words.

## Tokens (`css/tokens.css`)
Color: `--paper #fff`, `--mist #f3f5fa` (alt section bg), `--mist-2`, `--line`, `--line-strong`, `--ink #0e1b36`, `--ink-2` (body),
`--ink-3` (muted, 5.7:1 on white), `--brand #1e48f0` (links/data), `--brand-ink #1536b8` (link text, hover fill), `--brand-tint`,
`--source #ff5c00` (marks only; never orange text, use `--source-ink #a93a00`), `--source-tint`, `--ok`, `--ok-tint`, `--night #0b1530`
(the one dark band per page), `--on-night`, `--on-night-2`.
Type: `--font-display` Space Grotesk (600/700, headings, numerals), `--font-body` Inter (400-700). Scale:
`--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-lede`, `--fs-body` (17px), `--fs-small`, `--fs-mock` (13px, inside mock UI only).
Space: `--s-1` .25rem to `--s-9` 7rem (4pt rhythm); `--section-y` fluid section padding; `--gutter`; `--max` 1240px.
Radius by role: `--r-s` 8px (chips, inputs, mock parts), `--r-m` 14px (windows), `--r-l` 28px (tinted panels). Shadow: `--e-1/2/3`.
Motion: `--ease`, `--ease-out`, `--t-quick` 160ms, `--t-std` 320ms, `--t-slow` 700ms. Layers: `--z-nav`, `--z-menu`, `--z-skip`.

## Page shell (identical on every page)
Copy `<head>`, nav, footer and script tags from `naxie.html` (stub). Required order in `<head>`: fonts, the inline `js`/`motion` class
script, `tokens.css`, `base.css`, `components.css`, then your `css/<page>.css`. Before `</body>`: GSAP 3.12.5 and ScrollTrigger 3.12.5
from cdnjs (pinned), `js/main.js`, then your `js/<page>.js`. Stubs contain a commented line for each; uncomment when you add the file.
Content goes between `<main id="main">` tags. Remove the `<section data-stub>` note when you finish a page. Nav markers:
`<!-- shell:nav:start/end -->`, `<!-- shell:footer:start/end -->`. Set `aria-current="page"` on the matching nav/panel link (already done in stubs).

## Page structure convention
1. `.page-head` (product pages) or the home hero: h1 once, one `.lede` of 1-2 sentences, `.btn-row` with "Request a demo" + "Sign in".
2. 2-4 feature sections, each with a distinct visual. Alternate `.split--5-7` / `.split--7-5`; vary at least one section (full-width
   window, `.defs` list, or a pair). Do not repeat the same layout twice in a row.
3. A "works with" area as a `.linkrow` of text links (no card grid) pointing at related product pages.
4. Closing `.cta-band on-night` (the only dark band). Alternate section backgrounds white / `.section--mist`.
Headings in order (one h1, h2 per section, h3 inside). Vetted copy only; mock labels must be plausible, not claims.

## Components (`css/components.css`)
- Layout: `.wrap` (`.wrap--narrow`), `.section` (`--tight`, `--mist`), `.section-head` (h2 + p), `.split` + `--5-7|--7-5|--6-6`, `.copy`
  (h2, p, optional `.ticks`, `.btn-row`), `.panel` (mist frame around a visual), `.defs` (`<dl class="defs"><div><dt/><dd/></div></dl>`).
- Buttons: `<a class="btn btn--primary btn--lg">`, `btn--secondary`, `btn--text` (inline link button), wrap in `.btn-row`. On `.on-night` they invert.
- Mock window: `<div class="win"><div class="win__bar">{svg}<span>Title</span><span class="grow"></span><span class="tag">Example</span></div><div class="win__body">...</div></div>` (`win--flat` for low shadow).
- Chat: `<div class="chat"><div class="msg msg--user">..</div><div class="msg msg--bot">..<span class="cite">{svg} Source name</span></div></div>`.
- Document + source mark: `<div class="doc"><p class="doc__title">..</p><p>..<mark class="hl">passage</mark>..</p><div class="doc__line"></div></div>`. `.hl` width is driven by `--hl-w` (tween it for a sweep).
- Table: `<div class="tbl-scroll"><table class="tbl">..</table></div>`, `.name` flex cell with icon, `.tag` (`--ok`, `--wait`, `--source`), `.chips`/`.chip` (`--on`; `button.chip` + `aria-pressed` for interactive).
- Data: `.kpis > .kpi (b + span)`, `<svg class="chart">` with `.bar`/`.bar--hi`/`.axis` (see home), `.src-line` (source caption under a chart).
- Slides: `.slide` (`--dark`, `<small>` + `<strong>`). Flow: `.flow > .node (--on) + .link` (see home `.pipeline`).
- Link row: `<div class="linkrow"><a href>{svg}Label</a></div>`. CTA: `.cta-band.on-night > .wrap > h2, p, .btn-row`.
- Text pages: `.page-head`, `.prose` (privacy/terms/support), `.field` (label + input/textarea/select, `<small>` helper) for forms.
- Icons: inline 24px stroke SVGs (`stroke="currentColor" stroke-width="1.8"`), sized by CSS. Paths for naxie, kb, dash, pres, conn, auto, file, folder, sheet, star, check are in the nav/footer and `index.html`.

## Motion rules
Personality: corporate-premium. One signature ease (`power3.out`; CSS `--ease`), durations 0.3 / 0.5-0.9 s. Motion must show cause or
draw the eye to one thing.
- Home has one orchestrated intro (headline lines, windows, answer, highlight sweep, connector draw). Other pages: at most one
  moment above the fold; do not re-use the connector.
- `data-reveal` on a section head or large visual fades/rises it once on scroll (batched stagger). Use sparingly: heads and big visuals
  only, never every card or list item.
- Scroll-linked or in-view moments belong inside a visual (bars grow, rows appear, pipeline links draw) with `ScrollTrigger.create({once:true})`.
  Avoid pinned sections unless the content is a real sequence.
- Gate everything with `window.CX.motion` (true only when GSAP loaded and the user has not asked for reduced motion). Hidden initial
  states may only be set in CSS under `.motion` (see `.motion [data-reveal]` and home.css) so no-JS, no-CDN and reduced-motion users
  see final content. `window.CX = { reduced, motion, gsap }`.
- Animate transform/opacity/CSS variables only. Hover/press: color and 0.97 scale, 160 ms. Respect `prefers-reduced-motion` (base.css
  also flattens CSS transitions).

## Accessibility and QA checklist
Text meets AA (use `--ink-2`/`--ink-3` on white and mist; never `--source` as text). Focus rings come from `base.css`; do not remove.
Min touch target 44px (chips in mocks are decorative). Canvas/mocks that are decorative get `aria-hidden` or a single `role="img"` +
`aria-label`. Check at 1440, 1024, 390: no horizontal scroll (`scrollWidth == innerWidth`), zero console errors, nothing clipped.
Screenshot: Playwright installed at `C:/Users/idrees.kema/AppData/Local/Temp/claude/d--cognax/0e37553f-38ba-4927-ad3c-5b416574ab9a/scratchpad/node_modules/playwright`,
executable `C:/Users/idrees.kema/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe`; wait ~5 s after load for the home
intro and scroll in steps so in-view triggers fire.

## External
Sign-in URL: `https://cognax.expentor.com/login`. Excel is the only connection type available today; say so rather than listing
other sources. Legal pages need approved text before launch (do not invent policy claims).
