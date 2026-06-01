"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarDays, Check, ChevronDown, Folder, Globe, Hourglass, Mail, Minus, Pause, Square, Target, X } from "lucide-react";

const SCREEN_MS = 4800;
/** Every screen renders at exactly this height so the frame never resizes. */
const SCREEN_HEIGHT = 480;
const RING_R = 78;
const RING_C = 2 * Math.PI * RING_R;

/** Window chrome shared by every app screen (mirrors the desktop app titlebar). */
function AppChrome() {
    return (
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-2.5">
            <div className="text-left leading-tight">
                <p className="text-xs font-bold text-secondary-navy">FlowSight</p>
                <p className="text-[8px] text-slate-400">Understand your own Workflows</p>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300" aria-hidden>
                <Minus className="h-3 w-3" />
                <Square className="h-2.5 w-2.5" />
                <X className="h-3 w-3" />
            </div>
        </div>
    );
}

/** Fixed-size shell: identical height + padding for every screen, so rotation never jumps. */
function ScreenShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col bg-slate-50/60" style={{ height: SCREEN_HEIGHT }}>
            <AppChrome />
            <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3.5 py-3">{children}</div>
        </div>
    );
}

/** Screen 1 — focus timer with daily-goal ring and current task. */
export function TimerScreen() {
    const pct = 32;
    return (
        <ScreenShell>
            <p className="text-left text-xs font-medium text-slate-400">Good morning!</p>

            <div className="flex flex-col items-center justify-center py-1">
                <div className="relative h-40 w-40">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180" aria-hidden>
                        <circle cx="90" cy="90" r={RING_R} fill="none" stroke="#eef2f7" strokeWidth="12" />
                        <circle
                            cx="90"
                            cy="90"
                            r={RING_R}
                            fill="none"
                            stroke="#7c3aed"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={RING_C}
                            strokeDashoffset={RING_C * (1 - pct / 100)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-slate-400">8 hour daily goal</span>
                        <span className="text-2xl font-bold tracking-tight text-secondary-navy tabular-nums">2:34:15</span>
                        <span className="mt-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                            <Pause className="h-3.5 w-3.5 text-slate-500" />
                        </span>
                    </div>
                </div>
                <p className="mt-1.5 text-xs font-bold text-secondary-navy">4 days Streak</p>
            </div>

            <div className="flex flex-1 flex-col justify-end gap-2">
                <div className="rounded-xl bg-white p-2.5 shadow-sm">
                    <p className="mb-1 text-left text-xs font-semibold text-secondary-navy">Daily goal</p>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600">
                        8 hours
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                </div>

                <div className="rounded-xl bg-white p-2.5 shadow-sm">
                    <p className="mb-1 text-left text-xs font-semibold text-secondary-navy">Current Task</p>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600">
                        <span className="truncate">FS-138 — Dashboard refactor</span>
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-secondary-navy">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-primary-blue">
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </span>
                        Sync time to Jira
                    </div>
                </div>
            </div>
        </ScreenShell>
    );
}

/** Screen 2 — weekly summary with goal ring, task breakdown, and highlights. */
export function SummaryScreen() {
    const days = [
        { d: "M", done: true },
        { d: "T", done: true },
        { d: "W", done: true },
        { d: "T", done: true },
        { d: "F", done: true },
        { d: "S", done: false },
        { d: "S", done: false },
    ];
    const tasks = [
        { pct: "38%", label: "Coding", time: "120m", tone: "bg-violet-500", w: "70%" },
        { pct: "29%", label: "Design", time: "90m", tone: "bg-pink-500", w: "52%" },
        { pct: "5%", label: "Browsing", time: "15m", tone: "bg-blue-500", w: "12%" },
    ];
    return (
        <ScreenShell>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight text-secondary-navy">Summary</h3>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100">
                    <CalendarDays className="h-3.5 w-3.5 text-violet-600" />
                </span>
            </div>
            <p className="-mt-1 text-center text-[11px] text-slate-400">May 22</p>

            <div className="flex items-center justify-between">
                {days.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-semibold text-slate-400">{day.d}</span>
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full ${day.done ? "bg-violet-600" : "border border-slate-200 bg-white"}`}>
                            {day.done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </span>
                    </div>
                ))}
            </div>

            <div className="rounded-xl bg-white p-3 shadow-sm">
                <div className="mb-2.5 flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-violet-500">
                        <Hourglass className="h-4 w-4 text-violet-600" />
                    </span>
                    <div>
                        <p className="text-lg font-bold tracking-tight text-secondary-navy">5hr 14min</p>
                        <p className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Daily goal 8 hours
                        </p>
                    </div>
                </div>
                <div className="space-y-1.5">
                    {tasks.map((t) => (
                        <div key={t.label} className="flex items-center gap-2 text-xs">
                            <span className="w-8 shrink-0 font-semibold text-slate-500">{t.pct}</span>
                            <div className="relative h-5 min-w-0 flex-1 rounded-full bg-slate-100">
                                <div
                                    className={`absolute left-0 top-0 h-full rounded-full ${t.tone}`}
                                    style={{ width: t.w }}
                                />
                                <span
                                    className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold text-secondary-navy"
                                    style={{ left: `calc(${t.w} + 6px)` }}
                                >
                                    {t.label}
                                </span>
                            </div>
                            <span className="w-8 shrink-0 text-right text-[10px] text-slate-400">{t.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-end">
                <h4 className="mb-1.5 text-sm font-bold text-secondary-navy">Highlights</h4>
                <div className="rounded-xl bg-white p-2.5 shadow-sm">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-500">
                        <Target className="h-3.5 w-3.5" /> Deep Focus
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                        Tracked time is <span className="font-semibold text-secondary-navy">21% higher</span> than yesterday.
                    </p>
                    <div className="mt-2 flex items-end gap-1.5">
                        {[28, 46, 20, 36].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t bg-teal-400/80" style={{ height: `${h}px` }} />
                        ))}
                    </div>
                </div>
            </div>
        </ScreenShell>
    );
}

/** Screen 3 — detailed daily report (timeline of what the person did). */
export function DailyReportScreen() {
    const timeline = [
        { time: "09:02", title: "Deep work — FS-138", meta: "Dashboard · 1h 48m", tone: "bg-violet-500" },
        { time: "10:50", title: "Code review", meta: "FS-142 · 32m", tone: "bg-pink-500" },
        { time: "11:30", title: "Weekly sync", meta: "Meeting · 28m", tone: "bg-amber-500" },
        { time: "12:10", title: "Focus block", meta: "Writing · 54m", tone: "bg-teal-500" },
        { time: "14:00", title: "Browsing", meta: "Research · 15m", tone: "bg-blue-500" },
    ];
    return (
        <ScreenShell>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight text-secondary-navy">Daily Report</h3>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">May 22</span>
            </div>
            <p className="-mt-1 text-center text-[11px] text-slate-400">What you worked on today</p>

            <div className="grid grid-cols-3 gap-1.5">
                {[
                    { label: "Tracked", value: "5h 14m" },
                    { label: "Deep work", value: "3h 22m" },
                    { label: "Switches", value: "11" },
                ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-white p-2 text-center shadow-sm">
                        <p className="text-sm font-bold tracking-tight text-secondary-navy">{s.value}</p>
                        <p className="mt-0.5 text-[9px] text-slate-400">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-1 flex-col rounded-xl bg-white p-3 shadow-sm">
                <p className="mb-2 text-center text-xs font-semibold text-secondary-navy">Timeline</p>
                <div className="flex flex-1 flex-col justify-between">
                    {timeline.map((item) => (
                        <div key={item.time} className="flex items-center gap-2">
                            <span className="w-8 shrink-0 text-[9px] font-medium tabular-nums text-slate-400">{item.time}</span>
                            <span className={`h-2 w-2 shrink-0 rounded-full ${item.tone}`} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-secondary-navy">{item.title}</p>
                                <p className="truncate text-[10px] text-slate-400">{item.meta}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ScreenShell>
    );
}

const screens = [TimerScreen, SummaryScreen, DailyReportScreen];

/** Rotates the three app screens inside a desktop window. */
export function AppScreenRotator() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = window.setInterval(() => {
            setIndex((i) => (i + 1) % screens.length);
        }, SCREEN_MS);
        return () => clearInterval(id);
    }, []);

    const Screen = screens[index];

    return (
        <div className="w-[260px] overflow-hidden rounded-lg border border-slate-300/70 bg-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Screen />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/** Windows 11-style taskbar with centered icons. */
function Win11Taskbar() {
    const icons = [
        { label: "Start", node: <WindowsLogo /> },
        { label: "Files", node: <Folder className="h-4 w-4 text-amber-500" /> },
        { label: "Browser", node: <Globe className="h-4 w-4 text-blue-500" /> },
        { label: "Mail", node: <Mail className="h-4 w-4 text-sky-600" /> },
    ];
    return (
        <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-center gap-1.5 border-t border-slate-200 bg-white px-4">
            {icons.map((icon) => (
                <button
                    key={icon.label}
                    type="button"
                    aria-label={icon.label}
                    className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/50"
                >
                    {icon.node}
                </button>
            ))}
        </div>
    );
}

function WindowsLogo() {
    return (
        <span className="grid h-4 w-4 grid-cols-2 grid-rows-2 gap-[1.5px]">
            <span className="rounded-[1px] bg-sky-500" />
            <span className="rounded-[1px] bg-sky-500" />
            <span className="rounded-[1px] bg-sky-500" />
            <span className="rounded-[1px] bg-sky-500" />
        </span>
    );
}

/**
 * Renders the rotating app as if it were running on a computer:
 * Windows XP "Bliss" wallpaper, the FlowSight window docked to the left,
 * and a Windows 11-style centered taskbar at the bottom.
 */
export function DesktopFrame() {
    return (
        <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-slate-300/60 shadow-elevated">
            {/* XP Bliss wallpaper */}
            <div
                className="relative w-full bg-cover bg-center"
                style={{ backgroundImage: "url('/winxp-bliss.png')" }}
            >
                {/* Window centered, with space for the taskbar */}
                <div className="flex justify-center px-5 pt-6 pb-16 sm:px-8 sm:pt-7">
                    <AppScreenRotator />
                </div>

                <Win11Taskbar />
            </div>
        </div>
    );
}
