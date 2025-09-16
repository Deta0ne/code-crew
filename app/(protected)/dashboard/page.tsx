import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from './DashboardClient';
import { getActiveBeacons, type BeaconResult } from '@/lib/services/beacon';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('users')
        .select('full_name, avatar_url, username')
        .eq('id', user?.id)
        .single();

    let beacons: BeaconResult[] = [];
    try {
        beacons = await getActiveBeacons(10);
    } catch (error) {
        console.error('Failed to fetch beacons:', error);
    }

    return <DashboardClient beacons={beacons} user={user} profile={profile} />;
}
