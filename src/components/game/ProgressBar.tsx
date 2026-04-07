import { motion } from "motion/react";

interface ProgressBarProps {
  progress: number;
  color?: string;
  label?: string;
}

export const ProgressBar = ({ progress, color = "bg-brand-blue", label }: ProgressBarProps) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between text-sm font-display font-bold text-slate-600">
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
};

import { cn } from "../../lib/utils";
