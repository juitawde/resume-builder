import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gradeOrGpa: { type: String, default: '' },
  location: { type: String, default: '' },
  highlights: [{ type: String }]
}, { _id: true });

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'AI & Machine Learning', 'Languages', 'Tools & Platforms', 'Soft Skills', 'Other'],
    default: 'Other'
  },
  proficiencyLevel: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Advanced'
  },
  yearsOfExperience: { type: Number, default: 1 }
}, { _id: true });

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  employmentType: { type: String, default: 'Full-time' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: 'Present' },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
  technologiesUsed: [{ type: String }]
}, { _id: true });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  role: { type: String, default: 'Lead Developer' },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
  techStack: [{ type: String }],
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' }
}, { _id: true });

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuingOrg: { type: String, required: true },
  issueDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  skillsCovered: [{ type: String }]
}, { _id: true });

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: true });

const PublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  publisher: { type: String, default: '' },
  publicationDate: { type: String, default: '' },
  url: { type: String, default: '' },
  summary: { type: String, default: '' }
}, { _id: true });

const LanguageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { 
    type: String, 
    enum: ['Native', 'Fluent', 'Professional Working', 'Intermediate', 'Elementary'],
    default: 'Professional Working'
  }
}, { _id: true });

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, default: 'default_user', index: true },
  personalInfo: {
    fullName: { type: String, default: '' },
    title: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedIn: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  professionalSummary: { type: String, default: '' },
  education: [EducationSchema],
  skills: [SkillSchema],
  experience: [ExperienceSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  achievements: [AchievementSchema],
  publications: [PublicationSchema],
  languages: [LanguageSchema],
  customCompetencies: [{ type: String }],
  lastSyncedWithSheets: { type: Date, default: null }
}, { 
  timestamps: true 
});

export const Portfolio = mongoose.model('Portfolio', PortfolioSchema);
