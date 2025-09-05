import { MapPin, Compass, CheckCircle, XCircle, Ship } from 'lucide-react';
import { UserProfile } from '@/types/database';

type ProfileHeroProps = {
    userProfile: UserProfile;
};
export const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
export const roleMap: Record<number, string> = {
    1: 'Frontend Developer',
    2: 'Backend Developer',
    3: 'Full Stack Developer',
    4: 'UI/UX Designer',
    5: 'DevOps Engineer',
    6: 'Mobile Developer',
};
export const experienceLevels = {
    beginner: { label: 'Beginner', icon: '⚓' },
    intermediate: { label: 'Intermediate', icon: '🧭' },
    advanced: { label: 'Advanced', icon: '🚢' },
};
export function ProfileHero({ userProfile }: ProfileHeroProps) {
    return (
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <Ship className="w-full h-full" />
            </div>
            <div className="flex items-start gap-6 relative z-10">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {userProfile.avatar_url ? (
                        <img
                            src={userProfile.avatar_url}
                            alt={userProfile.full_name || ''}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        getInitials(userProfile.full_name)
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                        <h1 className="text-3xl font-bold truncate">{userProfile.full_name || userProfile.username}</h1>
                        <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                userProfile.available_for_projects
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-red-500/20 text-red-300'
                            }`}
                        >
                            {userProfile.available_for_projects ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : (
                                <XCircle className="w-4 h-4" />
                            )}
                            {userProfile.available_for_projects ? 'Looking for projects' : 'Not available'}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-blue-200 mb-3">
                        <span className="text-lg">@{userProfile.username}</span>
                        {userProfile.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{userProfile.location}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center flex-wrap gap-4">
                        {userProfile.primary_role_id && roleMap[userProfile.primary_role_id] && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-sm">
                                <Compass className="w-4 h-4" />
                                {roleMap[userProfile.primary_role_id]}
                            </div>
                        )}
                        {userProfile.experience_level && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-sm">
                                <span>{experienceLevels[userProfile.experience_level].icon}</span>
                                {experienceLevels[userProfile.experience_level].label}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
