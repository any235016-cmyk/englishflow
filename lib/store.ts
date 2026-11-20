import { UserProfile, Lesson, Unit } from '@/types';

const STORAGE_KEY = 'learn-english-user';
const LESSONS_KEY = 'learn-english-lessons';

const defaultProfile: UserProfile = {
  name: 'Learner',
  level: 'beginner',
  xp: 0,
  streak: 0,
  lastActive: new Date().toISOString(),
  completedLessons: [],
  vocabulary: {},
  weakWords: [],
  speakingHistory: [],
};

const UNITS: Unit[] = [
  {
    id: 'unit-1',
    title: 'Greetings & Basics',
    titleAr: 'التحيات والأساسيات',
    description: 'Learn essential greetings and introductions',
    descriptionAr: 'تعلم التحيات الأساسية والمقدمات',
    order: 1,
    lessons: [],
  },
  {
    id: 'unit-2',
    title: 'Numbers & Time',
    titleAr: 'الأرقام والوقت',
    description: 'Count, tell time, and talk about dates',
    descriptionAr: 'عدّ الأرقام، وحدد الوقت، وتحدث عن التواريخ',
    order: 2,
    lessons: [],
  },
  {
    id: 'unit-3',
    title: 'Everyday Vocabulary',
    titleAr: 'المفردات اليومية',
    description: 'Food, family, travel, and daily activities',
    descriptionAr: 'الطعام، العائلة، السفر، والأنشطة اليومية',
    order: 3,
    lessons: [],
  },
  {
    id: 'unit-4',
    title: 'Simple Sentences & Grammar',
    titleAr: 'الجمل البسيطة والنحو',
    description: 'Build sentences, verb "to be", present simple',
    descriptionAr: 'بناء الجمل، فعل "كون"، والمضارع البسيط',
    order: 4,
    lessons: [],
  },
  {
    id: 'unit-5',
    title: 'Real-Life Conversations',
    titleAr: 'الحوارات الواقعية',
    description: 'Practice real conversations you\'ll use daily',
    descriptionAr: 'تمرين الحوارات اليومية التي ستستخدمها',
    order: 5,
    lessons: [],
  },
];

export const userProfileStore = {
  get(): UserProfile {
    if (typeof window === 'undefined') return defaultProfile;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },

  save(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  },

  addXp(amount: number): UserProfile {
    const profile = this.get();
    profile.xp = (profile.xp || 0) + amount;
    const today = new Date();
    const lastActive = new Date(profile.lastActive);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (lastActive < yesterday) {
      profile.streak = 0;
    } else if (lastActive.toDateString() === today.toDateString()) {
      // Already counted today
    } else {
      profile.streak += 1;
    }
    profile.lastActive = today.toISOString();
    this.save(profile);
    return profile;
  },

  completeLesson(lessonId: string): UserProfile {
    const profile = this.get();
    if (!profile.completedLessons.includes(lessonId)) {
      profile.completedLessons.push(lessonId);
      this.save(profile);
    }
    return profile;
  },

  addSpeakingRecord(record: {
    text: string;
    accuracy: number;
  }): UserProfile {
    const profile = this.get();
    profile.speakingHistory.push({
      id: Date.now().toString(),
      text: record.text,
      timestamp: new Date().toISOString(),
      accuracy: record.accuracy,
    });
    this.save(profile);
    return profile;
  },
};

// Static lesson data - will be populated from data files
export const lessonsData: Record<string, Lesson> = {};