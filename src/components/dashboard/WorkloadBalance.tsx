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
    if (avg === 0) return '#3B82F6';
    const ratio = hours / avg;
    if (ratio > 1.3) return '#F59E0B'; // Possibly overloaded
    if (ratio < 0.5 && hours > 0) return '#94A3B8'; // Low activity
    return '#10B981'; // Balanced
}

export default function WorkloadBalance({ members, onMemberClick }: WorkloadBalanceProps) {
    const maxHours = Math.max(...members.map(m => m.hours), 1);
    const totalHours = members.reduce((sum, m) => sum + m.hours, 0);
    const avg = members.length > 0 ? totalHours / members.length : 0;

    const sorted = [...members].sort((a, b) => b.hours - a.hours);

    return (
        <div className="space-y-2">
            {sorted.map(member => {
                const widthPct = (member.hours / maxHours) * 100;
                const barColor = getBarColor(member.hours, avg);

                return (
                    <button
                        key={member.id}
                        onClick={() => onMemberClick?.(member.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-dashboard-bg/50 transition-colors group text-left"
                    >
                        {/* Avatar */}
                        <div className="w-7 h-7 bg-gradient-to-br from-primary-blue to-primary-teal rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                            {member.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white text-[10px] font-semibold">
                                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                            )}
                            {member.isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-green rounded-full border-[1.5px] border-dashboard-card" />
                            )}
                        </div>

                        {/* Name */}
                        <span className="text-sm text-dashboard-text w-24 truncate flex-shrink-0 group-hover:text-white transition-colors">
                            {member.name.split(' ')[0]}
                        </span>

                        {/* Bar */}
                        <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${Math.max(widthPct, 2)}%`, backgroundColor: barColor }}
                            />
                            {avg > 0 && (
                                <div
                                    className="absolute top-0 bottom-0 w-[2px] bg-slate-400/50"
                                    style={{ left: `${(avg / maxHours) * 100}%` }}
                                    title={`Team avg: ${avg.toFixed(1)}h`}
                                />
                            )}
                        </div>

                        {/* Hours */}
                        <span className="text-sm font-mono text-dashboard-muted w-10 text-right flex-shrink-0">
                            {member.hours}h
                        </span>
                    </button>
                );
            })}

            {/* Legend */}
            {members.length > 0 && (
                <div className="flex items-center gap-4 pt-2 px-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
                        <span className="text-[10px] text-dashboard-muted">Balanced</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
                        <span className="text-[10px] text-dashboard-muted">High load</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-[2px] h-2.5 bg-slate-400/50" />
                        <span className="text-[10px] text-dashboard-muted">Team avg ({avg.toFixed(1)}h)</span>
                    </div>
                </div>
            )}
        </div>
    );
}
