'use client';

import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { ReactNode } from 'react';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: number;
    icon?: ReactNode;
    color?: 'blue' | 'green' | 'orange' | 'purple';
    sparkData?: number[];
    sparkColor?: string;
}

const colorConfig = {
    blue: {
        iconBg: 'bg-indigo-50',
        iconText: 'text-indigo-500',
    },
    green: {
        iconBg: 'bg-emerald-50',
        iconText: 'text-emerald-500',
    },
    orange: {
        iconBg: 'bg-amber-50',
        iconText: 'text-amber-500',
    },
    purple: {
        iconBg: 'bg-violet-50',
        iconText: 'text-violet-500',
    },
};

export default function KPICard({
    title,
    value,
    subtitle,
    change,
    icon,
    color = 'blue',
}: KPICardProps) {
    const config = colorConfig[color];
    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    return (
        <div className="bg-white rounded-2xl px-5 py-5 shadow-card hover:shadow-card-hover
            transition-shadow duration-200 relative group">
            <button
                className="absolute top-4 right-4 p-1 rounded-lg text-zinc-300
                    hover:text-zinc-500 hover:bg-zinc-50 opacity-0 group-hover:opacity-100
                    transition-all duration-150"
                aria-label="More options"
            >
                <MoreHorizontal size={16} />
            </button>

            <div className="flex items-center gap-4">
                {icon && (
                    <div className={`w-12 h-12 rounded-2xl ${config.iconBg} ${config.iconText}
                        flex items-center justify-center flex-shrink-0`}>
                        {icon}
                    </div>
                )}
                <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[24px] font-bold text-zinc-900 leading-none tracking-tight tabular-nums">
                            {value}
                        </span>
                        {change !== undefined && change !== 0 && (
                            <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold
                                ${isPositive ? 'text-emerald-500' : ''}
                                ${isNegative ? 'text-red-500' : ''}`}>
                                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {Math.abs(change)}%
                            </span>
                        )}
                    </div>
                    <span className="text-[13px] text-zinc-400 mt-1.5 block leading-none">
                        {title}
                    </span>
                    {subtitle && (
                        <span className="text-[11px] text-zinc-300 mt-0.5 block">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
