// Central export for all schemas
export * from './common';
export * from './type-specific';

import { z } from 'zod';
import { baseProjectSchema } from './common';
import { getTypeSpecificSchema } from './type-specific';
import type { ProjectType } from '../types';

// Complete form validation schema that combines base + type-specific
export const createCompleteFormSchema = (projectType: ProjectType) => {
  const typeSpecificSchema = getTypeSpecificSchema(projectType);
  
  return baseProjectSchema.extend({
    project_type: z.literal(projectType),
    type_specific_data: typeSpecificSchema.optional()
  });
};

// Schema for final form submission
export const submissionSchema = z.object({
  // Base project data
  title: z.string().min(3),
  description: z.string().min(20),
  short_description: z.string().min(10).optional(),
  category: z.enum([
    'web', 'mobile', 'desktop', 'ai_ml', 'data_science',
    'devops', 'design', 'blockchain', 'game_dev', 'other'
  ]),
  project_type: z.enum([
    'learning', 'portfolio', 'open_source', 
    'hackathon', 'tutorial', 'research'
  ]),
  difficulty: z.enum(['beginner_friendly', 'intermediate', 'advanced']),
  max_members: z.number().min(2).max(20),
  
  // Flags
  is_beginner_friendly: z.boolean(),
  mentoring_available: z.boolean(),
  remote_friendly: z.boolean(),
  
  // URLs
  github_url: z.string().optional(),
  project_url: z.string().optional(),
  image_url: z.string().optional(),
  
  // Additional data
  tags: z.array(z.string()).max(15),
  type_specific_data: z.record(z.string(), z.any()).optional(),
  
  // Owner info (added during submission)
  owner_id: z.string().uuid()
});

export type SubmissionForm = z.infer<typeof submissionSchema>;
