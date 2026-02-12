"use client";

import { motion } from "framer-motion";
import { Download, Cpu, BarChart3, Shield, XCircle, CheckCircle2, WifiOff, Brain, Lock } from "lucide-react";

// --- Mini Visual Mockups for each step (Light theme) ---

function AgentMockup() {
    return (
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {/* Laptop Frame */}
            <div className="absolute inset-3 rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden">
                {/* Screen */}
                <div className="absolute inset-1.5 rounded bg-slate-50 overflow-hidden">
                    {/* Desktop mockup */}
                    <div className="h-3 bg-slate-200 flex items-center px-1.5 gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-red-400"></div>
                        <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                        <div className="w-1 h-1 rounded-full bg-green-400"></div>
                        <div className="w-6 h-1 bg-slate-300 rounded ml-auto"></div>
                    </div>
                    <div className="p-1.5 space-y-1">
                        <div className="h-1.5 w-3/4 bg-slate-200 rounded"></div>
                        <div className="h-1.5 w-1/2 bg-slate-200 rounded"></div>
                        <div className="flex gap-1 mt-1">
                            <div className="h-6 flex-1 bg-slate-100 rounded"></div>
                            <div className="h-6 flex-1 bg-slate-100 rounded"></div>
                        </div>
                    </div>

                    {/* FlowSight Agent Widget - bottom right overlay */}
                    <motion.div
                        animate={{ opacity: [0.85, 1, 0.85] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1 right-1 bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur rounded-md px-1.5 py-0.5 flex items-center gap-1 shadow-lg shadow-blue-500/20"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50"
                        />
                        <span className="text-[6px] text-white font-bold tracking-wide">FlowSight</span>
                    </motion.div>
                </div>
            </div>

            {/* Activity Pulse Lines */}
            <div className="absolute bottom-2 left-3 right-3 flex items-end gap-0.5 h-4 opacity-50">
                {[40, 65, 30, 80, 55, 70, 45, 90, 35, 60, 75, 50].map((h, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: [`${h}%`, `${Math.max(20, h - 30)}%`, `${h}%`] }}
                        transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                        className="flex-1 bg-blue-400/40 rounded-t"
                    />
                ))}
            </div>
        </div>
    );
}

// Pre-computed positions to avoid SSR hydration mismatches from Math.sin/cos
const nodePositions = [
    { top: "50%", left: "92%" },       // 0°
    { top: "86.37%", left: "71%" },    // 60°
    { top: "86.37%", left: "29%" },    // 120°
    { top: "50%", left: "8%" },        // 180°
    { top: "13.63%", left: "29%" },    // 240°
    { top: "13.63%", left: "71%" },    // 300°
];

const lineEndpoints = [
    { x2: 103.04, y2: 56 },      // 0°
    { x2: 79.52, y2: 96.74 },    // 60°
    { x2: 32.48, y2: 96.74 },    // 120°
    { x2: 8.96, y2: 56 },        // 180°
    { x2: 32.48, y2: 15.26 },    // 240°
    { x2: 79.52, y2: 15.26 },    // 300°
];

function AIProcessingMockup() {
    return (
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {/* Neural Network Grid */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-28 h-28">
                    {/* Central Brain */}
                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 border border-purple-200 flex items-center justify-center"
                    >
                        <Brain className="w-7 h-7 text-purple-500" />
                    </motion.div>

                    {/* Orbiting data nodes */}
                    {nodePositions.map((pos, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: [0.4, 1, 0.4],
                                scale: [0.8, 1, 0.8],
                            }}
                            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                            className="absolute w-2.5 h-2.5 rounded-full bg-purple-400 border border-purple-300"
                            style={{
                                top: pos.top,
                                left: pos.left,
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                    ))}

                    {/* Connecting lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112">
                        {lineEndpoints.map((ep, i) => (
                            <motion.line
                                key={i}
                                x1="56" y1="56"
                                x2={ep.x2}
                                y2={ep.y2}
                                stroke="rgba(168,85,247,0.2)"
                                strokeWidth="1"
                                animate={{ opacity: [0.15, 0.4, 0.15] }}
                                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                            />
                        ))}
                    </svg>
                </div>
            </div>

            {/* "On Device" label */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-purple-100 border border-purple-200 rounded-full px-2 py-0.5">
                <WifiOff className="w-2.5 h-2.5 text-purple-500" />
                <span className="text-[7px] text-purple-600 font-medium">On-device</span>
            </div>

            {/* Processing text stream */}
            <div className="absolute bottom-2 left-2 right-2">
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex gap-1"
                >
                    <div className="h-1 flex-[3] bg-purple-300 rounded"></div>
                    <div className="h-1 flex-[2] bg-purple-400 rounded"></div>
                    <div className="h-1 flex-[1] bg-purple-200 rounded"></div>
                </motion.div>
            </div>
        </div>
    );
}

function DashboardMockup() {
    return (
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {/* Mini Dashboard */}
            <div className="absolute inset-2 rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden">
                {/* Top nav */}
                <div className="h-4 bg-slate-50 border-b border-slate-200 flex items-center px-2 justify-between">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded bg-primary-teal"></div>
                        <div className="w-8 h-1 bg-slate-200 rounded"></div>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="flex gap-1 p-1.5">
                    {[
                        { label: "Focus", value: "87%", color: "text-teal-600" },
                        { label: "Tasks", value: "12", color: "text-blue-600" },
                        { label: "Blockers", value: "2", color: "text-amber-600" }
                    ].map((kpi, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.15 }}
                            className="flex-1 bg-slate-50 rounded-md p-1.5 border border-slate-100"
                        >
                            <div className="text-[6px] text-slate-400">{kpi.label}</div>
                            <div className={`text-[10px] font-bold ${kpi.color}`}>{kpi.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Animated Chart Bars */}
                <div className="px-1.5 pb-1.5 flex items-end gap-0.5 h-[calc(100%-4.5rem)]">
                    {[60, 80, 45, 90, 70, 55, 85, 40, 75, 65, 95, 50].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 + i * 0.05, ease: "easeOut" }}
                            className={`flex-1 rounded-t ${i % 3 === 0 ? 'bg-teal-400/70' : i % 3 === 1 ? 'bg-cyan-400/50' : 'bg-blue-400/40'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PrivacyMockup() {
    return (
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    {/* Shield Center */}
                    <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 flex items-center justify-center"
                    >
                        <Shield className="w-8 h-8 text-green-500 fill-green-100" />
                    </motion.div>

                    {/* LEFT - rejected items (screenshots) */}
                    <div className="absolute -left-16 top-1/2 -translate-y-1/2 space-y-1.5">
                        {["📸", "🖼️", "📷"].map((emoji, i) => (
                            <motion.div
                                key={i}
                                animate={{ x: [0, 10, 10], opacity: [0.7, 0.7, 0] }}
                                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                                className="flex items-center gap-1"
                            >
                                <span className="text-[8px]">{emoji}</span>
                                <XCircle className="w-2.5 h-2.5 text-red-400" />
                            </motion.div>
                        ))}
                    </div>

                    {/* RIGHT - approved items (text metadata) */}
                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 space-y-1.5">
                        {["Task: Design", "Tool: Figma", "Focus: 94%"].map((text, i) => (
                            <motion.div
                                key={i}
                                animate={{ x: [0, 5, 5], opacity: [0, 0.9, 0.9] }}
                                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                                className="flex items-center gap-1"
                            >
                                <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                                <span className="text-[7px] text-green-700 font-mono">{text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Encryption label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-green-100 border border-green-200 rounded-full px-2 py-0.5">
                <Lock className="w-2.5 h-2.5 text-green-600" />
                <span className="text-[7px] text-green-700 font-medium">AES-256 encrypted</span>
            </div>
        </div>
    );
}

// --- Step Data ---
const flowSteps = [
    {
        id: 1,
        icon: <Download className="w-6 h-6" />,
        title: "Install Agent",
        description: "A lightweight agent runs on each team member's laptop. It takes a screenshot every 5 minutes to understand work context.",
        glowColor: "blue",
        details: ["< 50MB memory", "No performance impact", "Works offline"],
        mockup: <AgentMockup />,
    },
    {
        id: 2,
        icon: <Cpu className="w-6 h-6" />,
        title: "AI Analyzes Locally",
        description: "Qwen3-VL 2B processes each screenshot directly on the device. The AI understands tools being used and tasks being worked on.",
        glowColor: "purple",
        badge: "🔒 Privacy-first",
        details: ["On-device AI", "No screenshots uploaded", "Instant analysis"],
        mockup: <AIProcessingMockup />,
    },
    {
        id: 3,
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Get Daily Insights",
        description: "PM dashboard shows team activity patterns, time allocation, and automatically detected blockers.",
        glowColor: "teal",
        details: ["Real-time dashboards", "Weekly reports", "Blocker detection"],
        mockup: <DashboardMockup />,
    },
    {
        id: 4,
        icon: <Shield className="w-6 h-6" />,
        title: "Your Data Stays Private",
        description: "Screenshots never leave the laptop. Images are analyzed and immediately deleted. Only encrypted text metadata touches our servers.",
        glowColor: "green",
        isPrivacy: true,
        privacyBadges: [
            { icon: <XCircle className="w-4 h-4 text-red-400" />, text: "No screenshots stored", type: "negative" },
            { icon: <XCircle className="w-4 h-4 text-red-400" />, text: "No keystroke tracking", type: "negative" },
            { icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, text: "Only text sent", type: "positive" },
            { icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, text: "GDPR compliant", type: "positive" },
        ],
        mockup: <PrivacyMockup />,
    },
];

// --- Light theme color mappings ---
const glowColors: Record<string, string> = {
    blue: "hover:shadow-blue-100/80",
    purple: "hover:shadow-purple-100/80",
    teal: "hover:shadow-teal-100/80",
    green: "hover:shadow-green-100/80",
};

const iconBg: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    teal: "bg-teal-100 text-teal-600",
    green: "bg-green-100 text-green-600",
};

export function FlowSection() {
    return (
        <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
            {/* Subtle ambient decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

            {/* Section Header */}
            <div className="container px-4 md:px-6 mx-auto mb-16 md:mb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-secondary-navy">
                        Zero friction.{" "}
                        <span className="bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent">
                            Maximum insight.
                        </span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        See how FlowSight works in 4 simple steps
                    </p>
                </motion.div>
            </div>

            {/* Connecting Line (Desktop only) */}
            <div className="hidden lg:block container px-4 md:px-6 mx-auto relative z-0">
                <div className="absolute top-[220px] left-[12%] right-[12%] h-px">
                    <div className="w-full h-full bg-gradient-to-r from-blue-200/60 via-purple-200/60 via-teal-200/60 to-green-200/60" />
                    <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-transparent via-primary-teal/40 to-transparent"
                    />
                </div>
            </div>

            {/* Steps Grid */}
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {flowSteps.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                        >
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`relative h-full bg-white rounded-2xl border border-slate-200 p-6 group hover:border-slate-300 transition-all duration-500 hover:shadow-xl shadow-lg ${glowColors[step.glowColor]}`}
                            >
                                {/* Step Number */}
                                <div className="absolute -top-3 -right-1 text-6xl font-black text-slate-100 select-none pointer-events-none">
                                    0{step.id}
                                </div>

                                {/* Icon */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-11 h-11 rounded-xl ${iconBg[step.glowColor]} flex items-center justify-center border border-slate-100`}>
                                        {step.icon}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {step.id}</span>
                                        <h3 className="text-lg font-bold text-secondary-navy leading-tight">{step.title}</h3>
                                    </div>
                                </div>

                                {/* Badge */}
                                {step.badge && (
                                    <div className="inline-flex mb-3 px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200">
                                        {step.badge}
                                    </div>
                                )}

                                {/* Visual Mockup */}
                                <div className="mb-4">
                                    {step.mockup}
                                </div>

                                {/* Description */}
                                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                    {step.description}
                                </p>

                                {/* Detail Pills or Privacy Badges */}
                                {step.isPrivacy && step.privacyBadges ? (
                                    <div className="space-y-1.5">
                                        {step.privacyBadges.map((badge, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.4 + i * 0.1 }}
                                                className="flex items-center gap-2 text-xs"
                                            >
                                                {badge.icon}
                                                <span className={badge.type === 'negative' ? 'text-slate-500' : 'text-green-700'}>
                                                    {badge.text}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : step.details ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {step.details.map((detail, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 text-[11px] text-slate-500 bg-slate-50 rounded-full border border-slate-100"
                                            >
                                                {detail}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
