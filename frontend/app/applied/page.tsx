'use client';

import { useEffect, useState } from 'react';
import { Application, ApplicationStatus } from '@/types/job';
import { getApplications, updateApplicationStatus, addApplicationNote } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { AppSidebar } from '@/components/AppSidebar';
import { Skeleton } from '@/components/Skeleton';
import { Calendar, Clock, MessageSquare, ChevronDown, ChevronUp, Briefcase, Zap, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AppliedPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setIsLoading(true);
        try {
            const data = await getApplications();
            setApplications(data);
        } catch (err) {
            console.error('Failed to load applications:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            setApplications(apps => apps.map(app =>
                app.application_id === appId
                    ? { ...app, status: newStatus, last_updated: new Date().toISOString() }
                    : app
            ));
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleAddNote = async (appId: string) => {
        if (!newNote.trim()) return;

        try {
            await addApplicationNote(appId, newNote);
            setApplications(apps => apps.map(app =>
                app.application_id === appId
                    ? {
                        ...app,
                        notes: [{
                            note_id: Math.random().toString(36).substr(2, 9),
                            content: newNote,
                            created_at: new Date().toISOString()
                        }, ...app.notes]
                    }
                    : app
            ));
            setNewNote('');
        } catch (err) {
            console.error('Failed to add note:', err);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysAgo = (dateStr: string) => {
        const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    const statusOptions: ApplicationStatus[] = ['saved', 'applied', 'screening', 'interview', 'offer', 'accepted', 'rejected', 'withdrawn'];

    return (
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Applied Jobs
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Track your applications and manage your job search pipeline.
                </p>
            </motion.header>

            {/* Stats Dashboard */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Applied</p>
                    <p className="text-3xl font-black">{isLoading ? '...' : applications.length}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Interviews</p>
                    <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                        {isLoading ? '...' : applications.filter(a => a.status === 'interview').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Offers</p>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        {isLoading ? '...' : applications.filter(a => a.status === 'offer').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Response Rate</p>
                    <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                        {isLoading ? '...' : applications.length > 0 ? Math.round((applications.filter(a => a.status !== 'applied').length / applications.length) * 100) : 0}%
                    </p>
                </div>
            </motion.div>

            {/* Applications List */}
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
                                    <div className="flex justify-between"><Skeleton className="h-6 w-48" /><Skeleton className="h-6 w-20" /></div>
                                    <Skeleton className="h-4 w-32" />
                                    <div className="flex gap-4"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-24" /></div>
                                </div>
                            ))}
                        </motion.div>
                    ) : applications.length > 0 ? (
                        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {applications.map((app, index) => (
                                <motion.div
                                    key={app.application_id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <div className="flex gap-4">
                                                {app.job.company_logo && (
                                                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0">
                                                        <img src={app.job.company_logo} alt={app.job.company_name || 'Logo'} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                                                        {app.job.job_title}
                                                    </h3>
                                                    <p className="text-sm text-zinc-500 font-medium">
                                                        {app.job.company_name} • {app.job.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 self-end md:self-auto">
                                                <StatusBadge status={app.status} />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 mb-6">
                                            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                                                <Calendar size={14} className="text-zinc-400" />
                                                <span className="font-medium whitespace-nowrap">Applied {formatDate(app.applied_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-zinc-400" />
                                                <span className="whitespace-nowrap">{getDaysAgo(app.applied_date)}</span>
                                            </div>
                                            {app.notes.length > 0 && (
                                                <div className="flex items-center gap-1.5">
                                                    <MessageSquare size={14} className="text-zinc-400" />
                                                    <span className="whitespace-nowrap">{app.notes.length} notes</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleStatusChange(app.application_id, e.target.value as ApplicationStatus)}
                                                    className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => setExpandedId(expandedId === app.application_id ? null : app.application_id)}
                                                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xs"
                                                >
                                                    {expandedId === app.application_id ? (
                                                        <><ChevronUp size={16} /> Hide Activity</>
                                                    ) : (
                                                        <><ChevronDown size={16} /> Activity History</>
                                                    )}
                                                </button>
                                            </div>
                                            <button className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
                                                Job Details <ChevronDown size={14} className="-rotate-90" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Activity History */}
                                    <AnimatePresence>
                                        {expandedId === app.application_id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-950/20"
                                            >
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Timeline */}
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Timeline</h4>
                                                        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                                                            {app.timeline.map((event) => (
                                                                <div key={event.event_id} className="relative">
                                                                    <div className="absolute -left-[1.65rem] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-zinc-50 dark:ring-zinc-950" />
                                                                    <div>
                                                                        <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                                                                            {event.description}
                                                                        </p>
                                                                        <p className="text-[10px] font-medium text-zinc-500 mt-0.5">
                                                                            {formatDate(event.timestamp)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Notes */}
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Insights & Notes</h4>
                                                        <div className="space-y-3 mb-4">
                                                            {app.notes.map((note) => (
                                                                <div key={note.note_id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-xs">
                                                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                                        {note.content}
                                                                    </p>
                                                                    <p className="text-[10px] font-medium text-zinc-400 mt-2">
                                                                        {formatDate(note.created_at)}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                            {app.notes.length === 0 && (
                                                                <p className="text-sm text-zinc-500 italic p-4">No notes added yet.</p>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="relative flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={newNote}
                                                                    onChange={(e) => setNewNote(e.target.value)}
                                                                    placeholder="New entry..."
                                                                    className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(app.application_id)}
                                                                />
                                                                <Plus className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                                            </div>
                                                            <button
                                                                onClick={() => handleAddNote(app.application_id)}
                                                                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xs"
                        >
                            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Briefcase size={36} className="text-zinc-400" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Build your pipeline</h3>
                            <p className="text-zinc-500 max-w-xs mx-auto">
                                Your applied jobs will appear here. Head to the feed to find your next career move.
                            </p>
                            <button
                                onClick={() => window.location.href = '/feed'}
                                className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20"
                            >
                                Browse Jobs
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

