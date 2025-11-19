import { LearningFields, PortfolioFields, OpenSourceFields, HackathonFields, TutorialFields, ResearchFields } from '../types';

// Base Props Interface
export interface BaseFieldsProps<T> {
    formData: Partial<T>;
    onUpdate: (data: Partial<T>) => void;
}

// Type-specific Props
export type LearningFieldsProps = BaseFieldsProps<LearningFields>;
export type PortfolioFieldsProps = BaseFieldsProps<PortfolioFields>;
export type OpenSourceFieldsProps = BaseFieldsProps<OpenSourceFields>;
export type HackathonFieldsProps = BaseFieldsProps<HackathonFields>;
export type TutorialFieldsProps = BaseFieldsProps<TutorialFields>;
export type ResearchFieldsProps = BaseFieldsProps<ResearchFields>;

// Helper Types
export type ArrayField<T> = keyof {
    [K in keyof T as T[K] extends string[] ? K : never]: T[K];
};
