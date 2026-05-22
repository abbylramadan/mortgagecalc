import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCalculatorStore } from '../../store/calculatorStore';
import { calculateMaxAffordableHome } from '../../utils/calculations/affordability';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';
import { MonthlyPaymentCard } from './MonthlyPaymentCard';
import { BreakdownChart } from './BreakdownChart';
import { BudgetBreakdownChart } from './BudgetBreakdownChart';
import { MarketComparisonCard } from './MarketComparisonCard';
import { PropertyRecommendations } from './PropertyRecommendations';
import { getMunicipalityById } from '../../data/municipalities';
import { fetchMarketData, marketDataToMunicipality } from '../../services/marketDataService';
import type { UserInputs, CalculationResults, Municipality } from '../../types/calculator';

export function AffordabilityResults() {
  const navigate = useNavigate();
  const { inputs, setResults, reset, setFreeNavigation } = useCalculatorStore();
  const [results, setLocalResults] = useState<CalculationResults | null>(null);
  const [municipality, setMunicipality] = useState<Municipality | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [housingRatio, setHousingRatio] = useState(0.28);

  useEffect(() => {
    const calculateResults = async () => {
      try {
        let municipalityData: Municipality | undefined;

        if (inputs.zipCode) {
          const marketData = await fetchMarketData(inputs.zipCode);
          municipalityData = marketDataToMunicipality(marketData);
        } else {
          municipalityData = getMunicipalityById(inputs.municipalityId!);
        }

        if (!municipalityData) {
          throw new Error('Unable to load market data for this location');
        }

        setMunicipality(municipalityData);

        const calculatedResults = await calculateMaxAffordableHome(
          inputs as UserInputs,
          { maxHousingRatio: housingRatio }
        );
        setLocalResults(calculatedResults);
        setResults(calculatedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during calculation');
        console.error('Calculation error:', err);
      }
    };

    calculateResults();
  }, [inputs, setResults, housingRatio]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-error mb-4">Calculation Error</h2>
              <p className="text-neutral-600 mb-6">{error}</p>
              <Button onClick={() => navigate('/step/1')}>Start Over</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Calculating your affordability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            You can afford up to
          </h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-bold text-primary-600 mb-6"
          >
            {formatCurrency(results.maxHomePrice)}
          </motion.p>
          <p className="text-xl text-neutral-600">
            Based on your financial profile with a {results.loanTerm}-year <span className="font-semibold text-primary-700">{results.loanType} loan</span> at{' '}
            {formatPercent(results.interestRate)} interest
          </p>
        </motion.div>

        {/* Housing budget tuner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12"
        >
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Max housing as % of gross income
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Lenders allow up to ~43%, but most planners recommend 28% or less. Drag to recalculate.
                  </p>
                </div>
                <div className="text-3xl font-bold text-primary-600 tabular-nums">
                  {Math.round(housingRatio * 100)}%
                </div>
              </div>
              <input
                type="range"
                min={15}
                max={43}
                step={1}
                value={Math.round(housingRatio * 100)}
                onChange={(e) => setHousingRatio(Number(e.target.value) / 100)}
                className="w-full accent-primary-600"
                aria-label="Maximum housing percentage of gross income"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>15% (conservative)</span>
                <span>28% (recommended)</span>
                <span>43% (lender max)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-sm text-neutral-600 mb-2">Max Loan Amount</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {formatCurrency(results.maxLoanAmount)}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-sm text-neutral-600 mb-2">Estimated Home Size</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {formatNumber(results.estimatedSqft)} sqft
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-sm text-neutral-600 mb-2">Debt-to-Income Ratio</p>
                <p className={`text-3xl font-bold ${
                  results.debtToIncomeRatio <= 0.36 ? 'text-success' : 'text-warning'
                }`}>
                  {formatPercent(results.debtToIncomeRatio)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Market Comparison */}
        {municipality && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <MarketComparisonCard
              maxHomePrice={results.maxHomePrice}
              municipality={municipality}
            />
          </motion.div>
        )}

        {/* Property Recommendations */}
        {inputs.zipCode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }} className="mt-8">
            <PropertyRecommendations
              zipCode={inputs.zipCode}
              maxPrice={results.maxHomePrice}
            />
          </motion.div>
        )}

        {/* Monthly Payment Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-8">
          <MonthlyPaymentCard payment={results.estimatedMonthlyPayment} />
        </motion.div>

        {/* Payment Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <BreakdownChart payment={results.estimatedMonthlyPayment} />
        </motion.div>

        {/* Monthly Budget Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-8"
        >
          <BudgetBreakdownChart
            monthlyNetIncome={results.monthlyNetIncome}
            monthlyGrossIncome={(inputs.annualIncome || 0) / 12}
            housingCosts={results.estimatedMonthlyPayment.total + results.estimatedMonthlyPayment.utilities.total}
            monthlyDebts={(inputs.monthlyDebts?.carLoans || 0) + (inputs.monthlyDebts?.studentLoans || 0) + (inputs.monthlyDebts?.creditCards || 0) + (inputs.monthlyDebts?.other || 0)}
            foodExpenses={inputs.monthlyFoodExpenses || 0}
            funExpenses={inputs.monthlyFunExpenses || 0}
            monthlySavings={(inputs.monthlySavings?.retirement401k || 0) + (inputs.monthlySavings?.hsa || 0) + (inputs.monthlySavings?.healthcare || 0) + (inputs.monthlySavings?.other || 0)}
            disposableIncome={results.monthlyDisposableIncome}
          />
        </motion.div>

        {/* Recommendations */}
        {results.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <p className="text-neutral-700">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Warnings */}
        {results.warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-warning">Important Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 text-warning text-xl">⚠</span>
                      <p className="text-neutral-700">{warning}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex justify-center gap-4"
        >
          <Button
            variant="outline"
            onClick={() => {
              setFreeNavigation(true);
              navigate('/step/1');
            }}
          >
            Adjust Inputs
          </Button>
          <Button
            onClick={() => {
              reset();
              navigate('/');
            }}
          >
            Start New Calculation
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
