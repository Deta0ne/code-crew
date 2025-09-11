'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommonFieldsForm } from './types';

interface CommonFieldsProps {
    formData: Partial<CommonFieldsForm>;
    onUpdate: (data: Partial<CommonFieldsForm>) => void;
}

export function CommonFields({ formData, onUpdate }: CommonFieldsProps) {
    return (
        <div className="space-y-8">
            {/* Required Fields */}
            <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                            Project Title
                        </Label>
                        <Badge variant="secondary" className="text-xs">
                            Required
                        </Badge>
                    </div>
                    <Input
                        id="title"
                        value={formData.title || ''}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        placeholder="Enter a descriptive title for your project"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                            Project Description
                        </Label>
                        <Badge variant="secondary" className="text-xs">
                            Required
                        </Badge>
                    </div>
                    <Textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        placeholder="Describe your project and its goals"
                        className="min-h-[100px]"
                    />
                </div>

                {/* Category and Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-gray-900">
                            Project Category
                        </Label>
                        <Select
                            value={formData.category || ''}
                            onValueChange={(value: CommonFieldsForm['category']) => onUpdate({ category: value })}
                        >
                            <SelectTrigger id="category" className="w-full">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="web">Web Development</SelectItem>
                                <SelectItem value="mobile">Mobile Development</SelectItem>
                                <SelectItem value="desktop">Desktop Applications</SelectItem>
                                <SelectItem value="ai_ml">AI & Machine Learning</SelectItem>
                                <SelectItem value="data_science">Data Science</SelectItem>
                                <SelectItem value="devops">DevOps & Infrastructure</SelectItem>
                                <SelectItem value="design">Design & UI/UX</SelectItem>
                                <SelectItem value="blockchain">Blockchain & Web3</SelectItem>
                                <SelectItem value="game_dev">Game Development</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Project Difficulty */}
                    <div className="space-y-2">
                        <Label htmlFor="difficulty" className="text-sm font-medium text-gray-900">
                            Project Difficulty
                        </Label>
                        <Select
                            value={formData.difficulty}
                            onValueChange={(value: CommonFieldsForm['difficulty']) => onUpdate({ difficulty: value })}
                        >
                            <SelectTrigger id="difficulty" className="w-full">
                                <SelectValue placeholder="Select difficulty level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner_friendly">Beginner Friendly</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="my-6">
                <div className="w-full border-t border-gray-200" />
            </div>

            {/* Optional Fields */}
            <div className="space-y-6">
                {/* Team Size */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-900">Team Size</Label>
                        <span className="text-sm text-gray-600 font-medium">{formData.max_members || 2} members</span>
                    </div>
                    <div className="px-2">
                        <Slider
                            value={[formData.max_members || 2]}
                            onValueChange={(value) => onUpdate({ max_members: value[0] })}
                            min={1}
                            max={10}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">1 member</span>
                            <span className="text-xs text-gray-500">10 members</span>
                        </div>
                    </div>
                </div>

                {/* Project URLs */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="github_url" className="text-sm font-medium text-gray-900">
                                GitHub URL
                            </Label>
                            <Badge variant="outline" className="text-xs">
                                Optional
                            </Badge>
                        </div>
                        <Input
                            id="github_url"
                            type="url"
                            value={formData.github_url || ''}
                            onChange={(e) => onUpdate({ github_url: e.target.value })}
                            placeholder="https://github.com/username/project"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="project_url" className="text-sm font-medium text-gray-900">
                                Project URL
                            </Label>
                            <Badge variant="outline" className="text-xs">
                                Optional
                            </Badge>
                        </div>
                        <Input
                            id="project_url"
                            type="url"
                            value={formData.project_url || ''}
                            onChange={(e) => onUpdate({ project_url: e.target.value })}
                            placeholder="https://your-project.com"
                        />
                    </div>
                </div>

                {/* Project Settings */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="is_beginner_friendly" className="text-sm font-medium text-gray-900">
                            Beginner Friendly
                        </Label>
                        <Switch
                            id="is_beginner_friendly"
                            checked={formData.is_beginner_friendly}
                            onCheckedChange={(checked) => onUpdate({ is_beginner_friendly: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="mentoring_available" className="text-sm font-medium text-gray-900">
                            Mentoring Available
                        </Label>
                        <Switch
                            id="mentoring_available"
                            checked={formData.mentoring_available}
                            onCheckedChange={(checked) => onUpdate({ mentoring_available: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="remote_friendly" className="text-sm font-medium text-gray-900">
                            Remote Friendly
                        </Label>
                        <Switch
                            id="remote_friendly"
                            checked={formData.remote_friendly}
                            onCheckedChange={(checked) => onUpdate({ remote_friendly: checked })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommonFields;
