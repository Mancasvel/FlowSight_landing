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
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-sm text-zinc-400">Loading team...</span>
                </div>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-card p-10 text-center max-w-md mx-auto mt-12">
                <h2 className="text-lg font-semibold text-zinc-900 mb-2">No Teams Yet</h2>
                <p className="text-zinc-400 mb-6 text-sm">
                    Create a team in Settings to view your team members.
                </p>
                <a
                    href="/dashboard/settings"
                    className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl
                        text-sm font-medium hover:bg-indigo-700 transition-colors"
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
                        Team Overview
                    </h1>
                    <p className="text-zinc-400 mt-0.5 text-[13px] sm:text-[14px]">
                        {members.length} members &middot; {onlinePct}% online
                    </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

                    <div className="flex bg-white rounded-xl shadow-card overflow-hidden">
                        <button
                            onClick={() => setViewMode('balance')}
                            className={`px-3.5 py-2 text-xs font-medium transition-colors
                                ${viewMode === 'balance'
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                        >
                            Balance
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`px-3.5 py-2 text-xs font-medium transition-colors
                                ${viewMode === 'cards'
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                        >
                            Cards
                        </button>
                    </div>

                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as 'all' | 'online' | 'offline')}
                            className="appearance-none px-3 py-2 pr-8 bg-white rounded-xl text-zinc-700
                                text-sm shadow-card border-0 outline-none cursor-pointer"
                        >
                            <option value="all">All</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                        <Filter
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                            size={14}
                        />
                    </div>

                    <button
                        onClick={() => fetchTeamData(true)}
                        disabled={refreshing}
                        className="p-2.5 bg-white rounded-xl text-zinc-400 hover:text-zinc-600
                            shadow-card transition-colors"
                    >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    </button>

                    <button className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl
                        text-zinc-600 text-sm shadow-card hover:shadow-card-hover transition-shadow">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'balance' ? (
                <div className="bg-white rounded-2xl shadow-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[15px] font-semibold text-zinc-800">
                            Today&apos;s Workload Distribution
                        </h3>
                    </div>
                    {filteredMembers.length > 0 ? (
                        <WorkloadBalance
                            members={filteredMembers}
                            onMemberClick={(id) => router.push(`/dashboard/member/${id}`)}
                        />
                    ) : (
                        <div className="text-center text-zinc-400 py-8 text-sm">
                            {filter === 'all' ? 'No team members yet' : `No ${filter} members`}
                        </div>
                    )}
                </div>
            ) : (
                filteredMembers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                        {filteredMembers.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => router.push(`/dashboard/member/${member.id}`)}
                                className="bg-white rounded-2xl shadow-card p-6 text-left
                                    hover:shadow-card-hover transition-all duration-200 group"
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="w-14 h-14 bg-zinc-100 rounded-full
                                        flex items-center justify-center relative
                                        group-hover:scale-105 transition-transform overflow-hidden">
                                        {member.avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={member.avatar_url}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-zinc-500 font-semibold text-lg">
                                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </span>
                                        )}
                                        {member.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5
                                                bg-emerald-400 rounded-full border-2 border-white" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-center font-semibold text-zinc-800 mb-2 text-sm">
                                    {member.name}
                                </h3>

                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <span className={`w-1.5 h-1.5 rounded-full
                                        ${member.isOnline ? 'bg-emerald-400' : 'bg-zinc-300'}`}
                                    />
                                    <span className="text-xs text-zinc-400">
                                        {member.isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </div>

                                <div className="text-center text-2xl font-semibold text-zinc-900 mb-1 tabular-nums">
                                    {member.hours}h
                                </div>
                                <div className="text-center text-xs text-zinc-400 h-4">
                                    {member.currentActivity || '---'}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                        <p className="text-zinc-400 text-sm">
                            {filter === 'all' ? 'No team members yet' : `No ${filter} members`}
                        </p>
                    </div>
                )
            )}
        </div>
    );
}
