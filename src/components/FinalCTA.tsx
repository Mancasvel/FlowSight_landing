"use client";

import { motion } from "framer-motion";
import { Button } from "./Button";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Subtle background gradients */}
            <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary-cyan/10 rounded-full blur-[128px] -translate-y-1/2" />
                <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-primary-teal/10 rounded-full blur-[128px] -translate-y-1/2" />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-secondary-navy mb-8 tracking-tight">
                        Ready to make your work <span className="bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent">visible?</span>
                    </h2>
                    <p className="text-xl text-slate-500 mb-10 leading-relaxed">
                        Join forward-thinking teams using FlowSight to build trust, autonomy, and productivity
                        without invasive surveillance.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/login?plan=trial">
                            <Button variant="primary" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary-cyan/20">
                                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="#pricing">
                            <Button variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto border-slate-300 text-secondary-navy hover:bg-slate-50 hover:border-primary-teal">
                                View Pricing
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-slate-400">
                        No credit card required for 14-day trial • Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
