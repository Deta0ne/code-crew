import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProfileHero } from '@/components/features/profile/ProfileHero';
import { ProfileAbout } from '@/components/features/profile/ProfileAbout';
import { ProfileLinks } from '@/components/features/profile/ProfileLinks';
import { ProfileMembership } from '@/components/features/profile/ProfileMembership';

type ProfilePageProps = {
    params: { username: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('users').select('*').eq('username', username).single();

    const isOwner = profile?.id === user?.id;

    if (!profile) {
        return notFound();
    }

    return (
        <div className="p-4 space-y-8">
            <ProfileHero userProfile={profile} />
            <ProfileAbout bio={profile.bio} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileLinks userProfile={profile} />
                <ProfileMembership createdAt={profile.created_at} updatedAt={profile.updated_at} />
            </div>
            {isOwner && <p>You are the owner of this profile</p>}
        </div>
    );
}
