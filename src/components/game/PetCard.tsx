import { motion } from "motion/react";
import { Card } from "../ui/Card";
import { ProgressBar } from "../game/ProgressBar";
import { Heart, Star, Zap, Sparkles } from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

export const PetCard = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();

  if (!user || !user.pet) return null;

  const pet = user.pet;
  const xpToNext = pet.level * 100;
  const progress = (pet.xp / xpToNext) * 100;

  const petIcons = {
    dragon: "🐲",
    unicorn: "🦄",
    robot: "🤖"
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-brand-blue to-blue-600 text-white border-none shadow-xl shadow-blue-200 dark:shadow-none overflow-hidden relative group">
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black flex items-center gap-2">
              {pet.name}
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-bold uppercase tracking-widest">LVL {pet.level}</span>
            </h3>
            <p className="text-blue-100 font-bold text-sm uppercase tracking-widest">{pet.type}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
        </div>

        <div className="flex justify-center py-4">
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl filter drop-shadow-2xl"
          >
            {petIcons[pet.type]}
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-black uppercase tracking-wider">
            <span>Growth Progress</span>
            <span>{pet.xp} / {xpToNext} XP</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-[0_0_10px_rgba(253,224,71,0.5)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-white/10 p-3 rounded-2xl text-center space-y-1 backdrop-blur-sm border border-white/5">
            <Heart className="w-4 h-4 mx-auto text-red-300" />
            <div className="text-xs font-black uppercase tracking-widest">Happy</div>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl text-center space-y-1 backdrop-blur-sm border border-white/5">
            <Zap className="w-4 h-4 mx-auto text-yellow-300" />
            <div className="text-xs font-black uppercase tracking-widest">Active</div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
    </Card>
  );
};
