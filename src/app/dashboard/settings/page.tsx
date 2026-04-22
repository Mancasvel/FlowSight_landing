'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Link as LinkIcon, Bell, Shield, Check, Plus, Trash2, Copy, RefreshCw, CreditCard, Users, MessageSquare, Palette, AlertTriangle, Mail, KeyRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    getLicense,
    getTeams,
    getTeamMembers,
    createTeam,
    removeTeamMember,
    claimLicense,
    secondsToHours,
    type License,
    type Team,
    type TeamMember,
    type Profile,
} from '@/lib/supabase/queries';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-zinc-200'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );
}

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [license, setLicense] = useState<License | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [teamMembers, setTeamMembers] = useState<(TeamMember & { profile: Profile })[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    // Integration states
    const [connecting, setConnecting] = useState<string | null>(null);
    const [integrations, setIntegrations] = useState({
        jira: false,
        slack: false,
    });

    // Form states
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [generatingInvite, setGeneratingInvite] = useState(false);

    // License claim state
    const [licenseCode, setLicenseCode] = useState('');
    const [claimingLicense, setClaimingLicense] = useState(false);
    const [claimError, setClaimError] = useState<string | null>(null);
    const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

    // Notification settings
    const [dailyEmail, setDailyEmail] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(true);
    const [realTimeAlerts, setRealTimeAlerts] = useState(false);
    const [retention, setRetention] = useState('7');

    // Team template
    const [teamTemplate, setTeamTemplate] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('flowsight_team_template') || 'general';
        return 'general';
    });

    // Alert thresholds
    const [burnoutThreshold, setBurnoutThreshold] = useState('9');
    const [lowActivityThreshold, setLowActivityThreshold] = useState('2');
    const [meetingOverloadThreshold, setMeetingOverloadThreshold] = useState('40');

    // Email digest
    const [digestDay, setDigestDay] = useState('monday');
    const [digestTime, setDigestTime] = useState('09:00');
    const [digestRecipients, setDigestRecipients] = useState('');

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const [userLicense, userTeams] = await Promise.all([
                getLicense(supabase, user.id),
                getTeams(supabase, user.id),
            ]);

            setLicense(userLicense);
            setTeams(userTeams);

            if (userTeams.length > 0) {
                setSelectedTeam(userTeams[0]);
                const members = await getTeamMembers(supabase, userTeams[0].id);
                setTeamMembers(members);
            }

            // Check if Jira is connected from database
            const { data: profile } = await supabase
                .from('profiles')
                .select('jira_tokens, jira_cloud_id')
                .eq('id', user.id)
                .single();

            const jiraConnected = !!(profile?.jira_tokens && profile?.jira_cloud_id);

            // Load integrations (combine DB + localStorage for Slack)
            const storedIntegrations = localStorage.getItem('integrations');
            const parsedIntegrations = storedIntegrations ? JSON.parse(storedIntegrations) : { slack: false };

            setIntegrations({
                jira: jiraConnected,
                slack: parsedIntegrations.slack || false,
            });
        } catch (err) {
            console.error('Error fetching settings data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Check for jira=connected from OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('jira') === 'connected') {
            // Clean up URL
            window.history.replaceState({}, '', '/dashboard/settings');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleIntegrate = (type: 'jira' | 'slack') => {
        if (integrations[type]) {
            // Disconnect
            const newIntegrations = { ...integrations, [type]: false };
            setIntegrations(newIntegrations);
            localStorage.setItem('integrations', JSON.stringify(newIntegrations));

            // TODO: Also revoke tokens from database
            return;
        }

        setConnecting(type);

        if (type === 'jira') {
            // Real Jira OAuth flow
            const clientId = process.env.NEXT_PUBLIC_JIRA_CLIENT_ID;
            const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/jira/callback`);
            const scope = encodeURIComponent('read:jira-user read:jira-work offline_access');
            // Encode returnTo in state parameter (state format: random_uuid:returnTo)
            const stateData = `${crypto.randomUUID()}:settings`;

            sessionStorage.setItem('jira_oauth_state', stateData);

            const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${encodeURIComponent(stateData)}&response_type=code&prompt=consent`;

            window.location.href = authUrl;
        } else {
            // Slack integration (still mock for now)
            setTimeout(() => {
                const newIntegrations = { ...integrations, [type]: true };
                setIntegrations(newIntegrations);
                localStorage.setItem('integrations', JSON.stringify(newIntegrations));
                setConnecting(null);
            }, 1500);
        }
    };

    const handleUpgrade = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: 'price_123456789', // Replace with strict ENV var in production
                }),
            });

            if (!response.ok) throw new Error('Checkout failed');

            const { url } = await response.json();
            window.location.href = url;
        } catch (err) {
            console.error('Upgrade error:', err);
            alert('Failed to start checkout');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check for success/cancel query params
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            alert('Payment successful! Your license has been updated.');
        } else if (query.get('canceled')) {
            alert('Payment canceled.');
        }
    }, []);

    const handleClaimLicense = async () => {
        const code = licenseCode.trim();
        if (!code) return;

        setClaimingLicense(true);
        setClaimError(null);
        setClaimSuccess(null);

        try {
            const claimed = await claimLicense(supabase, code);
            setLicense(claimed);
            setLicenseCode('');
            setClaimSuccess(
                `License activated. You now have ${claimed.max_members} seats on the ${claimed.plan_type} plan.`
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to activate license.';
            setClaimError(message);
        } finally {
            setClaimingLicense(false);
        }
    };

    const handleTeamSelect = async (team: Team) => {
        setSelectedTeam(team);
        const members = await getTeamMembers(supabase, team.id);
        setTeamMembers(members);
    };

    const handleCreateTeam = async () => {
        if (!newTeamName.trim() || !userId || !license) return;
        setCreatingTeam(true);

        try {
            const newTeam = await createTeam(supabase, {
                name: newTeamName.trim(),
                owner_id: userId,
                license_id: license.id,
            });
            setTeams([...teams, newTeam]);
            setNewTeamName('');
            setShowCreateTeam(false);
            setSelectedTeam(newTeam);
            setTeamMembers([]);
        } catch (err) {
            console.error('Error creating team:', err);
            alert('Failed to create team');
        } finally {
            setCreatingTeam(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!selectedTeam || !confirm('Remove this member from the team?')) return;

        try {
            await removeTeamMember(supabase, selectedTeam.id, memberId);
            setTeamMembers(teamMembers.filter(m => m.user_id !== memberId));
        } catch (err) {
            console.error('Error removing member:', err);
            alert('Failed to remove member');
        }
    };

    const generateInviteLink = async () => {
        if (!selectedTeam) return;
        setGeneratingInvite(true);

        try {
            // Generate a random token
            const token = crypto.randomUUID();

            // Insert invitation to database
            const { error } = await supabase.from('invitations').insert({
                team_id: selectedTeam.id,
                token,
                created_by: userId,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            });

            if (error) throw error;

            // Just show the token
            setInviteLink(token);
        } catch (err) {
            console.error('Error generating invite:', err);
            alert('Failed to generate invite code');
        } finally {
            setGeneratingInvite(false);
        }
    };

    const copyInviteCode = () => {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            alert('Invite code copied!');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    const daysUntilExpiry = license ? Math.ceil((new Date(license.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-dashboard-text">Settings</h1>
                <p className="text-dashboard-muted">Manage your license, teams, and preferences</p>
            </div>

            {/* License Status */}
            <section className="dashboard-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-primary-blue" size={24} />
                    <div>
                        <h2 className="font-semibold text-dashboard-text text-lg">License</h2>
                        <p className="text-sm text-dashboard-muted">Your current subscription</p>
                    </div>
                </div>

                {license ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-dashboard-bg rounded-lg">
                            <div className="text-sm text-dashboard-muted mb-1">Plan</div>
                            <div className="text-lg font-semibold text-dashboard-text capitalize">{license.plan_type}</div>
                        </div>
                        <div className="p-4 bg-dashboard-bg rounded-lg">
                            <div className="text-sm text-dashboard-muted mb-1">Members</div>
                            <div className="text-lg font-semibold text-dashboard-text">
                                {teamMembers.length} / {license.max_members}
                            </div>
                        </div>
                        <div className="p-4 bg-dashboard-bg rounded-lg">
                            <div className="text-sm text-dashboard-muted mb-1">Expires</div>
                            <div className={`text-lg font-semibold ${daysUntilExpiry < 30 ? 'text-accent-orange' : 'text-dashboard-text'}`}>
                                {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-dashboard-muted mb-4">No active license</p>
                        <a
                            href="/dashboard/pricing"
                            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            View Plans
                        </a>
                    </div>
                )}

                {license && license.plan_type === 'starter' && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleUpgrade}
                            className="px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-red text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            ⚡ Upgrade to Professional
                        </button>
                    </div>
                )}

                {/* Activate a license code (promo / bulk / gift codes) */}
                <div className={`${license ? 'mt-6 pt-6 border-t border-dashboard-border' : 'mt-2'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <KeyRound size={16} className="text-primary-blue" />
                        <h3 className="font-medium text-dashboard-text text-sm">
                            {license ? 'Have another license code?' : 'Activate a license code'}
                        </h3>
                    </div>
                    <p className="text-xs text-dashboard-muted mb-3">
                        Paste a code like <span className="font-mono">FS-XXXX-XXXX</span> to activate it on your account.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={licenseCode}
                            onChange={(e) => {
                                setLicenseCode(e.target.value);
                                if (claimError) setClaimError(null);
                                if (claimSuccess) setClaimSuccess(null);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !claimingLicense) handleClaimLicense();
                            }}
                            placeholder="FS-XXXX-XXXX"
                            autoComplete="off"
                            spellCheck={false}
                            disabled={claimingLicense}
                            aria-label="License code"
                            className="flex-1 px-4 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text font-mono tracking-wider uppercase placeholder:text-dashboard-muted placeholder:font-sans placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        />
                        <button
                            onClick={handleClaimLicense}
                            disabled={claimingLicense || !licenseCode.trim()}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {claimingLicense ? (
                                <>
                                    <RefreshCw className="animate-spin" size={16} />
                                    Activating...
                                </>
                            ) : (
                                <>
                                    <Check size={16} />
                                    Activate
                                </>
                            )}
                        </button>
                    </div>

                    {claimError && (
                        <div className="mt-3 flex items-start gap-2 p-3 bg-accent-red/10 border border-accent-red/30 rounded-lg text-sm text-accent-red">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>{claimError}</span>
                        </div>
                    )}
                    {claimSuccess && (
                        <div className="mt-3 flex items-start gap-2 p-3 bg-accent-green/10 border border-accent-green/30 rounded-lg text-sm text-accent-green">
                            <Check size={16} className="mt-0.5 shrink-0" />
                            <span>{claimSuccess}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Team Management */}
            <section className="dashboard-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Users className="text-primary-blue" size={24} />
                        <div>
                            <h2 className="font-semibold text-dashboard-text text-lg">Teams</h2>
                            <p className="text-sm text-dashboard-muted">Manage your teams and members</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateTeam(true)}
                        disabled={!license}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        <Plus size={16} />
                        New Team
                    </button>
                </div>

                {/* Team Selector */}
                {teams.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {teams.map(team => (
                            <button
                                key={team.id}
                                onClick={() => handleTeamSelect(team)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedTeam?.id === team.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-dashboard-bg text-dashboard-text hover:bg-dashboard-border'
                                    }`}
                            >
                                {team.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Create Team Form */}
                {showCreateTeam && (
                    <div className="p-4 bg-dashboard-bg rounded-lg mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                placeholder="Team name"
                                className="flex-1 px-4 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text"
                            />
                            <button
                                onClick={handleCreateTeam}
                                disabled={!newTeamName.trim() || creatingTeam}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {creatingTeam ? 'Creating...' : 'Create'}
                            </button>
                            <button
                                onClick={() => setShowCreateTeam(false)}
                                className="px-4 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Team Members */}
                {selectedTeam && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-dashboard-text">{selectedTeam.name} Members</h3>
                            <button
                                onClick={generateInviteLink}
                                disabled={generatingInvite}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-dashboard-bg rounded-lg text-dashboard-text hover:bg-dashboard-border"
                            >
                                {generatingInvite ? <RefreshCw className="animate-spin" size={14} /> : <UserPlus size={14} />}
                                Generate Invite Code
                            </button>
                        </div>

                        {/* Invite Code */}
                        {inviteLink && (
                            <div className="flex items-center gap-2 p-3 bg-accent-green/10 border border-accent-green/30 rounded-lg">
                                <span className="text-sm text-dashboard-muted whitespace-nowrap">Invite Code:</span>
                                <input
                                    type="text"
                                    value={inviteLink}
                                    readOnly
                                    className="flex-1 bg-transparent text-dashboard-text text-sm font-mono"
                                />
                                <button onClick={copyInviteCode} className="p-2 hover:bg-dashboard-bg rounded" title="Copy Code">
                                    <Copy size={16} className="text-dashboard-text" />
                                </button>
                            </div>
                        )}

                        {teamMembers.length > 0 ? (
                            teamMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-teal rounded-full flex items-center justify-center">
                                            {member.profile.avatar_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={member.profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span className="text-white font-medium text-sm">
                                                    {(member.profile.display_name || 'U').split(' ').map(n => n[0]).join('')}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-dashboard-text">{member.profile.display_name || 'Unknown'}</div>
                                            <div className="text-sm text-dashboard-muted capitalize">{member.role}</div>
                                        </div>
                                    </div>
                                    {member.user_id !== userId && (
                                        <button
                                            onClick={() => handleRemoveMember(member.user_id)}
                                            className="p-2 text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-dashboard-muted">
                                No members yet. Generate an invite link to add workers.
                            </div>
                        )}
                    </div>
                )}

                {teams.length === 0 && !showCreateTeam && (
                    <div className="text-center py-4 text-dashboard-muted">
                        Create your first team to start tracking worker productivity.
                    </div>
                )}
            </section>

            {/* Integrations */}
            <section className="dashboard-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <LinkIcon className="text-primary-blue" size={24} />
                    <div>
                        <h2 className="font-semibold text-dashboard-text text-lg">Integrations</h2>
                        <p className="text-sm text-dashboard-muted">Connect your tools and services</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Jira */}
                    <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0052CC] flex items-center justify-center">
                                <LinkIcon className="text-white" size={18} />
                            </div>
                            <div>
                                <div className="font-medium text-dashboard-text">Jira Cloud</div>
                                <div className={`text-sm ${integrations.jira ? 'text-accent-green' : 'text-dashboard-muted'}`}>
                                    {integrations.jira ? 'Connected' : 'Not connected'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleIntegrate('jira')}
                            disabled={connecting === 'jira'}
                            className={`px-4 py-2 rounded-lg transition-colors ${integrations.jira
                                ? 'bg-dashboard-card border border-dashboard-border text-dashboard-text hover:bg-dashboard-border'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            {connecting === 'jira' ? <RefreshCw className="animate-spin" size={16} /> : integrations.jira ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>

                    {/* Slack */}
                    <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#4A154B] flex items-center justify-center">
                                <MessageSquare className="text-white" size={18} />
                            </div>
                            <div>
                                <div className="font-medium text-dashboard-text">Slack</div>
                                <div className={`text-sm ${integrations.slack ? 'text-accent-green' : 'text-dashboard-muted'}`}>
                                    {integrations.slack ? 'Connected' : 'Not connected'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleIntegrate('slack')}
                            disabled={connecting === 'slack'}
                            className={`px-4 py-2 rounded-lg transition-colors ${integrations.slack
                                ? 'bg-dashboard-card border border-dashboard-border text-dashboard-text hover:bg-dashboard-border'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            {connecting === 'slack' ? <RefreshCw className="animate-spin" size={16} /> : integrations.slack ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Team Template */}
            <section className="dashboard-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Palette className="text-primary-blue" size={24} />
                    <div>
                        <h2 className="font-semibold text-dashboard-text text-lg">Team Template</h2>
                        <p className="text-sm text-dashboard-muted">Customize your dashboard for your team type</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { id: 'general', label: 'General', desc: 'Balanced metrics for any team' },
                        { id: 'engineering', label: 'Engineering', desc: 'Focus on deep work & code review' },
                        { id: 'design', label: 'Design', desc: 'Creative time & iteration cycles' },
                        { id: 'marketing', label: 'Marketing', desc: 'Campaign hours & content output' },
                        { id: 'sales', label: 'Sales', desc: 'Client-facing time & pipeline' },
                        { id: 'operations', label: 'Operations', desc: 'Process efficiency & admin load' },
                        { id: 'content', label: 'Content', desc: 'Writing time & research balance' },
                        { id: 'custom', label: 'Custom', desc: 'Define your own categories' },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setTeamTemplate(t.id);
                                localStorage.setItem('flowsight_team_template', t.id);
                            }}
                            className={`p-4 rounded-lg border text-left transition-all ${
                                teamTemplate === t.id
                                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200'
                                    : 'border-dashboard-border hover:border-slate-300 bg-dashboard-bg'
                            }`}
                        >
                            <div className="font-medium text-dashboard-text text-sm">{t.label}</div>
                            <div className="text-[11px] text-dashboard-muted mt-1">{t.desc}</div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Alert Configuration */}
            <section className="dashboard-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="text-amber-500" size={24} />
                    <div>
                        <h2 className="font-semibold text-dashboard-text text-lg">Alert Thresholds</h2>
                        <p className="text-sm text-dashboard-muted">Configure when alerts are triggered for your team</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                        <div>
                            <div className="font-medium text-dashboard-text">Burnout Risk</div>
                            <div className="text-sm text-dashboard-muted">Alert when a member works more than X hours/day for 3+ days</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={burnoutThreshold}
                                onChange={(e) => setBurnoutThreshold(e.target.value)}
                                className="w-16 px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm text-center"
                                min="6" max="14"
                            />
                            <span className="text-sm text-dashboard-muted">hours</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                        <div>
                            <div className="font-medium text-dashboard-text">Low Activity</div>
                            <div className="text-sm text-dashboard-muted">Alert when a member logs less than X hours for 2+ days</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={lowActivityThreshold}
                                onChange={(e) => setLowActivityThreshold(e.target.value)}
                                className="w-16 px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm text-center"
                                min="1" max="6"
                            />
                            <span className="text-sm text-dashboard-muted">hours</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                        <div>
                            <div className="font-medium text-dashboard-text">Meeting Overload</div>
                            <div className="text-sm text-dashboard-muted">Alert when meetings exceed X% of total time</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={meetingOverloadThreshold}
                                onChange={(e) => setMeetingOverloadThreshold(e.target.value)}
                                className="w-16 px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm text-center"
                                min="20" max="80"
                            />
                            <span className="text-sm text-dashboard-muted">%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notifications & Email Digest */}
            <section className="dashboard-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="text-primary-blue" size={24} />
                    <div>
                        <h2 className="font-semibold text-dashboard-text text-lg">Notifications</h2>
                        <p className="text-sm text-dashboard-muted">Configure alerts and email digests</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                        <div>
                            <div className="font-medium text-dashboard-text">Daily Summary Email</div>
                            <div className="text-sm text-dashboard-muted">Receive a daily digest of team activity</div>
                        </div>
                        <Toggle enabled={dailyEmail} onChange={setDailyEmail} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                        <div>
                            <div className="font-medium text-dashboard-text">Weekly Report</div>
                            <div className="text-sm text-dashboard-muted">Comprehensive weekly productivity report</div>
                        </div>
                        <Toggle enabled={weeklyReport} onChange={setWeeklyReport} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                        <div>
                            <div className="font-medium text-dashboard-text">Smart Alerts</div>
                            <div className="text-sm text-dashboard-muted">Get notified of burnout risk, low activity, and meeting overload</div>
                        </div>
                        <Toggle enabled={realTimeAlerts} onChange={setRealTimeAlerts} />
                    </div>
                </div>

                {/* Email Digest Schedule */}
                {weeklyReport && (
                    <div className="mt-4 p-4 bg-dashboard-bg rounded-lg space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Mail size={16} className="text-primary-blue" />
                            <span className="font-medium text-dashboard-text text-sm">Weekly Digest Schedule</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-dashboard-muted mb-1">Day</label>
                                <select
                                    value={digestDay}
                                    onChange={(e) => setDigestDay(e.target.value)}
                                    className="w-full px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm"
                                >
                                    <option value="monday">Monday</option>
                                    <option value="tuesday">Tuesday</option>
                                    <option value="wednesday">Wednesday</option>
                                    <option value="thursday">Thursday</option>
                                    <option value="friday">Friday</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-dashboard-muted mb-1">Time</label>
                                <input
                                    type="time"
                                    value={digestTime}
                                    onChange={(e) => setDigestTime(e.target.value)}
                                    className="w-full px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-dashboard-muted mb-1">Additional recipients (emails)</label>
                                <input
                                    type="text"
                                    value={digestRecipients}
                                    onChange={(e) => setDigestRecipients(e.target.value)}
                                    placeholder="cto@company.com, hr@company.com"
                                    className="w-full px-3 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Privacy */}
            <section className="dashboard-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="text-primary-blue" size={24} />
                    <div>
                        <h2 className="font-semibold text-dashboard-text text-lg">Privacy & Data</h2>
                        <p className="text-sm text-dashboard-muted">Control how long activity data is retained</p>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-dashboard-bg rounded-lg">
                    <div>
                        <div className="font-medium text-dashboard-text">Activity data retention</div>
                        <div className="text-sm text-dashboard-muted">Older data is automatically deleted. FlowSight never captures screen content.</div>
                    </div>
                    <select
                        value={retention}
                        onChange={(e) => setRetention(e.target.value)}
                        className="px-4 py-2 bg-dashboard-card border border-dashboard-border rounded-lg text-dashboard-text text-sm"
                    >
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                    </select>
                </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                    <Check size={18} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}
