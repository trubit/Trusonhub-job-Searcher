export interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Experience {
  _id: string;
  companyName: string;
  position: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  responsibilities?: string;
  achievements?: string;
}

export interface Skill {
  _id: string;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
}

export interface Certification {
  _id: string;
  name: string;
  organization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Language {
  _id: string;
  name: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'FLUENT' | 'NATIVE';
}

export interface Portfolio {
  _id: string;
  projectName: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  images: string[];
}

export interface ProfileCompletion {
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All-Star';
  breakdown: {
    photo: boolean;
    headlineAndAbout: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    resume: boolean;
    portfolio: boolean;
  };
  recommendations: string[];
}

export interface JobSeekerProfileData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role: string;
    isEmailVerified?: boolean;
  };
  profile: {
    headline?: string;
    about?: string;
    phoneNumber?: string;
    location?: {
      country?: string;
      state?: string;
      city?: string;
      address?: string;
    };
    currentPosition?: string;
    yearsOfExperience?: number;
    industry?: string;
    employmentStatus?: string;
    preferredJobType?: string;
    preferredWorkMode?: string;
    expectedSalary?: string;
    socialLinks?: {
      portfolio?: string;
      github?: string;
      linkedin?: string;
      behance?: string;
      dribbble?: string;
      personal?: string;
    };
    completionPercentage: number;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  portfolio: Portfolio[];
  completion: ProfileCompletion;
}
