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

export function NavProjects({ projects }: { projects: Project[] }) {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                        <SidebarMenuButton asChild>
                            <Link href={`/home/${project.id}`}>
                                <Folder className="size-4" />
                                <span className="truncate">{project.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
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
