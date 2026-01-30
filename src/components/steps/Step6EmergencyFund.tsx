import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

export function Step6EmergencyFund() {
  const { inputs, updateInput } = useCalculatorStore();
  const [value, setValue] = useState(
    inputs.emergencyFund ? formatCurrency(inputs.emergencyFund) : ''
  );

  useEffect(() => {
    // Auto-focus on mount
    const input = document.querySelector('input');
    input?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    const numericValue = parseCurrency(inputValue) || 0;
    updateInput('emergencyFund', numericValue);
  };

  const handleBlur = () => {
    if (inputs.emergencyFund && inputs.emergencyFund > 0) {
      setValue(formatCurrency(inputs.emergencyFund));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            How much do you have in emergency savings?
          </h2>
          <p className="text-neutral-600">
            Financial experts recommend 3-6 months of expenses in savings. We'll factor this into our
            recommendations for your home purchase.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="$10,000"
            prefix="$"
            helpText="Current emergency fund balance"
            className="text-center text-2xl font-semibold"
          />

          <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
            <p className="text-sm text-neutral-700 font-semibold mb-2">Why this matters:</p>
            <div className="space-y-1 text-xs text-neutral-600">
              <p>• Protects you from unexpected expenses</p>
              <p>• Prevents mortgage default during hardship</p>
              <p>• Recommended: 3-6 months of all expenses</p>
              <p>• Should be separate from your down payment</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
