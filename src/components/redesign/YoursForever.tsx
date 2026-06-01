"use client";

import { motion } from "framer-motion";

const statements = [
    {
        heading: "Everything stays local.",
        body: "FlowSight runs on your own machine. Your screen activity is processed on device, and nothing is uploaded unless you decide to share a report.",
    },
    {
        heading: "Privacy-first by design.",
        body: "No keystroke logging, no mouse surveillance, no hidden live feed. The Free version is 100% local; Pro adds cloud-powered analysis only when you opt in.",
    },
    {
        heading: "Open source. Never locked in.",
        body: "The code is open to inspect, so behavior matches what you reviewed. You own your data and your insights, forever.",
    },
];

export function YoursForever() {
    return (
        <section id="privacy" className="px-6 py-24 md:py-32">
            <div className="mx-auto max-w-4xl">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center text-3xl font-semibold lowercase tracking-tight text-slate-400 md:text-4xl"
                >
                    yours forever
                </motion.h2>

                <div className="space-y-20">
                    {statements.map((s, idx) => (
                        <motion.div
                            key={s.heading}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-center"
                        >
                            <h3 className="mb-4 font-serif text-4xl font-bold tracking-tight text-secondary-navy md:text-5xl">
                                {s.heading}
                            </h3>
                            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl">
                                {s.body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
