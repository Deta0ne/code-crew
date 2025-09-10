// Common fields component - placeholder
'use client';

import type { CommonFieldsProps } from './types';

export function CommonFields({ formData, onUpdate, errors }: CommonFieldsProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Details</h2>
                <p className="text-gray-600">Fill in the basic information about your project.</p>
            </div>

            <div className="space-y-4">
                {/* Placeholder content */}
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Common Fields Form</h3>
                    <p className="text-gray-500">
                        This will contain form fields like title, description, category, etc.
                    </p>
                    <div className="mt-4 text-sm text-gray-400">
                        <p>Current data: {JSON.stringify(formData, null, 2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
