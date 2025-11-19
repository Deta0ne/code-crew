'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Rocket, Users, Crown, Shield, User, Calendar, ExternalLink, Github, AlertCircle } from 'lucide-react';
import { ActiveProject } from '../types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ActiveProjectsProps {
    projects: ActiveProject[];
}

export default function ActiveProjects({ projects }: ActiveProjectsProps) {
    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'owner':
                return (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        <Crown className="w-3 h-3 mr-1" />
                        Owner
                    </Badge>
                );
            case 'co_lead':
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Shield className="w-3 h-3 mr-1" />
                        Co-Lead
                    </Badge>
                );
            case 'member':
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <User className="w-3 h-3 mr-1" />
                        Member
                    </Badge>
                );
            default:
                return <Badge variant="outline">{role}</Badge>;
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

    const getCategoryColor = (category: string) => {
        const colors = {
            web: 'from-blue-500 to-cyan-500',
            mobile: 'from-purple-500 to-pink-500',
            desktop: 'from-gray-500 to-slate-600',
            ai_ml: 'from-orange-500 to-red-500',
            data_science: 'from-teal-500 to-green-500',
            devops: 'from-indigo-500 to-blue-600',
            design: 'from-pink-500 to-rose-500',
            blockchain: 'from-yellow-500 to-orange-500',
            game_dev: 'from-violet-500 to-purple-600',
            other: 'from-gray-400 to-gray-500',
        };
        return colors[category as keyof typeof colors] || colors.other;
    };

    const getDifficultyBadge = (difficulty: string) => {
        const styles = {
            easy: 'bg-green-100 text-green-800',
            intermediate: 'bg-yellow-100 text-yellow-800',
            advanced: 'bg-red-100 text-red-800',
        };
        return (
            <Badge variant="secondary" className={cn('text-xs', styles[difficulty as keyof typeof styles] || '')}>
                {difficulty}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatProjectType = (type: string) => {
        return type
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (projects.length === 0) {
        return (
            <div className="text-center py-12">
                <Rocket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Active Projects</h3>
                <p className="text-sm text-muted-foreground mb-4">You&apos;re not part of any active projects yet</p>
                <Button asChild>
                    <Link href="/home">Browse Projects</Link>
                </Button>
            </div>
        );
    }

    const activeCount = projects.filter((p) => p.projects.status === 'active').length;
    const pausedCount = projects.filter((p) => p.projects.status === 'paused').length;
    const ownerCount = projects.filter((p) => p.role === 'owner').length;

    return (
        <div className="space-y-4">
            {/* Header with Stats */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Active Projects</h3>
                <div className="flex items-center gap-2">
                    {activeCount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {activeCount} active
                        </Badge>
                    )}
                    {pausedCount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            {pausedCount} paused
                        </Badge>
                    )}
                    {ownerCount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {ownerCount} owned
                        </Badge>
                    )}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {projects.map((project) => {
                    const proj = project.projects;
                    const membershipPercentage = (proj.current_members / proj.max_members) * 100;
                    const isAlmostFull = membershipPercentage >= 80;

                    return (
                        <Card
                            key={project.id}
                            className="border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                        >
                            <CardHeader className="pb-3">
                                {/* Project Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div
                                            className={cn(
                                                'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                                                getCategoryColor(proj.category),
                                            )}
                                        >
                                            <Rocket className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold truncate text-base">{proj.title}</h4>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                {getStatusBadge(proj.status)}
                                                {getRoleBadge(project.role)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Description */}
                                {proj.short_description && (
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                        {proj.short_description}
                                    </p>
                                )}

                                {/* Project Details */}
                                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                    <span className="flex items-center gap-1">
                                        {formatProjectType(proj.project_type)}
                                    </span>
                                    <span>•</span>
                                    {getDifficultyBadge(proj.difficulty)}
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(proj.created_at)}
                                    </span>
                                </div>

                                <Separator />

                                {/* Team Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            Team
                                        </span>
                                        <span className="font-medium">
                                            {proj.current_members} / {proj.max_members}
                                        </span>
                                    </div>
                                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
                                                isAlmostFull ? 'bg-orange-500' : 'bg-blue-500',
                                            )}
                                            style={{ width: `${Math.min(membershipPercentage, 100)}%` }}
                                        />
                                    </div>
                                    {isAlmostFull && proj.status === 'active' && (
                                        <p className="flex items-center gap-1 text-xs text-orange-600">
                                            <AlertCircle className="w-3 h-3" />
                                            Almost full!
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                {/* Actions */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex gap-2">
                                        {proj.github_url && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={proj.github_url} target="_blank" rel="noopener noreferrer">
                                                    <Github className="w-3 h-3 mr-1" />
                                                    GitHub
                                                </a>
                                            </Button>
                                        )}
                                        {proj.project_url && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={proj.project_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                    Live
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link href={`/home/${proj.id}`}>View Project</Link>
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
