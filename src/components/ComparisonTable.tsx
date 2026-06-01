"use client";

import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Eye, AlertTriangle, Brain, Zap, Lock } from "lucide-react";

const features = [
    {
        name: "Screenshot handling",
        competitor: "Stored in vendor cloud",
        flowsight: "Processed locally. Reports shared only when you decide.",
        flowType: "good",
        compType: "bad",
        icon: <Eye className="w-4 h-4" />,
    },
    {
        name: "Keystroke / mouse surveillance",
        competitor: "Common",
        flowsight: "Absolutely none",
        flowType: "good",
        compType: "bad",
        icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
        name: "Timesheets & manual proof",
        competitor: "Required for visibility",
        flowsight: "Gone. Reports build from real work",
        flowType: "good",
        compType: "bad",
        icon: <Zap className="w-4 h-4" />,
    },
    {
        name: "Vision-language AI",
        competitor: "Cloud-only or none",
        flowsight: "On-device (Free), cloud-powered (Pro). Open source.",
        flowType: "great",
        compType: "neutral",
        icon: <Brain className="w-4 h-4" />,
    },
    {
        name: "Worker trust & privacy",
        competitor: "Surveillance by design",
        flowsight: "Cognitive health first. AI suggests, you decide.",
        flowType: "great",
        compType: "neutral",
        icon: <Lock className="w-4 h-4" />,
    },
    {
        name: "Focus & burnout signals",
        competitor: "Rare / activity scores only",
        flowsight: "Context switches & overload, surfaced early",
        flowType: "great",
        compType: "neutral",
        icon: <ShieldCheck className="w-4 h-4" />,
    },
];

export function ComparisonTable() {
    return (
        <section id="privacy" className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Subtle ambient decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary-cyan/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-teal/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 md:mb-20"
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-secondary-navy mb-4">
                        Guard cognition, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan to-primary-teal">not employees</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Anti-bossware: privacy-first AI that protects your focus, not surveils your screen.
                    </p>
                </motion.div>

                {/* Comparison Cards */}
                <div className="max-w-5xl mx-auto">
                    {/* Column Headers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-4 mb-3"
                    >
                        <div className="hidden md:flex items-center pl-4">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Feature</span>
                        </div>
                        <div className="hidden md:flex items-center justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
                                <div className="w-2 h-2 rounded-full bg-slate-400" />
                                <span className="text-sm font-semibold text-slate-500">Hubstaff / Time Doctor</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-cyan/10 to-primary-teal/10 border border-primary-teal/20">
                                <div className="w-2 h-2 rounded-full bg-primary-teal" />
                                <span className="text-sm font-bold text-secondary-navy">FlowSight</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature Rows */}
                    <div className="space-y-3">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-3 md:gap-4 items-center rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300 p-4 md:p-5 group">
                                    {/* Feature Name */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 group-hover:text-primary-teal group-hover:border-primary-teal/30 transition-colors">
                                            {feature.icon}
                                        </div>
                                        <span className="font-bold text-secondary-navy text-base">{feature.name}</span>
                                    </div>

                                    {/* Competitor Value */}
                                    <div className="flex items-center md:justify-center gap-2 pl-12 md:pl-0">
                                        <span className="text-xs font-medium text-slate-400 md:hidden">Others:</span>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${feature.compType === 'bad'
                                            ? 'bg-red-50 text-red-600 border border-red-100'
                                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                                            }`}>
                                            {feature.compType === 'bad' && <X className="w-3.5 h-3.5 text-red-400" />}
                                            {feature.competitor}
                                        </div>
                                    </div>

                                    {/* FlowSight Value */}
                                    <div className="flex items-center md:justify-center gap-2 pl-12 md:pl-0">
                                        <span className="text-xs font-medium text-slate-400 md:hidden">FlowSight:</span>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${feature.flowType === 'great'
                                            ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border border-teal-200'
                                            : 'bg-green-50 text-green-700 border border-green-200'
                                            }`}>
                                            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                            {feature.flowsight}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Summary Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-10 flex justify-center"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-cyan/5 via-primary-teal/5 to-emerald-50 border border-primary-teal/15">
                            <ShieldCheck className="w-5 h-5 text-primary-teal" />
                            <span className="text-sm font-semibold text-secondary-navy">
                                GDPR-minded · SOC 2 roadmap · local AI · readable source
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
