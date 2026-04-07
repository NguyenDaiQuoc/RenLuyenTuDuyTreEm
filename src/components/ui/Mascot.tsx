import { motion } from "motion/react";
import { Brain } from "lucide-react";
import { cn } from "../../lib/utils";

interface MascotProps {
  expression?: 'happy' | 'thinking' | 'sad' | 'excited';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  speechBubble?: string;
}

export const Mascot = ({ expression = 'happy', size = 'md', className, speechBubble }: MascotProps) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-40 h-40",
    xl: "w-64 h-64",
  };

  const animations = {
    happy: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 2 } },
    thinking: { rotate: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 3 } },
    sad: { scale: [1, 0.95, 1], transition: { repeat: Infinity, duration: 4 } },
    excited: { scale: [1, 1.1, 1], y: [0, -20, 0], transition: { repeat: Infinity, duration: 0.5 } },
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <motion.div
        animate={animations[expression]}
        className={cn(
          "bg-brand-blue rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-200 relative",
          sizes[size]
        )}
      >
        <Brain className={cn("text-white", size === 'xl' ? "w-32 h-32" : size === 'lg' ? "w-20 h-20" : "w-12 h-12")} />
        
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/4 flex gap-4">
          <div className="w-2 h-2 bg-white rounded-full" />
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>

        {/* Smile/Expression */}
        <div className={cn(
          "absolute bottom-1/4 w-8 h-4 border-b-4 border-white rounded-full",
          expression === 'sad' && "rotate-180 mb-2"
        )} />
      </motion.div>

      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl shadow-xl border-2 border-slate-100 min-w-[200px] text-center"
        >
          <p className="font-display font-bold text-slate-700">{speechBubble}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-100 rotate-45" />
        </motion.div>
      )}
    </div>
  );
};
