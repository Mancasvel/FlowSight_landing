'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, RefreshCw, Clock, FileDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    getProfile,
    getActivityReports,
    getUserWorkSessions,
    aggregateCategoryBreakdown,
    secondsToHours,
    type Profile,
    type ActivityReport,
    type WorkSession,
} from '@/lib/supabase/queries';
import {
    getCategoryColor,
    getCategoryIcon,
    getMetaCategory,
    META_CATEGORY_CONFIG,
    aggregateToMeta,
    type MetaCategory,
} from '@/lib/categories';
import SparkLine from '@/components/dashboard/SparkLine';
import MemberActivityFeed from '@/components/dashboard/MemberActivityFeed';
import type { MemberWorkflow, WorkflowEntry } from '@/lib/types/dashboard';
import { downloadMemberDayReport } from '@/lib/memberReportPdf';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { CHART_TOOLTIP_STYLE, CHART_AXIS_COLOR } from '@/lib/chartConfig';

interface TimelineEntry {
    time: string;
    timeRaw: Date;
    category: string;
    metaCategory: MetaCategory;
    description: string;
    jiraTicket: string | null;
    durationMinutes: number;
}

export default function MemberTimelinePage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const userId = params.userId as string;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [exportingPdf, setExportingPdf] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [rawReports, setRawReports] = useState<ActivityReport[]>([]);
    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState<{ name: string; hours: number; color: string }[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [weeklyHoursData, setWeeklyHoursData] = useState<number[]>([]);
    const [weeklyDates, setWeeklyDates] = useState<string[]>([]);
    const [focusPercent, setFocusPercent] = useState(0);

    const fetchMemberData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weekAgoStr = weekAgo.toISOString().split('T')[0];
            const todayStr = new Date().toISOString().split('T')[0];

            const [memberProfile, reports, sessions] = await Promise.all([
                getProfile(supabase, userId),
                getActivityReports(supabase, userId, selectedDate),
                getUserWorkSessions(supabase, userId, weekAgoStr, todayStr),
            ]);

            setProfile(memberProfile);
            setRawReports(reports);

            // Timeline entries
            const timelineEntries: TimelineEntry[] = reports.map((r: ActivityReport) => ({
                time: new Date(r.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timeRaw: new Date(r.captured_at),
                category: r.category,
                metaCategory: getMetaCategory(r.category),
                description: r.description,
                jiraTicket: r.jira_ticket_id,
                durationMinutes: Math.round(r.duration_seconds / 60),
            }));
            setTimeline(timelineEntries);

            // Category breakdown using meta-categories
            const breakdown = aggregateCategoryBreakdown(sessions);
            const metaBreakdown = aggregateToMeta(breakdown);
            const chartData = Object.entries(metaBreakdown)
                .map(([name, seconds]) => ({
                    name,
                    hours: secondsToHours(seconds),
                    color: META_CATEGORY_CONFIG[name as MetaCategory]?.color || '#94A3B8',
                }))
                .filter(d => d.hours > 0)
                .sort((a, b) => b.hours - a.hours);
            setCategoryBreakdown(chartData);

            // Total hours for selected date
            const todaySessions = sessions.filter((s: WorkSession) => s.session_date === selectedDate);
            const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration_seconds, 0);
            setTotalHours(secondsToHours(todayTotal));

            // Weekly sparkline data
            const dailyMap: Record<string, number> = {};
            sessions.forEach((s: WorkSession) => {
                dailyMap[s.session_date] = (dailyMap[s.session_date] || 0) + s.duration_seconds;
            });
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0];
            });
            setWeeklyDates(last7Days);
            setWeeklyHoursData(last7Days.map(d => secondsToHours(dailyMap[d] || 0)));

            // Focus percent
            const metaTotal = Object.values(metaBreakdown).reduce((a, b) => a + b, 0);
            setFocusPercent(metaTotal > 0 ? Math.round(((metaBreakdown['Deep Work'] || 0) / metaTotal) * 100) : 0);

        } catch (err) {
            console.error('Error fetching member data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [supabase, userId, selectedDate]);

    useEffect(() => {
        fetchMemberData();
    }, [fetchMemberData]);

    const workflow: MemberWorkflow = useMemo(() => {
        // MemberActivityFeed expects entries sorted by most recent first.
        const sortedReports = [...rawReports].sort(
            (a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime()
        );
        const entries: WorkflowEntry[] = sortedReports.map((r) => ({
            category: r.category,
            description: r.description,
            jiraTicketId: r.jira_ticket_id,
            capturedAt: r.captured_at,
            durationSeconds: r.duration_seconds,
        }));
        return {
            userId: profile?.id ?? userId,
            displayName: profile?.display_name ?? 'Unknown',
            avatarUrl: profile?.avatar_url ?? '',
            currentActivity: entries[0] ?? null,
            entries,
        };
    }, [rawReports, profile?.id, profile?.display_name, profile?.avatar_url, userId]);

    const handleDownloadPdf = useCallback(async () => {
        if (!profile) return;
        setExportingPdf(true);
        try {
            const initials = (profile.display_name || 'U')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

            downloadMemberDayReport({
                displayName: profile.display_name ?? 'Unknown member',
                role: profile.role ?? 'worker',
                avatarInitials: initials,
                isOnline: profile.last_seen_at
                    ? Date.now() - new Date(profile.last_seen_at).getTime() < 5 * 60 * 1000
                    : false,
                selectedDate,
                totalHoursToday: totalHours,
                focusPercent,
                weeklyHoursByDay: weeklyDates.map((date, i) => ({
                    date,
                    hours: weeklyHoursData[i] ?? 0,
                })),
                categoryBreakdown,
                entries: workflow.entries,
            });
        } catch (err) {
            console.error('Failed to export PDF:', err);
        } finally {
            setExportingPdf(false);
        }
    }, [profile, selectedDate, totalHours, focusPercent, weeklyDates, weeklyHoursData, categoryBreakdown, workflow.entries]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-sm text-zinc-400">Loading member...</span>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center max-w-md mx-auto mt-12">
                <h2 className="text-lg font-semibold text-zinc-900 mb-2">Member Not Found</h2>
                <button
                    onClick={() => router.push('/dashboard/team')}
                    className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    Back to Team
                </button>
            </div>
        );
    }

    const isOnline = profile.last_seen_at
        ? (Date.now() - new Date(profile.last_seen_at).getTime()) < 5 * 60 * 1000
        : false;

    // Build Gantt-style blocks grouped by hour
    const ganttBlocks = timeline.reduce<Record<number, TimelineEntry[]>>((acc, entry) => {
        const hour = entry.timeRaw.getHours();
        if (!acc[hour]) acc[hour] = [];
        acc[hour].push(entry);
        return acc;
    }, {});

    const ganttHours = Object.keys(ganttBlocks).map(Number).sort((a, b) => a - b);
    const startHour = ganttHours.length > 0 ? Math.min(...ganttHours) : 9;
    const endHour = ganttHours.length > 0 ? Math.max(...ganttHours) + 1 : 18;
    const hourRange = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard/team')}
                        className="p-2 text-dashboard-muted hover:text-dashboard-text transition-colors"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center relative overflow-hidden">
                            {profile.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.avatar_url} alt={profile.display_name || ''} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-zinc-500 font-semibold text-lg">
                                    {(profile.display_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                            )}
                            {isOnline && (
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">{profile.display_name || 'Unknown'}</h1>
                            <div className="flex items-center gap-3 text-sm text-zinc-500">
                                <span className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-zinc-300'}`} />
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> {totalHours}h today
                                </span>
                                <span>{focusPercent}% focus</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <SparkLine data={weeklyHoursData} color="#6366F1" width={80} height={28} showDots />
                    <span className="text-[10px] text-dashboard-muted">7d trend</span>

                    <div className="relative">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm"
                        />
                        <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dashboard-muted pointer-events-none" size={14} />
                    </div>

                    <button
                        onClick={() => fetchMemberData(true)}
                        disabled={refreshing}
                        className="p-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-muted hover:text-dashboard-text"
                    >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    </button>

                    <button
                        onClick={handleDownloadPdf}
                        disabled={exportingPdf || timeline.length === 0}
                        className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                        title="Download PDF report of this day"
                    >
                        <FileDown size={16} className={exportingPdf ? 'animate-pulse' : ''} />
                        <span className="hidden sm:inline">
                            {exportingPdf ? 'Generating…' : 'Export PDF'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Real-time activity feed — first thing the PM sees */}
            <div className="dashboard-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-[15px] font-semibold text-zinc-800">
                            Real-time activity
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Full log of what this member has been working on · click an entry to read the complete report
                        </p>
                    </div>
                    {workflow.currentActivity && (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                        </span>
                    )}
                </div>
                <MemberActivityFeed
                    member={workflow}
                    hideHeader
                    maxScrollHeight="420px"
                    emptyLabel="No activity recorded for this date"
                />
            </div>

            {/* Gantt Timeline */}
            <div className="dashboard-card p-6">
                <h3 className="text-[15px] font-semibold text-zinc-800 mb-5">
                    Day Timeline
                </h3>
                {timeline.length > 0 ? (
                    <div className="space-y-1">
                        {hourRange.map(hour => {
                            const blocks = ganttBlocks[hour] || [];
                            const hourLabel = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
                            const totalMin = blocks.reduce((s, b) => s + b.durationMinutes, 0);

                            return (
                                <div key={hour} className="flex items-center gap-3">
                                    <span className="text-[10px] text-dashboard-muted w-10 text-right flex-shrink-0 font-mono">
                                        {hourLabel}
                                    </span>
                                    <div className="flex-1 h-7 bg-dashboard-bg/30 rounded flex items-center gap-0.5 px-0.5 overflow-hidden">
                                        {blocks.length > 0 ? (
                                            blocks.map((block, i) => {
                                                const widthPct = Math.max((block.durationMinutes / 60) * 100, 4);
                                                const color = getCategoryColor(block.category);
                                                return (
                                                    <div
                                                        key={i}
                                                        className="h-5 rounded-sm flex items-center px-1.5 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                                        style={{ width: `${widthPct}%`, backgroundColor: color, minWidth: 20 }}
                                                        title={`${block.description} (${block.durationMinutes}m)`}
                                                    >
                                                        <span className="text-[9px] text-white truncate font-medium">
                                                            {block.durationMinutes}m
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="w-full h-5 rounded-sm bg-dashboard-bg/20" />
                                        )}
                                    </div>
                                    <span className="text-[10px] text-dashboard-muted w-8 text-right flex-shrink-0">
                                        {totalMin > 0 ? `${totalMin}m` : ''}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-dashboard-muted py-8 text-sm">
                        No activity recorded for this date
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Log */}
                <div className="dashboard-card p-6">
                    <h3 className="text-[15px] font-semibold text-zinc-800 mb-5">
                        Activity Log
                    </h3>
                    {timeline.length > 0 ? (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto dark-scrollbar pr-1">
                            {timeline.map((entry, index) => {
                                const config = META_CATEGORY_CONFIG[entry.metaCategory];
                                const Icon = getCategoryIcon(entry.category);
                                return (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-2.5 rounded-lg bg-dashboard-bg/50 hover:bg-dashboard-bg transition-colors"
                                    >
                                        <span className="text-dashboard-muted font-mono text-xs w-12 flex-shrink-0 pt-0.5">
                                            {entry.time}
                                        </span>
                                        <div
                                            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: config.bgLight }}
                                        >
                                            <Icon size={14} style={{ color: config.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span
                                                    className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                                                    style={{ backgroundColor: config.bgLight, color: config.color }}
                                                >
                                                    {entry.metaCategory}
                                                </span>
                                                {entry.jiraTicket && (
                                                    <span className="text-primary-blue font-mono text-[10px]">{entry.jiraTicket}</span>
                                                )}
                                                <span className="text-dashboard-muted text-[10px] ml-auto">{entry.durationMinutes}m</span>
                                            </div>
                                            <p className="text-dashboard-text text-sm truncate">{entry.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center text-dashboard-muted py-8 text-sm">
                            No activity recorded for this date
                        </div>
                    )}
                </div>

                {/* 7-Day Category Breakdown */}
                <div className="dashboard-card p-6">
                    <h3 className="text-[15px] font-semibold text-zinc-800 mb-5">
                        Last 7 Days by Category
                    </h3>
                    {categoryBreakdown.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryBreakdown} layout="vertical">
                                    <XAxis type="number" stroke={CHART_AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} unit="h" />
                                    <YAxis type="category" dataKey="name" stroke={CHART_AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} width={90} />
                                    <Tooltip
                                        contentStyle={CHART_TOOLTIP_STYLE}
                                        formatter={(value: number | undefined) => [`${value != null ? value : 0}h`, 'Hours']}
                                    />
                                    <Bar
                                        dataKey="hours"
                                        radius={[0, 4, 4, 0]}
                                        fill="#3B82F6"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-dashboard-muted text-sm">
                            No activity data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
