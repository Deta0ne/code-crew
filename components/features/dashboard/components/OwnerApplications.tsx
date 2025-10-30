'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Clock, ExternalLink, Github, User, Calendar, MapPin, UserCircle } from 'lucide-react';
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
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                );
            case 'accepted':
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="w-3 h-3 mr-1" />
                        Accepted
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
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
                                'border backdrop-blur-sm transition-colors',
                                isPending
                                    ? 'border-yellow-200/50 bg-yellow-50/30 dark:border-yellow-500/20 dark:bg-yellow-950/20'
                                    : 'border-border/50 bg-card/50 dark:bg-card/30',
                            )}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/${application.applicant_name}`}
                                            className="group inline-flex items-center gap-1.5 hover:underline mb-1"
                                        >
                                            <UserCircle className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            <h4 className="font-semibold text-sm">@{application.applicant_name}</h4>
                                        </Link>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(application.created_at)}
                                        </div>
                                    </div>
                                    {getStatusBadge(application.status)}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Motivation Message */}
                                <div className="rounded-lg bg-muted/30 dark:bg-muted/10 p-2.5">
                                    <h5 className="text-xs font-medium mb-1.5 flex items-center gap-1">
                                        <span className="text-xs">💬</span> Motivation
                                    </h5>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                        {application.motivation_message}
                                    </p>
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
                                {application.review_notes && (
                                    <>
                                        <Separator />
                                        <div className="rounded-lg bg-muted/30 dark:bg-muted/10 p-2 border border-border/50">
                                            <h6 className="text-xs font-medium mb-1 flex items-center gap-1">
                                                📝 Note
                                            </h6>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {application.review_notes}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
