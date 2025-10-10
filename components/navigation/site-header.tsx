'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarIcon } from 'lucide-react';

import { SearchForm } from '@/components/navigation/search-form';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';

export function SiteHeader() {
    const { toggleSidebar } = useSidebar();
    const pathname = usePathname();
    const [beaconTitle, setBeaconTitle] = useState<string | null>(null);

    const segments = pathname.split('/').filter(Boolean);

    useEffect(() => {
        const isBeaconPage = segments.length >= 2 && segments[0] === 'home' && segments[1];

        if (isBeaconPage) {
            const metaBeaconTitle = document.querySelector('meta[name="beacon-title"]')?.getAttribute('content');
            if (metaBeaconTitle) {
                setBeaconTitle(metaBeaconTitle);
            } else {
                const pageTitle = document.title;
                if (pageTitle && pageTitle !== 'Beacon') {
                    setBeaconTitle(pageTitle);
                }
            }
        } else {
            setBeaconTitle(null);
        }
    }, [pathname, segments]);

    const formatSegment = (str: string, index: number) => {
        if (!str) return '';

        if (segments[0] === 'home' && index === 1 && beaconTitle) {
            return beaconTitle;
        }

        if (/^\d+$/.test(str) || str.length > 20) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    };

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-[var(--header-height)] w-full items-center gap-2 px-4">
                <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
                    <SidebarIcon className="h-5 w-5" />
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4" />

                <Breadcrumb className="hidden sm:block">
                    <BreadcrumbList>
                        {segments.length === 0 && (
                            <BreadcrumbItem>
                                <BreadcrumbPage>Home</BreadcrumbPage>
                            </BreadcrumbItem>
                        )}

                        {segments.map((segment, index) => {
                            const href = `/${segments.slice(0, index + 1).join('/')}`;
                            const isLast = index === segments.length - 1;

                            return (
                                <React.Fragment key={href}>
                                    {index > 0 && <BreadcrumbSeparator />}
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{formatSegment(segment, index)}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={href}>{formatSegment(segment, index)}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>

                <SearchForm className="w-full sm:ml-auto sm:w-auto" />
                <ThemeToggle />
            </div>
        </header>
    );
}
