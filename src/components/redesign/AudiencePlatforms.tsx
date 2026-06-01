"use client";

import { motion } from "framer-motion";
import { FocusListMockup } from "./mockups";

export function AudiencePlatforms() {
    return (
        <section className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-6xl">
                {/* Two-column: heading + mockup */}
                <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-secondary-navy md:text-5xl">
                            for high performers
                            <br />
                            who take their work
                            <br />
                            seriously
                        </h2>
                        <p className="mt-6 max-w-md text-lg text-slate-500">
                            Freelancers, students, startup teams, agencies, and distributed teams. Anyone doing focused knowledge work.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mx-auto w-full max-w-sm"
                    >
                        <FocusListMockup />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
