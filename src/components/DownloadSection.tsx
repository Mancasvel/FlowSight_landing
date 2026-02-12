"use client";

import { motion } from "framer-motion";
import { Download, Monitor, Apple } from "lucide-react";

export function DownloadSection() {
    return (
        <section id="download" className="py-24 bg-white overflow-hidden relative">
            {/* Subtle ambient decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-cyan/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 text-secondary-navy"
                    >
                        Track Anywhere, <span className="bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent">Invisible Everywhere.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg max-w-2xl mx-auto"
                    >
                        Our privacy-first desktop agent runs silently in the background, analyzing context without capturing sensitive data.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Windows */}
                    <motion.div
                        id="download-windows"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center hover:border-slate-300 hover:shadow-xl shadow-lg transition-all"
                    >
                        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6">
                            <Monitor className="text-blue-500 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary-navy mb-2">Windows</h3>
                        <p className="text-slate-500 mb-8">Requires Windows 10 or 11 (64-bit)</p>
                        <button className="w-full py-4 bg-gradient-to-r from-primary-cyan to-primary-teal hover:from-primary-teal hover:to-primary-cyan text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all group shadow-md hover:shadow-lg">
                            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            Download for Windows
                        </button>
                        <p className="mt-4 text-xs text-slate-400">v1.2.0 • 64MB .exe</p>
                    </motion.div>

                    {/* macOS */}
                    <motion.div
                        id="download-mac"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center hover:border-slate-300 hover:shadow-xl shadow-lg transition-all"
                    >
                        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-6">
                            <Apple className="text-slate-700 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary-navy mb-2">macOS</h3>
                        <p className="text-slate-500 mb-8">Apple Silicon (M1/M2/M3) & Intel</p>
                        <button className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-secondary-navy rounded-xl font-medium flex items-center justify-center gap-2 transition-all group border border-slate-200">
                            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            Download for macOS
                        </button>
                        <p className="mt-4 text-xs text-slate-400">v1.2.0 • 85MB .dmg</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
