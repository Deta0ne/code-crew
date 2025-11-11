import { createClient } from '@/lib/supabase/server';
import { getActiveBeaconsRPC } from '@/lib/services/beacon';
import { BeaconsGrid } from '@/components/features/Beacons/BeaconsGrid';
import { HomeHero } from '@/components/features/Beacons/HomeHero';

export default async function HomePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const profilePromise = user
        ? supabase.from('users').select('full_name, username').eq('id', user.id).single()
        : Promise.resolve({ data: null, error: null });

    const beaconsPromise = getActiveBeaconsRPC(10);

    const [profileResponse, beaconsResponse] = await Promise.all([profilePromise, beaconsPromise]);

    if (profileResponse.error) throw profileResponse.error;

    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <HomeHero />

            {/* Active Beacons Section */}
            <div className="container mx-auto px-2 sm:px-6 space-y-6 pb-4">
                {/* Beacons Grid - Client Component */}
                <BeaconsGrid beacons={beaconsResponse} />
            </div>
        </div>
    );
}
