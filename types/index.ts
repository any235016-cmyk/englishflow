export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  unitId: string;
  unitTitle: string;
  order: number;
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
  conversationScenarios: ConversationScenario[];
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  example: string;
  exampleAr: string;
  category: string;
  audioUrl?: string;
  practiced?: boolean;
  lastPracticed?: string;
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'build-sentence';
  question: string;
  questionAr?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  explanationAr?: string;
  sentenceWords?: string[];
}

export interface ConversationScenario {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  starterPrompt: string;
}

export interface Unit {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  lessons: Lesson[];
}

export interface UserProfile {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  vocabulary: Record<string, VocabularyItem>;
  weakWords: string[];
  speakingHistory: SpeakingRecord[];
}

export interface SpeakingRecord {
  id: string;
  text: string;
  timestamp: string;
  accuracy: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  grammarTip?: string;
  audioUrl?: string;
  timestamp: string;
}

export interface ChatState {
  messages: ChatMessage[];
  scenario: string;
  scenarioName: string;
}