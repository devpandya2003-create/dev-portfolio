# Interactive finance portfolio design

## Owner-selected direction

Combine three experiences: a cinematic finance identity, an interactive analyst-style explorer, and an optional finance challenge that reveals story cards. Quick profile, résumé, contact, and the full existing evidence library remain accessible without playing.

## Visual system

The final layer is `assets/market.css`, loaded after the component and editorial stylesheets. It replaces the earlier ivory-led presentation with midnight navy, mint, blue-gray, and restrained warm highlights. Light/dark content themes remain supported; the introductory scene is intentionally dark in either theme.

- Primary hero background: `#070e15`.
- Hero action mint: `#8aefc6`.
- Dark content canvas: `#071017`; light content canvas: `#edf3f7`.
- Typography: locally hosted DM Sans for the identity and interface; existing licensed fonts are preserved in `assets/fonts/`.
- No remote font requests, videos, WebGL, canvas render loop, framework runtime, or market-data API.

The SVG linework and orbital directory are original decorative compositions. They do not encode price history, portfolio returns, skill scores, or market activity. The moving focus-area ribbon contains portfolio topics, not quotes. The earlier Haikei wave is retained as an unused public asset, not claimed as the new background.

## Hands-on finance lab

The primary homepage action opens a three-tab teaching surface, styled locally in `assets/finance-lab.css`:

- Fictional FCFF valuation: adjust growth/discount/terminal inputs, inspect forecast-year bars, compare authored presets, and see terminal-value dependence. Invalid assumptions show no value.
- Token allocation: assign exactly 100 fictional teaching tokens; switch among declared one-step shocks and inspect contributions. No normalization, money, performance claim, or recommended mix.
- Research comparison: choose two existing cases, swap them, compare dated context, and enlarge original workbook figures. Unknown/duplicate selections show an explicit incomplete state.

The model contract and primary conceptual sources are in `FINANCE_LAB.md`. Exact BigInt rational arithmetic is checked against an independent Python Fraction oracle. Phone tabs reflow compactly and bring the selected activity into view; keyboard navigation, reduced motion, source-image failures, and original profile access remain covered.

## The research desk

`assets/experience-core.mjs` contains the public data maps. `assets/experience.js` handles the interface.

- Analyst lens opens dated research; Investor lens opens the research process; Recruiter lens opens internship experience.
- VST, TTWO, and FSLR buttons switch among real existing research cases, original workbook images, case links, and workbook downloads. Dates and limitations remain explicit.
- The career timeline opens existing internship chapters; no new start/end dates or quantified outcomes are invented.
- Leadership presents the owner-confirmed presidency and TA role, plus the three developing campus initiatives.
- The quick-profile modal is independent of challenge progress and includes résumé, email, and LinkedIn shortcuts.
- Tabs support keyboard arrows, Home/End, selected state, associated panels, and focus return after closing the profile.

## The analyst challenge

Three qualitative checks cover discounting a fixed positive cash flow, the difference between business quality and investment quality, and downside/invalidation. Answers refer visitors to the relevant existing educational work. There is no timer, money, return simulation, investment recommendation, exam credential, or measurement of Dev's expertise.

The pure state machine rejects invalid choices, prevents repeated correct clicks from advancing twice, and keeps progress in page memory only. Wrong answers provide explanatory hints. Correct answers reveal research, experience, and leadership story cards; the same information remains available outside the game. Replay resets the journey.

## Motion and access

- Native CSS animates abstract linework, orbital markers, ambient light, a topic ribbon, and short interface arrivals.
- A visible Motion on/off control pauses interface/background animation; it persists only an optional local preference.
- System reduced-motion preference disables animation and is respected on changes. Storage failures do not disable the controls or navigation.
- Ambient movement pauses while the document is hidden or the hero leaves the viewport.
- The orbital directory reflows to a non-overlapping touch grid on phones.
- Content and original links remain readable without JavaScript. No profile information is gated by the challenge.

## Evidence and release boundaries

Preserve all original financial reports, charts, workbooks, source attributions, and downloadable résumé PDFs. Current roles came from the owner; no university approval, teaching responsibilities, dates, participant numbers, project launches, alumni records, or running refresh schedule were supplied. The club website remains in development with a friend. The competition remains in planning. Alumni checks every two weeks remain planned.

Run the static quality gate, content checks, Node state-machine tests, and the headless browser suite before publication. Browser tests cover the default pages, interactive states, responsive layouts, keyboard use, motion controls, storage denial, no-JS content, and absence of external data/tracking requests. Clean automated accessibility checks are not a complete accessibility certification.
