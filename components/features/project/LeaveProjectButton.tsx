'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserMinus } from 'lucide-react';
import { leaveProject } from '@/lib/services/projects';
import { toast } from 'sonner';

interface LeaveProjectButtonProps {
    projectId: string;
    className?: string;
}

export function LeaveProjectButton({ projectId, className }: LeaveProjectButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleLeaveProject = () => {
        startTransition(async () => {
            try {
                await leaveProject(projectId);
                toast.success('Successfully left the project');
                router.push('/dashboard');
                router.refresh();
            } catch (error) {
                console.error('Error leaving project:', error);
                toast.error(error instanceof Error ? error.message : 'Failed to leave project');
            } finally {
                setShowConfirm(false);
            }
        });
    };

    if (!showConfirm) {
        return (
            <Button
                variant="outline"
                size="sm"
                className={className}
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
            >
                <UserMinus className="h-4 w-4 mr-2" />
                Leave Project
            </Button>
        );
    }

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                onClick={handleLeaveProject}
                disabled={isPending}
            >
                {isPending ? 'Leaving...' : 'Confirm Leave'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)} disabled={isPending}>
                Cancel
            </Button>
        </div>
    );
}
