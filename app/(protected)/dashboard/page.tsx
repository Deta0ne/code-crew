import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/services/auth';
import HomePage from './HomePage';
import { createClient } from '@/lib/supabase/server';
import FormBeacon from './FormBeacon';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('users')
        .select('full_name, avatar_url, username')
        .eq('id', user?.id)
        .single();

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

            <FormBeacon />
            <div>{profile?.full_name}</div>
            <div>{profile?.avatar_url}</div>
            <div>{profile?.username}</div>
        </div>
    );
}
