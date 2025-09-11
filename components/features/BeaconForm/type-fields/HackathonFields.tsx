'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X, Trophy, Calendar, FileCheck, Target } from 'lucide-react';
import { withFieldArray } from './withFieldArray';
import type { HackathonFields as HackathonFieldsType } from '../types';
import type { HackathonFieldsProps } from './types';
import type { ArrayField } from './types';

type Props = HackathonFieldsProps & {
    updateArray: (field: ArrayField<HackathonFieldsType>, value: string[]) => void;
    addItem: (field: ArrayField<HackathonFieldsType>, newItem: string) => void;
    removeItem: (field: ArrayField<HackathonFieldsType>, index: number) => void;
};

function HackathonFieldsBase({ formData, onUpdate, addItem, removeItem }: Props) {
    return (
        <div className="space-y-8">
            {/* Deadline */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Submission Deadline</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>
                <Input
                    type="datetime-local"
                    value={formData.deadline || ''}
                    onChange={(e) => onUpdate({ deadline: e.target.value })}
                    className="flex-1"
                />
            </div>

            {/* Prize Pool */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Prize Pool</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new prize */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add prize details..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('prize_pool', (e.target as HTMLInputElement).value);
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
                                addItem('prize_pool', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of prizes */}
                    <div className="space-y-2">
                        {(formData.prize_pool || []).map((prize: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{prize}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('prize_pool', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submission Requirements */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Submission Requirements</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new requirement */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add submission requirements..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('submission_requirements', (e.target as HTMLInputElement).value);
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
                                addItem('submission_requirements', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of requirements */}
                    <div className="space-y-2">
                        {(formData.submission_requirements || []).map((requirement: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{requirement}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('submission_requirements', index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rules */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <Label className="text-sm font-medium text-gray-900">Rules</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        Required
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Input for new rule */}
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add competition rules..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem('rules', (e.target as HTMLInputElement).value);
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
                                addItem('rules', input.value);
                                input.value = '';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* List of rules */}
                    <div className="space-y-2">
                        {(formData.rules || []).map((rule: string, index: number) => (
                            <div key={index} className="group flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                                <span className="flex-1 text-sm">{rule}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeItem('rules', index)}
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

export const HackathonFields = withFieldArray<HackathonFieldsType>(HackathonFieldsBase);
export default HackathonFields;
