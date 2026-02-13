'use client';

import { Job } from '@/types/job';
import { cn, formatCurrency } from '@/lib/utils';
import {
    Building2,
    MapPin,
    Briefcase,
    CheckCircle2,
    Clock,
    ChevronRight,
    ShieldCheck,
    Zap
} from 'lucide-react';

interface JobCardProps {
    job: Job;
    onClick?: (job: Job) => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
    const isHighFit = job.fit_score >= 85;

    return (
        <div
            onClick={() => onClick?.(job)}
            className={cn(
                "group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer",
                isHighFit && "border-blue-500/50 ring-1 ring-blue-500/20"
            )}
        >
            {isHighFit && (
                <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Zap size={10} fill="currentColor" />
                    HIGH FIT
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                        {job.job_title}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mt-1">
                        <Building2 size={16} />
                        <span className="text-sm font-medium">{job.company_name || 'Anonymous'}</span>
                    </div>
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    job.fit_score >= 80 ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" :
                        job.fit_score >= 60 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400" :
                            "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                )}>
                    {job.fit_score}% Match
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 mb-4">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <MapPin size={16} />
                    <span className="text-sm">{job.location} ({job.remote_policy})</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Briefcase size={16} />
                    <span className="text-sm">{job.years_of_experience.raw_text || 'Exp req. n/a'}</span>
                </div>
                {job.salary_range.min && (
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-300">
                            {formatCurrency(job.salary_range.min, job.salary_range.currency)}
                            {job.salary_range.max ? ` - ${formatCurrency(job.salary_range.max, job.salary_range.currency)}` : '+'}
                        </span>
                    </div>
                )}
                {job.clearance_required && (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Clearance Required</span>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.required_skills.slice(0, 4).map(skill => (
                    <span
                        key={skill}
                        className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded uppercase tracking-tight"
                    >
                        {skill}
                    </span>
                ))}
                {job.required_skills.length > 4 && (
                    <span className="text-[10px] text-zinc-400 font-medium">+{job.required_skills.length - 4} more</span>
                )}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-zinc-400 text-[10px]">
                    <Clock size={12} />
                    <span>Analyzed {new Date(job.analyzed_at).toLocaleDateString()}</span>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 group/btn">
                    View Details
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
