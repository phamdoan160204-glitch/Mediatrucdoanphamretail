export interface Store {
  id: number;
  name: string;
  creator: string;
  style: string;
  targetAudience: string;
  category: "bags" | "shoes" | "both";
}

export interface Scene {
  sceneNumber: number;
  visual: string;
  audio: string;
  textOverlay: string;
  note?: string;
}

export interface GeneratedScript {
  concept: string;
  title: string;
  hook: string;
  targetAudience: string;
  scenes: Scene[];
  voiceover: string;
  recommendations: string;
}

export interface DailyIdea {
  id: string;
  title: string;
  conceptType: string;
  shortDescription: string;
  estimatedDuration: string;
  difficulty: "Dễ" | "Trung bình" | "Khó" | string;
  promptSuggestion: string;
}

export interface ChineseAnalysisResult {
  originalSummary: string;
  localizedConcept: string;
  culturalAdjustments: string;
  vietnameseTitle: string;
  scenes: Scene[];
  suggestedCaption: string;
}

export interface HookOptimizedResult {
  originalCritique: string;
  optimizedHooks: {
    type: string;
    hookText: string;
    action: string;
  }[];
  improvedTransitions: string;
  refinedScript: string;
}

export interface CaptionOption {
  id: number;
  style: string;
  caption: string;
  hashtags: string[];
  cta: string;
}

export interface ScheduleItem {
  id: string;
  storeId: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // 'Sáng (11h)', 'Chiều (15h)', 'Tối (20h)'
  title: string;
  concept?: string;
  caption?: string;
  hashtags?: string[];
  status: "nháp" | "duyệt" | "đã đăng";
  tiktokUrl?: string; // Optlink to analyze
}

export interface TikTokReview {
  id: string;
  tiktokUrl: string;
  storeId: number;
  creator: string;
  concept: string;
  submittedAt: string;
  identifiedConcept: string;
  hookRating: string;
  hookAnalysis: string;
  visualRating: string;
  audioRating: string;
  weeklyPerformanceSummary: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    grade: string;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface FounderIdea {
  id: string;
  title: string;
  description: string;
  category: "bags" | "shoes" | "both";
  styleSuggestion: string;
  likes: number;
  createdAt: string;
  status: "mới" | "đã lấy";
  claimedBy?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: "admin" | "staff";
  pin: string;
  storeId?: number;
}


