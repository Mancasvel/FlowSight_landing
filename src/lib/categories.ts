import {
    Briefcase, Users, MessageSquare, Video,
    CalendarDays, Search, FileText, Coffee,
} from 'lucide-react';

export type MetaCategory =
    | 'Deep Work'
    | 'Collaboration'
    | 'Communication'
    | 'Meetings'
    | 'Planning'
    | 'Research'
    | 'Administrative'
    | 'Idle';

export const META_CATEGORIES: MetaCategory[] = [
    'Deep Work',
    'Collaboration',
    'Communication',
    'Meetings',
    'Planning',
    'Research',
    'Administrative',
    'Idle',
];

export const META_CATEGORY_CONFIG: Record<MetaCategory, {
    color: string;
    bgLight: string;
    icon: typeof Briefcase;
    label: string;
}> = {
    'Deep Work': { color: '#10B981', bgLight: '#10B98120', icon: Briefcase, label: 'Deep Work' },
    'Collaboration': { color: '#3B82F6', bgLight: '#3B82F620', icon: Users, label: 'Collaboration' },
    'Communication': { color: '#14B8A6', bgLight: '#14B8A620', icon: MessageSquare, label: 'Communication' },
    'Meetings': { color: '#F59E0B', bgLight: '#F59E0B20', icon: Video, label: 'Meetings' },
    'Planning': { color: '#6366F1', bgLight: '#6366F120', icon: CalendarDays, label: 'Planning' },
    'Research': { color: '#A855F7', bgLight: '#A855F720', icon: Search, label: 'Research' },
    'Administrative': { color: '#78716C', bgLight: '#78716C20', icon: FileText, label: 'Administrative' },
    'Idle': { color: '#64748B', bgLight: '#64748B20', icon: Coffee, label: 'Idle' },
};

const CATEGORY_TO_META: Record<string, MetaCategory> = {
    // Engineering
    'Coding': 'Deep Work',
    'Debugging': 'Deep Work',
    'CodeReview': 'Collaboration',
    'Testing': 'Deep Work',
    'DevOps': 'Deep Work',
    'Database': 'Deep Work',

    // Design
    'Design': 'Deep Work',
    'Prototyping': 'Deep Work',
    'UserResearch': 'Research',
    'UXDesign': 'Deep Work',

    // Content
    'Writing': 'Deep Work',
    'Editing': 'Deep Work',
    'ContentCreation': 'Deep Work',
    'Copywriting': 'Deep Work',

    // Marketing
    'CampaignManagement': 'Deep Work',
    'Analytics': 'Research',
    'SEO': 'Deep Work',
    'SocialMedia': 'Deep Work',

    // Sales
    'ClientCalls': 'Meetings',
    'CRM': 'Deep Work',
    'Proposals': 'Deep Work',
    'Prospecting': 'Deep Work',

    // Universal
    'Documentation': 'Deep Work',
    'Planning': 'Planning',
    'Meeting': 'Meetings',
    'Communication': 'Communication',
    'Research': 'Research',
    'Learning': 'Research',
    'Sales': 'Deep Work',
    'Admin': 'Administrative',
    'Browsing': 'Research',
    'Idle': 'Idle',
    'General': 'Deep Work',

    // Direct meta-category names (in case AI sends them)
    'Deep Work': 'Deep Work',
    'Focus Work': 'Deep Work',
    'Collaboration': 'Collaboration',
    'Meetings': 'Meetings',
    'Administrative': 'Administrative',
};

export function getMetaCategory(category: string): MetaCategory {
    return CATEGORY_TO_META[category] || 'Deep Work';
}

export function getCategoryColor(category: string): string {
    return META_CATEGORY_CONFIG[getMetaCategory(category)].color;
}

export function getCategoryIcon(category: string) {
    return META_CATEGORY_CONFIG[getMetaCategory(category)].icon;
}

export function aggregateToMeta(breakdown: Record<string, number>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [category, seconds] of Object.entries(breakdown)) {
        const meta = getMetaCategory(category);
        result[meta] = (result[meta] || 0) + seconds;
    }
    return result;
}

export function getTopCategories(
    breakdown: Record<string, number>,
    limit = 6
): { name: string; seconds: number; color: string; percent: number }[] {
    const metaBreakdown = aggregateToMeta(breakdown);
    const total = Object.values(metaBreakdown).reduce((a, b) => a + b, 0);

    return Object.entries(metaBreakdown)
        .map(([name, seconds]) => ({
            name,
            seconds,
            color: META_CATEGORY_CONFIG[name as MetaCategory]?.color || '#94A3B8',
            percent: total > 0 ? Math.round((seconds / total) * 100) : 0,
        }))
        .sort((a, b) => b.seconds - a.seconds)
        .slice(0, limit);
}
