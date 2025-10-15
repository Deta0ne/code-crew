export interface ProjectOwner {
    id: string;
    full_name: string;
    avatar_url: string;
}

export interface ProjectData {
    id: string;
    tags: string[];
    owner: ProjectOwner;
    title: string;
    status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
    project_type: 'learning' | 'portfolio' | 'open_source' | 'hackathon' | 'tutorial' | 'research';
    category: 'web' | 'mobile' | 'desktop' | 'ai_ml' | 'data_science' | 'devops' | 'design' | 'blockchain' | 'game_dev' | 'other';
    created_at: string;
    difficulty: 'easy' | 'intermediate' | 'advanced';
    github_url: string | null;
    description: string;
    max_members: number;
    project_url: string | null;
    current_members: number;
    remote_friendly: boolean;
}

export interface UserAccess {
    role: 'owner' | 'co_lead' | 'member';
    user_id: string;
    has_access: boolean;
}

export interface ProjectMember {
    id: string;
    role: 'owner' | 'co_lead' | 'member';
    user: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
        experience_level?: 'beginner' | 'intermediate' | 'advanced';
    };
    joined_at: string;
    developer_role: {
        id: number;
        name: string;
        role_type: string;
    } | null;
}

export interface ProjectActivity {
    id: string;
    actor: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
    };
    created_at: string;
    activity_data: Record<string, unknown>;
    activity_type: 
        | 'project_created'
        | 'application_submitted'
        | 'application_accepted'
        | 'application_rejected'
        | 'member_joined'
        | 'member_left'
        | 'status_changed'
        | 'role_changed';
}

export interface ProjectMessage {
    id: string;
    sender: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
    };
    content: string;
    created_at: string;
}

export interface ProjectPageData {
    project_data: ProjectData;
    user_access: UserAccess[];
    members: ProjectMember[];
    activities: ProjectActivity[];
    messages: ProjectMessage[];
}

// Utility types for specific use cases
export type ProjectStatus = ProjectData['status'];
export type ProjectCategory = ProjectData['category'];
export type ProjectDifficulty = ProjectData['difficulty'];
export type MemberRole = ProjectMember['role'];
export type ActivityType = ProjectActivity['activity_type'];
export type ExperienceLevel = NonNullable<ProjectMember['user']['experience_level']>;
