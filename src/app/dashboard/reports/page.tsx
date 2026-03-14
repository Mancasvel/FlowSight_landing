'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileDown, Mail, FileSpreadsheet, RefreshCw, CheckCircle, Clock, Circle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    getTeams,
    getWorkSessions,
    aggregateCategoryBreakdown,
    aggregateJiraBreakdown,
    secondsToHours,
    getDateRange,
    getDailyBreakdown,
    type Team,
    type WorkSession,
} from '@/lib/supabase/queries';
import { aggregateToMeta, META_CATEGORY_CONFIG, META_CATEGORIES, type MetaCategory } from '@/lib/categories';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area,
} from 'recharts';
import { CHART_TOOLTIP_STYLE, CHART_AXIS_COLOR } from '@/lib/chartConfig';
import { exportToCSV, exportToPrintPDF } from '@/lib/exportUtils';

interface JiraTicketProgress {
    key: string;
    hoursWorked: number;
    status: 'done' | 'in_progress' | 'todo';
}

const statusIcons = {
    done: <CheckCircle className="text-accent-green" size={14} />,
    in_progress: <Clock className="text-accent-orange" size={14} />,
    todo: <Circle className="text-dashboard-muted" size={14} />,
};

const DAY_LABELS: Record<string, string> = {
    '0': 'Sun', '1': 'Mon', '2': 'Tue', '3': 'Wed', '4': 'Thu', '5': 'Fri', '6': 'Sat',
};

export default function ReportsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dateRange, setDateRange] = useState('this_week');

    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
    const [comparisonEnabled, setComparisonEnabled] = useState(false);

    const [stats, setStats] = useState({
        totalHours: 0,
        avgPerMember: 0,
        topCategory: '---',
        topCategoryPercent: 0,
        mostActiveDay: '---',
        mostActiveDayHours: 0,
    });
    const [dailyChartData, setDailyChartData] = useState<Record<string, unknown>[]>([]);
    const [categoryTrendData, setCategoryTrendData] = useState<Record<string, unknown>[]>([]);
    const [jiraTickets, setJiraTickets] = useState<JiraTicketProgress[]>([]);
    const [prevStats, setPrevStats] = useState<{ totalHours: number } | null>(null);
    const [rawSessions, setRawSessions] = useState<(WorkSession & { profile: { id: string; display_name: string | null; avatar_url: string | null } })[]>([]);

    const fetchData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const userTeams = await getTeams(supabase, user.id);
            setTeams(userTeams);

            const teamIdToFetch = selectedTeamId === 'all' && userTeams.length > 0
                ? userTeams[0].id
                : selectedTeamId;

            if (teamIdToFetch === 'all') {
                setLoading(false);
                setRefreshing(false);
                return;
            }

            const { start, end } = getDateRange(dateRange);

            const comparisonRange = dateRange === 'this_week' ? 'last_week'
                : dateRange === 'this_month' ? 'last_month'
                : dateRange === 'last_week' ? 'this_week'
                : null;

            const fetchPromises: Promise<unknown>[] = [
                getWorkSessions(supabase, teamIdToFetch, start, end),
            ];

            if (comparisonEnabled && comparisonRange) {
                const prev = getDateRange(comparisonRange);
                fetchPromises.push(getWorkSessions(supabase, teamIdToFetch, prev.start, prev.end));
            }

            const results = await Promise.all(fetchPromises);
            const sessions = results[0] as (WorkSession & { profile: { id: string; display_name: string | null; avatar_url: string | null } })[];
            const prevSessions = results[1] as typeof sessions | undefined;
            setRawSessions(sessions);

            // --- Summary stats ---
            const totalSeconds = sessions.reduce((sum, s) => sum + s.duration_seconds, 0);
            const uniqueMembers = new Set(sessions.map(s => s.user_id)).size;

            const categories = aggregateCategoryBreakdown(sessions);
            const metaCategories = aggregateToMeta(categories);
            const metaTotal = Object.values(metaCategories).reduce((a, b) => a + b, 0);

            let topCat = '---';
            let topSeconds = 0;
            Object.entries(metaCategories).forEach(([cat, sec]) => {
                if (sec > topSeconds) { topSeconds = sec; topCat = cat; }
            });

            // Most active day
            const dailyBreakdown = getDailyBreakdown(sessions);
            let bestDay = { date: '---', seconds: 0 };
            dailyBreakdown.forEach(d => {
                if (d.seconds > bestDay.seconds) bestDay = { date: d.date, seconds: d.seconds };
            });

            const bestDayDate = bestDay.date !== '---' ? new Date(bestDay.date) : null;
            const bestDayLabel = bestDayDate
                ? DAY_LABELS[String(bestDayDate.getDay())]
                : '---';

            setStats({
                totalHours: secondsToHours(totalSeconds),
                avgPerMember: uniqueMembers > 0 ? secondsToHours(totalSeconds / uniqueMembers) : 0,
                topCategory: topCat,
                topCategoryPercent: metaTotal > 0 ? Math.round((topSeconds / metaTotal) * 100) : 0,
                mostActiveDay: bestDayLabel,
                mostActiveDayHours: secondsToHours(bestDay.seconds),
            });

            if (prevSessions) {
                const prevTotal = prevSessions.reduce((sum, s) => sum + s.duration_seconds, 0);
                setPrevStats({ totalHours: secondsToHours(prevTotal) });
            } else {
                setPrevStats(null);
            }

            // --- Daily stacked bar chart ---
            const daily = dailyBreakdown.map(d => {
                const metaBreak = aggregateToMeta(d.breakdown);
                const dateObj = new Date(d.date);
                const label = `${DAY_LABELS[String(dateObj.getDay())]} ${dateObj.getDate()}`;

                const entry: Record<string, unknown> = { day: label };
                META_CATEGORIES.forEach(mc => {
                    entry[mc] = secondsToHours(metaBreak[mc] || 0);
                });
                return entry;
            });
            setDailyChartData(daily);

            // --- Category trend (area chart) ---
            const trend = dailyBreakdown.map(d => {
                const metaBreak = aggregateToMeta(d.breakdown);
                const dateObj = new Date(d.date);
                const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

                const entry: Record<string, unknown> = { date: label };
                META_CATEGORIES.forEach(mc => {
                    const total = Object.values(metaBreak).reduce((a, b) => a + b, 0);
                    entry[mc] = total > 0 ? Math.round(((metaBreak[mc] || 0) / total) * 100) : 0;
                });
                return entry;
            });
            setCategoryTrendData(trend);

            // --- Task tickets ---
            const jiraBreakdown = aggregateJiraBreakdown(sessions);
            const tickets = Object.entries(jiraBreakdown).map(([key, seconds]) => ({
                key,
                hoursWorked: secondsToHours(seconds),
                status: 'in_progress' as const,
            }));
            setJiraTickets(tickets);

        } catch (err) {
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [supabase, selectedTeamId, dateRange, comparisonEnabled]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full" />
            </div>
        );
    }

    const activeMetas = META_CATEGORIES.filter(mc =>
        dailyChartData.some(d => (d[mc] as number) > 0)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-dashboard-text">Reports</h1>
                <p className="text-dashboard-muted">Team productivity insights and trends</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4">
                <div>
                    <label className="block text-xs text-dashboard-muted mb-1.5 uppercase tracking-wider">Period</label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm"
                    >
                        <option value="today">Today</option>
                        <option value="this_week">This Week</option>
                        <option value="last_week">Last Week</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="last_30">Last 30 Days</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-dashboard-muted mb-1.5 uppercase tracking-wider">Team</label>
                    <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm"
                    >
                        <option value="all">All Teams</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                        type="checkbox"
                        checked={comparisonEnabled}
                        onChange={(e) => setComparisonEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-dashboard-border bg-dashboard-card text-primary-blue focus:ring-primary-blue/50"
                    />
                    <span className="text-sm text-dashboard-muted">Compare with previous period</span>
                </label>

                <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="p-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-muted hover:text-dashboard-text"
                >
                    <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-card p-6">
                <h3 className="font-semibold text-dashboard-text mb-5 text-sm uppercase tracking-wider">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <div className="text-3xl font-bold text-dashboard-text">
                            {stats.totalHours}h
                            {prevStats && (
                                <span className="text-sm font-normal text-dashboard-muted ml-2">
                                    vs {prevStats.totalHours}h
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-dashboard-muted mt-1">Total Hours</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-dashboard-text">{stats.avgPerMember}h</div>
                        <div className="text-xs text-dashboard-muted mt-1">Avg per Member</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-dashboard-text">
                            {stats.topCategory}
                            <span className="text-sm text-dashboard-muted ml-1.5">({stats.topCategoryPercent}%)</span>
                        </div>
                        <div className="text-xs text-dashboard-muted mt-1">Top Category</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-dashboard-text">
                            {stats.mostActiveDay}
                            <span className="text-sm text-dashboard-muted ml-1.5">({stats.mostActiveDayHours}h)</span>
                        </div>
                        <div className="text-xs text-dashboard-muted mt-1">Most Active Day</div>
                    </div>
                </div>
            </div>

            {/* Daily Stacked Bar Chart */}
            <div className="dashboard-card p-6">
                <h3 className="font-semibold text-dashboard-text mb-4 text-sm uppercase tracking-wider">
                    Daily Breakdown by Category
                </h3>
                <div className="h-64">
                    {dailyChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyChartData}>
                                <XAxis dataKey="day" stroke={CHART_AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke={CHART_AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} width={35} />
                                <Tooltip
                                    contentStyle={CHART_TOOLTIP_STYLE}
                                    formatter={(value: number | undefined) => [value != null ? `${value}h` : '—', undefined]}
                                />
                                <Legend
                                    formatter={(value) => <span style={{ color: '#64748B', fontSize: 11 }}>{value}</span>}
                                    iconSize={8}
                                />
                                {activeMetas.map(mc => (
                                    <Bar
                                        key={mc}
                                        dataKey={mc}
                                        stackId="a"
                                        fill={META_CATEGORY_CONFIG[mc].color}
                                        radius={mc === activeMetas[activeMetas.length - 1] ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-dashboard-muted text-sm">
                            No data for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Category Trend */}
            <div className="dashboard-card p-6">
                <h3 className="font-semibold text-dashboard-text mb-4 text-sm uppercase tracking-wider">
                    Category Trend (%)
                </h3>
                <div className="h-52">
                    {categoryTrendData.length > 1 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={categoryTrendData}>
                                <XAxis dataKey="date" stroke={CHART_AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke={CHART_AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} width={35} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={CHART_TOOLTIP_STYLE}
                                    formatter={(value: number | undefined) => [value != null ? `${value}%` : '—', undefined]}
                                />
                                {activeMetas.map(mc => (
                                    <Area
                                        key={mc}
                                        type="monotone"
                                        dataKey={mc}
                                        stackId="1"
                                        stroke={META_CATEGORY_CONFIG[mc].color}
                                        fill={META_CATEGORY_CONFIG[mc].color}
                                        fillOpacity={0.6}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-dashboard-muted text-sm">
                            Need at least 2 days of data for trends
                        </div>
                    )}
                </div>
            </div>

            {/* Task Progress */}
            {jiraTickets.length > 0 && (
                <div className="dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-5 text-sm uppercase tracking-wider">
                        Task Progress
                    </h3>
                    <div className="space-y-3">
                        {jiraTickets.map((ticket) => (
                            <div key={ticket.key} className="flex items-center gap-4">
                                <span className="text-primary-blue font-mono text-xs w-24">{ticket.key}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2.5 bg-dashboard-bg rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-blue to-primary-teal rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min((ticket.hoursWorked / 30) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-dashboard-muted text-xs w-10 text-right">{ticket.hoursWorked}h</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 w-24">
                                    {statusIcons[ticket.status]}
                                    <span className="text-xs text-dashboard-muted capitalize">{ticket.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Export */}
            <div className="flex flex-wrap gap-3 no-print">
                <button
                    onClick={() => exportToPrintPDF()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm hover:bg-slate-50 transition-colors"
                >
                    <FileDown size={16} /> Export PDF
                </button>
                <button
                    onClick={() => {
                        const teamName = teams.find(t => t.id === selectedTeamId)?.name || 'All Teams';
                        exportToCSV(rawSessions, teamName, dateRange);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm hover:bg-slate-50 transition-colors"
                >
                    <FileSpreadsheet size={16} /> Export CSV
                </button>
                <button
                    onClick={() => alert('Email digest can be configured in Settings → Notifications')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm hover:bg-slate-50 transition-colors"
                >
                    <Mail size={16} /> Email Report
                </button>
            </div>
        </div>
    );
}
