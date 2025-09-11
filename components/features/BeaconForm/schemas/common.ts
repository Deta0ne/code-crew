import { z } from 'zod';
import {
    ProjectType,
    projectTypes,
    getTypeSpecificSchema,
    commonFieldsSchema,
    FormStep,
} from '../types';

export type { CommonFieldsForm } from '../types';

// Complete project form schema
export const completeProjectSchema = z.object({
    ...commonFieldsSchema.shape,
    project_type: z.enum(projectTypes),
    type_specific_data: z.any(), // This will be validated separately based on project type
});

export type CompleteProjectForm = z.infer<typeof completeProjectSchema>;

// Type for form data
interface FormData {
    project_type?: ProjectType;
    type_specific_data?: Record<string, unknown>;
    [key: string]: unknown;
}

// Step-specific validation
export function validateStep(step: FormStep, data: FormData, type?: ProjectType) {
    switch (step) {
        case 1: // Type Selection
            return z.object({
                project_type: z.enum(projectTypes),
            }).safeParse(data);

        case 2: // Common Fields
            return commonFieldsSchema.safeParse(data);

        case 3: // Type-specific Fields
            if (!type) return { success: false, error: new Error('Project type is required') };
            return getTypeSpecificSchema(type).safeParse(data.type_specific_data || {});

        case 4: // Preview
            if (!type) return { success: false, error: new Error('Project type is required') };
            return completeProjectSchema
                .extend({
                    type_specific_data: getTypeSpecificSchema(type),
                })
                .safeParse(data);

        default:
            return { success: false, error: new Error('Invalid step') };
    }
}

// Helper function to check if a step is complete
export function isStepComplete(step: FormStep, data: FormData, type?: ProjectType): boolean {
    const validation = validateStep(step, data, type);
    return validation.success;
}

// Helper function to get field error message
export function getFieldError(error: z.ZodError, field: string): string | undefined {
    const fieldError = error.issues.find((err: z.ZodIssue) => err.path[0] === field);
    return fieldError?.message;
}

// Helper function to check if required fields are filled for a step
export function getRequiredFields(step: FormStep): string[] {
    switch (step) {
        case 1:
            return ['project_type'];
        case 2:
            return ['title', 'description', 'category', 'difficulty'];
        case 3:
            return []; // This varies by project type and is handled by type-specific schemas
        case 4:
            return []; // All validation is handled by the complete schema
        default:
            return [];
    }
}