import { ReactNode } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/lib/queryClient';
import { fetchUser } from '@/lib/services/profile';
import { getAllUserProjects } from '@/lib/services/projects';
import { createClient } from '@/lib/supabase/server';
import Providers from '@/providers/providers';
import { LayoutWrapper } from './LayoutWrapper';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const queryClient = getQueryClient();

    if (user?.id) {
        await queryClient.prefetchQuery({
            queryKey: ['user'],
            queryFn: () => fetchUser(user.id),
        });

        await queryClient.prefetchQuery({
            queryKey: ['projects', 'all'],
            queryFn: () => getAllUserProjects(),
        });
    }
    return (
        <Providers>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <LayoutWrapper>{children}</LayoutWrapper>
            </HydrationBoundary>
        </Providers>
    );
}
