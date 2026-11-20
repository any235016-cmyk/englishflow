'use client';

import React, { useState } from 'react';
import { Volume2, Volume1, Turtle } from 'lucide-react';
import { speakText } from '@/lib/speech';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSlowToggle?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  size = 'md',
  className = '',
  showSlowToggle = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  const handlePlay = (e: React.MouseEvent, rate: number) => {
    e.stopPropagation();
    setIsPlaying(true);
    speakText(text, rate);

    // Approximate duration reset
    const estimatedTime = Math.max(1200, (text.length / 10) * 1000 * (1 / rate));
    setTimeout(() => {
      setIsPlaying(false);
    }, estimatedTime);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3.5 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        onClick={(e) => handlePlay(e, 1.0)}
        title="Listen normal speed (1.0x)"
        className={`rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 transition-all active:scale-95 flex items-center justify-center font-medium shadow-sm ${
          sizeClasses[size]
        } ${isPlaying && !isSlow ? 'ring-2 ring-emerald-500 scale-105' : ''} ${className}`}
      >
        <Volume2 className={`${iconSizes[size]} ${isPlaying && !isSlow ? 'animate-pulse' : ''}`} />
      </button>

      {showSlowToggle && (
        <button
          onClick={(e) => handlePlay(e, 0.65)}
          title="Listen slow speed (0.65x)"
          className={`rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-all active:scale-95 flex items-center gap-1 px-2 py-1 text-xs font-semibold ${
            isPlaying && isSlow ? 'ring-2 ring-teal-500' : ''
          }`}
        >
          <Turtle className="w-3.5 h-3.5" />
          <span>Slow</span>
        </button>
      )}
    </div>
  );
};
