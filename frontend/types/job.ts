export interface Job {
    job_id: string;
    job_title: string;
    company_name: string | null;
    location: string;
    remote_policy: 'Remote' | 'Hybrid' | 'Onsite' | 'Unknown';
    required_skills: string[];
    preferred_skills: string[];
    years_of_experience: {
        min_years: number | null;
        max_years: number | null;
        raw_text: string | null;
    };
    clearance_required: boolean;
    visa_sponsorship: boolean | null;
    salary_range: {
        min: number | null;
        max: number | null;
        currency: string | null;
        frequency: "annual" | "hourly" | null;
    };
    top_3_responsibilities: string[];
    tech_stack_summary: string;
    fit_score: number;
    analyzed_at: string;
    posted_at: string;
    apply_url?: string;
    lat?: number;
    lng?: number;
    description?: string;
    company_logo?: string;
    match_reasons?: string[];
    responsibilities?: string[];
    benefits?: string[];
}

export interface UserProfile {
    user_id: string;
    name: string;
    email?: string;
    phone?: string;
    skills: string[];
    years_experience: number;
    target_titles: string[];
    preferences: {
        remote: boolean;
        locations: string[];
        min_salary: number;
    };
}

export interface Application {
    application_id: string;
    job: Job;
    status: ApplicationStatus;
    applied_date: string;
    last_updated: string;
    notes: ApplicationNote[];
    timeline: ApplicationEvent[];
    resume_version?: string;
    cover_letter?: string;
}

export type ApplicationStatus =
    | 'saved'
    | 'applied'
    | 'screening'
    | 'interview'
    | 'offer'
    | 'accepted'
    | 'rejected'
    | 'withdrawn';

export interface ApplicationNote {
    note_id: string;
    content: string;
    created_at: string;
}

export interface ApplicationEvent {
    event_id: string;
    type: 'status_change' | 'note_added' | 'interview_scheduled';
    description: string;
    timestamp: string;
}

export interface JobFilters {
    search?: string;
    remote_policy?: ('Remote' | 'Hybrid' | 'Onsite' | 'Unknown')[];
    skills?: string[];
    salary_min?: number;
    salary_max?: number;
    experience_min?: number;
    experience_max?: number;
    locations?: string[];
}

export interface UserSettings {
    notifications: {
        email_enabled: boolean;
        push_enabled: boolean;
        frequency: 'instant' | 'daily' | 'weekly';
        types: {
            new_matches: boolean;
            application_updates: boolean;
            reminders: boolean;
        };
    };
    job_alerts: JobAlert[];
    appearance: {
        theme: 'light' | 'dark' | 'system';
        density: 'compact' | 'comfortable';
    };
    privacy: {
        profile_visible: boolean;
        share_analytics: boolean;
    };
}

export interface JobAlert {
    alert_id: string;
    name: string;
    filters: JobFilters;
    frequency: 'instant' | 'daily' | 'weekly';
    enabled: boolean;
}
