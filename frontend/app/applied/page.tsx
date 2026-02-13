'use client';

import { useEffect, useState } from 'react';
import { Application, ApplicationStatus } from '@/types/job';
import { getApplications, updateApplicationStatus, addApplicationNote } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { Calendar, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function AppliedPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const data = await getApplications();
            setApplications(data);
        } catch (err) {
            console.error('Failed to load applications:', err);
        } finally {
            setLoading(false);
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
                        notes: [...app.notes, {
                            note_id: Date.now().toString(),
                            content: newNote,
                            created_at: new Date().toISOString()
                        }]
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 font-medium">Loading applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                    Applied Jobs
                </h1>
                <p className="text-zinc-500">
                    Track your applications and manage your job search pipeline
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Applied</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white">{applications.length}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Interviews</p>
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                        {applications.filter(a => a.status === 'interview').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Offers</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {applications.filter(a => a.status === 'offer').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Response Rate</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {applications.length > 0 ? Math.round((applications.filter(a => a.status !== 'applied').length / applications.length) * 100) : 0}%
                    </p>
                </div>
            </div>

            {/* Applications List */}
            {applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app.application_id}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                                            {app.job.job_title}
                                        </h3>
                                        <p className="text-sm text-zinc-500">
                                            {app.job.company_name} • {app.job.location}
                                        </p>
                                    </div>
                                    <StatusBadge status={app.status} />
                                </div>

                                <div className="flex items-center gap-6 text-sm text-zinc-500 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={16} />
                                        Applied {formatDate(app.applied_date)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} />
                                        {getDaysAgo(app.applied_date)}
                                    </div>
                                    {app.notes.length > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare size={16} />
                                            {app.notes.length} {app.notes.length === 1 ? 'note' : 'notes'}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.application_id, e.target.value as ApplicationStatus)}
                                        className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => setExpandedId(expandedId === app.application_id ? null : app.application_id)}
                                        className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                                    >
                                        {expandedId === app.application_id ? (
                                            <>
                                                <ChevronUp size={16} />
                                                Hide Details
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown size={16} />
                                                View Details
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === app.application_id && (
                                <div className="border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-950">
                                    {/* Timeline */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Timeline</h4>
                                        <div className="space-y-3">
                                            {app.timeline.map((event) => (
                                                <div key={event.event_id} className="flex gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                                            {event.description}
                                                        </p>
                                                        <p className="text-xs text-zinc-500">
                                                            {formatDate(event.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">Notes</h4>
                                        {app.notes.length > 0 && (
                                            <div className="space-y-2 mb-3">
                                                {app.notes.map((note) => (
                                                    <div key={note.note_id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3">
                                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">
                                                            {note.content}
                                                        </p>
                                                        <p className="text-xs text-zinc-400">
                                                            {formatDate(note.created_at)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                placeholder="Add a note..."
                                                className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddNote(app.application_id);
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddNote(app.application_id)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Add Note
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={32} className="text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No applications yet</h3>
                    <p className="text-zinc-500">Start applying to jobs from the feed to track them here</p>
                </div>
            )}
        </div>
    );
}
