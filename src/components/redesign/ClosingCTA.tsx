"use client";

import { motion } from "framer-motion";
import { SmartDownloadButton } from "@/components/SmartDownloadButton";

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
                    <SmartDownloadButton trackKey="closing-download" />
                </div>
            </motion.div>
        </section>
    );
}
