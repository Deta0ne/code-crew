// src/types/database.ts
export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            username: string
            full_name: string | null
            bio: string | null
            avatar_url: string | null
            github_url: string | null
            linkedin_url: string | null
            portfolio_url: string | null
            primary_role_id: number | null
            experience_level: 'beginner' | 'intermediate' | 'advanced'
            location: string | null
            available_for_projects: boolean
            created_at: string
            updated_at: string
          }
          Insert: {
            id: string
            username: string
            full_name?: string | null
            bio?: string | null
            avatar_url?: string | null
            github_url?: string | null
            linkedin_url?: string | null
            portfolio_url?: string | null
            primary_role_id?: number | null
            experience_level?: 'beginner' | 'intermediate' | 'advanced'
            location?: string | null
            available_for_projects?: boolean
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            username?: string
            full_name?: string | null
            bio?: string | null
            avatar_url?: string | null
            github_url?: string | null
            linkedin_url?: string | null
            portfolio_url?: string | null
            primary_role_id?: number | null
            experience_level?: 'beginner' | 'intermediate' | 'advanced'
            location?: string | null
            available_for_projects?: boolean
            created_at?: string
            updated_at?: string
          }
        }
        developer_roles: {
          Row: {
            id: number
            name: string
            role_type: 'frontend_developer' | 'backend_developer' | 'fullstack_developer' | 'mobile_developer' | 'devops_engineer' | 'ui_ux_designer' | 'data_scientist' | 'ai_engineer' | 'product_manager' | 'qa_engineer'
            description: string | null
            created_at: string
          }
          Insert: {
            id?: number
            name: string
            role_type: 'frontend_developer' | 'backend_developer' | 'fullstack_developer' | 'mobile_developer' | 'devops_engineer' | 'ui_ux_designer' | 'data_scientist' | 'ai_engineer' | 'product_manager' | 'qa_engineer'
            description?: string | null
            created_at?: string
          }
          Update: {
            id?: number
            name?: string
            role_type?: 'frontend_developer' | 'backend_developer' | 'fullstack_developer' | 'mobile_developer' | 'devops_engineer' | 'ui_ux_designer' | 'data_scientist' | 'ai_engineer' | 'product_manager' | 'qa_engineer'
            description?: string | null
            created_at?: string
          }
        }
        project_members: {
          Row: {
            id: string
            project_id: string
            user_id: string
            assigned_role_id: number | null
            role: 'owner' | 'co_lead' | 'member'
            is_active: boolean | null
            joined_at: string
            left_at: string | null
            last_activity_at: string | null
            contribution_description: string | null
          }
          Insert: {
            id?: string
            project_id: string
            user_id: string
            assigned_role_id?: number | null
            role?: 'owner' | 'co_lead' | 'member'
            is_active?: boolean | null
            joined_at?: string
            left_at?: string | null
            last_activity_at?: string | null
            contribution_description?: string | null
          }
          Update: {
            id?: string
            project_id?: string
            user_id?: string
            assigned_role_id?: number | null
            role?: 'owner' | 'co_lead' | 'member'
            is_active?: boolean | null
            joined_at?: string
            left_at?: string | null
            last_activity_at?: string | null
            contribution_description?: string | null
          }
        }
        skills: {
          Row: {
            id: number
            name: string
            category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'design' | 'data' | 'ai' | 'fullstack'
            created_at: string
          }
          Insert: {
            id?: number
            name: string
            category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'design' | 'data' | 'ai' | 'fullstack'
            created_at?: string
          }
          Update: {
            id?: number
            name?: string
            category?: 'frontend' | 'backend' | 'mobile' | 'devops' | 'design' | 'data' | 'ai' | 'fullstack'
            created_at?: string
          }
        }
        user_skills: {
          Row: {
            id: string
            user_id: string
            skill_id: number
            proficiency_level: number
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            skill_id: number
            proficiency_level?: number
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            skill_id?: number
            proficiency_level?: number
            created_at?: string
          }
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        [_ in never]: never
      }
      Enums: {
        experience_level: 'beginner' | 'intermediate' | 'advanced'
        skill_category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'design' | 'data' | 'ai' | 'fullstack'
        user_role_type: 'frontend_developer' | 'backend_developer' | 'fullstack_developer' | 'mobile_developer' | 'devops_engineer' | 'ui_ux_designer' | 'data_scientist' | 'ai_engineer' | 'product_manager' | 'qa_engineer'
        member_role: 'owner' | 'co_lead' | 'member'
      }
    }
  }
  
  // Additional types for auth flow
  export type UserProfile = Database['public']['Tables']['users']['Row']
  export type DeveloperRole = Database['public']['Tables']['developer_roles']['Row']
  export type Skill = Database['public']['Tables']['skills']['Row']
  export type UserSkill = Database['public']['Tables']['user_skills']['Row']
  export type ProjectMember = Database['public']['Tables']['project_members']['Row']