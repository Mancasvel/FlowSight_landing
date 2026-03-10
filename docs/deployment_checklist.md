# Deployment Checklist

To ensure FlowSight works correctly in production (https://flowsight.site), please verify the following settings:

## 1. Environment Variables (Vercel / Hosting)

Ensure these variables are set in your deployment platform's settings:

```env
NEXT_PUBLIC_APP_URL=https://flowsight.site
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# ... other keys
```

## 2. Supabase Settings (Site URL vs Redirect URLs)

This is the key to making **BOTH** Production and Localhost work.

### Step-by-Step Configuration:

1.  **Site URL** (This field only allows ONE URL):
    - Set this to your **Production URL**: `https://flowsight.site`
    - *Why?* This is the default if no specific URL is requested. For production users, this must be the real site.

2.  **Redirect URLs** (This list allows MULTIPLE URLs):
    - You must add **ALL** the URLs where you want login to work.
    - Add: `https://flowsight.site/auth/callback`
    - Add: `http://localhost:3000/auth/callback` (**CRITICAL FOR LOCAL DEV**)
    - Add: `https://flowsight.site/api/auth/jira/callback`
    - Add: `http://localhost:3000/api/auth/jira/callback`

### How it works:
- When you develop locally, your app tells Supabase: *"Please redirect me back to `http://localhost:3000`"*.
- Supabase checks the **Redirect URLs** list.
- If `localhost` is in the list, it says **"OK"** and redirects you to localhost.
- The **Site URL** setting is ignored in this case because a valid redirect URL was provided.

**Summary:** Set Site URL to Prod, but keep Localhost in the Redirect URLs list. Both will work.

## 3. Verify Jira / Atlassian Developer Console (if used)

1.  Go to your App settings.
2.  Add `https://flowsight.site/api/auth/jira/callback` to the **Callback URLs**.
