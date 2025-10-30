'use server';

import { createClient } from '@/lib/supabase/server';

export async function removeBookmark(bookmarkId: string) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'Authentication required' };
        }

        // Delete bookmark (RLS will ensure user can only delete their own)
        const { error: deleteError } = await supabase
            .from('project_bookmarks')
            .delete()
            .eq('id', bookmarkId)
            .eq('user_id', user.id);

        if (deleteError) {
            console.error('Error deleting bookmark:', deleteError);
            return { success: false, error: 'Failed to remove bookmark' };
        }

        return { 
            success: true, 
            message: 'Bookmark removed successfully' 
        };

    } catch (error) {
        console.error('Error removing bookmark:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Toggle bookmark for a project (add if not exists, remove if exists)
 * Returns the new bookmarked state
 * Used in beacon cards and project detail pages
 */
export async function toggleBookmark(projectId: string) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'Authentication required' };
        }

        // Check if bookmark exists
        const { data: existingBookmark } = await supabase
            .from('project_bookmarks')
            .select('id')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existingBookmark) {
            // Remove bookmark
            const { error: deleteError } = await supabase
                .from('project_bookmarks')
                .delete()
                .eq('id', existingBookmark.id);

            if (deleteError) {
                return { success: false, error: 'Failed to remove bookmark' };
            }

            return { 
                success: true, 
                bookmarked: false,
                message: 'Bookmark removed' 
            };
        } else {
            // Get project details
            const { data: project } = await supabase
                .from('projects')
                .select('title, project_type, status')
                .eq('id', projectId)
                .single();

            if (!project) {
                return { success: false, error: 'Project not found' };
            }

            // Add bookmark
            const { error: insertError } = await supabase
                .from('project_bookmarks')
                .insert({
                    project_id: projectId,
                    user_id: user.id,
                    title: project.title,
                    project_type: project.project_type,
                    status: project.status
                });

            if (insertError) {
                return { success: false, error: 'Failed to add bookmark' };
            }

            return { 
                success: true, 
                bookmarked: true,
                message: 'Project bookmarked' 
            };
        }

    } catch (error) {
        console.error('Error toggling bookmark:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Remove bookmark by project ID (alternative to removeBookmark)
 * Used for backward compatibility with beacon.ts
 */
export async function deleteBookmark(projectId: string) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'Authentication required' };
        }

        // Delete bookmark by project_id
        const { error: deleteError } = await supabase
            .from('project_bookmarks')
            .delete()
            .eq('project_id', projectId)
            .eq('user_id', user.id);

        if (deleteError) {
            console.error('Error deleting bookmark:', deleteError);
            return { success: false, error: `Bookmark deletion failed: ${deleteError.message}` };
        }

        return { 
            success: true, 
            message: 'Bookmark deleted successfully' 
        };

    } catch (error) {
        console.error('Error deleting bookmark:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Create/add bookmark for a project
 * Used for backward compatibility with beacon.ts
 */
export async function createBookmark(beacon: { 
    id: string; 
    title: string; 
    project_type: string; 
    status: string;
}) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'Authentication required' };
        }

        // Check if bookmark already exists
        const { data: existingBookmark } = await supabase
            .from('project_bookmarks')
            .select('id')
            .eq('project_id', beacon.id)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existingBookmark) {
            return { success: false, error: 'Bookmark already exists' };
        }

        // Insert bookmark
        const { error: insertError } = await supabase
            .from('project_bookmarks')
            .insert({
                project_id: beacon.id,
                user_id: user.id,
                title: beacon.title,
                project_type: beacon.project_type,
                status: beacon.status,
            });

        if (insertError) {
            console.error('Error creating bookmark:', insertError);
            return { success: false, error: `Bookmark creation failed: ${insertError.message}` };
        }

        return { 
            success: true, 
            message: 'Bookmark created successfully' 
        };

    } catch (error) {
        console.error('Error creating bookmark:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
