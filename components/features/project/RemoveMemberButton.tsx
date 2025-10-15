'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { removeMemberFromProject } from '@/lib/services/projects';
import { toast } from 'sonner';

interface RemoveMemberButtonProps {
    projectId: string;
    memberId: string;
    memberName: string;
    className?: string;
}

export function RemoveMemberButton({ projectId, memberId, memberName, className }: RemoveMemberButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleRemoveMember = useCallback(() => {
        // Input validation
        if (!projectId || !memberId) {
            toast.error('Invalid project or member ID');
            return;
        }

        startTransition(async () => {
            try {
                await removeMemberFromProject(projectId, memberId);
                toast.success(`${memberName} has been removed from the project`);
                router.refresh();
            } catch (error) {
                console.error('Error removing member:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
                toast.error(errorMessage);
            } finally {
                setShowConfirm(false);
            }
        });
    }, [projectId, memberId, memberName, router]);

    if (!showConfirm) {
        return (
            <Button
                variant="outline"
                size="sm"
                className={className}
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
            >
                Remove
            </Button>
        );
    }

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleRemoveMember}
                disabled={isPending}
            >
                {isPending ? 'Removing...' : 'Confirm Remove'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)} disabled={isPending}>
                Cancel
            </Button>
        </div>
    );
}
