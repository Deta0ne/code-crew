import { createClient } from '@/lib/supabase/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OwnerTable from '@/components/features/dashboard/OwnerTable';
import { ProjectApplication } from '@/components/features/dashboard/types';

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

    return (
        <div className="p-4 space-y-8">
            <Tabs defaultValue="owner">
                <TabsList>
                    <TabsTrigger value="owner">Owner</TabsTrigger>
                    <TabsTrigger value="applicant">Applicant</TabsTrigger>
                </TabsList>
                <TabsContent value="owner">
                    <OwnerTable owner_data={owner_data} />
                </TabsContent>
                <TabsContent value="applicant">
                    <div>
                        {applicant_data?.map((application) => (
                            <div key={application.id}>{application.project_id}</div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
