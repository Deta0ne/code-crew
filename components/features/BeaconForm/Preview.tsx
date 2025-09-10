// Preview component - placeholder
'use client';

import type { PreviewProps } from './types';

export function Preview({ formData, onEdit }: PreviewProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Your Beacon</h2>
                <p className="text-gray-600">Review all the information before publishing your project beacon.</p>
            </div>

            <div className="space-y-4">
                {/* Placeholder content */}
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Project Preview</h3>
                    <p className="text-gray-500">
                        This will show a preview of how your beacon will look to other users.
                    </p>
                    <div className="mt-4 text-sm text-gray-400">
                        <p>Form data: {JSON.stringify(formData, null, 2)}</p>
                    </div>
                    <div className="mt-4 space-x-2">
                        <button
                            onClick={() => onEdit(1)}
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                            Edit Type
                        </button>
                        <button
                            onClick={() => onEdit(2)}
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                            Edit Details
                        </button>
                        <button
                            onClick={() => onEdit(3)}
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                            Edit Specifics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
