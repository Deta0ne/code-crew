import { getBeaconById, checkUserProjectAccess, getProjectMembers } from '@/lib/services/beacon';
import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Users,
    Calendar,
    Settings,
    MessageSquare,
    CheckCircle2,
    Clock,
    Target,
    Github,
    ExternalLink,
    Plus,
    UserPlus,
} from 'lucide-react';

type Props = {
    params: { beacon: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { beacon } = await params;
    const beaconData = await getBeaconById(beacon);

    return {
        title: beaconData?.title || 'Beacon',
        description: beaconData?.description,
        other: {
            'beacon-title': beaconData?.title || 'Beacon',
        },
    };
}

export default async function BeaconPage({ params }: Props) {
    const { beacon } = await params;
    const beaconData = await getBeaconById(beacon);

    if (!beaconData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Project Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        The project you&apos;re looking for doesn&apos;t exist.
                    </p>
                </div>
            </div>
        );
    }

    // Check user access
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Please log in to access this project.</p>
                </div>
            </div>
        );
    }

    const accessResult = await checkUserProjectAccess(beacon, user.id);

    if (!accessResult.hasAccess) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        You don&apos;t have permission to access this project. You need to be a member or the owner.
                    </p>
                    <Button className="mt-4" asChild>
                        <a href={`/home`}>Back to Home</a>
                    </Button>
                </div>
            </div>
        );
    }

    const isOwner = accessResult.role === 'owner';
    const userRole = accessResult.role;

    // Get project members
    const projectMembers = await getProjectMembers(beacon);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-4">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Welcome to {beaconData.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {isOwner
                                ? 'Manage your project and collaborate with your team'
                                : userRole === 'co_lead'
                                ? 'You&apos;re a co-lead of this project! Help manage the team.'
                                : 'You&apos;re now part of this amazing project!'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="capitalize">
                            {beaconData.project_type}
                        </Badge>
                        <Badge
                            className={
                                beaconData.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-800'
                            }
                        >
                            {beaconData.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Button variant="outline" className="h-20 flex-col gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    <span className="text-sm">Team Chat</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span className="text-sm">Schedule</span>
                                </Button>
                                {beaconData.github_url && (
                                    <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                                        <a href={beaconData.github_url} target="_blank" rel="noopener noreferrer">
                                            <Github className="h-5 w-5" />
                                            <span className="text-sm">Repository</span>
                                        </a>
                                    </Button>
                                )}
                                {isOwner && (
                                    <Button variant="outline" className="h-20 flex-col gap-2">
                                        <Settings className="h-5 w-5" />
                                        <span className="text-sm">Settings</span>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {beaconData.description}
                                </p>
                            </div>

                            {beaconData.tags && beaconData.tags.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Technologies</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {beaconData.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="text-sm">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                Next Steps
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {isOwner ? (
                                    <>
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm">Set up project milestones and timeline</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                            <UserPlus className="h-4 w-4 text-green-600" />
                                            <span className="text-sm">Review and approve member applications</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                            <MessageSquare className="h-4 w-4 text-purple-600" />
                                            <span className="text-sm">Create team communication channels</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm">Introduce yourself to the team</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                            <Target className="h-4 w-4 text-green-600" />
                                            <span className="text-sm">Review project goals and requirements</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                            <Calendar className="h-4 w-4 text-purple-600" />
                                            <span className="text-sm">Check upcoming milestones and deadlines</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Team Members */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Team Members
                                </span>
                                <Badge variant="outline">
                                    {beaconData.current_members}/{beaconData.max_members}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Project Owner */}
                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={beaconData.owner.avatar_url || ''}
                                        alt={beaconData.owner.full_name || ''}
                                    />
                                    <AvatarFallback>
                                        {beaconData.owner.full_name
                                            ?.split(' ')
                                            .map((n) => n[0])
                                            .join('') || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{beaconData.owner.full_name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Project Owner</p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    Owner
                                </Badge>
                            </div>

                            {/* Project Members */}
                            {projectMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={member.user?.avatar_url || ''}
                                            alt={member.user?.full_name || ''}
                                        />
                                        <AvatarFallback>
                                            {member.user?.full_name
                                                ?.split(' ')
                                                .map((n: string) => n[0])
                                                .join('') ||
                                                member.user?.username?.[0]?.toUpperCase() ||
                                                'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            {member.user?.full_name || member.user?.username}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {member.developer_role?.name || 'Member'} • Joined{' '}
                                            {new Date(member.joined_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={member.role === 'co_lead' ? 'default' : 'secondary'}
                                        className="text-xs capitalize"
                                    >
                                        {member.role === 'co_lead' ? 'Co-Lead' : 'Member'}
                                    </Badge>
                                </div>
                            ))}

                            {/* Add more members placeholder */}
                            {beaconData.current_members < beaconData.max_members && (
                                <div className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <Plus className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {beaconData.max_members - beaconData.current_members} more spots available
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Project Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                                <Badge
                                    className={
                                        beaconData.difficulty === 'beginner'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : beaconData.difficulty === 'intermediate'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }
                                >
                                    {beaconData.difficulty}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                                <Badge variant="outline" className="capitalize">
                                    {beaconData.category}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Remote Friendly</span>
                                <Badge variant={beaconData.remote_friendly ? 'default' : 'secondary'}>
                                    {beaconData.remote_friendly ? 'Yes' : 'No'}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                                <span className="text-sm font-medium">
                                    {new Date(beaconData.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Links */}
                    {(beaconData.github_url || beaconData.project_url) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {beaconData.github_url && (
                                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                        <a href={beaconData.github_url} target="_blank" rel="noopener noreferrer">
                                            <Github className="h-4 w-4 mr-2" />
                                            Repository
                                        </a>
                                    </Button>
                                )}
                                {beaconData.project_url && (
                                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                        <a href={beaconData.project_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Live Project
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
