'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileBarChart,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/team', label: 'Team', icon: Users },
    { href: '/dashboard/reports', label: 'Reports', icon: FileBarChart },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('flowsight_user');
        localStorage.removeItem('integrations');
        sessionStorage.clear();
        router.push('/login');
    };

    return (
        <aside
            className={`${collapsed ? 'w-20' : 'w-64'} h-screen bg-dashboard-card border-r border-dashboard-border 
                 flex flex-col transition-all duration-300 relative`}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 w-6 h-6 bg-dashboard-card border border-dashboard-border 
                   rounded-full flex items-center justify-center text-dashboard-muted hover:text-dashboard-text
                   transition-colors z-10"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo */}
            <div className={`p-6 ${collapsed ? 'px-4' : ''}`}>
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-teal rounded-lg 
                        flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xl">F</span>
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold text-dashboard-text">FlowSight</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                                            ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/30'
                                            : 'text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-border/50'
                                        }
                            ${collapsed ? 'justify-center px-3' : ''}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <Icon size={20} className="flex-shrink-0" />
                                    {!collapsed && <span className="font-medium">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-dashboard-border">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full
                     text-dashboard-muted hover:text-accent-red hover:bg-accent-red/10
                     transition-all duration-200
                     ${collapsed ? 'justify-center px-3' : ''}`}
                    title={collapsed ? 'Logout' : undefined}
                >
                    <LogOut size={20} className="flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
