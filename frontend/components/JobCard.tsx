'use client';

import { Job } from '@/types/job';
import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Building2,
    MapPin,
    Briefcase,
    Clock,
    ChevronRight,
    ShieldCheck,
    Zap,
    ExternalLink,
    Bookmark
} from 'lucide-react';

interface JobCardProps {
    job: Job;
    onClick?: (job: Job) => void;
    index?: number;
}

export function JobCard({ job, onClick, index = 0 }: JobCardProps) {
    const isHighFit = job.fit_score >= 85;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onClick?.(job)}
            className={cn(
                "group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-xl transition-all cursor-pointer",
                isHighFit && "border-blue-500/50 ring-1 ring-blue-500/20"
            )}
        >
            {isHighFit && (
                <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                    <Zap size={10} fill="currentColor" />
                    HIGH FIT
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    {job.company_logo && (
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                            <img src={job.company_logo} alt={job.company_name || 'Logo'} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                            {job.job_title}
                        </h3>
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mt-1">
                            <Building2 size={16} />
                            <span className="text-sm font-medium">{job.company_name || 'Anonymous'}</span>
                        </div>
                    </div>
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold shrink-0",
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
                    <span className="text-sm truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Briefcase size={16} />
                    <span className="text-sm">{job.years_of_experience?.raw_text || 'Exp req. n/a'}</span>
                </div>
                {job.salary_range?.min && (
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
                        className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded uppercase tracking-tight transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    >
                        {skill}
                    </span>
                ))}
                {job.required_skills.length > 4 && (
                    <span className="text-[10px] text-zinc-400 font-medium">+{job.required_skills.length - 4} more</span>
                )}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Simulated save
                        }}
                        className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Save for later"
                    >
                        <Bookmark size={18} />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 font-medium">Analyzed {new Date(job.analyzed_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.(job);
                        }}
                        className="text-zinc-500 dark:text-zinc-400 text-xs font-bold px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        Details
                    </button>
                    {job.apply_url && (
                        <a
                            href={job.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95",
                                isHighFit
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                                    : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                            )}
                        >
                            Apply Direct
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

