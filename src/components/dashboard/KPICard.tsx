'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';
import SparkLine from './SparkLine';

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

const colorClasses = {
    blue: 'from-primary-blue/20 to-primary-blue/5 border-primary-blue/30',
    green: 'from-accent-green/20 to-accent-green/5 border-accent-green/30',
    orange: 'from-accent-orange/20 to-accent-orange/5 border-accent-orange/30',
    purple: 'from-category-design/20 to-category-design/5 border-category-design/30',
};

const iconColorClasses = {
    blue: 'text-primary-blue',
    green: 'text-accent-green',
    orange: 'text-accent-orange',
    purple: 'text-category-design',
};

const sparkColors = {
    blue: '#3B82F6',
    green: '#10B981',
    orange: '#F59E0B',
    purple: '#8B5CF6',
};

export default function KPICard({
    title,
    value,
    subtitle,
    change,
    icon,
    color = 'blue',
    sparkData,
    sparkColor,
}: KPICardProps) {
    const isPositive = change !== undefined && change >= 0;
    const resolvedSparkColor = sparkColor || sparkColors[color];

    return (
        <div className={`dashboard-card p-5 bg-gradient-to-br ${colorClasses[color]}`}>
            <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-dashboard-muted uppercase tracking-wider">
                    {title}
                </span>
                {icon && (
                    <span className={iconColorClasses[color]}>
                        {icon}
                    </span>
                )}
            </div>

            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <div className="text-2xl font-bold text-dashboard-text">
                        {value}
                    </div>

                    {(subtitle || change !== undefined) && (
                        <div className="flex items-center gap-2 text-sm">
                            {change !== undefined && change !== 0 && (
                                <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(change)}%
                                </span>
                            )}
                            {subtitle && (
                                <span className="text-xs text-dashboard-muted">{subtitle}</span>
                            )}
                        </div>
                    )}
                </div>

                {sparkData && sparkData.length >= 2 && (
                    <SparkLine
                        data={sparkData}
                        color={resolvedSparkColor}
                        width={72}
                        height={28}
                        showDots
                    />
                )}
            </div>
        </div>
    );
}
