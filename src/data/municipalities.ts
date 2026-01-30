import type { Municipality } from '../types/calculator';

// Mock data for 5 diverse municipalities
export const municipalities: Municipality[] = [
  {
    id: 'manhattan-ny',
    name: 'Manhattan',
    state: 'NY',
    propertyTaxRate: 0.00934, // 0.934%
    avgUtilityMultiplier: 1.25, // 25% higher than base
    region: 'urban',
    medianHomePrice: 1200000, // Very high - Manhattan market
    avgHomePrice: 1500000,
    minRealisticPrice: 600000, // Even studios are expensive
  },
  {
    id: 'austin-tx',
    name: 'Austin',
    state: 'TX',
    propertyTaxRate: 0.0181, // 1.81%
    avgUtilityMultiplier: 0.9, // 10% lower than base
    region: 'urban',
    medianHomePrice: 550000, // Hot market
    avgHomePrice: 600000,
    minRealisticPrice: 300000,
  },
  {
    id: 'miami-fl',
    name: 'Miami',
    state: 'FL',
    propertyTaxRate: 0.0083, // 0.83%
    avgUtilityMultiplier: 1.15, // 15% higher (A/C heavy)
    region: 'urban',
    medianHomePrice: 525000, // Expensive coastal market
    avgHomePrice: 575000,
    minRealisticPrice: 280000,
  },
  {
    id: 'denver-co',
    name: 'Denver',
    state: 'CO',
    propertyTaxRate: 0.0051, // 0.51%
    avgUtilityMultiplier: 1.0, // Base rate
    region: 'urban',
    medianHomePrice: 575000, // High altitude, high prices
    avgHomePrice: 625000,
    minRealisticPrice: 325000,
  },
  {
    id: 'seattle-wa',
    name: 'Seattle',
    state: 'WA',
    propertyTaxRate: 0.0084, // 0.84%
    avgUtilityMultiplier: 0.95, // 5% lower than base
    region: 'urban',
    medianHomePrice: 800000, // Tech hub premium
    avgHomePrice: 850000,
    minRealisticPrice: 450000,
  },
];

export function getMunicipalityById(id: string): Municipality | undefined {
  return municipalities.find((m) => m.id === id);
}

export function getMunicipalitiesByState(): Record<string, Municipality[]> {
  return municipalities.reduce((acc, municipality) => {
    if (!acc[municipality.state]) {
      acc[municipality.state] = [];
    }
    acc[municipality.state].push(municipality);
    return acc;
  }, {} as Record<string, Municipality[]>);
}
