'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock, Users, Activity, Target, RefreshCw, Calendar } from 'lucide-react';
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

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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

            const weekCategoryBreakdown = aggregateCategoryBreakdown(weekSessions);
            setCategoryData(getTopCategories(weekCategoryBreakdown, 8));

            const jiraBreakdown = aggregateJiraBreakdown(weekSessions);
            const taskData: TaskData[] = Object.entries(jiraBreakdown)
                .map(([key, seconds]) => ({ key, hours: secondsToHours(seconds), maxHours: 40 }))
                .sort((a, b) => b.hours - a.hours)
                .slice(0, 5);
            setTasks(taskData);

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
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-sm text-zinc-400">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center max-w-md mx-auto mt-12">
                <p className="text-zinc-500 mb-4">{error}</p>
                <button
                    onClick={() => fetchDashboardData()}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium
                        hover:bg-indigo-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10 text-center max-w-md mx-auto mt-12">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
                    <Users className="text-indigo-500" size={28} />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 mb-2">No Teams Yet</h2>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                    Create your first team in Settings to start tracking productivity.
                </p>
                <a
                    href="/dashboard/settings"
                    className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm
                        font-medium hover:bg-indigo-700 transition-colors"
                >
                    Go to Settings
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-5 sm:space-y-7">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-[22px] font-semibold text-zinc-900 tracking-tight">
                        {getGreeting()}
                    </h1>
                    <p className="text-zinc-400 mt-0.5 text-[13px] sm:text-[14px]">
                        Here&apos;s your team&apos;s activity overview
                    </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    {teams.length > 1 && (
                        <select
                            value={selectedTeamId || ''}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="px-3 py-2 bg-white rounded-xl text-zinc-700 text-sm
                                shadow-card border-0 outline-none cursor-pointer"
                        >
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    )}
                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl
                        text-sm text-zinc-500 shadow-card">
                        <Calendar size={14} className="text-zinc-400" />
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                        })}
                    </div>
                    <button
                        onClick={() => fetchDashboardData(true)}
                        disabled={refreshing}
                        className="p-2.5 bg-white rounded-xl text-zinc-400 hover:text-zinc-600
                            shadow-card transition-colors"
                    >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <KPICard
                    title="Today Hours"
                    value={`${kpi.todayHours}h`}
                    change={kpi.todayChange}
                    subtitle="vs yesterday"
                    icon={<Clock size={22} />}
                    color="blue"
                />
                <KPICard
                    title="This Week"
                    value={`${kpi.weekHours}h`}
                    change={kpi.weekChange}
                    subtitle="vs last week"
                    icon={<Activity size={22} />}
                    color="green"
                />
                <KPICard
                    title="Team Members"
                    value={`${kpi.activeMembers}`}
                    subtitle={`${kpi.onlineMembers} online now`}
                    icon={<Users size={22} />}
                    color="purple"
                />
                <KPICard
                    title="Focus Time"
                    value={`${kpi.focusPercent}%`}
                    subtitle={`${kpi.meetingPercent}% in meetings`}
                    icon={<Target size={22} />}
                    color="orange"
                />
            </div>

            {/* Alerts */}
            <AlertPanel />

            {/* Row 1: Team Workload + Time Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <h3 className="text-[15px] font-semibold text-zinc-800">Team Workload</h3>
                        <span className="text-xs text-zinc-400">Today</span>
                    </div>
                    {teamMembers.length > 0 ? (
                        <WorkloadBalance
                            members={teamMembers}
                            onMemberClick={(id) => router.push(`/dashboard/member/${id}`)}
                        />
                    ) : (
                        <div className="text-center text-zinc-400 py-8 text-sm">
                            No team members yet
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <h3 className="text-[15px] font-semibold text-zinc-800">Time Allocation</h3>
                        <span className="text-xs text-zinc-400">This Week</span>
                    </div>
                    {categoryData.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                            {categoryData.slice(0, 6).map(c => (
                                <div key={c.name} className="flex items-center gap-2 sm:gap-3">
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: c.color }}
                                    />
                                    <span className="text-xs sm:text-sm text-zinc-600 w-16 sm:w-24 flex-shrink-0 truncate">
                                        {c.name}
                                    </span>
                                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${c.percent}%`,
                                                backgroundColor: c.color,
                                                opacity: 0.85,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-zinc-400 w-10 text-right tabular-nums">
                                        {c.percent}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-zinc-400 text-sm">
                            No activity data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Row 2: Activity Heatmap + Sprint Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <h3 className="text-[15px] font-semibold text-zinc-800">Activity Patterns</h3>
                        <span className="text-xs text-zinc-400">Last 14 days</span>
                    </div>
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="min-w-[480px]">
                            <Heatmap data={heatmapData} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <h3 className="text-[15px] font-semibold text-zinc-800">Sprint Progress</h3>
                        <span className="text-xs text-zinc-400">{tasks.length} tasks</span>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task.key} className="flex items-center gap-2 sm:gap-3">
                                    <span className="text-indigo-500 text-xs font-medium w-16 sm:w-20 truncate">
                                        {task.key}
                                    </span>
                                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                                            style={{
                                                width: `${Math.min((task.hours / task.maxHours) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-zinc-400 w-8 text-right tabular-nums">
                                        {task.hours}h
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-zinc-400 py-8 text-sm">
                                No task data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-[15px] font-semibold text-zinc-800">
                        Recent Activity
                    </h3>
                </div>
                {feedItems.length > 0 ? (
                    <div className="space-y-0.5 max-h-56 overflow-y-auto dark-scrollbar">
                        {feedItems.map(item => {
                            const metaCat = item.category as MetaCategory;
                            const config = META_CATEGORY_CONFIG[metaCat] || META_CATEGORY_CONFIG['Deep Work'];
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 sm:gap-3 py-2 px-2 rounded-lg
                                        hover:bg-zinc-50 transition-colors"
                                >
                                    <span className="text-[11px] sm:text-xs text-zinc-400 w-10 sm:w-12
                                        flex-shrink-0 tabular-nums">
                                        {item.time}
                                    </span>
                                    <div
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: config.color }}
                                    />
                                    <span className="text-sm font-medium text-zinc-700 flex-shrink-0">
                                        {item.userName}
                                    </span>
                                    <span className="text-xs sm:text-sm text-zinc-400 truncate">
                                        {item.description}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-zinc-400 py-8 text-sm">
                        Activity will appear here as your team works
                    </div>
                )}
            </div>
        </div>
    );
}
