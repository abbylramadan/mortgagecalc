import type { SqftEstimate } from '../types/calculator';

// Average square footage by price range for each municipality
export const sqftAverages: SqftEstimate[] = [
  // Manhattan, NY - smaller spaces, higher prices
  { municipalityId: 'manhattan-ny', priceRange: { min: 0, max: 500000 }, avgSqft: 650 },
  { municipalityId: 'manhattan-ny', priceRange: { min: 500000, max: 750000 }, avgSqft: 900 },
  { municipalityId: 'manhattan-ny', priceRange: { min: 750000, max: 1000000 }, avgSqft: 1200 },
  { municipalityId: 'manhattan-ny', priceRange: { min: 1000000, max: 1500000 }, avgSqft: 1600 },
  { municipalityId: 'manhattan-ny', priceRange: { min: 1500000, max: Infinity }, avgSqft: 2200 },

  // Austin, TX - moderate spaces
  { municipalityId: 'austin-tx', priceRange: { min: 0, max: 300000 }, avgSqft: 1100 },
  { municipalityId: 'austin-tx', priceRange: { min: 300000, max: 500000 }, avgSqft: 1500 },
  { municipalityId: 'austin-tx', priceRange: { min: 500000, max: 750000 }, avgSqft: 2000 },
  { municipalityId: 'austin-tx', priceRange: { min: 750000, max: 1000000 }, avgSqft: 2600 },
  { municipalityId: 'austin-tx', priceRange: { min: 1000000, max: Infinity }, avgSqft: 3400 },

  // Miami, FL - moderate to large spaces
  { municipalityId: 'miami-fl', priceRange: { min: 0, max: 350000 }, avgSqft: 1000 },
  { municipalityId: 'miami-fl', priceRange: { min: 350000, max: 500000 }, avgSqft: 1400 },
  { municipalityId: 'miami-fl', priceRange: { min: 500000, max: 750000 }, avgSqft: 1800 },
  { municipalityId: 'miami-fl', priceRange: { min: 750000, max: 1000000 }, avgSqft: 2400 },
  { municipalityId: 'miami-fl', priceRange: { min: 1000000, max: Infinity }, avgSqft: 3200 },

  // Denver, CO - larger spaces
  { municipalityId: 'denver-co', priceRange: { min: 0, max: 350000 }, avgSqft: 1200 },
  { municipalityId: 'denver-co', priceRange: { min: 350000, max: 550000 }, avgSqft: 1600 },
  { municipalityId: 'denver-co', priceRange: { min: 550000, max: 800000 }, avgSqft: 2200 },
  { municipalityId: 'denver-co', priceRange: { min: 800000, max: 1200000 }, avgSqft: 2900 },
  { municipalityId: 'denver-co', priceRange: { min: 1200000, max: Infinity }, avgSqft: 3800 },

  // Seattle, WA - moderate spaces
  { municipalityId: 'seattle-wa', priceRange: { min: 0, max: 450000 }, avgSqft: 1000 },
  { municipalityId: 'seattle-wa', priceRange: { min: 450000, max: 650000 }, avgSqft: 1400 },
  { municipalityId: 'seattle-wa', priceRange: { min: 650000, max: 900000 }, avgSqft: 1900 },
  { municipalityId: 'seattle-wa', priceRange: { min: 900000, max: 1300000 }, avgSqft: 2500 },
  { municipalityId: 'seattle-wa', priceRange: { min: 1300000, max: Infinity }, avgSqft: 3300 },
];

export function getEstimatedSqft(homePrice: number, municipalityId: string): number {
  const estimate = sqftAverages.find(
    (est) =>
      est.municipalityId === municipalityId &&
      homePrice >= est.priceRange.min &&
      homePrice < est.priceRange.max
  );

  // Default to 1500 sqft if no match found
  return estimate?.avgSqft || 1500;
}
