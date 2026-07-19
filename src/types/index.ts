export interface Profile {
  kidName: string;
  fatherName: string;
  motherName: string;
  language?: string;
  purpose?: string;
  gender?: string;
}

export interface Slide {
  telugu: string;
  english: string;
  image?: string;
  imagePrompt?: string;
  teluguSentences?: { text: string; mood: string }[];
  englishSentences?: { text: string; mood: string }[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  category: string;
  slides: Slide[];
  created_at: string;
}

export interface God {
  id: string;
  name: string;
  emoji?: string;
  image?: string;
}

export interface Poem {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export type SecurityReason = 'rooted' | 'emulator' | 'unsupported';

export type SecurityCheckResult =
  | { secure: true }
  | { secure: false; reason: SecurityReason };
