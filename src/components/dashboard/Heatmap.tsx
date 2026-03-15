'use client';

import { useState } from 'react';

interface HeatmapProps {
    data: Record<string, Record<string, number>>;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

function getIntensity(value: number, max: number): number {
    if (max === 0) return 0;
    return Math.min(value / max, 1);
}

function intensityToColor(intensity: number): string {
    if (intensity === 0) return '#F4F4F5';
    if (intensity < 0.25) return '#E0E7FF';
    if (intensity < 0.5) return '#C7D2FE';
    if (intensity < 0.75) return '#818CF8';
    return '#6366F1';
}

export default function Heatmap({ data }: HeatmapProps) {
    const [tooltip, setTooltip] = useState<{
        day: string; hour: number; value: number; x: number; y: number;
    } | null>(null);

    let maxVal = 0;
    for (const day of DAYS) {
        for (const hour of HOURS) {
            const val = data[day]?.[String(hour)] || 0;
            if (val > maxVal) maxVal = val;
        }
    }

    return (
        <div className="relative">
            <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `36px repeat(${HOURS.length}, 1fr)` }}
            >
                <div />
                {HOURS.map(h => (
                    <div key={h} className="text-center text-[10px] text-zinc-400 pb-1.5 font-medium">
                        {h > 12 ? `${h - 12}p` : h === 12 ? '12p' : `${h}a`}
                    </div>
                ))}

                {DAYS.map(day => (
                    <div key={day} className="contents">
                        <div className="text-[11px] text-zinc-400 font-medium flex items-center pr-2 justify-end">
                            {day}
                        </div>
                        {HOURS.map(hour => {
                            const val = data[day]?.[String(hour)] || 0;
                            const intensity = getIntensity(val, maxVal);

                            return (
                                <div
                                    key={`${day}-${hour}`}
                                    className="aspect-[2/1] rounded-[5px] cursor-pointer transition-all duration-150
                                        hover:scale-110 hover:z-10 relative"
                                    style={{ backgroundColor: intensityToColor(intensity) }}
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

            <div className="flex items-center justify-end gap-1.5 mt-4">
                <span className="text-[10px] text-zinc-400 mr-1">Less</span>
                {[0, 0.25, 0.5, 0.75, 1].map((i) => (
                    <div
                        key={i}
                        className="w-3 h-3 rounded-[3px]"
                        style={{ backgroundColor: intensityToColor(i) }}
                    />
                ))}
                <span className="text-[10px] text-zinc-400 ml-1">More</span>
            </div>

            {tooltip && (
                <div
                    className="fixed z-50 px-3 py-2 bg-white rounded-xl shadow-elevated
                        pointer-events-none border border-zinc-100"
                    style={{ left: tooltip.x, top: tooltip.y - 44 }}
                >
                    <div className="text-xs font-medium text-zinc-800">
                        {tooltip.day} {tooltip.hour > 12 ? `${tooltip.hour - 12}:00 PM` : `${tooltip.hour}:00 AM`}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                        {Math.round(tooltip.value / 60)}m of activity
                    </div>
                </div>
            )}
        </div>
    );
}
