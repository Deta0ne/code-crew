'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormNavigationProps {
    currentStep: number;
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
    const nextButtonText = getNextButtonText();
    const backButtonText = getBackButtonText();
    const saveDraftButtonText = getSaveDraftButtonText();

    const isLastStep = currentStep === 4;

    return (
        <div className="border-t border-gray-200 p-2 px-4">
            <div className="flex items-center justify-between">
                {/* Left Side - Back Button */}
                <div className="flex-1">
                    {canGoBack && (
                        <Button
                            onClick={onBack}
                            variant="outline"
                            disabled={isSubmitting}
                            className={cn(
                                'inline-flex items-center py-2 cursor-pointer',
                                'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
                                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                                'transition-all duration-200',
                            )}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="font-medium">{backButtonText}</span>
                        </Button>
                    )}
                </div>

                {/* Center - Save Draft (if dirty and not last step) */}
                <div className="flex-1 flex justify-center">
                    {isDirty && !isLastStep && (
                        <Button
                            onClick={onSaveDraft}
                            variant="ghost"
                            disabled={isSubmitting}
                            className={cn(
                                'inline-flex items-center py-2 cursor-pointer',
                                'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                                'transition-all duration-200',
                            )}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span className="font-medium text-sm">{saveDraftButtonText}</span>
                        </Button>
                    )}
                </div>

                {/* Right Side - Next/Submit Button */}
                <div className="flex-1 flex justify-end">
                    <Button
                        onClick={onNext}
                        disabled={!canProceed || isSubmitting}
                        className={cn(
                            'inline-flex items-center py-2 cursor-pointer',
                            'bg-blue-600 hover:bg-blue-700 text-white',
                            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'shadow-sm hover:shadow-md transition-all duration-200',
                            'font-medium',
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>{nextButtonText}</span>
                                {!isLastStep && <ChevronRight className="w-4 h-4" />}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FormNavigation;
