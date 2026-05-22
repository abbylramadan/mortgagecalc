export interface Metro {
  id: string;
  name: string;
  state: string;
  zipCode: string;
  medianHomePrice: number;
  avgHomePrice: number;
  minRealisticPrice: number;
  propertyTaxRate: number;
  avgUtilityMultiplier: number;
  description: string;
}

export const topMetros: Metro[] = [
  {
    id: 'nyc',
    name: 'New York City',
    state: 'NY',
    zipCode: '10001',
    medianHomePrice: 780000,
    avgHomePrice: 950000,
    minRealisticPrice: 450000,
    propertyTaxRate: 0.0123,
    avgUtilityMultiplier: 1.25,
    description: 'Largest US metro; condo-heavy, high taxes and cost of living',
  },
  {
    id: 'la',
    name: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    medianHomePrice: 875000,
    avgHomePrice: 1050000,
    minRealisticPrice: 500000,
    propertyTaxRate: 0.0073,
    avgUtilityMultiplier: 1.05,
    description: 'Sprawling metro with very high prices, moderate property taxes',
  },
  {
    id: 'chicago',
    name: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    medianHomePrice: 375000,
    avgHomePrice: 475000,
    minRealisticPrice: 225000,
    propertyTaxRate: 0.0173,
    avgUtilityMultiplier: 1.1,
    description: 'Affordable big-city housing with notably high property taxes',
  },
  {
    id: 'dfw',
    name: 'Dallas-Fort Worth',
    state: 'TX',
    zipCode: '75201',
    medianHomePrice: 395000,
    avgHomePrice: 465000,
    minRealisticPrice: 235000,
    propertyTaxRate: 0.0181,
    avgUtilityMultiplier: 1.05,
    description: 'No state income tax, but among the highest property taxes',
  },
  {
    id: 'houston',
    name: 'Houston',
    state: 'TX',
    zipCode: '77002',
    medianHomePrice: 335000,
    avgHomePrice: 405000,
    minRealisticPrice: 200000,
    propertyTaxRate: 0.0181,
    avgUtilityMultiplier: 1.1,
    description: 'Affordable home prices, no state income tax, high property taxes',
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    state: 'GA',
    zipCode: '30303',
    medianHomePrice: 395000,
    avgHomePrice: 475000,
    minRealisticPrice: 235000,
    propertyTaxRate: 0.0087,
    avgUtilityMultiplier: 1.0,
    description: 'Fast-growing Southeast metro with moderate cost of living',
  },
  {
    id: 'dc',
    name: 'Washington, D.C.',
    state: 'DC',
    zipCode: '20001',
    medianHomePrice: 625000,
    avgHomePrice: 745000,
    minRealisticPrice: 375000,
    propertyTaxRate: 0.0057,
    avgUtilityMultiplier: 1.1,
    description: 'High home prices but relatively low property tax rate',
  },
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    state: 'PA',
    zipCode: '19103',
    medianHomePrice: 285000,
    avgHomePrice: 355000,
    minRealisticPrice: 170000,
    propertyTaxRate: 0.0153,
    avgUtilityMultiplier: 1.1,
    description: 'One of the more affordable big-city housing markets',
  },
  {
    id: 'miami',
    name: 'Miami',
    state: 'FL',
    zipCode: '33130',
    medianHomePrice: 575000,
    avgHomePrice: 695000,
    minRealisticPrice: 350000,
    propertyTaxRate: 0.0083,
    avgUtilityMultiplier: 1.1,
    description: 'No state income tax; condo-heavy with rising insurance costs',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    state: 'AZ',
    zipCode: '85003',
    medianHomePrice: 445000,
    avgHomePrice: 525000,
    minRealisticPrice: 265000,
    propertyTaxRate: 0.0062,
    avgUtilityMultiplier: 1.15,
    description: 'Sunbelt growth metro with moderate prices and low property taxes',
  },
];

export function getMetroById(id: string): Metro | undefined {
  return topMetros.find((m) => m.id === id);
}

export function getMetroByZip(zipCode: string): Metro | undefined {
  return topMetros.find((m) => m.zipCode === zipCode);
}
