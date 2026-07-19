export type ResumeEducation = {
  degree: string;
  institution: string;
  year: string;
};

export type ResumeExperience = {
  role: string;
  organization: string;
  from: string;
  to: string;
};

export type ResumeSocialLinks = {
  linkedin: string;
  instagram: string;
  website: string;
  twitter: string;
};

export type DoctorResumeFormValues = {
  title: string;
  bio: string;
  specialization: string;
  content: string;
  educations: ResumeEducation[];
  experiences: ResumeExperience[];
  skills: string[] | string;
  certifications: string[] | string;
  social_links: ResumeSocialLinks;
  file?: FileList | File | null;
  file_url?: string | null;
};

export type DoctorResumeApi = DoctorResumeFormValues & {
  id?: number | string | null;
  doctor_id?: string | null;
  file_path?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};
