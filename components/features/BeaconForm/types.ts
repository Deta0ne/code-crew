// BeaconForm types based on database schema

// Database enums
export type ProjectCategory = 
  | 'web' 
  | 'mobile' 
  | 'desktop' 
  | 'ai_ml' 
  | 'data_science' 
  | 'devops' 
  | 'design' 
  | 'blockchain' 
  | 'game_dev' 
  | 'other';

export type ProjectType = 
  | 'learning' 
  | 'portfolio' 
  | 'open_source' 
  | 'hackathon' 
  | 'tutorial' 
  | 'research';

export type ProjectStatus = 
  | 'draft' 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'cancelled';

export type ProjectDifficulty = 
  | 'beginner_friendly' 
  | 'intermediate' 
  | 'advanced';

export type MemberRole = 
  | 'owner' 
  | 'co_lead' 
  | 'member';

// Form step management
export type FormStep = 1 | 2 | 3 | 4;

export interface FormStepState {
  step: FormStep;
  isValid: boolean;
  isCompleted: boolean;
}

// Base project form data (common to all types)
export interface BaseProjectData {
  // Basic Info
  title: string;
  description: string;
  short_description?: string;
  category: ProjectCategory;
  project_type: ProjectType;
  
  // Team Info
  max_members: number;
  difficulty: ProjectDifficulty;
  
  // Flags
  is_beginner_friendly: boolean;
  mentoring_available: boolean;
  remote_friendly: boolean;
  
  // URLs
  github_url?: string;
  project_url?: string;
  image_url?: string;
  
  // Tags
  tags: string[];
}

// Type-specific data interfaces
export interface HackathonData {
  deadline: Date;
  hackathon_name: string;
  submission_url?: string;
  prize_pool?: string;
  rules_url?: string;
}

export interface TutorialData {
  target_audience: string;
  content_outline: string[];
  estimated_duration_hours: number;
  prerequisites: string[];
  learning_outcomes: string[];
}

export interface ResearchData {
  research_area: string;
  methodology: string;
  expected_outcomes: string[];
  publication_plan?: string;
  funding_source?: string;
}

export interface LearningData {
  learning_goals: string[];
  skill_level_required: string;
  resources_provided: string[];
  timeline_weeks: number;
}

export interface PortfolioData {
  showcase_purpose: string;
  target_employers?: string[];
  deployment_requirements: string[];
  demo_url?: string;
}

export interface OpenSourceData {
  license_type: string;
  contribution_guidelines: string;
  maintenance_commitment: string;
  community_size_goal?: number;
  documentation_standards: string[];
}

// Combined type-specific data
export type TypeSpecificData = 
  | { project_type: 'hackathon'; data: HackathonData }
  | { project_type: 'tutorial'; data: TutorialData }
  | { project_type: 'research'; data: ResearchData }
  | { project_type: 'learning'; data: LearningData }
  | { project_type: 'portfolio'; data: PortfolioData }
  | { project_type: 'open_source'; data: OpenSourceData };

// Complete project form data
export interface ProjectFormData extends BaseProjectData {
  type_specific_data?: Partial<TypeSpecificData['data']>;
}

// Form state management
export interface BeaconFormState {
  currentStep: FormStep;
  selectedType: ProjectType | null;
  formData: Partial<ProjectFormData>;
  stepValidation: Record<FormStep, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Form actions
export type FormAction = 
  | { type: 'SET_STEP'; payload: FormStep }
  | { type: 'SET_TYPE'; payload: ProjectType }
  | { type: 'UPDATE_BASE_DATA'; payload: Partial<BaseProjectData> }
  | { type: 'UPDATE_TYPE_DATA'; payload: Partial<TypeSpecificData['data']> }
  | { type: 'SET_STEP_VALIDATION'; payload: { step: FormStep; isValid: boolean } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' };

// Component props interfaces
export interface TypeSelectionProps {
  selectedType: ProjectType | null;
  onTypeSelect: (type: ProjectType) => void;
}

export interface CommonFieldsProps {
  formData: Partial<BaseProjectData>;
  onUpdate: (data: Partial<BaseProjectData>) => void;
  errors?: Record<string, string>;
}

export interface TypeSpecificFieldsProps {
  type: ProjectType;
  formData: Partial<TypeSpecificData['data']>;
  onUpdate: (data: Partial<TypeSpecificData['data']>) => void;
  errors?: Record<string, string>;
}

export interface PreviewProps {
  formData: ProjectFormData;
  onEdit: (step: FormStep) => void;
}

export interface FormNavigationProps {
  currentStep: FormStep;
  canProceed: boolean;
  canGoBack: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
}

export interface FormStepperProps {
  currentStep: FormStep;
  completedSteps: FormStep[];
  stepLabels: Record<FormStep, string>;
}

// API related types
export interface CreateProjectRequest extends ProjectFormData {
  owner_id: string;
}

export interface CreateProjectResponse {
  id: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

// Validation error types
export interface FormValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormErrors {
  base?: FormValidationError[];
  typeSpecific?: FormValidationError[];
}
