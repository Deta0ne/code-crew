import { Button } from '@/components/ui/button';
import { signOut } from '@/app/(auth)/login/actions';

export default function DashboardPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <form action={signOut}>
                    <Button type="submit" variant="destructive">
                        Sign Out
                    </Button>
                </form>
            </div>
            <div>Dashboard Content</div>
        </div>
    );
}
