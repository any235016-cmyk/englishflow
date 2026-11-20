'use client';

import React, { useState } from 'react';
import { UNITS_DATA } from '@/data/lessons';
import { PronunciationTrainer } from '@/components/PronunciationTrainer';
import { userProfileStore } from '@/lib/store';
import { BookOpen, Mic, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SpeakingPage() {
  // For simplicity, pick the first vocabulary item of the first lesson as a practice phrase
  const firstLesson = UNITS_DATA[0].lessons[0];
  const phrase = firstLesson.vocabulary[0];

  const handleSuccess = (accuracy: number) => {
    // Reward XP for successful pronunciation
    userProfileStore.addXp(20);
    userProfileStore.addSpeakingRecord({
      text: phrase.word,
      accuracy,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400"
      >
        <Mic className="w-6 h-6" />
        <h1 className="text-2xl font-extrabold">Speaking Practice</h1>
      </motion.div>

      <PronunciationTrainer
        targetPhrase={phrase.word}
        targetTranslation={phrase.translation}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
