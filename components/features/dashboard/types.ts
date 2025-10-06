export type ProjectApplication = {
    id: string; // uuid
    project_id: string; // uuid
    applicant_id: string; // uuid
    applied_role_id?: number | null;
    applicant_name:string,
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