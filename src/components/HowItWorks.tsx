"use client";

import { motion } from "framer-motion";
import { Download, Cpu, BarChart3 } from "lucide-react";

const steps = [
    {
        icon: <Download className="w-8 h-8 text-white" />,
        title: "Install Agent",
        description: "Runs on each team member's laptop. Takes screenshot every 5min.",
        color: "bg-blue-500",
    },
    {
        icon: <Cpu className="w-8 h-8 text-white" />,
        title: "AI Analyzes Locally",
        description: "Qwen3-VL processes screenshot. Only text sent to cloud.",
        color: "bg-purple-500",
        badge: "🔒 Privacy-first",
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-white" />,
        title: "Get Daily Insights",
        description: "PM dashboard shows team activity. Blockers detected automatically.",
        color: "bg-teal-500",
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-secondary-navy">
                        Zero friction. Maximum insight.
                    </h2>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 -z-10">
                        <div className="h-full w-full bg-slate-100 opacity-50 absolute" />
                    </div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2, duration: 0.6 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div
                                className={`w-24 h-24 rounded-2xl ${step.color} shadow-lg flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-300`}
                            >
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-secondary-navy">{step.title}</h3>
                            <p className="text-slate-500 max-w-xs">{step.description}</p>
                            {step.badge && (
                                <span className="mt-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                                    {step.badge}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
