import { createClient } from '@/lib/supabase/server';
import { getActiveBeaconsRPC } from '@/lib/services/beacon';
import { BeaconsGrid } from '@/components/features/Beacons/BeaconsGrid';
import { BeaconForm } from '@/components/features/BeaconForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Home</h1>
                    <p className="text-gray-600">
                        Welcome back{profileResponse?.data?.full_name ? `, ${profileResponse.data.full_name}` : ''}!
                        Discover active beacons and collaboration opportunities.
                    </p>
                </div>
                <BeaconForm
                    trigger={
                        <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Beacon
                        </Button>
                    }
                />
            </div>

            {/* Active Beacons Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">Active Beacons</h2>
                    <span className="text-sm text-gray-500">{beaconsResponse.length} beacons found</span>
                </div>

                {/* Beacons Grid - Client Component */}
                <BeaconsGrid beacons={beaconsResponse} />
            </div>
        </div>
    );
}
