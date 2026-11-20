'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle, AlertCircle, RefreshCw, Send } from 'lucide-react';
import { AudioButton } from './AudioButton';
import { calculateAccuracy } from '@/lib/speech';
import { motion, AnimatePresence } from 'framer-motion';

interface PronunciationTrainerProps {
  targetPhrase: string;
  targetTranslation: string;
  onSuccess?: (accuracy: number) => void;
}

export const PronunciationTrainer: React.FC<PronunciationTrainerProps> = ({
  targetPhrase,
  targetTranslation,
  onSuccess,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    wordDetails: { word: string; matched: boolean }[];
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check SpeechRecognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setMicPermissionDenied(true);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  // When transcript changes, evaluate match if stopped
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      const acc = calculateAccuracy(targetPhrase, transcript);
      setResult(acc);
      if (acc.score >= 60 && onSuccess) {
        onSuccess(acc.score);
      }
    }
  }, [isListening, transcript, targetPhrase, onSuccess]);

  const startListening = () => {
    setResult(null);
    setTranscript('');
    setMicPermissionDenied(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Could not start recognition:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleManualCheck = () => {
    if (!manualInput.trim()) return;
    setTranscript(manualInput);
    const acc = calculateAccuracy(targetPhrase, manualInput);
    setResult(acc);
    if (acc.score >= 60 && onSuccess) {
      onSuccess(acc.score);
    }
  };

  const resetPractice = () => {
    setResult(null);
    setTranscript('');
    setManualInput('');
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Target Phrase Header */}
      <div className="text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
          Speak This Phrase
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          "{targetPhrase}"
        </h3>
        <p className="text-base font-semibold text-slate-600 dark:text-slate-300 dir-rtl" dir="rtl">
          {targetTranslation}
        </p>

        <div className="pt-2 flex justify-center">
          <AudioButton text={targetPhrase} size="lg" />
        </div>
      </div>

      {/* Record Controls */}
      <div className="flex flex-col items-center space-y-4">
        {isSpeechSupported && !micPermissionDenied ? (
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isListening
                  ? 'bg-rose-500 text-white ring-8 ring-rose-200 dark:ring-rose-950 scale-110'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-8 h-8 animate-pulse" />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full border-4 border-rose-300 opacity-60"
                  />
                </>
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isListening ? 'Listening... Speak clearly now!' : 'Click Mic & Speak'}
            </span>
          </div>
        ) : (
          <div className="w-full bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Microphone not available or allowed</span>
            </div>
            <p>You can type your spoken attempt below to test your pronunciation match!</p>
          </div>
        )}

        {/* Live Interim Transcript */}
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-center font-medium text-slate-700 dark:text-slate-300 text-lg border border-slate-200 dark:border-slate-700"
          >
            "{transcript}"
          </motion.div>
        )}

        {/* Fallback Manual Typing */}
        {(!isSpeechSupported || micPermissionDenied) && (
          <div className="flex gap-2 w-full mt-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Type what you said (e.g. Hello how are you)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <button
              onClick={handleManualCheck}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              <span>Check</span>
            </button>
          </div>
        )}
      </div>

      {/* Result & Score Feedback */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-6 rounded-2xl border ${
              result.score >= 80
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                : result.score >= 50
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
            } space-y-4 text-center`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {result.score}% Accuracy
              </span>
              {result.score >= 70 && (
                <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> +20 XP
                </span>
              )}
            </div>

            {/* Highlighted Words */}
            <div className="flex flex-wrap justify-center gap-2 py-2">
              {result.wordDetails.map((item, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm ${
                    item.matched
                      ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100'
                      : 'bg-rose-200 text-rose-900 dark:bg-rose-800 dark:text-rose-100 line-through'
                  }`}
                >
                  {item.word}
                </span>
              ))}
            </div>

            {/* Encouraging Tip */}
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {result.score >= 80
                ? '🎉 Excellent pronunciation! Clear and accurate!'
                : result.score >= 50
                ? '👍 Good attempt! Try speaking a bit slower for higher accuracy.'
                : '💪 Keep trying! Listen to the audio again and repeat after it.'}
            </p>

            <button
              onClick={resetPractice}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
