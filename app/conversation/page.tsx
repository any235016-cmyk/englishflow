'use client';

import React from 'react';
import { AITutorChat } from '@/components/AITutorChat';
import { Mic, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConversationPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 h-[90vh]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-6"
      >
        <MessageSquare className="w-7 h-7" />
        <h1 className="text-2xl font-extrabold">AI Conversation Tutor</h1>
      </motion.div>

      <AITutorChat />
    </div>
  );
}