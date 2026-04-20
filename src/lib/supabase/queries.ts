import { SupabaseClient } from '@supabase/supabase-js';

// ============ TYPE DEFINITIONS ============

export interface Profile {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    role: 'pm' | 'worker';
    jira_cloud_id: string | null;
    last_seen_at: string | null;
    created_at: string;
}

export interface License {
    id: string;
    owner_id: string;
    plan_type: 'starter' | 'professional' | 'enterprise';
    max_members: number;
    starts_at: string;
    expires_at: string;
    is_active: boolean;
    created_at: string;
}

export interface Team {
    id: string;
    name: string;
    owner_id: string;
    license_id: string;
    jira_project_key: string | null;
    is_active: boolean;
    created_at: string;
}

export interface TeamMember {
    id: string;
    team_id: string;
    user_id: string;
    role: 'admin' | 'member';
    invited_by: string | null;
    joined_at: string;
}

export interface WorkSession {
    id: string;
    user_id: string;
    team_id: string;
    duration_seconds: number;
    summary: string | null;
    category_breakdown: Record<string, number>;
    jira_breakdown: Record<string, number>;
    session_date: string;
    created_at: string;
}

export interface ActivityReport {
    id: string;
    user_id: string;
    team_id: string;
    description: string;
    category: string;
    jira_ticket_id: string | null;
    duration_seconds: number;
    captured_at: string;
}

export interface Invitation {
    id: string;
    team_id: string;
    token: string;
    email: string | null;
    expires_at: string;
    used_at: string | null;
    created_by: string;
    created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseDb = SupabaseClient<any, any, any>;

// ============ PROFILE QUERIES ============

export async function getProfile(supabase: SupabaseDb, userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function updateProfile(supabase: SupabaseDb, userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data as Profile;
}

// ============ LICENSE QUERIES ============

export async function getLicense(supabase: SupabaseDb, ownerId: string): Promise<License | null> {
    const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString()) // Only return if not expired
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function getLicenseMemberCount(supabase: SupabaseDb, licenseId: string): Promise<number> {
    const { data, error } = await supabase
        .rpc('get_license_member_count', { license_id: licenseId });

    if (error) {
        console.error('Error getting member count:', error);
        return 0;
    }
    return data ?? 0;
}

// ============ TEAM QUERIES ============

export async function getTeams(supabase: SupabaseDb, ownerId: string): Promise<Team[]> {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function getTeam(supabase: SupabaseDb, teamId: string): Promise<Team | null> {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function createTeam(
    supabase: SupabaseDb,
    team: { name: string; owner_id: string; license_id: string; jira_project_key?: string }
): Promise<Team> {
    const { data, error } = await supabase
        .from('teams')
        .insert(team)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============ TEAM MEMBER QUERIES ============

export async function getTeamMembers(supabase: SupabaseDb, teamId: string) {
    const { data, error } = await supabase
        .from('team_members')
        .select(`
      *,
      profile:profiles!team_members_user_id_fkey(*)
    `)
        .eq('team_id', teamId)
        .order('joined_at', { ascending: true });

    if (error) throw error;
    return data as (TeamMember & { profile: Profile })[];
}

export async function addTeamMember(
    supabase: SupabaseDb,
    member: { team_id: string; user_id: string; role?: 'admin' | 'member'; invited_by?: string }
): Promise<TeamMember> {
    const { data, error } = await supabase
        .from('team_members')
        .insert(member)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function removeTeamMember(supabase: SupabaseDb, teamId: string, userId: string) {
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

    if (error) throw error;
}

// ============ WORK SESSION QUERIES ============

export async function getTodayWorkSessions(supabase: SupabaseDb, teamId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('work_sessions')
        .select(`
      *,
      profile:profiles(id, display_name, avatar_url)
    `)
        .eq('team_id', teamId)
        .eq('session_date', today);

    if (error) throw error;
    return data as (WorkSession & { profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> })[];
}

export async function getWorkSessions(
    supabase: SupabaseDb,
    teamId: string,
    startDate: string,
    endDate: string
) {
    const { data, error } = await supabase
        .from('work_sessions')
        .select(`
      *,
      profile:profiles(id, display_name, avatar_url)
    `)
        .eq('team_id', teamId)
        .gte('session_date', startDate)
        .lte('session_date', endDate)
        .order('session_date', { ascending: false });

    if (error) throw error;
    return data as (WorkSession & { profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> })[];
}

export async function getUserWorkSessions(
    supabase: SupabaseDb,
    userId: string,
    startDate: string,
    endDate: string
): Promise<WorkSession[]> {
    const { data, error } = await supabase
        .from('work_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('session_date', startDate)
        .lte('session_date', endDate)
        .order('session_date', { ascending: false });

    if (error) throw error;
    return data ?? [];
}

// ============ ACTIVITY REPORT QUERIES ============

export async function getActivityReports(
    supabase: SupabaseDb,
    userId: string,
    date: string
): Promise<ActivityReport[]> {
    const { data, error } = await supabase
        .from('activity_reports')
        .select('*')
        .eq('user_id', userId)
        .gte('captured_at', `${date}T00:00:00`)
        .lt('captured_at', `${date}T23:59:59`)
        .order('captured_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
}

/**
 * Returns the most recent activity_report for a user across all dates, or null if none.
 * Used to derive presence ("online" if the last report is very recent).
 */
export async function getLatestActivityReport(
    supabase: SupabaseDb,
    userId: string
): Promise<ActivityReport | null> {
    const { data, error } = await supabase
        .from('activity_reports')
        .select('*')
        .eq('user_id', userId)
        .order('captured_at', { ascending: false })
        .limit(1);

    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : null;
    return row ?? null;
}

export async function getTeamActivityReports(
    supabase: SupabaseDb,
    teamId: string,
    date: string,
    limit?: number
) {
    let query = supabase
        .from('activity_reports')
        .select(`
      *,
      profile:profiles(id, display_name, avatar_url)
    `)
        .eq('team_id', teamId)
        .gte('captured_at', `${date}T00:00:00`)
        .lt('captured_at', `${date}T23:59:59`)
        .order('captured_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as (ActivityReport & { profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> })[];
}

// ============ AGGREGATION HELPERS ============

export function aggregateCategoryBreakdown(sessions: WorkSession[]): Record<string, number> {
    const result: Record<string, number> = {};

    for (const session of sessions) {
        const breakdown = session.category_breakdown;
        if (breakdown) {
            for (const [category, seconds] of Object.entries(breakdown)) {
                result[category] = (result[category] || 0) + (seconds as number);
            }
        }
    }

    return result;
}

export function aggregateJiraBreakdown(sessions: WorkSession[]): Record<string, number> {
    const result: Record<string, number> = {};

    for (const session of sessions) {
        const breakdown = session.jira_breakdown;
        if (breakdown) {
            for (const [ticket, seconds] of Object.entries(breakdown)) {
                result[ticket] = (result[ticket] || 0) + (seconds as number);
            }
        }
    }

    return result;
}

export function aggregateUserHours(sessions: WorkSession[]): Record<string, number> {
    const result: Record<string, number> = {};

    for (const session of sessions) {
        result[session.user_id] = (result[session.user_id] || 0) + session.duration_seconds;
    }

    return result;
}

export function secondsToHours(seconds: number): number {
    return Math.round((seconds / 3600) * 10) / 10;
}

export { getCategoryColor, aggregateToMeta, getTopCategories, META_CATEGORY_CONFIG } from '@/lib/categories';

export function getDateRange(rangeKey: string): { start: string; end: string } {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    switch (rangeKey) {
        case 'today':
            return { start: today, end: today };
        case 'yesterday': {
            const d = new Date(now);
            d.setDate(d.getDate() - 1);
            return { start: d.toISOString().split('T')[0], end: d.toISOString().split('T')[0] };
        }
        case 'this_week': {
            const d = new Date(now);
            d.setDate(d.getDate() - d.getDay() + 1); // Monday
            return { start: d.toISOString().split('T')[0], end: today };
        }
        case 'last_week': {
            const d = new Date(now);
            d.setDate(d.getDate() - d.getDay() - 6); // Last Monday
            const end = new Date(d);
            end.setDate(end.getDate() + 6);
            return { start: d.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
        }
        case 'this_month': {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            return { start: start.toISOString().split('T')[0], end: today };
        }
        case 'last_month': {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0);
            return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
        }
        case 'last_7': {
            const d = new Date(now);
            d.setDate(d.getDate() - 6);
            return { start: d.toISOString().split('T')[0], end: today };
        }
        case 'last_14': {
            const d = new Date(now);
            d.setDate(d.getDate() - 13);
            return { start: d.toISOString().split('T')[0], end: today };
        }
        case 'last_30': {
            const d = new Date(now);
            d.setDate(d.getDate() - 29);
            return { start: d.toISOString().split('T')[0], end: today };
        }
        default:
            return { start: today, end: today };
    }
}

export function getDailyBreakdown(
    sessions: WorkSession[],
): { date: string; seconds: number; breakdown: Record<string, number> }[] {
    const byDate: Record<string, { seconds: number; breakdown: Record<string, number> }> = {};

    for (const s of sessions) {
        if (!byDate[s.session_date]) {
            byDate[s.session_date] = { seconds: 0, breakdown: {} };
        }
        byDate[s.session_date].seconds += s.duration_seconds;

        if (s.category_breakdown) {
            for (const [cat, sec] of Object.entries(s.category_breakdown)) {
                byDate[s.session_date].breakdown[cat] =
                    (byDate[s.session_date].breakdown[cat] || 0) + (sec as number);
            }
        }
    }

    return Object.entries(byDate)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));
}
