"use server";

import { createClient } from "@/lib/supabase/client";

export type UserSearchResult = {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
};

export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
    if (!query.trim()) {
        return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc('search_users_unaccent', {
        search_query: query
    });

    if (error) {
        console.error('Error searching users via RPC:', error);
        throw new Error('An error occurred while searching for users.');
    }

    return data || [];
};