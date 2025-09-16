import { z } from 'zod';

export const applicationSchema = z.object({
    project_id: z.string().uuid(),
    motivation_message: z.string().min(50, 'Motivation message must be at least 50 characters'),
    what_they_bring: z.string().min(20, 'Please describe what you bring (minimum 20 characters)').optional(),
    what_they_want_to_learn: z.string().min(20, 'Please describe what you want to learn (minimum 20 characters)').optional(),
    hours_per_week: z.number().min(1).max(50).optional(),
    timezone: z.string().optional(),
    portfolio_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    github_url: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
    applied_role_id: z.number().optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

