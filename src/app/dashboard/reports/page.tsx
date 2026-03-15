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
    done: <CheckCircle className="text-emerald-500" size={14} />,
    in_progress: <Clock className="text-amber-500" size={14} />,
    todo: <Circle className="text-zinc-400" size={14} />,
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
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-sm text-zinc-400">Loading reports...</span>
                </div>
            </div>
        );
    }

    const activeMetas = META_CATEGORIES.filter(mc =>
        dailyChartData.some(d => (d[mc] as number) > 0)
    );

    return (
        <div className="space-y-5 sm:space-y-7">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-[22px] font-semibold text-zinc-900 tracking-tight">Reports</h1>
                <p className="text-zinc-400 mt-0.5 text-[13px] sm:text-[14px]">
                    Team productivity insights and trends
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-3 sm:gap-4">
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Period</label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 bg-white rounded-xl text-zinc-700 text-sm
                            shadow-card border-0 outline-none cursor-pointer"
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
                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Team</label>
                    <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="px-3 py-2 bg-white rounded-xl text-zinc-700 text-sm
                            shadow-card border-0 outline-none cursor-pointer"
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
                        className="w-4 h-4 rounded border-zinc-200 bg-white text-indigo-600
                            focus:ring-indigo-500/30"
                    />
                    <span className="text-sm text-zinc-500">Compare with previous period</span>
                </label>

                <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="p-2.5 bg-white rounded-xl text-zinc-400 hover:text-zinc-600
                        shadow-card transition-colors"
                >
                    <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6">
                <h3 className="text-[15px] font-semibold text-zinc-800 mb-4 sm:mb-5">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <div>
                        <div className="text-3xl font-semibold text-zinc-900 tabular-nums">
                            {stats.totalHours}h
                            {prevStats && (
                                <span className="text-sm font-normal text-zinc-400 ml-2">
                                    vs {prevStats.totalHours}h
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1.5">Total Hours</div>
                    </div>
                    <div>
                        <div className="text-3xl font-semibold text-zinc-900 tabular-nums">
                            {stats.avgPerMember}h
                        </div>
                        <div className="text-xs text-zinc-400 mt-1.5">Avg per Member</div>
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-zinc-900">
                            {stats.topCategory}
                            <span className="text-sm text-zinc-400 ml-1.5">
                                ({stats.topCategoryPercent}%)
                            </span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-1.5">Top Category</div>
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-zinc-900">
                            {stats.mostActiveDay}
                            <span className="text-sm text-zinc-400 ml-1.5">
                                ({stats.mostActiveDayHours}h)
                            </span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-1.5">Most Active Day</div>
                    </div>
                </div>
            </div>

            {/* Daily Stacked Bar Chart */}
            <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6">
                <h3 className="text-[15px] font-semibold text-zinc-800 mb-4 sm:mb-5">
                    Daily Breakdown by Category
                </h3>
                <div className="h-64">
                    {dailyChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyChartData}>
                                <XAxis
                                    dataKey="day"
                                    stroke={CHART_AXIS_COLOR}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke={CHART_AXIS_COLOR}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    width={35}
                                />
                                <Tooltip
                                    contentStyle={CHART_TOOLTIP_STYLE}
                                    formatter={(value: number | undefined) => [
                                        value != null ? `${value}h` : '—', undefined,
                                    ]}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: '#71717A', fontSize: 11 }}>
                                            {value}
                                        </span>
                                    )}
                                    iconSize={8}
                                />
                                {activeMetas.map(mc => (
                                    <Bar
                                        key={mc}
                                        dataKey={mc}
                                        stackId="a"
                                        fill={META_CATEGORY_CONFIG[mc].color}
                                        radius={mc === activeMetas[activeMetas.length - 1]
                                            ? [4, 4, 0, 0]
                                            : [0, 0, 0, 0]
                                        }
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                            No data for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Category Trend */}
            <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6">
                <h3 className="text-[15px] font-semibold text-zinc-800 mb-4 sm:mb-5">
                    Category Trend (%)
                </h3>
                <div className="h-52">
                    {categoryTrendData.length > 1 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={categoryTrendData}>
                                <XAxis
                                    dataKey="date"
                                    stroke={CHART_AXIS_COLOR}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke={CHART_AXIS_COLOR}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    width={35}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={CHART_TOOLTIP_STYLE}
                                    formatter={(value: number | undefined) => [
                                        value != null ? `${value}%` : '—', undefined,
                                    ]}
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
                        <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                            Need at least 2 days of data for trends
                        </div>
                    )}
                </div>
            </div>

            {/* Task Progress */}
            {jiraTickets.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card p-6">
                    <h3 className="text-[15px] font-semibold text-zinc-800 mb-5">
                        Task Progress
                    </h3>
                    <div className="space-y-3">
                        {jiraTickets.map((ticket) => (
                            <div key={ticket.key} className="flex items-center gap-4">
                                <span className="text-indigo-500 font-mono text-xs w-24">
                                    {ticket.key}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-400 rounded-full
                                                    transition-all duration-500"
                                                style={{
                                                    width: `${Math.min((ticket.hoursWorked / 30) * 100, 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-zinc-400 text-xs w-10 text-right tabular-nums">
                                            {ticket.hoursWorked}h
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 w-24">
                                    {statusIcons[ticket.status]}
                                    <span className="text-xs text-zinc-500 capitalize">
                                        {ticket.status.replace('_', ' ')}
                                    </span>
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl
                        text-zinc-600 text-sm shadow-card hover:shadow-card-hover transition-shadow"
                >
                    <FileDown size={16} /> Export PDF
                </button>
                <button
                    onClick={() => {
                        const teamName = teams.find(t => t.id === selectedTeamId)?.name || 'All Teams';
                        exportToCSV(rawSessions, teamName, dateRange);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl
                        text-zinc-600 text-sm shadow-card hover:shadow-card-hover transition-shadow"
                >
                    <FileSpreadsheet size={16} /> Export CSV
                </button>
                <button
                    onClick={() => alert('Email digest can be configured in Settings → Notifications')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl
                        text-zinc-600 text-sm shadow-card hover:shadow-card-hover transition-shadow"
                >
                    <Mail size={16} /> Email Report
                </button>
            </div>
        </div>
    );
}
