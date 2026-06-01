"use client";

import { motion } from "framer-motion";
import { FocusListMockup, MetricsDbMockup, ReportDocMockup } from "./mockups";

const cards = [
    {
        title: "Focus Tracking",
        description:
            "See deep work blocks, context switches, and interruption load, all only on your own device.",
        visual: <FocusListMockup />,
    },
    {
        title: "Cognitive Reports",
        description:
            "Clear weekly summaries of how you worked, ready to share when you decide, never before.",
        visual: <div className="flex h-full items-center justify-center"><ReportDocMockup /></div>,
    },
    {
        title: "Pattern Insights",
        description:
            "Track focus streaks, deep work hours, and overload signals to manage your attention over time.",
        visual: <div className="flex h-full items-center justify-center"><MetricsDbMockup /></div>,
    },
];

export function FeatureTriad() {
    return (
        <section id="features" className="px-6 py-20 md:py-28">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
                {/* Big text-only card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 md:p-12"
                >
                    <h2 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight text-secondary-navy md:text-5xl">
                        track,
                        <br />
                        understand,
                        <br />
                        protect
                    </h2>
                </motion.div>

                {/* First feature card sits next to the text card */}
                <FeatureCard card={cards[0]} idx={0} />
                <FeatureCard card={cards[1]} idx={1} />
                <FeatureCard card={cards[2]} idx={2} />
            </div>
        </section>
    );
}

function FeatureCard({ card, idx }: { card: (typeof cards)[number]; idx: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8"
        >
            <div className="mb-6 min-h-[180px] flex-1">{card.visual}</div>
            <h3 className="mb-2 text-center font-serif text-xl font-semibold text-secondary-navy">{card.title}</h3>
            <p className="mx-auto max-w-xs text-center text-sm leading-relaxed text-slate-500">
                {card.description}
            </p>
        </motion.div>
    );
}
