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