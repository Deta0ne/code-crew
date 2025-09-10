import { useCallback } from 'react';
import type { FormStep } from '../types';

interface UseFormNavigationProps {
  currentStep: FormStep;
  canProceed: boolean;
  canGoBack: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  onSaveDraft: () => Promise<void>;
}

export function useFormNavigation({
  currentStep,
  canProceed,
  canGoBack,
  isSubmitting,
  onNext,
  onBack,
  onSubmit,
  onSaveDraft
}: UseFormNavigationProps) {
  
  const handleNext = useCallback(async () => {
    if (!canProceed || isSubmitting) return;
    
    if (currentStep === 4) {
      // Final step - submit the form
      await onSubmit();
    } else {
      // Regular step navigation
      onNext();
    }
  }, [currentStep, canProceed, isSubmitting, onNext, onSubmit]);

  const handleBack = useCallback(() => {
    if (!canGoBack || isSubmitting) return;
    onBack();
  }, [canGoBack, isSubmitting, onBack]);

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting) return;
    await onSaveDraft();
  }, [isSubmitting, onSaveDraft]);

  // Step labels for UI
  const stepLabels: Record<FormStep, string> = {
    1: 'Select Type',
    2: 'Basic Info',
    3: 'Type Details',
    4: 'Preview'
  };

  // Button text based on current step
  const getNextButtonText = () => {
    switch (currentStep) {
      case 1:
        return 'Continue';
      case 2:
        return 'Continue';
      case 3:
        return 'Preview';
      case 4:
        return 'Create Beacon';
      default:
        return 'Continue';
    }
  };

  const getBackButtonText = () => {
    return 'Back';
  };

  const getSaveDraftButtonText = () => {
    return 'Save as Draft';
  };

  // Keyboard navigation
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      // Cmd/Ctrl + Enter to proceed
      event.preventDefault();
      handleNext();
    } else if (event.key === 'Escape') {
      // Escape to go back
      event.preventDefault();
      if (canGoBack) {
        handleBack();
      }
    }
  }, [handleNext, handleBack, canGoBack]);

  return {
    // Actions
    handleNext,
    handleBack,
    handleSaveDraft,
    handleKeyPress,
    
    // UI helpers
    stepLabels,
    getNextButtonText,
    getBackButtonText,
    getSaveDraftButtonText,
    
    // State
    canProceed,
    canGoBack,
    isSubmitting,
    currentStep
  };
}
