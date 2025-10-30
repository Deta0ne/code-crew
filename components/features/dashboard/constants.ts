import { TrendingUp, Users, Rocket, Bookmark } from 'lucide-react';
import type { StatCardConfig } from './types';

export const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    accepted: {
        label: 'Accepted',
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    rejected: {
        label: 'Rejected',
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
} as const;

export const ROLE_LABELS = {
    owner: 'Owner',
    co_lead: 'Co-Lead',
    member: 'Member',
} as const;

export const GRID_CLASSES = 'grid gap-4 sm:grid-cols-2';

export const CHART_CONFIG = {
    WIDTH: 140,
    HEIGHT: 60,
    PADDING: 5,
    STROKE_WIDTH: 2.5,
    DAYS: 7,
} as const;

export const STAT_CARD_CONFIGS: Omit<StatCardConfig, 'value' | 'badge' | 'chartData'>[] = [
    {
        id: 'owner',
        label: 'Owner',
        icon: TrendingUp,
        gradient: 'from-blue-500/10 via-cyan-500/10 to-blue-600/10',
        iconColor: 'text-blue-600 dark:text-blue-400',
        badgeColor: 'bg-blue-500',
        chartColor: '#3b82f6',
        shadowColor: 'shadow-blue-500/20',
    },
    {
        id: 'applicant',
        label: 'Applicant',
        icon: Users,
        gradient: 'from-purple-500/10 via-pink-500/10 to-purple-600/10',
        iconColor: 'text-purple-600 dark:text-purple-400',
        badgeColor: 'bg-purple-500',
        chartColor: '#a855f7',
        shadowColor: 'shadow-purple-500/20',
    },
    {
        id: 'active',
        label: 'Active',
        icon: Rocket,
        gradient: 'from-green-500/10 via-emerald-500/10 to-green-600/10',
        iconColor: 'text-green-600 dark:text-green-400',
        badgeColor: 'bg-green-500',
        chartColor: '#22c55e',
        shadowColor: 'shadow-green-500/20',
    },
    {
        id: 'saved',
        label: 'Saved',
        icon: Bookmark,
        gradient: 'from-orange-500/10 via-amber-500/10 to-orange-600/10',
        iconColor: 'text-orange-600 dark:text-orange-400',
        badgeColor: 'bg-orange-500',
        chartColor: '#f97316',
        shadowColor: 'shadow-orange-500/20',
    },
] as const;