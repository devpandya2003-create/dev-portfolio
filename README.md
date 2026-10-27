# Dev Amit Pandya — Finance, Research & Leadership

Static personal portfolio at **https://devpandya.com**, published through GitHub Pages.

## What the site presents

- M.S. Finance at UMass Boston, expected May 2027.
- Investment Club President and Accounting & Finance Teaching Assistant.
- Club website co-development, a planned university-level investment competition, and an alumni database in development with a planned two-week refresh.
- Finance internship experience, independent educational equity research, formula workbooks, and clearly labeled academic/learning work.

Current campus roles and project stages were supplied by Dev on October 27, 2026. Project start dates, results, production schedules, competition details, and teaching duties were not invented. No alumni records are published or collected by this site. The existing résumé and recruiter-brief PDFs are preserved; this website release does not revise those source documents.

## Design

The owner-selected experience combines a cinematic finance identity, an interactive analyst-style explorer, and a short optional finance challenge. Dated research tickers, an internship timeline, audience lenses, a no-gate quick profile, and a replayable three-check journey make the information discoverable through interaction. Background linework and orbital navigation are decorative—not a live market feed. See [DESIGN.md](DESIGN.md) for the content and motion boundaries.

`assets/styles.css` and `assets/editorial.css` retain the existing component foundations. `assets/market.css` is the final visual layer across public pages. `assets/experience-core.mjs` holds public data and the pure challenge state machine; `assets/experience.js` handles interaction. Automatic theme follows the visitor's system preference. Visible motion controls, reduced-motion support, optional storage, and no-JavaScript access keep the profile usable.

## Preview locally

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4173/`.

## Checks

Dependency-free release checks:

```bash
node --check assets/app.js
node --check assets/case.js
node --check assets/experience.js
node --check assets/experience-core.mjs
node --test scripts/experience-core.test.mjs
python3 scripts/validate_portfolio.py
python3 scripts/test_refresh.py
```

Real headless-browser verification (Playwright required):

```bash
uv run --with playwright playwright install chromium
uv run --with playwright python scripts/qa_experience.py InteractivePortfolioTests
```

The browser suite starts a temporary **loopback-only** server and closes it when finished. Optional environment settings:

- `PORTFOLIO_URL`: test a deployed URL instead.
- `PORTFOLIO_QA_OUTPUT`: directory for screenshots and JSON evidence.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE`: reuse a compatible cached headless browser.
- `PORTFOLIO_AXE_SCRIPT`: path to the official axe-core JavaScript bundle; enables automated WCAG A/AA checks. Without this, the accessibility test is explicitly skipped rather than counted as passed.

## Boundaries

HTML, CSS, and vanilla JavaScript. No runtime framework, trackers, analytics, contact backend, or remote font calls. Research numbers remain dated source-document claims—not current quotes, audited performance, investment recommendations, or authority to handle money. No scraping or alumni refresh job is installed by the portfolio.
