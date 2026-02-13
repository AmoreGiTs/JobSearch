'use client';

import { Job } from '@/types/job';
import {
    X,
    ThumbsUp,
    ThumbsDown,
    ExternalLink,
    Info,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface JobDetailsProps {
    job: Job;
    onClose: () => void;
    onFeedback: (jobId: string, relevant: boolean) => void;
}

export function JobDetails({ job, onClose, onFeedback }: JobDetailsProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">

                {/* Modal Header */}
                <div className="sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">
                            AI Analysis
                        </div>
                        <span className="text-xs text-zinc-400 font-medium tracking-tight">Analyzed {new Date(job.analyzed_at).toLocaleDateString()}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 leading-tight">
                            {job.job_title}
                        </h2>
                        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter text-sm">
                                {job.company_name}
                            </span>
                            <span>•</span>
                            <span className="text-sm font-medium">{job.location} ({job.remote_policy})</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-3">
                                <CheckCircle2 size={12} className="text-blue-500" />
                                Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {job.required_skills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold rounded uppercase border border-zinc-200 dark:border-zinc-700/50">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-3">
                                <Info size={12} className="text-purple-500" />
                                Compensation
                            </h4>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {formatCurrency(job.salary_range.min, job.salary_range.currency)}
                                {job.salary_range.max ? ` - ${formatCurrency(job.salary_range.max, job.salary_range.currency)}` : '+'}
                                <span className="text-[10px] text-zinc-400 font-medium ml-1">/{job.salary_range.frequency || 'year'}</span>
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-1">Automatic assessment based on description</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-3">
                            Core Responsibilities
                        </h4>
                        <ul className="space-y-3">
                            {job.top_3_responsibilities.map((resp, i) => (
                                <li key={i} className="flex items-start gap-3 group">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        {resp}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-200">Refine Intelligence</h4>
                            <div className="flex items-center gap-1.5">
                                <AlertCircle size={14} className="text-zinc-400" />
                                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight">Your feedback trains the model</span>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-medium leading-relaxed">
                            Is this role representative of what you are looking for? Our scoring engine learns from your preferences to improve future matches.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => onFeedback(job.job_id, true)}
                                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95"
                            >
                                <ThumbsUp size={18} />
                                Relevant
                            </button>
                            <button
                                onClick={() => onFeedback(job.job_id, false)}
                                className="flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-100 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                            >
                                <ThumbsDown size={18} />
                                Not Fit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center sticky bottom-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
                    <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline decoration-2 underline-offset-4">
                        View Original Posting
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
