'use client';

import { BeaconForm } from '@/components/features/BeaconForm';
import { Button } from '@/components/ui/button';
import { TowerControl } from 'lucide-react';

export function HomeHero() {
    return (
        <div className="relative overflow-hidden">
            <div className="container mx-auto px-0 sm:px-6 py-6 sm:py-10 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-3 text-center lg:text-left order-2 lg:order-1">
                        {/* Logo and Tagline */}
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                <span className="text-foreground">Code</span>
                                <span className="text-yellow-500 dark:text-yellow-400">CREW</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium">FIND YOUR DREAM TEAM</p>
                        </div>
                    </div>

                    {/* Middle Content - Beacon Icon */}
                    <div className="flex items-center justify-center order-1 lg:order-2 cursor-pointer">
                        <div className="pt-2">
                            <BeaconForm
                                trigger={
                                    <div className="relative scale-75 sm:scale-90 lg:scale-100">
                                        {/* Animated Rings */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div
                                                className="absolute w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full border-[2px] border-yellow-500/30 dark:border-yellow-400/30 animate-ping"
                                                style={{ animationDuration: '3s', animationDelay: '0.5s' }}
                                            />
                                            <div
                                                className="absolute w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full border-[2px] border-yellow-500/40 dark:border-yellow-400/40 animate-ping"
                                                style={{ animationDuration: '3s', animationDelay: '1s' }}
                                            />
                                        </div>

                                        {/* Bell Icon */}
                                        <div className="relative z-10 bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-2xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                                            <TowerControl
                                                className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-black"
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col items-center justify-center lg:items-end lg:justify-end space-y-2 order-3">
                        <div className="text-center">
                            {/* Main Heading */}
                            <div className="text-center">
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground leading-tight">
                                    BUILD TOGETHER.
                                    <br />
                                    INNOVATE. CONQUER.
                                </h2>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-2">
                                <BeaconForm
                                    trigger={
                                        <Button size="sm" className="cursor-pointer">
                                            CREATE BEACON!
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-500/5 dark:bg-yellow-400/5 rounded-full blur-xl" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-500/5 dark:bg-yellow-400/5 rounded-full blur-xl" />
            </div>
        </div>
    );
}
