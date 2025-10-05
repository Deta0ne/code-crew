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

        // 3. Check if user already applied to this project
        const { data: existingApplication } = await supabase
            .from('project_applications')
            .select('id, status')
            .eq('project_id', validatedData.project_id)
            .eq('applicant_id', user.id)
            .single();

        if (existingApplication) {
            return {
                success: false,
                error: `You have already applied to this project (Status: ${existingApplication.status})`,
            };
        }

        // 4. Check if user is already a member
        const { data: existingMember } = await supabase
            .from('project_members')
            .select('id')
            .eq('project_id', validatedData.project_id)
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

        if (existingMember) {
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

