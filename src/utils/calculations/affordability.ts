import type { UserInputs, CalculationResults, MonthlyPayment } from '../../types/calculator';
import { calculateMonthlyNetIncome } from './taxes';
import {
  calculateMonthlyPayment,
  calculatePropertyTax,
  calculateHomeownersInsurance,
  calculatePMI,
  calculateFHAInsurance,
} from './mortgage';
import { calculateUtilities } from './utilities';
import { getInterestRate, getLoanConfig } from '../../data/interestRates';
import { getMunicipalityById } from '../../data/municipalities';
import { getEstimatedSqft } from '../../data/sqftAverages';

/**
 * Calculate maximum affordable home price
 * Uses iterative approach to solve for home price given payment constraints
 */
export function calculateMaxAffordableHome(inputs: UserInputs): CalculationResults {
  // 1. Calculate monthly income
  const monthlyGrossIncome = inputs.annualIncome / 12;

  // 2. Get municipality data
  const municipality = getMunicipalityById(inputs.municipalityId);
  if (!municipality) {
    throw new Error('Municipality not found');
  }

  // 3. Calculate monthly net income (after taxes)
  const monthlyNetIncome = calculateMonthlyNetIncome(inputs.annualIncome, municipality.state);

  // 4. Calculate total monthly debts
  const totalMonthlyDebts =
    inputs.monthlyDebts.carLoans +
    inputs.monthlyDebts.studentLoans +
    inputs.monthlyDebts.creditCards +
    inputs.monthlyDebts.other;

  // 5. Get interest rate and loan config based on FICO and loan type
  const interestRate = getInterestRate(inputs.ficoScore, inputs.preferredLoanType);
  const loanConfig = getLoanConfig(inputs.ficoScore, inputs.preferredLoanType);

  if (!loanConfig) {
    throw new Error('Loan configuration not found');
  }

  // 6. Calculate max monthly housing payment using DTI ratios
  // Front-end ratio: 28% of gross income (housing only)
  const frontEndMax = monthlyGrossIncome * 0.28;

  // Back-end ratio: varies by loan type (all debts including housing)
  const backEndMax = monthlyGrossIncome * loanConfig.requirements.maxDebtToIncomeRatio;
  const availableForHousing = backEndMax - totalMonthlyDebts;

  // Use the more conservative limit
  const maxMonthlyPayment = Math.min(frontEndMax, availableForHousing);

  // 7. Iteratively solve for maximum home price
  const maxHomePrice = calculateMaxHomePrice({
    maxMonthlyPayment,
    downPayment: inputs.downPaymentAmount,
    interestRate,
    loanTerm: 30,
    propertyTaxRate: municipality.propertyTaxRate,
    loanType: inputs.preferredLoanType,
    loanConfig,
  });

  const maxLoanAmount = maxHomePrice - inputs.downPaymentAmount;

  // 8. Calculate estimated square footage
  const estimatedSqft = getEstimatedSqft(maxHomePrice, inputs.municipalityId);

  // 9. Calculate utilities
  const utilities = calculateUtilities(estimatedSqft, inputs.municipalityId);

  // 10. Calculate actual monthly payment breakdown
  const monthlyPayment = calculateDetailedPayment({
    homePrice: maxHomePrice,
    downPayment: inputs.downPaymentAmount,
    interestRate,
    loanTerm: 30,
    propertyTaxRate: municipality.propertyTaxRate,
    loanType: inputs.preferredLoanType,
    loanConfig,
  });

  // Add utilities to the payment
  const estimatedMonthlyPayment: MonthlyPayment = {
    ...monthlyPayment,
    utilities,
  };

  // 11. Calculate disposable income
  const totalMonthlyObligations =
    monthlyPayment.total + utilities.total + totalMonthlyDebts;
  const monthlyDisposableIncome =
    monthlyNetIncome -
    totalMonthlyObligations -
    inputs.monthlyFoodExpenses -
    inputs.monthlyFunExpenses;

  // 12. Calculate DTI ratio
  const housingDTI = monthlyPayment.total / monthlyGrossIncome;
  const totalDTI = (monthlyPayment.total + totalMonthlyDebts) / monthlyGrossIncome;

  // 13. Generate recommendations
  const recommendations = generateRecommendations({
    monthlyDisposableIncome,
    emergencyFund: inputs.emergencyFund,
    monthlyPayment: monthlyPayment.total,
    totalDTI,
    housingDTI,
    estimatedMonthlyPayment,
    maxHomePrice,
    municipality,
    downPaymentPercent: (inputs.downPaymentAmount / maxHomePrice) * 100,
    loanType: inputs.preferredLoanType,
  });

  // 14. Generate warnings
  const warnings = generateWarnings({
    monthlyDisposableIncome,
    emergencyFund: inputs.emergencyFund,
    monthlyPayment: monthlyPayment.total,
    totalDTI,
    downPaymentPercent: (inputs.downPaymentAmount / maxHomePrice) * 100,
    maxHomePrice,
    municipality,
    loanType: inputs.preferredLoanType,
  });

  return {
    maxHomePrice,
    maxLoanAmount,
    estimatedMonthlyPayment,
    debtToIncomeRatio: totalDTI,
    monthlyNetIncome,
    monthlyDisposableIncome,
    estimatedSqft,
    interestRate,
    loanTerm: 30,
    recommendations,
    warnings,
  };
}

/**
 * Iteratively calculate maximum home price given payment constraints
 */
function calculateMaxHomePrice(params: {
  maxMonthlyPayment: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  loanType: string;
  loanConfig: any;
}): number {
  const {
    maxMonthlyPayment,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate,
    loanType,
  } = params;

  // Binary search for home price
  let low = 50000;
  let high = 5000000;
  let bestPrice = low;

  for (let i = 0; i < 50; i++) {
    const testPrice = (low + high) / 2;
    const loanAmount = testPrice - downPayment;

    if (loanAmount <= 0) {
      break;
    }

    // Calculate all components of monthly payment
    const pi = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    const tax = calculatePropertyTax(testPrice, propertyTaxRate);
    const insurance = calculateHomeownersInsurance(testPrice);

    // Calculate mortgage insurance if applicable
    let mortgageInsurance = 0;
    const downPaymentPercent = (downPayment / testPrice) * 100;

    if (loanType === 'FHA') {
      const fhaInsurance = calculateFHAInsurance(loanAmount);
      mortgageInsurance = fhaInsurance.monthlyMIP;
    } else if (loanType === 'Conventional' && downPaymentPercent < 20) {
      mortgageInsurance = calculatePMI(loanAmount);
    }

    const totalPayment = pi + tax + insurance + mortgageInsurance;

    if (totalPayment <= maxMonthlyPayment) {
      bestPrice = testPrice;
      low = testPrice;
    } else {
      high = testPrice;
    }

    // Convergence check
    if (high - low < 100) {
      break;
    }
  }

  return Math.floor(bestPrice);
}

/**
 * Calculate detailed monthly payment breakdown
 */
function calculateDetailedPayment(params: {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  loanType: string;
  loanConfig: any;
}): Omit<MonthlyPayment, 'utilities'> {
  const { homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, loanType } = params;

  const loanAmount = homePrice - downPayment;
  const monthlyPI = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);

  // Split P&I (simplified approximation)
  const monthlyRate = interestRate / 12;
  const interest = loanAmount * monthlyRate;
  const principal = monthlyPI - interest;

  const propertyTax = calculatePropertyTax(homePrice, propertyTaxRate);
  const homeownersInsurance = calculateHomeownersInsurance(homePrice);

  // Calculate mortgage insurance
  let mortgageInsurance = 0;
  const downPaymentPercent = (downPayment / homePrice) * 100;

  if (loanType === 'FHA') {
    const fhaInsurance = calculateFHAInsurance(loanAmount);
    mortgageInsurance = fhaInsurance.monthlyMIP;
  } else if (loanType === 'Conventional' && downPaymentPercent < 20) {
    mortgageInsurance = calculatePMI(loanAmount);
  }

  const total = monthlyPI + propertyTax + homeownersInsurance + mortgageInsurance;

  return {
    principal,
    interest,
    propertyTax,
    homeownersInsurance,
    mortgageInsurance,
    total,
  };
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(params: {
  monthlyDisposableIncome: number;
  emergencyFund: number;
  monthlyPayment: number;
  totalDTI: number;
  housingDTI: number;
  estimatedMonthlyPayment: MonthlyPayment;
  maxHomePrice: number;
  municipality: any;
  downPaymentPercent: number;
  loanType: string;
}): string[] {
  const {
    monthlyDisposableIncome,
    emergencyFund,
    monthlyPayment,
    totalDTI,
    estimatedMonthlyPayment,
    maxHomePrice,
    municipality,
    downPaymentPercent,
    loanType,
  } = params;

  const recommendations: string[] = [];

  // Market price comparison
  if (maxHomePrice < municipality.minRealisticPrice) {
    const gap = municipality.minRealisticPrice - maxHomePrice;
    recommendations.push(
      `Your budget is ${((gap / municipality.minRealisticPrice) * 100).toFixed(0)}% below the typical minimum home price in ${municipality.name} ($${municipality.minRealisticPrice.toLocaleString()}). Consider increasing income, reducing debts, or exploring nearby areas with lower prices.`
    );
  } else if (maxHomePrice >= municipality.medianHomePrice) {
    recommendations.push(
      `Great news! Your budget exceeds the median home price in ${municipality.name} ($${municipality.medianHomePrice.toLocaleString()}), giving you strong purchasing power in this market.`
    );
  } else if (maxHomePrice >= municipality.minRealisticPrice && maxHomePrice < municipality.medianHomePrice) {
    const percentOfMedian = (maxHomePrice / municipality.medianHomePrice) * 100;
    recommendations.push(
      `Your budget is ${percentOfMedian.toFixed(0)}% of the median home price in ${municipality.name}. You'll find options in the starter home or condo market.`
    );
  }

  // FHA vs Conventional recommendation based on down payment
  if (loanType === 'Conventional' && downPaymentPercent < 10 && maxHomePrice < municipality.medianHomePrice) {
    recommendations.push(
      'With a low down payment in this price range, an FHA loan might offer better terms and lower rates. Consider comparing both options.'
    );
  } else if (loanType === 'FHA' && downPaymentPercent >= 20) {
    recommendations.push(
      'With a 20%+ down payment, a Conventional loan would eliminate mortgage insurance and likely save you money over the loan term.'
    );
  }

  // Emergency fund recommendation
  const recommendedEmergency = (monthlyPayment + estimatedMonthlyPayment.utilities.total) * 6;
  if (emergencyFund < recommendedEmergency) {
    recommendations.push(
      `Build your emergency fund to at least $${Math.round(recommendedEmergency).toLocaleString()} (6 months of housing costs)`
    );
  }

  // DTI recommendations
  if (totalDTI > 0.36) {
    recommendations.push(
      'Your debt-to-income ratio is high. Consider paying down existing debts before purchasing'
    );
  } else if (totalDTI < 0.28) {
    recommendations.push('Your debt-to-income ratio is excellent - you have strong affordability');
  }

  // Disposable income recommendations
  if (monthlyDisposableIncome < 500) {
    recommendations.push(
      'Limited monthly budget remaining. Consider a lower price range for more financial flexibility'
    );
  } else if (monthlyDisposableIncome > 2000) {
    recommendations.push(
      'You have healthy financial cushion remaining after housing costs'
    );
  }

  // Down payment recommendations
  if (estimatedMonthlyPayment.mortgageInsurance > 0) {
    recommendations.push(
      'Increasing your down payment to 20% would eliminate mortgage insurance and save money long-term'
    );
  }

  return recommendations;
}

/**
 * Generate warnings for potential issues
 */
function generateWarnings(params: {
  monthlyDisposableIncome: number;
  emergencyFund: number;
  monthlyPayment: number;
  totalDTI: number;
  downPaymentPercent: number;
  maxHomePrice: number;
  municipality: any;
  loanType: string;
}): string[] {
  const {
    monthlyDisposableIncome,
    emergencyFund,
    monthlyPayment,
    totalDTI,
    downPaymentPercent,
    maxHomePrice,
    municipality,
    loanType,
  } = params;

  const warnings: string[] = [];

  // Critical market price warning
  if (maxHomePrice < municipality.minRealisticPrice * 0.7) {
    warnings.push(
      `Warning: Your budget is significantly below typical home prices in ${municipality.name}. Finding available properties may be very challenging. Consider alternative locations or increasing your budget.`
    );
  }

  // FHA requirement warning
  if (loanType === 'Conventional' && downPaymentPercent < 5 && maxHomePrice < municipality.medianHomePrice) {
    warnings.push(
      'Warning: With less than 5% down in this price range, lenders may require you to use an FHA loan instead of Conventional. FHA loans have lifetime mortgage insurance.'
    );
  }

  if (monthlyDisposableIncome < 0) {
    warnings.push(
      'Warning: This home price would exceed your budget. Consider reducing your target price or increasing income.'
    );
  }

  if (emergencyFund < monthlyPayment * 3) {
    warnings.push(
      'Warning: Your emergency fund is below 3 months of housing costs. This increases financial risk.'
    );
  }

  if (totalDTI > 0.43) {
    warnings.push(
      'Warning: Your debt-to-income ratio exceeds typical lending limits. You may not qualify for this loan amount.'
    );
  }

  if (downPaymentPercent < 5) {
    warnings.push(
      'Warning: Very low down payment may result in higher interest rates and mortgage insurance costs.'
    );
  }

  return warnings;
}
