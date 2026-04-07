import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Mascot } from "../components/ui/Mascot";
import { generateAIExercises } from "../services/aiService";
import { useTranslation } from "react-i18next";
import { Sparkles, Brain, Rocket, ArrowRight, Loader2, CheckCircle2, Star } from "lucide-react";
import { cn } from "../lib/utils";
import { Exercise } from "../types";

export const AIGenerator = () => {
  const { t, i18n } = useTranslation();
  
  // Ensure i18n is initialized
  const isI18nReady = i18n.isInitialized;
  const [age, setAge] = useState(7);
  const [subject, setSubject] = useState("math");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentStep, setCurrentStep] = useState<'setup' | 'generating' | 'results'>('setup');

  const subjects = [
    { id: 'math', label: t('ai_generator.subject_math'), icon: <Brain className="w-6 h-6" /> },
    { id: 'science', label: t('ai_generator.subject_science'), icon: <Sparkles className="w-6 h-6" /> },
    { id: 'logic', label: t('ai_generator.subject_logic'), icon: <Rocket className="w-6 h-6" /> },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setCurrentStep('generating');
    try {
      const result = await generateAIExercises(age, subject, difficulty as any);
      setExercises(result);
      setCurrentStep('results');
    } catch (error) {
      console.error("Failed to generate exercises:", error);
      setCurrentStep('setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <AnimatePresence mode="wait">
        {currentStep === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <Mascot size="md" expression="happy" speechBubble={t('ai_generator.mascot_setup')} />
              <h1 className="text-5xl font-black dark:text-white">{t('ai_generator.title')}</h1>
            </div>

            <Card className="p-8 space-y-8 bg-white dark:bg-slate-900 border-b-8 border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <label className="text-lg font-black dark:text-white">{t('ai_generator.age_label')}</label>
                <div className="flex flex-wrap gap-3">
                  {[5, 6, 7, 8, 9, 10, 11, 12].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAge(a)}
                      className={cn(
                        "px-6 py-3 rounded-2xl font-black transition-all",
                        age === a 
                          ? "bg-brand-blue text-white scale-110 shadow-lg" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-black dark:text-white">{t('ai_generator.subject_label')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSubject(s.id)}
                      className={cn(
                        "p-6 rounded-3xl font-black flex flex-col items-center gap-3 transition-all border-4",
                        subject === s.id 
                          ? "border-brand-purple bg-brand-purple/10 text-brand-purple scale-105" 
                          : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {s.icon}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-black dark:text-white">{t('ai_generator.difficulty_label')}</label>
                <div className="flex gap-4">
                  {['easy', 'medium', 'hard'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 py-4 rounded-2xl font-black capitalize transition-all",
                        difficulty === d 
                          ? "bg-brand-yellow text-white shadow-lg" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {t(`ai_generator.diff_${d}`)}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full py-8 text-2xl rounded-[2rem] bg-brand-blue hover:bg-blue-600"
                onClick={handleGenerate}
              >
                {t('ai_generator.generate_button')}
                <Sparkles className="ml-2 w-6 h-6" />
              </Button>
            </Card>
          </motion.div>
        )}

        {currentStep === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-8 border-brand-blue border-t-transparent rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-brand-yellow animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black dark:text-white">{t('ai_generator.generating')}</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400">{t('ai_generator.generating_subtitle')}</p>
            </div>
          </motion.div>
        )}

        {currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black dark:text-white">{t('ai_generator.results_title')}</h2>
              <Button variant="outline" onClick={() => setCurrentStep('setup')}>
                {t('ai_generator.try_again')}
              </Button>
            </div>

            <div className="space-y-6">
              {exercises.map((ex, idx) => (
                <Card key={idx} className="p-8 bg-white dark:bg-slate-900 border-b-8 border-slate-200 dark:border-slate-800">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-black flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="space-y-6 flex-1">
                      <p className="text-2xl font-bold dark:text-white leading-relaxed">{ex.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ex.options?.map((opt, oIdx) => (
                          <div 
                            key={oIdx}
                            className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center"
                          >
                            {opt}
                            {opt === ex.answer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-500 dark:text-slate-400 italic">
                        <strong>{t('ai_generator.explanation')}:</strong> {ex.explanation}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button size="lg" className="w-full py-8 text-2xl rounded-[2rem]">
              {t('ai_generator.play_btn')}
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
