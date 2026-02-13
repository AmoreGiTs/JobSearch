'use client';

import { useEffect, useState } from 'react';
import { UserSettings } from '@/types/job';
import { getUserSettings, updateUserSettings } from '@/lib/api';
import {
    Bell,
    Shield,
    Palette,
    AlertCircle,
    Mail,
    Monitor,
    Moon,
    Sun,
    Save,
    ChevronRight,
    Search,
    Trash2
} from 'lucide-react';

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 font-medium">Loading settings...</p>
                </div>
            </div>
        );
    }

    if (!settings) return null;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                        Settings
                    </h1>
                    <p className="text-zinc-500">
                        Configure your account preferences and notifications
                    </p>
                </div>
                {saving && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm animate-pulse">
                        <Save size={16} />
                        Saving changes...
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Notifications Section */}
                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Bell size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Notifications</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">Email Notifications</p>
                                <p className="text-sm text-zinc-500">Receive daily updates and new job matches via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.notifications.email_enabled}
                                    onChange={(e) => handleToggle('notifications.email_enabled', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">New Job Alerts</p>
                                <p className="text-sm text-zinc-500">Notify me immediately when a high-match job is found</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.notifications.types.new_matches}
                                    onChange={(e) => handleToggle('notifications.types.new_matches', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Palette size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Appearance</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <p className="font-bold text-zinc-900 dark:text-white mb-4">Theme Preference</p>
                            <div className="grid grid-cols-3 gap-4">
                                {(['light', 'dark', 'system'] as const).map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => handleToggle('appearance.theme', theme as any)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${settings.appearance.theme === theme
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950'
                                            }`}
                                    >
                                        {theme === 'light' && <Sun size={20} />}
                                        {theme === 'dark' && <Moon size={20} />}
                                        {theme === 'system' && <Monitor size={20} />}
                                        <span className="text-sm font-bold capitalize">{theme}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white">Comfortable View</p>
                                <p className="text-sm text-zinc-500">Add more spacing between job cards and list items</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.appearance.density === 'comfortable'}
                                    onChange={(e) => handleToggle('appearance.density', e.target.checked ? 'comfortable' : 'compact')}
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Job Alerts Section */}
                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <AlertCircle size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Job Alerts</h2>
                        </div>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                            Add Alert
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {settings.job_alerts.map((alert) => (
                                <div key={alert.alert_id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <Search size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900 dark:text-white">{alert.name}</p>
                                            <p className="text-xs text-zinc-500">
                                                {alert.filters.search ? `"${alert.filters.search}"` : 'Any'} • {alert.frequency}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
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
                <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
                            <Shield size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Privacy & Security</h2>
                    </div>
                    <div className="p-0">
                        <button className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-200 dark:border-zinc-800">
                            <div className="text-left">
                                <p className="font-bold text-zinc-900 dark:text-white">Profile Visibility</p>
                                <p className="text-sm text-zinc-500">Control who can see your AI-generated profile score</p>
                            </div>
                            <ChevronRight className="text-zinc-400" />
                        </button>
                        <button className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <div className="text-left">
                                <p className="font-bold text-zinc-900 dark:text-white">Data Export</p>
                                <p className="text-sm text-zinc-500">Download all your application data and interview notes</p>
                            </div>
                            <ChevronRight className="text-zinc-400" />
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="mt-12 p-6 border border-red-200 dark:border-red-900/30 rounded-xl bg-red-50/30 dark:bg-red-900/10">
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                    <p className="text-sm text-zinc-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm">
                        Delete Account
                    </button>
                </section>
            </div>
        </div>
    );
}
