'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { projectTypes } from './config/project-types';
import { ProjectType } from './types';

interface TypeSelectionProps {
    selectedType: ProjectType | null;
    onTypeSelect: (type: ProjectType) => void;
}

export function TypeSelection({ selectedType, onTypeSelect }: TypeSelectionProps) {
    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Choose Your Beacon Type</h2>
                <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Select the type that best describes your project vision. This helps us tailor the experience and
                    connect you with the right collaborators.
                </p>
            </div>

            {/* Project Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectTypes.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedType === option.type;

                    return (
                        <button
                            key={option.type}
                            onClick={() => onTypeSelect(option.type)}
                            className={cn(
                                // Base styles
                                'group relative p-6 text-left transition-all duration-200 ease-out cursor-pointer',
                                'border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                                'hover:shadow-lg hover:-translate-y-1',

                                // Conditional styles
                                isSelected
                                    ? 'bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-200'
                                    : 'bg-white border-gray-200 hover:border-gray-300',
                            )}
                        >
                            {/* Selection Indicator */}
                            <div
                                className={cn(
                                    'absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all duration-200',
                                    isSelected
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-gray-300 group-hover:border-gray-400',
                                )}
                            >
                                {isSelected && (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                )}
                            </div>

                            {/* Icon */}
                            <div
                                className={cn(
                                    'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors',
                                    isSelected
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200',
                                )}
                            >
                                <Icon className="w-6 h-6" />
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <div>
                                    <h3
                                        className={cn(
                                            'font-semibold text-lg mb-1 transition-colors',
                                            isSelected ? 'text-blue-900' : 'text-gray-900',
                                        )}
                                    >
                                        {option.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{option.description}</p>
                                </div>

                                {/* Benefits */}
                                <div className="flex flex-wrap gap-2">
                                    {option.benefits.map((benefit) => (
                                        <span
                                            key={benefit}
                                            className={cn(
                                                'px-2.5 py-1 text-xs font-medium rounded-full transition-colors',
                                                isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600',
                                            )}
                                        >
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hover Effect Overlay */}
                            <div
                                className={cn(
                                    'absolute inset-0 rounded-xl transition-opacity',
                                    'bg-gradient-to-r from-blue-50/0 to-blue-50/30 opacity-0 group-hover:opacity-100',
                                    isSelected && 'opacity-50',
                                )}
                            />
                        </button>
                    );
                })}
            </div>

            {/* Selection Summary */}
            {selectedType && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div>
                            <p className="text-blue-900 font-medium text-sm">
                                {projectTypes.find((type) => type.type === selectedType)?.title} Selected
                            </p>
                            <p className="text-blue-700 text-sm mt-1">
                                You can change this selection at any time during the setup process.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TypeSelection;
