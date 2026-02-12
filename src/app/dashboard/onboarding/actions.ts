'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createFirstTeam(formData: FormData) {
    const name = formData.get('name') as string;
    const jiraProjectKey = formData.get('jiraProjectKey') as string | null;

    if (!name || name.trim() === '') throw new Error('Team name is required');

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('Unauthorized');
    }

    // Get active license
    const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_active', true)
        .single();

    if (licenseError || !license) {
        throw new Error('No active license found. Please purchase a plan first.');
    }

    // Create team
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
            name,
            owner_id: user.id,
            license_id: license.id,
            jira_project_key: jiraProjectKey || null,
        })
        .select()
        .single();

    if (teamError) {
        console.error('Error creating team:', teamError);
        throw new Error(`Failed to create team: ${teamError.message}`);
    }

    // Add owner as admin
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'admin',
        });

    if (memberError) {
        console.error('Error adding team member:', memberError);
        // In a real app, we might want to delete the team here to rollback
        throw new Error(`Failed to add member to team: ${memberError.message}`);
    }

    redirect(`/dashboard/team/${team.id}`);
}
