import { Anchor } from 'lucide-react';

type ProfileAboutProps = {
    bio: string | null;
};

export function ProfileAbout({ bio }: ProfileAboutProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Anchor className="w-5 h-5 text-blue-600" /> About
            </h2>

            {!bio ? (
                <p className="text-slate-500 text-sm italic">
                    This person hasn&apos;t shared anything about themselves yet.
                </p>
            ) : (
                <p className="text-slate-600 leading-relaxed">{bio}</p>
            )}
        </div>
    );
}
