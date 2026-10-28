import mongoose from 'mongoose';

const CustomResumeSchema = new mongoose.Schema({
  userId: { type: String, default: 'default_user', index: true },
  title: { type: String, required: true },
  targetRole: { type: String, default: '' },
  targetCompany: { type: String, default: '' },
  jobDescription: { type: String, required: true },
  
  // Gemini AI Analysis
  jdAnalysis: {
    matchScore: { type: Number, default: 0 },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    keywords: [{ type: String }],
    strengths: [{ type: String }],
    recommendations: [{ type: String }]
  },

  // Customized content derived purely from verified portfolio
  customizedSummary: { type: String, default: '' },
  selectedSkills: [{ type: String }],
  selectedExperiences: [{
    experienceId: { type: String },
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    location: String,
    tailoredBullets: [String]
  }],
  selectedProjects: [{
    projectId: { type: String },
    title: String,
    role: String,
    techStack: [String],
    liveUrl: String,
    githubUrl: String,
    tailoredBullets: [String]
  }],
  selectedEducation: [{
    educationId: { type: String },
    institution: String,
    degree: String,
    fieldOfStudy: String,
    endDate: String,
    gradeOrGpa: String
  }],
  selectedCertifications: [{
    certificationId: { type: String },
    name: String,
    issuingOrg: String,
    issueDate: String
  }],
  selectedAchievements: [{
    achievementId: { type: String },
    title: String,
    issuer: String,
    date: String
  }],
  selectedLanguages: [{
    name: String,
    proficiency: String
  }],

  templateStyle: { 
    type: String, 
    enum: ['modern-rose', 'executive-clean', 'compact-tech'],
    default: 'modern-rose'
  }
}, { 
  timestamps: true 
});

export const CustomResume = mongoose.model('CustomResume', CustomResumeSchema);
