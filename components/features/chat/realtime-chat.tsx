'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { ChatMessageItem } from './chat-message';
import { useRealtimeChat, type ChatMessage } from '@/hooks/use-realtime-chat';
import { useChatScroll } from '@/hooks/use-chat-scroll';

interface RealtimeChatProps {
    roomName: string;
    username: string;
    projectId: string;
    messages?: ChatMessage[];
    onMessage?: (messages: ChatMessage[]) => void;
}

export const RealtimeChat = ({ roomName, username, projectId, messages, onMessage }: RealtimeChatProps) => {
    const [inputValue, setInputValue] = useState('');
    const {
        messages: chatMessages,
        sendMessage,
        isConnected,
    } = useRealtimeChat({
        roomName,
        username,
        projectId,
        initialMessages: messages,
        onMessage,
    });

    const messagesEndRef = useChatScroll(chatMessages);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <Card className="flex flex-col h-[500px]">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Team Chat
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {isConnected ? (
                            <>
                                <Wifi className="h-4 w-4 text-green-500" />
                                <span className="text-green-500">Connected</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="h-4 w-4 text-red-500" />
                                <span className="text-red-500">Disconnected</span>
                            </>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-0">
                {/* Messages Container */}
                <div ref={messagesEndRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 max-h-[350px]">
                    {chatMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No messages yet</p>
                                <p className="text-xs">Start the conversation!</p>
                            </div>
                        </div>
                    ) : (
                        chatMessages.map((message, index) => {
                            const isOwnMessage = message.user.username === username || message.user.name === username;
                            const prevMessage = chatMessages[index - 1];
                            const showHeader =
                                !prevMessage ||
                                prevMessage.user.username !== message.user.username ||
                                new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() >
                                    300000; // 5 minutes

                            return (
                                <ChatMessageItem
                                    key={message.id}
                                    message={message}
                                    isOwnMessage={isOwnMessage}
                                    showHeader={showHeader}
                                />
                            );
                        })
                    )}
                </div>

                {/* Input Container */}
                <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            disabled={!isConnected}
                            className="flex-1"
                        />
                        <Button type="submit" size="sm" disabled={!inputValue.trim() || !isConnected}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                    {!isConnected && <p className="text-xs text-red-500 mt-1">Reconnecting to chat...</p>}
                </div>
            </CardContent>
        </Card>
    );
};
