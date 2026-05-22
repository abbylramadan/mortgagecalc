import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatCurrency } from '../../utils/formatters';

export function Step8MonthlySavings() {
  const { inputs, updateInput } = useCalculatorStore();
  const [savings401k, setSavings401k] = useState(inputs.monthlySavings?.retirement401k?.toString() || '');
  const [savingsHSA, setSavingsHSA] = useState(inputs.monthlySavings?.hsa?.toString() || '');
  const [savingsHealthcare, setSavingsHealthcare] = useState(inputs.monthlySavings?.healthcare?.toString() || '');
  const [savingsOther, setSavingsOther] = useState(inputs.monthlySavings?.other?.toString() || '');

  useEffect(() => {
    // Auto-focus on mount
    const input = document.querySelector('input');
    input?.focus();
  }, []);

  const handleChange = (
    setter: (value: string) => void,
    field: 'retirement401k' | 'hsa' | 'healthcare' | 'other'
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);

    // Update store
    const current = inputs.monthlySavings || { retirement401k: 0, hsa: 0, healthcare: 0, other: 0 };
    updateInput('monthlySavings', {
      ...current,
      [field]: parseInt(value) || 0,
    });
  };

  const totalSavings = (parseInt(savings401k) || 0) + (parseInt(savingsHSA) || 0) + (parseInt(savingsHealthcare) || 0) + (parseInt(savingsOther) || 0);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            What are your monthly deductions?
          </h2>
          <p className="text-neutral-600">
            Include retirement contributions, healthcare premiums, and HSA - amounts that come out of your paycheck.
            This helps us calculate your true take-home pay.
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              401(k) / Retirement
            </label>
            <Input
              type="text"
              value={savings401k}
              onChange={handleChange(setSavings401k, 'retirement401k')}
              placeholder="0"
              prefix="$"
              helpText="Your monthly contribution only"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Healthcare Premiums
            </label>
            <Input
              type="text"
              value={savingsHealthcare}
              onChange={handleChange(setSavingsHealthcare, 'healthcare')}
              placeholder="0"
              prefix="$"
              helpText="Monthly medical/dental/vision insurance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              HSA (Health Savings Account)
            </label>
            <Input
              type="text"
              value={savingsHSA}
              onChange={handleChange(setSavingsHSA, 'hsa')}
              placeholder="0"
              prefix="$"
              helpText="Monthly HSA contribution"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Other (IRA, brokerage, etc.)
            </label>
            <Input
              type="text"
              value={savingsOther}
              onChange={handleChange(setSavingsOther, 'other')}
              placeholder="0"
              prefix="$"
              helpText="Any other monthly deductions"
            />
          </div>

          {totalSavings > 0 && (
            <div className="mt-6 p-4 bg-success-light rounded-lg">
              <p className="text-sm text-success-dark font-semibold mb-1">
                Total Monthly Savings
              </p>
              <p className="text-2xl font-bold text-success-dark">
                {formatCurrency(totalSavings)}
              </p>
              <p className="text-xs text-success-dark mt-2">
                Great job! This will be factored into your available income for housing.
              </p>
            </div>
          )}

          {totalSavings === 0 && (
            <div className="mt-6 p-4 bg-neutral-100 rounded-lg">
              <p className="text-sm text-neutral-600">
                💡 <span className="font-semibold">Tip:</span> If you don't have retirement savings yet,
                that's okay! Consider starting once you're settled in your new home.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
