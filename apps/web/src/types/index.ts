export interface User {
  _id: string;
  clerkId: string;
  displayName: string;
  targetRole: string;
  yearsOfExperience: number;
  professionalSummary: string;
  settings: { voiceOutputEnabled: boolean; aiVerbosity: 'concise' | 'detailed' };
  gamification: { xp: number; streak: number; milestones: Milestone[] };
}

export interface Milestone { id: string; achievedAt: string; }

export interface ParsedResume {
  contact: Record<string, string>;
  summary: string;
  workExperience: Record<string, string>[];
  education: Record<string, string>[];
  skills: string[];
  certifications: string[];
}

export interface Resume {
  _id: string;
  cloudinaryUrl: string;
  uploadedAt: string;
  parsed: ParsedResume;
  rawText: string;
  isActive: boolean;
}

export interface ATSAnalysis {
  _id: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  formattingFeedback: string;
  analyzedAt: string;
}

export interface JDMatch {
  _id: string;
  jobDescription: string;
  label: string;
  compatibilityScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedActions: string[];
  createdAt: string;
}

export interface QuestionFeedback {
  communicationClarity: number;
  technicalDepth: number;
  confidenceIndicators: number;
  answerRelevance: number;
  improvementSuggestion: string;
}

export interface Question {
  questionText: string;
  userResponse: string;
  feedback: QuestionFeedback;
}

export interface InterviewSession {
  _id: string;
  targetRole: string;
  interviewType: 'Behavioral' | 'Technical' | 'Mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: Question[];
  overallScore: number;
  startedAt: string;
  completedAt: string | null;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  skills: string[];
  certifications: string[];
  projects: string[];
  resources: { title: string; url: string }[];
  completed: boolean;
  completedAt: string | null;
}

export interface Roadmap {
  _id: string;
  targetRole: string;
  targetDuration: '1 month' | '3 months' | '6 months' | '1 year' | '2 years';
  phases: RoadmapPhase[];
  completionPercentage: number;
  generatedAt: string;
}

export interface Recommendation {
  priority: number;
  text: string;
  actionLink: string;
}

export interface DashboardMetrics {
  latestATSScore: number | null;
  completedInterviews: number;
  roadmapCompletion: number | null;
  currentXP: number;
  streak: number;
  recommendations: Recommendation[];
}

export interface ProgressData {
  atsScores: { date: string; score: number }[];
  interviewScores: { date: string | null; score: number }[];
  xpHistory: { date: string; xp: string }[];
  currentStreak: number;
  currentXP: number;
  roadmapMilestones: { phase: number; title: string; completedAt: string | null }[];
}

export interface SkillGapResult {
  present: string[];
  partiallyPresent: string[];
  missing: string[];
}
