"use client";

import { motion } from "framer-motion";
import { Shield, Lock, EyeOff, FileText, Server, CheckCircle2, XCircle } from "lucide-react";

const badges = [
    { icon: <XCircle className="w-5 h-5 text-red-500" />, text: "We don't store screenshots", type: "negative" },
    { icon: <XCircle className="w-5 h-5 text-red-500" />, text: "We don't track keystrokes", type: "negative" },
    { icon: <XCircle className="w-5 h-5 text-red-500" />, text: "We don't see your data", type: "negative" },
    { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, text: "Only text descriptions sent", type: "positive" },
    { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, text: "Encrypted at rest", type: "positive" },
    { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, text: "GDPR compliant", type: "positive" },
];

export function PrivacySection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decorative Shield (Abstract) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-50 rounded-full opacity-50 blur-3xl -z-10" />

            <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center gap-16 mx-auto">

                {/* Left: Text & Badges */}
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6">
                            <Shield className="w-4 h-4" /> Privacy-First Architecture
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary-navy">
                            Your screenshots never leave the laptop
                        </h2>
                        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                            We processed activity locally using <span className="font-semibold text-secondary-navy">Qwen3-VL 2B</span>.
                            Images are analyzed and immediately deleted.
                            Only encrypted text metadata touches our servers.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {badges.map((badge, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    {badge.icon}
                                    <span className={`font-medium ${badge.type === 'negative' ? 'text-slate-600' : 'text-secondary-navy'}`}>
                                        {badge.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right: Visual Illustration */}
                <div className="flex-1 w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl p-1 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700"
                    >
                        <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center overflow-hidden relative">
                            <Lock className="w-32 h-32 text-green-500 opacity-20" />
                            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,transparent)]" />

                            {/* Floating Shield */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="w-48 h-56 bg-gradient-to-br from-green-400 to-emerald-600 rounded-[3rem] opacity-90 backdrop-blur-md shadow-2xl flex items-center justify-center ring-4 ring-white/50">
                                    <Shield className="w-24 h-24 text-white fill-white/20" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
