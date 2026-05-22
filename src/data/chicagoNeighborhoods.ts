/**
 * Chicago neighborhoods with ZIP codes and characteristics
 */

export interface ChicagoNeighborhood {
  id: string;
  name: string;
  zipCode: string;
  area: string; // North Side, South Side, West Side, Downtown
  description: string;
  medianHomePrice: number;
  avgHomePrice: number;
  minRealisticPrice: number;
  propertyTaxRate: number;
}

export const chicagoNeighborhoods: ChicagoNeighborhood[] = [
  // Downtown & Near North
  {
    id: 'loop',
    name: 'The Loop',
    zipCode: '60601',
    area: 'Downtown',
    description: 'Heart of downtown, mostly condos and high-rises',
    medianHomePrice: 425000,
    avgHomePrice: 550000,
    minRealisticPrice: 275000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'river-north',
    name: 'River North',
    zipCode: '60654',
    area: 'Near North',
    description: 'Trendy area with galleries, restaurants, and loft-style condos',
    medianHomePrice: 475000,
    avgHomePrice: 600000,
    minRealisticPrice: 300000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'lincoln-park',
    name: 'Lincoln Park',
    zipCode: '60614',
    area: 'North Side',
    description: 'Upscale neighborhood with parks, zoo, and lakefront access',
    medianHomePrice: 625000,
    avgHomePrice: 775000,
    minRealisticPrice: 400000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'lakeview',
    name: 'Lakeview',
    zipCode: '60657',
    area: 'North Side',
    description: 'Vibrant area near Wrigley Field with great nightlife',
    medianHomePrice: 475000,
    avgHomePrice: 550000,
    minRealisticPrice: 300000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'wicker-park',
    name: 'Wicker Park',
    zipCode: '60622',
    area: 'West Side',
    description: 'Hip, artsy neighborhood with indie shops and restaurants',
    medianHomePrice: 525000,
    avgHomePrice: 625000,
    minRealisticPrice: 350000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'logan-square',
    name: 'Logan Square',
    zipCode: '60647',
    area: 'Northwest Side',
    description: 'Up-and-coming area with diverse dining and culture',
    medianHomePrice: 425000,
    avgHomePrice: 500000,
    minRealisticPrice: 275000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'west-loop',
    name: 'West Loop',
    zipCode: '60607',
    area: 'West Side',
    description: 'Former meatpacking district, now foodie central with modern condos',
    medianHomePrice: 550000,
    avgHomePrice: 675000,
    minRealisticPrice: 375000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'pilsen',
    name: 'Pilsen',
    zipCode: '60608',
    area: 'Lower West Side',
    description: 'Historic Mexican-American neighborhood with vibrant art scene',
    medianHomePrice: 325000,
    avgHomePrice: 400000,
    minRealisticPrice: 200000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'bridgeport',
    name: 'Bridgeport',
    zipCode: '60609',
    area: 'South Side',
    description: 'Working-class neighborhood near Sox Park, increasingly popular',
    medianHomePrice: 300000,
    avgHomePrice: 375000,
    minRealisticPrice: 185000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'hyde-park',
    name: 'Hyde Park',
    zipCode: '60615',
    area: 'South Side',
    description: 'Home to University of Chicago, historic architecture',
    medianHomePrice: 375000,
    avgHomePrice: 450000,
    minRealisticPrice: 225000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'ravenswood',
    name: 'Ravenswood',
    zipCode: '60625',
    area: 'North Side',
    description: 'Family-friendly with tree-lined streets and good schools',
    medianHomePrice: 475000,
    avgHomePrice: 575000,
    minRealisticPrice: 300000,
    propertyTaxRate: 0.0173,
  },
  {
    id: 'bucktown',
    name: 'Bucktown',
    zipCode: '60647',
    area: 'West Side',
    description: 'Trendy neighborhood with boutiques and cafes',
    medianHomePrice: 525000,
    avgHomePrice: 625000,
    minRealisticPrice: 350000,
    propertyTaxRate: 0.0173,
  },
];

export function getNeighborhoodByZip(zipCode: string): ChicagoNeighborhood | undefined {
  return chicagoNeighborhoods.find(n => n.zipCode === zipCode);
}

export function getNeighborhoodById(id: string): ChicagoNeighborhood | undefined {
  return chicagoNeighborhoods.find(n => n.id === id);
}
