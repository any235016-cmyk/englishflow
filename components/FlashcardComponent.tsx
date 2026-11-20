'use client';

import React, { useState } from 'react';
import { VocabularyItem } from '@/types';
import { AudioButton } from './AudioButton';
import { RotateCw, CheckCircle2, ChevronRight, ChevronLeft, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardComponentProps {
  vocabulary: VocabularyItem[];
  onComplete?: () => void;
}

export const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  vocabulary,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  if (!vocabulary || vocabulary.length === 0) {
    return <div className="p-6 text-center text-slate-500">No flashcards available.</div>;
  }

  const currentItem = vocabulary[currentIndex];
  const isMastered = masteredIds.includes(currentItem.id);

  const toggleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMastered) {
      setMasteredIds(masteredIds.filter((id) => id !== currentItem.id));
    } else {
      setMasteredIds([...masteredIds, currentItem.id]);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 px-4">
      {/* Top progress */}
      <div className="flex justify-between items-center mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>
          Card {currentIndex + 1} of {vocabulary.length}
        </span>
        <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">
          {masteredIds.length} Mastered
        </span>
      </div>

      {/* Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 perspective-1000 cursor-pointer select-none"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-full h-full relative preserve-3d shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          {/* Front Face */}
          <div className="absolute inset-0 backface-hidden p-8 flex flex-col justify-between rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-400">
                {currentItem.category || 'Vocabulary'}
              </span>
              <button
                onClick={toggleMastered}
                className={`p-2 rounded-full transition-colors ${
                  isMastered
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Bookmark className="w-5 h-5" fill={isMastered ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="text-center my-auto">
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                {currentItem.word}
              </h2>
              <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400 mb-6">
                {currentItem.phonetic}
              </p>
              <div className="flex justify-center gap-2">
                <AudioButton text={currentItem.word} size="lg" />
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 text-xs text-slate-400 font-medium">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click card to see Arabic translation & example</span>
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 flex flex-col justify-between rounded-3xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Arabic Meaning
              </span>
              <button
                onClick={toggleMastered}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isMastered ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isMastered ? '✓ Mastered' : '+ Mark as Mastered'}
              </button>
            </div>

            <div className="text-center my-auto space-y-4">
              <h3 className="text-3xl font-bold text-emerald-300 dir-rtl" dir="rtl">
                {currentItem.translation}
              </h3>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 text-left space-y-2">
                <p className="text-sm text-slate-200 font-medium">
                  "{currentItem.example}"
                </p>
                <p className="text-xs text-slate-400 dir-rtl font-sans text-right" dir="rtl">
                  {currentItem.exampleAr}
                </p>
              </div>

              <div className="flex justify-center">
                <AudioButton text={currentItem.example} size="md" />
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click to flip back to front</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md active:scale-95 transition-all"
        >
          <span>{currentIndex === vocabulary.length - 1 ? 'Finish Flashcards' : 'Next Word'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
