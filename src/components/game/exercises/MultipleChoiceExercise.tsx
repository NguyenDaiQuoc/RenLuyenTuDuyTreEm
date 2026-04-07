import { useState } from "react";
import { Button } from "../../ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useTranslation } from "react-i18next";

interface MultipleChoiceExerciseProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export const MultipleChoiceExercise = ({
  question,
  options,
  correctAnswer,
  explanation,
  onCorrect,
  onIncorrect,
}: MultipleChoiceExerciseProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === correctAnswer;
    setIsCorrect(correct);
    
    setTimeout(() => {
      if (correct) onCorrect();
      else onIncorrect();
      setSelected(null);
      setIsCorrect(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selected === option ? (isCorrect ? "primary" : "danger") : "outline"}
            onClick={() => handleSelect(option)}
            className={cn(
              "h-20 text-xl rounded-3xl border-4 transition-all",
              selected === option && "scale-105",
              selected && selected !== option && "opacity-50 grayscale"
            )}
          >
            {option}
            {selected === option && (
              isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
            )}
          </Button>
        ))}
      </div>

      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "p-4 rounded-2xl text-center font-display font-bold text-lg",
              isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}
          >
            {isCorrect ? (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                <span>{t('quiz.mascot_correct')}</span>
              </div>
            ) : (
              <span>{t('quiz.mascot_wrong')}</span>
            )}
            {explanation && !isCorrect && (
              <p className="text-sm font-normal mt-2 opacity-80">{explanation}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
