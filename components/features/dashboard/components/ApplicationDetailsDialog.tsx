import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from '@/components/ui/dialog';
import { ProjectApplication } from '../types';
import { acceptApplication, rejectApplication } from '@/lib/services/application';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    application: ProjectApplication | null;
    viewType: 'owner' | 'applicant';
    onApplicationUpdate?: () => void;
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
    isOpen,
    onOpenChange,
    application,
    viewType,
    onApplicationUpdate,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');
    const [showReviewSection, setShowReviewSection] = useState(false);
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);

    if (!application) {
        return null;
    }

    const isOwnerView = viewType === 'owner';
    const isApplicantView = viewType === 'applicant';
    const canTakeAction = isOwnerView && application.status === 'pending';

    const handleAccept = async () => {
        if (!application) return;

        setIsLoading(true);
        try {
            const result = await acceptApplication(application.id, reviewNotes || undefined);

            if (result.success) {
                toast.success(result.message);
                onApplicationUpdate?.();
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error accepting application:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
            setShowReviewSection(false);
            setActionType(null);
            setReviewNotes('');
        }
    };

    const handleReject = async () => {
        if (!application) return;

        setIsLoading(true);
        try {
            const result = await rejectApplication(application.id, reviewNotes || undefined);

            if (result.success) {
                toast.success(result.message);
                onApplicationUpdate?.();
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
            setShowReviewSection(false);
            setActionType(null);
            setReviewNotes('');
        }
    };

    const handleActionClick = (action: 'accept' | 'reject') => {
        setActionType(action);
        setShowReviewSection(true);
    };

    const handleCancel = () => {
        setShowReviewSection(false);
        setActionType(null);
        setReviewNotes('');
    };

    const dialogConfig = {
        owner: {
            title: 'Application Details',
            description: 'Complete details of the selected application',
            basicInfoTitle: 'Basic Information',
            applicantLabel: 'Applicant',
            applicationDetailsTitle: 'Application Details',
            availabilityTitle: 'Availability & Contact',
        },
        applicant: {
            title: 'My Application Details',
            description: 'Complete details of your application',
            basicInfoTitle: 'Application Information',
            applicantLabel: 'Application ID',
            applicationDetailsTitle: 'Your Application',
            availabilityTitle: 'Your Availability & Links',
        },
    };

    const config = dialogConfig[viewType];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                    <DialogDescription>{config.description}</DialogDescription>
                </DialogHeader>

                <div>
                    {/* Basic Information Section */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold border-b pb-2">{config.basicInfoTitle}</h3>
                        <div className="grid gap-2">
                            {isApplicantView ? (
                                <>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Application ID</Label>
                                        <div className="col-span-2 font-mono text-sm text-gray-600">
                                            {application.id}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Project ID</Label>
                                        <div className="col-span-2 font-mono text-sm text-gray-600">
                                            {application.project_id}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    <Label className="font-medium">{config.applicantLabel}</Label>
                                    <div className="col-span-2">{application.applicant_name}</div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-2">
                                <Label className="font-medium">Status</Label>
                                <div className="col-span-2">
                                    <span
                                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                            application.status === 'accepted'
                                                ? 'bg-green-100 text-green-800'
                                                : application.status === 'rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {application.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <Label className="font-medium">Applied Date</Label>
                                <div className="col-span-2">{new Date(application.created_at).toLocaleString()}</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <Label className="font-medium">Last Updated</Label>
                                <div className="col-span-2">{new Date(application.updated_at).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Application Details Section */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold pb-2">{config.applicationDetailsTitle}</h3>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 gap-2">
                                <Label className="font-medium">Motivation</Label>
                                <div className="col-span-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    {application.motivation_message}
                                </div>
                            </div>

                            {application.what_they_bring && (
                                <div className="grid grid-cols-3 gap-2">
                                    <Label className="font-medium">
                                        {isOwnerView ? 'What They Bring' : 'What You Bring'}
                                    </Label>
                                    <div className="col-span-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                        {application.what_they_bring}
                                    </div>
                                </div>
                            )}

                            {application.what_they_want_to_learn && (
                                <div className="grid grid-cols-3 gap-2">
                                    <Label className="font-medium">
                                        {isOwnerView ? 'What They Want To Learn' : 'What You Want To Learn'}
                                    </Label>
                                    <div className="col-span-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                        {application.what_they_want_to_learn}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Availability & Contact Section */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold border-b pb-2">{config.availabilityTitle}</h3>
                        <div className="grid gap-2">
                            {application.hours_per_week != null && (
                                <div className="grid grid-cols-3 gap-2">
                                    <Label className="font-medium">Hours per Week</Label>
                                    <div className="col-span-2 dark:text-white">{application.hours_per_week} hours</div>
                                </div>
                            )}

                            {application.timezone && (
                                <div className="grid grid-cols-3 gap-2">
                                    <Label className="font-medium">Timezone</Label>
                                    <div className="col-span-2 dark:text-white">{application.timezone}</div>
                                </div>
                            )}

                            {application.portfolio_url && (
                                <div className="grid grid-cols-3 gap-2">
                                    <Label className="font-medium">Portfolio</Label>
                                    <a
                                        className="col-span-2 text-blue-600 hover:text-blue-800 underline break-all dark:text-white"
                                        href={application.portfolio_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {application.portfolio_url}
                                    </a>
                                </div>
                            )}

                            {application.github_url && (
                                <div className="grid grid-cols-3 gap-2">
                                    <Label className="font-medium">GitHub</Label>
                                    <a
                                        className="col-span-2 text-blue-600 hover:text-blue-800 underline break-all"
                                        href={application.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {application.github_url}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review Section */}
                    {(application.reviewed_at || application.reviewed_by || application.review_notes) && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold border-b pb-2">Review Information</h3>
                            <div className="grid gap-2">
                                {application.reviewed_at && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Reviewed At</Label>
                                        <div className="col-span-2">
                                            {new Date(application.reviewed_at).toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {application.reviewed_by && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Reviewed By</Label>
                                        <div className="col-span-2 font-mono text-sm text-gray-600">
                                            {application.reviewed_by}
                                        </div>
                                    </div>
                                )}

                                {application.review_notes && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Review Notes</Label>
                                        <div className="col-span-2 whitespace-pre-wrap bg-blue-50 p-3 rounded-md border border-blue-200">
                                            {application.review_notes}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Review Section */}
                {showReviewSection && canTakeAction && (
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">
                            {actionType === 'accept' ? 'Accept Application' : 'Reject Application'}
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="review-notes">Review Notes (Optional)</Label>
                            <Textarea
                                id="review-notes"
                                placeholder={
                                    actionType === 'accept'
                                        ? 'Add any welcome message or next steps...'
                                        : 'Add feedback for the applicant...'
                                }
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={actionType === 'accept' ? handleAccept : handleReject}
                                disabled={isLoading}
                                className={
                                    actionType === 'accept'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                }
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : actionType === 'accept' ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <XCircle className="h-4 w-4 mr-2" />
                                )}
                                {isLoading
                                    ? 'Processing...'
                                    : actionType === 'accept'
                                    ? 'Accept Application'
                                    : 'Reject Application'}
                            </Button>
                            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                <DialogFooter className="sm:justify-between mt-4">
                    <div className="flex gap-2">
                        {canTakeAction && !showReviewSection && (
                            <>
                                <Button
                                    onClick={() => handleActionClick('accept')}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={isLoading}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => handleActionClick('reject')}
                                    variant="destructive"
                                    disabled={isLoading}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                            </>
                        )}
                    </div>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={isLoading}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationDetailsDialog;
