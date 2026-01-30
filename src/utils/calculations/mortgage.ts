/**
 * Calculate monthly mortgage payment (Principal + Interest)
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate as decimal (e.g., 0.065 for 6.5%)
 * @param years - Loan term in years
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0) return 0;

  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;

  // Special case: 0% interest
  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numPayments);
  const denominator = Math.pow(1 + monthlyRate, numPayments) - 1;

  return principal * (numerator / denominator);
}

/**
 * Calculate loan amount from monthly payment
 * Inverse of calculateMonthlyPayment
 *
 * @param monthlyPayment - Desired monthly payment
 * @param annualRate - Annual interest rate as decimal
 * @param years - Loan term in years
 * @returns Maximum loan amount
 */
export function calculateLoanAmount(
  monthlyPayment: number,
  annualRate: number,
  years: number
): number {
  if (monthlyPayment <= 0) return 0;

  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;

  // Special case: 0% interest
  if (monthlyRate === 0) {
    return monthlyPayment * numPayments;
  }

  const numerator = Math.pow(1 + monthlyRate, numPayments) - 1;
  const denominator = monthlyRate * Math.pow(1 + monthlyRate, numPayments);

  return monthlyPayment * (numerator / denominator);
}

/**
 * Calculate monthly PMI (Private Mortgage Insurance) for conventional loans
 *
 * @param loanAmount - Loan amount
 * @param annualRate - Annual PMI rate as decimal (typically 0.005 for 0.5%)
 * @returns Monthly PMI payment
 */
export function calculatePMI(loanAmount: number, annualRate: number = 0.005): number {
  return (loanAmount * annualRate) / 12;
}

/**
 * Calculate FHA mortgage insurance (both upfront and annual)
 *
 * @param loanAmount - Loan amount
 * @returns Object with upfront and monthly MIP amounts
 */
export function calculateFHAInsurance(loanAmount: number) {
  const upfrontMIP = loanAmount * 0.0175; // 1.75% upfront
  const annualMIP = loanAmount * 0.0085; // 0.85% annual
  const monthlyMIP = annualMIP / 12;

  return {
    upfrontMIP,
    monthlyMIP,
    annualMIP,
  };
}

/**
 * Calculate monthly property tax
 *
 * @param homePrice - Home value
 * @param annualTaxRate - Annual property tax rate as decimal
 * @returns Monthly property tax
 */
export function calculatePropertyTax(homePrice: number, annualTaxRate: number): number {
  return (homePrice * annualTaxRate) / 12;
}

/**
 * Calculate monthly homeowners insurance
 * Typical rate is 0.35% of home value annually
 *
 * @param homePrice - Home value
 * @param annualRate - Annual insurance rate as decimal (default 0.0035)
 * @returns Monthly insurance payment
 */
export function calculateHomeownersInsurance(
  homePrice: number,
  annualRate: number = 0.0035
): number {
  return (homePrice * annualRate) / 12;
}
