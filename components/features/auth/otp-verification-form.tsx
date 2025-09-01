// src/components/features/auth/OTPVerificationForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpVerificationSchema, type OTPVerificationInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { verifyOTP, resendOTP } from '@/app/(auth)/login/actions';

interface OTPVerificationFormProps {
    email: string;
    onVerificationSuccess?: () => void;
    onBackToSignUp?: () => void;
}

export default function OTPVerificationForm({
    email,
    onVerificationSuccess,
    onBackToSignUp,
}: OTPVerificationFormProps) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<OTPVerificationInput>({
        resolver: zodResolver(otpVerificationSchema),
        defaultValues: {
            email,
            token: '',
        },
    });

    // Countdown timer for resend button
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const onSubmit = async (data: OTPVerificationInput) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await verifyOTP(data);

            if (response.success && onVerificationSuccess) {
                onVerificationSuccess();
            } else {
                setError(response.error || 'Verification failed');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await resendOTP(email);

            if (response.success) {
                setTimeLeft(300); // Reset timer
                setCanResend(false);
                form.setValue('token', ''); // Clear the input
                // Optional: Show a success toast/message
            } else {
                setError(response.error || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full">
                    <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
                <CardDescription className="text-center">
                    We sent a 6-digit code to
                    <br />
                    <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* OTP Input */}
                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                placeholder="123456"
                                                className="text-center text-2xl font-mono tracking-widest"
                                                maxLength={6}
                                                autoComplete="one-time-code"
                                                disabled={isLoading}
                                                onChange={(e) => {
                                                    // Only allow numbers
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    field.onChange(value);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Verify Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || form.watch('token').length !== 6}
                        >
                            {false ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify Account'
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Resend Section */}
                <div className="mt-6 space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                        {!canResend ? (
                            <span>Resend code in {formatTime(timeLeft)}</span>
                        ) : (
                            <span>Didn&apos;t receive the code?</span>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleResendOTP}
                        disabled={!canResend || isLoading}
                    >
                        {false ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Resend Code
                            </>
                        )}
                    </Button>
                </div>

                {/* Back to Sign Up */}
                {onBackToSignUp && (
                    <div className="mt-6 text-center text-sm">
                        Wrong email?{' '}
                        <button
                            type="button"
                            onClick={onBackToSignUp}
                            className="font-medium text-primary hover:underline"
                            disabled={isLoading}
                        >
                            Go back to sign up
                        </button>
                    </div>
                )}

                {/* Help Text */}
                <div className="mt-6 text-center text-xs text-muted-foreground">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Check your spam folder if you don&apos;t see the email
                </div>
            </CardContent>
        </Card>
    );
}
