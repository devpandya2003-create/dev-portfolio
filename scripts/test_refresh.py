#!/usr/bin/env python3
"""Regression checks for the campus-leadership portfolio refresh."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class Elements(HTMLParser):
    """Read the text and attributes of identified elements without dependencies."""
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self, text):
        super().__init__()
        self.by_id = {}
        self.active = []
        self.depth = 0
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag not in self.VOID:
            self.depth += 1
        if attributes.get('id'):
            value = {'attrs': attributes, 'text': [], 'tag': tag}
            self.by_id[attributes['id']] = value
            if tag not in self.VOID:
                self.active.append((self.depth, value))

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        self.active = [(d, value) for d, value in self.active if d != self.depth]
        self.depth -= 1

    def handle_data(self, data):
        for _, value in self.active:
            value['text'].append(data)

    def text(self, identity):
        return ' '.join(' '.join(self.by_id[identity]['text']).split())


class CampusContentTests(unittest.TestCase):
    def setUp(self):
        self.home = (ROOT / 'index.html').read_text()
        self.dom = Elements(self.home)

    def test_current_campus_roles_are_visible_without_javascript(self):
        self.assertIn('leadership', self.dom.by_id, 'Campus roles need a visible homepage section')
        club = self.dom.text('investment-club-role')
        teaching = self.dom.text('teaching-assistant-role')
        self.assertIn('Investment Club President', club)
        self.assertIn('UMass Boston', club)
        self.assertNotIn('event planner', club.lower())
        self.assertIn('Teaching Assistant', teaching)
        self.assertIn('Accounting & Finance', teaching)
        self.assertIn('UMass Boston', teaching)
        self.assertIn('Investment Club President', self.dom.text('hero-introduction'))
        self.assertIn('Teaching Assistant', self.dom.text('hero-introduction'))

    def test_campus_projects_disclose_development_and_planned_refresh(self):
        expected = {
            'club-website-project': ('Investment Club website', 'In development', 'friend'),
            'competition-project': ('University-level investment competition', 'In planning', 'lead'),
            'alumni-project': ('Departmental alumni database', 'In development', 'every two weeks'),
        }
        self.assertTrue(all(identity in self.dom.by_id for identity in expected),
                        'Club website, competition, and alumni database must be visible projects')
        for identity, phrases in expected.items():
            with self.subTest(project=identity):
                self.assertTrue(identity in self.dom.by_id, f'Missing project: {identity}')
                text = self.dom.text(identity)
                for phrase in phrases:
                    self.assertIn(phrase, text)
        alumni = self.dom.text('alumni-project')
        self.assertIn('Planned refresh', alumni)
        self.assertIn('Accounting & Finance', alumni)
        self.assertNotIn('live automation', alumni.lower())
        self.assertNotIn('currently runs', alumni.lower())

    def test_leadership_is_reachable_from_all_homepage_navigation(self):
        for identity in ('desktop-navigation', 'mobile-nav', 'command-dialog'):
            self.assertTrue(identity in self.dom.by_id, f'Navigation must be identified: {identity}')
            self.assertIn('Leadership', self.dom.text(identity))
        self.assertIn('data-command="leadership"', self.home)
        app = (ROOT / 'assets/app.js').read_text()
        self.assertRegex(app, r'\["selected-work",\s*"leadership",')


if __name__ == '__main__':
    unittest.main(verbosity=2)
