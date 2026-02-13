'use client';

import { useEffect, useState } from 'react';
import { Job, JobFilters } from '@/types/job';
import { searchJobs } from '@/lib/api';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

export default function FeedPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<JobFilters>({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadJobs();
    }, [filters]);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const data = await searchJobs(filters);
            setJobs(data);
        } catch (err) {
            console.error('Failed to load jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ ...filters, search: searchQuery });
    };

    const handleRemotePolicyToggle = (policy: 'Remote' | 'Hybrid' | 'Onsite' | 'Unknown') => {
        const current = filters.remote_policy || [];
        const updated = current.includes(policy)
            ? current.filter(p => p !== policy)
            : [...current, policy];
        setFilters({ ...filters, remote_policy: updated.length > 0 ? updated : undefined });
    };

    const clearFilters = () => {
        setFilters({});
        setSearchQuery('');
    };

    const activeFilterCount = [
        filters.search,
        filters.remote_policy?.length,
        filters.salary_min,
        filters.skills?.length
    ].filter(Boolean).length;

    if (loading && jobs.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 font-medium">Loading job opportunities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                    Job Feed
                </h1>
                <p className="text-zinc-500">
                    Discover opportunities tailored to your skills and preferences
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                <div className="flex gap-3">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search jobs, companies, or skills..."
                            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </form>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 font-medium"
                    >
                        <SlidersHorizontal size={18} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
                        {/* Remote Policy */}
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Work Location</h3>
                            <div className="flex flex-wrap gap-2">
                                {(['Remote', 'Hybrid', 'Onsite'] as const).map((policy) => (
                                    <button
                                        key={policy}
                                        onClick={() => handleRemotePolicyToggle(policy)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.remote_policy?.includes(policy)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                            }`}
                                    >
                                        {policy}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Minimum Salary</h3>
                            <input
                                type="number"
                                value={filters.salary_min || ''}
                                onChange={(e) => setFilters({ ...filters, salary_min: e.target.value ? Number(e.target.value) : undefined })}
                                placeholder="e.g., 100000"
                                className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Clear Filters */}
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                                <X size={16} />
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}

                {/* Active Filter Chips */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {filters.search && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                Search: {filters.search}
                                <button onClick={() => setFilters({ ...filters, search: undefined })}>
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {filters.remote_policy?.map(policy => (
                            <span key={policy} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                {policy}
                                <button onClick={() => handleRemotePolicyToggle(policy)}>
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                        {filters.salary_min && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                Min: ${filters.salary_min.toLocaleString()}
                                <button onClick={() => setFilters({ ...filters, salary_min: undefined })}>
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-sm text-zinc-500">
                    {loading ? 'Searching...' : `${jobs.length} ${jobs.length === 1 ? 'opportunity' : 'opportunities'} found`}
                </p>
            </div>

            {/* Job Grid */}
            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <JobCard key={job.job_id} job={job} onClick={setSelectedJob} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter size={32} className="text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No jobs found</h3>
                    <p className="text-zinc-500 mb-4">Try adjusting your filters or search query</p>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            {selectedJob && (
                <JobDetails
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onFeedback={(jobId, relevant) => {
                        console.log(`Feedback for ${jobId}: ${relevant ? 'Relevant' : 'Not Fit'}`);
                        setSelectedJob(null);
                    }}
                />
            )}
        </div>
    );
}
