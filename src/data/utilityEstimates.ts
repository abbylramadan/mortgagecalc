import type { UtilityEstimate } from '../types/calculator';

// Base monthly utility costs by square footage range
export const utilityEstimates: UtilityEstimate[] = [
  {
    sqftRange: { min: 0, max: 1000 },
    baseMonthlyUtilities: {
      electric: 80,
      gas: 50,
      water: 40,
      internet: 60,
    },
  },
  {
    sqftRange: { min: 1000, max: 1500 },
    baseMonthlyUtilities: {
      electric: 110,
      gas: 65,
      water: 50,
      internet: 60,
    },
  },
  {
    sqftRange: { min: 1500, max: 2000 },
    baseMonthlyUtilities: {
      electric: 140,
      gas: 80,
      water: 60,
      internet: 60,
    },
  },
  {
    sqftRange: { min: 2000, max: 2500 },
    baseMonthlyUtilities: {
      electric: 175,
      gas: 95,
      water: 70,
      internet: 60,
    },
  },
  {
    sqftRange: { min: 2500, max: 3000 },
    baseMonthlyUtilities: {
      electric: 210,
      gas: 110,
      water: 80,
      internet: 60,
    },
  },
  {
    sqftRange: { min: 3000, max: Infinity },
    baseMonthlyUtilities: {
      electric: 260,
      gas: 130,
      water: 90,
      internet: 60,
    },
  },
];

export function getBaseUtilities(sqft: number) {
  const estimate = utilityEstimates.find(
    (est) => sqft >= est.sqftRange.min && sqft < est.sqftRange.max
  );

  // Default to middle range if no match
  return (
    estimate?.baseMonthlyUtilities || {
      electric: 140,
      gas: 80,
      water: 60,
      internet: 60,
    }
  );
}
