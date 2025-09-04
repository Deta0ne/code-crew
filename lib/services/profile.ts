"use server";
import { createClient } from '@/lib/supabase/server';

export async function fetchUser(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    return data;
}