'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { 
    commonFieldsSchema, 
    getTypeSpecificSchema, 
    type ProjectType
} from '@/components/features/BeaconForm/types';

// Complete form validation schema
const createBeaconSchema = z.object({
    // Common fields
    ...commonFieldsSchema.shape,
    
    // Project type and type-specific data
    project_type: z.enum(['learning', 'portfolio', 'open_source', 'hackathon', 'tutorial', 'research']),
    type_specific_data: z.record(z.string(), z.unknown()),
    
    // Optional status for drafts  
    status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']).optional().default('active'),
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

export async function saveDraftBeacon(input: CreateBeaconInput) {
    // Reuse the same function but force status to 'draft'
    return createBeacon({
        ...input,
        status: 'draft',
    });
}

// Action for form submission with redirect
export type BeaconResult = {
    id: string;
    title: string;
    description: string;
    project_type: string;
    category: string;
    difficulty: string;
    max_members: number;
    current_members: number;
    is_beginner_friendly: boolean;
    mentoring_available: boolean;
    remote_friendly: boolean;
    tags: string[];
    created_at: string;
    owner: {
        id: string;
        username: string;
        full_name: string | null;
        avatar_url: string | null;
    };
};

export const getActiveBeacons = async (limit: number = 20): Promise<BeaconResult[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            description,
            project_type,
            category,
            difficulty,
            max_members,
            current_members,
            is_beginner_friendly,
            mentoring_available,
            remote_friendly,
            tags,
            created_at,
            owner:users(
                id,
                username,
                full_name,
                avatar_url
            )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching active beacons:', error);
        throw new Error('Failed to fetch active beacons');
    }

    return (data || []).map(beacon => ({
        ...beacon,
        owner: Array.isArray(beacon.owner) ? beacon.owner[0] : beacon.owner
    })) as BeaconResult[];
};

export const getUserBeacons = async (userId: string): Promise<BeaconResult[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            description,
            project_type,
            category,
            difficulty,
            max_members,
            current_members,
            is_beginner_friendly,
            mentoring_available,
            remote_friendly,
            tags,
            created_at,
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

export async function createBeaconAction(input: CreateBeaconInput) {
    const result = await createBeacon(input);
    
    if (result.success && result.data) {
        // Redirect to the beacon page on success
        redirect(`/beacon/${result.data.id}`);
    }
    
    return result;
}