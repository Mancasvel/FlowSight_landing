'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember, developerHourlyActivity, developerTickets } from '@/lib/mockData';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface DeveloperModalProps {
    member: TeamMember | null;
    onClose: () => void;
}

export default function DeveloperModal({ member, onClose }: DeveloperModalProps) {
    if (!member) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-dashboard-card border border-dashboard-border rounded-xl 
                     w-full max-w-3xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-dashboard-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-teal 
                            rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-dashboard-text">{member.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={member.isOnline ? 'status-online' : 'status-offline'} />
                                    <span className="text-sm text-dashboard-muted">
                                        {member.isOnline ? 'Online' : 'Offline'}
                                        {member.currentActivity && ` · ${member.currentActivity}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-dashboard-muted hover:text-dashboard-text 
                       hover:bg-dashboard-bg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 p-6 border-b border-dashboard-border">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-dashboard-text">{member.todayHours}h</div>
                            <div className="text-sm text-dashboard-muted">Today</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-dashboard-text">{member.weekHours}h</div>
                            <div className="text-sm text-dashboard-muted">This Week</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-dashboard-text">{member.monthHours}h</div>
                            <div className="text-sm text-dashboard-muted">This Month</div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[50vh] dark-scrollbar space-y-6">
                        {/* Activity Chart */}
                        <div>
                            <h3 className="text-sm font-semibold text-dashboard-muted uppercase tracking-wide mb-4">
                                Activity by Hour (Today)
                            </h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={developerHourlyActivity}>
                                        <XAxis
                                            dataKey="hour"
                                            stroke="#94A3B8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#94A3B8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            width={30}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1E293B',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#F8FAFC'
                                            }}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="Focus"
                                            stackId="1"
                                            stroke="#10B981"
                                            fill="#10B981"
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="Design"
                                            stackId="1"
                                            stroke="#8B5CF6"
                                            fill="#8B5CF6"
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="Meeting"
                                            stackId="1"
                                            stroke="#F59E0B"
                                            fill="#F59E0B"
                                            fillOpacity={0.6}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Tickets Worked */}
                        <div>
                            <h3 className="text-sm font-semibold text-dashboard-muted uppercase tracking-wide mb-4">
                                📋 Tickets Worked Today
                            </h3>
                            <div className="space-y-2">
                                {developerTickets.map((ticket) => (
                                    <div
                                        key={ticket.key}
                                        className="flex items-center justify-between p-3 rounded-lg bg-dashboard-bg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-primary-blue font-mono text-sm">{ticket.key}</span>
                                            <span className="text-dashboard-text">&quot;{ticket.title}&quot;</span>
                                        </div>
                                        <span className="text-dashboard-muted font-mono">{ticket.hours}h</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Summaries */}
                        <div>
                            <h3 className="text-sm font-semibold text-dashboard-muted uppercase tracking-wide mb-4">
                                📝 Recent Activity Summaries
                            </h3>
                            <ul className="space-y-2 text-dashboard-muted">
                                <li className="flex items-start gap-2">
                                    <span className="text-dashboard-muted">•</span>
                                    Working on fixing OAuth token refresh in jira.rs
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-dashboard-muted">•</span>
                                    Reduced polling frequency from 5s to 30s
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-dashboard-muted">•</span>
                                    Updated AI prompt to include task context
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
