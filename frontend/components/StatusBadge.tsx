'use client';

import { ApplicationStatus } from '@/types/job';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: ApplicationStatus;
    className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
    saved: { label: 'Saved', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
    applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    screening: { label: 'Screening', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
    interview: { label: 'Interview', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    offer: { label: 'Offer', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    withdrawn: { label: 'Withdrawn', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
            config.color,
            className
        )}>
            {config.label}
        </span>
    );
}
