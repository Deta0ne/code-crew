import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    //project_applicaitoın
    const { data: project_applications } = await supabase.from('project_applications').select('*');

    const owner_data = project_applications?.filter((application) => application.applicant_id !== user?.id);
    const applicant_data = project_applications?.filter((application) => application.applicant_id === user?.id);

    return <div>dashboard</div>;
}
