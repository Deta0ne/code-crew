import { createClient } from '@/lib/supabase/server';
import type { ProjectApplication, ProjectBookmark, ActiveProject } from '@/components/features/dashboard/types';

/**
 * Fetch applications to user's own projects (as owner)
 */
export async function getOwnerApplications(userId: string) {
    const supabase = await createClient();

    const { data } = await supabase
        .from('project_applications')
        .select(
            `
            *,
            projects!inner(
                id,
                title,
                owner_id
            ),
            developer_roles (
                name
            )
        `,
        )
        .eq('projects.owner_id', userId);

    return (data || []) as ProjectApplication[];
}

/**
 * Fetch user's own applications (as applicant)
 */
export async function getApplicantApplications(userId: string) {
    const supabase = await createClient();

    const { data } = await supabase.from('project_applications').select('*').eq('applicant_id', userId);

    return (data || []) as ProjectApplication[];
}

/**
 * Fetch user's bookmarked projects
 */
export async function getUserBookmarks(userId: string) {
    const supabase = await createClient();

    const { data } = await supabase.from('project_bookmarks').select('*').eq('user_id', userId);

    return (data || []) as ProjectBookmark[];
}

/**
 * Fetch active projects (where user is a member)
 */
export async function getActiveProjects(userId: string) {
    const supabase = await createClient();

    const { data } = await supabase
        .from('project_members')
        .select(
            `
            id,
            project_id,
            user_id,
            role,
            is_active,
            joined_at,
            last_activity_at,
            projects (
                id,
                title,
                status,
                project_type,
                category,
                difficulty,
                current_members,
                max_members,
                github_url,
                project_url,
                short_description,
                created_at
            )
        `,
        )
        .eq('user_id', userId)
        .eq('is_active', true)
        .is('left_at', null);

    // Transform the data to match ActiveProject type
    return (
        data?.map((member) => ({
            ...member,
            projects: Array.isArray(member.projects) ? member.projects[0] : member.projects,
        })) || []
    ) as ActiveProject[];
}

