'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Volume2, ChevronDown, ChevronUp, Sparkles, MessageSquare, Coffee, Compass, ShoppingBag, User } from 'lucide-react';
import { AudioButton } from './AudioButton';
import { ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const SCENARIOS = [
  { id: 'sc1', name: 'At a Cafe', icon: Coffee, desc: 'Order drinks and snacks' },
  { id: 'sc2', name: 'Asking Directions', icon: Compass, desc: 'Find places around town' },
  { id: 'sc3', name: 'Shopping', icon: ShoppingBag, desc: 'Buy clothes and ask prices' },
];

export const AITutorChat: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openTips, setOpenTips] = useState<Record<number, boolean>>({});
  const [openTrans, setOpenTrans] = useState<Record<number, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when scenario changes
  useEffect(() => {
    let initialGreeting: ChatMessage = {
      role: 'assistant',
      content: "Hello! Welcome to Sunshine Cafe. What can I get for you today?",
      translation: "مرحباً! أهلاً بك في مقهى صنشاين. ماذا تود أن أقدم لك اليوم؟",
      grammarTip: "Use 'What can I get for you?' when offering service in a restaurant or cafe.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (selectedScenario === 'sc2') {
      initialGreeting = {
        role: 'assistant',
        content: "Hello! You look lost. Can I help you find somewhere in town?",
        translation: "مرحباً! تبدو تائهاً. هل أستطيع مساعدتك في العثور على مكان ما في المدينة؟",
        grammarTip: "'Look lost' means appearing unfamiliar with your surroundings.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } else if (selectedScenario === 'sc3') {
      initialGreeting = {
        role: 'assistant',
        content: "Hi there! Welcome to our clothing shop. Looking for jackets or shirts today?",
        translation: "أهلاً بك! مرحباً في متجر الملابس الخاص بنا. هل تبحث عن سترات أو قمصان اليوم؟",
        grammarTip: "'Looking for' means searching to find something.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    setMessages([initialGreeting]);
  }, [selectedScenario]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleTip = (idx: number) => {
    setOpenTips((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleTrans = (idx: number) => {
    setOpenTrans((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          scenarioId: selectedScenario,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        translation: data.translation,
        grammarTip: data.grammarTip,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get response:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentLastAiMsg = messages.filter((m) => m.role === 'assistant').pop();

  return (
    <div className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Scenario Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            AI Conversation Tutor
          </span>
        </div>

        {/* Scenario Selector */}
        <div className="flex gap-2">
          {SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            const isSelected = selectedScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] p-4 rounded-3xl space-y-3 ${
                  isUser
                    ? 'bg-emerald-500 text-white rounded-br-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Main Content */}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-medium leading-relaxed">{msg.content}</p>
                  {!isUser && <AudioButton text={msg.content} size="sm" showSlowToggle={false} />}
                </div>

                {/* Assistant Enhancements: Translation & Grammar Tips */}
                {!isUser && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                    {/* Collapsible Translation */}
                    {msg.translation && (
                      <div>
                        <button
                          onClick={() => toggleTrans(index)}
                          className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <span>{openTrans[index] ? 'Hide Arabic Translation' : 'Show Arabic Translation'}</span>
                          {openTrans[index] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <AnimatePresence>
                          {openTrans[index] && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs font-semibold text-slate-700 dark:text-slate-300 dir-rtl mt-1 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl"
                              dir="rtl"
                            >
                              {msg.translation}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Collapsible Grammar Tip */}
                    {msg.grammarTip && (
                      <div>
                        <button
                          onClick={() => toggleTip(index)}
                          className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          <span>{openTips[index] ? 'Hide Grammar Note' : 'Grammar Note / Tip'}</span>
                          {openTips[index] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <AnimatePresence>
                          {openTips[index] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-slate-600 dark:text-slate-400 mt-1 bg-indigo-50/60 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40"
                            >
                              💡 {msg.grammarTip}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[10px] text-right ${isUser ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>AI Tutor is typing...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Reply Chips */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-2">
        <span className="text-xs font-bold text-slate-400 self-center shrink-0">Quick Reply:</span>
        <button
          onClick={() => handleSendMessage("I would like a coffee, please.")}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors shrink-0"
        >
          ☕ "I would like a coffee, please."
        </button>
        <button
          onClick={() => handleSendMessage("How much does this cost?")}
          className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors shrink-0"
        >
          💵 "How much does this cost?"
        </button>
        <button
          onClick={() => handleSendMessage("Where is the nearest bank?")}
          className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors shrink-0"
        >
          📍 "Where is the nearest bank?"
        </button>
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message in English..."
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
