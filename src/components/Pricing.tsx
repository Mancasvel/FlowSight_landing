"use client";

import { motion } from "framer-motion";
import { Button } from "./Button";
import { Check } from "lucide-react";
import Link from 'next/link';

const tiers = [
    {
        name: "SIMPLE",
        price: "€12",
        id: "simple",
        desc: "For freelancers & individuals",
        features: ["Daily insights", "7-day history", "Self-hosted option", "Email support", "Jira Integration"],
    },
    {
        name: "ADVANCED",
        price: "€16",
        id: "advanced",
        desc: "For small distributed teams",
        features: ["Weekly AI reports", "Unlimited history", "Burnout alerts", "Slack integration", "Priority support"],
        featured: true,
    },
    {
        name: "BUSINESS",
        price: "€40",
        id: "business",
        desc: "For large organizations",
        features: ["Daily AI analysis", "Advanced analytics", "API Access", "SSO & Audit Logs", "Dedicated account manager"],
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-secondary-navy">
                        Simple, transparent pricing. Don't pay for extra add-ons.
                    </h2>
                    <p className="text-slate-500">Per seat / month. Cancel anytime.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
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
                                <span className="text-slate-500 ml-1">/seat</span>
                            </div>
                            <p className="text-slate-500 mb-6 text-sm">{tier.desc}</p>

                            <Link href={`/login?plan=${tier.id}`} className="w-full mb-8 block">
                                <Button variant={tier.featured ? "primary" : "outline"} className="w-full">
                                    Choose Plan
                                </Button>
                            </Link>

                            <div className="space-y-3 flex-1">
                                {tier.features.map((feat, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-3 text-sm text-secondary-navy">
                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        {feat}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
