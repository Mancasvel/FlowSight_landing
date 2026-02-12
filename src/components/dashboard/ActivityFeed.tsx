'use client';

import { useState } from 'react';
import { Pause, Play, Radio } from 'lucide-react';
import { activityFeed } from '@/lib/mockData';

const categoryColors: Record<string, string> = {
    Coding: 'bg-category-coding',
    Design: 'bg-category-design',
    Communication: 'bg-category-communication',
    Meeting: 'bg-category-meeting',
    Browsing: 'bg-category-browsing',
    Other: 'bg-category-other',
};

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

export default function ActivityFeed() {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div className="dashboard-card p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Radio className="text-accent-red animate-pulse" size={18} />
                    <h3 className="font-semibold text-dashboard-text">LIVE FEED</h3>
                </div>
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                     bg-dashboard-bg border border-dashboard-border
                     text-dashboard-muted hover:text-dashboard-text
                     transition-colors text-sm"
                >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    {isPaused ? 'Resume' : 'Pause'}
                </button>
            </div>

            {/* Feed Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto dark-scrollbar">
                {activityFeed.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 p-3 rounded-lg bg-dashboard-bg/50 
                       hover:bg-dashboard-bg transition-colors"
                    >
                        {/* Time */}
                        <span className="text-sm font-mono text-dashboard-muted w-12 flex-shrink-0">
                            {formatTime(item.timestamp)}
                        </span>

                        {/* Category Indicator */}
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${categoryColors[item.category] || 'bg-category-other'}`} />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <span className="font-medium text-dashboard-text">{item.userName}</span>
                            <span className="text-dashboard-muted mx-2">·</span>
                            <span className="text-dashboard-muted">{item.activity}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
