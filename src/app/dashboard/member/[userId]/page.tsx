'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, RefreshCw, Clock, Code, Monitor, MessageSquare, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    getProfile,
    getActivityReports,
    getUserWorkSessions,
    aggregateCategoryBreakdown,
    secondsToHours,
    CATEGORY_COLORS,
    type Profile,
    type ActivityReport,
    type WorkSession,
} from '@/lib/supabase/queries';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface TimelineEntry {
    time: string;
    category: string;
    description: string;
    jiraTicket: string | null;
    durationMinutes: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    Coding: <Code size={16} />,
    Design: <Monitor size={16} />,
    Meeting: <MessageSquare size={16} />,
    Documentation: <FileText size={16} />,
};

export default function MemberTimelinePage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const userId = params.userId as string;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState<{ name: string; hours: number }[]>([]);
    const [totalHours, setTotalHours] = useState(0);

    const fetchMemberData = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            // Get member profile
            const memberProfile = await getProfile(supabase, userId);
            setProfile(memberProfile);

            // Get activity reports for selected date
            const reports = await getActivityReports(supabase, userId, selectedDate);

            // Map to timeline entries
            const timelineEntries: TimelineEntry[] = reports.map((r: ActivityReport) => ({
                time: new Date(r.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                category: r.category,
                description: r.description,
                jiraTicket: r.jira_ticket_id,
                durationMinutes: Math.round(r.duration_seconds / 60),
            }));
            setTimeline(timelineEntries);

            // Get work sessions for category breakdown (past 7 days)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const sessions = await getUserWorkSessions(
                supabase,
                userId,
                weekAgo.toISOString().split('T')[0],
                new Date().toISOString().split('T')[0]
            );

            // Calculate category breakdown
            const breakdown = aggregateCategoryBreakdown(sessions);
            const chartData = Object.entries(breakdown)
                .map(([name, seconds]) => ({
                    name,
                    hours: secondsToHours(seconds),
                }))
                .sort((a, b) => b.hours - a.hours)
                .slice(0, 8);
            setCategoryBreakdown(chartData);

            // Calculate total hours for selected date
            const todaySessions = sessions.filter((s: WorkSession) => s.session_date === selectedDate);
            const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration_seconds, 0);
            setTotalHours(secondsToHours(todayTotal));

        } catch (err) {
            console.error('Error fetching member data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMemberData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, selectedDate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="dashboard-card p-8 text-center">
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">Member Not Found</h2>
                <button
                    onClick={() => router.push('/dashboard/team')}
                    className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-lg"
                >
                    Back to Team
                </button>
            </div>
        );
    }

    const isOnline = profile.last_seen_at
        ? (Date.now() - new Date(profile.last_seen_at).getTime()) < 5 * 60 * 1000
        : false;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard/team')}
                        className="p-2 text-dashboard-muted hover:text-dashboard-text transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-teal rounded-full flex items-center justify-center relative overflow-hidden">
                            {profile.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.avatar_url} alt={profile.display_name || ''} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-bold text-xl">
                                    {(profile.display_name || 'U').split(' ').map(n => n[0]).join('')}
                                </span>
                            )}
                            {isOnline && (
                                <span className="absolute bottom-0 right-0 w-4 h-4 bg-accent-green rounded-full border-2 border-dashboard-card" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-dashboard-text">
                                {profile.display_name || 'Unknown'}
                            </h1>
                            <p className="text-dashboard-muted flex items-center gap-2">
                                <span className={isOnline ? 'status-online' : 'status-offline'} />
                                {isOnline ? 'Online' : 'Offline'}
                                <span className="mx-2">•</span>
                                <Clock size={14} />
                                {totalHours}h today
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Date Picker */}
                    <div className="relative">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="px-4 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-muted pointer-events-none" size={16} />
                    </div>

                    {/* Refresh */}
                    <button
                        onClick={() => fetchMemberData(true)}
                        disabled={refreshing}
                        className="p-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-muted hover:text-dashboard-text"
                    >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Timeline */}
                <div className="lg:col-span-2 dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 flex items-center gap-2">
                        📋 Activity Timeline
                    </h3>
                    {timeline.length > 0 ? (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto dark-scrollbar pr-2">
                            {timeline.map((entry, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-3 rounded-lg bg-dashboard-bg/50 hover:bg-dashboard-bg transition-colors"
                                >
                                    <span className="text-dashboard-muted font-mono text-sm w-16 flex-shrink-0">
                                        {entry.time}
                                    </span>
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${CATEGORY_COLORS[entry.category] || '#94A3B8'}20` }}
                                    >
                                        <span style={{ color: CATEGORY_COLORS[entry.category] || '#94A3B8' }}>
                                            {CATEGORY_ICONS[entry.category] || <Code size={16} />}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className="px-2 py-0.5 rounded text-xs font-medium"
                                                style={{
                                                    backgroundColor: `${CATEGORY_COLORS[entry.category] || '#94A3B8'}20`,
                                                    color: CATEGORY_COLORS[entry.category] || '#94A3B8',
                                                }}
                                            >
                                                {entry.category}
                                            </span>
                                            {entry.jiraTicket && (
                                                <span className="text-primary-blue font-mono text-xs">
                                                    {entry.jiraTicket}
                                                </span>
                                            )}
                                            <span className="text-dashboard-muted text-xs ml-auto">
                                                {entry.durationMinutes}m
                                            </span>
                                        </div>
                                        <p className="text-dashboard-text text-sm truncate">
                                            {entry.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-dashboard-muted py-8">
                            No activity recorded for this date
                        </div>
                    )}
                </div>

                {/* Category Breakdown (7-day) */}
                <div className="dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 flex items-center gap-2">
                        📊 Last 7 Days by Category
                    </h3>
                    {categoryBreakdown.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryBreakdown} layout="vertical">
                                    <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1E293B',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#F8FAFC'
                                        }}
                                        formatter={(value) => [`${value}h`, 'Hours']}
                                    />
                                    <Bar
                                        dataKey="hours"
                                        fill="#3B82F6"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="text-center text-dashboard-muted py-8">
                            No activity data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
