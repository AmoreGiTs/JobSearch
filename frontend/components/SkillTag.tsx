'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillTagProps {
    skill: string;
    onRemove?: () => void;
    onClick?: () => void;
    variant?: 'default' | 'primary' | 'success';
    className?: string;
}

export function SkillTag({ skill, onRemove, onClick, variant = 'default', className }: SkillTagProps) {
    const variantStyles = {
        default: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700',
        primary: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50',
        success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50'
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                variantStyles[variant],
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {skill}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5 transition-colors"
                >
                    <X size={12} />
                </button>
            )}
        </span>
    );
}
