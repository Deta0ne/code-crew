'use client';

import * as React from 'react';
import {
    Bot,
    Command,
    Frame,
    Grid,
    Home,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
} from 'lucide-react';

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
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types/database';
import { usePathname } from 'next/navigation';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth();

    const { data: userProfile, isLoading, isError } = useUser(user?.id);
    const pathname = usePathname();

    if (isLoading && !userProfile) {
        return <div>Profil bilgileri yükleniyor...</div>;
    }

    if (isError) {
        return <div>Bir hata oluştu.</div>;
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
        projects: [
            {
                name: 'Design Engineering',
                url: '#',
                icon: Frame,
            },
            {
                name: 'Sales & Marketing',
                url: '#',
                icon: PieChart,
            },
            {
                name: 'Travel',
                url: '#',
                icon: Map,
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
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userProfile || ({} as UserProfile)} />
            </SidebarFooter>
        </Sidebar>
    );
}
