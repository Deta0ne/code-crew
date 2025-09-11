'use client';

import { useReducer, useCallback, useMemo } from 'react';
import { ProjectType, FormStep } from '../types';
import { validateStep, CompleteProjectForm } from '../schemas/common';

// State type
interface BeaconFormState {
    currentStep: FormStep;
    selectedType: ProjectType | undefined;
    formData: Partial<CompleteProjectForm>;
    isSubmitting: boolean;
    isDirty: boolean;
    errors: Record<string, string>;
    completedSteps: FormStep[];
}

// Action types
type BeaconFormAction =
    | { type: 'SET_TYPE'; payload: ProjectType }
    | { type: 'UPDATE_BASE_DATA'; payload: Partial<CompleteProjectForm> }
    | { type: 'UPDATE_TYPE_DATA'; payload: Record<string, unknown> }
    | { type: 'NEXT_STEP' }
    | { type: 'PREVIOUS_STEP' }
    | { type: 'GO_TO_STEP'; payload: FormStep }
    | { type: 'SET_SUBMITTING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: { field: string; message: string } }
    | { type: 'CLEAR_ERROR'; payload: string }
    | { type: 'RESET_FORM' };

// Initial state
const initialState: BeaconFormState = {
    currentStep: 1,
    selectedType: undefined,
    formData: {
        max_members: 2,
        is_beginner_friendly: false,
        mentoring_available: false,
        remote_friendly: true,
        tags: [],
    },
    isSubmitting: false,
    isDirty: false,
    errors: {},
    completedSteps: [],
};

// Reducer
function beaconFormReducer(state: BeaconFormState, action: BeaconFormAction): BeaconFormState {
    switch (action.type) {
        case 'SET_TYPE':
            return {
                ...state,
                selectedType: action.payload,
                isDirty: true,
                completedSteps: updateCompletedSteps(1, state.completedSteps),
            };

        case 'UPDATE_BASE_DATA': {
            const newFormData = { ...state.formData, ...action.payload };
            const validation = validateStep(2, newFormData);
            return {
                ...state,
                formData: newFormData,
                isDirty: true,
                completedSteps: validation.success 
                    ? updateCompletedSteps(2, state.completedSteps)
                    : state.completedSteps,
            };
        }

        case 'UPDATE_TYPE_DATA': {
            const newTypeData = { ...state.formData.type_specific_data, ...action.payload };
            const validation = validateStep(3, { type_specific_data: newTypeData }, state.selectedType);
            return {
                ...state,
                formData: {
                    ...state.formData,
                    type_specific_data: newTypeData,
                },
                isDirty: true,
                completedSteps: validation.success
                    ? updateCompletedSteps(3, state.completedSteps)
                    : state.completedSteps,
            };
        }

        case 'NEXT_STEP':
            return {
                ...state,
                currentStep: Math.min(state.currentStep + 1, 4) as FormStep,
            };

        case 'PREVIOUS_STEP':
            return {
                ...state,
                currentStep: Math.max(state.currentStep - 1, 1) as FormStep,
            };

        case 'GO_TO_STEP':
            return {
                ...state,
                currentStep: action.payload,
            };

        case 'SET_SUBMITTING':
            return {
                ...state,
                isSubmitting: action.payload,
            };

        case 'SET_ERROR':
            return {
                ...state,
                errors: { ...state.errors, [action.payload.field]: action.payload.message },
            };

        case 'CLEAR_ERROR':
            const { [action.payload]: _, ...remainingErrors } = state.errors;
            return {
                ...state,
                errors: remainingErrors,
            };

        case 'RESET_FORM':
            return initialState;

        default:
            return state;
    }
}

// Helper function to update completed steps
function updateCompletedSteps(step: FormStep, currentCompleted: FormStep[]): FormStep[] {
    if (!currentCompleted.includes(step)) {
        return [...currentCompleted, step].sort() as FormStep[];
    }
    return currentCompleted;
}

// Hook
export function useBeaconForm() {
    const [state, dispatch] = useReducer(beaconFormReducer, initialState);

    // Computed values
    const canProceed = useMemo(() => {
        const validation = validateStep(state.currentStep, {
            ...state.formData,
            project_type: state.selectedType,
        }, state.selectedType);
        return validation.success;
    }, [state.currentStep, state.formData, state.selectedType]);

    const canGoBack = state.currentStep > 1;

    const progress = useMemo(() => {
        return ((state.currentStep - 1) / 3) * 100;
    }, [state.currentStep]);

    const isFormComplete = useMemo(() => {
        return state.completedSteps.length === 4;
    }, [state.completedSteps]);

    // Actions
    const setSelectedType = useCallback((type: ProjectType) => {
        dispatch({ type: 'SET_TYPE', payload: type });
    }, []);

    const updateBaseData = useCallback((data: Partial<CompleteProjectForm>) => {
        dispatch({ type: 'UPDATE_BASE_DATA', payload: data });
    }, []);

    const updateTypeData = useCallback((data: Record<string, unknown>) => {
        dispatch({ type: 'UPDATE_TYPE_DATA', payload: data });
    }, []);

    const nextStep = useCallback(() => {
        if (canProceed) {
            dispatch({ type: 'NEXT_STEP' });
        }
    }, [canProceed]);

    const previousStep = useCallback(() => {
        if (canGoBack) {
            dispatch({ type: 'PREVIOUS_STEP' });
        }
    }, [canGoBack]);

    const goToStep = useCallback((step: FormStep) => {
        dispatch({ type: 'GO_TO_STEP', payload: step });
    }, []);

    const setSubmitting = useCallback((isSubmitting: boolean) => {
        dispatch({ type: 'SET_SUBMITTING', payload: isSubmitting });
    }, []);

    const setError = useCallback((field: string, message: string) => {
        dispatch({ type: 'SET_ERROR', payload: { field, message } });
    }, []);

    const clearError = useCallback((field: string) => {
        dispatch({ type: 'CLEAR_ERROR', payload: field });
    }, []);

    const resetForm = useCallback(() => {
        dispatch({ type: 'RESET_FORM' });
    }, []);

    return {
        // State
        currentStep: state.currentStep,
        selectedType: state.selectedType,
        formData: state.formData,
        isSubmitting: state.isSubmitting,
        isDirty: state.isDirty,
        errors: state.errors,
        completedSteps: state.completedSteps,

        // Computed
        canProceed,
        canGoBack,
        progress,
        isFormComplete,

        // Actions
        setSelectedType,
        updateBaseData,
        updateTypeData,
        nextStep,
        previousStep,
        goToStep,
        setSubmitting,
        setError,
        clearError,
        resetForm,
    };
}