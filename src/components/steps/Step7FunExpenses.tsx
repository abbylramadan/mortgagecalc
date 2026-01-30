import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

export function Step7FunExpenses() {
  const { inputs, updateInput } = useCalculatorStore();
  const [value, setValue] = useState(
    inputs.monthlyFunExpenses ? formatCurrency(inputs.monthlyFunExpenses) : ''
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
    updateInput('monthlyFunExpenses', numericValue);
  };

  const handleBlur = () => {
    if (inputs.monthlyFunExpenses && inputs.monthlyFunExpenses > 0) {
      setValue(formatCurrency(inputs.monthlyFunExpenses));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            What do you spend on fun each month?
          </h2>
          <p className="text-neutral-600">
            Entertainment, hobbies, subscriptions, travel. We want to make sure you can still
            enjoy life after buying a home.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="$400"
            prefix="$"
            helpText="Monthly discretionary spending"
            className="text-center text-2xl font-semibold"
          />

          <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
            <p className="text-sm text-neutral-700 font-semibold mb-2">Examples include:</p>
            <div className="space-y-1 text-xs text-neutral-600">
              <p>• Streaming services and subscriptions</p>
              <p>• Entertainment and events</p>
              <p>• Hobbies and activities</p>
              <p>• Shopping and personal care</p>
              <p>• Vacation savings</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
