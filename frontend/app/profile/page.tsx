'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/job';
import { getUserProfile, updateUserProfile } from '@/lib/api';
import { SkillTag } from '@/components/SkillTag';
import { User, Mail, Phone, Briefcase, MapPin, DollarSign, Plus, Save, X } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
    const [newSkill, setNewSkill] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newLocation, setNewLocation] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await getUserProfile();
            setProfile(data);
            setEditedProfile(data);
        } catch (err) {
            console.error('Failed to load profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (field: string) => {
        try {
            await updateUserProfile(editedProfile);
            setProfile({ ...profile!, ...editedProfile });
            setEditing(null);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    const handleCancel = () => {
        if (profile) setEditedProfile(profile);
        setEditing(null);
    };

    const addSkill = () => {
        if (!newSkill.trim() || !editedProfile.skills) return;
        setEditedProfile({
            ...editedProfile,
            skills: [...editedProfile.skills, newSkill.trim()]
        });
        setNewSkill('');
    };

    const removeSkill = (skill: string) => {
        setEditedProfile({
            ...editedProfile,
            skills: editedProfile.skills?.filter(s => s !== skill)
        });
    };

    const addTargetTitle = () => {
        if (!newTitle.trim() || !editedProfile.target_titles) return;
        setEditedProfile({
            ...editedProfile,
            target_titles: [...editedProfile.target_titles, newTitle.trim()]
        });
        setNewTitle('');
    };

    const removeTargetTitle = (title: string) => {
        setEditedProfile({
            ...editedProfile,
            target_titles: editedProfile.target_titles?.filter(t => t !== title)
        });
    };

    const addLocation = () => {
        if (!newLocation.trim() || !editedProfile.preferences?.locations) return;
        setEditedProfile({
            ...editedProfile,
            preferences: {
                ...editedProfile.preferences!,
                locations: [...editedProfile.preferences!.locations, newLocation.trim()]
            }
        });
        setNewLocation('');
    };

    const removeLocation = (location: string) => {
        setEditedProfile({
            ...editedProfile,
            preferences: {
                ...editedProfile.preferences!,
                locations: editedProfile.preferences!.locations.filter(l => l !== location)
            }
        });
    };

    return (
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
                    Profile
                </h1>
                <p className="text-zinc-500">
                    Manage your information and job search preferences
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
            >
                {/* Basic Info */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        {loading ? (
                            <Skeleton className="w-20 h-20 rounded-full" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {profile?.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                                {loading ? <Skeleton className="h-8 w-48" /> : profile?.name}
                            </h2>
                            <div className="mt-1">
                                {loading ? <Skeleton className="h-4 w-32" /> : <p className="text-zinc-500 font-medium">{profile?.years_experience} years of experience</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-zinc-400" />
                            {loading ? (
                                <Skeleton className="h-5 w-64" />
                            ) : editing === 'email' ? (
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="email"
                                        value={editedProfile.email || ''}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                        className="flex-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button onClick={() => handleSave('email')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg">
                                        <Save size={18} />
                                    </button>
                                    <button onClick={handleCancel} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-between">
                                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{profile?.email}</span>
                                    <button onClick={() => setEditing('email')} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-zinc-400" />
                            {loading ? (
                                <Skeleton className="h-5 w-48" />
                            ) : editing === 'phone' ? (
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="tel"
                                        value={editedProfile.phone || ''}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                        className="flex-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button onClick={() => handleSave('phone')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg">
                                        <Save size={18} />
                                    </button>
                                    <button onClick={handleCancel} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-between">
                                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{profile?.phone}</span>
                                    <button onClick={() => setEditing('phone')} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400">Skills</h3>
                        {loading ? (
                            <Skeleton className="h-4 w-12" />
                        ) : editing === 'skills' ? (
                            <div className="flex gap-2">
                                <button onClick={() => handleSave('skills')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                    <Save size={16} /> Save
                                </button>
                                <button onClick={handleCancel} className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing('skills')} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-20 rounded-full" />)
                        ) : (editing === 'skills' ? editedProfile.skills : profile?.skills)?.map((skill) => (
                            <SkillTag
                                key={skill}
                                skill={skill}
                                variant="primary"
                                onRemove={editing === 'skills' ? () => removeSkill(skill) : undefined}
                            />
                        ))}
                    </div>

                    {!loading && editing === 'skills' && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                placeholder="Add a skill..."
                                className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={addSkill} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm">
                                <Plus size={18} /> Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Target Titles */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Briefcase size={20} className="text-emerald-500" />
                            Target Job Titles
                        </h3>
                        {loading ? (
                            <Skeleton className="h-4 w-12" />
                        ) : editing === 'titles' ? (
                            <div className="flex gap-2">
                                <button onClick={() => handleSave('titles')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                    <Save size={16} /> Save
                                </button>
                                <button onClick={handleCancel} className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing('titles')} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="space-y-2 mb-4">
                        {loading ? (
                            [1, 2].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
                        ) : (editing === 'titles' ? editedProfile.target_titles : profile?.target_titles)?.map((title) => (
                            <div key={title} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <span className="text-zinc-700 dark:text-zinc-300 font-bold">{title}</span>
                                {editing === 'titles' && (
                                    <button onClick={() => removeTargetTitle(title)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-lg transition-colors">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {!loading && editing === 'titles' && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTargetTitle()}
                                placeholder="Add a target job title..."
                                className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={addTargetTitle} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm">
                                <Plus size={18} /> Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Preferences */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400 mb-6">Job Preferences</h3>

                    <div className="space-y-8">
                        {/* Locations */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" />
                                    Preferred Locations
                                </h4>
                                {loading ? (
                                    <Skeleton className="h-4 w-12" />
                                ) : editing === 'locations' ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSave('locations')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                            <Save size={16} /> Save
                                        </button>
                                        <button onClick={handleCancel} className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setEditing('locations')} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">
                                        Edit
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {loading ? (
                                    [1, 2].map(i => <Skeleton key={i} className="h-8 w-24 rounded-full" />)
                                ) : (editing === 'locations' ? editedProfile.preferences?.locations : profile?.preferences.locations)?.map((location) => (
                                    <SkillTag
                                        key={location}
                                        skill={location}
                                        variant="success"
                                        onRemove={editing === 'locations' ? () => removeLocation(location) : undefined}
                                    />
                                ))}
                            </div>

                            {!loading && editing === 'locations' && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                                        placeholder="Add a location..."
                                        className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button onClick={addLocation} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm">
                                        <Plus size={18} /> Add
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Minimum Salary */}
                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <DollarSign size={16} className="text-purple-500" />
                                    Minimum Salary
                                </h4>
                                {loading ? (
                                    <Skeleton className="h-4 w-12" />
                                ) : editing === 'salary' ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSave('salary')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                            <Save size={16} /> Save
                                        </button>
                                        <button onClick={handleCancel} className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setEditing('salary')} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">
                                        Edit
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <Skeleton className="h-10 w-48" />
                            ) : editing === 'salary' ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-zinc-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={editedProfile.preferences?.min_salary || ''}
                                        onChange={(e) => setEditedProfile({
                                            ...editedProfile,
                                            preferences: {
                                                ...editedProfile.preferences!,
                                                min_salary: Number(e.target.value)
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-zinc-400 font-bold text-xs">USD / YR</span>
                                </div>
                            ) : (
                                <p className="text-3xl font-black text-zinc-900 dark:text-white tabular-nums">
                                    ${profile?.preferences.min_salary.toLocaleString()} <span className="text-xs text-zinc-400 font-bold">USD</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

