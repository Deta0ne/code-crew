'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { searchUsers, UserSearchResult } from '@/lib/services/searchUsers';
import { SearchType } from './page';
import Image from 'next/image';
import { getInitials } from '@/components/features/profile/ProfileHero';
import Link from 'next/link';

const UserCard = ({ user }: { user: UserSearchResult }) => (
    <Link href={`/${user.username}`}>
        <div className="border rounded-lg p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
            {user.avatar_url ? (
                <Image
                    src={user.avatar_url || '/default-avatar.png'}
                    alt={user.full_name || 'User avatar'}
                    width={48}
                    height={48}
                    className="rounded-full"
                />
            ) : (
                getInitials(user.full_name)
            )}
            <div>
                <h3 className="font-semibold">{user.full_name}</h3>
                {user.username && <p className="text-sm text-muted-foreground">@{user.username}</p>}
            </div>
        </div>
    </Link>
);

export default function UserResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const {
        data: users,
        isLoading,
        isError,
        isFetched,
    } = useQuery({
        queryKey: ['search', SearchType.USERS, query],

        queryFn: () => searchUsers(query),

        enabled: !!query,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div className="text-destructive">An error occurred.</div>;
    }

    if (isFetched && (!users || users.length === 0)) {
        return <div>&quot;{query}&quot; no results found.</div>;
    }

    if (!query) {
        return <div>Use the search box above to search for a user.</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Users ({users?.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users?.map((user: UserSearchResult) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}
