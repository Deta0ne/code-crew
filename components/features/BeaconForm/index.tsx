'use client';

import { useBeaconForm } from './hooks/useBeaconForm';
import { useFormNavigation } from './hooks/useFormNavigation';
import { FormStepper } from './FormStepper';
import { TypeSelection } from './TypeSelection';
import { CommonFields } from './CommonFields';
import { TypeSpecificFields } from './TypeSpecificFields';
import { Preview } from './Preview';
import { FormNavigation } from './FormNavigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import type { CompleteProjectForm } from './schemas/common';

interface BeaconFormProps {
    trigger?: React.ReactNode;
    onSubmit?: (data: CompleteProjectForm) => Promise<void>;
    onSaveDraft?: (data: CompleteProjectForm) => Promise<void>;
}

export function BeaconForm({ trigger, onSubmit: onSubmitProp, onSaveDraft: onSaveDraftProp }: BeaconFormProps) {
    const {
        currentStep,
        selectedType,
        formData,
        isSubmitting,
        isDirty,
        canProceed,
        canGoBack,
        completedSteps,
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
        resetForm,
    } = useBeaconForm();

    // Handle form submission
    const handleSubmit = async () => {
        if (!isFormComplete || isSubmitting) return;

        try {
            setSubmitting(true);

            // Prepare submission data
            const submissionData = {
                ...formData,
                project_type: selectedType,
                type_specific_data: formData.type_specific_data || {},
            };

            // Call external submit handler
            if (onSubmitProp) {
                await onSubmitProp(submissionData as CompleteProjectForm);
            } else {
                // Default submission logic
                console.log('Submitting beacon:', submissionData);
            }

            // Reset form after successful submission
            resetForm();
        } catch (error) {
            console.error('Error submitting beacon:', error);
            // TODO: Add proper error handling
        } finally {
            setSubmitting(false);
        }
    };

    // Handle save as draft
    const handleSaveDraft = async () => {
        if (isSubmitting) return;

        try {
            setSubmitting(true);

            // Prepare draft data
            const draftData = {
                ...formData,
                project_type: selectedType,
                type_specific_data: formData.type_specific_data || {},
                status: 'draft',
            };

            // Call external save draft handler
            if (onSaveDraftProp) {
                await onSaveDraftProp(draftData as CompleteProjectForm);
            } else {
                // Default save draft logic
                console.log('Saving draft:', draftData);
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            // TODO: Add proper error handling
        } finally {
            setSubmitting(false);
        }
    };

    // Form navigation hook
    const navigation = useFormNavigation({
        currentStep,
        canProceed,
        canGoBack,
        isSubmitting,
        onNext: nextStep,
        onBack: previousStep,
        onSubmit: handleSubmit,
        onSaveDraft: handleSaveDraft,
    });
    // Default trigger button
    const defaultTrigger = <Button>Create Beacon</Button>;

    return (
        <Sheet>
            <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>

            <SheetContent className="w-[95%] sm:w-[700px] sm:max-w-none overflow-y-auto bg-white rounded-l-2xl">
                <SheetHeader className="border-b border-gray-100">
                    <SheetTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
                        Create Beacon
                    </SheetTitle>
                    <p className="text-gray-600 leading-relaxed">
                        Connect with developers who share your vision and build something amazing together.
                    </p>
                </SheetHeader>

                {/* Progress indicator */}
                <FormStepper
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    stepLabels={navigation.stepLabels}
                    progress={progress}
                />

                {/* Form content based on current step */}
                <div className="px-4">
                    {currentStep === 1 && <TypeSelection selectedType={selectedType} onTypeSelect={setSelectedType} />}

                    {currentStep === 2 && <CommonFields formData={formData} onUpdate={updateBaseData} />}

                    {currentStep === 3 && selectedType && (
                        <TypeSpecificFields
                            type={selectedType}
                            formData={formData.type_specific_data || {}}
                            onUpdate={updateTypeData}
                        />
                    )}

                    {currentStep === 4 && <Preview formData={formData as CompleteProjectForm} onEdit={goToStep} />}
                </div>

                {/* Navigation buttons */}
                <FormNavigation
                    currentStep={currentStep}
                    canProceed={canProceed}
                    canGoBack={canGoBack}
                    isSubmitting={isSubmitting}
                    isDirty={isDirty}
                    onNext={navigation.handleNext}
                    onBack={navigation.handleBack}
                    onSaveDraft={navigation.handleSaveDraft}
                    getNextButtonText={navigation.getNextButtonText}
                    getBackButtonText={navigation.getBackButtonText}
                    getSaveDraftButtonText={navigation.getSaveDraftButtonText}
                />
            </SheetContent>
        </Sheet>
    );
}

export default BeaconForm;
