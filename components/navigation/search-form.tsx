import { Search } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { SidebarInput } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';

export function SearchForm({ ...props }: React.ComponentProps<'form'>) {
    const router = useRouter();
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/search?q=${(e.target as HTMLFormElement).search.value}`);
    };
    return (
        <form {...props} onSubmit={handleSearch}>
            <div className="relative">
                <Label htmlFor="search" className="sr-only">
                    Search
                </Label>
                <SidebarInput id="search" placeholder="Type to search..." className="h-8 pl-7" />
                <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </div>
        </form>
    );
}
