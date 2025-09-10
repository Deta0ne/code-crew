import { z } from 'zod';
import type { ProjectType } from '../types';

// Hackathon specific schema
export const hackathonSchema = z.object({
  deadline: z
    .date()
    .min(new Date(), 'Deadline must be in the future'),
  
  hackathon_name: z
    .string()
    .min(3, 'Hackathon name must be at least 3 characters')
    .max(100, 'Hackathon name must not exceed 100 characters'),
  
  submission_url: z
    .string()
    .url('Invalid submission URL')
    .optional()
    .or(z.literal('')),
  
  prize_pool: z
    .string()
    .max(100, 'Prize pool description too long')
    .optional(),
  
  rules_url: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
});

// Tutorial specific schema
export const tutorialSchema = z.object({
  target_audience: z
    .string()
    .min(10, 'Target audience description must be at least 10 characters')
    .max(500, 'Target audience description too long'),
  
  content_outline: z
    .array(z.string().min(1, 'Outline item cannot be empty'))
    .min(1, 'Tutorial must have at least one content outline item')
    .max(20, 'Tutorial cannot have more than 20 outline items'),
  
  estimated_duration_hours: z
    .number()
    .min(1, 'Tutorial must be at least 1 hour')
    .max(200, 'Tutorial duration too long')
    .int('Duration must be whole hours'),
  
  prerequisites: z
    .array(z.string().min(1, 'Prerequisite cannot be empty'))
    .max(10, 'Cannot have more than 10 prerequisites')
    .default([]),
  
  learning_outcomes: z
    .array(z.string().min(1, 'Learning outcome cannot be empty'))
    .min(1, 'Must specify at least one learning outcome')
    .max(15, 'Cannot have more than 15 learning outcomes')
});

// Research specific schema
export const researchSchema = z.object({
  research_area: z
    .string()
    .min(10, 'Research area description must be at least 10 characters')
    .max(500, 'Research area description too long'),
  
  methodology: z
    .string()
    .min(20, 'Methodology description must be at least 20 characters')
    .max(1000, 'Methodology description too long'),
  
  expected_outcomes: z
    .array(z.string().min(1, 'Expected outcome cannot be empty'))
    .min(1, 'Must specify at least one expected outcome')
    .max(10, 'Cannot have more than 10 expected outcomes'),
  
  publication_plan: z
    .string()
    .max(500, 'Publication plan too long')
    .optional(),
  
  funding_source: z
    .string()
    .max(200, 'Funding source description too long')
    .optional()
});

// Learning specific schema
export const learningSchema = z.object({
  learning_goals: z
    .array(z.string().min(1, 'Learning goal cannot be empty'))
    .min(1, 'Must specify at least one learning goal')
    .max(10, 'Cannot have more than 10 learning goals'),
  
  skill_level_required: z
    .string()
    .min(5, 'Skill level description must be at least 5 characters')
    .max(200, 'Skill level description too long'),
  
  resources_provided: z
    .array(z.string().min(1, 'Resource cannot be empty'))
    .max(15, 'Cannot have more than 15 resources')
    .default([]),
  
  timeline_weeks: z
    .number()
    .min(1, 'Timeline must be at least 1 week')
    .max(52, 'Timeline cannot exceed 52 weeks')
    .int('Timeline must be whole weeks')
});

// Portfolio specific schema
export const portfolioSchema = z.object({
  showcase_purpose: z
    .string()
    .min(10, 'Showcase purpose must be at least 10 characters')
    .max(300, 'Showcase purpose too long'),
  
  target_employers: z
    .array(z.string().min(1, 'Employer name cannot be empty'))
    .max(10, 'Cannot target more than 10 employers')
    .default([]),
  
  deployment_requirements: z
    .array(z.string().min(1, 'Requirement cannot be empty'))
    .min(1, 'Must specify at least one deployment requirement')
    .max(10, 'Cannot have more than 10 deployment requirements'),
  
  demo_url: z
    .string()
    .url('Invalid demo URL')
    .optional()
    .or(z.literal(''))
});

// Open source specific schema
export const openSourceSchema = z.object({
  license_type: z
    .string()
    .min(3, 'License type must be specified')
    .max(50, 'License type too long'),
  
  contribution_guidelines: z
    .string()
    .min(20, 'Contribution guidelines must be at least 20 characters')
    .max(1000, 'Contribution guidelines too long'),
  
  maintenance_commitment: z
    .string()
    .min(10, 'Maintenance commitment must be at least 10 characters')
    .max(300, 'Maintenance commitment too long'),
  
  community_size_goal: z
    .number()
    .min(1, 'Community size goal must be at least 1')
    .max(100000, 'Community size goal too large')
    .int('Community size must be a whole number')
    .optional(),
  
  documentation_standards: z
    .array(z.string().min(1, 'Documentation standard cannot be empty'))
    .max(10, 'Cannot have more than 10 documentation standards')
    .default([])
});

// Map of project types to their schemas
export const typeSpecificSchemas = {
  hackathon: hackathonSchema,
  tutorial: tutorialSchema,
  research: researchSchema,
  learning: learningSchema,
  portfolio: portfolioSchema,
  open_source: openSourceSchema
} as const;

// Helper function to get schema for specific project type
export const getTypeSpecificSchema = (projectType: ProjectType) => {
  return typeSpecificSchemas[projectType];
};

// Combined schema for step 3 validation
export const createStep3Schema = (projectType: ProjectType) => {
  return getTypeSpecificSchema(projectType);
};

// Type exports
export type HackathonForm = z.infer<typeof hackathonSchema>;
export type TutorialForm = z.infer<typeof tutorialSchema>;
export type ResearchForm = z.infer<typeof researchSchema>;
export type LearningForm = z.infer<typeof learningSchema>;
export type PortfolioForm = z.infer<typeof portfolioSchema>;
export type OpenSourceForm = z.infer<typeof openSourceSchema>;

export type TypeSpecificForm = 
  | HackathonForm
  | TutorialForm  
  | ResearchForm
  | LearningForm
  | PortfolioForm
  | OpenSourceForm;
