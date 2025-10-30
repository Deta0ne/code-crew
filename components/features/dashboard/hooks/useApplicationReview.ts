import { useState } from 'react';

export function useApplicationReview() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [reviewingId, setReviewingId] = useState<string | null>(null);
    const [reviewAction, setReviewAction] = useState<'accepted' | 'rejected' | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');

    const handleReviewClick = (applicationId: string, action: 'accepted' | 'rejected') => {
        setReviewingId(applicationId);
        setReviewAction(action);
        setReviewNotes('');
    };

    const handleCancelReview = () => {
        setReviewingId(null);
        setReviewAction(null);
        setReviewNotes('');
    };

    const handleStatusUpdate = async (
        applicationId: string,
        status: 'accepted' | 'rejected',
        onUpdate: (id: string, status: 'accepted' | 'rejected', notes?: string) => Promise<void>,
    ) => {
        setIsUpdating(true);
        await onUpdate(applicationId, status, reviewNotes);
        setIsUpdating(false);
        handleCancelReview();
    };

    return {
        isUpdating,
        reviewingId,
        reviewAction,
        reviewNotes,
        setReviewNotes,
        handleReviewClick,
        handleCancelReview,
        handleStatusUpdate,
    };
}

