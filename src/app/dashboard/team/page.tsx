'use client';

import { useEffect, useState, useCallback } from 'react';
import { Filter, Download, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import WorkloadBalance from '@/components/dashboard/WorkloadBalance';
import {
    getTeams,
    getTeamMembers,
    getTodayWorkSessions,
    secondsToHours,
    type Profile,
    type Team,
    type TeamMember as TeamMemberType,
    type WorkSession,
} from '@/lib/supabase/queries';

interface DisplayMember {
    id: string;
    name: string;
    avatar_url: string | null;
    isOnline: boolean;
    hours: number;
    currentActivity: string | null;
}

export default function TeamPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [members, setMembers] = useState<DisplayMember[]>([]);
    const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
    const [viewMode, setViewMode] = useState<'cards' | 'balance'>('balance');

    const fetchTeamData = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const userTeams = await getTeams(supabase, user.id);
            setTeams(userTeams);

            if (userTeams.length === 0) {
                setLoading(false);
                setRefreshing(false);
                return;
            }

            const teamId = selectedTeamId || userTeams[0].id;
            if (!selectedTeamId) setSelectedTeamId(teamId);

            const [teamMembers, sessions] = await Promise.all([
                getTeamMembers(supabase, teamId),
                getTodayWorkSessions(supabase, teamId),
            ]);

            const memberHours: Record<string, number> = {};
            sessions.forEach((s: WorkSession) => {
                memberHours[s.user_id] = (memberHours[s.user_id] || 0) + s.duration_seconds;
            });

            const displayMembers: DisplayMember[] = teamMembers.map((m: TeamMemberType & { profile: Profile }) => {
                const lastSeen = m.profile.last_seen_at ? new Date(m.profile.last_seen_at) : null;
                const isOnline = lastSeen ? (Date.now() - lastSeen.getTime()) < 5 * 60 * 1000 : false;

                return {
                    id: m.user_id,
                    name: m.profile.display_name || 'Unknown',
                    avatar_url: m.profile.avatar_url,
                    isOnline,
                    hours: secondsToHours(memberHours[m.user_id] || 0),
                    currentActivity: null,
                };
            }).sort((a, b) => b.hours - a.hours);

            setMembers(displayMembers);
        } catch (err) {
            console.error('Error fetching team:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [supabase, selectedTeamId]);

    useEffect(() => {
        fetchTeamData();
    }, [fetchTeamData]);

    const filteredMembers = members.filter(member => {
        if (filter === 'online') return member.isOnline;
        if (filter === 'offline') return !member.isOnline;
        return true;
    });

    const onlinePct = members.length > 0
        ? Math.round((members.filter(m => m.isOnline).length / members.length) * 100)
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full" />
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="dashboard-card p-8 text-center">
                <h2 className="text-xl font-semibold text-dashboard-text mb-2">No Teams Yet</h2>
                <p className="text-dashboard-muted mb-4">Create a team in Settings to view your team members.</p>
                <a href="/dashboard/settings" className="inline-block px-4 py-2 bg-gradient-to-r from-primary-blue to-primary-teal text-white rounded-lg">
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
                    <h1 className="text-2xl font-bold text-dashboard-text">Team Overview</h1>
                    <p className="text-dashboard-muted">
                        {members.length} members · {onlinePct}% online
                    </p>
                </div>
                <div className="flex items-center gap-3">
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

                    {/* View toggle */}
                    <div className="flex bg-dashboard-card border border-dashboard-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('balance')}
                            className={`px-3 py-2 text-xs ${viewMode === 'balance' ? 'bg-primary-blue/20 text-primary-blue' : 'text-dashboard-muted hover:text-dashboard-text'}`}
                        >
                            Balance
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`px-3 py-2 text-xs ${viewMode === 'cards' ? 'bg-primary-blue/20 text-primary-blue' : 'text-dashboard-muted hover:text-dashboard-text'}`}
                        >
                            Cards
                        </button>
                    </div>

                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as 'all' | 'online' | 'offline')}
                            className="appearance-none px-3 py-2 pr-8 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm cursor-pointer"
                        >
                            <option value="all">All</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dashboard-muted pointer-events-none" size={14} />
                    </div>

                    <button
                        onClick={() => fetchTeamData(true)}
                        disabled={refreshing}
                        className="p-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-muted hover:text-dashboard-text"
                    >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm hover:bg-dashboard-border/50 transition-colors">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'balance' ? (
                <div className="dashboard-card p-6">
                    <h3 className="font-semibold text-dashboard-text mb-4 text-sm uppercase tracking-wider">
                        Today&apos;s Workload Distribution
                    </h3>
                    {filteredMembers.length > 0 ? (
                        <WorkloadBalance
                            members={filteredMembers}
                            onMemberClick={(id) => router.push(`/dashboard/member/${id}`)}
                        />
                    ) : (
                        <div className="text-center text-dashboard-muted py-8 text-sm">
                            {filter === 'all' ? 'No team members yet' : `No ${filter} members`}
                        </div>
                    )}
                </div>
            ) : (
                filteredMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMembers.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => router.push(`/dashboard/member/${member.id}`)}
                                className="dashboard-card p-6 text-left hover:border-primary-blue/50 transition-all duration-200 group"
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-blue to-primary-teal rounded-full flex items-center justify-center relative group-hover:scale-105 transition-transform overflow-hidden">
                                        {member.avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white font-bold text-lg">
                                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </span>
                                        )}
                                        {member.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-accent-green rounded-full border-2 border-dashboard-card" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-center font-semibold text-dashboard-text mb-2 text-sm">{member.name}</h3>

                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <span className={`w-1.5 h-1.5 rounded-full ${member.isOnline ? 'bg-accent-green' : 'bg-dashboard-muted'}`} />
                                    <span className="text-xs text-dashboard-muted">{member.isOnline ? 'Online' : 'Offline'}</span>
                                </div>

                                <div className="text-center text-2xl font-bold text-dashboard-text mb-1">{member.hours}h</div>
                                <div className="text-center text-xs text-dashboard-muted h-4">
                                    {member.currentActivity || '---'}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="dashboard-card p-8 text-center">
                        <p className="text-dashboard-muted text-sm">
                            {filter === 'all' ? 'No team members yet' : `No ${filter} members`}
                        </p>
                    </div>
                )
            )}
        </div>
    );
}
