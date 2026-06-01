"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./Button";
import { Check } from "lucide-react";
import Link from 'next/link';
import { siteConfig } from '@/lib/site';

type Tier = {
    name: string;
    price: string;
    /** Suffix shown next to the price, e.g. "/seat / mo". Omit for free tiers. */
    priceSuffix?: string;
    id: string;
    desc: string;
    features: string[];
    featured?: boolean;
    cta: string;
    ctaType: "download" | "link";
    /** Override default `/login?plan=…` destination. */
    ctaHref?: string;
};

const individualTiers: Tier[] = [
    {
        name: "FREE",
        price: "Free",
        id: "free",
        desc: "For individuals who want to understand their focus patterns",
        features: [
            "100% local. Your data never leaves your machine",
            "Open source. Free forever",
            "Cognitive health tracking",
            "Deep focus detection",
            "Pattern learning on device",
        ],
        cta: "Download Free",
        ctaType: "download",
    },
    {
        name: "PRO",
        price: "€12",
        priceSuffix: "/ mo",
        id: "individual-pro",
        desc: "For individuals who want deeper, cloud-powered analysis",
        features: [
            "Everything in Free",
            "Cloud-powered deeper AI analysis",
            "Advanced cognitive insights",
            "Longer history & trends",
            "Priority support",
        ],
        featured: true,
        cta: "Start Pro Trial",
        ctaType: "link",
        ctaHref: siteConfig.proTrialUrl,
    },
];

const teamTiers: Tier[] = [
    {
        name: "SIMPLE",
        price: "€12",
        priceSuffix: "/ seat / mo",
        id: "teams-simple",
        desc: "For small teams getting started with shared focus insights",
        features: [
            "Everything in Individual Pro",
            "Team collaboration features",
            "Shared cognitive health reports",
            "Email support",
        ],
        cta: "Start Simple",
        ctaType: "link",
    },
    {
        name: "PRO",
        price: "€16",
        priceSuffix: "/ seat / mo",
        id: "teams-pro",
        desc: "For growing teams that need deeper analysis and collaboration",
        features: [
            "Everything in Simple",
            "Advanced team analytics",
            "Burnout & overload alerts",
            "Admin controls",
            "Priority support",
        ],
        featured: true,
        cta: "Start Pro Trial",
        ctaType: "link",
        ctaHref: siteConfig.proTrialUrl,
    },
    {
        name: "ENTERPRISE",
        price: "€50",
        priceSuffix: "/ seat / mo",
        id: "teams-enterprise",
        desc: "For organizations with security, scale, and compliance needs",
        features: [
            "Everything in Pro",
            "SSO & audit trails",
            "Custom DPAs & compliance",
            "Dedicated success engineer",
            "Onboarding & rollout support",
        ],
        cta: "Contact Sales",
        ctaType: "link",
    },
];

function scrollToDownload() {
    document.getElementById("download")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

function TierCard({ tier, idx }: { tier: Tier; idx: number }) {
    const ctaHref = tier.ctaHref ?? `/login?plan=${tier.id}`;
    const isExternal = ctaHref.startsWith('http');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.12 }}
            whileHover={{ scale: 1.03 }}
            className={`relative p-8 rounded-2xl border ${tier.featured ? 'border-primary-cyan shadow-[0_0_40px_rgba(56,189,248,0.1)]' : 'border-slate-200 shadow-lg'} bg-white flex flex-col h-full`}
        >
            {tier.featured && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <span className="px-3 py-1 bg-primary-cyan text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        MOST POPULAR
                    </span>
                </div>
            )}
            <h3 className="text-sm font-bold tracking-widest text-slate-400 mb-2">{tier.name}</h3>
            <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-secondary-navy">{tier.price}</span>
                {tier.priceSuffix && <span className="text-slate-500 ml-1">{tier.priceSuffix}</span>}
            </div>
            <p className="text-slate-500 mb-6 text-sm">{tier.desc}</p>

            {tier.ctaType === "download" ? (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-8"
                    onClick={scrollToDownload}
                >
                    {tier.cta}
                </Button>
            ) : isExternal ? (
                <a
                    href={ctaHref}
                    className="w-full mb-8 block"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant={tier.featured ? "primary" : "outline"} className="w-full">
                        {tier.cta}
                    </Button>
                </a>
            ) : (
                <Link href={ctaHref} className="w-full mb-8 block">
                    <Button variant={tier.featured ? "primary" : "outline"} className="w-full">
                        {tier.cta}
                    </Button>
                </Link>
            )}

            <div className="space-y-3 flex-1">
                {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 text-sm text-secondary-navy">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feat}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

const audiences = [
    { id: "individual", label: "Individual" },
    { id: "teams", label: "Teams" },
] as const;

type Audience = (typeof audiences)[number]["id"];

export function Pricing() {
    const [audience, setAudience] = useState<Audience>("individual");
    const tiers = audience === "individual" ? individualTiers : teamTiers;
    const gridCols = audience === "individual"
        ? "md:grid-cols-2 max-w-4xl"
        : "md:grid-cols-3 max-w-6xl";

    return (
        <section id="pricing" className="py-24">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-secondary-navy">
                        Start free. Upgrade when you need more.
                    </h2>
                    <p className="text-slate-500">Free is free forever. Pro adds cloud-powered analysis, and team plans scale with you.</p>
                </div>

                {/* Audience toggle */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200">
                        {audiences.map((a) => (
                            <button
                                key={a.id}
                                type="button"
                                onClick={() => setAudience(a.id)}
                                className="relative px-6 py-2 text-sm font-semibold rounded-full transition-colors"
                            >
                                {audience === a.id && (
                                    <motion.span
                                        layoutId="pricing-toggle-pill"
                                        className="absolute inset-0 rounded-full bg-white shadow-sm border border-slate-200"
                                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                    />
                                )}
                                <span className={`relative z-10 ${audience === a.id ? "text-secondary-navy" : "text-slate-500"}`}>
                                    {a.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={audience}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className={`grid grid-cols-1 ${gridCols} gap-8 mx-auto items-stretch`}
                    >
                        {tiers.map((tier, idx) => (
                            <TierCard key={tier.id} tier={tier} idx={idx} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
