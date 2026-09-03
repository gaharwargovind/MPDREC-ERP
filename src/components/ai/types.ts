export type AiModelMode = 'flash' | 'deep_reasoning';

export type PromptCategory = 
  | 'all' 
  | 'academics' 
  | 'exams' 
  | 'regulations' 
  | 'councils' 
  | 'code_labs' 
  | 'hostel_library';

export interface ThinkingStep {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  detail?: string;
  source?: string;
}

export type ArtifactType = 
  | 'roadmap' 
  | 'timetable_countdown' 
  | 'grade_simulator' 
  | 'code_sandbox' 
  | 'ordinance_doc' 
  | 'council_matrix'
  | 'attendance_audit';

export interface StudyRoadmapMilestone {
  week: number;
  title: string;
  topics: string[];
  difficulty: 'Easy' | 'Moderate' | 'High-Yield' | 'AKTU Core';
  hoursNeeded: number;
  completed?: boolean;
}

export interface StudyRoadmapData {
  subjectCode: string;
  subjectName: string;
  targetExam: string;
  estimatedWeeks: number;
  milestones: StudyRoadmapMilestone[];
  highYieldTips: string[];
  referenceBooks: string[];
}

export interface TimetableCountdownData {
  currentDay: string;
  currentTime: string;
  nextClass: {
    subject: string;
    code: string;
    faculty: string;
    room: string;
    timeSlot: string;
    startsInMinutes: number;
  };
  schedule: Array<{
    timeSlot: string;
    subject: string;
    code: string;
    room: string;
    faculty: string;
    isCurrent?: boolean;
    isNext?: boolean;
  }>;
  quickNote?: string;
}

export interface GradeSimulatorSubject {
  id: string;
  name: string;
  code: string;
  credits: number;
  ct1: number; // Max 30
  ct2: number; // Max 30
  assignment: number; // Max 20
  endSem: number; // Max 100 (scaled to 70)
  targetGrade?: string;
}

export interface GradeSimulatorData {
  semester: number;
  currentCgpa: number;
  subjects: GradeSimulatorSubject[];
  targetSgpa: number;
}

export interface CodeSandboxData {
  language: 'cpp' | 'java' | 'python' | 'sql' | 'c';
  title: string;
  description: string;
  code: string;
  explanation: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  expectedOutput?: string;
}

export interface OrdinanceDocData {
  clauseNumber: string;
  title: string;
  category: 'Attendance' | 'Grading' | 'Hostel' | 'Exam Promotion' | 'Grace Marks';
  officialText: string;
  practicalImplication: string;
  reliefMechanism: string;
  ordinanceYear: string;
}

export interface AiArtifact {
  id: string;
  type: ArtifactType;
  title: string;
  subtitle: string;
  badge: string;
  createdAt: string;
  data: StudyRoadmapData | TimetableCountdownData | GradeSimulatorData | CodeSandboxData | OrdinanceDocData | any;
}

export interface GroundingSource {
  title: string;
  citation: string;
  type: 'aktu_ordinance' | 'syllabus_doc' | 'erp_live_data' | 'council_constitution' | 'hostel_manual';
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  category?: PromptCategory;
  modelMode?: AiModelMode;
  thinkingSteps?: ThinkingStep[];
  thinkingDurationSec?: number;
  groundingSources?: GroundingSource[];
  artifact?: AiArtifact;
  isStreaming?: boolean;
}

export interface OmnibarResult {
  id: string;
  title: string;
  category: 'academics' | 'councils' | 'people' | 'navigation' | 'ai_prompts';
  description: string;
  iconName: string;
  badge?: string;
  shortcut?: string;
  action: () => void;
}
