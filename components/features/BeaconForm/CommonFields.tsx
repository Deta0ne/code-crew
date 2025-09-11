'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Users, Globe } from 'lucide-react';

import type { CommonFieldsForm } from './schemas/common';

interface CommonFieldsProps {
    formData: Partial<CommonFieldsForm>;
    onUpdate: (data: Partial<CommonFieldsForm>) => void;
}

export function CommonFields({ formData, onUpdate }: CommonFieldsProps) {
    return (
        <div className="space-y-8">
            {/* Required Fields Section */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Badge variant="default" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Required
                    </Badge>
                    <h3 className="text-sm font-medium text-gray-700">
                        These fields are necessary to create your beacon
                    </h3>
                </div>

                <div className="space-y-6">
                    {/* Project Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                            Project Title
                        </Label>
                        <Input
                            id="title"
                            value={formData.title || ''}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            placeholder="Give your project a clear and engaging title"
                            className="w-full"
                        />
                    </div>

                    {/* Project Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                            Project Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => onUpdate({ description: e.target.value })}
                            placeholder="Describe your project's goals, scope, and what makes it unique..."
                            className="min-h-[120px] resize-none"
                        />
                    </div>

                    {/* Project Category & Difficulty - Side by Side */}
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
                                value={formData.difficulty || 'beginner_friendly'}
                                onValueChange={(value: CommonFieldsForm['difficulty']) =>
                                    onUpdate({ difficulty: value })
                                }
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

                    {/* Team Size */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="max_members" className="text-sm font-medium text-gray-900">
                                Team Size
                            </Label>
                            <span className="text-sm text-gray-600 font-medium">
                                {formData.max_members || 5} members
                            </span>
                        </div>
                        <div className="px-2">
                            <Slider
                                id="max_members"
                                value={[formData.max_members || 5]}
                                onValueChange={(value) => onUpdate({ max_members: value[0] })}
                                min={2}
                                max={15}
                                step={1}
                                className="w-full"
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Min: 2</span>
                            <span>Max: 15</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Divider */}
            <div className="my-6">
                <div className="w-full border-t border-gray-200" />
            </div>

            {/* Optional Fields Section */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Badge variant="outline" className="text-gray-600">
                        Optional
                    </Badge>
                    <h3 className="text-sm font-medium text-gray-700">Additional details to enhance your beacon</h3>
                </div>

                <div className="space-y-6">
                    {/* Short Description */}
                    <div className="space-y-2">
                        <Label htmlFor="short_description" className="text-sm font-medium text-gray-900">
                            Short Description
                        </Label>
                        <Input
                            id="short_description"
                            value={formData.short_description || ''}
                            onChange={(e) => onUpdate({ short_description: e.target.value })}
                            placeholder="A brief one-liner about your project"
                            className="w-full"
                        />
                    </div>

                    {/* Project Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="github_url" className="text-sm font-medium text-gray-900">
                                GitHub Repository
                            </Label>
                            <Input
                                id="github_url"
                                value={formData.github_url || ''}
                                onChange={(e) => onUpdate({ github_url: e.target.value })}
                                placeholder="https://github.com/username/repo"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="project_url" className="text-sm font-medium text-gray-900">
                                Project URL
                            </Label>
                            <Input
                                id="project_url"
                                value={formData.project_url || ''}
                                onChange={(e) => onUpdate({ project_url: e.target.value })}
                                placeholder="https://your-project.com"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Project Settings */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-4">
                            {/* Beginner Friendly */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Info className="w-4 h-4 text-gray-500" />
                                    <Label htmlFor="is_beginner_friendly" className="text-sm text-gray-700">
                                        Beginner Friendly
                                    </Label>
                                </div>
                                <Switch
                                    id="is_beginner_friendly"
                                    checked={formData.is_beginner_friendly}
                                    onCheckedChange={(checked) => onUpdate({ is_beginner_friendly: checked })}
                                />
                            </div>

                            {/* Mentoring Available */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <Label htmlFor="mentoring_available" className="text-sm text-gray-700">
                                        Mentoring Available
                                    </Label>
                                </div>
                                <Switch
                                    id="mentoring_available"
                                    checked={formData.mentoring_available}
                                    onCheckedChange={(checked) => onUpdate({ mentoring_available: checked })}
                                />
                            </div>

                            {/* Remote Friendly */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    <Label htmlFor="remote_friendly" className="text-sm text-gray-700">
                                        Remote Friendly
                                    </Label>
                                </div>
                                <Switch
                                    id="remote_friendly"
                                    checked={formData.remote_friendly}
                                    onCheckedChange={(checked) => onUpdate({ remote_friendly: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommonFields;
