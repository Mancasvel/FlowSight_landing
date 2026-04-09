"use client";

import { Button } from "./Button";
import { ChevronDown } from "lucide-react";

function scrollToNextSection() {
    document.getElementById("about-flowsight")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 bg-gradient-to-b from-slate-50 to-white">
            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 font-heading text-secondary-navy">
                    Finally understand{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-navy to-primary-teal">
                        what your team accomplishes
                    </span>
                </h1>

                <div className="relative w-full max-w-5xl mx-auto mt-8">
                    <video
                        className="w-full rounded-2xl border border-slate-200 bg-black shadow-2xl object-contain max-h-[min(70vh,720px)]"
                        autoPlay
                        loop
                        playsInline
                        controls
                        preload="metadata"
                        aria-label="FlowSight product overview"
                    >
                        <source src="/enhanced.mp4" type="video/mp4" />
                    </video>
                </div>

                <div className="mt-12 flex flex-col items-center">
                    <p className="text-lg text-slate-500 max-w-xl mb-6 leading-relaxed">
                        AI-powered reporting for distributed teams. Zero manual tracking.
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="group bg-white"
                        onClick={scrollToNextSection}
                    >
                        More about FlowSight
                        <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" aria-hidden />
                    </Button>
                </div>
            </div>
        </section>
    );
}
