import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";
import { playSound } from "../../utils/sounds";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playSound('click');
      if (onClick) onClick(e);
    };
    const variants = {
      primary: "bg-brand-blue text-white hover:bg-blue-600 shadow-blue-200",
      secondary: "bg-brand-purple text-white hover:bg-purple-600 shadow-purple-200",
      outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-200",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-xl",
      md: "px-6 py-3 text-base rounded-2xl",
      lg: "px-8 py-4 text-lg rounded-3xl",
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "btn-playful font-display font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
