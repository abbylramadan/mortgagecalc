import numeral from 'numeral';

// Format currency with no decimal places
export function formatCurrency(value: number): string {
  return numeral(value).format('$0,0');
}

// Format currency with decimal places
export function formatCurrencyWithCents(value: number): string {
  return numeral(value).format('$0,0.00');
}

// Format percentage
export function formatPercent(value: number, decimals: number = 1): string {
  return numeral(value).format(`0.${'0'.repeat(decimals)}%`);
}

// Format number with commas
export function formatNumber(value: number): string {
  return numeral(value).format('0,0');
}

// Format compact numbers (e.g., 1.2M, 450K)
export function formatCompact(value: number): string {
  return numeral(value).format('0.0a').toUpperCase();
}

// Parse currency string to number
export function parseCurrency(value: string): number {
  return numeral(value).value() || 0;
}
