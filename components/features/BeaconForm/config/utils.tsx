import React from 'react';
import { Briefcase, GraduationCap, Code, BookOpen, Lightbulb, Trophy, FileText } from 'lucide-react';

export const getProjectTypeIcon = (type: string) => {
    switch (type) {
        case 'learning':
            return <GraduationCap className="w-5 h-5" />;
        case 'portfolio':
            return <Briefcase className="w-5 h-5" />;
        case 'open_source':
            return <Code className="w-5 h-5" />;
        case 'tutorial':
            return <BookOpen className="w-5 h-5" />;
        case 'hackathon':
            return <Trophy className="w-5 h-5" />;
        case 'research':
            return <FileText className="w-5 h-5" />;
        default:
            return <Lightbulb className="w-5 h-5" />;
    }
};

export const getProjectTypeLabel = (type: string) => {
    switch (type) {
        case 'learning':
            return 'Learning Project';
        case 'portfolio':
            return 'Portfolio Project';
        case 'open_source':
            return 'Open Source Project';
        case 'tutorial':
            return 'Tutorial Project';
        case 'hackathon':
            return 'Hackathon Project';
        case 'research':
            return 'Research Project';
        default:
            return 'Unknown Project';
    }
};

export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'easy':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'intermediate':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'advanced':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

// Beacon Details Dialog
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const getInitials = (name: string | null, username: string) => {
    if (name) {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
    return username.slice(0, 2).toUpperCase();
};

export const getDifficultyLevel = (difficulty: string) => {
    switch (difficulty) {
        case 'easy':
            return 'Beginner';
        case 'intermediate':
            return 'Intermediate';
        case 'advanced':
            return 'Advanced';
        default:
            return difficulty;
    }
};

export const getTypeSpecificInfo = (projectType: string, typeSpecificData: Record<string, unknown>) => {
    if (!typeSpecificData || Object.keys(typeSpecificData).length === 0) return null;

    switch (projectType) {
        case 'learning':
            return {
                title: 'Learning Details',
                fields: [
                    {
                        label: 'Timeline',
                        value: typeSpecificData.timeline_weeks ? `${typeSpecificData.timeline_weeks} weeks` : null,
                    },
                    {
                        label: 'Learning Goals',
                        value: Array.isArray(typeSpecificData.learning_goals) ? typeSpecificData.learning_goals : null,
                    },
                    {
                        label: 'Technologies to Learn',
                        value: Array.isArray(typeSpecificData.technologies_to_learn)
                            ? typeSpecificData.technologies_to_learn
                            : null,
                    },
                    {
                        label: 'Resources Provided',
                        value: Array.isArray(typeSpecificData.resources_provided)
                            ? typeSpecificData.resources_provided
                            : null,
                    },
                ],
            };
        case 'hackathon':
            return {
                title: 'Hackathon Details',
                fields: [
                    { label: 'Hackathon Name', value: typeSpecificData.hackathon_name },
                    {
                        label: 'Deadline',
                        value: typeSpecificData.deadline
                            ? new Date(typeSpecificData.deadline as string).toLocaleDateString()
                            : null,
                    },
                    {
                        label: 'Prize Pool',
                        value: Array.isArray(typeSpecificData.prize_pool) ? typeSpecificData.prize_pool : null,
                    },
                    {
                        label: 'Rules',
                        value: Array.isArray(typeSpecificData.rules) ? typeSpecificData.rules : null,
                    },
                    {
                        label: 'Submission Requirements',
                        value: Array.isArray(typeSpecificData.submission_requirements)
                            ? typeSpecificData.submission_requirements
                            : null,
                    },
                ],
            };
        case 'open_source':
            return {
                title: 'Open Source Details',
                fields: [
                    { label: 'License Type', value: typeSpecificData.license_type },
                    {
                        label: 'Community Goals',
                        value: Array.isArray(typeSpecificData.community_goals)
                            ? typeSpecificData.community_goals
                            : null,
                    },
                    {
                        label: 'Contribution Guidelines',
                        value: Array.isArray(typeSpecificData.contribution_guidelines)
                            ? typeSpecificData.contribution_guidelines
                            : null,
                    },
                    {
                        label: 'Documentation Standards',
                        value: Array.isArray(typeSpecificData.documentation_standards)
                            ? typeSpecificData.documentation_standards
                            : null,
                    },
                ],
            };
        case 'research':
            return {
                title: 'Research Details',
                fields: [
                    { label: 'Research Area', value: typeSpecificData.research_area },
                    {
                        label: 'Methodology',
                        value: Array.isArray(typeSpecificData.methodology) ? typeSpecificData.methodology : null,
                    },
                    {
                        label: 'Expected Outcomes',
                        value: Array.isArray(typeSpecificData.expected_outcomes)
                            ? typeSpecificData.expected_outcomes
                            : null,
                    },
                    {
                        label: 'Publication Plan',
                        value: Array.isArray(typeSpecificData.publication_plan)
                            ? typeSpecificData.publication_plan
                            : null,
                    },
                ],
            };
        case 'tutorial':
            return {
                title: 'Tutorial Details',
                fields: [
                    { label: 'Target Audience', value: typeSpecificData.target_audience },
                    {
                        label: 'Prerequisites',
                        value: Array.isArray(typeSpecificData.prerequisites) ? typeSpecificData.prerequisites : null,
                    },
                    {
                        label: 'Content Outline',
                        value: Array.isArray(typeSpecificData.content_outline)
                            ? typeSpecificData.content_outline
                            : null,
                    },
                    {
                        label: 'Learning Outcomes',
                        value: Array.isArray(typeSpecificData.learning_outcomes)
                            ? typeSpecificData.learning_outcomes
                            : null,
                    },
                ],
            };
        case 'portfolio':
            return {
                title: 'Portfolio Details',
                fields: [
                    { label: 'Portfolio Type', value: typeSpecificData.portfolio_type },
                    {
                        label: 'Showcase Goals',
                        value: Array.isArray(typeSpecificData.showcase_goals) ? typeSpecificData.showcase_goals : null,
                    },
                    {
                        label: 'Target Companies',
                        value: Array.isArray(typeSpecificData.target_companies)
                            ? typeSpecificData.target_companies
                            : null,
                    },
                    {
                        label: 'Skills to Highlight',
                        value: Array.isArray(typeSpecificData.skills_to_highlight)
                            ? typeSpecificData.skills_to_highlight
                            : null,
                    },
                ],
            };
        default:
            return null;
    }
};

export const renderFieldValue = (value: unknown) => {
    if (!value) return null;

    if (Array.isArray(value)) {
        return (
            <div className="space-y-1">
                {value.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                        <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
                        <span>{String(item)}</span>
                    </div>
                ))}
            </div>
        );
    }

    return <span className="text-sm text-gray-600">{String(value)}</span>;
};
