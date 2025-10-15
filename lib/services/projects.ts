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
        .is('left_at', null);
    
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

export async function leaveProject(projectId: string) {
    const supabase = await createClient();
    
    // Input validation
    if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID');
    }
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Authentication required');
    }

    // Check if user is a member with single optimized query
    const { data: membership, error: membershipError } = await supabase
        .from('project_members')
        .select('id, role, project_id, left_at')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .is('left_at', null)
        .single();

    if (membershipError || !membership) {
        throw new Error('You are not a member of this project or have already left');
    }

    // Owner cannot leave their own project
    if (membership.role === 'owner') {
        throw new Error('Project owners cannot leave their own project');
    }

    const { error: updateError } = await supabase
        .from('project_members')
        .update({ 
            left_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', membership.id)
        .eq('user_id', user.id)
        .eq('project_id', projectId);

    if (updateError) {
        console.error('Update error details:', updateError);
        throw new Error('Failed to leave project');
    }

    return { success: true };
}

export async function removeMemberFromProject(projectId: string, memberId: string) {
    const supabase = await createClient();
    
    // Input validation
    if (!projectId || !memberId || typeof projectId !== 'string' || typeof memberId !== 'string') {
        throw new Error('Invalid project ID or member ID');
    }

    // Get current user (must be project owner)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Authentication required');
    }

    // Single query to verify ownership and get member info (performance optimization)
    const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
            id,
            owner_id,
            project_members!inner(
                id,
                role,
                user_id,
                left_at
            )
        `)
        .eq('id', projectId)
        .eq('project_members.id', memberId)
        .is('project_members.left_at', null)
        .single();

    if (projectError || !projectData) {
        throw new Error('Project or member not found');
    }

    // Security checks
    if (projectData.owner_id !== user.id) {
        throw new Error('Only project owners can remove members');
    }

    const member = Array.isArray(projectData.project_members) 
        ? projectData.project_members[0] 
        : projectData.project_members;

    if (!member) {
        throw new Error('Member not found or already left');
    }

    // Cannot remove owner or self-removal through this function
    if (member.role === 'owner') {
        throw new Error('Cannot remove project owner');
    }

    if (member.user_id === user.id) {
        throw new Error('Use leave project function to remove yourself');
    }

    const { error: updateError } = await supabase
        .from('project_members')
        .update({ 
            is_active: false,
            left_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', memberId)
        .eq('project_id', projectId) 
        .eq('is_active', true); 

    if (updateError) {
        console.error('Error removing member:', updateError);
        throw new Error('Failed to remove member from project');
    }

    return { success: true };
}