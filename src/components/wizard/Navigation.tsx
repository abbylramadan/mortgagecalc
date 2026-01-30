
import { Button } from '../ui/Button';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface NavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep?: boolean;
}

export function Navigation({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLastStep = false,
}: NavigationProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mt-8">
      {canGoBack ? (
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
      ) : (
        <div />
      )}

      <Button
        variant="primary"
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center gap-2"
      >
        {isLastStep ? 'See Results' : 'Continue'}
        {!isLastStep && <ArrowRightIcon className="w-4 h-4" />}
      </Button>
    </div>
  );
}
