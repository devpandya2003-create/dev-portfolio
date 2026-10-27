#!/usr/bin/env python3
"""Independent Fraction oracle for an explicitly fictional five-year FCFF demo.

Creates authored numerical test fixtures, not company observations or forecasts.
No website JavaScript is imported or executed.
"""
from fractions import Fraction
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE_CENTS = 10_000_000 * 100
SAMPLES = [
    {'growthBps': 800, 'discountBps': 1000, 'terminalBps': 200},
    {'growthBps': 0, 'discountBps': 1000, 'terminalBps': 0},
    {'growthBps': 1200, 'discountBps': 1000, 'terminalBps': 200},
    {'growthBps': 800, 'discountBps': 1400, 'terminalBps': 200},
    {'growthBps': 800, 'discountBps': 300, 'terminalBps': 250},
    {'growthBps': 2000, 'discountBps': 550, 'terminalBps': 500},
]


def rounded(value):
    assert value >= 0
    return (value.numerator * 2 + value.denominator) // (value.denominator * 2)


def evaluate(inputs):
    growth = Fraction(inputs['growthBps'], 10_000)
    discount = Fraction(inputs['discountBps'], 10_000)
    terminal = Fraction(inputs['terminalBps'], 10_000)
    cash = [Fraction(BASE_CENTS) * (1 + growth) ** year for year in range(1, 6)]
    pvs = [value / (1 + discount) ** year for year, value in enumerate(cash, 1)]
    terminal_pv = cash[-1] * (1 + terminal) / (discount - terminal) / (1 + discount) ** 5
    value = sum(pvs) + terminal_pv
    return {
        'status': 'ok',
        'enterpriseCents': str(rounded(value)),
        'forecastCashCents': [str(rounded(x)) for x in cash],
        'forecastPvsCents': [str(rounded(x)) for x in pvs],
        'terminalPvCents': str(rounded(terminal_pv)),
        'terminalShareBps': rounded(terminal_pv / value * 10_000),
        'enterpriseExact': {'numerator': str(value.numerator), 'denominator': str(value.denominator)},
    }


def allocation_cases():
    authored = {'selloff': {'growth': -2000, 'bonds': 400, 'cash': 0},
                'rates': {'growth': -800, 'bonds': -1000, 'cash': 0},
                'riskon': {'growth': 1200, 'bonds': 300, 'cash': 0}}
    allocations = [{'growth': 50, 'bonds': 40, 'cash': 10},
                   {'growth': 100, 'bonds': 0, 'cash': 0},
                   {'growth': 0, 'bonds': 0, 'cash': 100},
                   {'growth': 35, 'bonds': 35, 'cash': 30}]
    results = []
    for weights in allocations:
        assert sum(weights.values()) == 100
        for scenario, shocks in authored.items():
            parts = [{'key': key, 'weight': weights[key], 'shockBps': shocks[key],
                      'impactHundredths': int(Fraction(weights[key] * shocks[key], 100))}
                     for key in ('growth', 'bonds', 'cash')]
            impact = sum(part['impactHundredths'] for part in parts)
            results.append({'weights': weights, 'scenario': scenario,
                            'expected': {'status': 'ok', 'total': 100, 'scenario': scenario,
                                         'impactHundredths': impact, 'endHundredths': 10_000 + impact,
                                         'contributions': parts}})
    return results


def main():
    result = {'fixture_class': 'AUTHORED_FICTIONAL_EDUCATIONAL',
              'units': 'USD cents; rates in basis points; positive half-up display rounding',
              'base_year_fcff_cents': str(BASE_CENTS), 'years': 5,
              'cases': [{'inputs': inputs, 'expected': evaluate(inputs)} for inputs in SAMPLES],
              'allocation_units': 'hundredths of fictional tokens, not money; authored shocks, not observations',
              'allocation_cases': allocation_cases()}
    path = ROOT / 'fixtures' / 'finance-lab-oracle.json'
    path.parent.mkdir(exist_ok=True)
    path.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({'oracle': str(path), 'cases': len(result['cases']),
                      'base_enterprise_cents': result['cases'][0]['expected']['enterpriseCents']}, indent=2))


if __name__ == '__main__':
    main()
