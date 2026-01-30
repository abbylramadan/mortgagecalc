import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import type { Municipality } from '../../types/calculator';

interface MarketComparisonCardProps {
  maxHomePrice: number;
  municipality: Municipality;
}

export function MarketComparisonCard({ maxHomePrice, municipality }: MarketComparisonCardProps) {
  const percentOfMedian = (maxHomePrice / municipality.medianHomePrice) * 100;
  const percentOfAvg = (maxHomePrice / municipality.avgHomePrice) * 100;

  const isAboveMin = maxHomePrice >= municipality.minRealisticPrice;
  const isAboveMedian = maxHomePrice >= municipality.medianHomePrice;
  const isBelowMin = maxHomePrice < municipality.minRealisticPrice;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Comparison: {municipality.name}, {municipality.state}</CardTitle>
        <p className="text-sm text-neutral-600 mt-1">
          How your budget compares to local home prices
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Your Budget */}
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-neutral-600 mb-1">Your Max Budget</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(maxHomePrice)}
            </p>
          </div>

          {/* Market Prices */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border-2 border-neutral-200 rounded-lg">
              <p className="text-xs text-neutral-500 mb-2">Minimum Typical</p>
              <p className="text-lg font-semibold text-neutral-900">
                {formatCurrency(municipality.minRealisticPrice)}
              </p>
              {maxHomePrice >= municipality.minRealisticPrice && (
                <p className="text-xs text-success mt-1">✓ Above minimum</p>
              )}
              {maxHomePrice < municipality.minRealisticPrice && (
                <p className="text-xs text-error mt-1">Below minimum</p>
              )}
            </div>

            <div className="text-center p-4 border-2 border-neutral-200 rounded-lg">
              <p className="text-xs text-neutral-500 mb-2">Median Price</p>
              <p className="text-lg font-semibold text-neutral-900">
                {formatCurrency(municipality.medianHomePrice)}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                You're at {percentOfMedian.toFixed(0)}%
              </p>
            </div>

            <div className="text-center p-4 border-2 border-neutral-200 rounded-lg">
              <p className="text-xs text-neutral-500 mb-2">Average Price</p>
              <p className="text-lg font-semibold text-neutral-900">
                {formatCurrency(municipality.avgHomePrice)}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                You're at {percentOfAvg.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Status Message */}
          {isAboveMedian && (
            <div className="p-4 bg-success-light rounded-lg">
              <p className="text-sm text-success-dark font-semibold">
                🎉 Excellent! Your budget exceeds the median home price in this area. You'll have strong purchasing power and many options to choose from.
              </p>
            </div>
          )}

          {isAboveMin && !isAboveMedian && (
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-900">
                ✓ Your budget is realistic for this market. Focus on starter homes, condos, or properties that need minor updates. You may need to be patient and competitive in your offers.
              </p>
            </div>
          )}

          {isBelowMin && maxHomePrice >= municipality.minRealisticPrice * 0.7 && (
            <div className="p-4 bg-warning-light rounded-lg">
              <p className="text-sm text-warning-dark font-semibold">
                ⚠️ Your budget is below typical home prices here. Finding options may be challenging. Consider:
              </p>
              <ul className="text-xs text-warning-dark mt-2 space-y-1 ml-4">
                <li>• Expanding your search to nearby areas</li>
                <li>• Increasing your down payment or reducing debts</li>
                <li>• Looking at condos or smaller properties</li>
                <li>• Building equity with a starter property in a more affordable area</li>
              </ul>
            </div>
          )}

          {isBelowMin && maxHomePrice < municipality.minRealisticPrice * 0.7 && (
            <div className="p-4 bg-error-light rounded-lg">
              <p className="text-sm text-error-dark font-semibold">
                🚨 Your budget is significantly below typical prices in {municipality.name}. Homeownership here may not be feasible currently. Consider:
              </p>
              <ul className="text-xs text-error-dark mt-2 space-y-1 ml-4">
                <li>• Exploring more affordable nearby cities</li>
                <li>• Increasing your income through career advancement or side work</li>
                <li>• Paying down existing debts to improve your DTI ratio</li>
                <li>• Saving for a larger down payment (12+ months)</li>
              </ul>
            </div>
          )}

          {/* Quick Comparison Bar */}
          <div className="mt-6">
            <p className="text-xs text-neutral-600 mb-2">Budget vs Market Range</p>
            <div className="relative h-8 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 h-full bg-gradient-to-r from-neutral-400 to-neutral-300"
                style={{ width: '100%' }}
              />
              <div
                className="absolute h-full bg-primary-500"
                style={{
                  left: 0,
                  width: `${Math.min((maxHomePrice / municipality.avgHomePrice) * 100, 100)}%`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3 text-xs text-white font-medium">
                <span>{formatCompactCurrency(municipality.minRealisticPrice)}</span>
                <span>{formatCompactCurrency(municipality.avgHomePrice)}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Min</span>
              <span>Average</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for compact currency formatting
function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}
