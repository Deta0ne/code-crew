// Form stepper component
'use client';

import { cn } from '@/lib/utils';
import type { FormStep } from './types';

interface FormStepperProps {
    currentStep: FormStep;
    completedSteps: FormStep[];
    stepLabels: Record<FormStep, string>;
    progress: number;
    onStepClick?: (step: FormStep) => void;
}

export function FormStepper({ currentStep, completedSteps, stepLabels, progress, onStepClick }: FormStepperProps) {
    const steps: FormStep[] = [1, 2, 3, 4];

    return (
        <div className="w-full">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
                <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between">
                {steps.map((step) => {
                    const isActive = currentStep === step;
                    const isCompleted = completedSteps.includes(step);
                    const isClickable = onStepClick && (isCompleted || step <= currentStep);

                    return (
                        <div
                            key={step}
                            className={cn(
                                'flex flex-col items-center cursor-pointer group',
                                !isClickable && 'cursor-default',
                            )}
                            onClick={() => isClickable && onStepClick(step)}
                        >
                            {/* Step circle */}
                            <div
                                className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                                    isCompleted && 'bg-green-500 text-white',
                                    isActive && !isCompleted && 'bg-blue-500 text-white ring-4 ring-blue-100',
                                    !isActive && !isCompleted && 'bg-gray-200 text-gray-500',
                                    isClickable && 'group-hover:scale-110',
                                )}
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    step
                                )}
                            </div>

                            {/* Step label */}
                            <div
                                className={cn(
                                    'mt-2 text-xs font-medium text-center transition-colors duration-200',
                                    isActive && 'text-blue-600',
                                    isCompleted && 'text-green-600',
                                    !isActive && !isCompleted && 'text-gray-500',
                                    isClickable && 'group-hover:text-blue-600',
                                )}
                            >
                                {stepLabels[step]}
                            </div>

                            {/* Step connector line */}
                            {step < 4 && (
                                <div
                                    className={cn(
                                        'absolute top-4 left-1/2 w-full h-0.5 -z-10 transition-colors duration-200',
                                        step < currentStep ? 'bg-green-500' : 'bg-gray-200',
                                    )}
                                    style={{
                                        left: `${(step - 1) * 33.33 + 16.665}%`,
                                        width: '33.33%',
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
