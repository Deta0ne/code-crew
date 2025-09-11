'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Microscope, FileText, Target, BookOpen } from 'lucide-react';
import { withFieldArray } from './withFieldArray';
import type { ResearchFields as ResearchFieldsType } from '../types';
import type { ResearchFieldsProps } from './types';
import type { ArrayField } from './types';

type Props = ResearchFieldsProps & {
    updateArray: (field: ArrayField<ResearchFieldsType>, value: string[]) => void;
    addItem: (field: ArrayField<ResearchFieldsType>, newItem: string) => void;
    removeItem: (field: ArrayField<ResearchFieldsType>, index: number) => void;
};

function ResearchFieldsBase({ formData, onUpdate, addItem, removeItem }: Props) {
    return (
        <div className="space-y-8">
            {/* Research Area */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Microscope className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Research Area</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>
                <Select
                    value={formData.research_area}
                    onValueChange={(value) => onUpdate({ research_area: value as ResearchFieldsType['research_area'] })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select research area" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ai_ml">AI & Machine Learning</SelectItem>
                        <SelectItem value="blockchain">Blockchain & Cryptography</SelectItem>
                        <SelectItem value="security">Security & Privacy</SelectItem>
                        <SelectItem value="systems">Systems & Networks</SelectItem>
                        <SelectItem value="data_science">Data Science & Analytics</SelectItem>
                        <SelectItem value="other">Other (Specify in Description)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Methodology */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Research Methodology</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new methodology step */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add methodology steps..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('methodology', (e.target as HTMLInputElement).value);
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
                                addItem('methodology', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of methodology steps */}
                    <div className="space-y-2">
                        {(formData.methodology || []).map((step: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{step}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('methodology', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expected Outcomes */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Expected Outcomes</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new outcome */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add expected research outcomes..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('expected_outcomes', (e.target as HTMLInputElement).value);
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
                                addItem('expected_outcomes', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of outcomes */}
                    <div className="space-y-2">
                        {(formData.expected_outcomes || []).map((outcome: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{outcome}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('expected_outcomes', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Publication Plan */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Publication Plan</Label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Optional
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new publication plan */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add publication or dissemination plans..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('publication_plan', (e.target as HTMLInputElement).value);
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
                                addItem('publication_plan', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of publication plans */}
                    <div className="space-y-2">
                        {(formData.publication_plan || []).map((plan: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{plan}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('publication_plan', index)}
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

export const ResearchFields = withFieldArray<ResearchFieldsType>(ResearchFieldsBase);
export default ResearchFields;
