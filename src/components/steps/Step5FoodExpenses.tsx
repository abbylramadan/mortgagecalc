import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

export function Step5FoodExpenses() {
  const { inputs, updateInput } = useCalculatorStore();
  const [value, setValue] = useState(
    inputs.monthlyFoodExpenses ? formatCurrency(inputs.monthlyFoodExpenses) : ''
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
    updateInput('monthlyFoodExpenses', numericValue);
  };

  const handleBlur = () => {
    if (inputs.monthlyFoodExpenses && inputs.monthlyFoodExpenses > 0) {
      setValue(formatCurrency(inputs.monthlyFoodExpenses));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            What do you spend on food monthly?
          </h2>
          <p className="text-neutral-600">
            Include groceries and dining out. This helps us calculate how much disposable income
            you'll have after all expenses.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="$600"
            prefix="$"
            helpText="Average monthly spending on food"
            className="text-center text-2xl font-semibold"
          />

          <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
            <p className="text-sm text-neutral-700 font-semibold mb-2">Typical ranges:</p>
            <div className="space-y-1 text-xs text-neutral-600">
              <p>• Single person: $300-500/month</p>
              <p>• Couple: $500-800/month</p>
              <p>• Family of 4: $800-1,200/month</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
