export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // Stored as plain text, bullet points separated by newlines
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  link: string;
  description: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CVData {
  id: string;
  title: string; // Internal name for the CV
  lastModified: number;
  templateId: 'minimal' | 'modern' | 'professional';
  
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    links: SocialLink[];
    photo?: string; // Base64 string for the image
  };
  
  summary: string;
  
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[]; // Array of strings
  languages: string[];
  certifications: string[];
}

export const INITIAL_CV_DATA: CVData = {
  id: '',
  title: 'Untitled CV',
  lastModified: Date.now(),
  templateId: 'minimal',
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    links: [],
    photo: ''
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: []
};