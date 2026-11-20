'use client';

import React, { useState } from 'react';
import { Exercise } from '@/types';
import { CheckCircle2, XCircle, Sparkles, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { AudioButton } from './AudioButton';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseEngineProps {
  exercises: Exercise[];
  onCompleteLesson: (xpEarned: number) => void;
}

export const ExerciseEngine: React.FC<ExerciseEngineProps> = ({
  exercises,
  onCompleteLesson,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentEx = exercises[currentIndex];

  // Initialize available words for build-sentence
  React.useEffect(() => {
    if (currentEx && currentEx.type === 'build-sentence' && currentEx.sentenceWords) {
      // Shuffle words
      const shuffled = [...currentEx.sentenceWords].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setBuiltSentence([]);
    }
    setIsAnswered(false);
    setSelectedOption(null);
  }, [currentIndex, currentEx]);

  if (!exercises || exercises.length === 0) {
    return <div className="p-6 text-center text-slate-500">No exercises found for this lesson.</div>;
  }

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
  };

  const handleWordClick = (word: string, index: number) => {
    if (isAnswered) return;
    setBuiltSentence([...builtSentence, word]);
    const nextAvailable = [...availableWords];
    nextAvailable.splice(index, 1);
    setAvailableWords(nextAvailable);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isAnswered) return;
    const nextBuilt = [...builtSentence];
    nextBuilt.splice(index, 1);
    setBuiltSentence(nextBuilt);
    setAvailableWords([...availableWords, word]);
  };

  const handleCheckAnswer = () => {
    let userAns = '';
    if (currentEx.type === 'build-sentence') {
      userAns = builtSentence.join(' ');
    } else {
      userAns = selectedOption || '';
    }

    if (!userAns) return;

    const correct = userAns.trim().toLowerCase() === currentEx.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      const totalXp = (score + (isCorrect ? 1 : 0)) * 15 + 20;
      onCompleteLesson(totalXp);
    }
  };

  if (isFinished) {
    const finalScore = score;
    const totalXp = finalScore * 15 + 20;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-500 shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Lesson Completed! 🎉
        </h2>

        <p className="text-slate-600 dark:text-slate-400 font-medium">
          You scored <strong className="text-emerald-500">{finalScore}</strong> out of{' '}
          <strong>{exercises.length}</strong> questions correct.
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-emerald-500" />
          <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
            +{totalXp} XP Earned!
          </span>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Continue to Next Lesson
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Progress Header */}
      <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>Question {currentIndex + 1} of {exercises.length}</span>
        <span className="text-emerald-500">{currentEx.type.replace('-', ' ').toUpperCase()}</span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
        />
      </div>

      {/* Question Header */}
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {currentEx.question}
        </h3>
        {currentEx.questionAr && (
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 dir-rtl" dir="rtl">
            {currentEx.questionAr}
          </p>
        )}
      </div>

      {/* Multiple Choice / Fill Blank Options */}
      {(currentEx.type === 'multiple-choice' || currentEx.type === 'fill-blank') && currentEx.options && (
        <div className="grid grid-cols-1 gap-3">
          {currentEx.options.map((option) => {
            const isSelected = selectedOption === option;
            let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200';

            if (isAnswered) {
              if (option === currentEx.correctAnswer) {
                btnStyle = 'bg-emerald-100 border-emerald-500 dark:bg-emerald-950 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-100 border-rose-500 dark:bg-rose-950 dark:border-rose-500 text-rose-900 dark:text-rose-100 font-bold';
              }
            } else if (isSelected) {
              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold ring-2 ring-emerald-500/20';
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-medium text-base flex justify-between items-center ${btnStyle}`}
              >
                <span>{option}</span>
                <AudioButton text={option} size="sm" showSlowToggle={false} />
              </button>
            );
          })}
        </div>
      )}

      {/* Build Sentence Word Bank */}
      {currentEx.type === 'build-sentence' && (
        <div className="space-y-6">
          {/* Answer Drop Area */}
          <div className="min-h-[70px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap gap-2 items-center">
            {builtSentence.length === 0 && (
              <span className="text-xs text-slate-400 font-medium">Click words below to build your sentence...</span>
            )}
            {builtSentence.map((word, idx) => (
              <motion.button
                layout
                key={`${word}-${idx}`}
                onClick={() => handleRemoveWord(word, idx)}
                disabled={isAnswered}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-sm hover:bg-emerald-600 transition-colors"
              >
                {word}
              </motion.button>
            ))}
          </div>

          {/* Available Word Bank */}
          <div className="flex flex-wrap gap-2 justify-center">
            {availableWords.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                onClick={() => handleWordClick(word, idx)}
                disabled={isAnswered}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Explanation Banner when answered */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-5 rounded-2xl border ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            } space-y-2`}
          >
            <div className="flex items-center gap-2 font-bold text-lg">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span>Correct! Great job!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-500" />
                  <span>Not quite right</span>
                </>
              )}
            </div>

            <p className="text-sm font-medium">{currentEx.explanation}</p>
            {currentEx.explanationAr && (
              <p className="text-xs text-slate-600 dark:text-slate-400 dir-rtl" dir="rtl">
                {currentEx.explanationAr}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Footer */}
      <div className="pt-2">
        {!isAnswered ? (
          <button
            onClick={handleCheckAnswer}
            disabled={
              currentEx.type === 'build-sentence'
                ? builtSentence.length === 0
                : !selectedOption
            }
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-base rounded-2xl shadow-lg transition-all active:scale-98"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>{currentIndex < exercises.length - 1 ? 'Next Question' : 'Complete Lesson'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
