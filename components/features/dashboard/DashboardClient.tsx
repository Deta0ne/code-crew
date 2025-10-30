'use client';

import { useState, useMemo } from 'react';
import { ProjectApplication, ProjectBookmark } from '@/components/features/dashboard/types';
import OwnerApplications from '@/components/features/dashboard/components/OwnerApplications';
import ApplicantApplications from '@/components/features/dashboard/components/ApplicantApplications';
import ActiveProjects from '@/components/features/dashboard/components/ActiveProjects';
import SavedProjects from '@/components/features/dashboard/components/SavedProjects';
import { StatCard } from './components/StatCard';
import { useDashboardHandlers } from './hooks/useDashboardHandlers';
import { calculateStats } from '@/components/features/dashboard/utils';
import { STAT_CARD_CONFIGS } from '@/components/features/dashboard/constants';
import type { DashboardClientProps, TabType, StatCardConfig } from '@/components/features/dashboard/types';

export default function DashboardClient({
    initialOwnerData,
    initialApplicantData,
    initialBookmarkData,
    initialActiveProjects,
    userId,
}: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>('owner');
    const [ownerData, setOwnerData] = useState<ProjectApplication[]>(initialOwnerData);
    const [applicantData, setApplicantData] = useState<ProjectApplication[]>(initialApplicantData);
    const [bookmarkData, setBookmarkData] = useState<ProjectBookmark[]>(initialBookmarkData);

    const { handleUpdateApplication, handleDeleteApplication, handleRemoveBookmark } = useDashboardHandlers(
        userId,
        setOwnerData,
        setApplicantData,
        setBookmarkData,
    );

    // Calculate statistics with memoization
    const statsData = useMemo(
        () => calculateStats(ownerData, applicantData, initialActiveProjects, bookmarkData),
        [ownerData, applicantData, initialActiveProjects, bookmarkData],
    );

    // Build complete stat cards configuration
    const stats: StatCardConfig[] = useMemo(
        () =>
            STAT_CARD_CONFIGS.map((config) => ({
                ...config,
                ...statsData[config.id],
            })),
        [statsData],
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-6 py-8 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-lg">
                        Manage your projects, applications, and saved beacons
                    </p>
                </div>

                {/* Stats Cards / Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} stat={stat} isActive={activeTab === stat.id} onClick={setActiveTab} />
                    ))}
                </div>

                {/* Tab Content */}
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
                    {activeTab === 'owner' && (
                        <OwnerApplications applications={ownerData} onUpdateApplication={handleUpdateApplication} />
                    )}

                    {activeTab === 'applicant' && (
                        <ApplicantApplications
                            applications={applicantData}
                            onDeleteApplication={handleDeleteApplication}
                        />
                    )}

                    {activeTab === 'active' && <ActiveProjects projects={initialActiveProjects} />}

                    {activeTab === 'saved' && (
                        <SavedProjects bookmarks={bookmarkData} onRemoveBookmark={handleRemoveBookmark} />
                    )}
                </div>
            </div>
        </div>
    );
}
