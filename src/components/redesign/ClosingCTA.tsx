"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";

function scrollToDownload() {
    document.getElementById("download")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

export function ClosingCTA() {
    return (
        <section className="relative overflow-hidden px-6 pt-28 pb-28 md:pt-36 md:pb-36">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 mx-auto max-w-3xl text-center"
            >
                <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-secondary-navy sm:text-4xl md:text-5xl">
                    Protect your focus.
                    <br />
                    Reclaim your time.
                </h2>
                <div className="mt-10">
                    <button
                        type="button"
                        onClick={scrollToDownload}
                        data-track="closing-download"
                        className="group inline-flex items-center gap-2 rounded-full bg-secondary-navy px-7 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/15"
                    >
                        <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
                        Download
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
