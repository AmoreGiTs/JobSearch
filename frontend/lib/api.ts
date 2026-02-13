import { Job, UserProfile, Application, ApplicationStatus, UserSettings, JobFilters } from '@/types/job';

const MOCK_JOBS: Job[] = [
    {
        job_id: '1',
        job_title: 'Senior Cloud Security Engineer',
        company_name: 'SecureCloud Inc.',
        location: 'Remote',
        remote_policy: 'Remote',
        required_skills: ['AWS', 'Terraform', 'Python', 'IAM'],
        preferred_skills: ['Kubernetes', 'Go'],
        years_of_experience: { min_years: 5, max_years: null, raw_text: '5+ years' },
        clearance_required: false,
        visa_sponsorship: null,
        salary_range: { min: 140000, max: 180000, currency: 'USD', frequency: 'annual' },
        top_3_responsibilities: [
            'Architect secure cloud infrastructure',
            'Automate security controls',
            'Lead incident response drills'
        ],
        tech_stack_summary: 'AWS, Terraform, Python',
        fit_score: 92,
        analyzed_at: new Date().toISOString()
    },
    {
        job_id: '2',
        job_title: 'DevOps Engineer',
        company_name: 'TechStream',
        location: 'Nairobi',
        remote_policy: 'Hybrid',
        required_skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        preferred_skills: ['Prometheus', 'Grafana'],
        years_of_experience: { min_years: 3, max_years: 6, raw_text: '3-6 years' },
        clearance_required: false,
        visa_sponsorship: false,
        salary_range: { min: 90000, max: 120000, currency: 'USD', frequency: 'annual' },
        top_3_responsibilities: [
            'Maintain Kubernetes clusters',
            'Optimize CI/CD pipelines',
            'Support development teams'
        ],
        tech_stack_summary: 'Docker, K8s, Jenkins',
        fit_score: 78,
        analyzed_at: new Date().toISOString()
    },
    {
        job_id: '3',
        job_title: 'Security Architect',
        company_name: 'FinTech Solutions',
        location: 'London',
        remote_policy: 'Hybrid',
        required_skills: ['Security Architecture', 'AWS', 'Compliance', 'IAM'],
        preferred_skills: ['CISSP', 'Zero Trust'],
        years_of_experience: { min_years: 7, max_years: null, raw_text: '7+ years' },
        clearance_required: false,
        visa_sponsorship: true,
        salary_range: { min: 160000, max: 200000, currency: 'USD', frequency: 'annual' },
        top_3_responsibilities: [
            'Design security architecture',
            'Lead compliance initiatives',
            'Mentor security team'
        ],
        tech_stack_summary: 'AWS, Security Tools, Compliance Frameworks',
        fit_score: 88,
        analyzed_at: new Date().toISOString()
    },
    {
        job_id: '4',
        job_title: 'DevSecOps Engineer',
        company_name: 'StartupX',
        location: 'Berlin',
        remote_policy: 'Remote',
        required_skills: ['CI/CD', 'Security', 'Docker', 'AWS'],
        preferred_skills: ['Terraform', 'Python'],
        years_of_experience: { min_years: 4, max_years: 7, raw_text: '4-7 years' },
        clearance_required: false,
        visa_sponsorship: true,
        salary_range: { min: 110000, max: 150000, currency: 'USD', frequency: 'annual' },
        top_3_responsibilities: [
            'Integrate security into CI/CD',
            'Automate security testing',
            'Build secure infrastructure'
        ],
        tech_stack_summary: 'AWS, Docker, Jenkins, Security Tools',
        fit_score: 85,
        analyzed_at: new Date().toISOString()
    }
];

const MOCK_APPLICATIONS: Application[] = [
    {
        application_id: '1',
        job: MOCK_JOBS[0],
        status: 'interview',
        applied_date: '2026-02-10T10:00:00Z',
        last_updated: '2026-02-12T14:30:00Z',
        notes: [
            {
                note_id: '1',
                content: 'Had initial screening call. They seemed impressed with my AWS experience.',
                created_at: '2026-02-11T16:00:00Z'
            }
        ],
        timeline: [
            {
                event_id: '1',
                type: 'status_change',
                description: 'Application submitted',
                timestamp: '2026-02-10T10:00:00Z'
            },
            {
                event_id: '2',
                type: 'status_change',
                description: 'Moved to interview stage',
                timestamp: '2026-02-12T14:30:00Z'
            }
        ]
    },
    {
        application_id: '2',
        job: MOCK_JOBS[1],
        status: 'applied',
        applied_date: '2026-02-12T09:00:00Z',
        last_updated: '2026-02-12T09:00:00Z',
        notes: [],
        timeline: [
            {
                event_id: '3',
                type: 'status_change',
                description: 'Application submitted',
                timestamp: '2026-02-12T09:00:00Z'
            }
        ]
    }
];

export async function getJobs(): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_JOBS;
}

export async function searchJobs(filters: JobFilters): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...MOCK_JOBS];

    if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(job =>
            job.job_title.toLowerCase().includes(search) ||
            job.company_name?.toLowerCase().includes(search) ||
            job.required_skills.some(s => s.toLowerCase().includes(search))
        );
    }

    if (filters.remote_policy && filters.remote_policy.length > 0) {
        filtered = filtered.filter(job => filters.remote_policy!.includes(job.remote_policy));
    }

    if (filters.salary_min) {
        filtered = filtered.filter(job =>
            job.salary_range.min && job.salary_range.min >= filters.salary_min!
        );
    }

    if (filters.skills && filters.skills.length > 0) {
        filtered = filtered.filter(job =>
            filters.skills!.some(skill =>
                job.required_skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
            )
        );
    }

    return filtered;
}

export async function getUserProfile(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        user_id: 'default_user',
        name: 'Alex DevSecOps',
        email: 'alex@example.com',
        phone: '+254 712 345 678',
        skills: ['AWS', 'Terraform', 'Python', 'CI/CD', 'Docker', 'Kubernetes', 'IAM', 'Security', 'GitHub Actions', 'Linux'],
        years_experience: 5,
        target_titles: ['Senior DevOps Engineer', 'Cloud Security Engineer', 'DevSecOps Engineer'],
        preferences: {
            remote: true,
            locations: ['Nairobi', 'Remote', 'Berlin', 'London'],
            min_salary: 100000
        }
    };
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Profile updated:', profile);
}

export async function getApplications(): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_APPLICATIONS;
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Application ${applicationId} status updated to ${status}`);
}

export async function addApplicationNote(applicationId: string, content: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Note added to application ${applicationId}:`, content);
}

export async function getUserSettings(): Promise<UserSettings> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        notifications: {
            email_enabled: true,
            push_enabled: false,
            frequency: 'daily',
            types: {
                new_matches: true,
                application_updates: true,
                reminders: true
            }
        },
        job_alerts: [
            {
                alert_id: '1',
                name: 'Senior DevOps Roles',
                filters: {
                    search: 'DevOps',
                    remote_policy: ['Remote'],
                    salary_min: 120000
                },
                frequency: 'daily',
                enabled: true
            }
        ],
        appearance: {
            theme: 'system',
            density: 'comfortable'
        },
        privacy: {
            profile_visible: true,
            share_analytics: true
        }
    };
}

export async function updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Settings updated:', settings);
}
