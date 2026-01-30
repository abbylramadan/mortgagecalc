import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCalculatorStore } from '../../store/calculatorStore';

export function Step4FicoScore() {
  const { inputs, updateInput } = useCalculatorStore();
  const [value, setValue] = useState(inputs.ficoScore?.toString() || '');
  const [error, setError] = useState('');

  useEffect(() => {
    // Auto-focus on mount
    const input = document.querySelector('input');
    input?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    const numericValue = parseInt(inputValue, 10);

    if (!inputValue) {
      setError('');
      updateInput('ficoScore', 0);
    } else if (isNaN(numericValue) || numericValue < 300) {
      setError('FICO score must be at least 300');
      updateInput('ficoScore', numericValue || 0);
    } else if (numericValue > 850) {
      setError('FICO score cannot exceed 850');
      updateInput('ficoScore', numericValue);
    } else {
      setError('');
      updateInput('ficoScore', numericValue);
    }
  };

  const getCreditRating = (score: number) => {
    if (score >= 740) return { label: 'Excellent', color: 'success' };
    if (score >= 670) return { label: 'Good', color: 'primary' };
    if (score >= 580) return { label: 'Fair', color: 'warning' };
    return { label: 'Poor', color: 'error' };
  };

  const rating = inputs.ficoScore ? getCreditRating(inputs.ficoScore) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            What's your credit score?
          </h2>
          <p className="text-neutral-600">
            Your FICO score affects your interest rate and loan eligibility. Higher scores typically
            get better rates.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Input
            type="number"
            value={value}
            onChange={handleChange}
            placeholder="720"
            error={error}
            helpText="FICO score ranges from 300 to 850"
            className="text-center text-2xl font-semibold"
            min="300"
            max="850"
          />

          {rating && !error && (
            <div className={`mt-6 p-4 bg-${rating.color}-light rounded-lg`}>
              <p className={`text-sm text-${rating.color}-dark`}>
                <span className="font-semibold">Credit rating: </span>
                {rating.label}
              </p>
              <div className="mt-3 space-y-1 text-xs text-neutral-600">
                <p>• 740+: Excellent (best rates)</p>
                <p>• 670-739: Good rates</p>
                <p>• 580-669: Fair rates, FHA eligible</p>
                <p>• Below 580: Limited options</p>
              </div>
            </div>
          )}

          {!inputs.ficoScore && (
            <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
              <p className="text-sm text-neutral-600">
                Don't know your FICO score? You can check it for free at sites like Credit Karma or
                through your bank.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
