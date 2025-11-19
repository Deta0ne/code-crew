'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bookmark, BookmarkX, Calendar, Rocket, ExternalLink } from 'lucide-react';
import { ProjectBookmark } from '../types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SavedProjectsProps {
    bookmarks: ProjectBookmark[];
    onRemoveBookmark: (bookmarkId: string) => Promise<void>;
}

export default function SavedProjects({ bookmarks, onRemoveBookmark }: SavedProjectsProps) {
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

    const handleRemove = async (bookmarkId: string) => {
        setRemovingIds((prev) => new Set(prev).add(bookmarkId));
        try {
            await onRemoveBookmark(bookmarkId);
        } finally {
            setRemovingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(bookmarkId);
                return newSet;
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            active: 'bg-green-50 text-green-700 border-green-200',
            paused: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            completed: 'bg-blue-50 text-blue-700 border-blue-200',
            draft: 'bg-gray-50 text-gray-700 border-gray-200',
            cancelled: 'bg-red-50 text-red-700 border-red-200',
        };
        return (
            <Badge variant="outline" className={cn('text-xs', styles[status as keyof typeof styles] || '')}>
                {status}
            </Badge>
        );
    };

    const getProjectTypeColor = (type: string) => {
        const colors = {
            learning: 'from-blue-500 to-cyan-500',
            portfolio: 'from-purple-500 to-pink-500',
            open_source: 'from-green-500 to-emerald-500',
            hackathon: 'from-orange-500 to-red-500',
            tutorial: 'from-indigo-500 to-blue-600',
            research: 'from-teal-500 to-cyan-600',
        };
        return colors[type as keyof typeof colors] || 'from-gray-400 to-gray-500';
    };

    const formatProjectType = (type: string) => {
        return type
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12">
                <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Saved Projects</h3>
                <p className="text-sm text-muted-foreground mb-4">Projects you bookmark will appear here</p>
                <Button asChild>
                    <Link href="/home">Browse Projects</Link>
                </Button>
            </div>
        );
    }

    const activeCount = bookmarks.filter((b) => b.status === 'active').length;
    const byType = bookmarks.reduce((acc, bookmark) => {
        acc[bookmark.project_type] = (acc[bookmark.project_type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const mostCommonType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];

    return (
        <div className="space-y-4">
            {/* Header with Stats */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Saved Projects</h3>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                        {bookmarks.length} saved
                    </Badge>
                    {activeCount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {activeCount} active
                        </Badge>
                    )}
                    {mostCommonType && (
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            Most: {formatProjectType(mostCommonType[0])}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks.map((bookmark) => {
                    const isRemoving = removingIds.has(bookmark.id);

                    return (
                        <Card
                            key={bookmark.id}
                            className="border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200 group"
                        >
                            <CardHeader className="pb-3">
                                {/* Project Header */}
                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                                            getProjectTypeColor(bookmark.project_type),
                                        )}
                                    >
                                        <Rocket className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold truncate text-sm leading-tight">
                                            {bookmark.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatProjectType(bookmark.project_type)}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    {getStatusBadge(bookmark.status)}
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(bookmark.created_at)}
                                    </div>
                                </div>

                                <Separator />

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" className="flex-1" asChild>
                                        <Link href={`/home/${bookmark.project_id}`}>
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRemove(bookmark.id)}
                                        disabled={isRemoving}
                                        className="border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                        <BookmarkX className="w-3 h-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
