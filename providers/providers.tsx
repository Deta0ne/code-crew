'use client';

import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <QueryProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </QueryProvider>
        </AuthProvider>
    );
}
