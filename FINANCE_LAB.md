# Educational Finance Lab — Calculation Contract

## Boundaries

The lab is an interactive teaching surface within a personal portfolio. It does not consume market data, value a real company, predict returns, recommend an allocation, collect visitor information, or execute transactions. All demo assumptions are authored examples. Existing dated research remains separate and unchanged.

## Fictional operating-value model

- Fixed year-zero free cash flow to the firm: USD 10 million.
- Forecast years: 1–5, with a constant user-selected FCFF growth rate.
- Forecast growth slider: 0–20%; discount / cost-of-capital slider: 3–18%; terminal FCFF growth slider: 0–5%. All use half-percentage-point steps.
- `FCFF(t) = FCFF(0) × (1 + forecast_growth)^t`.
- `PV(t) = FCFF(t) / (1 + discount_rate)^t`.
- `TerminalValue(5) = FCFF(5) × (1 + terminal_growth) / (discount_rate − terminal_growth)`.
- Discount terminal value back five years and add the five forecast present values.
- Require discount rate strictly greater than terminal growth. Malformed/out-of-domain inputs return an explicit invalid state, with no value.

JavaScript BigInt fractions retain exact rational arithmetic through the calculation. Positive half-up rounding to cents is a separate output projection. The interface displays approximate millions and labels them as fictional operating value, not equity value or a per-share price. It separately exposes terminal-value dependence and each forecast year's cash flow/present value.

This is not a full operating forecast: reinvestment, taxes, economic sustainability, debt, non-operating assets, and shares are not independently reconciled. The sliders illustrate sensitivity; they do not endorse economically realistic assumptions.

## Authored token-allocation model

- Initial budget: exactly 100 fictional teaching tokens, not currency.
- Weights: whole tokens from 0–100 in growth, bonds, and cash; the UI moves in five-token steps.
- No silent normalization. A total below/above 100 yields an incomplete allocation and withholds the scenario result.
- Equity sell-off example: growth −20%, bonds +4%, cash 0%.
- Rate-shock example: growth −8%, bonds −10%, cash 0%.
- Risk-on example: growth +12%, bonds +3%, cash 0%.
- Contribution in hundredths of a token = `weight × authored_shock_bps / 100`.
- Ending tokens in hundredths = `10000 + sum(contributions)`.

These shocks have no claimed historical basis, probability, forecast status, calibration, or investment suitability. Fixing the cash sleeve flat does not imply that cash is risk-free. Fees, taxes, inflation, changing correlations, and other real-world risks are omitted. There is no score or optimal-allocation recommendation.

## Research comparisons

The comparator reads the existing public `CASES` map. It shows original report dates, methods, questions, risk lenses, source charts, case links, and workbook downloads. Duplicate/unknown selections hide the comparison rather than retaining stale data. The chart viewer creates a new image node for each source and uses an explicit error fallback, never an invented replacement chart.

## Independent arithmetic checks

`scripts/build_lab_oracle.py` independently computes the valuation fixtures with Python `Fraction`, without importing website JavaScript. `scripts/fixtures/finance-lab-oracle.json` is labeled `AUTHORED_FICTIONAL_EDUCATIONAL`. Node tests compare the browser model against these exact expected values and exercise malformed inputs, invalid growth/discount relationships, incomplete allocations, and unknown scenarios. CI regenerates the oracle and fails if checked-in fixture bytes differ.

## Primary conceptual references

Verified live on October 27, 2026:

1. CFA Institute, **Free Cash Flow Valuation**, 2026 curriculum edition; public Summary, FCFF and two-stage valuation expressions. This establishes the general model, not the lab's fictional inputs.
   https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation
2. Aswath Damodaran / NYU Stern, **The Little Book of Valuation — Terminal Value**, undated page; going-concern model and constraints on growth, risk, and reinvestment. Metadata timestamps are not treated as a publication date.
   https://pages.stern.nyu.edu/adamodar/New_Home_Page/littlebook/terminalvalue.htm
3. U.S. SEC / Investor.gov, **Asset Allocation and Diversification**, undated page; definitions, horizon/risk-tolerance context, and limitations. It does not validate or endorse the authored scenario shocks or weights.
   https://www.investor.gov/introduction-investing/getting-started/asset-allocation
