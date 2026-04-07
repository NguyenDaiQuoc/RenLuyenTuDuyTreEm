import { useState } from "react";
import { Card } from "../ui/Card";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import { MultipleChoiceExercise } from "./exercises/MultipleChoiceExercise";
import { DragDropExercise } from "./exercises/DragDropExercise";
import { MatchExercise } from "./exercises/MatchExercise";
import { Stage } from "../../types";

interface QuizCardProps {
  stage: Stage;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export const QuizCard = ({ stage, onCorrect, onIncorrect }: QuizCardProps) => {
  const { t } = useTranslation();

  const renderExercise = () => {
    switch (stage.interactionType) {
      case "drag-drop":
        return (
          <DragDropExercise
            options={stage.options}
            correctAnswer={stage.correctAnswer}
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
          />
        );
      case "match":
        return (
          <MatchExercise
            gameData={stage.gameData}
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
          />
        );
      case "puzzle":
        // For prototype, puzzle can be a specialized multiple choice or a logic grid
        // We'll use MultipleChoice for now but with a "puzzle" styling
        return (
          <MultipleChoiceExercise
            question={stage.question}
            options={stage.options}
            correctAnswer={stage.correctAnswer}
            explanation={stage.explanation}
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
          />
        );
      case "multiple-choice":
      default:
        return (
          <MultipleChoiceExercise
            question={stage.question}
            options={stage.options}
            correctAnswer={stage.correctAnswer}
            explanation={stage.explanation}
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
          />
        );
    }
  };

  return (
    <Card className="max-w-3xl w-full mx-auto p-8 border-b-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all">
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-black uppercase tracking-widest mb-2">
            {stage.type.replace('-', ' ')}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight">
            {stage.question}
          </h2>
          {stage.imageUrl && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700"
            >
              <img 
                src={stage.imageUrl} 
                alt="Question" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </div>

        <div className="relative">
          {renderExercise()}
        </div>
      </div>
    </Card>
  );
};
