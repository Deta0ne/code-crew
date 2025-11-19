'use client';

import dynamic from 'next/dynamic';

const Background3D = dynamic(() => import('@/components/landing/Background3D'), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#020817] -z-10" />
});

export default function BackgroundWrapper() {
    return <Background3D />;
}
