'use client';

import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/app-sidebar';
import { SiteHeader } from '@/components/navigation/site-header';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerProjects } from '@/hooks/useProjects';

export function LayoutWrapper({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { data: userProfile, isLoading: isUserLoading } = useUser(user?.id);
    const { data: projects, isLoading: isProjectsLoading } = useOwnerProjects();

    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <AppSidebar
                        userProfile={userProfile}
                        projects={projects || []}
                        isLoading={isUserLoading || isProjectsLoading}
                    />
                    <SidebarInset className="overflow-hidden">
                        <div className="flex flex-1 flex-col overflow-y-auto p-4 pt-0">{children}</div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
