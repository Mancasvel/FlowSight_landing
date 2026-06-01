"use client";

import { motion } from "framer-motion";
import { DesktopFrame } from "./AppScreens";
import { SmartDownloadButton } from "@/components/SmartDownloadButton";

export function RedesignHero() {
    return (
        <section className="relative overflow-hidden px-6 pt-24 pb-16 text-center md:pt-28">

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.05 }}
                    className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-secondary-navy sm:text-5xl md:text-6xl"
                >
                    Privacy-first AI
                    <br />
                    for cognitive health
                    <br />
                    and deep focus
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-10"
                >
                    <SmartDownloadButton trackKey="hero-download" />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.32 }}
                className="relative z-10 mx-auto mt-12 w-full max-w-3xl"
            >
                <DesktopFrame />
            </motion.div>
        </section>
    );
}
