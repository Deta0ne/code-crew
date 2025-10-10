'use server';

import { createClient } from "@/lib/supabase/server";

export async function getOwnerProjects() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return [];
    }

    const { data, error } = await supabase.from('projects').select('*').eq('owner_id', user.id).eq('status', 'active');
    
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data;
}

export async function getMemberProjects() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from('project_members')
        .select(`
            project:projects(
                id,
                title,
                status,
                project_type,
                category,
                difficulty,
                max_members,
                current_members,
                view_count,
                application_count,
                bookmark_count,
                is_beginner_friendly,
                mentoring_available,
                remote_friendly,
                github_url,
                project_url,
                image_url,
                description,
                short_description,
                type_specific_data,
                tags,
                created_at,
                updated_at,
                search_vector
            )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
    
    if (error) {
        console.error('Error fetching member projects:', error);
        return [];
    }
    
    return (data || [])
        .map(item => Array.isArray(item.project) ? item.project[0] : item.project)
        .filter(project => project && project.status === 'active');
}

export async function getAllUserProjects() {
    const [ownerProjects, memberProjects] = await Promise.all([
        getOwnerProjects(),
        getMemberProjects()
    ]);
    
    const allProjects = [...ownerProjects];
    const ownerProjectIds = new Set(ownerProjects.map(p => p.id));
    
    memberProjects.forEach(project => {
        if (!ownerProjectIds.has(project.id)) {
            allProjects.push(project);
        }
    });
    
    return allProjects.sort((a, b) => a.title.localeCompare(b.title));
}