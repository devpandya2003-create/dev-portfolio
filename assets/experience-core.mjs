/** Public portfolio facts and dated research, never a quote feed. */
export const CASES = Object.freeze({
  vistra: Object.freeze({title: 'Vistra investment thesis', symbol: 'VST', date: 'Report · April 4, 2026',
    copy: 'A catalyst-led power thesis. Follow the business, valuation assumptions, and risks—not a live share price.',
    method: 'DCF + trading comparables', question: 'Fundamentals versus expectations', risk: 'Catalyst timing + valuation',
    link: 'research/vistra/', model: 'assets/models/Dev-Pandya-Vistra-Valuation-Bridge.xlsx',
    image: 'assets/research/vistra-valuation-bridge.png', alt: 'Valuation bridge from the dated Vistra research workbook'}),
  ttwo: Object.freeze({title: 'Take-Two Interactive', symbol: 'TTWO', date: 'Report · July 4, 2026',
    copy: 'A strong franchise is not the same thing as an attractive entry price. Explore launch timing, valuation, and alternative outcomes.',
    method: 'Bull / base / bear scenarios', question: 'Upside versus launch timing', risk: 'Delay + multiple compression',
    link: 'research/take-two/', model: 'assets/models/Dev-Pandya-Take-Two-Scenario-Analysis.xlsx',
    image: 'assets/research/take-two-scenario-ranges.png', alt: 'Scenario ranges from the dated Take-Two educational analysis'}),
  firstsolar: Object.freeze({title: 'First Solar', symbol: 'FSLR', date: 'Publication date not stated',
    copy: 'A company and industry analysis with DuPont reconciliation. The linked case makes the original document’s evidence limitations visible.',
    method: 'Financial + industry analysis', question: 'Domestic advantage and durability', risk: 'Policy + execution + pricing',
    link: 'research/first-solar/', model: 'assets/models/Dev-Pandya-First-Solar-Research-Audit.xlsx',
    image: 'assets/research/first-solar-dupont-audit.png', alt: 'DuPont audit from the First Solar research workbook'})
});

export const CAREER = Object.freeze({
  mattson: Object.freeze({title: 'Mattson Technology', location: 'Fremont, CA · June–September 2026', role: 'Finance & Accounting Intern',
    copy: 'Customer creditworthiness, financial-statement review, production costs, month-end close, and internal reporting. I also helped streamline recurring finance analysis through AI-assisted process automation.',
    skills: ['Credit review', 'Cost analysis', 'Reporting support']}),
  mindox: Object.freeze({title: 'Mindox Techno', location: 'Singapore · May–June 2024', role: 'Cost Accounting Intern',
    copy: 'Analyzed project and inventory costs, reviewed budget-to-actual variance, and prepared management material on cost trends.',
    skills: ['Cost schedules', 'Variance analysis', 'Management summaries']}),
  relianceops: Object.freeze({title: 'Reliance Asset Reconstruction Company', location: 'Mumbai · May–July 2023', role: 'Operations Intern',
    copy: 'Reviewed borrower and loan data for distressed accounts and prepared borrower, collateral, and recovery summaries for portfolio monitoring.',
    skills: ['Borrower data', 'Distressed accounts', 'Portfolio monitoring']}),
  reliancesecretarial: Object.freeze({title: 'Reliance Asset Reconstruction Company', location: 'Mumbai · May–July 2022', role: 'Secretarial Intern',
    copy: 'Supported corporate-action and redemption documentation, charge filings, and board and committee compliance records.',
    skills: ['Corporate records', 'Documentation', 'Compliance support']})
});

export const AUDIENCES = Object.freeze({
  analyst: Object.freeze({tab: 'research', note: 'Start with the thesis. Open the assumptions, models, and limitations.'}),
  investor: Object.freeze({tab: 'process', note: 'Start with the process: what supports an idea, what could break it, and how I test it.'}),
  recruiter: Object.freeze({tab: 'experience', note: 'Start with practical finance experience, then open my background or résumé.'})
});

export const QUESTIONS = Object.freeze([
  Object.freeze({
    title: 'Same positive future cash flow. Higher discount rate. What happens to present value?',
    choices: Object.freeze(['It falls', 'It rises', 'It cannot change']), answer: 0, unlock: 'research',
    explanation: 'A higher discount rate reduces the present value of the same positive future cash flow. That is why the assumptions behind a valuation matter.',
    clue: 'Hold the positive cash flow and its timing constant. Think about discounting it more heavily.',
    source: 'research/#note-dcfcomps', sourceLabel: 'Explore my DCF versus comparables note'}),
  Object.freeze({
    title: 'A company is a great business. Is its stock automatically a good buy?',
    choices: Object.freeze(['Yes, business quality is enough', 'No, price and expectations still matter', 'Yes, if the company is popular']), answer: 1, unlock: 'experience',
    explanation: 'Business quality and investment quality are different questions. The price and expectations embedded in it still matter.',
    clue: 'A strong business can still be expensive relative to what the price already assumes.',
    source: 'research/#note-businessstock', sourceLabel: 'Explore my business quality versus stock price note'}),
  Object.freeze({
    title: 'A thesis looks attractive in the optimistic scenario. What should you investigate next?',
    choices: Object.freeze(['Ignore the adverse outcomes', 'Treat the scenario as a forecast', 'Downside scenarios and what invalidates the thesis']), answer: 2, unlock: 'leadership',
    explanation: 'A scenario is not a promise. Downside analysis and invalidation conditions make the reasoning inspectable.',
    clue: 'Useful due diligence looks for what could break the idea, not only what could go right.',
    source: 'research/take-two/', sourceLabel: 'Inspect the Take-Two scenario case'})
]);

export function initialChallenge() {
  return {index: 0, answered: false, complete: false, unlocked: [], feedback: '', kind: ''};
}

export function answerChallenge(state, choice) {
  if (!state || state.complete || state.answered || !Number.isInteger(choice) || !Array.isArray(state.unlocked)) return state;
  const question = QUESTIONS[state.index];
  if (!question || choice < 0 || choice >= question.choices.length) return state;
  if (choice !== question.answer) return {...state, feedback: question.clue, kind: 'retry'};
  return {...state, answered: true, unlocked: [...state.unlocked, question.unlock], feedback: question.explanation, kind: 'correct'};
}

export function nextChallenge(state) {
  if (!state || state.complete || !state.answered) return state;
  if (state.index === QUESTIONS.length - 1) return {...state, complete: true};
  return {...state, index: state.index + 1, answered: false, feedback: '', kind: ''};
}
