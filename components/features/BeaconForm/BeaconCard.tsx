'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Clock, Star, Globe, GraduationCap } from 'lucide-react';
import { getProjectTypeIcon, getProjectTypeLabel, getDifficultyColor } from './config/utils';
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

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                        {getProjectTypeIcon(beacon.project_type)}
                        <Badge variant="secondary" className="text-xs">
                            {getProjectTypeLabel(beacon.project_type)}
                        </Badge>
                    </div>
                    <Badge className={`${getDifficultyColor(beacon.difficulty)} border text-xs`}>
                        {beacon.difficulty.charAt(0).toUpperCase() + beacon.difficulty.slice(1)}
                    </Badge>
                </div>
                <CardTitle className="text-lg font-semibold line-clamp-2">{beacon.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">{beacon.description}</p>

                {/* Tags */}
                {beacon.tags && beacon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {beacon.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {beacon.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{beacon.tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}

                {/* Beacon Info */}
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>
                            {beacon.current_members}/{beacon.max_members} members
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(beacon.created_at)}</span>
                    </div>
                    {beacon.is_beginner_friendly && (
                        <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>Beginner Friendly</span>
                        </div>
                    )}
                    {beacon.remote_friendly && (
                        <div className="flex items-center space-x-1">
                            <Globe className="w-3 h-3 text-blue-500" />
                            <span>Remote</span>
                        </div>
                    )}
                    {beacon.mentoring_available && (
                        <div className="flex items-center space-x-1">
                            <GraduationCap className="w-3 h-3 text-green-500" />
                            <span>Mentoring</span>
                        </div>
                    )}
                </div>

                {/* Owner */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={beacon.owner.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                                {getInitials(beacon.owner.full_name, beacon.owner.username)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xs font-medium">{beacon.owner.full_name || beacon.owner.username}</p>
                            <p className="text-xs text-gray-500">@{beacon.owner.username}</p>
                        </div>
                    </div>

                    <Button size="sm" variant="outline" onClick={() => onViewDetails?.(beacon)} className="text-xs">
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default BeaconCard;
