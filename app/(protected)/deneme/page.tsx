'use client';

import { Briefcase, GraduationCap, Code2, Lightbulb, BookOpen, Rocket } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// Icon mapping for different project types
const iconMap = {
    portfolio: Briefcase,
    learning: GraduationCap,
    opensource: Code2,
    research: Lightbulb,
    tutorial: BookOpen,
    hackathon: Rocket,
} as const;

// Gradient backgrounds for each type
const gradientMap = {
    portfolio: 'from-blue-500/20 via-cyan-500/20 to-blue-600/20',
    learning: 'from-purple-500/20 via-pink-500/20 to-purple-600/20',
    opensource: 'from-green-500/20 via-emerald-500/20 to-green-600/20',
    research: 'from-yellow-500/20 via-orange-500/20 to-yellow-600/20',
    tutorial: 'from-red-500/20 via-rose-500/20 to-red-600/20',
    hackathon: 'from-indigo-500/20 via-violet-500/20 to-indigo-600/20',
} as const;

// Progress bar gradients (full opacity)
const progressGradientMap = {
    portfolio: 'from-blue-500 via-cyan-500 to-blue-600',
    learning: 'from-purple-500 via-pink-500 to-purple-600',
    opensource: 'from-green-500 via-emerald-500 to-green-600',
    research: 'from-yellow-500 via-orange-500 to-yellow-600',
    tutorial: 'from-red-500 via-rose-500 to-red-600',
    hackathon: 'from-indigo-500 via-violet-500 to-indigo-600',
} as const;

const iconColorMap = {
    portfolio: 'text-blue-600 dark:text-blue-400',
    learning: 'text-purple-600 dark:text-purple-400',
    opensource: 'text-green-600 dark:text-green-400',
    research: 'text-yellow-600 dark:text-yellow-400',
    tutorial: 'text-red-600 dark:text-red-400',
    hackathon: 'text-indigo-600 dark:text-indigo-400',
} as const;

interface ProjectCardProps {
    type: keyof typeof iconMap;
    title: string;
    description: string;
    level?: string;
    currentMembers: number;
    maxMembers: number;
    members?: Array<{
        id: string;
        name: string;
        avatar?: string;
    }>;
    className?: string;
}

function ProjectCard({
    type,
    title,
    description,
    level = 'Beginner',
    currentMembers,
    maxMembers,
    members = [],
    className,
}: ProjectCardProps) {
    const Icon = iconMap[type];
    const gradient = gradientMap[type];
    const progressGradient = progressGradientMap[type];
    const iconColor = iconColorMap[type];

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl',
                'transition-all duration-500 ease-out hover:border-border hover:shadow-2xl hover:shadow-primary/5',
                'hover:-translate-y-1 hover:scale-[1.02] cursor-pointer',
                className,
            )}
        >
            {/* Decorative rotated icon in the background */}
            <div className="absolute -right-8 -top-8 opacity-[0.07] transition-all duration-500 group-hover:opacity-[0.12] group-hover:scale-110">
                <Icon className={cn('h-40 w-40 rotate-[25deg]', iconColor)} strokeWidth={1.5} />
            </div>

            {/* Gradient overlay - animated on hover */}
            <div
                className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                    gradient,
                )}
            />

            {/* Content */}
            <div className="relative flex flex-col">
                <div className="p-6 space-y-5">
                    {/* Header: Icon + Badges */}
                    <div className="flex items-start justify-between gap-3">
                        {/* Dynamic Icon Background */}
                        <div
                            className={cn(
                                'relative flex h-14 w-14 items-center justify-center rounded-xl',
                                'bg-gradient-to-br shadow-lg transition-all duration-500',
                                'group-hover:scale-110 group-hover:shadow-xl',
                                gradient,
                            )}
                        >
                            <div className="absolute inset-0 rounded-xl bg-background/40 backdrop-blur-sm" />
                            <Icon
                                className={cn(
                                    'relative h-7 w-7 transition-transform duration-500 group-hover:scale-110',
                                    iconColor,
                                )}
                            />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 justify-end">
                            <Badge
                                variant="secondary"
                                className="rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm bg-background/80 border border-border/50"
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm bg-background/60"
                            >
                                {level}
                            </Badge>
                        </div>
                    </div>

                    {/* Title & Description - Fixed height */}
                    <div className="space-y-2 min-h-[100px]">
                        <h3 className="text-xl font-semibold tracking-tight line-clamp-2 transition-colors group-hover:text-primary">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{description}</p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    {/* Footer: Members & Count - Fixed height */}
                    <div className="flex items-center justify-between">
                        {/* Avatar Stack */}
                        <div className="flex -space-x-3">
                            {members.slice(0, 3).map((member, index) => (
                                <Avatar
                                    key={member.id}
                                    className={cn(
                                        'h-9 w-9 border-2 border-background ring-2 ring-background/50',
                                        'transition-all duration-300 hover:z-10 hover:scale-110 hover:ring-primary/50',
                                    )}
                                    style={{ zIndex: members.length - index }}
                                >
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-primary/10">
                                        {member.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                            {members.length > 3 && (
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-muted ring-2 ring-background/50 text-xs font-medium"
                                    style={{ zIndex: 0 }}
                                >
                                    +{members.length - 3}
                                </div>
                            )}
                        </div>

                        {/* Member Count Badge */}
                        <div className="text-sm font-medium bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
                            <span className="text-foreground">{currentMembers}</span>
                            <span className="text-muted-foreground">/{maxMembers}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full-width Progress Bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted/50 overflow-hidden rounded-b-2xl">
                <Progress
                    className={cn('h-full bg-gradient-to-r transition-all duration-500', progressGradient)}
                    style={{ width: `${(currentMembers / maxMembers) * 100}%` }}
                />
            </div>

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out">
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </div>
        </div>
    );
}

// Demo page with examples
export default function DenemePage() {
    const demoMembers = [
        { id: '1', name: 'Alice Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
        { id: '2', name: 'Bob Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
        { id: '3', name: 'Carol White', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
        { id: '4', name: 'David Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-3 pb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Project Cards</h1>
                    <p className="text-muted-foreground text-lg">Minimal. Modern. Beautiful.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProjectCard
                        type="portfolio"
                        title="Personal Portfolio Website"
                        description="Build a stunning portfolio to showcase your work and skills. Perfect for developers, designers, and creators."
                        level="Beginner"
                        currentMembers={2}
                        maxMembers={3}
                        members={demoMembers.slice(0, 2)}
                    />

                    <ProjectCard
                        type="learning"
                        title="Learn React & TypeScript"
                        description="Master modern web development with React, TypeScript, and Next.js through hands-on projects."
                        level="Intermediate"
                        currentMembers={4}
                        maxMembers={5}
                        members={demoMembers}
                    />

                    <ProjectCard
                        type="opensource"
                        title="Open Source Contribution"
                        description="Contribute to popular open source projects and make an impact in the developer community."
                        level="Advanced"
                        currentMembers={3}
                        maxMembers={4}
                        members={demoMembers.slice(0, 3)}
                    />

                    <ProjectCard
                        type="hackathon"
                        title="AI Hackathon Challenge"
                        description="Build an innovative AI-powered application in 48 hours. Win prizes and gain recognition."
                        level="Intermediate"
                        currentMembers={1}
                        maxMembers={4}
                        members={demoMembers.slice(0, 1)}
                    />

                    <ProjectCard
                        type="research"
                        title="Machine Learning Research"
                        description="Explore cutting-edge ML algorithms and publish your findings in academic journals."
                        level="Advanced"
                        currentMembers={2}
                        maxMembers={3}
                        members={demoMembers.slice(0, 2)}
                    />

                    <ProjectCard
                        type="tutorial"
                        title="Web Dev Tutorial Series"
                        description="Create comprehensive tutorials to help beginners learn web development fundamentals."
                        level="Beginner"
                        currentMembers={3}
                        maxMembers={5}
                        members={demoMembers.slice(0, 3)}
                    />
                </div>
            </div>
        </div>
    );
}
