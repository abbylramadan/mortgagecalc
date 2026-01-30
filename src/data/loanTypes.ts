import type { LoanTypeConfig } from '../types/calculator';

// Loan type configurations with pros/cons for user selection
export const loanTypes: LoanTypeConfig[] = [
  {
    type: 'FHA',
    name: 'FHA Loan',
    description: 'Government-backed loan with lower down payment requirements',
    minDownPaymentPercent: 3.5,
    minFicoScore: 580,
    maxDebtToIncomeRatio: 0.43,
    requiresMortgageInsurance: true,
    pros: [
      'Low down payment (3.5%)',
      'More lenient credit requirements',
      'Higher debt-to-income ratio allowed (43%)',
      'Great for first-time homebuyers',
    ],
    cons: [
      'Requires mortgage insurance (MIP) for life of loan',
      'Upfront mortgage insurance premium (1.75%)',
      'Loan limits apply',
      'Property must meet FHA standards',
    ],
  },
  {
    type: 'Conventional',
    name: 'Conventional Loan',
    description: 'Traditional mortgage not backed by government',
    minDownPaymentPercent: 5,
    minFicoScore: 620,
    maxDebtToIncomeRatio: 0.36,
    requiresMortgageInsurance: true,
    pros: [
      'PMI can be removed at 80% LTV',
      'No upfront mortgage insurance',
      'Higher loan limits',
      'More property type flexibility',
    ],
    cons: [
      'Higher down payment typically required',
      'Stricter credit requirements',
      'Lower debt-to-income ratio limit (36%)',
      'PMI required if down payment < 20%',
    ],
  },
  {
    type: 'VA',
    name: 'VA Loan',
    description: 'Available to veterans, active military, and eligible spouses',
    minDownPaymentPercent: 0,
    minFicoScore: 620,
    maxDebtToIncomeRatio: 0.41,
    requiresMortgageInsurance: false,
    pros: [
      'No down payment required',
      'No mortgage insurance',
      'Competitive interest rates',
      'Limits on closing costs',
    ],
    cons: [
      'Only for eligible veterans/military',
      'VA funding fee applies (can be financed)',
      'Property must meet VA standards',
      'Not available in all areas',
    ],
  },
  {
    type: 'USDA',
    name: 'USDA Loan',
    description: 'For rural and suburban homebuyers',
    minDownPaymentPercent: 0,
    minFicoScore: 640,
    maxDebtToIncomeRatio: 0.41,
    requiresMortgageInsurance: true,
    pros: [
      'No down payment required',
      'Competitive interest rates',
      'Low mortgage insurance',
      'Flexible credit requirements',
    ],
    cons: [
      'Geographic restrictions (rural areas only)',
      'Income limits apply',
      'Property must meet USDA standards',
      'Longer processing times',
    ],
  },
];

export function getLoanTypeConfig(loanType: string): LoanTypeConfig | undefined {
  return loanTypes.find((lt) => lt.type === loanType);
}
