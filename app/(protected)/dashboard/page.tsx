import { BeaconForm } from '@/components/features/BeaconForm';

export default async function DashboardPage() {
    // const supabase = await createClient();
    // const {
    //     data: { user },
    // } = await supabase.auth.getUser();

    // const { data: profile } = await supabase
    //     .from('users')
    //     .select('full_name, avatar_url, username')
    //     .eq('id', user?.id)
    //     .single();

    return (
        <div className="container mx-auto p-6">
            {/* <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <form action={signOut}>
                    <Button type="submit" variant="destructive">
                        Sign Out
                    </Button>
                </form>
            </div> */}

            <BeaconForm />
        </div>
    );
}
