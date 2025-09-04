'use client';
import React from 'react';
import Link from 'next/link';

import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';

const ProfileSection = () => {
    const { user } = useAuth();

    const { data: userProfile, isLoading, isError } = useUser(user?.id);

    if (isLoading && !userProfile) {
        return <div>Profil bilgileri yükleniyor...</div>;
    }

    if (isError) {
        return <div>Bir hata oluştu.</div>;
    }

    return (
        <div>
            <div>ProfileSection {userProfile?.full_name}</div>
            <div>
                <Link href="/dashboard">Dashboard</Link>
            </div>
        </div>
    );
};

export default ProfileSection;
