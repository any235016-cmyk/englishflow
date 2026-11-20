'use client';

import React from 'react';
import { DictionaryView } from '@/components/DictionaryView';
import { BookMarked, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DictionaryPage() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-6"
      >
        <BookMarked className="w-7 h-7" />
        <h1 className="text-2xl font-extrabold">Vocabulary Dictionary & Hub</h1>
      </motion.div>

      <DictionaryView />
    </div>
  );
}