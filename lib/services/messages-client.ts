'use client';

import { createClient } from '@/lib/supabase/client';
import type { ChatMessage } from '@/hooks/use-realtime-chat';

export async function saveMessageClient(projectId: string, content: string): Promise<ChatMessage> {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Authentication required');
    }

    const { data, error } = await supabase
        .from('project_messages')
        .insert({
            project_id: projectId,
            user_id: user.id,
            content: content.trim(),
        })
        .select(`
            id,
            content,
            created_at,
            user:users(
                username,
                full_name
            )
        `)
        .single();

    if (error) {
        console.error('Error saving message:', error);
        throw new Error('Failed to save message');
    }

    // Transform to ChatMessage format
    const userInfo = Array.isArray(data.user) ? data.user[0] : data.user;
    return {
        id: data.id,
        content: data.content,
        user: {
            name: userInfo?.full_name || userInfo?.username || 'Anonymous',
            username: userInfo?.username,
        },
        createdAt: data.created_at,
    };
}

export async function getProjectMessagesClient(projectId: string): Promise<ChatMessage[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('project_messages')
        .select(`
            id,
            content,
            created_at,
            user:users(
                username,
                full_name
            )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })
        .limit(100); // Last 100 messages

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return (data || []).map(message => {
        const userInfo = Array.isArray(message.user) ? message.user[0] : message.user;
        return {
            id: message.id,
            content: message.content,
            user: {
                name: userInfo?.full_name || userInfo?.username || 'Anonymous',
                username: userInfo?.username,
            },
            createdAt: message.created_at,
        };
    });
}
