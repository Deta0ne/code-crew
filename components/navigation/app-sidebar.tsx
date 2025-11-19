'use client';

import * as React from 'react';
import Link from 'next/link';
import { IconHome, IconSearch, IconBell, IconInnerShadowTop, IconFolder, IconSettings } from '@tabler/icons-react';

import { NavDocuments } from '@/components/navigation/nav-documents';
import { NavMain } from '@/components/navigation/nav-main';
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
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useAllUserProjects } from '@/hooks/useProjects';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth();
    const { data: userProfile } = useUser(user?.id);
    const { data: projects = [], isLoading: isProjectsLoading } = useAllUserProjects();

    const navMainItems = [
        {
            title: 'Home',
            url: '/home',
            icon: IconHome,
        },
        {
            title: 'Search',
            url: '/search',
            icon: IconSearch,
        },
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: IconBell,
        },
    ];

    const navSecondaryItems = [
        {
            title: 'Settings',
            url: '/settings',
            icon: IconSettings,
        },
    ];

    const projectItems = projects.slice(0, 5).map((project) => ({
        name: project.title,
        url: `/home/${project.id}`,
        icon: IconFolder,
    }));

    const userData = userProfile
        ? {
              name: userProfile.full_name || userProfile.username,
              email: user?.email || '',
              avatar: userProfile.avatar_url || '',
              username: userProfile.username,
          }
        : {
              name: user?.email || 'User',
              email: user?.email || '',
              avatar: '',
              username: '',
          };

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <Link href="/home">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">CodeCrev</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMainItems} />
                {!isProjectsLoading && projectItems.length > 0 && <NavDocuments items={projectItems} />}
                <NavSecondary items={navSecondaryItems} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    );
}
