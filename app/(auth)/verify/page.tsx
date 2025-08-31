import { Suspense } from 'react';
import AuthFlow from '@/components/features/auth/auth-flow';

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading verification...</div>}>
            <AuthFlow initialStep="verification" />
        </Suspense>
    );
}
