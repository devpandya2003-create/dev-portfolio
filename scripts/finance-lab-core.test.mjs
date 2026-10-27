import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';

const moduleURL = new URL('../assets/finance-lab-core.mjs', import.meta.url);
const fixture = JSON.parse(readFileSync(new URL('./fixtures/finance-lab-oracle.json', import.meta.url), 'utf8'));

test('fictional FCFF calculator matches an independent exact-rational oracle and rejects invalid assumptions', async () => {
  assert.equal(existsSync(moduleURL), true, 'The educational valuation calculator must exist');
  const core = await import(moduleURL.href);
  assert.equal(typeof core.valueFictionalBusiness, 'function');
  for (const sample of fixture.cases) {
    const before = structuredClone(sample.inputs);
    assert.deepEqual(core.valueFictionalBusiness(sample.inputs), sample.expected, JSON.stringify(sample.inputs));
    assert.deepEqual(sample.inputs, before, 'Do not mutate slider inputs');
  }
  const base = fixture.cases[0].inputs;
  for (const invalid of [null, [], {}, {...base, growthBps: '800'}, {...base, growthBps: true},
    {...base, growthBps: NaN}, {...base, growthBps: Infinity}, {...base, growthBps: -50},
    {...base, growthBps: 850.5}, {...base, growthBps: 825}, {...base, growthBps: 2050},
    {...base, discountBps: 250}, {...base, terminalBps: 550}, {...base, discountBps: 300, terminalBps: 300},
    {...base, discountBps: 300, terminalBps: 350}, {...base, company: 'real ticker'}]) {
    const result = core.valueFictionalBusiness(invalid);
    assert.equal(result.status, 'invalid_assumptions');
    assert.equal(Object.hasOwn(result, 'enterpriseCents'), false, 'Never return a stale or invented value on invalid input');
  }
});

test('the 100-token stress model matches authored arithmetic and never normalizes invalid allocations', async () => {
  const core = await import(moduleURL.href);
  assert.equal(typeof core.stressFictionalAllocation, 'function', 'A bounded allocation stress model must exist');
  for (const sample of fixture.allocation_cases) {
    const before = structuredClone(sample.weights);
    assert.deepEqual(core.stressFictionalAllocation(sample.weights, sample.scenario), sample.expected);
    assert.deepEqual(sample.weights, before);
  }
  const under = core.stressFictionalAllocation({growth: 45, bonds: 40, cash: 10}, 'selloff');
  assert.equal(under.status, 'allocation_incomplete');
  assert.equal(under.remaining, 5);
  assert.equal(Object.hasOwn(under, 'endHundredths'), false);
  const over = core.stressFictionalAllocation({growth: 55, bonds: 40, cash: 10}, 'selloff');
  assert.equal(over.status, 'allocation_incomplete');
  assert.equal(over.remaining, -5);
  assert.equal(Object.hasOwn(over, 'endHundredths'), false);
  for (const weights of [null, [], {}, {growth: 100}, {growth: '50', bonds: 40, cash: 10},
    {growth: true, bonds: 40, cash: 10}, {growth: 50.5, bonds: 39.5, cash: 10},
    {growth: 45, bonds: 40, cash: 15, returns: 99}, {growth: -5, bonds: 100, cash: 5},
    {growth: 101, bonds: 0, cash: 0}, {growth: NaN, bonds: 40, cash: 10}]) {
    assert.equal(core.stressFictionalAllocation(weights, 'selloff').status, 'invalid_allocation');
  }
  for (const scenario of ['__proto__', 'unknown', null, 1]) {
    assert.equal(core.stressFictionalAllocation({growth: 50, bonds: 40, cash: 10}, scenario).status, 'invalid_allocation');
  }
});
