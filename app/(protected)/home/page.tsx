import { createClient } from '@/lib/supabase/server';
import { HomeClient } from '@/components/features/Beacons/HomeClient';
import { getActiveBeaconsRPC } from '@/lib/services/beacon';
import { ProjectWithMembers } from '@/types/database';

export default async function HomePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('users')
        .select('full_name, avatar_url, username')
        .eq('id', user?.id)
        .single();

    let beacons: ProjectWithMembers[] | undefined = undefined;
    try {
        beacons = await getActiveBeaconsRPC(10);
    } catch (error) {
        console.error('Failed to fetch beacons:', error);
    }

    return <HomeClient beacons={beacons || []} profile={profile} />;
}
