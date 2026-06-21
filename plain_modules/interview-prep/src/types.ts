export interface Interview {
  id: string;
  company: string;
  role: string;
  date: string;
  matchPercentage: number;
}

export interface Message {
  id: number;
  sender: 'AI' | 'User';
  text: string;
}

export interface InterviewMetrics {
  communication: number;
  confidence: number;
  structure: number;
  relevance: number;
  technicalDepth: number;
  questionsAnswered: number;
  totalQuestions: number;
  suggestions: string[];
}