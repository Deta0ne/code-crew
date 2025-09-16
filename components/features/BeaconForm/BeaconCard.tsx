'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Clock, Star, Globe, GraduationCap } from 'lucide-react';
import { getProjectTypeIcon, getProjectTypeLabel } from './config/utils';
import type { BeaconResult } from '@/hooks/useBeacons';

interface BeaconCardProps {
    beacon: BeaconResult;
    onViewDetails?: (beacon: BeaconResult) => void;
}

export function BeaconCard({ beacon, onViewDetails }: BeaconCardProps) {
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
        <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 border-gray-100">
            {/* Header */}
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-50 rounded-lg">{getProjectTypeIcon(beacon.project_type)}</div>
                        <Badge variant="outline" className="text-xs font-medium text-gray-500 border-gray-200">
                            {getProjectTypeLabel(beacon.project_type)}
                        </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs font-medium text-gray-600 border-gray-200 bg-gray-50">
                        {getDifficultyLevel(beacon.difficulty)}
                    </Badge>
                </div>
                <CardTitle className="text-lg font-medium text-gray-900 leading-tight line-clamp-2">
                    {beacon.title}
                </CardTitle>
            </CardHeader>

            {/* Content - Flexible grow */}
            <CardContent className="flex-1 flex flex-col space-y-4 pb-4">
                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 flex-1">{beacon.description}</p>

                {/* Tags */}
                {beacon.tags && beacon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {beacon.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs font-normal text-gray-600 border-gray-200 bg-gray-50"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {beacon.tags.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs font-normal text-gray-600 border-gray-200 bg-gray-50"
                            >
                                +{beacon.tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}

                {/* Metadata */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>
                            {beacon.current_members} of {beacon.max_members}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(beacon.created_at)}</span>
                    </div>
                </div>

                {/* Features */}
                {(beacon.is_beginner_friendly || beacon.remote_friendly || beacon.mentoring_available) && (
                    <div className="flex flex-wrap gap-2">
                        {beacon.is_beginner_friendly && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                                <Star className="w-3 h-3 text-gray-400" />
                                <span>Beginner-friendly</span>
                            </div>
                        )}
                        {beacon.remote_friendly && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                                <Globe className="w-3 h-3 text-gray-400" />
                                <span>Remote</span>
                            </div>
                        )}
                        {beacon.mentoring_available && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                                <GraduationCap className="w-3 h-3 text-gray-400" />
                                <span>Mentoring</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            {/* Footer - Fixed at bottom */}
            <CardContent className="pt-0">
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={beacon.owner.avatar_url || undefined} />
                            <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-xs">
                                {getInitials(beacon.owner.full_name, beacon.owner.username)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {beacon.owner.full_name || beacon.owner.username}
                            </p>
                            <p className="text-xs text-gray-500">@{beacon.owner.username}</p>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails?.(beacon)}
                        className="text-xs font-medium border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default BeaconCard;
