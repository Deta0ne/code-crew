'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ExternalLink, MessageCircle, Bookmark, ArrowLeft, Loader2, UserPlus } from 'lucide-react';
import {
    getProjectTypeIcon,
    getProjectTypeLabel,
    getDifficultyLevel,
    formatDate,
    getProjectCategoryLabel,
} from '../BeaconForm/config/utils';
import { submitApplication } from '@/lib/services/application';
import { createBookmark, deleteBookmark } from '@/lib/services/bookmark';
import { ApplicationInput } from '@/lib/validations/application';
import BeaconDetailOne from './BeaconDetailOne';
import BeaconDetailTwo from './BeaconDetailTwo';
import { toast } from 'sonner';
import { ProjectWithMembers } from '@/types/database';

interface BeaconDetailsDialogProps {
    beacon: ProjectWithMembers | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BeaconDetailsDialog({ beacon, open, onOpenChange }: BeaconDetailsDialogProps) {
    const [currentStep, setCurrentStep] = useState<'details' | 'application'>('details');
    const [formData, setFormData] = useState<Partial<ApplicationInput>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [beaconState, setBeaconState] = useState(beacon?.is_bookmarked);

    useEffect(() => {
        setBeaconState(beacon?.is_bookmarked);
    }, [beacon]);
    if (!beacon) return null;

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
                owner_username: beacon.owner.username,
            };

            const result = await submitApplication(applicationData);

            if (result.success) {
                onOpenChange(false);
                setCurrentStep('details');
                setFormData({});
                toast.success('Application submitted successfully');
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

    const handleSaveBeacon = async (beacon: ProjectWithMembers) => {
        const result = await createBookmark(beacon);
        if (result.success) {
            setBeaconState(true);
            toast.success('Beacon bookmarked successfully');
        } else {
            toast.error(result.error || 'Failed to bookmark beacon');
        }
    };

    const handleUnsaveBeacon = async (beaconId: string) => {
        const result = await deleteBookmark(beaconId);
        if (result.success) {
            setBeaconState(false);
            toast.success('Beacon unbookmarked successfully');
        } else {
            toast.error(result.error || 'Failed to unbookmark beacon');
        }
    };

    const isFormValid = (formData.motivation_message?.length || 0) >= 50;

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="p-0 bg-background border border-border shadow-2xl max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header Section */}
                <div className="px-4 pt-4 border-b border-border bg-card">
                    <div className="flex items-center space-x-4 mb-4">
                        {currentStep === 'application' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goBackToDetails}
                                className="h-8 w-8 hover:bg-muted dark:hover:bg-muted"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-lg dark:bg-muted/60">
                                {currentStep === 'details' ? (
                                    getProjectTypeIcon(beacon.project_type)
                                ) : (
                                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold text-foreground">
                                    {currentStep === 'details' ? beacon.title : 'Join Project'}
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                    {currentStep === 'details'
                                        ? `Project details for ${beacon.title}`
                                        : 'Application form to join the project'}
                                </DialogDescription>
                                {currentStep === 'details' ? (
                                    <div className="flex items-center space-x-3 mt-1 animate-in fade-in duration-300">
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-medium text-muted-foreground border-border"
                                        >
                                            {getProjectTypeLabel(beacon.project_type)}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-medium text-muted-foreground border-border bg-muted/50 dark:bg-muted/30"
                                        >
                                            {getDifficultyLevel(beacon.difficulty)}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-medium text-muted-foreground border-border bg-muted/50 dark:bg-muted/30"
                                        >
                                            {getProjectCategoryLabel(beacon.category)}
                                        </Badge>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground mt-1 animate-in fade-in duration-300">
                                        Apply to join &quot;{beacon.title}&quot;
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Row - Only on details step */}
                    {currentStep === 'details' && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between text-sm text-muted-foreground pb-2">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-muted-foreground/60" />
                                    <span>
                                        {beacon.current_members} of {beacon.max_members}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground/60" />
                                    <span>{formatDate(beacon.created_at)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <UserPlus className="w-3 h-3" />
                                    <span>{beacon.application_count || 0} applications</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Bookmark className="w-3 h-3" />
                                    <span>{beacon.bookmark_count || 0} saves</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content - Conditional Rendering for Different Heights */}
                <div className="relative flex-1 overflow-hidden">
                    {currentStep === 'details' ? (
                        /* Step 1: Project Details - Dynamic Height */
                        <div className="animate-in fade-in duration-300 ease-out">
                            <BeaconDetailOne beacon={beacon} />
                        </div>
                    ) : (
                        /* Step 2: Application Form - Fixed Height */
                        <div className="animate-in fade-in duration-300 ease-out">
                            <BeaconDetailTwo
                                formData={formData}
                                updateField={updateField}
                                handleSubmit={handleSubmit}
                                error={error}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border bg-card flex-shrink-0">
                    {currentStep === 'details' ? (
                        <div className="flex space-x-3 ">
                            <Button
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-11 font-medium"
                                onClick={goToApplication}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Join Project
                            </Button>
                            <Button
                                variant="outline"
                                className="border-border text-foreground hover:bg-muted dark:hover:bg-muted/50 h-11 font-medium px-4 cursor-pointer"
                                disabled={isSubmitting}
                                onClick={() => (beaconState ? handleUnsaveBeacon(beacon.id) : handleSaveBeacon(beacon))}
                            >
                                <Bookmark className="w-4 h-4 mr-2" />
                                {beaconState ? 'Unsave' : 'Save'}
                            </Button>
                            {beacon.github_url && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-border text-foreground hover:bg-muted dark:hover:bg-muted/50 h-11 w-11"
                                    onClick={() => window.open(beacon.github_url || '', '_blank')}
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goBackToDetails}
                                className="flex-1 border-border text-foreground hover:bg-muted dark:hover:bg-muted/50 h-11"
                                disabled={isSubmitting}
                            >
                                Back to Details
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-11"
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
