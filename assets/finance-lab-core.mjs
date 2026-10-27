/** Authored educational models. No company data, forecasts, orders, or advice. */
export const DCF_DEFAULT = Object.freeze({growthBps: 800, discountBps: 1000, terminalBps: 200});
export const DCF_PRESETS = Object.freeze({
  base: DCF_DEFAULT,
  growth: Object.freeze({growthBps: 1200, discountBps: 1000, terminalBps: 200}),
  hurdle: Object.freeze({growthBps: 800, discountBps: 1400, terminalBps: 200})
});

function fraction(n, d = 1n) {
  let a = n < 0n ? -n : n;
  let b = d < 0n ? -d : d;
  while (b) [a, b] = [b, a % b];
  const sign = d < 0n ? -1n : 1n;
  return {n: sign * n / a, d: sign * d / a};
}
function plus(a, b) { return fraction(a.n * b.d + b.n * a.d, a.d * b.d); }
function times(a, b) { return fraction(a.n * b.n, a.d * b.d); }
function dividedBy(a, b) { return fraction(a.n * b.d, a.d * b.n); }
function roundedPositive(a) { return (a.n * 2n + a.d) / (a.d * 2n); }

export function valueFictionalBusiness(inputs) {
  const invalid = message => ({status: 'invalid_assumptions', message});
  if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)
    || Object.keys(inputs).sort().join(',') !== 'discountBps,growthBps,terminalBps') {
    return invalid('Supply only the three supported rate assumptions.');
  }
  const {growthBps, discountBps, terminalBps} = inputs;
  const ranges = [[growthBps, 0, 2000], [discountBps, 300, 1800], [terminalBps, 0, 500]];
  if (ranges.some(([value, min, max]) => !Number.isInteger(value) || value < min || value > max || value % 50 !== 0)) {
    return invalid('Use the supported half-percentage-point slider steps and ranges.');
  }
  if (discountBps <= terminalBps) return invalid('Discount rate must be greater than terminal growth.');
  const growth = fraction(10000n + BigInt(growthBps), 10000n);
  const discount = fraction(10000n + BigInt(discountBps), 10000n);
  let cash = fraction(1_000_000_000n); // Fictional year-zero FCFF: USD 10 million.
  let discountFactor = fraction(1n);
  const cashFlows = [];
  const presentValues = [];
  for (let year = 1; year <= 5; year++) {
    cash = times(cash, growth);
    discountFactor = times(discountFactor, discount);
    cashFlows.push(cash);
    presentValues.push(dividedBy(cash, discountFactor));
  }
  const terminalCash = times(cash, fraction(10000n + BigInt(terminalBps), 10000n));
  const terminalValue = dividedBy(terminalCash, fraction(BigInt(discountBps - terminalBps), 10000n));
  const terminalPv = dividedBy(terminalValue, discountFactor);
  const enterprise = presentValues.reduce(plus, terminalPv);
  return {
    status: 'ok',
    enterpriseCents: roundedPositive(enterprise).toString(),
    forecastCashCents: cashFlows.map(value => roundedPositive(value).toString()),
    forecastPvsCents: presentValues.map(value => roundedPositive(value).toString()),
    terminalPvCents: roundedPositive(terminalPv).toString(),
    terminalShareBps: Number(roundedPositive(times(dividedBy(terminalPv, enterprise), fraction(10000n)))),
    enterpriseExact: {numerator: enterprise.n.toString(), denominator: enterprise.d.toString()}
  };
}

export const ALLOCATION_DEFAULT = Object.freeze({growth: 50, bonds: 40, cash: 10});
export const ALLOCATION_PRESETS = Object.freeze({
  split: ALLOCATION_DEFAULT,
  growth: Object.freeze({growth: 100, bonds: 0, cash: 0}),
  cash: Object.freeze({growth: 0, bonds: 0, cash: 100})
});
export const TOY_SCENARIOS = Object.freeze({
  selloff: Object.freeze({title: 'Toy equity sell-off', shocks: Object.freeze({growth: -2000, bonds: 400, cash: 0})}),
  rates: Object.freeze({title: 'Toy rate shock', shocks: Object.freeze({growth: -800, bonds: -1000, cash: 0})}),
  riskon: Object.freeze({title: 'Toy risk-on move', shocks: Object.freeze({growth: 1200, bonds: 300, cash: 0})})
});

export function stressFictionalAllocation(weights, scenario) {
  const invalid = () => ({status: 'invalid_allocation', message: 'Use whole-token weights from 0 to 100 and one of the authored scenarios.'});
  if (!weights || typeof weights !== 'object' || Array.isArray(weights)
    || Object.keys(weights).sort().join(',') !== 'bonds,cash,growth'
    || typeof scenario !== 'string' || !Object.hasOwn(TOY_SCENARIOS, scenario)) return invalid();
  if (Object.values(weights).some(value => !Number.isInteger(value) || value < 0 || value > 100)) return invalid();
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (total !== 100) return {status: 'allocation_incomplete', total, remaining: 100 - total,
    message: total < 100 ? `Allocate ${100 - total} more tokens to reach 100.` : `Remove ${total - 100} tokens to return to 100.`};
  const contributions = ['growth', 'bonds', 'cash'].map(key => {
    const impact = weights[key] * TOY_SCENARIOS[scenario].shocks[key] / 100;
    return {key, weight: weights[key], shockBps: TOY_SCENARIOS[scenario].shocks[key], impactHundredths: impact === 0 ? 0 : impact};
  });
  const impactHundredths = contributions.reduce((sum, part) => sum + part.impactHundredths, 0);
  return {status: 'ok', total, scenario, impactHundredths, endHundredths: 10000 + impactHundredths, contributions};
}
