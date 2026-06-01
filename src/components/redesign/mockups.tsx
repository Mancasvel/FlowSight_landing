"use client";

import { motion } from "framer-motion";
import { BarChart3, CheckSquare, FileText, Flame, Layers } from "lucide-react";

/** Light-mode chat-style list of focus sessions / insights (mirrors Anytype chat list). */
export function FocusListMockup() {
    const rows = [
        { initials: "DW", tone: "from-cyan-400 to-teal-400", title: "Deep work block", meta: "1h 48m · no interruptions" },
        { initials: "FG", tone: "from-violet-400 to-indigo-400", title: "Figma — landing redesign", meta: "Flow 94% · 2 context switches" },
        { initials: "SY", tone: "from-amber-400 to-orange-400", title: "Weekly sync", meta: "Meeting load 22%" },
        { initials: "AI", tone: "from-rose-400 to-pink-400", title: "FlowSight suggestion", meta: "Protect 9–11am tomorrow" },
        { initials: "WR", tone: "from-emerald-400 to-green-400", title: "Cognitive report ready", meta: "Review before sharing" },
    ];
    return (
        <div className="w-full space-y-2.5">
            {rows.map((r, i) => (
                <motion.div
                    key={r.title}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${r.tone} text-[11px] font-bold text-white`}>
                        {r.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-secondary-navy">{r.title}</p>
                        <p className="truncate text-xs text-slate-400">{r.meta}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

/** Light-mode document preview (mirrors Anytype "My Idea" doc card). */
export function ReportDocMockup() {
    return (
        <div className="mx-auto w-44 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <FileText className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-sm font-semibold text-secondary-navy">Weekly report</p>
            <p className="mb-3 text-[11px] text-slate-400">Cognitive summary</p>
            <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded bg-slate-200" />
                <div className="h-1.5 w-4/5 rounded bg-slate-200" />
                <div className="h-1.5 w-full rounded bg-slate-200" />
                <div className="h-1.5 w-2/3 rounded bg-slate-100" />
            </div>
        </div>
    );
}

/** Light-mode database-style list (mirrors Anytype Pages/Lists/Tasks rows). */
export function MetricsDbMockup() {
    const rows = [
        { icon: <Flame className="h-4 w-4 text-orange-500" />, label: "Focus streaks" },
        { icon: <BarChart3 className="h-4 w-4 text-cyan-500" />, label: "Deep work hours" },
        { icon: <CheckSquare className="h-4 w-4 text-emerald-500" />, label: "Interruptions" },
        { icon: <Layers className="h-4 w-4 text-violet-500" />, label: "Context switches" },
    ];
    return (
        <div className="mx-auto w-full max-w-xs space-y-2">
            {rows.map((r, i) => (
                <motion.div
                    key={r.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                >
                    <div className="flex items-center gap-2.5">
                        {r.icon}
                        <span className="text-sm font-medium text-secondary-navy">{r.label}</span>
                    </div>
                    <span className="text-slate-300">›</span>
                </motion.div>
            ))}
        </div>
    );
}
