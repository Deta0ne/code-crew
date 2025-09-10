import { useReducer, useCallback, useMemo } from 'react';
import type { 
  BeaconFormState, 
  FormAction, 
  ProjectType, 
  FormStep,
  BaseProjectData,
  TypeSpecificData
} from '../types';
import { 
  getStepSchema, 
  createStep3Schema, 
  createCompleteFormSchema 
} from '../schemas';

// Initial form state
const initialState: BeaconFormState = {
  currentStep: 1,
  selectedType: null,
  formData: {
    // Default values
    max_members: 5,
    is_beginner_friendly: true,
    mentoring_available: false,
    remote_friendly: true,
    tags: []
  },
  stepValidation: {
    1: false,
    2: false,
    3: false,
    4: false
  },
  isDirty: false,
  isSubmitting: false
};

// Form reducer
function formReducer(state: BeaconFormState, action: FormAction): BeaconFormState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
      
    case 'SET_TYPE':
      return {
        ...state,
        selectedType: action.payload,
        formData: {
          ...state.formData,
          project_type: action.payload
        },
        isDirty: true
      };
      
    case 'UPDATE_BASE_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        },
        isDirty: true
      };
      
    case 'UPDATE_TYPE_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          type_specific_data: {
            ...state.formData.type_specific_data,
            ...action.payload
          }
        },
        isDirty: true
      };
      
    case 'SET_STEP_VALIDATION':
      return {
        ...state,
        stepValidation: {
          ...state.stepValidation,
          [action.payload.step]: action.payload.isValid
        }
      };
      
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload
      };
      
    case 'RESET_FORM':
      return initialState;
      
    default:
      return state;
  }
}

export function useBeaconForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Actions
  const setCurrentStep = useCallback((step: FormStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setSelectedType = useCallback((type: ProjectType) => {
    dispatch({ type: 'SET_TYPE', payload: type });
  }, []);

  const updateBaseData = useCallback((data: Partial<BaseProjectData>) => {
    dispatch({ type: 'UPDATE_BASE_DATA', payload: data });
  }, []);

  const updateTypeData = useCallback((data: Partial<TypeSpecificData['data']>) => {
    dispatch({ type: 'UPDATE_TYPE_DATA', payload: data });
  }, []);

  const setStepValidation = useCallback((step: FormStep, isValid: boolean) => {
    dispatch({ type: 'SET_STEP_VALIDATION', payload: { step, isValid } });
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: isSubmitting });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Validation functions
  const validateCurrentStep = useCallback(() => {
    const { currentStep, selectedType, formData } = state;
    
    try {
      switch (currentStep) {
        case 1:
          return !!selectedType;
        
        case 2:
          const step2Schema = getStepSchema(2);
          step2Schema.parse(formData);
          return true;
        
        case 3:
          if (!selectedType) return false;
          const step3Schema = createStep3Schema(selectedType);
          step3Schema.parse(formData.type_specific_data || {});
          return true;
        
        case 4:
          if (!selectedType) return false;
          const completeSchema = createCompleteFormSchema(selectedType);
          completeSchema.parse(formData);
          return true;
        
        default:
          return false;
      }
    } catch {
      return false;
    }
  }, [state]);

  const validateStep = useCallback((step: FormStep) => {
    const { selectedType, formData } = state;
    
    try {
      switch (step) {
        case 1:
          return !!selectedType;
        
        case 2:
          const step2Schema = getStepSchema(2);
          step2Schema.parse(formData);
          return true;
        
        case 3:
          if (!selectedType) return false;
          const step3Schema = createStep3Schema(selectedType);
          step3Schema.parse(formData.type_specific_data || {});
          return true;
        
        case 4:
          if (!selectedType) return false;
          const completeSchema = createCompleteFormSchema(selectedType);
          completeSchema.parse(formData);
          return true;
        
        default:
          return false;
      }
    } catch {
      return false;
    }
  }, [state]);

  // Navigation helpers
  const canProceed = useMemo(() => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  const canGoBack = useMemo(() => {
    return state.currentStep > 1;
  }, [state.currentStep]);

  const nextStep = useCallback(() => {
    const { currentStep } = state;
    if (currentStep < 4 && canProceed) {
      setCurrentStep((currentStep + 1) as FormStep);
    }
  }, [state, canProceed, setCurrentStep]);

  const previousStep = useCallback(() => {
    const { currentStep } = state;
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as FormStep);
    }
  }, [state, setCurrentStep]);

  const goToStep = useCallback((step: FormStep) => {
    // Can only go to a step if all previous steps are valid
    const allPreviousStepsValid = Array.from(
      { length: step - 1 }, 
      (_, i) => validateStep((i + 1) as FormStep)
    ).every(Boolean);
    
    if (allPreviousStepsValid) {
      setCurrentStep(step);
    }
  }, [validateStep, setCurrentStep]);

  // Computed values
  const completedSteps = useMemo(() => {
    return [1, 2, 3, 4].filter(step => 
      validateStep(step as FormStep)
    ) as FormStep[];
  }, [validateStep]);

  const progress = useMemo(() => {
    // Progress based on current step, not completed steps
    return ((state.currentStep - 1) / 3) * 100;
  }, [state.currentStep]);

  const isFormComplete = useMemo(() => {
    return completedSteps.length === 4;
  }, [completedSteps]);

  return {
    // State
    ...state,
    
    // Actions
    setCurrentStep,
    setSelectedType,
    updateBaseData,
    updateTypeData,
    setStepValidation,
    setSubmitting,
    resetForm,
    
    // Navigation
    nextStep,
    previousStep,
    goToStep,
    canProceed,
    canGoBack,
    
    // Validation
    validateCurrentStep,
    validateStep,
    
    // Computed
    completedSteps,
    progress,
    isFormComplete
  };
}
