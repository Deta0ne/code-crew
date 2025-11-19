import { Globe, Github, Linkedin } from 'lucide-react';
import { UserProfile } from '@/types/database';

type ProfileLinksProps = {
    userProfile: Pick<UserProfile, 'github_url' | 'linkedin_url' | 'portfolio_url'>;
};

export function ProfileLinks({ userProfile }: ProfileLinksProps) {
    const hasLinks = userProfile.github_url || userProfile.linkedin_url || userProfile.portfolio_url;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" /> Links
            </h3>
            <div className="space-y-3">
                {!hasLinks && <p className="text-slate-500 text-sm italic">No links shared yet</p>}
                {userProfile.github_url && (
                    <LinkItem
                        href={userProfile.github_url}
                        icon={<Github className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />}
                        label="GitHub"
                    />
                )}
                {userProfile.linkedin_url && (
                    <LinkItem
                        href={userProfile.linkedin_url}
                        icon={<Linkedin className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />}
                        label="LinkedIn"
                    />
                )}
                {userProfile.portfolio_url && (
                    <LinkItem
                        href={userProfile.portfolio_url}
                        icon={<Globe className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />}
                        label="Portfolio"
                    />
                )}
            </div>
        </div>
    );
}

const LinkItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
    >
        {icon} <span className="text-slate-700 group-hover:text-slate-900">{label}</span>
    </a>
);
