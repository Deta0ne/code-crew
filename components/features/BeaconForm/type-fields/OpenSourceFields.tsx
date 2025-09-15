'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, GitBranch, Scale, Users, FileText } from 'lucide-react';
import { withFieldArray } from './withFieldArray';
import type { OpenSourceFields as OpenSourceFieldsType } from '../types';
import type { OpenSourceFieldsProps } from './types';
import type { ArrayField } from './types';

type Props = OpenSourceFieldsProps & {
    updateArray: (field: ArrayField<OpenSourceFieldsType>, value: string[]) => void;
    addItem: (field: ArrayField<OpenSourceFieldsType>, newItem: string) => void;
    removeItem: (field: ArrayField<OpenSourceFieldsType>, index: number) => void;
};

function OpenSourceFieldsBase({ formData, onUpdate, addItem, removeItem }: Props) {
    return (
        <div className="space-y-8">
            {/* License Type */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Scale className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">License Type</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>
                <Select
                    value={formData.license_type}
                    onValueChange={(value) => onUpdate({ license_type: value as OpenSourceFieldsType['license_type'] })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mit">MIT</SelectItem>
                        <SelectItem value="apache">Apache 2.0</SelectItem>
                        <SelectItem value="gpl">GPL v3</SelectItem>
                        <SelectItem value="bsd">BSD</SelectItem>
                        <SelectItem value="other">Other (Specify in Description)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Contribution Guidelines */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Contribution Guidelines</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new guideline */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add contribution guidelines..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('contribution_guidelines', (e.target as HTMLInputElement).value);
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
                                addItem('contribution_guidelines', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of guidelines */}
                    <div className="space-y-2">
                        {(formData.contribution_guidelines || []).map((guideline: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{guideline}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('contribution_guidelines', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Documentation Standards */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Documentation Standards</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new standard */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add documentation requirements..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('documentation_standards', (e.target as HTMLInputElement).value);
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
                                addItem('documentation_standards', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of standards */}
                    <div className="space-y-2">
                        {(formData.documentation_standards || []).map((standard: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{standard}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('documentation_standards', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Community Goals */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Community Goals</Label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Optional
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new goal */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add community and collaboration goals..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('community_goals', (e.target as HTMLInputElement).value);
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
                                addItem('community_goals', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of goals */}
                    <div className="space-y-2">
                        {(formData.community_goals || []).map((goal: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{goal}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('community_goals', index)}
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

export const OpenSourceFields = withFieldArray<OpenSourceFieldsType>(OpenSourceFieldsBase);
export default OpenSourceFields;
