'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Search,
    User,
    Settings,
    Bell,
    CheckCircle,
    Briefcase
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Job Feed', icon: Search, href: '/feed' },
    { label: 'Applied', icon: CheckCircle, href: '/applied' },
    { label: 'Profile', icon: User, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '/settings' },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0 bg-white dark:bg-zinc-950">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Briefcase size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">AI Job Agent</span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        )}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                            AD
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Alex DevSecOps</p>
                            <p className="text-[10px] text-zinc-500">Premium Plan</p>
                        </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                        5 new matches found in the last 24 hours.
                    </p>
                </div>
            </div>
        </aside>
    );
}
