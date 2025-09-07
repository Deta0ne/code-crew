'use client';
import { useSearchParams } from 'next/navigation';
import SearchInput from './SearchInput';
import UserResults from './UserResults';
import { SearchType } from './page';

export default function SearchClient() {
    const searchParams = useSearchParams();
    const currentType = searchParams.get('type') || SearchType.USERS;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2">Discover the Community</h1>
                    <p className="text-muted-foreground mb-8">Search for projects, beacons and other developers.</p>
                    <SearchInput />
                </div>

                <div>
                    {currentType === SearchType.USERS && <UserResults />}
                    {/* {currentType === SearchType.PROJECTS && <ProjectResults />} */}
                </div>
            </div>
        </div>
    );
}
