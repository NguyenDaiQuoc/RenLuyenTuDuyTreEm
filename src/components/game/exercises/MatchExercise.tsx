import { useState, useEffect } from "react";
import { Button } from "../../ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useTranslation } from "react-i18next";

interface MatchPair {
  left: string;
  right: string;
}

interface MatchExerciseProps {
  gameData: {
    pairs: MatchPair[];
  };
  onCorrect: () => void;
  onIncorrect: () => void;
}

export const MatchExercise = ({
  gameData,
  onCorrect,
  onIncorrect,
}: MatchExerciseProps) => {
  const { t } = useTranslation();
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledLeft, setShuffledLeft] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);

  useEffect(() => {
    if (gameData?.pairs) {
      setShuffledLeft([...gameData.pairs.map(p => p.left)].sort(() => Math.random() - 0.5));
      setShuffledRight([...gameData.pairs.map(p => p.right)].sort(() => Math.random() - 0.5));
    }
  }, [gameData]);

  const handleLeftSelect = (item: string) => {
    if (matched.includes(item)) return;
    setLeftSelected(item);
    if (rightSelected) {
      checkMatch(item, rightSelected);
    }
  };

  const handleRightSelect = (item: string) => {
    if (matched.some(m => gameData.pairs.find(p => p.left === m)?.right === item)) return;
    setRightSelected(item);
    if (leftSelected) {
      checkMatch(leftSelected, item);
    }
  };

  const checkMatch = (left: string, right: string) => {
    const pair = gameData.pairs.find(p => p.left === left && p.right === right);
    if (pair) {
      setMatched(prev => [...prev, left]);
      setLeftSelected(null);
      setRightSelected(null);
      setIsCorrect(true);
      setTimeout(() => setIsCorrect(null), 1000);
      
      if (matched.length + 1 === gameData.pairs.length) {
        setTimeout(onCorrect, 1500);
      }
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setLeftSelected(null);
        setRightSelected(null);
        setIsCorrect(null);
        onIncorrect();
      }, 1000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          {shuffledLeft.map((item, index) => (
            <Button
              key={index}
              variant={leftSelected === item ? "primary" : matched.includes(item) ? "outline" : "outline"}
              onClick={() => handleLeftSelect(item)}
              disabled={matched.includes(item)}
              className={cn(
                "w-full h-16 text-lg rounded-2xl border-2 transition-all",
                matched.includes(item) && "opacity-50 border-green-500 bg-green-50",
                leftSelected === item && "scale-105 border-brand-blue"
              )}
            >
              {item}
              {matched.includes(item) && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {shuffledRight.map((item, index) => {
            const isMatched = matched.some(m => gameData.pairs.find(p => p.left === m)?.right === item);
            return (
              <Button
                key={index}
                variant={rightSelected === item ? "primary" : isMatched ? "outline" : "outline"}
                onClick={() => handleRightSelect(item)}
                disabled={isMatched}
                className={cn(
                  "w-full h-16 text-lg rounded-2xl border-2 transition-all",
                  isMatched && "opacity-50 border-green-500 bg-green-50",
                  rightSelected === item && "scale-105 border-brand-blue"
                )}
              >
                {item}
                {isMatched && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </Button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "p-4 rounded-2xl text-center font-bold",
              isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}
          >
            {isCorrect ? t('quiz.mascot_correct') : t('quiz.mascot_wrong')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
