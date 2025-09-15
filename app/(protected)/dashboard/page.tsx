import { createClient } from '@/lib/supabase/server';
import { BeaconForm } from '@/components/features/BeaconForm';
import { BeaconCard } from '@/components/features/BeaconForm/BeaconCard';
import { getActiveBeacons, type BeaconResult } from '@/lib/services/beacon';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">
                        Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! Discover active beacons and
                        collaboration opportunities.
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
                    <span className="text-sm text-gray-500">{beacons.length} beacons found</span>
                </div>

                {/* Beacons Grid */}
                {beacons && beacons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {beacons.map((beacon) => (
                            <BeaconCard
                                key={beacon.id}
                                beacon={beacon}
                                // onViewDetails={(beacon) => handleViewDetails(beacon.id)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No active beacons yet</h3>
                            <p className="text-gray-500 mb-6">
                                Be the first to create a beacon and start collaborating!
                            </p>
                            <BeaconForm
                                trigger={
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Beacon
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
