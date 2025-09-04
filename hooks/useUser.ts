import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/lib/services/profile'; 
import { UserProfile } from '@/types/database';


export const useUser = (userId: string | undefined) => {
    return useQuery<UserProfile, Error>({
        queryKey: ['user'],

        queryFn: () => {
            if (!userId) {
                throw new Error('User ID is required.');
            }
            return fetchUser(userId);
        },

        enabled: !!userId,
    });
};