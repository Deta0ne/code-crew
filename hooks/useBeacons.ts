import { useQuery } from '@tanstack/react-query';
import { getActiveBeacons, getUserBeacons, type BeaconResult } from '@/lib/services/beacon';

export const useActiveBeacons = (limit?: number) => {
    return useQuery({
        queryKey: ['beacons', 'active', limit],
        queryFn: () => getActiveBeacons(limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useUserBeacons = (userId: string) => {
    return useQuery({
        queryKey: ['beacons', 'user', userId],
        queryFn: () => getUserBeacons(userId),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export type { BeaconResult };
