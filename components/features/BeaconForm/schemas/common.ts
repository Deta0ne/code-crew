import { z } from 'zod';

// Base validation rules
export const baseProjectSchema = z.object({
  // Basic Info - Required fields
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must not exceed 255 characters')
    .refine(val => val.trim().length >= 3, 'Title cannot be just whitespace'),
  
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .refine(val => val.trim().length >= 20, 'Description cannot be just whitespace'),
  
  category: z.enum([
    'web',
    'mobile', 
    'desktop',
    'ai_ml',
    'data_science',
    'devops',
    'design',
    'blockchain',
    'game_dev',
    'other'
  ] as const),
  
  project_type: z.enum([
    'learning',
    'portfolio',
    'open_source', 
    'hackathon',
    'tutorial',
    'research'
  ] as const),
  
  difficulty: z.enum([
    'beginner_friendly',
    'intermediate', 
    'advanced'
  ] as const),
  
  // Team Info
  max_members: z
    .number()
    .min(2, 'Team must have at least 2 members')
    .max(20, 'Team cannot exceed 20 members')
    .int('Team size must be a whole number'),
  
  // Optional Basic Info
  short_description: z
    .string()
    .min(10, 'Short description must be at least 10 characters')
    .max(255, 'Short description must not exceed 255 characters')
    .optional(),
  
  // Flags
  is_beginner_friendly: z.boolean().default(true),
  mentoring_available: z.boolean().default(false),
  remote_friendly: z.boolean().default(true),
  
  // URLs - Optional but validated if provided
  github_url: z
    .string()
    .url('Invalid GitHub URL')
    .regex(/^https:\/\/github\.com\//, 'Must be a valid GitHub URL')
    .optional()
    .or(z.literal('')),
  
  project_url: z
    .string()
    .url('Invalid project URL')
    .regex(/^https?:\/\//, 'Must be a valid HTTP/HTTPS URL')
    .optional()
    .or(z.literal('')),
  
  image_url: z
    .string()
    .url('Invalid image URL')
    .regex(/^https?:\/\//, 'Must be a valid HTTP/HTTPS URL')
    .optional()
    .or(z.literal('')),
  
  // Tags
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .max(15, 'Cannot have more than 15 tags')
    .default([])
});

// Step 1: Type selection schema
export const typeSelectionSchema = z.object({
  project_type: baseProjectSchema.shape.project_type
});

// Step 2: Common fields schema
export const commonFieldsSchema = baseProjectSchema.pick({
  title: true,
  description: true,
  short_description: true,
  category: true,
  max_members: true,
  difficulty: true,
  is_beginner_friendly: true,
  mentoring_available: true,
  remote_friendly: true,
  github_url: true,
  project_url: true,
  image_url: true,
  tags: true
});

// Helper function to get schema for specific step
export const getStepSchema = (step: number) => {
  switch (step) {
    case 1:
      return typeSelectionSchema;
    case 2:
      return commonFieldsSchema;
    default:
      return z.object({});
  }
};

// Schema for form validation at submit
export const completeProjectSchema = baseProjectSchema.extend({
  type_specific_data: z.record(z.string(), z.any()).optional()
});

export type BaseProjectForm = z.infer<typeof baseProjectSchema>;
export type TypeSelectionForm = z.infer<typeof typeSelectionSchema>;
export type CommonFieldsForm = z.infer<typeof commonFieldsSchema>;
export type CompleteProjectForm = z.infer<typeof completeProjectSchema>;
