import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { createFirstTeam } from './actions';
import { Rocket, Building2 } from 'lucide-react';
import Link from 'next/link';

export default async function OnboardingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Check if user already has teams
    const { data: teams } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

    if (teams && teams.length > 0) {
        redirect('/dashboard');
    }

    // Get active license
    const { data: license } = await supabase
        .from('licenses')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_active', true)
        .single();

    if (!license) {
        // If no active license, redirect to pricing
        redirect('/dashboard/pricing');
    }

    return (
        <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-dashboard-card border border-dashboard-border rounded-xl shadow-2xl p-8 space-y-8">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-teal rounded-2xl flex items-center justify-center shadow-lg shadow-primary-blue/20">
                        <Rocket className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-dashboard-text">
                        Welcome to FlowSight!
                    </h1>
                    <p className="text-dashboard-muted">
                        Let's set up your first workspace to get started.
                    </p>
                </div>

                <div className="bg-dashboard-bg/50 border border-dashboard-border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-dashboard-muted">Current Plan</span>
                        <span className="text-dashboard-text font-medium capitalize flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-green"></span>
                            {license.plan_type}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-dashboard-muted">Included Seats</span>
                        <span className="text-dashboard-text font-medium">{license.max_members} members</span>
                    </div>
                </div>

                <form action={createFirstTeam} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-dashboard-text block">
                            Workspace Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building2 className="text-dashboard-muted w-5 h-5" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder="e.g. Acme Corp Engineering"
                                className="w-full pl-10 pr-4 py-3 bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-text placeholder-dashboard-muted focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="jiraProjectKey" className="text-sm font-medium text-dashboard-text block">
                            Jira Project Key <span className="text-dashboard-muted font-normal">(Optional)</span>
                        </label>
                        <input
                            id="jiraProjectKey"
                            name="jiraProjectKey"
                            type="text"
                            placeholder="e.g. PROJ"
                            className="w-full px-4 py-3 bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-text placeholder-dashboard-muted focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all uppercase"
                        />
                        <p className="text-xs text-dashboard-muted">
                            Link your Jira project now or do it later in settings.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-primary-blue to-primary-teal text-white hover:opacity-90 transition-all shadow-lg shadow-primary-blue/20 flex items-center justify-center gap-2"
                    >
                        Create Workspace
                    </button>
                </form>
            </div>
        </div>
    );
}
