'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStepperProps {
    currentStep: number;
    completedSteps: number[];
    stepLabels: Record<number, string>;
    progress: number;
    onStepClick?: (step: number) => void;
}

export function FormStepper({ currentStep, completedSteps, stepLabels, progress, onStepClick }: FormStepperProps) {
    const stepNumbers = Object.keys(stepLabels).map(Number).sort();

    return (
        <div className="w-full p-2">
            {/* Progress Bar */}
            <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" />
                <div
                    className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />

                {/* Step Indicators */}
                <div className="relative flex justify-between">
                    {stepNumbers.map((stepNumber) => {
                        const label = stepLabels[stepNumber];
                        const isCompleted = completedSteps.includes(stepNumber);
                        const isCurrent = currentStep === stepNumber;
                        const isClickable = onStepClick && (isCompleted || stepNumber <= currentStep);

                        return (
                            <div key={stepNumber} className="flex flex-col items-center">
                                {/* Step Circle */}
                                <button
                                    onClick={() => (isClickable ? onStepClick(stepNumber) : undefined)}
                                    disabled={!isClickable}
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                                        'border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',

                                        // Completed state
                                        isCompleted && 'bg-blue-600 border-blue-600 text-white shadow-sm',

                                        // Current state
                                        isCurrent &&
                                            !isCompleted &&
                                            'bg-white border-blue-600 text-blue-600 shadow-sm ring-4 ring-blue-50',

                                        // Future state
                                        !isCompleted && !isCurrent && 'bg-white border-gray-300 text-gray-400',

                                        // Hover states
                                        isClickable && 'hover:shadow-md hover:scale-105 cursor-pointer',
                                        !isClickable && 'cursor-default',
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" strokeWidth={2.5} />
                                    ) : (
                                        <span className="text-sm font-semibold">{stepNumber}</span>
                                    )}
                                </button>

                                {/* Step Label */}
                                <div className="mt-3 text-center min-w-0">
                                    <span
                                        className={cn(
                                            'text-sm font-medium transition-colors',
                                            isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500',
                                        )}
                                    >
                                        {label}
                                    </span>

                                    {/* Step Status Indicator */}
                                    {isCurrent && (
                                        <div className="mt-1">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mx-auto" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default FormStepper;
