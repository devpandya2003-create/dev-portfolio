#!/usr/bin/env python3
"""Real browser checks for the hands-on, educational finance lab."""
import json
import os
from pathlib import Path
import unittest
from playwright.sync_api import expect
from qa_experience import InteractivePortfolioTests

FIXTURE = json.loads((Path(__file__).parent / 'fixtures' / 'finance-lab-oracle.json').read_text())


class FinanceLabTests(InteractivePortfolioTests):
    def test_valuation_sliders_presets_cashflow_inspection_and_invalid_state(self):
        self.assertEqual(self.page.locator('#finance-lab').count(), 1, 'A hands-on finance lab must exist')
        value = self.page.locator('#lab-dcf-value')
        expect(value).to_have_attribute('data-cents', FIXTURE['cases'][0]['expected']['enterpriseCents'])
        self.page.locator('[data-dcf-preset="growth"]').click()
        expect(value).to_have_attribute('data-cents', FIXTURE['cases'][2]['expected']['enterpriseCents'])
        self.page.locator('[data-flow="4"]').click()
        expect(self.page.locator('#lab-year-detail')).to_contain_text('Year 5')
        self.page.locator('#lab-growth').focus()
        self.page.keyboard.press('ArrowLeft')
        expect(self.page.locator('#lab-growth-value')).to_have_text('11.5%')
        for identity, number in [('lab-discount', '3'), ('lab-terminal', '3')]:
            self.page.locator('#' + identity).evaluate('(e,value)=>{e.value=value;e.dispatchEvent(new Event("input",{bubbles:true}));}', number)
        expect(self.page.locator('#lab-model-status')).to_contain_text('greater than terminal growth')
        expect(self.page.locator('#lab-dcf-results')).to_be_hidden()
        expect(value).to_have_attribute('data-cents', '')
        self.page.locator('#lab-dcf-reset').click()
        expect(self.page.locator('#lab-dcf-results')).to_be_visible()
        expect(value).to_have_attribute('data-cents', FIXTURE['cases'][0]['expected']['enterpriseCents'])

    def test_allocate_exactly_100_tokens_and_explore_authored_stress_scenarios(self):
        self.assertEqual(self.page.locator('#lab-tab-allocate').count(), 1, 'The token-allocation activity must exist')
        self.page.locator('#lab-tab-allocate').click()
        output = self.page.locator('#lab-token-ending')
        def expected(weights, scenario):
            return next(row['expected']['endHundredths'] for row in FIXTURE['allocation_cases']
                        if row['weights'] == weights and row['scenario'] == scenario)
        base = {'growth': 50, 'bonds': 40, 'cash': 10}
        expect(output).to_have_attribute('data-hundredths', str(expected(base, 'selloff')))
        self.page.locator('[data-stress="rates"]').click()
        expect(output).to_have_attribute('data-hundredths', str(expected(base, 'rates')))
        self.page.locator('#lab-weight-growth').focus()
        self.page.keyboard.press('ArrowRight')
        expect(self.page.locator('#lab-allocation-status')).to_contain_text('Remove 5 tokens')
        expect(self.page.locator('#lab-stress-result')).to_be_hidden()
        expect(output).to_have_attribute('data-hundredths', '')
        self.page.locator('[data-allocation-preset="growth"]').click()
        expect(output).to_have_attribute('data-hundredths', str(expected({'growth': 100, 'bonds': 0, 'cash': 0}, 'rates')))
        self.page.locator('[data-allocation-preset="cash"]').click()
        expect(output).to_have_attribute('data-hundredths', str(expected({'growth': 0, 'bonds': 0, 'cash': 100}, 'rates')))
        expect(self.page.locator('#lab-allocation-note')).to_contain_text('flat')
        self.page.locator('#lab-allocation-reset').click()
        expect(self.page.locator('#lab-stress-result')).to_be_visible()
        expect(output).to_have_attribute('data-hundredths', str(expected(base, 'selloff')))

    def test_compare_real_cases_swap_and_inspect_the_original_chart(self):
        self.assertEqual(self.page.locator('#lab-tab-compare').count(), 1, 'Side-by-side research comparison must exist')
        self.page.locator('#lab-tab-compare').click()
        expect(self.page.locator('#lab-comparison-left')).to_have_attribute('data-case', 'vistra')
        expect(self.page.locator('#lab-comparison-right')).to_have_attribute('data-case', 'ttwo')
        self.page.locator('#lab-compare-right').select_option('vistra')
        expect(self.page.locator('#lab-compare-status')).to_contain_text('two different cases')
        expect(self.page.locator('#lab-comparison-output')).to_be_hidden()
        self.page.locator('#lab-compare-right').select_option('firstsolar')
        expect(self.page.locator('#lab-comparison-right')).to_contain_text('Publication date not stated')
        self.page.locator('#lab-compare-swap').click()
        expect(self.page.locator('#lab-comparison-left')).to_have_attribute('data-case', 'firstsolar')
        opener = self.page.locator('#lab-comparison-left [data-lab-chart]')
        opener.click()
        expect(self.page.locator('#lab-chart-dialog')).to_be_visible()
        expect(self.page.locator('#lab-chart-title')).to_have_text('First Solar · source chart')
        expect(self.page.locator('#lab-chart-image img')).to_have_attribute('src', 'assets/research/first-solar-dupont-audit.png')
        expect(self.page.locator('#lab-chart-case-link')).to_have_attribute('href', 'research/first-solar/')
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#lab-chart-dialog')).to_be_hidden()
        expect(opener).to_be_focused()

    def test_finance_lab_is_reachable_from_the_main_action_and_command_menu(self):
        expect(self.page.locator('.hero-actions a').first).to_have_attribute('href', '#finance-lab')
        self.page.locator('.hero-actions a').first.click()
        expect(self.page.locator('#finance-lab')).to_be_in_viewport()
        self.page.keyboard.press('Control+k')
        self.page.locator('[data-command="finance-lab"]').click()
        expect(self.page.locator('#command-dialog')).to_be_hidden()
        expect(self.page.locator('#finance-lab')).to_be_in_viewport()


    def test_lab_tab_keyboard_navigation(self):
        self.page.locator('#lab-tab-value').focus()
        self.page.keyboard.press('ArrowRight')
        expect(self.page.locator('#lab-tab-allocate')).to_be_focused()
        expect(self.page.locator('#lab-panel-allocate')).to_be_visible()
        self.page.keyboard.press('End')
        expect(self.page.locator('#lab-tab-compare')).to_be_focused()
        self.page.keyboard.press('Home')
        expect(self.page.locator('#lab-tab-value')).to_be_focused()

    def test_chart_load_failure_shows_an_honest_fallback(self):
        context = self.browser.new_context(viewport={'width': 1440, 'height': 1000})
        errors = []
        try:
            context.route('**/assets/research/*.png', lambda route: route.abort())
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(str(self.url), wait_until='networkidle')
            page.locator('#lab-tab-compare').click()
            page.locator('#lab-comparison-left [data-lab-chart]').click()
            expect(page.locator('#lab-chart-image')).to_contain_text('chart could not load')
            expect(page.locator('#lab-chart-case-link')).to_have_attribute('href', 'research/vistra/')
            self.assertEqual(errors, [])
        finally:
            context.close()

    def test_lab_panels_fit_mobile_and_desktop_in_both_themes(self):
        results = []
        self.page.emulate_media(reduced_motion='reduce')
        for theme in ('light', 'dark'):
            self.page.emulate_media(color_scheme=theme)
            for width in (320, 390, 768, 1440):
                self.page.set_viewport_size({'width': width, 'height': 1100})
                self.page.goto(str(self.url), wait_until='networkidle')
                for panel in ('value', 'allocate', 'compare'):
                    self.page.locator('#lab-tab-' + panel).click()
                    overflow = self.page.locator('#finance-lab').evaluate('''root => [...root.querySelectorAll('input, select, button, article, .lab-panel, .valuation-output, .allocation-output')].filter(e => {
                      const r=e.getBoundingClientRect(); return r.width>0 && (r.left < -1 || r.right > innerWidth+1);
                    }).map(e=>({tag:e.tagName,id:e.id}))''')
                    results.append({'theme': theme, 'width': width, 'panel': panel, 'overflow': overflow})
                    self.assertEqual(overflow, [], f'{theme} {width} {panel}')
                    self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
                    if theme == 'dark' and width in (390, 1440):
                        self.page.locator('#finance-lab').evaluate('(e)=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-90,behavior:"auto"})')
                        self.page.screenshot(path=str(self.output / f'lab-{panel}-{width}.png'), animations='disabled')
        (self.output / 'lab-responsive.json').write_text(json.dumps(results, indent=2))

    @unittest.skipUnless(os.environ.get('PORTFOLIO_AXE_SCRIPT'), 'Set PORTFOLIO_AXE_SCRIPT for lab accessibility checks')
    def test_all_finance_lab_states_are_accessible(self):
        results = []
        self.page.emulate_media(reduced_motion='reduce')
        for theme in ('light', 'dark'):
            self.page.emulate_media(color_scheme=theme)
            self.page.goto(str(self.url), wait_until='networkidle')
            self.page.add_script_tag(path=os.environ['PORTFOLIO_AXE_SCRIPT'])
            def scan(state):
                violations = self.page.evaluate('''async () => (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))''')
                results.append({'theme': theme, 'state': state, 'violations': violations})
            scan('valuation-default')
            for identity in ('lab-discount', 'lab-terminal'):
                self.page.locator('#' + identity).evaluate('(e)=>{e.value="3";e.dispatchEvent(new Event("input",{bubbles:true}));}')
            scan('valuation-invalid')
            self.page.locator('#lab-dcf-reset').click()
            self.page.locator('#lab-tab-allocate').click()
            scan('allocation-default')
            self.page.locator('#lab-weight-growth').evaluate('(e)=>{e.value="55";e.dispatchEvent(new Event("input",{bubbles:true}));}')
            scan('allocation-incomplete')
            self.page.locator('[data-allocation-preset="cash"]').click()
            scan('allocation-cash-only')
            self.page.locator('#lab-tab-compare').click()
            scan('comparison-default')
            self.page.locator('#lab-compare-right').select_option('vistra')
            scan('comparison-duplicate')
            self.page.locator('#lab-compare-right').select_option('firstsolar')
            self.page.locator('#lab-comparison-left [data-lab-chart]').click()
            scan('original-chart-dialog')
            self.page.keyboard.press('Escape')
        (self.output / 'lab-accessibility.json').write_text(json.dumps(results, indent=2))
        self.assertEqual([row for row in results if row['violations']], [])

    def test_mobile_allocation_exposes_a_control_without_an_extra_scroll(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.page.emulate_media(reduced_motion='reduce')
        self.page.locator('.hero-actions a').first.click()
        self.page.locator('#lab-tab-allocate').click()
        expect(self.page.locator('#lab-weight-growth')).to_be_in_viewport()

    def test_motion_preference_is_in_footer_not_top_right_header(self):
        self.assertEqual(self.page.locator('.site-header #motion-toggle').count(), 0,
                         'Keep the top-right header free of the motion preference control')
        self.assertEqual(self.page.locator('.site-footer #motion-toggle').count(), 1)
        expect(self.page.locator('.site-footer #motion-toggle')).to_be_visible()


if __name__ == '__main__':
    unittest.main(verbosity=2)
