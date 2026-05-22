/**
 * Real Estate Market Data Service
 * Fetches live market data from RapidAPI (Zillow, Redfin, etc.)
 */

import type { Municipality } from '../types/calculator';
import { getNeighborhoodByZip } from '../data/chicagoNeighborhoods';
import { getMetroByZip } from '../data/metros';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Cache for market data (to minimize API calls)
const marketDataCache = new Map<string, CachedMarketData>();
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

interface CachedMarketData {
  data: MarketData;
  timestamp: number;
}

export interface MarketData {
  zipCode: string;
  city: string;
  state: string;
  medianHomePrice: number;
  avgHomePrice: number;
  minRealisticPrice: number;
  propertyTaxRate: number;
  avgUtilityMultiplier: number;
  region: 'urban' | 'suburban' | 'rural';
}

export interface PropertyListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  yearBuilt?: number;
  listingUrl?: string;
  imageUrl?: string;
  daysOnMarket?: number;
}

/**
 * Fetch market data for a given zip code
 */
export async function fetchMarketData(zipCode: string): Promise<MarketData> {
  // Check cache first
  const cached = marketDataCache.get(zipCode);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Use mock data if API is not configured
  if (USE_MOCK_DATA || !RAPIDAPI_KEY) {
    const mockData = getMockMarketData(zipCode);
    cacheMarketData(zipCode, mockData);
    return mockData;
  }

  try {
    // Fetch from RapidAPI
    const data = await fetchFromRapidAPI(zipCode);
    cacheMarketData(zipCode, data);
    return data;
  } catch (error) {
    console.error('Error fetching market data, falling back to mock:', error);
    const mockData = getMockMarketData(zipCode);
    cacheMarketData(zipCode, mockData);
    return mockData;
  }
}

/**
 * Fetch market data from RapidAPI (Realty Mole)
 */
async function fetchFromRapidAPI(zipCode: string): Promise<MarketData> {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com',
    },
  };

  // Step 1: Get ZIP code info
  const zipResponse = await fetch(
    `https://realty-mole-property-api.p.rapidapi.com/zipCodes/${zipCode}`,
    options
  );

  if (!zipResponse.ok) {
    throw new Error(`Failed to fetch zip code data: ${zipResponse.status}`);
  }

  const zipData = await zipResponse.json();

  // Step 2: Get market sales data
  const salesResponse = await fetch(
    `https://realty-mole-property-api.p.rapidapi.com/saleListings?zipCode=${zipCode}&limit=50`,
    options
  );

  let medianPrice = 400000;
  let avgPrice = 450000;

  if (salesResponse.ok) {
    const salesData = await salesResponse.json();
    const prices = salesData.map((listing: any) => listing.price).filter((p: number) => p > 0);

    if (prices.length > 0) {
      prices.sort((a: number, b: number) => a - b);
      medianPrice = prices[Math.floor(prices.length / 2)];
      avgPrice = prices.reduce((sum: number, p: number) => sum + p, 0) / prices.length;
    }
  }

  // Determine property tax rate by state
  const propertyTaxRate = getPropertyTaxRateByState(zipData.state);
  const utilityMultiplier = getUtilityMultiplierByRegion(zipData.city, zipData.state);
  const region = determineRegion(zipData.city, zipData.state);

  return {
    zipCode: zipData.zipCode,
    city: zipData.city,
    state: zipData.state,
    medianHomePrice: Math.round(medianPrice),
    avgHomePrice: Math.round(avgPrice),
    minRealisticPrice: Math.round(medianPrice * 0.5), // 50% of median as minimum
    propertyTaxRate,
    avgUtilityMultiplier: utilityMultiplier,
    region,
  };
}

/**
 * Get mock market data for testing/fallback
 */
function getMockMarketData(zipCode: string): MarketData {
  // First, check if this matches a top metro (non-Chicago metros use their canonical ZIP)
  const metro = getMetroByZip(zipCode);
  if (metro && metro.id !== 'chicago') {
    return {
      zipCode: metro.zipCode,
      city: metro.name,
      state: metro.state,
      medianHomePrice: metro.medianHomePrice,
      avgHomePrice: metro.avgHomePrice,
      minRealisticPrice: metro.minRealisticPrice,
      propertyTaxRate: metro.propertyTaxRate,
      avgUtilityMultiplier: metro.avgUtilityMultiplier,
      region: 'urban',
    };
  }

  // Chicago: drill down by neighborhood ZIP
  const chicagoNeighborhood = getNeighborhoodByZip(zipCode);
  if (chicagoNeighborhood) {
    return {
      zipCode: chicagoNeighborhood.zipCode,
      city: chicagoNeighborhood.name,
      state: 'IL',
      medianHomePrice: chicagoNeighborhood.medianHomePrice,
      avgHomePrice: chicagoNeighborhood.avgHomePrice,
      minRealisticPrice: chicagoNeighborhood.minRealisticPrice,
      propertyTaxRate: chicagoNeighborhood.propertyTaxRate,
      avgUtilityMultiplier: 1.1, // Chicago moderate utilities
      region: 'urban',
    };
  }

  // Fall back to general regional mapping
  const prefix3 = parseInt(zipCode.substring(0, 3));
  const regionData = getRegionDataByZipPrefix3(prefix3);

  return {
    zipCode,
    city: regionData.city,
    state: regionData.state,
    medianHomePrice: regionData.medianHomePrice,
    avgHomePrice: regionData.avgHomePrice,
    minRealisticPrice: regionData.minRealisticPrice,
    propertyTaxRate: regionData.propertyTaxRate,
    avgUtilityMultiplier: regionData.avgUtilityMultiplier,
    region: regionData.region,
  };
}

/**
 * Cache market data
 */
function cacheMarketData(zipCode: string, data: MarketData): void {
  marketDataCache.set(zipCode, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Property tax rates by state (approximate averages)
 */
function getPropertyTaxRateByState(state: string): number {
  const taxRates: Record<string, number> = {
    AL: 0.0041, AK: 0.0076, AZ: 0.0062, AR: 0.0061, CA: 0.0073,
    CO: 0.0051, CT: 0.0163, DE: 0.0057, FL: 0.0083, GA: 0.0087,
    HI: 0.0028, ID: 0.0063, IL: 0.0173, IN: 0.0081, IA: 0.0129,
    KS: 0.0129, KY: 0.0083, LA: 0.0055, ME: 0.0122, MD: 0.0087,
    MA: 0.0104, MI: 0.0142, MN: 0.0106, MS: 0.0079, MO: 0.0092,
    MT: 0.0083, NE: 0.0151, NV: 0.0053, NH: 0.0166, NJ: 0.0211,
    NM: 0.0079, NY: 0.0123, NC: 0.0078, ND: 0.0086, OH: 0.0135,
    OK: 0.0087, OR: 0.0087, PA: 0.0135, RI: 0.0138, SC: 0.0054,
    SD: 0.0085, TN: 0.0067, TX: 0.0169, UT: 0.0058, VT: 0.0154,
    VA: 0.0074, WA: 0.0084, WV: 0.0058, WI: 0.0165, WY: 0.0055,
  };

  return taxRates[state] || 0.01; // Default 1%
}

/**
 * Utility multiplier based on climate and region
 */
function getUtilityMultiplierByRegion(_city: string, state: string): number {
  // Hot southern states (high A/C usage)
  if (['FL', 'AZ', 'TX', 'LA', 'MS', 'AL', 'GA'].includes(state)) {
    return 1.15;
  }

  // Cold northern states (high heating)
  if (['AK', 'MN', 'ND', 'SD', 'WI', 'ME', 'VT', 'NH'].includes(state)) {
    return 1.1;
  }

  // Expensive urban areas
  if (['NY', 'CA', 'MA'].includes(state)) {
    return 1.2;
  }

  return 1.0; // Moderate climate/costs
}

/**
 * Determine if region is urban, suburban, or rural
 */
function determineRegion(city: string, _state: string): 'urban' | 'suburban' | 'rural' {
  const majorCities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin',
    'Jacksonville', 'San Jose', 'Fort Worth', 'Columbus', 'Charlotte',
    'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston',
    'Washington', 'Nashville', 'El Paso', 'Detroit', 'Portland',
    'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee',
    'Albuquerque', 'Tucson', 'Fresno', 'Mesa', 'Sacramento',
    'Atlanta', 'Kansas City', 'Colorado Springs', 'Omaha', 'Raleigh',
    'Miami', 'Oakland', 'Minneapolis', 'Tulsa', 'Wichita',
  ];

  if (majorCities.some(c => city.toLowerCase().includes(c.toLowerCase()))) {
    return 'urban';
  }

  return 'suburban'; // Default to suburban
}

/**
 * Get regional data based on 3-digit ZIP code prefix for better accuracy
 * Uses major metro areas and state-level data
 */
function getRegionDataByZipPrefix3(prefix3: number): MarketData {
  // Major metro areas with 3-digit precision
  const majorMetros: Record<string, MarketData> = {
    // New York area (100-102)
    '100-102': {
      zipCode: '10001',
      city: 'New York',
      state: 'NY',
      medianHomePrice: 850000,
      avgHomePrice: 1100000,
      minRealisticPrice: 500000,
      propertyTaxRate: 0.0093,
      avgUtilityMultiplier: 1.2,
      region: 'urban',
    },
    // Boston area (021-024)
    '021-024': {
      zipCode: '02101',
      city: 'Boston',
      state: 'MA',
      medianHomePrice: 725000,
      avgHomePrice: 825000,
      minRealisticPrice: 450000,
      propertyTaxRate: 0.0104,
      avgUtilityMultiplier: 1.15,
      region: 'urban',
    },
    // DC area (200-205)
    '200-205': {
      zipCode: '20001',
      city: 'Washington',
      state: 'DC',
      medianHomePrice: 625000,
      avgHomePrice: 700000,
      minRealisticPrice: 375000,
      propertyTaxRate: 0.0056,
      avgUtilityMultiplier: 1.1,
      region: 'urban',
    },
    // Atlanta (303-304)
    '303-304': {
      zipCode: '30301',
      city: 'Atlanta',
      state: 'GA',
      medianHomePrice: 425000,
      avgHomePrice: 475000,
      minRealisticPrice: 250000,
      propertyTaxRate: 0.0087,
      avgUtilityMultiplier: 1.15,
      region: 'urban',
    },
    // Miami (330-334)
    '330-334': {
      zipCode: '33101',
      city: 'Miami',
      state: 'FL',
      medianHomePrice: 525000,
      avgHomePrice: 600000,
      minRealisticPrice: 325000,
      propertyTaxRate: 0.0083,
      avgUtilityMultiplier: 1.2,
      region: 'urban',
    },
    // Indianapolis (460-462)
    '460-462': {
      zipCode: '46201',
      city: 'Indianapolis',
      state: 'IN',
      medianHomePrice: 275000,
      avgHomePrice: 325000,
      minRealisticPrice: 150000,
      propertyTaxRate: 0.0081,
      avgUtilityMultiplier: 1.0,
      region: 'suburban',
    },
    // Chicago (606-608)
    '606-608': {
      zipCode: '60601',
      city: 'Chicago',
      state: 'IL',
      medianHomePrice: 425000,
      avgHomePrice: 500000,
      minRealisticPrice: 250000,
      propertyTaxRate: 0.0173,
      avgUtilityMultiplier: 1.1,
      region: 'urban',
    },
    // Dallas (750-753)
    '750-753': {
      zipCode: '75201',
      city: 'Dallas',
      state: 'TX',
      medianHomePrice: 425000,
      avgHomePrice: 475000,
      minRealisticPrice: 240000,
      propertyTaxRate: 0.0169,
      avgUtilityMultiplier: 1.15,
      region: 'urban',
    },
    // Austin (787)
    '787-787': {
      zipCode: '78701',
      city: 'Austin',
      state: 'TX',
      medianHomePrice: 550000,
      avgHomePrice: 625000,
      minRealisticPrice: 325000,
      propertyTaxRate: 0.0181,
      avgUtilityMultiplier: 1.15,
      region: 'urban',
    },
    // Denver (802-803)
    '802-803': {
      zipCode: '80201',
      city: 'Denver',
      state: 'CO',
      medianHomePrice: 575000,
      avgHomePrice: 625000,
      minRealisticPrice: 325000,
      propertyTaxRate: 0.0051,
      avgUtilityMultiplier: 1.0,
      region: 'urban',
    },
    // Phoenix (850-853)
    '850-853': {
      zipCode: '85001',
      city: 'Phoenix',
      state: 'AZ',
      medianHomePrice: 450000,
      avgHomePrice: 500000,
      minRealisticPrice: 275000,
      propertyTaxRate: 0.0062,
      avgUtilityMultiplier: 1.2,
      region: 'urban',
    },
    // Los Angeles (900-908)
    '900-908': {
      zipCode: '90001',
      city: 'Los Angeles',
      state: 'CA',
      medianHomePrice: 825000,
      avgHomePrice: 975000,
      minRealisticPrice: 525000,
      propertyTaxRate: 0.0073,
      avgUtilityMultiplier: 1.1,
      region: 'urban',
    },
    // San Francisco (940-941)
    '940-941': {
      zipCode: '94102',
      city: 'San Francisco',
      state: 'CA',
      medianHomePrice: 1350000,
      avgHomePrice: 1550000,
      minRealisticPrice: 850000,
      propertyTaxRate: 0.0073,
      avgUtilityMultiplier: 1.1,
      region: 'urban',
    },
    // Seattle (980-982)
    '980-982': {
      zipCode: '98101',
      city: 'Seattle',
      state: 'WA',
      medianHomePrice: 800000,
      avgHomePrice: 925000,
      minRealisticPrice: 500000,
      propertyTaxRate: 0.0084,
      avgUtilityMultiplier: 0.95,
      region: 'urban',
    },
  };

  // Check if prefix matches a major metro
  for (const [range, data] of Object.entries(majorMetros)) {
    const [min, max] = range.split('-').map(Number);
    if (prefix3 >= min && prefix3 <= max) {
      return data;
    }
  }

  // Fall back to broader state-level estimates based on first digit
  const firstDigit = Math.floor(prefix3 / 100);
  const stateLevelData: Record<number, MarketData> = {
    0: { // Northeast (0xx)
      zipCode: '00000',
      city: 'Northeast Region',
      state: 'MA',
      medianHomePrice: 475000,
      avgHomePrice: 525000,
      minRealisticPrice: 275000,
      propertyTaxRate: 0.0104,
      avgUtilityMultiplier: 1.1,
      region: 'suburban',
    },
    1: { // Northeast (1xx)
      zipCode: '10000',
      city: 'Northeast Metro',
      state: 'NY',
      medianHomePrice: 550000,
      avgHomePrice: 625000,
      minRealisticPrice: 325000,
      propertyTaxRate: 0.0123,
      avgUtilityMultiplier: 1.15,
      region: 'suburban',
    },
    2: { // Mid-Atlantic (2xx)
      zipCode: '20000',
      city: 'Mid-Atlantic',
      state: 'VA',
      medianHomePrice: 425000,
      avgHomePrice: 475000,
      minRealisticPrice: 250000,
      propertyTaxRate: 0.0074,
      avgUtilityMultiplier: 1.05,
      region: 'suburban',
    },
    3: { // Southeast (3xx)
      zipCode: '30000',
      city: 'Southeast',
      state: 'FL',
      medianHomePrice: 400000,
      avgHomePrice: 450000,
      minRealisticPrice: 225000,
      propertyTaxRate: 0.0083,
      avgUtilityMultiplier: 1.15,
      region: 'suburban',
    },
    4: { // Midwest (4xx)
      zipCode: '40000',
      city: 'Midwest',
      state: 'KY',
      medianHomePrice: 275000,
      avgHomePrice: 325000,
      minRealisticPrice: 150000,
      propertyTaxRate: 0.0083,
      avgUtilityMultiplier: 1.0,
      region: 'suburban',
    },
    5: { // Midwest (5xx)
      zipCode: '50000',
      city: 'Upper Midwest',
      state: 'MN',
      medianHomePrice: 325000,
      avgHomePrice: 375000,
      minRealisticPrice: 175000,
      propertyTaxRate: 0.0106,
      avgUtilityMultiplier: 1.05,
      region: 'suburban',
    },
    6: { // Central (6xx)
      zipCode: '60000',
      city: 'Illinois Region',
      state: 'IL',
      medianHomePrice: 325000,
      avgHomePrice: 375000,
      minRealisticPrice: 175000,
      propertyTaxRate: 0.0173,
      avgUtilityMultiplier: 1.05,
      region: 'suburban',
    },
    7: { // South/Central (7xx)
      zipCode: '70000',
      city: 'Texas Region',
      state: 'TX',
      medianHomePrice: 375000,
      avgHomePrice: 425000,
      minRealisticPrice: 200000,
      propertyTaxRate: 0.0169,
      avgUtilityMultiplier: 1.15,
      region: 'suburban',
    },
    8: { // Mountain West (8xx)
      zipCode: '80000',
      city: 'Mountain West',
      state: 'CO',
      medianHomePrice: 500000,
      avgHomePrice: 550000,
      minRealisticPrice: 300000,
      propertyTaxRate: 0.0051,
      avgUtilityMultiplier: 1.0,
      region: 'suburban',
    },
    9: { // Pacific West (9xx)
      zipCode: '90000',
      city: 'West Coast',
      state: 'CA',
      medianHomePrice: 675000,
      avgHomePrice: 775000,
      minRealisticPrice: 425000,
      propertyTaxRate: 0.0073,
      avgUtilityMultiplier: 1.1,
      region: 'suburban',
    },
  };

  return stateLevelData[firstDigit] || stateLevelData[5]; // Default to midwest
}

/**
 * Validate US ZIP code format
 */
export function isValidZipCode(zipCode: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zipCode);
}

/**
 * Convert MarketData to Municipality format for compatibility
 */
export function marketDataToMunicipality(marketData: MarketData): Municipality {
  return {
    id: `zip-${marketData.zipCode}`,
    name: marketData.city,
    state: marketData.state,
    propertyTaxRate: marketData.propertyTaxRate,
    avgUtilityMultiplier: marketData.avgUtilityMultiplier,
    region: marketData.region,
    medianHomePrice: marketData.medianHomePrice,
    avgHomePrice: marketData.avgHomePrice,
    minRealisticPrice: marketData.minRealisticPrice,
  };
}

/**
 * Fetch property listings within a price range for a given ZIP code
 */
export async function fetchPropertyListings(
  zipCode: string,
  maxPrice: number,
  minPrice: number = 0
): Promise<PropertyListing[]> {
  // Use mock data if API is not configured
  if (USE_MOCK_DATA || !RAPIDAPI_KEY) {
    return getMockPropertyListings(zipCode, maxPrice, minPrice);
  }

  try {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com',
      },
    };

    // Fetch sale listings
    const response = await fetch(
      `https://realty-mole-property-api.p.rapidapi.com/saleListings?zipCode=${zipCode}&limit=20`,
      options
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch property listings: ${response.status}`);
    }

    const data = await response.json();

    // Filter and transform listings
    const listings: PropertyListing[] = data
      .filter((listing: any) => {
        const price = listing.price || 0;
        return price >= minPrice && price <= maxPrice;
      })
      .slice(0, 5) // Get top 5
      .map((listing: any, index: number) => ({
        id: listing.id || `listing-${index}`,
        address: listing.formattedAddress || listing.addressLine1 || 'Address not available',
        city: listing.city || '',
        state: listing.state || '',
        zipCode: listing.zipCode || zipCode,
        price: listing.price || 0,
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        squareFeet: listing.squareFootage || 0,
        propertyType: listing.propertyType || 'Single Family',
        yearBuilt: listing.yearBuilt,
        listingUrl: listing.url,
        imageUrl: listing.photos?.[0],
        daysOnMarket: listing.daysOnMarket,
      }));

    return listings;
  } catch (error) {
    console.error('Error fetching property listings, falling back to mock:', error);
    return getMockPropertyListings(zipCode, maxPrice, minPrice);
  }
}

/**
 * Generate mock property listings for testing/fallback
 */
function getMockPropertyListings(
  zipCode: string,
  maxPrice: number,
  minPrice: number
): PropertyListing[] {
  const mockListings: PropertyListing[] = [];
  const basePrice = Math.max(minPrice, maxPrice * 0.75);
  const priceStep = (maxPrice - basePrice) / 5;

  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];

  // Determine city/state/streets from the ZIP — covers our top metros plus Chicago neighborhoods
  const locale = getMockLocaleForZip(zipCode);

  for (let i = 0; i < 5; i++) {
    const price = Math.round(basePrice + (priceStep * i));
    const sqft = Math.round(800 + (price / 500));
    const beds = price > 500000 ? 3 : price > 350000 ? 2 : 1;
    const baths = beds === 3 ? 2.5 : beds === 2 ? 2 : 1;

    mockListings.push({
      id: `mock-${i}`,
      address: `${1000 + (i * 100)} ${locale.streets[i % locale.streets.length]}`,
      city: locale.city,
      state: locale.state,
      zipCode,
      price,
      bedrooms: beds,
      bathrooms: baths,
      squareFeet: sqft,
      propertyType: propertyTypes[i % propertyTypes.length],
      yearBuilt: 1920 + Math.round(Math.random() * 100),
      daysOnMarket: Math.round(Math.random() * 60),
    });
  }

  return mockListings;
}

function getMockLocaleForZip(zipCode: string): { city: string; state: string; streets: string[] } {
  // Chicago neighborhoods (60xxx range used by chicagoNeighborhoods data)
  const chicagoNeighborhood = getNeighborhoodByZip(zipCode);
  if (chicagoNeighborhood) {
    return {
      city: chicagoNeighborhood.name,
      state: 'IL',
      streets: ['N Clark St', 'W Division St', 'N Milwaukee Ave', 'W Fullerton Ave', 'N Halsted St'],
    };
  }

  const metro = getMetroByZip(zipCode);
  if (metro) {
    const streetsByMetro: Record<string, string[]> = {
      nyc: ['W 23rd St', 'Broadway', 'E 14th St', 'Park Ave', '5th Ave'],
      la: ['Sunset Blvd', 'Wilshire Blvd', 'Melrose Ave', 'La Brea Ave', 'Santa Monica Blvd'],
      chicago: ['N Clark St', 'W Division St', 'N Milwaukee Ave', 'W Fullerton Ave', 'N Halsted St'],
      dfw: ['Main St', 'Commerce St', 'Elm St', 'McKinney Ave', 'Greenville Ave'],
      houston: ['Westheimer Rd', 'Montrose Blvd', 'Kirby Dr', 'Richmond Ave', 'Memorial Dr'],
      atlanta: ['Peachtree St', 'Ponce de Leon Ave', 'Highland Ave', 'Piedmont Rd', 'Memorial Dr'],
      dc: ['K St NW', 'Connecticut Ave NW', 'Pennsylvania Ave', '14th St NW', 'M St NW'],
      philadelphia: ['Market St', 'Chestnut St', 'Walnut St', 'Broad St', 'Spring Garden St'],
      miami: ['Brickell Ave', 'Collins Ave', 'Biscayne Blvd', 'Ocean Dr', 'Coral Way'],
      phoenix: ['Central Ave', 'Camelback Rd', 'Indian School Rd', 'Van Buren St', 'Roosevelt St'],
    };
    return {
      city: metro.name,
      state: metro.state,
      streets: streetsByMetro[metro.id] ?? ['Main St', 'Oak St', 'Elm St', 'Park Ave', '1st St'],
    };
  }

  return {
    city: 'Unknown',
    state: '',
    streets: ['Main St', 'Oak St', 'Elm St', 'Park Ave', '1st St'],
  };
}
