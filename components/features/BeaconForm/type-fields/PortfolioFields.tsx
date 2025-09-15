'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Briefcase, Target, Globe, Code2 } from 'lucide-react';
import { withFieldArray } from './withFieldArray';
import type { PortfolioFields as PortfolioFieldsType } from '../types';
import type { PortfolioFieldsProps } from './types';
import type { ArrayField } from './types';

type Props = PortfolioFieldsProps & {
    updateArray: (field: ArrayField<PortfolioFieldsType>, value: string[]) => void;
    addItem: (field: ArrayField<PortfolioFieldsType>, newItem: string) => void;
    removeItem: (field: ArrayField<PortfolioFieldsType>, index: number) => void;
};

function PortfolioFieldsBase({ formData, onUpdate, addItem, removeItem }: Props) {
    return (
        <div className="space-y-8">
            {/* Showcase Purpose */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Showcase Purpose</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>
                <Select
                    value={formData.showcase_purpose}
                    onValueChange={(value) =>
                        onUpdate({ showcase_purpose: value as PortfolioFieldsType['showcase_purpose'] })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select showcase purpose" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="job_search">Job Search</SelectItem>
                        <SelectItem value="freelance">Freelance Work</SelectItem>
                        <SelectItem value="skill_demonstration">Skill Demonstration</SelectItem>
                        <SelectItem value="startup">Startup/Business</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Target Employers/Clients */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Target Employers/Clients</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new target */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add target employer or client type..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('target_audience', (e.target as HTMLInputElement).value);
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
                                addItem('target_audience', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of targets */}
                    <div className="space-y-2">
                        {(formData.target_audience || []).map((target: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{target}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('target_audience', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Code2 className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Key Features</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new feature */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add a key feature or functionality..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('key_features', (e.target as HTMLInputElement).value);
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
                                addItem('key_features', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of features */}
                    <div className="space-y-2">
                        {(formData.key_features || []).map((feature: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{feature}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('key_features', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deployment Requirements */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Deployment Requirements</Label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Optional
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new requirement */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add deployment or hosting requirements..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('deployment_requirements', (e.target as HTMLInputElement).value);
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
                                addItem('deployment_requirements', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of requirements */}
                    <div className="space-y-2">
                        {(formData.deployment_requirements || []).map((requirement: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{requirement}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('deployment_requirements', index)}
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

export const PortfolioFields = withFieldArray<PortfolioFieldsType>(PortfolioFieldsBase);
export default PortfolioFields;
