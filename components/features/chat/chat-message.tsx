import { cn } from '@/lib/utils';

const parseMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
        if (urlRegex.test(part)) {
            return {
                type: 'link',
                content: part,
                key: `link-${index}`,
            };
        }
        return {
            type: 'text',
            content: part,
            key: `text-${index}`,
        };
    });
};

interface ChatMessage {
    id: string;
    content: string;
    user: {
        name: string;
        username?: string;
    };
    createdAt: string;
}

interface ChatMessageItemProps {
    message: ChatMessage;
    isOwnMessage: boolean;
    showHeader: boolean;
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
    return (
        <div className={`flex mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div
                className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
                    'items-end': isOwnMessage,
                })}
            >
                {showHeader && (
                    <div
                        className={cn('flex items-center gap-2 text-xs px-3', {
                            'justify-end flex-row-reverse': isOwnMessage,
                        })}
                    >
                        <span className={'font-medium'}>{message.user.username || message.user.name}</span>
                        <span className="text-foreground/50 text-xs">
                            {new Date(message.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </span>
                    </div>
                )}
                <div
                    className={cn(
                        'py-2 px-3 rounded-xl text-sm w-fit',
                        isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                    )}
                >
                    <div className="break-words">
                        {parseMessageContent(message.content).map((part) => {
                            if (part.type === 'link') {
                                return (
                                    <a
                                        key={part.key}
                                        href={part.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            'underline hover:opacity-80 transition-opacity break-all',
                                            isOwnMessage
                                                ? 'text-primary-foreground hover:text-primary-foreground/80'
                                                : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
                                        )}
                                    >
                                        {part.content}
                                    </a>
                                );
                            }
                            return <span key={part.key}>{part.content}</span>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
