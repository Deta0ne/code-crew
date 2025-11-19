'use server';

import { createClient } from '@/lib/supabase/server';
import { applicationSchema, type ApplicationInput } from '@/lib/validations/application';

export async function submitApplication(input: ApplicationInput) {
    try {
        // 1. Validate input data
        const validationResult = applicationSchema.safeParse(input);
        if (!validationResult.success) {
            return {
                success: false,
                error: 'Invalid form data',
                details: validationResult.error.issues,
            };
        }

        const validatedData = validationResult.data;

        // 2. Get authenticated user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return {
                success: false,
                error: 'Authentication required',
            };
        }

        // 3. Input validation
        if (!validatedData.project_id || typeof validatedData.project_id !== 'string') {
            return {
                success: false,
                error: 'Invalid project ID',
            };
        }

        // 4. Single optimized query to check both application and membership status
        const [applicationCheck, membershipCheck] = await Promise.all([
            supabase
                .from('project_applications')
                .select('id, status')
                .eq('project_id', validatedData.project_id)
                .eq('applicant_id', user.id)
                .eq('status', 'pending')
                .maybeSingle(),
            supabase
                .from('project_members')
                .select('id')
                .eq('project_id', validatedData.project_id)
                .eq('user_id', user.id)
                .is('left_at', null)
                .maybeSingle()
        ]);

        if (applicationCheck.data) {
            return {
                success: false,
                error: 'You have a pending application for this project',
            };
        }

        if (membershipCheck.data) {
            return {
                success: false,
                error: 'You are already a member of this project',
            };
        }
        // Fetch user profile data
        const { data: user_profile } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();

        // 5. Prepare application data
        const applicationData = {
            project_id: validatedData.project_id,
            applicant_id: user.id,
            applied_role_id: validatedData.applied_role_id || null,
            applicant_name: user_profile?.username,
            motivation_message: validatedData.motivation_message,
            what_they_bring: validatedData.what_they_bring || null,
            what_they_want_to_learn: validatedData.what_they_want_to_learn || null,
            hours_per_week: validatedData.hours_per_week || null,
            timezone: validatedData.timezone || null,
            portfolio_url: validatedData.portfolio_url || null,
            github_url: validatedData.github_url || null,
            status: 'pending' as const,
            owner_username: validatedData.owner_username || null,
        };

        // 6. Insert application into database
        const { data: application, error: insertError } = await supabase
            .from('project_applications')
            .insert([applicationData])
            .select('id')
            .single();

        if (insertError) {
            console.error('Database insertion error:', insertError);
            return {
                success: false,
                error: 'Failed to submit application',
                details: insertError.message,
            };
        }

        return {
            success: true,
            data: {
                id: application.id,
                message: 'Application submitted successfully!',
            },
        };

    } catch (error) {
        console.error('Unexpected error submitting application:', error);
        return {
            success: false,
            error: 'An unexpected error occurred',
        };
    }
}

export async function getUserApplications(userId?: string) {
    const supabase = await createClient();
    
    // If no userId provided, get current user
    if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        userId = user.id;
    }

    const { data, error } = await supabase
        .from('project_applications')
        .select(`
            id,
            status,
            motivation_message,
            created_at,
            project:projects(
                id,
                title,
                project_type,
                owner:users(username, full_name)
            )
        `)
        .eq('applicant_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user applications:', error);
        return [];
    }

    return data || [];
}

export async function getProjectApplications(projectId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('project_applications')
        .select(`
            id,
            status,
            motivation_message,
            what_they_bring,
            what_they_want_to_learn,
            hours_per_week,
            timezone,
            portfolio_url,
            github_url,
            owner_username,
            created_at,
            applicant:users(
                id,
                username,
                full_name,
                avatar_url,
                experience_level
            )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching project applications:', error);
        return [];
    }

    return data || [];
}

export async function deleteApplication(applicationId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('project_applications').delete().eq('id', applicationId);
    console.log('applicationId', applicationId);
    if (error) {
        console.error('Error deleting application:', error);
        return { success: false, error: 'Failed to delete application' };
    }
    return { success: true, message: 'Application deleted successfully' };
}

export async function acceptApplication(applicationId: string, reviewNotes?: string) {
    try {
        const supabase = await createClient();
        
        // Get current user (project owner)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'Authentication required' };
        }

        // Get application details
        const { data: application, error: fetchError } = await supabase
            .from('project_applications')
            .select('*, projects(*)')
            .eq('id', applicationId)
            .single();

        if (fetchError || !application) {
            return { success: false, error: 'Application not found' };
        }

        // Verify user is project owner
        if (application.projects.owner_id !== user.id) {
            return { success: false, error: 'Unauthorized: You are not the project owner' };
        }

        // Check if project has available spots
        if (application.projects.current_members >= application.projects.max_members) {
            return { success: false, error: 'Project is full' };
        }

        // Start transaction: Update application and add member
        const { error: updateError } = await supabase
            .from('project_applications')
            .update({
                status: 'accepted',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
                review_notes: reviewNotes || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (updateError) {
            return { success: false, error: 'Failed to update application status' };
        }

        // Check if user was previously a member (left before)
        const { data: previousMember } = await supabase
            .from('project_members')
            .select('id')
            .eq('project_id', application.project_id)
            .eq('user_id', application.applicant_id)
            .single();

        let memberError;
        
        if (previousMember) {
            // User was previously a member, update their record
            const { error } = await supabase
                .from('project_members')
                .update({
                    assigned_role_id: application.applied_role_id,
                    role: 'member',
                    is_active: true,
                    left_at: null,
                    joined_at: new Date().toISOString(),
                    last_activity_at: new Date().toISOString()
                })
                .eq('id', previousMember.id);
            memberError = error;
        } else {
            // New member, insert new record
            const { error } = await supabase
                .from('project_members')
                .insert({
                    project_id: application.project_id,
                    user_id: application.applicant_id,
                    assigned_role_id: application.applied_role_id,
                    role: 'member',
                    is_active: true,
                    left_at: null,
                    joined_at: new Date().toISOString(),
                    last_activity_at: new Date().toISOString()
                });
            memberError = error;
        }

        if (memberError) {
            // Rollback application status if member insertion fails
            await supabase
                .from('project_applications')
                .update({
                    status: 'pending',
                    reviewed_at: null,
                    reviewed_by: null,
                    review_notes: null
                })
                .eq('id', applicationId);
            
            return { success: false, error: 'Failed to add member to project' };
        }

        return { 
            success: true, 
            message: 'Application accepted successfully! User has been added to the project.' 
        };

    } catch (error) {
        console.error('Error accepting application:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function rejectApplication(applicationId: string, reviewNotes?: string) {
    try {
        const supabase = await createClient();
        
        // Get current user (project owner)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'Authentication required' };
        }

        // Get application details
        const { data: application, error: fetchError } = await supabase
            .from('project_applications')
            .select('*, projects(*)')
            .eq('id', applicationId)
            .single();

        if (fetchError || !application) {
            return { success: false, error: 'Application not found' };
        }

        // Verify user is project owner
        if (application.projects.owner_id !== user.id) {
            return { success: false, error: 'Unauthorized: You are not the project owner' };
        }

        // Update application status
        const { error: updateError } = await supabase
            .from('project_applications')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
                review_notes: reviewNotes || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (updateError) {
            return { success: false, error: 'Failed to update application status' };
        }

        return { 
            success: true, 
            message: 'Application rejected successfully.' 
        };

    } catch (error) {
        console.error('Error rejecting application:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}