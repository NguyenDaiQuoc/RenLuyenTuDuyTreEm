import { useState } from "react";
import { Exercise } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Lightbulb, Sparkles } from "lucide-react";
import { playSound } from "../../utils/sounds";
import { useTranslation } from "react-i18next";

interface ExerciseRendererProps {
  exercise: Exercise;
  onComplete: (isCorrect: boolean) => void;
}

export const ExerciseRenderer = ({ exercise, onComplete }: ExerciseRendererProps) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionSelect = (option: string) => {
    if (isCorrect !== null) return;
    
    setSelectedOption(option);
    const correct = option === exercise.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      onComplete(correct);
    }, 3000);
  };

  return (
    <Card className="p-8 space-y-8 max-w-2xl mx-auto border-b-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-blue/10 p-3 rounded-2xl">
            <Sparkles className="w-6 h-6 text-brand-blue" />
          </div>
          <div>
            <span className="text-xs font-black text-brand-blue uppercase tracking-wider">{exercise.type}</span>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-3 h-1.5 rounded-full",
                    i < exercise.difficulty ? "bg-brand-yellow" : "bg-slate-200 dark:bg-slate-700"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>
        <div className="text-brand-purple font-black text-xl">+{exercise.xpReward} XP</div>
      </div>

      <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
        {exercise.question}
      </h2>

      {exercise.imageUrl && (
        <img 
          src={exercise.imageUrl} 
          alt="Exercise" 
          className="w-full h-48 object-cover rounded-3xl border-4 border-slate-100 dark:border-slate-800"
          referrerPolicy="no-referrer"
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        {exercise.options?.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: isCorrect === null ? 1.02 : 1 }}
            whileTap={{ scale: isCorrect === null ? 0.98 : 1 }}
            onClick={() => handleOptionSelect(option)}
            disabled={isCorrect !== null}
            className={cn(
              "p-6 rounded-3xl text-left font-bold text-xl border-2 transition-all relative overflow-hidden",
              isCorrect === null 
                ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-blue hover:bg-brand-blue/5"
                : option === exercise.answer
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                  : option === selectedOption
                    ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50"
            )}
          >
            <div className="flex items-center justify-between relative z-10">
              <span>{option}</span>
              {isCorrect !== null && option === exercise.answer && <CheckCircle2 className="w-6 h-6" />}
              {isCorrect !== null && option === selectedOption && option !== exercise.answer && <XCircle className="w-6 h-6" />}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-brand-yellow/10 rounded-3xl border-2 border-brand-yellow/20 space-y-2"
          >
            <div className="flex items-center gap-2 text-brand-yellow-dark font-black uppercase text-sm">
              <Lightbulb className="w-4 h-4" />
              {t('common.explanation')}
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {exercise.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

import { cn } from "../../lib/utils";
