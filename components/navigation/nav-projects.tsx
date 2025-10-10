'use client';

import { Folder } from 'lucide-react';
import Link from 'next/link';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAllUserProjects } from '@/hooks/useProjects';

export function NavProjects() {
    const { data: allProjects = [] } = useAllUserProjects();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {allProjects.map((project) => {
                    return (
                        <SidebarMenuItem key={project.id}>
                            <SidebarMenuButton asChild>
                                <Link href={`/home/${project.id}`}>
                                    <Folder />
                                    <span className="truncate">{project.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
                {/* <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/home">
                            <Plus />
                            <span>Create Project</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem> */}
            </SidebarMenu>
        </SidebarGroup>
    );
}
