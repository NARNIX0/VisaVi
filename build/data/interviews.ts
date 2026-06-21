import type {
  UpcomingInterview,
  InterviewMetrics,
  AISuggestion,
} from "@/types";

// A single chat bubble in the live mock interview (Artboard 5).
export interface InterviewMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  /** Display timestamp, e.g. "04:21". */
  timestamp: string;
}

// Upcoming interviews column (match scores from the mockup).
export const upcomingInterviews: UpcomingInterview[] = [
  {
    id: "up-deloitte",
    company: "Deloitte",
    companyInitials: "D.",
    logoColor: "#111827",
    role: "Graduate Analyst",
    matchScore: 92,
    scheduledFor: "Tomorrow, 2:00 PM",
  },
  {
    id: "up-google",
    company: "Google",
    companyInitials: "G",
    logoColor: "#4285F4",
    role: "Software Engineer, University Graduate",
    matchScore: 88,
    scheduledFor: "Thu, 10:30 AM",
  },
  {
    id: "up-jpmorgan",
    company: "JPMorgan",
    companyInitials: "JP",
    logoColor: "#003366",
    role: "Technology Analyst (Graduate)",
    matchScore: 85,
    scheduledFor: "Fri, 4:00 PM",
  },
];

// Live feedback scores (0–10) shown as progress bars in the mockup.
export const liveMetrics: InterviewMetrics = {
  communication: 8.5,
  confidence: 7.8,
  structure: 8.0,
  relevance: 9.0,
  technicalDepth: 7.2,
};

// AI suggestions list with coloured dots.
export const aiSuggestions: AISuggestion[] = [
  {
    id: "sug-1",
    text: "Use the STAR method to structure your behavioural answers.",
    color: "#22C55E",
  },
  {
    id: "sug-2",
    text: "Slow down slightly — you're speaking a little fast under pressure.",
    color: "#F59E0B",
  },
  {
    id: "sug-3",
    text: "Add a concrete metric to quantify the impact of your last project.",
    color: "#3B82F6",
  },
];

// Sample mock interview transcript (AI + user bubbles).
export const mockInterviewMessages: InterviewMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Welcome! Let's start with a classic: tell me about a challenging project you worked on and how you approached it.",
    timestamp: "00:12",
  },
  {
    id: "msg-2",
    sender: "user",
    text: "Sure. In my final year I built a real-time data dashboard for a local charity. The main challenge was handling live updates without overloading the browser.",
    timestamp: "00:48",
  },
  {
    id: "msg-3",
    sender: "ai",
    text: "Great context. How did you solve the performance problem specifically?",
    timestamp: "01:20",
  },
  {
    id: "msg-4",
    sender: "user",
    text: "I batched updates and used WebSockets with debouncing, which cut re-renders by about 70% and kept the UI smooth.",
    timestamp: "02:05",
  },
];

// Mock interview session progress (Artboard 5 right column).
export const interviewProgress = {
  questionsAnswered: 3,
  totalQuestions: 8,
  /** Remaining time display string. */
  timeRemaining: "18:20",
  difficulty: "Hard" as const,
};
