'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileBarChart,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
    const [expanded, setExpanded] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 1024) setMobileOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('flowsight_user');
        localStorage.removeItem('integrations');
        sessionStorage.clear();
        router.push('/login');
    };

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white rounded-xl shadow-card
                    text-zinc-500 hover:text-zinc-700 transition-colors"
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            {/* Mobile backdrop */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40
                    transition-opacity duration-300
                    ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Mobile sidebar (overlay) */}
            <aside
                className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white z-50
                    flex flex-col shadow-elevated transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-5 pt-5 pb-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                        onClick={() => setMobileOpen(false)}
                    >
                        <Image
                            src="/flowsight_sinfondo.png"
                            alt="FlowSight"
                            width={36}
                            height={36}
                            className="flex-shrink-0"
                        />
                        <span className="text-lg font-semibold text-zinc-900 tracking-tight">
                            FlowSight
                        </span>
                    </Link>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 px-3">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-xl
                                            transition-all duration-150
                                            ${isActive
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                                            }`}
                                    >
                                        <Icon
                                            size={20}
                                            strokeWidth={isActive ? 2 : 1.5}
                                            className="flex-shrink-0"
                                        />
                                        <span className={`text-[15px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-3 border-t border-zinc-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl w-full
                            text-zinc-400 hover:text-red-500 hover:bg-red-50
                            transition-all duration-150"
                    >
                        <LogOut size={20} strokeWidth={1.5} className="flex-shrink-0" />
                        <span className="text-[15px] font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:block fixed top-0 left-0 z-30
                    transition-all duration-300 ease-in-out
                    ${expanded ? 'w-[260px]' : 'w-[80px]'} h-screen`}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
                <div
                    className={`flex flex-col h-full transition-all duration-300 ease-in-out
                        ${expanded
                            ? 'bg-white shadow-elevated rounded-none m-0'
                            : 'bg-[#F0F0F3] rounded-[20px] m-2'
                        }`}
                >
                    {/* Logo */}
                    <div className={`${expanded ? 'px-5 pt-6 pb-7' : 'flex justify-center pt-6 pb-7'}`}>
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <Image
                                src="/flowsight_sinfondo.png"
                                alt="FlowSight"
                                width={36}
                                height={36}
                                className="flex-shrink-0"
                            />
                            {expanded && (
                                <span className="text-lg font-semibold text-zinc-900 tracking-tight whitespace-nowrap">
                                    FlowSight
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Nav */}
                    <nav className={`flex-1 ${expanded ? 'px-3' : 'px-2'}`}>
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href ||
                                    (item.href !== '/dashboard' && pathname.startsWith(item.href));

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 rounded-xl transition-all duration-150
                                                ${expanded
                                                    ? `px-3 py-2.5 ${isActive
                                                        ? 'bg-indigo-50 text-indigo-600'
                                                        : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                                                    }`
                                                    : `justify-center py-2.5 ${isActive
                                                        ? 'text-indigo-600 bg-white'
                                                        : 'text-zinc-400 hover:text-zinc-600 hover:bg-white/60'
                                                    }`
                                                }`}
                                            title={!expanded ? item.label : undefined}
                                        >
                                            <Icon
                                                size={20}
                                                strokeWidth={isActive ? 2 : 1.5}
                                                className="flex-shrink-0"
                                            />
                                            {expanded && (
                                                <span className={`text-[14px] whitespace-nowrap
                                                    ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                                    {item.label}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className={expanded ? 'p-3' : 'p-2 pb-4'}>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 rounded-xl w-full transition-all duration-150
                                ${expanded
                                    ? 'px-3 py-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50'
                                    : 'justify-center py-2.5 text-zinc-400 hover:text-red-500 hover:bg-white/60'
                                }`}
                            title={!expanded ? 'Logout' : undefined}
                        >
                            <LogOut size={20} strokeWidth={1.5} className="flex-shrink-0" />
                            {expanded && (
                                <span className="text-[14px] font-medium whitespace-nowrap">
                                    Logout
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
