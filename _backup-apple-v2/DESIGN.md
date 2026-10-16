# Cognax website: design brief v2 (Apple.com/in style)

Direction (client): "clean like apple.com/in, and the nav should be the same."
- Global nav: slim 44px translucent dark bar, small links, logo left (src/layout.js).
- Local nav on product pages: `ctx.localnav(name, items)`, sticky under the global nav (44 + 52 = 96px offset for sticky/pinned elements).
- Hero: centered `.ahero` (huge h1, one `.lede`, `.cta-row` with `.pill lg` + `.alink`), then a huge centered 3D object below on white.
- Sections: centered, alternating `.sec` / `.sec.gray` (at most one `.sec.black`), each with h2 + one lede + large visual. Home uses `.tiles` / `.atile`.
- Type: system SF stack (Inter fallback). Indigo `--brand` for links/buttons. No gradient text, glows, glass, left-text/right-3D hero splits.
- Shared files (do not edit from pages): styles.css, main.js, src/layout.js, three/stage.js. Per page: src/pages/<n>.js, css/<n>.css, js/<n>.js, three/<n>*.js.
- Content: only what the product does (vetted copy in reference/old-build.js). Tagline: "Upload anything. Ask anything. Trust the answer."
- Quality: node build.js ok; no console errors; no horizontal scroll at 1440/1024/390; reduced motion = finished still; mobile 3D smaller.
