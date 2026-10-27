# Portfolio design system

## Direction
A personal, editorial finance portfolio: warm ivory, deep green, restrained typography, and visible work-in-progress labels. Keep finance research and original artifacts intact. Campus leadership complements—not replaces—the research evidence.

## 1. Colors and typography first

Palette and font pairing were previewed in Realtime Colors on October 27, 2026:

- Canvas: `#f7f6f2`
- Primary text: `#192c29`
- Action green: `#156b56`
- Secondary surface: `#e7ede5`
- Supporting text: `#52635d`
- Display: DM Serif Display, regular and italic
- Body/interface: DM Sans, weights 400–700

Fonts are served locally from `assets/fonts/`, with the original SIL Open Font Licenses included. There are no Google Fonts runtime requests. Light/dark modes share the same layout; automatic mode follows the visitor's system preference. Final theme tokens live in `assets/editorial.css`, layered after the existing component stylesheet.

Reference: https://www.realtimecolors.com/?colors=192c29-f7f6f2-156b56-e7ede5-a26d39&fonts=DM+Serif+Display-DM+Sans

## 2. Background second

`assets/haikei-campus-wave.svg` was generated using Haikei's Layered Waves tool with the palette's ivory, sage, and green. The generated path geometry is preserved; editor-only inline transitions were removed. The wave is decorative, has no data meaning, and is marked as presentation-only in the HTML.

Reference: https://app.haikei.app/?generator=layered-waves

## 3. Motion last

The In View pattern from Motion Primitives was reviewed as the animation reference. Only small, one-time section arrivals and link feedback are used. This existing site is vanilla HTML/CSS/JavaScript, not React/Tailwind, so the React component was **not installed or claimed as an imported dependency**. Equivalent simple behavior uses the site's existing IntersectionObserver and CSS, without adding a framework.

- No continuous animation, parallax, fake market ticker, or animated metric counter.
- Content is readable without JavaScript and without observer callbacks.
- Reduced-motion preference disables arrivals and animated scrolling.
- Focus outlines and readable content take priority over decoration.

Reference: https://motion-primitives.com/docs/in-view

## Content boundaries

The current roles and three campus initiatives were supplied directly by Dev on October 27, 2026. No start dates, teaching responsibilities, student counts, competition results, or deployed project URLs were supplied, so none are invented. The competition remains in planning. The club website and alumni database remain in development. Checking alumni details every two weeks is a **planned refresh**, not evidence of a running schedule. No alumni records or scraping implementation are included in this portfolio.

Existing downloadable résumé and portfolio-brief PDFs are preserved as prior documents; this release updates website copy, not those source documents.
