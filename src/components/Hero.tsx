"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, animate } from "framer-motion";
import { Button } from "./Button";
import {
    ChevronDown,
    Clock,
    Flame,
    Euro,
    MousePointer2,
    Square,
    Type,
    PenLine,
    Video,
    Mic,
    FileText,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";

function scrollToNextSection() {
    document.getElementById("about-flowsight")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.11,
            delayChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 320, damping: 26 },
    },
};

const BASE_FLOW = 68;
const DONUT_R = 72;
const DONUT_C = 2 * Math.PI * DONUT_R;

/** Labels and colors aligned with the numeric Team Flow Score shown in the donut. */
function flowScoreBand(p: number): { label: string; className: string } {
    if (p >= 72) return { label: "Strong", className: "text-emerald-600" };
    if (p >= 66) return { label: "Stable", className: "text-amber-600" };
    if (p >= 60) return { label: "Mixed", className: "text-orange-600" };
    return { label: "Low", className: "text-red-600" };
}

function TeamFlowDonut() {
    const pct = useMotionValue(BASE_FLOW);
    const strokeDashoffset = useTransform(pct, (p) => DONUT_C * (1 - p / 100));
    const smoothOffset = useSpring(strokeDashoffset, { stiffness: 52, damping: 17 });
    const [label, setLabel] = useState(BASE_FLOW);

    useEffect(() => {
        pct.set(0);
        let loop: ReturnType<typeof animate> | undefined;
        let cancelled = false;
        const startLoop = () => {
            if (cancelled) return;
            loop = animate(pct, [71, 64, 69, 66, BASE_FLOW], {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
            });
        };
        const intro = animate(pct, BASE_FLOW, {
            duration: 1.35,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
            onComplete: () => {
                if (!cancelled) startLoop();
            },
        });
        return () => {
            cancelled = true;
            intro.stop();
            loop?.stop();
        };
    }, [pct]);

    useEffect(() => {
        return pct.on("change", (v) => setLabel(Math.round(v)));
    }, [pct]);

    const band = useMemo(() => flowScoreBand(label), [label]);

    return (
        <div className="flex flex-col items-center justify-center py-4 md:py-6">
            <div className="relative w-[min(100%,240px)] lg:w-[min(100%,260px)] aspect-square max-w-[240px] lg:max-w-[260px] drop-shadow-[0_8px_32px_rgba(251,191,36,0.25)]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 164 164" aria-hidden>
                    <defs>
                        <linearGradient id="donutFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="55%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#EA580C" />
                        </linearGradient>
                        <filter id="donutGlow" x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <circle cx="82" cy="82" r={DONUT_R} fill="none" stroke="#e2e8f0" strokeWidth="14" />
                    <motion.circle
                        cx="82"
                        cy="82"
                        r={DONUT_R}
                        fill="none"
                        stroke="url(#donutFlowGrad)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={DONUT_C}
                        style={{ strokeDashoffset: smoothOffset }}
                        filter="url(#donutGlow)"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.span
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-secondary-navy tabular-nums"
                        key={label}
                        initial={{ opacity: 0.85, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                    >
                        {label}%
                    </motion.span>
                </div>
            </div>
            <p className="text-base md:text-lg font-semibold text-secondary-navy mt-3 tracking-tight">Team Flow Score</p>
            <motion.p
                key={band.label}
                className={`text-sm font-medium mt-1 tabular-nums ${band.className}`}
                initial={{ opacity: 0.65, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
            >
                <span className="text-slate-400" aria-hidden="true">
                    ·{' '}
                </span>
                {band.label}
            </motion.p>
            <button
                type="button"
                className="mt-5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-violet-500 transition-colors"
            >
                Flow details →
            </button>
        </div>
    );
}

const WORKFLOW_SCREEN_MS = 5200;

function MacDots() {
    return (
        <div className="flex gap-1.5 shrink-0" aria-hidden>
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
    );
}

function ScreenFigma() {
    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="shrink-0 flex items-center gap-2.5 px-3 py-2.5 md:px-4 md:py-3 bg-white border-b border-slate-200">
                <MacDots />
                <div className="hidden sm:flex items-center gap-2 text-slate-400 ml-1" aria-hidden>
                    <MousePointer2 className="w-4 h-4" strokeWidth={2} />
                    <Square className="w-4 h-4" strokeWidth={2} />
                    <Type className="w-4 h-4" strokeWidth={2} />
                    <PenLine className="w-4 h-4" strokeWidth={2} />
                </div>
                <span className="ml-auto text-xs sm:text-sm font-medium text-slate-500 truncate max-w-[58%] text-right">
                    FlowSight_Landing.fig
                </span>
            </div>
            <div className="relative flex-1 min-h-[240px] md:min-h-[300px] lg:min-h-[360px] xl:min-h-[400px] bg-slate-200/70 p-3 md:p-4 lg:p-5">
                <div className="relative h-full min-h-[220px] md:min-h-[280px] lg:min-h-[340px] xl:min-h-[380px] rounded-xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
                    <div className="absolute inset-x-3 top-3 md:inset-x-4 md:top-4 h-11 sm:h-12 md:h-14 rounded-lg bg-slate-900 flex items-center justify-end gap-2 sm:gap-2.5 px-3 sm:px-4">
                        <span className="hidden sm:inline-block h-2.5 w-12 sm:w-16 rounded-full bg-slate-600/90" />
                        <span className="h-2.5 w-10 sm:w-14 rounded-full bg-slate-600/90" />
                        <span className="h-2.5 w-10 sm:w-14 rounded-full bg-slate-600/90" />
                        <span className="rounded-md bg-sky-500 text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 shadow-sm shadow-sky-500/30">
                            Try Free
                        </span>
                    </div>
                    <div
                        className="absolute inset-x-3 top-[4.25rem] sm:top-[4.75rem] md:top-[5.25rem] bottom-3 md:inset-x-4 md:bottom-4 rounded-lg border border-dashed border-slate-200 bg-slate-50/60"
                        aria-hidden
                    />
                    <motion.div
                        className="absolute z-10 flex flex-col items-start pointer-events-none drop-shadow-lg"
                        initial={false}
                        animate={{
                            left: ["12%", "64%", "36%", "58%", "20%", "12%"],
                            top: ["24%", "28%", "38%", "32%", "26%", "24%"],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <MousePointer2
                            className="w-7 h-7 sm:w-8 sm:h-8 text-sky-500 fill-sky-500 -rotate-6 translate-x-0.5"
                            strokeWidth={1.25}
                            aria-hidden
                        />
                        <span className="mt-1 ml-3.5 rounded-md bg-sky-500 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
                            Manuel C.
                        </span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ScreenMeeting() {
    return (
        <div className="flex flex-col flex-1 min-h-0 bg-slate-900">
            <div className="shrink-0 flex items-center gap-2.5 px-3 py-2.5 md:px-4 md:py-3 bg-slate-950 border-b border-slate-800">
                <MacDots />
                <Video className="w-4 h-4 text-sky-400 shrink-0" strokeWidth={2} aria-hidden />
                <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                    FlowSight · Weekly sync
                </span>
                <span className="ml-auto text-[10px] text-slate-500 tabular-nums">9:02</span>
            </div>
            <div className="flex-1 flex flex-col p-3 md:p-4 lg:p-5 min-h-[240px] md:min-h-[300px] lg:min-h-[360px] xl:min-h-[400px]">
                <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3 min-h-0">
                    {[
                        { ab: "MC", tone: "from-violet-600 to-indigo-600" },
                        { ab: "IR", tone: "from-emerald-600 to-teal-600" },
                        { ab: "LS", tone: "from-amber-600 to-orange-600" },
                        { ab: "+4", tone: "from-slate-600 to-slate-700" },
                    ].map((t) => (
                        <div
                            key={t.ab}
                            className={`rounded-xl bg-gradient-to-br ${t.tone} flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-inner`}
                        >
                            {t.ab}
                        </div>
                    ))}
                </div>
                <div className="shrink-0 mt-3 flex items-center justify-center gap-4 sm:gap-6">
                    <span className="rounded-full bg-slate-800 p-2.5 ring-1 ring-slate-600/80" aria-hidden>
                        <Mic className="w-4 h-4 text-slate-300" strokeWidth={2} />
                    </span>
                    <span className="rounded-full bg-slate-800 p-2.5 ring-1 ring-slate-600/80" aria-hidden>
                        <Video className="w-4 h-4 text-slate-300" strokeWidth={2} />
                    </span>
                    <span className="rounded-md bg-red-600 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white">
                        Leave
                    </span>
                </div>
            </div>
        </div>
    );
}

function ScreenDocument() {
    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            <div className="shrink-0 flex items-center gap-2.5 px-3 py-2.5 md:px-4 md:py-3 border-b border-slate-200 bg-slate-50">
                <MacDots />
                <FileText className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={2} aria-hidden />
                <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                    Cognitive weekly summary
                </span>
            </div>
            <div className="flex-1 relative pl-10 sm:pl-14 pr-4 py-4 md:py-6 min-h-[240px] md:min-h-[300px] lg:min-h-[360px] xl:min-h-[400px]">
                <div className="absolute left-6 sm:left-8 top-4 bottom-4 w-px bg-amber-200/90" aria-hidden />
                <div className="space-y-2.5 md:space-y-3 pt-1">
                    <div className="h-2.5 w-[92%] rounded bg-slate-200" />
                    <div className="h-2.5 w-[88%] rounded bg-slate-200" />
                    <div className="h-2.5 w-[70%] rounded bg-slate-200" />
                    <div className="h-2.5 w-[95%] rounded bg-slate-200" />
                    <div className="mt-4 flex items-center gap-0.5 flex-wrap">
                        <span className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                            Deep work blocks up 12% vs last week. Fewer context switches on Tuesday and Thursday.
                        </span>
                        <motion.span
                            className="inline-block w-0.5 h-3.5 sm:h-4 bg-sky-500 rounded-sm align-middle ml-0.5"
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1.1, repeat: Infinity }}
                            aria-hidden
                        />
                    </div>
                    <div className="h-2.5 w-[55%] rounded bg-slate-100" />
                </div>
            </div>
        </div>
    );
}

/** Rotates Figma → video meeting → document writing so the hero shows real work contexts. */
function HeroDesignBuildMockup() {
    const [screen, setScreen] = useState(0);

    useEffect(() => {
        const id = window.setInterval(() => {
            setScreen((s) => (s + 1) % 3);
        }, WORKFLOW_SCREEN_MS);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="w-full min-w-0 max-w-full flex flex-col min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] xl:min-h-[460px]">
            <div
                className="flex-1 flex flex-col rounded-2xl border border-slate-300/70 bg-slate-100 shadow-[0_18px_50px_-12px_rgba(15,23,42,0.18)] overflow-hidden"
                role="img"
                aria-label="Rotating preview: design file, team video meeting, and document writing"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={screen}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -14 }}
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        {screen === 0 ? <ScreenFigma /> : null}
                        {screen === 1 ? <ScreenMeeting /> : null}
                        {screen === 2 ? <ScreenDocument /> : null}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

type MetricDef = {
    icon: typeof Clock;
    label: string;
    format: (n: number) => string;
    base: number;
    variance: number;
    decimals?: number;
};

const METRICS: MetricDef[] = [
    { icon: Clock, label: "Avg Recovery", base: 16, variance: 1.2, decimals: 0, format: (n) => `${Math.round(n)}min` },
    { icon: Flame, label: "Best Streak", base: 80.8, variance: 2.5, decimals: 1, format: (n) => `${n.toFixed(1)}min` },
    { icon: Clock, label: "Meeting Load", base: 22, variance: 2, decimals: 0, format: (n) => `${Math.round(n)}%` },
    { icon: Euro, label: "Inefficiency Cost", base: 9250, variance: 180, decimals: 0, format: (n) => `€${Math.round(n).toLocaleString("de-DE")}` },
];

function MetricGrid() {
    return (
        <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 sm:gap-2.5 md:gap-3 h-full min-h-[240px] md:min-h-[280px] lg:min-h-[320px] min-w-0 w-full xl:min-h-0 xl:h-auto xl:w-fit xl:max-w-full xl:gap-2.5">
            {METRICS.map((m, i) => (
                <MetricTile key={m.label} def={m} delay={i * 0.08} />
            ))}
        </div>
    );
}

function MetricTile({ def, delay }: { def: MetricDef; delay: number }) {
    const v = useMotionValue(def.base);
    const [text, setText] = useState(def.format(def.base));

    useEffect(() => {
        const ctrl = animate(v, def.base + def.variance, {
            duration: 2.8 + delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        });
        return () => ctrl.stop();
    }, [v, def.base, def.variance, def.label, delay]);

    useEffect(() => {
        return v.on("change", (n) => setText(def.format(n)));
    }, [v, def.format, def.label]);

    const Icon = def.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + delay, type: "spring", stiffness: 400, damping: 28 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-xl border border-violet-100/80 bg-gradient-to-br from-white via-violet-50/30 to-white p-3 sm:p-4 md:p-4 shadow-md shadow-violet-200/20 ring-1 ring-white/80 flex flex-col items-start justify-between gap-2 min-h-[96px] sm:min-h-[108px] md:min-h-[118px] lg:min-h-[124px] min-w-0 overflow-hidden xl:w-full xl:min-w-[200px] xl:flex-row xl:items-center xl:justify-start xl:gap-3 xl:min-h-0 xl:py-3.5 xl:px-3.5"
        >
            <div className="shrink-0 rounded-lg bg-violet-500/10 p-2 ring-1 ring-violet-400/20">
                <Icon className="w-4 h-4 md:w-5 md:h-5 xl:w-5 xl:h-5 text-violet-600" strokeWidth={2} aria-hidden />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left xl:flex-none xl:min-w-0">
                <span className="text-[11px] sm:text-xs md:text-sm xl:text-sm text-slate-500 font-medium leading-snug line-clamp-2 break-words">
                    {def.label}
                </span>
                <motion.span
                    className="text-sm sm:text-base md:text-lg xl:text-lg font-bold tracking-tight text-secondary-navy tabular-nums min-w-0 w-full break-words leading-tight"
                    animate={{ opacity: [0.92, 1, 0.92] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay }}
                >
                    {text}
                </motion.span>
            </div>
        </motion.div>
    );
}

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 bg-gradient-to-b from-slate-50 via-white to-cyan-50/20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(56,189,248,0.12),transparent)]" />

            <div className="container relative z-10 px-3 sm:px-5 md:px-6 lg:px-10 flex flex-col items-center text-center mx-auto max-w-screen-2xl">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.08 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 font-heading text-secondary-navy"
                >
                    AI that protects how you think,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-navy to-primary-teal">
                        and proves how you work
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.15 }}
                    className="relative w-full mt-4 md:mt-6 p-1 rounded-[1.75rem] bg-gradient-to-br from-white via-slate-100/80 to-cyan-100/40 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60"
                >
                    <div className="rounded-[1.65rem] bg-slate-50/40 backdrop-blur-[2px] p-2 sm:p-3 md:p-4 lg:p-6">
                        <motion.div
                            className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-stretch min-w-0 xl:flex xl:flex-row xl:items-stretch"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="min-w-0 w-full shrink-0 rounded-2xl bg-white/95 border border-slate-200/60 shadow-lg shadow-slate-200/40 ring-1 ring-white/90 px-2 sm:px-3 overflow-hidden xl:w-[min(280px,28%)] xl:max-w-[300px]"
                            >
                                <TeamFlowDonut />
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex min-w-0 w-full max-w-full flex-col justify-center xl:flex-1"
                            >
                                <HeroDesignBuildMockup />
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex min-w-0 w-full max-w-full justify-center xl:w-fit xl:shrink-0 xl:justify-end"
                            >
                                <MetricGrid />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.55 }}
                    className="mt-8 md:mt-10 flex flex-col items-center"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            type="button"
                            data-track="hero-more-about"
                            variant="outline"
                            size="lg"
                            className="group bg-white"
                            onClick={scrollToNextSection}
                        >
                            Why FlowSight
                            <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" aria-hidden />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
