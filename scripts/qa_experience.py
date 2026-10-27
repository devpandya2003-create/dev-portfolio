#!/usr/bin/env python3
"""Browser acceptance checks for the interactive finance portfolio."""
import unittest
import os
import json
from urllib.parse import urlparse
from playwright.sync_api import expect
from qa_refresh import PortfolioBrowserTests


class InteractivePortfolioTests(PortfolioBrowserTests):
    def test_explore_finance_work_and_profile_without_playing_a_game(self):
        self.assertEqual(self.page.locator('#explore').count(), 1, 'The interactive analyst desk must exist')
        expect(self.page.locator('#desk-case-title')).to_have_text('Vistra investment thesis')
        self.page.locator('[data-desk-case="ttwo"]').click()
        expect(self.page.locator('#desk-case-title')).to_have_text('Take-Two Interactive')
        expect(self.page.locator('#desk-case-link')).to_have_attribute('href', 'research/take-two/')
        self.page.locator('#desk-tab-experience').click()
        self.page.locator('[data-career="mindox"]').click()
        expect(self.page.locator('#career-title')).to_have_text('Mindox Techno')
        expect(self.page.locator('#career-location')).to_have_text('Singapore · May–June 2024')
        self.page.locator('[data-audience="recruiter"]').click()
        expect(self.page.locator('#desk-tab-experience')).to_have_attribute('aria-selected', 'true')
        self.page.locator('[data-profile-open]').first.click()
        expect(self.page.locator('#profile-dialog')).to_be_visible()
        expect(self.page.locator('#profile-dialog')).to_contain_text('Investment Club President')
        expect(self.page.locator('#profile-dialog')).to_contain_text('Teaching Assistant')
        expect(self.page.locator('#profile-dialog a[download]')).to_have_attribute('href', 'assets/Dev-Amit-Pandya-Resume.pdf')
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#profile-dialog')).to_be_hidden()

    def test_optional_finance_challenge_reveals_story_and_can_be_replayed(self):
        self.assertEqual(self.page.locator('#challenge').count(), 1, 'An optional analyst challenge must exist')
        expect(self.page.locator('#challenge-progress')).to_have_attribute('value', '0')
        self.page.locator('[data-answer="1"]').click()
        expect(self.page.locator('#challenge-progress')).to_have_attribute('value', '0')
        expect(self.page.locator('#challenge-feedback')).to_contain_text('positive cash flow')
        self.page.locator('[data-answer="0"]').click()
        expect(self.page.locator('#challenge-progress')).to_have_attribute('value', '1')
        expect(self.page.locator('[data-unlock="research"]')).to_have_attribute('data-unlocked', 'true')
        self.page.locator('#challenge-next').click()
        self.page.locator('[data-answer="1"]').click()
        expect(self.page.locator('#challenge-progress')).to_have_attribute('value', '2')
        self.page.locator('#challenge-next').click()
        self.page.locator('[data-answer="2"]').click()
        expect(self.page.locator('#challenge-progress')).to_have_attribute('value', '3')
        self.page.locator('#challenge-next').click()
        expect(self.page.locator('#challenge-complete')).to_be_visible()
        self.assertEqual(self.page.locator('[data-unlocked="true"]').count(), 3)
        self.page.locator('#challenge-replay').click()
        expect(self.page.locator('#challenge-progress')).to_have_attribute('value', '0')
        expect(self.page.locator('#challenge-question')).to_be_visible()
        self.assertEqual(self.page.locator('[data-unlocked="true"]').count(), 0)


    def test_motion_can_be_paused_and_respects_reduced_motion(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.assertEqual(self.page.locator('#motion-toggle').count(), 1, 'Visible motion controls are required')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'on')
        self.page.locator('#motion-toggle').click()
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.assertEqual(self.page.locator('html').evaluate('(e)=>getComputedStyle(e).scrollBehavior'), 'auto')
        self.page.reload(wait_until='networkidle')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.page.locator('#motion-toggle').click()
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'on')
        self.page.emulate_media(reduced_motion='reduce')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        expect(self.page.locator('#motion-toggle')).to_be_disabled()
        self.assertEqual(self.page.locator('.ribbon').first.evaluate('(e)=>getComputedStyle(e).animationName'), 'none')

    def test_orbital_navigation_targets_do_not_cover_each_other(self):
        for width in (320, 375, 768, 1024, 1440):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 1000})
                self.page.emulate_media(reduced_motion='reduce')
                overlaps = self.page.locator('.signal-system').evaluate('''root => {
                  const targets = [...root.querySelectorAll('a, button')]; const out = [];
                  for (let i=0;i<targets.length;i++) for(let j=i+1;j<targets.length;j++) {
                    const a=targets[i].getBoundingClientRect(), b=targets[j].getBoundingClientRect();
                    if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>2 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2)
                      out.push([targets[i].getAttribute('aria-label') || targets[i].textContent.trim(),targets[j].textContent.trim()]);
                  } return out;
                }''')
                self.assertEqual(overlaps, [])

    def test_explorer_keyboard_navigation_and_profile_focus_return(self):
        self.page.locator('#desk-tab-research').focus()
        self.page.keyboard.press('ArrowDown')
        expect(self.page.locator('#desk-tab-experience')).to_be_focused()
        expect(self.page.locator('#desk-panel-experience')).to_be_visible()
        self.page.keyboard.press('End')
        expect(self.page.locator('#desk-tab-process')).to_be_focused()
        self.page.keyboard.press('Home')
        expect(self.page.locator('#desk-tab-research')).to_be_focused()
        opener = self.page.locator('[data-profile-open]').first
        opener.click()
        expect(self.page.locator('[data-profile-close]')).to_be_focused()
        self.page.keyboard.press('Escape')
        expect(opener).to_be_focused()


    @unittest.skipUnless(os.environ.get('PORTFOLIO_AXE_SCRIPT'), 'Set PORTFOLIO_AXE_SCRIPT for interactive accessibility checks')
    def test_all_interactive_states_pass_accessibility_checks(self):
        results = []
        self.page.emulate_media(reduced_motion='reduce')
        for theme in ('light', 'dark'):
            self.page.emulate_media(color_scheme=theme)
            self.page.goto(str(self.url), wait_until='networkidle')
            self.page.add_script_tag(path=os.environ['PORTFOLIO_AXE_SCRIPT'])
            def scan(state):
                violations = self.page.evaluate('''async () => (await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))''')
                results.append({'theme': theme, 'state': state, 'violations': violations})
            for tab in ('research', 'experience', 'leadership', 'process'):
                self.page.locator(f'#desk-tab-{tab}').click()
                scan(tab)
                if theme == 'dark':
                    self.page.locator('#explore').screenshot(path=str(self.output / f'desk-{tab}.png'), animations='disabled')
            self.page.locator('[data-profile-open]').first.click()
            scan('quick-profile')
            self.page.keyboard.press('Escape')
            self.page.locator('[data-answer="0"]').click()
            scan('challenge-correct-answer')
            self.page.locator('#challenge-next').click()
            self.page.locator('[data-answer="1"]').click()
            self.page.locator('#challenge-next').click()
            self.page.locator('[data-answer="2"]').click()
            self.page.locator('#challenge-next').click()
            scan('challenge-complete')
            if theme == 'dark':
                self.page.locator('#challenge').screenshot(path=str(self.output / 'challenge-complete.png'), animations='disabled')
        (self.output / 'interactive-accessibility.json').write_text(json.dumps(results, indent=2))
        self.assertEqual([row for row in results if row['violations']], [])

    def test_experience_has_no_external_data_or_tracking_requests(self):
        context = self.browser.new_context(viewport={'width': 1440, 'height': 1000})
        requests = []
        try:
            context.on('request', lambda request: requests.append({'url': request.url, 'type': request.resource_type}))
            page = context.new_page()
            page.goto(str(self.url), wait_until='networkidle')
            for case in ('ttwo', 'firstsolar', 'vistra'):
                page.locator(f'[data-desk-case="{case}"]').click()
            page.wait_for_load_state('networkidle')
            origin = urlparse(str(self.url)).netloc
            external = [r for r in requests if urlparse(r['url']).netloc not in ('', origin)]
            background_data = [r for r in requests if r['type'] in ('xhr', 'fetch', 'websocket')]
            (self.output / 'network.json').write_text(json.dumps({'requests': requests, 'external': external, 'data_requests': background_data}, indent=2))
            self.assertEqual(external, [])
            self.assertEqual(background_data, [])
        finally:
            context.close()


if __name__ == '__main__':
    unittest.main(verbosity=2)
