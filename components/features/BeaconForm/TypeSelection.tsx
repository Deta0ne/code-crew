// Type selection component
'use client';

import { cn } from '@/lib/utils';
import type { ProjectType, TypeSelectionProps } from './types';

// Type definitions with icons and descriptions
const PROJECT_TYPES: Array<{
    type: ProjectType;
    title: string;
    description: string;
    icon: string;
    color: string;
    features: string[];
}> = [
    {
        type: 'learning',
        title: 'Learning Project',
        description: 'Educational projects focused on skill development and knowledge sharing',
        icon: '🎓',
        color: 'from-blue-500 to-blue-600',
        features: ['Skill building', 'Mentorship', 'Learning goals', 'Resource sharing'],
    },
    {
        type: 'portfolio',
        title: 'Portfolio Project',
        description: 'Showcase projects to demonstrate skills and attract opportunities',
        icon: '💼',
        color: 'from-green-500 to-green-600',
        features: ['Professional showcase', 'Career focused', 'Demo ready', 'Industry relevant'],
    },
    {
        type: 'open_source',
        title: 'Open Source',
        description: 'Community-driven projects contributing to the open source ecosystem',
        icon: '🌟',
        color: 'from-purple-500 to-purple-600',
        features: ['Public repository', 'Community driven', 'Open collaboration', 'Documentation'],
    },
    {
        type: 'hackathon',
        title: 'Hackathon Project',
        description: 'Time-bound competitive projects with specific deadlines and goals',
        icon: '⚡',
        color: 'from-orange-500 to-orange-600',
        features: ['Time constrained', 'Competition ready', 'Rapid development', 'Innovation focused'],
    },
    {
        type: 'tutorial',
        title: 'Tutorial Project',
        description: 'Step-by-step educational content and guided learning experiences',
        icon: '📚',
        color: 'from-indigo-500 to-indigo-600',
        features: ['Educational content', 'Structured learning', 'Step-by-step guide', 'Teaching focused'],
    },
    {
        type: 'research',
        title: 'Research Project',
        description: 'Academic or experimental projects exploring new ideas and concepts',
        icon: '🔬',
        color: 'from-pink-500 to-pink-600',
        features: ['Academic focus', 'Experimental', 'Research methodology', 'Knowledge discovery'],
    },
];

export function TypeSelection({ selectedType, onTypeSelect }: TypeSelectionProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Project Type</h2>
                <p className="text-gray-600">
                    Select the type that best describes your project. This will customize the form for your specific
                    needs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECT_TYPES.map((projectType) => (
                    <button
                        key={projectType.type}
                        onClick={() => onTypeSelect(projectType.type)}
                        className={cn(
                            'relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
                            selectedType === projectType.type
                                ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                                : 'border-gray-200 bg-white hover:border-gray-300',
                        )}
                    >
                        {/* Selection indicator */}
                        {selectedType === projectType.type && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        )}

                        {/* Icon with gradient background */}
                        <div
                            className={cn(
                                'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-2xl mb-4',
                                projectType.color,
                            )}
                        >
                            {projectType.icon}
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">{projectType.title}</h3>

                            <p className="text-sm text-gray-600 leading-relaxed">{projectType.description}</p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2">
                                {projectType.features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className={cn(
                                            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                                            selectedType === projectType.type
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-700',
                                        )}
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {selectedType && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-medium text-blue-900">
                                {PROJECT_TYPES.find((pt) => pt.type === selectedType)?.title} Selected
                            </h4>
                            <p className="text-sm text-blue-700">
                                The form will be customized for this project type in the next steps.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
