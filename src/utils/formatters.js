// ─────────────────────────────────────────────────────────────
//  formatters.js  –  Pure utility functions
// ─────────────────────────────────────────────────────────────

/** Format a number as Indian Rupees: ₹1,23,456 */
export const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

/** Format a number in Lakhs: ₹1.23L */
export const fmtL = (n) => '₹' + (n / 100000).toFixed(2) + 'L';

/**
 * Calculate monthly EMI using the standard reducing-balance formula.
 * @param {number} principal  – Loan principal (₹)
 * @param {number} annualRate – Annual interest rate (%)
 * @param {number} months     – Loan tenure in months
 * @returns {number} Monthly EMI rounded to nearest rupee
 */
export const calcEMI = (principal, annualRate, months) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  return Math.round(
    principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  );
};

/**
 * Calculate the financial risk score (0–100).
 * Higher score = higher financial toxicity.
 *
 * @param {object} params
 * @param {number} params.outOfPocket   – Amount patient must pay after insurance
 * @param {number} params.monthlyIncome
 * @param {number} params.existingEMI
 * @param {number} params.expenses
 * @param {number} params.dependents    – Number of dependents
 * @param {boolean} params.pmjay        – Whether PM-JAY eligible
 * @returns {{ score, disposable, months, toxicity }}
 */
export const calcRiskScore = ({ outOfPocket, monthlyIncome, existingEMI, expenses, dependents, pmjay }) => {
  const disposable = Math.max(1, monthlyIncome - existingEMI - expenses - dependents * 3000);
  const months     = Math.min(Math.ceil(outOfPocket / disposable), 240);
  const toxicity   = outOfPocket / Math.max(monthlyIncome * 12, 1);
  let score = Math.round(
    Math.min(100, toxicity * 120 + (months > 36 ? 30 : (months / 36) * 20) + dependents * 3)
  );
  if (pmjay) score = Math.max(0, score - 25);
  return { score, disposable, months, toxicity };
};
