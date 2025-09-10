// Form navigation component
'use client';

import { Button } from '@/components/ui/button';
import type { FormStep } from './types';

interface FormNavigationProps {
    currentStep: FormStep;
    canProceed: boolean;
    canGoBack: boolean;
    isSubmitting: boolean;
    isDirty: boolean;
    onNext: () => void;
    onBack: () => void;
    onSaveDraft: () => void;
    getNextButtonText: () => string;
    getBackButtonText: () => string;
    getSaveDraftButtonText: () => string;
}

export function FormNavigation({
    currentStep,
    canProceed,
    canGoBack,
    isSubmitting,
    isDirty,
    onNext,
    onBack,
    onSaveDraft,
    getNextButtonText,
    getBackButtonText,
    getSaveDraftButtonText,
}: FormNavigationProps) {
    return (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
            {/* Left side - Back button */}
            <div>
                {canGoBack && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="min-w-[100px]"
                    >
                        {getBackButtonText()}
                    </Button>
                )}
            </div>

            {/* Center - Save draft button */}
            <div>
                {isDirty && currentStep > 1 && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onSaveDraft}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        {isSubmitting ? 'Saving...' : getSaveDraftButtonText()}
                    </Button>
                )}
            </div>

            {/* Right side - Next/Submit button */}
            <div>
                <Button type="button" onClick={onNext} disabled={!canProceed || isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? (currentStep === 4 ? 'Creating...' : 'Processing...') : getNextButtonText()}
                </Button>
            </div>
        </div>
    );
}
