'use client';

import { useState } from 'react';

interface HeatmapProps {
    data: Record<string, Record<string, number>>;
    colorScale?: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8AM to 7PM

function getIntensity(value: number, max: number): number {
    if (max === 0) return 0;
    return Math.min(value / max, 1);
}

function intensityToColor(intensity: number, hue: string): string {
    if (intensity === 0) return '#F1F5F9';
    const alpha = 0.2 + intensity * 0.8;
    if (hue === 'green') return `rgba(16, 185, 129, ${alpha})`;
    if (hue === 'blue') return `rgba(59, 130, 246, ${alpha})`;
    return `rgba(16, 185, 129, ${alpha})`;
}

export default function Heatmap({ data, colorScale = 'green' }: HeatmapProps) {
    const [tooltip, setTooltip] = useState<{ day: string; hour: number; value: number; x: number; y: number } | null>(null);

    let maxVal = 0;
    for (const day of DAYS) {
        for (const hour of HOURS) {
            const val = data[day]?.[String(hour)] || 0;
            if (val > maxVal) maxVal = val;
        }
    }

    return (
        <div className="relative">
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: `40px repeat(${HOURS.length}, 1fr)` }}>
                {/* Hour headers */}
                <div />
                {HOURS.map(h => (
                    <div key={h} className="text-center text-[10px] text-dashboard-muted pb-1">
                        {h > 12 ? `${h - 12}p` : h === 12 ? '12p' : `${h}a`}
                    </div>
                ))}

                {/* Rows */}
                {DAYS.map(day => (
                    <div key={day} className="contents">
                        <div className="text-[11px] text-dashboard-muted flex items-center pr-2 justify-end">
                            {day}
                        </div>
                        {HOURS.map(hour => {
                            const val = data[day]?.[String(hour)] || 0;
                            const intensity = getIntensity(val, maxVal);

                            return (
                                <div
                                    key={`${day}-${hour}`}
                                    className="aspect-[2/1] rounded-sm cursor-pointer transition-transform hover:scale-110 hover:z-10 relative"
                                    style={{ backgroundColor: intensityToColor(intensity, colorScale) }}
                                    onMouseEnter={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setTooltip({ day, hour, value: val, x: rect.left, y: rect.top });
                                    }}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3">
                <span className="text-[10px] text-dashboard-muted">Less</span>
                {[0, 0.25, 0.5, 0.75, 1].map((i) => (
                    <div
                        key={i}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: intensityToColor(i, colorScale) }}
                    />
                ))}
                <span className="text-[10px] text-dashboard-muted">More</span>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-lg pointer-events-none"
                    style={{ left: tooltip.x, top: tooltip.y - 40 }}
                >
                    <div className="text-xs text-dashboard-text font-medium">
                        {tooltip.day} {tooltip.hour > 12 ? `${tooltip.hour - 12}:00 PM` : `${tooltip.hour}:00 AM`}
                    </div>
                    <div className="text-xs text-dashboard-muted">
                        {Math.round(tooltip.value / 60)}m of activity
                    </div>
                </div>
            )}
        </div>
    );
}
