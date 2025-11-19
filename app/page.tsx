import { Metadata } from 'next';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import StatsSection from '@/components/landing/StatsSection';
import SmoothScroll from '@/components/ui/SmoothScroll';

import BackgroundWrapper from '@/components/landing/BackgroundWrapper';

export const metadata: Metadata = {
    title: 'CodeCrew | Find Your Developer Squad & Ship Projects',
    description: 'The beacon for developers. Find your crew, collaborate on open source projects, and ship your dream applications. Join the community of builders today.',
    keywords: ['developer community', 'find developers', 'open source collaboration', 'coding team', 'ship side projects', 'hackathon team finder'],
    openGraph: {
        title: 'CodeCrew | Signal Your Next Adventure',
        description: 'Connect with developers, build teams, and launch projects. The beacon is lit.',
        url: 'https://code-crew-platform.vercel.app',
        siteName: 'CodeCrew',
        locale: 'en_US',
        type: 'website',
        // images: [
        //     {
        //         url: '/og-image.jpg', 
        //         width: 1200,
        //         height: 630,
        //         alt: 'CodeCrew - Developer Collaboration Platform',
        //     },
        // ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CodeCrew | Find Your Developer Squad',
        description: 'The beacon for developers. Find your crew, collaborate, and ship.',
        creator: '@CodeCrew36616',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

import ScrollProgress from '@/components/ui/ScrollProgress';

export default function Home() {
    return (
        <main className="bg-[#020817] min-h-screen text-white selection:bg-cyan-500/30 relative">
            <SmoothScroll />
            <ScrollProgress />
            <BackgroundWrapper />

            <div className="relative z-10 flex flex-col gap-0">
                {/* Sections are already optimized client components */}
                <HeroSection />
                <StatsSection />
                <FeaturesSection />
                <HowItWorksSection />
                <CTASection />

                <footer className="py-8 border-t border-slate-800/50 bg-[#020817]/80 backdrop-blur-sm text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} CodeCrew. All systems operational.</p>
                </footer>
            </div>
        </main>
    );
}
