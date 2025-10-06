import { createClient } from '@/lib/supabase/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OwnerTable from '@/components/features/dashboard/OwnerTable';
import ApplicantTable from '@/components/features/dashboard/ApplicantTable';
import BookmarkTable from '@/components/features/dashboard/BookmarkTable';
import { ProjectApplication, ProjectBookmark } from '@/components/features/dashboard/types';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

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
        <div className="p-4 space-y-8">
            <Tabs defaultValue="owner">
                <TabsList>
                    <TabsTrigger value="owner">Owner</TabsTrigger>
                    <TabsTrigger value="applicant">Applicant</TabsTrigger>
                    <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                </TabsList>
                <TabsContent value="owner">
                    <OwnerTable owner_data={owner_data} />
                </TabsContent>
                <TabsContent value="applicant">
                    <ApplicantTable applicant_data={applicant_data} />
                </TabsContent>
                <TabsContent value="bookmarks">
                    <BookmarkTable bookmark_data={bookmark_data || []} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
