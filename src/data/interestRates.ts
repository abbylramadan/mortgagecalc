import type { InterestRateConfig, LoanType } from '../types/calculator';

// Interest rates by FICO score and loan type
export const interestRates: InterestRateConfig[] = [
  // FHA Loans
  {
    loanType: 'FHA',
    ficoRange: { min: 740, max: 850 },
    baseRate: 0.068, // 6.8%
    requirements: {
      minDownPaymentPercent: 3.5,
      minFicoScore: 580,
      maxDebtToIncomeRatio: 0.43,
      requiresMortgageInsurance: true,
      upfrontMortgageInsurancePercent: 1.75,
      annualMortgageInsurancePercent: 0.85,
    },
  },
  {
    loanType: 'FHA',
    ficoRange: { min: 670, max: 739 },
    baseRate: 0.072, // 7.2%
    requirements: {
      minDownPaymentPercent: 3.5,
      minFicoScore: 580,
      maxDebtToIncomeRatio: 0.43,
      requiresMortgageInsurance: true,
      upfrontMortgageInsurancePercent: 1.75,
      annualMortgageInsurancePercent: 0.85,
    },
  },
  {
    loanType: 'FHA',
    ficoRange: { min: 580, max: 669 },
    baseRate: 0.078, // 7.8%
    requirements: {
      minDownPaymentPercent: 3.5,
      minFicoScore: 580,
      maxDebtToIncomeRatio: 0.43,
      requiresMortgageInsurance: true,
      upfrontMortgageInsurancePercent: 1.75,
      annualMortgageInsurancePercent: 0.85,
    },
  },

  // Conventional Loans
  {
    loanType: 'Conventional',
    ficoRange: { min: 740, max: 850 },
    baseRate: 0.065, // 6.5%
    requirements: {
      minDownPaymentPercent: 5,
      minFicoScore: 620,
      maxDebtToIncomeRatio: 0.36,
      requiresMortgageInsurance: true, // If down < 20%
      annualMortgageInsurancePercent: 0.5,
    },
  },
  {
    loanType: 'Conventional',
    ficoRange: { min: 670, max: 739 },
    baseRate: 0.07, // 7.0%
    requirements: {
      minDownPaymentPercent: 5,
      minFicoScore: 620,
      maxDebtToIncomeRatio: 0.36,
      requiresMortgageInsurance: true,
      annualMortgageInsurancePercent: 0.5,
    },
  },
  {
    loanType: 'Conventional',
    ficoRange: { min: 620, max: 669 },
    baseRate: 0.075, // 7.5%
    requirements: {
      minDownPaymentPercent: 5,
      minFicoScore: 620,
      maxDebtToIncomeRatio: 0.36,
      requiresMortgageInsurance: true,
      annualMortgageInsurancePercent: 0.5,
    },
  },

  // VA Loans (for reference, though not primary focus)
  {
    loanType: 'VA',
    ficoRange: { min: 620, max: 850 },
    baseRate: 0.063, // 6.3%
    requirements: {
      minDownPaymentPercent: 0,
      minFicoScore: 620,
      maxDebtToIncomeRatio: 0.41,
      requiresMortgageInsurance: false,
    },
  },

  // USDA Loans (for reference)
  {
    loanType: 'USDA',
    ficoRange: { min: 640, max: 850 },
    baseRate: 0.064, // 6.4%
    requirements: {
      minDownPaymentPercent: 0,
      minFicoScore: 640,
      maxDebtToIncomeRatio: 0.41,
      requiresMortgageInsurance: true,
      annualMortgageInsurancePercent: 0.35,
    },
  },
];

export function getInterestRate(ficoScore: number, loanType: LoanType): number {
  const config = interestRates.find(
    (rate) =>
      rate.loanType === loanType &&
      ficoScore >= rate.ficoRange.min &&
      ficoScore <= rate.ficoRange.max
  );

  // Default to 7.5% if no match found
  return config?.baseRate || 0.075;
}

export function getLoanConfig(ficoScore: number, loanType: LoanType): InterestRateConfig | null {
  const config = interestRates.find(
    (rate) =>
      rate.loanType === loanType &&
      ficoScore >= rate.ficoRange.min &&
      ficoScore <= rate.ficoRange.max
  );

  return config || null;
}
