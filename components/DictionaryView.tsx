'use client';

import React, { useState } from 'react';
import { Search, Filter, Volume2, Bookmark, Sparkles, BookOpen, RefreshCw } from 'lucide-react';
import { AudioButton } from './AudioButton';
import { getAllVocabulary } from '@/data/lessons';
import { VocabularyItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export const DictionaryView: React.FC = () => {
  const allVocabObj = getAllVocabulary();
  const allVocabList: VocabularyItem[] = Object.values(allVocabObj);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedBookmarked, setSavedBookmarked] = useState<string[]>([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const categories = ['All', 'Greetings', 'Personal Info', 'Polite Words', 'Numbers', 'Time', 'Food', 'Family', 'Places', 'Grammar', 'Ordering', 'Directions', 'Shopping', 'Hotel'];

  const filteredVocab = allVocabList.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.translation.includes(search) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (id: string) => {
    if (savedBookmarked.includes(id)) {
      setSavedBookmarked(savedBookmarked.filter((bId) => bId !== id));
    } else {
      setSavedBookmarked([...savedBookmarked, id]);
    }
  };

  const startWeakWordsQuiz = () => {
    setIsQuizMode(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswer(null);
  };

  const handleQuizChoice = (choice: string) => {
    if (quizAnswer) return;
    setQuizAnswer(choice);
    const currentQuizItem = allVocabList[quizIndex];
    if (choice === currentQuizItem.translation) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuizItem = () => {
    if (quizIndex < Math.min(10, allVocabList.length - 1)) {
      setQuizIndex((prev) => prev + 1);
      setQuizAnswer(null);
    } else {
      setIsQuizMode(false);
    }
  };

  if (isQuizMode) {
    const currentQuizItem = allVocabList[quizIndex];
    // Generate 3 wrong options
    const options = [currentQuizItem.translation];
    while (options.length < 4) {
      const randItem = allVocabList[Math.floor(Math.random() * allVocabList.length)];
      if (!options.includes(randItem.translation)) {
        options.push(randItem.translation);
      }
    }
    options.sort(() => Math.random() - 0.5);

    return (
      <div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
          <span>Vocabulary Quiz ({quizIndex + 1}/10)</span>
          <span className="text-emerald-500">Score: {quizScore}</span>
        </div>

        <div className="text-center space-y-3 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl">
          <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400">What does this word mean?</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">{currentQuizItem.word}</h2>
          <p className="font-mono text-xs text-emerald-500">{currentQuizItem.phonetic}</p>
          <AudioButton text={currentQuizItem.word} size="md" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {options.map((opt) => {
            const isCorrect = opt === currentQuizItem.translation;
            let style = 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

            if (quizAnswer) {
              if (isCorrect) {
                style = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold';
              } else if (opt === quizAnswer) {
                style = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-100 font-bold';
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleQuizChoice(opt)}
                disabled={!!quizAnswer}
                className={`p-4 rounded-2xl border-2 text-right dir-rtl font-semibold text-lg transition-all ${style}`}
                dir="rtl"
              >
                {opt}
              </button>
            );
          })}
        </div>

        {quizAnswer && (
          <button
            onClick={nextQuizItem}
            className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-2xl shadow-md hover:bg-emerald-600 transition-colors"
          >
            {quizIndex < 9 ? 'Next Word' : 'Finish Quiz'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-emerald-500" />
            <span>Vocabulary Dictionary & Hub</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse {allVocabList.length} beginner words with audio pronunciations and Arabic meanings.
          </p>
        </div>

        <button
          onClick={startWeakWordsQuiz}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm"
        >
          <Sparkles className="w-5 h-5" />
          <span>Practice Vocabulary Quiz</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words in English or Arabic (e.g., Hello, مرحباً, Coffee)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm shadow-sm"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocab.map((item) => {
          const isBookmarked = savedBookmarked.includes(item.id);
          return (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {item.word}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">{item.phonetic}</p>
                </div>

                <div className="flex items-center gap-1">
                  <AudioButton text={item.word} size="sm" />
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 dir-rtl text-right" dir="rtl">
                  {item.translation}
                </p>

                {item.example && (
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-0.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                    <p className="font-medium">"{item.example}"</p>
                    <p className="text-[11px] text-slate-500 dir-rtl text-right" dir="rtl">
                      {item.exampleAr}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
          No vocabulary words found matching your search.
        </div>
      )}
    </div>
  );
};
