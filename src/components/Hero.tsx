"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./Button";
import { ArrowRight, Play, MousePointer2, PenTool, Square, Type, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Animation durations (in seconds)
const STEP_DURATION = 2.5;

const animationSteps = [
    { id: 1, name: "Creating Navigation Bar", element: "navbar" },
    { id: 2, name: "Adding Logo & Brand", element: "logo" },
    { id: 3, name: "Placing Hero Headline", element: "headline" },
    { id: 4, name: "Adding CTA Buttons", element: "cta" },
    { id: 5, name: "Importing Hero Image", element: "image" },
];

// Cursor positions as PERCENTAGES of canvas container
const componentPositions: Record<string, { xPercent: number; yPercent: number }> = {
    navbar: { xPercent: 70, yPercent: 12 },
    logo: { xPercent: 12, yPercent: 12 },
    headline: { xPercent: 25, yPercent: 38 },
    cta: { xPercent: 20, yPercent: 65 },
    image: { xPercent: 78, yPercent: 50 },
};

export function Hero() {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showClick, setShowClick] = useState(false);
    const [elementVisible, setElementVisible] = useState<Set<string>>(new Set());
    const [logVisible, setLogVisible] = useState<Set<string>>(new Set());
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);
    const totalSteps = animationSteps.length;

    // Calculate pixel position from percentage
    const updateCursorPosition = (element: string) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const pos = componentPositions[element];

        if (pos) {
            setCursorPos({
                x: (rect.width * pos.xPercent) / 100,
                y: (rect.height * pos.yPercent) / 100,
            });
        }
    };

    useEffect(() => {
        // Initial delay before starting
        const startDelay = setTimeout(() => {
            // Start the animation cycle
            const interval = setInterval(() => {
                setCurrentStep((prev) => {
                    const nextStep = (prev + 1) % (totalSteps + 1);

                    if (nextStep === 0) {
                        setProgress(0);
                        setElementVisible(new Set());
                        setLogVisible(new Set());
                        updateCursorPosition("navbar");
                        return 0;
                    }

                    const elementToPlace = animationSteps[nextStep - 1]?.element;

                    // Move cursor to target position
                    updateCursorPosition(elementToPlace);

                    // Sequence: cursor moves -> click -> element appears -> log appears
                    setTimeout(() => {
                        setShowClick(true);

                        setTimeout(() => {
                            setShowClick(false);
                            // Element appears after click
                            setElementVisible(prev => new Set(prev).add(elementToPlace));

                            // Log appears AFTER element
                            setTimeout(() => {
                                setLogVisible(prev => new Set(prev).add(elementToPlace));
                            }, 200);
                        }, 300);
                    }, 700);

                    return nextStep;
                });
            }, STEP_DURATION * 1000);

            return () => clearInterval(interval);
        }, 1000); // 1 second initial delay

        return () => clearTimeout(startDelay);
    }, [totalSteps]);

    // Recalculate on resize
    useEffect(() => {
        const handleResize = () => {
            if (currentStep > 0) {
                const element = animationSteps[currentStep - 1]?.element;
                if (element) updateCursorPosition(element);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentStep]);

    // Initial position
    useEffect(() => {
        updateCursorPosition("navbar");
    }, []);

    useEffect(() => {
        setProgress(Math.round((logVisible.size / totalSteps) * 100));
    }, [logVisible.size, totalSteps]);

    const isElementVisible = (element: string) => elementVisible.has(element);
    const isLogVisible = (element: string) => logVisible.has(element);

    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 bg-gradient-to-b from-slate-50 to-white">

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center mx-auto">

                {/* Headline - Compact */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 font-heading text-secondary-navy"
                >
                    Finally understand{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-navy to-primary-teal">
                        what your team accomplishes
                    </span>
                </motion.h1>

                {/* MAIN: Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative w-full max-w-5xl mx-auto mt-8"
                >
                    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-[480px]">

                        {/* LEFT: Light Mode Canvas */}
                        <div className="flex-1 bg-slate-100 p-4 border-b md:border-b-0 md:border-r border-slate-200 relative overflow-hidden flex flex-col min-h-[380px] md:min-h-0">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-3 bg-white -mx-4 -mt-4 px-4 pt-4 rounded-tl-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="h-5 w-[1px] bg-slate-200 mx-2"></div>
                                    <MousePointer2 className="w-4 h-4 text-blue-500" />
                                    <Square className="w-4 h-4 text-slate-400" />
                                    <Type className="w-4 h-4 text-slate-400" />
                                    <PenTool className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-xs text-slate-400 font-mono">FlowSight_Landing.fig</span>
                            </div>

                            {/* Canvas */}
                            <div
                                ref={canvasRef}
                                className="relative flex-1 bg-slate-50 rounded-lg overflow-hidden border border-slate-200 shadow-inner"
                            >
                                {/* The "Webpage" being designed */}
                                <div className="absolute inset-4 bg-white rounded-lg shadow-sm overflow-hidden border border-slate-100">

                                    {/* NAVBAR */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={isElementVisible("navbar") ? { opacity: 1 } : { opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-10 bg-slate-800 flex items-center px-4 justify-between"
                                    >
                                        {/* LOGO */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={isElementVisible("logo") ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="w-5 h-5 rounded bg-primary-cyan"></div>
                                            <span className="text-white text-[10px] font-bold">FlowSight</span>
                                        </motion.div>
                                        <div className="flex gap-3">
                                            <div className="w-10 h-2 bg-slate-600 rounded"></div>
                                            <div className="w-10 h-2 bg-slate-600 rounded"></div>
                                            <div className="w-14 h-6 bg-primary-cyan rounded text-[8px] text-white flex items-center justify-center font-medium">Try Free</div>
                                        </div>
                                    </motion.div>

                                    {/* HERO CONTENT */}
                                    <div className="p-5 flex gap-5 h-[calc(100%-2.5rem)]">
                                        <div className="flex-1 flex flex-col justify-center gap-2">
                                            {/* HEADLINE */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={isElementVisible("headline") ? { opacity: 1 } : { opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-1.5"
                                            >
                                                <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
                                                <div className="h-4 w-2/3 bg-gradient-to-r from-primary-cyan to-primary-teal rounded"></div>
                                                <div className="h-2 w-full bg-slate-200 rounded mt-3"></div>
                                                <div className="h-2 w-4/5 bg-slate-200 rounded"></div>
                                                <div className="h-2 w-3/5 bg-slate-200 rounded"></div>
                                            </motion.div>

                                            {/* CTA BUTTONS */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={isElementVisible("cta") ? { opacity: 1 } : { opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex gap-2 mt-4"
                                            >
                                                <div className="h-7 w-20 bg-primary-cyan rounded-md shadow-sm flex items-center justify-center gap-1">
                                                    <Play className="w-3 h-3 text-white fill-white" />
                                                    <span className="text-[7px] text-white font-medium">Demo</span>
                                                </div>
                                                <div className="h-7 w-20 bg-white border-2 border-slate-200 rounded-md flex items-center justify-center">
                                                    <span className="text-[7px] text-slate-600 font-medium">Try Free</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Hero Image */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={isElementVisible("image") ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="hidden sm:flex w-2/5 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 rounded-xl items-center justify-center border border-slate-200 shadow-inner"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                                                <ImageIcon className="w-6 h-6 text-slate-400" />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Animated Cursor - hidden on small screens */}
                                <motion.div
                                    animate={{
                                        x: cursorPos.x,
                                        y: cursorPos.y,
                                    }}
                                    transition={{
                                        duration: 0.7,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute z-20 pointer-events-none hidden sm:block"
                                    style={{ top: 0, left: 0 }}
                                >
                                    <MousePointer2 className="w-5 h-5 text-slate-600 fill-blue-500 drop-shadow-md" />
                                    <div className="ml-5 -mt-1 bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">Manuel C.</div>

                                    {/* Click Animation */}
                                    <AnimatePresence>
                                        {showClick && (
                                            <motion.div
                                                initial={{ scale: 0.3, opacity: 1 }}
                                                animate={{ scale: 2.5, opacity: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute top-0 left-0 w-5 h-5 rounded-full bg-blue-400/60 border-2 border-blue-500/50"
                                                style={{ transform: 'translate(-50%, -50%)' }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>

                        {/* RIGHT: FlowSight Real-time Analysis */}
                        <div className="w-full md:w-72 bg-slate-50 flex flex-col md:border-l border-slate-200">
                            <div className="p-3 border-b border-slate-200 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded bg-primary-teal flex items-center justify-center text-white text-[10px] font-bold">F</div>
                                    <span className="font-bold text-secondary-navy text-sm">Real-time Tracking</span>
                                </div>
                                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-medium animate-pulse">
                                    ● LIVE
                                </span>
                            </div>

                            <div className="flex-1 p-3 flex flex-col">
                                {/* Progress Card */}
                                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-3">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <h4 className="text-xs font-bold text-secondary-navy">Landing Page Design</h4>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                            className="bg-gradient-to-r from-primary-cyan to-primary-teal h-full rounded-full"
                                        />
                                    </div>
                                    <div className="flex justify-between text-[9px] text-slate-400 mt-1.5">
                                        <span>Session: 45m</span>
                                        <span>Focus: 94%</span>
                                    </div>
                                </div>

                                {/* Live Activity Log - Only shows AFTER element appears */}
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Activity Stream</p>
                                <div className="space-y-1.5">
                                    {animationSteps.map((step) => (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, x: 15 }}
                                            animate={isLogVisible(step.element) ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
                                            transition={{ duration: 0.4 }}
                                            className={`flex gap-2 items-center p-2 rounded-lg border transition-all ${isLogVisible(step.element) && !logVisible.has(animationSteps[animationSteps.indexOf(step) + 1]?.element)
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-white border-slate-100'
                                                }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLogVisible(step.element) && !logVisible.has(animationSteps[animationSteps.indexOf(step) + 1]?.element)
                                                ? 'bg-blue-500 animate-pulse'
                                                : 'bg-green-500'
                                                }`}></div>
                                            <p className="text-[10px] font-medium text-secondary-navy">{step.name}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* Subheadline & CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-12 flex flex-col items-center"
                >
                    <p className="text-lg text-slate-500 max-w-xl mb-6 leading-relaxed">
                        AI-powered reporting for distributed teams.{" "}
                        Zero manual tracking.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="group bg-white">
                                Start Free Trial
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
