'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UNITS_DATA } from '@/data/lessons';
import { Lesson } from '@/types';
import { userProfileStore } from '@/lib/store';
import { FlashcardComponent } from '@/components/FlashcardComponent';
import { PronunciationTrainer } from '@/components/PronunciationTrainer';
import { ExerciseEngine } from '@/components/ExerciseEngine';
import { BookOpen, Mic, CheckSquare, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function LessonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams.get('id') || 'u1-l1';

  const allLessons = UNITS_DATA.flatMap((u) => u.lessons);
  const currentLesson = allLessons.find((l) => l.id === lessonId) || allLessons[0];

  const [activeTab, setActiveTab] = useState<'flashcards' | 'speaking' | 'quiz'>('flashcards');
  const [speakingSuccess, setSpeakingSuccess] = useState(false);

  const handleLessonCompleted = (xpEarned: number) => {
    userProfileStore.addXp(xpEarned);
    userProfileStore.completeLesson(currentLesson.id);
  };

  const nextLessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id) + 1;
  const nextLesson = nextLessonIndex < allLessons.length ? allLessons[nextLessonIndex] : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
            {currentLesson.unitTitle}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
            {currentLesson.title}{' '}
            <span className="text-slate-400 text-lg font-normal">({currentLesson.titleAr})</span>
          </h1>
        </div>

        {/* Lesson Navigation Tabs */}
        <div className="flex gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('speaking')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'speaking'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Speaking</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Quiz & XP</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'flashcards' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FlashcardComponent
              vocabulary={currentLesson.vocabulary}
              onComplete={() => setActiveTab('speaking')}
            />
          </motion.div>
        )}

        {activeTab === 'speaking' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <PronunciationTrainer
              targetPhrase={currentLesson.vocabulary[0]?.word || 'Hello! How are you?'}
              targetTranslation={currentLesson.vocabulary[0]?.translation || 'مرحباً! كيف حالك؟'}
              onSuccess={(acc) => {
                setSpeakingSuccess(true);
                userProfileStore.addXp(20);
                userProfileStore.addSpeakingRecord({
                  text: currentLesson.vocabulary[0]?.word || 'Hello',
                  accuracy: acc,
                });
              }}
            />

            <div className="flex justify-center">
              <button
                onClick={() => setActiveTab('quiz')}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95"
              >
                <span>Continue to Quiz & Exercises</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ExerciseEngine
              exercises={currentLesson.exercises}
              onCompleteLesson={handleLessonCompleted}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading lesson content...</div>}>
      <LessonContent />
    </Suspense>
  );
}
