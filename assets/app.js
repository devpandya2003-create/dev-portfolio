(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const projects = {
    mattson: {
      path: "experience/mattson-technology",
      label: "FINANCE & ACCOUNTING / INTERNSHIP",
      status: "JUNE–SEPTEMBER 2026",
      title: "Mattson Technology",
      copy: "I am helping automate finance department processes — building AI-driven tools that streamline recurring analysis and reporting so the team spends less time on manual work. Alongside that, I evaluate customer creditworthiness using Equifax business scores, balance sheets, income statements, and cash flows; analyze production costs, material usage, and overhead allocation; and support month-end close, budget tracking, and internal reporting.",
      architecture: ["FINANCE AUTOMATION", "CREDIT REVIEW", "COST ANALYSIS", "MANAGEMENT REVIEW"],
      facts: [["Location", "Fremont, CA"], ["Function", "Finance + Accounting"], ["Focus", "Process automation"], ["Reporting", "VP of Finance"]],
      note: "Assisting in automating finance department processes while gaining hands-on exposure to financial controls, forecasting, and decision support."
    },
    mindox: {
      path: "experience/mindox-techno",
      label: "COST ACCOUNTING / INTERNSHIP",
      status: "MAY–JUNE 2024",
      title: "Mindox Techno",
      copy: "I analyzed project and inventory costs, identified a 7% variance between budgeted and actual expenses, and prepared management material on cost trends.",
      architecture: ["COST DATA", "VARIANCE", "MARGIN VIEW", "SUMMARY"],
      facts: [["Location", "Singapore"], ["Tools", "Excel + PowerPoint"], ["Scope", "50+ line items"]],
      note: "Built cost schedules and supported internal review with clear summaries."
    },
    relianceops: {
      path: "experience/reliance-arc-operations",
      label: "ASSET RECONSTRUCTION / OPERATIONS INTERNSHIP",
      status: "MAY–JULY 2023",
      title: "Reliance Asset Reconstruction Company",
      copy: "I analyzed borrower and loan data for more than 50 distressed accounts representing over ₹70 crore of exposure, then prepared account-level summaries for portfolio monitoring.",
      architecture: ["BORROWER DATA", "VALIDATE", "ACCOUNT SUMMARY", "PORTFOLIO REVIEW"],
      facts: [["Location", "Mumbai"], ["Scope", "50+ accounts"], ["Data accuracy", "Improved 18%"]],
      note: "Maintained KYC, borrower, and property records with systematic reconciliation checks."
    },
    reliancesecretarial: {
      path: "experience/reliance-arc-secretarial",
      label: "CORPORATE RECORDS / SECRETARIAL INTERNSHIP",
      status: "MAY–JULY 2022",
      title: "Reliance Asset Reconstruction Company",
      copy: "I supported corporate-action and redemption documentation for dematerialized securities, charge filings under the Companies Act, and board and committee compliance records.",
      architecture: ["DOCUMENT", "REVIEW", "FILE", "COMPLIANCE RECORD"],
      facts: [["Location", "Mumbai"], ["Area", "Corporate compliance"], ["Exposure", "Board records"]],
      note: "An early introduction to accuracy, process, and documentation in financial services."
    },
    portfolio: {
      path: "academic/global-portfolio",
      label: "PORTFOLIO MANAGEMENT / ACADEMIC PROJECT",
      status: "HYPOTHETICAL PORTFOLIO",
      title: "$300,000 Global Portfolio",
      copy: "I designed a hypothetical diversified global portfolio using macroeconomic analysis and risk optimization to connect economic views with asset allocation decisions.",
      architecture: ["MACRO VIEW", "ASSET ALLOCATION", "RISK", "PORTFOLIO RATIONALE"],
      facts: [["Context", "Academic"], ["Notional value", "$300,000"], ["Capital", "No real funds"]],
      note: "A classroom exercise in diversification and portfolio construction, not a performance claim."
    },
    esg: {
      path: "academic/esg-econometrics",
      label: "ESG ANALYSIS / ECONOMETRICS",
      status: "ACADEMIC PROJECT",
      title: "ESG, Firm Risk, and Value",
      copy: "I used regression techniques to examine relationships between ESG scores and firm risk and value, with attention to what statistical associations can and cannot establish.",
      architecture: ["QUESTION", "DATA", "REGRESSION", "INTERPRETATION"],
      facts: [["Method", "Econometric analysis"], ["Subject", "ESG scores"], ["Outcome", "Risk + value"]],
      note: "A research exercise in analytical interpretation rather than a universal ESG conclusion."
    }
  };

  const notes = {
    vistra: {
      index: "ER—001",
      meta: "VISTRA CORP / NYSE: VST / INDEPENDENT STOCK PITCH / APRIL 4, 2026",
      title: "Vistra Corp: a catalyst-led power thesis",
      deck: "The report assigns a BUY at $153.79 and a $208 12-month target, implying 35.2% upside as of the report date.",
      body: `
        <h3>Investment case in the report</h3>
        <p>The thesis connects three near-term catalysts—Q1 2026 results, the anticipated Cogentrix close and synergy update, and another potential hyperscaler agreement—with Vistra’s diversified nuclear, gas, solar, storage, and retail footprint.</p>
        <h3>Valuation method</h3>
        <p>The $208 target blends a $193.79 DCF value at 60% and a $229.31 peer-relative value at 40%. The DCF uses a 13.0% WACC, a 15.5x exit EV/EBITDA multiple, and $9.2B of FY2028 estimated EBITDA.</p>
        <blockquote>Dated analytical judgment: $208 target, 35.2% report-date upside.</blockquote>
        <h3>Risk work</h3>
        <ul>
          <li>FERC and hyperscaler-contract regulatory risk.</li>
          <li>China-linked supplier and tariff exposure.</li>
          <li>Cogentrix integration and nuclear-outage execution risk.</li>
          <li>Valuation and sentiment risk after a large prior share-price move.</li>
        </ul>
        <p><a class="report-link" href="assets/research/Dev-Pandya-Vistra-Equity-Research.pdf" target="_blank" rel="noreferrer">Open the complete 27-page Vistra report (PDF) ↗</a></p>
        <p class="boundary">INDEPENDENT EDUCATIONAL RESEARCH / REPORT DATE: APRIL 4, 2026 / NOT CURRENT MARKET DATA / NOT INVESTMENT ADVICE</p>`
    },
    firstsolar: {
      index: "ER—002",
      meta: "FIRST SOLAR / NYSE: FSLR / SELL-SIDE-STYLE EQUITY REPORT",
      title: "First Solar: domestic manufacturing and policy tailwinds",
      deck: "The source report assigns a BUY at $198.815 with a $250 target and 25.7% projected upside; the document does not state a publication date.",
      body: `
        <h3>Investment case in the report</h3>
        <p>The analysis focuses on First Solar’s cadmium-telluride thin-film technology, contracted backlog, U.S. manufacturing position, policy support, earnings growth, and domestic supply-chain advantage.</p>
        <h3>Analytical scope</h3>
        <ul>
          <li>Company and solar-industry overview.</li>
          <li>Valuation, return, leverage, profitability, and DuPont measures.</li>
          <li>Historical and estimated sales and diluted EPS tables.</li>
          <li>Porter’s Five Forces and a dedicated risk analysis.</li>
        </ul>
        <h3>Risks identified</h3>
        <p>The report highlights policy dependence, supply disruption, global module-price competition, manufacturing capital expenditure, backlog execution, and substitute-technology risk.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-First-Solar-Sell-Side-Report.docx" download>Download the complete First Solar report (DOCX) ↓</a></p>
        <p class="boundary">INDEPENDENT EDUCATIONAL RESEARCH / SOURCE DOCUMENT HAS NO STATED REPORT DATE / NOT CURRENT MARKET DATA / NOT INVESTMENT ADVICE</p>`
    },
    ttwo: {
      index: "ER—003",
      meta: "TAKE-TWO INTERACTIVE / NASDAQ: TTWO / JULY 4, 2026",
      title: "Take-Two: a generational catalyst with timing risk",
      deck: "The report assigns an illustrative long-term Overweight with a $281 target and 12% implied return from an approximately $250 July 3, 2026 close, while taking a more cautious near-term stance.",
      body: `
        <h3>Investment case in the report</h3>
        <p>The analysis weighs Take-Two’s major release cycle, recurrent consumer spending, NBA 2K and Zynga diversification, and expected cash-flow inflection against a premium valuation and dependence on launch timing.</p>
        <h3>Scenario analysis</h3>
        <ul>
          <li><strong>Bull:</strong> $330–$370+ with an on-time launch, strong unit sales, earlier online monetization, and PC optionality.</li>
          <li><strong>Base:</strong> $280–$300 with an on-time launch and a later online ramp.</li>
          <li><strong>Bear:</strong> $170–$200 if timing slips, the online gap widens, spending weakens, or the multiple compresses.</li>
        </ul>
        <h3>Key tension</h3>
        <p>The long-term franchise thesis is constructive, but the report argues against an all-at-once entry because valuation, deferred online monetization, leverage, and release-delay risk make the near-term setup more balanced.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-Take-Two-Equity-Research.docx" download>Download the complete Take-Two report (DOCX) ↓</a></p>
        <p class="boundary">INDEPENDENT EDUCATIONAL RESEARCH / REPORT DATE: JULY 4, 2026 / ILLUSTRATIVE RATING AND TARGET / NOT INVESTMENT ADVICE</p>`
    },
    psychology: {
      index: "R—001",
      meta: "EQUITIES / BEHAVIORAL FINANCE / SOURCE-CITED",
      title: "When psychology meets market structure",
      deck: "Palm/3Com is useful precisely because the obvious pricing contradiction did not guarantee an easy, executable arbitrage.",
      body: `
        <h3>The claim</h3>
        <p>A Stanford Graduate School of Business feature uses the Palm/3Com carve-out to ask why apparently inconsistent prices can persist. The useful research frame is not “investors were irrational.” It is bias or disagreement plus a mechanism, an arbitrage constraint, and a measurable implication.</p>
        <blockquote>A valuation identity does not guarantee an executable trade.</blockquote>
        <h3>What boiii records</h3>
        <ul>
          <li>Reference dependence, heterogeneous beliefs, momentum, and underreaction are hypotheses—not universal laws.</li>
          <li>Short-sale constraints can cause observed prices to overweight optimistic beliefs.</li>
          <li>Borrow availability, distribution timing, lockups, taxes, and corporate-action mechanics determine whether the apparent hedge was real.</li>
          <li>Predictability must survive realistic costs, point-in-time data, and out-of-sample evaluation.</li>
        </ul>
        <h3>What it does not prove</h3>
        <p>It does not prove that high volume predicts crashes, that social participation creates alpha, or that a historical anomaly remains profitable. Competing rational and risk-based explanations remain required.</p>
        <h3>Sources</h3>
        <p><a href="https://www.gsb.stanford.edu/insights/where-stock-market-psychology-pricing-intersect" target="_blank" rel="noreferrer">Stanford GSB: Where Stock Market Psychology and Pricing Intersect ↗</a></p>
        <p>The local research note also links the underlying Barberis–Huang, Hong–Stein, Chen–Hong–Stein, and Hong–Kubik–Stein papers.</p>
        <p class="boundary">EDUCATIONAL RESEARCH / PAPER-ONLY FOLLOW-UP / NOT TRADING ADVICE</p>`
    },
    derivatives: {
      index: "R—002",
      meta: "OPTIONS & FUTURES / MARKET LIQUIDITY / PEER-REVIEWED",
      title: "Corporate derivatives use and stock liquidity",
      deck: "A reported association between corporate hedging and stock liquidity is a research clue—not evidence that investors trading derivatives earn alpha.",
      body: `
        <h3>What was studied</h3>
        <p>Chaudhry and Gupta study 3,062 Indian-firm observations from 2016–2021. They report that stocks of firms using derivatives were more liquid, particularly where information asymmetry, firm-specific risk, or negative sentiment was higher.</p>
        <h3>The possible channel</h3>
        <p>Corporate hedging may reduce earnings variability, financial-distress risk, and information frictions. Those changes could reduce dealer inventory premiums or price impact. But the derivative-use indicator is coarse and the causal pathway remains contestable.</p>
        <blockquote>Corporate usage, listed-derivative market quality, and investor derivatives strategies are three different questions.</blockquote>
        <h3>Critical limitations</h3>
        <ul>
          <li>Foreign sales and borrowing may affect liquidity through channels other than derivative use.</li>
          <li>A user/non-user flag hides hedge type, size, maturity, effectiveness, and possible speculation.</li>
          <li>An Amihud-style measure captures only one dimension of liquidity.</li>
          <li>Results for India in 2016–2021 may not transfer to other markets or settlement regimes.</li>
          <li>Improved liquidity does not imply higher future returns.</li>
        </ul>
        <h3>Source</h3>
        <p><a href="https://doi.org/10.1016/j.intfin.2024.102077" target="_blank" rel="noreferrer">Journal of International Financial Markets, Institutions and Money, article 102077 ↗</a></p>
        <p class="boundary">SOURCE-CITED EDUCATION / NO RETURN CLAIM / NO TRADE AUTHORITY</p>`
    },
    backtests: {
      index: "R—003",
      meta: "QUANT RESEARCH / TECHNICAL ANALYSIS / REVIEW",
      title: "Why profitable backtests can disappear",
      deck: "Positive historical findings are the start of diligence, not the end of it.",
      body: `
        <h3>The evidence</h3>
        <p>Park and Irwin’s review reports that 58 of 92 modern technical-analysis studies found positive results, 24 negative results, and 10 mixed results. The headline is interesting. The evaluation weaknesses are more important.</p>
        <h3>The research debt</h3>
        <ul>
          <li>Rules may be selected after researchers see the data.</li>
          <li>Testing many variants makes lucky results more likely.</li>
          <li>Risk estimates can be too narrow for nonlinear or regime-dependent payoffs.</li>
          <li>Spreads, slippage, turnover, borrow, impact, and post-publication crowding can consume the effect.</li>
          <li>In-sample success says little about a frozen forward period.</li>
        </ul>
        <blockquote>The test is not whether a chart can explain the past. It is whether a frozen rule survives the future after costs.</blockquote>
        <h3>boiii’s operating rule</h3>
        <p>A chart pattern may generate a paper hypothesis. It cannot become a promoted strategy until the exact rule, data vintage, benchmark, costs, invalidation, and out-of-sample protocol are frozen and independently checked.</p>
        <h3>Source</h3>
        <p>Cheol-Ho Park and Scott H. Irwin, <em>The Profitability of Technical Analysis: A Review</em>, AgMAS Project Research Report 2004-04. A user-provided source copy is archived locally with its checksum.</p>
        <p class="boundary">PAPER EVALUATION ONLY / NO BROKER / NO ORDERS</p>`
    },
    aiipo: {
      index: "V—001",
      meta: "CAPITAL MARKETS / AI IPO CAROUSEL / 6 SLIDES",
      title: "AI IPOs and Wall Street dependence",
      deck: "A visual thesis asking whether AI companies framed as financial-sector disruptors still depend on underwriting banks to reach public-market liquidity.",
      body: `
        <h3>The question explored</h3>
        <p>The carousel argues that AI firms may remove intermediaries from parts of dealmaking while still relying on investment banks for IPO execution, distribution, and liquidity. It frames that tension as simultaneous disruption and dependence.</p>
        <figure class="note-visual-frame"><img src="assets/research/Dev-Pandya-AI-IPO-Carousel-Cover.png" alt="Cover of Dev Pandya’s six-slide AI IPO and Wall Street carousel"><figcaption>Cover from the supplied six-slide carousel.</figcaption></figure>
        <h3>Examples used</h3>
        <p>The source graphics cite Anthropic, OpenAI, and SpaceX alongside reported or illustrative valuations and banking relationships. Those figures are claims in the supplied, undated carousel; this portfolio does not represent them as current or independently verified.</p>
        <blockquote>Can a company disrupt finance and still need Wall Street to become liquid?</blockquote>
        <p><a class="report-link" href="assets/research/Dev-Pandya-AI-IPO-Carousel.pdf" target="_blank" rel="noreferrer">Open the complete six-slide carousel (PDF) ↗</a></p>
        <p class="boundary">VISUAL CAPITAL-MARKETS COMMENTARY / SOURCE DATE NOT STATED / REPORTED FIGURES NOT PRESENTED AS CURRENT / NOT INVESTMENT ADVICE</p>`
    },
    dcfcomps: {
      index: "V—002",
      meta: "VALUATION / DCF / TRADING COMPARABLES",
      title: "DCF versus trading comparables",
      deck: "Both are standard valuation tools, but each can mislead in a different place.",
      body: `
        <h3>What the comparison shows</h3>
        <p>A DCF builds value from projected cash flows, so its flexibility and weakness both sit in assumptions about growth, margins, and the discount rate. Trading comparables anchor value to observed peer prices, which makes them fast and market-grounded but also exposes the analysis to the peer group’s collective mispricing.</p>
        <figure class="note-visual-frame"><img src="assets/research/Dev-Pandya-DCF-vs-Comps.png" alt="Dev Pandya visual comparing DCF and comparable-company valuation"><figcaption>The full comparison: where each method’s assumptions, strengths, and traps sit.</figcaption></figure>
        <h3>The practical conclusion</h3>
        <p>The visual does not declare a winner. It argues for running both methods and investigating the assumptions behind the gap when their answers diverge.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-DCF-vs-Comps.png" target="_blank" rel="noreferrer">Open the original valuation visual (PNG) ↗</a></p>
        <p class="boundary">EDUCATIONAL VALUATION EXPLAINER / METHOD COMPARISON / NOT A SECURITY RECOMMENDATION</p>`
    },
    businessstock: {
      index: "V—003",
      meta: "EQUITIES / EXPECTATIONS / BUSINESS QUALITY VS PRICE",
      title: "A great business and a great stock are different bets",
      deck: "Business quality asks what the company can deliver. Investment quality also asks what the current price already assumes.",
      body: `
        <h3>The distinction</h3>
        <p>A good business can grow earnings, win customers, and compound over time. A good stock also requires a price that leaves room for outcomes to beat expectations. Strong reported performance can therefore coexist with a falling share price when even better news was already priced in.</p>
        <figure class="note-visual-frame"><img src="assets/research/Dev-Pandya-Great-Business-vs-Great-Stock.png" alt="Dev Pandya visual explaining the difference between a great business and a great stock"><figcaption>The graphic separates operating quality from the expectations embedded in price.</figcaption></figure>
        <h3>About the example</h3>
        <p>The source visual uses Samsung and states that profit rose approximately 19 times year over year while the stock fell. No observation date or citation is stated in the graphic, so this portfolio treats that figure as an undated source-graphic claim—not current or independently verified market data.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-Great-Business-vs-Great-Stock.png" target="_blank" rel="noreferrer">Open the original expectations visual (PNG) ↗</a></p>
        <p class="boundary">VISUAL MARKET COMMENTARY / SOURCE DATE NOT STATED / EXAMPLE NOT PRESENTED AS CURRENT / NOT INVESTMENT ADVICE</p>`
    },
    tworaces: {
      index: "V—004",
      meta: "AI INFRASTRUCTURE / FIRM POWER / LONG-DURATION STORAGE",
      title: "Two races, one AI power problem",
      deck: "AI infrastructure depends on both generating enough firm power and storing energy long enough to cover sustained demand.",
      body: `
        <h3>The two races</h3>
        <p>The generation side highlights nuclear, gas, and large-scale producers, naming Vistra, Constellation, and Talen. The storage side highlights long-duration batteries and novel storage technology, naming Noon Energy and Form Energy. The visual’s key distinction is units: generation capacity is measured in gigawatts, while storage must also be evaluated by discharge duration.</p>
        <figure class="note-visual-frame"><img src="assets/research/Dev-Pandya-AI-Power-Two-Races.png" alt="Dev Pandya poster comparing AI power generation and long-duration energy storage"><figcaption>The poster contrasts the race to generate AI power with the race to store it.</figcaption></figure>
        <h3>The source-graphic claim</h3>
        <p>The supplied poster says Meta reserved up to 1 GW and 100 GWh of storage from Noon Energy, describing 100-plus-hour discharge. The graphic does not state a source date; the claim is preserved as authored and is not represented here as independently verified or current.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-AI-Power-Two-Races.png" target="_blank" rel="noreferrer">Open the original AI-power visual (PNG) ↗</a></p>
        <p class="boundary">VISUAL AI-INFRASTRUCTURE COMMENTARY / SOURCE DATE NOT STATED / COMPANY CLAIMS NOT INDEPENDENTLY VERIFIED / NOT INVESTMENT ADVICE</p>`
    },
    readingmind: {
      index: "V—005",
      meta: "BEHAVIORAL FINANCE / READING NOTE / DANIEL KAHNEMAN",
      title: "The mind that reads the market",
      deck: "A reading note on how cognitive bias can shape an investor’s interpretation before market mechanics even enter the analysis.",
      body: `
        <h3>The lesson</h3>
        <p>The graphic presents this takeaway: “Most investing mistakes aren’t about markets. They’re about the mind that reads them.” It identifies the idea as a lesson from Daniel Kahneman’s <em>Thinking, Fast and Slow</em>, rather than labeling it a direct quotation from the book.</p>
        <figure class="note-visual-frame note-visual-light"><img src="assets/research/Dev-Pandya-Investing-Psychology-Reading-Note.png" alt="Dev Pandya behavioral-finance reading note inspired by Thinking, Fast and Slow"><figcaption>A concise bridge between behavioral-finance reading and investment decision-making.</figcaption></figure>
        <h3>Why it belongs in the research set</h3>
        <p>Valuation models and market data do not remove judgment. Framing, anchoring, overconfidence, and other cognitive errors can shape what evidence receives attention and how uncertainty is interpreted.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-Investing-Psychology-Reading-Note.png" target="_blank" rel="noreferrer">Open the original reading note (PNG) ↗</a></p>
        <p class="boundary">BEHAVIORAL-FINANCE READING NOTE / PARAPHRASED LESSON / NOT INVESTMENT ADVICE</p>`
    },
    stealthcall: {
      index: "S—001",
      meta: "STEALTH SERIES / EARNINGS-CALL ANALYSIS / ANALYST PLAYBOOK",
      title: "How to read an earnings call like an analyst",
      deck: "A five-part checklist for reading beyond the reported numbers—while treating tone, language, and omissions as research signals rather than proof.",
      body: `
        <h3>Five checks in the playbook</h3>
        <ul>
          <li><strong>Management tone:</strong> listen for new hedging or caution instead of only skimming prepared remarks.</li>
          <li><strong>What changed:</strong> compare wording with prior quarters, not only the latest numbers.</li>
          <li><strong>The Q&amp;A:</strong> inspect unscripted answers rather than stopping at the press release.</li>
          <li><strong>What management avoids:</strong> record which questions were dodged as well as what was said.</li>
          <li><strong>Guidance framing:</strong> note how confidently forecasts are presented, not only the forecast value.</li>
        </ul>
        <figure class="note-visual-frame"><img src="assets/research/Dev-Pandya-Stealth-Earnings-Call.png" alt="Dev Pandya Stealth analyst playbook for reading an earnings call"><figcaption>The complete five-part earnings-call checklist from the supplied Stealth graphic.</figcaption></figure>
        <h3>How to use it responsibly</h3>
        <p>Tone, hesitation, and apparent dodging are subjective observations. They should trigger transcript comparison and quantitative follow-up—not be treated as proof of hidden information or as a standalone investment signal.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-Stealth-Earnings-Call.png" target="_blank" rel="noreferrer">Open the original Stealth earnings-call graphic (PNG) ↗</a></p>
        <p class="boundary">STEALTH ANALYST PLAYBOOK / EDUCATIONAL CHECKLIST / QUALITATIVE SIGNALS REQUIRE CORROBORATION / NOT INVESTMENT ADVICE</p>`
    },
    stealthomissions: {
      index: "S—002",
      meta: "STEALTH SERIES / EARNINGS CALLS / THE ANALYST’S EYE",
      title: "What they don’t say says the most",
      deck: "A visual guide to four omissions that can justify deeper diligence without proving that management is concealing bad news.",
      body: `
        <h3>Four omission signals</h3>
        <ul>
          <li><strong>A metric quietly vanishes:</strong> a repeatedly cited operating metric disappears from the latest discussion.</li>
          <li><strong>A question gets a non-answer:</strong> management redirects a specific question toward an easier topic.</li>
          <li><strong>The language softens:</strong> direct language becomes more conditional or hedged.</li>
          <li><strong>The framing shifts:</strong> management stops leading with a figure that previously received prominence.</li>
        </ul>
        <figure class="note-visual-frame note-visual-light"><img src="assets/research/Dev-Pandya-Stealth-Omissions.png" alt="Dev Pandya Stealth visual on information contained in earnings-call omissions"><figcaption>The supplied Stealth graphic treats silence as a prompt for comparison and follow-up.</figcaption></figure>
        <h3>The discipline behind the idea</h3>
        <p>An omission may reflect changed disclosure priorities, seasonality, materiality, time limits, or a genuine deterioration. The defensible next step is to compare transcripts and filings, ask what else could explain the change, and seek corroborating evidence.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-Stealth-Omissions.png" target="_blank" rel="noreferrer">Open the original Stealth omissions graphic (PNG) ↗</a></p>
        <p class="boundary">STEALTH ANALYST PLAYBOOK / EDUCATIONAL EARNINGS-CALL FRAMEWORK / OMISSIONS ARE NOT PROOF / NOT INVESTMENT ADVICE</p>`
    },
    stealthfunds: {
      index: "S—003",
      meta: "STEALTH SERIES / ACTIVE MANAGEMENT / SOURCE CHECK REQUIRED",
      title: "Why beating the benchmark is difficult",
      deck: "The supplied graphic presents a forceful active-management statistic, but does not identify its source, observation period, or measurement date.",
      body: `
        <h3>Claims shown in the graphic</h3>
        <ul>
          <li><strong>89.5%</strong> of active U.S. large-cap funds underperformed the S&amp;P 500 over 15 years.</li>
          <li>That implies approximately <strong>one in ten</strong> odds of selecting a fund that beat the benchmark.</li>
          <li><strong>Zero of 22</strong> U.S. equity categories had a majority of managers win.</li>
          <li>The graphic argues that the result worsens as the measurement horizon lengthens.</li>
        </ul>
        <figure class="note-visual-frame"><img src="assets/research/Dev-Pandya-Stealth-Active-Funds.png" alt="Dev Pandya Stealth graphic presenting an 89.5 percent active-fund underperformance claim"><figcaption>The supplied graphic is reproduced as authored; its statistics require a dated primary source before analytical use.</figcaption></figure>
        <h3>What remains unverified</h3>
        <p>The image does not identify the dataset, report edition, end date, survivorship treatment, fee basis, category definitions, or whether the fund-selection interpretation follows directly from the underlying study. This portfolio therefore preserves the numbers as undated source-graphic claims—not current or independently verified facts.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-Stealth-Active-Funds.png" target="_blank" rel="noreferrer">Open the original Stealth active-funds graphic (PNG) ↗</a></p>
        <p class="boundary">STEALTH DATA COMMENTARY / SOURCE AND MEASUREMENT DATE NOT SUPPLIED / STATISTICS NOT INDEPENDENTLY VERIFIED / NOT INVESTMENT ADVICE</p>`
    },
    stealthvalue: {
      index: "S—004",
      meta: "STEALTH SERIES / VALUATION / VALUE-TRAP FRAMEWORK",
      title: "A cheap stock and a bargain aren’t the same thing",
      deck: "A low multiple is an observation. The investment question is whether the discount reflects structural impairment or a temporary, fixable problem.",
      body: `
        <h3>Two branches in the framework</h3>
        <p><strong>Potential value trap:</strong> shrinking earnings, a declining industry, rising debt, or an eroding competitive moat may explain why a stock remains cheap.</p>
        <p><strong>Potentially mispriced:</strong> a temporary headline, fixable one-off stumble, an out-of-favor but intact business, or an overreaction may create a discount that can close.</p>
        <figure class="note-visual-frame"><img src="assets/research/Dev-Pandya-Stealth-Value-Trap.png" alt="Dev Pandya Stealth framework distinguishing a value trap from a genuinely mispriced stock"><figcaption>The graphic asks why a low-multiple stock is cheap before calling it a bargain.</figcaption></figure>
        <h3>What the visual does not decide</h3>
        <p>The labels are starting hypotheses, not a security screen. Each branch still requires financial-statement evidence, industry analysis, balance-sheet stress testing, valuation work, and a falsifiable view of what would close—or justify—the discount.</p>
        <p><a class="report-link" href="assets/research/Dev-Pandya-Stealth-Value-Trap.png" target="_blank" rel="noreferrer">Open the original Stealth value-trap graphic (PNG) ↗</a></p>
        <p class="boundary">STEALTH VALUATION FRAMEWORK / EDUCATIONAL QUALITATIVE SCREEN / REQUIRES COMPANY-SPECIFIC DILIGENCE / NOT INVESTMENT ADVICE</p>`
    },
    paperlab: {
      index: "P—004",
      meta: "RESEARCH PROCESS / EVIDENCE GAPS / PAPER-ONLY",
      title: "Why missing evidence should still show as zero",
      deck: "An empty field should remain visible as a gap instead of being replaced with an assumption.",
      body: `
        <h3>The finance lesson</h3>
        <p>A paper hypothesis had one secondary citation, but no classified primary source, counter-evidence record, catalyst, frozen methodology, or evaluation run. The honest status was incomplete.</p>
        <blockquote>Zero should mean “not recorded,” not “quietly inferred.”</blockquote>
        <h3>The research process I am learning</h3>
        <ul>
          <li>Distinguish primary evidence from secondary commentary.</li>
          <li>Record counter-evidence before becoming attached to a thesis.</li>
          <li>Freeze the benchmark, costs, and invalidation rule before evaluating a result.</li>
          <li>Keep an academic or paper hypothesis separate from any real-money decision.</li>
        </ul>
        <h3>What it means</h3>
        <p>Good research is not the absence of uncertainty. It is a clear record of what is known, what is missing, and what would change the conclusion.</p>
        <p class="boundary">EDUCATIONAL PROCESS / PAPER-ONLY / NO TRADE AUTHORITY</p>`
    },
    claims: {
      index: "J—001 / DRAFT",
      meta: "DEV’S JOURNAL / RESEARCH CRAFT",
      title: "Every claim needs a way to lose",
      deck: "The easiest way to protect a favorite idea is to never say what would prove it wrong.",
      body: `
        <p>I am building boiii around a simple discipline: every research claim should travel with a mechanism, a competing explanation, and a falsification rule.</p>
        <h3>A useful chain</h3>
        <p>Evidence → mechanism → constraint → observable implication → invalidation. If one link is missing, the system should show the gap instead of manufacturing confidence.</p>
        <blockquote>A thesis that cannot lose is not a thesis. It is identity.</blockquote>
        <h3>Why this matters</h3>
        <p>Markets make retrospective stories easy. Prices move, and a convincing explanation appears immediately. Freezing the test before seeing the result is how a tool resists becoming a narrative machine.</p>
        <p class="boundary">DRAFT ESSAY / DEV’S JOURNAL</p>`
    },
    terminal: {
      index: "J—002 / DRAFT",
      meta: "DEV’S JOURNAL / PRODUCT",
      title: "The terminal I actually wanted",
      deck: "A serious tool should not look alive by displaying numbers it cannot defend.",
      body: `
        <p>I wanted the density and speed of a financial terminal, but not the theater: no invented portfolio value, no mysterious “AI confidence,” no stale quote presented as live.</p>
        <h3>The design rule</h3>
        <p>Every important surface should separate four states: working, blocked, stale, and untested. A hash chain can prove ledger integrity; it cannot prove that a hypothesis is complete or profitable.</p>
        <blockquote>Truthful status is a product feature.</blockquote>
        <p>The result is a native macOS interface backed by private read-only services and a source-cited vault. It is less magical than the hype—and more useful because of that.</p>
        <p class="boundary">DRAFT BUILD NOTE / NO SIMULATED CERTAINTY</p>`
    },
    voice: {
      index: "J—003 / DRAFT",
      meta: "DEV’S JOURNAL / PRIVACY",
      title: "A voice interface should ask first",
      deck: "Convenience is not a reason to make recording invisible.",
      body: `
        <p>The enrollment flow I want is visible and deliberate. The app displays a phrase. Recording starts only after an explicit action. Local transcription verifies that phrase before an embedding is accepted.</p>
        <h3>What persists</h3>
        <p>Raw audio is discarded immediately. Only an encrypted derived owner profile remains. High-impact actions still require explicit confirmation; a voiceprint is not universal authority.</p>
        <blockquote>Owner recognition narrows who may ask. It does not erase the need to confirm what happens next.</blockquote>
        <p class="boundary">DRAFT BUILD NOTE / LOCAL-FIRST / OWNER-CONTROLLED</p>`
    }
  };

  function applyTheme(mode) {
    let resolved = mode;
    if (mode === "auto") {
      const hour = new Date().getHours();
      resolved = hour >= 7 && hour < 19 ? "light" : "dark";
    }
    root.dataset.theme = resolved;
    root.dataset.themeMode = mode;
    $("#theme-toggle").textContent = `Theme: ${mode}`;
    localStorage.setItem("dev-boiii-theme", mode);
  }

  function cycleTheme() {
    const current = root.dataset.themeMode || "auto";
    const modes = ["auto", "dark", "light"];
    applyTheme(modes[(modes.indexOf(current) + 1) % modes.length]);
  }


  function renderProject(key) {
    const data = projects[key];
    if (!data) return;
    $$(".project-row").forEach(row => {
      const active = row.dataset.project === key;
      row.classList.toggle("is-active", active);
      row.setAttribute("aria-selected", String(active));
    });
    $("#preview-path").textContent = data.path;
    $("#preview-label").textContent = data.label;
    $("#preview-status").textContent = data.status;
    $("#preview-title").textContent = data.title;
    $("#preview-copy").textContent = data.copy;
    $("#preview-architecture").innerHTML = data.architecture.map((item, index) => `${index ? "<i>→</i>" : ""}<span>${item}</span>`).join("");
    $("#preview-facts").innerHTML = data.facts.map(([term, detail]) => `<div><dt>${term}</dt><dd>${detail}</dd></div>`).join("");
    $("#preview-note").textContent = data.note;
    const preview = $(".project-preview");
    preview.classList.remove("is-replaying");
    requestAnimationFrame(() => preview.classList.add("is-replaying"));
  }

  function openNote(key) {
    const note = notes[key];
    if (!note) return;
    $("#dialog-index").textContent = note.index;
    $("#dialog-content").innerHTML = `<p class="dialog-meta">${note.meta}</p><h2 id="dialog-title">${note.title}</h2><p class="dialog-deck">${note.deck}</p>${note.body}`;
    const dialog = $("#note-dialog");
    dialog.showModal();
    document.body.style.overflow = "hidden";
    history.replaceState(null, "", `#note-${key}`);
  }

  function closeNote() {
    const dialog = $("#note-dialog");
    if (dialog.open) dialog.close();
    document.body.style.overflow = "";
    if (location.hash.startsWith("#note-")) history.replaceState(null, "", location.pathname);
  }

  function filterNotes(topic) {
    let visible = 0;
    $$(".filter-button").forEach(button => button.classList.toggle("is-active", button.dataset.filter === topic));
    $$(".research-row").forEach(row => {
      const show = topic === "all" || row.dataset.topic === topic;
      row.hidden = !show;
      if (show) visible += 1;
    });
    $("#result-count").textContent = `${visible} ${visible === 1 ? "item" : "items"}`;
  }

  function openCommands() {
    const dialog = $("#command-dialog");
    if (!dialog.open) dialog.showModal();
    setTimeout(() => $(".command-list button", dialog)?.focus(), 0);
  }

  function closeCommands() {
    const dialog = $("#command-dialog");
    if (dialog.open) dialog.close();
  }

  function runCommand(command) {
    closeCommands();
    if (["experience", "foundation", "boiii", "research", "about"].includes(command)) {
      document.getElementById(command)?.scrollIntoView({ behavior: "smooth" });
    } else if (command === "theme") {
      cycleTheme();
    }
  }

  applyTheme(localStorage.getItem("dev-boiii-theme") || "auto");
  $("#theme-toggle").addEventListener("click", cycleTheme);
  $$(".project-row").forEach(row => row.addEventListener("click", () => renderProject(row.dataset.project)));
  $("#preview-refresh").addEventListener("click", () => renderProject($(".project-row.is-active").dataset.project));
  $$(".filter-button").forEach(button => button.addEventListener("click", () => filterNotes(button.dataset.filter)));
  $$(".note-open").forEach(button => button.addEventListener("click", () => openNote(button.dataset.note)));
  $("#dialog-close").addEventListener("click", closeNote);
  $("#note-dialog").addEventListener("click", event => { if (event.target === $("#note-dialog")) closeNote(); });
  $("#command-open").addEventListener("click", openCommands);
  $("#command-close").addEventListener("click", closeCommands);
  $$("[data-command]").forEach(button => button.addEventListener("click", () => runCommand(button.dataset.command)));
  $$('[data-scroll="top"]').forEach(button => button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })));

  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openCommands();
    }
    if (event.key === "Escape") {
      closeCommands();
      closeNote();
    }
  });

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#reading-progress").style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  }, { passive: true });

  // The hero is core content, so it must remain visible even when a browser does
  // not schedule IntersectionObserver callbacks (headless previews, print tools).
  $$(".hero .reveal").forEach(element => element.classList.add("is-visible"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$(".reveal:not(.is-visible)").forEach(element => observer.observe(element));
  } else {
    $$(".reveal").forEach(element => element.classList.add("is-visible"));
  }

  const timeNode = $("#local-time");
  const updateTime = () => {
    timeNode.textContent = `LOCAL TIME ${new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date())}`;
  };
  updateTime();
  setInterval(updateTime, 30000);

  const hashNote = location.hash.match(/^#note-(.+)$/)?.[1];
  if (hashNote && notes[hashNote]) setTimeout(() => openNote(hashNote), 50);

  console.info("DEV — FINANCE PORTFOLIO\nStatic, tracker-free, and built around verified résumé facts and clearly labeled personal learning work.");
})();
