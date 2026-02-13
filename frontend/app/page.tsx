'use client';

import { useEffect, useState } from 'react';
import { Job, UserProfile } from '@/types/job';
import { getJobs, getUserProfile } from '@/lib/api';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
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
    // In a real app, this would call an API
    setSelectedJob(null);
    // Optionally remove job or update UI state
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium">Analyzing job matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Welcome back, {profile?.name?.split(' ')[0]}
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">
            Your intelligence engine has identified <span className="text-blue-600 dark:text-blue-400 font-bold">{jobs.length} new opportunities</span> since yesterday.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95">
          <Plus size={18} />
          New Search
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <TrendingUp size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Market Score</span>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">92/100</p>
          <p className="text-xs text-zinc-400 mt-1">High demand for your AWS/Terraform stack</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Target size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Top Matching Role</span>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">Security Architect</p>
          <p className="text-xs text-zinc-400 mt-1">Found 4 open roles in your area</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 text-purple-600 mb-2">
            <Award size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Profile Strength</span>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">Advanced</p>
          <p className="text-xs text-zinc-400 mt-1">Match rate increased by 12% this week</p>
        </div>
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
        {jobs.map((job) => (
          <JobCard key={job.job_id} job={job} onClick={handleJobClick} />
        ))}

        {/* Empty State / Add Card */}
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8 group hover:border-blue-500/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-3">
            <Plus size={24} />
          </div>
          <p className="text-sm font-bold text-zinc-500 group-hover:text-blue-600 transition-colors">Add Source</p>
          <p className="text-xs text-zinc-400 text-center mt-1">Connect more job boards to find more matches</p>
        </div>
      </div>

      {selectedJob && (
        <JobDetails 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
          onFeedback={handleFeedback} 
        />
      )}
    </div>
  );
}
