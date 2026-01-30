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
import { getMunicipalityById } from '../../data/municipalities';
import type { UserInputs, CalculationResults } from '../../types/calculator';

export function AffordabilityResults() {
  const navigate = useNavigate();
  const { inputs, setResults, reset } = useCalculatorStore();
  const [results, setLocalResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Calculate results
      const calculatedResults = calculateMaxAffordableHome(inputs as UserInputs);
      setLocalResults(calculatedResults);
      setResults(calculatedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
      console.error('Calculation error:', err);
    }
  }, [inputs, setResults]);

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
            Based on your financial profile and a {results.loanTerm}-year loan at{' '}
            {formatPercent(results.interestRate)} interest
          </p>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <MarketComparisonCard
            maxHomePrice={results.maxHomePrice}
            municipality={getMunicipalityById(inputs.municipalityId!)!}
          />
        </motion.div>

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
            housingCosts={results.estimatedMonthlyPayment.total + results.estimatedMonthlyPayment.utilities.total}
            monthlyDebts={(inputs.monthlyDebts?.carLoans || 0) + (inputs.monthlyDebts?.studentLoans || 0) + (inputs.monthlyDebts?.creditCards || 0) + (inputs.monthlyDebts?.other || 0)}
            foodExpenses={inputs.monthlyFoodExpenses || 0}
            funExpenses={inputs.monthlyFunExpenses || 0}
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
          <Button variant="outline" onClick={() => navigate('/step/1')}>
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
