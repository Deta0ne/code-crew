'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Globe, GraduationCap, Calendar, ExternalLink, MessageCircle, Bookmark, User } from 'lucide-react';
import { getProjectTypeIcon, getProjectTypeLabel } from './config/utils';
import type { BeaconResult } from '@/lib/services/beacon';
import { useRouter } from 'next/navigation';

interface BeaconDetailsDialogProps {
    beacon: BeaconResult | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BeaconDetailsDialog({ beacon, open, onOpenChange }: BeaconDetailsDialogProps) {
    const router = useRouter();
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 bg-white border border-gray-100 shadow-2xl">
                {/* Header Section */}
                <div className="px-8 pt-8 pb-0">
                    {/* Project Type & Difficulty Row */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gray-50 rounded-xl">{getProjectTypeIcon(beacon.project_type)}</div>
                            <Badge
                                variant="outline"
                                className="text-xs font-medium text-gray-500 border-gray-200 bg-transparent px-3 py-1"
                            >
                                {getProjectTypeLabel(beacon.project_type)}
                            </Badge>
                        </div>
                        <Badge
                            variant="outline"
                            className="text-xs font-medium text-gray-600 border-gray-200 bg-gray-50 px-3 py-1"
                        >
                            {getDifficultyLevel(beacon.difficulty)}
                        </Badge>
                    </div>

                    {/* Project Title */}
                    <div className="mb-6">
                        <DialogTitle className="text-2xl font-semibold text-gray-900 leading-tight">
                            {beacon.title}
                        </DialogTitle>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center space-x-8 text-sm text-gray-500 mb-8">
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
                </div>

                {/* Content Section */}
                <div className="px-8">
                    {/* Description */}
                    <div className="mb-8">
                        <p className="text-gray-700 leading-relaxed text-base">{beacon.description}</p>
                    </div>

                    {/* Technologies */}
                    {beacon.tags && beacon.tags.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {beacon.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs font-normal text-gray-600 border-gray-200 bg-gray-50 px-3 py-1.5"
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
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
                            <div className="space-y-2">
                                {beacon.is_beginner_friendly && (
                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                        <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>Beginner-friendly</span>
                                    </div>
                                )}
                                {beacon.remote_friendly && (
                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>Remote collaboration</span>
                                    </div>
                                )}
                                {beacon.mentoring_available && (
                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span>Mentoring available</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="px-8 pb-8 pt-6 border-t border-gray-100">
                    {/* Project Owner */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Project Owner</h3>
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

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border-0 h-11 font-medium">
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
