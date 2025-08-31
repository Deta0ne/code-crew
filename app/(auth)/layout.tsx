// src/app/(auth)/layout.tsx
import { Suspense } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    console.log('time');
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="flex min-h-screen">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
                    <div className="mx-auto max-w-md">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Code<span className="text-primary">Crew</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">Find your perfect development team</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-semibold">1</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Create Your Profile</h3>
                                    <p className="text-sm text-gray-600">Showcase your skills and experience</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-semibold">2</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Find Team Members</h3>
                                    <p className="text-sm text-gray-600">
                                        Connect with developers who complement your skills
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-semibold">3</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Build Amazing Projects</h3>
                                    <p className="text-sm text-gray-600">
                                        Collaborate and create something extraordinary
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Forms */}
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-md">
                        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
