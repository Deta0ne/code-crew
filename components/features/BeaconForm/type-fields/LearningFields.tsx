'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Plus, X, GraduationCap, Book, Target } from 'lucide-react';
import { withFieldArray } from './withFieldArray';
import type { LearningFields as LearningFieldsType } from '../types';
import type { LearningFieldsProps } from './types';
import type { ArrayField } from './types';

type Props = LearningFieldsProps & {
    updateArray: (field: ArrayField<LearningFieldsType>, value: string[]) => void;
    addItem: (field: ArrayField<LearningFieldsType>, newItem: string) => void;
    removeItem: (field: ArrayField<LearningFieldsType>, index: number) => void;
};

function LearningFieldsBase({ formData, onUpdate, addItem, removeItem }: Props) {
    return (
        <div className="space-y-8">
            {/* Learning Goals Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Learning Goals</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new goal */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add a specific learning objective..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('learning_goals', (e.target as HTMLInputElement).value);
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
                                addItem('learning_goals', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of goals */}
                    <div className="space-y-2">
                        {(formData.learning_goals || []).map((goal: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{goal}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('learning_goals', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Technologies to Learn */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Book className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Technologies to Learn</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new technology */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add a technology you want to learn..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('technologies_to_learn', (e.target as HTMLInputElement).value);
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
                                addItem('technologies_to_learn', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of technologies */}
                    <div className="space-y-2">
                        {(formData.technologies_to_learn || []).map((tech: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{tech}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('technologies_to_learn', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Learning Timeline</Label>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{formData.timeline_weeks || 4} weeks</span>
                </div>

                <div className="px-2">
                    <Slider
                        value={[formData.timeline_weeks || 4]}
                        onValueChange={(value) => onUpdate({ timeline_weeks: value[0] })}
                        min={1}
                        max={52}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">1 week</span>
                        <span className="text-xs text-gray-500">52 weeks</span>
                    </div>
                </div>
            </div>

            {/* Resources Provided */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium text-gray-900">Resources Provided</Label>
                    <Badge variant="outline" className="text-xs">
                        Optional
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new resource */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add learning resources you'll provide..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('resources_provided', (e.target as HTMLInputElement).value);
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
                                addItem('resources_provided', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of resources */}
                    <div className="space-y-2">
                        {(formData.resources_provided || []).map((resource: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{resource}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('resources_provided', index)}
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

export const LearningFields = withFieldArray<LearningFieldsType>(LearningFieldsBase);
export default LearningFields;
