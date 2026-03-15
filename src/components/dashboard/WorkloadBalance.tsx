'use client';

interface Member {
    id: string;
    name: string;
    avatar_url: string | null;
    hours: number;
    isOnline: boolean;
}

interface WorkloadBalanceProps {
    members: Member[];
    onMemberClick?: (id: string) => void;
}

function getBarColor(hours: number, avg: number): string {
    if (avg === 0) return '#6366F1';
    const ratio = hours / avg;
    if (ratio > 1.3) return '#F59E0B';
    if (ratio < 0.5 && hours > 0) return '#A1A1AA';
    return '#22C55E';
}

export default function WorkloadBalance({ members, onMemberClick }: WorkloadBalanceProps) {
    const maxHours = Math.max(...members.map(m => m.hours), 1);
    const totalHours = members.reduce((sum, m) => sum + m.hours, 0);
    const avg = members.length > 0 ? totalHours / members.length : 0;
    const sorted = [...members].sort((a, b) => b.hours - a.hours);

    return (
        <div className="space-y-1">
            {sorted.map(member => {
                const widthPct = (member.hours / maxHours) * 100;
                const barColor = getBarColor(member.hours, avg);

                return (
                    <button
                        key={member.id}
                        onClick={() => onMemberClick?.(member.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                            hover:bg-zinc-50 transition-all duration-150 group text-left"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-zinc-100
                                flex items-center justify-center overflow-hidden ring-2 ring-white">
                                {member.avatar_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={member.avatar_url}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-zinc-500 text-[11px] font-semibold">
                                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </span>
                                )}
                            </div>
                            {member.isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5
                                    bg-emerald-400 rounded-full border-2 border-white" />
                            )}
                        </div>

                        <span className="text-sm text-zinc-700 w-20 truncate flex-shrink-0 font-medium">
                            {member.name.split(' ')[0]}
                        </span>

                        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden relative">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${Math.max(widthPct, 3)}%`,
                                    backgroundColor: barColor,
                                }}
                            />
                            {avg > 0 && (
                                <div
                                    className="absolute top-0 bottom-0 w-px bg-zinc-300"
                                    style={{ left: `${(avg / maxHours) * 100}%` }}
                                    title={`Team avg: ${avg.toFixed(1)}h`}
                                />
                            )}
                        </div>

                        <span className="text-sm text-zinc-500 w-12 text-right flex-shrink-0 tabular-nums">
                            {member.hours}h
                        </span>
                    </button>
                );
            })}

            {members.length > 0 && (
                <div className="flex items-center gap-4 pt-3 px-3 border-t border-zinc-100 mt-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[11px] text-zinc-400">Balanced</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-[11px] text-zinc-400">High load</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-px h-2.5 bg-zinc-300" />
                        <span className="text-[11px] text-zinc-400">Avg ({avg.toFixed(1)}h)</span>
                    </div>
                </div>
            )}
        </div>
    );
}
