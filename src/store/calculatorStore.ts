import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInputs, CalculationResults } from '../types/calculator';

interface CalculatorStore {
  // Current wizard step (1-9)
  currentStep: number;

  // User inputs (partial as they're filled step by step)
  inputs: Partial<UserInputs>;

  // Calculation results (null until calculated)
  results: CalculationResults | null;

  // Actions
  setCurrentStep: (step: number) => void;
  updateInput: <K extends keyof UserInputs>(key: K, value: UserInputs[K]) => void;
  setResults: (results: CalculationResults) => void;
  reset: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canProceed: () => boolean;
}

const initialInputs: Partial<UserInputs> = {
  monthlyDebts: {
    carLoans: 0,
    studentLoans: 0,
    creditCards: 0,
    other: 0,
  },
};

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      inputs: initialInputs,
      results: null,

      setCurrentStep: (step) => set({ currentStep: step }),

      updateInput: (key, value) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            [key]: value,
          },
        })),

      setResults: (results) => set({ results }),

      reset: () =>
        set({
          currentStep: 1,
          inputs: initialInputs,
          results: null,
        }),

      goToNextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 9),
        })),

      goToPreviousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      // Validation logic to determine if user can proceed to next step
      canProceed: () => {
        const { currentStep, inputs } = get();

        switch (currentStep) {
          case 1:
            return !!inputs.annualIncome && inputs.annualIncome > 0;
          case 2:
            return !!inputs.municipalityId;
          case 3:
            return inputs.monthlyDebts !== undefined;
          case 4:
            return !!inputs.ficoScore && inputs.ficoScore >= 300 && inputs.ficoScore <= 850;
          case 5:
            return inputs.monthlyFoodExpenses !== undefined && inputs.monthlyFoodExpenses >= 0;
          case 6:
            return inputs.emergencyFund !== undefined && inputs.emergencyFund >= 0;
          case 7:
            return inputs.monthlyFunExpenses !== undefined && inputs.monthlyFunExpenses >= 0;
          case 8:
            return !!inputs.downPaymentAmount && inputs.downPaymentAmount > 0;
          case 9:
            return !!inputs.preferredLoanType;
          default:
            return false;
        }
      },
    }),
    {
      name: 'mortgage-calculator-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        inputs: state.inputs,
      }),
    }
  )
);
