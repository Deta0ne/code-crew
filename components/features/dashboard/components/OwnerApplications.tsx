'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Clock, ExternalLink, Github, User, Calendar, MapPin, UserCircle, Briefcase, Target, Zap } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProjectApplication } from '../types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface OwnerApplicationsProps {
    applications: ProjectApplication[];
    onUpdateApplication: (
        applicationId: string,
        status: 'accepted' | 'rejected',
        reviewNotes?: string,
    ) => Promise<void>;
}

export default function OwnerApplications({ applications, onUpdateApplication }: OwnerApplicationsProps) {
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
    const [reviewingId, setReviewingId] = useState<string | null>(null);
    const [reviewAction, setReviewAction] = useState<'accepted' | 'rejected' | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');

    const handleReviewClick = (applicationId: string, action: 'accepted' | 'rejected') => {
        setReviewingId(applicationId);
        setReviewAction(action);
        setReviewNotes('');
    };

    const handleCancelReview = () => {
        setReviewingId(null);
        setReviewAction(null);
        setReviewNotes('');
    };

    const handleStatusUpdate = async (applicationId: string, status: 'accepted' | 'rejected') => {
        setUpdatingIds((prev) => new Set(prev).add(applicationId));
        try {
            await onUpdateApplication(applicationId, status, reviewNotes || undefined);
            handleCancelReview();
        } finally {
            setUpdatingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(applicationId);
                return newSet;
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                );
            case 'accepted':
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50">
                        <Check className="w-3 h-3 mr-1" />
                        Accepted
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50">
                        <X className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (applications.length === 0) {
        return (
            <div className="text-center py-12">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Applications Yet</h3>
                <p className="text-sm text-muted-foreground">Applications to your projects will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Project Applications</h3>
                <Badge variant="secondary" className="text-xs">
                    {applications.filter((app) => app.status === 'pending').length} pending
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {applications.map((application) => {
                    const isUpdating = updatingIds.has(application.id);
                    const isPending = application.status === 'pending';

                    return (
                        <Card
                            key={application.id}
                            className={cn(
                                'border backdrop-blur-sm transition-all duration-200',
                                isPending
                                    ? 'border-yellow-200/50 bg-yellow-50/30 dark:border-yellow-500/20 dark:bg-yellow-950/10'
                                    : 'border-border/40 bg-card/50 dark:bg-card/20 hover:bg-card/80 dark:hover:bg-card/40',
                            )}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <Link
                                                href={`/${application.applicant_name}`}
                                                className="group inline-flex items-center gap-1.5 hover:underline"
                                            >
                                                <UserCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                <h4 className="font-semibold text-sm text-foreground">@{application.applicant_name}</h4>
                                            </Link>
                                            {application.review_notes ? (
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild className="cursor-help">
                                                            {getStatusBadge(application.status)}
                                                        </TooltipTrigger>
                                                        <TooltipContent side="left" className="max-w-[300px] p-3">
                                                            <p className="font-medium text-xs mb-1">Review Note:</p>
                                                            <p className="text-xs text-white">{application.review_notes}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                getStatusBadge(application.status)
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(application.created_at)}
                                            </div>
                                            {application.developer_roles?.name && (
                                                <div className="flex items-center gap-1 text-primary/80 font-medium">
                                                    <Briefcase className="w-3 h-3" />
                                                    {application.developer_roles.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Motivation Message */}
                                {/* Motivation & Details */}
                                <div className="grid gap-3">
                                    <div className="rounded-lg bg-muted/40 dark:bg-muted/20 p-3 space-y-2">
                                        <h5 className="text-xs font-medium flex items-center gap-1.5 text-foreground/80">
                                            <span className="text-sm">💬</span> Motivation
                                        </h5>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {application.motivation_message}
                                        </p>
                                    </div>

                                    {(application.what_they_bring || application.what_they_want_to_learn) && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {application.what_they_bring && (
                                                <div className="rounded-lg bg-blue-50/50 dark:bg-blue-900/10 p-3 border border-blue-100/50 dark:border-blue-800/20">
                                                    <h5 className="text-xs font-medium mb-1.5 flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                                                        <Zap className="w-3.5 h-3.5" /> Brings
                                                    </h5>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        {application.what_they_bring}
                                                    </p>
                                                </div>
                                            )}
                                            {application.what_they_want_to_learn && (
                                                <div className="rounded-lg bg-purple-50/50 dark:bg-purple-900/10 p-3 border border-purple-100/50 dark:border-purple-800/20">
                                                    <h5 className="text-xs font-medium mb-1.5 flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                                                        <Target className="w-3.5 h-3.5" /> Wants to Learn
                                                    </h5>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        {application.what_they_want_to_learn}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Additional Info - Compact */}
                                {(application.hours_per_week || application.timezone) && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                            {application.hours_per_week && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {application.hours_per_week}h/week
                                                </span>
                                            )}
                                            {application.timezone && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {application.timezone}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Links - Compact */}
                                {(application.portfolio_url || application.github_url) && (
                                    <div className="flex gap-1.5">
                                        {application.github_url && (
                                            <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                                                <a
                                                    href={application.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Github className="w-3 h-3" />
                                                </a>
                                            </Button>
                                        )}
                                        {application.portfolio_url && (
                                            <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                                                <a
                                                    href={application.portfolio_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {isPending && (
                                    <>
                                        <Separator />
                                        {reviewingId === application.id ? (
                                            <div className="space-y-2">
                                                <div className="rounded-lg bg-muted/50 p-2.5">
                                                    <h6 className="text-xs font-medium mb-1.5">
                                                        {reviewAction === 'accepted' ? '✅ Accept' : '❌ Reject'}
                                                    </h6>
                                                    <Textarea
                                                        id={`review-${application.id}`}
                                                        placeholder={
                                                            reviewAction === 'accepted'
                                                                ? 'Optional welcome message...'
                                                                : 'Optional feedback...'
                                                        }
                                                        value={reviewNotes}
                                                        onChange={(e) => setReviewNotes(e.target.value)}
                                                        rows={2}
                                                        className="text-xs"
                                                    />
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleStatusUpdate(application.id, reviewAction!)
                                                        }
                                                        disabled={isUpdating}
                                                        className={cn(
                                                            'h-7 text-xs',
                                                            reviewAction === 'accepted'
                                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                                : 'bg-red-600 hover:bg-red-700 text-white',
                                                        )}
                                                    >
                                                        Confirm
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={handleCancelReview}
                                                        disabled={isUpdating}
                                                        className="h-7 text-xs"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1.5">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleReviewClick(application.id, 'accepted')}
                                                    disabled={isUpdating}
                                                    className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                                                >
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleReviewClick(application.id, 'rejected')}
                                                    disabled={isUpdating}
                                                    className="border-red-200 text-red-700 hover:bg-red-50 h-7 text-xs"
                                                >
                                                    <X className="w-3 h-3 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Review Notes - Compact */}
                                {/* Review Notes - Compact (Hidden if shown in tooltip, but kept for fallback or if user prefers visible) */}
                                {/* We moved review notes to tooltip as requested, but we can keep it here if status is NOT rejected/accepted or just remove it to clean up. 
                                    The user said "Rejected yazan tooltip özellikle kötü tasarımı var", implying they want a better tooltip.
                                    I've added the tooltip to the badge. I will remove this section to avoid duplication and clutter, 
                                    unless it's a pending application with notes (unlikely). 
                                    Actually, let's keep it ONLY if it's NOT shown in tooltip (e.g. if I didn't wrap badge). 
                                    But I did wrap badge. So I will remove this section to satisfy "cleaner UI" and "tooltip" request.
                                */}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
