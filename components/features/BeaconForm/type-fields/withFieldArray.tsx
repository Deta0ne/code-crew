import React from 'react';
import { BaseFieldsProps, ArrayField } from './types';

export function withFieldArray<T extends Record<string, unknown>>(
    WrappedComponent: React.ComponentType<
        BaseFieldsProps<T> & {
            updateArray: (field: ArrayField<T>, value: string[]) => void;
            addItem: (field: ArrayField<T>, newItem: string) => void;
            removeItem: (field: ArrayField<T>, index: number) => void;
        }
    >,
) {
    return function WithFieldArray({ formData, onUpdate }: BaseFieldsProps<T>) {
        // Helper function to update array fields
        const updateArray = (field: ArrayField<T>, value: string[]) => {
            onUpdate({ [field]: value } as Partial<T>);
        };

        // Add new item to array field
        const addItem = (field: ArrayField<T>, newItem: string) => {
            if (!newItem.trim()) return;
            const currentItems = (formData[field] as string[]) || [];
            updateArray(field, [...currentItems, newItem.trim()]);
        };

        // Remove item from array field
        const removeItem = (field: ArrayField<T>, index: number) => {
            const currentItems = (formData[field] as string[]) || [];
            updateArray(
                field,
                currentItems.filter((_, i) => i !== index),
            );
        };

        return (
            <WrappedComponent
                formData={formData}
                onUpdate={onUpdate}
                updateArray={updateArray}
                addItem={addItem}
                removeItem={removeItem}
            />
        );
    };
}
