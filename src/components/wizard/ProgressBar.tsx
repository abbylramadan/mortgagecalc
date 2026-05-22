import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  clickable?: boolean;
  onStepClick?: (step: number) => void;
}

const STEP_LABELS = [
  'Income',
  'Metro',
  'Debts',
  'FICO',
  'Food',
  'Emergency',
  'Fun',
  'Savings',
  'Down payment',
];

export function ProgressBar({ currentStep, totalSteps, clickable = false, onStepClick }: ProgressBarProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-neutral-600">
          {Math.round(progressPercent)}% Complete
        </span>
      </div>

      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {clickable && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isCurrent = step === currentStep;
            const isComplete = step < currentStep;
            return (
              <button
                key={step}
                type="button"
                onClick={() => onStepClick?.(step)}
                className={`group flex flex-col items-center gap-1 flex-1 min-w-[60px] py-1 rounded transition-colors hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                aria-label={`Go to step ${step}: ${STEP_LABELS[step - 1]}`}
              >
                <span
                  className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center border-2 transition-colors ${
                    isCurrent
                      ? 'bg-primary-600 text-white border-primary-600'
                      : isComplete
                      ? 'bg-primary-100 text-primary-700 border-primary-300 group-hover:bg-primary-200'
                      : 'bg-white text-neutral-500 border-neutral-300 group-hover:border-primary-400'
                  }`}
                >
                  {step}
                </span>
                <span className={`text-[10px] leading-tight text-center ${isCurrent ? 'text-primary-700 font-semibold' : 'text-neutral-500'}`}>
                  {STEP_LABELS[step - 1]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
