export interface ProfileData {
  name: string;
  englishName: string;
  photoUrl: string;
  email: string;
  titles: string[];
  websites: Array<{ name: string; url: string }>;
  biography: string;
  researchInterests: string[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  category: string;
  link: string;
  abstract: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface BreathPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
}
