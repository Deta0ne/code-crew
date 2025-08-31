'use client';

import { useState } from 'react';
import SignUpForm from './signup-form';
import OTPVerificationForm from './otp-verification-form';

type AuthStep = 'signup' | 'verification' | 'signin';

interface AuthFlowProps {
    initialStep?: AuthStep;
}

export default function AuthFlow({ initialStep = 'signup' }: AuthFlowProps) {
    const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep);
    const [verificationEmail, setVerificationEmail] = useState<string>('');

    switch (currentStep) {
        case 'signup':
            return (
                <SignUpForm
                    onVerificationNeeded={(email) => {
                        setVerificationEmail(email);
                        setCurrentStep('verification');
                    }}
                />
            );

        case 'verification':
            return (
                <OTPVerificationForm
                    email={verificationEmail}
                    onVerificationSuccess={() => {
                        // User will be redirected automatically by auth hook
                    }}
                    onBackToSignUp={() => {
                        setCurrentStep('signup');
                    }}
                />
            );

        case 'signin':
            return '<SignInForm />';

        default:
            return <SignUpForm />;
    }
}
