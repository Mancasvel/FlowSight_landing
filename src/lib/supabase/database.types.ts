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
                    owner_id: string | null;
                    plan_type: 'starter' | 'professional' | 'enterprise';
                    plan_id: string | null;
                    max_members: number;
                    starts_at: string;
                    expires_at: string;
                    is_active: boolean;
                    stripe_subscription_id: string | null;
                    stripe_customer_id: string | null;
                    code: string | null;
                    claimed_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    owner_id?: string | null;
                    plan_type?: 'starter' | 'professional' | 'enterprise';
                    plan_id?: string | null;
                    max_members?: number;
                    starts_at?: string;
                    expires_at?: string;
                    is_active?: boolean;
                    stripe_subscription_id?: string | null;
                    stripe_customer_id?: string | null;
                    code?: string | null;
                    claimed_at?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    owner_id?: string | null;
                    plan_type?: 'starter' | 'professional' | 'enterprise';
                    plan_id?: string | null;
                    max_members?: number;
                    starts_at?: string;
                    expires_at?: string;
                    is_active?: boolean;
                    stripe_subscription_id?: string | null;
                    stripe_customer_id?: string | null;
                    code?: string | null;
                    claimed_at?: string | null;
                    created_at?: string;
                };
            };
            prompt_usage: {
                Row: {
                    id: string;
                    user_id: string;
                    team_id: string;
                    period_start: string;
                    user_prompt_count: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    team_id: string;
                    period_start: string;
                    user_prompt_count?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    team_id?: string;
                    period_start?: string;
                    user_prompt_count?: number;
                    created_at?: string;
                };
            };
            team_prompt_pool_usage: {
                Row: {
                    id: string;
                    team_id: string;
                    period_start: string;
                    pool_count: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    team_id: string;
                    period_start: string;
                    pool_count?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    team_id?: string;
                    period_start?: string;
                    pool_count?: number;
                    created_at?: string;
                };
            };
            team_notification_settings: {
                Row: {
                    team_id: string;
                    daily_email: boolean;
                    weekly_report: boolean;
                    real_time_alerts: boolean;
                    digest_day: string;
                    digest_time: string;
                    digest_timezone: string;
                    digest_recipients_enc: string | null;
                    updated_at: string;
                };
                Insert: {
                    team_id: string;
                    daily_email?: boolean;
                    weekly_report?: boolean;
                    real_time_alerts?: boolean;
                    digest_day?: string;
                    digest_time?: string;
                    digest_timezone?: string;
                    digest_recipients_enc?: string | null;
                    updated_at?: string;
                };
                Update: {
                    team_id?: string;
                    daily_email?: boolean;
                    weekly_report?: boolean;
                    real_time_alerts?: boolean;
                    digest_day?: string;
                    digest_time?: string;
                    digest_timezone?: string;
                    digest_recipients_enc?: string | null;
                    updated_at?: string;
                };
            };
            weekly_report_logs: {
                Row: {
                    id: string;
                    team_id: string;
                    week_start: string;
                    status: string;
                    audit_enc: string | null;
                    error_message: string | null;
                    sent_at: string;
                };
                Insert: {
                    id?: string;
                    team_id: string;
                    week_start: string;
                    status: string;
                    audit_enc?: string | null;
                    error_message?: string | null;
                    sent_at?: string;
                };
                Update: {
                    id?: string;
                    team_id?: string;
                    week_start?: string;
                    status?: string;
                    audit_enc?: string | null;
                    error_message?: string | null;
                    sent_at?: string;
                };
            };
            teams: {
                Row: {
                    id: string;
                    name: string;
                    owner_id: string;
                    license_id: string;
                    jira_project_key: string | null;
                    dashboard_preferences: Json | null;
                    is_personal: boolean;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    owner_id: string;
                    license_id: string;
                    jira_project_key?: string | null;
                    dashboard_preferences?: Json | null;
                    is_personal?: boolean;
                    is_active?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    owner_id?: string;
                    license_id?: string;
                    jira_project_key?: string | null;
                    dashboard_preferences?: Json | null;
                    is_personal?: boolean;
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
            ticket_snapshots: {
                Row: {
                    id: string;
                    jira_ticket_id: string;
                    user_id: string;
                    team_id: string;
                    total_seconds: number;
                    deep_work_seconds: number;
                    shallow_seconds: number;
                    interrupted_seconds: number;
                    meeting_seconds: number;
                    avg_active_backlogs: number;
                    avg_context_switches: number;
                    avg_load_factor: number;
                    adjusted_seconds: number;
                    jira_issue_type: string | null;
                    jira_story_points: number | null;
                    jira_project_key: string;
                    jira_sprint_id: string | null;
                    closed_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    jira_ticket_id: string;
                    user_id: string;
                    team_id: string;
                    total_seconds: number;
                    deep_work_seconds?: number;
                    shallow_seconds?: number;
                    interrupted_seconds?: number;
                    meeting_seconds?: number;
                    avg_active_backlogs?: number;
                    avg_context_switches?: number;
                    avg_load_factor?: number;
                    adjusted_seconds: number;
                    jira_issue_type?: string | null;
                    jira_story_points?: number | null;
                    jira_project_key: string;
                    jira_sprint_id?: string | null;
                    closed_at: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    jira_ticket_id?: string;
                    user_id?: string;
                    team_id?: string;
                    total_seconds?: number;
                    deep_work_seconds?: number;
                    shallow_seconds?: number;
                    interrupted_seconds?: number;
                    meeting_seconds?: number;
                    avg_active_backlogs?: number;
                    avg_context_switches?: number;
                    avg_load_factor?: number;
                    adjusted_seconds?: number;
                    jira_issue_type?: string | null;
                    jira_story_points?: number | null;
                    jira_project_key?: string;
                    jira_sprint_id?: string | null;
                    closed_at?: string;
                    created_at?: string;
                };
            };
            sprint_commitments: {
                Row: {
                    id: string;
                    team_id: string;
                    sprint_label: string;
                    jira_sprint_id: string | null;
                    committed_hours: number;
                    starts_at: string;
                    ends_at: string;
                    cost_per_hour: number;
                    created_by: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    team_id: string;
                    sprint_label: string;
                    jira_sprint_id?: string | null;
                    committed_hours: number;
                    starts_at: string;
                    ends_at: string;
                    cost_per_hour?: number;
                    created_by?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    team_id?: string;
                    sprint_label?: string;
                    jira_sprint_id?: string | null;
                    committed_hours?: number;
                    starts_at?: string;
                    ends_at?: string;
                    cost_per_hour?: number;
                    created_by?: string | null;
                    created_at?: string;
                };
            };
            coach_conversations: {
                Row: {
                    id: string;
                    user_id: string;
                    team_id: string;
                    title: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    team_id: string;
                    title?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    team_id?: string;
                    title?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            coach_messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    role: 'user' | 'assistant';
                    content: string;
                    reasoning: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    conversation_id: string;
                    role: 'user' | 'assistant';
                    content: string;
                    reasoning?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    conversation_id?: string;
                    role?: 'user' | 'assistant';
                    content?: string;
                    reasoning?: string | null;
                    created_at?: string;
                };
            };
            coach_context_chunks: {
                Row: {
                    id: string;
                    source_id: string;
                    conversation_id: string;
                    user_id: string;
                    team_id: string;
                    source_name: string;
                    chunk_index: number;
                    excerpt: string;
                    embedding: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    source_id: string;
                    conversation_id: string;
                    user_id: string;
                    team_id: string;
                    source_name: string;
                    chunk_index: number;
                    excerpt: string;
                    embedding: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    source_id?: string;
                    conversation_id?: string;
                    user_id?: string;
                    team_id?: string;
                    source_name?: string;
                    chunk_index?: number;
                    excerpt?: string;
                    embedding?: string;
                    created_at?: string;
                };
            };
        };
        Views: {};
        Functions: {
            match_coach_messages_fts: {
                Args: {
                    search_query: string;
                    match_user_id: string;
                    match_team_id: string;
                    match_count?: number;
                    exclude_conversation_id?: string | null;
                };
                Returns: {
                    content: string;
                    role: string;
                    rank: number;
                }[];
            };
            match_coach_context_chunks: {
                Args: {
                    query_embedding: string;
                    match_user_id: string;
                    match_team_id: string;
                    match_conversation_id: string;
                    match_count?: number;
                    match_threshold?: number;
                };
                Returns: {
                    source_name: string;
                    excerpt: string;
                    similarity: number;
                }[];
            };
            get_license_member_count: {
                Args: { license_id: string };
                Returns: number;
            };
            claim_license: {
                Args: { p_code: string };
                Returns: Database['public']['Tables']['licenses']['Row'];
            };
            prepare_worker_auth_delete: {
                Args: { p_user_id: string };
                Returns: undefined;
            };
            delete_worker_auth_user: {
                Args: { p_user_id: string };
                Returns: undefined;
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
export type TicketSnapshot = Database['public']['Tables']['ticket_snapshots']['Row'];
export type SprintCommitment = Database['public']['Tables']['sprint_commitments']['Row'];

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
