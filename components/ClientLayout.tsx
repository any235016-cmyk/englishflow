'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { StatBar } from './StatBar';
import { userProfileStore } from '@/lib/store';
import { UserProfile } from '@/types';
import { UNITS_DATA } from '@/data/lessons';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(userProfileStore.get());
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadedProfile = userProfileStore.get();
    setProfile(loadedProfile);

    // Dark mode check
    if (typeof window !== 'undefined') {
      const isDark =
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const totalLessonsCount = UNITS_DATA.reduce((acc, u) => acc + u.lessons.length, 0);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Navbar profile={profile} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <StatBar
          profile={profile}
          completedLessonsCount={profile.completedLessons.length}
          totalLessonsCount={totalLessonsCount}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
