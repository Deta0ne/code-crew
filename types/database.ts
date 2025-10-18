type MemberRole = 'owner' | 'co_lead' | 'member'; 


interface OwnerInfo {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
}

interface MemberSummary {
    role: MemberRole;
    avatar_url: string;
    full_name: string;
    username: string;
}

interface TypeSpecificData {
  [key: string]: unknown; 
}

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
        projects: {
          Row: {
            id: string
            title: string
            description: string
            status: Database['public']['Enums']['project_status']
            project_type: Database['public']['Enums']['project_type']
            category: Database['public']['Enums']['project_category']
            difficulty: Database['public']['Enums']['project_difficulty']
            max_members: number
            current_members: number
            application_count: number
            bookmark_count: number
            is_beginner_friendly: boolean
            mentoring_available: boolean
            remote_friendly: boolean
            github_url: string | null
            tags: string[]
            type_specific_data: TypeSpecificData 
            created_at: string
            updated_at: string
            owner_id: string
          }
          Insert: {
            title: string
            description: string
            category: Database['public']['Enums']['project_category']
            difficulty: Database['public']['Enums']['project_difficulty']
            max_members?: number 
            is_beginner_friendly?: boolean 
            mentoring_available?: boolean 
            remote_friendly?: boolean 
            github_url?: string | null
            project_url?: string | null
            image_url?: string | null
            tags?: string[]
            project_type: Database['public']['Enums']['project_type']
            type_specific_data?: TypeSpecificData | null
            status: Database['public']['Enums']['project_status']
            owner_id: string 
          }
          Update: {
            title: string
            description: string
            category: Database['public']['Enums']['project_category']
            difficulty: Database['public']['Enums']['project_difficulty']
            max_members?: number 
            is_beginner_friendly?: boolean 
            mentoring_available?: boolean 
            remote_friendly?: boolean 
            github_url?: string | null
            project_url?: string | null
            image_url?: string | null
            tags?: string[]
            project_type: Database['public']['Enums']['project_type']
            type_specific_data?: TypeSpecificData | null
            status: Database['public']['Enums']['project_status']
            owner_id: string 
          }
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        get_projects_with_members: {
          Args: {
            p_limit?: number;
            p_offset?: number;
          }
          Returns: Array<
            Database['public']['Tables']['projects']['Row'] & {
              owner: OwnerInfo;
              members: MemberSummary[];
              is_bookmarked: boolean;
            }
          >
        }
      }
      Enums: {
        experience_level: 'beginner' | 'intermediate' | 'advanced'
        skill_category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'design' | 'data' | 'ai' | 'fullstack'
        user_role_type: 'frontend_developer' | 'backend_developer' | 'fullstack_developer' | 'mobile_developer' | 'devops_engineer' | 'ui_ux_designer' | 'data_scientist' | 'ai_engineer' | 'product_manager' | 'qa_engineer'
        member_role: 'owner' | 'co_lead' | 'member'
        project_status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled' 
        project_type: 'learning' | 'portfolio' | 'open_source' | 'hackathon' | 'tutorial' | 'research' 
        project_difficulty: 'easy' | 'intermediate' | 'advanced'
        project_category: 'web' | 'mobile' | 'desktop' | 'ai_ml' | 'data_science' | 'devops' | 'design' | 'blockchain' | 'game_dev' | 'other'
      }
    }
  }
  
  // Additional types for auth flow
  export type UserProfile = Database['public']['Tables']['users']['Row']
  export type DeveloperRole = Database['public']['Tables']['developer_roles']['Row']
  export type Skill = Database['public']['Tables']['skills']['Row']
  export type UserSkill = Database['public']['Tables']['user_skills']['Row']
  export type ProjectMember = Database['public']['Tables']['project_members']['Row']
  export type Project = Database['public']['Tables']['projects']['Row']
  export type ProjectWithMembers = Database['public']['Functions']['get_projects_with_members']['Returns'][number]