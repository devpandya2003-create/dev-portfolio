import {CASES, CAREER, AUDIENCES, QUESTIONS, initialChallenge, answerChallenge, nextChallenge} from './experience-core.mjs?v=20261027b';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const deskTabs = $$('[data-desk-tab]');

function openDesk(key, focus = false) {
  if (!deskTabs.some(tab => tab.dataset.deskTab === key)) return;
  deskTabs.forEach(tab => {
    const active = tab.dataset.deskTab === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    if (active && focus) tab.focus();
  });
}

function openCase(key) {
  const data = Object.hasOwn(CASES, key) ? CASES[key] : null;
  if (!data) return;
  const text = {'#desk-case-title': data.title, '#desk-case-date': data.date, '#desk-case-copy': data.copy,
    '#desk-case-method': data.method, '#desk-case-question': data.question, '#desk-case-risk': data.risk};
  Object.entries(text).forEach(([selector, value]) => { $(selector).textContent = value; });
  $('#desk-case-link').href = data.link;
  $('#desk-model-link').href = data.model;
  $('#desk-case-image').src = data.image;
  $('#desk-case-image').alt = data.alt;
  $$('[data-desk-case]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.deskCase === key)));
}

function openCareer(key) {
  const data = Object.hasOwn(CAREER, key) ? CAREER[key] : null;
  if (!data) return;
  const text = {'#career-title': data.title, '#career-location': data.location, '#career-role': data.role, '#career-copy': data.copy};
  Object.entries(text).forEach(([selector, value]) => { $(selector).textContent = value; });
  $('#career-skills').replaceChildren(...data.skills.map(value => { const item = document.createElement('li'); item.textContent = value; return item; }));
  $$('[data-career]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.career === key)));
}

deskTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => openDesk(tab.dataset.deskTab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % deskTabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + deskTabs.length - 1) % deskTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = deskTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    openDesk(deskTabs[next].dataset.deskTab, true);
  });
});
$$('[data-desk-jump]').forEach(link => link.addEventListener('click', () => openDesk(link.dataset.deskJump)));
$$('[data-desk-case]').forEach(button => button.addEventListener('click', () => openCase(button.dataset.deskCase)));
$$('[data-career]').forEach(button => button.addEventListener('click', () => openCareer(button.dataset.career)));
$$('[data-audience]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.audience;
  if (!Object.hasOwn(AUDIENCES, key)) return;
  const route = AUDIENCES[key];
  openDesk(route.tab);
  $('#audience-note').textContent = route.note;
  $$('[data-audience]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));

const profile = $('#profile-dialog');
$$('[data-profile-open]').forEach(button => button.addEventListener('click', () => {
  $('#command-dialog')?.close();
  if (!profile.open) profile.showModal();
}));
$$('[data-profile-close]').forEach(button => button.addEventListener('click', () => profile.close()));
profile?.addEventListener('click', event => { if (event.target === profile) profile.close(); });

let challenge = initialChallenge();
function renderChallenge(moveFocus = false) {
  const question = QUESTIONS[challenge.index];
  $('#challenge-progress').value = challenge.unlocked.length;
  $('#challenge-progress').textContent = `${challenge.unlocked.length} of 3 checks completed`;
  $('#challenge-count').textContent = `${challenge.unlocked.length} / 3`;
  $('#challenge-question-wrapper').hidden = challenge.complete;
  $('#challenge-complete').hidden = !challenge.complete;
  $('#challenge-step').textContent = `CHECK ${challenge.index + 1} / 3 · ${['VALUATION', 'EXPECTATIONS', 'DOWNSIDE'][challenge.index]}`;
  $('#challenge-question').textContent = question.title;
  $('#challenge-feedback').textContent = challenge.feedback;
  $('#challenge-feedback').dataset.kind = challenge.kind;
  $('#challenge-source').href = question.source;
  $('#challenge-source').textContent = `${question.sourceLabel} ↗`;
  $('#challenge-next').hidden = !challenge.answered;
  $('#challenge-next').textContent = challenge.index === QUESTIONS.length - 1 ? 'Complete the journey →' : 'Next check →';
  $('#challenge-answers').replaceChildren(...question.choices.map((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.answer = String(index);
    button.textContent = choice;
    button.disabled = challenge.answered;
    button.classList.toggle('is-correct', challenge.answered && index === question.answer);
    button.addEventListener('click', () => {
      challenge = answerChallenge(challenge, index);
      renderChallenge();
      if (challenge.answered) $('#challenge-next').focus({preventScroll: true});
      else $('#challenge-answers').children[index]?.focus({preventScroll: true});
    });
    return button;
  }));
  $$('[data-unlock]').forEach(card => {
    const unlocked = challenge.unlocked.includes(card.dataset.unlock);
    card.dataset.unlocked = String(unlocked);
    card.querySelector('[data-unlock-content]').hidden = !unlocked;
    card.querySelector('[data-unlock-hint]').hidden = unlocked;
  });
  if (moveFocus) {
    const target = challenge.complete ? $('#challenge-complete h3') : $('#challenge-question');
    target.focus({preventScroll: true});
  }
}

$('#challenge-next').addEventListener('click', () => { challenge = nextChallenge(challenge); renderChallenge(true); });
$('#challenge-replay').addEventListener('click', () => { challenge = initialChallenge(); renderChallenge(true); });
renderChallenge();

$$('[data-theme-cycle]').forEach(button => button.addEventListener('click', () => $('#theme-toggle')?.click()));
const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = $('#motion-toggle');
let motionChoice = 'on';
try { if (localStorage.getItem('dev-portfolio-motion') === 'off') motionChoice = 'off'; } catch { /* Preferences are optional. */ }
function applyMotion() {
  const enabled = !motionMedia.matches && motionChoice === 'on';
  document.documentElement.dataset.motion = enabled ? 'on' : 'off';
  motionButton.disabled = motionMedia.matches;
  motionButton.textContent = motionMedia.matches ? 'Reduced motion' : enabled ? 'Motion on' : 'Motion off';
  motionButton.setAttribute('aria-pressed', String(enabled));
}
motionButton.addEventListener('click', () => {
  motionChoice = motionChoice === 'on' ? 'off' : 'on';
  try { localStorage.setItem('dev-portfolio-motion', motionChoice); } catch { /* Controls still work without storage. */ }
  applyMotion();
});
motionMedia.addEventListener('change', applyMotion);
applyMotion();
function pauseHiddenAmbient() { document.documentElement.dataset.ambient = document.hidden ? 'paused' : 'running'; }
document.addEventListener('visibilitychange', pauseHiddenAmbient);
pauseHiddenAmbient();
if ('IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(entries => {
    document.documentElement.dataset.heroVisible = String(entries[0].isIntersecting);
  });
  heroObserver.observe($('.market-hero'));
}
