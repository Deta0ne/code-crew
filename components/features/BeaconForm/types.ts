import { z } from 'zod';

// Form Steps
export type FormStep = 1 | 2 | 3 | 4;

// Project Types
export const projectTypes = [
    'learning',
    'portfolio',
    'open_source',
    'hackathon',
    'tutorial',
    'research',
] as const;

export type ProjectType = typeof projectTypes[number];

// Common Fields Form
export const commonFieldsSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(1, 'Category is required'),
    difficulty: z.enum(['easy', 'intermediate', 'advanced'], {
        message: 'Difficulty is required',
    }),
    max_members: z.number().min(1).max(10).default(2),
    is_beginner_friendly: z.boolean().default(false),
    mentoring_available: z.boolean().default(false),
    remote_friendly: z.boolean().default(true),
    github_url: z.url().optional(),
    project_url: z.url().optional(),
    image_url: z.url().optional(),
    tags: z.array(z.string()).default([]),
});

export type CommonFieldsForm = z.infer<typeof commonFieldsSchema>;

// Learning Project Types
export const learningFieldsSchema = z.object({
    learning_goals: z.array(z.string()).min(1, 'At least one learning goal is required'),
    technologies_to_learn: z.array(z.string()).min(1, 'At least one technology is required'),
    timeline_weeks: z.number().min(1).max(52),
    resources_provided: z.array(z.string()).default([]),
});

export type LearningFields = z.infer<typeof learningFieldsSchema>;

// Portfolio Project Types
export const portfolioFieldsSchema = z.object({
    showcase_purpose: z.enum(['job_search', 'freelance', 'skill_demonstration', 'startup']),
    target_audience: z.array(z.string()).min(1, 'At least one target employer/client is required'),
    key_features: z.array(z.string()).min(1, 'At least one key feature is required'),
    deployment_requirements: z.array(z.string()).default([]),
});

export type PortfolioFields = z.infer<typeof portfolioFieldsSchema>;

// Open Source Project Types
export const openSourceFieldsSchema = z.object({
    license_type: z.enum(['mit', 'apache', 'gpl', 'bsd', 'other']),
    contribution_guidelines: z.array(z.string()).min(1, 'At least one contribution guideline is required'),
    documentation_standards: z.array(z.string()).min(1, 'At least one documentation standard is required'),
    community_goals: z.array(z.string()).default([]),
});

export type OpenSourceFields = z.infer<typeof openSourceFieldsSchema>;

// Hackathon Project Types
export const hackathonFieldsSchema = z.object({
    deadline: z.string().min(1, 'Deadline is required'),
    prize_pool: z.array(z.string()).min(1, 'At least one prize detail is required'),
    submission_requirements: z.array(z.string()).min(1, 'At least one submission requirement is required'),
    rules: z.array(z.string()).min(1, 'At least one rule is required'),
});

export type HackathonFields = z.infer<typeof hackathonFieldsSchema>;

// Tutorial Project Types
export const tutorialFieldsSchema = z.object({
    target_audience: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']),
    prerequisites: z.array(z.string()).default([]),
    learning_outcomes: z.array(z.string()).min(1, 'At least one learning outcome is required'),
    content_outline: z.array(z.string()).min(1, 'At least one content section is required'),
});

export type TutorialFields = z.infer<typeof tutorialFieldsSchema>;

// Research Project Types
export const researchFieldsSchema = z.object({
    research_area: z.enum(['ai_ml', 'blockchain', 'security', 'systems', 'data_science', 'other']),
    methodology: z.array(z.string()).min(1, 'At least one methodology step is required'),
    expected_outcomes: z.array(z.string()).min(1, 'At least one expected outcome is required'),
    publication_plan: z.array(z.string()).default([]),
});

export type ResearchFields = z.infer<typeof researchFieldsSchema>;

// Type-specific data union type
export type TypeSpecificData =
    | LearningFields
    | PortfolioFields
    | OpenSourceFields
    | HackathonFields
    | TutorialFields
    | ResearchFields;

// Helper function to get the correct schema based on project type
export function getTypeSpecificSchema(type: ProjectType) {
    const schemas = {
        learning: learningFieldsSchema,
        portfolio: portfolioFieldsSchema,
        open_source: openSourceFieldsSchema,
        hackathon: hackathonFieldsSchema,
        tutorial: tutorialFieldsSchema,
        research: researchFieldsSchema,
    };

    return schemas[type];
}

// Helper function to validate type-specific data
export function validateTypeSpecificData(type: ProjectType, data: unknown) {
    const schema = getTypeSpecificSchema(type);
    return schema.safeParse(data);
}

export interface PreviewProps {
    formData: Record<string, unknown>;
    onEdit: (step: FormStep) => void;
}