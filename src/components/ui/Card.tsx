import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export const Card = ({ children, className, hover = true, delay = 0 }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass rounded-[2rem] p-6",
        hover && "hover:shadow-2xl transition-shadow duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
