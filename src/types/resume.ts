export interface ExternalLink {
    label: string;
    url: string;
}

export interface PersonalDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    links: ExternalLink[];
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    graduationDate: string;
    gpa?: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    link?: string;
}

export interface ResumeData {
    personalDetails: PersonalDetails;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    certifications: string[];
    projects: Project[];
    achievements: string[];
}

export const INITIAL_RESUME_DATA: ResumeData = {
    personalDetails: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        links: [],
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    achievements: [],
};
