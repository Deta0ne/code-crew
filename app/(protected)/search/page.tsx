import getQueryClient from '@/lib/queryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { searchUsers } from '@/lib/services/searchUsers';
import SearchClient from './SearchPage';

export const SearchType = {
    USERS: 'users',
    PROJECTS: 'projects',
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const searchParamsData = await searchParams;

    const queryClient = getQueryClient();

    const query = typeof searchParamsData.q === 'string' ? searchParamsData.q : '';
    const type = typeof searchParamsData.type === 'string' ? searchParamsData.type : SearchType.USERS;

    if (query && type === SearchType.USERS) {
        await queryClient.prefetchQuery({
            queryKey: ['search', type, query],
            queryFn: () => searchUsers(query),
        });
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SearchClient />
        </HydrationBoundary>
    );
}
