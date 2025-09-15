'use client';

import React from 'react';
import { ProjectType } from './types';
import {
    LearningFields,
    PortfolioFields,
    OpenSourceFields,
    HackathonFields,
    TutorialFields,
    ResearchFields,
} from './type-fields';
import { Preview } from './Preview';
import { Badge } from '@/components/ui/badge';
import type { CompleteProjectForm } from './schemas/common';

interface TypeSpecificFieldsProps {
    type: ProjectType | 'preview';
    formData: Record<string, unknown>;
    onUpdate: (data: Record<string, unknown>) => void;
}

export function TypeSpecificFields({ type, formData, onUpdate }: TypeSpecificFieldsProps) {
    // Handle preview mode
    if (type === 'preview') {
        return <Preview formData={formData as Partial<CompleteProjectForm>} />;
    }

    // Get the appropriate fields component based on project type
    const FieldsComponent = {
        learning: LearningFields,
        portfolio: PortfolioFields,
        open_source: OpenSourceFields,
        hackathon: HackathonFields,
        tutorial: TutorialFields,
        research: ResearchFields,
    }[type];

    // Get the type-specific title and description
    const typeInfo = {
        learning: {
            title: 'Learning Project Details',
            description: 'Define your learning objectives and project structure',
        },
        portfolio: {
            title: 'Portfolio Project Details',
            description: 'Showcase your skills and project requirements',
        },
        open_source: {
            title: 'Open Source Project Details',
            description: 'Set contribution guidelines and project standards',
        },
        hackathon: {
            title: 'Hackathon Project Details',
            description: 'Define competition rules and submission requirements',
        },
        tutorial: {
            title: 'Tutorial Project Details',
            description: 'Structure your educational content and learning path',
        },
        research: {
            title: 'Research Project Details',
            description: 'Define research methodology and expected outcomes',
        },
    }[type];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">{typeInfo.title}</h2>
                    <Badge variant="secondary" className="text-xs">
                        {type
                            .split('_')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                    </Badge>
                </div>
                <p className="text-sm text-gray-600">{typeInfo.description}</p>
            </div>

            {/* Type-specific form fields */}
            <FieldsComponent formData={formData} onUpdate={onUpdate} />
        </div>
    );
}

export default TypeSpecificFields;
