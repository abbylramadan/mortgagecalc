import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useCalculatorStore } from '../../store/calculatorStore';
import { loanTypes } from '../../data/loanTypes';
import { CheckIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export function Step9LoanType() {
  const { inputs, updateInput } = useCalculatorStore();

  useEffect(() => {
    // Auto-focus first button on mount
    const button = document.querySelector('button');
    button?.focus();
  }, []);

  // Filter to show FHA and Conventional primarily
  const primaryLoanTypes = loanTypes.filter(
    (lt) => lt.type === 'FHA' || lt.type === 'Conventional'
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
          What type of loan do you prefer?
        </h2>
        <p className="text-neutral-600">
          Different loan types have different requirements and benefits. Choose the one that fits
          your situation best.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {primaryLoanTypes.map((loanType) => {
          const isSelected = inputs.preferredLoanType === loanType.type;

          return (
            <motion.button
              key={loanType.type}
              onClick={() => updateInput('preferredLoanType', loanType.type)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                text-left transition-all duration-200
                ${
                  isSelected
                    ? 'ring-2 ring-primary-500 shadow-lg'
                    : 'ring-1 ring-neutral-200 hover:ring-primary-300'
                }
              `}
            >
              <Card hover={false}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{loanType.name}</CardTitle>
                      <p className="text-sm text-neutral-600 mt-1">{loanType.description}</p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-neutral-500">Min. Down Payment</p>
                        <p className="font-semibold">{loanType.minDownPaymentPercent}%</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Min. FICO</p>
                        <p className="font-semibold">{loanType.minFicoScore}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-success-dark mb-1">Pros:</p>
                      <ul className="text-xs text-neutral-600 space-y-1">
                        {loanType.pros.slice(0, 2).map((pro, idx) => (
                          <li key={idx}>✓ {pro}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-error-dark mb-1">Cons:</p>
                      <ul className="text-xs text-neutral-600 space-y-1">
                        {loanType.cons.slice(0, 2).map((con, idx) => (
                          <li key={idx}>✗ {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          );
        })}
      </div>

      {inputs.preferredLoanType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-primary-50 rounded-lg text-center"
        >
          <p className="text-sm text-primary-900">
            <span className="font-semibold">Selected: </span>
            {loanTypes.find((lt) => lt.type === inputs.preferredLoanType)?.name}
          </p>
        </motion.div>
      )}

      <div className="mt-6 p-4 bg-neutral-100 rounded-lg text-center">
        <p className="text-xs text-neutral-600">
          Note: VA and USDA loans are also available if you qualify. These have additional specific
          eligibility requirements.
        </p>
      </div>
    </div>
  );
}
