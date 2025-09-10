// Type-specific fields component - placeholder
'use client';

import type { TypeSpecificFieldsProps } from './types';

export function TypeSpecificFields({ type, formData, onUpdate, errors }: TypeSpecificFieldsProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} Specific Details
                </h2>
                <p className="text-gray-600">
                    Provide additional information specific to your {type.replace('_', ' ')} project.
                </p>
            </div>

            <div className="space-y-4">
                {/* Placeholder content */}
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} Fields
                    </h3>
                    <p className="text-gray-500">
                        This will contain form fields specific to {type.replace('_', ' ')} projects.
                    </p>
                    <div className="mt-4 text-sm text-gray-400">
                        <p>Project type: {type}</p>
                        <p>Current data: {JSON.stringify(formData, null, 2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
