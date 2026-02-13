'use client';

import { useEffect, useState } from 'react';
import { UserSettings } from '@/types/job';
import { getUserSettings, updateUserSettings } from '@/lib/api';
import {
    Bell,
    Shield,
    Palette,
    AlertCircle,
    Monitor,
    Moon,
    Sun,
    Save,
    ChevronRight,
    Search,
    Trash2
} from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await getUserSettings();
            setSettings(data);
        } catch (err) {
            console.error('Failed to load settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (path: string, value: any) => {
        if (!settings) return;

        const newSettings = JSON.parse(JSON.stringify(settings));
        const keys = path.split('.');
        let current = newSettings;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        setSettings(newSettings);
        autoSave(newSettings);
    };

    const autoSave = async (updatedSettings: UserSettings) => {
        setSaving(true);
        try {
            await updateUserSettings(updatedSettings);
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            // Add a small delay for visual feedback
            setTimeout(() => setSaving(false), 500);
        }
    };

    return (
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
                        {loading ? <Skeleton className="h-9 w-48" /> : 'Settings'}
                    </h1>
                    <div className="text-zinc-500">
                        {loading ? <Skeleton className="h-4 w-72" /> : 'Configure your account preferences and notifications'}
                    </div>
                </div>
                {saving && (
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest animate-pulse">
                        <Save size={14} />
                        Saving changes...
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
            >
                {/* Notifications Section */}
                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/50">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                            <Bell size={20} />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white">Notifications</h2>
                    </div>
                    <div className="p-6 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">Email Notifications</p>
                                <p className="text-sm text-zinc-500">Receive daily updates and new job matches via email</p>
                            </div>
                            {loading ? (
                                <Skeleton className="w-11 h-6 rounded-full" />
                            ) : (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings?.notifications.email_enabled}
                                        onChange={(e) => handleToggle('notifications.email_enabled', e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">New Job Alerts</p>
                                <p className="text-sm text-zinc-500">Notify me immediately when a high-match job is found</p>
                            </div>
                            {loading ? (
                                <Skeleton className="w-11 h-6 rounded-full" />
                            ) : (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings?.notifications.types.new_matches}
                                        onChange={(e) => handleToggle('notifications.types.new_matches', e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            )}
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/50">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
                            <Palette size={20} />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white">Appearance</h2>
                    </div>
                    <div className="p-6 space-y-8">
                        <div>
                            <p className="font-bold text-zinc-900 dark:text-white mb-4">Theme Preference</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {loading ? (
                                    [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                                ) : (['light', 'dark', 'system'] as const).map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => handleToggle('appearance.theme', theme as any)}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all active:scale-95 ${settings?.appearance.theme === theme
                                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
                                            : 'border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${settings?.appearance.theme === theme ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                                            {theme === 'light' && <Sun size={20} />}
                                            {theme === 'dark' && <Moon size={20} />}
                                            {theme === 'system' && <Monitor size={20} />}
                                        </div>
                                        <span className="text-sm font-bold capitalize tracking-tight">{theme}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">Comfortable View</p>
                                <p className="text-sm text-zinc-500">Add more spacing between job cards and list items</p>
                            </div>
                            {loading ? (
                                <Skeleton className="w-11 h-6 rounded-full" />
                            ) : (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings?.appearance.density === 'comfortable'}
                                        onChange={(e) => handleToggle('appearance.density', e.target.checked ? 'comfortable' : 'compact')}
                                    />
                                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            )}
                        </div>
                    </div>
                </section>

                {/* Job Alerts Section */}
                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                                <AlertCircle size={20} />
                            </div>
                            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white">Job Alerts</h2>
                        </div>
                        {!loading && (
                            <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                Add Alert
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {loading ? (
                                [1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
                            ) : settings?.job_alerts.map((alert) => (
                                <div key={alert.alert_id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xs">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                                            <Search size={22} />
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-zinc-900 dark:text-white">{alert.name}</p>
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {alert.filters.search ? `"${alert.filters.search}"` : 'Any'} • {alert.frequency}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10">
                                            <Trash2 size={18} />
                                        </button>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={alert.enabled}
                                                onChange={(e) => {
                                                    const newAlerts = settings.job_alerts.map(a =>
                                                        a.alert_id === alert.alert_id ? { ...a, enabled: e.target.checked } : a
                                                    );
                                                    handleToggle('job_alerts', newAlerts as any);
                                                }}
                                            />
                                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Privacy & Security Section */}
                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/50">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shadow-sm">
                            <Shield size={20} />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white">Privacy & Security</h2>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {loading ? (
                            [1, 2].map(i => <div key={i} className="p-6"><Skeleton className="h-12 w-full" /></div>)
                        ) : (
                            <>
                                <button className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                    <div className="text-left">
                                        <p className="font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">Profile Visibility</p>
                                        <p className="text-sm text-zinc-500">Control who can see your AI-generated profile score</p>
                                    </div>
                                    <ChevronRight className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
                                </button>
                                <button className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                    <div className="text-left">
                                        <p className="font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">Data Export</p>
                                        <p className="text-sm text-zinc-500">Download all your application data and interview notes</p>
                                    </div>
                                    <ChevronRight className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
                                </button>
                            </>
                        )}
                    </div>
                </section>

                {/* Danger Zone */}
                {!loading && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 p-8 border border-red-200 dark:border-red-900/30 rounded-2xl bg-red-50/30 dark:bg-red-900/10 shadow-xs"
                    >
                        <h3 className="text-xl font-black text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-sm text-zinc-500 font-medium mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95">
                            Delete Account
                        </button>
                    </motion.section>
                )}
            </motion.div>
        </div>
    );
}

