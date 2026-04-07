import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Brain, Sparkles, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { cn } from "../../lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import { useTranslation } from "react-i18next";

export const GeminiChatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial message or update it if it's the only one when language changes
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: t('chatbot.welcome') }]);
    } else if (messages.length === 1 && messages[0].role === 'model') {
      // If there's only one message and it's from the model, it's likely the welcome message
      setMessages([{ role: 'model', text: t('chatbot.welcome') }]);
    }
  }, [i18n.language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })).concat([{ role: 'user', parts: [{ text: userMessage }] }]),
        config: {
          systemInstruction: "You are Brainy, a friendly and encouraging AI tutor for children aged 3-10. Use simple words, emojis, and a very positive tone. Encourage curiosity and explain things in a fun, visual way. If asked about math, science, or nature, give simple examples.",
        }
      });

      const aiText = response.text || t('chatbot.fallback');
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: t('chatbot.error') }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[400px] max-w-[90vw]"
          >
            <Card className="flex flex-col h-[500px] p-0 overflow-hidden border-2 border-brand-blue/20 bg-white dark:bg-slate-900 dark:border-slate-800 transition-colors">
              {/* Header */}
              <div className="bg-brand-blue p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">{t('chatbot.name')}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs opacity-80">{t('chatbot.status')}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === 'user' ? "bg-brand-purple" : "bg-brand-blue"
                    )}>
                      {msg.role === 'user' ? <User className="text-white w-5 h-5" /> : <Brain className="text-white w-5 h-5" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm",
                      msg.role === 'user' ? "bg-brand-purple text-white rounded-tr-none" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none"
                    )}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
                      <Brain className="text-white w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chatbot.input_placeholder')}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 dark:text-white"
                />
                <Button size="sm" onClick={handleSend} disabled={!input.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-blue text-white p-4 rounded-[2rem] shadow-2xl shadow-blue-300 dark:shadow-none flex items-center gap-3 group"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="font-display font-bold pr-2">{t('chatbot.ask_btn')}</span>
      </motion.button>
    </div>
  );
};
