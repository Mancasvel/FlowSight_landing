'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock, Users, Activity, Target, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import KPICard from '@/components/dashboard/KPICard';
import Heatmap from '@/components/dashboard/Heatmap';
import WorkloadBalance from '@/components/dashboard/WorkloadBalance';
import AlertPanel from '@/components/dashboard/AlertPanel';
import { createClient } from '@/lib/supabase/client';
import {
    getTeams,
    getTodayWorkSessions,
    getWorkSessions,
    getTeamMembers,
    getTeamActivityReports,
    aggregateCategoryBreakdown,
    aggregateJiraBreakdown,
    secondsToHours,
    getDateRange,
    type Profile,
    type Team,
    type WorkSession,
    type ActivityReport,
} from '@/lib/supabase/queries';
import {
    getTopCategories,
    aggregateToMeta,
    META_CATEGORY_CONFIG,
    type MetaCategory,
} from '@/lib/categories';
import {
    Treemap,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { CHART_TOOLTIP_STYLE } from '@/lib/chartConfig';

interface TeamMemberWithHours {
    id: string;
    name: string;
    avatar_url: string | null;
    hours: number;
    isOnline: boolean;
}

interface TaskData {
    key: string;
    hours: number;
    maxHours: number;
}

interface FeedItem {
    id: string;
    time: string;
    userName: string;
    description: string;
    category: string;
}

export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMemberWithHours[]>([]);
    const [categoryData, setCategoryData] = useState<{ name: string; seconds: number; color: string; percent: number }[]>([]);
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [heatmapData, setHeatmapData] = useState<Record<string, Record<string, number>>>({});
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

    const [kpi, setKpi] = useState({
        todayHours: 0,
        todayChange: 0,
        weekHours: 0,
        weekChange: 0,
        activeMembers: 0,
        onlineMembers: 0,
        focusPercent: 0,
        meetingPercent: 0,
    });

    const [sparkToday, setSparkToday] = useState<number[]>([]);
    const [sparkWeek, setSparkWeek] = useState<number[]>([]);

    const fetchDashboardData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setError('Not authenticated'); return; }

            const userTeams = await getTeams(supabase, user.id);
            setTeams(userTeams);

            if (userTeams.length === 0) {
                setLoading(false);
                setRefreshing(false);
                return;
            }

            const teamId = selectedTeamId || userTeams[0].id;
            if (!selectedTeamId) setSelectedTeamId(teamId);

            // Fetch data in parallel
            const todayStr = new Date().toISOString().split('T')[0];
            const { start: weekStart } = getDateRange('this_week');
            const { start: lastWeekStart, end: lastWeekEnd } = getDateRange('last_week');
            const { start: last14Start } = getDateRange('last_14');

            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

            const [todaySessions, members, weekSessions, lastWeekSessions, last14Sessions, activityReports] = await Promise.all([
                getTodayWorkSessions(supabase, teamId),
                getTeamMembers(supabase, teamId),
                getWorkSessions(supabase, teamId, weekStart, todayStr),
                getWorkSessions(supabase, teamId, lastWeekStart, lastWeekEnd),
                getWorkSessions(supabase, teamId, last14Start, todayStr),
                getTeamActivityReports(supabase, teamId, todayStr, 20),
            ]);

            // --- Members with hours ---
            const memberHoursMap: Record<string, number> = {};
            todaySessions.forEach((s: WorkSession & { profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> }) => {
                memberHoursMap[s.user_id] = (memberHoursMap[s.user_id] || 0) + s.duration_seconds;
            });

            const memberDisplay: TeamMemberWithHours[] = members.map((m) => {
                const lastSeen = m.profile.last_seen_at ? new Date(m.profile.last_seen_at) : null;
                const isOnline = lastSeen ? (Date.now() - lastSeen.getTime()) < 5 * 60 * 1000 : false;
                return {
                    id: m.user_id,
                    name: m.profile.display_name || 'Unknown',
                    avatar_url: m.profile.avatar_url,
                    hours: secondsToHours(memberHoursMap[m.user_id] || 0),
                    isOnline,
                };
            });
            setTeamMembers(memberDisplay);

            // --- KPIs ---
            const todayTotalSec = todaySessions.reduce((sum: number, s: WorkSession) => sum + s.duration_seconds, 0);
            const yesterdaySessions = weekSessions.filter((s: WorkSession) => s.session_date === yesterdayStr);
            const yesterdayTotalSec = yesterdaySessions.reduce((sum: number, s: WorkSession) => sum + s.duration_seconds, 0);
            const todayChange = yesterdayTotalSec > 0
                ? Math.round(((todayTotalSec - yesterdayTotalSec) / yesterdayTotalSec) * 100)
                : 0;

            const weekTotalSec = weekSessions.reduce((sum: number, s: WorkSession) => sum + s.duration_seconds, 0);
            const lastWeekTotalSec = lastWeekSessions.reduce((sum: number, s: WorkSession) => sum + s.duration_seconds, 0);
            const weekChange = lastWeekTotalSec > 0
                ? Math.round(((weekTotalSec - lastWeekTotalSec) / lastWeekTotalSec) * 100)
                : 0;

            const onlineCount = memberDisplay.filter(m => m.isOnline).length;

            // Focus & meeting percent from today
            const todayCategoryBreakdown = aggregateCategoryBreakdown(todaySessions);
            const todayMeta = aggregateToMeta(todayCategoryBreakdown);
            const todayMetaTotal = Object.values(todayMeta).reduce((a, b) => a + b, 0);
            const focusPct = todayMetaTotal > 0 ? Math.round(((todayMeta['Deep Work'] || 0) / todayMetaTotal) * 100) : 0;
            const meetPct = todayMetaTotal > 0 ? Math.round(((todayMeta['Meetings'] || 0) / todayMetaTotal) * 100) : 0;

            setKpi({
                todayHours: secondsToHours(todayTotalSec),
                todayChange,
                weekHours: secondsToHours(weekTotalSec),
                weekChange,
                activeMembers: members.length,
                onlineMembers: onlineCount,
                focusPercent: focusPct,
                meetingPercent: meetPct,
            });

            // --- Sparklines ---
            const dailyMap: Record<string, number> = {};
            last14Sessions.forEach((s: WorkSession) => {
                dailyMap[s.session_date] = (dailyMap[s.session_date] || 0) + s.duration_seconds;
            });
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0];
            });
            setSparkToday(last7Days.map(d => secondsToHours(dailyMap[d] || 0)));

            const last4Weeks = Array.from({ length: 4 }, (_, wi) => {
                let total = 0;
                for (let di = 0; di < 7; di++) {
                    const d = new Date();
                    d.setDate(d.getDate() - ((3 - wi) * 7 + (6 - di)));
                    total += dailyMap[d.toISOString().split('T')[0]] || 0;
                }
                return secondsToHours(total);
            });
            setSparkWeek(last4Weeks);

            // --- Category data for treemap ---
            const weekCategoryBreakdown = aggregateCategoryBreakdown(weekSessions);
            setCategoryData(getTopCategories(weekCategoryBreakdown, 8));

            // --- Task data ---
            const jiraBreakdown = aggregateJiraBreakdown(weekSessions);
            const taskData: TaskData[] = Object.entries(jiraBreakdown)
                .map(([key, seconds]) => ({ key, hours: secondsToHours(seconds), maxHours: 40 }))
                .sort((a, b) => b.hours - a.hours)
                .slice(0, 5);
            setTasks(taskData);

            // --- Heatmap from activity reports (build from last 7 days sessions) ---
            const heatmap: Record<string, Record<string, number>> = {};
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            last14Sessions.forEach((s: WorkSession) => {
                const date = new Date(s.session_date);
                const dayName = dayNames[date.getDay()];
                if (!heatmap[dayName]) heatmap[dayName] = {};
                const midHour = 12;
                heatmap[dayName][String(midHour)] = (heatmap[dayName][String(midHour)] || 0) + s.duration_seconds;
            });

            activityReports.forEach((r: ActivityReport & { profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> }) => {
                const captured = new Date(r.captured_at);
                const dayName = dayNames[captured.getDay()];
                const hour = captured.getHours();
                if (hour >= 8 && hour < 20) {
                    if (!heatmap[dayName]) heatmap[dayName] = {};
                    heatmap[dayName][String(hour)] = (heatmap[dayName][String(hour)] || 0) + r.duration_seconds;
                }
            });
            setHeatmapData(heatmap);

            // --- Activity Feed (real data) ---
            const feed: FeedItem[] = activityReports.map((r: ActivityReport & { profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> }) => ({
                id: r.id,
                time: new Date(r.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                userName: r.profile?.display_name || 'Unknown',
                description: r.description,
                category: r.category,
            }));
            setFeedItems(feed);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [supabase, selectedTeamId]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-card p-6 text-center">
                <p className="text-accent-red mb-4">{error}</p>
                <button onClick={() => fetchDashboardData()} className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:opacity-90">
                    Retry
                </button>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="dashboard-card p-8 text-center">
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">No Teams Yet</h2>
                <p className="text-dashboard-muted mb-4">Create a team in Settings to start tracking your team&apos;s productivity.</p>
                <a href="/dashboard/settings" className="inline-block px-4 py-2 bg-gradient-to-r from-primary-blue to-primary-teal text-white rounded-lg hover:opacity-90">
                    Go to Settings
                </a>
            </div>
        );
    }

    const treemapData = categoryData.map(c => ({
        name: c.name,
        size: c.seconds,
        fill: c.color,
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dashboard-text">Dashboard</h1>
                    <p className="text-dashboard-muted">Overview of your team&apos;s activity</p>
                </div>
                <div className="flex items-center gap-4">
                    {teams.length > 1 && (
                        <select
                            value={selectedTeamId || ''}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm"
                        >
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={() => fetchDashboardData(true)}
                        disabled={refreshing}
                        className="p-2 text-dashboard-muted hover:text-dashboard-text transition-colors"
                    >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
                    </button>
                </div>
            </div>

            {/* Alerts */}
            <AlertPanel />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Today"
                    value={`${kpi.todayHours}h`}
                    change={kpi.todayChange}
                    subtitle="vs yesterday"
                    icon={<Clock size={18} />}
                    color="blue"
                    sparkData={sparkToday}
                />
                <KPICard
                    title="This Week"
                    value={`${kpi.weekHours}h`}
                    change={kpi.weekChange}
                    subtitle="vs last week"
                    icon={<Activity size={18} />}
                    color="green"
                    sparkData={sparkWeek}
                />
                <KPICard
                    title="Team"
                    value={`${kpi.activeMembers} Members`}
                    subtitle={`${kpi.onlineMembers} online now`}
                    icon={<Users size={18} />}
                    color="purple"
                />
                <KPICard
                    title="Focus"
                    value={`${kpi.focusPercent}%`}
                    subtitle={`${kpi.meetingPercent}% in meetings`}
                    icon={<Target size={18} />}
                    color="orange"
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Heatmap — 3 cols */}
                <div className="lg:col-span-3 dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 text-sm uppercase tracking-wider">
                        Activity Patterns
                    </h3>
                    <Heatmap data={heatmapData} />
                </div>

                {/* Category Treemap — 2 cols */}
                <div className="lg:col-span-2 dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 text-sm uppercase tracking-wider">
                        Time Allocation
                    </h3>
                    {treemapData.length > 0 ? (
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <Treemap
                                    data={treemapData}
                                    dataKey="size"
                                    aspectRatio={4 / 3}
                                    stroke="#FFFFFF"
                                    content={({ x, y, width, height, name, fill }) => {
                                        if (typeof width !== 'number' || typeof height !== 'number') return <g />;
                                        if (width < 30 || height < 20) return <g />;
                                        return (
                                            <g>
                                                <rect x={x} y={y} width={width} height={height} fill={fill as string} rx={6} opacity={0.9} />
                                                {width > 50 && height > 30 && (
                                                    <text
                                                        x={(x as number) + 8}
                                                        y={(y as number) + 18}
                                                        fill="#FFFFFF"
                                                        fontSize={12}
                                                        fontWeight={700}
                                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                                                    >
                                                        {name as string}
                                                    </text>
                                                )}
                                                {width > 50 && height > 45 && (
                                                    <text
                                                        x={(x as number) + 8}
                                                        y={(y as number) + 33}
                                                        fill="rgba(255,255,255,0.8)"
                                                        fontSize={10}
                                                    >
                                                        {secondsToHours((treemapData.find(d => d.name === name)?.size || 0))}h
                                                    </text>
                                                )}
                                            </g>
                                        );
                                    }}
                                >
                                    <Tooltip
                                        contentStyle={CHART_TOOLTIP_STYLE}
                                        formatter={(value: number | undefined) => [value != null ? `${secondsToHours(value)}h` : '—', 'Time']}
                                    />
                                </Treemap>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-52 flex items-center justify-center text-dashboard-muted text-sm">
                            No activity data yet
                        </div>
                    )}

                    {/* Category legend */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                        {categoryData.slice(0, 6).map(c => (
                            <div key={c.name} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                                <span className="text-[10px] text-dashboard-muted">{c.name} {c.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Workload Balance — 3 cols */}
                <div className="lg:col-span-3 dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 text-sm uppercase tracking-wider">
                        Workload Balance
                    </h3>
                    {teamMembers.length > 0 ? (
                        <WorkloadBalance
                            members={teamMembers}
                            onMemberClick={(id) => router.push(`/dashboard/member/${id}`)}
                        />
                    ) : (
                        <div className="text-center text-dashboard-muted py-4 text-sm">
                            No team members yet
                        </div>
                    )}
                </div>

                {/* Active Tasks — 2 cols */}
                <div className="lg:col-span-2 dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 text-sm uppercase tracking-wider">
                        Active Tasks
                    </h3>
                    <div className="space-y-4">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task.key} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary-blue font-mono text-xs">{task.key}</span>
                                        <span className="text-dashboard-muted text-xs">{task.hours}h</span>
                                    </div>
                                    <div className="h-1.5 bg-dashboard-bg rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-blue to-primary-teal rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((task.hours / task.maxHours) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-dashboard-muted py-4 text-sm">
                                No task data yet — connect a task management tool in Settings
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Feed */}
            <div className="dashboard-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    <h3 className="font-semibold text-dashboard-text text-sm uppercase tracking-wider">
                        Recent Activity
                    </h3>
                </div>
                {feedItems.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto dark-scrollbar">
                        {feedItems.map(item => {
                            const metaCat = item.category as MetaCategory;
                            const config = META_CATEGORY_CONFIG[metaCat] || META_CATEGORY_CONFIG['Deep Work'];
                            return (
                                <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-dashboard-bg/50 hover:bg-dashboard-bg transition-colors">
                                    <span className="text-xs font-mono text-dashboard-muted w-11 flex-shrink-0 pt-0.5">{item.time}</span>
                                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: config.color }} />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-medium text-dashboard-text">{item.userName}</span>
                                        <span className="text-dashboard-muted mx-1.5 text-xs">·</span>
                                        <span className="text-sm text-dashboard-muted">{item.description}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-dashboard-muted py-6 text-sm">
                        Activity will appear here as your team works
                    </div>
                )}
            </div>
        </div>
    );
}
