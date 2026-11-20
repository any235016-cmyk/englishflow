'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Mic, MessageSquareText, BookMarked, Home, Moon, Sun, Flame, Trophy, Award } from 'lucide-react';
import { UserProfile } from '@/types';

interface NavbarProps {
  profile: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, darkMode, onToggleDarkMode }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Learn', icon: Home },
    { href: '/lessons', label: 'Lessons', icon: BookOpen },
    { href: '/speaking', label: 'Speaking', icon: Mic },
    { href: '/conversation', label: 'AI Tutor', icon: MessageSquareText },
    { href: '/dictionary', label: 'Dictionary', icon: BookMarked },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 justify-between h-screen sticky top-0">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
              EN
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-none">EnglishFlow</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Learn English for Beginners</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-500' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User stats widget at bottom of sidebar */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Daily Streak</span>
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500" /> {profile.streak} Days
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Total XP</span>
              <span className="flex items-center gap-1 font-bold text-emerald-500">
                <Trophy className="w-4 h-4 text-emerald-500" /> {profile.xp} XP
              </span>
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 px-2 py-2 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
