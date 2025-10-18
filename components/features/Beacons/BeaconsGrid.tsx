'use client';

import React, { useState } from 'react';
import { BeaconCard } from '@/components/features/Beacons/BeaconCard';
import { BeaconDetailsDialog } from '@/components/features/Beacons/BeaconDetailsDialog';
import { ProjectWithMembers } from '@/types/database';

interface BeaconsGridProps {
    beacons: ProjectWithMembers[];
}

export function BeaconsGrid({ beacons }: BeaconsGridProps) {
    const [selectedBeacon, setSelectedBeacon] = useState<ProjectWithMembers | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleViewDetails = (beacon: ProjectWithMembers) => {
        setSelectedBeacon(beacon);
        setDialogOpen(true);
    };

    return (
        <>
            {beacons && beacons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {beacons.map((beacon) => (
                        <BeaconCard key={beacon.id} beacon={beacon} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No active beacons yet</h3>
                        <p className="text-gray-500 mb-6">Be the first to create a beacon and start collaborating!</p>
                    </div>
                </div>
            )}

            {/* Beacon Details Dialog */}
            <BeaconDetailsDialog beacon={selectedBeacon} open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
    );
}
