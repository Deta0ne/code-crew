import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';
import { ProjectApplication, ProjectBookmark } from '@/components/features/dashboard/types';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in to view your dashboard.</div>;
    }

    //Can be used to get only owner applications
    const { data: project_applications } = await supabase.from('project_applications').select('*');

    const owner_data = project_applications?.filter(
        (application) => application.applicant_id !== user?.id,
    ) as ProjectApplication[];
    const applicant_data = project_applications?.filter(
        (application) => application.applicant_id === user?.id,
    ) as ProjectApplication[];

    const { data: bookmarks } = await supabase.from('project_bookmarks').select('*').eq('user_id', user?.id);

    const bookmark_data = bookmarks as ProjectBookmark[];

    return (
        <DashboardClient
            initialOwnerData={owner_data}
            initialApplicantData={applicant_data}
            initialBookmarkData={bookmark_data || []}
            userId={user.id}
        />
    );
}
