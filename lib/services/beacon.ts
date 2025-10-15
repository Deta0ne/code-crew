'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { 
    commonFieldsSchema, 
    getTypeSpecificSchema, 
    type ProjectType
} from '@/components/features/BeaconForm/types';
import { Database } from '@/types/database';

export type ProjectMemberWithRelations = {
    id: string;
    role: Database['public']['Enums']['member_role'];
    joined_at: string;
    last_activity_at: string | null;
    assigned_role_id: number | null;
    user: {
        id: string;
        username: string;
        full_name: string | null;
        avatar_url: string | null;
        experience_level: Database['public']['Enums']['experience_level'];
    } | null;
    developer_role: {
        name: string;
        role_type: Database['public']['Enums']['user_role_type'];
    } | null;
};

// Complete form validation schema
const createBeaconSchema = z.object({
    // Common fields
    ...commonFieldsSchema.shape,

    // Project type and type-specific data
    project_type: z.enum(['learning', 'portfolio', 'open_source', 'hackathon', 'tutorial', 'research']),
    type_specific_data: z.record(z.string(), z.unknown()),

    // Optional status
    status: z.enum(['active', 'paused', 'completed', 'cancelled']).optional().default('active'),
});

export type CreateBeaconInput = z.infer<typeof createBeaconSchema>;

// Validate type-specific data based on project type
function validateTypeSpecificData(projectType: ProjectType, data: unknown) {
    const schema = getTypeSpecificSchema(projectType);
    return schema.safeParse(data);
}

export async function createBeacon(input: CreateBeaconInput) {
    try {
        // 1. Validate input data
        const validationResult = createBeaconSchema.safeParse(input);
        if (!validationResult.success) {
            return {
                success: false,
                error: 'Invalid form data',
                details: validationResult.error.issues,
            };
        }

        const validatedData = validationResult.data;

        // 2. Validate type-specific data
        const typeValidation = validateTypeSpecificData(
            validatedData.project_type,
            validatedData.type_specific_data
        );
        
        if (!typeValidation.success) {
            return {
                success: false,
                error: 'Invalid type-specific data',
                details: typeValidation.error.issues,
            };
        }

        // 3. Get authenticated user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return {
                success: false,
                error: 'Authentication required',
            };
        }

        // 4. Prepare project data for database
        const projectData = {
            title: validatedData.title,
            description: validatedData.description,
            project_type: validatedData.project_type,
            category: validatedData.category,
            difficulty: validatedData.difficulty,
            max_members: validatedData.max_members,
            is_beginner_friendly: validatedData.is_beginner_friendly,
            mentoring_available: validatedData.mentoring_available,
            remote_friendly: validatedData.remote_friendly,
            github_url: validatedData.github_url || null,
            project_url: validatedData.project_url || null,
            image_url: validatedData.image_url || null,
            tags: validatedData.tags,
            status: validatedData.status,
            type_specific_data: typeValidation.data,
            owner_id: user.id, 
        };

        // 5. Insert project into database
        const { data: project, error: insertError } = await supabase
            .from('projects')
            .insert([projectData])
            .select('id, title')
            .single();

        if (insertError) {
            console.error('Database insertion error:', insertError);
            return {
                success: false,
                error: 'Failed to create project',
                details: insertError.message,
            };
        }

        // 6. Return success response
        return {
            success: true,
            data: {
                id: project.id,
                title: project.title,
            },
        };

    } catch (error) {
        console.error('Unexpected error creating beacon:', error);
        return {
            success: false,
            error: 'An unexpected error occurred',
        };
    }
}

// Action for form submission with redirect
export type BeaconResult = {
    id: string;
    title: string;
    description: string;
    short_description: string | null;
    project_type: string;
    category: string;
    difficulty: string;
    status: string;
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
    tags: string[];
    type_specific_data: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    owner: {
        id: string;
        username: string;
        full_name: string | null;
        avatar_url: string | null;
    };
    isBookmarked: boolean;
};

export const getActiveBeacons = async (
    limit: number = 20
  ): Promise<(BeaconResult & { isBookmarked: boolean })[]> => {
    const supabase = await createClient();
  
    const query = supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        short_description,
        project_type,
        category,
        difficulty,
        status,
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
        tags,
        type_specific_data,
        created_at,
        updated_at,
        owner:users(
          id,
          username,
          full_name,
          avatar_url
        ),
        project_bookmarks!left(user_id)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);
  
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await query;
    if (error) {
        console.error('Error fetching active beacons:', error);
        throw new Error('Failed to fetch active beacons');
      }
    return (data || []).map(beacon => ({
      ...beacon,
      owner: Array.isArray(beacon.owner) ? beacon.owner[0] : beacon.owner,
      isBookmarked: beacon.project_bookmarks?.some(
        (bm: { user_id: string }) => bm.user_id === user?.id
      ) || false
    })) as (BeaconResult & { isBookmarked: boolean })[];
};

export const createBookmark = async (beacon: { id: string; title: string; project_type: string; status: string }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('project_bookmarks').insert({
        project_id: beacon.id,
        user_id: user?.id,
        title: beacon.title,
        project_type: beacon.project_type,
        status: beacon.status,
        
    });
    if (error) {
      return { success: false, error: "Bookmark creation failed caused by " + error.message };
    }
    return { success: true, message: 'Bookmark created successfully' };
};

export const deleteBookmark = async (beaconId: string) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('project_bookmarks').delete().eq('project_id', beaconId).eq('user_id', user?.id);
    if (error) {
        return { success: false, error: "Bookmark deletion failed caused by " + error.message };
    }
    return { success: true, message: 'Bookmark deleted successfully' };
};

export const getUserBeacons = async (userId: string): Promise<BeaconResult[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            description,
            short_description,
            project_type,
            category,
            difficulty,
            status,
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
            tags,
            type_specific_data,
            created_at,
            updated_at,
            owner:users(
                id,
                username,
                full_name,
                avatar_url
            )
        `)
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user beacons:', error);
        throw new Error('Failed to fetch user beacons');
    }

    return (data || []).map(beacon => ({
        ...beacon,
        owner: Array.isArray(beacon.owner) ? beacon.owner[0] : beacon.owner
    })) as BeaconResult[];
};

export const getBeaconById = async (id: string): Promise<BeaconResult | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            description,
            short_description,
            project_type,
            category,
            difficulty,
            status,
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
            tags,
            type_specific_data,
            created_at,
            updated_at,
            owner:users(
                id,
                username,
                full_name,
                avatar_url
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching beacon by ID:', error);
        return null;
    }

    return {
        ...data,
        owner: Array.isArray(data.owner) ? data.owner[0] : data.owner
    } as BeaconResult;
};