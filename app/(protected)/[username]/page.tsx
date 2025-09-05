import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

type ProfilePageProps = {
    params: { username: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = params;
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
        <div>
            <h1>Protected Profile Page</h1>
            <p>Username: {profile.username}</p>
            <p>Full Name: {profile.full_name}</p>
            {isOwner && <p>You are the owner of this profile</p>}
        </div>
    );
}
