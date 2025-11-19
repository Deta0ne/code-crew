import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/features/dashboard/DashboardClient';
import {
    getOwnerApplications,
    getApplicantApplications,
    getUserBookmarks,
    getActiveProjects,
} from '@/components/features/dashboard/services';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all dashboard data in parallel
    const [ownerData, applicantData, bookmarkData, activeProjects] = await Promise.all([
        getOwnerApplications(user.id),
        getApplicantApplications(user.id),
        getUserBookmarks(user.id),
        getActiveProjects(user.id),
    ]);

    return (
        <DashboardClient
            initialOwnerData={ownerData}
            initialApplicantData={applicantData}
            initialBookmarkData={bookmarkData}
            initialActiveProjects={activeProjects}
            userId={user.id}
        />
    );
}
