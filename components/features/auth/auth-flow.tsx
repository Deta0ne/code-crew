// components/features/auth/AuthFlow.tsx
'use client';

import { useState } from 'react';
import SignUpForm from './signup-form';
import SignInForm from './signIn-form';
import OTPVerificationForm from './otp-verification-form';

type AuthStep = 'signup' | 'signin' | 'verification' | 'forgot-password';

interface AuthFlowProps {
    initialStep?: AuthStep;
}

export default function AuthFlow({ initialStep = 'signup' }: AuthFlowProps) {
    const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep);
    const [verificationEmail, setVerificationEmail] = useState<string>('');

    const handleVerificationNeeded = (email: string) => {
        setVerificationEmail(email);
        setCurrentStep('verification');
    };

    const handleVerificationSuccess = () => {
        // redirect to dashboard
    };

    const handleBackToSignUp = () => {
        setCurrentStep('signup');
        setVerificationEmail('');
    };

    // const handleSwitchToSignIn = () => {
    //     setCurrentStep('signin');
    // };

    // const handleSwitchToSignUp = () => {
    //     setCurrentStep('signup');
    // };

    // const handleBackToSignIn = () => {
    //     setCurrentStep('signin');
    // };

    const handleForgotPassword = () => {
        setCurrentStep('forgot-password');
    };

    switch (currentStep) {
        case 'signup':
            return <SignUpForm onVerificationNeeded={handleVerificationNeeded} />;

        case 'signin':
            return <SignInForm onForgotPassword={handleForgotPassword} />;

        case 'verification':
            return (
                <OTPVerificationForm
                    email={verificationEmail}
                    onVerificationSuccess={handleVerificationSuccess}
                    onBackToSignUp={handleBackToSignUp}
                />
            );

        case 'forgot-password':
            return (
                // <ForgotPasswordForm
                //     onBackToSignIn={handleBackToSignIn}
                // />
                <div>sdsdsd</div>
            );

        default:
            return <SignUpForm onVerificationNeeded={handleVerificationNeeded} />;
    }
}
