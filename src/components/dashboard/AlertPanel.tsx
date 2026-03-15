'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, TrendingDown, Clock, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    getTeams,
    getWorkSessions,
    getTeamMembers,
    aggregateCategoryBreakdown,
    secondsToHours,
    getDateRange,
    type Team,
    type WorkSession,
} from '@/lib/supabase/queries';
import { aggregateToMeta } from '@/lib/categories';

export interface Alert {
    id: string;
    type: 'burnout' | 'low_activity' | 'meeting_overload' | 'category_shift';
    severity: 'warning' | 'critical';
    title: string;
    description: string;
    memberName?: string;
    timestamp: Date;
    dismissed: boolean;
}

const ALERT_ICONS = {
    burnout: <AlertTriangle size={14} className="text-red-500" />,
    low_activity: <TrendingDown size={14} className="text-amber-500" />,
    meeting_overload: <Clock size={14} className="text-orange-500" />,
    category_shift: <TrendingDown size={14} className="text-indigo-500" />,
};

export default function AlertPanel() {
    const supabase = createClient();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const analyzeForAlerts = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const teams: Team[] = await getTeams(supabase, user.id);
            if (teams.length === 0) { setLoading(false); return; }

            const teamId = teams[0].id;
            const { start: weekStart, end: weekEnd } = getDateRange('this_week');
            const { start: lastWeekStart, end: lastWeekEnd } = getDateRange('last_week');

            const [members, weekSessions, lastWeekSessions] = await Promise.all([
                getTeamMembers(supabase, teamId),
                getWorkSessions(supabase, teamId, weekStart, weekEnd),
                getWorkSessions(supabase, teamId, lastWeekStart, lastWeekEnd),
            ]);

            const newAlerts: Alert[] = [];

            for (const member of members) {
                const memberName = member.profile.display_name || 'Unknown';
                const memberWeekSessions = weekSessions.filter((s: WorkSession) => s.user_id === member.user_id);
                const memberLastWeekSessions = lastWeekSessions.filter((s: WorkSession) => s.user_id === member.user_id);

                const dailyHours: Record<string, number> = {};
                memberWeekSessions.forEach((s: WorkSession) => {
                    dailyHours[s.session_date] = (dailyHours[s.session_date] || 0) + s.duration_seconds;
                });

                const highDays = Object.values(dailyHours).filter(sec => sec > 9 * 3600);
                if (highDays.length >= 3) {
                    newAlerts.push({
                        id: `burnout-${member.user_id}`,
                        type: 'burnout',
                        severity: 'critical',
                        title: 'Burnout risk detected',
                        description: `${memberName} has worked 9+ hours for ${highDays.length} days this week.`,
                        memberName,
                        timestamp: new Date(),
                        dismissed: false,
                    });
                }

                const lowDays = Object.values(dailyHours).filter(sec => sec > 0 && sec < 2 * 3600);
                if (lowDays.length >= 2) {
                    newAlerts.push({
                        id: `low-${member.user_id}`,
                        type: 'low_activity',
                        severity: 'warning',
                        title: 'Low activity detected',
                        description: `${memberName} has logged less than 2 hours on ${lowDays.length} days. They might be blocked.`,
                        memberName,
                        timestamp: new Date(),
                        dismissed: false,
                    });
                }

                const memberCategoryBreakdown = aggregateCategoryBreakdown(memberWeekSessions);
                const metaBreakdown = aggregateToMeta(memberCategoryBreakdown);
                const metaTotal = Object.values(metaBreakdown).reduce((a, b) => a + b, 0);
                const meetingPct = metaTotal > 0 ? ((metaBreakdown['Meetings'] || 0) / metaTotal) * 100 : 0;

                if (meetingPct > 40) {
                    newAlerts.push({
                        id: `meetings-${member.user_id}`,
                        type: 'meeting_overload',
                        severity: 'warning',
                        title: 'Meeting overload',
                        description: `${memberName} is spending ${Math.round(meetingPct)}% of time in meetings this week.`,
                        memberName,
                        timestamp: new Date(),
                        dismissed: false,
                    });
                }

                const lastWeekBreakdown = aggregateCategoryBreakdown(memberLastWeekSessions);
                const lastWeekMeta = aggregateToMeta(lastWeekBreakdown);
                const lastWeekTotal = Object.values(lastWeekMeta).reduce((a, b) => a + b, 0);

                if (metaTotal > 3600 && lastWeekTotal > 3600) {
                    const deepWorkPctNow = ((metaBreakdown['Deep Work'] || 0) / metaTotal) * 100;
                    const deepWorkPctLast = ((lastWeekMeta['Deep Work'] || 0) / lastWeekTotal) * 100;
                    const shift = deepWorkPctNow - deepWorkPctLast;

                    if (shift < -20) {
                        newAlerts.push({
                            id: `shift-${member.user_id}`,
                            type: 'category_shift',
                            severity: 'warning',
                            title: 'Focus time dropping',
                            description: `${memberName}'s deep work dropped ${Math.abs(Math.round(shift))}% vs last week.`,
                            memberName,
                            timestamp: new Date(),
                            dismissed: false,
                        });
                    }
                }
            }

            const weekTotal = secondsToHours(weekSessions.reduce((s: number, w: WorkSession) => s + w.duration_seconds, 0));
            const lastWeekTotalHours = secondsToHours(lastWeekSessions.reduce((s: number, w: WorkSession) => s + w.duration_seconds, 0));
            if (lastWeekTotalHours > 10 && weekTotal < lastWeekTotalHours * 0.6) {
                newAlerts.push({
                    id: 'team-drop',
                    type: 'low_activity',
                    severity: 'warning',
                    title: 'Team activity drop',
                    description: `Team hours are ${Math.round((1 - weekTotal / lastWeekTotalHours) * 100)}% lower than last week (${weekTotal}h vs ${lastWeekTotalHours}h).`,
                    timestamp: new Date(),
                    dismissed: false,
                });
            }

            const dismissed = JSON.parse(localStorage.getItem('flowsight_dismissed_alerts') || '[]') as string[];
            newAlerts.forEach(a => {
                if (dismissed.includes(a.id)) a.dismissed = true;
            });

            setAlerts(newAlerts);
        } catch (err) {
            console.error('Error analyzing alerts:', err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        analyzeForAlerts();
    }, [analyzeForAlerts]);

    const dismissAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
        const dismissed = JSON.parse(localStorage.getItem('flowsight_dismissed_alerts') || '[]') as string[];
        dismissed.push(id);
        localStorage.setItem('flowsight_dismissed_alerts', JSON.stringify(dismissed));
    };

    const activeAlerts = alerts.filter(a => !a.dismissed);

    if (loading || activeAlerts.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            {activeAlerts.slice(0, 3).map(alert => (
                <div
                    key={alert.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${alert.severity === 'critical'
                            ? 'bg-red-50 border border-red-100'
                            : 'bg-amber-50/60 border border-amber-100'
                        }`}
                >
                    <div className="flex-shrink-0">
                        {ALERT_ICONS[alert.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-zinc-800">{alert.title}</span>
                        <span className="text-zinc-300 mx-2">&middot;</span>
                        <span className="text-sm text-zinc-500">{alert.description}</span>
                    </div>
                    <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-zinc-300 hover:text-zinc-500 transition-colors flex-shrink-0"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
