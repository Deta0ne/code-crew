import type { ComponentType } from 'react';

export type ProjectApplication = {
    id: string; // uuid
    project_id: string; // uuid
    applicant_id: string; // uuid
    applied_role_id?: number | null;
    applicant_name: string;
    owner_username?: string | null;
    status: "pending" | "accepted" | "rejected"; // public.application_status enum
    motivation_message: string;
    what_they_bring?: string | null;
    what_they_want_to_learn?: string | null;
    hours_per_week?: number | null;
    timezone?: string | null;
    portfolio_url?: string | null;
    github_url?: string | null;
    reviewed_at?: string | null; // timestamp with time zone
    reviewed_by?: string | null; // uuid
    review_notes?: string | null;
    created_at: string; // timestamp with time zone
    updated_at: string; // timestamp with time zone
    developer_roles?: {
        name: string;
    } | null;
};

export type ProjectBookmark = {
    id: string; // uuid
    project_id: string; // uuid
    user_id: string; // uuid
    title: string;
    project_type: string;
    status: string;
    created_at: string; // timestamp with time zone
};

export type ActiveProject = {
    id: string; // uuid
    project_id: string; // uuid
    user_id: string; // uuid
    role: 'owner' | 'co_lead' | 'member';
    is_active: boolean;
    joined_at: string;
    last_activity_at?: string | null;
    projects: {
        id: string;
        title: string;
        status: string;
        project_type: string;
        category: string;
        difficulty: string;
        current_members: number;
        max_members: number;
        github_url?: string | null;
        project_url?: string | null;
        short_description?: string | null;
        created_at: string;
    };
};

export type TabType = 'owner' | 'applicant' | 'active' | 'saved';

export interface DashboardClientProps {
    initialOwnerData: ProjectApplication[];
    initialApplicantData: ProjectApplication[];
    initialBookmarkData: ProjectBookmark[];
    initialActiveProjects: ActiveProject[];
    userId: string;
}

export interface StatCardConfig {
    id: TabType;
    label: string;
    value: number;
    badge: number;
    icon: ComponentType<{ className?: string }>;
    gradient: string;
    iconColor: string;
    badgeColor: string;
    chartData: number[];
    chartColor: string;
    shadowColor: string;
}

export interface ChartDataItem {
    created_at: string;
}