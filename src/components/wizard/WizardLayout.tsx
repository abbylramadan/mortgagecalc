import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from './ProgressBar';
import { Navigation } from './Navigation';
import { useWizardNavigation } from '../../hooks/useWizardNavigation';
import { useCalculatorStore } from '../../store/calculatorStore';

export function WizardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { goNext, goBack, goToStep, canGoNext, canGoBack, currentStep, totalSteps } = useWizardNavigation();
  const { setCurrentStep, freeNavigation } = useCalculatorStore();

  // Extract step number from pathname (e.g., /step/1 -> 1)
  const pathStep = location.pathname.split('/').pop();
  const stepNumber = parseInt(pathStep || '1', 10);

  // Sync URL with store
  useEffect(() => {
    if (stepNumber >= 1 && stepNumber <= 9 && stepNumber !== currentStep) {
      setCurrentStep(stepNumber);
    }
  }, [stepNumber, currentStep, setCurrentStep]);

  // Redirect to step 1 if on /step without a number
  useEffect(() => {
    if (location.pathname === '/step' || location.pathname === '/step/') {
      navigate('/step/1', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGoNext) {
      goNext();
    } else if (e.key === 'Escape' && canGoBack) {
      goBack();
    }
  };

  const isLastStep = currentStep === totalSteps;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8 px-4"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-neutral-900 mb-2"
          >
            Home Affordability Calculator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-600"
          >
            Find out how much home you can afford
          </motion.p>
        </header>

        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          clickable={freeNavigation}
          onStepClick={goToStep}
        />

        {freeNavigation && (
          <div className="max-w-2xl mx-auto mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/results')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              ← Back to results
            </button>
          </div>
        )}

        {/* Step Content */}
        <div className="grid mb-8">
          <AnimatePresence initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ gridArea: '1 / 1' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <Navigation
          onBack={goBack}
          onNext={goNext}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          isLastStep={isLastStep}
        />

        {/* Keyboard shortcuts hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-neutral-500"
        >
          Tip: Press Enter to continue, Escape to go back
        </motion.div>
      </div>
    </div>
  );
}
