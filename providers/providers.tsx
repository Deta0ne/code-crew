'use client';

import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';

import { AppSidebar } from '@/components/navigation/app-sidebar';
import { SiteHeader } from '@/components/navigation/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <QueryProvider>
                <div className="[--header-height:calc(--spacing(14))]">
                    <SidebarProvider className="flex flex-col">
                        <SiteHeader />
                        <div className="flex flex-1">
                            <AppSidebar />
                            <SidebarInset>{children}</SidebarInset>
                        </div>
                    </SidebarProvider>
                </div>
            </QueryProvider>
        </AuthProvider>
    );
}
