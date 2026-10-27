#!/usr/bin/env python3
"""Real headless-browser checks; run with uv run --with playwright.

PORTFOLIO_URL overrides the disposable loopback server for live verification.
PLAYWRIGHT_CHROMIUM_EXECUTABLE optionally selects a cached headless binary.
PORTFOLIO_QA_OUTPUT selects a directory for screenshots and the test report.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
import os
import threading
import unittest

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


class PortfolioBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = None
        cls.url = os.environ.get('PORTFOLIO_URL')
        if not cls.url:
            cls.server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
            threading.Thread(target=cls.server.serve_forever, daemon=True).start()
            cls.url = f'http://127.0.0.1:{cls.server.server_port}/'
        cls.playwright = sync_playwright().start()
        options: dict[str, Any] = {'headless': True}
        if os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE'):
            options['executable_path'] = os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE']
        cls.browser = cls.playwright.chromium.launch(**options)
        cls.output = Path(os.environ.get('PORTFOLIO_QA_OUTPUT', str(ROOT / 'qa-output')))
        cls.output.mkdir(parents=True, exist_ok=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        if cls.server:
            cls.server.shutdown()
            cls.server.server_close()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000}, color_scheme='light')
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.goto(self.url, wait_until='networkidle')

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'No unhandled browser JavaScript errors')

    def test_finance_identity_uses_local_fonts_and_real_research_artifact(self):
        expect(self.page.locator('h1')).to_have_text('Dev Amit Pandya.')
        self.assertIn('DM Sans', self.page.locator('h1').evaluate('(e) => getComputedStyle(e).fontFamily'))
        self.assertEqual(self.page.locator('.market-hero').evaluate('(e) => getComputedStyle(e).backgroundColor'), 'rgb(7, 14, 21)')
        self.assertEqual(self.page.locator('.market-ribbons').count(), 1)
        art = self.page.locator('#desk-case-image')
        art.scroll_into_view_if_needed()
        expect(art).to_have_attribute('src', 'assets/research/vistra-valuation-bridge.png')
        self.assertTrue(art.evaluate('(e) => e.complete && e.naturalWidth > 0'))
        self.assertTrue(self.page.evaluate('(family) => document.fonts.check(`16px "${family}"`)', 'DM Sans'))
        self.assertTrue(self.page.evaluate('(family) => document.fonts.check(`32px "${family}"`)', 'DM Serif Display'))
        self.page.emulate_media(reduced_motion='reduce')
        self.page.evaluate('window.scrollTo(0, 0)')
        self.page.screenshot(path=str(self.output / 'desktop-home.png'), animations='disabled')

    def test_auto_theme_tracks_system_changes_on_home_and_case_pages(self):
        for route in ('', 'research/vistra/'):
            with self.subTest(route=route):
                self.page.emulate_media(color_scheme='light')
                self.page.goto(self.url.rstrip('/') + '/' + route, wait_until='networkidle')
                expect(self.page.locator('html')).to_have_attribute('data-theme', 'light')
                self.page.emulate_media(color_scheme='dark')
                expect(self.page.locator('html')).to_have_attribute('data-theme', 'dark')

    def test_navigation_survives_disabled_browser_storage(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.context.add_init_script('Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Storage disabled", "SecurityError"); } });')
        for route in ('', 'research/vistra/'):
            with self.subTest(route=route):
                self.page.goto(str(self.url).rstrip('/') + '/' + route, wait_until='networkidle')
                self.page.locator('#menu-open').click()
                expect(self.page.locator('#menu-open')).to_have_attribute('aria-expanded', 'true')
                self.page.keyboard.press('Escape')
                expect(self.page.locator('#menu-open')).to_have_attribute('aria-expanded', 'false')

    def test_responsive_layout_in_light_and_dark_modes(self):
        findings = []
        for theme in ('light', 'dark'):
            self.page.emulate_media(color_scheme=theme, reduced_motion='reduce')
            for width in (320, 375, 390, 768, 1024, 1440, 1920):
                with self.subTest(theme=theme, width=width):
                    self.page.set_viewport_size({'width': width, 'height': 900})
                    self.page.goto(str(self.url), wait_until='networkidle')
                    overflow = self.page.evaluate('''() => [...document.querySelectorAll('h1, main article, .brand, .header-tools, .section-shell')].filter(e => {
                      const r = e.getBoundingClientRect();
                      return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
                    }).map(e => ({tag: e.tagName, id: e.id, className: e.className}))''')
                    findings.append({'theme': theme, 'width': width, 'overflow': overflow})
                    self.assertEqual(overflow, [])
                    self.assertEqual(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), True)
                    if width == 390:
                        self.page.screenshot(path=str(self.output / f'mobile-home-{theme}.png'), animations='disabled')
                        self.page.locator('#leadership').screenshot(path=str(self.output / f'mobile-leadership-{theme}.png'), animations='disabled')
                    if width == 1440:
                        self.page.locator('#leadership').screenshot(path=str(self.output / f'desktop-leadership-{theme}.png'), animations='disabled')
                        if theme == 'dark':
                            self.page.evaluate('window.scrollTo(0, 0)')
                            self.page.screenshot(path=str(self.output / 'desktop-home-dark.png'), animations='disabled')
        (self.output / 'responsive.json').write_text(__import__('json').dumps(findings, indent=2))

    def test_mobile_leadership_navigation_and_keyboard_commands(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.page.locator('#menu-open').click()
        self.page.locator('#mobile-nav a[href="#leadership"]').click()
        expect(self.page.locator('#mobile-nav')).to_be_hidden()
        expect(self.page.locator('#leadership')).to_be_in_viewport()
        self.page.keyboard.press('Control+k')
        expect(self.page.locator('#command-dialog')).to_be_visible()
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#command-dialog')).to_be_hidden()

    def test_reduced_motion_navigation_does_not_animate_scrolling(self):
        self.page.emulate_media(reduced_motion='reduce')
        self.page.keyboard.press('Control+k')
        self.page.locator('[data-command="leadership"]').click()
        box = self.page.locator('#leadership').bounding_box()
        self.assertIsNotNone(box)
        self.assertLessEqual(box['y'], 150, 'Reduced-motion navigation should land immediately')
        self.assertEqual(self.page.locator('.reveal.is-visible').first.evaluate('(e)=>getComputedStyle(e).animationName'), 'none')

    def test_existing_experience_and_research_interactions(self):
        for key, title in [('mindox', 'Mindox Techno'), ('relianceops', 'Reliance Asset Reconstruction Company'), ('portfolio', '$300,000 Global Portfolio'), ('esg', 'ESG, Firm Risk, and Value')]:
            self.page.locator(f'[data-project="{key}"]').click()
            expect(self.page.locator('#preview-title')).to_have_text(title)
        self.page.goto(str(self.url).rstrip('/') + '/research/', wait_until='networkidle')
        self.assertEqual(self.page.locator('.research-row').count(), 21)
        self.page.locator('#research-search').fill('vistra')
        self.assertGreater(self.page.locator('.research-row:visible').count(), 0)
        self.page.locator('#research-search').fill('no matching research entry xyz')
        expect(self.page.locator('#research-empty')).to_be_visible()
        self.page.locator('#research-search').fill('')
        self.assertEqual(self.page.locator('.research-row:visible').count(), 21)
        self.page.locator('[data-note="dcfcomps"]').click()
        expect(self.page.locator('#note-dialog')).to_be_visible()
        expect(self.page.locator('#dialog-content h2')).to_have_text('DCF versus trading comparables')
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#note-dialog')).to_be_hidden()

    def test_content_remains_readable_without_javascript(self):
        context = self.browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
        try:
            page = context.new_page()
            page.goto(str(self.url), wait_until='networkidle')
            expect(page.locator('#investment-club-role')).to_contain_text('Investment Club President')
            expect(page.locator('#teaching-assistant-role')).to_contain_text('Teaching Assistant')
            expect(page.locator('#alumni-project')).to_contain_text('every two weeks')
            self.assertEqual(page.locator('.reveal').first.evaluate('(e)=>getComputedStyle(e).opacity'), '1')
        finally:
            context.close()

    @unittest.skipUnless(os.environ.get('PORTFOLIO_AXE_SCRIPT'), 'Set PORTFOLIO_AXE_SCRIPT for automated accessibility checks')
    def test_public_pages_have_no_wcag_a_or_aa_violations(self):
        routes = ('', 'research/', 'research/vistra/', 'research/take-two/', 'research/first-solar/', 'research/global-portfolio/', 'research/capital-one-discover/', 'research/work-brain-vs-study-brain/', 'research/protect-the-study-habit/', '404.html')
        report = []
        for theme in ('light', 'dark'):
            self.page.emulate_media(color_scheme=theme, reduced_motion='reduce')
            for route in routes:
                self.page.goto(str(self.url).rstrip('/') + '/' + route, wait_until='networkidle')
                self.page.add_script_tag(path=os.environ['PORTFOLIO_AXE_SCRIPT'])
                result = self.page.evaluate('''async () => {
                  const result = await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
                  return {violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),passes:result.passes.length};
                }''')
                report.append({'route': route, 'theme': theme, **result})
        (self.output / 'accessibility.json').write_text(__import__('json').dumps(report, indent=2))
        failures = [{'route': r['route'], 'theme': r['theme'], 'violations': r['violations']} for r in report if r['violations']]
        self.assertEqual(failures, [])


if __name__ == '__main__':
    unittest.main(verbosity=2)
