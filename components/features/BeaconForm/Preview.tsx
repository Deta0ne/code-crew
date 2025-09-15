'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Star, Globe, Clock, Target, GraduationCap, Code } from 'lucide-react';
import type { CompleteProjectForm } from './schemas/common';
import { getProjectTypeIcon, getProjectTypeLabel, getDifficultyColor } from './config/utils';

interface PreviewProps {
    formData: Partial<CompleteProjectForm> & {
        selectedType?: string;
        estimated_duration_weeks?: number;
        required_skills?: string[];
        required_roles?: string[];
    };
}

export function Preview({ formData }: PreviewProps) {
    const {
        selectedType,
        project_type,
        title,
        description,
        category,
        difficulty,
        max_members,
        is_beginner_friendly,
        mentoring_available,
        remote_friendly,
        estimated_duration_weeks,
        required_skills,
        required_roles,
        type_specific_data,
        ...otherData
    } = formData;

    // Use project_type if selectedType is not available
    const currentType = selectedType || project_type;

    // Get type-specific data from the dedicated field or spread from formData
    const typeSpecificData = type_specific_data || otherData;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            {currentType && getProjectTypeIcon(currentType)}
                            <Badge variant="secondary" className="text-xs">
                                {currentType && getProjectTypeLabel(currentType)}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{title || 'Untitled Project'}</h1>
                    </div>
                    {difficulty && (
                        <Badge className={`${getDifficultyColor(difficulty)} border`}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Badge>
                    )}
                </div>

                {description && <p className="text-gray-600 leading-relaxed">{description}</p>}
            </div>

            <Separator />

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category && (
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Category:</span>
                        <span className="text-sm text-gray-600">{category}</span>
                    </div>
                )}

                {max_members && (
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Max Members:</span>
                        <span className="text-sm text-gray-600">{max_members}</span>
                    </div>
                )}

                {estimated_duration_weeks && (
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm text-gray-600">{estimated_duration_weeks} weeks</span>
                    </div>
                )}

                {remote_friendly !== undefined && (
                    <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Remote:</span>
                        <span className="text-sm text-gray-600">{remote_friendly ? 'Friendly' : 'Not Available'}</span>
                    </div>
                )}

                {is_beginner_friendly !== undefined && (
                    <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Beginner Guidance:</span>
                        <span className="text-sm text-gray-600">
                            {is_beginner_friendly ? 'Available' : 'Not Available'}
                        </span>
                    </div>
                )}

                {mentoring_available !== undefined && (
                    <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Mentoring:</span>
                        <span className="text-sm text-gray-600">
                            {mentoring_available ? 'Available' : 'Not Available'}
                        </span>
                    </div>
                )}
            </div>

            {/* Skills and Roles */}
            <div className="space-y-6">
                {required_skills && required_skills.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center space-x-2">
                                <Code className="w-5 h-5 text-blue-600" />
                                <span>Required Skills</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {required_skills.map((skill: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {required_roles && required_roles.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center space-x-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span>Required Roles</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {required_roles.map((role: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Type-Specific Information */}
            {currentType && Object.keys(typeSpecificData).length > 0 && (
                <>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center space-x-2">
                                {getProjectTypeIcon(currentType)}
                                <span>{getProjectTypeLabel(currentType)} Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(typeSpecificData).map(([key, value]) => {
                                    // Skip empty values, null, undefined, and non-relevant keys
                                    if (
                                        !value ||
                                        value === '' ||
                                        (Array.isArray(value) && value.length === 0) ||
                                        [
                                            'selectedType',
                                            'project_type',
                                            'title',
                                            'description',
                                            'category',
                                            'difficulty',
                                            'max_members',
                                            'is_beginner_friendly',
                                            'mentoring_available',
                                            'remote_friendly',
                                            'estimated_duration_weeks',
                                            'required_skills',
                                            'required_roles',
                                            'tags',
                                            'github_url',
                                            'project_url',
                                            'image_url',
                                        ].includes(key)
                                    ) {
                                        return null;
                                    }

                                    const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

                                    // Handle arrays
                                    if (Array.isArray(value)) {
                                        return (
                                            <div key={key} className="space-y-2">
                                                <h4 className="font-medium text-gray-900">{displayKey}</h4>
                                                <div className="space-y-1">
                                                    {value.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="text-sm text-gray-600 pl-4 border-l-2 border-gray-200"
                                                        >
                                                            {typeof item === 'object'
                                                                ? JSON.stringify(item)
                                                                : String(item)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Handle objects
                                    if (typeof value === 'object' && value !== null) {
                                        return (
                                            <div key={key} className="space-y-2">
                                                <h4 className="font-medium text-gray-900">{displayKey}</h4>
                                                <div className="space-y-1 pl-4 border-l-2 border-gray-200">
                                                    {Object.entries(value as Record<string, unknown>).map(
                                                        ([subKey, subValue]) => (
                                                            <div key={subKey} className="text-sm">
                                                                <span className="font-medium text-gray-700">
                                                                    {subKey.replace(/_/g, ' ')}:
                                                                </span>
                                                                <span className="text-gray-600 ml-2">
                                                                    {String(subValue)}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Handle primitive values
                                    return (
                                        <div key={key} className="space-y-1">
                                            <h4 className="font-medium text-gray-900">{displayKey}</h4>
                                            <p className="text-sm text-gray-600">{String(value)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Footer Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Preview Mode:</strong> This is how your project will appear to other users. Review all
                    details carefully before submitting.
                </p>
            </div>
        </div>
    );
}

export default Preview;
