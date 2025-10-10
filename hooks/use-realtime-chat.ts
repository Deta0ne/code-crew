import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { saveMessageClient } from '@/lib/services/messages-client';

export interface ChatMessage {
    id: string;
    content: string;
    user: {
        name: string;
        username?: string;
    };
    createdAt: string;
}

interface UseRealtimeChatProps {
    roomName: string;
    username: string;
    projectId: string;
    initialMessages?: ChatMessage[];
    onMessage?: (messages: ChatMessage[]) => void;
}

export const useRealtimeChat = ({
    roomName,
    projectId,
    initialMessages = [],
    onMessage,
}: UseRealtimeChatProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isConnected, setIsConnected] = useState(false);
    
    // Memoize supabase client to prevent recreation
    const supabase = useMemo(() => createClient(), []);
    
    // Use ref for channel to access it in sendMessage
    const channelRef = useRef<RealtimeChannel | null>(null);
    
    // Stable reference for onMessage callback
    const onMessageRef = useRef(onMessage);
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || !channelRef.current) return;

            try {
                // Save message to database first
                const savedMessage = await saveMessageClient(projectId, content);

                // Then broadcast via realtime
                channelRef.current.send({
                    type: 'broadcast',
                    event: 'message',
                    payload: savedMessage,
                });
            } catch (error) {
                console.error('Error sending message:', error);
                // Optionally show error to user
            }
        },
        [projectId]
    );

    useEffect(() => {
        const setupChannel = async () => {
            // Clean up existing channel
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }

            const channel = supabase.channel(roomName, {
                config: {
                    broadcast: { self: true },
                },
            });

            channelRef.current = channel;

            channel
                .on('broadcast', { event: 'message' }, ({ payload }) => {
                    const newMessage = payload as ChatMessage;
                    setMessages((prev) => {
                        // Avoid duplicates
                        if (prev.some((msg) => msg.id === newMessage.id)) {
                            return prev;
                        }
                        const updated = [...prev, newMessage];
                        onMessageRef.current?.(updated);
                        return updated;
                    });
                })
                .subscribe((status) => {
                    setIsConnected(status === 'SUBSCRIBED');
                });
        };

        setupChannel();

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [roomName, supabase]);

    // Initialize messages only once
    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]); // Only run on mount

    return {
        messages,
        sendMessage,
        isConnected,
    };
};
