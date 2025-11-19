'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, Clock, Send, Trash2, Calendar, UserCircle } from 'lucide-react';
import { ProjectApplication } from '../types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ApplicantApplicationsProps {
    applications: ProjectApplication[];
    onDeleteApplication: (applicationId: string) => Promise<void>;
}

export default function ApplicantApplications({ applications, onDeleteApplication }: ApplicantApplicationsProps) {
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    const handleDelete = async (applicationId: string) => {
        setDeletingIds((prev) => new Set(prev).add(applicationId));
        try {
            await onDeleteApplication(applicationId);
        } finally {
            setDeletingIds((prev) => {
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
            case 'withdrawn':
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Withdrawn
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
                <Send className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Applications Yet</h3>
                <p className="text-sm text-muted-foreground">Your project applications will appear here</p>
            </div>
        );
    }

    const pendingCount = applications.filter((app) => app.status === 'pending').length;
    const acceptedCount = applications.filter((app) => app.status === 'accepted').length;
    const rejectedCount = applications.filter((app) => app.status === 'rejected').length;

    return (
        <div className="space-y-4">
            {/* Header with Stats */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">My Applications</h3>
                <div className="flex items-center gap-2">
                    {pendingCount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            {pendingCount} pending
                        </Badge>
                    )}
                    {acceptedCount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {acceptedCount} accepted
                        </Badge>
                    )}
                    {rejectedCount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200">
                            {rejectedCount} rejected
                        </Badge>
                    )}
                </div>
            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {applications.map((application) => {
                    const isDeleting = deletingIds.has(application.id);
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
                                        {application.owner_username ? (
                                            <Link
                                                href={`/${application.owner_username}`}
                                                className="group inline-flex items-center gap-1.5 hover:underline mb-1"
                                            >
                                                <UserCircle className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                <h4 className="font-semibold text-sm truncate">
                                                    @{application.owner_username}&apos;s Project
                                                </h4>
                                            </Link>
                                        ) : (
                                            <h4 className="font-semibold text-sm mb-1">Project</h4>
                                        )}
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
                                        <span className="text-xs">💬</span> Your Message
                                    </h5>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                        {application.motivation_message}
                                    </p>
                                </div>

                                {/* Additional Info - Compact */}
                                {application.hours_per_week && (
                                    <>
                                        <Separator />
                                        <div className="text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3 inline mr-1" />
                                            {application.hours_per_week}h/week
                                        </div>
                                    </>
                                )}

                                {/* Review Notes - if rejected and has notes */}
                                {application.status === 'rejected' && application.review_notes && (
                                    <>
                                        <Separator />
                                        <div className="rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 p-2">
                                            <h6 className="text-xs font-medium mb-1 text-red-900 dark:text-red-400 flex items-center gap-1">
                                                📝 Feedback
                                            </h6>
                                            <p className="text-xs text-red-700 dark:text-red-300 line-clamp-2">
                                                {application.review_notes}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Success Message - if accepted */}
                                {application.status === 'accepted' && (
                                    <>
                                        <Separator />
                                        <div className="rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30 p-2">
                                            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                                                🎉 Accepted!
                                            </p>
                                            {application.review_notes && (
                                                <p className="text-xs text-green-600 dark:text-green-400 mt-1 line-clamp-2">
                                                    {application.review_notes}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Delete Button - only for pending or rejected */}
                                {(isPending || application.status === 'rejected') && (
                                    <>
                                        <Separator />
                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(application.id)}
                                                disabled={isDeleting}
                                                className="text-red-700 hover:bg-red-50 h-7 text-xs"
                                            >
                                                <Trash2 className="w-3 h-3 mr-1" />
                                                {isPending ? 'Withdraw' : 'Delete'}
                                            </Button>
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
