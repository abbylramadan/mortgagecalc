import type { UtilityBreakdown } from '../../types/calculator';
import { getBaseUtilities } from '../../data/utilityEstimates';
import { getMunicipalityById } from '../../data/municipalities';

/**
 * Calculate estimated monthly utilities based on square footage and location
 *
 * @param sqft - Home square footage
 * @param municipalityId - Municipality ID for location-specific multiplier
 * @returns Monthly utility cost breakdown
 */
export function calculateUtilities(sqft: number, municipalityId: string): UtilityBreakdown {
  // Get base utilities for this sqft range
  const base = getBaseUtilities(sqft);

  // Get municipality to apply location multiplier
  const municipality = getMunicipalityById(municipalityId);
  const multiplier = municipality?.avgUtilityMultiplier || 1.0;

  // Apply multiplier to each utility
  const electric = Math.round(base.electric * multiplier);
  const gas = Math.round(base.gas * multiplier);
  const water = Math.round(base.water * multiplier);
  const internet = base.internet; // Internet doesn't vary by location

  return {
    electric,
    gas,
    water,
    internet,
    total: electric + gas + water + internet,
  };
}
