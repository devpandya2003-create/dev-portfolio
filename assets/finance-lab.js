import {valueFictionalBusiness, DCF_DEFAULT, DCF_PRESETS, stressFictionalAllocation, ALLOCATION_DEFAULT, ALLOCATION_PRESETS, TOY_SCENARIOS} from './finance-lab-core.mjs?v=20261027c';
import {CASES} from './experience-core.mjs?v=20261027b';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const controls = {growthBps: $('#lab-growth'), discountBps: $('#lab-discount'), terminalBps: $('#lab-terminal')};
let selectedYear = 0;
let valuation = null;

function millions(cents) {
  return '$' + (Number(cents) / 100_000_000).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + 'm';
}
function inspectYear() {
  if (!valuation || valuation.status !== 'ok') return;
  $('#lab-year-detail').textContent = `Year ${selectedYear + 1} · fictional FCFF ${millions(valuation.forecastCashCents[selectedYear])} · present value ${millions(valuation.forecastPvsCents[selectedYear])}.`;
  $$('[data-flow]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.flow) === selectedYear)));
}
function renderValuation() {
  const inputs = Object.fromEntries(Object.entries(controls).map(([key, input]) => [key, input.valueAsNumber * 100]));
  valuation = valueFictionalBusiness(inputs);
  for (const [key, input] of Object.entries(controls)) {
    document.getElementById(input.id + '-value').textContent = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber.toFixed(1) + '%' : '—';
  }
  $$('[data-dcf-preset]').forEach(button => {
    const preset = DCF_PRESETS[button.dataset.dcfPreset];
    button.setAttribute('aria-pressed', String(Object.keys(controls).every(key => inputs[key] === preset[key])));
  });
  $('#lab-model-status').textContent = valuation.status === 'ok' ? '' : valuation.message;
  $('#lab-model-status').dataset.state = valuation.status;
  $('#lab-dcf-results').hidden = valuation.status !== 'ok';
  const value = $('#lab-dcf-value');
  value.dataset.cents = valuation.status === 'ok' ? valuation.enterpriseCents : '';
  value.textContent = valuation.status === 'ok' ? millions(valuation.enterpriseCents) : '—';
  if (valuation.status !== 'ok') { $('#lab-flow-chart').replaceChildren(); $('#lab-year-detail').textContent = ''; return; }
  $('#lab-terminal-share').textContent = `${(valuation.terminalShareBps / 100).toFixed(1)}% of this toy value comes from discounted terminal value. Watch how sensitive it is to assumptions.`;
  const largest = Math.max(...valuation.forecastPvsCents.map(Number));
  $('#lab-flow-chart').replaceChildren(...valuation.forecastPvsCents.map((cents, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.flow = String(index);
    button.setAttribute('aria-label', `Inspect year ${index + 1}: discounted fictional FCFF ${millions(cents)}`);
    const bar = document.createElement('span'); bar.className = 'flow-bar'; bar.setAttribute('aria-hidden', 'true');
    bar.style.height = `${Number(cents) / largest * 100}%`;
    const label = document.createElement('span'); label.className = 'flow-year'; label.textContent = `Y${index + 1}`;
    button.append(bar, label);
    button.addEventListener('click', () => { selectedYear = index; inspectYear(); });
    return button;
  }));
  inspectYear();
}
function setDcfInputs(inputs) {
  Object.entries(controls).forEach(([key, input]) => { input.value = String(inputs[key] / 100); });
  selectedYear = 0;
  renderValuation();
}
Object.values(controls).forEach(input => input.addEventListener('input', renderValuation));
$$('[data-dcf-preset]').forEach(button => button.addEventListener('click', () => {
  if (Object.hasOwn(DCF_PRESETS, button.dataset.dcfPreset)) setDcfInputs(DCF_PRESETS[button.dataset.dcfPreset]);
}));
$('#lab-dcf-reset').addEventListener('click', () => setDcfInputs(DCF_DEFAULT));
renderValuation();

const allocationControls = {growth: $('#lab-weight-growth'), bonds: $('#lab-weight-bonds'), cash: $('#lab-weight-cash')};
let stressScenario = 'selloff';
function tokenNumber(hundredths, signed = false) {
  return (signed && hundredths > 0 ? '+' : '') + (hundredths / 100).toFixed(2);
}
function renderAllocation() {
  const weights = Object.fromEntries(Object.entries(allocationControls).map(([key, input]) => [key, input.valueAsNumber]));
  const result = stressFictionalAllocation(weights, stressScenario);
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  $('#lab-budget-total').textContent = Number.isFinite(total) ? `${total} / 100` : '— / 100';
  $('#lab-budget-fill').style.width = `${Number.isFinite(total) ? Math.max(0, Math.min(100, total)) : 0}%`;
  $('#lab-budget-fill').dataset.valid = String(result.status === 'ok');
  for (const input of Object.values(allocationControls)) document.getElementById(input.id + '-value').textContent = String(input.valueAsNumber);
  $$('[data-allocation-preset]').forEach(button => {
    const preset = ALLOCATION_PRESETS[button.dataset.allocationPreset];
    button.setAttribute('aria-pressed', String(Object.keys(weights).every(key => weights[key] === preset[key])));
  });
  $$('[data-stress]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.stress === stressScenario)));
  $('#lab-allocation-status').textContent = result.status === 'ok' ? '' : result.message;
  $('#lab-stress-result').hidden = result.status !== 'ok';
  const ending = $('#lab-token-ending');
  ending.dataset.hundredths = result.status === 'ok' ? String(result.endHundredths) : '';
  ending.textContent = result.status === 'ok' ? `${tokenNumber(result.endHundredths)} tokens` : '—';
  if (result.status !== 'ok') { $('#lab-shock-rows').replaceChildren(); return; }
  $('#lab-selected-scenario').textContent = TOY_SCENARIOS[stressScenario].title;
  $('#lab-token-impact').textContent = `${tokenNumber(result.impactHundredths, true)} teaching tokens in this invented one-step scenario.`;
  for (const key of Object.keys(weights)) document.getElementById('lab-strip-' + key).style.width = `${weights[key]}%`;
  const names = {growth: 'Growth', bonds: 'Bonds', cash: 'Cash'};
  $('#lab-shock-rows').replaceChildren(...result.contributions.map(part => {
    const row = document.createElement('tr');
    const name = document.createElement('th'); name.scope = 'row'; name.textContent = names[part.key]; row.append(name);
    for (const text of [String(part.weight), (part.shockBps > 0 ? '+' : '') + (part.shockBps / 100).toFixed(0) + '%', tokenNumber(part.impactHundredths, true)]) {
      const cell = document.createElement('td'); cell.textContent = text; row.append(cell);
    }
    return row;
  }));
  $('#lab-allocation-note').textContent = weights.cash === 100
    ? 'All tokens are in the cash sleeve, which is fixed flat in these authored examples. Real-world cash risks and inflation are excluded.'
    : Math.max(...Object.values(weights)) === 100
      ? 'A single-sleeve mix concentrates the toy outcome in that sleeve’s assigned shock. It is not a recommended allocation.'
      : 'Changing the mix changes exposure to these assigned shocks. It does not prove real-world diversification or a future loss limit.';
}
function setAllocation(weights) {
  Object.entries(allocationControls).forEach(([key, input]) => { input.value = String(weights[key]); });
  renderAllocation();
}
Object.values(allocationControls).forEach(input => input.addEventListener('input', renderAllocation));
$$('[data-stress]').forEach(button => button.addEventListener('click', () => {
  if (!Object.hasOwn(TOY_SCENARIOS, button.dataset.stress)) return;
  stressScenario = button.dataset.stress; renderAllocation();
}));
$$('[data-allocation-preset]').forEach(button => button.addEventListener('click', () => {
  if (Object.hasOwn(ALLOCATION_PRESETS, button.dataset.allocationPreset)) setAllocation(ALLOCATION_PRESETS[button.dataset.allocationPreset]);
}));
$('#lab-allocation-reset').addEventListener('click', () => { stressScenario = 'selloff'; setAllocation(ALLOCATION_DEFAULT); });
renderAllocation();

const labTabs = $$('[data-lab-tab]');
function activateLab(key, focus = false) {
  if (!labTabs.some(tab => tab.dataset.labTab === key)) return;
  labTabs.forEach(tab => {
    const active = tab.dataset.labTab === key;
    tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    if (active && focus) tab.focus();
  });
  if (window.matchMedia('(max-width: 600px)').matches) {
    $('#finance-lab .lab-tablist').scrollIntoView({block: 'start', behavior: 'auto'});
  }
}
labTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateLab(tab.dataset.labTab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % labTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + labTabs.length - 1) % labTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = labTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); activateLab(labTabs[next].dataset.labTab, true);
  });
});

const comparisonInputs = {left: $('#lab-compare-left'), right: $('#lab-compare-right')};
const chartDialog = $('#lab-chart-dialog');
function openSourceChart(key) {
  if (!Object.hasOwn(CASES, key)) return;
  const data = CASES[key];
  $('#lab-chart-title').textContent = `${data.title} · source chart`;
  $('#lab-chart-case-link').href = data.link;
  const image = document.createElement('img');
  image.src = data.image; image.alt = data.alt;
  image.addEventListener('error', () => {
    if (!image.isConnected) return;
    const message = document.createElement('p');
    message.textContent = 'The chart could not load. Open the full case below for its source context.';
    image.replaceWith(message);
  });
  $('#lab-chart-image').replaceChildren(image);
  if (!chartDialog.open) chartDialog.showModal();
}
function comparisonCard(key, side) {
  const data = CASES[key];
  const article = document.createElement('article'); article.id = `lab-comparison-${side}`; article.dataset.case = key;
  const date = document.createElement('p'); date.className = 'eyebrow'; date.textContent = data.date;
  const title = document.createElement('h4'); title.textContent = data.title;
  const copy = document.createElement('p'); copy.className = 'comparison-copy'; copy.textContent = data.copy;
  const preview = document.createElement('button'); preview.type = 'button'; preview.className = 'comparison-chart'; preview.dataset.labChart = key;
  preview.setAttribute('aria-label', `Enlarge ${data.title} source chart`);
  const image = document.createElement('img'); image.src = data.image; image.alt = data.alt; image.loading = 'lazy';
  const prompt = document.createElement('span'); prompt.textContent = 'Enlarge the original chart ↗';
  preview.append(image, prompt); preview.addEventListener('click', () => openSourceChart(key));
  const facts = document.createElement('dl');
  for (const [label, value] of [['Method', data.method], ['Question', data.question], ['Risk lens', data.risk]]) {
    const row = document.createElement('div'); const term = document.createElement('dt'); term.textContent = label;
    const detail = document.createElement('dd'); detail.textContent = value; row.append(term, detail); facts.append(row);
  }
  const links = document.createElement('div'); links.className = 'comparison-links';
  const caseLink = document.createElement('a'); caseLink.href = data.link; caseLink.textContent = 'Full case ↗';
  const modelLink = document.createElement('a'); modelLink.href = data.model; modelLink.download = ''; modelLink.textContent = 'Workbook ↓';
  links.append(caseLink, modelLink); article.append(date, title, copy, preview, facts, links);
  return article;
}
function renderComparison() {
  const left = comparisonInputs.left.value;
  const right = comparisonInputs.right.value;
  const valid = Object.hasOwn(CASES, left) && Object.hasOwn(CASES, right) && left !== right;
  Object.values(comparisonInputs).forEach(input => input.setAttribute('aria-invalid', String(!valid)));
  $('#lab-compare-status').textContent = valid ? '' : 'Choose two different cases from the lists.';
  $('#lab-comparison-output').hidden = !valid;
  $('#lab-comparison-output').replaceChildren(...(valid ? [comparisonCard(left, 'left'), comparisonCard(right, 'right')] : []));
}
Object.values(comparisonInputs).forEach(input => input.addEventListener('change', renderComparison));
$('#lab-compare-swap').addEventListener('click', () => {
  const left = comparisonInputs.left.value;
  comparisonInputs.left.value = comparisonInputs.right.value;
  comparisonInputs.right.value = left;
  renderComparison();
});
$('#lab-chart-close').addEventListener('click', () => chartDialog.close());
chartDialog.addEventListener('click', event => { if (event.target === chartDialog) chartDialog.close(); });
renderComparison();
