import { Star } from 'lucide-react';

type ProfileMembershipProps = {
    createdAt: string;
    updatedAt: string;
};
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
    });
};
export function ProfileMembership({ createdAt, updatedAt }: ProfileMembershipProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" /> Membership Information
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600">Join Date</span>
                    <span className="text-slate-900 font-medium flex items-center gap-1">{formatDate(createdAt)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600">Last Updated</span>
                    <span className="text-slate-900 font-medium">{formatDate(updatedAt)}</span>
                </div>
            </div>
        </div>
    );
}
