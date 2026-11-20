'use client';

import React from 'react';
import Link from 'next/link';
import { UNITS_DATA } from '@/data/lessons';
import { UserProfile } from '@/types';
import { CheckCircle2, Play, Lock, BookOpen, Mic, Sparkles, Trophy, Flame, ArrowRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardRoadmapProps {
  profile: UserProfile;
}

export const DashboardRoadmap: React.FC<DashboardRoadmapProps> = ({ profile }) => {
  const firstUncompletedLesson = UNITS_DATA.flatMap((u) => u.lessons).find(
    (l) => !profile.completedLessons.includes(l.id)
  ) || UNITS_DATA[0].lessons[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-8 md:p-10 text-white shadow-2xl"
      >
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-100">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Beginner Level A1 – English Flow</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            Master English Step-by-Step! 🚀
          </h1>

          <p className="text-emerald-100 text-base md:text-lg font-medium leading-relaxed">
            Learn pronunciation, practice speaking with AI, master flashcards, and build real-world confidence in English.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <Link
              href={`/lessons?id=${firstUncompletedLesson.id}`}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-base shadow-xl active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-emerald-800" />
              <span>Start Learning Now ({firstUncompletedLesson.title})</span>
            </Link>

            <Link
              href="/conversation"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-base border border-white/20 transition-all"
            >
              <Mic className="w-5 h-5" />
              <span>Chat with AI Tutor</span>
            </Link>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Roadmap Title */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-7 h-7 text-emerald-500" />
          <span>Structured Learning Roadmap</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete units sequentially to earn XP points and build your daily learning streak.
        </p>
      </div>

      {/* Units Roadmap Path */}
      <div className="space-y-8 relative before:absolute before:left-6 md:before:left-8 before:top-8 before:bottom-8 before:w-1 before:bg-slate-200 dark:before:bg-slate-800">
        {UNITS_DATA.map((unit, unitIdx) => {
          const unitCompletedLessons = unit.lessons.filter((l) =>
            profile.completedLessons.includes(l.id)
          ).length;
          const isUnitUnlocked = unitIdx === 0 || UNITS_DATA[unitIdx - 1].lessons.every((l) => profile.completedLessons.includes(l.id));

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: unitIdx * 0.1 }}
              className="relative pl-14 md:pl-20 space-y-4"
            >
              {/* Unit Node Icon */}
              <div
                className={`absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg border-4 ${
                  isUnitUnlocked
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white border-white dark:border-slate-900'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-white dark:border-slate-900'
                }`}
              >
                {isUnitUnlocked ? unit.order : <Lock className="w-6 h-6" />}
              </div>

              {/* Unit Header Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Unit {unit.order}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
                      {unit.title}{' '}
                      <span className="text-slate-400 text-lg font-normal">
                        ({unit.titleAr})
                      </span>
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start md:self-auto">
                    {unitCompletedLessons} / {unit.lessons.length} Completed
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {unit.description} — <span className="dir-rtl font-semibold">{unit.descriptionAr}</span>
                </p>

                {/* Lessons List inside Unit */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {unit.lessons.map((lesson) => {
                    const isCompleted = profile.completedLessons.includes(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/lessons?id=${lesson.id}`}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                          isCompleted
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-400">Lesson {lesson.order}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                          ) : (
                            <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 dir-rtl" dir="rtl">
                            {lesson.titleAr}
                          </p>
                        </div>

                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
