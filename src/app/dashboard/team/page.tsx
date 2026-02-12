'use client';

import { useEffect, useState } from 'react';
import { Filter, Download, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
    todayHours: number;
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

    const fetchTeamData = async (showRefresh = false) => {
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

            // Get members and today's sessions
            const [teamMembers, sessions] = await Promise.all([
                getTeamMembers(supabase, teamId),
                getTodayWorkSessions(supabase, teamId),
            ]);

            // Calculate hours per member
            const memberHours: Record<string, number> = {};
            sessions.forEach((s: WorkSession) => {
                memberHours[s.user_id] = (memberHours[s.user_id] || 0) + s.duration_seconds;
            });

            // Map to display format
            const displayMembers: DisplayMember[] = teamMembers.map((m: TeamMemberType & { profile: Profile }) => {
                const lastSeen = m.profile.last_seen_at ? new Date(m.profile.last_seen_at) : null;
                const isOnline = lastSeen ? (Date.now() - lastSeen.getTime()) < 5 * 60 * 1000 : false;

                return {
                    id: m.user_id,
                    name: m.profile.display_name || 'Unknown',
                    avatar_url: m.profile.avatar_url,
                    isOnline,
                    todayHours: secondsToHours(memberHours[m.user_id] || 0),
                    currentActivity: null, // Would need real-time activity tracking
                };
            }).sort((a, b) => b.todayHours - a.todayHours);

            setMembers(displayMembers);
        } catch (err) {
            console.error('Error fetching team:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTeamData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTeamId]);

    const filteredMembers = members.filter(member => {
        if (filter === 'online') return member.isOnline;
        if (filter === 'offline') return !member.isOnline;
        return true;
    });

    const handleMemberClick = (memberId: string) => {
        router.push(`/dashboard/member/${memberId}`);
    };

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
                <p className="text-dashboard-muted mb-4">
                    Create a team in Settings to view your team members.
                </p>
                <a
                    href="/dashboard/settings"
                    className="inline-block px-4 py-2 bg-gradient-to-r from-primary-blue to-primary-teal text-white rounded-lg"
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
                    <h1 className="text-2xl font-bold text-dashboard-text flex items-center gap-2">
                        👥 Team Overview
                    </h1>
                    <p className="text-dashboard-muted">Manage and monitor your team members</p>
                </div>
                <div className="flex items-center gap-3">
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

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as 'all' | 'online' | 'offline')}
                            className="appearance-none px-4 py-2 pr-10 bg-dashboard-card border border-dashboard-border 
                       rounded-lg text-dashboard-text cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                        >
                            <option value="all">All Members</option>
                            <option value="online">Online Only</option>
                            <option value="offline">Offline Only</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-muted pointer-events-none" size={16} />
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={() => fetchTeamData(true)}
                        disabled={refreshing}
                        className="p-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-muted hover:text-dashboard-text"
                    >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                    </button>

                    {/* Export Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-dashboard-card border border-dashboard-border 
                           rounded-lg text-dashboard-text hover:bg-dashboard-border/50 transition-colors">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Team Grid */}
            {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMembers.map((member) => (
                        <button
                            key={member.id}
                            onClick={() => handleMemberClick(member.id)}
                            className="dashboard-card p-6 text-left hover:border-primary-blue/50 
                     transition-all duration-200 group"
                        >
                            {/* Avatar */}
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-teal 
                            rounded-full flex items-center justify-center relative
                            group-hover:scale-105 transition-transform overflow-hidden">
                                    {member.avatar_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-bold text-xl">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    )}
                                    {member.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-accent-green rounded-full border-2 border-dashboard-card" />
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <h3 className="text-center font-semibold text-dashboard-text mb-2">
                                {member.name}
                            </h3>

                            {/* Status */}
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className={member.isOnline ? 'status-online' : 'status-offline'} />
                                <span className="text-sm text-dashboard-muted">
                                    {member.isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>

                            {/* Hours */}
                            <div className="text-center text-2xl font-bold text-dashboard-text mb-1">
                                {member.todayHours}h
                            </div>

                            {/* Current Activity */}
                            <div className="text-center text-sm text-dashboard-muted h-5">
                                {member.currentActivity || '---'}
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="dashboard-card p-8 text-center">
                    <p className="text-dashboard-muted">
                        {filter === 'all' ? 'No team members yet' : `No ${filter} members`}
                    </p>
                </div>
            )}
        </div>
    );
}
