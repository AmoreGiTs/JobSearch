'use client';

import { useState, useEffect } from 'react';
import { Job, UserProfile } from '@/types/job';
import { getJobs, getUserProfile } from '@/lib/api';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { Skeleton, JobCardSkeleton } from '@/components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [jobsData, profileData] = await Promise.all([
          getJobs(),
          getUserProfile()
        ]);
        setJobs(jobsData);
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleFeedback = (jobId: string, relevant: boolean) => {
    console.log(`Feedback for ${jobId}: ${relevant ? 'Relevant' : 'Not Fit'}`);
    setSelectedJob(null);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {loading ? <Skeleton className="h-9 w-64" /> : `Welcome back, ${profile?.name?.split(' ')[0]}`}
          </h1>
          <div className="text-zinc-500 mt-1 font-medium">
            {loading ? (
              <Skeleton className="h-4 w-96 mt-2" />
            ) : (
              <>Your intelligence engine has identified <span className="text-blue-600 dark:text-blue-400 font-bold">{jobs.length} new opportunities</span> since yesterday.</>
            )}
          </div>
        </div>
        {!loading && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto">
            <Plus size={18} />
            New Search
          </button>
        )}
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Market Score', value: '92/100', sub: 'High demand for your AWS/Terraform stack', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Top Matching Role', value: 'Security Architect', sub: 'Found 4 open roles in your area', icon: Target, color: 'text-blue-600' },
          { label: 'Profile Strength', value: 'Advanced', sub: 'Match rate increased by 12% this week', icon: Award, color: 'text-purple-600' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm"
          >
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            ) : (
              <>
                <div className={`flex items-center gap-3 ${stat.color} mb-2`}>
                  <stat.icon size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-zinc-400 mt-1">{stat.sub}</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Section Divider */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Top Matches</h2>
        <div className="flex items-center gap-4">
          <button className="text-zinc-500 hover:text-blue-600 flex items-center gap-1 text-sm font-bold transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="text-zinc-500 hover:text-blue-600 flex items-center gap-1 text-sm font-bold transition-colors">
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode='wait'>
          {loading ? (
            [1, 2, 3].map(i => <JobCardSkeleton key={i} />)
          ) : (
            <>
              {jobs.slice(0, 5).map((job, index) => (
                <JobCard key={job.job_id} job={job} index={index} onClick={() => handleJobClick(job)} />
              ))}
              {/* Empty State / Add Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8 group hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-3">
                  <Plus size={24} />
                </div>
                <p className="text-sm font-bold text-zinc-500 group-hover:text-blue-600 transition-colors">Add Source</p>
                <p className="text-xs text-zinc-400 text-center mt-1">Connect more job boards to find more matches</p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedJob && (
          <JobDetails
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onFeedback={handleFeedback}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
