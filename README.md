# Dev Amit Pandya — Finance, Research & Leadership

Static personal portfolio at **https://devpandya.com**, published through GitHub Pages.

## What the site presents

- M.S. Finance at UMass Boston, expected May 2027.
- Investment Club President and Accounting & Finance Teaching Assistant.
- Club website co-development, a planned university-level investment competition, and an alumni database in development with a planned two-week refresh.
- Finance internship experience, independent educational equity research, formula workbooks, and clearly labeled academic/learning work.

Current campus roles and project stages were supplied by Dev on October 27, 2026. Project start dates, results, production schedules, competition details, and teaching duties were not invented. No alumni records are published or collected by this site. The existing résumé and recruiter-brief PDFs are preserved; this website release does not revise those source documents.

## Design

The workflow is **palette and typography first, SVG composition second, motion last**. The editorial theme uses locally hosted DM Sans and DM Serif Display fonts, an actual Haikei-generated wave, and restrained native animations. See [DESIGN.md](DESIGN.md) for provenance, tokens, and the deliberate vanilla-JavaScript alternative to React-only motion components.

`assets/styles.css` retains the existing component geometry. `assets/editorial.css` defines the final shared theme and responsive refinements across public pages. Automatic theme follows the visitor's system preference; manual overrides persist when browser storage is available. Navigation still works when storage is disabled. Reduced-motion and no-JavaScript visitors retain readable content.

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
python3 scripts/validate_portfolio.py
python3 scripts/test_refresh.py
```

Real headless-browser verification (Playwright required):

```bash
uv run --with playwright playwright install chromium
uv run --with playwright python scripts/qa_refresh.py
```

The browser suite starts a temporary **loopback-only** server and closes it when finished. Optional environment settings:

- `PORTFOLIO_URL`: test a deployed URL instead.
- `PORTFOLIO_QA_OUTPUT`: directory for screenshots and JSON evidence.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE`: reuse a compatible cached headless browser.
- `PORTFOLIO_AXE_SCRIPT`: path to the official axe-core JavaScript bundle; enables automated WCAG A/AA checks. Without this, the accessibility test is explicitly skipped rather than counted as passed.

## Boundaries

HTML, CSS, and vanilla JavaScript. No runtime framework, trackers, analytics, contact backend, or remote font calls. Research numbers remain dated source-document claims—not current quotes, audited performance, investment recommendations, or authority to handle money. No scraping or alumni refresh job is installed by the portfolio.
