import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface JiraTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

interface JiraCloudResource {
    id: string;
    url: string;
    name: string;
    scopes: string[];
}

interface JiraUserResponse {
    account_id: string;
    email: string;
    name: string;
    picture: string;
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Parse returnTo from state (format: random_uuid:returnTo or just random_uuid)
    const returnTo = state?.includes(':') ? state.split(':')[1] : null;

    // Determine redirect destination based on returnTo
    const successRedirect = returnTo === 'settings'
        ? `${origin}/dashboard/settings?jira=connected`
        : `${origin}/dashboard`;
    const errorRedirect = returnTo === 'settings'
        ? `${origin}/dashboard/settings?error=`
        : `${origin}/login?error=`;

    // Handle OAuth errors
    if (error) {
        console.error('Jira OAuth error:', error);
        return NextResponse.redirect(`${errorRedirect}jira_auth_failed`);
    }

    if (!code) {
        return NextResponse.redirect(`${errorRedirect}no_code`);
    }

    try {
        // Use the base redirect URI (must match exactly what's registered in Atlassian)
        const redirectUri = `${origin}/api/auth/jira/callback`;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://auth.atlassian.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
                client_secret: process.env.JIRA_CLIENT_SECRET,
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('Token exchange failed:', errorData);
            return NextResponse.redirect(`${errorRedirect}token_exchange_failed`);
        }

        const tokens: JiraTokenResponse = await tokenResponse.json();

        // Get accessible Jira cloud resources
        const resourcesResponse = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`,
                'Accept': 'application/json',
            },
        });

        if (!resourcesResponse.ok) {
            console.error('Failed to get Jira resources');
            return NextResponse.redirect(`${errorRedirect}jira_resources_failed`);
        }

        const resources: JiraCloudResource[] = await resourcesResponse.json();
        const cloudId = resources.length > 0 ? resources[0].id : null;

        // Get user info from Jira
        const userResponse = await fetch('https://api.atlassian.com/me', {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`,
                'Accept': 'application/json',
            },
        });

        if (!userResponse.ok) {
            console.error('Failed to get Jira user info');
            return NextResponse.redirect(`${errorRedirect}jira_user_failed`);
        }

        const jiraUser: JiraUserResponse = await userResponse.json();

        // Create Supabase client
        const supabase = await createClient();

        // Check if user is already logged in (coming from Settings)
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (currentUser) {
            // User is logged in - just update their Jira tokens
            await supabase
                .from('profiles')
                .update({
                    jira_tokens: {
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                        expires_at: Date.now() + tokens.expires_in * 1000,
                    },
                    jira_cloud_id: cloudId,
                })
                .eq('id', currentUser.id);

            return NextResponse.redirect(successRedirect);
        }

        // User is not logged in - this is a login flow
        // Check if user exists by email
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', jiraUser.email)
            .single();

        if (existingProfile) {
            // Update existing profile with Jira tokens
            await supabase
                .from('profiles')
                .update({
                    jira_tokens: {
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                        expires_at: Date.now() + tokens.expires_in * 1000,
                    },
                    jira_cloud_id: cloudId,
                })
                .eq('id', existingProfile.id);

            // Store Jira auth info in a secure cookie for session validation
            const response = NextResponse.redirect(successRedirect);
            response.cookies.set('jira_auth', JSON.stringify({
                profileId: existingProfile.id,
                accessToken: tokens.access_token,
            }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return response;
        } else {
            // Create new profile for Jira user
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    display_name: jiraUser.name,
                    email: jiraUser.email,
                    avatar_url: jiraUser.picture,
                    role: 'pm',
                    jira_tokens: {
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                        expires_at: Date.now() + tokens.expires_in * 1000,
                    },
                    jira_cloud_id: cloudId,
                })
                .select()
                .single();

            if (createError) {
                console.error('Failed to create profile:', createError);
                return NextResponse.redirect(`${errorRedirect}profile_creation_failed`);
            }

            const response = NextResponse.redirect(successRedirect);
            response.cookies.set('jira_auth', JSON.stringify({
                profileId: newProfile.id,
                accessToken: tokens.access_token,
            }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });

            return response;
        }
    } catch (err) {
        console.error('Jira OAuth error:', err);
        return NextResponse.redirect(`${errorRedirect}jira_auth_failed`);
    }
}
