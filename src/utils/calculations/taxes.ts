/**
 * Simplified federal income tax calculation
 * Uses 2024 tax brackets for single filer
 *
 * @param annualIncome - Gross annual income
 * @returns Federal tax amount
 */
export function calculateFederalTax(annualIncome: number): number {
  // 2024 federal tax brackets (single filer)
  const brackets = [
    { limit: 11600, rate: 0.10 },
    { limit: 47150, rate: 0.12 },
    { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243725, rate: 0.32 },
    { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const taxableIncome = Math.min(annualIncome, bracket.limit) - previousLimit;

    if (taxableIncome <= 0) break;

    tax += taxableIncome * bracket.rate;
    previousLimit = bracket.limit;

    if (annualIncome <= bracket.limit) break;
  }

  return tax;
}

/**
 * Calculate state income tax based on municipality
 * Simplified state tax rates
 *
 * @param annualIncome - Gross annual income
 * @param state - State abbreviation
 * @returns State tax amount
 */
export function calculateStateTax(annualIncome: number, state: string): number {
  // Simplified state tax rates
  const stateTaxRates: Record<string, number> = {
    'NY': 0.065, // 6.5% effective rate
    'TX': 0,     // No state income tax
    'FL': 0,     // No state income tax
    'CO': 0.044, // 4.4% flat rate
    'WA': 0,     // No state income tax
  };

  const rate = stateTaxRates[state] || 0.05; // Default 5%
  return annualIncome * rate;
}

/**
 * Calculate FICA taxes (Social Security + Medicare)
 *
 * @param annualIncome - Gross annual income
 * @returns FICA tax amount
 */
export function calculateFICATax(annualIncome: number): number {
  const socialSecurityLimit = 160200; // 2024 limit
  const socialSecurityRate = 0.062; // 6.2%
  const medicareRate = 0.0145; // 1.45%

  const socialSecurityTax = Math.min(annualIncome, socialSecurityLimit) * socialSecurityRate;
  const medicareTax = annualIncome * medicareRate;

  return socialSecurityTax + medicareTax;
}

/**
 * Calculate total annual net income after all taxes
 *
 * @param annualIncome - Gross annual income
 * @param state - State abbreviation
 * @returns Net annual income after taxes
 */
export function calculateNetIncome(annualIncome: number, state: string): number {
  const federalTax = calculateFederalTax(annualIncome);
  const stateTax = calculateStateTax(annualIncome, state);
  const ficaTax = calculateFICATax(annualIncome);

  const totalTax = federalTax + stateTax + ficaTax;
  return annualIncome - totalTax;
}

/**
 * Calculate monthly net income
 *
 * @param annualIncome - Gross annual income
 * @param state - State abbreviation
 * @returns Monthly net income
 */
export function calculateMonthlyNetIncome(annualIncome: number, state: string): number {
  return calculateNetIncome(annualIncome, state) / 12;
}

/**
 * Calculate effective tax rate
 *
 * @param annualIncome - Gross annual income
 * @param state - State abbreviation
 * @returns Effective tax rate as decimal
 */
export function calculateEffectiveTaxRate(annualIncome: number, state: string): number {
  const netIncome = calculateNetIncome(annualIncome, state);
  return (annualIncome - netIncome) / annualIncome;
}
