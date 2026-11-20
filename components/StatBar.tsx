'use client';

import React from 'react';
import { Flame, Trophy, BookOpen, Award } from 'lucide-react';
import { UserProfile } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface StatBarProps {
  profile: UserProfile;
  completedLessonsCount: number;
  totalLessonsCount: number;
}

export const StatBar: React.FC<StatBarProps> = ({ profile, completedLessonsCount, totalLessonsCount }) => {
  const progressPercent = totalLessonsCount > 0 ? (completedLessonsCount / totalLessonsCount) * 100 : 0;

  const stats = [
    {
      icon: Flame,
      label: 'Streak',
      value: `${profile.streak} Days`,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      iconBg: 'bg-amber-500',
    },
    {
      icon: Trophy,
      label: 'Total XP',
      value: `${profile.xp}`,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconBg: 'bg-emerald-500',
    },
    {
      icon: BookOpen,
      label: 'XP Progress',
      value: `${completedLessonsCount}/${totalLessonsCount}`,
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      iconBg: 'bg-teal-500',
    },
    {
      icon: Award,
      label: 'Progress',
      value: `${Math.round(progressPercent)}%`,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      iconBg: 'bg-indigo-500',
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl ${stat.bg} p-4 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{stat.label}</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={stat.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100"
                  >
                    {stat.value}
                  </motion.div>
                </AnimatePresence>

                {stat.label === 'Progress' && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative"
                      >
                        <motion.div
                          animate={{ x: ['0%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
