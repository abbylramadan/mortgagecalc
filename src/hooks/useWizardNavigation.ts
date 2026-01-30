import { useNavigate } from 'react-router-dom';
import { useCalculatorStore } from '../store/calculatorStore';

export function useWizardNavigation() {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, canProceed } = useCalculatorStore();

  const goNext = () => {
    if (canProceed()) {
      const nextStep = currentStep + 1;
      if (nextStep <= 9) {
        setCurrentStep(nextStep);
        navigate(`/step/${nextStep}`);
      } else {
        // Go to results page
        navigate('/results');
      }
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      navigate(`/step/${prevStep}`);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 9) {
      setCurrentStep(step);
      navigate(`/step/${step}`);
    }
  };

  return {
    goNext,
    goBack,
    goToStep,
    canGoNext: canProceed(),
    canGoBack: currentStep > 1,
    currentStep,
    totalSteps: 9,
  };
}
