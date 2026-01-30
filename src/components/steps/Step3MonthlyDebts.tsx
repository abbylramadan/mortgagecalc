import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

export function Step3MonthlyDebts() {
  const { inputs, updateInput } = useCalculatorStore();
  const [values, setValues] = useState({
    carLoans: inputs.monthlyDebts?.carLoans ? formatCurrency(inputs.monthlyDebts.carLoans) : '',
    studentLoans: inputs.monthlyDebts?.studentLoans ? formatCurrency(inputs.monthlyDebts.studentLoans) : '',
    creditCards: inputs.monthlyDebts?.creditCards ? formatCurrency(inputs.monthlyDebts.creditCards) : '',
    other: inputs.monthlyDebts?.other ? formatCurrency(inputs.monthlyDebts.other) : '',
  });

  useEffect(() => {
    // Auto-focus first input on mount
    const input = document.querySelector('input');
    input?.focus();
  }, []);

  const handleChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));

    const numericValue = parseCurrency(value) || 0;
    updateInput('monthlyDebts', {
      carLoans: inputs.monthlyDebts?.carLoans || 0,
      studentLoans: inputs.monthlyDebts?.studentLoans || 0,
      creditCards: inputs.monthlyDebts?.creditCards || 0,
      other: inputs.monthlyDebts?.other || 0,
      [field]: numericValue,
    });
  };

  const handleBlur = (field: keyof typeof values) => () => {
    const numericValue = inputs.monthlyDebts?.[field as keyof typeof inputs.monthlyDebts] || 0;
    if (numericValue > 0) {
      setValues((prev) => ({ ...prev, [field]: formatCurrency(numericValue) }));
    }
  };

  const totalDebts =
    (inputs.monthlyDebts?.carLoans || 0) +
    (inputs.monthlyDebts?.studentLoans || 0) +
    (inputs.monthlyDebts?.creditCards || 0) +
    (inputs.monthlyDebts?.other || 0);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            What are your monthly debt payments?
          </h2>
          <p className="text-neutral-600">
            Include all recurring monthly payments. This affects your debt-to-income ratio and
            affordability.
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <Input
            type="text"
            value={values.carLoans}
            onChange={handleChange('carLoans')}
            onBlur={handleBlur('carLoans')}
            label="Car Loans"
            placeholder="$0"
            prefix="$"
          />

          <Input
            type="text"
            value={values.studentLoans}
            onChange={handleChange('studentLoans')}
            onBlur={handleBlur('studentLoans')}
            label="Student Loans"
            placeholder="$0"
            prefix="$"
          />

          <Input
            type="text"
            value={values.creditCards}
            onChange={handleChange('creditCards')}
            onBlur={handleBlur('creditCards')}
            label="Credit Cards"
            placeholder="$0"
            prefix="$"
            helpText="Minimum monthly payment"
          />

          <Input
            type="text"
            value={values.other}
            onChange={handleChange('other')}
            onBlur={handleBlur('other')}
            label="Other Debts"
            placeholder="$0"
            prefix="$"
            helpText="Personal loans, child support, etc."
          />

          {totalDebts > 0 && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-900">
                <span className="font-semibold">Total monthly debts: </span>
                {formatCurrency(totalDebts)}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
