import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

export function Step1Income() {
  const { inputs, updateInput } = useCalculatorStore();
  const [inputValue, setInputValue] = useState(
    inputs.annualIncome ? formatCurrency(inputs.annualIncome) : ''
  );
  const [error, setError] = useState('');

  useEffect(() => {
    // Auto-focus on mount
    const input = document.querySelector('input');
    input?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Parse and validate
    const numericValue = parseCurrency(value);

    if (!value) {
      setError('');
      updateInput('annualIncome', 0);
    } else if (numericValue < 1000) {
      setError('Annual income must be at least $1,000');
      updateInput('annualIncome', numericValue);
    } else if (numericValue > 10000000) {
      setError('Income seems unrealistic. Please verify.');
      updateInput('annualIncome', numericValue);
    } else {
      setError('');
      updateInput('annualIncome', numericValue);
    }
  };

  const handleBlur = () => {
    // Format on blur
    if (inputs.annualIncome && inputs.annualIncome > 0) {
      setInputValue(formatCurrency(inputs.annualIncome));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            What's your annual income?
          </h2>
          <p className="text-neutral-600">
            This helps us estimate your after-tax income and calculate how much you can afford.
            Include all pretax income sources.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="$75,000"
            prefix="$"
            error={error}
            helpText="Enter your total annual income before taxes"
            className="text-center text-2xl font-semibold"
          />

          {inputs.annualIncome && inputs.annualIncome > 0 && !error && (
            <div className="mt-6 p-4 bg-success-light rounded-lg">
              <p className="text-sm text-success-dark">
                <span className="font-semibold">Monthly gross income: </span>
                {formatCurrency(inputs.annualIncome / 12)}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
