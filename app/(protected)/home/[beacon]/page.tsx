import { getBeaconById } from '@/lib/services/beacon';
import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import type { ProjectPageData } from '@/types/project-page';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RealtimeChat } from '@/components/features/chat/realtime-chat';
import { LeaveProjectButton } from '@/components/features/project/LeaveProjectButton';
import { RemoveMemberButton } from '@/components/features/project/RemoveMemberButton';
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
    Info,
    Activity,
    UserMinus,
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
    const { beacon: projectId } = await params;
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

    const { data: rpcData } = (await supabase
        .rpc('get_project_page_data', {
            p_project_id: projectId,
            p_user_id: user.id,
        })
        .single()) as { data: ProjectPageData | null };

    if (!rpcData) {
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

    const beaconData = rpcData.project_data;
    const accessResult = rpcData.user_access[0] || { has_access: false, role: null };
    const projectMembers = rpcData.members || [];
    const projectActivities = rpcData.activities || [];

    const existingMessages: ChatMessage[] = (rpcData.messages || []).map((msg) => ({
        id: msg.id,
        content: msg.content,
        user: {
            name: msg.sender.full_name || msg.sender.username,
            username: msg.sender.username,
        },
        createdAt: msg.created_at,
    }));

    if (!accessResult.has_access) {
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

    const isOwner = beaconData.owner.id === user.id;
    const userRole = accessResult.role;

    const chatUsername = user.user_metadata.user_name || user.email;

    return (
        <div className="max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
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

            {/* Main Content with Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Activity
                            </TabsTrigger>
                            <TabsTrigger value="chat" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Chat
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6 mt-6">
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
                                                {beaconData.tags.map((tag: string, index: number) => (
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
                                                    <span className="text-sm">
                                                        Set up project milestones and timeline
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                                    <UserPlus className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm">
                                                        Review and approve member applications
                                                    </span>
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
                                                    <span className="text-sm">
                                                        Review project goals and requirements
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                                    <Calendar className="h-4 w-4 text-purple-600" />
                                                    <span className="text-sm">
                                                        Check upcoming milestones and deadlines
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Activity Tab */}
                        <TabsContent value="activity" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {projectActivities.length > 0 ? (
                                            projectActivities.map((activity: ProjectPageData['activities'][0]) => {
                                                const getActivityIcon = (type: string) => {
                                                    switch (type) {
                                                        case 'application_submitted':
                                                            return <UserPlus className="h-4 w-4 text-blue-600" />;
                                                        case 'application_accepted':
                                                            return <CheckCircle2 className="h-4 w-4 text-green-600" />;
                                                        case 'application_rejected':
                                                            return <UserMinus className="h-4 w-4 text-red-600" />;
                                                        case 'member_joined':
                                                            return <Users className="h-4 w-4 text-green-600" />;
                                                        case 'member_left':
                                                            return <UserMinus className="h-4 w-4 text-orange-600" />;
                                                        case 'status_changed':
                                                            return <Settings className="h-4 w-4 text-purple-600" />;
                                                        case 'project_created':
                                                            return <Plus className="h-4 w-4 text-blue-600" />;
                                                        default:
                                                            return <Activity className="h-4 w-4 text-gray-600" />;
                                                    }
                                                };

                                                const getActivityMessage = (activity: {
                                                    activity_type: string;
                                                    activity_data: Record<string, unknown>;
                                                    actor: unknown;
                                                }) => {
                                                    const actor = Array.isArray(activity.actor)
                                                        ? activity.actor[0]
                                                        : activity.actor;
                                                    const actorName = actor?.full_name || actor?.username || 'Someone';
                                                    const data = activity.activity_data || {};

                                                    switch (activity.activity_type) {
                                                        case 'application_submitted':
                                                            return `${actorName} applied to join the project`;
                                                        case 'application_accepted':
                                                            return `${
                                                                data.applicant_name || 'A member'
                                                            } was accepted to the project`;
                                                        case 'application_rejected':
                                                            return `An application was rejected`;
                                                        case 'member_joined':
                                                            return `${actorName} joined the project`;
                                                        case 'member_left':
                                                            return `${actorName} left the project`;
                                                        case 'status_changed':
                                                            return `Project status changed from ${data.old_status} to ${data.new_status}`;
                                                        case 'project_created':
                                                            return `Project was created`;
                                                        default:
                                                            return `${actorName} performed an action`;
                                                    }
                                                };

                                                const getBgColor = (type: string) => {
                                                    switch (type) {
                                                        case 'application_submitted':
                                                            return 'bg-blue-50 dark:bg-blue-950';
                                                        case 'application_accepted':
                                                        case 'member_joined':
                                                            return 'bg-green-50 dark:bg-green-950';
                                                        case 'application_rejected':
                                                        case 'member_left':
                                                            return 'bg-red-50 dark:bg-red-950';
                                                        case 'status_changed':
                                                            return 'bg-purple-50 dark:bg-purple-950';
                                                        default:
                                                            return 'bg-gray-50 dark:bg-gray-950';
                                                    }
                                                };

                                                return (
                                                    <div
                                                        key={activity.id}
                                                        className={`flex items-center gap-3 p-3 rounded-lg ${getBgColor(
                                                            activity.activity_type,
                                                        )}`}
                                                    >
                                                        <div className="flex-shrink-0">
                                                            {getActivityIcon(activity.activity_type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium">
                                                                {getActivityMessage(activity)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(activity.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        {(() => {
                                                            const actor = Array.isArray(activity.actor)
                                                                ? activity.actor[0]
                                                                : activity.actor;
                                                            return (
                                                                actor?.avatar_url && (
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage
                                                                            src={actor.avatar_url}
                                                                            alt={actor.full_name || actor.username}
                                                                        />
                                                                        <AvatarFallback className="text-xs">
                                                                            {(actor.full_name ||
                                                                                actor.username ||
                                                                                'U')[0].toUpperCase()}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                )
                                                            );
                                                        })()}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No activity yet</p>
                                                <p className="text-xs">
                                                    Activity will appear here as team members interact with the project
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Chat Tab */}
                        <TabsContent value="chat" className="space-y-6 mt-6">
                            <RealtimeChat
                                roomName={`project-${projectId}`}
                                username={chatUsername}
                                projectId={projectId}
                                messages={existingMessages}
                            />
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings" className="space-y-6 mt-6">
                            {isOwner ? (
                                <>
                                    {/* Project Settings */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Settings className="h-5 w-5" />
                                                Project Settings
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Project Status</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Change project visibility and status
                                                    </p>
                                                </div>
                                                <Badge className="capitalize">{beaconData.status}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Team Size</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Maximum number of team members
                                                    </p>
                                                </div>
                                                <Badge variant="outline">{beaconData.max_members} members</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Remote Friendly</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Allow remote collaboration
                                                    </p>
                                                </div>
                                                <Badge variant={beaconData.remote_friendly ? 'default' : 'secondary'}>
                                                    {beaconData.remote_friendly ? 'Yes' : 'No'}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Project Links */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <ExternalLink className="h-5 w-5" />
                                                Project Links
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Repository</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {beaconData.github_url
                                                            ? 'GitHub repository linked'
                                                            : 'No repository linked'}
                                                    </p>
                                                </div>
                                                {beaconData.github_url ? (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a
                                                            href={beaconData.github_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Github className="h-4 w-4 mr-2" />
                                                            View
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" disabled>
                                                        Add Link
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Live Project</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {beaconData.project_url
                                                            ? 'Live project available'
                                                            : 'No live project linked'}
                                                    </p>
                                                </div>
                                                {beaconData.project_url ? (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a
                                                            href={beaconData.project_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Visit
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" disabled>
                                                        Add Link
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Member Management */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Users className="h-5 w-5" />
                                                Member Management
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-4 border rounded-lg">
                                                <div className="space-y-2">
                                                    {projectMembers.map((member: ProjectPageData['members'][0]) => (
                                                        <div
                                                            key={member.id}
                                                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage
                                                                        src={member.user?.avatar_url || ''}
                                                                        alt={member.user?.full_name || ''}
                                                                    />
                                                                    <AvatarFallback className="text-xs">
                                                                        {member.user?.full_name
                                                                            ?.split(' ')
                                                                            .map((n: string) => n[0])
                                                                            .join('') ||
                                                                            member.user?.username?.[0]?.toUpperCase() ||
                                                                            'U'}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {member.user?.full_name ||
                                                                            member.user?.username}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground capitalize">
                                                                        {member.role}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                                >
                                                                    Change Role
                                                                </Button>
                                                                <RemoveMemberButton
                                                                    projectId={projectId}
                                                                    memberId={member.id}
                                                                    memberName={
                                                                        member.user?.full_name ||
                                                                        member.user?.username ||
                                                                        'Unknown'
                                                                    }
                                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Role Management */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Settings className="h-5 w-5" />
                                                Role & Permissions
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">Project Owner</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Full access to all project features and settings
                                                        </p>
                                                    </div>
                                                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                                        Owner
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">Co-Lead</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Can manage team members and project content
                                                        </p>
                                                    </div>
                                                    <Badge variant="default">Co-Lead</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">Member</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Can participate in project discussions and tasks
                                                        </p>
                                                    </div>
                                                    <Badge variant="secondary">Member</Badge>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                                <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                                                    Custom Permissions
                                                </h4>
                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                    Advanced permission settings will be available in future updates
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Danger Zone */}
                                    <Card className="border-red-200 dark:border-red-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-red-600">
                                                <Settings className="h-5 w-5" />
                                                Danger Zone
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-800 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-red-600">Archive Project</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Hide project from public view
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                >
                                                    Archive
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-800 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-red-600">Delete Project</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Permanently delete this project
                                                    </p>
                                                </div>
                                                <Button variant="destructive" size="sm">
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                <>
                                    {/* Member Settings */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Settings className="h-5 w-5" />
                                                Member Settings
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Project Role</p>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        You are a {userRole} in this project
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" className="capitalize">
                                                    {userRole}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Member Since</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Joined on {new Date().toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant="outline">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    Active
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Leave Project */}
                                    <Card className="border-orange-200 dark:border-orange-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-orange-600">
                                                <UserMinus className="h-5 w-5" />
                                                Leave Project
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                                                <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                                                    You are about to leave this project
                                                </p>
                                                <p className="text-xs text-orange-700 dark:text-orange-300">
                                                    This action cannot be undone. You&apos;ll need to request to join
                                                    again if you want to rejoin.
                                                </p>
                                            </div>
                                            <LeaveProjectButton
                                                projectId={projectId}
                                                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                            />
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
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
                            {/* Project Members */}
                            {projectMembers.map((member: ProjectPageData['members'][0]) => {
                                const isOwner = member.role === 'owner';
                                const isCoLead = member.role === 'co_lead';

                                const bgColor = isOwner ? 'bg-blue-50 dark:bg-blue-950' : 'bg-gray-50 dark:bg-gray-900';

                                const badgeVariant = isOwner ? 'default' : isCoLead ? 'default' : 'secondary';

                                return (
                                    <div
                                        key={member.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg ${bgColor}`}
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
                                            {!isOwner && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Joined {new Date(member.joined_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant={badgeVariant} className="text-xs capitalize">
                                            {member.role}
                                        </Badge>
                                    </div>
                                );
                            })}

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
                                        beaconData.difficulty === 'easy'
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
