import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from '@/components/ui/dialog';
import { ProjectApplication } from './types';

interface ApplicationDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    application: ProjectApplication | null;
    viewType: 'owner' | 'applicant';
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
    isOpen,
    onOpenChange,
    application,
    viewType,
}) => {
    if (!application) {
        return null;
    }

    const isOwnerView = viewType === 'owner';
    const isApplicantView = viewType === 'applicant';

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

                <DialogFooter className="sm:justify-start mt-1">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationDetailsDialog;
