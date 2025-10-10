import { useQuery } from '@tanstack/react-query';
import { getOwnerProjects, getAllUserProjects } from '@/lib/services/projects';
import { useAuth } from '@/hooks/useAuth';

export const useOwnerProjects = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['projects', 'owner'],
        queryFn: () => getOwnerProjects(),
        enabled: !!user,

        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        
    });
};

export const useAllUserProjects = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['projects', 'all'],
        queryFn: () => getAllUserProjects(),
        enabled: !!user,

        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};