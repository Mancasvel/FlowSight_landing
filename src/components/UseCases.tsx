"use client";

import { motion } from "framer-motion";
import { PenTool, FileText, Code, MousePointer2, Image as ImageIcon, GitBranch, MessageSquare, Megaphone, DollarSign, Layout, BarChart3, TrendingUp, CheckSquare, Calendar } from "lucide-react";

const workMockups = [
    {
        id: 1,
        title: "Design Teams",
        description: "Track billable hours automatically. Know design iteration time.",
        icon: <PenTool className="w-5 h-5" />,
        color: "bg-primary-cyan",
        mockup: "figma",
    },
    {
        id: 2,
        title: "Content Teams",
        description: "Word count tracking and research time analysis.",
        icon: <FileText className="w-5 h-5" />,
        color: "bg-primary-teal",
        mockup: "docs",
    },
    {
        id: 3,
        title: "Marketing Teams",
        description: "Campaign flow tracking and asset management insights.",
        icon: <Megaphone className="w-5 h-5" />,
        color: "bg-accent-orange",
        mockup: "marketing",
    },
    {
        id: 4,
        title: "Sales Teams",
        description: "CRM activity logging and call duration analytics.",
        icon: <DollarSign className="w-5 h-5" />,
        color: "bg-accent-green",
        mockup: "sales",
    },
    {
        id: 5,
        title: "Project Managers",
        description: "Kanban board movement and ticket resolution timing.",
        icon: <Layout className="w-5 h-5" />,
        color: "bg-blue-500",
        mockup: "kanban",
    },
    {
        id: 6,
        title: "Engineering Teams",
        description: "Git commit patterns, reading documentation and coding focus time.",
        icon: <Code className="w-5 h-5" />,
        color: "bg-secondary-navy",
        mockup: "code",
    },
];

// Figma-style mockup
function FigmaMockup() {
    return (
        <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden">
            <div className="h-6 bg-white border-b border-slate-200 flex items-center px-2 gap-2">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[8px] text-slate-400 ml-auto">Design.fig</span>
            </div>
            <div className="p-3 h-[calc(100%-1.5rem)]">
                <div className="bg-white rounded shadow-sm h-full p-2 relative">
                    <div className="h-4 bg-slate-800 rounded flex items-center px-2 justify-between mb-2">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded bg-primary-cyan"></div>
                            <div className="w-6 h-1 bg-white/60 rounded"></div>
                        </div>
                        <div className="w-8 h-2 bg-primary-cyan rounded"></div>
                    </div>
                    <div className="flex gap-2 h-[calc(100%-1.5rem)]">
                        <div className="flex-1 space-y-1">
                            <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                            <div className="h-2 w-1/2 bg-gradient-to-r from-primary-cyan to-primary-teal rounded"></div>
                            <div className="flex gap-1 mt-2">
                                <div className="h-3 w-8 bg-primary-cyan rounded"></div>
                                <div className="h-3 w-8 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="w-1/3 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                    <MousePointer2 className="w-3 h-3 fill-blue-500 text-slate-600 absolute bottom-4 right-8" />
                </div>
            </div>
        </div>
    );
}

// Google Docs-style mockup
function DocsMockup() {
    return (
        <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden">
            <div className="h-6 bg-white border-b border-slate-200 flex items-center px-2 gap-2">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <FileText className="w-3 h-3 text-blue-500 ml-2" />
                <span className="text-[8px] text-slate-400 ml-auto">Article Draft</span>
            </div>
            <div className="p-3 h-[calc(100%-1.5rem)] bg-slate-200">
                <div className="bg-white rounded shadow-sm h-full p-3">
                    <div className="h-3 w-2/3 bg-slate-800 rounded mb-3"></div>
                    <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                        <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                        <div className="h-1.5 w-4/5 bg-slate-300 rounded"></div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                        <div className="h-2 w-16 bg-yellow-200 rounded"></div>
                        <MessageSquare className="w-3 h-3 text-yellow-600" />
                    </div>
                    <div className="space-y-1 mt-2">
                        <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                        <div className="h-1.5 w-3/4 bg-slate-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Marketing dashboard mockup
function MarketingMockup() {
    return (
        <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-slate-200">
            <div className="h-6 bg-slate-50 border-b border-slate-200 flex items-center px-2 gap-2">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <BarChart3 className="w-3 h-3 text-orange-500 ml-2" />
                <span className="text-[8px] text-slate-400 ml-auto">Analytics</span>
            </div>
            <div className="p-3 h-[calc(100%-1.5rem)]">
                <div className="flex gap-2 mb-2">
                    <div className="flex-1 bg-orange-50 rounded p-2 border border-orange-100">
                        <div className="text-[8px] text-orange-600 font-medium">Views</div>
                        <div className="text-sm font-bold text-slate-800">12.4K</div>
                    </div>
                    <div className="flex-1 bg-green-50 rounded p-2 border border-green-100">
                        <div className="text-[8px] text-green-600 font-medium">Clicks</div>
                        <div className="text-sm font-bold text-slate-800">2.1K</div>
                    </div>
                </div>
                <div className="bg-slate-50 rounded p-2 h-[calc(100%-3.5rem)]">
                    <div className="flex items-end gap-1 h-full justify-center">
                        <div className="w-3 h-[30%] bg-orange-300 rounded-t"></div>
                        <div className="w-3 h-[50%] bg-orange-400 rounded-t"></div>
                        <div className="w-3 h-[70%] bg-orange-500 rounded-t"></div>
                        <div className="w-3 h-[60%] bg-orange-400 rounded-t"></div>
                        <div className="w-3 h-[80%] bg-orange-500 rounded-t"></div>
                        <div className="w-3 h-[90%] bg-orange-600 rounded-t"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sales CRM mockup
function SalesMockup() {
    return (
        <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-slate-200">
            <div className="h-6 bg-slate-50 border-b border-slate-200 flex items-center px-2 gap-2">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <TrendingUp className="w-3 h-3 text-green-500 ml-2" />
                <span className="text-[8px] text-slate-400 ml-auto">CRM</span>
            </div>
            <div className="p-2 h-[calc(100%-1.5rem)] space-y-1.5">
                {/* Deal rows */}
                <div className="flex items-center gap-2 p-1.5 bg-green-50 rounded border border-green-100">
                    <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center">
                        <span className="text-[8px] text-green-700">AC</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-[9px] font-medium text-slate-700">Acme Corp</div>
                        <div className="text-[7px] text-green-600">$45,000 • Won</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 bg-blue-50 rounded border border-blue-100">
                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-[8px] text-blue-700">TI</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-[9px] font-medium text-slate-700">Tech Inc</div>
                        <div className="text-[7px] text-blue-600">$28,000 • Proposal</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 bg-yellow-50 rounded border border-yellow-100">
                    <div className="w-5 h-5 rounded-full bg-yellow-200 flex items-center justify-center">
                        <span className="text-[8px] text-yellow-700">GS</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-[9px] font-medium text-slate-700">Global Solutions</div>
                        <div className="text-[7px] text-yellow-600">$62,000 • Negotiation</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Kanban board mockup
function KanbanMockup() {
    return (
        <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden">
            <div className="h-6 bg-white border-b border-slate-200 flex items-center px-2 gap-2">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <Layout className="w-3 h-3 text-blue-500 ml-2" />
                <span className="text-[8px] text-slate-400 ml-auto">Sprint Board</span>
            </div>
            <div className="p-2 h-[calc(100%-1.5rem)] flex gap-2">
                {/* Todo Column */}
                <div className="flex-1 bg-slate-200 rounded p-1.5">
                    <div className="text-[8px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> To Do
                    </div>
                    <div className="space-y-1">
                        <div className="bg-white rounded p-1.5 shadow-sm">
                            <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                        </div>
                        <div className="bg-white rounded p-1.5 shadow-sm">
                            <div className="h-1.5 w-3/4 bg-slate-300 rounded"></div>
                        </div>
                    </div>
                </div>
                {/* In Progress Column */}
                <div className="flex-1 bg-blue-100 rounded p-1.5">
                    <div className="text-[8px] font-bold text-blue-700 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> In Progress
                    </div>
                    <div className="space-y-1">
                        <div className="bg-white rounded p-1.5 shadow-sm border-l-2 border-blue-500">
                            <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                        </div>
                    </div>
                </div>
                {/* Done Column */}
                <div className="flex-1 bg-green-100 rounded p-1.5">
                    <div className="text-[8px] font-bold text-green-700 mb-1.5 flex items-center gap-1">
                        <CheckSquare className="w-2.5 h-2.5" /> Done
                    </div>
                    <div className="space-y-1">
                        <div className="bg-white rounded p-1.5 shadow-sm opacity-75">
                            <div className="h-1.5 w-full bg-green-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// VS Code-style mockup
function CodeMockup() {
    return (
        <div className="w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden">
            <div className="h-6 bg-[#323232] border-b border-[#1e1e1e] flex items-center px-2 gap-2">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[8px] text-slate-400 ml-auto">app.tsx</span>
            </div>
            <div className="p-2 h-[calc(100%-1.5rem)] font-mono text-[7px] relative">
                <div className="flex">
                    <div className="text-slate-500 pr-2 select-none">1</div>
                    <div><span className="text-purple-400">import</span> <span className="text-blue-300">{'{ useState }'}</span> <span className="text-purple-400">from</span> <span className="text-orange-300">&apos;react&apos;</span></div>
                </div>
                <div className="flex">
                    <div className="text-slate-500 pr-2 select-none">2</div>
                    <div></div>
                </div>
                <div className="flex">
                    <div className="text-slate-500 pr-2 select-none">3</div>
                    <div><span className="text-purple-400">export</span> <span className="text-blue-400">function</span> <span className="text-yellow-300">App</span><span className="text-slate-400">()</span> <span className="text-slate-400">{'{'}</span></div>
                </div>
                <div className="flex">
                    <div className="text-slate-500 pr-2 select-none">4</div>
                    <div className="pl-3"><span className="text-purple-400">const</span> [<span className="text-blue-300">data</span>] = <span className="text-yellow-300">useState</span>([])</div>
                </div>
                <div className="flex">
                    <div className="text-slate-500 pr-2 select-none">5</div>
                    <div className="pl-3"><span className="text-purple-400">return</span> <span className="text-blue-400">{'<Main />'}</span></div>
                </div>
                <div className="flex">
                    <div className="text-slate-500 pr-2 select-none">6</div>
                    <div><span className="text-slate-400">{'}'}</span></div>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-green-400" />
                    <span className="text-[8px] text-green-400">main</span>
                </div>
            </div>
        </div>
    );
}

function getMockup(type: string) {
    switch (type) {
        case "figma": return <FigmaMockup />;
        case "docs": return <DocsMockup />;
        case "marketing": return <MarketingMockup />;
        case "sales": return <SalesMockup />;
        case "kanban": return <KanbanMockup />;
        case "code": return <CodeMockup />;
        default: return <FigmaMockup />;
    }
}

export function UseCases() {
    // Duplicate twice for smooth infinite scroll
    const duplicatedMockups = [...workMockups, ...workMockups, ...workMockups];

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-secondary-navy">
                        Built for remote knowledge workers
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Tailored insights for every role in your organization.
                    </p>
                </div>
            </div>

            {/* Infinite Horizontal Scrolling Mockups */}
            <div className="relative w-full">
                <motion.div
                    animate={{ x: ["0%", "-33.333%"] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                    className="flex gap-6"
                    style={{ width: "fit-content" }}
                >
                    {duplicatedMockups.map((item, idx) => (
                        <div
                            key={`${item.id}-${idx}`}
                            className="flex-shrink-0 w-[320px]"
                        >
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Mockup Area */}
                                <div className="h-[200px] p-3 bg-slate-50">
                                    {getMockup(item.mockup)}
                                </div>
                                {/* Card Info */}
                                <div className="p-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg ${item.color} text-white`}>
                                            {item.icon}
                                        </div>
                                        <h3 className="text-base font-bold text-secondary-navy">{item.title}</h3>
                                    </div>
                                    <p className="text-slate-500 text-sm">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
