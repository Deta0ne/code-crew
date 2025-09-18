import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';
import { Globe } from 'lucide-react';
import { User } from 'lucide-react';
import { Github } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from './config/utils';
import { getTypeSpecificInfo } from './config/utils';
import { renderFieldValue } from './config/utils';
import type { BeaconResult } from '@/lib/services/beacon';
import { useRouter } from 'next/navigation';

const BeaconDetailOne = ({ beacon }: { beacon: BeaconResult }) => {
    const router = useRouter();
    return (
        <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] transition-opacity duration-300 ease-in-out opacity-100">
            {/* Description */}
            <div>
                <p className="text-gray-700 leading-relaxed text-base">{beacon.description}</p>
            </div>

            {/* Tags */}
            {beacon.tags && beacon.tags.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {beacon.tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs font-normal text-gray-600 border-gray-200 bg-gray-50 px-2 py-1"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Features */}
            {(beacon.is_beginner_friendly || beacon.remote_friendly || beacon.mentoring_available) && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Features</h3>
                    <div className="flex flex-wrap gap-3">
                        {beacon.is_beginner_friendly && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                <span>Beginner-friendly</span>
                            </div>
                        )}
                        {beacon.remote_friendly && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span>Remote</span>
                            </div>
                        )}
                        {beacon.mentoring_available && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>Mentoring</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Project Links */}
            {(beacon.github_url || beacon.project_url) && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Project Links</h3>
                    <div className="space-y-2">
                        {beacon.github_url && (
                            <a
                                href={beacon.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                            >
                                <Github className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                <span>GitHub Repository</span>
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                            </a>
                        )}
                        {beacon.project_url && (
                            <a
                                href={beacon.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                            >
                                <Link className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                <span>Project Website</span>
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Type-Specific Information */}
            {(() => {
                const typeInfo = getTypeSpecificInfo(beacon.project_type, beacon.type_specific_data || {});
                if (!typeInfo) return null;

                return (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">{typeInfo.title}</h3>
                        <div className="space-y-3">
                            {typeInfo.fields.map((field, index) => {
                                if (!field.value) return null;
                                return (
                                    <div key={index}>
                                        <p className="text-xs font-medium text-gray-700 mb-1">{field.label}</p>
                                        {renderFieldValue(field.value)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}

            {/* Project Owner */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Project Owner</h3>
                <div
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => router.push(`/${beacon.owner.username}`)}
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={beacon.owner.avatar_url || undefined} />
                        <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-sm">
                            {getInitials(beacon.owner.full_name, beacon.owner.username)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm group-hover:text-gray-700 transition-colors">
                            {beacon.owner.full_name || beacon.owner.username}
                        </p>
                        <p className="text-sm text-gray-500">@{beacon.owner.username}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeaconDetailOne;
