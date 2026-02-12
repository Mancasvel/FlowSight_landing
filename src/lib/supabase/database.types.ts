export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    display_name: string | null;
                    avatar_url: string | null;
                    role: 'pm' | 'worker';
                    jira_cloud_id: string | null;
                    jira_tokens: Json | null;
                    last_seen_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    role?: 'pm' | 'worker';
                    jira_cloud_id?: string | null;
                    jira_tokens?: Json | null;
                    last_seen_at?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    display_name?: string | null;
                    avatar_url?: string | null;
                    role?: 'pm' | 'worker';
                    jira_cloud_id?: string | null;
                    jira_tokens?: Json | null;
                    last_seen_at?: string | null;
                    created_at?: string;
                };
            };
            licenses: {
                Row: {
                    id: string;
                    owner_id: string;
                    plan_type: 'starter' | 'professional' | 'enterprise';
                    max_members: number;
                    starts_at: string;
                    expires_at: string;
                    is_active: boolean;
                    stripe_subscription_id: string | null;
                    stripe_customer_id: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    owner_id: string;
                    plan_type?: 'starter' | 'professional' | 'enterprise';
                    max_members?: number;
                    starts_at?: string;
                    expires_at?: string;
                    is_active?: boolean;
                    stripe_subscription_id?: string | null;
                    stripe_customer_id?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    owner_id?: string;
                    plan_type?: 'starter' | 'professional' | 'enterprise';
                    max_members?: number;
                    starts_at?: string;
                    expires_at?: string;
                    is_active?: boolean;
                    stripe_subscription_id?: string | null;
                    stripe_customer_id?: string | null;
                    created_at?: string;
                };
            };
            teams: {
                Row: {
                    id: string;
                    name: string;
                    owner_id: string;
                    license_id: string;
                    jira_project_key: string | null;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    owner_id: string;
                    license_id: string;
                    jira_project_key?: string | null;
                    is_active?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    owner_id?: string;
                    license_id?: string;
                    jira_project_key?: string | null;
                    is_active?: boolean;
                    created_at?: string;
                };
            };
            team_members: {
                Row: {
                    id: string;
                    team_id: string;
                    user_id: string;
                    role: 'admin' | 'member';
                    invited_by: string | null;
                    joined_at: string;
                };
                Insert: {
                    id?: string;
                    team_id: string;
                    user_id: string;
                    role?: 'admin' | 'member';
                    invited_by?: string | null;
                    joined_at?: string;
                };
                Update: {
                    id?: string;
                    team_id?: string;
                    user_id?: string;
                    role?: 'admin' | 'member';
                    invited_by?: string | null;
                    joined_at?: string;
                };
            };
            work_sessions: {
                Row: {
                    id: string;
                    user_id: string;
                    team_id: string;
                    duration_seconds: number;
                    summary: string | null;
                    category_breakdown: Json;
                    jira_breakdown: Json;
                    session_date: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    team_id: string;
                    duration_seconds?: number;
                    summary?: string | null;
                    category_breakdown?: Json;
                    jira_breakdown?: Json;
                    session_date: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    team_id?: string;
                    duration_seconds?: number;
                    summary?: string | null;
                    category_breakdown?: Json;
                    jira_breakdown?: Json;
                    session_date?: string;
                    created_at?: string;
                };
            };
            activity_reports: {
                Row: {
                    id: string;
                    user_id: string;
                    team_id: string;
                    description: string;
                    category: string;
                    jira_ticket_id: string | null;
                    duration_seconds: number;
                    captured_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    team_id: string;
                    description: string;
                    category: string;
                    jira_ticket_id?: string | null;
                    duration_seconds?: number;
                    captured_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    team_id?: string;
                    description?: string;
                    category?: string;
                    jira_ticket_id?: string | null;
                    duration_seconds?: number;
                    captured_at?: string;
                };
            };
            invitations: {
                Row: {
                    id: string;
                    team_id: string;
                    token: string;
                    email: string | null;
                    expires_at: string;
                    used_at: string | null;
                    created_by: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    team_id: string;
                    token: string;
                    email?: string | null;
                    expires_at?: string;
                    used_at?: string | null;
                    created_by: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    team_id?: string;
                    token?: string;
                    email?: string | null;
                    expires_at?: string;
                    used_at?: string | null;
                    created_by?: string;
                    created_at?: string;
                };
            };
        };
        Views: {};
        Functions: {
            get_license_member_count: {
                Args: { license_id: string };
                Returns: number;
            };
        };
        Enums: {};
    };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type License = Database['public']['Tables']['licenses']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type WorkSession = Database['public']['Tables']['work_sessions']['Row'];
export type ActivityReport = Database['public']['Tables']['activity_reports']['Row'];
export type Invitation = Database['public']['Tables']['invitations']['Row'];

// Category types
export type ActivityCategory =
    | 'Coding'
    | 'Debugging'
    | 'CodeReview'
    | 'Testing'
    | 'Documentation'
    | 'Design'
    | 'Planning'
    | 'Meeting'
    | 'Communication'
    | 'Research'
    | 'Learning'
    | 'DevOps'
    | 'Database'
    | 'Sales'
    | 'Admin'
    | 'Browsing'
    | 'Idle'
    | 'General';
