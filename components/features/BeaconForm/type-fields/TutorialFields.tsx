'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, BookOpen, Users, Target, GraduationCap } from 'lucide-react';
import { withFieldArray } from './withFieldArray';
import type { TutorialFields as TutorialFieldsType } from '../types';
import type { TutorialFieldsProps } from './types';
import type { ArrayField } from './types';

type Props = TutorialFieldsProps & {
    updateArray: (field: ArrayField<TutorialFieldsType>, value: string[]) => void;
    addItem: (field: ArrayField<TutorialFieldsType>, newItem: string) => void;
    removeItem: (field: ArrayField<TutorialFieldsType>, index: number) => void;
};

function TutorialFieldsBase({ formData, onUpdate, addItem, removeItem }: Props) {
    return (
        <div className="space-y-8">
            {/* Target Audience */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Target Audience</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>
                <Select
                    value={formData.target_audience}
                    onValueChange={(value) =>
                        onUpdate({ target_audience: value as TutorialFieldsType['target_audience'] })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="all_levels">All Levels</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Prerequisites */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Prerequisites</Label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Optional
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new prerequisite */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add required knowledge or skills..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('prerequisites', (e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addItem('prerequisites', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of prerequisites */}
                    <div className="space-y-2">
                        {(formData.prerequisites || []).map((prerequisite: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{prerequisite}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('prerequisites', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Learning Outcomes</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new outcome */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add what participants will learn..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('learning_outcomes', (e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addItem('learning_outcomes', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of outcomes */}
                    <div className="space-y-2">
                        {(formData.learning_outcomes || []).map((outcome: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{outcome}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('learning_outcomes', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Outline */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Content Outline</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new outline item */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add a section or topic..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('content_outline', (e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addItem('content_outline', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of outline items */}
                    <div className="space-y-2">
                        {(formData.content_outline || []).map((item: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{item}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('content_outline', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const TutorialFields = withFieldArray<TutorialFieldsType>(TutorialFieldsBase);
export default TutorialFields;
