'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    getTeams,
    getTeamActivityReports,
    type Team,
    type ActivityReport,
    type Profile,
} from '@/lib/supabase/queries';
import { META_CATEGORY_CONFIG, getMetaCategory, type MetaCategory } from '@/lib/categories';

interface FeedItem {
    id: string;
    time: string;
    userName: string;
    activity: string;
    category: MetaCategory;
}

export default function ActivityFeed() {
    const supabase = createClient();
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeed = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const teams: Team[] = await getTeams(supabase, user.id);
            if (teams.length === 0) { setLoading(false); return; }

            const todayStr = new Date().toISOString().split('T')[0];
            const reports = await getTeamActivityReports(supabase, teams[0].id, todayStr, 15);

            const feed: FeedItem[] = reports.map((r: ActivityReport & { profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> }) => ({
                id: r.id,
                time: new Date(r.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                userName: r.profile?.display_name || 'Unknown',
                activity: r.description,
                category: getMetaCategory(r.category),
            }));

            setItems(feed);
        } catch (err) {
            console.error('Error fetching activity feed:', err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    if (loading) {
        return (
            <div className="dashboard-card p-6">
                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="animate-spin text-dashboard-muted" size={18} />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-card p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <h3 className="font-semibold text-dashboard-text text-sm uppercase tracking-wider">
                    Recent Activity
                </h3>
            </div>

            {items.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto dark-scrollbar">
                    {items.map((item) => {
                        const config = META_CATEGORY_CONFIG[item.category];
                        return (
                            <div
                                key={item.id}
                                className="flex items-start gap-3 p-2.5 rounded-lg bg-dashboard-bg/50 hover:bg-dashboard-bg transition-colors"
                            >
                                <span className="text-xs font-mono text-dashboard-muted w-11 flex-shrink-0 pt-0.5">
                                    {item.time}
                                </span>
                                <div
                                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                    style={{ backgroundColor: config.color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-dashboard-text">{item.userName}</span>
                                    <span className="text-dashboard-muted mx-1.5 text-xs">·</span>
                                    <span className="text-sm text-dashboard-muted">{item.activity}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-dashboard-muted py-6 text-sm">
                    Activity will appear here as your team works
                </div>
            )}
        </div>
    );
}
