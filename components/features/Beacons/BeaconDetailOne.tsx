import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';
import { Globe } from 'lucide-react';
import { User } from 'lucide-react';
import { Github } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '../BeaconForm/config/utils';
import { getTypeSpecificInfo } from '../BeaconForm/config/utils';
import { ProjectWithMembers } from '@/types/database';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Separator } from '@/components/ui/separator';

const BeaconDetailOne = ({ beacon }: { beacon: ProjectWithMembers }) => {
    const router = useRouter();

    const typeInfo = useMemo(() => {
        return getTypeSpecificInfo(beacon.project_type, beacon.type_specific_data || {});
    }, [beacon.project_type, beacon.type_specific_data]);

    return (
        <div className="px-4 space-y-3 overflow-y-auto max-h-[calc(90vh-200px)] transition-opacity duration-300 ease-in-out opacity-100 bg-background">
            {/* Description */}
            <div className="pt-2">
                <h3 className="text-sm font-semibold text-foreground mb-3">About this project</h3>
                <p className="text-foreground/90 leading-relaxed text-sm whitespace-pre-wrap">{beacon.description}</p>
            </div>

            {/* Tags */}
            {beacon.tags && beacon.tags.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {beacon.tags.map((tag: string, index: number) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs font-normal text-muted-foreground border-border bg-muted/50 dark:bg-muted/30 px-2 py-1"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Features */}
            {(beacon.is_beginner_friendly || beacon.remote_friendly || beacon.mentoring_available) && (
                <>
                    <Separator />
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Features</h3>
                        <div className="flex flex-wrap gap-3">
                            {beacon.is_beginner_friendly && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <GraduationCap className="w-4 h-4 text-muted-foreground/60" />
                                    <span>Beginner-friendly</span>
                                </div>
                            )}
                            {beacon.remote_friendly && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Globe className="w-4 h-4 text-muted-foreground/60" />
                                    <span>Remote</span>
                                </div>
                            )}
                            {beacon.mentoring_available && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <User className="w-4 h-4 text-muted-foreground/60" />
                                    <span>Mentoring</span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Project Links */}
            {beacon.github_url && (
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Project Links</h3>
                    <div className="space-y-2">
                        {beacon.github_url && (
                            <a
                                href={beacon.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <Github className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground" />
                                <span>GitHub Repository</span>
                                <ExternalLink className="w-3 h-3 text-muted-foreground/60" />
                            </a>
                        )}
                    </div>
                </div>
            )}
            <Separator />
            {/* Type-Specific Information */}
            {typeInfo && (
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">{typeInfo.title}</h3>
                    <div className="space-y-3">
                        {typeInfo.fields.map((field) => {
                            if (!field.value) return null;
                            const fieldKey = `${field.label}-${
                                Array.isArray(field.value) ? field.value.join('-') : field.value
                            }`;
                            return (
                                <div key={fieldKey}>
                                    <p className="text-xs font-medium text-foreground/80 mb-1">{field.label}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(field.value) ? (
                                            field.value.map((item: string) => (
                                                <Badge
                                                    key={item}
                                                    variant="outline"
                                                    className="text-xs font-medium text-muted-foreground border-border bg-muted/50 dark:bg-muted/30"
                                                >
                                                    {item}
                                                </Badge>
                                            ))
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-medium text-muted-foreground border-border bg-muted/50 dark:bg-muted/30"
                                            >
                                                {String(field.value)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <Separator />

            {/* Project Owner */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Project Owner</h3>
                <div
                    className="flex items-center space-x-3 border border-border cursor-pointer group p-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
                    onClick={() => router.push(`/${beacon.owner.username}`)}
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={beacon.owner.avatar_url || undefined} />
                        <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
                            {getInitials(beacon.owner.full_name, beacon.owner.username)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium text-foreground text-sm group-hover:text-muted-foreground transition-colors">
                            {beacon.owner.full_name || beacon.owner.username}
                        </p>
                        <p className="text-sm text-muted-foreground">@{beacon.owner.username}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeaconDetailOne;
