// Loan types supported by the calculator
export type LoanType = 'FHA' | 'Conventional' | 'VA' | 'USDA';

// User inputs collected through the wizard
export interface UserInputs {
  // Step 1: Annual income
  annualIncome: number;

  // Step 2: ZIP code and municipality
  zipCode: string; // User-entered ZIP code
  municipalityId: string; // Generated ID for market data

  // Step 3: Monthly debts breakdown
  monthlyDebts: {
    carLoans: number;
    studentLoans: number;
    creditCards: number;
    other: number;
  };

  // Step 4: FICO credit score
  ficoScore: number;

  // Step 5: Monthly food expenses
  monthlyFoodExpenses: number;

  // Step 6: Emergency fund/savings
  emergencyFund: number;

  // Step 7: Monthly fun/discretionary expenses
  monthlyFunExpenses: number;

  // Step 8: Monthly savings contributions
  monthlySavings?: {
    retirement401k: number;
    hsa: number;
    healthcare: number;
    other: number;
  };

  // Step 9: Down payment amount
  downPaymentAmount: number;

  // Auto-determined loan type (not user-selected)
  preferredLoanType: LoanType;
}

// Utility cost breakdown
export interface UtilityBreakdown {
  electric: number;
  gas: number;
  water: number;
  internet: number;
  total: number;
}

// Monthly payment breakdown
export interface MonthlyPayment {
  principal: number;
  interest: number;
  propertyTax: number;
  homeownersInsurance: number;
  mortgageInsurance: number; // PMI or MIP
  utilities: UtilityBreakdown;
  total: number;
}

// Final calculation results
export interface CalculationResults {
  maxHomePrice: number;
  maxLoanAmount: number;
  estimatedMonthlyPayment: MonthlyPayment;
  debtToIncomeRatio: number;
  monthlyNetIncome: number;
  monthlyDisposableIncome: number;
  estimatedSqft: number;
  interestRate: number;
  loanTerm: number;
  loanType: LoanType; // Auto-determined loan type
  recommendations: string[];
  warnings: string[];
}

// Municipality data structure
export interface Municipality {
  id: string;
  name: string;
  state: string;
  propertyTaxRate: number; // as decimal (e.g., 0.0123 for 1.23%)
  avgUtilityMultiplier: number; // multiplier for utility costs
  region: 'urban' | 'suburban' | 'rural';
  medianHomePrice: number; // median home price in the area
  avgHomePrice: number; // average home price in the area
  minRealisticPrice: number; // minimum realistic home price in area
}

// Square footage estimates by price range
export interface SqftEstimate {
  municipalityId: string;
  priceRange: {
    min: number;
    max: number;
  };
  avgSqft: number;
}

// Utility cost estimates by square footage
export interface UtilityEstimate {
  sqftRange: {
    min: number;
    max: number;
  };
  baseMonthlyUtilities: {
    electric: number;
    gas: number;
    water: number;
    internet: number;
  };
}

// Interest rate configuration
export interface InterestRateConfig {
  loanType: LoanType;
  ficoRange: {
    min: number;
    max: number;
  };
  baseRate: number; // as decimal (e.g., 0.065 for 6.5%)
  requirements: {
    minDownPaymentPercent: number;
    minFicoScore: number;
    maxDebtToIncomeRatio: number;
    requiresMortgageInsurance: boolean;
    upfrontMortgageInsurancePercent?: number; // For FHA
    annualMortgageInsurancePercent?: number; // For FHA/PMI
  };
}

// Loan type configuration
export interface LoanTypeConfig {
  type: LoanType;
  name: string;
  description: string;
  minDownPaymentPercent: number;
  minFicoScore: number;
  maxDebtToIncomeRatio: number;
  requiresMortgageInsurance: boolean;
  pros: string[];
  cons: string[];
}
