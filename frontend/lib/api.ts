import { Job, UserProfile, Application, ApplicationStatus, JobFilters, UserSettings } from '@/types/job';

// Basic input sanitization simulation for security
const sanitizeInput = (str: string) => {
    return str.replace(/[<>]/g, '').trim();
};

export const MOCK_JOBS: Job[] = [
    {
        job_id: '1',
        job_title: 'Senior Full Stack Engineer (Remote)',
        company_name: 'TechFlow Systems',
        company_logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop',
        location: 'San Francisco, CA / Remote',
        remote_policy: 'Remote',
        salary_range: {
            min: 160000,
            max: 210000,
            currency: 'USD',
            frequency: 'annual'
        },
        fit_score: 95,
        match_reasons: [
            'Expertise in TypeScript and React ecosystem fits perfectly',
            'Strong background in AWS architecture and Serverless matches job requirements',
            'Prior experience in AI-driven automation projects is a significant plus'
        ],
        required_skills: ['TypeScript', 'React', 'Node.js', 'AWS', 'Next.js', 'PostgreSQL'],
        preferred_skills: ['GraphQL', 'Vite', 'Turborepo'],
        description: 'Join TechFlow as a Senior Full Stack Engineer to lead our core product development. We leverage AI to automate complex dev workflows.',
        top_3_responsibilities: [
            'Lead technical design and implementation of new features',
            'Architect scalable backend services using AWS Lambda and DynamoDB',
            'Optimize frontend performance for data-intensive dashboards'
        ],
        responsibilities: [
            'Lead technical design and implementation of new features',
            'Architect scalable backend services using AWS Lambda and DynamoDB',
            'Optimize frontend performance for data-intensive dashboards',
            'Mentor junior engineers and drive code quality standards'
        ],
        benefits: ['Full remote work', 'Top-tier health insurance', '401(k) matching', 'Learning stipend'],
        years_of_experience: {
            min_years: 5,
            max_years: null,
            raw_text: '5+ years'
        },
        clearance_required: false,
        visa_sponsorship: true,
        tech_stack_summary: 'TypeScript, React, Node.js, AWS, Next.js',
        analyzed_at: '2026-02-12T10:00:00Z',
        posted_at: '2026-02-12T09:00:00Z',
        lat: 37.7749,
        lng: -122.4194
    },
    {
        job_id: '2',
        job_title: 'Backend Infrastructure Architect',
        company_name: 'Nexus Cloud',
        company_logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
        location: 'Austin, TX',
        remote_policy: 'Hybrid',
        salary_range: {
            min: 180000,
            max: 240000,
            currency: 'USD',
            frequency: 'annual'
        },
        fit_score: 88,
        match_reasons: [
            'Extensive experience with Terraform and Infrastructure as Code',
            'Proven track record in building high-availability systems',
            'Security-first mindset aligns with our core infrastructure principles'
        ],
        required_skills: ['Terraform', 'Kubernetes', 'Go', 'Python', 'Docker', 'Security'],
        preferred_skills: ['Rust', 'eBPF'],
        description: 'Nexus Cloud is seeking an Architect to define the future of our globally distributed infrastructure.',
        top_3_responsibilities: [
            'Design and maintain global K8s clusters',
            'Automate infrastructure provisioning with Terraform',
            'Implement advanced security monitoring'
        ],
        responsibilities: [
            'Design and maintain global K8s clusters',
            'Automate infrastructure provisioning with Terraform and Pulumi',
            'Implement advanced security monitoring and incident response',
            'Collaborate with product teams to optimize resource utilization'
        ],
        years_of_experience: {
            min_years: 8,
            max_years: null,
            raw_text: '8+ years'
        },
        clearance_required: true,
        visa_sponsorship: false,
        tech_stack_summary: 'K8s, Terraform, Go, Python, Security',
        analyzed_at: '2026-02-12T14:00:00Z',
        posted_at: '2026-02-12T12:00:00Z',
        lat: 40.7128,
        lng: -74.0060
    },
    {
        job_id: '3',
        job_title: 'Lead UI/UX Developer',
        company_name: 'Vibrant Creators',
        company_logo: 'https://images.unsplash.com/photo-1572044162444-ad60f12a9595?w=100&h=100&fit=crop',
        location: 'New York, NY',
        remote_policy: 'Onsite',
        salary_range: {
            min: 140000,
            max: 190000,
            currency: 'USD',
            frequency: 'annual'
        },
        fit_score: 92,
        match_reasons: [
            'Advanced proficiency in modern CSS and Framer Motion',
            'Strong eye for detail and interaction design',
            'Deep understanding of design systems and accessibility'
        ],
        required_skills: ['React', 'CSS', 'Framer Motion', 'Figma', 'Web Accessibility', 'Tailwind'],
        preferred_skills: ['D3.js', 'Three.js'],
        description: 'Drive the visual identity of our creative platform. We need someone who brings designs to life with smooth interactions.',
        top_3_responsibilities: [
            'Lead implementation of design system',
            'Develop high-fidelity prototypes',
            'Ensure accessibility standards'
        ],
        years_of_experience: {
            min_years: 6,
            max_years: null,
            raw_text: '6+ years'
        },
        clearance_required: false,
        visa_sponsorship: true,
        tech_stack_summary: 'React, Tailwind, Framer Motion, accessibility',
        analyzed_at: '2026-02-13T09:00:00Z',
        posted_at: '2026-02-13T08:30:00Z',
        lat: -1.2921,
        lng: 36.8219
    }
];

export const MOCK_APPLICATIONS: Application[] = [
    {
        application_id: 'app_1',
        job: MOCK_JOBS[0],
        status: 'interview',
        applied_date: '2026-02-01T10:00:00Z',
        last_updated: '2026-02-13T09:00:00Z',
        notes: [
            { note_id: 'n1', content: 'First technical interview went great! Discussed system design in detail.', created_at: '2026-02-08T15:00:00Z' },
            { note_id: 'n2', content: 'Need to prepare more on DynamoDB GSI patterns for the final round.', created_at: '2026-02-13T09:00:00Z' }
        ],
        timeline: [
            { event_id: 'e1', type: 'status_change', description: 'Application Submitted', timestamp: '2026-02-01T10:00:00Z' },
            { event_id: 'e2', type: 'status_change', description: 'Moved to Screening', timestamp: '2026-02-03T11:20:00Z' },
            { event_id: 'e3', type: 'status_change', description: 'Interview Scheduled', timestamp: '2026-02-07T14:45:00Z' }
        ],
        resume_version: 'Standard_FullStack_2026.pdf'
    },
    {
        application_id: 'app_2',
        job: MOCK_JOBS[1],
        status: 'applied',
        applied_date: '2026-02-11T16:00:00Z',
        last_updated: '2026-02-11T16:00:00Z',
        notes: [],
        timeline: [
            { event_id: 'e4', type: 'status_change', description: 'Application Submitted', timestamp: '2026-02-11T16:00:00Z' }
        ]
    }
];

export async function getJobs(): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_JOBS;
}

export async function searchJobs(filters: JobFilters): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...MOCK_JOBS];

    if (filters.search) {
        const search = sanitizeInput(filters.search).toLowerCase();
        filtered = filtered.filter(job =>
            job.job_title.toLowerCase().includes(search) ||
            job.company_name?.toLowerCase().includes(search) ||
            job.required_skills.some(s => s.toLowerCase().includes(search))
        );
    }

    if (filters.remote_policy && filters.remote_policy.length > 0) {
        filtered = filtered.filter(job => filters.remote_policy?.includes(job.remote_policy));
    }

    if (filters.salary_min) {
        filtered = filtered.filter(job => (job.salary_range.min || 0) >= (filters.salary_min || 0));
    }

    return filtered;
}

export async function getUserProfile(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        user_id: 'user_1',
        name: 'AmoreGiTs',
        email: 'amore.gamore@gmail.com',
        phone: '+1 (555) 012-3456',
        skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'AWS', 'Terraform', 'Python'],
        years_experience: 5,
        target_titles: ['Senior Full Stack Engineer', 'Cloud Architect', 'DevSecOps Specialist'],
        preferences: {
            remote: true,
            locations: ['San Francisco', 'Austin', 'Remote'],
            min_salary: 150000
        }
    };
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    console.log(`Note added to application ${applicationId}: ${content}`);
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
                alert_id: 'alert_1',
                name: 'Full Stack Remote',
                filters: { search: 'Full Stack', remote_policy: ['Remote'] },
                frequency: 'instant',
                enabled: true
            }
        ],
        appearance: {
            theme: 'dark',
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
