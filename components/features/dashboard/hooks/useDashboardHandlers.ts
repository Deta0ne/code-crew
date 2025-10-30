import { toast } from 'sonner';
import { acceptApplication, rejectApplication, deleteApplication } from '@/lib/services/application';
import { removeBookmark } from '@/lib/services/bookmark';
import type { ProjectApplication, ProjectBookmark } from '@/components/features/dashboard/types';

export function useDashboardHandlers(
    userId: string,
    setOwnerData: React.Dispatch<React.SetStateAction<ProjectApplication[]>>,
    setApplicantData: React.Dispatch<React.SetStateAction<ProjectApplication[]>>,
    setBookmarkData: React.Dispatch<React.SetStateAction<ProjectBookmark[]>>,
) {
    const handleUpdateApplication = async (
        applicationId: string,
        status: 'accepted' | 'rejected',
        reviewNotes?: string,
    ) => {
        try {
            const result =
                status === 'accepted'
                    ? await acceptApplication(applicationId, reviewNotes)
                    : await rejectApplication(applicationId, reviewNotes);

            if (result.success) {
                setOwnerData((prev) =>
                    prev.map((app) =>
                        app.id === applicationId
                            ? {
                                  ...app,
                                  status,
                                  reviewed_at: new Date().toISOString(),
                                  reviewed_by: userId,
                                  review_notes: reviewNotes || null,
                              }
                            : app,
                    ),
                );
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error('An unexpected error occurred');
        }
    };

    const handleDeleteApplication = async (applicationId: string) => {
        try {
            const result = await deleteApplication(applicationId);

            if (result.success) {
                setApplicantData((prev) => prev.filter((app) => app.id !== applicationId));
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            toast.error('An unexpected error occurred');
        }
    };

    const handleRemoveBookmark = async (bookmarkId: string) => {
        try {
            const result = await removeBookmark(bookmarkId);

            if (result.success) {
                setBookmarkData((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error removing bookmark:', error);
            toast.error('An unexpected error occurred');
        }
    };

    return {
        handleUpdateApplication,
        handleDeleteApplication,
        handleRemoveBookmark,
    };
}

