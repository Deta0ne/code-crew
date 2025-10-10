'use client';

import * as React from 'react';
import { Bot, Command, Grid, Home, LifeBuoy, Send, Settings2 } from 'lucide-react';

import { NavMain } from '@/components/navigation/nav-main';
import { NavProjects } from '@/components/navigation/nav-projects';
import { NavSecondary } from '@/components/navigation/nav-secondary';
import { NavUser } from '@/components/navigation/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserProfile } from '@/types/database';
import { usePathname } from 'next/navigation';

type Project = {
    id: string;
    title: string;
    status: string;
    project_type: string;
    category: string;
    difficulty: string;
    max_members: number;
    current_members: number;
    view_count: number;
    application_count: number;
    bookmark_count: number;
    is_beginner_friendly: boolean;
    mentoring_available: boolean;
    remote_friendly: boolean;
    github_url: string | null;
    project_url: string | null;
    image_url: string | null;
    description: string;
    short_description: string | null;
    type_specific_data: Record<string, unknown>;
    tags: string[];
    created_at: string;
    updated_at: string;
    search_vector: string | null;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    userProfile?: UserProfile;
    isLoading?: boolean;
};

export function AppSidebar({ userProfile, isLoading, ...props }: AppSidebarProps) {
    const pathname = usePathname();

    if (isLoading && !userProfile) {
        return <div>Loading...</div>;
    }

    if (!userProfile) {
        return <div>An error occurred.</div>;
    }

    const data = {
        user: {
            name: 'shadcn',
            email: 'm@example.com',
            avatar: '/avatars/shadcn.jpg',
        },
        navMain: [
            {
                title: 'Home',
                url: '/home',
                icon: Home,
                isActive: pathname === '/home',
            },
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: Grid,
                isActive: pathname === '/dashboard',
            },
            {
                title: 'Profile',
                url: '#',
                icon: Bot,
            },

            {
                title: 'Settings',
                url: '#',
                icon: Settings2,
                items: [
                    {
                        title: 'General',
                        url: '#',
                    },
                    {
                        title: 'Team',
                        url: '#',
                    },
                    {
                        title: 'Billing',
                        url: '#',
                    },
                    {
                        title: 'Limits',
                        url: '#',
                    },
                ],
            },
        ],
        navSecondary: [
            {
                title: 'Support',
                url: '#',
                icon: LifeBuoy,
            },
            {
                title: 'Feedback',
                url: '#',
                icon: Send,
            },
        ],
    };
    return (
        <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Code Crew</span>
                                    <span className="truncate text-xs">Demo</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userProfile} />
            </SidebarFooter>
        </Sidebar>
    );
}
