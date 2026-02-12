import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: number;
    icon?: ReactNode;
    color?: 'blue' | 'green' | 'orange' | 'purple';
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

export default function KPICard({
    title,
    value,
    subtitle,
    change,
    icon,
    color = 'blue'
}: KPICardProps) {
    const isPositive = change !== undefined && change >= 0;

    return (
        <div className={`dashboard-card p-6 bg-gradient-to-br ${colorClasses[color]}`}>
            <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-dashboard-muted uppercase tracking-wide">
                    {title}
                </span>
                {icon && (
                    <span className={iconColorClasses[color]}>
                        {icon}
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <div className="text-3xl font-bold text-dashboard-text">
                    {value}
                </div>

                {(subtitle || change !== undefined) && (
                    <div className="flex items-center gap-2 text-sm">
                        {change !== undefined && (
                            <span className={`flex items-center gap-1 ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {Math.abs(change)}%
                            </span>
                        )}
                        {subtitle && (
                            <span className="text-dashboard-muted">{subtitle}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
