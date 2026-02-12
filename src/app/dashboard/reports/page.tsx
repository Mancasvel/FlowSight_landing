'use client';

import { useEffect, useState } from 'react';
import { FileDown, Mail, FileSpreadsheet, CheckCircle, Clock, Circle, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    getTeams,
    getTodayWorkSessions,
    aggregateCategoryBreakdown,
    aggregateJiraBreakdown,
    secondsToHours,
    type Team,
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

interface JiraTicketProgress {
    key: string;
    hoursWorked: number;
    status: 'done' | 'in_progress' | 'todo';
}

const statusIcons = {
    done: <CheckCircle className="text-accent-green" size={16} />,
    in_progress: <Clock className="text-accent-orange" size={16} />,
    todo: <Circle className="text-dashboard-muted" size={16} />,
};

export default function ReportsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dateRange, setDateRange] = useState('this_week');

    // Data state
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
    const [weeklyStats, setWeeklyStats] = useState({
        totalHours: 0,
        avgPerDev: 0,
        topCategory: '---',
        topCategoryPercent: 0,
        mostActiveDay: '---',
        mostActiveDayHours: 0,
    });
    const [dailyData, setDailyData] = useState<{ day: string; hours: number }[]>([]);
    const [jiraTickets, setJiraTickets] = useState<JiraTicketProgress[]>([]);

    const fetchData = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get teams
            const userTeams = await getTeams(supabase, user.id);
            setTeams(userTeams);

            // Determine which team(s) to fetch data for
            // For MVP, we'll just fetch for the first team or all valid teams
            // In a real implementation, we'd handle "all" by aggregating across teams
            const teamIdToFetch = selectedTeamId === 'all' && userTeams.length > 0 ? userTeams[0].id : selectedTeamId;

            if (teamIdToFetch !== 'all') {
                const sessions = await getTodayWorkSessions(supabase, teamIdToFetch);

                // Calculate basic stats from sessions (just today for now as placeholder for full range)
                // In full implementation, we'd fetch date ranges based on dateRange state
                const totalSeconds = sessions.reduce((sum, s) => sum + s.duration_seconds, 0);
                const categories = aggregateCategoryBreakdown(sessions);

                // Find top category
                let topCat = '---';
                let topSeconds = 0;
                Object.entries(categories).forEach(([cat, sec]) => {
                    if (sec > topSeconds) {
                        topSeconds = sec;
                        topCat = cat;
                    }
                });

                setWeeklyStats({
                    totalHours: secondsToHours(totalSeconds),
                    avgPerDev: sessions.length > 0 ? secondsToHours(totalSeconds / sessions.length) : 0, // Approx
                    topCategory: topCat,
                    topCategoryPercent: totalSeconds > 0 ? Math.round((topSeconds / totalSeconds) * 100) : 0,
                    mostActiveDay: 'Today', // Placeholder
                    mostActiveDayHours: secondsToHours(totalSeconds), // Placeholder
                });

                // Mock daily data based on today's stats for visualization
                const mockDaily = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
                    day,
                    hours: day === 'Fri' ? secondsToHours(totalSeconds) : Math.floor(Math.random() * 10),
                }));
                setDailyData(mockDaily);

                // Jira tickets
                const jiraBreakdown = aggregateJiraBreakdown(sessions);
                const tickets = Object.entries(jiraBreakdown).map(([key, seconds]) => ({
                    key,
                    hoursWorked: secondsToHours(seconds),
                    status: 'in_progress' as const,
                }));
                setJiraTickets(tickets);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTeamId, dateRange]);

    const handleExport = (type: string) => {
        // Mock export - in production, this would generate and download the file
        alert(`Exporting ${type}... (Demo)`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-dashboard-text flex items-center gap-2">
                    📊 Reports
                </h1>
                <p className="text-dashboard-muted">Generate and export team productivity reports</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div>
                    <label className="block text-sm text-dashboard-muted mb-1">Date Range</label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 bg-dashboard-card border border-dashboard-border 
                     rounded-lg text-dashboard-text cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                    >
                        <option value="today">Today</option>
                        <option value="this_week">This Week</option>
                        <option value="last_week">Last Week</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-dashboard-muted mb-1">Team</label>
                    <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="px-4 py-2 bg-dashboard-card border border-dashboard-border 
                     rounded-lg text-dashboard-text cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                    >
                        <option value="all">All Teams</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="p-2 mt-6 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-muted hover:text-dashboard-text"
                >
                    <RefreshCw className={refreshing ? 'animate-spin' : ''} size={20} />
                </button>

                <div className="flex-1" />

                <button
                    onClick={() => handleExport('report')}
                    className="px-6 py-2 mt-auto bg-gradient-to-r from-primary-blue to-primary-teal 
                   text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    Generate Report
                </button>
            </div>

            {/* Weekly Summary Card */}
            <div className="dashboard-card p-6">
                <h3 className="font-semibold text-dashboard-text mb-6">Weekly Summary</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div>
                        <div className="text-3xl font-bold text-dashboard-text">{weeklyStats.totalHours}h</div>
                        <div className="text-sm text-dashboard-muted">Total Hours</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-dashboard-text">{weeklyStats.avgPerDev}h</div>
                        <div className="text-sm text-dashboard-muted">Avg per Dev</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-dashboard-text">
                            {weeklyStats.topCategory}
                            <span className="text-lg text-dashboard-muted ml-1">({weeklyStats.topCategoryPercent}%)</span>
                        </div>
                        <div className="text-sm text-dashboard-muted">Top Category</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-dashboard-text">
                            {weeklyStats.mostActiveDay}
                            <span className="text-lg text-dashboard-muted ml-1">({weeklyStats.mostActiveDayHours}h)</span>
                        </div>
                        <div className="text-sm text-dashboard-muted">Most Active Day</div>
                    </div>
                </div>

                {/* Daily Hours Chart */}
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyData}>
                            <XAxis
                                dataKey="day"
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
                                formatter={(value) => [`${value}h`, 'Hours']}
                            />
                            <Bar
                                dataKey="hours"
                                fill="url(#barGradient)"
                                radius={[4, 4, 0, 0]}
                            />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#00B8A9" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Jira Ticket Progress */}
            <div className="dashboard-card p-6">
                <h3 className="font-semibold text-dashboard-text mb-6">Jira Ticket Progress</h3>

                <div className="space-y-4">
                    {jiraTickets.length > 0 ? (
                        jiraTickets.map((ticket) => (
                            <div key={ticket.key} className="flex items-center gap-4">
                                <span className="text-primary-blue font-mono text-sm w-20">{ticket.key}</span>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 h-3 bg-dashboard-bg rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-blue to-primary-teal rounded-full"
                                                style={{ width: `${Math.min((ticket.hoursWorked / 30) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-dashboard-muted text-sm w-12 text-right">
                                            {ticket.hoursWorked}h
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-28">
                                    {statusIcons[ticket.status]}
                                    <span className="text-sm text-dashboard-muted capitalize">
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-dashboard-muted py-4">
                            No ticket data available for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => handleExport('PDF')}
                    className="flex items-center gap-2 px-6 py-3 bg-dashboard-card border border-dashboard-border 
                   rounded-lg text-dashboard-text hover:bg-dashboard-border/50 transition-colors"
                >
                    <FileDown size={18} />
                    Export PDF
                </button>
                <button
                    onClick={() => handleExport('Email')}
                    className="flex items-center gap-2 px-6 py-3 bg-dashboard-card border border-dashboard-border 
                   rounded-lg text-dashboard-text hover:bg-dashboard-border/50 transition-colors"
                >
                    <Mail size={18} />
                    Send Weekly Email
                </button>
                <button
                    onClick={() => handleExport('Excel')}
                    className="flex items-center gap-2 px-6 py-3 bg-dashboard-card border border-dashboard-border 
                   rounded-lg text-dashboard-text hover:bg-dashboard-border/50 transition-colors"
                >
                    <FileSpreadsheet size={18} />
                    Excel Export
                </button>
            </div>
        </div>
    );
}
