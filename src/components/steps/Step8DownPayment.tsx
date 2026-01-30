import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

export function Step8DownPayment() {
  const { inputs, updateInput } = useCalculatorStore();
  const [value, setValue] = useState(
    inputs.downPaymentAmount ? formatCurrency(inputs.downPaymentAmount) : ''
  );
  const [error, setError] = useState('');

  useEffect(() => {
    // Auto-focus on mount
    const input = document.querySelector('input');
    input?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    const numericValue = parseCurrency(inputValue) || 0;

    if (numericValue === 0) {
      setError('');
      updateInput('downPaymentAmount', 0);
    } else if (numericValue < 1000) {
      setError('Down payment should be at least $1,000');
      updateInput('downPaymentAmount', numericValue);
    } else {
      setError('');
      updateInput('downPaymentAmount', numericValue);
    }
  };

  const handleBlur = () => {
    if (inputs.downPaymentAmount && inputs.downPaymentAmount > 0) {
      setValue(formatCurrency(inputs.downPaymentAmount));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            How much can you put down?
          </h2>
          <p className="text-neutral-600">
            Your down payment amount in dollars. Larger down payments mean lower monthly payments
            and potentially no mortgage insurance.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="$40,000"
            prefix="$"
            error={error}
            helpText="Enter the amount you plan to put down"
            className="text-center text-2xl font-semibold"
          />

          <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
            <p className="text-sm text-neutral-700 font-semibold mb-2">Down payment guidelines:</p>
            <div className="space-y-1 text-xs text-neutral-600">
              <p>• FHA: Minimum 3.5% (requires mortgage insurance)</p>
              <p>• Conventional: Minimum 5% (PMI if &lt; 20%)</p>
              <p>• 20%+: No mortgage insurance required</p>
              <p>• Remember: Keep some savings for emergencies!</p>
            </div>
          </div>

          {inputs.downPaymentAmount && inputs.downPaymentAmount > 0 && !error && (
            <div className="mt-4 p-4 bg-success-light rounded-lg">
              <p className="text-sm text-success-dark">
                On a $300,000 home, this would be{' '}
                {((inputs.downPaymentAmount / 300000) * 100).toFixed(1)}% down
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
