import { CHART_CONFIG,  } from './constants';
import type { ChartDataItem } from './types';

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// export function getStatusBadge(status: 'pending' | 'accepted' | 'rejected') {
//     const config = STATUS_CONFIG[status];
//     return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
// }

export function calculateProgress(currentMembers: number, maxMembers: number): number {
    return Math.round((currentMembers / maxMembers) * 100);
}

export function generateChartData(data: ChartDataItem[], days: number = CHART_CONFIG.DAYS): number[] {
    if (data.length === 0) return Array(days).fill(0);

    const now = new Date();
    const counts = Array(days).fill(0);

    data.forEach((item) => {
        const createdDate = new Date(item.created_at);
        const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff < days) {
            const index = days - 1 - daysDiff;
            counts[index]++;
        }
    });

    // Create cumulative data for better visualization
    let cumulative = 0;
    return counts.map((count) => {
        cumulative += count;
        return Math.max(cumulative, 1); // Ensure at least 1 for visual purposes
    });
}

export function calculateStats(
    ownerData: { status: string; created_at: string }[],
    applicantData: { status: string; created_at: string }[],
    activeProjects: { joined_at: string }[],
    bookmarkData: { created_at: string }[],
) {
    return {
        owner: {
            value: ownerData.length,
            badge: ownerData.filter((app) => app.status === 'pending').length,
            chartData: generateChartData(ownerData),
        },
        applicant: {
            value: applicantData.length,
            badge: applicantData.filter((app) => app.status === 'pending').length,
            chartData: generateChartData(applicantData),
        },
        active: {
            value: activeProjects.length,
            badge: 0,
            chartData: generateChartData(activeProjects.map((p) => ({ created_at: p.joined_at }))),
        },
        saved: {
            value: bookmarkData.length,
            badge: 0,
            chartData: generateChartData(bookmarkData),
        },
    };
}

