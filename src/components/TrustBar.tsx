"use client";

import { motion } from "framer-motion";

export function TrustBar() {
    return (
        <section className="py-12 bg-white border-y border-slate-100 overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto mb-8 text-center">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Supported by</p>
            </div>
            <div className="flex items-center justify-center gap-16 opacity-80 hover:opacity-100 transition-opacity duration-500">
                {/* Xiji Incubator */}
                <div className="relative h-16 w-48 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                        src="/logos/logo-xiji-incubator.jpg"
                        alt="Xiji Incubator"
                        className="object-contain w-full h-full"
                    />
                </div>

                {/* Universidad de Sevilla */}
                <div className="relative h-20 w-48 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                        src="/logos/University-of-Seville-980x999.png"
                        alt="Universidad de Sevilla"
                        className="object-contain w-full h-full"
                    />
                </div>

                {/* Barner Brand */}
                <div className="relative h-16 w-48 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                        src="/logos/barner_logo_mobile.svg"
                        alt="Barner Brand"
                        className="object-contain w-full h-full"
                    />
                </div>

                {/* OIE */}
                <div className="relative h-16 w-48 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                        src="/logos/oie_logo.png"
                        alt="OIE"
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>
        </section>
    );
}
