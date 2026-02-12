'use client';

import { useEffect, useState } from 'react';
import { Clock, Users, ListTodo, Flame, RefreshCw } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { createClient } from '@/lib/supabase/client';
import {
    getTeams,
    getTodayWorkSessions,
    getTeamMembers,
    aggregateCategoryBreakdown,
    aggregateJiraBreakdown,
    secondsToHours,
    CATEGORY_COLORS,
    type Profile,
    type Team,
    type WorkSession,
} from '@/lib/supabase/queries';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

interface TeamMemberWithHours {
    id: string;
    name: string;
    avatar_url: string | null;
    todayHours: number;
    isOnline: boolean;
}

interface CategoryChartData {
    name: string;
    value: number;
    color: string;
}

interface JiraTicketData {
    key: string;
    hours: number;
    maxHours: number;
}

export default function DashboardPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data state
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMemberWithHours[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryChartData[]>([]);
    const [jiraTickets, setJiraTickets] = useState<JiraTicketData[]>([]);
    const [kpiStats, setKpiStats] = useState({
        todayHours: 0,
        todayChange: 0,
        weekHours: 0,
        weekChange: 0,
        activeDevs: 0,
        onlineDevs: 0,
        totalTasks: 0,
        inProgressTasks: 0,
    });

    // Timeline data for area chart
    const [timelineData, setTimelineData] = useState<{ time: string;[key: string]: number | string }[]>([]);

    const fetchDashboardData = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('Not authenticated');
                return;
            }

            // Get PM's teams
            const userTeams = await getTeams(supabase, user.id);
            setTeams(userTeams);

            if (userTeams.length === 0) {
                setLoading(false);
                setRefreshing(false);
                return;
            }

            // Use first team if none selected
            const teamId = selectedTeamId || userTeams[0].id;
            if (!selectedTeamId) setSelectedTeamId(teamId);

            // Get today's work sessions
            const sessions = await getTodayWorkSessions(supabase, teamId);

            // Get team members
            const members = await getTeamMembers(supabase, teamId);

            // Calculate member hours from sessions
            const memberHoursMap: Record<string, number> = {};
            sessions.forEach((session: WorkSession & { profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> }) => {
                memberHoursMap[session.user_id] = (memberHoursMap[session.user_id] || 0) + session.duration_seconds;
            });

            // Map to display format
            const memberDisplay: TeamMemberWithHours[] = members.map((m) => {
                const lastSeen = m.profile.last_seen_at ? new Date(m.profile.last_seen_at) : null;
                const isOnline = lastSeen ? (Date.now() - lastSeen.getTime()) < 5 * 60 * 1000 : false; // 5 min threshold

                return {
                    id: m.user_id,
                    name: m.profile.display_name || 'Unknown',
                    avatar_url: m.profile.avatar_url,
                    todayHours: secondsToHours(memberHoursMap[m.user_id] || 0),
                    isOnline,
                };
            }).sort((a, b) => b.todayHours - a.todayHours);

            setTeamMembers(memberDisplay);

            // Calculate KPIs
            const totalTodaySeconds = sessions.reduce((sum: number, s: WorkSession) => sum + s.duration_seconds, 0);
            const onlineCount = memberDisplay.filter(m => m.isOnline).length;

            setKpiStats({
                todayHours: secondsToHours(totalTodaySeconds),
                todayChange: 0, // Would need yesterday's data to calculate
                weekHours: 0, // Would need weekly data
                weekChange: 0,
                activeDevs: members.length,
                onlineDevs: onlineCount,
                totalTasks: 0, // Would need Jira integration
                inProgressTasks: 0,
            });

            // Calculate category breakdown
            const categoryBreakdown = aggregateCategoryBreakdown(sessions);
            const totalCategorySeconds = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0);

            const chartData: CategoryChartData[] = Object.entries(categoryBreakdown)
                .map(([name, seconds]) => ({
                    name,
                    value: totalCategorySeconds > 0 ? Math.round((seconds / totalCategorySeconds) * 100) : 0,
                    color: CATEGORY_COLORS[name] || '#94A3B8',
                }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 6); // Top 6 categories

            setCategoryData(chartData);

            // Calculate Jira breakdown
            const jiraBreakdown = aggregateJiraBreakdown(sessions);
            const jiraData: JiraTicketData[] = Object.entries(jiraBreakdown)
                .map(([key, seconds]) => ({
                    key,
                    hours: secondsToHours(seconds),
                    maxHours: 40, // Placeholder
                }))
                .sort((a, b) => b.hours - a.hours)
                .slice(0, 5);

            setJiraTickets(jiraData);

            // Generate timeline data (hourly breakdown)
            // For now, use placeholder - would need activity_reports grouped by hour
            const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
            const timeline = hours.map(time => ({
                time,
                Focus: Math.floor(Math.random() * 30),
                Design: Math.floor(Math.random() * 15),
                Meeting: Math.floor(Math.random() * 10),
                Other: Math.floor(Math.random() * 5),
            }));
            setTimelineData(timeline);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTeamId]);

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
                <button
                    onClick={() => fetchDashboardData()}
                    className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:opacity-90"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="dashboard-card p-8 text-center">
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">No Teams Yet</h2>
                <p className="text-dashboard-muted mb-4">
                    Create a team in Settings to start tracking your team's productivity.
                </p>
                <a
                    href="/dashboard/settings"
                    className="inline-block px-4 py-2 bg-gradient-to-r from-primary-blue to-primary-teal text-white rounded-lg hover:opacity-90"
                >
                    Go to Settings
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dashboard-text">Dashboard</h1>
                    <p className="text-dashboard-muted">Overview of your team&apos;s productivity</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Team Selector */}
                    {teams.length > 1 && (
                        <select
                            value={selectedTeamId || ''}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text"
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
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={20} />
                    </button>
                    <span className="text-sm text-dashboard-muted">
                        Last updated: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Today"
                    value={`${kpiStats.todayHours}h`}
                    change={kpiStats.todayChange}
                    icon={<Clock size={20} />}
                    color="blue"
                />
                <KPICard
                    title="This Week"
                    value={`${kpiStats.weekHours}h`}
                    change={kpiStats.weekChange}
                    icon={<Clock size={20} />}
                    color="green"
                />
                <KPICard
                    title="Active"
                    value={`${kpiStats.activeDevs} Members`}
                    subtitle={`${kpiStats.onlineDevs} Online`}
                    icon={<Users size={20} />}
                    color="purple"
                />
                <KPICard
                    title="Jira"
                    value={`${kpiStats.totalTasks} Tasks`}
                    subtitle={`${kpiStats.inProgressTasks} In Progress`}
                    icon={<ListTodo size={20} />}
                    color="orange"
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Activity Timeline */}
                <div className="dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 flex items-center gap-2">
                        📊 Team Activity Timeline
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData}>
                                <XAxis
                                    dataKey="time"
                                    stroke="#94A3B8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    width={40}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E293B',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        color: '#F8FAFC'
                                    }}
                                />
                                <Area type="monotone" dataKey="Focus" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="Design" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="Meeting" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="Other" stackId="1" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 flex items-center gap-2">
                        🍩 Category Distribution
                    </h3>
                    <div className="h-64 flex items-center">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1E293B',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#F8FAFC'
                                        }}
                                        formatter={(value) => [`${value}%`, 'Share']}
                                    />
                                    <Legend formatter={(value) => <span style={{ color: '#F8FAFC' }}>{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full text-center text-dashboard-muted">
                                No activity data yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Developer Leaderboard */}
                <div className="dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 flex items-center gap-2">
                        👥 Team Leaderboard
                    </h3>
                    <div className="space-y-3">
                        {teamMembers.length > 0 ? (
                            teamMembers.slice(0, 5).map((member, index) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-dashboard-bg/50 hover:bg-dashboard-bg transition-colors"
                                >
                                    <span className="w-6 text-center font-bold text-dashboard-muted">
                                        {index + 1}.
                                    </span>
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-primary-teal rounded-full flex items-center justify-center flex-shrink-0 relative">
                                        {member.avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={member.avatar_url} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <span className="text-white font-medium text-sm">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        )}
                                        {member.isOnline && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full border-2 border-dashboard-card" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-dashboard-text font-medium">{member.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-dashboard-text font-mono">{member.todayHours}h</span>
                                        {index === 0 && member.todayHours > 0 && <Flame className="text-accent-orange" size={18} />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-dashboard-muted py-4">
                                No team members yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Tickets */}
                <div className="dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 flex items-center gap-2">
                        📋 Active Tickets
                    </h3>
                    <div className="space-y-4">
                        {jiraTickets.length > 0 ? (
                            jiraTickets.map((ticket) => (
                                <div key={ticket.key} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary-blue font-mono text-sm">{ticket.key}</span>
                                        <span className="text-dashboard-muted text-sm">{ticket.hours}h</span>
                                    </div>
                                    <div className="h-2 bg-dashboard-bg rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-blue to-primary-teal rounded-full transition-all"
                                            style={{ width: `${Math.min((ticket.hours / ticket.maxHours) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-dashboard-muted py-4">
                                No ticket data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Activity Feed */}
            <ActivityFeed />
        </div>
    );
}
