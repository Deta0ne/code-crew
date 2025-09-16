'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Users,
    Globe,
    GraduationCap,
    Calendar,
    ExternalLink,
    MessageCircle,
    Bookmark,
    User,
    ArrowLeft,
    Clock,
    Github,
    Loader2,
} from 'lucide-react';
import { getProjectTypeIcon, getProjectTypeLabel } from './config/utils';
import { submitApplication } from '@/lib/services/application';
import { ApplicationInput } from '@/lib/validations/application';
import type { BeaconResult } from '@/lib/services/beacon';
import { useRouter } from 'next/navigation';

interface BeaconDetailsDialogProps {
    beacon: BeaconResult | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BeaconDetailsDialog({ beacon, open, onOpenChange }: BeaconDetailsDialogProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<'details' | 'application'>('details');
    const [formData, setFormData] = useState<Partial<ApplicationInput>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!beacon) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getInitials = (name: string | null, username: string) => {
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

    const getDifficultyLevel = (difficulty: string) => {
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

    const updateField = (field: keyof ApplicationInput, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const applicationData: ApplicationInput = {
                project_id: beacon.id,
                motivation_message: formData.motivation_message || '',
                what_they_bring: formData.what_they_bring || '',
                what_they_want_to_learn: formData.what_they_want_to_learn || '',
                hours_per_week: formData.hours_per_week,
                timezone: formData.timezone || '',
                portfolio_url: formData.portfolio_url || '',
                github_url: formData.github_url || '',
            };

            const result = await submitApplication(applicationData);

            if (result.success) {
                onOpenChange(false);
                setCurrentStep('details');
                setFormData({});
                // TODO: Show success message/toast
            } else {
                setError(result.error || 'Failed to submit application');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Application submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToApplication = () => {
        setCurrentStep('application');
        setError(null);
    };

    const goBackToDetails = () => {
        setCurrentStep('details');
        setError(null);
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setCurrentStep('details');
            setFormData({});
            setError(null);
        }
        onOpenChange(open);
    };

    const isFormValid = (formData.motivation_message?.length || 0) >= 50;

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="p-0 bg-white border border-gray-100 shadow-2xl max-w-2xl overflow-hidden">
                {/* Header Section */}
                <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center space-x-4 mb-4">
                        {currentStep === 'application' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goBackToDetails}
                                className="h-8 w-8 hover:bg-gray-100"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                {currentStep === 'details' ? (
                                    getProjectTypeIcon(beacon.project_type)
                                ) : (
                                    <MessageCircle className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold text-gray-900">
                                    {currentStep === 'details' ? beacon.title : 'Join Project'}
                                </DialogTitle>
                                {currentStep === 'details' ? (
                                    <div className="flex items-center space-x-3 mt-1">
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-medium text-gray-500 border-gray-200"
                                        >
                                            {getProjectTypeLabel(beacon.project_type)}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-medium text-gray-600 border-gray-200 bg-gray-50"
                                        >
                                            {getDifficultyLevel(beacon.difficulty)}
                                        </Badge>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Apply to join &quot;{beacon.title}&quot;
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Row - Only on details step */}
                    {currentStep === 'details' && (
                        <div className="flex items-center space-x-8 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>
                                    {beacon.current_members} of {beacon.max_members} members
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{formatDate(beacon.created_at)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content - Conditional Rendering for Different Heights */}
                <div className="relative overflow-hidden">
                    {currentStep === 'details' ? (
                        /* Step 1: Project Details - Dynamic Height */
                        <div className="px-4  space-y-4 transition-opacity duration-300 ease-in-out opacity-100">
                            {/* Description */}
                            <div>
                                <p className="text-gray-700 leading-relaxed text-base">{beacon.description}</p>
                            </div>

                            {/* Tags */}
                            {beacon.tags && beacon.tags.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {beacon.tags.map((tag, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="text-xs font-normal text-gray-600 border-gray-200 bg-gray-50 px-2 py-1"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            {(beacon.is_beginner_friendly || beacon.remote_friendly || beacon.mentoring_available) && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Features</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {beacon.is_beginner_friendly && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                                <span>Beginner-friendly</span>
                                            </div>
                                        )}
                                        {beacon.remote_friendly && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                                <span>Remote</span>
                                            </div>
                                        )}
                                        {beacon.mentoring_available && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span>Mentoring</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Project Owner */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Project Owner</h3>
                                <div
                                    className="flex items-center space-x-3 cursor-pointer group"
                                    onClick={() => router.push(`/${beacon.owner.username}`)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={beacon.owner.avatar_url || undefined} />
                                        <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-sm">
                                            {getInitials(beacon.owner.full_name, beacon.owner.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm group-hover:text-gray-700 transition-colors">
                                            {beacon.owner.full_name || beacon.owner.username}
                                        </p>
                                        <p className="text-sm text-gray-500">@{beacon.owner.username}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Application Form - Fixed Height */
                        <div className="h-[60vh] flex flex-col transition-opacity duration-300 ease-in-out opacity-100">
                            <div className="flex-1 px-4  overflow-y-auto">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Motivation Message */}
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <MessageCircle className="w-4 h-4 text-gray-400" />
                                            <Label className="text-sm font-medium text-gray-900">
                                                Why do you want to join this project? *
                                            </Label>
                                        </div>
                                        <Textarea
                                            placeholder="Explain your motivation and how you can contribute..."
                                            value={formData.motivation_message || ''}
                                            onChange={(e) => updateField('motivation_message', e.target.value)}
                                            className="min-h-[80px] resize-none"
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            {formData.motivation_message?.length || 0}/50 characters minimum
                                        </p>
                                    </div>

                                    {/* What They Bring */}
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <Label className="text-sm font-medium text-gray-900">
                                                What skills and experience do you bring?
                                            </Label>
                                        </div>
                                        <Textarea
                                            placeholder="Describe your relevant skills and background..."
                                            value={formData.what_they_bring || ''}
                                            onChange={(e) => updateField('what_they_bring', e.target.value)}
                                            className="min-h-[60px] resize-none"
                                        />
                                    </div>

                                    {/* What They Want to Learn */}
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <GraduationCap className="w-4 h-4 text-gray-400" />
                                            <Label className="text-sm font-medium text-gray-900">
                                                What do you hope to learn?
                                            </Label>
                                        </div>
                                        <Textarea
                                            placeholder="What skills or knowledge are you looking to gain..."
                                            value={formData.what_they_want_to_learn || ''}
                                            onChange={(e) => updateField('what_they_want_to_learn', e.target.value)}
                                            className="min-h-[60px] resize-none"
                                        />
                                    </div>

                                    {/* Work Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Hours per Week */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <Label className="text-sm font-medium text-gray-900">
                                                    Hours per week
                                                </Label>
                                            </div>
                                            <Select
                                                onValueChange={(value) =>
                                                    updateField('hours_per_week', parseInt(value))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select hours" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="5">5 hours</SelectItem>
                                                    <SelectItem value="10">10 hours</SelectItem>
                                                    <SelectItem value="15">15 hours</SelectItem>
                                                    <SelectItem value="20">20 hours</SelectItem>
                                                    <SelectItem value="25">25+ hours</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Timezone */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                                <Label className="text-sm font-medium text-gray-900">Timezone</Label>
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder="e.g., UTC+3, EST, PST"
                                                value={formData.timezone || ''}
                                                onChange={(e) => updateField('timezone', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Portfolio URL */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                                <Label className="text-sm font-medium text-gray-900">
                                                    Portfolio URL
                                                </Label>
                                            </div>
                                            <Input
                                                type="url"
                                                placeholder="https://your-portfolio.com"
                                                value={formData.portfolio_url || ''}
                                                onChange={(e) => updateField('portfolio_url', e.target.value)}
                                            />
                                        </div>

                                        {/* GitHub URL */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Github className="w-4 h-4 text-gray-400" />
                                                <Label className="text-sm font-medium text-gray-900">GitHub URL</Label>
                                            </div>
                                            <Input
                                                type="url"
                                                placeholder="https://github.com/username"
                                                value={formData.github_url || ''}
                                                onChange={(e) => updateField('github_url', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100">
                    {currentStep === 'details' ? (
                        <div className="flex space-x-3 ">
                            <Button
                                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border-0 h-11 font-medium"
                                onClick={goToApplication}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Join Project
                            </Button>
                            <Button
                                variant="outline"
                                className="border-gray-200 text-gray-700 hover:bg-gray-50 h-11 font-medium px-4"
                            >
                                <Bookmark className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-gray-200 text-gray-700 hover:bg-gray-50 h-11 w-11"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goBackToDetails}
                                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 h-11"
                                disabled={isSubmitting}
                            >
                                Back to Details
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-11"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
