'use client';

import { useEffect, useState } from 'react';
import { Job, JobFilters } from '@/types/job';
import { searchJobs } from '@/lib/api';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { JobCardSkeleton } from '@/components/Skeleton';
import { AppSidebar } from '@/components/AppSidebar';
import { Search, Briefcase, Zap, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function FeedPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [filters, setFilters] = useState<JobFilters>({});
    const [showToast, setShowToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const results = await searchJobs(filters);
                setJobs(results);
            } catch (err) {
                console.error('Failed to load jobs:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, [filters]);

    const handleRemotePolicyToggle = (policy: 'Remote' | 'Hybrid' | 'Onsite' | 'Unknown') => {
        const current = filters.remote_policy || [];
        const updated = current.includes(policy)
            ? current.filter(p => p !== policy)
            : [...current, policy];
        setFilters({ ...filters, remote_policy: updated.length > 0 ? updated : undefined });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ ...filters, search: searchQuery });
    };

    const handleApply = (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        console.log(`Applying for job ${jobId}`);
    };

    const activeFilterCount = [
        filters.search,
        filters.remote_policy?.length,
        filters.salary_min
    ].filter(Boolean).length;

    return (
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Job Feed
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                            Discover opportunities that match your expertise.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative w-full md:w-96"
                    >
                        <form onSubmit={handleSearch}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search titles, companies, or skills..."
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </motion.div>
                </div>

                {/* Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center gap-3"
                >
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs">
                        {(['Remote', 'Hybrid', 'Onsite'] as const).map((policy) => (
                            <button
                                key={policy}
                                onClick={() => handleRemotePolicyToggle(policy)}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                                    filters.remote_policy?.includes(policy)
                                        ? "bg-blue-600 text-white shadow-md scale-105"
                                        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                )}
                            >
                                {policy}
                            </button>
                        ))}
                    </div>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={() => {
                                setFilters({});
                                setSearchQuery('');
                            }}
                            className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-blue-600 transition-colors px-2"
                        >
                            <X size={14} />
                            Reset Filters
                        </button>
                    )}
                </motion.div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {[1, 2, 3, 4].map(i => <JobCardSkeleton key={i} />)}
                            </motion.div>
                        ) : jobs.length > 0 ? (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {jobs.map((job, index) => (
                                    <div key={job.job_id} className="relative group">
                                        <JobCard
                                            job={job}
                                            index={index}
                                            onClick={() => setSelectedJob(job)}
                                        />
                                        <button
                                            onClick={(e) => handleApply(e, job.job_id)}
                                            className="absolute bottom-5 right-5 z-20 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-xs"
                            >
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="text-zinc-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No jobs found</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                                    We couldn't find any jobs matching your current filters. Try adjusting your search criteria.
                                </p>
                                <button
                                    onClick={() => {
                                        setFilters({});
                                        setSearchQuery('');
                                    }}
                                    className="mt-6 px-6 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {selectedJob && (
                    <JobDetails
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-blue-500/20"
                    >
                        <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                        Application tracked successfully!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

